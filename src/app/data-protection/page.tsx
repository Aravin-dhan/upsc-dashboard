'use client';

import { 
  Shield, Lock, Eye, Users, Globe, FileText, Download,
  CheckCircle, AlertTriangle, Mail, Calendar, Database,
  Key, Server, UserCheck, Trash2, Edit, ArrowRight
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function DataProtectionPage() {
  const lastUpdated = '2024-01-15';

  const dataRights = [
    {
      icon: Eye,
      title: 'Right to Access',
      description: 'Request a copy of all personal data we hold about you',
      action: 'Download your data',
      timeframe: '30 days'
    },
    {
      icon: Edit,
      title: 'Right to Rectification',
      description: 'Correct any inaccurate or incomplete personal information',
      action: 'Update your profile',
      timeframe: '30 days'
    },
    {
      icon: Trash2,
      title: 'Right to Erasure',
      description: 'Request deletion of your personal data under certain conditions',
      action: 'Delete your account',
      timeframe: '30 days'
    },
    {
      icon: Database,
      title: 'Right to Portability',
      description: 'Receive your data in a structured, machine-readable format',
      action: 'Export your data',
      timeframe: '30 days'
    },
    {
      icon: Shield,
      title: 'Right to Restrict Processing',
      description: 'Limit how we process your personal data in certain circumstances',
      action: 'Contact support',
      timeframe: '30 days'
    },
    {
      icon: UserCheck,
      title: 'Right to Object',
      description: 'Object to processing of your data for direct marketing or legitimate interests',
      action: 'Opt-out settings',
      timeframe: 'Immediate'
    }
  ];

  const securityMeasures = [
    {
      category: 'Data Encryption',
      icon: Lock,
      measures: [
        'End-to-end encryption for sensitive data transmission',
        'AES-256 encryption for data at rest',
        'TLS 1.3 for all web communications',
        'Encrypted database storage with key rotation'
      ]
    },
    {
      category: 'Access Controls',
      icon: Key,
      measures: [
        'Multi-factor authentication for all accounts',
        'Role-based access control (RBAC)',
        'Principle of least privilege access',
        'Regular access reviews and audits'
      ]
    },
    {
      category: 'Infrastructure Security',
      icon: Server,
      measures: [
        'ISO 27001 certified data centers',
        'Regular security vulnerability assessments',
        'Intrusion detection and prevention systems',
        'Automated security monitoring and alerting'
      ]
    },
    {
      category: 'Operational Security',
      icon: Shield,
      measures: [
        'Employee security training and background checks',
        'Incident response and breach notification procedures',
        'Regular security audits and penetration testing',
        'Secure software development lifecycle (SSDLC)'
      ]
    }
  ];

  const dataCategories = [
    {
      category: 'Identity Data',
      examples: ['Name', 'Email address', 'Phone number', 'Date of birth'],
      purpose: 'Account creation and user identification',
      retention: '3 years after account closure',
      legal_basis: 'Contract performance'
    },
    {
      category: 'Educational Data',
      examples: ['Test scores', 'Study progress', 'Learning preferences', 'Course enrollment'],
      purpose: 'Personalized learning and progress tracking',
      retention: '5 years for academic records',
      legal_basis: 'Contract performance and legitimate interest'
    },
    {
      category: 'Technical Data',
      examples: ['IP address', 'Browser type', 'Device information', 'Usage analytics'],
      purpose: 'Platform optimization and security',
      retention: '2 years',
      legal_basis: 'Legitimate interest'
    },
    {
      category: 'Financial Data',
      examples: ['Payment information', 'Billing address', 'Transaction history'],
      purpose: 'Payment processing and fraud prevention',
      retention: '7 years for tax compliance',
      legal_basis: 'Contract performance and legal obligation'
    }
  ];

  const handleDataRequest = (requestType: string) => {
    // In a real implementation, this would trigger the appropriate data request process
    alert(`${requestType} request initiated. You will receive an email with further instructions within 24 hours.`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Data Protection
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your data protection rights and how we safeguard your personal information 
              in compliance with GDPR and other privacy regulations.
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

      {/* Your Data Rights */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Data Protection Rights
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Under GDPR and other privacy laws, you have several rights regarding your personal data. 
              Exercise these rights easily through our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataRights.map((right, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                  <right.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {right.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {right.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Response: {right.timeframe}
                  </span>
                  <button
                    onClick={() => handleDataRequest(right.title)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    {right.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Data We Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transparency about what data we collect, why we need it, and how long we keep it.
            </p>
          </div>
          
          <div className="space-y-6">
            {dataCategories.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <div className="grid lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-1">
                      {category.examples.map((example, exampleIndex) => (
                        <span key={exampleIndex} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded mr-1 mb-1">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Purpose</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.purpose}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Retention</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.retention}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Legal Basis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.legal_basis}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How We Protect Your Data
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We implement comprehensive security measures to protect your personal data 
              from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <measure.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {measure.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {measure.measures.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Breach Response */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Data Breach Response
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  In the unlikely event of a data breach that poses a risk to your rights and freedoms, 
                  we are committed to transparent and prompt communication.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Our Response Timeline</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Within 72 hours:</strong> Notify supervisory authorities
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Without undue delay:</strong> Inform affected users
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Immediate:</strong> Contain and assess the breach
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What We'll Tell You</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Nature of the breach</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Data categories affected</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Steps we're taking</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Recommended actions for you</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              International Data Transfers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              When we transfer your data internationally, we ensure appropriate safeguards are in place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <Globe className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Adequacy Decisions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transfers to countries with adequate data protection laws as recognized by the EU Commission.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Standard Contractual Clauses</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                EU-approved contracts that provide appropriate safeguards for international transfers.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Binding Corporate Rules</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Internal policies approved by data protection authorities for multinational organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection Officer */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Protection Officer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our Data Protection Officer is available to help with any questions about your data rights, 
              our privacy practices, or to handle complaints about data processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:dpo@upscdashboard.com"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact DPO
              </a>
              <button
                onClick={() => handleDataRequest('Data Protection Inquiry')}
                className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Submit Inquiry
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Supervisory Authority */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Lodge a Complaint
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you believe we have not handled your personal data in accordance with data protection laws, 
              you have the right to lodge a complaint with the relevant supervisory authority.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">For EU Residents</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Contact your local data protection authority or the lead supervisory authority in Ireland.
                </p>
                <a 
                  href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Find your local authority →
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">For Indian Residents</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Contact the Data Protection Authority of India once established, or relevant consumer protection authorities.
                </p>
                <a 
                  href="https://www.meity.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ministry of Electronics & IT →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
