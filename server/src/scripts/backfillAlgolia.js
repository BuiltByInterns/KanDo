import "dotenv/config";
import { algoliasearch } from "algoliasearch";
import { db } from "../firebase.js";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY
);

const boardIndexName = "boards";

const backfillBoards = async () => {
  try {
    const boardsSnap = await db.collection("Boards").get();
    const boards = boardsSnap.docs.map((doc) => ({
      objectID: doc.id,
      ...doc.data(),
    }));

    await client.saveObjects({ indexName: boardIndexName, objects: boards });
    console.log(`Successfully indexed ${boards.length} boards`);
  } catch (err) {
    console.error("Error backfilling boards:", err);
  }
};

backfillBoards();
