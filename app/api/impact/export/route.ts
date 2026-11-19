import { getNavigator } from "@/lib/auth";
import { CATEGORIES, LANGS, impactReport, parseRange, volunteerHourValue } from "@/lib/impact";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // Quote everything; neutralise spreadsheet formulas.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};
const row = (...cells: unknown[]) => cells.map(cell).join(",");
const usd = (cents: number) => (cents / 100).toFixed(2);

/** CSV for grant reports, the annual report, or a hospital partner's community-benefit team. */
export async function GET(req: Request) {
  if (!(await getNavigator())) return new Response("unauthorized", { status: 401 });
  const url = new URL(req.url);
  const r = parseRange(url.searchParams.get("from"), url.searchParams.get("to"));
  const { app, logged } = await impactReport(r);
  const rate = volunteerHourValue();

  const lines = [
    row("KHADA impact report", `${r.from} to ${r.to}`),
    "",
    row("SUMMARY"),
    row("Measure", "Value"),
    row("People served at logged activities", logged.people),
    row("Activities logged", logged.events),
    row("Volunteer hours", logged.volunteerHours),
    ...(rate ? [row(`Value of volunteer time (USD, at $${rate}/hour)`, (logged.volunteerHours * rate).toFixed(2))] : []),
    row("Staff hours", logged.staffHours),
    row("Direct cost (USD)", usd(logged.costCents)),
    row("In-kind donations (USD)", usd(logged.inKindCents)),
    row("Partner organizations", logged.partners),
    row("Pathway sessions (online navigation)", app.sessions),
    row("Plan steps people said they applied for", app.stepsApplied),
    row("Help requests answered by navigators", app.helpRequests),
    row("Follow-ups completed", app.followUpsDone),
    row("Official letters explained", app.letters),
    row("Deadline check-ins / deadlines met", `${app.deadlineChecks} / ${app.deadlinesMet}`),
    "",
    row("BY PROGRAM"),
    row("Program", "Category", "Activities", "People served", "Volunteer hours", "Staff hours", "Cost (USD)", "In-kind (USD)"),
    ...logged.byProgram.map((p) => row(p.name, CATEGORIES[p.category] ?? p.category, p.events, p.people, p.vol, p.staff, usd(p.cost), usd(p.inKind))),
    "",
    row("ACTIVITIES"),
    row("Date", "Program", "Category", "Title", "People served", "Volunteer hours", "Staff hours", "Cost (USD)", "In-kind (USD)", "ZIP", "Language", "Partner", "Notes", "Logged by"),
    ...logged.activities.map((a) =>
      row(
        a.date.toISOString().slice(0, 10), a.program.name, CATEGORIES[a.program.category] ?? a.program.category, a.title,
        a.peopleServed, a.volunteerHours, a.staffHours, usd(a.costCents), usd(a.inKindCents),
        a.zip, a.lang ? LANGS[a.lang] ?? a.lang : "", a.partner, a.note, a.loggedBy,
      ),
    ),
  ];

  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="khada-impact_${r.from}_${r.to}.csv"`,
    },
  });
}
