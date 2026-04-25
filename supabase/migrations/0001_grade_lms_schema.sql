-- GRADE LMS v1 schema for Supabase PostgreSQL.
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  whatsapp text,
  role text not null default 'student' check (role in ('student','parent','teacher','admin','super_admin')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  student_code text unique not null,
  version text not null check (version in ('Bangla Version','English Version')),
  class_level text not null check (class_level in ('SSC','HSC','Post-SSC','Post-HSC')),
  current_batch text,
  institution text,
  guardian_name text,
  guardian_phone text,
  guardian_whatsapp text,
  guardian_email text,
  consent_public_leaderboard boolean not null default false,
  status text not null default 'lead' check (status in ('lead','active','paused','completed','dropped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.parents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text,
  whatsapp text,
  email text,
  created_at timestamptz not null default now()
);

create table public.parent_students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  relationship text,
  created_at timestamptz not null default now(),
  unique(parent_id, student_id)
);

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  subject text,
  bio text,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  course_type text not null check (course_type in ('bridge','exam_ready','english','academic','admission')),
  target_batch text,
  version_support text not null check (version_support in ('BV','EV','Both')),
  mode text not null check (mode in ('online','offline','hybrid')),
  duration_weeks integer not null default 8,
  price numeric(12,2) not null default 0,
  thumbnail_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  name text not null,
  version text not null,
  mode text not null,
  start_date date,
  end_date date,
  teacher_id uuid references public.teachers(id) on delete set null,
  max_students integer,
  status text not null default 'upcoming' check (status in ('upcoming','active','completed','paused')),
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  enrollment_status text not null default 'pending' check (enrollment_status in ('pending','active','completed','dropped','paused')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','partial','refunded')),
  enrolled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(student_id, course_id, batch_id)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  order_index integer not null default 0,
  unlock_rule text,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  lesson_type text not null check (lesson_type in ('video','live','pdf','assignment','quiz')),
  video_url text,
  content text,
  order_index integer not null default 0,
  is_preview boolean not null default false,
  requires_previous_completion boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  file_url text not null,
  resource_type text not null check (resource_type in ('pdf','image','doc','link')),
  is_downloadable boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  watched_seconds integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, lesson_id)
);

create table public.daily_task_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  task_date date not null,
  subject text,
  chapter text,
  watch_task text,
  read_task text,
  solve_task text,
  submit_task text,
  review_task text,
  due_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.dtu_submissions (
  id uuid primary key default gen_random_uuid(),
  dtu_id uuid not null references public.daily_task_units(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  submission_text text,
  file_url text,
  submitted_at timestamptz,
  status text not null default 'submitted' check (status in ('submitted','late','reviewed','missing','excused')),
  score integer check (score between 0 and 10),
  teacher_feedback text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(dtu_id, student_id)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  description text,
  quiz_type text not null check (quiz_type in ('weekly','chapter','diagnostic','practice')),
  pass_mark integer not null default 50,
  duration_minutes integer,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('mcq','true_false','short_answer')),
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer text,
  explanation text,
  marks integer not null default 1,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric,
  percentage numeric,
  passed boolean,
  created_at timestamptz not null default now()
);

create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  selected_answer text,
  is_correct boolean,
  marks_awarded numeric,
  created_at timestamptz not null default now()
);

create table public.gscores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  week_start date not null,
  week_end date not null,
  streak_points numeric not null default 0,
  weekly_test_score numeric not null default 0,
  submission_rate numeric not null default 0,
  improvement_bonus numeric not null default 0,
  teacher_score numeric not null default 0,
  total_gscore numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, course_id, batch_id, week_start)
);

create table public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  period_type text not null check (period_type in ('weekly','monthly')),
  period_start date not null,
  period_end date not null,
  rank integer not null,
  total_gscore numeric not null default 0,
  streak integer not null default 0,
  label text,
  created_at timestamptz not null default now()
);

