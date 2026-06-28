import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBookOpen, FiBriefcase, FiArrowRight, FiCode, FiUsers, FiTrendingUp,
} from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// Floating stat card for the left panel
function StatCard({ icon: Icon, value, label, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg ${className}`}
    >
      <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-white font-bold text-base leading-none">{value}</p>
        <p className="text-white/60 text-xs mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// Floating project card preview
function MiniProjectCard({ title, tech, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3.5 shadow-md"
    >
      <div className="w-full h-1.5 bg-white/20 rounded-full mb-2.5">
        <div className="h-full bg-white/50 rounded-full" style={{ width: '60%' }} />
      </div>
      <p className="text-white text-xs font-semibold truncate">{title}</p>
      <div className="flex gap-1.5 mt-1.5">
        {tech.map((t) => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded-md">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [idError, setIdError] = useState('');

  const validateStudentId = (val) => {
    if (!val.trim()) return 'Student ID is required';
    if (!/^[A-Za-z0-9/\-]{3,20}$/.test(val.trim())) return 'Enter a valid student ID (e.g. 2020/CS/001)';
    return '';
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    const err = validateStudentId(studentId);
    if (err) { setIdError(err); return; }

    // Store student ID to be picked up after OAuth completes
    sessionStorage.setItem('pending_student_id', studentId.trim().toUpperCase());
    window.location.href = `${API_BASE}/auth/google/student`;
  };

  const studentIdReady = studentId.trim().length > 0 && !validateStudentId(studentId);

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col justify-between p-10
        bg-gradient-to-br from-green-700 via-green-600 to-emerald-500"
      >
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top — logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 11 L7 3 L12 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 8.5 H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">UOK Connect</span>
        </motion.div>

        {/* Centre — hero text */}
        <div className="relative space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Where student<br />projects meet<br />opportunity.
            </h1>
            <p className="text-white/70 text-base mt-4 max-w-xs leading-relaxed">
              Showcase your work, connect with companies, and build your career from
              the University of Kelaniya.
            </p>
          </motion.div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            <StatCard icon={FiCode} value="500+" label="Projects" delay={0.4} />
            <StatCard icon={FiUsers} value="200+" label="Students" delay={0.5} />
            <StatCard icon={FiBriefcase} value="50+" label="Companies" delay={0.6} />
            <StatCard icon={FiTrendingUp} value="1k+" label="Connections" delay={0.7} />
          </div>
        </div>

        {/* Bottom — floating project cards */}
        <div className="relative space-y-2.5">
          <MiniProjectCard
            title="Smart Campus Navigation System"
            tech={['React', 'Node.js', 'ML']}
            delay={0.9}
          />
          <MiniProjectCard
            title="Lecture Attendance Tracker"
            tech={['Flutter', 'Firebase']}
            delay={1.0}
          />
          <p className="text-white/40 text-xs mt-3">
            Faculty of Computing · University of Kelaniya
          </p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 11 L7 3 L12 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 8.5 H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900">UOK <span className="text-green-600">Connect</span></span>
          </Link>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          {/* Role tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6 gap-1">
            {[
              { id: 'student', label: 'Student', icon: FiBookOpen },
              { id: 'company', label: 'Company', icon: FiBriefcase },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setRole(id); setIdError(''); setStudentId(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <AnimatePresence mode="wait">
            {role === 'student' ? (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      University Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        if (idError) setIdError(validateStudentId(e.target.value));
                      }}
                      onBlur={() => setIdError(validateStudentId(studentId))}
                      placeholder="e.g. 2020/CS/001"
                      autoFocus
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-shadow ${
                        idError
                          ? 'border-red-300 bg-red-50 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                      }`}
                    />
                    {idError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-600"
                      >
                        {idError}
                      </motion.p>
                    )}
                    <p className="mt-1.5 text-xs text-gray-400">
                      This will be linked to your Google account
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!studentIdReady}
                    className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      studentIdReady
                        ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <GoogleIcon />
                    Continue with Google
                    {studentIdReady && <FiArrowRight size={15} />}
                  </button>
                </form>

                <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
                  Your student ID will be verified and stored in your profile.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <p className="text-sm font-medium text-purple-900 mb-1">For Companies & Recruiters</p>
                  <p className="text-xs text-purple-600 leading-relaxed">
                    Browse student projects, like work you love, and follow talented students.
                    No account needed to browse.
                  </p>
                </div>

                <a
                  href={`${API_BASE}/auth/google/recruiter`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                >
                  <GoogleIcon />
                  Continue with Google
                </a>

                <p className="text-xs text-center text-gray-400">
                  Or{' '}
                  <Link to="/projects" className="text-green-600 hover:underline">
                    browse projects without signing in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-xs text-gray-400">
            Admin portal?{' '}
            <Link to="/admin/auth" className="text-gray-500 hover:text-gray-700 font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
