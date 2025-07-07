'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlanFeatures } from '@/lib/types/coupon';
import { Crown, Lock, Zap } from 'lucide-react';

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

interface UpgradePromptProps {
  feature: string;
  className?: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, className = '' }) => (
  <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center ${className}`}>
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
        <Crown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Upgrade to Pro Required
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      This feature ({feature}) is available only with a Pro subscription. 
      Upgrade now to unlock all premium features and accelerate your UPSC preparation.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href="/pricing"
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Zap className="h-4 w-4 mr-2" />
        Upgrade to Pro
      </a>
      <a
        href="/pricing"
        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        View Plans
      </a>
    </div>
  </div>
);

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback, 
  showUpgradePrompt = true,
  className = ''
}) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/subscriptions/features?feature=${feature}`);
        const data = await response.json();
        
        if (data.success) {
          setHasAccess(data.hasAccess);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeatureAccess();
  }, [user, feature]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showUpgradePrompt) {
      return <UpgradePrompt feature={feature} className={className} />;
    }
    
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center ${className}`}>
        <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          This feature requires a Pro subscription
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default FeatureGate;
