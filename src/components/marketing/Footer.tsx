'use client';

import Link from 'next/link';
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight
} from 'lucide-react';
import EmailSubscriptionForm from '@/components/email/EmailSubscriptionForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About Us', href: '/about' },
        { name: 'Demo', href: '/demo' },
        { name: 'Documentation', href: '/docs' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Study Materials', href: '/resources/materials' },
        { name: 'Mock Tests', href: '/resources/tests' },
        { name: 'Current Affairs', href: '/resources/current-affairs' },
        { name: 'Previous Papers', href: '/resources/papers' },
        { name: 'Study Guides', href: '/resources/guides' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/support' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Community Forum', href: '/community' },
        { name: 'Live Chat', href: '/chat' },
        { name: 'System Status', href: '/status' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press' },
        { name: 'Partners', href: '/partners' },
        { name: 'Affiliate Program', href: '/affiliate' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Contact Support', icon: Facebook, href: '/contact' },
    { name: 'Community Forum', icon: Twitter, href: '/community' },
    { name: 'Help Center', icon: Instagram, href: '/support' },
    { name: 'System Status', icon: Linkedin, href: '/status' },
    { name: 'Documentation', icon: Youtube, href: '/docs' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Data Protection', href: '/data-protection' },
    { name: 'Refund Policy', href: '/refund' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Stay Updated with UPSC Insights</h3>
              <p className="text-gray-300 text-lg">
                Get weekly study tips, current affairs updates, and exclusive content delivered to your inbox.
              </p>
            </div>
            <div className="space-y-4">
              <EmailSubscriptionForm
                subscriptionType="newsletter"
                source="footer"
                placeholder="Enter your email address"
                buttonText="Subscribe"
                className="max-w-md"
              />
              <p className="text-sm text-gray-400">
                Join 25,000+ UPSC aspirants. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold">UPSC Dashboard</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Empowering UPSC aspirants with comprehensive study tools, practice tests,
              current affairs, progress tracking, and an AI assistant to help navigate your preparation journey.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>support@upscdashboard.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-gray-300 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400">
              © {currentYear} UPSC Dashboard. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Made with ❤️ for UPSC aspirants across India. 
              <span className="text-blue-400 ml-2">
                Trusted by 10,000+ successful candidates
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
