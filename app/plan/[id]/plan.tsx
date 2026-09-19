"use client";
import { useState } from "react";
import Link from "next/link";
import type { Lang, Step } from "@/lib/types";
import { ui } from "@/lib/ui";

export default function Plan(props: { sessionId: string; zip: string; lang: Lang; steps: Step[]; status: Record<string, string>; contact: string }) {
  const [lang, setLang] = useState<Lang>(props.lang);
  const [status, setStatus] = useState(props.status);
  const [contact, setContact] = useState(props.contact);
  const t = (k: string) => ui[k][lang];

  async function mark(stepKey: string, s: "applied" | "help") {
    const next = { ...status, [stepKey]: s };
    setStatus(next);
    await fetch(`/api/sessions/${props.sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ stepKey, status: s }) });
  }
  async function saveContact() {
    await fetch(`/api/sessions/${props.sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ contact }) });
  }

  return (
    <main className="app">
      <header>
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
          return (
            <li key={s.key} className={`step ${st ?? ""}`}>
              <div className="n">{n + 1}</div>
              {s.urgent && <span className="urgent">{s.urgent[lang]}</span>}
              <h3>{s.title[lang]}</h3>
              <p className="why">{s.why[lang]}</p>
              <ul>{s.need.map((x, j) => <li key={j}>{x[lang]}</li>)}</ul>
              <p className="where">{s.where[lang]}<br /><a href={s.url} target="_blank" rel="noopener">{s.url.replace(/^https?:\/\/(www\.)?/, "")}</a></p>
              <div className="acts">
                <button className="yes" aria-pressed={st === "applied"} onClick={() => mark(s.key, "applied")}>{t("applied")}</button>
                <button className="no" aria-pressed={st === "help"} onClick={() => mark(s.key, "help")}>{t("help")}</button>
              </div>
              <p className="status">{st === "applied" ? t("stApplied") : st === "help" ? t("stHelp") : ""}</p>
            </li>
          );
        })}
      </ol>
      <div className="note">
        <label>{t("contactAsk")}<input className="tel" inputMode="tel" value={contact} onChange={(e) => setContact(e.target.value)} onBlur={saveContact} /></label>
      </div>
      <Link href="/" className="quiet">{t("restart")}</Link>
      <p className="legal">{t("disclaimer")}</p>
    </main>
  );
}
