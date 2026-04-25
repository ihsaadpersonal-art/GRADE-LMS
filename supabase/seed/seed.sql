insert into public.courses (id, title, slug, description, course_type, target_batch, version_support, mode, duration_weeks, price, is_published)
values
('11111111-1111-1111-1111-111111111111', 'SSC-to-HSC Science Bridge Course', 'ssc-to-hsc-science-bridge', '8-week transition programme for SSC 2026 examinees.', 'bridge', 'HSC 2028', 'Both', 'hybrid', 8, 6500, true),
('22222222-2222-2222-2222-222222222222', 'HSC 26 Exam Ready Crash Course', 'hsc-26-exam-ready', '8-week board-focused revision and accountability programme.', 'exam_ready', 'HSC 2026', 'Both', 'hybrid', 8, 8500, true)
on conflict (id) do nothing;

insert into public.modules (id, course_id, title, description, order_index)
values
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Orientation and Baseline', 'Baseline diagnostic and HSC Science orientation.', 1),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Board Revision Sprint', 'High-yield HSC 26 board practice.', 1)
on conflict (id) do nothing;

insert into public.lessons (id, module_id, course_id, title, description, lesson_type, order_index, is_preview, requires_previous_completion)
values
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'How HSC Science Changes After SSC', 'Transition map from SSC to HSC Science.', 'video', 1, true, false),
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Baseline Diagnostic Briefing', 'How the diagnostic quiz creates a recovery map.', 'quiz', 2, false, true),
('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Final 8-Week Revision Map', 'Board-focused revision planning.', 'video', 1, true, false)
on conflict (id) do nothing;

insert into public.quizzes (id, course_id, module_id, lesson_id, title, description, quiz_type, pass_mark, duration_minutes, is_published)
values
('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'Bridge Baseline Diagnostic', 'Short diagnostic quiz for SSC-to-HSC readiness.', 'diagnostic', 50, 15, true)
on conflict (id) do nothing;

insert into public.quiz_questions (quiz_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, marks, order_index)
values
('88888888-8888-8888-8888-888888888888', 'Which habit best supports the SSC-to-HSC transition?', 'mcq', 'Watching long lectures only', 'Completing daily tasks and reviewing feedback', 'Waiting for exams to start', 'Skipping concept practice', 'B', 'GRADE tracks daily effort because consistency is the bridge.', 1, 1),
('88888888-8888-8888-8888-888888888888', 'GScore includes task completion, quiz score, lesson progress, streak, and teacher effort.', 'true_false', 'True', 'False', null, null, 'A', 'GScore is designed to show more than exam marks.', 1, 2);

insert into public.leads (student_name, parent_name, student_phone, parent_phone, whatsapp, email, current_level, version, institution, interested_programme, preferred_mode, source, status, message, notes)
values
('Tanvir Hasan', 'Md Hasan', '01800000001', '01800000002', '01800000002', 'tanvir@example.com', 'SSC completed', 'Bangla Version', 'Ideal School and College', 'SSC-to-HSC Science Bridge Course', 'online', 'Facebook', 'new', 'Interested in May batch.', 'Call after evening.');
