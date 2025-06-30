import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Mic, 
  MessageSquare, 
  Users, 
  Target,
  Heart,
  Lightbulb,
  Globe,
  Award
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Advanced GPT-4o technology transforms your PDFs into comprehensive summaries and interactive learning experiences.'
  },
  {
    icon: Mic,
    title: 'Voice Narration',
    description: 'Listen to your summaries with natural, human-like voice using ElevenLabs technology for audio learning.'
  },
  {
    icon: MessageSquare,
    title: 'Interactive Chat',
    description: 'Ask questions about your documents and receive intelligent, contextual responses from our AI tutor.'
  },
  {
    icon: BookOpen,
    title: 'Smart Quizzes',
    description: 'Auto-generated quizzes help test your understanding and reinforce key concepts from your materials.'
  }
];

const values = [
  {
    icon: Target,
    title: 'Accessibility',
    description: 'Making quality education accessible to everyone, regardless of learning style or background.'
  },
  {
    icon: Heart,
    title: 'Student-Centered',
    description: 'Every feature is designed with the student experience in mind, prioritizing ease of use and effectiveness.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Leveraging cutting-edge AI technology to create new possibilities in educational technology.'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Empowering learners worldwide to achieve their educational goals more efficiently and effectively.'
  }
];

const stats = [
  { number: '10,000+', label: 'Students Helped' },
  { number: '50,000+', label: 'Documents Processed' },
  { number: '100,000+', label: 'Quizzes Generated' },
  { number: '99%', label: 'Satisfaction Rate' }
];

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              About EduAI Tutor
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              We're revolutionizing education by making learning more accessible, engaging, and effective 
              through the power of artificial intelligence. Our mission is to transform how students 
              interact with their learning materials.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              To democratize quality education by providing AI-powered tools that adapt to every 
              student's learning style, making complex materials more digestible and engaging 
              for learners worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">How We're Changing Education</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our platform combines the latest in AI technology with proven educational methodologies 
              to create a learning experience that's both powerful and intuitive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100">
              Numbers that reflect our commitment to educational excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Powered by Cutting-Edge Technology</h2>
            <p className="text-lg text-slate-600 mb-12">
              EduAI Tutor leverages the most advanced AI technologies available to provide 
              an unparalleled learning experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Azure OpenAI GPT-4o</h3>
                <p className="text-slate-600">Advanced language model for intelligent summarization and conversation</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">ElevenLabs Voice</h3>
                <p className="text-slate-600">Natural, human-like voice synthesis for audio learning experiences</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Supabase Platform</h3>
                <p className="text-slate-600">Secure, scalable backend infrastructure for seamless user experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of students who are already learning smarter with EduAI Tutor. 
              Experience the future of education today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Free
              </a>
              <a
                href="/sponsors"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-lg border border-slate-200"
              >
                View Our Partners
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}