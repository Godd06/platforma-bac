import { supabase } from '@/lib/supabase'
import type { Subject, Chapter, Lesson } from '@/types/database'

export interface ContinueLearningItem {
  lessonId: string
  lessonTitle: string
  lessonSlug: string
  accessLevel: 'free' | 'pro'
  progressPercent: number
  lastBlockId: string | null
  updatedAt: string
  chapterId: string
  chapterTitle: string
  chapterMetadata: {
    author?: string
    work_type?: string
    [key: string]: unknown
  } | null
  subjectId: string
  subjectName: string
  subjectSlug: string
}

export interface SubjectProgressItem {
  subjectId: string
  subjectName: string
  subjectSlug: string
  accentTheme: string
  completedLessons: number
  totalPublishedLessons: number
  progressPercent: number
  proLessonsCount: number
}

export interface UserActivityItem {
  id: string
  activityType: string
  lessonId: string | null
  lessonTitle: string | null
  lessonSlug: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface DashboardData {
  profile: {
    id: string
    userId: string
    displayName: string | null
    avatarUrl: string | null
  }
  continueLearning: ContinueLearningItem | null
  globalProgress: {
    completedLessons: number
    totalPublishedLessons: number
    progressPercent: number
  }
  subjectProgress: SubjectProgressItem[]
  streak: {
    currentStreak: number
    longestStreak: number
    lastActivityDate: string | null
  }
  recentActivity: UserActivityItem[]
  subscription: {
    isPro: boolean
    plan: 'free' | 'pro'
    status: string
  }
}

/**
 * Helper to fetch user profile metadata
 */
async function fetchProfile(userId: string) {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('id, user_id, display_name, avatar_url')
      .eq('user_id', userId)
      .maybeSingle()

    const profileData = data as {
      id: string
      user_id: string
      display_name: string | null
      avatar_url: string | null
    } | null

    return {
      id: profileData?.id || '',
      userId,
      displayName: profileData?.display_name || null,
      avatarUrl: profileData?.avatar_url || null,
    }
  } catch (err) {
    console.error('[dashboardService] Error fetching profile:', err)
    return {
      id: '',
      userId,
      displayName: null,
      avatarUrl: null,
    }
  }
}

/**
 * Helper to fetch Continue Learning item (latest in_progress lesson)
 */
async function fetchContinueLearning(userId: string): Promise<ContinueLearningItem | null> {
  try {
    const { data: progressRows, error: progressErr } = await supabase
      .from('lesson_progress')
      .select('lesson_id, progress_percent, last_block_id, updated_at')
      .eq('user_id', userId)
      .eq('status', 'in_progress')
      .order('updated_at', { ascending: false })
      .limit(1)

    const progressList = progressRows as Array<{
      lesson_id: string
      progress_percent: number
      last_block_id: string | null
      updated_at: string
    }> | null

    if (progressErr || !progressList || progressList.length === 0) {
      return null
    }

    const progress = progressList[0]

    // Fetch published lesson details
    const { data: lessonData, error: lessonErr } = await supabase
      .from('lessons')
      .select('id, chapter_id, slug, title, access_level, status')
      .eq('id', progress.lesson_id)
      .eq('status', 'published')
      .maybeSingle()

    if (lessonErr || !lessonData) {
      return null
    }

    const lesson = lessonData as Lesson

    // Fetch published chapter
    const { data: chapterData, error: chapterErr } = await supabase
      .from('chapters')
      .select('id, subject_id, slug, title, metadata, is_published')
      .eq('id', lesson.chapter_id)
      .eq('is_published', true)
      .maybeSingle()

    if (chapterErr || !chapterData) {
      return null
    }

    const chapter = chapterData as Chapter

    // Fetch published subject
    const { data: subjectData, error: subjectErr } = await supabase
      .from('subjects')
      .select('id, name, slug, is_published')
      .eq('id', chapter.subject_id)
      .eq('is_published', true)
      .maybeSingle()

    if (subjectErr || !subjectData) {
      return null
    }

    const subject = subjectData as Subject

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonSlug: lesson.slug,
      accessLevel: lesson.access_level,
      progressPercent: progress.progress_percent || 0,
      lastBlockId: progress.last_block_id,
      updatedAt: progress.updated_at,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      chapterMetadata: (chapter.metadata as Record<string, unknown>) || null,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectSlug: subject.slug,
    }
  } catch (err) {
    console.error('[dashboardService] Error fetching continue learning:', err)
    return null
  }
}

