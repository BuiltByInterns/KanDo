"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface NavItemProps {
  label: string;
  href: string;
  icon: ReactNode;
}

export default function NavItem({ label, href, icon }: NavItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === href; // exact match (or use startsWith for sections)

  return (
    <button
      onClick={() => router.push(href)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
        ${
          isActive
            ? "bg-accent text-white hover:bg-accent-hover"
            : "hover:bg-accent-hover text-gray-300"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
