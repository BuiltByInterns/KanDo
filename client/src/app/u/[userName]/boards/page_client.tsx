"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import {
  getUserBoards,
  getBoardInfo,
  createNewBoard,
  pinBoard,
  openBoard,
} from "@/lib/helper";
import {
  LayoutDashboard,
  Plus,
  Star,
  Component,
  Waypoints,
} from "lucide-react";
import Sidebar from "@/components/navigation/sidebar";
import BoardCard from "@/components/boards/boardCard";

interface DashboardPageProps {
  userName: string;
}

export default function DashboardPage({ userName }: DashboardPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [boardList, setBoardList] = useState<
    { id: string; name?: string; pinned?: boolean }[]
  >([]);
  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [ownedBoards, setOwnedBoards] = useState<any[]>([]);
  const [sharedBoards, setSharedBoards] = useState<any[]>([]);
  const [pinnedBoards, setPinnedBoards] = useState<any[]>([]);

  function redirectToUserBoards(
    user: User,
    router: ReturnType<typeof useRouter>
  ) {
    const name = user.displayName?.trim();
    if (name) router.replace(`/u/${name}/boards`);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const name = user?.displayName?.trim();
    if (name) {
      if (user) redirectToUserBoards(user, router);
    }
  }, [user, router]);

  /* Listen for Firebase auth state changes
   * - If user is not logged in, redirect to login page
   * - If user is logged in, store user in state
   * - If user has a display name, redirect to their boards page
   * - Cleans up the listener on component unmount
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      if (currentUser.displayName && currentUser.displayName.trim() !== "") {
        router.replace(`/u/${currentUser.displayName}/boards`);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) return;

      const { owned, shared, pinned } = await getUserBoards(user.uid);

      const pinnedSet = new Set(pinned);

      const ownedData = await Promise.all(
        owned.map((board) => getBoardInfo(board.objectID))
      );
      const sharedData = await Promise.all(
        shared.map((board) => getBoardInfo(board.objectID))
      );

      const ownedWithPins = ownedData
        .filter(Boolean)
        .map((b) => ({ ...b, pinned: pinnedSet.has(b.id) }));

      const sharedWithPins = sharedData
        .filter(Boolean)
        .map((b) => ({ ...b, pinned: pinnedSet.has(b.id) }));

      const pinnedData = [...ownedWithPins, ...sharedWithPins].filter(
        (b) => b.pinned
      );

      setOwnedBoards(ownedWithPins);
      setSharedBoards(sharedWithPins);
      setPinnedBoards(pinnedData);

      console.log({ ownedWithPins, sharedWithPins, pinnedData });
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

  const togglePinBoard = async (id: string) => {
    if (!user?.uid) return;
    const isPinned = pinnedBoards.some((b) => b.id === id);

    if (isPinned) {
      setPinnedBoards((prev) => prev.filter((b) => b.id !== id));
    } else {
      const board =
        ownedBoards.find((b) => b.id === id) ||
        sharedBoards.find((b) => b.id === id);
      if (board)
        setPinnedBoards((prev) => [...prev, { ...board, pinned: true }]);
    }

    setOwnedBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, pinned: !isPinned } : b))
    );
    setSharedBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, pinned: !isPinned } : b))
    );

    const newStatus = await pinBoard(user.uid, id);

    if (newStatus !== !isPinned) {
      console.warn("Backend disagreed, rolling back");

      setOwnedBoards((prev) =>
        prev.map((b) => (b.id === id ? { ...b, pinned: isPinned } : b))
      );
      setSharedBoards((prev) =>
        prev.map((b) => (b.id === id ? { ...b, pinned: isPinned } : b))
      );

      if (isPinned) {
        const board =
          ownedBoards.find((b) => b.id === id) ||
          sharedBoards.find((b) => b.id === id);
        if (board) setPinnedBoards((prev) => [...prev, board]);
      } else {
        setPinnedBoards((prev) => prev.filter((b) => b.id !== id));
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar onSignOut={handleSignOut} userName={userName} user={user} />

      <main className="flex-1 overflow-y-auto space-y-10">
        <header className="flex max-h-16 items-center justify-between px-8 py-4 border-b border-border w-full">
          <h1 className="flex items-center text-2xl font-semibold">
            <LayoutDashboard className="inline-block w-6 h-6 mr-4" />
            My Boards
          </h1>
          <button
            onClick={() => setAddingBoard(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 ease-out group"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
               bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
            <span
              aria-hidden="true"
              className="absolute inset-[1px] rounded-lg bg-background-alt pointer-events-none z-10"
            />
            <span className="relative z-20 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Board
            </span>
          </button>
        </header>

        <div className="px-8 space-y-15">
          <section>
            <h2 className="flex text-xl items-center font-semibold mb-3">
              <Star className="inline-block w-5 h-5 mr-3" />
              Starred Boards
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pinnedBoards.length === 0 ? (
                <p className="text-gray-400">No starred boards.</p>
              ) : (
                pinnedBoards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    togglePin={togglePinBoard}
                    openBoard={() => user && openBoard(board.id, user, router)}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="flex text-xl items-center font-semibold mb-3">
              <Component className="inline-block w-5 h-5 mr-3" />
              My Boards
            </h2>
            <div className="flex gap-4 flex-wrap">
              {ownedBoards.length === 0 ? (
                <p className="text-gray-400">No boards yet.</p>
              ) : (
                ownedBoards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    togglePin={togglePinBoard}
                    openBoard={() => user && openBoard(board.id, user, router)}
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

          <section>
            <h2 className="flex text-xl items-center font-semibold mb-3">
              <Waypoints className="inline-block w-5 h-5 mr-3" />
              Shared with You
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {sharedBoards.length === 0 ? (
                <p className="text-gray-400">No shared boards.</p>
              ) : (
                sharedBoards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    togglePin={togglePinBoard}
                    openBoard={() => user && openBoard(board.id, user, router)}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
