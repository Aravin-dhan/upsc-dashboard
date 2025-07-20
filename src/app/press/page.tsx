'use client';

import { 
  Download, ExternalLink, Calendar, User, Tag,
  Award, TrendingUp, Users, Globe, FileText,
  Image as ImageIcon, Video, Mic, Mail
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';


interface PressRelease {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  downloadUrl: string;
}

interface MediaCoverage {
  id: string;
  title: string;
  publication: string;
  date: string;
  type: 'article' | 'interview' | 'podcast' | 'video';
  url: string;
  logo: string;
}

export default function PressPage() {
  const pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'UPSC Dashboard Launches AI-Powered Study Assistant for Civil Services Preparation',
      date: '2024-01-15',
      category: 'Product Launch',
      excerpt: 'Revolutionary AI technology helps students personalize their UPSC preparation journey with adaptive learning algorithms.',
      downloadUrl: '/press/ai-launch-2024.pdf'
    },
    {
      id: '2',
      title: 'UPSC Dashboard Reaches 50,000 Active Students Milestone',
      date: '2023-12-10',
      category: 'Company News',
      excerpt: 'Platform celebrates significant growth in user base with 85% success rate among students who complete the program.',
      downloadUrl: '/press/50k-milestone-2023.pdf'
    },
    {
      id: '3',
      title: 'UPSC Dashboard Wins "Best EdTech Innovation" Award at Education Summit 2023',
      date: '2023-11-20',
      category: 'Awards',
      excerpt: 'Recognition for outstanding contribution to educational technology and student success in competitive examinations.',
      downloadUrl: '/press/edtech-award-2023.pdf'
    },
    {
      id: '4',
      title: 'UPSC Dashboard Announces Multi-Tenant SaaS Platform for Educational Institutions',
      date: '2023-10-05',
      category: 'Product Launch',
      excerpt: 'New enterprise solution enables coaching institutes and universities to leverage advanced UPSC preparation tools.',
      downloadUrl: '/press/saas-platform-2023.pdf'
    }
  ];

  const mediaCoverage: MediaCoverage[] = [
    {
      id: '1',
      title: 'How AI is Transforming UPSC Preparation: A Deep Dive',
      publication: 'The Hindu Education',
      date: '2024-01-20',
      type: 'article',
      url: 'https://example.com/hindu-article',
      logo: '📰'
    },
    {
      id: '2',
      title: 'EdTech Innovations in Civil Services Preparation',
      publication: 'Economic Times',
      date: '2024-01-10',
      type: 'article',
      url: 'https://example.com/et-article',
      logo: '💼'
    },
    {
      id: '3',
      title: 'Founder Interview: Building the Future of UPSC Preparation',
      publication: 'YourStory',
      date: '2023-12-15',
      type: 'interview',
      url: 'https://example.com/yourstory-interview',
      logo: '🚀'
    },
    {
      id: '4',
      title: 'EdTech Podcast: Revolutionizing Competitive Exam Preparation',
      publication: 'Education Today',
      date: '2023-11-30',
      type: 'podcast',
      url: 'https://example.com/podcast',
      logo: '🎧'
    }
  ];

  const companyFacts = [
    { label: 'Founded', value: '2016' },
    { label: 'Students Served', value: '50,000+' },
    { label: 'Success Rate', value: '85%' },
    { label: 'Team Size', value: '50+' },
    { label: 'Countries', value: '3' },
    { label: 'Study Materials', value: '10,000+' }
  ];

  const mediaAssets = [
    {
      type: 'Logo Package',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      icon: ImageIcon,
      downloadUrl: '/press/logo-package.zip'
    },
    {
      type: 'Product Screenshots',
      description: 'High-quality screenshots of our platform and features',
      icon: ImageIcon,
      downloadUrl: '/press/screenshots.zip'
    },
    {
      type: 'Company Photos',
      description: 'Team photos, office images, and event pictures',
      icon: ImageIcon,
      downloadUrl: '/press/company-photos.zip'
    },
    {
      type: 'Video Assets',
      description: 'Product demos, testimonials, and company overview videos',
      icon: Video,
      downloadUrl: '/press/video-assets.zip'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'interview': return User;
      case 'podcast': return Mic;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'blue';
      case 'interview': return 'green';
      case 'podcast': return 'purple';
      case 'video': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Press & Media
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              Latest news, press releases, and media coverage about UPSC Dashboard's 
              mission to revolutionize civil services preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#press-releases" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Latest Press Releases
              </a>
              <a 
                href="mailto:press@upscdashboard.com" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Media Inquiries
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Facts */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Company at a Glance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Key facts and figures about UPSC Dashboard
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {companyFacts.map((fact, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {fact.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section id="press-releases" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Press Releases
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Official announcements and company news
            </p>
          </div>
          
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <div key={release.id} className="bg-white dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full">
                        {release.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(release.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {release.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <a
                      href={release.downloadUrl}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Media Coverage
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              What the media is saying about us
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {mediaCoverage.map((coverage) => {
              const TypeIcon = getTypeIcon(coverage.type);
              const typeColor = getTypeColor(coverage.type);
              
              return (
                <div key={coverage.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{coverage.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 bg-${typeColor}-100 dark:bg-${typeColor}-900/20 rounded-full flex items-center justify-center`}>
                          <TypeIcon className={`h-4 w-4 text-${typeColor}-600`} />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {coverage.publication}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(coverage.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {coverage.title}
                      </h3>
                      <a
                        href={coverage.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read {coverage.type}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Media Assets
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Download high-quality assets for your stories
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((asset, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <asset.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {asset.type}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {asset.description}
                </p>
                <a
                  href={asset.downloadUrl}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Media Contact
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get in touch for interviews, quotes, or additional information
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Press Inquiries
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <a href="mailto:press@upscdashboard.com" className="text-blue-600 hover:text-blue-700">
                      press@upscdashboard.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Aravindhan B, Founder & CEO
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Response Time
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We typically respond to media inquiries within 24 hours during business days.
                </p>
                <p className="text-sm text-gray-500">
                  For urgent requests, please mention "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter signup moved to admin-only access */}

      <Footer />
    </div>
  );
}
