// Shared helpers for "Fè m sonje" (deadline reminders). Safe to import on server and client.

export const TZ = "America/New_York";

const MONTHS_HT = ["janvye", "fevriye", "mas", "avril", "me", "jen", "jiyè", "out", "septanm", "oktòb", "novanm", "desanm"];

/** "2026-11-16" → true only for a real calendar date. */
export function isIsoDate(s: string | null | undefined): s is string {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Today's date in Massachusetts, as YYYY-MM-DD. */
export function todayIso(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Calendar dates are stored at UTC midnight; always format them in UTC so they never shift a day. */
export function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** "2026-11-16" → "16 novanm 2026" (ht) or "November 16, 2026" (en). */
export function formatDate(iso: string, lang: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (lang === "en") {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });
  }
  return `${d} ${MONTHS_HT[m - 1]} ${y}`;
}

/** Digits with country code for wa.me, or null. 10-digit US numbers get a leading 1. */
export function normalizePhone(raw: string | null | undefined): string | null {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `1${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

/** "17815551234" → "(781) 555-1234" for display. */
export function prettyPhone(p: string): string {
  const m = p.match(/^1(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : `+${p}`;
}

/** When to send: 7 days before the deadline at 9 AM Massachusetts time ("before"), 1 day after ("after"). */
export function remindTimes(deadlineIso: string): { before: Date; after: Date } {
  const at9 = (iso: string, addDays: number) => {
    const [y, m, d] = iso.split("-").map(Number);
    // 13:00 UTC = 9 AM EDT / 8 AM EST — close enough for a daily reminder list.
    return new Date(Date.UTC(y, m - 1, d + addDays, 13, 0, 0));
  };
  const now = new Date();
  const before = at9(deadlineIso, -7);
  return { before: before < now ? now : before, after: at9(deadlineIso, 1) };
}

/** The WhatsApp text a navigator sends. Kept short and kind; no ID numbers, no amounts. */
export function reminderMessage(r: { kind: string; lang: string; sender: string; deadline: string; note?: string | null }): string {
  const date = formatDate(r.deadline, r.lang);
  if (r.lang === "en") {
    return r.kind === "after"
      ? `Hello! This is KHADA Pathway. The deadline for your letter from ${r.sender} was ${date}. Were you able to do what you needed to? Reply "YES", or "HELP" if you need help. — KHADA`
      : `Hello! This is KHADA Pathway. A quick reminder: your letter from ${r.sender} has a deadline on ${date}.${r.note ? ` ${r.note}` : ""} If you need help, just reply to this message. Reply STOP to stop reminders. — KHADA`;
  }
  return r.kind === "after"
    ? `Bonjou! Se KHADA Pathway. Dat limit pou lèt ${r.sender} an te ${date}. Èske w te rive fè sa w te bezwen fè a? Reponn "WI", oswa "ÈD" si w bezwen èd. — KHADA`
    : `Bonjou! Se KHADA Pathway. Yon ti rapèl: lèt ${r.sender} an gen yon dat limit le ${date}.${r.note ? ` ${r.note}` : ""} Si w bezwen èd, reponn mesaj sa a. Ekri STOP pou n sispann voye rapèl. — KHADA`;
}

export function waLink(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
