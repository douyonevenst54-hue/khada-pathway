import Link from "next/link";
import { pathways } from "@/lib/pathways";

export default function Home() {
  return (
    <main className="app">
      <header><div className="brand">KHADA <span>Pathway</span></div></header>
      <h1>Di nou sa w bezwen. N ap ede w jwenn chemen an.</h1>
      <p className="lead">Tell us what you need. We&apos;ll help you find the path.</p>
      <div className="opts">
        {Object.values(pathways).map((p) => (
          <Link key={p.id} href={`/pathway/${p.id}`} className="opt">
            {p.name.ht} · {p.name.en}
          </Link>
        ))}
      </div>
      <p className="legal">Nou pa mande non w, epi nou pa janm mande estati imigrasyon w. · We don&apos;t ask your name and we never ask about immigration status.</p>
    </main>
  );
}
