// board.js
import express from "express";
import { getFirestore } from "firebase-admin/firestore";

const router = express.Router();
const db = getFirestore();

// GET /api/board/:id
router.get("/:id", async (req, res) => {
  try {
    const boardId = req.params.id;
    const boardRef = db.collection("Boards").doc(boardId);
    const boardSnap = await boardRef.get();

    if (!boardSnap.exists) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.json({ id: boardSnap.id, ...boardSnap.data() });
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
