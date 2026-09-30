import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../services/api';
import { Users, UserCheck, Briefcase, FileCheck, Send, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading system analytics..." />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 shadow-2xl relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" /> College Administrator Overview
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Operations Dashboard</h1>
          <p className="text-rose-200 text-sm mt-2 leading-relaxed">
            Monitor real-time platform user counts, active mentorship pipelines, posted opportunities, and moderate platform content.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{stats?.totalStudents}</p>
            <Link to="/admin/students" className="text-xs text-indigo-400 hover:underline mt-2 inline-block font-semibold">
              Manage Student Directory →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Registered Alumni</span>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{stats?.totalAlumni}</p>
            <Link to="/admin/alumni" className="text-xs text-indigo-400 hover:underline mt-2 inline-block font-semibold">
              Manage Alumni Directory →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Job Postings</span>
            <p className="text-3xl font-extrabold text-purple-400 mt-2">{stats?.totalJobs}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {stats?.activeJobs} Active Openings
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Submitted Applications</span>
            <p className="text-3xl font-extrabold text-sky-400 mt-2">{stats?.totalApplications}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Mentorship Requests</span>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{stats?.totalMentorshipRequests}</p>
            <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
              {stats?.acceptedMentorships} Accepted Connections
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Content Moderation</span>
            <p className="text-sm font-bold text-white mt-2">Active Supervision</p>
            <Link to="/admin/jobs" className="text-xs text-rose-400 hover:underline mt-2 inline-block font-semibold">
              Audit Jobs & Posts →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-400" /> Recent User Registrations
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats?.recentUsers?.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-rose-500/10 text-rose-400'
                        : u.role === 'alumni'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
