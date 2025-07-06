// Optimized and compressed map data for faster loading
export interface OptimizedLocation {
  id: string;
  name: string;
  type: string;
  coords: [number, number];
  desc: string;
  relevance: string;
  importance: 'high' | 'medium' | 'low';
  freq?: number;
  topics?: string[];
}

// Pre-processed and optimized location data (compressed)
export const optimizedIndiaLocations: OptimizedLocation[] = [
  {
    id: 'new-delhi',
    name: 'New Delhi',
    type: 'capital',
    coords: [28.6139, 77.2090],
    desc: 'Capital of India, seat of government',
    relevance: 'Administrative center, political geography',
    importance: 'high',
    freq: 95,
    topics: ['Governance', 'Politics', 'Administration']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    type: 'capital',
    coords: [19.0760, 72.8777],
    desc: 'Financial capital, largest city',
    relevance: 'Economic hub, financial center',
    importance: 'high',
    freq: 90,
    topics: ['Economy', 'Finance', 'Trade']
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    type: 'capital',
    coords: [22.5726, 88.3639],
    desc: 'Cultural capital, former British capital',
    relevance: 'Historical significance, cultural center',
    importance: 'high',
    freq: 85,
    topics: ['History', 'Culture', 'Colonial']
  },
  {
    id: 'chennai',
    name: 'Chennai',
    type: 'capital',
    coords: [13.0827, 80.2707],
    desc: 'Major port city, automobile hub',
    relevance: 'Industrial center, port city',
    importance: 'high',
    freq: 80,
    topics: ['Industry', 'Ports', 'Manufacturing']
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    type: 'capital',
    coords: [12.9716, 77.5946],
    desc: 'IT capital, Silicon Valley of India',
    relevance: 'Technology hub, IT services',
    importance: 'high',
    freq: 75,
    topics: ['Technology', 'IT', 'Innovation']
  },
  {
    id: 'ganga',
    name: 'Ganga River',
    type: 'river',
    coords: [25.3176, 83.0104],
    desc: 'Holiest river, major water source',
    relevance: 'Religious significance, water resources',
    importance: 'high',
    freq: 95,
    topics: ['Rivers', 'Religion', 'Water']
  },
  {
    id: 'yamuna',
    name: 'Yamuna River',
    type: 'river',
    coords: [28.6139, 77.2090],
    desc: 'Major tributary of Ganga',
    relevance: 'Water pollution, Delhi water supply',
    importance: 'medium',
    freq: 70,
    topics: ['Rivers', 'Pollution', 'Delhi']
  },
  {
    id: 'brahmaputra',
    name: 'Brahmaputra River',
    type: 'river',
    coords: [26.2006, 92.9376],
    desc: 'Major river in Northeast India',
    relevance: 'Flood management, Northeast geography',
    importance: 'high',
    freq: 80,
    topics: ['Rivers', 'Northeast', 'Floods']
  },
  {
    id: 'himalayas',
    name: 'Himalayas',
    type: 'mountain',
    coords: [28.0000, 84.0000],
    desc: 'Highest mountain range',
    relevance: 'Climate, water sources, border security',
    importance: 'high',
    freq: 90,
    topics: ['Mountains', 'Climate', 'Security']
  },
  {
    id: 'western-ghats',
    name: 'Western Ghats',
    type: 'mountain',
    coords: [15.0000, 74.0000],
    desc: 'Biodiversity hotspot',
    relevance: 'Biodiversity, monsoons, ecology',
    importance: 'high',
    freq: 85,
    topics: ['Biodiversity', 'Monsoon', 'Ecology']
  },
  {
    id: 'eastern-ghats',
    name: 'Eastern Ghats',
    type: 'mountain',
    coords: [14.0000, 79.0000],
    desc: 'Discontinuous mountain range',
    relevance: 'Mineral resources, tribal areas',
    importance: 'medium',
    freq: 60,
    topics: ['Minerals', 'Tribes', 'Geography']
  },
  {
    id: 'deccan-plateau',
    name: 'Deccan Plateau',
    type: 'plateau',
    coords: [17.0000, 77.0000],
    desc: 'Large plateau in South India',
    relevance: 'Agriculture, black soil, minerals',
    importance: 'high',
    freq: 80,
    topics: ['Agriculture', 'Soil', 'Minerals']
  },
  {
    id: 'thar-desert',
    name: 'Thar Desert',
    type: 'desert',
    coords: [27.0000, 71.0000],
    desc: 'Great Indian Desert',
    relevance: 'Desert ecology, border areas',
    importance: 'medium',
    freq: 70,
    topics: ['Desert', 'Ecology', 'Border']
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans',
    type: 'national_park',
    coords: [21.9497, 89.1833],
    desc: 'Mangrove forest, tiger reserve',
    relevance: 'Mangrove ecosystem, tiger conservation',
    importance: 'high',
    freq: 85,
    topics: ['Mangroves', 'Tigers', 'Conservation']
  },
  {
    id: 'jim-corbett',
    name: 'Jim Corbett National Park',
    type: 'national_park',
    coords: [29.5319, 78.9462],
    desc: 'First national park in India',
    relevance: 'Tiger conservation, Project Tiger',
    importance: 'high',
    freq: 75,
    topics: ['Tigers', 'Conservation', 'History']
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    type: 'national_park',
    coords: [26.5775, 93.1714],
    desc: 'One-horned rhinoceros habitat',
    relevance: 'Rhinoceros conservation, Assam',
    importance: 'high',
    freq: 80,
    topics: ['Rhinoceros', 'Assam', 'Conservation']
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    type: 'historical_site',
    coords: [28.6562, 77.2410],
    desc: 'Mughal fort, UNESCO World Heritage',
    relevance: 'Mughal architecture, Independence Day',
    importance: 'high',
    freq: 90,
    topics: ['Mughal', 'Architecture', 'Independence']
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    type: 'historical_site',
    coords: [27.1751, 78.0421],
    desc: 'Mughal mausoleum, Wonder of World',
    relevance: 'Mughal architecture, tourism',
    importance: 'high',
    freq: 95,
    topics: ['Mughal', 'Tourism', 'Architecture']
  },
  {
    id: 'ajanta-ellora',
    name: 'Ajanta and Ellora Caves',
    type: 'historical_site',
    coords: [20.0219, 75.7013],
    desc: 'Ancient Buddhist caves',
    relevance: 'Buddhist art, ancient history',
    importance: 'high',
    freq: 85,
    topics: ['Buddhism', 'Art', 'History']
  },
  {
    id: 'kandla-port',
    name: 'Kandla Port',
    type: 'port',
    coords: [23.0225, 70.2208],
    desc: 'Major port in Gujarat',
    relevance: 'Trade, petroleum imports',
    importance: 'medium',
    freq: 65,
    topics: ['Trade', 'Petroleum', 'Gujarat']
  },
  {
    id: 'mumbai-port',
    name: 'Mumbai Port',
    type: 'port',
    coords: [18.9220, 72.8347],
    desc: 'Natural harbor, major port',
    relevance: 'Trade, natural harbor',
    importance: 'high',
    freq: 80,
    topics: ['Trade', 'Harbor', 'Mumbai']
  },
  {
    id: 'silicon-valley-bangalore',
    name: 'Silicon Valley of India',
    type: 'economic_zone',
    coords: [12.9716, 77.5946],
    desc: 'IT hub of India',
    relevance: 'IT industry, software exports',
    importance: 'high',
    freq: 85,
    topics: ['IT', 'Software', 'Exports']
  }
];

