import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getNavigator())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = z.object({ outcome: z.string().max(500).optional() }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
  await db.followUp.update({ where: { id }, data: { doneAt: new Date(), outcome: parsed.data.outcome } });
  return NextResponse.json({ ok: true });
}
