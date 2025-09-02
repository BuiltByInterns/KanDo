"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  LogOut,
  User,
  Search,
  HelpCircleIcon,
  Settings,
  StickyNote,
  LayoutTemplate,
  Folder,
  Home,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import NavItem from "./navItemProp";
import SearchModal from "../search/searchModal";

interface SidebarProps {
  onSignOut: () => void;
  userName: string;
  user:
    | {
        photoURL?: string | null;
        displayName?: string | null;
        email?: string | null;
      }
    | null
    | undefined;
}

export default function Sidebar({ onSignOut, userName, user }: SidebarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      label: "Home",
      href: `/u/${userName}/home`,
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "My Boards",
      href: `/u/${userName}/boards`,
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Notifications",
      href: `/u/${userName}/notifications`,
      icon: <Bell className="w-5 h-5" />,
    },
    {
      label: "Templates",
      href: `/templates`,
      icon: <LayoutTemplate className="w-5 h-5" />,
    },
  ];

  const tempNavItems = [
    {
      label: "Board2",
      href: `/templates`,
      icon: <Folder className="w-5 h-5" />,
    },
    {
      label: "Board1",
      href: `/templates`,
      icon: <Folder className="w-5 h-5" />,
    },
    {
      label: "Board3",
      href: `/templates`,
      icon: <Folder className="w-5 h-5" />,
    },
  ];

  const bottomNavItems = [
    {
      label: "Feedback",
      href: `/feedback`,
      icon: <StickyNote className="w-5 h-5" />,
    },
    {
      label: "Settings",
      href: `/settings`,
      icon: <Settings className="w-5 h-5" />,
    },
    {
      label: "Help Center",
      href: `/help`,
      icon: <HelpCircleIcon className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <aside className="w-70 bg-background text-gray-200 h-screen flex flex-col border-r border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold">KanDo</h2>
        {user === undefined ? (
          <div className="w-9 h-9 rounded-full bg-gray-600 animate-pulse" />
        ) : user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center"
            >
              <Image
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-background-alt shadow-lg border border-border z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-white">
                    {user.displayName || "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => router.push(`/u/${userName}/account`)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-border-hover"
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  Account
                </button>
                <button
                  onClick={onSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-border-hover"
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
        <button
          onClick={() => setOpen(true)}
          className="relative w-full flex items-center rounded-md bg-background-alt border border-border px-3 py-2 text-left text-gray-400 hover:border-border-hover transition"
        >
          <Search className="w-5 h-5 mr-2" />
          <span className="text-gray-400">Search Anything...</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-border text-gray-300">
            ⌘K
          </div>
        </button>
      </div>

      <SearchModal open={open} onClose={() => setOpen(false)} />

      <nav className="flex flex-col gap-2 flex-1 p-4">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}

        <div className="flex justify-center my-2">
          <div className="border-t border-border w-[90%]" />
        </div>

        <p>Recent:</p>
        {tempNavItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <nav className="flex flex-col gap-2">
          {bottomNavItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
