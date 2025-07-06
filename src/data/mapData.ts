export interface MapLayer {
  id: string;
  name: string;
  type: 'physical' | 'political' | 'economic' | 'historical' | 'cultural' | 'climate' | 'demographic';
  category: 'geography' | 'history' | 'economics' | 'polity' | 'culture';
  upscRelevance: 'high' | 'medium' | 'low';
  timeRange?: {
    start: number; // Year
    end: number;   // Year
  };
  visible: boolean;
  color: string;
  opacity: number;
  data: MapFeature[];
  examRelevance: {
    prelims: boolean;
    mains: boolean;
    optional: string[]; // Geography, History, etc.
  };
  syllabusTopics: string[];
  description: string;
}

export interface MapFeature {
  id: string;
  name: string;
  type: 'point' | 'line' | 'polygon' | 'circle';
  coordinates: number[] | number[][] | number[][][]; // Different formats for different types
  properties: {
    title: string;
    description: string;
    category: string;
    upscRelevance: 'high' | 'medium' | 'low';
    syllabusTopics: string[];
    examQuestions?: {
      year: number;
      paper: string;
      question: string;
      answer?: string;
    }[];
    keyFacts: string[];
    relatedTopics: string[];
    images?: string[];
    sources: string[];
  };
  style?: {
    color?: string;
    fillColor?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
    radius?: number;
  };
}

export interface HistoricalPeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  keyEvents: string[];
  territories: MapFeature[];
  capitals: MapFeature[];
  importantCities: MapFeature[];
  tradeRoutes: MapFeature[];
  battles: MapFeature[];
  upscRelevance: 'high' | 'medium' | 'low';
  syllabusTopics: string[];
}

