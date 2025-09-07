import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { commands } from "@/lib/commands";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

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
export async function getUserBoards(userId: string): Promise<string[]> {
  console.log("Fetching boards for user:", userId);
  try {
    const res = await fetch(`${API_BASE}/api/user/boards?userId=${userId}`);
    const boards = await res.json();

    if (!res.ok) throw new Error("Failed to fetch boards");
    return boards;
  } catch (err) {
    console.error(err);
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
  console.log("Fetching board info for board:", boardId);
  try {
    const res = await fetch(`${API_BASE}/api/board/${boardId}`);

    if (res.status === 404) {
      console.warn(`Board ${boardId} not found, removing from recentBoards`);
      const stored = localStorage.getItem("recentBoards");
      if (stored) {
        const recentBoards: string[] = JSON.parse(stored);
        const updated = recentBoards.filter((id) => id !== boardId);
        localStorage.setItem("recentBoards", JSON.stringify(updated));
      }
      return null;
    }

    if (!res.ok)
      throw new Error("Failed to fetch board info for ID: " + boardId);

    return await res.json();
  } catch (err) {
    console.error(err);
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
): Promise<any> {
  try {
    const params = new URLSearchParams({
      userId: userId,
      title: boardName || "Untitled Board",
    });
    const res = await fetch(`${API_BASE}/api/user/createBoard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title: boardName || "Untitled Board",
      }),
    });

    if (!res.ok) throw new Error("Failed to create new board");

    const data = await res.json();
    return data.boardId;
  } catch (err) {
    console.error(err);
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

/**
 * Helper functions that keeps track of the user's 3 most recent boards.
 */

const LOCAL_STORAGE_KEY = "recentBoards";

export async function getRecentBoards(userId: string): Promise<string[]> {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  try {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return [];

    const boards = docSnap.data().RecentBoards;
    if (!boards || !Array.isArray(boards) || boards.length === 0) {
      return [];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boards));
    return boards;
  } catch (error) {
    console.error("Error fetching recent boards from Firestore:", error);
    return [];
  }
}

export async function addRecentBoard(
  userID: string,
  boardID: string
): Promise<void> {
  let boards: string[] = [];

  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localData) {
    try {
      boards = JSON.parse(localData);
    } catch {
      boards = [];
    }
  }

  boards = boards.filter((id) => id !== boardID);
  boards.unshift(boardID);
  if (boards.length > 5) boards = boards.slice(0, 5);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boards));

  try {
    const docRef = doc(db, "Users", userID);
    await setDoc(docRef, { RecentBoards: boards }, { merge: true });
  } catch (error) {
    console.error("Error updating recent boards in Firestore:", error);
  }
}

export async function openBoard(
  id: string,
  user: User,
  router: ReturnType<typeof useRouter>
): Promise<void> {
  const board = await getBoardInfo(id);
  if (!board) return;

  await addRecentBoard(user.uid, id);

  const boardName = encodeURIComponent(board.urlName || "Untitled");
  router.push(`/b/${id}/${boardName}`);
}

/** A helper function that performs a global search for boards and users based on a query string.
 * It sends a GET request to the /api/search endpoint with the query as a URL parameter.
 * Returns an object containing arrays of matching boards and users.
 *
 * @param {string} query - The search query string.
 * @returns {Promise<{ boards: any[]; users: any[] }>} - A Promise resolving to an object with boards and users arrays.
 */
export async function globalSearch(query: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) throw new Error("Search failed");
  const boards = await res.json();
  const boardResults = boards.map((b: any) => ({
    ...b,
    type: "board",
  }));

  const commandResults = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  return [...boardResults, ...commandResults];
}
