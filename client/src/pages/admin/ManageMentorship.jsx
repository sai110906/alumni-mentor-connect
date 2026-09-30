import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { Send, UserCheck, GraduationCap } from 'lucide-react';

const ManageMentorship = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/mentorship/admin/all');
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Global Mentorship Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervise 1-on-1 mentorship pairings and request pipeline activity across all departments.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching mentorship records..." />
      ) : requests.length === 0 ? (
        <EmptyState icon={Send} title="No Mentorship Activity" description="No mentorship requests have been initiated yet." />
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Target Alumnus</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date Initiated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <p>{req.student?.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{req.student?.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-indigo-300">{req.alumni?.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{req.alumni?.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={req.status} />
                  </td>
                  <td className="py-3.5 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default ManageMentorship;