// Physical Geography Data
export const physicalGeographyLayers: MapLayer[] = [
  {
    id: 'mountain-ranges',
    name: 'Mountain Ranges',
    type: 'physical',
    category: 'geography',
    upscRelevance: 'high',
    visible: false,
    color: '#8B4513',
    opacity: 0.8,
    examRelevance: {
      prelims: true,
      mains: true,
      optional: ['Geography']
    },
    syllabusTopics: ['Physical Geography of India', 'World Geography'],
    description: 'Major mountain ranges of India and the world',
    data: [
      {
        id: 'himalayas',
        name: 'Himalayas',
        type: 'line',
        coordinates: [
          [73.0, 35.0], [74.0, 34.5], [75.0, 34.0], [76.0, 33.5],
          [77.0, 33.0], [78.0, 32.5], [79.0, 32.0], [80.0, 31.5],
          [81.0, 31.0], [82.0, 30.5], [83.0, 30.0], [84.0, 29.5],
          [85.0, 29.0], [86.0, 28.5], [87.0, 28.0], [88.0, 27.5]
        ],
        properties: {
          title: 'Himalayan Mountain Range',
          description: 'The world\'s highest mountain range, forming the northern boundary of India',
          category: 'Mountain Range',
          upscRelevance: 'high',
          syllabusTopics: ['Physical Geography of India', 'Physiography'],
          keyFacts: [
            'Highest peak: Mount Everest (8,848m)',
            'Length: ~2,400 km',
            'Formed by collision of Indian and Eurasian plates',
            'Three parallel ranges: Greater, Lesser, and Outer Himalayas',
            'Source of major rivers: Ganga, Yamuna, Brahmaputra'
          ],
          relatedTopics: ['Plate Tectonics', 'River Systems', 'Climate'],
          sources: ['NCERT Geography Class 11', 'Survey of India']
        },
        style: {
          color: '#8B4513',
          weight: 4,
          opacity: 0.8
        }
      },
      {
        id: 'western-ghats',
        name: 'Western Ghats',
        type: 'line',
        coordinates: [
          [73.0, 21.0], [73.2, 20.5], [73.5, 20.0], [73.8, 19.5],
          [74.0, 19.0], [74.2, 18.5], [74.5, 18.0], [74.8, 17.5],
          [75.0, 17.0], [75.2, 16.5], [75.5, 16.0], [75.8, 15.5],
          [76.0, 15.0], [76.2, 14.5], [76.5, 14.0], [76.8, 13.5],
          [77.0, 13.0], [77.2, 12.5], [77.5, 12.0], [77.8, 11.5],
          [78.0, 11.0], [78.2, 10.5], [78.5, 10.0], [78.8, 9.5],
          [79.0, 9.0], [79.2, 8.5]
        ],
        properties: {
          title: 'Western Ghats',
          description: 'UNESCO World Heritage mountain range along India\'s western coast',
          category: 'Mountain Range',
          upscRelevance: 'high',
          syllabusTopics: ['Physical Geography of India', 'Biodiversity'],
          keyFacts: [
            'Length: ~1,600 km',
            'UNESCO World Heritage Site',
            'Biodiversity hotspot',
            'Average elevation: 1,200m',
            'Source of major peninsular rivers'
          ],
          relatedTopics: ['Monsoons', 'Biodiversity', 'River Systems'],
          sources: ['NCERT Geography', 'UNESCO']
        },
        style: {
          color: '#228B22',
          weight: 3,
          opacity: 0.8
        }
      }
    ]
  },
  {
    id: 'river-systems',
    name: 'Major Rivers',
    type: 'physical',
    category: 'geography',
    upscRelevance: 'high',
    visible: false,
    color: '#4169E1',
    opacity: 0.8,
    examRelevance: {
      prelims: true,
      mains: true,
      optional: ['Geography']
    },
    syllabusTopics: ['Drainage Systems', 'Water Resources'],
    description: 'Major river systems of India',
    data: [
      {
        id: 'ganga',
        name: 'River Ganga',
        type: 'line',
        coordinates: [
          [78.9, 31.1], [79.2, 30.8], [79.5, 30.5], [80.0, 30.2],
          [80.5, 29.9], [81.0, 29.6], [81.5, 29.3], [82.0, 29.0],
          [82.5, 28.7], [83.0, 28.4], [83.5, 28.1], [84.0, 27.8],
          [84.5, 27.5], [85.0, 27.2], [85.5, 26.9], [86.0, 26.6],
          [86.5, 26.3], [87.0, 26.0], [87.5, 25.7], [88.0, 25.4],
          [88.5, 25.1], [89.0, 24.8], [89.5, 24.5], [90.0, 24.2],
          [90.5, 23.9], [91.0, 23.6], [91.5, 23.3], [92.0, 23.0]
        ],
        properties: {
          title: 'River Ganga',
          description: 'India\'s most sacred and important river system',
          category: 'River',
          upscRelevance: 'high',
          syllabusTopics: ['Drainage Systems', 'Water Resources', 'Cultural Geography'],
          keyFacts: [
            'Length: 2,525 km',
            'Origin: Gangotri Glacier',
            'Major tributaries: Yamuna, Ghaghara, Gandak, Kosi',
            'Basin area: 1,086,000 sq km',
            'Supports 40% of India\'s population'
          ],
          relatedTopics: ['Water Pollution', 'River Linking', 'Cultural Significance'],
          sources: ['Central Water Commission', 'NCERT Geography']
        },
        style: {
          color: '#4169E1',
          weight: 4,
          opacity: 0.9
        }
      }
    ]
  }
];

