"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Video, Users } from "lucide-react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { getGroups } from "@/lib/groups";
import { MOCK_USER_OPTIONS } from "@/lib/mockUsers";

export default function GroupSessionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [group, setGroup] = useState<{ id: string; name: string; memberIds: string[] } | null>(null);

  useEffect(() => {
    const groups = getGroups();
    setGroup(groups.find((g) => g.id === id) ?? null);
  }, [id]);

  const nameMap = Object.fromEntries(MOCK_USER_OPTIONS.map((u) => [u.id, u.name]));

  if (!group) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center">
          <p className="text-deep-600 dark:text-deep-400">Group not found.</p>
          <Link href="/groups" className="mt-4 inline-block text-brand-500 hover:underline">Back to groups</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex items-center gap-3 text-brand-500">
              <Video className="h-8 w-8" />
              <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">Group session: {group.name}</h1>
            </div>
            <p className="mt-2 text-deep-600 dark:text-deep-400">Participants in this group session.</p>
            <ul className="mt-6 space-y-2">
              {group.memberIds.map((mid) => (
                <li key={mid} className="flex items-center gap-3 rounded-lg border border-deep-200 p-3 dark:border-deep-700">
                  <Users className="h-5 w-5 text-deep-500" />
                  <span className="font-medium text-deep-900 dark:text-white">{nameMap[mid] ?? "User " + mid}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Link href={"/groups/" + group.id} className="rounded-lg border border-deep-300 px-4 py-2.5 font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">Back to group</Link>
              <Link href="/login" className="inline-block rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">Start session (sign in required)</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
