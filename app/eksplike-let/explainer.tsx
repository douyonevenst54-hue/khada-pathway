"use client";
import { useState } from "react";
import Link from "next/link";
import type { L, Lang } from "@/lib/types";
import type { LetterResult } from "@/lib/explain-letter/prompt";
import { isIsoDate, todayIso } from "@/lib/reminders";

const T: Record<string, L> = {
  title: { ht: "Eksplike lèt mwen", en: "Explain my letter" },
  lead: { ht: "Ou resevwa yon lèt ou pa konprann? Pran yon foto. N ap eksplike w li an kreyòl, ak sa pou w fè.", en: "Got a letter you don't understand? Take a photo. We'll explain it and tell you what to do." },
  pick: { ht: "📷 Pran foto lèt la", en: "📷 Take a photo of the letter" },
  pickFile: { ht: "🖼️ Chwazi yon foto oswa yon PDF ou deja genyen", en: "🖼️ Choose a photo or PDF you already have" },
  pickMore: { ht: "📷 Pran foto pwochen paj la", en: "📷 Photograph the next page" },
  pickFileMore: { ht: "🖼️ Ajoute lòt paj (foto oswa PDF)", en: "🖼️ Add more pages (photo or PDF)" },
  page: { ht: "Paj", en: "Page" },
  remove: { ht: "Retire paj sa a", en: "Remove this page" },
  pagesReady: { ht: "paj pare", en: "page(s) ready" },
  pagesMax: { ht: "jiska 10", en: "up to 10" },
  multiTip: { ht: "Si lèt la gen plizyè paj, mete CHAK paj. Dat limit ak dwa pou fè apèl souvan nan dènye paj yo.", en: "If the letter has several pages, add EVERY page. Deadlines and appeal rights are often on the last pages." },
  eTooMany: { ht: "Ou ka mete jiska 10 paj.", en: "You can add up to 10 pages." },
  pickFileHint: { ht: "Pa egzanp yon foto yon moun voye ba ou sou WhatsApp, oswa yon PDF nan imèl ou.", en: "For example a photo someone sent you on WhatsApp, or a PDF from your email." },
  fileReady: { ht: "PDF la pare", en: "PDF ready" },
  picked: { ht: "Foto a pare", en: "Photo ready" },
  change: { ht: "Chanje foto a", en: "Change photo" },
  tip: { ht: "Mete lèt la sou tab la, nan bon limyè. Pran tout paj la.", en: "Lay the letter flat in good light. Get the whole page." },
  noteAsk: { ht: "Ou gen yon kesyon sou lèt la? (opsyonèl)", en: "Any question about the letter? (optional)" },
  contactAsk: { ht: "Ou vle yon navigatè KHADA rele w? (opsyonèl) Telefòn:", en: "Want a KHADA navigator to call you? (optional) Phone:" },
  consent: { ht: "Mwen dakò pou KHADA itilize entèlijans atifisyèl (AI) pou li lèt sa a. Nou pa kenbe foto a. AI a pa doktè, li pa avoka — yon navigatè KHADA ap verifye repons lan.", en: "I agree that KHADA may use artificial intelligence (AI) to read this letter. We don't keep the photo. The AI is not a doctor or a lawyer — a KHADA navigator will check the answer." },
  go: { ht: "Eksplike lèt la", en: "Explain the letter" },
  busy: { ht: "N ap li lèt la…", en: "Reading the letter…" },
  from: { ht: "Lèt sa a soti nan", en: "This letter is from" },
  deadline: { ht: "DAT LIMIT", en: "DEADLINE" },
  remember: { ht: "DAT POU SONJE", en: "DATE TO REMEMBER" },
  passed: { ht: "DAT LA DEJA PASE", en: "DEADLINE HAS PASSED" },
  todo: { ht: "Sa pou w fè", en: "What to do" },
  docs: { ht: "Papye ou bezwen", en: "Papers you need" },
  contact: { ht: "Kontak sou lèt la", en: "Contact on the letter" },
  answer: { ht: "Repons pou kesyon ou", en: "Answer to your question" },
  unclear: { ht: "Gen kèk pati nou pa t ka li byen. Yon navigatè KHADA ap verifye.", en: "Some parts were hard to read. A KHADA navigator will check." },
  wa: { ht: "Voye sa sou WhatsApp", en: "Send on WhatsApp" },
  again: { ht: "Eksplike yon lòt lèt", en: "Explain another letter" },
  home: { ht: "Retounen nan paj prensipal la", en: "Back to home" },
  disclaimer: { ht: "Eksplikasyon sa a fèt ak AI epi li ka gen erè. Toujou verifye dat yo sou lèt orijinal la. Pou sante ou, pale ak doktè ou. Rele 2-1-1 lè w pa sèten.", en: "This explanation is made with AI and may contain mistakes. Always check dates on the original letter. For your health, talk to your doctor. Call 2-1-1 when unsure." },
  high: { ht: "Ijan — aji vit", en: "Urgent — act soon" },
  medium: { ht: "Gen yon bagay pou w fè", en: "Action needed" },
  low: { ht: "Enfòmasyon sèlman", en: "Information only" },
  eTooBig: { ht: "Paj yo twò lou ansanm. Retire yon paj, oswa itilize foto olye de PDF.", en: "The pages are too large together. Remove a page, or use photos instead of a PDF." },
  eType: { ht: "Voye yon foto (JPG, PNG) oswa yon PDF.", en: "Send a photo (JPG, PNG) or a PDF." },
  eNotLetter: { ht: "Sa pa sanble yon lèt. Pran yon foto tout paj lèt la, nan bon limyè.", en: "That doesn't look like a letter. Photograph the whole page in good light." },
  eBusy: { ht: "Sèvis la chaje jodi a. Eseye demen, oswa rele yon navigatè KHADA.", en: "The service is busy today. Try tomorrow or call a KHADA navigator." },
  eFail: { ht: "Nou pa t ka li lèt la. Eseye ankò, oswa pale ak yon navigatè KHADA.", en: "We couldn't read the letter. Try again or talk to a KHADA navigator." },
  eNet: { ht: "Pa gen koneksyon. Eseye ankò.", en: "No connection. Try again." },
  remindTitle: { ht: "Fè m sonje", en: "Remind me" },
  remindLead: { ht: "Pou w pa bliye dat limit la:", en: "So you don't miss the deadline:" },
  cal: { ht: "📅 Mete l nan kalandriye telefòn mwen", en: "📅 Add it to my phone's calendar" },
  waRemind: { ht: "💬 KHADA voye m yon rapèl sou WhatsApp", en: "💬 KHADA sends me a WhatsApp reminder" },
  remindPhone: { ht: "Nimewo WhatsApp ou:", en: "Your WhatsApp number:" },
  remindConsent: { ht: "Mwen dakò pou KHADA kenbe nimewo m ak dat la pou voye m 2 mesaj: yon rapèl 7 jou anvan, ak yon ti mesaj 1 jou apre pou wè si tout bagay byen pase. Ekri STOP nenpòt ki lè pou n sispann.", en: "I agree that KHADA may keep my number and the date to send me 2 messages: a reminder 7 days before, and a short check-in 1 day after. Reply STOP anytime." },
  remindGo: { ht: "Wi, voye m rapèl", en: "Yes, remind me" },
  remindOk: { ht: "Byen! Yon navigatè KHADA ap voye w yon rapèl sou WhatsApp anvan dat la.", en: "Done! A KHADA navigator will send you a WhatsApp reminder before the date." },
  remindBadPhone: { ht: "Tcheke nimewo a (10 chif).", en: "Check the number (10 digits)." },
  remindFail: { ht: "Nou pa t ka anrejistre rapèl la. Itilize kalandriye a pou kounye a.", en: "We couldn't save the reminder. Use the calendar for now." },
};

