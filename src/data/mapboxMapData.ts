import { FeatureCollection, Feature, Point, LineString, Polygon } from 'geojson';

export interface MapboxMapFeature {
  id: string;
  name: string;
  type: 'point' | 'line' | 'polygon';
  category: 'physical' | 'political' | 'economic' | 'historical' | 'cultural' | 'environmental';
  upscRelevance: 'high' | 'medium' | 'low';
  importance: 'high' | 'medium' | 'low';
  description: string;
  examFrequency: number;
  syllabusTopics: string[];
  relatedTopics: string[];
  keyFacts: string[];
  examQuestions?: {
    year: number;
    paper: string;
    question: string;
    answer?: string;
  }[];
}

export interface MapboxLayer {
  id: string;
  name: string;
  type: 'symbol' | 'line' | 'fill' | 'circle';
  category: 'physical' | 'political' | 'economic' | 'historical' | 'cultural' | 'environmental';
  upscRelevance: 'high' | 'medium' | 'low';
  visible: boolean;
  data: FeatureCollection;
  style: {
    paint?: any;
    layout?: any;
  };
  description: string;
  examRelevance: {
    prelims: boolean;
    mains: boolean;
    optional: string[];
  };
}

// Physical Geography - Rivers
export const riversLayer: MapboxLayer = {
  id: 'rivers',
  name: 'Major Rivers',
  type: 'line',
  category: 'physical',
  upscRelevance: 'high',
  visible: true,
  description: 'Major river systems of India - crucial for geography and water resources',
  examRelevance: {
    prelims: true,
    mains: true,
    optional: ['Geography']
  },
  style: {
    paint: {
      'line-color': '#1e40af',
      'line-width': 3,
      'line-opacity': 0.8
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    }
  },
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'ganga',
          name: 'River Ganga',
          description: 'Holiest river in Hinduism, major river system of North India',
          upscRelevance: 'River systems, water resources, cultural significance, pollution issues',
          category: 'Physical Geography',
          importance: 'high',
          examFrequency: 90,
          syllabusTopics: ['River Systems', 'Water Resources', 'Environmental Issues'],
          keyFacts: [
            'Length: 2,525 km',
            'Basin area: 1,016,124 km²',
            'Sacred river in Hinduism',
            'Major pollution concerns',
            'Supports 400+ million people'
          ]
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.9, 31.1], [79.2, 30.8], [79.5, 30.5], [80.0, 30.2],
            [80.5, 29.9], [81.0, 29.6], [81.5, 29.3], [82.0, 29.0],
            [82.5, 28.7], [83.0, 28.4], [83.5, 28.1], [84.0, 27.8],
            [84.5, 27.5], [85.0, 27.2], [85.5, 26.9], [86.0, 26.6],
            [86.5, 26.3], [87.0, 26.0], [87.5, 25.7], [88.0, 25.4],
            [88.5, 25.1], [89.0, 24.8], [89.5, 24.5], [90.0, 24.2]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'yamuna',
          name: 'River Yamuna',
          description: 'Major tributary of Ganga, flows through Delhi and Agra',
          upscRelevance: 'River systems, urban pollution, historical significance',
          category: 'Physical Geography',
          importance: 'high',
          examFrequency: 75,
          syllabusTopics: ['River Systems', 'Urban Geography', 'Environmental Issues'],
          keyFacts: [
            'Length: 1,376 km',
            'Major tributary of Ganga',
            'Flows through Delhi and Agra',
            'Severe pollution in urban areas',
            'Historical and cultural importance'
          ]
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.0, 31.0], [77.8, 30.5], [77.6, 30.0], [77.4, 29.5],
            [77.2, 29.0], [77.0, 28.5], [76.8, 28.0], [76.6, 27.5],
            [76.4, 27.0], [76.2, 26.5], [76.0, 26.0], [75.8, 25.5]
          ]
        }
      }
    ]
  }
};

