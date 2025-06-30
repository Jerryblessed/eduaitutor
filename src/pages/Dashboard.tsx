import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Upload, 
  Brain, 
  MessageSquare, 
  Clock,
  FileText,
  Award,
  TrendingUp,
  Plus,
  Play
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, Document, Quiz, QuizResult } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DashboardStats {
  documentsCount: number;
  quizzesCount: number;
  averageScore: number;
  studyTime: number;
}

export function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    documentsCount: 0,
    quizzesCount: 0,
    averageScore: 0,
    studyTime: 0
  });
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [recentQuizResults, setRecentQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch documents
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (documentsError) throw documentsError;

      // Fetch quiz results
      const { data: quizResults, error: quizResultsError } = await supabase
        .from('quiz_results')
        .select('*, quizzes(title)')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (quizResultsError) throw quizResultsError;

      // Calculate stats
      const documentsCount = documents?.length || 0;
      const quizzesCount = quizResults?.length || 0;
      const averageScore = quizResults?.length 
        ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length)
        : 0;

      setStats({
        documentsCount,
        quizzesCount,
        averageScore,
        studyTime: documentsCount * 15 // Rough estimate
      });

      setRecentDocuments(documents || []);
      setRecentQuizResults(quizResults || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload PDF',
      description: 'Add new learning material',
      icon: Upload,
      href: '/upload',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Start Quiz',
      description: 'Test your knowledge',
      icon: Brain,
      href: '/quiz',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Chat with AI',
      description: 'Ask questions about your content',
      icon: MessageSquare,
      href: '/chat',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const statCards = [
    {
      title: 'Documents',
      value: stats.documentsCount,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Quizzes Taken',
      value: stats.quizzesCount,
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Study Time',
      value: `${stats.studyTime}min`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.full_name || user?.email}! 👋
          </h1>
          <p className="text-slate-600">
            Ready to continue your learning journey? Here's what's happening with your studies.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-600 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{action.title}</h3>
                  <p className="text-slate-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Documents</h2>
              <Link
                to="/upload"
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Link>
            </div>
            
            {recentDocuments.length > 0 ? (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate">{doc.title}</h3>
                      <p className="text-xs text-slate-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/chat?doc=${doc.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Play className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No documents yet</p>
                <Link
                  to="/upload"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Upload your first PDF
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Quiz Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Quiz Results</h2>
              <Link
                to="/quiz"
                className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Take Quiz
              </Link>
            </div>
            
            {recentQuizResults.length > 0 ? (
              <div className="space-y-4">
                {recentQuizResults.map((result) => (
                  <div key={result.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        Quiz Result
                      </h3>
                      <p className="text-xs text-slate-500">
                        {new Date(result.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        result.score >= 80 ? 'text-green-600' : 
                        result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No quiz results yet</p>
                <Link
                  to="/quiz"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Take your first quiz
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}