create table public.parent_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  week_start date not null,
  week_end date not null,
  tasks_completed integer not null default 0,
  tasks_total integer not null default 0,
  weekly_test_score numeric,
  previous_week_score numeric,
  current_streak integer not null default 0,
  leaderboard_rank integer,
  focus_this_week text,
  focus_next_week text,
  teacher_comment text,
  report_text text,
  sent_status text not null default 'draft' check (sent_status in ('draft','sent','not_sent')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'BDT',
  payment_method text not null check (payment_method in ('bkash','nagad','rocket','bank','cash','sslcommerz','other')),
  transaction_id text,
  screenshot_url text,
  status text not null default 'pending' check (status in ('pending','verified','rejected','refunded')),
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete cascade,
  title text not null,
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  publish_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.gate_overrides (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  reason text not null,
  approved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.recovery_actions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  trigger_reason text not null,
  action_plan text not null,
  assigned_teacher_id uuid references public.teachers(id) on delete set null,
  status text not null default 'open' check (status in ('open','in_progress','resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  parent_name text not null,
  student_phone text not null,
  parent_phone text not null,
  whatsapp text not null,
  email text,
  current_level text not null,
  version text not null,
  institution text not null,
  interested_programme text not null,
  preferred_mode text not null,
  source text not null,
  status text not null default 'new' check (status in ('new','contacted','interested','payment_pending','enrolled','lost')),
  message text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_students_profile_id on public.students(profile_id);
create index idx_enrollments_student_course on public.enrollments(student_id, course_id);
create index idx_lessons_module_order on public.lessons(module_id, order_index);
create index idx_dtu_course_batch_date on public.daily_task_units(course_id, batch_id, task_date);
create index idx_dtu_submissions_student on public.dtu_submissions(student_id, status);
create index idx_quiz_attempts_student on public.quiz_attempts(student_id, quiz_id);
create index idx_gscores_batch_week on public.gscores(batch_id, week_start);
create index idx_leaderboard_period on public.leaderboard_entries(course_id, batch_id, period_type, period_start);
create index idx_leads_status on public.leads(status, created_at);
create index idx_payments_status on public.payments(status);

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger students_updated_at before update on public.students for each row execute function public.set_updated_at();
create trigger courses_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger lesson_progress_updated_at before update on public.lesson_progress for each row execute function public.set_updated_at();
create trigger gscores_updated_at before update on public.gscores for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('teacher','admin','super_admin'), false)
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin','super_admin'), false)
$$;

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parents enable row level security;
alter table public.parent_students enable row level security;
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
alter table public.batches enable row level security;
alter table public.enrollments enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.daily_task_units enable row level security;
alter table public.dtu_submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.gscores enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.parent_reports enable row level security;
alter table public.payments enable row level security;
alter table public.announcements enable row level security;
alter table public.gate_overrides enable row level security;
alter table public.recovery_actions enable row level security;
alter table public.leads enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profiles admins manage" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "public published courses" on public.courses for select using (is_published or public.is_staff());
create policy "admins manage courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy "public course modules" on public.modules for select using (exists (select 1 from public.courses c where c.id = course_id and c.is_published) or public.is_staff());
create policy "admins manage modules" on public.modules for all using (public.is_admin()) with check (public.is_admin());
create policy "public preview lessons" on public.lessons for select using (is_preview or public.is_staff());
create policy "admins manage lessons" on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "public downloadable resources" on public.resources for select using (public.is_staff() or exists (select 1 from public.courses c where c.id = course_id and c.is_published));
create policy "admins manage resources" on public.resources for all using (public.is_admin()) with check (public.is_admin());

create policy "students read own student row" on public.students for select using (profile_id = auth.uid() or public.is_staff());
create policy "admins manage students" on public.students for all using (public.is_admin()) with check (public.is_admin());
create policy "parents read linked students" on public.parent_students for select using (public.is_staff() or exists (select 1 from public.parents p where p.id = parent_id and p.profile_id = auth.uid()));
create policy "admins manage parent links" on public.parent_students for all using (public.is_admin()) with check (public.is_admin());
create policy "parents self or staff" on public.parents for select using (profile_id = auth.uid() or public.is_staff());
create policy "admins manage parents" on public.parents for all using (public.is_admin()) with check (public.is_admin());
create policy "teachers self or admin" on public.teachers for select using (profile_id = auth.uid() or public.is_admin());
create policy "admins manage teachers" on public.teachers for all using (public.is_admin()) with check (public.is_admin());

create policy "students read own enrollments" on public.enrollments for select using (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()));
create policy "admins manage enrollments" on public.enrollments for all using (public.is_admin()) with check (public.is_admin());
create policy "students read own progress" on public.lesson_progress for select using (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()));
create policy "students update own progress" on public.lesson_progress for all using (exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()) or public.is_staff()) with check (exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()) or public.is_staff());
create policy "students read assigned dtu" on public.daily_task_units for select using (public.is_staff() or exists (select 1 from public.enrollments e join public.students s on s.id = e.student_id where s.profile_id = auth.uid() and e.course_id = daily_task_units.course_id and (daily_task_units.batch_id is null or e.batch_id = daily_task_units.batch_id)));
create policy "staff manage dtu" on public.daily_task_units for all using (public.is_staff()) with check (public.is_staff());
create policy "students own submissions" on public.dtu_submissions for all using (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid())) with check (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()));
create policy "students read quizzes" on public.quizzes for select using (is_published or public.is_staff());
create policy "staff manage quizzes" on public.quizzes for all using (public.is_staff()) with check (public.is_staff());
create policy "students read quiz questions" on public.quiz_questions for select using (public.is_staff() or exists (select 1 from public.quizzes q where q.id = quiz_id and q.is_published));
create policy "staff manage quiz questions" on public.quiz_questions for all using (public.is_staff()) with check (public.is_staff());
create policy "students own quiz attempts" on public.quiz_attempts for all using (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid())) with check (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()));
create policy "students own quiz answers" on public.quiz_answers for all using (public.is_staff() or exists (select 1 from public.quiz_attempts qa join public.students s on s.id = qa.student_id where qa.id = attempt_id and s.profile_id = auth.uid())) with check (public.is_staff() or exists (select 1 from public.quiz_attempts qa join public.students s on s.id = qa.student_id where qa.id = attempt_id and s.profile_id = auth.uid()));
create policy "students read own gscores" on public.gscores for select using (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()));
create policy "staff manage gscores" on public.gscores for all using (public.is_staff()) with check (public.is_staff());
create policy "authenticated read leaderboard" on public.leaderboard_entries for select using (auth.uid() is not null);
create policy "staff manage leaderboard" on public.leaderboard_entries for all using (public.is_staff()) with check (public.is_staff());
create policy "parents students staff read reports" on public.parent_reports for select using (public.is_staff() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()) or exists (select 1 from public.parent_students ps join public.parents p on p.id = ps.parent_id where ps.student_id = parent_reports.student_id and p.profile_id = auth.uid()));
create policy "staff manage reports" on public.parent_reports for all using (public.is_staff()) with check (public.is_staff());
create policy "students read own payments" on public.payments for select using (public.is_admin() or exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid()));
create policy "admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "announcements visible to authenticated" on public.announcements for select using (auth.uid() is not null);
create policy "staff manage announcements" on public.announcements for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage gate overrides" on public.gate_overrides for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage recovery actions" on public.recovery_actions for all using (public.is_staff()) with check (public.is_staff());

create policy "public insert leads" on public.leads for insert with check (true);
create policy "admins manage leads" on public.leads for all using (public.is_admin()) with check (public.is_admin());
