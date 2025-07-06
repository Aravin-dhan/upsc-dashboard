import PerformanceService, { PerformanceMetric } from '@/services/PerformanceService';

export function generateSamplePerformanceData(): void {
  const performanceService = PerformanceService.getInstance();
  
  // Clear existing data first
  performanceService.clearAllData();
  
  const subjects = [
    'History', 'Geography', 'Polity', 'Economics', 'Environment', 
    'Science & Technology', 'Current Affairs', 'Ethics'
  ];
  
  const topics = {
    'History': ['Ancient India', 'Medieval India', 'Modern India', 'World History'],
    'Geography': ['Physical Geography', 'Human Geography', 'Indian Geography', 'World Geography'],
    'Polity': ['Constitution', 'Parliament', 'Judiciary', 'Federalism'],
    'Economics': ['Microeconomics', 'Macroeconomics', 'Indian Economy', 'Economic Survey'],
    'Environment': ['Ecology', 'Climate Change', 'Biodiversity', 'Environmental Laws'],
    'Science & Technology': ['Physics', 'Chemistry', 'Biology', 'Space Technology'],
    'Current Affairs': ['National', 'International', 'Economic Affairs', 'Science & Tech'],
    'Ethics': ['Theoretical Ethics', 'Applied Ethics', 'Case Studies', 'Attitude']
  };

  const sessionTypes: PerformanceMetric['type'][] = ['study', 'practice', 'revision', 'mock_test', 'answer_writing'];
  const difficulties: PerformanceMetric['difficulty'][] = ['easy', 'medium', 'hard'];

  // Generate data for the last 60 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 60);

  const sampleData: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  // Generate 150-200 sample sessions
  for (let i = 0; i < 180; i++) {
    // Random date within the last 60 days
    const sessionDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const dateStr = sessionDate.toISOString().split('T')[0];
    
    // Random subject and topic
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const subjectTopics = topics[subject as keyof typeof topics];
    const topic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
    
    // Random session type
    const type = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    // Generate realistic time spent (15 minutes to 4 hours)
    const timeSpent = Math.floor(Math.random() * 225) + 15; // 15-240 minutes
    
    // Generate session start and end times
    const sessionStart = new Date(sessionDate);
    sessionStart.setHours(Math.floor(Math.random() * 16) + 6); // 6 AM to 10 PM
    sessionStart.setMinutes(Math.floor(Math.random() * 60));
    
    const sessionEnd = new Date(sessionStart.getTime() + timeSpent * 60000);
    
    // Generate performance metrics based on session type
    let questionsAttempted = 0;
    let questionsCorrect = 0;
    let accuracy = 0;
    let speed = 0;
    
    if (type === 'practice' || type === 'mock_test') {
      questionsAttempted = Math.floor(Math.random() * 50) + 10; // 10-60 questions
      
      // Generate realistic accuracy based on difficulty and subject
      let baseAccuracy = 0.7; // 70% base accuracy
      
      // Adjust for difficulty
      if (difficulty === 'easy') baseAccuracy = 0.8;
      if (difficulty === 'hard') baseAccuracy = 0.6;
      
      // Add some randomness
      const accuracyVariation = (Math.random() - 0.5) * 0.3; // ±15%
      accuracy = Math.max(0.2, Math.min(0.95, baseAccuracy + accuracyVariation));
      
      questionsCorrect = Math.floor(questionsAttempted * accuracy);
      accuracy = (questionsCorrect / questionsAttempted) * 100;
      speed = questionsAttempted / timeSpent; // questions per minute
    }
    
    // Generate focus and confidence scores
    const focusScore = Math.floor(Math.random() * 4) + 6; // 6-10
    const confidenceLevel = Math.floor(Math.random() * 4) + 6; // 6-10
    
    // Generate some weak and strong areas
    const allAreas = ['Conceptual Understanding', 'Factual Recall', 'Analytical Thinking', 'Time Management', 'Answer Writing'];
    const weakAreas = allAreas.filter(() => Math.random() < 0.3).slice(0, 2);
    const strongAreas = allAreas.filter(() => Math.random() < 0.3).slice(0, 2);
    
    // Generate mistake types for practice sessions
    const mistakeTypes = type === 'practice' || type === 'mock_test' 
      ? ['Silly Mistakes', 'Conceptual Gaps', 'Time Pressure', 'Misreading'].filter(() => Math.random() < 0.4)
      : [];
    
    const sessionData: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'> = {
      date: dateStr,
      type,
      subject,
      topic,
      timeSpent,
      difficulty,
      startTime: sessionStart.toISOString(),
      endTime: sessionEnd.toISOString(),
      focusScore,
      confidenceLevel,
      weakAreas,
      strongAreas,
      mistakeTypes,
      notes: Math.random() < 0.3 ? `Good session on ${topic}. ${Math.random() < 0.5 ? 'Need to review weak areas.' : 'Feeling confident about this topic.'}` : ''
    };
    
    // Add questions data for practice/mock test sessions
    if (questionsAttempted > 0) {
      sessionData.questionsAttempted = questionsAttempted;
      sessionData.questionsCorrect = questionsCorrect;
      sessionData.accuracy = accuracy;
      sessionData.speed = speed;
    }
    
    sampleData.push(sessionData);
  }
  
  // Add the sample data to the performance service
  sampleData.forEach(data => {
    performanceService.addMetric(data);
  });
  
  console.log(`Generated ${sampleData.length} sample performance records`);
}

