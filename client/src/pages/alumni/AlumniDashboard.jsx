import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { Users, Send, Briefcase, FileText, PlusCircle, UserCheck, Sparkles, ArrowRight } from 'lucide-react';

const AlumniDashboard = () => {
  const { user, userProfile } = useAuth();
  const [mentees, setMentees] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumniDashboardData();
  }, []);

  const fetchAlumniDashboardData = async () => {
    try {
      const [menteesRes, requestsRes, jobsRes, appsRes] = await Promise.all([
        API.get('/mentorship/my-mentees'),
        API.get('/mentorship/incoming'),
        API.get('/jobs/my-jobs'),
        API.get('/applications/job-applicants'),
      ]);
      setMentees(menteesRes.data);
      setIncomingRequests(requestsRes.data);
      setMyJobs(jobsRes.data);
      setApplicants(appsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading alumni workspace..." />
      </Layout>
    );
  }

  const pendingRequests = incomingRequests.filter((r) => r.status === 'pending');

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/30 shadow-2xl relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Alumni Portal Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {user?.name}!</h1>
          <p className="text-purple-200 text-sm mt-2 leading-relaxed">
            {userProfile?.designation || 'Senior Professional'} @ {userProfile?.company || 'Industry Partner'}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/alumni/post-job"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Post Job Opportunity
            </Link>
            <Link
              to="/alumni/mentorship-requests"
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-semibold text-xs hover:bg-slate-800 transition-all"
            >
              Review Requests ({pendingRequests.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{pendingRequests.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Mentees</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{mentees.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">My Job Posts</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{myJobs.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Applicants</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{applicants.length}</p>
        </div>
      </div>

      {/* Grid: Pending Mentorship Requests & Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Requests */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" /> Pending Mentorship Requests
            </h2>
            <Link to="/alumni/mentorship-requests" className="text-xs font-semibold text-indigo-400 hover:underline">
              Manage All
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
              No pending mentorship requests right now.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        req.student?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={req.student?.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{req.student?.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {req.studentProfile?.department} (Grad {req.studentProfile?.graduationYear})
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/alumni/mentorship-requests"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                  >
                    Respond
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Job Applicants */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Recent Applicants
            </h2>
            <Link to="/alumni/applicants" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {applicants.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
              No student applications submitted yet for your job postings.
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.slice(0, 3).map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.student?.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Applied for: <span className="text-indigo-300 font-medium">{app.job?.title}</span>
                    </p>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AlumniDashboard;
