"use client";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import Image from "next/image";
import PasswordInput from "@/components/forms/passwordInput";
import EmailInput from "@/components/forms/emailInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isValidEmail } = require("@/lib/helper");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const routeToDashboard = (userName: string | undefined) => {
    if (userName && userName.trim() !== "") {
      const encodedUserName = encodeURIComponent(userName);
      router.push(`/u/${encodedUserName}/boards`);
    } else {
      // Optionally, redirect to profile setup or show error
      // router.push("/setup-profile");
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result && result.user) {
        setEmail("");
        setPassword("");
        setError("");

        const userName =
          result.user.displayName?.replace(/\s+/g, "") || "unknown";

        routeToDashboard(userName);
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
      const userName =
        result.user.displayName?.replace(/\s+/g, "") || "unknown";
      routeToDashboard(userName);
    } catch (err: any) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <main className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h1>

        {error && (
          <div className="flex items-center justify-between gap-3 bg-red-100 text-red-800 border border-red-300 rounded-md px-4 py-3 text-sm shadow-sm">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-500 transition-colors"
              aria-label="Close error message"
            >
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 text-sm sm:text-base"
        >
          <div className="flex flex-col">
            <EmailInput
              id="email"
              label="Email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col">
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className={`rounded-full font-semibold h-12 px-6 transition-all duration-200 shadow-md
              ${
                isValidEmail(email) && email && password
                  ? "bg-[var(--gradient-primary)] text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full gap-4">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            or
          </span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="rounded-full flex items-center justify-center gap-3 w-full h-12 px-6 font-medium shadow-md bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-all"
        >
          <Image src="/google.svg" alt="Google logo" width={20} height={20} />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          No account?{" "}
          <a
            href="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Sign Up
          </a>
        </p>
      </main>
    </div>
  );
}
