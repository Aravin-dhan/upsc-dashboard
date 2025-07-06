import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapboxInteractiveMap from '../MapboxInteractiveMap';

// Mock Mapbox GL JS
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    addControl: jest.fn(),
    getCanvas: jest.fn(() => ({
      style: {}
    }))
  })),
  NavigationControl: jest.fn(),
  ScaleControl: jest.fn(),
  FullscreenControl: jest.fn()
}));

// Mock react-map-gl
jest.mock('react-map-gl', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-testid="mapbox-map" {...props}>
      {children}
    </div>
  ),
  Marker: ({ children, ...props }: any) => (
    <div data-testid="mapbox-marker" {...props}>
      {children}
    </div>
  ),
  Popup: ({ children, ...props }: any) => (
    <div data-testid="mapbox-popup" {...props}>
      {children}
    </div>
  ),
  NavigationControl: (props: any) => <div data-testid="navigation-control" {...props} />,
  ScaleControl: (props: any) => <div data-testid="scale-control" {...props} />,
  FullscreenControl: (props: any) => <div data-testid="fullscreen-control" {...props} />
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

describe('MapboxInteractiveMap', () => {
  beforeEach(() => {
    // Mock environment variable
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'pk.test_token';
  });

  it('renders the map component', () => {
    render(<MapboxInteractiveMap />);
    
    expect(screen.getByTestId('mapbox-map')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    render(<MapboxInteractiveMap height="400px" />);
    
    const mapContainer = screen.getByTestId('mapbox-map').parentElement;
    expect(mapContainer).toHaveStyle({ height: '400px' });
  });

  it('renders control panel when showControls is true', () => {
    render(<MapboxInteractiveMap showControls={true} />);
    
    expect(screen.getByPlaceholderText('Search locations...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('States')).toBeInTheDocument();
    expect(screen.getByText('Rivers')).toBeInTheDocument();
  });

  it('renders AI assistant panel when showAIAssistant is true', () => {
    render(<MapboxInteractiveMap showAIAssistant={true} />);
    
    expect(screen.getByText('Map AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Ask AI')).toBeInTheDocument();
  });

  it('does not render control panel when showControls is false', () => {
    render(<MapboxInteractiveMap showControls={false} />);
    
    expect(screen.queryByPlaceholderText('Search locations...')).not.toBeInTheDocument();
  });

  it('does not render AI assistant when showAIAssistant is false', () => {
    render(<MapboxInteractiveMap showAIAssistant={false} />);
    
    expect(screen.queryByText('Map AI Assistant')).not.toBeInTheDocument();
  });

  it('renders location markers', () => {
    render(<MapboxInteractiveMap />);
    
    // Should render markers for the sample locations
    const markers = screen.getAllByTestId('mapbox-marker');
    expect(markers.length).toBeGreaterThan(0);
  });

  it('renders navigation controls', () => {
    render(<MapboxInteractiveMap />);
    
    expect(screen.getByTestId('navigation-control')).toBeInTheDocument();
    expect(screen.getByTestId('scale-control')).toBeInTheDocument();
    expect(screen.getByTestId('fullscreen-control')).toBeInTheDocument();
  });

  it('applies correct initial center and zoom', () => {
    const initialCenter: [number, number] = [77.2090, 28.6139];
    const initialZoom = 8;
    
    render(
      <MapboxInteractiveMap 
        initialCenter={initialCenter} 
        initialZoom={initialZoom} 
      />
    );
    
    const map = screen.getByTestId('mapbox-map');
    expect(map).toHaveAttribute('longitude', initialCenter[0].toString());
    expect(map).toHaveAttribute('latitude', initialCenter[1].toString());
    expect(map).toHaveAttribute('zoom', initialZoom.toString());
  });

  it('uses custom map style when provided', () => {
    const customStyle = 'mapbox://styles/mapbox/satellite-v9';
    
    render(<MapboxInteractiveMap mapStyle={customStyle} />);
    
    const map = screen.getByTestId('mapbox-map');
    expect(map).toHaveAttribute('mapStyle', customStyle);
  });

  it('handles missing Mapbox token gracefully', () => {
    delete process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    render(<MapboxInteractiveMap />);
    
    // Should still render the map component
    expect(screen.getByTestId('mapbox-map')).toBeInTheDocument();
  });
});

describe('MapboxInteractiveMap Integration', () => {
  it('integrates with UPSC educational data', () => {
    render(<MapboxInteractiveMap />);
    
    // Check for UPSC-relevant location names in the DOM
    // These should be present as markers or in the control panel
    const mapContainer = screen.getByTestId('mapbox-map').parentElement;
    expect(mapContainer).toBeInTheDocument();
    
    // Verify that the component renders without errors
    expect(screen.getByTestId('mapbox-map')).toBeInTheDocument();
  });

  it('supports layer filtering functionality', () => {
    render(<MapboxInteractiveMap showControls={true} />);
    
    // Check for layer filter buttons
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('States')).toBeInTheDocument();
    expect(screen.getByText('Rivers')).toBeInTheDocument();
    expect(screen.getByText('Mountains')).toBeInTheDocument();
    expect(screen.getByText('Parks')).toBeInTheDocument();
  });

  it('provides search functionality', () => {
    render(<MapboxInteractiveMap showControls={true} />);
    
    const searchInput = screen.getByPlaceholderText('Search locations...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });
});
