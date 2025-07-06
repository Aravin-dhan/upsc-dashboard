#!/bin/bash

# 🚀 UPSC Dashboard Production Deployment Script
# This script prepares your application for production deployment

set -e  # Exit on any error

echo "🚀 Starting UPSC Dashboard Production Deployment Preparation..."

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

print_status "Checking Node.js and npm versions..."
node --version
npm --version

# Install dependencies
print_status "Installing production dependencies..."
npm ci --only=production

# Generate JWT secret if not exists
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local file..."
    cp .env.example .env.local
    
    # Generate secure JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/your-super-secret-jwt-key-minimum-32-characters-long/$JWT_SECRET/" .env.local
    rm .env.local.bak
    
    print_success "Generated secure JWT secret"
    print_warning "Please update NEXTAUTH_URL in .env.local with your production domain"
fi

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check || {
    print_warning "TypeScript errors found, but continuing with deployment..."
}

# Run production build test
print_status "Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Production build successful!"
else
    print_error "Production build failed. Please fix errors before deploying."
    exit 1
fi

# Clean up build artifacts for fresh deployment
print_status "Cleaning up for deployment..."
rm -rf .next/cache

# Create deployment checklist
print_status "Creating deployment checklist..."
cat > DEPLOYMENT_CHECKLIST.md << EOF
# 📋 Pre-Deployment Checklist

## ✅ Required Steps Before Deployment

### Environment Variables
- [ ] NEXTAUTH_SECRET is set (32+ character random string)
- [ ] NEXTAUTH_URL is set to your production domain
- [ ] NODE_ENV is set to "production"
- [ ] Admin credentials are configured

### Code Preparation
- [ ] All code is committed to Git
- [ ] Production build passes successfully
- [ ] TypeScript errors are resolved (or acknowledged)
- [ ] All tests pass

### Vercel Deployment
- [ ] Vercel account is created
- [ ] Repository is connected to Vercel
- [ ] Environment variables are set in Vercel dashboard
- [ ] Custom domain is configured (if applicable)

### Post-Deployment Verification
- [ ] Application loads correctly
- [ ] Authentication system works
- [ ] AI Assistant responds
- [ ] All pages are accessible
- [ ] Mobile responsiveness verified
- [ ] Performance is acceptable (< 3s load times)

## 🚀 Ready for Deployment!

Your UPSC Dashboard is ready for production deployment to Vercel.
Follow the instructions in DEPLOYMENT_INSTRUCTIONS.md for step-by-step guidance.
EOF

print_success "Deployment checklist created: DEPLOYMENT_CHECKLIST.md"

# Display final instructions
echo ""
echo "🎉 Production deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review and update .env.local with your production values"
echo "2. Commit all changes to Git"
echo "3. Follow DEPLOYMENT_INSTRUCTIONS.md for Vercel deployment"
echo "4. Use DEPLOYMENT_CHECKLIST.md to verify everything is ready"
echo ""
echo "🔗 Quick Deploy to Vercel:"
echo "   1. Go to https://vercel.com/new"
echo "   2. Import your GitHub repository"
echo "   3. Add environment variables from .env.local"
echo "   4. Deploy!"
echo ""
print_success "Your UPSC Dashboard is ready for the world! 🌍"
