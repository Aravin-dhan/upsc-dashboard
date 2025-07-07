'use client';

import { 
  Handshake, Users, Globe, TrendingUp, Award, CheckCircle,
  ArrowRight, ExternalLink, Mail, Phone, Building,
  Target, Zap, Shield, Heart, Star, BookOpen
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

interface Partner {
  id: string;
  name: string;
  type: 'educational' | 'technology' | 'content' | 'government';
  logo: string;
  description: string;
  website: string;
  partnership: string;
}

interface PartnershipBenefit {
  icon: any;
  title: string;
  description: string;
  color: string;
}

export default function PartnersPage() {
  const partners: Partner[] = [
    {
      id: '1',
      name: 'National Institute of Public Administration',
      type: 'educational',
      logo: '🏛️',
      description: 'Leading public administration institute providing curriculum guidance and expert faculty.',
      website: 'https://nipa.gov.in',
      partnership: 'Curriculum Development & Faculty Exchange'
    },
    {
      id: '2',
      name: 'Indian Institute of Technology',
      type: 'technology',
      logo: '🎓',
      description: 'Premier technology institute supporting AI research and platform development.',
      website: 'https://iit.ac.in',
      partnership: 'AI Research & Technology Innovation'
    },
    {
      id: '3',
      name: 'Oxford University Press',
      type: 'content',
      logo: '📚',
      description: 'Renowned publisher providing high-quality educational content and study materials.',
      website: 'https://oup.com',
      partnership: 'Content Publishing & Distribution'
    },
    {
      id: '4',
      name: 'Ministry of Education',
      type: 'government',
      logo: '🏢',
      description: 'Government partnership for policy alignment and educational standards.',
      website: 'https://education.gov.in',
      partnership: 'Policy Development & Standards'
    },
    {
      id: '5',
      name: 'Coursera',
      type: 'technology',
      logo: '💻',
      description: 'Global online learning platform for course distribution and certification.',
      website: 'https://coursera.org',
      partnership: 'Course Distribution & Certification'
    },
    {
      id: '6',
      name: 'Times of India Education',
      type: 'content',
      logo: '📰',
      description: 'Leading media house for current affairs and educational content.',
      website: 'https://timesofindia.com',
      partnership: 'Current Affairs & News Content'
    }
  ];

  const partnershipBenefits: PartnershipBenefit[] = [
    {
      icon: Users,
      title: 'Expanded Reach',
      description: 'Access to our growing network of 50,000+ students and educational institutions.',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Collaborative opportunities to increase revenue through joint programs and offerings.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Co-develop cutting-edge educational technologies and learning methodologies.',
      color: 'yellow'
    },
    {
      icon: Globe,
      title: 'Market Expansion',
      description: 'Enter new markets and demographics through strategic partnership initiatives.',
      color: 'purple'
    },
    {
      icon: Award,
      title: 'Brand Recognition',
      description: 'Enhanced brand visibility and recognition in the education technology sector.',
      color: 'red'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Maintain high standards through collaborative quality control and best practices.',
      color: 'indigo'
    }
  ];

  const partnershipTypes = [
    {
      title: 'Educational Institutions',
      description: 'Universities, colleges, and coaching institutes looking to enhance their UPSC preparation programs.',
      benefits: [
        'White-label platform solutions',
        'Curriculum integration support',
        'Faculty training programs',
        'Student performance analytics'
      ],
      icon: Building,
      color: 'blue'
    },
    {
      title: 'Technology Partners',
      description: 'Tech companies and startups interested in educational innovation and AI development.',
      benefits: [
        'API access and integration',
        'Joint product development',
        'Research collaboration',
        'Technology licensing'
      ],
      icon: Zap,
      color: 'green'
    },
    {
      title: 'Content Providers',
      description: 'Publishers, media houses, and content creators with educational materials.',
      benefits: [
        'Content distribution platform',
        'Revenue sharing models',
        'Co-branded materials',
        'Quality certification'
      ],
      icon: BookOpen,
      color: 'purple'
    },
    {
      title: 'Government & NGOs',
      description: 'Government bodies and non-profit organizations focused on education and skill development.',
      benefits: [
        'Policy alignment support',
        'Public-private partnerships',
        'Social impact programs',
        'Accessibility initiatives'
      ],
      icon: Heart,
      color: 'red'
    }
  ];

  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case 'educational': return 'blue';
      case 'technology': return 'green';
      case 'content': return 'purple';
      case 'government': return 'red';
      default: return 'gray';
    }
  };

  const getPartnerTypeName = (type: string) => {
    switch (type) {
      case 'educational': return 'Educational';
      case 'technology': return 'Technology';
      case 'content': return 'Content';
      case 'government': return 'Government';
      default: return 'Partner';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our Partners
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              Building the future of education together with leading institutions, 
              technology companies, and content providers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#become-partner" 
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#existing-partners" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                View Our Partners
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our ecosystem and unlock new opportunities for growth, innovation, and impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnershipBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-${benefit.color}-100 dark:bg-${benefit.color}-900/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
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

      {/* Partnership Types */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore different ways to collaborate and create value together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${type.color}-100 dark:bg-${type.color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
                  <type.icon className={`h-6 w-6 text-${type.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {type.description}
                </p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Partners */}
      <section id="existing-partners" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Trusted Partners
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're proud to work with leading organizations across various sectors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => {
              const typeColor = getPartnerTypeColor(partner.type);
              const typeName = getPartnerTypeName(partner.type);
              
              return (
                <div key={partner.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{partner.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {partner.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium bg-${typeColor}-100 dark:bg-${typeColor}-900/20 text-${typeColor}-600 rounded`}>
                          {typeName}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {partner.description}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Partnership: {partner.partnership}
                      </p>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Visit Website
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section id="become-partner" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Let's explore how we can create value together and make a positive impact on education.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partnership Type *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select partnership type</option>
                    <option value="educational">Educational Institution</option>
                    <option value="technology">Technology Partner</option>
                    <option value="content">Content Provider</option>
                    <option value="government">Government/NGO</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Person *
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Partnership Proposal *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your partnership proposal and how we can work together..."
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Partnership Proposal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Partnership Inquiries
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Email Us
              </h3>
              <a href="mailto:partnerships@upscdashboard.com" className="text-green-600 hover:text-green-700">
                partnerships@upscdashboard.com
              </a>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Call Us
              </h3>
              <a href="tel:+919686525409" className="text-green-600 hover:text-green-700">
                +91 9686525409
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
