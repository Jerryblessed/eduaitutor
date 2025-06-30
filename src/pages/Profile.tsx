import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building, Save, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    institution: profile?.institution || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile(formData);
      if (error) throw error;

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      institution: profile?.institution || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Profile Settings
            </h1>
            <p className="text-lg text-slate-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            {/* Profile Picture */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl font-bold">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-4">
                {profile?.full_name || user?.email}
              </h2>
              <p className="text-slate-600">{user?.email}</p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg transition-colors ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-slate-50 text-slate-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-slate-700 mb-2">
                  Institution
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="institution"
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg transition-colors ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-slate-50 text-slate-500'
                    }`}
                    placeholder="Enter your institution"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>

            {/* Account Info */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Member since:</span>
                  <p className="font-medium text-slate-900">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Last updated:</span>
                  <p className="font-medium text-slate-900">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}