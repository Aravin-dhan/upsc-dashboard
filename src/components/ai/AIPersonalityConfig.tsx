'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings, Brain, MessageCircle, Target, Clock, BookOpen,
  Zap, Heart, Star, Lightbulb, Trophy, Flame, Shield,
  Smile, Coffee, Rocket, Compass, Mic, Volume2, Save,
  RotateCcw, Download, Upload, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  traits: {
    formality: number; // 1-10 (casual to formal)
    motivation: number; // 1-10 (gentle to intense)
    verbosity: number; // 1-10 (concise to detailed)
    empathy: number; // 1-10 (analytical to emotional)
    humor: number; // 1-10 (serious to humorous)
    directness: number; // 1-10 (diplomatic to blunt)
    encouragement: number; // 1-10 (neutral to highly encouraging)
    technicality: number; // 1-10 (simple to technical)
  };
  responseStyle: {
    greeting: string;
    encouragement: string[];
    corrections: string[];
    explanations: string[];
    farewells: string[];
  };
  specializations: string[];
  communicationPreferences: {
    useEmojis: boolean;
    includeQuotes: boolean;
    provideSources: boolean;
    askFollowUps: boolean;
    giveExamples: boolean;
    useAnalogies: boolean;
    breakDownComplex: boolean;
    summarizeKey: boolean;
  };
  behaviorSettings: {
    proactiveReminders: boolean;
    celebrateAchievements: boolean;
    trackProgress: boolean;
    suggestStudyPlans: boolean;
    adaptToPerformance: boolean;
    personalizeContent: boolean;
    maintainContext: boolean;
    learnFromFeedback: boolean;
  };
}

interface AIPersonalityConfigProps {
  onSave: (personality: AIPersonality) => void;
  currentPersonality?: AIPersonality;
}

