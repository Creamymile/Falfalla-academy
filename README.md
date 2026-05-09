# Creamy Academy

A first-build implementation of the latte art course platform described in
`Creamy_Academy_Complete_Platform_Blueprint_&_Architecture.pdf`.

## What Was Adjusted From The Blueprint

- React + TypeScript + Vite is used for the first build because this workspace started
  empty and Vite gives a fast, portable course platform foundation.
- The blueprint's Manus OAuth and S3 helpers were replaced with portable boundaries.
  For production, use Supabase Auth + Postgres for the student/course data and Mux or
  Cloudflare Stream for protected video delivery. This avoids tying the course business
  to one hosting template and gives stronger video analytics.
- The initial app uses localStorage to simulate authentication, enrollment, progress,
  and completion while the curriculum and media are still being prepared.
- The course data model preserves the blueprint's course -> module -> lesson ->
  resource hierarchy, so swapping in a real API later is straightforward.

## Current Features

- Public landing page with a latte art course hero
- Auth-gated catalog, dashboard, course detail, and lesson player
- Admin route hidden from public navigation and blocked unless the authenticated role is `admin`
- Course search and level filters
- Course reviews, star ratings, enrollment counts, and best-seller badges for social proof
- Pricing, checkout placeholder, community gallery, practice upload, profile, and certificate pages
- Enrollment state and continue-learning actions
- Lesson completion and progress bars
- Saved lessons, preferred subtitle language, badges, and private lesson notes
- Student lesson requests for next lessons, upcoming topics, and extra materials
- SCA-aligned lesson theory, practice drills, and assessment targets
- Beginner Barista Foundations path for students with no cafe experience
- Video subtitle track support for multilingual lessons
- Downloadable resource slots for PDFs, checklists, worksheets, and image files
- Admin operations for course editing, module editing, lesson creation, lesson deletion, video upload, subtitle upload, material updates, student request triage, readiness checks, content reset, content duplicate, JSON import, and JSON export

## Recommended Production Stack

- Frontend: React, TypeScript, Vite, CSS modules or Tailwind if a design system grows
- Backend: Supabase Edge Functions or Node/Fastify API with typed validation
- Database: Postgres with row level security for users, enrollments, and progress
- Auth: Supabase Auth with email, Google, and Apple sign-in
- Video: Mux or Cloudflare Stream with signed playback URLs
- File storage: Supabase Storage or S3 for PDFs, thumbnails, and course assets
- Payments later: Stripe subscriptions or per-course checkout

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Adding Your Latte Art Media

Replace `thumbnailUrl` and `videoUrl` values in `src/data/courses.ts` with your uploaded
photos and videos. When the backend is added, this file should become seed data and the
UI should fetch course content from the database.

The current admin uploader uses browser object URLs for local preview. Production video
uploads should go through signed upload URLs to Mux, Cloudflare Stream, or S3-compatible
storage, then save the playback/material URL in the database.

## Done Now vs Later

Done in the local prototype:

- Landing page, course catalog, course reviews, best-seller badges, pricing, checkout placeholder, community gallery, practice upload, profile, certificate preview, student dashboard, lesson player, progress tracking, saved lessons, badges, notes, multilingual captions, downloadable materials, student lesson requests, and a protected admin panel
- Admin/instructor content management for courses, modules, lessons, video URLs, local video previews, subtitle tracks, downloadable materials, student request status, mock analytics, JSON import/export, duplication, and reset
- SCA-aligned starter curriculum for Barista Foundations, Latte Art Fundamentals, and Latte Art Advanced

Needs your action later:

- Upload final course videos, photos, subtitle `.vtt` files, and learning materials
- Confirm final course pricing, certificate wording, and any official SCA trainer/legal positioning

Needs production setup later:

- Real authentication and admin roles
- Database persistence
- Signed video/file uploads
- Payment/subscription system if you monetize access
- Email notifications and certificate generation if required

## Multilingual Video Support

Each lesson supports subtitle tracks using WebVTT files (`.vtt`). In production, upload
one caption file per language, for example:

- `lesson-01.en.vtt` for English
- `lesson-01.id.vtt` for Bahasa Indonesia
- `lesson-01.ar.vtt` for Arabic
- `lesson-01.zh.vtt` for Chinese
- `lesson-01.ja.vtt` for Japanese

Downloadable materials also include a language field, so the same checklist or workbook
can be attached in multiple languages.

## Curriculum Research Basis

The starter curriculum is SCA-aligned and follows the Specialty Coffee Association's
Coffee Skills Program themes inside the three courses you requested:

- Barista Foundations: coffee basics, seed to cup, flavor language, espresso bar tools, safety, grinder setup, espresso, milk drinks, cleaning, and service
- Latte Art Fundamentals: consistent milk texture, espresso contrast, canvas building, heart foundation, and basic tulip foundation
- Latte Art Advanced: free-pour rosetta, ripple control, winged tulip, composition, video review, and repeatability assessment

This platform does not issue official SCA certificates by itself. Official SCA credentials
require eligible training and assessment through an Authorized SCA Trainer.

References:

- [SCA Coffee Skills Program](https://education.sca.coffee/coffee-skills-program)
- [SCA Coffee Standards](https://sca.coffee/research/coffee-standards/)
