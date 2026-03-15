import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const DATA_DIR = join(process.cwd(), "data");
const USERS_FILE = join(DATA_DIR, "users.enc");
const SALT_ROUNDS = 10;

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  name: string;
  surname: string;
  birthDate?: string;
  createdAt: string;
  /** ISO date; if set and in the future, user cannot log in (kicked/suspended) */
  suspendedUntil?: string;
};

type UserStore = { users: User[] };

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "skillswap-dev-key-32-bytes-long!!";
const KEY = scryptSync(ENCRYPTION_KEY, "salt", 32);

function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(":");
  if (!ivHex || !encryptedHex) return "{}";
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = createDecipheriv("aes-256-cbc", KEY, iv);
  return decipher.update(encrypted) + decipher.final("utf8");
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readUsers(): User[] {
  try {
    ensureDataDir();
    if (!existsSync(USERS_FILE)) {
      return [];
    }
    const raw = readFileSync(USERS_FILE, "utf8");
    const json = decrypt(raw);
    const data: UserStore = JSON.parse(json);
    return data.users || [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  ensureDataDir();
  const json = JSON.stringify({ users });
  const encrypted = encrypt(json);
  writeFileSync(USERS_FILE, encrypted, "utf8");
}

export function findUserByEmail(email: string): User | null {
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export function findUserByEmailOrUsername(emailOrUsername: string): User | null {
  const users = readUsers();
  const input = emailOrUsername.trim();
  const normalized = input.toLowerCase();
  return (
    users.find((u) => u.email.toLowerCase() === normalized) ??
    users.find((u) => u.username.toLowerCase() === normalized) ??
    null
  );
}

export function findUserById(id: string): User | null {
  const users = readUsers();
  return users.find((u) => u.id === id) ?? null;
}

export function listUsersSafe(): Array<{
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  createdAt: string;
  suspendedUntil?: string;
  isSuspended?: boolean;
}> {
  return readUsers().map((u) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    surname: u.surname,
    createdAt: u.createdAt,
    ...(u.suspendedUntil && { suspendedUntil: u.suspendedUntil, isSuspended: isUserSuspended(u) }),
  }));
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

function uniqueUsername(users: User[], base: string): string {
  const baseClean = base.replace(/[^a-z0-9]/gi, "").toLowerCase() || "user";
  let username = baseClean;
  let n = 1;
  while (users.some((u) => u.username.toLowerCase() === username)) {
    username = `${baseClean}${n++}`;
  }
  return username;
}

export async function createUser(params: {
  email: string;
  password: string;
  username?: string;
  name: string;
  surname: string;
  birthDate?: string;
}): Promise<User> {
  const users = readUsers();
  const normalized = params.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new Error("Email already registered");
  }
  const base = (params.username || normalized.split("@")[0] || "user").trim();
  const username = uniqueUsername(users, base);
  const passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);
  const user: User = {
    id: "u-" + Date.now() + "-" + randomBytes(4).toString("hex"),
    email: normalized,
    passwordHash,
    username,
    name: params.name.trim(),
    surname: params.surname.trim(),
    ...(params.birthDate && { birthDate: params.birthDate.trim() }),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export type UpdateUserParams = {
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  birthDate?: string | null;
  newPassword?: string;
};

export async function updateUser(
  userId: string,
  currentPassword: string,
  updates: UpdateUserParams
): Promise<User> {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) throw new Error("User not found");
  const user = users[index];
  const valid = await verifyPassword(user, currentPassword);
  if (!valid) throw new Error("Current password is incorrect");

  const next = { ...user };

  if (updates.name !== undefined) next.name = updates.name.trim();
  if (updates.surname !== undefined) next.surname = updates.surname.trim();

  if (updates.username !== undefined) {
    const u = updates.username.trim().toLowerCase();
    if (users.some((u2) => u2.id !== userId && u2.username.toLowerCase() === u))
      throw new Error("Username already taken");
    next.username = updates.username.trim();
  }

  if (updates.email !== undefined) {
    const e = updates.email.trim().toLowerCase();
    if (users.some((u2) => u2.id !== userId && u2.email.toLowerCase() === e))
      throw new Error("Email already registered");
    next.email = e;
  }

  if (updates.birthDate !== undefined) next.birthDate = updates.birthDate?.trim() || undefined;
  if (updates.newPassword !== undefined && updates.newPassword.length > 0) {
    next.passwordHash = await bcrypt.hash(updates.newPassword, SALT_ROUNDS);
  }

  users[index] = next;
  writeUsers(users);
  return next;
}

/** Admin-only: set or clear suspension. suspendedUntil = null to unsuspend. */
export function setUserSuspended(userId: string, suspendedUntil: string | null): void {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return;
  const next = { ...users[index], suspendedUntil: suspendedUntil ?? undefined };
  users[index] = next;
  writeUsers(users);
}

export function isUserSuspended(user: User): boolean {
  if (!user.suspendedUntil) return false;
  return new Date(user.suspendedUntil) > new Date();
}

export async function findOrCreateOAuthUser(params: {
  email: string;
  name?: string | null;
}): Promise<User> {
  const users = readUsers();
  const normalized = params.email.trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) return existing;

  const fullName = (params.name || "").trim();
  const [first = "Google", ...rest] = fullName.split(" ").filter(Boolean);
  const surname = rest.join(" ") || "User";
  const emailPrefix = normalized.split("@")[0] || "googleuser";
  let username = emailPrefix;
  let n = 1;
  while (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    username = `${emailPrefix}${n++}`;
  }

  const randomPassword = randomBytes(24).toString("hex");
  const passwordHash = await bcrypt.hash(randomPassword, SALT_ROUNDS);
  const user: User = {
    id: "u-" + Date.now() + "-" + randomBytes(4).toString("hex"),
    email: normalized,
    passwordHash,
    username,
    name: first,
    surname,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

const ADMIN_EMAIL = "kirtan.balipersad@gmail.com";
const ADMIN_PASSWORD = "admin.ssp";
const ADMIN_USERNAME = "Admin";

export async function ensureDefaultAdmin() {
  const users = readUsers();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = {
      ...users[existingIndex],
      passwordHash,
      username: ADMIN_USERNAME,
      name: ADMIN_USERNAME,
      surname: "",
    };
    writeUsers(users);
    return;
  }
  const admin: User = {
    id: "admin-1",
    email: ADMIN_EMAIL,
    passwordHash,
    username: ADMIN_USERNAME,
    name: ADMIN_USERNAME,
    surname: "",
    createdAt: new Date().toISOString(),
  };
  users.push(admin);
  writeUsers(users);
}
