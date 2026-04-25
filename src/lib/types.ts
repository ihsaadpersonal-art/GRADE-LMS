export type Role = "student" | "parent" | "teacher" | "admin" | "super_admin";

export type CourseType = "bridge" | "exam_ready" | "english" | "academic" | "admission";

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  courseType: CourseType;
  targetBatch: string;
  versionSupport: "BV" | "EV" | "Both";
  mode: "online" | "offline" | "hybrid";
  durationWeeks: number;
  price: number;
  isPublished: boolean;
  highlights: string[];
  materials: string[];
  weeklyStructure: string[];
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
};

export type Lesson = {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  lessonType: "video" | "live" | "pdf" | "assignment" | "quiz";
  videoUrl?: string;
  orderIndex: number;
  isPreview: boolean;
  requiresPreviousCompletion: boolean;
  status?: "locked" | "available" | "completed" | "requires_task" | "requires_quiz";
};

export type Student = {
  id: string;
  profileId: string;
  fullName: string;
  studentCode: string;
  version: "Bangla Version" | "English Version";
  classLevel: "SSC" | "HSC" | "Post-SSC" | "Post-HSC";
  currentBatch: string;
  institution: string;
  guardianName: string;
  guardianPhone: string;
  guardianWhatsapp: string;
  consentPublicLeaderboard: boolean;
  status: "lead" | "active" | "paused" | "completed" | "dropped";
};

export type DailyTaskUnit = {
  id: string;
  courseId: string;
  batchId: string;
  studentId?: string;
  lessonId?: string;
  title: string;
  taskDate: string;
  subject: string;
  chapter: string;
  watchTask: string;
  readTask: string;
  solveTask: string;
  submitTask: string;
  reviewTask: string;
  dueAt: string;
  status: "not_started" | "submitted" | "under_review" | "reviewed" | "late" | "missing";
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  questionType: "mcq" | "true_false" | "short_answer";
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation: string;
  marks: number;
};

export type Quiz = {
  id: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  description: string;
  quizType: "weekly" | "chapter" | "diagnostic" | "practice";
  passMark: number;
  durationMinutes?: number;
  questions: QuizQuestion[];
};

export type GScore = {
  studentId: string;
  courseId: string;
  batchId: string;
  weekStart: string;
  weekEnd: string;
  dtuSubmissionRate: number;
  weeklyQuizPercentage: number;
  lessonCompletionRate: number;
  streakScore: number;
  teacherEffortScore: number;
  totalGscore: number;
};

export type LeaderboardEntry = {
  studentId: string;
  studentName: string;
  consentPublicLeaderboard: boolean;
  rank: number;
  totalGscore: number;
  streak: number;
  label?: string;
};

export type Lead = {
  id: string;
  studentName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  whatsapp: string;
  email?: string;
  currentLevel: string;
  version: string;
  institution: string;
  interestedProgramme: string;
  preferredMode: string;
  source: string;
  status: "new" | "contacted" | "interested" | "payment_pending" | "enrolled" | "lost";
  message?: string;
  notes?: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  method: "bkash" | "nagad" | "rocket" | "bank" | "cash" | "sslcommerz" | "other";
  transactionId?: string;
  status: "pending" | "verified" | "rejected" | "refunded";
};

export type ParentReport = {
  studentName: string;
  courseName: string;
  week: string;
  tasksCompleted: number;
  tasksTotal: number;
  weeklyTestScore: number;
  previousWeekScore: number;
  currentStreak: number;
  leaderboardRank: number;
  totalStudents: number;
  focusThisWeek: string;
  focusNextWeek: string;
  teacherComment: string;
};
