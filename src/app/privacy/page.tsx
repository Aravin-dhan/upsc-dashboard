'use client';

import { 
  Shield, Eye, Lock, Users, Globe, FileText,
  Mail, Phone, Calendar, AlertTriangle, CheckCircle
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function PrivacyPage() {
  const lastUpdated = '2024-01-15';

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Eye,
      content: [
        {
          subtitle: 'Personal Information',
          items: [
            'Name, email address, phone number',
            'Educational background and qualifications',
            'Payment information (processed securely)',
            'Profile picture and bio (optional)'
          ]
        },
        {
          subtitle: 'Usage Information',
          items: [
            'Study progress and performance data',
            'Platform usage patterns and preferences',
            'Device information and IP address',
            'Cookies and similar tracking technologies'
          ]
        },
        {
          subtitle: 'Educational Data',
          items: [
            'Test scores and assessment results',
            'Study materials accessed and downloaded',
            'Time spent on different sections',
            'Learning preferences and goals'
          ]
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        {
          subtitle: 'Service Provision',
          items: [
            'Provide personalized learning experiences',
            'Track your progress and performance',
            'Deliver relevant study materials and recommendations',
            'Process payments and manage subscriptions'
          ]
        },
        {
          subtitle: 'Communication',
          items: [
            'Send important updates about your account',
            'Provide customer support and assistance',
            'Share educational content and tips',
            'Notify about new features and improvements'
          ]
        },
        {
          subtitle: 'Platform Improvement',
          items: [
            'Analyze usage patterns to improve our services',
            'Develop new features and functionalities',
            'Conduct research to enhance learning outcomes',
            'Ensure platform security and prevent fraud'
          ]
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Globe,
      content: [
        {
          subtitle: 'We Do Not Sell Your Data',
          items: [
            'We never sell your personal information to third parties',
            'Your educational data remains confidential',
            'We respect your privacy and trust'
          ]
        },
        {
          subtitle: 'Limited Sharing Scenarios',
          items: [
            'Service providers who help us operate the platform',
            'Legal compliance when required by law',
            'Business transfers (with continued privacy protection)',
            'With your explicit consent for specific purposes'
          ]
        },
        {
          subtitle: 'Educational Institutions',
          items: [
            'Aggregate, anonymized performance data for research',
            'Progress reports to affiliated coaching centers (with consent)',
            'Certification and achievement verification'
          ]
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Technical Safeguards',
          items: [
            'End-to-end encryption for sensitive data',
            'Secure HTTPS connections for all communications',
            'Regular security audits and vulnerability assessments',
            'Multi-factor authentication for account protection'
          ]
        },
        {
          subtitle: 'Organizational Measures',
          items: [
            'Limited access to personal data on need-to-know basis',
            'Regular employee training on data protection',
            'Incident response procedures for data breaches',
            'Compliance with industry security standards'
          ]
        },
        {
          subtitle: 'Data Storage',
          items: [
            'Data stored in secure, certified data centers',
            'Regular backups with encryption',
            'Geographic data residency compliance',
            'Secure deletion of data when no longer needed'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights',
      icon: Shield,
      content: [
        {
          subtitle: 'Access and Control',
          items: [
            'Access your personal data and download a copy',
            'Correct inaccurate or incomplete information',
            'Delete your account and associated data',
            'Restrict processing of your data'
          ]
        },
        {
          subtitle: 'Communication Preferences',
          items: [
            'Opt-out of marketing communications',
            'Choose notification preferences',
            'Control cookie settings',
            'Manage data sharing preferences'
          ]
        },
        {
          subtitle: 'Data Portability',
          items: [
            'Export your study progress and achievements',
            'Transfer data to other educational platforms',
            'Receive data in machine-readable format',
            'Maintain access during transition periods'
          ]
        }
      ]
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'privacy@upscdashboard.com',
      link: 'mailto:privacy@upscdashboard.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9686525409',
      link: 'tel:+919686525409'
    },
    {
      icon: FileText,
      label: 'Data Protection Officer',
      value: 'dpo@upscdashboard.com',
      link: 'mailto:dpo@upscdashboard.com'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information.
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
              Privacy at a Glance
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">We Don't Sell Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your personal information is never sold to third parties.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">You Control Your Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access, modify, or delete your data anytime.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure & Encrypted</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All data is encrypted and securely stored.</p>
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
                
                <div className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {subsection.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Required for basic platform functionality, authentication, and security. These cannot be disabled.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Help us understand how you use our platform to improve user experience. You can opt-out in your settings.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Preference Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Remember your settings and preferences for a personalized experience.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <a 
                href="/cookies" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about our cookie policy
                <FileText className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              International Data Transfers
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Your data may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Adequacy decisions by relevant data protection authorities
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Standard contractual clauses approved by the European Commission
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Binding corporate rules and certification schemes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Data Retention
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Active Accounts
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We retain your data while your account is active and for a reasonable period 
                  thereafter to provide continued service and support.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Inactive Accounts
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Accounts inactive for 3 years will be archived. You'll receive advance notice 
                  and can reactivate before deletion.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Legal Requirements
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Some data may be retained longer to comply with legal obligations, 
                  resolve disputes, or enforce agreements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Anonymized Data
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Aggregated, anonymized data may be retained indefinitely for research 
                  and platform improvement purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Us About Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have questions about this privacy policy or want to exercise your rights, 
              please contact us:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((contact, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <contact.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {contact.label}
                  </h3>
                  <a 
                    href={contact.link}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {contact.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Updates Notice */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Policy Updates
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We may update this privacy policy from time to time. We'll notify you of any 
                  material changes via email or through our platform. Your continued use of our 
                  services after such modifications constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
