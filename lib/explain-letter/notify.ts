import { db } from "@/lib/db";

/** Belt-and-braces: strip anything that looks like an SSN or a long ID/account number before saving. */
export function redact(s: string): string {
  return s
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[nimewo kache]")
    .replace(/\b\d{9,}\b/g, "[nimewo kache]");
}

/**
 * E-mails every active navigator about a letter that needs a human now
 * (red-flag words, or urgency "high"). Contains no letter content — only a link to /navigator.
 * Falls back to the server log when RESEND_API_KEY is not set (local dev).
 */
export async function alertNavigators(reviewId: string, reason: "red_flag" | "high_urgency") {
  const navs = await db.navigator.findMany({ where: { active: true }, select: { email: true } });
  const link = `${process.env.APP_URL ?? "http://localhost:3000"}/navigator#letters`;
  const subject =
    reason === "red_flag"
      ? "URGENT: possible emergency in a letter request — KHADA Pathway"
      : "Urgent letter needs review — KHADA Pathway";
  const text =
    (reason === "red_flag"
      ? "Someone using “Eksplike lèt mwen” typed words that may signal an emergency. They were shown the 911 / 988 message.\n"
      : "A letter was explained with HIGH urgency (deadline soon, benefits ending, or a denial).\n") +
    `\nReview it here: ${link}\nReference: ${reviewId}\n`;

  if (!process.env.RESEND_API_KEY || navs.length === 0) {
    console.log(`\n[letter alert:${reason}] ${reviewId} → ${navs.map((n) => n.email).join(", ") || "(no navigators)"}\n`);
    return;
  }
  const { Resend } = await import("resend");
  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.EMAIL_FROM ?? "KHADA Pathway <onboarding@resend.dev>",
    to: navs.map((n) => n.email),
    subject,
    text,
  });
}