// Pre-computed search indices for O(1) lookups
export class FastSearchIndex {
  private nameIndex = new Map<string, OptimizedLocation[]>();
  private typeIndex = new Map<string, OptimizedLocation[]>();
  private importanceIndex = new Map<string, OptimizedLocation[]>();
  private termIndex = new Map<string, Set<OptimizedLocation>>();

  constructor(locations: OptimizedLocation[]) {
    this.buildIndices(locations);
  }

  private buildIndices(locations: OptimizedLocation[]) {
    locations.forEach(location => {
      // Name index
      const nameKey = location.name.toLowerCase();
      if (!this.nameIndex.has(nameKey)) {
        this.nameIndex.set(nameKey, []);
      }
      this.nameIndex.get(nameKey)!.push(location);

      // Type index
      if (!this.typeIndex.has(location.type)) {
        this.typeIndex.set(location.type, []);
      }
      this.typeIndex.get(location.type)!.push(location);

      // Importance index
      if (!this.importanceIndex.has(location.importance)) {
        this.importanceIndex.set(location.importance, []);
      }
      this.importanceIndex.get(location.importance)!.push(location);

      // Term index for fast text search
      const terms = [
        ...location.name.toLowerCase().split(/\s+/),
        ...location.desc.toLowerCase().split(/\s+/),
        ...location.relevance.toLowerCase().split(/\s+/),
        ...(location.topics || []).map(t => t.toLowerCase())
      ];

      terms.forEach(term => {
        if (term.length > 2) {
          if (!this.termIndex.has(term)) {
            this.termIndex.set(term, new Set());
          }
          this.termIndex.get(term)!.add(location);
        }
      });
    });
  }

