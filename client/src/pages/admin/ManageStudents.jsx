import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';

const ManageStudents = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/admin/users', {
        params: { role: 'student' },
      });
      setStudents(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load students list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const { data } = await API.put(`/admin/users/${user._id}/toggle-status`);
      toast.success(data.message);
      setStudents((prev) =>
        prev.map((s) => (s._id === user._id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (e) {
      toast.error('Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student account? All their requests & applications will be deleted.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('Student account deleted');
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.profile?.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Manage Enrolled Students</h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervise student directory, activate/deactivate access, and remove inactive accounts.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter students by name, email, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching students directory..." />
      ) : filteredStudents.length === 0 ? (
        <EmptyState title="No Students Found" description="No student records match your search criteria." />
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Grad Year</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={s.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{s.email}</td>
                  <td className="py-3.5 px-4">{s.profile?.department || 'N/A'}</td>
                  <td className="py-3.5 px-4">{s.profile?.graduationYear || '2026'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      s.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {s.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(s)}
                      title="Toggle Active Status"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {s.isActive ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(s._id)}
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

export default ManageStudents;
