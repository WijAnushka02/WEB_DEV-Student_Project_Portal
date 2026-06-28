import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShield, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheckCircle,
  FiAlertTriangle, FiActivity, FiUsers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

function AdminStatCard({ icon: Icon, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-xl px-4 py-3"
    >
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
        <Icon size={16} className="text-white/80" />
      </div>
      <span className="text-white/70 text-sm">{label}</span>
    </motion.div>
  );
}

export default function AdminAuthPage() {
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyError, setKeyError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) { setKeyError('Secret key is required'); return; }
    setKeyError('');
    setLoading(true);
    try {
      await api.post('/auth/admin/verify-key', { secretKey });
      setVerified(true);
      toast.success('Key verified.');
    } catch (err) {
      setKeyError(err.response?.data?.message || 'Invalid secret key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col justify-between p-10
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="admin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-grid)" />
          </svg>
        </div>

        {/* Top — logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 11 L7 3 L12 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 8.5 H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">UOK Connect</span>
        </motion.div>

        {/* Centre */}
        <div className="relative space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <FiShield size={13} className="text-green-400" />
              <span className="text-white/80 text-xs font-medium">Restricted Access</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Admin<br />Portal
            </h1>
            <p className="text-white/50 text-sm mt-4 max-w-xs leading-relaxed">
              This portal is for authorised administrators only.
              Access requires a valid secret key followed by Google authentication.
            </p>
          </motion.div>

          {/* Capability list */}
          <div className="space-y-2.5">
            <AdminStatCard icon={FiUsers} label="Manage all users and accounts" delay={0.4} />
            <AdminStatCard icon={FiActivity} label="Monitor platform activity" delay={0.5} />
            <AdminStatCard icon={FiAlertTriangle} label="Remove inappropriate content" delay={0.6} />
          </div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <p className="text-white/30 text-xs">
            This page is not publicly listed · For authorized personnel only
          </p>
        </motion.div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile brand */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 11 L7 3 L12 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 8.5 H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900">UOK <span className="text-green-600">Connect</span></span>
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <FiShield size={20} className="text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            {verified
              ? 'Key verified. Complete sign-in with Google.'
              : 'Enter your admin secret key to continue.'}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[
              { label: 'Verify Key', done: verified },
              { label: 'Google Sign-in', done: false },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                {i > 0 && <div className={`h-px w-8 ${verified ? 'bg-gray-300' : 'bg-gray-100'}`} />}
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.done
                      ? 'bg-green-600 text-white'
                      : i === 0 && !verified
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.done ? <FiCheckCircle size={11} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    i === 0 && !verified ? 'text-gray-900' :
                    step.done ? 'text-green-600' :
                    verified ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {!verified ? (
              <motion.form
                key="key-form"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleVerify}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Admin Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={secretKey}
                      onChange={(e) => { setSecretKey(e.target.value); setKeyError(''); }}
                      placeholder="Enter your secret key"
                      autoFocus
                      className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-shadow ${
                        keyError
                          ? 'border-red-300 bg-red-50 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-gray-300 focus:border-gray-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {keyError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-600"
                    >
                      {keyError}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !secretKey.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <FiLock size={15} />
                      Verify Key
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="google-step"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                  <FiCheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Secret key verified. Sign in with the Google account registered as admin.
                  </p>
                </div>

                <a
                  href={`${API_BASE}/auth/admin/google`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                >
                  <GoogleIcon />
                  Sign in with Google
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              to="/auth/login"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
