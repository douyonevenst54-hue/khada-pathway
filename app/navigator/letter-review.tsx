"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/** Review controls for one explained letter: was the AI right? optional note, then done. */
export default function LetterReviewButtons({ id }: { id: string }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function done(aiCorrect: boolean) {
    setBusy(true);
    await fetch(`/api/letters/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ note, aiCorrect }),
    });
    router.refresh();
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      <input className="tel" style={{ margin: 0, fontSize: ".9rem", padding: "6px 8px", flex: "1 1 200px" }}
        placeholder="Note / what you did (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="sbtn" disabled={busy} style={{ padding: "6px 10px", fontSize: ".9rem" }} onClick={() => done(true)}>✓ AI correct · Done</button>
      <button className="sbtn" disabled={busy} style={{ padding: "6px 10px", fontSize: ".9rem" }} onClick={() => done(false)}>✗ AI wrong · Done</button>
    </div>
  );
}
