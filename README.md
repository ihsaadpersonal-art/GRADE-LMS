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

## Supabase Environment

Copy `.env.example` to `.env.local` and fill the Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it publicly, commit a real value, or use it in client components.

If Supabase env vars are missing, the app runs in local preview mode. Middleware allows dashboard preview routes and lead validation runs without database persistence. Once env vars are added, dashboard routes require a real Supabase login.

## Supabase Setup

For a hosted Supabase project, apply the SQL files in order:

1. `supabase/migrations/0001_grade_lms_schema.sql`
2. `supabase/migrations/0002_student_course_rls_policies.sql`

For local Supabase CLI development, Docker is required. After linking/starting Supabase, reset and seed the local database:

```bash
npx supabase db reset
```

The main seed file adds course content, including the SSC-to-HSC Science Bridge Course, active batch, modules, lessons, quiz questions, Daily Task Units, and a sample lead.

## Manual Test Student

To test real login without public signup:

1. Create a user manually in Supabase Auth.
2. Copy the Auth user UUID.
3. Open `supabase/seed/test_student.sql`.
4. Replace `AUTH_USER_ID`, `TEST_EMAIL`, and `TEST_STUDENT_NAME`.
5. Run the helper SQL in Supabase SQL Editor or against your local database.

The helper creates or updates `profiles`, `students`, and `enrollments` records only. It does not insert into `auth.users`, create passwords, or create production users.

## Real Login Test

1. Run the app:

```bash
npm run dev
```

2. Go to `/login`.
3. Sign in with the manually created test student email and password.
4. Visit `/dashboard`.
5. Confirm the app redirects to `/dashboard/student`.
6. Confirm live dashboard data appears when profile, student, and enrollment rows exist.

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
