'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Percent, DollarSign, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Coupon, CouponType } from '@/lib/types/coupon';

interface CouponFormProps {
  coupon?: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: Partial<Coupon>) => Promise<void>;
}

interface FormData {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minAmount: number;
  maxDiscount: number;
  usageLimit: number;
  userLimit: number;
  validFrom: string;
  validUntil: string;
  eligibleRoles: string[];
  isActive: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupon, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    userLimit: 1,
    validFrom: '',
    validUntil: '',
    eligibleRoles: ['student', 'teacher'],
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewDiscount, setPreviewDiscount] = useState<number | null>(null);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minAmount: coupon.minAmount || 0,
        maxDiscount: coupon.maxDiscount || 0,
        usageLimit: coupon.usageLimit || 0,
        userLimit: coupon.userLimit || 1,
        validFrom: coupon.validFrom.split('T')[0],
        validUntil: coupon.validUntil.split('T')[0],
        eligibleRoles: coupon.eligibleRoles || ['student', 'teacher'],
        isActive: coupon.isActive
      });
    } else {
      // Reset form for new coupon
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: 0,
        minAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        userLimit: 1,
        validFrom: tomorrow.toISOString().split('T')[0],
        validUntil: nextMonth.toISOString().split('T')[0],
        eligibleRoles: ['student', 'teacher'],
        isActive: true
      });
    }
    setErrors({});
  }, [coupon, isOpen]);

  const generateCouponCode = () => {
    const prefix = formData.type === 'percentage' ? 'SAVE' : 'OFF';
    const value = formData.value > 0 ? formData.value.toString() : 'X';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${value}-${random}`;
  };

  const calculatePreview = () => {
    const baseAmount = 200; // Pro plan price
    if (formData.type === 'percentage') {
      const discount = (baseAmount * formData.value) / 100;
      const finalDiscount = formData.maxDiscount > 0 ? Math.min(discount, formData.maxDiscount) : discount;
      setPreviewDiscount(finalDiscount);
    } else if (formData.type === 'fixed') {
      setPreviewDiscount(Math.min(formData.value, baseAmount));
    } else {
      setPreviewDiscount(null);
    }
  };

  useEffect(() => {
    calculatePreview();
  }, [formData.type, formData.value, formData.maxDiscount]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Coupon code must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }

    if (formData.type === 'percentage' && formData.value > 100) {
      newErrors.value = 'Percentage cannot exceed 100%';
    }

    if (formData.minAmount < 0) {
      newErrors.minAmount = 'Minimum amount cannot be negative';
    }

    if (formData.type === 'percentage' && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'Maximum discount cannot be negative';
    }

    if (formData.usageLimit < 0) {
      newErrors.usageLimit = 'Usage limit cannot be negative';
    }

    if (formData.userLimit <= 0) {
      newErrors.userLimit = 'User limit must be at least 1';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'Start date is required';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'End date is required';
    }

    if (formData.validFrom && formData.validUntil && formData.validFrom >= formData.validUntil) {
      newErrors.validUntil = 'End date must be after start date';
    }

    if (formData.eligibleRoles.length === 0) {
      newErrors.eligibleRoles = 'At least one role must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const couponData: Partial<Coupon> = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        minAmount: formData.minAmount || undefined,
        maxDiscount: formData.maxDiscount || undefined,
        usageLimit: formData.usageLimit || undefined,
      };

      await onSave(couponData);
      onClose();
    } catch (error) {
      console.error('Error saving coupon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        eligibleRoles: [...prev.eligibleRoles, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        eligibleRoles: prev.eligibleRoles.filter(r => r !== role)
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {coupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter coupon code"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, code: generateCouponCode() }))}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Describe what this coupon offers"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CouponType }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount Discount</option>
                    <option value="trial_extension">Trial Extension</option>
                    <option value="upgrade_promo">Upgrade Promotion</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.type === 'percentage' ? 'Percentage (%)' : 
                     formData.type === 'trial_extension' ? 'Days' : 'Amount (₹)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min="0"
                      max={formData.type === 'percentage' ? 100 : undefined}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {formData.type === 'percentage' ? (
                        <Percent className="h-4 w-4 text-gray-400" />
                      ) : formData.type === 'trial_extension' ? (
                        <Clock className="h-4 w-4 text-gray-400" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                </div>
              </div>

              {/* Preview */}
              {previewDiscount !== null && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 dark:text-blue-200 font-medium">Preview</span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    On Pro plan (₹200): Customer pays ₹{200 - previewDiscount} (saves ₹{previewDiscount})
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
