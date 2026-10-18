import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isoOf, normalizePhone, remindTimes, todayIso } from "@/lib/reminders";

/**
 * The person asks KHADA to remind them on WhatsApp about a letter's deadline.
 * Creates two reminders (7 days before, 1 day after) that navigators send from /navigator.
 * The deadline and sender come from the saved review, never from the browser.
 */
export async function POST(req: Request) {
  const parsed = z
    .object({ reviewId: z.string().min(1).max(40), phone: z.string().max(30), consent: z.literal(true) })
    .safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return NextResponse.json({ error: "bad_phone" }, { status: 400 });

  try {
    const review = await db.letterReview.findUnique({ where: { id: parsed.data.reviewId } });
    if (!review || !review.deadlineDate) return NextResponse.json({ error: "no_deadline" }, { status: 404 });
    const deadline = isoOf(review.deadlineDate);
    if (deadline < todayIso()) return NextResponse.json({ error: "deadline_passed" }, { status: 400 });

    const times = remindTimes(deadline);
    const base = { reviewId: review.id, phone, lang: review.lang, sender: review.sender, deadline: review.deadlineDate, note: review.deadlineNote };
    await db.reminder.createMany({
      data: [
        { ...base, kind: "before", remindAt: times.before },
        { ...base, kind: "after", remindAt: times.after },
      ],
      skipDuplicates: true,
    });
    if (!review.contact) await db.letterReview.update({ where: { id: review.id }, data: { contact: phone } });
    return NextResponse.json({ ok: true, deadline });
  } catch (e) {
    console.error("reminder create failed — run `npx prisma migrate deploy`?", (e as Error).message);
    return NextResponse.json({ error: "not_ready" }, { status: 503 });
  }
}
