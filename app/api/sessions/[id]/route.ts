import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const Body = z.object({
  stepKey: z.string().optional(),
  status: z.enum(["applied", "help", "approved", "denied", "stuck"]).optional(),
  contact: z.string().max(120).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const { stepKey, status, contact } = parsed.data;
  if (stepKey && status) {
    await db.stepStatus.upsert({
      where: { sessionId_stepKey: { sessionId: id, stepKey } },
      create: { sessionId: id, stepKey, status },
      update: { status },
    });
  }
  if (contact !== undefined) await db.session.update({ where: { id }, data: { contact } });
  return NextResponse.json({ ok: true });
}
