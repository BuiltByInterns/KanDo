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
import { LayoutDashboard, LogOut, User, Pin, PinOff, Plus } from "lucide-react";
import Sidebar from "@/components/navigation/sidebar";
import BoardCard from "@/components/boards/boardCard";
import UserProfile from "@/components/user/userProfile";

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

  return (
    <div className="flex min-h-screen bg-background-alt text-gray-100">
      <Sidebar onSignOut={handleSignOut} userName={userName} user={user} />

      <main className="flex-1 p-8 overflow-y-auto space-y-10">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Workspace</h1>
          <button
            onClick={() => setAddingBoard(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            <Plus className="w-5 h-5" />
            New Board
          </button>
        </header>

        {user && <UserProfile user={user} />}

        {/* Pinned Boards */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Pinned Boards</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {boardList.filter((b) => b.pinned).length === 0 ? (
              <p className="text-gray-400">No pinned boards.</p>
            ) : (
              boardList
                .filter((b) => b.pinned)
                .map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    togglePin={togglePinBoard}
                    openBoard={openBoard}
                  />
                ))
            )}
          </div>
        </section>

        {/* All Boards */}
        <section>
          <h2 className="text-xl font-semibold mb-3">All Boards</h2>
          <div className="flex gap-4 flex-wrap">
            {boardList.length === 0 ? (
              <p className="text-gray-400">No boards yet.</p>
            ) : (
              boardList.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  togglePin={togglePinBoard}
                  openBoard={openBoard}
                />
              ))
            )}

            {addingBoard && (
              <div className="min-w-[220px] h-36 p-4 rounded-xl shadow-md border border-gray-700 bg-[#2B2B40] flex flex-col justify-center">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                  autoFocus
                  placeholder="Board name..."
                  className="p-2 rounded-md border border-gray-600 bg-[#1E1E2F] text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleCreateBoard}
                    className="flex-1 px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 transition text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setAddingBoard(false);
                      setNewBoardName("");
                    }}
                    className="flex-1 px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
