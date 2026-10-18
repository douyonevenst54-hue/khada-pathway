import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";

/** Navigator records what happened with a reminder: sent, check-in outcome, or stop. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const nav = await getNavigator();
  if (!nav) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = z.object({ action: z.enum(["sent", "done", "help", "no_answer", "stop"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const { action } = parsed.data;

  const rem = await db.reminder.findUnique({ where: { id } });
  if (!rem) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (action === "stop") {
    // Person replied STOP: cancel every reminder still waiting for this letter.
    await db.reminder.updateMany({ where: { reviewId: rem.reviewId, status: "pending" }, data: { status: "cancelled" } });
  } else if (action === "sent") {
    await db.reminder.update({ where: { id }, data: { status: "sent", sentAt: new Date(), sentBy: nav.email } });
  } else {
    await db.reminder.update({
      where: { id },
      data: { status: "sent", sentAt: rem.sentAt ?? new Date(), sentBy: rem.sentBy ?? nav.email, outcome: action },
    });
  }
  return NextResponse.json({ ok: true });
}
