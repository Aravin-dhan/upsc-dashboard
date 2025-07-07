import { randomBytes, createHash } from 'crypto';
import { 
  UserSubscription, 
  PlanFeatures, 
  DEFAULT_PLAN_FEATURES,
  PLAN_PRICING 
} from '@/lib/types/coupon';
import { getDataPath, readJSONFile, writeJSONFile } from '@/lib/utils/fileSystem';

const SUBSCRIPTIONS_FILE = 'subscriptions.json';

export class SubscriptionService {
  private static instance: SubscriptionService;
  private subscriptionsPath: string;

  private constructor() {
    this.subscriptionsPath = getDataPath(SUBSCRIPTIONS_FILE);
  }

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  // Subscription CRUD operations
  public async createSubscription(
    userId: string,
    planType: 'free' | 'trial' | 'pro',
    couponCode?: string,
    discountApplied?: number
  ): Promise<UserSubscription> {
    const now = new Date().toISOString();
    const subscription: UserSubscription = {
      id: this.generateId(),
      userId,
      planType,
      status: 'active',
      startDate: now,
      couponUsed: couponCode,
      discountApplied,
      createdAt: now,
      updatedAt: now
    };

    // Set end dates based on plan type
    if (planType === 'trial') {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7); // 7-day trial
      subscription.trialEndDate = trialEnd.toISOString();
      subscription.endDate = trialEnd.toISOString();
    } else if (planType === 'pro') {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      subscription.endDate = endDate.toISOString();
      subscription.nextBillingDate = endDate.toISOString();
    }

    const subscriptions = await this.getAllSubscriptions();
    
    // Deactivate any existing active subscriptions for this user
    const userSubscriptions = subscriptions.filter(s => s.userId === userId && s.status === 'active');
    for (const existingSub of userSubscriptions) {
      existingSub.status = 'cancelled';
      existingSub.updatedAt = now;
    }

    subscriptions.push(subscription);
    await writeJSONFile(this.subscriptionsPath, subscriptions);

    return subscription;
  }

  public async getAllSubscriptions(): Promise<UserSubscription[]> {
    try {
      return await readJSONFile(this.subscriptionsPath) || [];
    } catch (error) {
      return [];
    }
  }

  public async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const subscriptions = await this.getAllSubscriptions();
    
    // Get the most recent active subscription
    const userSubscriptions = subscriptions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return userSubscriptions[0] || null;
  }

  public async getActiveUserSubscription(userId: string): Promise<UserSubscription | null> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription || subscription.status !== 'active') {
      return null;
    }

    // Check if subscription has expired
    if (subscription.endDate && new Date(subscription.endDate) <= new Date()) {
      await this.expireSubscription(subscription.id);
      return null;
    }

    return subscription;
  }

  public async updateSubscription(id: string, updates: Partial<UserSubscription>): Promise<UserSubscription> {
    const subscriptions = await this.getAllSubscriptions();
    const index = subscriptions.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription: UserSubscription = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    subscriptions[index] = updatedSubscription;
    await writeJSONFile(this.subscriptionsPath, subscriptions);

    return updatedSubscription;
  }

  public async expireSubscription(id: string): Promise<UserSubscription> {
    return await this.updateSubscription(id, { status: 'expired' });
  }

  public async cancelSubscription(id: string): Promise<UserSubscription> {
    return await this.updateSubscription(id, { status: 'cancelled' });
  }

  // Plan management
  public async upgradePlan(
    userId: string, 
    newPlanType: 'pro', 
    couponCode?: string, 
    discountApplied?: number
  ): Promise<UserSubscription> {
    const currentSubscription = await this.getUserSubscription(userId);
    
    if (currentSubscription && currentSubscription.status === 'active') {
      await this.cancelSubscription(currentSubscription.id);
    }

    return await this.createSubscription(userId, newPlanType, couponCode, discountApplied);
  }

  public async extendTrial(userId: string, extensionDays: number): Promise<UserSubscription> {
    const subscription = await this.getActiveUserSubscription(userId);
    
    if (!subscription || subscription.planType !== 'trial') {
      throw new Error('No active trial subscription found');
    }

    const currentEndDate = new Date(subscription.trialEndDate || subscription.endDate!);
    currentEndDate.setDate(currentEndDate.getDate() + extensionDays);
    
    const newEndDate = currentEndDate.toISOString();
    
    return await this.updateSubscription(subscription.id, {
      trialEndDate: newEndDate,
      endDate: newEndDate
    });
  }

  // Feature access control
  public async getUserPlanFeatures(userId: string): Promise<PlanFeatures> {
    const subscription = await this.getActiveUserSubscription(userId);
    
    if (!subscription) {
      return DEFAULT_PLAN_FEATURES.free;
    }

    return DEFAULT_PLAN_FEATURES[subscription.planType];
  }

  public async hasFeatureAccess(userId: string, feature: keyof PlanFeatures): Promise<boolean> {
    const features = await this.getUserPlanFeatures(userId);
    const featureValue = features[feature];
    
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    if (featureValue === 'unlimited') {
      return true;
    }
    
    if (typeof featureValue === 'number') {
      return featureValue > 0;
    }
    
    return false;
  }

  public async getUserPlanType(userId: string): Promise<'free' | 'trial' | 'pro'> {
    const subscription = await this.getActiveUserSubscription(userId);
    return subscription?.planType || 'free';
  }

  // Analytics and reporting
  public async getSubscriptionStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    cancelled: number;
    byPlan: Record<string, number>;
    revenue: number;
    trialConversions: number;
  }> {
    const subscriptions = await this.getAllSubscriptions();
    
    const stats = {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      expired: subscriptions.filter(s => s.status === 'expired').length,
      cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
      byPlan: {} as Record<string, number>,
      revenue: 0,
      trialConversions: 0
    };

    // Count by plan type
    subscriptions.forEach(sub => {
      stats.byPlan[sub.planType] = (stats.byPlan[sub.planType] || 0) + 1;
      
      // Calculate revenue (simplified - assumes monthly billing)
      if (sub.planType === 'pro' && sub.status === 'active') {
        const basePrice = PLAN_PRICING.pro.monthly;
        const actualPrice = sub.discountApplied ? basePrice - sub.discountApplied : basePrice;
        stats.revenue += actualPrice;
      }
    });

    // Calculate trial conversions
    const trialUsers = subscriptions.filter(s => s.planType === 'trial').map(s => s.userId);
    const convertedUsers = subscriptions.filter(s => 
      s.planType === 'pro' && trialUsers.includes(s.userId)
    );
    stats.trialConversions = convertedUsers.length;

    return stats;
  }

  // Utility methods
  private generateId(): string {
    return createHash('md5').update(randomBytes(16)).digest('hex');
  }

  // Cleanup expired subscriptions
  public async cleanupExpiredSubscriptions(): Promise<number> {
    const subscriptions = await this.getAllSubscriptions();
    const now = new Date();
    let expiredCount = 0;

    for (const subscription of subscriptions) {
      if (
        subscription.status === 'active' &&
        subscription.endDate &&
        new Date(subscription.endDate) <= now
      ) {
        await this.expireSubscription(subscription.id);
        expiredCount++;
      }
    }

    return expiredCount;
  }
}
