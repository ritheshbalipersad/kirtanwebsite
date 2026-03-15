import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { ADMIN_EMAILS } from "./admin";

const DATA_DIR = join(process.cwd(), "data");
const ADMIN_EMAILS_FILE = join(DATA_DIR, "admin-emails.json");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAdminEmailsFromFile(): string[] {
  try {
    ensureDataDir();
    if (!existsSync(ADMIN_EMAILS_FILE)) return [...ADMIN_EMAILS];
    const raw = readFileSync(ADMIN_EMAILS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((e: unknown) => String(e).trim().toLowerCase()).filter(Boolean)
      : [...ADMIN_EMAILS];
  } catch {
    return [...ADMIN_EMAILS];
  }
}

function writeAdminEmailsToFile(emails: string[]) {
  ensureDataDir();
  writeFileSync(ADMIN_EMAILS_FILE, JSON.stringify(emails, null, 2), "utf8");
}

/** Current list of admin emails (from file, or default). Server only. */
export function getAdminEmails(): string[] {
  return readAdminEmailsFromFile();
}

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return getAdminEmails().includes(normalized);
}

/** Add an email to the admin list (persisted). */
export function addAdminEmail(email: string): void {
  const normalized = email.trim().toLowerCase();
  const list = readAdminEmailsFromFile();
  if (list.includes(normalized)) return;
  list.push(normalized);
  writeAdminEmailsToFile(list);
}

/** Remove an email from the admin list (persisted). Fails if it would leave zero admins. */
export function removeAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const list = readAdminEmailsFromFile();
  const next = list.filter((e) => e !== normalized);
  if (next.length === 0) return false;
  writeAdminEmailsToFile(next);
  return true;
}
