"use client";

interface UserProfileProps {
  user: {
    photoURL?: string | null;
    displayName?: string | null;
    email?: string | null;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="bg-[#252537] rounded-2xl p-6 shadow-md flex items-center gap-4">
      <img
        src={user.photoURL || "/default-avatar.png"}
        alt="Profile"
        className="w-14 h-14 rounded-full border border-gray-600"
      />
      <div>
        <p className="font-semibold text-lg text-white">
          {user.displayName || "Unnamed"}
        </p>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>
    </div>
  );
}
