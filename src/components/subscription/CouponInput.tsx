'use client';

import { useState, useEffect } from 'react';
import { Tag, Check, X, Loader2, AlertCircle } from 'lucide-react';

interface CouponValidation {
  isValid: boolean;
  coupon?: {
    code: string;
    description: string;
    type: string;
    value: number;
  };
  pricing?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    savings: number;
    currency: string;
  };
  error?: string;
  warnings?: string[];
}

interface CouponInputProps {
  planType: string;
  billingCycle?: string;
  onCouponApplied?: (validation: CouponValidation | null) => void;
  initialCoupon?: string;
  className?: string;
}

const CouponInput: React.FC<CouponInputProps> = ({
  planType,
  billingCycle = 'monthly',
  onCouponApplied,
  initialCoupon = '',
  className = ''
}) => {
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [couponValidation, setCouponValidation] = useState<CouponValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showInput, setShowInput] = useState(!!initialCoupon);

  // Validate coupon code
  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      setCouponValidation(null);
      onCouponApplied?.(null);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          planType,
          billingCycle
        }),
      });

      const data = await response.json();
      
      if (data.success && data.isValid) {
        const validation: CouponValidation = {
          isValid: true,
          coupon: data.coupon,
          pricing: data.pricing,
          warnings: data.warnings
        };
        setCouponValidation(validation);
        onCouponApplied?.(validation);
      } else {
        const validation: CouponValidation = {
          isValid: false,
          error: data.error || 'Invalid coupon code'
        };
        setCouponValidation(validation);
        onCouponApplied?.(null);
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      const validation: CouponValidation = {
        isValid: false,
        error: 'Failed to validate coupon. Please try again.'
      };
      setCouponValidation(validation);
      onCouponApplied?.(null);
    } finally {
      setIsValidating(false);
    }
  };

  // Debounced coupon validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (couponCode.trim()) {
        validateCoupon(couponCode);
      } else {
        setCouponValidation(null);
        onCouponApplied?.(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [couponCode, planType, billingCycle]);

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponValidation(null);
    onCouponApplied?.(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Tag className="h-4 w-4" />
          <span>Have a coupon code?</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
            <button
              onClick={() => setShowInput(false)}
              className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {couponValidation && (
            <div className={`p-4 rounded-lg border ${
              couponValidation.isValid 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              {couponValidation.isValid ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 dark:text-green-200 font-semibold">
                          Coupon Applied Successfully!
                        </span>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                        {couponValidation.coupon?.description}
                      </p>
                      {couponValidation.pricing && (
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-green-700 dark:text-green-300">Original Price:</span>
                              <span className="font-medium text-green-800 dark:text-green-200 ml-2">
                                ₹{couponValidation.pricing.originalAmount}
                              </span>
                            </div>
                            <div>
                              <span className="text-green-700 dark:text-green-300">Discount:</span>
                              <span className="font-medium text-green-800 dark:text-green-200 ml-2">
                                -₹{couponValidation.pricing.discountAmount}
                              </span>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-green-200 dark:border-green-700">
                              <span className="text-green-700 dark:text-green-300">Final Price:</span>
                              <span className="font-bold text-green-800 dark:text-green-200 ml-2 text-lg">
                                ₹{couponValidation.pricing.finalAmount}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                              You save ₹{couponValidation.pricing.savings}!
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="ml-2 p-1 text-green-600 hover:text-green-700 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {couponValidation.warnings && couponValidation.warnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-yellow-700 dark:text-yellow-300 text-sm">
                          {couponValidation.warnings.map((warning, index) => (
                            <p key={index}>{warning}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-200 font-medium">
                    {couponValidation.error}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponInput;
