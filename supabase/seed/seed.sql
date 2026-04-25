insert into public.courses (
  id,
  title,
  slug,
  description,
  course_type,
  target_batch,
  version_support,
  mode,
  duration_weeks,
  price,
  is_published
)
values
(
  '11111111-1111-1111-1111-111111111111',
  'SSC-to-HSC Science Bridge Course',
  'ssc-to-hsc-science-bridge',
  'An 8-week NCTB-aligned transition programme that helps SSC graduates move smoothly into HSC Science through Physics, Chemistry, Higher Mathematics, Biology readiness, academic English support, and guided study discipline.',
  'bridge',
  'Post-SSC 2026 / HSC 2028',
  'Both',
  'hybrid',
  8,
  6500,
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'HSC 26 Exam Ready Crash Course',
  'hsc-26-exam-ready',
  '8-week board-focused revision and accountability programme.',
  'exam_ready',
  'HSC 2026',
  'Both',
  'hybrid',
  8,
  8500,
  true
)
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  course_type = excluded.course_type,
  target_batch = excluded.target_batch,
  version_support = excluded.version_support,
  mode = excluded.mode,
  duration_weeks = excluded.duration_weeks,
  price = excluded.price,
  is_published = excluded.is_published;

insert into public.batches (
  id,
  course_id,
  name,
  version,
  mode,
  start_date,
  end_date,
  max_students,
  status
)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'Bridge Science Batch A',
  'Bangla Version and English Version',
  'hybrid',
  '2026-05-01',
  '2026-06-26',
  40,
  'active'
)
on conflict (id) do update set
  course_id = excluded.course_id,
  name = excluded.name,
  version = excluded.version,
  mode = excluded.mode,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  max_students = excluded.max_students,
  status = excluded.status;

insert into public.modules (id, course_id, title, description, order_index)
values
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Orientation, Diagnostic Baseline, and SSC-to-HSC Transition Mindset',
  'Start with the academic mindset, study rhythm, and baseline check needed for HSC Science.',
  1
),
(
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  'Mathematical Tools for HSC Science',
  'Review the algebra, graph reading, functions, and units students need across HSC Science.',
  2
),
(
  '33333333-3333-3333-3333-333333333334',
  '11111111-1111-1111-1111-111111111111',
  'Physics Foundation: Measurement, Vectors, Motion, and Graphs',
  'Build the early Physics language needed for motion, force, vectors, and graph interpretation.',
  3
),
(
  '33333333-3333-3333-3333-333333333335',
  '11111111-1111-1111-1111-111111111111',
  'Chemistry Foundation: Atomic Structure, Mole Concept, Periodic Trends, and Bonding Basics',
  'Connect SSC Chemistry knowledge to the core ideas students meet first in HSC Chemistry.',
  4
),
(
  '33333333-3333-3333-3333-333333333336',
  '11111111-1111-1111-1111-111111111111',
  'Higher Mathematics Readiness: Functions, Trigonometry, Logarithms, and Problem-Solving Habits',
  'Strengthen the mathematical habits that support HSC Science problem solving.',
  5
),
(
  '33333333-3333-3333-3333-333333333337',
  '11111111-1111-1111-1111-111111111111',
  'Biology Readiness: Cell, Biomolecules, Genetics Basics, and Scientific Terminology',
  'Prepare students to read Biology concepts, diagrams, and scientific terms with clarity.',
  6
),
(
  '33333333-3333-3333-3333-333333333338',
  '11111111-1111-1111-1111-111111111111',
  'Integrated Science Application: Mixed Problems, Data Interpretation, and Written Explanation',
  'Practise combining concepts, interpreting data, and writing clear scientific explanations.',
  7
),
(
  '33333333-3333-3333-3333-333333333339',
  '11111111-1111-1111-1111-111111111111',
  'Final Review, HSC Readiness Assessment, Personal Study Plan, and Next-Stage Guidance',
  'Review progress, identify next priorities, and prepare a practical study plan for HSC Science.',
  8
),
(
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'Board Revision Sprint',
  'High-yield HSC 26 board practice.',
  1
)
on conflict (id) do update set
  course_id = excluded.course_id,
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index;

