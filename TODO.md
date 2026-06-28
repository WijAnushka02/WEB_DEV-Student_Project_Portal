# TODO — UOK Connect

This file tracks remaining work for the next developers picking up this project.

---

## High Priority

### Backend
- [ ] **Students page** — add dedicated `/api/students` endpoint that returns only users with `role = 'student'` with project counts
- [ ] **Admin dashboard API** — endpoints for admin to view stats (total users, projects, likes)
- [ ] **Admin — remove user** — `DELETE /api/admin/users/:id` endpoint
- [ ] **Search by tag** — filter projects by tag in `GET /api/projects?tag=react`
- [ ] **Pagination for user projects** — currently returns all; add limit/offset
- [ ] **Email notifications** — integrate Nodemailer or SendGrid for notification emails
- [ ] **Refresh token** — implement token refresh so sessions survive past 7 days without re-login
- [ ] **Password-protected drafts** — students can share draft preview links

### Frontend
- [ ] **Students list page** — `/students` currently reuses ProjectsPage; build a proper students grid
- [ ] **Admin dashboard page** — full admin UI: user management, project moderation table, stats cards
- [ ] **Project search by tags** — tag filter buttons on `/projects` page
- [ ] **Notification real-time updates** — integrate WebSocket (Socket.io) or polling for live notifications
- [ ] **Image crop/preview** — add image cropping before upload (use `react-easy-crop`)
- [ ] **Skeleton loaders** — replace `animate-pulse` divs with proper skeleton components
- [ ] **Toast for auth events** — show toast on successful login/logout
- [ ] **Profile edit page** — allow students to update name and profile picture

---

## Medium Priority

### Features
- [ ] **Comments on projects** — add `comments` table and comment threads
- [ ] **Project view analytics** — chart showing views over time (use Recharts)
- [ ] **Follow/follower lists** — UI to see who follows you and who you follow
- [ ] **Share project** — copy link button, Open Graph meta tags for social sharing
- [ ] **Tech stack filter** — filter projects by tech stack on browse page
- [ ] **Sort options** — sort by Most Liked, Most Viewed, Newest on projects page
- [ ] **Student ID validation** — validate against a whitelist or pattern for UOK IDs

### DevOps
- [ ] **Docker Compose** — containerise server + client + postgres for easy local dev
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint + build checks on PR
- [ ] **Environment validation** — use `envalid` or similar to fail fast on missing env vars
- [ ] **Database migrations** — replace `setupDb.js` with a proper migration tool (Flyway, node-pg-migrate)
- [ ] **Logging** — replace `console.log` with Winston or Pino for structured logs
- [ ] **Error monitoring** — integrate Sentry for both client and server

---

## Low Priority / Nice-to-Have

- [ ] **Dark mode** — add Tailwind dark mode toggle
- [ ] **i18n** — Sinhala / English language toggle
- [ ] **Project categories** — predefined categories (AI/ML, Web, Mobile, IoT, etc.)
- [ ] **PDF export** — export student project portfolio as PDF
- [ ] **Recruiter dashboard** — companies can save/bookmark projects
- [ ] **Trending projects** — algorithm-based trending section on landing page
- [ ] **PWA support** — make the frontend installable as a mobile app
- [ ] **API rate limit per user** — track and limit per authenticated user instead of per IP

---

## Setup Checklist (Before First Deploy)

- [ ] Create PostgreSQL database and run `npm run db:setup`
- [ ] Set up Google OAuth credentials in Google Cloud Console
- [ ] Create Cloudinary account and add credentials
- [ ] Set a strong `ADMIN_SECRET_KEY` in production `.env`
- [ ] Set `NODE_ENV=production` and `secure: true` for cookies
- [ ] Add production domain to Google OAuth redirect URIs
- [ ] Run `npm run build` in `/client` and deploy `dist/`
- [ ] Configure CORS `CLIENT_URL` to production frontend URL

---

## Known Issues

- The `session` table is created by `setupDb.js` but `connect-pg-simple` also has its own create logic — ensure only one path creates it
- Admin OAuth currently shares the same `/google/callback` endpoint; implement separate `/admin/google/callback` routing in Passport if session isolation is needed
- Student ID is set as `UNIQUE` in the DB — if two Google accounts try the same ID simultaneously, only one will succeed (correct behaviour, but handle the error gracefully in the UI)
