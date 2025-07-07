import { randomBytes, createHash } from 'crypto';
import { 
  Coupon, 
  CouponUsage, 
  CouponValidationResult, 
  CouponStats, 
  CouponFormData,
  CouponGenerationOptions,
  COUPON_VALIDATION_RULES,
  PLAN_PRICING
} from '@/lib/types/coupon';
import { getDataPath, readJSONFile, writeJSONFile } from '@/lib/utils/fileSystem';

const COUPONS_FILE = 'coupons.json';
const COUPON_USAGE_FILE = 'coupon-usage.json';

export class CouponService {
  private static instance: CouponService;
  private couponsPath: string;
  private usagePath: string;

  private constructor() {
    this.couponsPath = getDataPath(COUPONS_FILE);
    this.usagePath = getDataPath(COUPON_USAGE_FILE);
  }

  public static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService();
    }
    return CouponService.instance;
  }

  // Coupon generation
  public generateCouponCode(options: CouponGenerationOptions = {}): string {
    const {
      prefix = 'UPSC',
      suffix = '',
      length = 8,
      includeNumbers = true,
      includeLetters = true,
      excludeSimilar = true
    } = options;

    let chars = '';
    if (includeLetters) {
      chars += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (includeNumbers) {
      chars += excludeSimilar ? '23456789' : '0123456789';
    }

    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const fullCode = `${prefix}${prefix ? '-' : ''}${code}${suffix ? '-' + suffix : ''}`;
    return fullCode.toUpperCase();
  }

  // Validation
  public validateCouponData(data: CouponFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const rules = COUPON_VALIDATION_RULES;

    // Code validation
    if (!data.code || data.code.length < rules.code.minLength) {
      errors.push(`Coupon code must be at least ${rules.code.minLength} characters long`);
    }
    if (data.code && data.code.length > rules.code.maxLength) {
      errors.push(`Coupon code must be no more than ${rules.code.maxLength} characters long`);
    }
    if (data.code && !rules.code.pattern.test(data.code)) {
      errors.push('Coupon code can only contain uppercase letters, numbers, hyphens, and underscores');
    }
    if (data.code && rules.code.reservedCodes.includes(data.code.toUpperCase())) {
      errors.push('This coupon code is reserved and cannot be used');
    }

    // Description validation
    if (!data.description || data.description.length < rules.description.minLength) {
      errors.push(`Description must be at least ${rules.description.minLength} characters long`);
    }
    if (data.description && data.description.length > rules.description.maxLength) {
      errors.push(`Description must be no more than ${rules.description.maxLength} characters long`);
    }

    // Value validation
    if (data.type === 'percentage') {
      if (data.value < rules.value.percentage.min || data.value > rules.value.percentage.max) {
        errors.push(`Percentage discount must be between ${rules.value.percentage.min}% and ${rules.value.percentage.max}%`);
      }
    } else if (data.type === 'fixed') {
      if (data.value < rules.value.fixed.min || data.value > rules.value.fixed.max) {
        errors.push(`Fixed discount must be between ₹${rules.value.fixed.min} and ₹${rules.value.fixed.max}`);
      }
    }

    // Date validation
    const validFrom = new Date(data.validFrom);
    const validUntil = new Date(data.validUntil);
    const now = new Date();

    if (validFrom >= validUntil) {
      errors.push('Valid from date must be before valid until date');
    }
    if (validUntil <= now) {
      errors.push('Valid until date must be in the future');
    }

    // Usage limit validation
    if (data.usageLimit && (data.usageLimit < rules.usageLimit.min || data.usageLimit > rules.usageLimit.max)) {
      errors.push(`Usage limit must be between ${rules.usageLimit.min} and ${rules.usageLimit.max}`);
    }
    if (data.userUsageLimit && (data.userUsageLimit < rules.userUsageLimit.min || data.userUsageLimit > rules.userUsageLimit.max)) {
      errors.push(`User usage limit must be between ${rules.userUsageLimit.min} and ${rules.userUsageLimit.max}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  // CRUD operations
  public async createCoupon(data: CouponFormData, createdBy: string): Promise<Coupon> {
    const validation = this.validateCouponData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check for duplicate code
    const existingCoupons = await this.getAllCoupons();
    if (existingCoupons.some(c => c.code.toLowerCase() === data.code.toLowerCase())) {
      throw new Error('A coupon with this code already exists');
    }

    const now = new Date().toISOString();
    const coupon: Coupon = {
      id: this.generateId(),
      code: data.code.toUpperCase(),
      description: data.description,
      type: data.type,
      value: data.value,
      minAmount: data.minAmount,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      userUsageLimit: data.userUsageLimit,
      usedCount: 0,
      isActive: true,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      eligibleRoles: data.eligibleRoles,
      eligiblePlans: data.eligiblePlans,
      createdBy,
      createdAt: now,
      updatedAt: now,
      metadata: data.metadata
    };

    const coupons = await this.getAllCoupons();
    coupons.push(coupon);
    await writeJSONFile(this.couponsPath, coupons);

    return coupon;
  }

  public async getAllCoupons(): Promise<Coupon[]> {
    try {
      return await readJSONFile(this.couponsPath) || [];
    } catch (error) {
      return [];
    }
  }

  public async getCouponById(id: string): Promise<Coupon | null> {
    const coupons = await this.getAllCoupons();
    return coupons.find(c => c.id === id) || null;
  }

  public async getCouponByCode(code: string): Promise<Coupon | null> {
    const coupons = await this.getAllCoupons();
    return coupons.find(c => c.code.toLowerCase() === code.toLowerCase()) || null;
  }

  public async updateCoupon(id: string, updates: Partial<CouponFormData>): Promise<Coupon> {
    const coupons = await this.getAllCoupons();
    const index = coupons.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Coupon not found');
    }

    const existingCoupon = coupons[index];
    
    // If updating code, check for duplicates
    if (updates.code && updates.code.toLowerCase() !== existingCoupon.code.toLowerCase()) {
      if (coupons.some(c => c.id !== id && c.code.toLowerCase() === updates.code!.toLowerCase())) {
        throw new Error('A coupon with this code already exists');
      }
    }

    // Validate updates
    if (Object.keys(updates).length > 0) {
      const dataToValidate = { ...existingCoupon, ...updates } as CouponFormData;
      const validation = this.validateCouponData(dataToValidate);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
    }

    const updatedCoupon: Coupon = {
      ...existingCoupon,
      ...updates,
      code: updates.code ? updates.code.toUpperCase() : existingCoupon.code,
      updatedAt: new Date().toISOString()
    };

    coupons[index] = updatedCoupon;
    await writeJSONFile(this.couponsPath, coupons);

    return updatedCoupon;
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    const coupons = await this.getAllCoupons();
    const filteredCoupons = coupons.filter(c => c.id !== id);
    
    if (filteredCoupons.length === coupons.length) {
      return false; // Coupon not found
    }

    await writeJSONFile(this.couponsPath, filteredCoupons);
    return true;
  }

  // Coupon validation and application
  public async validateCoupon(
    code: string,
    userId: string,
    userRole: string,
    planType: string,
    amount: number
  ): Promise<CouponValidationResult> {
    const coupon = await this.getCouponByCode(code);

    if (!coupon) {
      return { isValid: false, error: 'Coupon code not found' };
    }

    if (!coupon.isActive) {
      return { isValid: false, error: 'This coupon is no longer active' };
    }

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom) {
      return { isValid: false, error: 'This coupon is not yet valid' };
    }

    if (now > validUntil) {
      return { isValid: false, error: 'This coupon has expired' };
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { isValid: false, error: 'This coupon has reached its usage limit' };
    }

    // Check user usage limit
    if (coupon.userUsageLimit) {
      const userUsage = await this.getUserCouponUsage(userId, coupon.id);
      if (userUsage >= coupon.userUsageLimit) {
        return { isValid: false, error: 'You have reached the usage limit for this coupon' };
      }
    }

    // Check role eligibility
    if (coupon.eligibleRoles && !coupon.eligibleRoles.includes(userRole)) {
      return { isValid: false, error: 'This coupon is not available for your account type' };
    }

    // Check plan eligibility
    if (coupon.eligiblePlans && !coupon.eligiblePlans.includes(planType)) {
      return { isValid: false, error: 'This coupon is not applicable to your selected plan' };
    }

    // Check minimum amount
    if (coupon.minAmount && amount < coupon.minAmount) {
      return {
        isValid: false,
        error: `Minimum purchase amount of ₹${coupon.minAmount} required for this coupon`
      };
    }

    // Calculate discount
    const { discountAmount, finalAmount } = this.calculateDiscount(coupon, amount);

    return {
      isValid: true,
      coupon,
      discountAmount,
      finalAmount,
      warnings: discountAmount === 0 ? ['No discount applied'] : undefined
    };
  }

  public calculateDiscount(coupon: Coupon, amount: number): { discountAmount: number; finalAmount: number } {
    let discountAmount = 0;

    switch (coupon.type) {
      case 'percentage':
        discountAmount = (amount * coupon.value) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
        break;
      case 'fixed':
        discountAmount = Math.min(coupon.value, amount);
        break;
      case 'trial_extension':
        // For trial extensions, no monetary discount
        discountAmount = 0;
        break;
      case 'upgrade_promo':
        // Custom logic for upgrade promotions
        discountAmount = (amount * coupon.value) / 100;
        break;
    }

    const finalAmount = Math.max(0, amount - discountAmount);
    return { discountAmount, finalAmount };
  }

  // Usage tracking
  public async recordCouponUsage(
    coupon: Coupon,
    userId: string,
    userEmail: string,
    discountAmount: number,
    originalAmount: number,
    finalAmount: number,
    planType: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<CouponUsage> {
    const usage: CouponUsage = {
      id: this.generateId(),
      couponId: coupon.id,
      couponCode: coupon.code,
      userId,
      userEmail,
      discountAmount,
      originalAmount,
      finalAmount,
      planType,
      usedAt: new Date().toISOString(),
      ipAddress,
      userAgent
    };

    // Save usage record
    const allUsage = await this.getAllUsage();
    allUsage.push(usage);
    await writeJSONFile(this.usagePath, allUsage);

    // Update coupon used count
    await this.incrementCouponUsage(coupon.id);

    return usage;
  }

  private async incrementCouponUsage(couponId: string): Promise<void> {
    const coupons = await this.getAllCoupons();
    const index = coupons.findIndex(c => c.id === couponId);

    if (index !== -1) {
      coupons[index].usedCount += 1;
      coupons[index].updatedAt = new Date().toISOString();
      await writeJSONFile(this.couponsPath, coupons);
    }
  }

  private async getUserCouponUsage(userId: string, couponId: string): Promise<number> {
    const allUsage = await this.getAllUsage();
    return allUsage.filter(u => u.userId === userId && u.couponId === couponId).length;
  }

  // Utility methods
  private generateId(): string {
    return createHash('md5').update(randomBytes(16)).digest('hex');
  }

  private async getAllUsage(): Promise<CouponUsage[]> {
    try {
      return await readJSONFile(this.usagePath) || [];
    } catch (error) {
      return [];
    }
  }

  // Statistics and analytics
  public async getCouponStats(): Promise<CouponStats> {
    const coupons = await this.getAllCoupons();
    const usage = await this.getAllUsage();
    const now = new Date();

    const stats: CouponStats = {
      total: coupons.length,
      active: coupons.filter(c => c.isActive && new Date(c.validUntil) > now).length,
      expired: coupons.filter(c => new Date(c.validUntil) <= now).length,
      inactive: coupons.filter(c => !c.isActive).length,
      totalUsage: usage.length,
      totalSavings: usage.reduce((sum, u) => sum + u.discountAmount, 0),
      averageDiscount: usage.length > 0 ? usage.reduce((sum, u) => sum + u.discountAmount, 0) / usage.length : 0,
      topCoupons: this.getTopCoupons(coupons, usage),
      usageByMonth: this.getUsageByMonth(usage)
    };

    return stats;
  }

  private getTopCoupons(coupons: Coupon[], usage: CouponUsage[]): Array<{ code: string; usageCount: number; totalSavings: number }> {
    const couponMap = new Map<string, { code: string; usageCount: number; totalSavings: number }>();

    coupons.forEach(coupon => {
      couponMap.set(coupon.id, {
        code: coupon.code,
        usageCount: 0,
        totalSavings: 0
      });
    });

    usage.forEach(u => {
      const couponData = couponMap.get(u.couponId);
      if (couponData) {
        couponData.usageCount += 1;
        couponData.totalSavings += u.discountAmount;
      }
    });

    return Array.from(couponMap.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);
  }

  private getUsageByMonth(usage: CouponUsage[]): Array<{ month: string; usage: number; savings: number }> {
    const monthMap = new Map<string, { usage: number; savings: number }>();

    usage.forEach(u => {
      const date = new Date(u.usedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { usage: 0, savings: 0 });
      }

      const monthData = monthMap.get(monthKey)!;
      monthData.usage += 1;
      monthData.savings += u.discountAmount;
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  public async getCouponUsageHistory(couponId?: string, userId?: string): Promise<CouponUsage[]> {
    const allUsage = await this.getAllUsage();

    let filteredUsage = allUsage;

    if (couponId) {
      filteredUsage = filteredUsage.filter(u => u.couponId === couponId);
    }

    if (userId) {
      filteredUsage = filteredUsage.filter(u => u.userId === userId);
    }

    return filteredUsage.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
  }

  // Bulk operations
  public async toggleCouponStatus(id: string): Promise<Coupon> {
    const coupon = await this.getCouponById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    return await this.updateCoupon(id, { isActive: !coupon.isActive });
  }

  public async bulkUpdateCoupons(ids: string[], updates: Partial<CouponFormData>): Promise<Coupon[]> {
    const updatedCoupons: Coupon[] = [];

    for (const id of ids) {
      try {
        const updated = await this.updateCoupon(id, updates);
        updatedCoupons.push(updated);
      } catch (error) {
        // Continue with other coupons even if one fails
        console.error(`Failed to update coupon ${id}:`, error);
      }
    }

    return updatedCoupons;
  }

  public async getExpiredCoupons(): Promise<Coupon[]> {
    const coupons = await this.getAllCoupons();
    const now = new Date();

    return coupons.filter(c => new Date(c.validUntil) <= now);
  }

  public async getActiveCoupons(): Promise<Coupon[]> {
    const coupons = await this.getAllCoupons();
    const now = new Date();

    return coupons.filter(c =>
      c.isActive &&
      new Date(c.validFrom) <= now &&
      new Date(c.validUntil) > now &&
      (!c.usageLimit || c.usedCount < c.usageLimit)
    );
  }
}
