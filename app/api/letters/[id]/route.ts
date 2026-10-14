import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";

/** Navigator marks a letter explanation as reviewed, with an optional note (e.g. "AI got the date wrong"). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const nav = await getNavigator();
  if (!nav) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = z
    .object({ note: z.string().max(500).optional(), aiCorrect: z.boolean().optional() })
    .safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const { note, aiCorrect } = parsed.data;
  const prefix = aiCorrect === false ? "[AI wrong] " : aiCorrect === true ? "[AI ok] " : "";
  await db.letterReview.update({
    where: { id },
    data: { status: "done", reviewedAt: new Date(), reviewedBy: nav.email, reviewNote: (prefix + (note ?? "")).trim() || null },
  });
  return NextResponse.json({ ok: true });
}
