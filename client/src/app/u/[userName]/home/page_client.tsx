"use client";

import BoardCardSmall from "@/components/boards/boardCardSmall";
import Sidebar from "@/components/navigation/sidebar";
import { auth } from "@/lib/firebase";
import { getBoardInfo, getUserBoards, openBoard } from "@/lib/helper";
import { onAuthStateChanged, signOut, User } from "@firebase/auth";
import { Calendar, House, Inbox, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HomePageProps {
  userName: string;
}

export default function HomePage({ userName }: HomePageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [boardList, setBoardList] = useState<
    { id: string; name?: string; pinned?: boolean }[]
  >([]);

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
      setBoardList(pinnedData);
    };
    fetchBoards();
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  function togglePinBoard(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar onSignOut={handleSignOut} userName={userName} user={user} />
      <main className="flex-1 overflow-y-auto space-y-6">
        <header className="flex max-h-16 items-center justify-between px-8 py-4 border-b border-border w-full">
          <h1 className="flex items-center text-2xl font-semibold">
            <House className="inline-block w-6 h-6 mr-4" />
            Home
          </h1>
        </header>
        <div className="flex flex-1">
          <main className="flex-1 overflow-y-auto space-y-10">
            <div className="px-8 py-4">
              <h2 className="flex text-xl items-center font-semibold mb-3">
                <Inbox className="inline-block w-5 h-5 mr-3" />
                Feed
              </h2>
              <p className="mt-2 text-gray-400">No feed available.</p>
            </div>
          </main>

          <aside className="hidden lg:block w-80 border-l border-border px-6 py-6 space-y-8 bg-background/40">
            <section>
              <h3 className="flex items-center text-lg font-semibold mb-3">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Upcoming Deadlines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center gap-2">
                  <span>No upcoming deadlines.</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="flex items-center text-lg font-semibold mb-3">
                <Star className="inline-block w-4 h-4 mr-2" />
                Starred Boards
              </h3>
              <div className="flex flex-col gap-4 pb-2">
                {boardList.filter((b) => b.pinned).length === 0 ? (
                  <p className="text-gray-400">No starred boards.</p>
                ) : (
                  boardList
                    .filter((b) => b.pinned)
                    .map((board) => (
                      <BoardCardSmall
                        key={board.id}
                        board={board}
                        openBoard={() =>
                          user && openBoard(board.id, user, router)
                        }
                      />
                    ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
