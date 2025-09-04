"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface NavItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function NavItem({ label, href, icon, onClick }: NavItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = href ? pathname.startsWith(href) : false;

  return (
    <button
      onClick={onClick ?? (() => router.push(href))}
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
