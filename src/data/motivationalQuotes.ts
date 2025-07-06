export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: 'motivation' | 'perseverance' | 'success' | 'learning' | 'leadership' | 'wisdom' | 'courage' | 'dedication';
  upscRelevance: 'high' | 'medium' | 'low';
  context: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard'; // For when user is struggling vs doing well
  mood: 'encouraging' | 'challenging' | 'inspiring' | 'calming' | 'energizing';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  studyPhase: 'beginning' | 'preparation' | 'revision' | 'exam' | 'break' | 'any';
}

export const motivationalQuotes: MotivationalQuote[] = [
  // High UPSC Relevance - Famous Leaders & Civil Servants
  {
    id: 'gandhi-1',
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    category: 'leadership',
    upscRelevance: 'high',
    context: "Perfect for essay writing and understanding the role of civil servants in social transformation",
    tags: ['gandhi', 'leadership', 'change', 'civil-service'],
    difficulty: 'medium',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },
  {
    id: 'kalam-1',
    text: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
    author: "Dr. A.P.J. Abdul Kalam",
    category: 'motivation',
    upscRelevance: 'high',
    context: "From India's Missile Man and former President - perfect for UPSC aspirants",
    tags: ['kalam', 'dreams', 'dedication', 'president'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'evening',
    studyPhase: 'preparation'
  },
  {
    id: 'nehru-1',
    text: "The only alternative to coexistence is co-destruction.",
    author: "Jawaharlal Nehru",
    category: 'wisdom',
    upscRelevance: 'high',
    context: "Relevant for International Relations and Indian Foreign Policy",
    tags: ['nehru', 'diplomacy', 'international-relations', 'peace'],
    difficulty: 'hard',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'preparation'
  },
  {
    id: 'patel-1',
    text: "Manpower without unity is not a strength unless it is harmonized and united properly, then it becomes a spiritual power.",
    author: "Sardar Vallabhbhai Patel",
    category: 'leadership',
    upscRelevance: 'high',
    context: "Iron Man of India - relevant for Public Administration and Leadership",
    tags: ['patel', 'unity', 'leadership', 'administration'],
    difficulty: 'medium',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },
  {
    id: 'azad-1',
    text: "Education imparted by heart can bring revolution in the society.",
    author: "Maulana Abul Kalam Azad",
    category: 'learning',
    upscRelevance: 'high',
    context: "First Education Minister of India - relevant for Education Policy",
    tags: ['azad', 'education', 'society', 'revolution'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'morning',
    studyPhase: 'beginning'
  },

  // UPSC-Specific Motivational Quotes
  {
    id: 'upsc-1',
    text: "Success in UPSC is not about being the smartest, but about being the most persistent.",
    author: "Anonymous UPSC Topper",
    category: 'perseverance',
    upscRelevance: 'high',
    context: "Directly relevant to UPSC preparation mindset",
    tags: ['upsc', 'persistence', 'success', 'topper'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'any',
    studyPhase: 'preparation'
  },
  {
    id: 'upsc-2',
    text: "Every page you read, every question you solve, every mock test you take is a step closer to your IAS dream.",
    author: "UPSC Mentor",
    category: 'motivation',
    upscRelevance: 'high',
    context: "Encourages daily study habits and consistent effort",
    tags: ['upsc', 'daily-study', 'progress', 'ias'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'any',
    studyPhase: 'preparation'
  },
  {
    id: 'upsc-3',
    text: "The UPSC exam doesn't test your intelligence; it tests your patience, persistence, and preparation.",
    author: "Civil Services Veteran",
    category: 'wisdom',
    upscRelevance: 'high',
    context: "Helps understand the true nature of UPSC examination",
    tags: ['upsc', 'patience', 'preparation', 'understanding'],
    difficulty: 'medium',
    mood: 'calming',
    timeOfDay: 'any',
    studyPhase: 'exam'
  },

  // Study & Learning Motivation
  {
    id: 'study-1',
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: 'learning',
    upscRelevance: 'medium',
    context: "Encourages beginners who feel overwhelmed by the vast syllabus",
    tags: ['learning', 'beginner', 'expert', 'growth'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'morning',
    studyPhase: 'beginning'
  },
  {
    id: 'study-2',
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: 'perseverance',
    upscRelevance: 'high',
    context: "Perfect for maintaining daily study routine",
    tags: ['success', 'daily-effort', 'consistency', 'routine'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'morning',
    studyPhase: 'preparation'
  },
  {
    id: 'study-3',
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: 'learning',
    upscRelevance: 'medium',
    context: "Emphasizes the permanent value of knowledge gained during preparation",
    tags: ['learning', 'knowledge', 'permanent', 'value'],
    difficulty: 'easy',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },

  // Perseverance & Resilience
  {
    id: 'resilience-1',
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: 'perseverance',
    upscRelevance: 'high',
    context: "For those feeling behind in their preparation",
    tags: ['perseverance', 'slow-progress', 'consistency', 'ancient-wisdom'],
    difficulty: 'medium',
    mood: 'calming',
    timeOfDay: 'evening',
    studyPhase: 'preparation'
  },
  {
    id: 'resilience-2',
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: 'perseverance',
    upscRelevance: 'high',
    context: "For those who have failed attempts or facing setbacks",
    tags: ['resilience', 'failure', 'comeback', 'japanese-wisdom'],
    difficulty: 'hard',
    mood: 'encouraging',
    timeOfDay: 'any',
    studyPhase: 'any'
  },
  {
    id: 'resilience-3',
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
    category: 'courage',
    upscRelevance: 'high',
    context: "Mental strength needed for UPSC preparation",
    tags: ['gandhi', 'strength', 'will', 'mental-power'],
    difficulty: 'medium',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },

  // Success & Achievement
  {
    id: 'success-1',
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: 'success',
    upscRelevance: 'high',
    context: "Relevant for multiple attempts and maintaining perspective",
    tags: ['churchill', 'success', 'failure', 'courage', 'continue'],
    difficulty: 'medium',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },
  {
    id: 'success-2',
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: 'motivation',
    upscRelevance: 'medium',
    context: "For procrastinators who keep planning but not executing",
    tags: ['action', 'procrastination', 'start', 'doing'],
    difficulty: 'easy',
    mood: 'energizing',
    timeOfDay: 'morning',
    studyPhase: 'beginning'
  },

  // Time-Specific Quotes
  {
    id: 'morning-1',
    text: "Every morning we are born again. What we do today is what matters most.",
    author: "Buddha",
    category: 'motivation',
    upscRelevance: 'medium',
    context: "Perfect morning motivation for fresh start each day",
    tags: ['buddha', 'morning', 'fresh-start', 'today'],
    difficulty: 'easy',
    mood: 'energizing',
    timeOfDay: 'morning',
    studyPhase: 'any'
  },
  {
    id: 'evening-1',
    text: "Reflect upon your present blessings, of which every man has many - not on your past misfortunes, of which all men have some.",
    author: "Charles Dickens",
    category: 'wisdom',
    upscRelevance: 'medium',
    context: "Evening reflection and gratitude practice",
    tags: ['dickens', 'reflection', 'gratitude', 'blessings'],
    difficulty: 'medium',
    mood: 'calming',
    timeOfDay: 'evening',
    studyPhase: 'any'
  },

  // Exam-Specific
  {
    id: 'exam-1',
    text: "Confidence comes not from always being right but from not fearing to be wrong.",
    author: "Peter T. Mcintyre",
    category: 'courage',
    upscRelevance: 'high',
    context: "For exam anxiety and building confidence",
    tags: ['confidence', 'fear', 'wrong', 'exam-anxiety'],
    difficulty: 'medium',
    mood: 'calming',
    timeOfDay: 'any',
    studyPhase: 'exam'
  },
  {
    id: 'exam-2',
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    category: 'courage',
    upscRelevance: 'medium',
    context: "Self-confidence booster before exams",
    tags: ['brave', 'strong', 'smart', 'self-belief'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'any',
    studyPhase: 'exam'
  },

  // Break & Rest
  {
    id: 'rest-1',
    text: "Take rest; a field that has rested gives a bountiful crop.",
    author: "Ovid",
    category: 'wisdom',
    upscRelevance: 'medium',
    context: "Importance of taking breaks during intense preparation",
    tags: ['rest', 'break', 'productivity', 'ancient-wisdom'],
    difficulty: 'easy',
    mood: 'calming',
    timeOfDay: 'any',
    studyPhase: 'break'
  },
  {
    id: 'rest-2',
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    category: 'wisdom',
    upscRelevance: 'medium',
    context: "Modern take on the importance of rest and reset",
    tags: ['rest', 'reset', 'unplug', 'modern-wisdom'],
    difficulty: 'easy',
    mood: 'calming',
    timeOfDay: 'evening',
    studyPhase: 'break'
  },

  // Leadership & Service (Civil Services Theme)
  {
    id: 'service-1',
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    category: 'leadership',
    upscRelevance: 'high',
    context: "Core philosophy of civil services - service to society",
    tags: ['gandhi', 'service', 'others', 'civil-service', 'purpose'],
    difficulty: 'medium',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },
  {
    id: 'service-2',
    text: "A society grows great when old men plant trees whose shade they know they shall never sit in.",
    author: "Greek Proverb",
    category: 'leadership',
    upscRelevance: 'high',
    context: "Long-term vision and service - key civil service values",
    tags: ['society', 'future', 'service', 'vision', 'greek-wisdom'],
    difficulty: 'hard',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },

  // Wisdom & Philosophy
  {
    id: 'wisdom-1',
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    category: 'wisdom',
    upscRelevance: 'medium',
    context: "Humility in learning - important for continuous growth",
    tags: ['socrates', 'wisdom', 'humility', 'learning', 'philosophy'],
    difficulty: 'hard',
    mood: 'inspiring',
    timeOfDay: 'any',
    studyPhase: 'any'
  },
  {
    id: 'wisdom-2',
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    category: 'learning',
    upscRelevance: 'high',
    context: "Value of education and knowledge acquisition",
    tags: ['franklin', 'knowledge', 'investment', 'education', 'value'],
    difficulty: 'easy',
    mood: 'encouraging',
    timeOfDay: 'any',
    studyPhase: 'preparation'
  }
];

// Helper functions for quote selection
export const getQuotesByCategory = (category: MotivationalQuote['category']): MotivationalQuote[] => {
  return motivationalQuotes.filter(quote => quote.category === category);
};

export const getQuotesByRelevance = (relevance: MotivationalQuote['upscRelevance']): MotivationalQuote[] => {
  return motivationalQuotes.filter(quote => quote.upscRelevance === relevance);
};

export const getQuotesByMood = (mood: MotivationalQuote['mood']): MotivationalQuote[] => {
  return motivationalQuotes.filter(quote => quote.mood === mood);
};

export const getQuotesByTimeAndPhase = (
  timeOfDay: MotivationalQuote['timeOfDay'], 
  studyPhase: MotivationalQuote['studyPhase']
): MotivationalQuote[] => {
  return motivationalQuotes.filter(quote => 
    (quote.timeOfDay === timeOfDay || quote.timeOfDay === 'any') &&
    (quote.studyPhase === studyPhase || quote.studyPhase === 'any')
  );
};

export const getRandomQuote = (): MotivationalQuote => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

export const getContextualQuote = (
  userMood?: 'struggling' | 'motivated' | 'neutral',
  timeOfDay?: MotivationalQuote['timeOfDay'],
  studyPhase?: MotivationalQuote['studyPhase']
): MotivationalQuote => {
  let filteredQuotes = motivationalQuotes;

  // Filter by time of day
  if (timeOfDay) {
    filteredQuotes = filteredQuotes.filter(quote => 
      quote.timeOfDay === timeOfDay || quote.timeOfDay === 'any'
    );
  }

  // Filter by study phase
  if (studyPhase) {
    filteredQuotes = filteredQuotes.filter(quote => 
      quote.studyPhase === studyPhase || quote.studyPhase === 'any'
    );
  }

  // Filter by user mood
  if (userMood === 'struggling') {
    filteredQuotes = filteredQuotes.filter(quote => 
      quote.mood === 'encouraging' || quote.mood === 'calming'
    );
  } else if (userMood === 'motivated') {
    filteredQuotes = filteredQuotes.filter(quote => 
      quote.mood === 'challenging' || quote.mood === 'inspiring'
    );
  }

  // Prefer high UPSC relevance
  const highRelevanceQuotes = filteredQuotes.filter(quote => quote.upscRelevance === 'high');
  const finalQuotes = highRelevanceQuotes.length > 0 ? highRelevanceQuotes : filteredQuotes;

  return finalQuotes[Math.floor(Math.random() * finalQuotes.length)] || getRandomQuote();
};