// Political Geography - States and Capitals
export const statesLayer: MapboxLayer = {
  id: 'states',
  name: 'States and Capitals',
  type: 'symbol',
  category: 'political',
  upscRelevance: 'high',
  visible: true,
  description: 'Indian states and their capitals - essential for polity and administrative geography',
  examRelevance: {
    prelims: true,
    mains: true,
    optional: ['Geography', 'Public Administration']
  },
  style: {
    paint: {
      'text-color': '#dc2626',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2
    },
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 14,
      'text-anchor': 'center',
      'icon-image': 'marker-15',
      'icon-size': 1.5
    }
  },
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'new-delhi',
          name: 'New Delhi',
          description: 'Capital of India, seat of central government',
          upscRelevance: 'Administrative center, political geography, governance',
          category: 'Political Geography',
          importance: 'high',
          examFrequency: 95,
          syllabusTopics: ['Indian Polity', 'Administrative Geography', 'Governance'],
          keyFacts: [
            'National capital territory',
            'Seat of Parliament and Supreme Court',
            'Population: ~32 million (NCR)',
            'Planned city by Edwin Lutyens',
            'Major administrative center'
          ]
        },
        geometry: {
          type: 'Point',
          coordinates: [77.2090, 28.6139]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'mumbai',
          name: 'Mumbai',
          description: 'Financial capital of India, major port city',
          upscRelevance: 'Economic geography, urbanization, port development, financial center',
          category: 'Economic Geography',
          importance: 'high',
          examFrequency: 90,
          syllabusTopics: ['Economic Geography', 'Urbanization', 'Port Development', 'Financial Markets'],
          keyFacts: [
            'Financial capital of India',
            'Major port on west coast',
            'Bollywood film industry center',
            'Population: ~20 million',
            'Stock exchanges: BSE and NSE'
          ]
        },
        geometry: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        }
      }
    ]
  }
};

// Physical Geography - Mountain Ranges
export const mountainsLayer: MapboxLayer = {
  id: 'mountains',
  name: 'Mountain Ranges',
  type: 'fill',
  category: 'physical',
  upscRelevance: 'high',
  visible: true,
  description: 'Major mountain ranges of India - crucial for physical geography and climate',
  examRelevance: {
    prelims: true,
    mains: true,
    optional: ['Geography']
  },
  style: {
    paint: {
      'fill-color': '#8b5a3c',
      'fill-opacity': 0.6,
      'fill-outline-color': '#654321'
    }
  },
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'himalayas',
          name: 'Himalayas',
          description: 'World\'s highest mountain range, northern boundary of India',
          upscRelevance: 'Physical geography, climate, biodiversity, strategic importance',
          category: 'Physical Geography',
          importance: 'high',
          examFrequency: 88,
          syllabusTopics: ['Mountain Systems', 'Climate', 'Biodiversity', 'Strategic Geography'],
          keyFacts: [
            'World\'s highest mountain range',
            'Length: ~2,400 km',
            'Contains Mount Everest (8,848m)',
            'Source of major rivers',
            'Biodiversity hotspot'
          ]
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [74.0, 35.0], [95.0, 35.0], [95.0, 27.0], [74.0, 27.0], [74.0, 35.0]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'western-ghats',
          name: 'Western Ghats',
          description: 'Mountain range along western coast, UNESCO World Heritage Site',
          upscRelevance: 'Biodiversity, monsoons, endemic species, conservation',
          category: 'Physical Geography',
          importance: 'high',
          examFrequency: 82,
          syllabusTopics: ['Mountain Systems', 'Biodiversity', 'Monsoons', 'Conservation'],
          keyFacts: [
            'UNESCO World Heritage Site',
            'Length: ~1,600 km',
            'Biodiversity hotspot',
            'Influences monsoon patterns',
            '39 endemic species'
          ]
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [73.0, 21.0], [77.0, 21.0], [77.0, 8.0], [73.0, 8.0], [73.0, 21.0]
          ]]
        }
      }
    ]
  }
};

