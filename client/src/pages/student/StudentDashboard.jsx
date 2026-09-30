import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { Users, Send, Briefcase, FileCheck, ArrowRight, UserCheck, Sparkles, Building2 } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [applications, setApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [mentorsRes, appsRes, requestsRes] = await Promise.all([
        API.get('/mentorship/my-mentors'),
        API.get('/applications/my-applications'),
        API.get('/mentorship/my-requests'),
      ]);
      setMentors(mentorsRes.data);
      setApplications(appsRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading student dashboard..." />
      </Layout>
    );
  }

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Student Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-200 text-sm mt-2 leading-relaxed">
            Explore alumni mentors in your domain, submit 1-on-1 mentorship requests, and apply for exclusive job referrals.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/student/find-alumni"
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              Find Alumni Mentors <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/student/jobs"
              className="px-5 py-2.5 rounded-xl bg-indigo-950/60 border border-indigo-400/30 text-white font-semibold text-xs hover:bg-indigo-950 transition-all"
            >
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Accepted Mentors</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{mentors.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Mentorship Requests</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{requests.length}</p>
          <p className="text-[11px] text-amber-400 mt-1">{pendingRequestsCount} Pending</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Submitted Applications</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{applications.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Explore Network</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <Link to="/student/find-alumni" className="text-xs font-bold text-sky-400 hover:underline mt-4 block">
            Search Alumni Directory →
          </Link>
        </div>
      </div>

      {/* Grid: Accepted Mentors & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accepted Mentors */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" /> Active Mentors
            </h2>
            <Link to="/student/mentorship-requests" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {mentors.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
              No active mentors yet. Send a request to an alumnus from the Find Alumni page!
            </div>
          ) : (
            <div className="space-y-3">
              {mentors.map((item) => (
                <div
                  key={item.request._id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.alumni?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={item.alumni?.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.alumni?.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {item.profile?.designation} @ {item.profile?.company || 'Industry Leader'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" /> Job Applications
            </h2>
            <Link to="/student/applications" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
              You haven't applied to any jobs yet. Check out open opportunities!
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.job?.title}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-500" /> {app.job?.company}
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

export default StudentDashboard;
