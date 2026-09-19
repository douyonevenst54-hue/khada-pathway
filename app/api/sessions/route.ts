import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getPathway } from "@/lib/pathways";

const Body = z.object({
  pathwayId: z.string(),
  lang: z.enum(["ht", "en"]),
  answers: z.record(z.union([z.number(), z.string()])),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const { pathwayId, lang, answers } = parsed.data;
  const p = getPathway(pathwayId);
  if (!p) return NextResponse.json({ error: "unknown pathway" }, { status: 404 });
  const zip = String(answers.zip ?? "");
  if (!/^\d{5}$/.test(zip)) return NextResponse.json({ error: "zip" }, { status: 400 });

  const { zip: _z, ...rest } = answers;
  const planKeys = p.plan(answers);
  const s = await db.session.create({ data: { pathwayId, lang, zip, answers: rest, planKeys } });
  const d = (n: number) => new Date(Date.now() + n * 864e5);
  await db.followUp.createMany({ data: [{ sessionId: s.id, dueAt: d(7) }, { sessionId: s.id, dueAt: d(30) }] });
  return NextResponse.json({ id: s.id });
}
