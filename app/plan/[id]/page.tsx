import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPathway } from "@/lib/pathways";
import Plan from "./plan";

export default async function PlanPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { id } = await params;
  const { lang } = await searchParams;
  const s = await db.session.findUnique({ where: { id }, include: { steps: true } });
  if (!s) notFound();
  const p = getPathway(s.pathwayId);
  if (!p) notFound();
  const steps = s.planKeys.map((k) => p.steps[k]);
  const status = Object.fromEntries(s.steps.map((x) => [x.stepKey, x.status]));
  return <Plan sessionId={s.id} zip={s.zip} lang={lang === "en" ? "en" : "ht"} steps={steps} status={status} contact={s.contact ?? ""} />;
}
