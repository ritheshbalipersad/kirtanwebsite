import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getCookieName } from "@/lib/auth";
import { listServicesForBrowse, upsertService, deleteServiceByUserId } from "@/lib/services";

export async function GET() {
  const list = listServicesForBrowse();
  return NextResponse.json({ services: list });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(getCookieName())?.value;
  if (!token) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  const body = await request.json();
  const { tagline, offers, wants, location, paidPrice, level, bio } = body;
  if (!tagline || !Array.isArray(offers)) {
    return NextResponse.json({ error: "Tagline and at least one skill offered are required" }, { status: 400 });
  }
  const service = upsertService(payload.userId, {
    tagline: String(tagline).trim(),
    offers: offers.map(String).filter(Boolean),
    wants: Array.isArray(wants) ? wants.map(String).filter(Boolean) : [],
    location: String(location || "").trim(),
    paidPrice: paidPrice != null && Number(paidPrice) > 0 ? Number(paidPrice) : null,
    level: String(level || "Beginner").trim(),
    bio: String(bio || "").trim(),
  });
  return NextResponse.json({ success: true, service });
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(getCookieName())?.value;
  if (!token) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  const deleted = deleteServiceByUserId(payload.userId);
  if (!deleted) return NextResponse.json({ error: "No service to delete" }, { status: 404 });
  return NextResponse.json({ success: true });
}
