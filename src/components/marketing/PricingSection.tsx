'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Star, Zap, Crown, Users } from 'lucide-react';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free Trial',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      badge: null,
      icon: Star,
      features: [
        '7-day full access',
        'Access to study materials',
        'Basic practice tests',
        'Limited progress tracking',
        'Basic analytics dashboard',
        'AI Assistant (10 queries/day)',
        'Community forum access'
      ],
      limitations: [
        'Limited practice tests',
        'Basic analytics only',
        'No custom study plans'
      ],
      cta: 'Start Free Trial',
      ctaStyle: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600',
      popular: false
    },
    {
      name: 'Pro',
      description: 'For serious UPSC aspirants',
      price: { monthly: 200, annual: 200 },
      badge: 'Most Popular',
      icon: Zap,
      features: [
        'Unlimited practice tests & mock series',
        'Personalized study plans',
        'Advanced progress analytics',
        'Interactive India map',
        'Current affairs with UPSC relevance',
        'Performance predictions',
        'Custom revision schedules',
        'Offline content access',
        'Unlimited AI Assistant access',
        'Priority support'
      ],
      limitations: [],
      cta: 'Start Pro Plan',
      ctaStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For coaching institutes & organizations',
      price: { monthly: 'Custom', annual: 'Custom' },
      badge: 'Best Value',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Multi-tenant management',
        'Bulk user management',
        'Custom branding',
        'Advanced analytics dashboard',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solutions',
        'Priority feature requests',
        'Custom reporting',
        'SSO integration'
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. No questions asked.'
    },
    {
      question: 'Do you offer student discounts?',
      answer: 'Yes, we offer 20% discount for verified students. Contact support with your student ID.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, and net banking.'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Success Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Start with our free trial and upgrade when you're ready. 
            All plans include our core features with varying levels of access.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <plan.icon className={`h-8 w-8 ${
                        plan.popular ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    {typeof plan.price.monthly === 'number' ? (
                      <div>
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ₹{isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-gray-600 dark:text-gray-300 ml-2">
                            /{isAnnual ? 'month' : 'month'}
                          </span>
                        )}
                        {isAnnual && plan.price.monthly > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Billed annually (₹{plan.price.annual * 12})
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price.monthly}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Compare All Features
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 text-gray-900 dark:text-white font-semibold">Features</th>
                  <th className="text-center py-4 text-gray-900 dark:text-white font-semibold">Free</th>
                  <th className="text-center py-4 text-gray-900 dark:text-white font-semibold">Pro</th>
                  <th className="text-center py-4 text-gray-900 dark:text-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: 'AI Assistant Queries', free: '10/day', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Study Materials', free: 'Basic', pro: 'Full Access', enterprise: 'Full Access + Custom' },
                  { feature: 'Mock Tests', free: '3 tests', pro: '50+ tests', enterprise: 'Unlimited + Custom' },
                  { feature: 'Analytics', free: 'Basic', pro: 'Advanced', enterprise: 'Enterprise Dashboard' },
                  { feature: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated Manager' }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="py-4 text-gray-900 dark:text-white font-medium">{row.feature}</td>
                    <td className="py-4 text-center text-gray-600 dark:text-gray-300">{row.free}</td>
                    <td className="py-4 text-center text-gray-600 dark:text-gray-300">{row.pro}</td>
                    <td className="py-4 text-center text-gray-600 dark:text-gray-300">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="text-left">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
