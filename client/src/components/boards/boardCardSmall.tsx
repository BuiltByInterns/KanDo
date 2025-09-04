"use client";

import { Pin, PinOff, Star } from "lucide-react";

interface BoardCardProps {
  board: {
    id: string;
    name?: string;
    pinned?: boolean;
  };
  openBoard: (id: string) => void;
}

export default function BoardCardSmall({ board, openBoard }: BoardCardProps) {
  return (
    <div
      onClick={() => openBoard(board.id)}
      className="relative min-w-[250px] h-13 rounded-xl shadow-md 
    bg-background-alt hover:bg-border-hover transition cursor-pointer 
    flex flex-col group overflow-hidden"
    >
      <div className="flex p-3 items-center justify-between w-full">
        <p className="font-semibold text-lg text-white truncate">
          {board.name || "Untitled Board"}
        </p>

        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />
      </div>
    </div>
  );
}
