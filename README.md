# Admin Portal — Build 2 (standalone)

English admin dashboard for the Rabbit Mart hiring portal, backed by a local JSON "database"
(`data/db.json`, auto-created on first run from the seed files in `/data`).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 → redirects to `/login`.

**Default login:** `admin` / `RabbitAdmin!2026` — change this once real users are set up
(currently hardcoded in `lib/db.js`'s seed data; a proper user-management screen is a fast follow).

## What's wired up

- Real username/password auth (bcrypt + server-side sessions, httpOnly cookie)
- Dashboard with live counts + a change log (who changed what, when)
- Jobs — edit title/status/description/responsibilities/requirements/benefits
- Branches — full table with the **Active for interviews** toggle (the feature you asked to be
  front-and-center); flipping it writes immediately and is logged
- Interview Slots — default window template (days/hours/capacity)
- Applicants — status pipeline; currently empty by design, since this build is intentionally
  isolated from Build 1 until the Connect phase
- AI Knowledge Base — add/edit/delete the FAQ entries the chat agent is allowed to answer from
- Site Content Editor — marquee text, button/copy strings, and a free-text field for your own
  WhatsApp Business profile message

## Connect phase — done

`lib/db.js` reads Jobs/Branches/FAQ/Applicants from the real Sheet and pushes every edit back
the moment `GOOGLE_SERVICE_ACCOUNT_EMAIL`/`GOOGLE_SERVICE_ACCOUNT_KEY` are set — branch toggle,
job edit, FAQ CRUD, applicant status, all two-way. Interview slots, site content, and admin
login stay local (never part of the Sheet schema). No credentials → runs exactly like the
standalone build. See `../CONNECT_PHASE.md` at the repo root for the full picture.
