export type Group = { id: string; name: string; memberIds: string[]; ownerId?: string };
const KEY = "skillswap_groups";

export function getGroups(): Group[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGroups(groups: Group[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(groups));
}

export function createGroup(name: string, memberIds: string[], ownerId: string): Group {
  return { id: "g-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9), name, memberIds, ownerId };
}

export function deleteGroup(groups: Group[], groupId: string, userId: string, isAdmin?: boolean): Group[] {
  const g = groups.find((x) => x.id === groupId);
  if (!g) return groups;
  if (!isAdmin && g.ownerId !== userId) return groups;
  return groups.filter((x) => x.id !== groupId);
}

export function addMemberToGroup(group: Group, userId: string): Group {
  return group.memberIds.includes(userId) ? group : { ...group, memberIds: [...group.memberIds, userId] };
}

export function removeMemberFromGroup(group: Group, userId: string): Group {
  return { ...group, memberIds: group.memberIds.filter((id) => id !== userId) };
}
