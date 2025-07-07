'use client';

import { 
  FileText, Scale, Shield, AlertTriangle, CheckCircle,
  Users, CreditCard, BookOpen, Settings, Mail, Calendar
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function TermsPage() {
  const lastUpdated = '2024-01-15';

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing or using UPSC Dashboard, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'These terms apply to all users, including students, educators, and institutional partners.',
        'Your use of our services constitutes acceptance of any updates to these terms.'
      ]
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: BookOpen,
      content: [
        'UPSC Dashboard provides online educational services for civil services examination preparation.',
        'Our services include study materials, mock tests, AI-powered assistance, and progress tracking.',
        'We offer both free and premium subscription tiers with different feature sets.',
        'Services may be modified, updated, or discontinued at our discretion with appropriate notice.'
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      icon: Users,
      content: [
        'You must create an account to access most features of our platform.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You must provide accurate and complete information during registration.',
        'You are responsible for all activities that occur under your account.',
        'Notify us immediately of any unauthorized use of your account.'
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      icon: Shield,
      content: [
        'Use our services only for lawful purposes and in accordance with these terms.',
        'Do not attempt to gain unauthorized access to our systems or other users\' accounts.',
        'Do not share, distribute, or resell our proprietary content without permission.',
        'Do not use our services to transmit harmful, offensive, or illegal content.',
        'Do not interfere with or disrupt the operation of our platform.',
        'Do not create multiple accounts to circumvent limitations or restrictions.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: Scale,
      content: [
        'All content on UPSC Dashboard is protected by copyright, trademark, and other intellectual property laws.',
        'We grant you a limited, non-exclusive license to access and use our content for personal educational purposes.',
        'You may not reproduce, distribute, modify, or create derivative works from our content.',
        'User-generated content remains your property, but you grant us a license to use it for service provision.',
        'Respect third-party intellectual property rights when using our platform.'
      ]
    },
    {
      id: 'payments',
      title: 'Payment Terms',
      icon: CreditCard,
      content: [
        'Premium features require payment of applicable subscription fees.',
        'All fees are charged in Indian Rupees (INR) unless otherwise specified.',
        'Subscription fees are billed in advance on a monthly or annual basis.',
        'We use secure third-party payment processors to handle transactions.',
        'Refunds are subject to our refund policy outlined in a separate document.',
        'We reserve the right to change pricing with 30 days\' advance notice.'
      ]
    }
  ];

  const prohibitedActivities = [
    'Sharing account credentials with others',
    'Downloading or copying content for commercial use',
    'Reverse engineering or attempting to extract source code',
    'Using automated tools to access or scrape our platform',
    'Impersonating other users or providing false information',
    'Uploading malicious software or harmful content',
    'Violating any applicable laws or regulations',
    'Interfering with other users\' access to the platform'
  ];

  const terminationReasons = [
    'Violation of these Terms of Service',
    'Fraudulent or illegal activity',
    'Non-payment of subscription fees',
    'Abuse of our support systems',
    'Repeated violations of our community guidelines',
    'At your request for account deletion'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              These terms govern your use of UPSC Dashboard and outline the rights 
              and responsibilities of all users.
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Terms Summary
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fair Use</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use our platform responsibly for educational purposes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Your Rights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access quality education with clear terms and protections.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Our Commitment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Provide reliable, high-quality educational services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} id={section.id} className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Activities */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Prohibited Activities
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The following activities are strictly prohibited and may result in immediate account termination:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {prohibitedActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Account Termination */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Account Termination
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Termination by Us
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We may terminate or suspend your account for the following reasons:
                </p>
                <ul className="space-y-2">
                  {terminationReasons.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Termination by You
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You may terminate your account at any time by:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Contacting our support team</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Using account deletion in settings</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Canceling your subscription</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Limitation of Liability
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                To the maximum extent permitted by law, UPSC Dashboard shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-300">Loss of profits, data, or business opportunities</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-300">Interruption of service or system downtime</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-300">Errors or omissions in content or materials</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                Our total liability shall not exceed the amount paid by you for our services in the 12 months 
                preceding the claim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Governing Law and Disputes
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                These Terms of Service are governed by the laws of India. Any disputes arising from these 
                terms or your use of our services shall be subject to the exclusive jurisdiction of the 
                courts in Bangalore, Karnataka, India.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We encourage users to contact us directly to resolve any issues before pursuing legal action. 
                We are committed to working with you to find a fair resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Questions About These Terms?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex items-center justify-center space-x-6">
              <a 
                href="mailto:legal@upscdashboard.com"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Mail className="h-5 w-5" />
                <span>legal@upscdashboard.com</span>
              </a>
              <span className="text-gray-400">|</span>
              <a 
                href="tel:+919686525409"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>+91 9686525409</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
