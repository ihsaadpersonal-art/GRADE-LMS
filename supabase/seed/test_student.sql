-- Manual test student helper for local/Supabase testing.
--
-- Before running this file:
-- 1. Create a user manually in Supabase Auth.
-- 2. Copy that user's Auth UUID.
-- 3. Replace the placeholder values below.
--
-- This file does not insert into auth.users, does not create passwords,
-- and should not be used to create production users.

with test_values as (
  select
    'AUTH_USER_ID'::uuid as auth_user_id, -- Replace with the Supabase Auth user UUID.
    'TEST_EMAIL'::text as email, -- Replace with the Auth user's email address.
    'TEST_STUDENT_NAME'::text as student_name, -- Replace with the student's display name.
    'TEST-BRIDGE-001'::text as student_code,
    '11111111-1111-1111-1111-111111111111'::uuid as bridge_course_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid as bridge_batch_id
),
upsert_profile as (
  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    is_active
  )
  select
    auth_user_id,
    student_name,
    email,
    'student',
    true
  from test_values
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    is_active = excluded.is_active
  returning id
),
upsert_student as (
  insert into public.students (
    profile_id,
    student_code,
    version,
    class_level,
    current_batch,
    institution,
    guardian_name,
    guardian_phone,
    guardian_whatsapp,
    guardian_email,
    consent_public_leaderboard,
    status
  )
  select
    auth_user_id,
    student_code,
    'Bangla Version',
    'Post-SSC',
    'Bridge Science Batch A',
    'Manual Test Institution',
    'Manual Test Guardian',
    '+8801000000000',
    '+8801000000000',
    email,
    false,
    'active'
  from test_values
  on conflict (student_code) do update set
    profile_id = excluded.profile_id,
    version = excluded.version,
    class_level = excluded.class_level,
    current_batch = excluded.current_batch,
    institution = excluded.institution,
    guardian_name = excluded.guardian_name,
    guardian_phone = excluded.guardian_phone,
    guardian_whatsapp = excluded.guardian_whatsapp,
    guardian_email = excluded.guardian_email,
    consent_public_leaderboard = excluded.consent_public_leaderboard,
    status = excluded.status
  returning id
)
insert into public.enrollments (
  student_id,
  course_id,
  batch_id,
  enrollment_status,
  payment_status,
  enrolled_at
)
select
  upsert_student.id,
  test_values.bridge_course_id,
  test_values.bridge_batch_id,
  'active',
  'paid',
  now()
from upsert_student
cross join test_values
on conflict (student_id, course_id, batch_id) do update set
  enrollment_status = excluded.enrollment_status,
  payment_status = excluded.payment_status,
  enrolled_at = coalesce(public.enrollments.enrolled_at, excluded.enrolled_at);
