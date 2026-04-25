# GRADE LMS v1

Launch-focused LMS for GRADE Academic Coaching in Bangladesh.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- React Hook Form + Zod
- Vercel-ready deployment

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_grade_lms_schema.sql`.
3. Optionally run `supabase/seed/seed.sql`.
4. Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Without env vars, the app runs in local preview mode with typed sample data and validates lead submissions without persisting them.

## Implemented v1 Slices

- Public homepage, course pages, resources, about, contact/enrolment
- Lead capture API with Zod validation and Supabase persistence when configured
- Student dashboard, course page, lesson page, DTU page, quiz page, progress, leaderboard
- Admin overview, leads, payments, parent report generator, at-risk view
- Teacher dashboard with DTU review and quiz result surfaces
- Parent report preview
- Supabase schema, indexes, RLS policies, and seed data

## Verification

```bash
npm run lint
npm run build
```
