import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { findUserById } from "./user-store";
import { isAdminEmail } from "./admin-server";

const DATA_DIR = join(process.cwd(), "data");
const SERVICES_FILE = join(DATA_DIR, "services.json");

export type Service = {
  userId: string;
  tagline: string;
  offers: string[];
  wants: string[];
  location: string;
  paidPrice: number | null;
  level: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
};

type ServiceStore = { services: Service[] };

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readServices(): Service[] {
  try {
    ensureDataDir();
    if (!existsSync(SERVICES_FILE)) {
      return [];
    }
    const raw = readFileSync(SERVICES_FILE, "utf8");
    const data: ServiceStore = JSON.parse(raw);
    return data.services || [];
  } catch {
    return [];
  }
}

function writeServices(services: Service[]) {
  ensureDataDir();
  writeFileSync(SERVICES_FILE, JSON.stringify({ services }, null, 2), "utf8");
}

export function findServiceByUserId(userId: string): Service | null {
  return readServices().find((s) => s.userId === userId) ?? null;
}

export function getServiceWithUser(service: Service) {
  const user = findUserById(service.userId);
  const name = user ? `${user.name} ${user.surname}`.trim() || user.username : "User";
  return {
    id: service.userId,
    name,
    tagline: service.tagline,
    offers: service.offers,
    wants: service.wants,
    location: service.location,
    paidPrice: service.paidPrice,
    level: service.level,
    bio: service.bio,
    rating: 0,
    reviews: 0,
    premiumMonths: 0,
    trustedCount: 0,
    sessionsCount: 0,
  };
}

export function listServicesForBrowse() {
  const services = readServices();
  return services
    .filter((s) => {
      const user = findUserById(s.userId);
      return !user || !isAdminEmail(user.email);
    })
    .map((s) => getServiceWithUser(s));
}

export function upsertService(
  userId: string,
  data: {
    tagline: string;
    offers: string[];
    wants: string[];
    location: string;
    paidPrice: number | null;
    level: string;
    bio: string;
  }
): Service {
  const services = readServices();
  const now = new Date().toISOString();
  const existing = services.findIndex((s) => s.userId === userId);
  const service: Service = {
    userId,
    tagline: data.tagline.trim(),
    offers: data.offers.map((x) => x.trim()).filter(Boolean),
    wants: data.wants.map((x) => x.trim()).filter(Boolean),
    location: data.location.trim(),
    paidPrice: data.paidPrice != null && data.paidPrice > 0 ? data.paidPrice : null,
    level: data.level.trim() || "Beginner",
    bio: data.bio.trim(),
    createdAt: existing >= 0 ? services[existing].createdAt : now,
    updatedAt: now,
  };
  if (existing >= 0) {
    services[existing] = service;
  } else {
    services.push(service);
  }
  writeServices(services);
  return service;
}

export function deleteServiceByUserId(userId: string): boolean {
  const services = readServices();
  const filtered = services.filter((s) => s.userId !== userId);
  if (filtered.length === services.length) return false;
  writeServices(filtered);
  return true;
}
