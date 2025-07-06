#!/bin/bash

echo "🗺️  Installing Mapbox dependencies for UPSC Dashboard..."

# Remove old leaflet dependencies if they exist
echo "📦 Removing old Leaflet dependencies..."
npm uninstall leaflet @types/leaflet 2>/dev/null || true

# Install Mapbox dependencies
echo "📦 Installing Mapbox GL JS dependencies..."
npm install mapbox-gl@^3.7.0 react-map-gl@^7.1.7 @types/mapbox-gl@^3.4.0

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Mapbox dependencies installed successfully!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Get your Mapbox access token from https://account.mapbox.com/"
    echo "2. Update .env.local with your token:"
    echo "   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token_here"
    echo "3. Update maps page to use MapboxInteractiveMap component"
    echo ""
    echo "📖 See MAPBOX_SETUP.md for detailed instructions"
else
    echo "❌ Failed to install Mapbox dependencies"
    echo "Please try running: npm install mapbox-gl react-map-gl @types/mapbox-gl"
    exit 1
fi
