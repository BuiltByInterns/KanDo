"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, Bell, LogOut, User, Search } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onSignOut: () => void;
  userName: string;
  user: {
    photoURL?: string | null;
    displayName?: string | null;
    email?: string | null;
  };
}

export default function Sidebar({ onSignOut, userName, user }: SidebarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="w-64 bg-background text-gray-200 h-screen flex flex-col border-r border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold">KanDo</h2>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center"
            >
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-600"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#252537] shadow-lg border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">
                    {user.displayName || "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => router.push(`/u/${userName}/account`)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  Account
                </button>
                <button
                  onClick={onSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/30"
                >
                  <LogOut className="inline-block w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-600 animate-pulse" />
        )}
      </div>

      <div className="px-4 py-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Anything..."
            className="w-full pl-10 pr-14 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-gray-700 text-gray-300 border border-gray-600">
            ⌘K
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1 p-4">
        <button
          onClick={() => router.push(`/u/${userName}/boards`)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </button>
        <button
          onClick={() => router.push(`/u/${userName}/notifications`)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <Bell className="w-5 h-5" />
          Notifications
        </button>
      </nav>
    </aside>
  );
}
