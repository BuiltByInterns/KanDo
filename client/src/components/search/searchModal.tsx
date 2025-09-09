"use client";

import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { globalSearch, openBoard } from "@/lib/helper";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  commandActions?: {
    openBoardModal: () => void;
    openInviteModal: () => void;
    [key: string]: () => void;
  };
}

export default function SearchModal({
  open,
  onClose,
  commandActions,
}: SearchModalProps) {
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const handlers: Record<string, (item: any) => void> = {
    board: (board) => user && openBoard(board.objectID, user, router),
    command: (cmd) => cmd.action(),
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const input = document.querySelector(
      'input[placeholder="Type to search..."]'
    ) as HTMLInputElement;

    if (!input) return;

    const handleInput = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const query = target.value.trim();

      if (query !== "") {
        try {
          const searchResults = await globalSearch(query);
          setResults(searchResults);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setResults([]);
      }
    };

    input.addEventListener("input", handleInput);
    return () => input.removeEventListener("input", handleInput);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-xl bg-background p-6 shadow-xl border border-border animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <input
          autoFocus
          type="text"
          placeholder="Type to search..."
          className="w-full px-4 py-2 rounded-md bg-background-alt text-gray-200 border border-border focus:outline-none focus:border-accent"
        />

        <div className="mt-4 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.objectID || item.id}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  handlers[item.type]?.(item);
                  onClose();
                }}
              >
                {item.name || item.displayName || "Untitled"}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
