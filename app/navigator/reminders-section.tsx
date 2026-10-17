import { db } from "@/lib/db";
import { isoOf, prettyPhone, reminderMessage, waLink, formatDate } from "@/lib/reminders";
import ReminderButtons from "./reminder-buttons";

type Rem = {
  id: string; kind: string; phone: string; lang: string; sender: string; deadline: Date; note: string | null;
  remindAt: Date; status: string; sentAt: Date | null; outcome: string | null;
};

/** "Fè m sonje" — WhatsApp reminders due today, and check-ins waiting for an answer. */
export default async function RemindersSection() {
  let due: Rem[] = [], awaiting: Rem[] = [], tracked = 0, checked = 0, met = 0;
  try {
    [due, awaiting, tracked, checked, met] = await Promise.all([
      db.reminder.findMany({ where: { status: "pending", remindAt: { lte: new Date() } }, orderBy: { remindAt: "asc" }, take: 100 }),
      db.reminder.findMany({ where: { kind: "after", status: "sent", outcome: null }, orderBy: { sentAt: "asc" }, take: 100 }),
      db.reminder.count({ where: { kind: "before" } }),
      db.reminder.count({ where: { kind: "after", outcome: { not: null } } }),
      db.reminder.count({ where: { kind: "after", outcome: "done" } }),
    ]);
  } catch {
    return (
      <>
        <h2 id="reminders" style={{ marginTop: 24 }}>Reminders to send</h2>
        <p className="note">Reminders table not set up yet — run <code>npx prisma migrate deploy</code>.</p>
      </>
    );
  }

  const card = (r: Rem, mode: "send" | "outcome") => {
    const deadline = isoOf(r.deadline);
    const text = reminderMessage({ kind: r.kind, lang: r.lang, sender: r.sender, deadline, note: r.note });
    return (
      <div key={r.id} className="lcard">
        <div className="top">
          <span className="urgent" style={{ background: r.kind === "after" ? "var(--blue)" : "var(--gold)" }}>
            {r.kind === "after" ? "Check-in" : "Reminder"}
          </span>
          <strong>{prettyPhone(r.phone)}</strong>
          <span style={{ color: "var(--muted)" }}>· {r.sender} · deadline {formatDate(deadline, "en")} · {r.lang === "en" ? "English" : "Kreyòl"}</span>
        </div>
        <details>
          <summary>Message</summary>
          <p style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>{text}</p>
        </details>
        <ReminderButtons id={r.id} wa={waLink(r.phone, text)} mode={mode} />
      </div>
    );
  };

  return (
    <>
      <h2 id="reminders" style={{ marginTop: 24 }}>Reminders to send</h2>
      <p className="lead" style={{ fontSize: ".9rem" }}>
        {tracked} deadlines tracked · {checked} checked after the deadline · {checked ? Math.round((met / checked) * 100) : 0}% done on time
      </p>
      {due.length === 0 ? <p className="lead">Nothing to send right now.</p> : due.map((r) => card(r, r.kind === "after" ? "outcome" : "send"))}
      {awaiting.length > 0 && (
        <>
          <h3 style={{ marginTop: 16 }}>Waiting for an answer</h3>
          <p className="lead" style={{ fontSize: ".9rem" }}>When the person replies on WhatsApp, record it here.</p>
          {awaiting.map((r) => card(r, "outcome"))}
        </>
      )}
    </>
  );
}
