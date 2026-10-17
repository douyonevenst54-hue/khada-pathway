import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";
import Login from "./login";
import FollowupButton from "./followup-button";
import LetterReviewButtons from "./letter-review";
import RemindersSection from "./reminders-section";

export const dynamic = "force-dynamic";

// Vercel servers run in UTC; show every date/time in Massachusetts time.
const TZ = "America/New_York";
const day = (d: Date) => d.toLocaleDateString("en-US", { timeZone: TZ });
const dayTime = (d: Date) =>
  d.toLocaleString("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export default async function Navigator({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  const nav = await getNavigator();
  if (!nav) return <Login error={err === "1"} />;

  const urgencyRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const [total, help, due, recent] = await Promise.all([
    db.session.count(),
    db.stepStatus.findMany({ where: { status: "help" }, include: { session: true }, orderBy: { updatedAt: "desc" }, take: 100 }),
    db.followUp.findMany({ where: { doneAt: null, dueAt: { lte: new Date() } }, orderBy: { dueAt: "asc" }, take: 100 }),
    db.session.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { steps: true } }),
  ]);
  // Letters live in a newer table; if its migration hasn't run yet, keep the rest of the dashboard working.
  let lettersReady = true;
  const [openLetters, lettersTotal, lettersReviewed, aiWrong] = await Promise.all([
    db.letterReview.findMany({ where: { status: "open" }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.letterReview.count(),
    db.letterReview.count({ where: { status: "done" } }),
    db.letterReview.count({ where: { reviewNote: { startsWith: "[AI wrong]" } } }),
  ]).catch(() => {
    lettersReady = false;
    return [[], 0, 0, 0] as const;
  });
  const letters = [...openLetters].sort((a, b) => Number(b.redFlag) - Number(a.redFlag) || urgencyRank[a.urgency] - urgencyRank[b.urgency]);
  const sessionsById = new Map(recent.map((s) => [s.id, s]));

  return (
    <main className="app" style={{ maxWidth: 760 }}>
      <header>
        <div className="brand">KHADA <span>Navigator</span></div>
        <form action="/api/auth/logout" method="post"><button className="quiet" style={{ width: "auto", padding: "6px 10px" }}>Sign out ({nav.name})</button></form>
      </header>
      <p className="lead">{total} sessions · {help.length} help requests · {due.length} follow-ups due · {letters.length} letters to review</p>

      <h2 id="letters">Letters to review</h2>
      <p className="lead" style={{ fontSize: ".9rem" }}>
        {lettersTotal} letters explained · {lettersReviewed} reviewed · AI wrong in {aiWrong} of {lettersReviewed} reviewed
      </p>
      {!lettersReady ? <p className="note">Letters table not set up yet — run <code>npx prisma migrate deploy</code>.</p> : letters.length === 0 ? <p className="lead">No letters waiting.</p> : letters.map((l) => {
        const steps = Array.isArray(l.nextSteps) ? (l.nextSteps as string[]) : [];
        return (
          <div key={l.id} className="lcard" style={l.redFlag ? { borderColor: "var(--red)" } : undefined}>
            <div className="top">
              {l.redFlag && <span className="urgent">⚠ EMERGENCY WORDS — call now</span>}
              <span className="urgent" style={{ background: l.urgency === "high" ? "var(--red)" : l.urgency === "medium" ? "var(--gold)" : "var(--green)" }}>{l.urgency}</span>
              <strong>{l.sender}</strong>
              <span style={{ color: "var(--muted)" }}>· {l.letterType} · {dayTime(l.createdAt)}</span>
            </div>
            <div>{l.summaryEn}</div>
            {l.deadline && <div><strong>Deadline:</strong> {l.deadline}</div>}
            <div><strong>Contact:</strong> {l.contact ?? "— (no phone left)"}{l.unclear ? " · AI flagged unclear parts" : ""}</div>
            <details>
              <summary>What the person saw (Kreyòl)</summary>
              <p style={{ margin: "6px 0" }}>{l.summaryHt}</p>
              {steps.length > 0 && <ol className="list">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
            </details>
            <LetterReviewButtons id={l.id} />
          </div>
        );
      })}

      <h2>Needs help</h2>
      {help.length === 0 ? <p className="lead">No open help requests.</p> : (
        <table><thead><tr><th>When</th><th>Zip</th><th>Pathway</th><th>Step</th><th>Contact</th></tr></thead>
          <tbody>{help.map((h) => (
            <tr key={h.id}><td>{day(h.updatedAt)}</td><td>{h.session.zip}</td><td>{h.session.pathwayId}</td><td>{h.stepKey}</td><td>{h.session.contact ?? "—"}</td></tr>
          ))}</tbody></table>
      )}

      <RemindersSection />

      <h2 style={{ marginTop: 24 }}>Follow-ups due</h2>
      {due.length === 0 ? <p className="lead">Nothing due today.</p> : (
        <table><thead><tr><th>Due</th><th>Zip</th><th>Contact</th><th></th></tr></thead>
          <tbody>{due.map((f) => {
            const s = sessionsById.get(f.sessionId);
            return <tr key={f.id}><td>{day(f.dueAt)}</td><td>{s?.zip ?? "—"}</td><td>{s?.contact ?? "—"}</td><td><FollowupButton id={f.id} /></td></tr>;
          })}</tbody></table>
      )}

      <h2 style={{ marginTop: 24 }}>Recent sessions</h2>
      <table><thead><tr><th>Date</th><th>Zip</th><th>Pathway</th><th>Applied</th><th>Help</th><th></th></tr></thead>
        <tbody>{recent.map((s) => (
          <tr key={s.id}>
            <td>{day(s.createdAt)}</td><td>{s.zip}</td><td>{s.pathwayId}</td>
            <td>{s.steps.filter((x) => x.status === "applied").length}/{s.planKeys.length}</td>
            <td>{s.steps.filter((x) => x.status === "help").length}</td>
            <td><a href={`/plan/${s.id}?lang=ht`} target="_blank" rel="noopener">open</a></td>
          </tr>
        ))}</tbody></table>
    </main>
  );
}
