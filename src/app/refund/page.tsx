'use client';

import { 
  CreditCard, Clock, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, Mail, Phone, Calendar, DollarSign, FileText,
  ArrowRight, Info, Shield, Users
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function RefundPage() {
  const lastUpdated = '2024-01-15';

  const refundPolicies = [
    {
      plan: 'Free Plan',
      icon: Users,
      refundable: false,
      timeframe: 'N/A',
      conditions: ['No payment required', 'No refund applicable'],
      color: 'gray'
    },
    {
      plan: 'Pro Plan (Monthly)',
      icon: CreditCard,
      refundable: true,
      timeframe: '7 days',
      conditions: [
        'Full refund within 7 days of purchase',
        'Partial refund after 7 days (prorated)',
        'Must not have downloaded premium content extensively',
        'Account must be in good standing'
      ],
      color: 'blue'
    },
    {
      plan: 'Pro Plan (Annual)',
      icon: DollarSign,
      refundable: true,
      timeframe: '30 days',
      conditions: [
        'Full refund within 30 days of purchase',
        'Partial refund after 30 days (prorated)',
        'Must not have completed more than 25% of courses',
        'No previous refund requests in the last 12 months'
      ],
      color: 'green'
    },
    {
      plan: 'Enterprise Plan',
      icon: Shield,
      refundable: true,
      timeframe: 'Custom',
      conditions: [
        'Refund terms defined in enterprise agreement',
        'Contact account manager for refund requests',
        'May require 30-day notice period',
        'Subject to contract terms and conditions'
      ],
      color: 'purple'
    }
  ];

  const refundReasons = [
    {
      reason: 'Technical Issues',
      description: 'Platform not working as expected or advertised',
      eligibility: 'Full refund available',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      reason: 'Dissatisfaction with Content',
      description: 'Content quality does not meet expectations',
      eligibility: 'Refund within trial period',
      icon: XCircle,
      color: 'orange'
    },
    {
      reason: 'Accidental Purchase',
      description: 'Unintended subscription or upgrade',
      eligibility: 'Full refund within 24 hours',
      icon: RefreshCw,
      color: 'yellow'
    },
    {
      reason: 'Duplicate Payment',
      description: 'Multiple charges for the same service',
      eligibility: 'Immediate refund of duplicate charges',
      icon: CreditCard,
      color: 'blue'
    },
    {
      reason: 'Service Cancellation',
      description: 'We discontinue a service you paid for',
      eligibility: 'Prorated refund for unused period',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: 'Submit Request',
      description: 'Contact our support team with your refund request and reason',
      icon: Mail,
      timeframe: '24 hours response'
    },
    {
      step: 2,
      title: 'Review Process',
      description: 'Our team reviews your request against our refund policy',
      icon: FileText,
      timeframe: '2-3 business days'
    },
    {
      step: 3,
      title: 'Decision Notification',
      description: 'You receive an email with the refund decision and next steps',
      icon: CheckCircle,
      timeframe: '1 business day'
    },
    {
      step: 4,
      title: 'Refund Processing',
      description: 'Approved refunds are processed back to your original payment method',
      icon: CreditCard,
      timeframe: '5-10 business days'
    }
  ];

  const nonRefundableItems = [
    'One-time consultation fees',
    'Custom content creation services',
    'Third-party certification fees',
    'Physical materials and books',
    'Services already fully consumed',
    'Promotional or discounted subscriptions (unless specified)',
    'Gift subscriptions (refund to gift purchaser only)'
  ];

  const handleRefundRequest = () => {
    // In a real implementation, this would open a support ticket or form
    window.location.href = 'mailto:refunds@upscdashboard.com?subject=Refund Request&body=Please describe your refund request and include your order details.';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Refund Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              We want you to be completely satisfied with UPSC Dashboard. 
              Learn about our fair and transparent refund policy.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Refund Policy Summary
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fair Refunds</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">7-30 day refund windows depending on your plan.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Quick Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Refunds processed within 5-10 business days.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Easy Process</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Simple refund request through support team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policies by Plan */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Refund Policies by Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Different subscription plans have different refund terms to ensure fairness for all users.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundPolicies.map((policy, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${policy.color}-100 dark:bg-${policy.color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
                  <policy.icon className={`h-6 w-6 text-${policy.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {policy.plan}
                </h3>
                <div className="mb-4">
                  {policy.refundable ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Refundable</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Not Applicable</span>
                    </div>
                  )}
                  {policy.refundable && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Refund window: {policy.timeframe}
                    </p>
                  )}
                </div>
                <ul className="space-y-2">
                  {policy.conditions.map((condition, conditionIndex) => (
                    <li key={conditionIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Reasons */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Valid Refund Reasons
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer refunds for various legitimate reasons. Here are the most common scenarios.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {refundReasons.map((reason, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className={`w-10 h-10 bg-${reason.color}-100 dark:bg-${reason.color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
                  <reason.icon className={`h-5 w-5 text-${reason.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {reason.reason}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                  {reason.description}
                </p>
                <div className={`px-3 py-1 bg-${reason.color}-100 dark:bg-${reason.color}-900/20 text-${reason.color}-600 text-xs font-medium rounded-full inline-block`}>
                  {reason.eligibility}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How to Request a Refund
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our refund process is designed to be simple and transparent. Follow these steps to request a refund.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200 dark:bg-green-800 hidden lg:block"></div>
            
            <div className="space-y-12">
              {refundProcess.map((step, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'lg:order-2 lg:ml-4' : 'lg:order-1 lg:mr-4'}`}>
                          <step.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                          <span className="text-sm font-medium text-green-600">Step {step.step}</span>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {step.description}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        Timeline: {step.timeframe}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 hidden lg:block">
                    <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                  </div>
                  
                  <div className="w-full lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Non-Refundable Items */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <XCircle className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Non-Refundable Items
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  The following items and services are generally not eligible for refunds:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {nonRefundableItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> Exceptions may apply in cases of technical issues, service failures, 
                      or other circumstances beyond your control. Contact our support team to discuss your specific situation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Circumstances */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Special Circumstances
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Prorated Refunds
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For annual subscriptions cancelled after the full refund period, we offer prorated refunds 
                based on the unused portion of your subscription.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Calculated based on remaining months</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Minus any promotional discounts applied</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Subject to usage limitations</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Service Interruptions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If our service is unavailable for extended periods due to technical issues, 
                we may offer service credits or refunds.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Automatic credits for outages over 24 hours</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Refunds for repeated service issues</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Compensation based on impact assessment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Refunds */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Need to Request a Refund?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Our support team is here to help with your refund request. We aim to resolve all requests fairly and promptly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefundRequest}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Request Refund
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a 
                href="tel:+919686525409"
                className="inline-flex items-center px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Support
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Response time: Within 24 hours | Refund processing: 5-10 business days
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
