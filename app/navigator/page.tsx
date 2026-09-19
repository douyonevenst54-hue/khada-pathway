import { db } from "@/lib/db";

// Minimal navigator view. Protected by ?key=NAVIGATOR_KEY until real auth (next step).
export default async function Navigator({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  if (!process.env.NAVIGATOR_KEY || key !== process.env.NAVIGATOR_KEY) return <main className="app"><p>Not authorized.</p></main>;

  const help = await db.stepStatus.findMany({ where: { status: "help" }, include: { session: true }, orderBy: { updatedAt: "desc" }, take: 100 });
  const due = await db.followUp.findMany({ where: { doneAt: null, dueAt: { lte: new Date() } }, orderBy: { dueAt: "asc" }, take: 100 });
  const total = await db.session.count();

  return (
    <main className="app">
      <header><div className="brand">KHADA <span>Navigator</span></div></header>
      <p className="lead">{total} sessions · {help.length} help requests · {due.length} follow-ups due</p>
      <h2>Needs help</h2>
      <table><thead><tr><th>When</th><th>Zip</th><th>Step</th><th>Contact</th></tr></thead>
        <tbody>{help.map((h) => <tr key={h.id}><td>{h.updatedAt.toLocaleDateString()}</td><td>{h.session.zip}</td><td>{h.stepKey}</td><td>{h.session.contact ?? "—"}</td></tr>)}</tbody></table>
      <h2 style={{ marginTop: 24 }}>Follow-ups due</h2>
      <table><thead><tr><th>Due</th><th>Session</th></tr></thead>
        <tbody>{due.map((f) => <tr key={f.id}><td>{f.dueAt.toLocaleDateString()}</td><td>{f.sessionId}</td></tr>)}</tbody></table>
    </main>
  );
}
