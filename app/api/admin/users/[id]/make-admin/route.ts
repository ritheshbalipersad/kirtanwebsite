import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultAdmin, findUserById } from "@/lib/user-store";
import { isRequestAdmin } from "@/lib/admin-auth";
import { addAdminEmail } from "@/lib/admin-server";

export async function POST(
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
  addAdminEmail(user.email);
  return NextResponse.json({ ok: true, isAdmin: true });
}
