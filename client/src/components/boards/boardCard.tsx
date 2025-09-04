"use client";

import { Pin, PinOff, Star } from "lucide-react";

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
      className="relative min-w-[250px] h-36 rounded-xl shadow-md 
    bg-background-alt hover:bg-border-hover transition cursor-pointer 
    flex flex-col group overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePin(board.id);
        }}
        className={`absolute top-2 right-2 p-1 rounded-md 
    bg-black/40 backdrop-blur-sm transition z-10
    ${board.pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {board.pinned ? (
          <Star
            className="w-5 h-5 text-yellow-400 fill-yellow-400 transition-transform duration-200 ease-out 
        hover:scale-120"
          />
        ) : (
          <Star
            className="w-5 h-5 text-gray-400 transition-transform duration-200 ease-out 
        hover:scale-120 hover:text-yellow-400"
          />
        )}
      </button>

      <div className="h-2/3 relative w-full">
        <img
          src={board.backgroundId || "/default-board.jpg"}
          alt={board.name || "Board preview"}
          className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
        />
      </div>

      <div className="h-1/3 flex px-3 pb-3 items-end">
        <p className="font-semibold text-lg text-white truncate">
          {board.name || "Untitled Board"}
        </p>
      </div>
    </div>
  );
}
