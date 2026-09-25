import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createLoginToken } from "@/lib/auth";

export async function POST(req: Request) {
  const parsed = z.object({ email: z.string().email() }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ ok: true }); // never reveal whether an email exists
  const email = parsed.data.email.toLowerCase().trim();
  const nav = await db.navigator.findUnique({ where: { email } });
  if (!nav || !nav.active) return NextResponse.json({ ok: true });

  const raw = await createLoginToken(email);
  const link = `${process.env.APP_URL ?? "http://localhost:3000"}/api/auth/verify?token=${raw}`;

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM ?? "KHADA Pathway <onboarding@resend.dev>",
      to: email,
      subject: "Your KHADA Pathway sign-in link",
      text: `Hi ${nav.name},\n\nClick to sign in (valid 20 minutes):\n${link}\n\nIf you didn't request this, ignore this email.`,
    });
  } else {
    console.log(`\n[navigator login] ${email}\n${link}\n`);
  }
  return NextResponse.json({ ok: true });
}
