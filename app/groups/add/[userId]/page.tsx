"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UserPlus, Users } from "lucide-react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { MOCK_USER_OPTIONS } from "@/lib/mockUsers";
import { getGroups, saveGroups, addMemberToGroup } from "@/lib/groups";

export default function AddToGroupPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const [groups, setGroups] = useState<{ id: string; name: string; memberIds: string[] }[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setGroups(getGroups());
    setMounted(true);
  }, []);

  const name = MOCK_USER_OPTIONS.find((u) => u.id === userId)?.name ?? "User";

  const addToGroup = (group: { id: string; name: string; memberIds: string[] }) => {
    if (!mounted || !userId) return;
    const updated = addMemberToGroup(group, userId);
    const next = groups.map((g) => (g.id === group.id ? updated : g));
    saveGroups(next);
    router.push("/groups/" + group.id);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-brand-500">
              <UserPlus className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Add to group</h1>
            </div>
            <p className="mt-2 text-deep-600 dark:text-deep-400">Choose a group to add {name} to.</p>
            <div className="mt-6 space-y-2">
              {groups.length === 0 ? (
                <p className="text-deep-500 dark:text-deep-400">No groups yet. Create one first.</p>
              ) : (
                groups.map((g) => (
                  <div key={g.id} className="flex items-center justify-between rounded-lg border border-deep-200 p-3 dark:border-deep-700">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-deep-500" />
                      <span className="font-medium text-deep-900 dark:text-white">{g.name}</span>
                      <span className="text-sm text-deep-500">({g.memberIds.length} members)</span>
                    </div>
                    <button type="button" onClick={() => addToGroup(g)} className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600">Add</button>
                  </div>
                ))
              )}
            </div>
            <p className="mt-6">
              <Link href={"/profile/" + userId} className="text-sm text-deep-500 hover:text-brand-500">Back to profile</Link>
              <span className="mx-2 text-deep-400">|</span>
              <Link href="/groups" className="text-sm text-deep-500 hover:text-brand-500">Groups</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
