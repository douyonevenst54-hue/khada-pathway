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

## Next
1. Real navigator auth (magic link) and per-org accounts.
2. 7/30-day SMS reminders (Twilio) for sessions with a contact.
3. Pull resource listings from Mass 211 / findhelp instead of hardcoding.
4. Pathway 2.