// Historical Periods Data
export const historicalPeriods: HistoricalPeriod[] = [
  {
    id: 'mauryan-empire',
    name: 'Mauryan Empire',
    startYear: -321,
    endYear: -185,
    description: 'First pan-Indian empire under Chandragupta Maurya and Ashoka',
    keyEvents: [
      'Chandragupta Maurya establishes empire (321 BCE)',
      'Ashoka\'s Kalinga War (261 BCE)',
      'Spread of Buddhism',
      'Administrative innovations'
    ],
    upscRelevance: 'high',
    syllabusTopics: ['Ancient Indian History', 'Administrative History'],
    territories: [
      {
        id: 'mauryan-territory-peak',
        name: 'Mauryan Empire at Peak',
        type: 'polygon',
        coordinates: [[
          [68.0, 35.0], [88.0, 35.0], [88.0, 8.0], [68.0, 8.0], [68.0, 35.0]
        ]],
        properties: {
          title: 'Mauryan Empire Territory (Peak under Ashoka)',
          description: 'Maximum extent of the Mauryan Empire covering most of the Indian subcontinent',
          category: 'Historical Territory',
          upscRelevance: 'high',
          syllabusTopics: ['Ancient Indian History', 'Political History'],
          keyFacts: [
            'Largest empire in ancient India',
            'Capital: Pataliputra (modern Patna)',
            'Efficient administrative system',
            'Ashoka\'s edicts spread across empire',
            'Covered present-day India, Pakistan, Bangladesh, Afghanistan'
          ],
          relatedTopics: ['Buddhism', 'Administrative System', 'Ashoka\'s Dhamma'],
          sources: ['NCERT Ancient India', 'Archaeological Survey of India']
        },
        style: {
          fillColor: '#FFD700',
          color: '#B8860B',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3
        }
      }
    ],
    capitals: [
      {
        id: 'pataliputra',
        name: 'Pataliputra',
        type: 'point',
        coordinates: [85.1376, 25.5941],
        properties: {
          title: 'Pataliputra (Modern Patna)',
          description: 'Capital of the Mauryan Empire',
          category: 'Historical Capital',
          upscRelevance: 'high',
          syllabusTopics: ['Ancient Indian History', 'Urban Centers'],
          keyFacts: [
            'Founded by Ajatashatru',
            'Strategic location at confluence of rivers',
            'Major center of learning and trade',
            'Described by Megasthenes'
          ],
          relatedTopics: ['Mauryan Administration', 'Ancient Cities'],
          sources: ['Indica by Megasthenes', 'NCERT']
        }
      }
    ],
    importantCities: [],
    tradeRoutes: [],
    battles: []
  },
  {
    id: 'mughal-empire',
    name: 'Mughal Empire',
    startYear: 1526,
    endYear: 1857,
    description: 'Islamic empire that ruled most of the Indian subcontinent',
    keyEvents: [
      'Babur defeats Ibrahim Lodi at Panipat (1526)',
      'Akbar\'s reign and religious tolerance (1556-1605)',
      'Shah Jahan builds Taj Mahal (1632-1653)',
      'Aurangzeb\'s expansion and decline (1658-1707)',
      'British East India Company gains control'
    ],
    upscRelevance: 'high',
    syllabusTopics: ['Medieval Indian History', 'Mughal Administration'],
    territories: [
      {
        id: 'mughal-territory-akbar',
        name: 'Mughal Empire under Akbar',
        type: 'polygon',
        coordinates: [[
          [70.0, 34.0], [85.0, 34.0], [85.0, 15.0], [70.0, 15.0], [70.0, 34.0]
        ]],
        properties: {
          title: 'Mughal Empire under Akbar (1556-1605)',
          description: 'Territory of Mughal Empire during Akbar\'s reign',
          category: 'Historical Territory',
          upscRelevance: 'high',
          syllabusTopics: ['Medieval Indian History', 'Akbar\'s Policies'],
          keyFacts: [
            'Policy of religious tolerance',
            'Mansabdari system',
            'Cultural synthesis',
            'Administrative reforms'
          ],
          relatedTopics: ['Din-i-Ilahi', 'Mansabdari System', 'Cultural Synthesis'],
          sources: ['Akbarnama', 'NCERT Medieval India']
        },
        style: {
          fillColor: '#9370DB',
          color: '#4B0082',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3
        }
      }
    ],
    capitals: [
      {
        id: 'delhi-mughal',
        name: 'Delhi',
        type: 'point',
        coordinates: [77.2090, 28.6139],
        properties: {
          title: 'Delhi (Mughal Capital)',
          description: 'Primary capital of the Mughal Empire',
          category: 'Historical Capital',
          upscRelevance: 'high',
          syllabusTopics: ['Medieval Indian History', 'Mughal Architecture'],
          keyFacts: [
            'Red Fort built by Shah Jahan',
            'Jama Masjid',
            'Center of Mughal administration',
            'Cultural and artistic hub'
          ],
          relatedTopics: ['Mughal Architecture', 'Administrative Centers'],
          sources: ['NCERT', 'Archaeological Survey of India']
        }
      }
    ],
    importantCities: [],
    tradeRoutes: [],
    battles: []
  }
];

