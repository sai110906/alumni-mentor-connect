import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Briefcase, Award, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-white">AlumniConnect<span className="text-indigo-400">.edu</span></span>
              <p className="text-[10px] text-slate-400 font-medium">College Mentorship & Career Platform</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About Project
            </Link>
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'student') navigate('/student/dashboard');
                  else if (user.role === 'alumni') navigate('/alumni/dashboard');
                  else navigate('/admin/dashboard');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Join Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[300px] bg-indigo-600/20 blur-[130px] rounded-full"></div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mx-auto mb-8">
          <Sparkles className="w-4 h-4 text-indigo-400" /> College Final-Year Capstone Project
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Bridge the Gap Between <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Campus & Career</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Connect current students directly with accomplished college alumni for 1-on-1 mentorship, technical guidance, and exclusive career job opportunities.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register?role=student"
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-3 group"
          >
            Student Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/register?role=alumni"
            className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-base shadow-xl transition-all flex items-center gap-3"
          >
            Alumni Registration
          </Link>
        </div>

        {/* Quick Demo Pre-fill Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-3xl mx-auto text-left shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Demo Review Accounts Pre-configured
            </h3>
            <span className="text-[11px] text-slate-400">Ready for Project Review</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <p className="font-bold text-emerald-400 mb-1">Student Demo</p>
              <p className="text-slate-300 font-mono">alex.student@college.edu</p>
              <p className="text-slate-500 mt-1">Pass: Student@123</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <p className="font-bold text-indigo-400 mb-1">Alumni Demo</p>
              <p className="text-slate-300 font-mono">sarah.alumni@techcorp.com</p>
              <p className="text-slate-500 mt-1">Pass: Alumni@123</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <p className="font-bold text-rose-400 mb-1">Admin Demo</p>
              <p className="text-slate-300 font-mono">admin@college.edu</p>
              <p className="text-slate-500 mt-1">Pass: Admin@123</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Core Portal Architecture</h2>
            <p className="text-slate-400 mt-2 text-sm">Designed specifically for college final year presentation review.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1-on-1 Mentorship</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Students can search alumni by specific technology domains or skills, send custom mentorship requests, and receive 1-on-1 career direction.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Exclusive Job Portal</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Alumni post hiring openings and internship referrals. Students submit applications and track candidate status in real-time.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Administrative Control</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Comprehensive oversight panel for college administrators to manage users, monitor active mentorships, and audit job postings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Integrated Alumni–Student Mentorship & Job Portal. Built with MERN Stack.</p>
      </footer>
    </div>
  );
};

export default Landing;
