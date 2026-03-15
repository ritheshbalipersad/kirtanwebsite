"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useUser } from "../../context/UserContext";
import { MOCK_USER_OPTIONS } from "@/lib/mockUsers";
import { getGroups, createGroup, saveGroups } from "@/lib/groups";

export default function NewGroupPage() {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mounted || !user) return;
    const groups = getGroups();
    const newGroup = createGroup(name.trim(), selectedIds, user.id);
    saveGroups([...groups, newGroup]);
    router.push(`/groups/${newGroup.id}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-brand-500">
              <Users className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Create group</h1>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Group name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white" placeholder="e.g. Design team" />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 dark:text-deep-300">Add members</label>
                <div className="mt-2 space-y-2">
                  {MOCK_USER_OPTIONS.length === 0 ? (
                    <p className="text-sm text-deep-500 dark:text-deep-400">No other users to add yet. You can create the group and add members later from Browse.</p>
                  ) : (
                    MOCK_USER_OPTIONS.map((u) => (
                      <label key={u.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-deep-200 p-3 dark:border-deep-700">
                        <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggle(u.id)} className="h-4 w-4 rounded border-deep-300 text-brand-500 focus:ring-brand-500" />
                        <span className="font-medium text-deep-900 dark:text-white">{u.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/groups" className="rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">Cancel</Link>
                <button type="submit" disabled={!user} className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50">Create group</button>
              </div>
              {!user && <p className="text-sm text-deep-500 dark:text-deep-400">Sign in to create a group.</p>}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
