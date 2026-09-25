import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookieName, hashToken, signSession } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("token") ?? "";
  const base = process.env.APP_URL ?? url.origin;
  if (!raw) return NextResponse.redirect(`${base}/navigator?err=1`);

  const tok = await db.loginToken.findUnique({ where: { tokenHash: hashToken(raw) } });
  if (!tok || tok.usedAt || tok.expiresAt < new Date()) return NextResponse.redirect(`${base}/navigator?err=1`);

  await db.loginToken.update({ where: { id: tok.id }, data: { usedAt: new Date() } });
  const res = NextResponse.redirect(`${base}/navigator`);
  res.cookies.set(cookieName, await signSession(tok.email), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 24 * 3600,
  });
  return res;
}
