"use client";

import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getUserBoards, getBoardInfo, createNewBoard } from "@/lib/helper";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [boardList, setBoardList] = useState<{ id: string; name?: string }[]>(
    []
  );
  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) return;

      const boardIds = await getUserBoards(user.uid);
      const boardsData = await Promise.all(
        boardIds.map((id) => getBoardInfo(id))
      );

      setBoardList(
        boardsData.filter(Boolean) as { id: string; name?: string }[]
      );
    };

    fetchBoards();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const handleCreateBoard = async () => {
    if (!user || !newBoardName.trim()) return;

    const boardId = await createNewBoard(user.uid, newBoardName);

    if (boardId) {
      setBoardList((prev) => [...prev, { id: boardId, name: newBoardName }]);

      setNewBoardName("");
      setAddingBoard(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user ? (
          <>
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <p>Username: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <p>
              Verification Status:{" "}
              <span
                className={
                  user.emailVerified ? "text-green-600" : "text-red-600"
                }
              >
                {user.emailVerified ? "Verified" : "Unverified"}
              </span>
            </p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}

        <button
          onClick={handleSignOut}
          className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium h-10 sm:h-12 px-4 sm:px-5"
        >
          Sign Out
        </button>
      </main>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Boards</h1>

        <div className="w-full max-w-md flex flex-col gap-4">
          {boardList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No boards found.</p>
          ) : (
            boardList.map((board) => (
              <button
                key={board.id}
                className="w-full text-left p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 
                 bg-background hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 
                 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-lg text-foreground">
                  {board.name || "Untitled Board"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {board.id}
                </p>
              </button>
            ))
          )}

          {addingBoard && (
            <div
              className="w-full p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 
                  bg-background dark:bg-gray-800 flex flex-col gap-2"
            >
              <label className="font-semibold text-foreground">
                Board Name:
              </label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    handleCreateBoard();
                  }
                }}
                onBlur={() => {
                  setAddingBoard(false);
                  setNewBoardName("");
                }}
                autoFocus
                placeholder="Enter board name"
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-900 text-foreground
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={() => setAddingBoard(true)}
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium h-10 sm:h-12 px-4 sm:px-5"
          >
            Create New Board
          </button>
        </div>
      </main>
    </div>
  );
}
