import { AIAction } from './AIContextService';

export interface ParsedCommand {
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  actions: AIAction[];
}

export interface CommandPattern {
  pattern: RegExp;
  intent: string;
  actionType: string;
  extractEntities: (match: RegExpMatchArray) => Record<string, any>;
  confidence?: number;
  category?: string;
  requiresConfirmation?: boolean;
}

interface NLPEntity {
  type: 'page' | 'action' | 'subject' | 'time' | 'number' | 'filter' | 'data' | 'location' | 'word' | 'topic';
  value: string;
  confidence: number;
  position: [number, number];
}

class AICommandParser {
  private static instance: AICommandParser;
  private commandPatterns: CommandPattern[] = [];

  private constructor() {
    this.initializePatterns();
  }

  static getInstance(): AICommandParser {
    if (!AICommandParser.instance) {
      AICommandParser.instance = new AICommandParser();
    }
    return AICommandParser.instance;
  }

  private initializePatterns() {
    this.commandPatterns = [
      // Enhanced Navigation patterns with comprehensive command recognition
      {
        pattern: /(?:go to|open|navigate to|show me|take me to|visit|display|load|switch to)\s+(dashboard|home|main|syllabus|schedule|calendar|analytics|revision|current affairs|knowledge base|bookmarks|practice|wellness|quick links|ai assistant|dictionary|maps|learning|profile|settings)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: (match) => {
          let page = match[1].toLowerCase().replace(/\s+/g, '-');
          // Handle special cases
          if (page === 'home' || page === 'main') page = '';
          if (page === 'ai-assistant') page = 'ai-assistant';
          if (page === 'current-affairs') page = 'current-affairs';
          if (page === 'knowledge-base') page = 'knowledge-base';
          if (page === 'quick-links') page = 'quick-links';
          return { page: `/${page}` };
        },
        confidence: 0.95,
        category: 'navigation'
      },

      // Calendar-specific navigation patterns
      {
        pattern: /(?:open|show|go to|navigate to|take me to)\s+(?:my\s+)?(?:calendar|schedule|timetable|planner)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: () => ({ page: '/schedule' }),
        confidence: 0.95,
        category: 'navigation'
      },

      // Study materials navigation
      {
        pattern: /(?:open|show|go to|navigate to|take me to)\s+(?:study\s+)?(?:materials|notes|knowledge|resources|learning)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: () => ({ page: '/knowledge-base' }),
        confidence: 0.9,
        category: 'navigation'
      },

      // Progress tracking navigation
      {
        pattern: /(?:open|show|go to|navigate to|take me to)\s+(?:progress|analytics|performance|stats|tracking)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: () => ({ page: '/analytics' }),
        confidence: 0.9,
        category: 'navigation'
      },

      // Mock tests navigation
      {
        pattern: /(?:open|show|go to|navigate to|take me to)\s+(?:mock\s+)?(?:tests|practice|quiz|questions|exam)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: () => ({ page: '/practice' }),
        confidence: 0.9,
        category: 'navigation'
      },

      // News and current affairs navigation
      {
        pattern: /(?:open|show|go to|navigate to|take me to)\s+(?:news|current\s+affairs|articles|updates)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: () => ({ page: '/current-affairs' }),
        confidence: 0.9,
        category: 'navigation'
      },

      // Alternative navigation patterns with different verbs
      {
        pattern: /(?:I want to|I need to|can you|please)\s+(?:go to|open|see|view|check)\s+(dashboard|home|syllabus|schedule|calendar|analytics|revision|current affairs|knowledge base|bookmarks|practice|wellness|ai assistant|dictionary|maps|learning)/i,
        intent: 'navigate',
        actionType: 'navigate_to_page',
        extractEntities: (match) => {
          let page = match[2].toLowerCase().replace(/\s+/g, '-');
          if (page === 'home') page = '';
          return { page: `/${page}` };
        },
        confidence: 0.85,
        category: 'navigation'
      },

      // Dictionary-specific patterns
      {
        pattern: /(?:search|find|look up|define)\s+(?:word|term)?\s*["\']?([^"']+)["\']?\s*(?:in dictionary)?/i,
        intent: 'search_dictionary',
        actionType: 'search_word',
        extractEntities: (match) => ({
          word: match[1].trim(),
          page: '/dictionary'
        }),
        confidence: 0.95,
        category: 'content'
      },

      {
        pattern: /(?:add|save)\s+["\']?([^"']+)["\']?\s+(?:to\s+)?(?:favorites|favourites)/i,
        intent: 'add_favorite',
        actionType: 'add_favorite',
        extractEntities: (match) => ({
          word: match[1].trim(),
          type: 'word'
        }),
        confidence: 0.9,
        category: 'content'
      },

      // Maps-specific patterns
      {
        pattern: /(?:show|find|locate|search)\s+(?:me\s+)?(?:location|place|city|state|country)?\s*["\']?([^"']+)["\']?\s*(?:on map)?/i,
        intent: 'search_location',
        actionType: 'search_location',
        extractEntities: (match) => ({
          location: match[1].trim(),
          page: '/maps'
        }),
        confidence: 0.85,
        category: 'content'
      },

      {
        pattern: /(?:zoom to|focus on)\s+([^,]+)(?:,\s*([^,]+))?/i,
        intent: 'zoom_location',
        actionType: 'zoom_to_region',
        extractEntities: (match) => ({
          region: match[1].trim(),
          country: match[2]?.trim() || 'India'
        }),
        confidence: 0.8,
        category: 'ui_control'
      },

      // Enhanced Practice session patterns
      {
        pattern: /(?:start|begin|initiate)\s+(?:a\s+)?(?:practice|test|quiz|mock test)\s*(?:session)?\s*(?:on|for|about)?\s*(.*)?/i,
        intent: 'start_practice',
        actionType: 'start_practice_session',
        extractEntities: (match) => ({
          type: 'daily',
          subject: match[1]?.trim() || null,
          page: '/practice'
        }),
        confidence: 0.9,
        category: 'practice'
      },

      // Calendar/Schedule patterns
      {
        pattern: /(?:create|add|schedule)\s+(?:an?\s+)?(?:event|appointment|meeting|study session)\s+["\']?([^"']+)["\']?\s*(?:on|for|at)?\s*([^,]*)?/i,
        intent: 'create_event',
        actionType: 'create_event',
        extractEntities: (match) => ({
          title: match[1].trim(),
          date: match[2]?.trim() || 'today',
          page: '/schedule'
        }),
        confidence: 0.9,
        category: 'scheduling'
      },

      {
        pattern: /(?:set|create)\s+(?:a\s+)?reminder\s+(?:to\s+)?["\']?([^"']+)["\']?\s*(?:at|for)?\s*([^,]*)?/i,
        intent: 'set_reminder',
        actionType: 'set_reminder',
        extractEntities: (match) => ({
          message: match[1].trim(),
          time: match[2]?.trim() || 'in 1 hour'
        }),
        confidence: 0.85,
        category: 'scheduling'
      },

      // Syllabus patterns
      {
        pattern: /(?:mark|set)\s+["\']?([^"']+)["\']?\s+(?:as\s+)?(?:complete|completed|done|finished)/i,
        intent: 'mark_complete',
        actionType: 'mark_complete',
        extractEntities: (match) => ({
          topic: match[1].trim(),
          status: 'completed',
          page: '/syllabus'
        }),
        confidence: 0.9,
        category: 'study'
      },

      {
        pattern: /(?:create|generate|make)\s+(?:a\s+)?study plan\s*(?:for)?\s*([^,]*)?/i,
        intent: 'create_study_plan',
        actionType: 'create_study_plan',
        extractEntities: (match) => ({
          subject: match[1]?.trim() || 'General Studies',
          duration: 30
        }),
        confidence: 0.85,
        category: 'study'
      },

      // Analytics patterns
      {
        pattern: /(?:show|display|view)\s+(?:my\s+)?(?:progress|performance|analytics|stats|statistics|reports?)/i,
        intent: 'view_analytics',
        actionType: 'view_reports',
        extractEntities: (match) => ({
          type: 'overview',
          page: '/analytics'
        }),
        confidence: 0.9,
        category: 'analysis'
      },

      {
        pattern: /(?:analyze|check)\s+(?:my\s+)?(?:weak|strong)\s+(?:areas|subjects|topics)/i,
        intent: 'analyze_performance',
        actionType: 'analyze_performance',
        extractEntities: (match) => ({
          type: match[0].includes('weak') ? 'weaknesses' : 'strengths',
          page: '/analytics'
        }),
        confidence: 0.85,
        category: 'analysis'
      },

      // Current Affairs patterns
      {
        pattern: /(?:show|find|search)\s+(?:latest\s+)?(?:news|current affairs|articles)\s*(?:about|on)?\s*([^,]*)?/i,
        intent: 'search_news',
        actionType: 'search_content',
        extractEntities: (match) => ({
          query: match[1]?.trim() || 'latest',
          type: 'news',
          page: '/current-affairs'
        }),
        confidence: 0.85,
        category: 'content'
      },

      {
        pattern: /(?:bookmark|save)\s+(?:this\s+)?(?:article|news|content)/i,
        intent: 'bookmark_content',
        actionType: 'bookmark_article',
        extractEntities: (match) => ({
          type: 'article'
        }),
        confidence: 0.9,
        category: 'content'
      },

      // Knowledge Base patterns
      {
        pattern: /(?:create|add|write)\s+(?:a\s+)?(?:note|notes)\s*(?:about|on)?\s*["\']?([^"']*)["\']?/i,
        intent: 'create_note',
        actionType: 'create_note',
        extractEntities: (match) => ({
          title: match[1]?.trim() || 'New Note',
          page: '/knowledge-base'
        }),
        confidence: 0.9,
        category: 'content'
      },

      {
        pattern: /(?:search|find)\s+(?:in\s+)?(?:notes|knowledge base)\s*(?:for)?\s*["\']?([^"']+)["\']?/i,
        intent: 'search_notes',
        actionType: 'search_content',
        extractEntities: (match) => ({
          query: match[1].trim(),
          type: 'notes',
          page: '/knowledge-base'
        }),
        confidence: 0.85,
        category: 'content'
      },

      // Revision patterns
      {
        pattern: /(?:start|begin)\s+(?:a\s+)?revision\s*(?:session)?\s*(?:for|on)?\s*([^,]*)?/i,
        intent: 'start_revision',
        actionType: 'start_revision',
        extractEntities: (match) => ({
          subject: match[1]?.trim() || 'all',
          page: '/revision'
        }),
        confidence: 0.9,
        category: 'study'
      },

      // Wellness patterns
      {
        pattern: /(?:track|log|record)\s+(?:my\s+)?(?:mood|exercise|sleep|habits?)/i,
        intent: 'track_wellness',
        actionType: 'track_habits',
        extractEntities: (match) => ({
          type: match[0].includes('mood') ? 'mood' :
                match[0].includes('exercise') ? 'exercise' :
                match[0].includes('sleep') ? 'sleep' : 'habit',
          page: '/wellness'
        }),
        confidence: 0.8,
        category: 'wellness'
      },

      // Advanced UI Control patterns
      {
        pattern: /(?:filter|show only|display)\s+([^,]+)\s*(?:by|with)?\s*([^,]*)?/i,
        intent: 'filter_content',
        actionType: 'filter_content',
        extractEntities: (match) => ({
          content: match[1].trim(),
          criteria: match[2]?.trim() || 'default'
        }),
        confidence: 0.7,
        category: 'ui_control'
      },

      {
        pattern: /(?:export|download)\s+(?:my\s+)?([^,]+)\s*(?:as|to)?\s*(pdf|csv|json)?/i,
        intent: 'export_data',
        actionType: 'export_data',
        extractEntities: (match) => ({
          dataType: match[1].trim(),
          format: match[2]?.trim() || 'pdf'
        }),
        confidence: 0.8,
        category: 'data_manipulation'
      },

      // Smart automation patterns
      {
        pattern: /(?:automatically|auto)\s+([^,]+)/i,
        intent: 'automate_task',
        actionType: 'automation',
        extractEntities: (match) => ({
          task: match[1].trim(),
          type: 'automation'
        }),
        confidence: 0.6,
        category: 'automation'
      },

      // External API patterns
      {
        pattern: /(?:what's|what is|show|get|check)\s+(?:the\s+)?weather\s*(?:in|for)?\s*([^?]+)?/i,
        intent: 'get_weather',
        actionType: 'get_weather',
        extractEntities: (match) => ({
          location: match[1]?.trim() || 'Delhi'
        }),
        confidence: 0.9,
        category: 'external_api'
      },

      {
        pattern: /(?:show|get|fetch|latest)\s+(?:current\s+)?news\s*(?:about|on)?\s*([^?]+)?/i,
        intent: 'get_news',
        actionType: 'get_news',
        extractEntities: (match) => ({
          category: match[1]?.trim() || 'general'
        }),
        confidence: 0.9,
        category: 'external_api'
      },

      {
        pattern: /(?:give|show|get)\s+(?:me\s+)?(?:a\s+)?(?:motivational\s+)?quote/i,
        intent: 'get_quote',
        actionType: 'get_quote',
        extractEntities: () => ({}),
        confidence: 0.8,
        category: 'external_api'
      },

      {
        pattern: /(?:tell|give|show)\s+(?:me\s+)?(?:a\s+)?(?:random\s+)?(?:interesting\s+)?fact/i,
        intent: 'get_fact',
        actionType: 'get_fact',
        extractEntities: () => ({}),
        confidence: 0.8,
        category: 'external_api'
      },

      {
        pattern: /(?:show|get|check)\s+(?:exchange\s+)?rates?\s*(?:for)?\s*([A-Z]{3})?/i,
        intent: 'get_exchange_rates',
        actionType: 'get_exchange_rates',
        extractEntities: (match) => ({
          baseCurrency: match[1]?.trim() || 'USD'
        }),
        confidence: 0.8,
        category: 'external_api'
      },

      {
        pattern: /(?:clear|refresh|reset)\s+(?:api\s+)?cache/i,
        intent: 'clear_api_cache',
        actionType: 'clear_api_cache',
        extractEntities: () => ({}),
        confidence: 0.9,
        category: 'external_api'
      },

      // Real-time UI Control patterns
      {
        pattern: /(?:search|find|look for)\s+["\']?([^"']+)["\']?\s*(?:in|on)?\s*(?:the\s+)?(?:dashboard|page)?/i,
        intent: 'search_ui',
        actionType: 'manipulate_ui_element',
        extractEntities: (match) => ({
          elementId: 'dashboard-search',
          action: 'search',
          value: match[1].trim()
        }),
        confidence: 0.85,
        category: 'ui_control'
      },

      {
        pattern: /(?:toggle|switch|change)\s+(?:the\s+)?theme/i,
        intent: 'toggle_theme',
        actionType: 'manipulate_ui_element',
        extractEntities: () => ({
          elementId: 'theme-toggle',
          action: 'toggle'
        }),
        confidence: 0.9,
        category: 'ui_control'
      },

      {
        pattern: /(?:filter|show only|display only)\s+(?:by\s+)?([^,]+)/i,
        intent: 'apply_filter',
        actionType: 'apply_filter',
        extractEntities: (match) => ({
          target: 'content',
          field: 'category',
          value: match[1].trim(),
          operator: 'contains'
        }),
        confidence: 0.8,
        category: 'ui_control'
      },

      {
        pattern: /(?:click|press|tap)\s+(?:on\s+)?(?:the\s+)?([^,]+)(?:\s+button)?/i,
        intent: 'click_element',
        actionType: 'trigger_ui_action',
        extractEntities: (match) => ({
          selector: `button:contains("${match[1].trim()}")`,
          action: 'click'
        }),
        confidence: 0.75,
        category: 'ui_control'
      },

      {
        pattern: /(?:clear|empty|reset)\s+(?:the\s+)?(?:search|input|form)/i,
        intent: 'clear_input',
        actionType: 'manipulate_ui_element',
        extractEntities: () => ({
          elementId: 'dashboard-search',
          action: 'clear'
        }),
        confidence: 0.85,
        category: 'ui_control'
      },

      {
        pattern: /(?:focus|go to|select)\s+(?:the\s+)?([^,]+)(?:\s+(?:field|input|dropdown))?/i,
        intent: 'focus_element',
        actionType: 'manipulate_ui_element',
        extractEntities: (match) => {
          const element = match[1].trim().toLowerCase();
          let elementId = 'dashboard-search';

          if (element.includes('subject')) elementId = 'practice-subject-filter';
          else if (element.includes('word') || element.includes('dictionary')) elementId = 'word-search-input';
          else if (element.includes('map') || element.includes('location')) elementId = 'map-search';
          else if (element.includes('date')) elementId = 'analytics-date-range';

          return {
            elementId,
            action: 'focus'
          };
        },
        confidence: 0.8,
        category: 'ui_control'
      },

      {
        pattern: /(?:fill|complete|populate)\s+(?:the\s+)?form\s+with\s+(.+)/i,
        intent: 'fill_form',
        actionType: 'control_form',
        extractEntities: (match) => {
          // Parse form data from natural language
          const dataString = match[1].trim();
          const data: Record<string, string> = {};

          // Simple parsing for key-value pairs
          const pairs = dataString.split(/,|\sand\s/);
          pairs.forEach(pair => {
            const [key, value] = pair.split(/:\s*|\s+is\s+|\s+equals?\s+/);
            if (key && value) {
              data[key.trim()] = value.trim();
            }
          });

          return {
            formId: 'main-form',
            action: 'fill',
            data
          };
        },
        confidence: 0.7,
        category: 'ui_control'
      },

      {
        pattern: /(?:submit|send)\s+(?:the\s+)?form/i,
        intent: 'submit_form',
        actionType: 'control_form',
        extractEntities: () => ({
          formId: 'main-form',
          action: 'submit'
        }),
        confidence: 0.9,
        category: 'ui_control'
      },

      {
        pattern: /(?:show|display|highlight)\s+(?:the\s+)?([^,]+)/i,
        intent: 'show_element',
        actionType: 'trigger_ui_action',
        extractEntities: (match) => ({
          selector: `[data-element="${match[1].trim()}"]`,
          action: 'highlight'
        }),
        confidence: 0.7,
        category: 'ui_control'
      },

      {
        pattern: /(?:hide|close|dismiss)\s+(?:the\s+)?([^,]+)/i,
        intent: 'hide_element',
        actionType: 'trigger_ui_action',
        extractEntities: (match) => ({
          selector: `[data-element="${match[1].trim()}"]`,
          action: 'hide'
        }),
        confidence: 0.8,
        category: 'ui_control'
      }
    ];
  }

  // Enhanced NLP entity extraction
  private extractNLPEntities(input: string): NLPEntity[] {
    const entities: NLPEntity[] = [];

    // Page entities
    const pageMatches = input.match(/\b(dashboard|syllabus|schedule|analytics|revision|current affairs|knowledge base|bookmarks|practice|wellness|dictionary|maps|learning)\b/gi);
    if (pageMatches) {
      pageMatches.forEach(match => {
        const index = input.toLowerCase().indexOf(match.toLowerCase());
        entities.push({
          type: 'page',
          value: match.toLowerCase(),
          confidence: 0.9,
          position: [index, index + match.length]
        });
      });
    }

    // Action entities
    const actionMatches = input.match(/\b(search|find|create|add|start|begin|show|display|analyze|bookmark|save|export|filter)\b/gi);
    if (actionMatches) {
      actionMatches.forEach(match => {
        const index = input.toLowerCase().indexOf(match.toLowerCase());
        entities.push({
          type: 'action',
          value: match.toLowerCase(),
          confidence: 0.8,
          position: [index, index + match.length]
        });
      });
    }

    // Subject entities
    const subjectMatches = input.match(/\b(history|geography|polity|economics|environment|science|technology|ethics|essay|csat|mathematics)\b/gi);
    if (subjectMatches) {
      subjectMatches.forEach(match => {
        const index = input.toLowerCase().indexOf(match.toLowerCase());
        entities.push({
          type: 'subject',
          value: match.toLowerCase(),
          confidence: 0.85,
          position: [index, index + match.length]
        });
      });
    }

    // Time entities
    const timeMatches = input.match(/\b(today|tomorrow|yesterday|morning|afternoon|evening|night|\d+\s*(?:am|pm|hours?|minutes?|days?|weeks?))\b/gi);
    if (timeMatches) {
      timeMatches.forEach(match => {
        const index = input.toLowerCase().indexOf(match.toLowerCase());
        entities.push({
          type: 'time',
          value: match.toLowerCase(),
          confidence: 0.7,
          position: [index, index + match.length]
        });
      });
    }

    return entities;
  }

  // Enhanced command parsing with NLP
  async parseCommand(input: string): Promise<ParsedCommand> {
    const normalizedInput = input.trim().toLowerCase();
    const nlpEntities = this.extractNLPEntities(input);

    // Try pattern matching first
    for (const pattern of this.commandPatterns) {
      const match = normalizedInput.match(pattern.pattern);
      if (match) {
        const entities = pattern.extractEntities(match);
        const confidence = this.calculateConfidence(match, pattern);

        return {
          intent: pattern.intent,
          entities,
          confidence,
          actions: this.generateActionsFromIntent(pattern.intent, entities)
        };
      }
    }

    // Fallback to NLP-based parsing
    return this.parseWithNLP(input, nlpEntities);
  }

  // NLP-based parsing for complex queries
  private parseWithNLP(input: string, entities: NLPEntity[]): ParsedCommand {
    const intent = this.inferIntent(input, entities);
    const extractedEntities = this.extractEntitiesFromNLP(entities);

    return {
      intent,
      entities: extractedEntities,
      confidence: 0.6, // Lower confidence for NLP parsing
      actions: this.generateActionsFromIntent(intent, extractedEntities)
    };
  }

  private inferIntent(input: string, entities: NLPEntity[]): string {
    const actionEntities = entities.filter(e => e.type === 'action');
    const pageEntities = entities.filter(e => e.type === 'page');

    if (actionEntities.length > 0) {
      const action = actionEntities[0].value;

      if (['search', 'find'].includes(action)) {
        return pageEntities.length > 0 ? `search_${pageEntities[0].value}` : 'search_content';
      }
      if (['create', 'add'].includes(action)) {
        return pageEntities.length > 0 ? `create_${pageEntities[0].value}` : 'create_content';
      }
      if (['start', 'begin'].includes(action)) {
        return 'start_session';
      }
      if (['show', 'display', 'view'].includes(action)) {
        return pageEntities.length > 0 ? `view_${pageEntities[0].value}` : 'view_content';
      }
    }

    if (pageEntities.length > 0) {
      return 'navigate';
    }

    return 'general_query';
  }

  private extractEntitiesFromNLP(nlpEntities: NLPEntity[]): Record<string, any> {
    const entities: Record<string, any> = {};

    nlpEntities.forEach(entity => {
      if (!entities[entity.type]) {
        entities[entity.type] = [];
      }
      entities[entity.type].push(entity.value);
    });

    // Convert arrays to single values where appropriate
    Object.keys(entities).forEach(key => {
      if (entities[key].length === 1) {
        entities[key] = entities[key][0];
      }
    });

    return entities;
  }

  private generateActionsFromIntent(intent: string, entities: Record<string, any>): AIAction[] {
    const actions: AIAction[] = [];

    switch (intent) {
      case 'navigate':
        if (entities.page) {
          actions.push({
            type: 'navigate_to_page',
            payload: { page: entities.page },
            description: `Navigate to ${entities.page}`
          });
        }
        break;

      case 'search_content':
        actions.push({
          type: 'search_content',
          payload: { query: entities.query || entities.word || entities.location },
          description: `Search for content`
        });
        break;

      case 'start_practice':
        actions.push({
          type: 'start_practice_session',
          payload: { type: entities.type || 'daily', subject: entities.subject },
          description: `Start practice session`
        });
        break;

      case 'create_note':
        actions.push({
          type: 'create_note',
          payload: { title: entities.title, content: entities.content || '' },
          description: `Create new note`
        });
        break;

      default:
        actions.push({
          type: 'show_help',
          payload: { query: entities },
          description: `Show help for: ${intent}`
        });
    }

    return actions;
  }

  private calculateConfidence(match: RegExpMatchArray, pattern: CommandPattern): number {
    // Simple confidence calculation based on match quality
    const matchLength = match[0].length;
    const inputLength = match.input?.length || 1;
    const coverage = matchLength / inputLength;

    // Use pattern-specific confidence if available
    const baseConfidence = pattern.confidence || 0.7;

    // Adjust based on match coverage
    const adjustedConfidence = baseConfidence * (0.5 + coverage * 0.5);

    return Math.round(adjustedConfidence * 100) / 100;
  }



  private parseDate(dateString: string): string {
    const now = new Date();
    const lowerDate = dateString.toLowerCase().trim();
    
    if (lowerDate.includes('today')) {
      return now.toISOString();
    } else if (lowerDate.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    } else if (lowerDate.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString();
    } else {
      // Try to parse as a regular date
      try {
        const parsed = new Date(dateString);
        return isNaN(parsed.getTime()) ? now.toISOString() : parsed.toISOString();
      } catch {
        return now.toISOString();
      }
    }
  }

  // Get suggestions based on current context
  generateContextualSuggestions(currentPage: string, userActivity: any): string[] {
    const suggestions: string[] = [];
    
    switch (currentPage) {
      case '/':
        suggestions.push(
          'Show my study progress',
          'Start a practice session',
          'What should I study today?',
          'Analyze my performance'
        );
        break;
      case '/practice':
        suggestions.push(
          'Start daily practice',
          'Take a mock test',
          'Practice previous year questions',
          'Analyze my weak areas'
        );
        break;
      case '/current-affairs':
        suggestions.push(
          'Analyze today\'s news',
          'Find news about economy',
          'Connect news to syllabus',
          'Bookmark important articles'
        );
        break;
      case '/revision':
        suggestions.push(
          'Start revision session',
          'Show due revisions',
          'Create revision plan',
          'Optimize revision schedule'
        );
        break;
      case '/knowledge-base':
        suggestions.push(
          'Create a new note',
          'Search my notes',
          'Organize notes by subject',
          'Export notes to PDF'
        );
        break;
      default:
        suggestions.push(
          'What can you help me with?',
          'Show my overall progress',
          'Create a study plan',
          'Go to practice arena'
        );
    }
    
    return suggestions;
  }

  // Extract intent and entities for complex queries
  extractComplexIntent(input: string): { intent: string; entities: Record<string, any> } {
    const subjects = ['history', 'geography', 'polity', 'economy', 'environment', 'science', 'ethics'];
    const timeframes = ['today', 'tomorrow', 'this week', 'next week', 'this month'];
    const difficulties = ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'];
    
    const entities: Record<string, any> = {};
    
    // Extract subjects
    const foundSubject = subjects.find(subject => 
      input.toLowerCase().includes(subject)
    );
    if (foundSubject) entities.subject = foundSubject;
    
    // Extract timeframes
    const foundTimeframe = timeframes.find(timeframe => 
      input.toLowerCase().includes(timeframe)
    );
    if (foundTimeframe) entities.timeframe = foundTimeframe;
    
    // Extract difficulties
    const foundDifficulty = difficulties.find(difficulty => 
      input.toLowerCase().includes(difficulty)
    );
    if (foundDifficulty) entities.difficulty = foundDifficulty;
    
    // Extract numbers
    const numberMatch = input.match(/\b(\d+)\b/);
    if (numberMatch) entities.number = parseInt(numberMatch[1]);
    
    return {
      intent: this.classifyIntent(input),
      entities
    };
  }

  private classifyIntent(input: string): string {
    const intentKeywords = {
      practice: ['practice', 'test', 'quiz', 'questions', 'mock'],
      study: ['study', 'learn', 'read', 'prepare'],
      revision: ['revision', 'review', 'revise', 'repeat'],
      analysis: ['analyze', 'performance', 'progress', 'stats'],
      planning: ['plan', 'schedule', 'organize', 'create'],
      search: ['search', 'find', 'look', 'show'],
      navigation: ['go', 'open', 'navigate', 'visit']
    };
    
    const lowerInput = input.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }

  addCustomPattern(pattern: CommandPattern): void {
    // Add a custom command pattern to the parser
    this.commandPatterns.push(pattern);
  }
}

export default AICommandParser;
