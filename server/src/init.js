import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import boardRoutes from "./routes/board.js";

dotenv.config();

const app = express();
app.use(express.json());

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/api/user", userRoutes);
app.use("/api/board", boardRoutes);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
