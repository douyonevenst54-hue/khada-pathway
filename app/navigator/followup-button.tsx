"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowupButton({ id }: { id: string }) {
  const [note, setNote] = useState("");
  const router = useRouter();
  async function done() {
    await fetch(`/api/followups/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ outcome: note }) });
    router.refresh();
  }
  return (
    <span style={{ display: "flex", gap: 6 }}>
      <input className="tel" style={{ margin: 0, fontSize: ".9rem", padding: "6px 8px" }} placeholder="Outcome (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="sbtn" style={{ padding: "6px 10px", fontSize: ".9rem" }} onClick={done}>Done</button>
    </span>
  );
}
