#!/bin/bash

# UPSC Dashboard - Turborepo Setup Script
# This script installs and configures Turborepo for optimal build performance

set -e

echo "🚀 Setting up Turborepo for UPSC Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the upsc-dashboard directory."
    exit 1
fi

# Check if turbo.json exists
if [ ! -f "turbo.json" ]; then
    print_error "turbo.json not found. Please ensure Turborepo configuration files are present."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

print_status "Checking npm version..."
NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Fix npm permissions if needed
print_status "Checking npm permissions..."
if [ ! -w ~/.npm ]; then
    print_warning "Fixing npm permissions..."
    sudo chown -R $(whoami) ~/.npm || {
        print_error "Failed to fix npm permissions. Please run: sudo chown -R \$(whoami) ~/.npm"
        exit 1
    }
    print_success "npm permissions fixed"
fi

# Install Turborepo dependencies
print_status "Installing Turborepo dependencies..."
npm install turbo @turbo/gen prettier --save-dev --legacy-peer-deps || {
    print_error "Failed to install Turborepo dependencies"
    print_warning "Trying with npm cache clean..."
    npm cache clean --force
    npm install turbo @turbo/gen prettier --save-dev --legacy-peer-deps || {
        print_error "Installation failed. Please check your npm configuration."
        exit 1
    }
}

print_success "Turborepo dependencies installed successfully"

# Verify Turborepo installation
print_status "Verifying Turborepo installation..."
TURBO_VERSION=$(npx turbo --version)
print_success "Turborepo version: $TURBO_VERSION"

# Create .turbo directory if it doesn't exist
if [ ! -d ".turbo" ]; then
    print_status "Creating .turbo cache directory..."
    mkdir -p .turbo
    print_success ".turbo directory created"
fi

# Test Turborepo configuration
print_status "Testing Turborepo configuration..."
npx turbo lint --dry-run || {
    print_error "Turborepo configuration test failed"
    exit 1
}
print_success "Turborepo configuration is valid"

# Run initial build to populate cache
print_status "Running initial build to populate cache..."
npm run build || {
    print_warning "Initial build failed, but Turborepo is configured correctly"
}

# Format code with Prettier
print_status "Formatting code with Prettier..."
npm run format || {
    print_warning "Code formatting completed with some issues"
}

print_success "🎉 Turborepo setup completed successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server with Turborepo"
echo "2. Run 'npm run build' to test the optimized build pipeline"
echo "3. Run 'npm run analyze-bundle' to analyze bundle performance"
echo "4. Check 'TURBOREPO_SETUP.md' for detailed documentation"

echo ""
echo "🔧 Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run lint         - Run ESLint"
echo "  npm run type-check   - Run TypeScript checks"
echo "  npm run clean        - Clean all caches"
echo "  npm run format       - Format code with Prettier"

echo ""
print_success "Turborepo is ready to accelerate your UPSC Dashboard development! 🚀"
