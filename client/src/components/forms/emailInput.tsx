"use client";

import React, { useState } from "react";

interface EmailInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function EmailInput({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  required = true,
  autoComplete = "email",
}: EmailInputProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-1 font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <div className="relative inline-flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/30 focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
        <input
          id={id}
          type={"password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="flex-grow bg-transparent px-3 py-2 rounded-md outline-none"
        />
      </div>
    </div>
  );
}
