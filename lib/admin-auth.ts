import { NextRequest } from "next/server";
import { getCookieName, verifyToken } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function isRequestAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getCookieName())?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.email && isAdminEmail(payload.email)) return true;
  }

  // Fallback for NextAuth sessions (e.g. Google login)
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  return !!(email && isAdminEmail(email));
}
