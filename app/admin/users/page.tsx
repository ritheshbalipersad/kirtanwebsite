"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Users, Settings } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

type AdminUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  createdAt: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  suspendedUntil?: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin, mounted } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, mounted, router]);

  useEffect(() => {
    if (!mounted || !isAdmin) return;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users ?? []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mounted, isAdmin]);

  if (!mounted || !isAdmin) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center gap-3 text-brand-500">
            <Shield className="h-8 w-8" />
            <h1 className="font-display text-3xl font-bold text-deep-900 dark:text-white">User accounts</h1>
          </div>
          <p className="mt-2 text-deep-600 dark:text-deep-400">View account settings and private chats. Admin only.</p>
          <ul className="mt-8 space-y-3">
            {!loading && users.length === 0 && (
              <li className="rounded-xl border border-deep-200 bg-white p-4 text-deep-600 dark:border-deep-700 dark:bg-deep-900/50 dark:text-deep-300">
                No registered users found yet.
              </li>
            )}
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between rounded-xl border border-deep-200 bg-white p-4 dark:border-deep-700 dark:bg-deep-900/50">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-deep-500" />
                  <span className="font-medium text-deep-900 dark:text-white">{u.name} {u.surname}</span>
                  <span className="text-sm text-deep-500">{u.email}</span>
                  <span className="text-sm text-deep-500">ID: {u.id}</span>
                  {u.isAdmin && (
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">Admin</span>
                  )}
                  {u.isSuspended && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/50 dark:text-red-200">Suspended</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/users/${u.id}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600">
                    <Settings className="h-4 w-4" /> Account settings
                  </Link>
                  <Link href={`/message/${u.id}`} className="inline-flex items-center gap-2 rounded-lg border border-deep-300 px-3 py-2 text-sm font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">
                    Private chat
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/admin" className="text-sm text-deep-500 hover:text-brand-500">Back to dashboard</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
