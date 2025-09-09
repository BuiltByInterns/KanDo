import "dotenv/config";
import express from "express";
import { db } from "../firebase.js";
import admin from "firebase-admin";
import { algoliasearch } from "algoliasearch";

const router = express.Router();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY
);
const boardIndexName = "boards";

// GET /api/user/boards?userId=123
router.get("/boards", async (req, res) => {
  console.log("Received request for user boards with query:", req.query);
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const userRef = db.collection("Users").doc(userId);
    const userSnap = await userRef.get();
    let ownedBoardIds = [];

    if (userSnap.exists) {
      ownedBoardIds = userSnap.data().Boards || [];
    }

    let owned = [];
    if (ownedBoardIds.length > 0) {
      const filterString = ownedBoardIds
        .map((id) => `objectID:${id}`)
        .join(" OR ");
      const ownedRes = await client.search([
        {
          indexName: boardIndexName,
          query: "",
          filters: filterString,
          hitsPerPage: ownedBoardIds.length,
        },
      ]);
      owned = ownedRes.results[0].hits;
    }

    let pinned = userSnap.exists ? userSnap.data().PinnedBoards || [] : [];

    const sharedRes = await client.search([
      {
        indexName: boardIndexName,
        query: "",
        filters: `members:${userId} AND NOT ownerId:${userId}`,
        hitsPerPage: 50,
      },
    ]);

    const shared = sharedRes.results[0].hits;

    res.json({
      owned,
      shared,
      pinned,
    });
  } catch (err) {
    console.error("Error fetching boards:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/user/pinBoard?userId=123&boardId=456
router.get("/pinBoard", async (req, res) => {
  console.log("Received request for pinBoard with query:", req.query);
  try {
    const { userId, boardId } = req.query;

    const userRef = db.collection("Users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const pinnedBoards = userSnap.data().PinnedBoards || [];
    const isPinned = pinnedBoards.includes(boardId);

    if (!isPinned) {
      await userRef.update({
        PinnedBoards: admin.firestore.FieldValue.arrayUnion(boardId),
      });
      res.json({ message: "Board pinned", pinned: true });
    } else {
      await userRef.update({
        PinnedBoards: admin.firestore.FieldValue.arrayRemove(boardId),
      });
      res.json({ message: "Board unpinned", pinned: false });
    }
  } catch (err) {
    console.error("Error pinning board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/user/createBoard
router.post("/createBoard", async (req, res) => {
  console.log("Received request for createBoard with body:", req.body);
  try {
    const { userId, title, privacy, background } = req.body;
    if (!userId || !title || !privacy || !background) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalisedName = title.trim().substring(0, 50);
    const urlName = normalisedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);

    const newBoardData = {
      name: normalisedName,
      urlName: urlName,
      createdAt: new Date(),
      ownerId: userId,
      privacy: privacy,
      members: [userId],
      background: background,
    };

    const newBoardDoc = await db.collection("Boards").add(newBoardData);

    const userRef = db.collection("Users").doc(userId);
    await userRef.set(
      {
        Boards: admin.firestore.FieldValue.arrayUnion(newBoardDoc.id),
      },
      { merge: true }
    );

    await client.saveObjects({
      indexName: boardIndexName,
      objects: [
        {
          objectID: newBoardDoc.id, // required
          ...newBoardData,
        },
      ],
    });

    res.json({ boardId: newBoardDoc.id });
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
