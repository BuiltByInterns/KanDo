"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/navigation/sidebar";
import { CircleUser, Pen } from "lucide-react";

interface DashboardPageProps {
  userName: string;
}

export default function AccountPage({ userName }: DashboardPageProps) {
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar onSignOut={handleSignOut} userName={userName} user={user} />

      <main className="flex-1 overflow-y-auto space-y-10">
        <header className="flex items-center justify-between px-8 py-4 border-b border-border w-full">
          <h1 className="flex items-center text-2xl font-semibold">
            <CircleUser className="inline-block w-6 h-6 mr-4" />
            Account Settings
          </h1>
        </header>

        <div className="px-8 space-y-15">
          <section className="bg-background-alt rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Display Name</p>
                {editingField === "name" ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="p-2 mt-1 rounded-md border border-border 
                    bg-background text-foreground text-sm focus:ring-2 
                    focus:ring-primary focus:outline-none"
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
                  className="p-2 hover:bg-border-hover rounded-lg"
                >
                  <Pen className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 w-full">
                <img
                  src={photoURL || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border border-border object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Photo</p>
                  {editingField === "photo" ? (
                    <input
                      type="text"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-[1000px] p-2 mt-1 rounded-md border border-border 
                      bg-background text-foreground text-sm focus:ring-2 
                      focus:ring-primary focus:outline-none"
                    />
                  ) : (
                    <p className="font-medium truncate">
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
                  className="p-2 hover:bg-border-hover rounded-lg"
                >
                  <Pen className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Account Created</p>
              <p className="font-medium">
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </p>
            </div>
          </section>

          <section className="bg-background-alt rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-lg bg-foreground text-background px-4 py-2 font-medium hover:bg-border-hover"
            >
              Change Password
            </button>
          </section>
        </div>

        {statusMessage && (
          <p className="text-sm text-blue-500">{statusMessage}</p>
        )}
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background-alt rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mb-3 p-2 rounded-md border border-border 
                bg-background text-foreground text-sm focus:ring-2 
                focus:ring-primary focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 p-2 rounded-md border border-border 
                bg-background text-foreground text-sm focus:ring-2 
                focus:ring-primary focus:outline-none"
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