insert into public.lessons (
  id,
  module_id,
  course_id,
  title,
  description,
  lesson_type,
  order_index,
  is_preview,
  requires_previous_completion
)
values
(
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'How HSC Science Changes After SSC',
  'Understand how HSC Science asks for deeper concepts, regular practice, and clearer written reasoning.',
  'video',
  1,
  true,
  false
),
(
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Baseline Diagnostic Briefing',
  'Learn how the diagnostic quiz identifies SSC-level gaps and guides the first recovery plan.',
  'quiz',
  2,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555552',
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  'Reading Graphs, Units, and Formula Relationships',
  'Practise the mathematical language used in Physics, Chemistry, Biology data, and HSC problem solving.',
  'video',
  3,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555553',
  '33333333-3333-3333-3333-333333333334',
  '11111111-1111-1111-1111-111111111111',
  'Motion, Force, and Vector Thinking',
  'Connect measurement, direction, motion, and force ideas before entering full HSC Physics chapters.',
  'video',
  4,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555554',
  '33333333-3333-3333-3333-333333333335',
  '11111111-1111-1111-1111-111111111111',
  'Atom, Mole, Periodic Pattern, and Bonding Thinking',
  'Review the core Chemistry ideas that help students understand early HSC topics with less memorisation.',
  'video',
  5,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555559',
  '33333333-3333-3333-3333-333333333336',
  '11111111-1111-1111-1111-111111111111',
  'Functions, Trigonometry, and Logarithmic Thinking',
  'Build readiness for HSC Science calculations through functions, trig ratios, logarithms, and careful steps.',
  'video',
  6,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555556',
  '33333333-3333-3333-3333-333333333337',
  '11111111-1111-1111-1111-111111111111',
  'Cell, Biomolecules, Genetics, and Scientific Vocabulary',
  'Prepare for HSC Biology by connecting key life-science terms, diagrams, and explanation patterns.',
  'video',
  7,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555557',
  '33333333-3333-3333-3333-333333333338',
  '11111111-1111-1111-1111-111111111111',
  'Solving Mixed Science Problems with Explanation',
  'Practise reading a problem, choosing the right concept, interpreting data, and writing a clear answer.',
  'assignment',
  8,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555558',
  '33333333-3333-3333-3333-333333333339',
  '11111111-1111-1111-1111-111111111111',
  'Personal HSC Readiness Review and Study Plan',
  'Review progress from the bridge course and prepare a realistic next-stage study plan for HSC Science.',
  'assignment',
  9,
  false,
  true
),
(
  '77777777-7777-7777-7777-777777777777',
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'Final 8-Week Revision Map',
  'Board-focused revision planning.',
  'video',
  1,
  true,
  false
)
on conflict (id) do update set
  module_id = excluded.module_id,
  course_id = excluded.course_id,
  title = excluded.title,
  description = excluded.description,
  lesson_type = excluded.lesson_type,
  order_index = excluded.order_index,
  is_preview = excluded.is_preview,
  requires_previous_completion = excluded.requires_previous_completion;

insert into public.quizzes (
  id,
  course_id,
  module_id,
  lesson_id,
  title,
  description,
  quiz_type,
  pass_mark,
  duration_minutes,
  is_published
)
values (
  '88888888-8888-8888-8888-888888888888',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  '66666666-6666-6666-6666-666666666666',
  'Bridge Baseline Diagnostic',
  'A short readiness check for SSC graduates entering HSC Science. It helps identify early gaps in graph reading, units, algebra, core Science ideas, and study habits.',
  'diagnostic',
  50,
  25,
  true
)
on conflict (id) do update set
  course_id = excluded.course_id,
  module_id = excluded.module_id,
  lesson_id = excluded.lesson_id,
  title = excluded.title,
  description = excluded.description,
  quiz_type = excluded.quiz_type,
  pass_mark = excluded.pass_mark,
  duration_minutes = excluded.duration_minutes,
  is_published = excluded.is_published;

delete from public.quiz_questions
where quiz_id = '88888888-8888-8888-8888-888888888888';

