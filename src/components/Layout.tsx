import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Upload, 
  MessageSquare, 
  Brain, 
  User, 
  LogOut,
  Home,
  Info,
  Award
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Quiz', href: '/quiz', icon: Brain },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Layout() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduAI Tutor
              </span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Bolt Badge */}
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <img
                  src="https://github.com/Jerryblessed/bolt-hackathon-badge/blob/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.png?raw=true"
                  alt="Bolt"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Built with Bolt</span>
              </a>

              {/* Additional Links */}
              <Link
                to="/about"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Info className="w-5 h-5" />
              </Link>
              <Link
                to="/sponsors"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Award className="w-5 h-5" />
              </Link>

              {/* User Menu */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}