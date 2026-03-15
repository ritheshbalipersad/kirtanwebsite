import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "skillswap-jwt-secret-change-in-production";
const COOKIE_NAME = "skillswap_session";

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  name: string;
  surname: string;
};

export async function createToken(payload: SessionPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}