// Function to add a few recent sessions for immediate visibility
export function addRecentSampleSessions(): void {
  const performanceService = PerformanceService.getInstance();
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Today's sessions
  const todaySessions = [
    {
      date: today.toISOString().split('T')[0],
      type: 'study' as const,
      subject: 'History',
      topic: 'Modern India',
      timeSpent: 90,
      difficulty: 'medium' as const,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30).toISOString(),
      focusScore: 8,
      confidenceLevel: 7,
      notes: 'Covered Freedom Struggle in detail'
    },
    {
      date: today.toISOString().split('T')[0],
      type: 'practice' as const,
      subject: 'Geography',
      topic: 'Physical Geography',
      timeSpent: 45,
      questionsAttempted: 25,
      questionsCorrect: 19,
      accuracy: 76,
      speed: 0.56,
      difficulty: 'medium' as const,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0).toISOString(),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 45).toISOString(),
      focusScore: 9,
      confidenceLevel: 8,
      weakAreas: ['Time Management'],
      strongAreas: ['Conceptual Understanding'],
      mistakeTypes: ['Silly Mistakes']
    }
  ];
  
  // Yesterday's sessions
  const yesterdaySessions = [
    {
      date: yesterday.toISOString().split('T')[0],
      type: 'mock_test' as const,
      subject: 'Polity',
      topic: 'Constitution',
      timeSpent: 120,
      questionsAttempted: 50,
      questionsCorrect: 38,
      accuracy: 76,
      speed: 0.42,
      difficulty: 'hard' as const,
      startTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 10, 0).toISOString(),
      endTime: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 12, 0).toISOString(),
      focusScore: 7,
      confidenceLevel: 6,
      weakAreas: ['Analytical Thinking', 'Time Management'],
      strongAreas: ['Factual Recall'],
      mistakeTypes: ['Time Pressure', 'Conceptual Gaps'],
      notes: 'Mock test performance was decent. Need to work on time management.'
    }
  ];
  
  [...todaySessions, ...yesterdaySessions].forEach(session => {
    performanceService.addMetric(session);
  });
  
  console.log('Added recent sample sessions for immediate visibility');
}

// Function to check if sample data exists
export function hasSampleData(): boolean {
  const performanceService = PerformanceService.getInstance();
  const metrics = performanceService.getAllMetrics();
  return metrics.length > 0;
}

// Function to initialize sample data if needed
export function initializeSampleDataIfNeeded(): void {
  if (!hasSampleData()) {
    generateSamplePerformanceData();
    console.log('Sample performance data initialized');
  } else {
    console.log('Performance data already exists');
  }
}
