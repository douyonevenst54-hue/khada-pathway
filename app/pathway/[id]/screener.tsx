"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Answers, Lang, Pathway } from "@/lib/types";
import { ui } from "@/lib/ui";

type Data = Omit<Pathway, "plan">;

export default function Screener({ pathway }: { pathway: Data }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ht");
  const [i, setI] = useState(-1); // -1 = intro
  const [a, setA] = useState<Answers>({});
  const [busy, setBusy] = useState(false);
  const t = (k: string) => ui[k][lang];
  const q = i >= 0 ? pathway.questions[i] : null;
  const ok = q ? (q.type === "zip" ? /^\d{5}$/.test(String(a.zip ?? "")) : a[q.key] !== undefined) : false;

  async function finish() {
    setBusy(true);
    const r = await fetch("/api/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pathwayId: pathway.id, lang, answers: a }),
    });
    const { id } = await r.json();
    router.push(`/plan/${id}?lang=${lang}`);
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

      {i < 0 && (
        <>
          <h1>{pathway.name[lang]}</h1>
          <p className="lead">{pathway.intro[lang]}</p>
          <button className="big" onClick={() => setI(0)}>{t("start")}</button>
          <p className="legal">{t("privacy")}</p>
        </>
      )}

      {q && (
        <>
          <div className="progress">{pathway.questions.map((_, j) => <i key={j} className={j <= i ? "done" : ""} />)}</div>
          <h2>{q.text[lang]}</h2>
          {q.type === "zip" ? (
            <input className="zip" inputMode="numeric" maxLength={5} value={String(a.zip ?? "")}
              onChange={(e) => setA({ ...a, zip: e.target.value })} aria-label="zip" />
          ) : (
            <div className="opts">
              {q.options.map((o, j) => (
                <button key={j} className="opt" aria-pressed={a[q.key] === j} onClick={() => setA({ ...a, [q.key]: j })}>{o[lang]}</button>
              ))}
            </div>
          )}
          <button className="big" disabled={!ok || busy} onClick={() => (i < pathway.questions.length - 1 ? setI(i + 1) : finish())}>{t("next")}</button>
          <button className="quiet" onClick={() => setI(i - 1)}>{t("back")}</button>
        </>
      )}
    </main>
  );
}
