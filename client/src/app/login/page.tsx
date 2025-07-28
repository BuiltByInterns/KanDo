'use client';

import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import React, { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(email, password);
      console.log(result);
      setEmail('');
      setPassword('');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      console.log('Logged in user:', user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Google login failed:', err);
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

        <div className="flex items-center w-full max-w-sm gap-4">
          <div className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">or</span>
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
            No account?{' '}
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
