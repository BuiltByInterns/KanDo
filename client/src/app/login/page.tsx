"use client";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

import React, { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isValidEmail } = require("@/lib/_helper");

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result && result.user) {
        setEmail("");
        setPassword("");
        setError("");
        window.location.href = "/dashboard";
        console.log("Logged in user:", result.user);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Login failed:" + error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      console.log("Logged in user:", user);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Log In</h1>
        {error && (
          <div className="absolute top-0 left-0 right-0 flex items-center gap-3 bg-red-100 text-red-800 border border-red-300 rounded-md px-4 py-3 text-sm shadow-sm">
            <span className="flex-1 break-words">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-500 transition-colors flex-shrink-0"
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
          onSubmit={handleLogin}
          className="flex flex-col gap-6 w-full max-w-sm text-sm sm:text-base"
        >
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 font-medium text-gray-800 dark:text-gray-200"
            >
              Email
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
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-gray-800 dark:text-gray-200"
            >
              Password
            </label>
            <div className="relative inline-flex items-center w-full rounded-md border border-black/[.1] dark:border-white/[.1] bg-transparent focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password ?? ""}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow bg-transparent px-3 py-2 rounded-md outline-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                    <circle cx="12" cy="12" r="2.5" fill="black" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className={`rounded-full border border-transparent transition-colors flex items-center justify-center font-medium h-10 sm:h-12 px-4 sm:px-5
    ${
      isValidEmail(email) && email && password
        ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        : "bg-gray-400 text-white cursor-not-allowed"
    }`}
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center w-full max-w-sm gap-4">
          <div className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            or
          </span>
          <div className="h-px flex-1 bg-black/20 dark:bg-white/20" />
        </div>

        <div className="w-full max-w-sm">
          <button
            onClick={handleGoogleLogin}
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium h-10 sm:h-12 px-4 sm:px-6 w-full gap-5"
          >
            <Image src="/google.svg" alt="Google logo" width={20} height={20} />
            Continue with Google
          </button>

          <p className="text-sm text-gray-600 dark:text-gray-300 text-center pt-6">
            No account?{" "}
            <a
              href="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Go to Sign Up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
