import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function AdminAuthPage() {
  const [secretKey, setSecretKey] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) return;
    setLoading(true);
    try {
      await api.post('/auth/admin/verify-key', { secretKey });
      setVerified(true);
      toast.success('Key verified! Proceed to Google sign-in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-800 rounded-2xl mb-4">
            <FiLock size={24} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Restricted access · UOK Connect</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {!verified ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-gray-100 disabled:bg-gray-600 text-gray-900 font-semibold rounded-xl transition-colors text-sm"
              >
                {loading ? 'Verifying...' : 'Verify Key'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="text-green-400 text-sm font-medium">✓ Key verified</div>
              <p className="text-gray-400 text-sm">Sign in with your Google account to access the admin dashboard.</p>
              <a
                href={`${API_BASE}/auth/admin/google`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-colors text-sm"
              >
                <GoogleIcon />
                Sign in with Google
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          This page is not publicly listed · Admin use only
        </p>
      </motion.div>
    </div>
  );
}
