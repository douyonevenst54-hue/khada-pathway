"use client";
import { useState } from "react";

export default function Login({ error }: { error?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function submit() {
    await fetch("/api/auth/request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    setSent(true);
  }
  return (
    <main className="app">
      <header><div className="brand">KHADA <span>Navigator</span></div></header>
      <h1>Sign in</h1>
      {error && <div className="note">That link is invalid or expired. Request a new one.</div>}
      {sent ? (
        <p className="lead">If that email belongs to a navigator, a sign-in link is on its way. It's valid for 20 minutes.</p>
      ) : (
        <>
          <p className="lead">Enter your navigator email and we'll send you a one-time link.</p>
          <input className="tel" type="email" inputMode="email" placeholder="you@khada.xyz" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="big" disabled={!/\S+@\S+\.\S+/.test(email)} onClick={submit}>Send link</button>
        </>
      )}
    </main>
  );
}
