import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getCookieName } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { ensureDefaultAdmin, findOrCreateOAuthUser, findUserById, isUserSuspended } from "@/lib/user-store";

export async function GET(request: NextRequest) {
  await ensureDefaultAdmin();
  const token = request.cookies.get(getCookieName())?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      const stored = findUserById(payload.userId);
      if (stored && isUserSuspended(stored)) {
        const res = NextResponse.json({ user: null, error: "Account suspended" }, { status: 403 });
        res.cookies.set(getCookieName(), "", { maxAge: 0, path: "/" });
        return res;
      }
      return NextResponse.json({
        user: stored
          ? {
              id: stored.id,
              email: stored.email,
              username: stored.username,
              name: stored.name,
              surname: stored.surname,
              birthDate: stored.birthDate ?? null,
            }
          : {
              id: payload.userId,
              email: payload.email,
              username: payload.username,
              name: payload.name,
              surname: payload.surname,
              birthDate: null,
            },
      });
    }
    const res = NextResponse.json({ user: null });
    res.cookies.set(getCookieName(), "", { maxAge: 0, path: "/" });
    return res;
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ user: null });
  }
  const stored = await findOrCreateOAuthUser({
    email: session.user.email,
    name: session.user.name,
  });
  if (isUserSuspended(stored)) {
    return NextResponse.json({ user: null, error: "Account suspended" }, { status: 403 });
  }
  return NextResponse.json({
    user: {
      id: stored.id,
      email: stored.email,
      username: stored.username,
      name: stored.name,
      surname: stored.surname,
      birthDate: stored.birthDate ?? null,
    },
  });
}
