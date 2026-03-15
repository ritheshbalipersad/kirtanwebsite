import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getCookieName } from "@/lib/auth";
import { findServiceByUserId, getServiceWithUser } from "@/lib/services";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getCookieName())?.value;
  if (!token) return NextResponse.json({ service: null });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ service: null });
  const service = findServiceByUserId(payload.userId);
  if (!service) return NextResponse.json({ service: null });
  return NextResponse.json({ service: getServiceWithUser(service) });
}
