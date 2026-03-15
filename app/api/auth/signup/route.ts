import { NextRequest, NextResponse } from "next/server";
import { createUser, ensureDefaultAdmin } from "@/lib/user-store";
import { createToken, getCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await ensureDefaultAdmin();
    const body = await request.json();
    const { email, password, username, name, surname, birthDate } = body;
    const adminEmail = "kirtan.balipersad@gmail.com";
    const isAdminEmail = String(email).trim().toLowerCase() === adminEmail;
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password and name required" }, { status: 400 });
    }
    if (!isAdminEmail && !surname) {
      return NextResponse.json({ error: "Surname required" }, { status: 400 });
    }
    const user = await createUser({ email, password, username, name, surname: (surname ?? "").trim(), birthDate });
    const token = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      surname: user.surname,
    });
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, username: user.username, name: user.name, surname: user.surname },
    });
    res.cookies.set(getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