/**
 * Helper to fetch user streak
 */
async function fetchStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak, last_activity_date')
      .eq('user_id', userId)
      .maybeSingle()

    const streakData = data as {
      current_streak: number
      longest_streak: number
      last_activity_date: string | null
    } | null

    if (error || !streakData) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
      }
    }

    return {
      currentStreak: streakData.current_streak || 0,
      longestStreak: streakData.longest_streak || 0,
      lastActivityDate: streakData.last_activity_date || null,
    }
  } catch (err) {
    console.error('[dashboardService] Error fetching streak:', err)
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
    }
  }
}

/**
 * Helper to fetch recent relevant activity (excluding lesson_opened)
 */
async function fetchRecentActivity(userId: string): Promise<UserActivityItem[]> {
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('id, activity_type, lesson_id, metadata, created_at')
      .eq('user_id', userId)
      .in('activity_type', [
        'lesson_completed',
        'quiz_completed',
        'lesson_started',
        'lesson_progress',
        'hidden_answer_revealed',
        'self_assessment',
      ])
      .order('created_at', { ascending: false })
      .limit(10)

    const rawActivities = data as Array<{
      id: string
      activity_type: string
      lesson_id: string | null
      metadata: Record<string, unknown> | null
      created_at: string
    }> | null

    if (error || !rawActivities || rawActivities.length === 0) {
      return []
    }

    // Collect lesson titles for activity items that link to a lesson
    const lessonIds = Array.from(
      new Set(rawActivities.map((item) => item.lesson_id).filter((id): id is string => Boolean(id)))
    )

    const lessonMap = new Map<string, { title: string; slug: string }>()

    if (lessonIds.length > 0) {
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, title, slug')
        .in('id', lessonIds)

      const lessonsList = lessonsData as Array<{ id: string; title: string; slug: string }> | null
      if (lessonsList) {
        lessonsList.forEach((l) => {
          lessonMap.set(l.id, { title: l.title, slug: l.slug })
        })
      }
    }

    return rawActivities.map((item) => {
      const lessonInfo = item.lesson_id ? lessonMap.get(item.lesson_id) : undefined
      return {
        id: item.id,
        activityType: item.activity_type,
        lessonId: item.lesson_id,
        lessonTitle: lessonInfo?.title || null,
        lessonSlug: lessonInfo?.slug || null,
        metadata: item.metadata || null,
        createdAt: item.created_at,
      }
    })
  } catch (err) {
    console.error('[dashboardService] Error fetching recent activity:', err)
    return []
  }
}

/**
 * Helper to check subscription / staff PRO status
 */
async function fetchSubscription(userId: string) {
  try {
    // 1. Staff roles get PRO status automatically
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)

    const rolesList = roles as Array<{ role: string }> | null
    if (rolesList && rolesList.some((r) => ['editor', 'reviewer', 'super_admin'].includes(r.role))) {
      return {
        isPro: true,
        plan: 'pro' as const,
        status: 'active',
      }
    }

    // 2. Query subscriptions table for active / trialing PRO
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .eq('plan', 'pro')
      .in('status', ['active', 'trialing'])
      .maybeSingle()

    const subObj = sub as {
      plan: string
      status: string
      current_period_end: string | null
    } | null

    if (subObj) {
      const isValid = !subObj.current_period_end || new Date(subObj.current_period_end) > new Date()
      if (isValid) {
        return {
          isPro: true,
          plan: 'pro' as const,
          status: subObj.status,
        }
      }
    }

    return {
      isPro: false,
      plan: 'free' as const,
      status: 'none',
    }
  } catch (err) {
    console.error('[dashboardService] Error fetching subscription:', err)
    return {
      isPro: false,
      plan: 'free' as const,
      status: 'none',
    }
  }
}


