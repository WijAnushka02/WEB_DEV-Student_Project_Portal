import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function CompleteProfilePage() {
  const { fetchMe, user } = useAuthStore();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  // Pick up the student ID stored before the OAuth redirect
  useEffect(() => {
    const pending = sessionStorage.getItem('pending_student_id');
    if (pending) {
      setStudentId(pending);
      // Auto-submit immediately — the user already entered their ID on the login page
      setAutoSubmitting(true);
      submitStudentId(pending);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (val) => {
    if (!val.trim()) return 'Student ID is required';
    if (!/^[A-Za-z0-9/\-]{3,20}$/.test(val.trim())) return 'Invalid format (e.g. 2020/CS/001)';
    return '';
  };

  const submitStudentId = async (id) => {
    setSubmitting(true);
    try {
      await api.post('/auth/complete-profile', { student_id: id });
      sessionStorage.removeItem('pending_student_id');
      toast.success('Profile set up successfully!');
      await fetchMe();
      navigate('/dashboard');
    } catch (err) {
      sessionStorage.removeItem('pending_student_id');
      setAutoSubmitting(false);
      toast.error(err.response?.data?.message || 'Something went wrong.');
      setError(err.response?.data?.message || 'Could not save student ID.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate(studentId);
    if (err) { setError(err); return; }
    setError('');
    submitStudentId(studentId.trim().toUpperCase());
  };

  if (autoSubmitting && submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Setting up your profile…</p>
          <p className="text-gray-400 text-sm mt-1">Linking your student ID</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
            <FiBookOpen size={28} className="text-green-600" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">One last step</h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Enter your university student ID to complete your profile.
            It will be visible on your public page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 2020/CS/001"
              autoFocus
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-shadow ${
                error
                  ? 'border-red-300 bg-red-50 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
              }`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-600"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !studentId.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FiCheckCircle size={16} />
                Complete Profile
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