// Economic Geography Data
export const economicGeographyLayers: MapLayer[] = [
  {
    id: 'industrial-centers',
    name: 'Industrial Centers',
    type: 'economic',
    category: 'economics',
    upscRelevance: 'high',
    visible: false,
    color: '#FF4500',
    opacity: 0.8,
    examRelevance: {
      prelims: true,
      mains: true,
      optional: ['Geography', 'Economics']
    },
    syllabusTopics: ['Industrial Geography', 'Economic Development'],
    description: 'Major industrial centers and manufacturing hubs',
    data: [
      {
        id: 'mumbai-industrial',
        name: 'Mumbai Industrial Region',
        type: 'circle',
        coordinates: [72.8777, 19.0760],
        properties: {
          title: 'Mumbai Industrial Region',
          description: 'India\'s largest industrial and financial center',
          category: 'Industrial Center',
          upscRelevance: 'high',
          syllabusTopics: ['Industrial Geography', 'Financial Centers'],
          keyFacts: [
            'Financial capital of India',
            'Major port city',
            'Textile and chemical industries',
            'Bollywood film industry',
            'Stock exchanges: BSE and NSE'
          ],
          relatedTopics: ['Port Development', 'Financial Markets', 'Urbanization'],
          sources: ['Economic Survey', 'Ministry of Commerce']
        },
        style: {
          color: '#FF4500',
          fillColor: '#FF6347',
          radius: 50000,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.4
        }
      }
    ]
  }
];

// Climate Data
export const climateData: MapLayer[] = [
  {
    id: 'monsoon-patterns',
    name: 'Monsoon Patterns',
    type: 'climate',
    category: 'geography',
    upscRelevance: 'high',
    visible: false,
    color: '#00CED1',
    opacity: 0.7,
    examRelevance: {
      prelims: true,
      mains: true,
      optional: ['Geography']
    },
    syllabusTopics: ['Climate', 'Monsoons', 'Agriculture'],
    description: 'Indian monsoon patterns and rainfall distribution',
    data: [
      {
        id: 'southwest-monsoon',
        name: 'Southwest Monsoon',
        type: 'polygon',
        coordinates: [[
          [68.0, 8.0], [97.0, 8.0], [97.0, 37.0], [68.0, 37.0], [68.0, 8.0]
        ]],
        properties: {
          title: 'Southwest Monsoon Coverage',
          description: 'Area covered by Southwest monsoon winds',
          category: 'Climate Pattern',
          upscRelevance: 'high',
          syllabusTopics: ['Monsoons', 'Climate', 'Agriculture'],
          keyFacts: [
            'Brings 75% of India\'s annual rainfall',
            'Duration: June to September',
            'Crucial for agriculture',
            'Two branches: Arabian Sea and Bay of Bengal',
            'Affects entire Indian subcontinent'
          ],
          relatedTopics: ['Agriculture', 'Water Resources', 'Food Security'],
          sources: ['India Meteorological Department', 'NCERT Geography']
        },
        style: {
          fillColor: '#00CED1',
          color: '#008B8B',
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.3
        }
      }
    ]
  }
];

// Helper functions
export const getAllMapLayers = (): MapLayer[] => {
  return [
    ...physicalGeographyLayers,
    ...economicGeographyLayers,
    ...climateData
  ];
};

export const getLayersByCategory = (category: string): MapLayer[] => {
  return getAllMapLayers().filter(layer => layer.category === category);
};

export const getLayersByUpscRelevance = (relevance: 'high' | 'medium' | 'low'): MapLayer[] => {
  return getAllMapLayers().filter(layer => layer.upscRelevance === relevance);
};

export const getHistoricalLayersForPeriod = (year: number): HistoricalPeriod[] => {
  return historicalPeriods.filter(period => year >= period.startYear && year <= period.endYear);
};

export const searchMapFeatures = (query: string): MapFeature[] => {
  const allFeatures: MapFeature[] = [];
  getAllMapLayers().forEach(layer => {
    allFeatures.push(...layer.data);
  });
  
  return allFeatures.filter(feature => 
    feature.name.toLowerCase().includes(query.toLowerCase()) ||
    feature.properties.title.toLowerCase().includes(query.toLowerCase()) ||
    feature.properties.description.toLowerCase().includes(query.toLowerCase()) ||
    feature.properties.syllabusTopics.some(topic => 
      topic.toLowerCase().includes(query.toLowerCase())
    )
  );
};
