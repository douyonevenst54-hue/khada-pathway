import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";
import { LANGS, dollarsToCents, todayIso } from "@/lib/impact";

const hours = z.coerce.number().min(0).max(10_000).catch(0);
const opt = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : null));

const Body = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  programId: z.string().min(1),
  title: z.string().trim().min(2).max(120),
  peopleServed: z.coerce.number().int().min(0).max(1_000_000).catch(0),
  volunteerHours: hours,
  staffHours: hours,
  cost: z.unknown().optional(),
  inKind: z.unknown().optional(),
  zip: z.string().trim().regex(/^\d{5}$/).optional().or(z.literal("")).transform((v) => v || null),
  lang: z.string().optional().transform((v) => (v && v in LANGS ? v : null)),
  partner: opt(120),
  note: opt(2000),
});

export async function POST(req: Request) {
  const nav = await getNavigator();
  if (!nav) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the date, program and title." }, { status: 400 });
  const d = parsed.data;
  if (d.date > todayIso()) return NextResponse.json({ error: "Log activities after they happen, not before." }, { status: 400 });
  const program = await db.program.findUnique({ where: { id: d.programId } });
  if (!program) return NextResponse.json({ error: "Program not found." }, { status: 400 });

  const a = await db.activity.create({
    data: {
      date: new Date(`${d.date}T00:00:00Z`),
      programId: d.programId,
      title: d.title,
      peopleServed: d.peopleServed,
      volunteerHours: d.volunteerHours,
      staffHours: d.staffHours,
      costCents: dollarsToCents(d.cost),
      inKindCents: dollarsToCents(d.inKind),
      zip: d.zip,
      lang: d.lang,
      partner: d.partner,
      note: d.note,
      loggedBy: nav.name,
    },
  });
  return NextResponse.json({ ok: true, id: a.id });
}
