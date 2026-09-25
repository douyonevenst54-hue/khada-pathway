"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang, Step } from "@/lib/types";
import { ui } from "@/lib/ui";
import { fill, fillUrl } from "@/lib/resources";

export default function Plan(props: { sessionId: string; zip: string; lang: Lang; steps: Step[]; status: Record<string, string>; contact: string }) {
  const [lang, setLang] = useState<Lang>(props.lang);
  const [status, setStatus] = useState(props.status);
  const [contact, setContact] = useState(props.contact);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [origin, setOrigin] = useState("");
  const t = (k: string) => ui[k][lang];

    useEffect(() => { setCanShare(!!navigator.share); setOrigin(window.location.origin); }, []);

  const link = origin ? `${origin}/plan/${props.sessionId}?lang=${lang}` : "";

  function planText() {
    const lines = [`${t("shareIntro")} (${props.zip})`, ""];
    props.steps.forEach((s, n) => {
      lines.push(`${n + 1}. ${s.title[lang]}`);
      lines.push(`   ${t("shareNeed")}: ${s.need.map((x) => x[lang]).join(", ")}`);
      lines.push(`   ${fillUrl(s.url, props.zip)}`);
    });
    lines.push("", link);
    return lines.join("\n");
  }
  const enc = () => encodeURIComponent(planText());

  async function share() {
    try { await navigator.share({ title: "KHADA Pathway", text: planText() }); } catch { /* user cancelled */ }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  }
  async function mark(stepKey: string, s: "applied" | "help") {
    setStatus({ ...status, [stepKey]: s });
    await fetch(`/api/sessions/${props.sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ stepKey, status: s }) });
  }
  async function saveContact() {
    await fetch(`/api/sessions/${props.sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ contact }) });
  }

  return (
    <main className="app">
      <header className="no-print">
        <div className="brand">KHADA <span>Pathway</span></div>
        <div className="lang">
          <button aria-pressed={lang === "ht"} onClick={() => setLang("ht")}>Kreyòl</button>
          <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
        </div>
      </header>
      <h1>{t("planTitle")}</h1>
      <p className="lead">{props.steps.length} {lang === "ht" ? "etap pou kòd postal" : "steps for zip code"} {props.zip}.</p>
      <div className="note">{t("planNote")}</div>
      <ol className="plan">
        {props.steps.map((s, n) => {
          const st = status[s.key];
          const url = fillUrl(s.url, props.zip);
          return (
            <li key={s.key} className={`step ${st ?? ""}`}>
              <div className="n">{n + 1}</div>
              {s.urgent && <span className="urgent">{s.urgent[lang]}</span>}
              <h3>{s.title[lang]}</h3>
              <p className="why">{s.why[lang]}</p>
              <ul>{s.need.map((x, j) => <li key={j}>{x[lang]}</li>)}</ul>
              <p className="where">{fill(s.where[lang], props.zip, lang)}<br /><a href={url} target="_blank" rel="noopener">{url.replace(/^https?:\/\/(www\.)?/, "")}</a></p>
              <div className="acts no-print">
                <button className="yes" aria-pressed={st === "applied"} onClick={() => mark(s.key, "applied")}>{t("applied")}</button>
                <button className="no" aria-pressed={st === "help"} onClick={() => mark(s.key, "help")}>{t("help")}</button>
              </div>
              <p className="status no-print">{st === "applied" ? t("stApplied") : st === "help" ? t("stHelp") : ""}</p>
            </li>
          );
        })}
      </ol>

      <section className="share no-print">
        <h2>{t("shareTitle")}</h2>
        <p className="lead">{t("shareLead")}</p>
        <div className="share-grid">
          <a className="sbtn wa" href={`https://wa.me/?text=${enc()}`} target="_blank" rel="noopener">{t("shareWhatsApp")}</a>
          <a className="sbtn" href={`sms:?&body=${enc()}`}>{t("shareSms")}</a>
          {canShare && <button className="sbtn" onClick={share}>{t("shareOther")}</button>}
          <button className="sbtn" onClick={copy}>{copied ? t("copied") : t("copyLink")}</button>
          <button className="sbtn" onClick={() => window.print()}>{t("print")}</button>
        </div>
      </section>

      <div className="note no-print">
        <label>{t("contactAsk")}<input className="tel" inputMode="tel" value={contact} onChange={(e) => setContact(e.target.value)} onBlur={saveContact} /></label>
      </div>
      <Link href="/" className="quiet no-print">{t("restart")}</Link>
      <p className="legal">{t("disclaimer")}</p>
      <p className="print-only legal">{link}</p>
    </main>
  );
}
