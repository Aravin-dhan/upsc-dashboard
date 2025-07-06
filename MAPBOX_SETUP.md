# Mapbox Setup Instructions

## Overview
The UPSC Dashboard now uses **Mapbox GL JS** as the mapping framework, replacing the previous custom SVG-based implementation. This provides professional-grade mapping capabilities with better performance and features.

## Features
- **Interactive Vector Maps**: High-quality, scalable vector maps
- **Custom Styling**: Professional map styles optimized for educational content
- **UPSC-Relevant Data**: Comprehensive geographic data tailored for UPSC preparation
- **Layer Management**: Multiple data layers (rivers, states, mountains, national parks, heritage sites)
- **Educational Overlays**: Exam relevance, syllabus topics, and key facts for each location
- **AI Integration**: Ready for AI assistant integration for location-based queries

## Setup Instructions

### 1. Get Mapbox Access Token
1. Go to [Mapbox](https://www.mapbox.com/) and create a free account
2. Navigate to your [Account page](https://account.mapbox.com/)
3. Copy your **Default public token** or create a new token
4. The token should start with `pk.`

### 2. Configure Environment Variables
1. Open the `.env.local` file in the project root
2. Replace the example token with your real Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_mapbox_token_here
   ```

### 3. Install Dependencies
The required dependencies are already configured in `package.json`:
- `mapbox-gl`: Core Mapbox GL JS library
- `react-map-gl`: React wrapper for Mapbox GL JS
- `@types/mapbox-gl`: TypeScript definitions

Run the installation:
```bash
npm install
```

## Map Data Structure

### Layers
The new implementation includes several educational layers:

1. **Rivers Layer** (`riversLayer`)
   - Major river systems of India
   - GeoJSON LineString format
   - Educational data: basin area, cultural significance, pollution issues

2. **States Layer** (`statesLayer`)
   - Indian states and capitals
   - GeoJSON Point format
   - Political geography and administrative data

3. **Mountains Layer** (`mountainsLayer`)
   - Major mountain ranges
   - GeoJSON Polygon format
   - Physical geography and climate data

4. **National Parks Layer** (`nationalParksLayer`)
   - Protected areas and wildlife sanctuaries
   - GeoJSON Point format
   - Biodiversity and conservation data

5. **Heritage Sites Layer** (`heritageLayer`)
   - UNESCO World Heritage Sites and monuments
   - GeoJSON Point format
   - Historical and cultural significance

### Data Format
Each feature includes comprehensive UPSC-relevant information:
```typescript
{
  id: string;
  name: string;
  description: string;
  upscRelevance: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  examFrequency: number;
  syllabusTopics: string[];
  keyFacts: string[];
}
```

## Components

### MapboxInteractiveMap
Main component located at `src/components/maps/MapboxInteractiveMap.tsx`

**Props:**
- `height`: Map container height (default: "600px")
- `showControls`: Show search and layer controls (default: true)
- `showAIAssistant`: Show AI assistant panel (default: true)
- `initialCenter`: Initial map center coordinates [longitude, latitude]
- `initialZoom`: Initial zoom level
- `mapStyle`: Mapbox style URL

**Features:**
- Interactive markers with popups
- Search functionality
- Layer filtering
- Zoom and pan controls
- Fullscreen mode
- Scale control

### Data Management
Map data is managed in `src/data/mapboxMapData.ts` with:
- Layer definitions
- GeoJSON feature collections
- Helper functions for filtering and management
- TypeScript interfaces for type safety

## Usage Examples

### Basic Usage
```tsx
import MapboxInteractiveMap from '@/components/maps/MapboxInteractiveMap';

<MapboxInteractiveMap
  height="500px"
  initialCenter={[78.9629, 20.5937]} // Center of India
  initialZoom={5}
  showControls={true}
  showAIAssistant={true}
/>
```

### Custom Styling
```tsx
<MapboxInteractiveMap
  mapStyle="mapbox://styles/mapbox/satellite-v9"
  height="400px"
  showControls={false}
/>
```

## Map Styles Available
- `mapbox://styles/mapbox/streets-v12` (default)
- `mapbox://styles/mapbox/outdoors-v12`
- `mapbox://styles/mapbox/light-v11`
- `mapbox://styles/mapbox/dark-v11`
- `mapbox://styles/mapbox/satellite-v9`
- `mapbox://styles/mapbox/satellite-streets-v12`

## Educational Benefits

### UPSC Preparation
- **Comprehensive Coverage**: All major geographic features relevant to UPSC syllabus
- **Exam Frequency Data**: Shows how often each location appears in exams
- **Syllabus Mapping**: Direct connection to UPSC syllabus topics
- **Key Facts**: Important points for quick revision
- **Related Topics**: Cross-references to other subjects

### Interactive Learning
- **Visual Learning**: Better retention through interactive exploration
- **Contextual Information**: Rich popups with detailed information
- **Search and Filter**: Quick access to specific locations
- **Layer Management**: Focus on specific types of geographic features

## Performance Benefits
- **Vector Maps**: Crisp rendering at all zoom levels
- **Efficient Loading**: Only loads visible map tiles
- **Smooth Interactions**: Hardware-accelerated rendering
- **Mobile Optimized**: Touch-friendly controls and responsive design

## Future Enhancements
- **AI Integration**: Location-based queries and explanations
- **Custom Overlays**: Historical periods, climate zones, economic data
- **3D Visualization**: Terrain and elevation data
- **Offline Support**: Cached maps for offline study
- **Quiz Integration**: Location-based quiz questions

## Troubleshooting

### Common Issues
1. **Map not loading**: Check if Mapbox token is correctly set in `.env.local`
2. **Blank map**: Ensure the token has the correct permissions
3. **Slow loading**: Check internet connection and Mapbox service status

### Token Permissions
Ensure your Mapbox token has these scopes:
- `styles:read`
- `fonts:read`
- `datasets:read`
- `vision:read`

## Migration from Previous System
The new Mapbox implementation replaces the custom SVG-based mapping system with:
- Better performance and scalability
- Professional mapping features
- Improved mobile experience
- Enhanced educational data structure
- Future-ready architecture for AI integration

All existing educational data has been preserved and enhanced with additional UPSC-relevant information.