// Environmental Geography - National Parks
export const nationalParksLayer: MapboxLayer = {
  id: 'national-parks',
  name: 'National Parks',
  type: 'circle',
  category: 'environmental',
  upscRelevance: 'high',
  visible: true,
  description: 'Major national parks and wildlife sanctuaries - important for biodiversity and conservation',
  examRelevance: {
    prelims: true,
    mains: true,
    optional: ['Geography', 'Environment']
  },
  style: {
    paint: {
      'circle-color': '#16a34a',
      'circle-radius': 8,
      'circle-opacity': 0.8,
      'circle-stroke-color': '#15803d',
      'circle-stroke-width': 2
    }
  },
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'sundarbans',
          name: 'Sundarbans National Park',
          description: 'Largest mangrove forest, UNESCO World Heritage Site',
          upscRelevance: 'Biodiversity, conservation, climate change, mangrove ecosystems',
          category: 'Environmental Geography',
          importance: 'high',
          examFrequency: 80,
          syllabusTopics: ['Biodiversity', 'Conservation', 'Climate Change', 'Coastal Ecosystems'],
          keyFacts: [
            'Largest mangrove forest',
            'UNESCO World Heritage Site',
            'Home to Royal Bengal Tiger',
            'Area: 10,000 km²',
            'Climate change vulnerable'
          ]
        },
        geometry: {
          type: 'Point',
          coordinates: [89.1833, 21.9497]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'jim-corbett',
          name: 'Jim Corbett National Park',
          description: 'India\'s oldest national park, famous for tigers',
          upscRelevance: 'Wildlife conservation, Project Tiger, ecotourism',
          category: 'Environmental Geography',
          importance: 'high',
          examFrequency: 70,
          syllabusTopics: ['Wildlife Conservation', 'Project Tiger', 'Ecotourism'],
          keyFacts: [
            'India\'s oldest national park (1936)',
            'First Project Tiger reserve',
            'Area: 520 km²',
            'Famous for Bengal tigers',
            'Ecotourism destination'
          ]
        },
        geometry: {
          type: 'Point',
          coordinates: [78.9629, 29.5316]
        }
      }
    ]
  }
};

// Historical Geography - Heritage Sites
export const heritageLayer: MapboxLayer = {
  id: 'heritage-sites',
  name: 'Heritage Sites',
  type: 'symbol',
  category: 'historical',
  upscRelevance: 'high',
  visible: true,
  description: 'UNESCO World Heritage Sites and historical monuments',
  examRelevance: {
    prelims: true,
    mains: true,
    optional: ['History', 'Art and Culture']
  },
  style: {
    paint: {
      'text-color': '#7c2d12',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2
    },
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 12,
      'text-anchor': 'top',
      'icon-image': 'monument-15',
      'icon-size': 1.5
    }
  },
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'taj-mahal',
          name: 'Taj Mahal',
          description: 'Mughal mausoleum, UNESCO World Heritage Site',
          upscRelevance: 'Mughal architecture, cultural heritage, tourism',
          category: 'Historical Geography',
          importance: 'high',
          examFrequency: 85,
          syllabusTopics: ['Mughal History', 'Architecture', 'Cultural Heritage', 'Tourism'],
          keyFacts: [
            'Built by Shah Jahan (1632-1653)',
            'UNESCO World Heritage Site',
            'Symbol of love',
            'Indo-Islamic architecture',
            'Major tourist attraction'
          ]
        },
        geometry: {
          type: 'Point',
          coordinates: [78.0421, 27.1751]
        }
      },
      {
        type: 'Feature',
        properties: {
          id: 'red-fort',
          name: 'Red Fort',
          description: 'Mughal fortress in Delhi, UNESCO World Heritage Site',
          upscRelevance: 'Mughal architecture, Indian independence, cultural heritage',
          category: 'Historical Geography',
          importance: 'high',
          examFrequency: 75,
          syllabusTopics: ['Mughal History', 'Architecture', 'Independence Movement'],
          keyFacts: [
            'Built by Shah Jahan (1638-1648)',
            'UNESCO World Heritage Site',
            'Independence Day celebrations venue',
            'Mughal architectural masterpiece',
            'Symbol of Indian sovereignty'
          ]
        },
        geometry: {
          type: 'Point',
          coordinates: [77.2410, 28.6562]
        }
      }
    ]
  }
};

// Export all layers
export const allMapboxLayers: MapboxLayer[] = [
  riversLayer,
  statesLayer,
  mountainsLayer,
  nationalParksLayer,
  heritageLayer
];

// Helper functions
export const getLayersByCategory = (category: string): MapboxLayer[] => {
  return allMapboxLayers.filter(layer => layer.category === category);
};

export const getLayersByUpscRelevance = (relevance: 'high' | 'medium' | 'low'): MapboxLayer[] => {
  return allMapboxLayers.filter(layer => layer.upscRelevance === relevance);
};

export const getVisibleLayers = (): MapboxLayer[] => {
  return allMapboxLayers.filter(layer => layer.visible);
};

export const toggleLayerVisibility = (layerId: string): void => {
  const layer = allMapboxLayers.find(l => l.id === layerId);
  if (layer) {
    layer.visible = !layer.visible;
  }
};
