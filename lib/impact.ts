import { db } from "./db";

/** Program categories. Kept close to the language funders and hospital community-benefit teams use. */
export const CATEGORIES: Record<string, string> = {
  navigation: "Benefits & resource navigation",
  health_education: "Health education & screening",
  civic_education: "Civic education",
  education: "ESOL / adult & youth education",
  food: "Food access",
  culture: "Culture & community building",
  outreach: "Outreach & referrals",
  other: "Other",
};

export const LANGS: Record<string, string> = { ht: "Kreyòl", en: "English", fr: "Français", es: "Español", mixed: "Mixed" };

const TZ = "America/New_York";

/** Today's date in Massachusetts as YYYY-MM-DD. */
export function todayIso() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export type Range = { from: string; to: string; fromDate: Date; toExclusive: Date };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Reads ?from=YYYY-MM-DD&to=YYYY-MM-DD. Default: January 1 of this year → today. */
export function parseRange(from?: string | null, to?: string | null): Range {
  const today = todayIso();
  const f = from && ISO.test(from) ? from : `${today.slice(0, 4)}-01-01`;
  let t = to && ISO.test(to) ? to : today;
  if (t < f) t = f;
  const fromDate = new Date(`${f}T00:00:00Z`);
  const toExclusive = new Date(`${t}T00:00:00Z`);
  toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);
  return { from: f, to: t, fromDate, toExclusive };
}

/** Hour value for volunteer time, from VOLUNTEER_HOUR_VALUE (dollars). Unset → not shown. */
export function volunteerHourValue(): number | null {
  const v = Number(process.env.VOLUNTEER_HOUR_VALUE);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const dollarsToCents = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
};

type Count = { key: string; n: number };
const tally = (keys: (string | null | undefined)[]): Count[] => {
  const m = new Map<string, number>();
  for (const k of keys) m.set(k || "—", (m.get(k || "—") ?? 0) + 1);
  return [...m.entries()].map(([key, n]) => ({ key, n })).sort((a, b) => b.n - a.n);
};

/**
 * Everything the impact report shows, for one date range.
 * Part 1 is counted automatically from what people do in the app.
 * Part 2 is what navigators log by hand (events, workshops, walk-ins).
 */
export async function impactReport(r: Range) {
  const when = { gte: r.fromDate, lt: r.toExclusive };

  const [sessions, steps, followDone, letters, remindersAfter] = await Promise.all([
    db.session.findMany({ where: { createdAt: when }, select: { pathwayId: true, zip: true, lang: true, planKeys: true } }),
    db.stepStatus.findMany({ where: { updatedAt: when }, select: { status: true } }),
    db.followUp.count({ where: { doneAt: when } }),
    db.letterReview.findMany({ where: { createdAt: when }, select: { urgency: true, status: true } }).catch(() => []),
    db.reminder.findMany({ where: { kind: "after", outcome: { not: null }, sentAt: when }, select: { outcome: true } }).catch(() => []),
  ]);

  let activitiesReady = true;
  const activities = await db.activity
    .findMany({ where: { date: when }, include: { program: true }, orderBy: { date: "desc" } })
    .catch(() => {
      activitiesReady = false;
      return [];
    });

  const app = {
    sessions: sessions.length,
    plannedSteps: sessions.reduce((s, x) => s + x.planKeys.length, 0),
    stepsApplied: steps.filter((s) => s.status === "applied").length,
    helpRequests: steps.filter((s) => s.status === "help").length,
    followUpsDone: followDone,
    letters: letters.length,
    lettersHigh: letters.filter((l) => l.urgency === "high").length,
    lettersReviewed: letters.filter((l) => l.status === "done").length,
    deadlineChecks: remindersAfter.length,
    deadlinesMet: remindersAfter.filter((x) => x.outcome === "done").length,
    byPathway: tally(sessions.map((s) => s.pathwayId)),
    byZip: tally(sessions.map((s) => s.zip)).slice(0, 10),
    byLang: tally(sessions.map((s) => s.lang)),
  };

  const sum = (f: (a: (typeof activities)[number]) => number) => activities.reduce((s, a) => s + f(a), 0);
  const programs = new Map<string, { name: string; category: string; events: number; people: number; vol: number; staff: number; cost: number; inKind: number }>();
  for (const a of activities) {
    const p = programs.get(a.programId) ?? { name: a.program.name, category: a.program.category, events: 0, people: 0, vol: 0, staff: 0, cost: 0, inKind: 0 };
    p.events++;
    p.people += a.peopleServed;
    p.vol += a.volunteerHours;
    p.staff += a.staffHours;
    p.cost += a.costCents;
    p.inKind += a.inKindCents;
    programs.set(a.programId, p);
  }

  const logged = {
    ready: activitiesReady,
    events: activities.length,
    people: sum((a) => a.peopleServed),
    volunteerHours: sum((a) => a.volunteerHours),
    staffHours: sum((a) => a.staffHours),
    costCents: sum((a) => a.costCents),
    inKindCents: sum((a) => a.inKindCents),
    partners: new Set(activities.map((a) => a.partner?.trim()).filter(Boolean)).size,
    byProgram: [...programs.values()].sort((a, b) => b.people - a.people),
    byCategory: tally(activities.map((a) => a.program.category)),
    activities,
  };

  return { range: r, app, logged };
}

export type ImpactReport = Awaited<ReturnType<typeof impactReport>>;
