"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Users, UserPlus, Video, Trash2 } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { MOCK_USER_OPTIONS } from "@/lib/mockUsers";
import { getGroups, saveGroups, addMemberToGroup, removeMemberFromGroup, deleteGroup } from "@/lib/groups";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user: currentUser } = useUser();
  const { isAdmin } = useAuth();
  const [groups, setGroups] = useState<{ id: string; name: string; memberIds: string[]; ownerId?: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setGroups(getGroups());
    setMounted(true);
  }, []);

  const group = groups.find((g) => g.id === id);
  const nameMap = Object.fromEntries(MOCK_USER_OPTIONS.map((u) => [u.id, u.name]));
  const isOwner = !!currentUser && !!group && group.ownerId === currentUser.id;
  const canDeleteGroup = isAdmin || isOwner;

  const addMember = (userId: string) => {
    if (!group || !mounted) return;
    const updated = addMemberToGroup(group, userId);
    const next = groups.map((g) => (g.id === id ? updated : g));
    saveGroups(next);
    setGroups(next);
  };

  const removeMember = (userId: string) => {
    if (!group || !mounted) return;
    const updated = removeMemberFromGroup(group, userId);
    const next = groups.map((g) => (g.id === id ? updated : g));
    saveGroups(next);
    setGroups(next);
  };

  const handleDeleteGroup = () => {
    if (!group || !canDeleteGroup) return;
    if (!confirm("Delete this group? This cannot be undone.")) return;
    const next = deleteGroup(getGroups(), id, currentUser?.id ?? "", isAdmin);
    saveGroups(next);
    router.push("/groups");
  };

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
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-deep-200 bg-white p-6 dark:border-deep-700 dark:bg-deep-900/50 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-brand-500" />
                <h1 className="font-display text-2xl font-bold text-deep-900 dark:text-white">{group.name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={"/session/group/" + group.id} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600">
                  <Video className="h-4 w-4" /> Book group session
                </Link>
                {canDeleteGroup && (
                  <button
                    type="button"
                    onClick={handleDeleteGroup}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" /> Delete group
                  </button>
                )}
              </div>
            </div>
            <h2 className="mt-6 font-semibold text-deep-900 dark:text-white">Members</h2>
            <ul className="mt-2 space-y-2">
              {group.memberIds.map((mid) => (
                <li key={mid} className="flex items-center justify-between rounded-lg border border-deep-200 p-3 dark:border-deep-700">
                  <span className="font-medium text-deep-900 dark:text-white">{nameMap[mid] ?? "User " + mid}</span>
                  <button type="button" onClick={() => removeMember(mid)} className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30">Remove</button>
                </li>
              ))}
            </ul>
            <h2 className="mt-6 font-semibold text-deep-900 dark:text-white">Add member</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {MOCK_USER_OPTIONS.filter((u) => !group.memberIds.includes(u.id)).length === 0 ? (
                <p className="text-sm text-deep-500 dark:text-deep-400">No other users to add. Find people in Browse to add to groups.</p>
              ) : (
                MOCK_USER_OPTIONS.filter((u) => !group.memberIds.includes(u.id)).map((u) => (
                  <button key={u.id} type="button" onClick={() => addMember(u.id)} className="inline-flex items-center gap-2 rounded-lg border border-deep-300 px-3 py-2 text-sm font-medium text-deep-700 hover:bg-deep-100 dark:border-deep-600 dark:hover:bg-deep-800">
                    <UserPlus className="h-4 w-4" /> {u.name}
                  </button>
                ))
              )}
            </div>
            <p className="mt-6">
              <Link href="/groups" className="text-sm text-deep-500 hover:text-brand-500">Back to groups</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
