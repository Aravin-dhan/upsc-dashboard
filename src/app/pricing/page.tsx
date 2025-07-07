'use client';

import { useState } from 'react';
import { Check, X, Star, Zap, Crown, Users, ChevronRight, HelpCircle } from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showFAQ, setShowFAQ] = useState<number | null>(null);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started with UPSC preparation',
      price: { monthly: 0, yearly: 0 },
      icon: Users,
      color: 'gray',
      popular: false,
      features: [
        'Basic AI Assistant (10 queries/day)',
        'Limited Question Bank (50 questions)',
        'Basic Study Calendar',
        'Community Access',
        'Mobile App Access',
        'Email Support'
      ],
      limitations: [
        'No Advanced Analytics',
        'No Interactive Maps',
        'No Current Affairs Hub',
        'No Goal Tracking',
        'No Priority Support'
      ],
      cta: 'Get Started Free',
      href: '/signup'
    },
    {
      name: 'Pro',
      description: 'Complete UPSC preparation toolkit for serious aspirants',
      price: { monthly: 200, yearly: 2000 },
      icon: Zap,
      color: 'blue',
      popular: true,
      features: [
        'Unlimited AI Assistant',
        'Complete Question Bank (420+ questions)',
        'Interactive Geography Maps',
        'Advanced Performance Analytics',
        'Current Affairs Hub',
        'Smart Study Calendar',
        'Goal Setting & Tracking',
        'Time Management Tools',
        'Achievement System',
        'Priority Email Support',
        'Mobile App (iOS & Android)',
        'Offline Content Access',
        'Progress Export & Backup'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      href: '/signup?plan=pro'
    },
    {
      name: 'Enterprise',
      description: 'For coaching institutes and educational organizations',
      price: { monthly: 'Custom', yearly: 'Custom' },
      icon: Crown,
      color: 'purple',
      popular: false,
      features: [
        'Everything in Pro',
        'Multi-tenant Management',
        'Bulk User Management',
        'Custom Branding',
        'Advanced Admin Dashboard',
        'API Access',
        'Custom Integrations',
        'Dedicated Account Manager',
        'Phone & Video Support',
        'Custom Training Sessions',
        'SLA Guarantees',
        'Advanced Security Features'
      ],
      limitations: [],
      cta: 'Contact Sales',
      href: '/contact?plan=enterprise'
    }
  ];

  const faqs = [
    {
      question: 'Is there a free trial for the Pro plan?',
      answer: 'Yes! We offer a 14-day free trial for the Pro plan with full access to all features. No credit card required to start.'
    },
    {
      question: 'Can I switch between plans anytime?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes, we use enterprise-grade security with end-to-end encryption. Your study data is private and never shared with third parties.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, we\'ll provide a full refund, no questions asked.'
    },
    {
      question: 'Can I use the platform offline?',
      answer: 'Pro and Enterprise plans include offline access to downloaded content, questions, and study materials through our mobile apps.'
    },
    {
      question: 'Is there a student discount available?',
      answer: 'Yes! We offer a 20% student discount on all plans. Contact our support team with your student ID for verification.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You can export all your data before canceling. We keep your account data for 90 days after cancellation in case you want to reactivate.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (typeof plan.price.monthly === 'string') return plan.price.monthly;
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    return price === 0 ? 'Free' : `₹${price}`;
  };

  const getPeriod = () => {
    return billingCycle === 'monthly' ? '/month' : '/year';
  };

  const getSavings = () => {
    const monthlyTotal = 200 * 12; // ₹2400
    const yearlyPrice = 2000;
    const savings = monthlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent
            <span className="text-blue-600 dark:text-blue-400"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose the perfect plan for your UPSC preparation journey. 
            Start free, upgrade when you're ready.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Save {getSavings().percentage}%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                } ${plan.popular ? 'scale-105 shadow-xl' : 'shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    plan.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.color === 'blue' ? 'text-blue-600' :
                      plan.color === 'purple' ? 'text-purple-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {getPrice(plan)}
                    </span>
                    {typeof plan.price.monthly === 'number' && plan.price.monthly > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">
                        {getPeriod()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={plan.href}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <button
                  onClick={() => setShowFAQ(showFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <HelpCircle className={`h-5 w-5 text-gray-500 transform transition-transform ${
                    showFAQ === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {showFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your UPSC Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful aspirants. Start with our free plan today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
