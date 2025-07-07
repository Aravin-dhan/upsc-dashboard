'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Calendar, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Subscription {
  id: string;
  planType: string;
  status: string;
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  nextBillingDate?: string;
  couponUsed?: string;
  discountApplied?: number;
}

interface PlanFeatures {
  aiAssistant: boolean;
  questionBank: boolean;
  analytics: boolean;
  currentAffairs: boolean;
  goalTracking: boolean;
  prioritySupport: boolean;
  offlineAccess: boolean;
  exportData: boolean;
}

interface SubscriptionData {
  subscription: Subscription | null;
  planType: string;
  features: PlanFeatures;
}

const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();
        
        if (data.success) {
          setSubscriptionData({
            subscription: data.subscription,
            planType: data.planType,
            features: data.features
          });
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Unable to load subscription information</p>
        </div>
      </div>
    );
  }

  const { subscription, planType, features } = subscriptionData;
  
  const getPlanIcon = () => {
    switch (planType) {
      case 'pro':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'trial':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPlanColor = () => {
    switch (planType) {
      case 'pro':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'trial':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isTrialExpiringSoon = () => {
    if (!subscription?.trialEndDate) return false;
    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  };

  const getTrialDaysLeft = () => {
    if (!subscription?.trialEndDate) return 0;
    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    return Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className={`rounded-lg shadow-sm border p-6 ${getPlanColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getPlanIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {planType} Plan
            </h3>
            {subscription?.status && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {subscription.status}
              </span>
            )}
          </div>
        </div>
        
        {planType !== 'pro' && (
          <a
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade
          </a>
        )}
      </div>

      {/* Trial Information */}
      {planType === 'trial' && subscription?.trialEndDate && (
        <div className={`mb-4 p-3 rounded-lg ${
          isTrialExpiringSoon() 
            ? 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
            : 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock className={`h-4 w-4 ${isTrialExpiringSoon() ? 'text-yellow-600' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${
              isTrialExpiringSoon() 
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {getTrialDaysLeft()} days left in trial
            </span>
          </div>
          <p className={`text-xs mt-1 ${
            isTrialExpiringSoon() 
              ? 'text-yellow-700 dark:text-yellow-300'
              : 'text-blue-700 dark:text-blue-300'
          }`}>
            Trial ends on {formatDate(subscription.trialEndDate)}
          </p>
        </div>
      )}

      {/* Subscription Details */}
      {subscription && (
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {subscription.startDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Started: {formatDate(subscription.startDate)}</span>
            </div>
          )}
          
          {subscription.nextBillingDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Next billing: {formatDate(subscription.nextBillingDate)}</span>
            </div>
          )}
          
          {subscription.couponUsed && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Coupon applied: {subscription.couponUsed}</span>
              {subscription.discountApplied && (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  (₹{subscription.discountApplied} saved)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Feature Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Plan Features</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center space-x-1 ${features.aiAssistant ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="h-3 w-3" />
            <span>AI Assistant</span>
          </div>
          <div className={`flex items-center space-x-1 ${features.analytics ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="h-3 w-3" />
            <span>Analytics</span>
          </div>
          <div className={`flex items-center space-x-1 ${features.questionBank ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="h-3 w-3" />
            <span>Question Bank</span>
          </div>
          <div className={`flex items-center space-x-1 ${features.prioritySupport ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="h-3 w-3" />
            <span>Priority Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
