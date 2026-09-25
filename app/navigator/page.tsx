import { db } from "@/lib/db";
import { getNavigator } from "@/lib/auth";
import Login from "./login";
import FollowupButton from "./followup-button";

export const dynamic = "force-dynamic";

export default async function Navigator({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  const nav = await getNavigator();
  if (!nav) return <Login error={err === "1"} />;

  const [total, help, due, recent] = await Promise.all([
    db.session.count(),
    db.stepStatus.findMany({ where: { status: "help" }, include: { session: true }, orderBy: { updatedAt: "desc" }, take: 100 }),
    db.followUp.findMany({ where: { doneAt: null, dueAt: { lte: new Date() } }, orderBy: { dueAt: "asc" }, take: 100 }),
    db.session.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { steps: true } }),
  ]);
  const sessionsById = new Map(recent.map((s) => [s.id, s]));

  return (
    <main className="app" style={{ maxWidth: 760 }}>
      <header>
        <div className="brand">KHADA <span>Navigator</span></div>
        <form action="/api/auth/logout" method="post"><button className="quiet" style={{ width: "auto", padding: "6px 10px" }}>Sign out ({nav.name})</button></form>
      </header>
      <p className="lead">{total} sessions · {help.length} help requests · {due.length} follow-ups due</p>

      <h2>Needs help</h2>
      {help.length === 0 ? <p className="lead">No open help requests.</p> : (
        <table><thead><tr><th>When</th><th>Zip</th><th>Pathway</th><th>Step</th><th>Contact</th></tr></thead>
          <tbody>{help.map((h) => (
            <tr key={h.id}><td>{h.updatedAt.toLocaleDateString()}</td><td>{h.session.zip}</td><td>{h.session.pathwayId}</td><td>{h.stepKey}</td><td>{h.session.contact ?? "—"}</td></tr>
          ))}</tbody></table>
      )}

      <h2 style={{ marginTop: 24 }}>Follow-ups due</h2>
      {due.length === 0 ? <p className="lead">Nothing due today.</p> : (
        <table><thead><tr><th>Due</th><th>Zip</th><th>Contact</th><th></th></tr></thead>
          <tbody>{due.map((f) => {
            const s = sessionsById.get(f.sessionId);
            return <tr key={f.id}><td>{f.dueAt.toLocaleDateString()}</td><td>{s?.zip ?? "—"}</td><td>{s?.contact ?? "—"}</td><td><FollowupButton id={f.id} /></td></tr>;
          })}</tbody></table>
      )}

      <h2 style={{ marginTop: 24 }}>Recent sessions</h2>
      <table><thead><tr><th>Date</th><th>Zip</th><th>Pathway</th><th>Applied</th><th>Help</th><th></th></tr></thead>
        <tbody>{recent.map((s) => (
          <tr key={s.id}>
            <td>{s.createdAt.toLocaleDateString()}</td><td>{s.zip}</td><td>{s.pathwayId}</td>
            <td>{s.steps.filter((x) => x.status === "applied").length}/{s.planKeys.length}</td>
            <td>{s.steps.filter((x) => x.status === "help").length}</td>
            <td><a href={`/plan/${s.id}?lang=ht`} target="_blank" rel="noopener">open</a></td>
          </tr>
        ))}</tbody></table>
    </main>
  );
}
