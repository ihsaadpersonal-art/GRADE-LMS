export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Role = "student" | "parent" | "teacher" | "admin" | "super_admin";
type CourseType = "bridge" | "exam_ready" | "english" | "academic" | "admission";
type VersionSupport = "BV" | "EV" | "Both";
type CourseMode = "online" | "offline" | "hybrid";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          role: Role;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          role?: Role;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          profile_id: string | null;
          student_code: string;
          version: "Bangla Version" | "English Version";
          class_level: "SSC" | "HSC" | "Post-SSC" | "Post-HSC";
          current_batch: string | null;
          institution: string | null;
          guardian_name: string | null;
          guardian_phone: string | null;
          guardian_whatsapp: string | null;
          guardian_email: string | null;
          consent_public_leaderboard: boolean;
          status: "lead" | "active" | "paused" | "completed" | "dropped";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          student_code: string;
          version: "Bangla Version" | "English Version";
          class_level: "SSC" | "HSC" | "Post-SSC" | "Post-HSC";
          current_batch?: string | null;
          institution?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          guardian_whatsapp?: string | null;
          guardian_email?: string | null;
          consent_public_leaderboard?: boolean;
          status?: "lead" | "active" | "paused" | "completed" | "dropped";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
        Relationships: [];
      };
      parents: {
        Row: {
          id: string;
          profile_id: string | null;
          full_name: string;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          full_name: string;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parents"]["Insert"]>;
        Relationships: [];
      };
      parent_students: {
        Row: {
          id: string;
          parent_id: string;
          student_id: string;
          relationship: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          student_id: string;
          relationship?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parent_students"]["Insert"]>;
        Relationships: [];
      };
      teachers: {
        Row: {
          id: string;
          profile_id: string | null;
          subject: string | null;
          bio: string | null;
          phone: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          subject?: string | null;
          bio?: string | null;
          phone?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teachers"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          course_type: CourseType;
          target_batch: string | null;
          version_support: VersionSupport;
          mode: CourseMode;
          duration_weeks: number;
          price: number;
          thumbnail_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          course_type: CourseType;
          target_batch?: string | null;
          version_support: VersionSupport;
          mode: CourseMode;
          duration_weeks?: number;
          price?: number;
          thumbnail_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      batches: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          version: string;
          mode: string;
          start_date: string | null;
          end_date: string | null;
          teacher_id: string | null;
          max_students: number | null;
          status: "upcoming" | "active" | "completed" | "paused";
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          version: string;
          mode: string;
          start_date?: string | null;
          end_date?: string | null;
          teacher_id?: string | null;
          max_students?: number | null;
          status?: "upcoming" | "active" | "completed" | "paused";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["batches"]["Insert"]>;
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          batch_id: string | null;
          enrollment_status: "pending" | "active" | "completed" | "dropped" | "paused";
          payment_status: "unpaid" | "pending" | "paid" | "partial" | "refunded";
          enrolled_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          batch_id?: string | null;
          enrollment_status?: "pending" | "active" | "completed" | "dropped" | "paused";
          payment_status?: "unpaid" | "pending" | "paid" | "partial" | "refunded";
          enrolled_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          order_index: number;
          unlock_rule: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          order_index?: number;
          unlock_rule?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["modules"]["Insert"]>;
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          course_id: string;
          title: string;
          description: string | null;
          lesson_type: "video" | "live" | "pdf" | "assignment" | "quiz";
          video_url: string | null;
          content: string | null;
          order_index: number;
          is_preview: boolean;
          requires_previous_completion: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          course_id: string;
          title: string;
          description?: string | null;
          lesson_type: "video" | "live" | "pdf" | "assignment" | "quiz";
          video_url?: string | null;
          content?: string | null;
          order_index?: number;
          is_preview?: boolean;
          requires_previous_completion?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          course_id: string | null;
          module_id: string | null;
          lesson_id: string | null;
          title: string;
          file_url: string;
          resource_type: "pdf" | "image" | "doc" | "link";
          is_downloadable: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          module_id?: string | null;
          lesson_id?: string | null;
          title: string;
          file_url: string;
          resource_type: "pdf" | "image" | "doc" | "link";
          is_downloadable?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          status: "not_started" | "in_progress" | "completed";
          watched_seconds: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          status?: "not_started" | "in_progress" | "completed";
          watched_seconds?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_progress"]["Insert"]>;
        Relationships: [];
      };
      daily_task_units: {
        Row: {
          id: string;
          course_id: string;
          batch_id: string | null;
          student_id: string | null;
          lesson_id: string | null;
          title: string;
          task_date: string;
          subject: string | null;
          chapter: string | null;
          watch_task: string | null;
          read_task: string | null;
          solve_task: string | null;
          submit_task: string | null;
          review_task: string | null;
          due_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          batch_id?: string | null;
          student_id?: string | null;
          lesson_id?: string | null;
          title: string;
          task_date: string;
          subject?: string | null;
          chapter?: string | null;
          watch_task?: string | null;
          read_task?: string | null;
          solve_task?: string | null;
          submit_task?: string | null;
          review_task?: string | null;
          due_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_task_units"]["Insert"]>;
        Relationships: [];
      };
      dtu_submissions: {
        Row: {
          id: string;
          dtu_id: string;
          student_id: string;
          submission_text: string | null;
          file_url: string | null;
          submitted_at: string | null;
          status: "submitted" | "late" | "reviewed" | "missing" | "excused";
          score: number | null;
          teacher_feedback: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          dtu_id: string;
          student_id: string;
          submission_text?: string | null;
          file_url?: string | null;
          submitted_at?: string | null;
          status?: "submitted" | "late" | "reviewed" | "missing" | "excused";
          score?: number | null;
          teacher_feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["dtu_submissions"]["Insert"]>;
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          course_id: string;
          module_id: string | null;
          lesson_id: string | null;
          title: string;
          description: string | null;
          quiz_type: "weekly" | "chapter" | "diagnostic" | "practice";
          pass_mark: number;
          duration_minutes: number | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          module_id?: string | null;
          lesson_id?: string | null;
          title: string;
          description?: string | null;
          quiz_type: "weekly" | "chapter" | "diagnostic" | "practice";
          pass_mark?: number;
          duration_minutes?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_text: string;
          question_type: "mcq" | "true_false" | "short_answer";
          option_a: string | null;
          option_b: string | null;
          option_c: string | null;
          option_d: string | null;
          correct_answer: string | null;
          explanation: string | null;
          marks: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question_text: string;
          question_type: "mcq" | "true_false" | "short_answer";
          option_a?: string | null;
          option_b?: string | null;
          option_c?: string | null;
          option_d?: string | null;
          correct_answer?: string | null;
          explanation?: string | null;
          marks?: number;
          order_index?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Insert"]>;
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          student_id: string;
          started_at: string;
          submitted_at: string | null;
          score: number | null;
          percentage: number | null;
          passed: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          student_id: string;
          started_at?: string;
          submitted_at?: string | null;
          score?: number | null;
          percentage?: number | null;
          passed?: boolean | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_attempts"]["Insert"]>;
        Relationships: [];
      };
      quiz_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_answer: string | null;
          is_correct: boolean | null;
          marks_awarded: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          selected_answer?: string | null;
          is_correct?: boolean | null;
          marks_awarded?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_answers"]["Insert"]>;
        Relationships: [];
      };
      gscores: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          batch_id: string | null;
          week_start: string;
          week_end: string;
          streak_points: number;
          weekly_test_score: number;
          submission_rate: number;
          improvement_bonus: number;
          teacher_score: number;
          total_gscore: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          batch_id?: string | null;
          week_start: string;
          week_end: string;
          streak_points?: number;
          weekly_test_score?: number;
          submission_rate?: number;
          improvement_bonus?: number;
          teacher_score?: number;
          total_gscore?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gscores"]["Insert"]>;
        Relationships: [];
      };
      leaderboard_entries: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          batch_id: string | null;
          period_type: "weekly" | "monthly";
          period_start: string;
          period_end: string;
          rank: number;
          total_gscore: number;
          streak: number;
          label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          batch_id?: string | null;
          period_type: "weekly" | "monthly";
          period_start: string;
          period_end: string;
          rank: number;
          total_gscore?: number;
          streak?: number;
          label?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leaderboard_entries"]["Insert"]>;
        Relationships: [];
      };
      parent_reports: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          batch_id: string | null;
          week_start: string;
          week_end: string;
          tasks_completed: number;
          tasks_total: number;
          weekly_test_score: number | null;
          previous_week_score: number | null;
          current_streak: number;
          leaderboard_rank: number | null;
          focus_this_week: string | null;
          focus_next_week: string | null;
          teacher_comment: string | null;
          report_text: string | null;
          sent_status: "draft" | "sent" | "not_sent";
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          batch_id?: string | null;
          week_start: string;
          week_end: string;
          tasks_completed?: number;
          tasks_total?: number;
          weekly_test_score?: number | null;
          previous_week_score?: number | null;
          current_streak?: number;
          leaderboard_rank?: number | null;
          focus_this_week?: string | null;
          focus_next_week?: string | null;
          teacher_comment?: string | null;
          report_text?: string | null;
          sent_status?: "draft" | "sent" | "not_sent";
          sent_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parent_reports"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          student_id: string | null;
          course_id: string | null;
          amount: number;
          currency: string;
          payment_method: "bkash" | "nagad" | "rocket" | "bank" | "cash" | "sslcommerz" | "other";
          transaction_id: string | null;
          screenshot_url: string | null;
          status: "pending" | "verified" | "rejected" | "refunded";
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          course_id?: string | null;
          amount: number;
          currency?: string;
          payment_method: "bkash" | "nagad" | "rocket" | "bank" | "cash" | "sslcommerz" | "other";
          transaction_id?: string | null;
          screenshot_url?: string | null;
          status?: "pending" | "verified" | "rejected" | "refunded";
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          course_id: string | null;
          batch_id: string | null;
          title: string;
          body: string;
          created_by: string | null;
          publish_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          batch_id?: string | null;
          title: string;
          body: string;
          created_by?: string | null;
          publish_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
        Relationships: [];
      };
      gate_overrides: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          lesson_id: string | null;
          reason: string;
          approved_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          lesson_id?: string | null;
          reason: string;
          approved_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gate_overrides"]["Insert"]>;
        Relationships: [];
      };
      recovery_actions: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          trigger_reason: string;
          action_plan: string;
          assigned_teacher_id: string | null;
          status: "open" | "in_progress" | "resolved";
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          trigger_reason: string;
          action_plan: string;
          assigned_teacher_id?: string | null;
          status?: "open" | "in_progress" | "resolved";
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["recovery_actions"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          student_name: string;
          parent_name: string;
          student_phone: string;
          parent_phone: string;
          whatsapp: string;
          email: string | null;
          current_level: string;
          version: string;
          institution: string;
          interested_programme: string;
          preferred_mode: string;
          source: string;
          status: "new" | "contacted" | "interested" | "payment_pending" | "enrolled" | "lost";
          message: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          parent_name: string;
          student_phone: string;
          parent_phone: string;
          whatsapp: string;
          email?: string | null;
          current_level: string;
          version: string;
          institution: string;
          interested_programme: string;
          preferred_mode: string;
          source: string;
          status?: "new" | "contacted" | "interested" | "payment_pending" | "enrolled" | "lost";
          message?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: Role | null;
      };
      is_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
