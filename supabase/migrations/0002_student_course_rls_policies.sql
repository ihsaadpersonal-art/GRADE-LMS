-- Minimum student course access policies for GRADE LMS.

create policy "students read enrolled lessons"
on public.lessons
for select
using (
  public.is_staff()
  or exists (
    select 1
    from public.modules m
    join public.enrollments e on e.course_id = m.course_id
    join public.students s on s.id = e.student_id
    where m.id = lessons.module_id
      and m.course_id = lessons.course_id
      and s.profile_id = auth.uid()
      and e.enrollment_status in ('active', 'completed')
  )
);

create policy "students read own enrolled batches"
on public.batches
for select
using (
  public.is_staff()
  or exists (
    select 1
    from public.enrollments e
    join public.students s on s.id = e.student_id
    where e.batch_id = batches.id
      and s.profile_id = auth.uid()
  )
);

create policy "admins manage batches"
on public.batches
for all
using (public.is_admin())
with check (public.is_admin());
