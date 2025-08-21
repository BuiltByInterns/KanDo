import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

/**
 * A helper function that checks the validity of an email address.
 * It uses a regular expression to validate the format of the email.
 * Returns true if the email is valid, false otherwise.
 *
 * @param {string} email - The email address to validate.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * A helper function that retrieves the list of board IDs from a user object.
 * It checks if the user object exists and if it has a Boards property.
 * Returns an array of board IDs or an empty array if not available.
 *
 * @param {string} userID - The ID of the user whose boards are to be retrieved.
 * @returns {Promise<string[]>} - A Promise resolving to an array of board IDs.
 */
export async function getUserBoards(userID: string): Promise<string[]> {
  try {
    const userRef = doc(db, "Users", userID);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const userData = userSnap.data() as { Boards?: string[] };
    return userData.Boards || [];
  } catch (error) {
    console.error("Error fetching user boards:", error);
    return [];
  }
}

/** * A helper function that retrieves information about a specific board by its ID.
 * It fetches all documents from the "Boards" collection and filters them to find the one with the matching ID.
 * Returns the board data if found, or null if not found.
 *
 * @param {string} boardId - The ID of the board to retrieve.
 * @returns {Promise<any>} - A Promise resolving to the board data or null if not found.
 */
export async function getBoardInfo(boardId: string): Promise<any> {
  try {
    const boardRef = doc(db, "Boards", boardId);
    const boardSnap = await getDoc(boardRef);

    if (!boardSnap.exists()) return null;

    return { id: boardSnap.id, ...boardSnap.data() };
  } catch (error) {
    console.error("Error fetching board info:", error);
    return null;
  }
}

/** * A helper function that creates a new board for a user.
 * It adds a new document to the "Boards" collection with the specified board name and user ID.
 * Returns the ID of the newly created board or null if an error occurs.
 *
 * @param {string} userId - The ID of the user creating the board.
 * @param {string} boardName - The name of the new board.
 * @returns {Promise<string | null>} - A Promise resolving to the new board ID or null if creation fails.
 */
export async function createNewBoard(
  userId: string,
  boardName: string
): Promise<string | null> {
  try {
    const boardRef = collection(db, "Boards");
    const newBoardData = {
      name: boardName,
      createdAt: new Date(),
      ownerId: userId,
      privacy: "private",
      members: [userId],
      pinned: false,
    };

    const newBoard = await addDoc(boardRef, newBoardData);

    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
      Boards: arrayUnion(newBoard.id),
    });

    return newBoard.id;
  } catch (error) {
    console.error("Error creating new board:", error);
    return null;
  }
}

/** A helper function that pins a board for a user.
 * It updates the board document in the "Boards" collection to set the pinned state to true.
 * If the board is already pinned, it unpins it by setting pinned to false.
 *
 * @param {string} boardId - The ID of the board to pin or unpin.
 * @param {boolean} pinStatus - The desired pinned state (true to pin, false to unpin).
 */
export async function pinBoard(
  boardId: string,
  pinStatus: boolean
): Promise<void> {
  const boardRef = doc(db, "Boards", boardId);
  await updateDoc(boardRef, {
    pinned: pinStatus,
  });
}
