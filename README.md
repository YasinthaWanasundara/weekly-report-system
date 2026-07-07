# Weekly Report Generator & Team Dashboard

A full-stack web app that lets team members submit structured weekly work reports and lets managers view and analyze those reports across the whole team via a consolidated dashboard.

**Stack:** React (Vite + Tailwind + Recharts) · Node.js / Express · PostgreSQL (Sequelize ORM) · JWT auth

## Contents

- `/frontend` – React app (personal report page + manager dashboard)
- `/backend` – Express REST API (auth, reports, projects, dashboard aggregations)
- `ER_DIAGRAM.svg` / `ER_DIAGRAM.png` – database entity-relationship diagram

## Demo accounts (after seeding, see step 5 below)

| Role    | Email             | Password    |
|---------|-------------------|-------------|
| Manager | manager@demo.com  | password123 |
| Member  | member1@demo.com  | password123 |
| Member  | member2@demo.com  | password123 |
| Member  | member3@demo.com  | password123 |

---

## 1. Installing dependencies

**Prerequisites:** Node.js 18+, npm, and a PostgreSQL database (local install or a free cloud instance — see step 2).

```bash
# Clone the repo
git clone <your-repo-url>
cd <repo-folder>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Running the database

**Option A — Local PostgreSQL**

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo service postgresql start

# Windows
# Download and run the installer from https://www.postgresql.org/download/windows/
# then start the "postgresql-x64-16" service from Services
```

Create the database:

```bash
# macOS/Linux
psql -U postgres -c "CREATE DATABASE weekly_reports;"

# if you get "password authentication failed", set a password first:
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

**Option B — Free cloud PostgreSQL (no local install)**

Any of these work well and take a couple of minutes to set up:
- **Neon** — https://neon.tech (generous free tier, instant provisioning)
- **Supabase** — https://supabase.com (free tier includes a Postgres database)
- **Railway** — https://railway.app

Each gives you a connection string that looks like:
```
postgres://user:password@host:5432/dbname
```
Use that directly as `DATABASE_URL` in step 3 — skip the local install entirely.

## 3. Running the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:

```
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/weekly_reports
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

(swap `DATABASE_URL` for your cloud provider's connection string if using Option B above)

Then start the server:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

You should see:
```
PostgreSQL connected
Models synced
Server running on port 5000
```

`sequelize.sync({ alter: true })` in `server.js` automatically creates the `users`, `projects`, and `reports` tables (and keeps them in sync with the model files) — no separate migration step needed for local development.

Check `http://localhost:5000/api/health` in a browser to confirm the API is up.

**Seed demo data** — creates 1 manager, 3 members, 4 projects, and 4 weeks of sample reports (this resets/recreates all tables, so only run it against a dev database):

```bash
npm run seed
```

## 4. Running the frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
```

Confirm `.env` points at your backend:

```
VITE_API_URL=http://localhost:5000/api
```

Then start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. Register a new account (choose role "Team Member" or "Manager / Admin"), or log in with the seeded demo accounts above.

## 5. Production build (optional)

```bash
cd frontend
npm run build     # outputs to frontend/dist
npm run preview   # serve the production build locally
```

---

## Architecture Overview

- **Auth**: JWT issued on login/register, stored in `localStorage`, sent as `Authorization: Bearer <token>`. `protect` middleware verifies the token; `requireRole("manager")` gates manager-only routes.
- **Reports**: Fixed schema enforced both in the Sequelize model (`backend/models/Report.js`) and in a single shared `ReportForm` component, so every user's report has identical fields in identical order. Members can only read/write their own reports (enforced server-side via `report.userId === req.user.id`, not just hidden in the UI).
- **Dashboard**: Manager-only aggregation endpoints (`/api/dashboard/*`) use SQL `GROUP BY` / `SUM` / `COUNT` via Sequelize to compute compliance rate, open blockers, tasks-submitted trend, and workload by project — computed on demand from the `reports` table rather than a separate analytics table.
- **Projects**: Simple CRUD table referenced by every report; soft-deleted (`isActive = false`) rather than hard-deleted so historical reports keep their project reference.
- **Database**: PostgreSQL with three tables (`users`, `projects`, `reports`) and native `ENUM` types for `role` and `status`, so invalid values are rejected at the database level, not just in application code. A composite unique index on `(userId, weekStart, projectId)` prevents duplicate weekly submissions.

## API Summary

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Log in, get JWT |
| GET | `/api/auth/me` | Authenticated | Current user |
| GET/POST | `/api/projects` | Auth / Manager | List / create projects |
| PUT/DELETE | `/api/projects/:id` | Manager | Edit / remove project |
| GET/POST | `/api/reports` | Authenticated | List (own or, for managers, filtered team-wide) / create report |
| PUT/DELETE | `/api/reports/:id` | Owner only | Edit / delete own report |
| GET | `/api/dashboard/summary` | Manager | Weekly summary metrics |
| GET | `/api/dashboard/submission-status` | Manager | Per-member submitted/pending/late |
| GET | `/api/dashboard/tasks-trend` | Manager | Reports-submitted trend over weeks |
| GET | `/api/dashboard/workload-by-project` | Manager | Hours/reports per project |
| GET | `/api/dashboard/recent-activity` | Manager | Recent submissions feed |
| GET | `/api/users` | Manager | Team member list (for filters) |

## Troubleshooting

- **`password authentication failed for user "postgres"`** — your local Postgres user's password doesn't match `DATABASE_URL`. Reset it with `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"` and make sure `.env` matches.
- **`ECONNREFUSED` connecting to the database** — Postgres isn't running. Start it with `sudo service postgresql start` (Linux) or `brew services start postgresql@16` (Mac), or double-check your cloud connection string.
- **Changes to `.env` not taking effect** — make sure you edited `.env`, not `.env.example`. Only `.env` is actually loaded by the app; `.env.example` is just a template that's safe to commit.
- **`relation "users" does not exist`** — the server hasn't synced the models yet. Run `npm run dev` (or `npm start`) at least once, or run `npm run seed`, before hitting the API.

## Possible Future Improvements

- AI chat assistant over stored reports (Q&A + auto-generated team summaries)
- Email/Slack reminders for pending or late reports
- Refresh-token rotation instead of long-lived JWTs
- Formal Sequelize migrations (`sequelize-cli`) instead of `sync({ alter: true })`, for safer production schema changes
- Per-project team assignment enforced at the report-creation step
- Exportable PDF/CSV weekly summaries for managers