export default function AIPersonalityConfig({ onSave, currentPersonality }: AIPersonalityConfigProps) {
  const [personality, setPersonality] = useState<AIPersonality>(
    currentPersonality || getDefaultPersonality()
  );
  const [activeTab, setActiveTab] = useState<'traits' | 'style' | 'behavior' | 'preview'>('traits');
  const [previewMessage, setPreviewMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  function getDefaultPersonality(): AIPersonality {
    return {
      id: 'default',
      name: 'UPSC Mentor',
      description: 'A supportive and knowledgeable AI mentor for UPSC preparation',
      traits: {
        formality: 6,
        motivation: 7,
        verbosity: 6,
        empathy: 7,
        humor: 4,
        directness: 6,
        encouragement: 8,
        technicality: 7
      },
      responseStyle: {
        greeting: "Hello! I'm here to help you excel in your UPSC preparation. What would you like to work on today?",
        encouragement: [
          "You're making great progress!",
          "Keep up the excellent work!",
          "Every step forward counts!",
          "You're on the right track!"
        ],
        corrections: [
          "Let me help clarify that concept...",
          "Here's a better way to think about it...",
          "That's close! Let me refine that for you...",
          "Good attempt! Here's the complete picture..."
        ],
        explanations: [
          "Let me break this down for you:",
          "Here's how this works:",
          "To understand this better:",
          "The key points are:"
        ],
        farewells: [
          "Keep studying hard! You've got this!",
          "Great session today. See you soon!",
          "Remember to take breaks. Good luck!",
          "You're doing amazing. Keep it up!"
        ]
      },
      specializations: [
        'General Studies',
        'Current Affairs',
        'Essay Writing',
        'Answer Writing',
        'Study Planning',
        'Time Management',
        'Motivation'
      ],
      communicationPreferences: {
        useEmojis: true,
        includeQuotes: true,
        provideSources: true,
        askFollowUps: true,
        giveExamples: true,
        useAnalogies: true,
        breakDownComplex: true,
        summarizeKey: true
      },
      behaviorSettings: {
        proactiveReminders: true,
        celebrateAchievements: true,
        trackProgress: true,
        suggestStudyPlans: true,
        adaptToPerformance: true,
        personalizeContent: true,
        maintainContext: true,
        learnFromFeedback: true
      }
    };
  }

  const personalityPresets = [
    {
      id: 'mentor',
      name: 'Supportive Mentor',
      description: 'Encouraging, patient, and comprehensive',
      traits: { formality: 6, motivation: 8, verbosity: 7, empathy: 9, humor: 5, directness: 5, encouragement: 9, technicality: 6 }
    },
    {
      id: 'coach',
      name: 'Strict Coach',
      description: 'Direct, challenging, and results-focused',
      traits: { formality: 7, motivation: 9, verbosity: 5, empathy: 4, humor: 2, directness: 9, encouragement: 6, technicality: 8 }
    },
    {
      id: 'friend',
      name: 'Study Buddy',
      description: 'Casual, friendly, and relatable',
      traits: { formality: 3, motivation: 6, verbosity: 6, empathy: 8, humor: 8, directness: 4, encouragement: 7, technicality: 5 }
    },
    {
      id: 'expert',
      name: 'Subject Expert',
      description: 'Formal, detailed, and technically precise',
      traits: { formality: 9, motivation: 5, verbosity: 9, empathy: 3, humor: 1, directness: 8, technicality: 10, encouragement: 4 }
    },
    {
      id: 'motivator',
      name: 'Motivational Speaker',
      description: 'Inspiring, energetic, and uplifting',
      traits: { formality: 5, motivation: 10, verbosity: 7, empathy: 8, humor: 7, directness: 6, encouragement: 10, technicality: 4 }
    }
  ];

  const updateTrait = (trait: keyof AIPersonality['traits'], value: number) => {
    setPersonality(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [trait]: value
      }
    }));
  };

  const updateCommunicationPref = (pref: keyof AIPersonality['communicationPreferences'], value: boolean) => {
    setPersonality(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [pref]: value
      }
    }));
  };

  const updateBehaviorSetting = (setting: keyof AIPersonality['behaviorSettings'], value: boolean) => {
    setPersonality(prev => ({
      ...prev,
      behaviorSettings: {
        ...prev.behaviorSettings,
        [setting]: value
      }
    }));
  };

  const applyPreset = (preset: typeof personalityPresets[0]) => {
    setPersonality(prev => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      traits: preset.traits
    }));
    toast.success(`Applied ${preset.name} preset`);
  };

  const savePersonality = () => {
    onSave(personality);
    toast.success('AI personality saved successfully!');
  };

  const resetToDefault = () => {
    setPersonality(getDefaultPersonality());
    toast.success('Reset to default personality');
  };

  const exportPersonality = () => {
    const dataStr = JSON.stringify(personality, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-personality-${personality.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importPersonality = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setPersonality(imported);
          toast.success('Personality imported successfully!');
        } catch (error) {
          toast.error('Failed to import personality file');
        }
      };
      reader.readAsText(file);
    }
  };

  const generatePreview = () => {
    const { traits, communicationPreferences } = personality;
    
    let preview = '';
    
    // Greeting based on formality
    if (traits.formality <= 3) {
      preview += "Hey there! 👋 ";
    } else if (traits.formality <= 6) {
      preview += "Hello! ";
    } else {
      preview += "Good day. ";
    }
    
    // Add motivation level
    if (traits.motivation >= 8) {
      preview += "Let's crush your UPSC goals today! 🚀 ";
    } else if (traits.motivation >= 6) {
      preview += "Ready to make some progress on your UPSC preparation? ";
    } else {
      preview += "What would you like to work on? ";
    }
    
    // Add encouragement if high
    if (traits.encouragement >= 7) {
      preview += "You're doing amazing work, and I'm here to support you every step of the way! ";
    }
    
    // Add technical detail based on verbosity and technicality
    if (traits.verbosity >= 7 && traits.technicality >= 7) {
      preview += "I can provide detailed explanations, comprehensive analysis, and in-depth coverage of any topic you'd like to explore. ";
    } else if (traits.verbosity <= 4) {
      preview += "I'll keep things concise and to the point. ";
    }
    
    // Add humor if applicable
    if (traits.humor >= 6) {
      preview += "And don't worry, we'll have some fun along the way! 😄";
    }
    
    setPreviewMessage(preview);
  };

  useEffect(() => {
    generatePreview();
  }, [personality.traits]);

  const getPreferenceDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      useEmojis: 'Include emojis in responses for better engagement',
      includeQuotes: 'Add inspirational quotes and sayings',
      provideSources: 'Include references and sources for information',
      askFollowUps: 'Ask follow-up questions to deepen understanding',
      giveExamples: 'Provide practical examples and case studies',
      useAnalogies: 'Use analogies to explain complex concepts',
      breakDownComplex: 'Break down complex topics into simpler parts',
      summarizeKey: 'Summarize key points at the end of responses'
    };
    return descriptions[key] || '';
  };

  const getBehaviorDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      proactiveReminders: 'Send reminders for study sessions and deadlines',
      celebrateAchievements: 'Acknowledge and celebrate your progress',
      trackProgress: 'Monitor and analyze your learning progress',
      suggestStudyPlans: 'Recommend personalized study plans',
      adaptToPerformance: 'Adjust difficulty based on your performance',
      personalizeContent: 'Customize content based on your preferences',
      maintainContext: 'Remember previous conversations and context',
      learnFromFeedback: 'Improve responses based on your feedback'
    };
    return descriptions[key] || '';
  };

  const TraitSlider = ({ 
    label, 
    trait, 
    lowLabel, 
    highLabel, 
    icon: Icon 
  }: { 
    label: string; 
    trait: keyof AIPersonality['traits']; 
    lowLabel: string; 
    highLabel: string; 
    icon: React.ComponentType<any>;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{personality.traits[trait]}/10</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-xs text-gray-400 w-16">{lowLabel}</span>
        <input
          type="range"
          min="1"
          max="10"
          value={personality.traits[trait]}
          onChange={(e) => updateTrait(trait, parseInt(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <span className="text-xs text-gray-400 w-16 text-right">{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Personality Configuration</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize how your AI assistant behaves, communicates, and helps you with UPSC preparation.
        </p>
      </div>

      {/* Personality Presets */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {personalityPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white">{preset.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Personality Name
          </label>
          <input
            type="text"
            value={personality.name}
            onChange={(e) => setPersonality(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={personality.description}
            onChange={(e) => setPersonality(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'traits', label: 'Personality Traits', icon: Brain },
            { id: 'style', label: 'Communication Style', icon: MessageCircle },
            { id: 'behavior', label: 'Behavior Settings', icon: Settings },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'traits' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TraitSlider
              label="Formality Level"
              trait="formality"
              lowLabel="Casual"
              highLabel="Formal"
              icon={Smile}
            />
            <TraitSlider
              label="Motivation Intensity"
              trait="motivation"
              lowLabel="Gentle"
              highLabel="Intense"
              icon={Flame}
            />
            <TraitSlider
              label="Response Length"
              trait="verbosity"
              lowLabel="Concise"
              highLabel="Detailed"
              icon={MessageCircle}
            />
            <TraitSlider
              label="Empathy Level"
              trait="empathy"
              lowLabel="Analytical"
              highLabel="Emotional"
              icon={Heart}
            />
            <TraitSlider
              label="Humor Usage"
              trait="humor"
              lowLabel="Serious"
              highLabel="Humorous"
              icon={Coffee}
            />
            <TraitSlider
              label="Directness"
              trait="directness"
              lowLabel="Diplomatic"
              highLabel="Blunt"
              icon={Target}
            />
            <TraitSlider
              label="Encouragement"
              trait="encouragement"
              lowLabel="Neutral"
              highLabel="Highly Encouraging"
              icon={Trophy}
            />
            <TraitSlider
              label="Technical Detail"
              trait="technicality"
              lowLabel="Simple"
              highLabel="Technical"
              icon={Brain}
            />
          </div>
        </div>
      )}

      {activeTab === 'style' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Communication Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(personality.communicationPreferences).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateCommunicationPref(key as any, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getPreferenceDescription(key)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Templates</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Greeting Message
                </label>
                <textarea
                  value={personality.responseStyle.greeting}
                  onChange={(e) => setPersonality(prev => ({
                    ...prev,
                    responseStyle: { ...prev.responseStyle, greeting: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'behavior' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Behavior Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(personality.behaviorSettings).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateBehaviorSetting(key as any, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getBehaviorDescription(key)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {personality.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personality Preview</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{personality.name}</div>
                  <div className="text-gray-700 dark:text-gray-300">{previewMessage}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personality Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(personality.traits).map(([trait, value]) => (
                <div key={trait} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {trait.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {value}/10
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={resetToDefault}
            className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button
            onClick={exportPersonality}
            className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <label className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importPersonality}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={savePersonality}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Personality
        </button>
      </div>
    </div>
  );
}
