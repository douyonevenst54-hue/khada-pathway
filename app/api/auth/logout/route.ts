import { NextResponse } from "next/server";
import { cookieName } from "@/lib/auth";

export async function POST(req: Request) {
  const base = process.env.APP_URL ?? new URL(req.url).origin;
  const res = NextResponse.redirect(`${base}/navigator`, 303);
  res.cookies.set(cookieName, "", { path: "/", maxAge: 0 });
  return res;
}
