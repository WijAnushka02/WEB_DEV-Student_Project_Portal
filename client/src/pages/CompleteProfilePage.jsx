import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const schema = z.object({
  student_id: z
    .string()
    .min(1, 'Student ID is required')
    .max(20, 'Student ID too long')
    .regex(/^[A-Za-z0-9/\-]+$/, 'Invalid student ID format'),
});

export default function CompleteProfilePage() {
  const { fetchMe } = useAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/auth/complete-profile', { student_id: data.student_id });
      toast.success('Profile completed!');
      await fetchMe();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your university student ID to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Student ID
            </label>
            <input
              {...register('student_id')}
              placeholder="e.g. 2020/CS/001"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${
                errors.student_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.student_id && (
              <p className="mt-1.5 text-xs text-red-600">{errors.student_id.message}</p>
            )}
            <p className="mt-1.5 text-xs text-gray-400">
              This will be visible on your public profile
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {submitting ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
