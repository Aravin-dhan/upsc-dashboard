-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'first_reading_done', 'revised_once', 'mastered');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE mock_test_type AS ENUM ('prelims', 'mains', 'interview');
CREATE TYPE study_block_type AS ENUM ('study', 'revision', 'answer_writing', 'mock_test', 'current_affairs', 'break', 'exercise');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    prelims_date DATE,
    mains_date DATE,
    interview_date DATE,
    target_year INTEGER,
    optional_subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Syllabus structure table
CREATE TABLE syllabus_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES syllabus_topics(id),
    exam_type TEXT NOT NULL, -- 'prelims', 'mains', 'interview'
    paper TEXT, -- 'gs1', 'gs2', 'gs3', 'gs4', 'csat', 'essay', 'optional1', 'optional2'
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES syllabus_topics(id) ON DELETE CASCADE,
    status progress_status DEFAULT 'not_started',
    first_read_date DATE,
    last_revised_date DATE,
    revision_count INTEGER DEFAULT 0,
    confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- Daily goals and tasks
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    topic_id UUID REFERENCES syllabus_topics(id),
    priority task_priority DEFAULT 'medium',
    is_completed BOOLEAN DEFAULT false,
    due_date DATE,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Study schedule and time blocks
CREATE TABLE study_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    block_type study_block_type NOT NULL,
    topic_id UUID REFERENCES syllabus_topics(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock test records
CREATE TABLE mock_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    test_type mock_test_type NOT NULL,
    paper TEXT, -- for mains tests
    total_questions INTEGER,
    attempted_questions INTEGER,
    correct_answers INTEGER,
    total_marks DECIMAL(5,2),
    obtained_marks DECIMAL(5,2),
    percentile DECIMAL(5,2),
    test_date DATE NOT NULL,
    time_taken INTEGER, -- in minutes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock test question analysis
CREATE TABLE mock_test_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    topic_id UUID REFERENCES syllabus_topics(id),
    is_correct BOOLEAN NOT NULL,
    is_attempted BOOLEAN DEFAULT true,
    time_spent INTEGER, -- in seconds
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Current affairs and news
CREATE TABLE current_affairs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    source_url TEXT,
    source_name TEXT,
    published_date DATE,
    tags TEXT[], -- array of tags
    topic_ids UUID[], -- array of related syllabus topic IDs
    is_bookmarked BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal knowledge base and notes
CREATE TABLE knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic_id UUID REFERENCES syllabus_topics(id),
    tags TEXT[],
    file_attachments TEXT[], -- URLs to uploaded files
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answer writing practice
CREATE TABLE answer_practice (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    topic_id UUID REFERENCES syllabus_topics(id),
    word_count INTEGER,
    time_taken INTEGER, -- in minutes
    self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 10),
    feedback TEXT,
    practice_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revision schedule (spaced repetition)
CREATE TABLE revision_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES syllabus_topics(id),
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_date DATE,
    next_revision_date DATE,
    revision_interval INTEGER DEFAULT 3, -- days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id, scheduled_date)
);

-- User preferences and settings
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    dashboard_layout JSONB, -- stores widget positions and sizes
    study_hours_target INTEGER DEFAULT 8,
    pomodoro_duration INTEGER DEFAULT 25, -- minutes
    break_duration INTEGER DEFAULT 5, -- minutes
    revision_intervals INTEGER[] DEFAULT ARRAY[3, 7, 21, 60], -- days
    notification_settings JSONB,
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Wellness and motivation tracking
CREATE TABLE wellness_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    sleep_hours DECIMAL(3,1),
    exercise_minutes INTEGER,
    meditation_minutes INTEGER,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    study_satisfaction INTEGER CHECK (study_satisfaction >= 1 AND study_satisfaction <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

-- Study streaks and milestones
CREATE TABLE milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER,
    current_value INTEGER DEFAULT 0,
    is_achieved BOOLEAN DEFAULT false,
    achieved_date DATE,
    reward TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own study blocks" ON study_blocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mock tests" ON mock_tests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mock test questions" ON mock_test_questions FOR ALL USING (
    auth.uid() = (SELECT user_id FROM mock_tests WHERE id = mock_test_id)
);
CREATE POLICY "Users can manage own current affairs" ON current_affairs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own knowledge base" ON knowledge_base FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own answer practice" ON answer_practice FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own revision schedule" ON revision_schedule FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wellness logs" ON wellness_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own milestones" ON milestones FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_topic ON user_progress(user_id, topic_id);
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);
CREATE INDEX idx_study_blocks_user_date ON study_blocks(user_id, start_time);
CREATE INDEX idx_mock_tests_user_date ON mock_tests(user_id, test_date);
CREATE INDEX idx_current_affairs_user_date ON current_affairs(user_id, published_date);
CREATE INDEX idx_revision_schedule_user_date ON revision_schedule(user_id, scheduled_date);
CREATE INDEX idx_wellness_logs_user_date ON wellness_logs(user_id, log_date);

-- Mock test question analysis
CREATE TABLE mock_test_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    topic_id UUID REFERENCES syllabus_topics(id),
    is_correct BOOLEAN NOT NULL,
    is_attempted BOOLEAN DEFAULT true,
    time_spent INTEGER, -- in seconds
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Current affairs and news
CREATE TABLE current_affairs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    source_url TEXT,
    source_name TEXT,
    published_date DATE,
    tags TEXT[], -- array of tags
    topic_ids UUID[], -- array of related syllabus topic IDs
    is_bookmarked BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal knowledge base and notes
CREATE TABLE knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic_id UUID REFERENCES syllabus_topics(id),
    tags TEXT[],
    file_attachments TEXT[], -- URLs to uploaded files
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answer writing practice
CREATE TABLE answer_practice (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    topic_id UUID REFERENCES syllabus_topics(id),
    word_count INTEGER,
    time_taken INTEGER, -- in minutes
    self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 10),
    feedback TEXT,
    practice_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revision schedule (spaced repetition)
CREATE TABLE revision_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES syllabus_topics(id),
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_date DATE,
    next_revision_date DATE,
    revision_interval INTEGER DEFAULT 3, -- days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id, scheduled_date)
);

-- User preferences and settings
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    dashboard_layout JSONB, -- stores widget positions and sizes
    study_hours_target INTEGER DEFAULT 8,
    pomodoro_duration INTEGER DEFAULT 25, -- minutes
    break_duration INTEGER DEFAULT 5, -- minutes
    revision_intervals INTEGER[] DEFAULT ARRAY[3, 7, 21, 60], -- days
    notification_settings JSONB,
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Wellness and motivation tracking
CREATE TABLE wellness_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    sleep_hours DECIMAL(3,1),
    exercise_minutes INTEGER,
    meditation_minutes INTEGER,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    study_satisfaction INTEGER CHECK (study_satisfaction >= 1 AND study_satisfaction <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

-- Study streaks and milestones
CREATE TABLE milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER,
    current_value INTEGER DEFAULT 0,
    is_achieved BOOLEAN DEFAULT false,
    achieved_date DATE,
    reward TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
