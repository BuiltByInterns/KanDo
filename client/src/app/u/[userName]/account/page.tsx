"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [editingField, setEditingField] = useState<"name" | "photo" | null>(
    null
  );
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setPhotoURL(currentUser.photoURL || "");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });
      setEditingField(null);
      setStatusMessage("Profile updated successfully ✅");
    } catch (error: any) {
      setStatusMessage("Error updating profile: " + error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !currentPassword || !newPassword) return;

    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);

      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setStatusMessage("Password updated successfully ✅");
    } catch (error: any) {
      setStatusMessage("Error updating password: " + error.message);
    }
  };

  if (!user) return null;

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 gap-10 bg-background text-foreground">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {/* Profile Card */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>

          {/* Display Name */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Display Name</p>
              {editingField === "name" ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                    bg-gray-50 dark:bg-gray-700 text-foreground text-sm focus:ring-2 
                    focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="font-medium">{displayName || "Unnamed"}</p>
              )}
            </div>
            {editingField === "name" ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-3 py-1 rounded-md bg-foreground text-background text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="px-3 py-1 rounded-md border text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingField("name")}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.121 2.121 0 113 3L12 14H9v-3z" />
                </svg>
              </button>
            )}
          </div>

          {/* Photo URL */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={photoURL || "/default-avatar.png"}
                alt="Avatar"
                className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600"
              />
              <div>
                <p className="text-sm text-gray-500">Photo</p>
                {editingField === "photo" ? (
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 
                      bg-gray-50 dark:bg-gray-700 text-foreground text-sm focus:ring-2 
                      focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="font-medium truncate max-w-[200px]">
                    {photoURL || "Not set"}
                  </p>
                )}
              </div>
            </div>
            {editingField === "photo" ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-3 py-1 rounded-md bg-foreground text-background text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="px-3 py-1 rounded-md border text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingField("photo")}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.121 2.121 0 113 3L12 14H9v-3z" />
                </svg>
              </button>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          {/* Date Created */}
          <div>
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="font-medium">
              {new Date(user.metadata.creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="rounded-lg bg-foreground text-background px-4 py-2 font-medium hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Change Password
          </button>
        </div>

        {statusMessage && (
          <p className="mt-6 text-sm text-blue-500">{statusMessage}</p>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mb-3 p-2 rounded-md border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-800 text-foreground text-sm focus:ring-2 
                focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-800 text-foreground text-sm focus:ring-2 
                focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1 rounded-md border text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-3 py-1 rounded-md bg-foreground text-background text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
