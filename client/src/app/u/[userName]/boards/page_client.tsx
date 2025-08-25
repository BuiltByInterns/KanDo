"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  getUserBoards,
  getBoardInfo,
  createNewBoard,
  pinBoard,
} from "@/lib/helper";

interface DashboardPageProps {
  userName: string;
}

export default function DashboardPage({ userName }: DashboardPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [boardList, setBoardList] = useState<
    { id: string; name?: string; pinned?: boolean }[]
  >([]);
  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      if (currentUser.displayName) {
        router.replace(`/u/${currentUser.displayName}/boards`);
      }
    });
    return () => unsubscribe();
  }, [router]);

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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
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

  const togglePinBoard = (id: string) => {
    setBoardList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b))
    );
    pinBoard(id, !boardList.find((b) => b.id === id)?.pinned);
  };

  const openBoard = (id: string) => {
    const name: string | undefined = boardList.find((b) => b.id === id)?.name;
    router.push(`/b/${id}/${name}`);
  };

  const renderBoardCard = (board: {
    id: string;
    name?: string;
    pinned?: boolean;
  }) => (
    <div
      key={board.id}
      onClick={() => openBoard(board.id)}
      className="relative min-w-[200px] h-32 p-4 rounded-xl shadow-md 
        bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer 
        flex flex-col justify-between group"
    >
      {/* Pin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePinBoard(board.id);
        }}
        className={`absolute top-2 right-2 p-1 rounded-full transition-opacity
          ${
            board.pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={board.pinned ? "gold" : "none"}
          stroke={board.pinned ? "gold" : "currentColor"}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.52 4.674a1 
              1 0 00.95.69h4.915c.969 0 1.371 1.24.588 
              1.81l-3.976 2.89a1 1 0 00-.364 1.118l1.52 
              4.674c.3.921-.755 1.688-1.54 
              1.118l-3.976-2.89a1 1 0 00-1.176 
              0l-3.976 2.89c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 
              1 0 00-.364-1.118L2.076 
              10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 
              1 0 00.95-.69l1.52-4.674z"
          />
        </svg>
      </button>

      <p className="font-semibold text-lg text-gray-900 dark:text-white truncate">
        {board.name || "Untitled Board"}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {board.id}</p>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
      from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 py-10"
    >
      <main className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Workspace
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/u/${userName}/account`)}
              className="rounded-full bg-black text-white hover:bg-gray-800 
                dark:bg-white dark:text-black dark:hover:bg-gray-200 
                font-medium h-10 px-5 transition-colors"
            >
              Account Settings
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-full bg-black text-white hover:bg-gray-800 
                dark:bg-white dark:text-black dark:hover:bg-gray-200 
                font-medium h-10 px-5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-lg text-gray-900 dark:text-white">
                {user.displayName || "Unnamed"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Pinned Boards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Pinned Boards
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {boardList.filter((b) => b.pinned).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No pinned boards.
              </p>
            ) : (
              boardList.filter((b) => b.pinned).map(renderBoardCard)
            )}
          </div>
        </section>

        {/* All Boards */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Boards
            </h2>
            <button
              onClick={() => setAddingBoard(true)}
              className="rounded-full bg-black text-white hover:bg-gray-800 
                dark:bg-white dark:text-black dark:hover:bg-gray-200 
                font-medium h-9 px-5 transition-colors"
            >
              + Create Board
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {boardList.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No boards yet.</p>
            ) : (
              boardList.map(renderBoardCard)
            )}

            {addingBoard && (
              <div
                className="min-w-[200px] h-32 p-4 rounded-xl shadow-md border 
                  border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 
                  flex flex-col justify-center"
              >
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateBoard();
                  }}
                  onBlur={() => {
                    setAddingBoard(false);
                    setNewBoardName("");
                  }}
                  autoFocus
                  placeholder="Board name..."
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm 
                    focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
