import Link from "next/link";
import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";
import { CATEGORIES, LANGS, impactReport, money, parseRange, todayIso, volunteerHourValue } from "@/lib/impact";
import Login from "../login";
import { ActivityForm, ProgramForm, DeleteActivity } from "./forms";

export const dynamic = "force-dynamic";

const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

export default async function Impact({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const nav = await getNavigator();
  if (!nav) return <Login error={false} />;

  const r = parseRange(sp.from, sp.to);
  const { app, logged } = await impactReport(r);
  const programs = logged.ready ? await db.program.findMany({ where: { active: true }, orderBy: { name: "asc" } }) : [];
  const rate = volunteerHourValue();

  const today = todayIso();
  const y = today.slice(0, 4);
  const quick = [
    { label: "This year", from: `${y}-01-01`, to: today },
    { label: "Last year", from: `${Number(y) - 1}-01-01`, to: `${Number(y) - 1}-12-31` },
    { label: "This month", from: `${today.slice(0, 7)}-01`, to: today },
  ];
  const qs = `from=${r.from}&to=${r.to}`;
  const maxPeople = Math.max(1, ...logged.byProgram.map((p) => p.people));

  return (
    <main className="app" style={{ maxWidth: 860 }}>
      <header>
        <div className="brand">KHADA <span>Impact</span></div>
        <Link href="/navigator" className="no-print" style={{ fontSize: ".95rem" }}>← Navigator</Link>
      </header>

      <p className="lead">
        What KHADA did for the community, {r.from} to {r.to}. Counts only — no names.
      </p>

      <nav className="chips no-print" aria-label="Date range">
        {quick.map((q) => (
          <a key={q.label} href={`?from=${q.from}&to=${q.to}`} aria-current={q.from === r.from && q.to === r.to}>{q.label}</a>
        ))}
      </nav>
      <form className="iform no-print" method="get" style={{ gridTemplateColumns: "1fr 1fr auto auto", alignItems: "end" }}>
        <label>From<input type="date" name="from" defaultValue={r.from} /></label>
        <label>To<input type="date" name="to" defaultValue={r.to} max={today} /></label>
        <button className="sbtn" style={{ padding: "9px 14px" }}>Show</button>
        <a className="sbtn" style={{ padding: "9px 14px", background: "var(--blue)", borderColor: "var(--blue)", color: "#fff" }} href={`/api/impact/export?${qs}`}>Export CSV</a>
      </form>

      {!logged.ready && <p className="note">Impact tables not set up yet — run <code>npx prisma migrate deploy</code> (Vercel does this on the next deploy).</p>}

      <h2>At a glance</h2>
      <div className="kpis">
        <div className="kpi"><div className="v">{num(logged.people)}</div><div className="k">people served at activities</div></div>
        <div className="kpi"><div className="v">{num(logged.events)}</div><div className="k">activities held</div></div>
        <div className="kpi"><div className="v">{num(logged.volunteerHours)}</div><div className="k">volunteer hours{rate ? ` · ${money(logged.volunteerHours * rate * 100)} value` : ""}</div></div>
        <div className="kpi"><div className="v">{num(logged.staffHours)}</div><div className="k">staff hours</div></div>
        <div className="kpi"><div className="v">{money(logged.costCents)}</div><div className="k">spent on programs</div></div>
        <div className="kpi"><div className="v">{money(logged.inKindCents)}</div><div className="k">in-kind donations</div></div>
        <div className="kpi"><div className="v">{num(logged.partners)}</div><div className="k">partner organizations</div></div>
      </div>

      <h2>Online navigation (counted automatically)</h2>
      <div className="kpis">
        <div className="kpi"><div className="v">{app.sessions}</div><div className="k">Pathway sessions</div></div>
        <div className="kpi"><div className="v">{app.stepsApplied}</div><div className="k">steps people applied for (of {app.plannedSteps} planned)</div></div>
        <div className="kpi"><div className="v">{app.helpRequests}</div><div className="k">asked a navigator for help</div></div>
        <div className="kpi"><div className="v">{app.followUpsDone}</div><div className="k">follow-ups completed</div></div>
        <div className="kpi"><div className="v">{app.letters}</div><div className="k">letters explained ({app.lettersHigh} urgent)</div></div>
        <div className="kpi"><div className="v">{app.deadlinesMet}/{app.deadlineChecks}</div><div className="k">deadlines met at check-in</div></div>
      </div>
      {app.sessions > 0 && (
        <table style={{ marginBottom: 20 }}>
          <thead><tr><th>Pathway</th><th>Sessions</th><th>Top ZIP codes</th><th>Language</th></tr></thead>
          <tbody>
            <tr>
              <td>{app.byPathway.map((p) => <div key={p.key}>{p.key}: {p.n}</div>)}</td>
              <td>{app.sessions}</td>
              <td>{app.byZip.map((z) => <div key={z.key}>{z.key}: {z.n}</div>)}</td>
              <td>{app.byLang.map((l) => <div key={l.key}>{LANGS[l.key] ?? l.key}: {l.n}</div>)}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h2>By program</h2>
      {logged.byProgram.length === 0 ? <p className="lead">No activities logged in this period yet.</p> : (
        <table>
          <thead><tr><th>Program</th><th>Activities</th><th>People</th><th>Vol. hrs</th><th>Staff hrs</th><th>Cost</th><th>In-kind</th></tr></thead>
          <tbody>{logged.byProgram.map((p) => (
            <tr key={p.name}>
              <td><strong>{p.name}</strong><div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{CATEGORIES[p.category] ?? p.category}</div>
                <div className="bar" style={{ width: `${(p.people / maxPeople) * 100}%`, marginTop: 4 }} /></td>
              <td>{p.events}</td><td>{num(p.people)}</td><td>{num(p.vol)}</td><td>{num(p.staff)}</td><td>{money(p.cost)}</td><td>{money(p.inKind)}</td>
            </tr>
          ))}</tbody>
        </table>
      )}

      {logged.ready && (
        <section className="no-print">
          <h2 id="log" style={{ marginTop: 28 }}>Log an activity</h2>
          {programs.length === 0
            ? <p className="note">Add your first program below (for example “Edikasyon Sivik” or “Bouyon Kilti”), then log activities under it.</p>
            : <ActivityForm programs={programs.map((p) => ({ id: p.id, name: p.name }))} today={today} />}

          <h2 style={{ marginTop: 28 }}>Programs</h2>
          {programs.length > 0 && (
            <p className="lead" style={{ fontSize: ".95rem" }}>{programs.map((p) => `${p.name} (${CATEGORIES[p.category] ?? p.category})`).join(" · ")}</p>
          )}
          <ProgramForm categories={CATEGORIES} />
        </section>
      )}

      <h2 style={{ marginTop: 28 }}>Activities in this period</h2>
      {logged.activities.length === 0 ? <p className="lead">Nothing yet.</p> : logged.activities.map((a) => (
        <div key={a.id} className="lcard">
          <div className="top">
            <strong>{a.title}</strong>
            <span style={{ color: "var(--muted)" }}>· {a.program.name} · {a.date.toISOString().slice(0, 10)}</span>
          </div>
          <div>
            {a.peopleServed} people · {num(a.volunteerHours)} vol. hrs · {num(a.staffHours)} staff hrs
            {a.costCents > 0 && ` · ${money(a.costCents)} spent`}{a.inKindCents > 0 && ` · ${money(a.inKindCents)} in-kind`}
            {a.zip && ` · ${a.zip}`}{a.lang && ` · ${LANGS[a.lang] ?? a.lang}`}{a.partner && ` · with ${a.partner}`}
          </div>
          {a.note && <p style={{ margin: "6px 0 0" }}>{a.note}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, color: "var(--muted)", fontSize: ".85rem" }}>
            <span>Logged by {a.loggedBy}</span>
            <DeleteActivity id={a.id} />
          </div>
        </div>
      ))}
    </main>
  );
}
