import { isIsoDate, formatDate } from "@/lib/reminders";

/**
 * "Add to my calendar": returns a calendar event for the letter's deadline with alerts
 * 7 days and 1 day before. Nothing is stored — everything comes from the link.
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const d = q.get("d") ?? "";
  if (!isIsoDate(d)) return new Response("bad date", { status: 400 });
  const lang = q.get("l") === "en" ? "en" : "ht";
  const sender = (q.get("s") ?? "").slice(0, 80);
  const note = (q.get("n") ?? "").slice(0, 300);

  const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const ymd = d.replace(/-/g, "");
  const next = new Date(`${d}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const ymdNext = next.toISOString().slice(0, 10).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

  const title = lang === "en" ? `Deadline: letter from ${sender || "—"}` : `Dat limit: lèt ${sender || "—"}`;
  const desc =
    (note ? `${note}\n\n` : "") +
    (lang === "en" ? `Date: ${formatDate(d, "en")}. Need help? KHADA Pathway: https://pathway.khada.xyz/eksplike-let`
                   : `Dat: ${formatDate(d, "ht")}. Ou bezwen èd? KHADA Pathway: https://pathway.khada.xyz/eksplike-let`);
  const alarm = (trigger: string) => ["BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(title)}`, `TRIGGER:${trigger}`, "END:VALARM"];

  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KHADA//Pathway//HT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ymd}-${Math.random().toString(36).slice(2)}@pathway.khada.xyz`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd}`,
    `DTEND;VALUE=DATE:${ymdNext}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(desc)}`,
    ...alarm("-P7D"), ...alarm("-P1D"),
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="khada-dat-limit-${d}.ics"`,
      "cache-control": "no-store",
    },
  });
}
