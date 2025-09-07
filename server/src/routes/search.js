import "dotenv/config";
import express from "express";
import { algoliasearch } from "algoliasearch";

const router = express.Router();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_API_KEY
);

const boardIndexName = "boards";

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query parameter" });

  try {
    const results = await client.search([
      {
        indexName: boardIndexName,
        query: q,
        hitsPerPage: 10,
      },
    ]);

    const boards = results.results[0].hits.map((hit) => ({
      ...hit,
      type: "board",
    }));

    res.json(boards);
  } catch (err) {
    console.error("Algolia search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
