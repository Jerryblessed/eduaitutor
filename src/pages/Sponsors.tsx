import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Award } from 'lucide-react';

const sponsors = [
  {
    name: 'Bolt',
    description: 'The AI-powered development platform that made this project possible. Build full-stack applications with AI assistance.',
    logo: 'https://github.com/Jerryblessed/bolt-hackathon-badge/blob/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.png?raw=true',
    url: 'https://bolt.new',
    category: 'Development Platform'
  },
  {
    name: 'Supabase',
    description: 'Open source Firebase alternative providing the database, authentication, and real-time subscriptions for EduAI Tutor.',
    logo: 'https://github.com/Jerryblessed/bolt-hackathon-badge/blob/main/src/public/supabase/logo-color.png?raw=true',
    url: 'https://supabase.com',
    category: 'Backend Infrastructure'
  },
  {
    name: 'ElevenLabs',
    description: 'AI voice technology powering the natural speech synthesis and voice narration features in our learning platform.',
    logo: 'https://github.com/Jerryblessed/bolt-hackathon-badge/blob/main/src/public/elevenlabs/logo-color.png?raw=true',
    url: 'https://elevenlabs.io',
    category: 'AI Voice Technology'
  },
  {
    name: 'RevenueCat',
    description: 'In-app subscription management platform helping developers build sustainable app businesses.',
    logo: 'https://raw.githubusercontent.com/Jerryblessed/bolt-hackathon-badge/59cace5d72567411298dc94bd6e16c7612b07f48/src/public/revenuecat/wordmark-black.svg',
    url: 'https://revenuecat.com',
    category: 'Subscription Management'
  },
  {
    name: 'Netlify',
    description: 'Modern web development platform providing hosting, deployment, and serverless functions for our application.',
    logo: 'https://raw.githubusercontent.com/Jerryblessed/bolt-hackathon-badge/59cace5d72567411298dc94bd6e16c7612b07f48/src/public/netlify/wordmark-color.svg',
    url: 'https://netlify.com',
    category: 'Hosting & Deployment'
  }
];

const technologies = [
  { name: 'Azure OpenAI', description: 'GPT-4o for intelligent content processing' },
  { name: 'React', description: 'Modern frontend framework' },
  { name: 'TypeScript', description: 'Type-safe development' },
  { name: 'Tailwind CSS', description: 'Utility-first styling' },
  { name: 'Vite', description: 'Fast build tool and dev server' },
  { name: 'Framer Motion', description: 'Smooth animations and interactions' }
];

export function Sponsors() {
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
              <Award className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Our Amazing Partners
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              EduAI Tutor is built with the support of incredible technology partners who share our 
              vision of making education more accessible and effective through innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Technology Partners</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              These innovative companies provide the foundation that makes EduAI Tutor possible, 
              from AI capabilities to infrastructure and development tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{sponsor.name}</h3>
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-3">{sponsor.category}</p>
                    <p className="text-slate-600 leading-relaxed">{sponsor.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Built With Modern Technologies</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our tech stack combines the latest tools and frameworks to deliver a fast, 
              reliable, and scalable learning platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-slate-50 rounded-xl"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">{tech.name}</h3>
                <p className="text-slate-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Heart className="w-8 h-8 text-pink-300" />
              <h2 className="text-4xl font-bold text-white">Built for Bolt Hackathon</h2>
              <Heart className="w-8 h-8 text-pink-300" />
            </div>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              EduAI Tutor was created as part of the Bolt Hackathon, showcasing the power of 
              AI-assisted development and the incredible possibilities when innovative tools 
              come together to solve real-world problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <img
                  src="https://github.com/Jerryblessed/bolt-hackathon-badge/blob/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.png?raw=true"
                  alt="Bolt"
                  className="w-6 h-6 mr-2"
                />
                Try Bolt
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              <a
                href="/auth"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Start Learning
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Thank You to Our Partners
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              We're grateful for the support of these amazing companies that make innovation 
              in education possible. Together, we're building the future of learning.
            </p>
            
            <div className="flex justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Experience EduAI Tutor
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}