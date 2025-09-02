"use client";

import { Pin, PinOff } from "lucide-react";

interface BoardCardProps {
  board: {
    id: string;
    name?: string;
    pinned?: boolean;
  };
  togglePin: (id: string) => void;
  openBoard: (id: string) => void;
}

export default function BoardCard({
  board,
  togglePin,
  openBoard,
}: BoardCardProps) {
  return (
    <div
      onClick={() => openBoard(board.id)}
      className="relative min-w-[220px] h-36 p-4 rounded-xl shadow-md 
        bg-background-alt hover:bg-border-hover transition cursor-pointer 
        flex flex-col justify-between group"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePin(board.id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        {board.pinned ? (
          <Pin className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ) : (
          <PinOff className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <p className="font-semibold text-lg text-white truncate">
        {board.name || "Untitled Board"}
      </p>
      <p className="text-xs text-gray-400">ID: {board.id}</p>
    </div>
  );
}
