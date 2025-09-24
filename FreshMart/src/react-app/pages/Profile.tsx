import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';


export default function Profile() {
  const { user, redirectToLogin } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    shipping_address: '',
    billing_address: '',
  });

  useEffect(() => {
    if (!user) {
      redirectToLogin();
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            shipping_address: data.shipping_address || '',
            billing_address: data.billing_address || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, redirectToLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-center mb-6">
              {user.google_user_data.picture ? (
                <img
                  src={user.google_user_data.picture}
                  alt={user.google_user_data.name || 'User'}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {user.google_user_data.name || 'User'}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3" />
                <span className="text-sm">Email Verified</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-3" />
                <span className="text-sm">Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Shipping Address
                </label>
                <textarea
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your shipping address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Billing Address
                </label>
                <textarea
                  value={formData.billing_address}
                  onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your billing address"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
