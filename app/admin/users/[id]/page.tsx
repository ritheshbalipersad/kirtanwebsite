"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Settings, Mail, User, Lock, Calendar, Shield, ShieldOff, UserX, UserCheck } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";

type AdminUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  birthDate: string | null;
  createdAt: string;
  suspendedUntil: string | null;
  isSuspended: boolean;
  isAdmin: boolean;
};

const KICK_DURATIONS = [
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "permanent", label: "Permanent" },
] as const;

export default function AdminUserSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, mounted } = useAuth();
  const id = params?.id as string;
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [kickDuration, setKickDuration] = useState<string>("24h");

  const loadUser = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, mounted, router]);

  useEffect(() => {
    if (!mounted || !isAdmin || !id) return;
    setLoading(true);
    loadUser();
  }, [mounted, isAdmin, id, loadUser]);

  async function handleKick() {
    if (!id || !user) return;
    setActionLoading("kick");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: kickDuration }),
      });
      if (res.ok) await loadUser();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnsuspend() {
    if (!id) return;
    setActionLoading("unsuspend");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspendedUntil: null }),
      });
      if (res.ok) await loadUser();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMakeAdmin() {
    if (!id || !confirm("Make this user an admin? They will have full access.")) return;
    setActionLoading("make-admin");
    try {
      const res = await fetch(`/api/admin/users/${id}/make-admin`, { method: "POST" });
      if (res.ok) await loadUser();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemoveAdmin() {
    if (!id || !confirm("Remove admin rights from this user? They will lose admin access.")) return;
    setActionLoading("remove-admin");
    try {
      const res = await fetch(`/api/admin/users/${id}/remove-admin`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) await loadUser();
      else if (data.error) alert(data.error);
    } finally {
      setActionLoading(null);
    }
  }

  if (!mounted || !isAdmin) return null;
  if (!loading && !user) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center">
          <p className="text-deep-600 dark:text-deep-400">User not found.</p>
          <Link href="/admin/users" className="mt-4 inline-block text-brand-500 hover:underline">Back to users</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="flex items-center gap-3 text-brand-500">
            <Settings className="h-8 w-8" />
            <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Account settings</h1>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">Admin view</span>
          </div>
          {loading && (
            <p className="mt-2 text-deep-600 dark:text-deep-400">Loading user...</p>
          )}
          {!loading && user && (
            <>
          <p className="mt-2 text-deep-600 dark:text-deep-400">
            {user.name} (ID: {id}) — admin access only.
            {user.isAdmin && (
              <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">Admin</span>
            )}
            {user.isSuspended && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/50 dark:text-red-200">
                Suspended until {user.suspendedUntil ? new Date(user.suspendedUntil).toLocaleString() : "—"}
              </span>
            )}
          </p>
          <div className="mt-6 rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-deep-500" />
                <div>
                  <p className="text-sm text-deep-500 dark:text-deep-400">Display name</p>
                  <p className="font-medium text-deep-900 dark:text-white">{user.name} {user.surname}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-deep-500" />
                <div>
                  <p className="text-sm text-deep-500 dark:text-deep-400">Email</p>
                  <p className="font-medium text-deep-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-deep-500" />
                <div>
                  <p className="text-sm text-deep-500 dark:text-deep-400">Username</p>
                  <p className="font-medium text-deep-900 dark:text-white">{user.username}</p>
                </div>
              </div>
              {user.birthDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-deep-500" />
                  <div>
                    <p className="text-sm text-deep-500 dark:text-deep-400">Birth date</p>
                    <p className="font-medium text-deep-900 dark:text-white">{user.birthDate}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-deep-500 dark:text-deep-400">Joined</p>
                <p className="font-medium text-deep-900 dark:text-white">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50">
            <h2 className="font-display text-lg font-semibold text-deep-900 dark:text-white">Admin actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {user.isSuspended ? (
                <button
                  type="button"
                  onClick={handleUnsuspend}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <UserCheck className="h-4 w-4" /> Unsuspend
                </button>
              ) : (
                <div className="inline-flex flex-wrap items-center gap-2">
                  <select
                    value={kickDuration}
                    onChange={(e) => setKickDuration(e.target.value)}
                    className="rounded-lg border border-deep-300 bg-white px-3 py-2 text-deep-900 dark:border-deep-600 dark:bg-deep-800 dark:text-white"
                  >
                    {KICK_DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleKick}
                    disabled={!!actionLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                  >
                    <UserX className="h-4 w-4" /> Kick user
                  </button>
                </div>
              )}
              {user.isAdmin ? (
                <button
                  type="button"
                  onClick={handleRemoveAdmin}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-deep-900 dark:text-red-300 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  <ShieldOff className="h-4 w-4" /> Remove admin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleMakeAdmin}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  <Shield className="h-4 w-4" /> Make admin
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/message/${id}`} className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">View private chat</Link>
            <Link href="/admin/users" className="rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">Back to users</Link>
          </div>
          <p className="mt-6">
            <Link href="/admin" className="text-sm text-deep-500 hover:text-brand-500">Dashboard</Link>
          </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