/**
 * Helper to fetch both Global Progress and Subject Progress in a single optimized pass
 */
async function fetchProgressData(userId: string) {
  try {
    const [subjectsRes, chaptersRes, lessonsRes, progressRes] = await Promise.all([
      supabase
        .from('subjects')
        .select('id, name, slug, accent_theme, sort_order')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('chapters')
        .select('id, subject_id')
        .eq('is_published', true),
      supabase
        .from('lessons')
        .select('id, chapter_id, access_level')
        .eq('status', 'published'),
      supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('status', 'completed'),
    ])

    const subjects = (subjectsRes.data as Array<{
      id: string
      name: string
      slug: string
      accent_theme: string | null
      sort_order: number
    }>) || []

    const chapters = (chaptersRes.data as Array<{ id: string; subject_id: string }>) || []
    const lessons = (lessonsRes.data as Array<{ id: string; chapter_id: string; access_level: string }>) || []
    const progressList = (progressRes.data as Array<{ lesson_id: string }>) || []

    // Map published chapters to their subject_id
    const chapterToSubjectMap = new Map<string, string>()
    chapters.forEach((c) => {
      chapterToSubjectMap.set(c.id, c.subject_id)
    })

    // Filter published lessons to only those belonging to published chapters
    const publishedLessons = lessons.filter((l) => chapterToSubjectMap.has(l.chapter_id))

    // Set of user completed lesson IDs
    const completedLessonIds = new Set(progressList.map((p) => p.lesson_id))

    // Global Progress calculations
    const totalPublishedLessons = publishedLessons.length
    const completedLessons = publishedLessons.filter((l) => completedLessonIds.has(l.id)).length
    const progressPercent =
      totalPublishedLessons > 0 ? Math.round((completedLessons / totalPublishedLessons) * 100) : 0

    // Subject Progress calculations
    const subjectProgress: SubjectProgressItem[] = subjects.map((subj) => {
      const subjectLessons = publishedLessons.filter(
        (l) => chapterToSubjectMap.get(l.chapter_id) === subj.id
      )
      const subTotal = subjectLessons.length
      const subPro = subjectLessons.filter((l) => l.access_level === 'pro').length
      const subCompleted = subjectLessons.filter((l) => completedLessonIds.has(l.id)).length
      const subPercent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0

      return {
        subjectId: subj.id,
        subjectName: subj.name,
        subjectSlug: subj.slug,
        accentTheme: subj.accent_theme || '#6366f1',
        completedLessons: subCompleted,
        totalPublishedLessons: subTotal,
        progressPercent: subPercent,
        proLessonsCount: subPro,
      }
    })

    return {
      globalProgress: {
        completedLessons,
        totalPublishedLessons,
        progressPercent,
      },
      subjectProgress,
    }
  } catch (err) {
    console.error('[dashboardService] Error fetching progress data:', err)
    return {
      globalProgress: {
        completedLessons: 0,
        totalPublishedLessons: 0,
        progressPercent: 0,
      },
      subjectProgress: [],
    }
  }
}

/**
 * Fetch all aggregated Dashboard data in parallel without waterfall delays
 */
export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const [profile, continueLearning, streak, recentActivity, subscription, progressData] =
    await Promise.all([
      fetchProfile(userId),
      fetchContinueLearning(userId),
      fetchStreak(userId),
      fetchRecentActivity(userId),
      fetchSubscription(userId),
      fetchProgressData(userId),
    ])

  return {
    profile,
    continueLearning,
    globalProgress: progressData.globalProgress,
    subjectProgress: progressData.subjectProgress,
    streak,
    recentActivity,
    subscription,
  }
}
