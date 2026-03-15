import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultAdmin, listUsersSafe } from "@/lib/user-store";
import { isRequestAdmin } from "@/lib/admin-auth";
import { isAdminEmail } from "@/lib/admin-server";

export async function GET(request: NextRequest) {
  const admin = await isRequestAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await ensureDefaultAdmin();
  const list = listUsersSafe();
  const users = list.map((u) => ({ ...u, isAdmin: isAdminEmail(u.email) }));
  return NextResponse.json({ users });
}
