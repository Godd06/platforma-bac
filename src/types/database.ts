export type UserRoleType = 'student' | 'editor' | 'reviewer' | 'super_admin'

export type LessonAccessLevel = 'free' | 'pro'

export type LessonStatus = 'draft' | 'review' | 'published' | 'archived'

export type MediaType = 'image' | 'audio' | 'video' | 'document'

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'expired'

export interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: UserRoleType
  created_at: string
}

export interface Subject {
  id: string
  slug: string
  name: string
  short_description: string | null
  description: string | null
  icon: string | null
  cover_media_id: string | null
  accent_theme: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  subject_id: string
  slug: string
  title: string
  short_description: string | null
  description: string | null
  cover_media_id: string | null
  sort_order: number
  is_published: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  chapter_id: string
  slug: string
  title: string
  short_description: string | null
  estimated_minutes: number | null
  access_level: LessonAccessLevel
  status: LessonStatus
  cover_media_id: string | null
  sort_order: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface LessonBlock {
  id: string
  lesson_id: string
  block_type: string
  sort_order: number
  content: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  type: MediaType
  storage_bucket: string
  storage_path: string
  filename: string | null
  mime_type: string | null
  size_bytes: number | null
  title: string | null
  description: string | null
  alt_text: string | null
  duration_seconds: number | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  status: ProgressStatus
  progress_percent: number
  last_block_id: string | null
  started_at: string | null
  completed_at: string | null
  updated_at: string
}

export interface UserStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  updated_at: string
}

export type UserActivityType =
  | 'lesson_completed'
  | 'quiz_completed'
  | 'lesson_started'
  | 'lesson_progress'
  | 'hidden_answer_revealed'
  | 'self_assessment'
  | 'audio_played'
  | 'video_played'
  | 'lesson_opened'

export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  lesson_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  provider: string
  provider_customer_id: string | null
  provider_subscription_id: string | null
  plan: string
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// Database schema typing for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { user_id: string }
        Update: Partial<Profile>
      }
      user_roles: {
        Row: UserRole
        Insert: Partial<UserRole> & { user_id: string; role: UserRoleType }
        Update: Partial<UserRole>
      }
      subjects: {
        Row: Subject
        Insert: Partial<Subject> & { slug: string; name: string }
        Update: Partial<Subject>
      }
      chapters: {
        Row: Chapter
        Insert: Partial<Chapter> & { subject_id: string; slug: string; title: string }
        Update: Partial<Chapter>
      }
      lessons: {
        Row: Lesson
        Insert: Partial<Lesson> & { chapter_id: string; slug: string; title: string }
        Update: Partial<Lesson>
      }
      lesson_blocks: {
        Row: LessonBlock
        Insert: Partial<LessonBlock> & { lesson_id: string; block_type: string; sort_order: number; content: Record<string, unknown> }
        Update: Partial<LessonBlock>
      }
      media: {
        Row: Media
        Insert: Partial<Media> & { type: MediaType; storage_bucket: string; storage_path: string }
        Update: Partial<Media>
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: Partial<LessonProgress> & { user_id: string; lesson_id: string }
        Update: Partial<LessonProgress>
      }
      user_streaks: {
        Row: UserStreak
        Insert: Partial<UserStreak> & { user_id: string }
        Update: Partial<UserStreak>
      }
      user_activity: {
        Row: UserActivity
        Insert: Partial<UserActivity> & { user_id: string; activity_type: string }
        Update: Partial<UserActivity>
      }
      subscriptions: {
        Row: Subscription
        Insert: Partial<Subscription> & { user_id: string; provider: string; plan: string; status: SubscriptionStatus }
        Update: Partial<Subscription>
      }
    }
  }
}

export type QuizQuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false_justified'
  | 'text_matching'
  | 'fill_in_blank'
  | 'short_essay_self_eval'

export type ConfidenceLevel = 'high' | 'low'

export interface Quiz {
  id: string
  chapter_id: string
  title: string
  description: string | null
  estimated_minutes: number
  access_level: LessonAccessLevel
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_type: QuizQuestionType
  prompt: string
  options: Record<string, unknown> | null
  correct_answer?: Record<string, unknown> | null
  explanation_html: string
  points: number
  sort_order: number
  created_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score_obtained: number
  max_score: number
  score_percent: number
  status: 'in_progress' | 'completed' | 'abandoned'
  started_at: string
  completed_at: string | null
}

export interface QuizResponseRecord {
  id: string
  attempt_id: string
  question_id: string
  user_answer: Record<string, unknown>
  is_correct: boolean
  confidence_level: ConfidenceLevel
  points_awarded: number
  created_at: string
}

export interface UserTopicMastery {
  id: string
  user_id: string
  chapter_id: string
  mastery_percent: number
  total_attempts: number
  is_weak_topic: boolean
  next_review_due: string | null
  updated_at: string
}

