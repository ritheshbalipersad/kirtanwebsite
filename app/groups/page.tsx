"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Plus, Trash2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { getGroups, saveGroups, deleteGroup } from "@/lib/groups";

export default function GroupsPage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { isAdmin } = useAuth();
  const [groups, setGroups] = useState<{ id: string; name: string; memberIds: string[]; ownerId?: string }[]>([]);

  useEffect(() => {
    setGroups(getGroups());
  }, []);

  const handleDelete = (groupId: string) => {
    const g = groups.find((x) => x.id === groupId);
    const canDelete = isAdmin || (currentUser && g?.ownerId === currentUser.id);
    if (!canDelete) return;
    if (!confirm("Delete this group? This cannot be undone.")) return;
    const next = deleteGroup(getGroups(), groupId, currentUser?.id ?? "", isAdmin);
    saveGroups(next);
    setGroups(next);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-deep-900 dark:text-white">Groups</h1>
            <Link href="/groups/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">
              <Plus className="h-4 w-4" /> New group
            </Link>
          </div>
          <p className="mt-2 text-deep-600 dark:text-deep-400">Create groups and book group sessions.</p>
          <div className="mt-8 space-y-4">
            {groups.length === 0 ? (
              <div className="rounded-xl border border-deep-200 bg-white p-8 text-center dark:border-deep-700 dark:bg-deep-900/50">
                <Users className="mx-auto h-12 w-12 text-deep-400" />
                <p className="mt-4 text-deep-600 dark:text-deep-400">No groups yet. Create one to get started.</p>
                <Link href="/groups/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">Create group</Link>
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-xl border border-deep-200 bg-white p-4 dark:border-deep-700 dark:bg-deep-900/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-brand-500" />
                    <div>
                      <p className="font-semibold text-deep-900 dark:text-white">{g.name}</p>
                      <p className="text-sm text-deep-500 dark:text-deep-400">{g.memberIds.length} member(s)</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={"/groups/" + g.id} className="rounded-lg border border-deep-300 px-4 py-2 text-sm font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">View</Link>
                    <Link href={"/session/group/" + g.id} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Book group session</Link>
                    {(isAdmin || (currentUser && g.ownerId === currentUser.id)) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(g.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
