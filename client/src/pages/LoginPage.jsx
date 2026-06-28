import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">U</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to UOK Connect</h1>
          <p className="text-gray-500 text-sm mt-2">Choose how you'd like to sign in</p>
        </div>

        <div className="space-y-3">
          {/* Student login */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <a
              href={`${API_BASE}/auth/google/student`}
              className="flex items-center gap-4 w-full p-4 bg-white border-2 border-green-200 hover:border-green-400 rounded-2xl transition-all group shadow-sm"
            >
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                🎓
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 text-sm">Student</div>
                <div className="text-gray-400 text-xs">Showcase your projects</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-green-600 transition-colors">
                <GoogleIcon /> Sign in
              </div>
            </a>
          </motion.div>

          {/* Company / Recruiter login */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <a
              href={`${API_BASE}/auth/google/recruiter`}
              className="flex items-center gap-4 w-full p-4 bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl transition-all group shadow-sm"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                💼
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 text-sm">Company / Recruiter</div>
                <div className="text-gray-400 text-xs">Find talent, like &amp; follow</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                <GoogleIcon /> Sign in
              </div>
            </a>
          </motion.div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Companies can{' '}
          <Link to="/projects" className="text-green-600 hover:underline">browse projects</Link>{' '}
          without signing in
        </p>

        <div className="mt-4 text-center">
          <div className="h-px bg-gray-100 my-4" />
          <p className="text-xs text-gray-400">
            Are you an admin?{' '}
            <Link to="/admin/auth" className="text-gray-500 hover:text-gray-700">
              Admin portal →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
