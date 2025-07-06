'use client';

import { useState, useEffect } from 'react';
import {
  Globe, Map, MapPin, Mountain, Waves, TreePine, Factory,
  Landmark, Search, Filter, Eye, EyeOff, Info, Star,
  Navigation, Compass, Layers, ZoomIn, ZoomOut, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
// Using optimized mapping solution for demo
import SimpleMapDemo from '@/components/maps/SimpleMapDemo';
import MapPerformanceComparison from '@/components/maps/MapPerformanceComparison';

interface MapFeature {
  id: string;
  name: string;
  type: 'state' | 'capital' | 'river' | 'mountain' | 'national_park' | 'historical_site' | 'economic_zone' | 'industrial_center' | 'country' | 'trade_route' | 'conflict_zone' | 'international_org' | 'desert' | 'plateau' | 'island_group';
  coordinates: [number, number];
  description: string;
  upscRelevance: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  relatedTopics: string[];
  examFrequency: number;
  additionalInfo?: {
    population?: string;
    area?: string;
    established?: string;
    significance?: string;
    currentStatus?: string;
  };
}

const indiaMapFeatures: MapFeature[] = [
  {
    id: 'ganges',
    name: 'River Ganges',
    type: 'river',
    coordinates: [25.3176, 82.5937],
    description: 'Holiest river in Hinduism, major river system of North India',
    upscRelevance: 'River system, water resources, cultural significance, pollution issues',
    category: 'Physical Geography',
    importance: 'high',
    relatedTopics: ['River Systems', 'Water Resources', 'Environmental Issues', 'Cultural Geography'],
    examFrequency: 90,
    additionalInfo: {
      area: '1,016,124 km² (basin)',
      significance: 'Sacred river, major water source, agricultural importance'
    }
  },
  {
    id: 'himalayas',
    name: 'Himalayan Range',
    type: 'mountain',
    coordinates: [28.0000, 84.0000],
    description: 'Highest mountain range in the world, northern border of India',
    upscRelevance: 'Physical geography, climate influence, strategic importance, biodiversity',
    category: 'Physical Geography',
    importance: 'high',
    relatedTopics: ['Mountain Systems', 'Climate', 'Biodiversity', 'Strategic Geography'],
    examFrequency: 88,
    additionalInfo: {
      significance: 'Natural barrier, climate influence, water source'
    }
  },
  {
    id: 'thar_desert',
    name: 'Thar Desert',
    type: 'desert',
    coordinates: [26.9124, 70.2430],
    description: 'Large arid region in the northwestern part of the Indian subcontinent',
    upscRelevance: 'Desert ecosystem, climate, agriculture challenges, desertification',
    category: 'Physical Geography',
    importance: 'medium',
    relatedTopics: ['Deserts', 'Climate Zones', 'Agriculture', 'Environmental Degradation'],
    examFrequency: 60,
    additionalInfo: {
      area: '200,000 km²',
      significance: 'Unique ecosystem, challenges for human settlement'
    }
  },
  {
    id: 'western_ghats',
    name: 'Western Ghats',
    type: 'mountain',
    coordinates: [13.5, 76.0],
    description: 'Mountain range running parallel to the western coast of the Indian peninsula, a UNESCO World Heritage Site and a biodiversity hotspot.',
    upscRelevance: 'Biodiversity hotspot, monsoon climate, forest resources, tribal communities, environmental protection',
    category: 'Physical Geography',
    importance: 'high',
    relatedTopics: ['Biodiversity', 'Monsoon', 'Forests', 'Environmental Conservation'],
    examFrequency: 80,
    additionalInfo: {
      length: '1,600 km',
      significance: 'Rich in flora and fauna, origin of many rivers'
    }
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Delta',
    type: 'national_park',
    coordinates: [21.9497, 89.1833],
    description: 'Largest mangrove forest in the world, a UNESCO World Heritage Site',
    upscRelevance: 'Mangrove ecosystem, biodiversity, climate change impact, coastal management',
    category: 'Environmental Geography',
    importance: 'high',
    relatedTopics: ['Mangroves', 'Biodiversity', 'Climate Change', 'Coastal Ecosystems'],
    examFrequency: 75,
    additionalInfo: {
      area: '10,000 km² (total)',
      significance: 'Unique ecosystem, tiger habitat, coastal protection'
    }
  },
  {
    id: 'deccan_plateau',
    name: 'Deccan Plateau',
    type: 'plateau',
    coordinates: [17.0, 77.0],
    description: 'Large plateau in Southern India, located between the Western and Eastern Ghats',
    upscRelevance: 'Geological formations, mineral resources, agriculture, historical significance',
    category: 'Physical Geography',
    importance: 'medium',
    relatedTopics: ['Plateaus', 'Geology', 'Mineral Resources', 'Agriculture'],
    examFrequency: 65,
    additionalInfo: {
      area: '~500,000 km²',
      significance: 'Volcanic origin, rich in black soil'
    }
  },
  {
    id: 'andaman_nicobar',
    name: 'Andaman & Nicobar Islands',
    type: 'island_group',
    coordinates: [11.6234, 92.7353],
    description: 'Union Territory of India in the Bay of Bengal',
    upscRelevance: 'Strategic location, biodiversity, tribal communities, tourism',
    category: 'Political Geography',
    importance: 'medium',
    relatedTopics: ['Island Geography', 'Strategic Locations', 'Biodiversity', 'Tribal Studies'],
    examFrequency: 55,
    additionalInfo: {
      area: '8,249 km²',
      significance: 'Rich marine life, indigenous tribes'
    }
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep Islands',
    type: 'island_group',
    coordinates: [10.5667, 72.6417],
    description: 'Coral islands in the Arabian Sea',
    upscRelevance: 'Coral reefs, marine ecosystem, strategic importance, tourism',
    category: 'Physical Geography',
    importance: 'low',
    relatedTopics: ['Coral Reefs', 'Marine Ecosystems', 'Island Geography'],
    examFrequency: 40,
    additionalInfo: {
      area: '32 km²',
      significance: 'Coral atolls, pristine beaches'
    }
  },
  {
    id: 'indus_valley',
    name: 'Indus Valley Civilization Sites',
    type: 'historical_site',
    coordinates: [27.2634, 68.1049],
    description: 'Ancient civilization sites like Mohenjo-Daro, Harappa, Lothal, Kalibangan',
    upscRelevance: 'Ancient history, urban planning, cultural development',
    category: 'Historical Geography',
    importance: 'high',
    relatedTopics: ['Ancient History', 'Archaeology', 'Urban Planning'],
    examFrequency: 85,
    additionalInfo: {
      significance: 'One of the world\'s earliest major civilizations'
    }
  },
  {
    id: 'gangetic_plain',
    name: 'Gangetic Plain',
    type: 'plain',
    coordinates: [27.0, 80.0],
    description: 'Vast and fertile plain encompassing much of Northern and Eastern India',
    upscRelevance: 'Agriculture, population distribution, historical significance, river systems',
    category: 'Physical Geography',
    importance: 'high',
    relatedTopics: ['Plains', 'Agriculture', 'Population Geography', 'River Systems'],
    examFrequency: 70,
    additionalInfo: {
      area: '~700,000 km²',
      significance: 'Most fertile and densely populated region of India'
    }
  }
];

const worldMapFeatures: MapFeature[] = [
  {
    id: 'usa',
    name: 'United States of America',
    type: 'country',
    coordinates: [-95.7129, 37.0902],
    description: 'Superpower, major trading partner of India',
    upscRelevance: 'International relations, trade partnerships, strategic alliances',
    category: 'International Relations',
    importance: 'high',
    relatedTopics: ['International Relations', 'Trade', 'Strategic Partnerships'],
    examFrequency: 92,
    additionalInfo: {
      significance: 'Global superpower, major trade and strategic partner'
    }
  },
  {
    id: 'china',
    name: 'China',
    type: 'country',
    coordinates: [104.1954, 35.8617],
    description: 'Neighboring country, major economic power',
    upscRelevance: 'Border disputes, trade relations, regional security',
    category: 'International Relations',
    importance: 'high',
    relatedTopics: ['Border Management', 'Trade Relations', 'Regional Security'],
    examFrequency: 95,
    additionalInfo: {
      significance: 'Largest neighbor, economic competitor, border issues'
    }
  },
  {
    id: 'suez_canal',
    name: 'Suez Canal',
    type: 'trade_route',
    coordinates: [32.3498, 30.5852],
    description: 'Important maritime trade route connecting Mediterranean and Red Sea',
    upscRelevance: 'Global trade, maritime geography, economic significance',
    category: 'Economic Geography',
    importance: 'high',
    relatedTopics: ['Maritime Trade', 'Global Economy', 'Strategic Waterways'],
    examFrequency: 75,
    additionalInfo: {
      significance: 'Critical trade route, global economic importance'
    }
  }
];

export default function MapsPage() {
  const [selectedMap, setSelectedMap] = useState<'india' | 'world'>('india');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImportance, setSelectedImportance] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLabels, setShowLabels] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    political: true,
    physical: true,
    economic: true,
    environmental: true
  });
  const [showPerformanceComparison, setShowPerformanceComparison] = useState(false);

  const getCurrentFeatures = () => {
    return selectedMap === 'india' ? indiaMapFeatures : worldMapFeatures;
  };

  const getFilteredFeatures = () => {
    const features = getCurrentFeatures();
    return features.filter(feature => {
      const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feature.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || feature.category === selectedCategory;
      const matchesImportance = selectedImportance === 'All' || feature.importance === selectedImportance;
      
      return matchesSearch && matchesCategory && matchesImportance;
    });
  };

  const categories = ['All', ...Array.from(new Set(getCurrentFeatures().map(f => f.category)))];
  const importanceLevels = ['All', 'high', 'medium', 'low'];

  const getFeatureIcon = (type: MapFeature['type']) => {
    switch (type) {
      case 'capital': return <MapPin className="h-4 w-4" />;
      case 'river': return <Waves className="h-4 w-4" />;
      case 'mountain': return <Mountain className="h-4 w-4" />;
      case 'national_park': return <TreePine className="h-4 w-4" />;
      case 'industrial_center': return <Factory className="h-4 w-4" />;
      case 'historical_site': return <Landmark className="h-4 w-4" />;
      case 'country': return <Globe className="h-4 w-4" />;
      case 'desert': return <Globe className="h-4 w-4" />;
      case 'plateau': return <Mountain className="h-4 w-4" />;
      case 'island_group': return <Globe className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getImportanceColor = (importance: MapFeature['importance']) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interactive Maps</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Explore India and World geography with UPSC-relevant features and detailed information.
            </p>
          </div>
          <button
            onClick={() => setShowPerformanceComparison(!showPerformanceComparison)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              showPerformanceComparison
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance Mode
          </button>
        </div>
      </div>

      {/* Map Selection and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMap('india')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMap === 'india'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Map className="h-4 w-4 mr-2" />
              India Map
            </button>
            <button
              onClick={() => setSelectedMap('world')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMap === 'world'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Globe className="h-4 w-4 mr-2" />
              World Map
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {importanceLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'All' ? 'All Importance' : `${level.charAt(0).toUpperCase() + level.slice(1)} Importance`}
                </option>
              ))}
            </select>
          </div>

          {/* View Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                showLabels
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Map Display and Features List */}
      {showPerformanceComparison ? (
        <MapPerformanceComparison />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {selectedMap === 'india' ? 'India Map' : 'World Map'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive map with UPSC-relevant features and detailed information
              </p>
            </div>
            <SimpleMapDemo
              height="500px"
            />
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {selectedMap === 'india' ? 'India' : 'World'} Features ({getFilteredFeatures().length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getFilteredFeatures().map((feature) => (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600 dark:text-blue-400 mt-1">
                      {getFeatureIcon(feature.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{feature.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(feature.importance)}`}>
                          {feature.importance}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {feature.examFrequency}% exam frequency
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 dark:text-blue-400">
                    {getFeatureIcon(selectedFeature.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedFeature.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedFeature.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedFeature.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">UPSC Relevance</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedFeature.upscRelevance}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeature.relatedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedFeature.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(selectedFeature.additionalInfo).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span className="text-gray-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImportanceColor(selectedFeature.importance)}`}>
                      {selectedFeature.importance} importance
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFeature.examFrequency}% exam frequency
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