insert into public.quiz_questions (
  id,
  quiz_id,
  question_text,
  question_type,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer,
  explanation,
  marks,
  order_index
)
values
(
  '99999999-9999-9999-9999-999999999991',
  '88888888-8888-8888-8888-888888888888',
  'A distance-time graph is a straight line going upward from left to right. What does this usually mean?',
  'mcq',
  'The object is at rest',
  'The object is moving with constant speed',
  'The object is moving backward',
  'The mass of the object is increasing',
  'B',
  'A straight upward distance-time graph usually shows distance increasing at a steady rate, so speed is constant.',
  1,
  1
),
(
  '99999999-9999-9999-9999-999999999992',
  '88888888-8888-8888-8888-888888888888',
  'Which unit is commonly used to measure force?',
  'mcq',
  'Joule',
  'Newton',
  'Watt',
  'Pascal',
  'B',
  'Force is measured in newton. This unit becomes very important in HSC Physics.',
  1,
  2
),
(
  '99999999-9999-9999-9999-999999999993',
  '88888888-8888-8888-8888-888888888888',
  'If v = u + at, which expression correctly finds a?',
  'mcq',
  'a = v + u / t',
  'a = (v - u) / t',
  'a = t / (v - u)',
  'a = u - vt',
  'B',
  'Subtract u from both sides to get v - u = at, then divide by t.',
  1,
  3
),
(
  '99999999-9999-9999-9999-999999999994',
  '88888888-8888-8888-8888-888888888888',
  'A student walks 3 m east and then 4 m north. What is the shortest distance from the starting point?',
  'mcq',
  '1 m',
  '5 m',
  '7 m',
  '12 m',
  'B',
  'The path forms a right triangle, so the displacement is 5 m by the 3-4-5 relationship.',
  1,
  4
),
(
  '99999999-9999-9999-9999-999999999995',
  '88888888-8888-8888-8888-888888888888',
  'If the same force is applied to two objects, the object with smaller mass will usually have:',
  'mcq',
  'less acceleration',
  'more acceleration',
  'no acceleration',
  'the same weight',
  'B',
  'From F = ma, for the same force, smaller mass gives greater acceleration.',
  1,
  5
),
(
  '99999999-9999-9999-9999-999999999996',
  '88888888-8888-8888-8888-888888888888',
  'One mole of a substance means:',
  'mcq',
  '1 gram of any substance',
  '6.02 x 10^23 particles',
  '1 litre of liquid',
  '100 particles',
  'B',
  'A mole represents Avogadro''s number of particles, which is important for HSC Chemistry calculations.',
  1,
  6
),
(
  '99999999-9999-9999-9999-999999999997',
  '88888888-8888-8888-8888-888888888888',
  'Across a period in the periodic table from left to right, atomic number generally:',
  'mcq',
  'increases',
  'decreases',
  'stays the same',
  'becomes zero',
  'A',
  'Atomic number increases by one as we move from one element to the next across a period.',
  1,
  7
),
(
  '99999999-9999-9999-9999-999999999998',
  '88888888-8888-8888-8888-888888888888',
  'If f(x) = 2x + 3, what is f(4)?',
  'mcq',
  '7',
  '8',
  '11',
  '14',
  'C',
  'Replace x with 4: f(4) = 2 x 4 + 3 = 11.',
  1,
  8
),
(
  '99999999-9999-9999-9999-999999999999',
  '88888888-8888-8888-8888-888888888888',
  'Which part of the cell is commonly called the control centre?',
  'mcq',
  'Cell wall',
  'Nucleus',
  'Ribosome',
  'Cytoplasm',
  'B',
  'The nucleus contains genetic material and controls many cell activities.',
  1,
  9
),
(
  '99999999-9999-9999-9999-999999999990',
  '88888888-8888-8888-8888-888888888888',
  'After getting a low score in a diagnostic quiz, what is the best next step?',
  'mcq',
  'Ignore the result',
  'Memorise answers only',
  'Identify weak areas and practise them with feedback',
  'Stop studying Science',
  'C',
  'A diagnostic quiz is useful when students use it to find gaps and build a recovery plan.',
  1,
  10
);

