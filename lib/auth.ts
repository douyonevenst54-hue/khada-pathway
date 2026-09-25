import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "crypto";
import { db } from "./db";

const COOKIE = "kp_nav";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "");

export async function signSession(email: string) {
  return new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret());
}

/** Returns the logged-in navigator, or null. Use in server components and route handlers. */
export async function getNavigator() {
  const jar = await cookies();
  const jwt = jar.get(COOKIE)?.value;
  if (!jwt || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(jwt, secret());
    const email = String(payload.email ?? "");
    const nav = await db.navigator.findUnique({ where: { email } });
    return nav && nav.active ? nav : null;
  } catch {
    return null;
  }
}

export const cookieName = COOKIE;

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

/** Creates a one-time login token (20 min) and returns the raw token to put in the link. */
export async function createLoginToken(email: string) {
  const raw = randomBytes(32).toString("hex");
  await db.loginToken.create({ data: { tokenHash: hashToken(raw), email, expiresAt: new Date(Date.now() + 20 * 60_000) } });
  return raw;
}
