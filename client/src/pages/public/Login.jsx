import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, LogIn, Sparkles, User, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'alumni') navigate('/alumni/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-white mt-4">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your Alumni–Student Portal account</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Demo Login Pre-fill:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex.student@college.edu', 'Student@123')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-500/40 border border-slate-700 text-xs font-semibold text-emerald-300 transition-all flex items-center justify-center gap-1"
            >
              <User className="w-3 h-3" /> Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sarah.alumni@techcorp.com', 'Alumni@123')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-950/60 hover:border-indigo-500/40 border border-slate-700 text-xs font-semibold text-indigo-300 transition-all flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3" /> Alumni
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:border-rose-500/40 border border-slate-700 text-xs font-semibold text-rose-300 transition-all flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'} <LogIn className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
