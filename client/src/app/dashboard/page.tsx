"use client";

import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user ? (
          <>
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <p>Username: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <p>
              Verification Status:{" "}
              <span
                className={
                  user.emailVerified ? "text-green-600" : "text-red-600"
                }
              >
                {user.emailVerified ? "Verified" : "Unverified"}
              </span>
            </p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}

        <button
          onClick={handleSignOut}
          className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium h-10 sm:h-12 px-4 sm:px-5"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
