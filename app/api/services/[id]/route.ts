import { NextRequest, NextResponse } from "next/server";
import { findServiceByUserId, getServiceWithUser } from "@/lib/services";
import { findUserById } from "@/lib/user-store";
import { isAdminEmail } from "@/lib/admin-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = findUserById(id);
  if (user && isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const service = findServiceByUserId(id);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  const withUser = getServiceWithUser(service);
  return NextResponse.json({ service: withUser });
}
