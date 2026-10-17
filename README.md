# Khada Pathway

"Tell us what you need. We'll help you find the path."

## Setup (Windows / Git Bash)
```bash
npm install
cp .env.example .env        # fill DATABASE_URL (new Neon DB) and NAVIGATOR_KEY
npx prisma migrate dev --name init
npm run dev                 # http://localhost:3000
```

## Where things live
- `lib/pathways/*.ts` — one file per pathway: questions, steps, and the `plan()` eligibility function. Program rules change yearly; edit here only.
- `lib/ui.ts` — interface strings (ht/en).
- `app/pathway/[id]` — screener (client). `app/plan/[id]` — the person's plan. `app/navigator` — KHADA staff view (`/navigator?key=...`).
- `prisma/schema.prisma` — minimal by design. No names, no immigration status, no income figures.

## Eksplike lèt mwen (`/eksplike-let`)
The person photographs an official letter; AI explains it in Kreyòl (or English): sender, urgency, deadline, steps, papers needed.
- `lib/explain-letter/prompt.ts` — the rules the AI follows (paperwork only, no medical/legal advice) + JSON shape. Edit the Creole wording here.
- `lib/explain-letter/red-flags.ts` — emergency words → 911 / 988 message + e-mail alert to navigators.
- `app/api/explain-letter` — calls Claude. The photo stays in memory only; it is never saved.
- `LetterReview` table — only the summary, urgency, deadline and optional phone, for review in `/navigator#letters`.
- Needs `ANTHROPIC_API_KEY`. After pulling: `npx prisma migrate deploy` (or `migrate dev`).

## Fè m sonje (deadline reminders)
When an explained letter has a future deadline, the person sees a **Fè m sonje** box:
- **📅 Add to calendar** — `/api/ics` returns an event with alerts 7 days and 1 day before. Nothing is stored.
- **💬 WhatsApp reminder** — with consent, saves two `Reminder` rows: 7 days before, and a check-in 1 day after.
  Navigators send them from `/navigator#reminders` with one tap (opens WhatsApp with the Kreyòl message ready),
  then record the check-in answer (done / needs help / no answer) or Stop. This gives the "deadlines met" number.
- Helpers and message wording: `lib/reminders.ts`. After pulling: `npx prisma migrate deploy`.
- Next step: send automatically (Twilio WhatsApp/SMS + a daily Vercel cron) once a sender number is approved.

## Next
1. Real navigator auth (magic link) and per-org accounts.
2. 7/30-day SMS reminders (Twilio) for sessions with a contact.
3. Pull resource listings from Mass 211 / findhelp instead of hardcoding.
4. Pathway 2.
