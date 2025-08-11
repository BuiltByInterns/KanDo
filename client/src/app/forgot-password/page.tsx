"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isValidEmail } = require("@/lib/_helper");

  const handleForgotPassword = async () => {
    await sendPasswordResetEmail(auth, email);
    console.log("Forgot Password clicked");
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        {error && (
          <div className="w-full max-w-sm flex items-center justify-between gap-3 bg-red-100 text-red-800 border border-red-300 rounded-md px-4 py-3 text-sm shadow-sm">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-500 transition-colors"
              aria-label="Close error message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <form
          onSubmit={handleForgotPassword}
          className="flex flex-col gap-6 w-full max-w-sm text-sm sm:text-base"
        >
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 font-medium text-gray-800 dark:text-gray-200"
            >
              Recovery Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email ?? ""}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-black/[.1] dark:border-white/[.1] bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
          <button
            type="submit"
            className={`rounded-full border border-transparent transition-colors flex items-center justify-center font-medium h-10 sm:h-12 px-4 sm:px-5
      ${
        isValidEmail(email)
          ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
          : "bg-gray-400 text-white cursor-not-allowed"
      }`}
          >
            Send Email
          </button>
          <div className="flex justify-center mt-1">
            <a
              href="/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Back to Log In
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}
