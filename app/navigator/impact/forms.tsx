"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return res.ok ? null : (data.error as string) ?? "Something went wrong.";
}

export function ActivityForm({ programs, today }: { programs: { id: string; name: string }[]; today: string }) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setErr(null);
    setSaved(false);
    const error = await post("/api/impact/activities", Object.fromEntries(new FormData(form)));
    setBusy(false);
    if (error) return setErr(error);
    form.reset();
    setSaved(true);
    router.refresh();
  }

  return (
    <form className="iform" onSubmit={submit}>
      <label>Date<input type="date" name="date" defaultValue={today} max={today} required /></label>
      <label>Program
        <select name="programId" required defaultValue="">
          <option value="" disabled>Choose…</option>
          {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="wide">What happened (title)<input name="title" placeholder="e.g. Sunday session 3 — elections & voter culture" required maxLength={120} /></label>
      <label>People served<input type="number" name="peopleServed" min={0} inputMode="numeric" placeholder="0" /></label>
      <label>Volunteer hours<input type="number" name="volunteerHours" min={0} step="0.25" inputMode="decimal" placeholder="0" /></label>
      <label>Staff hours<input type="number" name="staffHours" min={0} step="0.25" inputMode="decimal" placeholder="0" /></label>
      <label>Cost ($)<input name="cost" inputMode="decimal" placeholder="0" /></label>
      <label>In-kind value ($)<input name="inKind" inputMode="decimal" placeholder="donated food, space…" /></label>
      <label>ZIP<input name="zip" inputMode="numeric" pattern="\d{5}" maxLength={5} placeholder="01852" /></label>
      <label>Language
        <select name="lang" defaultValue="ht">
          <option value="ht">Kreyòl</option><option value="en">English</option><option value="fr">Français</option>
          <option value="es">Español</option><option value="mixed">Mixed</option>
        </select>
      </label>
      <label>Partner (optional)<input name="partner" maxLength={120} placeholder="church, school, clinic…" /></label>
      <label className="wide">Story / notes (optional — no names)
        <textarea name="note" maxLength={2000} placeholder="What changed for people? A quote without a name is fine." />
      </label>
      <div className="wide" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="sbtn" style={{ background: "var(--blue)", borderColor: "var(--blue)", color: "#fff", padding: "10px 18px" }} disabled={busy}>
          {busy ? "Saving…" : "Save activity"}
        </button>
        {err && <span className="err">{err}</span>}
        {saved && <span style={{ color: "var(--green)", fontWeight: 700 }}>Saved ✓</span>}
      </div>
    </form>
  );
}

export function ProgramForm({ categories }: { categories: Record<string, string> }) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setErr(null);
    const error = await post("/api/impact/programs", Object.fromEntries(new FormData(form)));
    if (error) return setErr(error);
    form.reset();
    router.refresh();
  }

  return (
    <form className="iform" onSubmit={submit} style={{ gridTemplateColumns: "2fr 2fr auto", alignItems: "end" }}>
      <label>New program name<input name="name" required maxLength={80} placeholder="e.g. Edikasyon Sivik" /></label>
      <label>Category
        <select name="category" defaultValue="navigation">
          {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <button className="sbtn" style={{ padding: "9px 14px" }}>Add</button>
      {err && <span className="err wide">{err}</span>}
    </form>
  );
}

export function DeleteActivity({ id }: { id: string }) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  async function del() {
    if (!armed) return setArmed(true);
    await fetch(`/api/impact/activities/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return (
    <button className="quiet" style={{ width: "auto", padding: "4px 8px", color: armed ? "var(--red)" : undefined }} onClick={del} onBlur={() => setArmed(false)}>
      {armed ? "Tap again to delete" : "Delete"}
    </button>
  );
}
