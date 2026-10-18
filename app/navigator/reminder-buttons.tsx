"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = "sent" | "done" | "help" | "no_answer" | "stop";

/** One-tap controls for a reminder: open WhatsApp with the message ready, then record what happened. */
export default function ReminderButtons({ id, wa, mode }: { id: string; wa: string; mode: "send" | "outcome" }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function act(action: Action) {
    setBusy(true);
    await fetch(`/api/reminders/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }) });
    router.refresh();
  }
  return (
    <div className="rem-row">
      {mode === "send" && (
        <>
          <a className="sbtn wa" href={wa} target="_blank" rel="noopener noreferrer">💬 Open WhatsApp</a>
          <button className="sbtn" disabled={busy} onClick={() => act("sent")}>✓ Sent</button>
        </>
      )}
      {mode === "outcome" && (
        <>
          <button className="sbtn" disabled={busy} onClick={() => act("done")}>✓ Done</button>
          <button className="sbtn" disabled={busy} onClick={() => act("help")}>Needs help</button>
          <button className="sbtn" disabled={busy} onClick={() => act("no_answer")}>No answer</button>
        </>
      )}
      <button className="sbtn" disabled={busy} onClick={() => act("stop")} title="Person replied STOP">Stop</button>
    </div>
  );
}
