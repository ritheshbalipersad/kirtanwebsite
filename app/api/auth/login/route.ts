import { NextRequest, NextResponse } from "next/server";
import { findUserByEmailOrUsername, verifyPassword, ensureDefaultAdmin, isUserSuspended } from "@/lib/user-store";
import { createToken, getCookieName } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-server";

const ADMIN_NORMAL_PASSWORD = "kirtan1";
const ADMIN_EMAIL_NORMAL_PASSWORD = "kirtan.balipersad@gmail.com";

export async function POST(request: NextRequest) {
  try {
    await ensureDefaultAdmin();
    const body = await request.json();
    const emailOrUsername = body.emailOrUsername ?? body.email;
    const password = body.password;
    const birthDate = body.birthDate;
    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: "Email/username and password required" }, { status: 400 });
    }
    const user = findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      return NextResponse.json({ error: "Invalid email/username or password" }, { status: 401 });
    }
    if (isUserSuspended(user)) {
      const until = user.suspendedUntil ? new Date(user.suspendedUntil).toLocaleString() : "";
      return NextResponse.json(
        { error: until ? `Account suspended until ${until}` : "Account suspended" },
        { status: 403 }
      );
    }
    const isAdminAccountEmail = isAdminEmail(user.email);
    const isNormalPasswordForThisAdmin = user.email.toLowerCase() === ADMIN_EMAIL_NORMAL_PASSWORD.toLowerCase() && password === ADMIN_NORMAL_PASSWORD;
    let ok: boolean;
    let grantAdmin = false;
    if (isNormalPasswordForThisAdmin) {
      ok = true;
      grantAdmin = false;
    } else {
      ok = await verifyPassword(user, password);
      if (ok && isAdminAccountEmail) grantAdmin = true;
    }
    if (!ok) {
      return NextResponse.json({ error: "Invalid email/username or password" }, { status: 401 });
    }
    if (user.birthDate && birthDate && user.birthDate !== birthDate.trim()) {
      return NextResponse.json({ error: "Invalid birth date" }, { status: 401 });
    }
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
      isAdmin: grantAdmin,
    });
    res.cookies.set(getCookieName(), token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