  // Fast search with O(1) lookup
  search(query: string): OptimizedLocation[] {
    if (!query.trim()) return optimizedIndiaLocations;

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    if (searchTerms.length === 0) return optimizedIndiaLocations;

    let results = new Set<OptimizedLocation>();
    let isFirstTerm = true;

    searchTerms.forEach(term => {
      const termResults = new Set<OptimizedLocation>();

      // Exact term match
      if (this.termIndex.has(term)) {
        this.termIndex.get(term)!.forEach(loc => termResults.add(loc));
      }

      // Partial matches
      this.termIndex.forEach((locations, indexTerm) => {
        if (indexTerm.includes(term) || term.includes(indexTerm)) {
          locations.forEach(loc => termResults.add(loc));
        }
      });

      if (isFirstTerm) {
        results = termResults;
        isFirstTerm = false;
      } else {
        // Intersection for AND logic
        const intersection = new Set<OptimizedLocation>();
        results.forEach(loc => {
          if (termResults.has(loc)) {
            intersection.add(loc);
          }
        });
        results = intersection;
      }
    });

    return Array.from(results);
  }

  // Fast filter by type
  filterByType(type: string): OptimizedLocation[] {
    if (type === 'all') return optimizedIndiaLocations;
    
    const typeMap: { [key: string]: string[] } = {
      'states': ['state', 'capital'],
      'rivers': ['river'],
      'mountains': ['mountain', 'plateau'],
      'parks': ['national_park'],
      'historical': ['historical_site'],
      'economic': ['economic_zone', 'port']
    };

    const types = typeMap[type] || [type];
    const results: OptimizedLocation[] = [];

    types.forEach(t => {
      if (this.typeIndex.has(t)) {
        results.push(...this.typeIndex.get(t)!);
      }
    });

    return results;
  }

  // Fast filter by importance
  filterByImportance(importance: string): OptimizedLocation[] {
    return this.importanceIndex.get(importance) || [];
  }
}

// Create singleton instance for performance
export const searchIndex = new FastSearchIndex(optimizedIndiaLocations);

// Utility functions for data processing
export const getLocationsByType = (type: string): OptimizedLocation[] => {
  return searchIndex.filterByType(type);
};

export const searchLocations = (query: string): OptimizedLocation[] => {
  return searchIndex.search(query);
};

export const getHighImportanceLocations = (): OptimizedLocation[] => {
  return searchIndex.filterByImportance('high');
};

// Export for compatibility
export { optimizedIndiaLocations as indiaMapData };
export type { OptimizedLocation as MapLocation };
