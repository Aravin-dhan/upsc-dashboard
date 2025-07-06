export interface MapLocation {
  id: string;
  name: string;
  type: 'state' | 'capital' | 'river' | 'mountain' | 'national_park' | 'historical_site' | 'economic_zone' | 'port' | 'desert' | 'plateau';
  coordinates: [number, number]; // [latitude, longitude]
  description: string;
  upscRelevance: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
  examFrequency?: number;
  relatedTopics?: string[];
  keyFacts?: string[];
  examQuestions?: {
    year: number;
    question: string;
    type: 'prelims' | 'mains';
  }[];
}

// Comprehensive UPSC-relevant locations for India
export const indiaLocations: MapLocation[] = [
  // State Capitals (High Priority)
  {
    id: 'new-delhi',
    name: 'New Delhi',
    type: 'capital',
    coordinates: [28.6139, 77.2090],
    description: 'Capital of India, seat of government and administration',
    upscRelevance: 'Administrative center, political geography, governance',
    importance: 'high',
    category: 'Political Geography',
    examFrequency: 95,
    relatedTopics: ['Indian Polity', 'Administrative Geography', 'Governance'],
    keyFacts: [
      'National Capital Territory',
      'Seat of Parliament and Supreme Court',
      'Administrative headquarters of India'
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    type: 'capital',
    coordinates: [19.0760, 72.8777],
    description: 'Financial capital of India, major port city',
    upscRelevance: 'Economic geography, financial centers, urbanization',
    importance: 'high',
    category: 'Economic Geography',
    examFrequency: 88,
    relatedTopics: ['Economic Geography', 'Urbanization', 'Financial Centers', 'Port Cities'],
    keyFacts: [
      'Financial capital of India',
      'Largest city by population',
      'Major port and commercial center'
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    type: 'capital',
    coordinates: [22.5726, 88.3639],
    description: 'Cultural capital, major port on Hooghly River',
    upscRelevance: 'Cultural geography, colonial history, river transport',
    importance: 'high',
    category: 'Cultural Geography',
    examFrequency: 82,
    relatedTopics: ['Cultural Geography', 'Colonial History', 'River Transport'],
    keyFacts: [
      'Former capital of British India',
      'Cultural capital of India',
      'Major port on Hooghly River'
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    type: 'capital',
    coordinates: [13.0827, 80.2707],
    description: 'Major port city, automobile hub of India',
    upscRelevance: 'Industrial geography, automobile industry, port development',
    importance: 'high',
    category: 'Economic Geography',
    examFrequency: 85,
    relatedTopics: ['Industrial Geography', 'Automobile Industry', 'Port Development'],
    keyFacts: [
      'Detroit of India',
      'Major automobile manufacturing hub',
      'Important port city'
    ]
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    type: 'capital',
    coordinates: [12.9716, 77.5946],
    description: 'Silicon Valley of India, IT capital',
    upscRelevance: 'IT industry, knowledge economy, urban development',
    importance: 'high',
    category: 'Economic Geography',
    examFrequency: 80,
    relatedTopics: ['IT Industry', 'Knowledge Economy', 'Urban Development'],
    keyFacts: [
      'Silicon Valley of India',
      'IT capital of India',
      'Garden city'
    ]
  },

  // Major Rivers (High Priority)
  {
    id: 'ganga',
    name: 'River Ganga',
    type: 'river',
    coordinates: [25.3176, 82.9739],
    description: 'Sacred river and lifeline of northern India',
    upscRelevance: 'River systems, water management, cultural significance, pollution',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 92,
    relatedTopics: ['River Systems', 'Water Management', 'Cultural Geography', 'Environmental Issues'],
    keyFacts: [
      'Longest river in India (2,525 km)',
      'Sacred river in Hinduism',
      'Major source of irrigation and drinking water',
      'Namami Gange project for cleaning'
    ]
  },
  {
    id: 'brahmaputra',
    name: 'River Brahmaputra',
    type: 'river',
    coordinates: [26.2006, 92.9376],
    description: 'Major river of northeastern India, trans-boundary river',
    upscRelevance: 'Trans-boundary rivers, flood management, hydroelectric power',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 88,
    relatedTopics: ['Trans-boundary Rivers', 'Flood Management', 'Hydroelectric Power', 'International Relations'],
    keyFacts: [
      'Trans-boundary river (China-India-Bangladesh)',
      'Major cause of floods in Assam',
      'Significant hydroelectric potential'
    ]
  },
  {
    id: 'narmada',
    name: 'River Narmada',
    type: 'river',
    coordinates: [22.7196, 76.1300],
    description: 'Westward flowing river, major irrigation projects',
    upscRelevance: 'River linking, irrigation projects, tribal displacement',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 85,
    relatedTopics: ['River Linking', 'Irrigation Projects', 'Tribal Issues', 'Environmental Concerns'],
    keyFacts: [
      'Largest westward flowing river',
      'Sardar Sarovar Dam',
      'Narmada Valley Project'
    ]
  },

  // Mountain Ranges (High Priority)
  {
    id: 'himalayas',
    name: 'Himalayas',
    type: 'mountain',
    coordinates: [28.0000, 84.0000],
    description: 'World\'s highest mountain range, northern boundary of India',
    upscRelevance: 'Physical geography, climate, strategic importance, glaciers',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 90,
    relatedTopics: ['Mountain Systems', 'Climate', 'Strategic Geography', 'Glaciology'],
    keyFacts: [
      'World\'s highest mountain range',
      'Length: ~2,400 km',
      'Contains Mount Everest (8,848m)',
      'Source of major rivers',
      'Climate barrier'
    ]
  },
  {
    id: 'western-ghats',
    name: 'Western Ghats',
    type: 'mountain',
    coordinates: [15.0000, 74.0000],
    description: 'Biodiversity hotspot, UNESCO World Heritage Site',
    upscRelevance: 'Biodiversity conservation, monsoon patterns, endemic species',
    importance: 'high',
    category: 'Environmental Geography',
    examFrequency: 85,
    relatedTopics: ['Biodiversity', 'Conservation', 'Monsoon', 'Endemic Species'],
    keyFacts: [
      'UNESCO World Heritage Site',
      'Biodiversity hotspot',
      'Influences monsoon patterns',
      'High endemism'
    ]
  },
  {
    id: 'eastern-ghats',
    name: 'Eastern Ghats',
    type: 'mountain',
    coordinates: [14.0000, 79.0000],
    description: 'Discontinuous mountain range along eastern coast',
    upscRelevance: 'Mineral resources, tribal populations, bauxite mining',
    importance: 'medium',
    category: 'Physical Geography',
    examFrequency: 70,
    relatedTopics: ['Mineral Resources', 'Tribal Geography', 'Mining'],
    keyFacts: [
      'Discontinuous mountain range',
      'Rich in mineral resources',
      'Bauxite deposits',
      'Tribal populations'
    ]
  },

  // National Parks and Wildlife Sanctuaries
  {
    id: 'sundarbans',
    name: 'Sundarbans National Park',
    type: 'national_park',
    coordinates: [21.9497, 89.1833],
    description: 'Largest mangrove forest, Royal Bengal Tiger habitat',
    upscRelevance: 'Mangrove ecosystems, tiger conservation, climate change impact',
    importance: 'high',
    category: 'Environmental Geography',
    examFrequency: 78,
    relatedTopics: ['Mangroves', 'Tiger Conservation', 'Climate Change', 'Coastal Ecology'],
    keyFacts: [
      'Largest mangrove forest in the world',
      'UNESCO World Heritage Site',
      'Royal Bengal Tiger habitat',
      'Vulnerable to sea level rise'
    ]
  },
  {
    id: 'jim-corbett',
    name: 'Jim Corbett National Park',
    type: 'national_park',
    coordinates: [29.5300, 78.7700],
    description: 'First national park of India, Project Tiger reserve',
    upscRelevance: 'Wildlife conservation, Project Tiger, eco-tourism',
    importance: 'high',
    category: 'Environmental Geography',
    examFrequency: 75,
    relatedTopics: ['Wildlife Conservation', 'Project Tiger', 'Eco-tourism'],
    keyFacts: [
      'First national park in India (1936)',
      'First Project Tiger reserve',
      'Bengal tiger habitat',
      'Popular eco-tourism destination'
    ]
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    type: 'national_park',
    coordinates: [26.5775, 93.1713],
    description: 'One-horned rhinoceros habitat, UNESCO World Heritage Site',
    upscRelevance: 'Rhinoceros conservation, grassland ecosystem, flood management',
    importance: 'high',
    category: 'Environmental Geography',
    examFrequency: 80,
    relatedTopics: ['Rhinoceros Conservation', 'Grassland Ecosystem', 'Flood Management'],
    keyFacts: [
      'UNESCO World Heritage Site',
      'Two-thirds of world\'s one-horned rhinoceros',
      'Grassland ecosystem',
      'Affected by annual floods'
    ]
  },

  // Historical Sites
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    type: 'historical_site',
    coordinates: [27.1751, 78.0421],
    description: 'Mughal mausoleum, UNESCO World Heritage Site',
    upscRelevance: 'Mughal architecture, cultural heritage, tourism, pollution impact',
    importance: 'high',
    category: 'Cultural Geography',
    examFrequency: 82,
    relatedTopics: ['Mughal History', 'Architecture', 'Tourism', 'Environmental Pollution'],
    keyFacts: [
      'Built by Shah Jahan (1632-1653)',
      'UNESCO World Heritage Site',
      'Symbol of love',
      'Indo-Islamic architecture',
      'Threatened by air pollution'
    ]
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    type: 'historical_site',
    coordinates: [28.6562, 77.2410],
    description: 'Mughal fort, symbol of Indian independence',
    upscRelevance: 'Mughal architecture, independence movement, national symbols',
    importance: 'high',
    category: 'Cultural Geography',
    examFrequency: 85,
    relatedTopics: ['Mughal History', 'Independence Movement', 'National Symbols'],
    keyFacts: [
      'UNESCO World Heritage Site',
      'Independence Day celebrations venue',
      'Mughal architecture',
      'Symbol of Indian sovereignty'
    ]
  },

  // Economic Zones and Ports
  {
    id: 'kandla-port',
    name: 'Kandla Port',
    type: 'port',
    coordinates: [23.0225, 70.2250],
    description: 'Major port in Gujarat, handles bulk cargo',
    upscRelevance: 'Port development, international trade, maritime geography',
    importance: 'medium',
    category: 'Economic Geography',
    examFrequency: 65,
    relatedTopics: ['Port Development', 'International Trade', 'Maritime Geography'],
    keyFacts: [
      'Largest port by cargo volume',
      'Handles petroleum and chemicals',
      'Free trade zone',
      'Strategic location for Middle East trade'
    ]
  },
  {
    id: 'visakhapatnam-port',
    name: 'Visakhapatnam Port',
    type: 'port',
    coordinates: [17.6868, 83.2185],
    description: 'Natural harbor, major port on east coast',
    upscRelevance: 'Natural harbors, steel industry, naval base',
    importance: 'medium',
    category: 'Economic Geography',
    examFrequency: 70,
    relatedTopics: ['Natural Harbors', 'Steel Industry', 'Naval Strategy'],
    keyFacts: [
      'Natural harbor',
      'Major steel industry center',
      'Naval base location',
      'Handles iron ore exports'
    ]
  },

  // Deserts and Plateaus
  {
    id: 'thar-desert',
    name: 'Thar Desert',
    type: 'desert',
    coordinates: [27.0000, 71.0000],
    description: 'Great Indian Desert, arid ecosystem',
    upscRelevance: 'Desert geography, water scarcity, border security, solar energy',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 75,
    relatedTopics: ['Desert Geography', 'Water Scarcity', 'Border Security', 'Solar Energy'],
    keyFacts: [
      'Great Indian Desert',
      'Shared with Pakistan',
      'Water scarcity issues',
      'Solar energy potential',
      'Unique desert ecosystem'
    ]
  },
  {
    id: 'deccan-plateau',
    name: 'Deccan Plateau',
    type: 'plateau',
    coordinates: [17.0000, 77.0000],
    description: 'Large plateau in southern India, volcanic origin',
    upscRelevance: 'Geological formations, mineral resources, black soil, agriculture',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 80,
    relatedTopics: ['Geology', 'Mineral Resources', 'Soil Types', 'Agriculture'],
    keyFacts: [
      'Volcanic origin (Deccan Traps)',
      'Black soil (regur)',
      'Rich mineral resources',
      'Cotton cultivation',
      'Triangular shape'
    ]
  }
];

// Filter functions for different categories
export const getLocationsByType = (type: string) => {
  return indiaLocations.filter(location => location.type === type);
};

export const getLocationsByImportance = (importance: 'high' | 'medium' | 'low') => {
  return indiaLocations.filter(location => location.importance === importance);
};

export const getLocationsByCategory = (category: string) => {
  return indiaLocations.filter(location => location.category === category);
};

export const searchLocations = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return indiaLocations.filter(location =>
    location.name.toLowerCase().includes(lowercaseQuery) ||
    location.description.toLowerCase().includes(lowercaseQuery) ||
    location.upscRelevance.toLowerCase().includes(lowercaseQuery) ||
    location.relatedTopics?.some(topic => topic.toLowerCase().includes(lowercaseQuery))
  );
};
