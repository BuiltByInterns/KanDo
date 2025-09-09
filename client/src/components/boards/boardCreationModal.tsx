"use client";

import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useRef, useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { createNewBoard } from "@/lib/helper";

interface BoardCreationModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (newBoardId: string) => void | Promise<void>;
}

const presetBanners = [
  "/banners/banner1.jpg",
  "/banners/banner2.jpg",
  "/banners/banner3.jpg",
  "/banners/banner4.jpg",
];

const presetColors = [
  "linear-gradient(to right, #6366f1, #3b82f6)",
  "linear-gradient(to right, #06b6d4, #3b82f6)",
  "linear-gradient(to right, #10b981, #22c55e)",
  "linear-gradient(to right, #f59e0b, #ef4444)",
  "linear-gradient(to right, #a855f7, #ec4899)",
  "linear-gradient(to right, #8b5cf6, #6366f1)",
];

export default function BoardCreationModal({
  open,
  onClose,
  onCreated,
}: BoardCreationModalProps) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [banner, setBanner] = useState<{
    type: "preset" | "color" | "upload";
    value: string;
  } | null>(null);

  const [boardName, setBoardName] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public">("private");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setBanner({ type: "preset", value: presetBanners[0] });
    }
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

        <h2 className="text-lg font-semibold mb-4 text-center">Create board</h2>

        <div className="flex justify-center mb-6">
          <div className="relative w-80 aspect-[21/8] rounded-md overflow-hidden shadow-lg">
            {banner ? (
              banner.type === "color" ? (
                <div
                  className="absolute inset-0"
                  style={{ background: banner.value }}
                />
              ) : (
                <img
                  src={banner.value}
                  alt="Board preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )
            ) : (
              <div className="absolute inset-0 bg-gray-800" />
            )}

            <div className="absolute inset-0 flex gap-2 p-4">
              {[1, 2, 3].map((c) => (
                <div
                  key={c}
                  className="flex-1 rounded-md bg-white/80 backdrop-blur-sm"
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm mb-2 font-medium">Background</p>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {presetBanners.map((b) => (
            <div
              key={b}
              onClick={() => setBanner({ type: "preset", value: b })}
              className={`relative w-full aspect-[21/8] rounded-md cursor-pointer overflow-hidden border-2 ${
                banner?.value === b ? "border-accent" : "border-transparent"
              }`}
            >
              <img
                src={b}
                alt="preset banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {banner?.value === b && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {presetColors.map((c) => (
            <div
              key={c}
              onClick={() => setBanner({ type: "color", value: c })}
              className={`relative w-full aspect-[5/4] rounded-md cursor-pointer border-2 ${
                banner?.value === c ? "border-accent" : "border-transparent"
              }`}
            >
              <div
                className="absolute inset-0 rounded-md"
                style={{ background: c }}
              />

              {banner?.value === c && (
                <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-full aspect-[5/4] rounded-md bg-gray-700 cursor-pointer hover:bg-gray-600"
          >
            <Plus className="w-6 h-6 text-white" />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setBanner({
                    type: "upload",
                    value: url,
                  });
                }
              }}
            />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setBanner({ type: "upload", value: url });
            }
          }}
        />

        <p className="text-sm mb-2 font-medium">Board Name</p>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Board name"
          className="w-full px-4 py-2 mb-4 rounded-md bg-background-alt text-gray-200 border border-border focus:outline-none focus:border-accent"
        />

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Privacy</span>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as "private" | "public")}
            className="bg-background-alt border border-border rounded-md px-2 py-1 text-sm"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm font-medium"
            onClick={() => router.push("/templates")}
          >
            Start with a Template
          </button>
          <button
            className="px-4 py-2 rounded-md bg-accent hover:bg-accent/80 text-sm font-medium"
            disabled={!boardName.trim()}
            onClick={async () => {
              if (!user?.uid || !banner) return;
              const newBoardId = await createNewBoard(
                user.uid,
                boardName.trim(),
                privacy,
                banner
              );
              if (onCreated) onCreated(newBoardId);
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
