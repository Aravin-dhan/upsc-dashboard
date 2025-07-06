// Database types and interfaces

export type ProgressStatus = 'not_started' | 'in_progress' | 'first_reading_done' | 'revised_once' | 'mastered';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MockTestType = 'prelims' | 'mains' | 'interview';
export type StudyBlockType = 'study' | 'revision' | 'answer_writing' | 'mock_test' | 'current_affairs' | 'break' | 'exercise';
export type ExamType = 'prelims' | 'mains' | 'interview';
export type PaperType = 'gs1' | 'gs2' | 'gs3' | 'gs4' | 'csat' | 'essay' | 'optional1' | 'optional2';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  prelims_date?: string;
  mains_date?: string;
  interview_date?: string;
  target_year?: number;
  optional_subject?: string;
  created_at: string;
  updated_at: string;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  exam_type: ExamType;
  paper?: PaperType;
  order_index: number;
  is_active: boolean;
  created_at: string;
  children?: SyllabusTopic[];
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: ProgressStatus;
  first_read_date?: string;
  last_revised_date?: string;
  revision_count: number;
  confidence_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  topic?: SyllabusTopic;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  topic_id?: string;
  priority: TaskPriority;
  is_completed: boolean;
  due_date?: string;
  estimated_duration?: number;
  actual_duration?: number;
  created_at: string;
  completed_at?: string;
  topic?: SyllabusTopic;
}

export interface StudyBlock {
  id: string;
  user_id: string;
  title: string;
  block_type: StudyBlockType;
  topic_id?: string;
  start_time: string;
  end_time: string;
  is_completed: boolean;
  actual_start_time?: string;
  actual_end_time?: string;
  notes?: string;
  created_at: string;
  topic?: SyllabusTopic;
}

export interface MockTest {
  id: string;
  user_id: string;
  test_name: string;
  test_type: MockTestType;
  paper?: string;
  total_questions?: number;
  attempted_questions?: number;
  correct_answers?: number;
  total_marks?: number;
  obtained_marks?: number;
  percentile?: number;
  test_date: string;
  time_taken?: number;
  notes?: string;
  created_at: string;
  questions?: MockTestQuestion[];
}

export interface MockTestQuestion {
  id: string;
  mock_test_id: string;
  question_number: number;
  topic_id?: string;
  is_correct: boolean;
  is_attempted: boolean;
  time_spent?: number;
  difficulty_level?: number;
  created_at: string;
  topic?: SyllabusTopic;
}

export interface CurrentAffair {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  source_url?: string;
  source_name?: string;
  published_date?: string;
  tags?: string[];
  topic_ids?: string[];
  is_bookmarked: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  topics?: SyllabusTopic[];
}

export interface KnowledgeBase {
  id: string;
  user_id: string;
  title: string;
  content: string;
  topic_id?: string;
  tags?: string[];
  file_attachments?: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  topic?: SyllabusTopic;
}

export interface AnswerPractice {
  id: string;
  user_id: string;
  question: string;
  answer?: string;
  topic_id?: string;
  word_count?: number;
  time_taken?: number;
  self_rating?: number;
  feedback?: string;
  practice_date: string;
  created_at: string;
  topic?: SyllabusTopic;
}

export interface RevisionSchedule {
  id: string;
  user_id: string;
  topic_id: string;
  scheduled_date: string;
  is_completed: boolean;
  completed_date?: string;
  next_revision_date?: string;
  revision_interval: number;
  created_at: string;
  topic?: SyllabusTopic;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  dashboard_layout?: any;
  study_hours_target: number;
  pomodoro_duration: number;
  break_duration: number;
  revision_intervals: number[];
  notification_settings?: any;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface WellnessLog {
  id: string;
  user_id: string;
  log_date: string;
  sleep_hours?: number;
  exercise_minutes?: number;
  meditation_minutes?: number;
  mood_rating?: number;
  stress_level?: number;
  study_satisfaction?: number;
  notes?: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value: number;
  is_achieved: boolean;
  achieved_date?: string;
  reward?: string;
  created_at: string;
}

// Dashboard widget types
export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
  settings?: any;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  lastUpdated: string;
}
