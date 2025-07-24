'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {

  const [error, setError] = useState('');

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || 'Login failed');
      return;
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Logged in user:', user);
      // You can store user info, send to backend, etc.

      window.location.href = '/dashboard'; // or wherever
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Log In</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full max-w-sm text-sm sm:text-base">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="rounded-md border border-black/[.1] dark:border-white/[.1] bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium text-gray-800 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="rounded-md border border-black/[.1] dark:border-white/[.1] bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium h-10 sm:h-12 px-4 sm:px-5"
          >
            Sign In
          </button>
        </form>

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <button
          onClick={handleGoogleLogin}
          className="bg-white text-black border border-black px-4 py-2 rounded shadow flex gap-2 items-center hover:bg-gray-100 transition"
        >
          <Image src="/google.svg" alt="Google logo" width={20} height={20} />
          Continue with Google
        </button>
      </main>
    </div>
  );
}
