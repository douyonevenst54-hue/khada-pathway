import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";
import { CATEGORIES } from "@/lib/impact";

const Body = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.string().refine((c) => c in CATEGORIES),
});

export async function POST(req: Request) {
  if (!(await getNavigator())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Give the program a name and a category." }, { status: 400 });
  const exists = await db.program.findUnique({ where: { name: parsed.data.name } });
  if (exists) return NextResponse.json({ error: "A program with that name already exists." }, { status: 409 });
  const program = await db.program.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: program.id });
}
