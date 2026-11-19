import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getNavigator())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.activity.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
