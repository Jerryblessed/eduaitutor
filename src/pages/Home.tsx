import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Mic, 
  Upload, 
  Users,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: Upload,
    title: 'Smart PDF Upload',
    description: 'Upload academic PDFs and extract content with AI-powered parsing',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Brain,
    title: 'AI Summarization',
    description: 'Get comprehensive summaries of your learning materials using GPT-4o',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Mic,
    title: 'Voice Narration',
    description: 'Listen to your summaries with natural voice using ElevenLabs',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: MessageSquare,
    title: 'Interactive Chat',
    description: 'Ask questions about your documents and get intelligent responses',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Brain,
    title: 'Quiz Generation',
    description: 'Auto-generate quizzes to test your understanding of the material',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Users,
    title: 'Progress Tracking',
    description: 'Track your learning progress and quiz scores over time',
    color: 'from-teal-500 to-cyan-500'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    content: 'EduAI Tutor has revolutionized how I study. The AI summaries save me hours of reading time!',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'Medical Student',
    content: 'The quiz generation feature helps me test my knowledge effectively. Perfect for exam prep.',
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    role: 'Graduate Student',
    content: 'Voice narration makes studying while commuting possible. Game-changer for busy students!',
    rating: 5
  }
];

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Learning{' '}
              </span>
              Experience
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              EduAI Tutor uses cutting-edge AI to turn your PDFs into interactive learning experiences. 
              Get summaries, voice narration, quizzes, and personalized tutoring - all powered by GPT-4o and ElevenLabs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-lg border border-slate-200"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Modern Learning
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to supercharge your study sessions and maximize learning efficiency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Students Worldwide
            </h2>
            <p className="text-lg text-slate-600">
              See what learners are saying about EduAI Tutor
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-slate-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who are already learning smarter with EduAI Tutor
            </p>
            {!user && (
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Learning Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}