const URG_COLOR = { high: "var(--red)", medium: "var(--gold)", low: "var(--green)" } as const;

/** Shrinks phone photos so they fit under the upload limit and upload fast on weak connections. */
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height)); // ~1600px keeps text readable and 10 pages under the upload limit
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.8));
    return blob ? new File([blob], "letter.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file; // e.g. HEIC on some browsers — let the server decide
  }
}

export default function Explainer() {
  const [lang, setLang] = useState<Lang>("ht");
  // Pages of the letter, in order. url is a local preview only (never uploaded separately).
  const [pages, setPages] = useState<{ file: File; url: string | null }[]>([]);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emergency, setEmergency] = useState<string | null>(null);
  const [r, setR] = useState<LetterResult | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showWa, setShowWa] = useState(false);
  const [waPhone, setWaPhone] = useState("");
  const [waConsent, setWaConsent] = useState(false);
  const [waState, setWaState] = useState<"idle" | "busy" | "ok" | "badPhone" | "fail">("idle");
  const t = (k: string) => T[k][lang];

  const MAX_PAGES = 10;
  const MAX_TOTAL = 4.2 * 1024 * 1024;

  async function addPages(list: FileList | null) {
    setError(null);
    if (!list || list.length === 0) return;
    const room = MAX_PAGES - pages.length;
    if (room <= 0) { setError(t("eTooMany")); return; }
    const chosen = Array.from(list).slice(0, room);
    const small = await Promise.all(chosen.map(shrink));
    const added = small.map((f) => ({ file: f, url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null }));
    const next = [...pages, ...added];
    if (list.length > room) setError(t("eTooMany"));
    if (next.reduce((n, p) => n + p.file.size, 0) > MAX_TOTAL) setError(t("eTooBig"));
    setPages(next);
  }

  function removePage(i: number) {
    const p = pages[i];
    if (p?.url) URL.revokeObjectURL(p.url);
    setPages(pages.filter((_, j) => j !== i));
    setError(null);
  }

  async function submit() {
    if (pages.length === 0 || !consent) return;
    if (pages.reduce((n, p) => n + p.file.size, 0) > MAX_TOTAL) { setError(t("eTooBig")); return; }
    setBusy(true);
    setError(null);
    const fd = new FormData();
    for (const p of pages) fd.append("letter", p.file);
    fd.append("lang", lang);
    fd.append("note", note);
    fd.append("contact", contact);
    fd.append("consent", "yes");
    try {
      const res = await fetch("/api/explain-letter", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (data.emergency) setEmergency(data.emergency);
      if (!res.ok) {
        const msg = t({ file_too_large: "eTooBig", unsupported_type: "eType", busy: "eBusy", too_many_pages: "eTooMany" }[data.error as string] ?? (res.status === 413 ? "eTooBig" : "eFail"));
        // Small code at the end helps KHADA find the problem (e.g. "503 not_configured").
        setError(`${msg} (${res.status}${data.error ? ` ${data.code ?? data.error}` : ""})`);
      } else if (!data.result?.is_letter) {
        setError(t("eNotLetter"));
      } else {
        setR(data.result);
        setReviewId(data.reviewId ?? null);
        setSaveError(data.saveError ?? null);
        setWaPhone(contact);
        window.scrollTo({ top: 0 });
      }
    } catch {
      setError(t("eNet"));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    for (const p of pages) if (p.url) URL.revokeObjectURL(p.url);
    setR(null); setPages([]); setNote(""); setError(null);
    setReviewId(null); setShowWa(false); setWaConsent(false); setWaState("idle");
  }

  const ht = lang === "ht";
  const steps = r ? (ht ? r.next_steps_ht : r.next_steps_en) : [];
  const docs = r ? (ht ? r.documents_needed_ht : r.documents_needed_en) : [];
  const answer = r ? (ht ? r.answer_ht : r.answer_en) : null;

  // Reminders only make sense for a real, future deadline.
  const remindable = !!r && !r.deadline_passed && isIsoDate(r.deadline_iso) && r.deadline_iso >= todayIso();
  const icsHref = remindable && r
    ? `/api/ics?${new URLSearchParams({ d: r.deadline_iso!, s: r.sender, n: (ht ? r.deadline_ht : r.deadline_en) ?? "", l: lang })}`
    : "";

  async function saveReminder() {
    if (!reviewId || !waConsent) return;
    if (waPhone.replace(/\D/g, "").length < 10) { setWaState("badPhone"); return; }
    setWaState("busy");
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewId, phone: waPhone, consent: true }),
      });
      const data = await res.json().catch(() => ({}));
      setWaState(res.ok ? "ok" : data.error === "bad_phone" ? "badPhone" : "fail");
    } catch {
      setWaState("fail");
    }
  }

  function shareText() {
    if (!r) return "";
    return [
      `${t("from")}: ${r.sender}`,
      ht ? r.summary_ht : r.summary_en,
      r.deadline ? `${t(r.deadline_passed ? "passed" : r.urgency === "low" ? "remember" : "deadline")}: ${r.deadline} — ${(ht ? r.deadline_ht : r.deadline_en) ?? ""}` : "",
      steps.length ? `${t("todo")}:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : "",
      r.contact ? `${t("contact")}: ${r.contact}` : "",
      "— KHADA Pathway",
    ].filter(Boolean).join("\n\n");
  }

  return (
    <main className="app">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>KHADA <span>Pathway</span></Link>
        <div className="lang">
          <button aria-pressed={ht} onClick={() => setLang("ht")}>Kreyòl</button>
          <button aria-pressed={!ht} onClick={() => setLang("en")}>English</button>
        </div>
      </header>

      {emergency && <div role="alert" className="alert">{emergency}</div>}

      {!r && (
        <>
          <h1>{t("title")}</h1>
          <p className="lead">{t("lead")}</p>

          {pages.length > 0 && (
            <>
              <div className="pages">
                {pages.map((p, i) => (
                  <figure key={i} className="pg">
                    {p.url ? <img src={p.url} alt="" /> : <div className="pdf">PDF</div>}
                    <figcaption>{t("page")} {i + 1}</figcaption>
                    <button type="button" aria-label={t("remove")} onClick={() => removePage(i)}>×</button>
                  </figure>
                ))}
              </div>
              <p className="lead" style={{ fontSize: ".9rem", margin: "0 0 8px" }}>✓ {pages.length} {t("pagesReady")} · {t("pagesMax")}</p>
            </>
          )}

          {/* Camera: opens the phone camera directly. One page per photo. */}
          {pages.length < MAX_PAGES && (
            <label className="drop">
              <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => { addPages(e.target.files); e.target.value = ""; }} />
              <span>{t(pages.length ? "pickMore" : "pick")}</span>
            </label>
          )}
          {/* Gallery / files: photos received on WhatsApp, screenshots, or a PDF from email. Several at once. */}
          {pages.length < MAX_PAGES && (
            <label className="sbtn" style={{ display: "block", cursor: "pointer", margin: "0 0 6px" }}>
              <input type="file" accept="image/*,application/pdf" multiple hidden onChange={(e) => { addPages(e.target.files); e.target.value = ""; }} />
              {t(pages.length ? "pickFileMore" : "pickFile")}
            </label>
          )}
          {pages.length === 0 && <p className="lead" style={{ fontSize: ".85rem", margin: "0 0 8px" }}>{t("pickFileHint")}</p>}
          <div className="note" style={{ fontSize: ".9rem" }}>{t("multiTip")}</div>
          <p className="lead" style={{ fontSize: ".95rem" }}>{t("tip")}</p>

          <label className="field">{t("noteAsk")}
            <textarea rows={3} value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
          </label>
          <label className="field">{t("contactAsk")}
            <input className="tel" type="tel" inputMode="tel" value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>

          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{t("consent")}</span>
          </label>

          {error && <p className="err" role="status">{error}</p>}
          <button className="big" disabled={pages.length === 0 || !consent || busy} onClick={submit}>{busy ? t("busy") : t("go")}</button>
        </>
      )}

      {r && (
        <>
          <span className="urgent" style={{ background: URG_COLOR[r.urgency] }}>{t(r.urgency)}</span>
          <p className="lead" style={{ margin: "10px 0 2px" }}>{t("from")}</p>
          <h2>{r.sender}</h2>
          <p style={{ fontSize: "1.1rem" }}>{ht ? r.summary_ht : r.summary_en}</p>

          {r.deadline && (
            <div className={r.deadline_passed ? "deadline passed" : r.urgency === "low" ? "deadline calm" : "deadline"}>
              <div className="k">{t(r.deadline_passed ? "passed" : r.urgency === "low" ? "remember" : "deadline")}</div>
              <div className="v">{r.deadline}</div>
              {(ht ? r.deadline_ht : r.deadline_en) && <p style={{ margin: 0 }}>{ht ? r.deadline_ht : r.deadline_en}</p>}
            </div>
          )}

          {remindable && (
            <div className="remind no-print">
              <h3 style={{ marginTop: 0 }}>🔔 {t("remindTitle")}</h3>
              <p className="lead" style={{ fontSize: ".95rem", margin: "0 0 10px" }}>{t("remindLead")}</p>
              <a className="sbtn" href={icsHref}>{t("cal")}</a>
              {reviewId && waState !== "ok" && !showWa && (
                <button className="sbtn" style={{ width: "100%", marginTop: 10 }} onClick={() => setShowWa(true)}>{t("waRemind")}</button>
              )}
              {reviewId && showWa && waState !== "ok" && (
                <div style={{ marginTop: 12 }}>
                  <label className="field">{t("remindPhone")}
                    <input className="tel" type="tel" inputMode="tel" value={waPhone} onChange={(e) => { setWaPhone(e.target.value); setWaState("idle"); }} />
                  </label>
                  <label className="consent">
                    <input type="checkbox" checked={waConsent} onChange={(e) => setWaConsent(e.target.checked)} />
                    <span>{t("remindConsent")}</span>
                  </label>
                  {(waState === "badPhone" || waState === "fail") && <p className="err">{t(waState === "badPhone" ? "remindBadPhone" : "remindFail")}</p>}
                  <button className="big" style={{ marginTop: 0 }} disabled={!waConsent || waState === "busy"} onClick={saveReminder}>{t("remindGo")}</button>
                </div>
              )}
              {waState === "ok" && <p className="ok">✓ {t("remindOk")}</p>}
              {!reviewId && <p className="legal" style={{ margin: "8px 0 0", border: 0, padding: 0 }}>WhatsApp: {saveError ?? "not_saved"}</p>}
            </div>
          )}

          {answer && <div className="note"><strong>{t("answer")}:</strong> {answer}</div>}

          {steps.length > 0 && (
            <>
              <h3>{t("todo")}</h3>
              <ol className="list">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </>
          )}
          {docs.length > 0 && (
            <>
              <h3>{t("docs")}</h3>
              <ul className="list">{docs.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </>
          )}
          {r.contact && <p><strong>{t("contact")}:</strong> {r.contact}</p>}
          {r.unclear_parts.length > 0 && <div className="note">⚠️ {t("unclear")}</div>}

          <div className="share-grid no-print" style={{ marginTop: 12 }}>
            <a className="sbtn wa" href={`https://wa.me/?text=${encodeURIComponent(shareText())}`} target="_blank" rel="noopener noreferrer">{t("wa")}</a>
          </div>
          <button className="big" style={{ marginTop: 14 }} onClick={reset}>{t("again")}</button>
          <Link href="/" className="quiet" style={{ textAlign: "center", textDecoration: "none" }}>{t("home")}</Link>
          <p className="legal">{t("disclaimer")}</p>
        </>
      )}
    </main>
  );
}
