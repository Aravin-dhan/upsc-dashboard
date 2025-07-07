'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import HeroSection from './HeroSection';
import FeatureShowcase from './FeatureShowcase';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import Footer from './Footer';
import PublicNavbar from './PublicNavbar';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render landing page for authenticated users
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      <HeroSection />
      <FeatureShowcase />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
