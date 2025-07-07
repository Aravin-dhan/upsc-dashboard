'use client';

import { 
  Target, Users, Award, TrendingUp, Heart, Globe,
  BookOpen, Zap, Shield, Star, ArrowRight, CheckCircle
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function AboutPage() {
  const stats = [
    { label: 'Students Helped', value: '50,000+' },
    { label: 'Success Rate', value: '85%' },
    { label: 'Study Materials', value: '10,000+' },
    { label: 'Years of Experience', value: '8+' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from content quality to user experience.',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Student-Centric',
      description: 'Every decision we make is guided by what\'s best for our students and their success.',
      color: 'red'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge tools and learning experiences.',
      color: 'yellow'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We maintain the highest standards of integrity and transparency in all our operations.',
      color: 'green'
    }
  ];

  const team = [
    {
      name: 'Aravindhan B',
      role: 'Founder & CEO',
      bio: 'Passionate about education technology and UPSC preparation. 8+ years of experience in EdTech.',
      avatar: '👨‍💼',
      contact: 'aravindhanb2004@gmail.com'
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Head of Content',
      bio: 'Former IAS officer (AIR 1, 2015) with expertise in UPSC curriculum and examination patterns.',
      avatar: '👨‍🏫',
      contact: 'content@upscdashboard.com'
    },
    {
      name: 'Priya Sharma',
      role: 'Lead AI Engineer',
      bio: 'AI/ML expert specializing in educational technology and personalized learning systems.',
      avatar: '👩‍💻',
      contact: 'ai@upscdashboard.com'
    },
    {
      name: 'Vikram Joshi',
      role: 'Head of Student Success',
      bio: 'Dedicated to ensuring every student achieves their UPSC goals through personalized guidance.',
      avatar: '👨‍🎓',
      contact: 'success@upscdashboard.com'
    }
  ];

  const milestones = [
    {
      year: '2016',
      title: 'Foundation',
      description: 'Started as a small initiative to help UPSC aspirants with quality study materials.'
    },
    {
      year: '2018',
      title: 'Digital Platform Launch',
      description: 'Launched our first digital platform with comprehensive study resources and mock tests.'
    },
    {
      year: '2020',
      title: 'AI Integration',
      description: 'Introduced AI-powered study assistant to provide personalized learning experiences.'
    },
    {
      year: '2022',
      title: '10,000 Students',
      description: 'Reached milestone of helping 10,000+ students in their UPSC preparation journey.'
    },
    {
      year: '2023',
      title: 'Advanced Analytics',
      description: 'Launched advanced performance analytics and adaptive learning algorithms.'
    },
    {
      year: '2024',
      title: 'Multi-Tenant Platform',
      description: 'Evolved into a comprehensive multi-tenant SaaS platform serving educational institutions.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About UPSC Dashboard
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              Empowering UPSC aspirants with AI-driven learning, comprehensive study materials, 
              and personalized guidance to achieve their civil services dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="/careers" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Join Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
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

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                To democratize UPSC preparation by providing world-class educational technology, 
                comprehensive study materials, and personalized guidance that empowers every 
                aspirant to achieve their civil services goals.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We believe that with the right tools, guidance, and determination, every student 
                can succeed in the UPSC examination and contribute meaningfully to society.
              </p>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                To become the leading platform for UPSC preparation globally, known for innovation, 
                quality, and student success. We envision a future where technology enhances 
                learning and makes quality education accessible to all.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our goal is to create a community of successful civil servants who are well-prepared 
                to serve the nation with integrity and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our culture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-${value.color}-100 dark:bg-${value.color}-900/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className={`h-8 w-8 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Passionate educators, technologists, and UPSC experts dedicated to your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {member.bio}
                </p>
                <a 
                  href={`mailto:${member.contact}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {member.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From a small initiative to a comprehensive platform serving thousands of students.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 dark:bg-blue-800"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recognition & Achievements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by students and industry experts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Best EdTech Platform 2023
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recognized for innovation in educational technology and student outcomes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4.9/5 Student Rating
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Consistently high ratings from students for content quality and support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                85% Success Rate
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Industry-leading success rate among students who complete our programs.
              </p>
            </div>
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
            Join thousands of successful students who have achieved their dreams with UPSC Dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <a 
              href="/demo" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
