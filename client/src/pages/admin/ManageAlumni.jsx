import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { UserCheck, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';

const ManageAlumni = () => {
  const toast = useToast();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const { data } = await API.get('/admin/users', {
        params: { role: 'alumni' },
      });
      setAlumni(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load alumni list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const { data } = await API.put(`/admin/users/${user._id}/toggle-status`);
      toast.success(data.message);
      setAlumni((prev) =>
        prev.map((a) => (a._id === user._id ? { ...a, isActive: !a.isActive } : a))
      );
    } catch (e) {
      toast.error('Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alumni account? All their posted jobs & mentorship records will be removed.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('Alumni account deleted');
      setAlumni((prev) => prev.filter((a) => a._id !== id));
    } catch (e) {
      toast.error('Failed to delete alumni');
    }
  };

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.profile?.company?.toLowerCase().includes(search.toLowerCase()) ||
      a.profile?.designation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Manage Registered Alumni</h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervise alumni network, verify company designations, and manage account access.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter alumni by name, email, company, or designation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching alumni directory..." />
      ) : filteredAlumni.length === 0 ? (
        <EmptyState title="No Alumni Found" description="No alumni records match your search query." />
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Alumnus Name</th>
                <th className="py-3.5 px-4">Company & Designation</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Grad Year</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAlumni.map((a) => (
                <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={a.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={a.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <p className="font-bold">{a.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{a.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-indigo-300">{a.profile?.designation || 'Engineer'}</p>
                    <p className="text-[11px] text-slate-400">{a.profile?.company || 'Industry Partner'}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">{a.profile?.domain || 'Engineering'}</td>
                  <td className="py-3.5 px-4">{a.profile?.graduationYear || '2020'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      a.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {a.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(a)}
                      title="Toggle Active Status"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {a.isActive ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(a._id)}
                      title="Delete User"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default ManageAlumni;
