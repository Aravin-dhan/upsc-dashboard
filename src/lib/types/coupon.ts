// Comprehensive coupon management types and interfaces
export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'trial_extension' | 'upgrade_promo';
  value: number; // percentage (1-100) or fixed amount in INR
  minAmount?: number; // minimum purchase amount required
  maxDiscount?: number; // maximum discount amount for percentage coupons
  usageLimit?: number; // total usage limit across all users
  userUsageLimit?: number; // usage limit per user
  usedCount: number;
  isActive: boolean;
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  eligibleRoles?: string[]; // roles that can use this coupon
  eligiblePlans?: string[]; // plans this coupon applies to
  createdBy: string; // admin user ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  metadata?: {
    campaign?: string;
    source?: string;
    notes?: string;
  };
}

export interface CouponUsage {
  id: string;
  couponId: string;
  couponCode: string;
  userId: string;
  userEmail: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  planType: string;
  usedAt: string; // ISO date string
  ipAddress?: string;
  userAgent?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number;
  finalAmount?: number;
  warnings?: string[];
}

export interface CouponStats {
  total: number;
  active: number;
  expired: number;
  inactive: number;
  totalUsage: number;
  totalSavings: number;
  averageDiscount: number;
  topCoupons: Array<{
    code: string;
    usageCount: number;
    totalSavings: number;
  }>;
  usageByMonth: Array<{
    month: string;
    usage: number;
    savings: number;
  }>;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planType: 'free' | 'trial' | 'pro';
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  trialEndDate?: string; // ISO date string for trial users
  paymentMethod?: string;
  lastPaymentDate?: string;
  nextBillingDate?: string;
  couponUsed?: string; // coupon code used for this subscription
  discountApplied?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatures {
  aiQueriesPerDay: number | 'unlimited';
  questionBankAccess: number | 'unlimited';
  advancedAnalytics: boolean;
  interactiveMaps: boolean;
  currentAffairsHub: boolean;
  goalTracking: boolean;
  prioritySupport: boolean;
  offlineAccess: boolean;
  progressExport: boolean;
  customStudyPlans: boolean;
  mockTestSeries: boolean;
  performancePredictions: boolean;
}

export interface PlanConfig {
  free: PlanFeatures;
  trial: PlanFeatures;
  pro: PlanFeatures;
}

export interface CouponFormData {
  code: string;
  description: string;
  type: Coupon['type'];
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  userUsageLimit?: number;
  validFrom: string;
  validUntil: string;
  eligibleRoles?: string[];
  eligiblePlans?: string[];
  metadata?: Coupon['metadata'];
}

export interface CouponGenerationOptions {
  prefix?: string;
  suffix?: string;
  length?: number;
  includeNumbers?: boolean;
  includeLetters?: boolean;
  excludeSimilar?: boolean; // exclude similar looking characters like 0/O, 1/I
}

// API Response types
export interface CouponAPIResponse {
  success: boolean;
  coupon?: Coupon;
  coupons?: Coupon[];
  stats?: CouponStats;
  usage?: CouponUsage[];
  error?: string;
  message?: string;
}

export interface SubscriptionAPIResponse {
  success: boolean;
  subscription?: UserSubscription;
  subscriptions?: UserSubscription[];
  error?: string;
  message?: string;
}

// Validation schemas
export const COUPON_VALIDATION_RULES = {
  code: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[A-Z0-9\-_]+$/,
    reservedCodes: ['TEST', 'ADMIN', 'SYSTEM', 'DEFAULT']
  },
  description: {
    minLength: 10,
    maxLength: 200
  },
  value: {
    percentage: { min: 1, max: 100 },
    fixed: { min: 1, max: 10000 }
  },
  usageLimit: {
    min: 1,
    max: 100000
  },
  userUsageLimit: {
    min: 1,
    max: 100
  }
} as const;

export const PLAN_PRICING = {
  free: { monthly: 0, yearly: 0 },
  trial: { monthly: 0, yearly: 0 },
  pro: { monthly: 200, yearly: 2000 }
} as const;

export const DEFAULT_PLAN_FEATURES: PlanConfig = {
  free: {
    aiQueriesPerDay: 10,
    questionBankAccess: 50,
    advancedAnalytics: false,
    interactiveMaps: false,
    currentAffairsHub: false,
    goalTracking: false,
    prioritySupport: false,
    offlineAccess: false,
    progressExport: false,
    customStudyPlans: false,
    mockTestSeries: false,
    performancePredictions: false
  },
  trial: {
    aiQueriesPerDay: 'unlimited',
    questionBankAccess: 'unlimited',
    advancedAnalytics: true,
    interactiveMaps: true,
    currentAffairsHub: true,
    goalTracking: true,
    prioritySupport: false,
    offlineAccess: true,
    progressExport: true,
    customStudyPlans: true,
    mockTestSeries: true,
    performancePredictions: true
  },
  pro: {
    aiQueriesPerDay: 'unlimited',
    questionBankAccess: 'unlimited',
    advancedAnalytics: true,
    interactiveMaps: true,
    currentAffairsHub: true,
    goalTracking: true,
    prioritySupport: true,
    offlineAccess: true,
    progressExport: true,
    customStudyPlans: true,
    mockTestSeries: true,
    performancePredictions: true
  }
};
