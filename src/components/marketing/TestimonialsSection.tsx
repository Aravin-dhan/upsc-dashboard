'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Priya Sharma',
      rank: 'IAS Rank 23, 2023',
      image: '/api/placeholder/64/64',
      quote: 'The AI Assistant was like having a personal mentor. It identified my weak areas and created targeted study plans that helped me crack the exam in my second attempt.',
      rating: 5,
      achievement: 'Cleared in 2nd attempt',
      subjects: ['History', 'Geography', 'Ethics']
    },
    {
      name: 'Rajesh Kumar',
      rank: 'IPS Rank 45, 2023',
      image: '/api/placeholder/64/64',
      quote: 'The interactive maps and current affairs integration made geography and GS preparation so much easier. The progress tracking kept me motivated throughout.',
      rating: 5,
      achievement: 'Improved 200+ ranks',
      subjects: ['Geography', 'Current Affairs', 'Public Administration']
    },
    {
      name: 'Anita Patel',
      rank: 'IFS Rank 12, 2023',
      image: '/api/placeholder/64/64',
      quote: 'As a working professional, the smart scheduling feature was a game-changer. It optimized my limited study time and helped me maintain consistency.',
      rating: 5,
      achievement: 'Cleared while working',
      subjects: ['International Relations', 'Economics', 'Environment']
    },
    {
      name: 'Vikram Singh',
      rank: 'IAS Rank 67, 2022',
      image: '/api/placeholder/64/64',
      quote: 'The mock test series and performance analytics gave me confidence. I could see exactly where I stood and what needed improvement.',
      rating: 5,
      achievement: 'First attempt success',
      subjects: ['Polity', 'Economics', 'Sociology']
    },
    {
      name: 'Meera Reddy',
      rank: 'IRS Rank 34, 2023',
      image: '/api/placeholder/64/64',
      quote: 'The comprehensive study material and AI-powered doubt resolution saved me months of preparation time. Highly recommended!',
      rating: 5,
      achievement: 'Top 50 rank',
      subjects: ['Taxation', 'Economics', 'Law']
    }
  ];

  const stats = [
    { value: '2,500+', label: 'Successful Candidates', icon: Award },
    { value: '85%', label: 'Success Rate', icon: TrendingUp },
    { value: '4.9/5', label: 'Average Rating', icon: Star },
    { value: '50+', label: 'States Covered', icon: Quote }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful UPSC candidates who achieved their dreams with our platform. 
            Here's what they have to say about their journey.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12 mb-12">
          <div className="absolute top-6 left-6">
            <Quote className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Testimonial Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rating */}
              <div className="flex items-center space-x-1">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              {/* Author Info */}
              <div className="space-y-2">
                <div className="font-bold text-gray-900 dark:text-white text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  {testimonials[currentTestimonial].rank}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                    {testimonials[currentTestimonial].achievement}
                  </span>
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2">
                {testimonials[currentTestimonial].subjects.map((subject, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Image & Navigation */}
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                  <Award className="h-4 w-4" />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">{testimonial.rank}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of successful UPSC candidates and start your journey towards achieving your IAS dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </a>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200"
            >
              Explore Features
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
