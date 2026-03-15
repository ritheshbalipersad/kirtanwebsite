import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createToken, getCookieName } from "@/lib/auth";
import { updateUser } from "@/lib/user-store";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(getCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = body.currentPassword;
    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json({ error: "Current password is required to make changes" }, { status: 400 });
    }

    const updates: {
      name?: string;
      surname?: string;
      username?: string;
      email?: string;
      birthDate?: string | null;
      newPassword?: string;
    } = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.surname !== undefined) updates.surname = String(body.surname).trim();
    if (body.username !== undefined) updates.username = String(body.username).trim();
    if (body.email !== undefined) updates.email = String(body.email).trim();
    if (body.birthDate !== undefined) updates.birthDate = body.birthDate === "" || body.birthDate == null ? null : String(body.birthDate).trim();
    if (body.newPassword !== undefined && String(body.newPassword).trim().length > 0) updates.newPassword = String(body.newPassword).trim();

    const user = await updateUser(payload.userId, currentPassword, updates);

    const newToken = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      surname: user.surname,
    });
    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        surname: user.surname,
        birthDate: user.birthDate ?? null,
      },
    });
    res.cookies.set(getCookieName(), newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const status = message.includes("password") ? 401 : message.includes("already") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
