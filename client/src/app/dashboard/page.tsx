'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function DashboardPage() {

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; // Redirect to login after signing out
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>

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