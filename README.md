# HIKAYA Tour and Travel Agency

Bilingual (English / Afaan Oromoo) marketing site for HIKAYA — Umrah packages, flight tickets,
hotel booking and guided tours across Ethiopia. Built with Next.js 16 (App Router), React 19,
Tailwind CSS 4 and Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit
npm run dev                  # http://localhost:3000
```

Scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, sitemap and Open Graph |
| `ADMIN_PASSWORD` | Password for the admin panel at `/admin` |
| `SESSION_SECRET` | 16+ random characters used to sign the admin login cookie (`openssl rand -base64 32`) |
| `DATA_DIR` | Where leads, gallery data and uploads are stored (default `./data`) |
| `CONTACT_WEBHOOK_URL` | Optional. Also forwards every submission as JSON to Formspree, Make, Zapier, n8n, Apps Script… for e-mail / chat alerts |

## Admin panel (`/admin`)

Sign in with `ADMIN_PASSWORD`. Sessions last 8 hours; 5 wrong passwords lock that IP for 15 minutes.
**Everything on the website can be edited here — no code changes needed.**

| Page | What you can do |
| --- | --- |
| **Dashboard** | Counts, a 14-day enquiry chart, latest leads and a go-live checklist |
| **Leads & Inbox** | Booking requests, contact messages and newsletter sign-ups: filter, search, set status, add private notes, call / WhatsApp / e-mail in one click, export to CSV |
| **Business info** | Business name, phones, WhatsApp number + default message, e-mails, address and opening hours (English + Afaan Oromoo), Google Maps link, social-media links, and the home-page counters. Also **Download backup** (one JSON file with everything) |
| **Packages & prices** | Add / edit / duplicate / reorder / hide / delete packages: names, prices (USD + ETB), duration, highlights, rating, category and photo — in both languages |
| **Destinations** | The “Popular destinations” cards (photo, name, region, number of tours) |
| **Gallery** | Drag-and-drop photo upload (auto-resized to WebP), captions in both languages, show/hide, reorder, delete |
| **Testimonials** | Customer reviews shown on the home page |
| **FAQ** | Questions and answers. Write `{{whatsapp}}` in an answer to insert your WhatsApp number automatically |

Every list has a **Save changes** button (the website updates immediately) and **Restore originals** to go back to the built-in content.
Photos can be uploaded from your computer or picked from the built-in library; with no photo a neutral placeholder is shown.
Afaan Oromoo fields fall back to the English text when left empty.

**Hosting note:** data is stored as JSON files and uploads on disk, so deploy to a host with a *persistent* disk (VPS, Docker volume, Railway/Render disk). Serverless hosts such as Vercel have no writable persistent disk — on those, replace `src/lib/store.ts` with a database (everything else only calls its exported functions).

Back up the `data/` folder regularly (or use *Business info → Download backup*).

## Where to edit things in code

- **First-run defaults** (before anything is saved in the admin): `src/data/site.ts`, `src/data/packages.ts`, `destinations.ts`, `testimonials.ts`, `faq.ts`
- **Page copy / translations** (headings, buttons, section text): `src/dictionaries/en.ts` and `om.ts`
- **Services section and the 11-day Umrah timeline**: `src/data/services.ts`, `src/components/home/UmrahTimeline.tsx`
- **Privacy policy text**: `src/app/[lang]/privacy/page.tsx` — have it reviewed (and the Afaan Oromoo wording checked by a native speaker) before launch
- **Colours & design tokens**: `src/app/globals.css` (`@theme`)

## Structure

```
src/app/[lang]/        localized pages (home, gallery, contact, privacy, 404, error)
src/app/admin/         admin panel (login, dashboard, leads, gallery, business info, content lists)
src/app/api/           contact endpoint, admin photo upload, CSV export, backup
src/lib/store.ts       JSON-file storage (leads, gallery, settings, content lists)
src/lib/collections.ts schema of the editable lists + validation
src/lib/content.ts     loads saved content, falls back to built-in defaults
src/components/        layout, home sections and UI primitives
src/context/           theme, language and trip-search state
src/proxy.ts           redirects / → /en
```
