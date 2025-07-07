'use client';

import { useState } from 'react';
import { 
  DollarSign, Users, TrendingUp, Award, Target, Share2,
  ArrowRight, CheckCircle, Star, Gift, Zap, Shield,
  BarChart3, Calendar, ExternalLink, Copy, Mail
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function AffiliatePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const commissionTiers = [
    {
      tier: 'Bronze',
      referrals: '1-10',
      commission: '15%',
      bonuses: ['Welcome bonus: ₹500', 'Monthly newsletter'],
      color: 'orange'
    },
    {
      tier: 'Silver',
      referrals: '11-25',
      commission: '20%',
      bonuses: ['Welcome bonus: ₹1,000', 'Priority support', 'Marketing materials'],
      color: 'gray'
    },
    {
      tier: 'Gold',
      referrals: '26-50',
      commission: '25%',
      bonuses: ['Welcome bonus: ₹2,000', 'Dedicated account manager', 'Custom landing pages'],
      color: 'yellow'
    },
    {
      tier: 'Platinum',
      referrals: '51+',
      commission: '30%',
      bonuses: ['Welcome bonus: ₹5,000', 'VIP support', 'Co-marketing opportunities'],
      color: 'purple'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'High Commissions',
      description: 'Earn up to 30% commission on every successful referral with our tiered system.',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Large Audience',
      description: 'Tap into the growing market of 50,000+ UPSC aspirants actively seeking quality education.',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Growing Market',
      description: 'UPSC preparation market is expanding rapidly with increasing demand for online solutions.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Trusted Brand',
      description: 'Promote a trusted platform with 85% success rate and excellent student reviews.',
      color: 'indigo'
    },
    {
      icon: Zap,
      title: 'Marketing Support',
      description: 'Get access to professional marketing materials, banners, and promotional content.',
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track your performance with detailed analytics and real-time commission reports.',
      color: 'red'
    }
  ];

  const marketingMaterials = [
    {
      type: 'Banner Ads',
      description: 'High-converting banner ads in multiple sizes (728x90, 300x250, 160x600)',
      formats: ['JPG', 'PNG', 'GIF'],
      count: '12 designs'
    },
    {
      type: 'Social Media Posts',
      description: 'Ready-to-use social media content for Facebook, Instagram, Twitter, LinkedIn',
      formats: ['JPG', 'PNG', 'Stories'],
      count: '25 posts'
    },
    {
      type: 'Email Templates',
      description: 'Professional email templates for newsletters and promotional campaigns',
      formats: ['HTML', 'Text'],
      count: '8 templates'
    },
    {
      type: 'Video Content',
      description: 'Product demo videos and testimonials for your promotional campaigns',
      formats: ['MP4', 'MOV'],
      count: '5 videos'
    }
  ];

  const faqs = [
    {
      question: 'How much can I earn as an affiliate?',
      answer: 'Your earnings depend on the number of successful referrals. With our tiered commission structure, you can earn 15-30% commission per sale. Top affiliates earn ₹50,000+ per month.'
    },
    {
      question: 'When do I get paid?',
      answer: 'Commissions are paid monthly via bank transfer or UPI. Payments are processed within 7 business days after the month ends, with a minimum payout threshold of ₹1,000.'
    },
    {
      question: 'What marketing materials do you provide?',
      answer: 'We provide banner ads, social media content, email templates, product videos, and custom landing pages. All materials are professionally designed and optimized for conversions.'
    },
    {
      question: 'Is there a cost to join the affiliate program?',
      answer: 'No, joining our affiliate program is completely free. There are no setup fees, monthly charges, or hidden costs. You only earn when you make successful referrals.'
    },
    {
      question: 'How do I track my referrals and commissions?',
      answer: 'You get access to a comprehensive affiliate dashboard with real-time tracking of clicks, conversions, commissions, and detailed analytics to optimize your campaigns.'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Apply to Join',
      description: 'Fill out our simple application form with your details and marketing experience.',
      icon: Target
    },
    {
      step: 2,
      title: 'Get Approved',
      description: 'Our team reviews your application and approves qualified affiliates within 24-48 hours.',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Access Materials',
      description: 'Get your unique affiliate links and access to our library of marketing materials.',
      icon: Share2
    },
    {
      step: 4,
      title: 'Start Promoting',
      description: 'Begin promoting UPSC Dashboard using your affiliate links and marketing materials.',
      icon: TrendingUp
    },
    {
      step: 5,
      title: 'Earn Commissions',
      description: 'Track your performance and earn commissions on every successful referral.',
      icon: DollarSign
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Affiliate Program
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              Join our affiliate program and earn up to 30% commission by promoting 
              the leading UPSC preparation platform to your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#join-now" 
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Join Now - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Commission Structure
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our tiered commission system rewards your success. The more you refer, the more you earn.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionTiers.map((tier, index) => (
              <div key={index} className={`bg-${tier.color}-50 dark:bg-${tier.color}-900/10 border-2 border-${tier.color}-200 dark:border-${tier.color}-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}>
                <div className={`w-16 h-16 bg-${tier.color}-100 dark:bg-${tier.color}-900/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Award className={`h-8 w-8 text-${tier.color}-600`} />
                </div>
                <h3 className={`text-xl font-bold text-${tier.color}-600 mb-2`}>
                  {tier.tier}
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {tier.commission}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {tier.referrals} referrals/month
                </p>
                <ul className="space-y-2 text-sm">
                  {tier.bonuses.map((bonus, bonusIndex) => (
                    <li key={bonusIndex} className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className={`h-4 w-4 text-${tier.color}-500 mr-2 flex-shrink-0`} />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Join Our Affiliate Program?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Partner with us and enjoy industry-leading benefits and support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${benefit.color}-100 dark:bg-${benefit.color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
                  <benefit.icon className={`h-6 w-6 text-${benefit.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Getting started is simple. Follow these 5 easy steps to begin earning.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200 dark:bg-green-800 hidden lg:block"></div>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
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
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 hidden lg:block">
                    <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white dark:border-gray-900"></div>
                  </div>
                  
                  <div className="w-full lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Materials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Marketing Materials
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access professional marketing materials to maximize your conversion rates.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketingMaterials.map((material, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {material.type}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {material.description}
                </p>
                <div className="flex justify-center space-x-2 mb-3">
                  {material.formats.map((format, formatIndex) => (
                    <span key={formatIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                      {format}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-medium text-green-600">
                  {material.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get answers to common questions about our affiliate program.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section id="join-now" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join our affiliate program today and start earning commissions on every referral.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website/Social Media
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marketing Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us about your marketing experience and how you plan to promote UPSC Dashboard..."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the <a href="/terms" className="text-green-600 hover:text-green-700">Terms & Conditions</a> and <a href="/privacy" className="text-green-600 hover:text-green-700">Privacy Policy</a>
                </label>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Apply to Join Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Questions About Our Affiliate Program?
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Contact Our Affiliate Team
            </h3>
            <a href="mailto:affiliates@upscdashboard.com" className="text-green-600 hover:text-green-700 font-medium">
              affiliates@upscdashboard.com
            </a>
            <p className="text-sm text-gray-500 mt-2">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
