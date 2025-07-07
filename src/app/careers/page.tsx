'use client';

import { useState } from 'react';
import { 
  MapPin, Clock, Users, Briefcase, Heart, Zap,
  Code, BookOpen, TrendingUp, Coffee, Wifi, Car,
  Search, Filter, ArrowRight, ExternalLink
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
}

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'content', name: 'Content & Education' },
    { id: 'design', name: 'Design & UX' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'operations', name: 'Operations' }
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'full-time', name: 'Full Time' },
    { id: 'part-time', name: 'Part Time' },
    { id: 'contract', name: 'Contract' },
    { id: 'internship', name: 'Internship' }
  ];

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'engineering',
      location: 'Bangalore, India',
      type: 'full-time',
      experience: '4-6 years',
      salary: '₹15-25 LPA',
      description: 'Join our engineering team to build scalable web applications using React, Node.js, and modern technologies.',
      requirements: [
        'Strong experience with React, TypeScript, and Node.js',
        'Experience with cloud platforms (AWS/Azure)',
        'Knowledge of database design and optimization',
        'Experience with microservices architecture'
      ],
      posted: '2 days ago'
    },
    {
      id: '2',
      title: 'AI/ML Engineer',
      department: 'engineering',
      location: 'Remote',
      type: 'full-time',
      experience: '3-5 years',
      salary: '₹18-30 LPA',
      description: 'Work on cutting-edge AI systems to enhance personalized learning experiences for UPSC aspirants.',
      requirements: [
        'Strong background in Machine Learning and Deep Learning',
        'Experience with Python, TensorFlow/PyTorch',
        'Knowledge of NLP and recommendation systems',
        'Experience with MLOps and model deployment'
      ],
      posted: '1 week ago'
    },
    {
      id: '3',
      title: 'Content Strategist - UPSC',
      department: 'content',
      location: 'Delhi, India',
      type: 'full-time',
      experience: '2-4 years',
      salary: '₹8-15 LPA',
      description: 'Create and curate high-quality educational content for UPSC preparation across various subjects.',
      requirements: [
        'Strong knowledge of UPSC syllabus and examination pattern',
        'Excellent writing and research skills',
        'Experience in educational content creation',
        'Background in relevant subjects (History, Polity, etc.)'
      ],
      posted: '3 days ago'
    },
    {
      id: '4',
      title: 'UX/UI Designer',
      department: 'design',
      location: 'Bangalore, India',
      type: 'full-time',
      experience: '2-4 years',
      salary: '₹10-18 LPA',
      description: 'Design intuitive and engaging user experiences for our educational platform.',
      requirements: [
        'Proficiency in Figma, Sketch, or similar design tools',
        'Strong understanding of user-centered design principles',
        'Experience with responsive and mobile design',
        'Knowledge of design systems and component libraries'
      ],
      posted: '5 days ago'
    },
    {
      id: '5',
      title: 'Marketing Intern',
      department: 'marketing',
      location: 'Remote',
      type: 'internship',
      experience: '0-1 years',
      salary: '₹15,000-25,000/month',
      description: 'Support our marketing team in digital campaigns, content creation, and social media management.',
      requirements: [
        'Currently pursuing or recently completed degree in Marketing/Communications',
        'Basic understanding of digital marketing',
        'Strong communication and writing skills',
        'Familiarity with social media platforms'
      ],
      posted: '1 day ago'
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs.',
      color: 'red'
    },
    {
      icon: TrendingUp,
      title: 'Growth & Learning',
      description: 'Continuous learning opportunities, conference attendance, and skill development programs.',
      color: 'green'
    },
    {
      icon: Coffee,
      title: 'Work-Life Balance',
      description: 'Flexible working hours, remote work options, and unlimited PTO policy.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate, talented individuals who are committed to making a difference.',
      color: 'blue'
    },
    {
      icon: Wifi,
      title: 'Modern Workspace',
      description: 'State-of-the-art office spaces with latest technology and collaborative environments.',
      color: 'purple'
    },
    {
      icon: Car,
      title: 'Perks & Benefits',
      description: 'Transportation allowance, team outings, free meals, and employee stock options.',
      color: 'indigo'
    }
  ];

  const companyStats = [
    { label: 'Team Members', value: '50+' },
    { label: 'Countries', value: '3' },
    { label: 'Avg. Experience', value: '5+ years' },
    { label: 'Employee Rating', value: '4.8/5' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              Help us revolutionize UPSC preparation and empower thousands of students 
              to achieve their civil services dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#open-positions" 
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#culture" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                Learn About Our Culture
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="culture" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer more than just a job - we provide a platform to make a meaningful impact 
              while growing your career.
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

      {/* Open Positions */}
      <section id="open-positions" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find your next opportunity and help us build the future of education.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                {jobTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded">
                        {job.type.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {departments.find(d => d.id === job.department)?.name}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.experience}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className="text-sm text-gray-500">Posted {job.posted}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {job.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                    {job.requirements.length > 3 && (
                      <li className="text-purple-600">+ {job.requirements.length - 3} more requirements</li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Apply Now
                  </button>
                  <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No positions found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Hiring Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We believe in a transparent and efficient hiring process that respects your time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Application Review
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We review your application and portfolio within 3-5 business days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Initial Interview
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                30-minute call to discuss your background and mutual fit.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Technical Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Role-specific assessment or project to evaluate your skills.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Final Interview
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Meet the team and discuss role expectations and company culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            We're always looking for talented individuals. Send us your resume and let's talk!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:careers@upscdashboard.com" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Send Your Resume
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