insert into public.daily_task_units (
  id,
  course_id,
  batch_id,
  lesson_id,
  title,
  task_date,
  subject,
  chapter,
  watch_task,
  read_task,
  solve_task,
  submit_task,
  review_task,
  due_at
)
values
(
  'dddddddd-dddd-dddd-dddd-dddddddddd01',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '66666666-6666-6666-6666-666666666666',
  'Day 3: Graph Reading and Unit Conversion Practice',
  '2026-05-03',
  'Physics',
  'Measurement, units, and graph basics',
  'Watch the baseline briefing lesson',
  'Read GRADE Lens pages 4-7 on distance-time graphs and SI units',
  'Solve 6 graph-reading questions and 6 unit conversion problems',
  'Upload one photo/PDF of solved work with units written beside each answer',
  'Mark two mistakes and write what caused each mistake',
  '2026-05-03T22:00:00+06:00'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddd02',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '55555555-5555-5555-5555-555555555554',
  'Day 4: Mole Concept Readiness Reflection',
  '2026-05-04',
  'Chemistry',
  'Atomic structure and mole concept basics',
  'Watch the short briefing on atom, particle, and mole language',
  'Read GRADE CM notes on relative atomic mass and Avogadro''s number',
  'Complete 8 basic mole-readiness questions without using advanced HSC formulas',
  'Submit solved work and one paragraph on which mole idea feels unclear',
  'Compare mistakes with the checklist and rewrite two corrected solutions',
  '2026-05-04T22:00:00+06:00'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddd03',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '55555555-5555-5555-5555-555555555559',
  'Day 5: Function and Formula Rearrangement Practice',
  '2026-05-05',
  'Higher Mathematics',
  'Functions, algebra, and formula rearrangement',
  'Watch the worked example on substituting values into functions',
  'Read GRADE Flash cards on rearranging simple Science formulas',
  'Solve 5 function-value problems and rearrange 5 Physics/Chemistry formulas',
  'Upload solved steps, not only final answers',
  'Circle any skipped algebra step and rewrite it clearly',
  '2026-05-05T22:00:00+06:00'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddd04',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '55555555-5555-5555-5555-555555555558',
  'Day 6: Weekly Recovery, Mistake Review, and Study Plan',
  '2026-05-06',
  'Integrated Science',
  'Study habit reflection and recovery planning',
  'Review the teacher note on common baseline mistakes',
  'Read GRADE Track guidance on planning a 45-minute daily Science block',
  'Choose 3 mistakes from Physics, Chemistry, or Math and correct them fully',
  'Submit a one-page recovery plan with next week''s top 3 focus areas',
  'Check whether each focus area has a specific task and time slot',
  '2026-05-06T22:00:00+06:00'
)
on conflict (id) do update set
  course_id = excluded.course_id,
  batch_id = excluded.batch_id,
  lesson_id = excluded.lesson_id,
  title = excluded.title,
  task_date = excluded.task_date,
  subject = excluded.subject,
  chapter = excluded.chapter,
  watch_task = excluded.watch_task,
  read_task = excluded.read_task,
  solve_task = excluded.solve_task,
  submit_task = excluded.submit_task,
  review_task = excluded.review_task,
  due_at = excluded.due_at;

insert into public.leads (
  id,
  student_name,
  parent_name,
  student_phone,
  parent_phone,
  whatsapp,
  email,
  current_level,
  version,
  institution,
  interested_programme,
  preferred_mode,
  source,
  status,
  message,
  notes
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Tanvir Hasan',
  'Md Hasan',
  '01800000001',
  '01800000002',
  '01800000002',
  'tanvir@example.com',
  'SSC completed',
  'Bangla Version',
  'Ideal School and College',
  'SSC-to-HSC Science Bridge Course',
  'online',
  'Facebook',
  'new',
  'Interested in May batch.',
  'Call after evening.'
)
on conflict (id) do update set
  student_name = excluded.student_name,
  parent_name = excluded.parent_name,
  student_phone = excluded.student_phone,
  parent_phone = excluded.parent_phone,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  current_level = excluded.current_level,
  version = excluded.version,
  institution = excluded.institution,
  interested_programme = excluded.interested_programme,
  preferred_mode = excluded.preferred_mode,
  source = excluded.source,
  status = excluded.status,
  message = excluded.message,
  notes = excluded.notes;
