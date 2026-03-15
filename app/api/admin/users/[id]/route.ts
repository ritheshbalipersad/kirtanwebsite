import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultAdmin, findUserById, setUserSuspended, isUserSuspended } from "@/lib/user-store";
import { isRequestAdmin } from "@/lib/admin-auth";
import { isAdminEmail } from "@/lib/admin-server";

function parseDuration(duration: string): Date | null {
  const d = (duration || "").trim().toLowerCase();
  const now = new Date();
  if (d === "1h") return new Date(now.getTime() + 60 * 60 * 1000);
  if (d === "24h" || d === "1d") return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  if (d === "7d") return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (d === "30d") return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (d === "permanent") return new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await isRequestAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await ensureDefaultAdmin();
  const { id } = await context.params;
  const user = findUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate ?? null,
      createdAt: user.createdAt,
      suspendedUntil: user.suspendedUntil ?? null,
      isSuspended: isUserSuspended(user),
      isAdmin: isAdminEmail(user.email),
    },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await isRequestAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await ensureDefaultAdmin();
  const { id } = await context.params;
  const user = findUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));
  const suspendedUntil = body.suspendedUntil;
  const duration = body.duration;

  if (suspendedUntil === null || suspendedUntil === "") {
    setUserSuspended(id, null);
    return NextResponse.json({ ok: true, suspendedUntil: null });
  }
  if (typeof suspendedUntil === "string") {
    const date = new Date(suspendedUntil);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid suspendedUntil date" }, { status: 400 });
    }
    setUserSuspended(id, date.toISOString());
    return NextResponse.json({ ok: true, suspendedUntil: date.toISOString() });
  }
  if (duration) {
    const until = parseDuration(duration);
    if (!until) {
      return NextResponse.json(
        { error: "Invalid duration. Use: 1h, 24h, 7d, 30d, permanent" },
        { status: 400 }
      );
    }
    setUserSuspended(id, until.toISOString());
    return NextResponse.json({ ok: true, suspendedUntil: until.toISOString() });
  }
  return NextResponse.json({ error: "Provide suspendedUntil or duration" }, { status: 400 });
}
