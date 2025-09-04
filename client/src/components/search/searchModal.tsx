"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
      </div>
    </div>
  );
}
