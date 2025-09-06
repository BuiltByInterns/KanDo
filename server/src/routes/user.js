import express from "express";
import { db } from "../firebase.js";
import admin from "firebase-admin";

const router = express.Router();

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

    if (!userSnap.exists) {
      return res.json([]);
    }

    res.json(userSnap.data().Boards || []);
  } catch (err) {
    console.error("Error fetching boards:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/user/createBoard?userId=123&title=NewBoard
router.get("/createBoard", async (req, res) => {
  console.log("Received request for createBoard with query:", req.query);
  try {
    const { userId, title } = req.query;
    if (!userId || !title) {
      return res.status(400).json({ error: "Missing userId or title" });
    }

    const normalisedName = title.trim().substring(0, 50);
    const urlName = normalisedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);

    const newBoardRef = db.collection("Boards");
    const newBoardData = {
      name: normalisedName,
      urlName: urlName,
      createdAt: new Date(),
      ownerId: userId,
      privacy: "private",
      members: [userId],
      pinned: false,
    };
    const newBoardDoc = await newBoardRef.add(newBoardData);

    const userRef = db.collection("Users").doc(userId);
    await userRef.set(
      {
        Boards: admin.firestore.FieldValue.arrayUnion(newBoardDoc.id),
      },
      { merge: true }
    );

    res.json({ boardId: newBoardDoc.id });
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
