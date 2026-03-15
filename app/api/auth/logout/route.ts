import { NextResponse } from "next/server";
import { getCookieName } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(getCookieName(), "", { maxAge: 0, path: "/" });
  return res;
}
