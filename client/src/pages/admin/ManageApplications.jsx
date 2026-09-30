import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { FileCheck, Building2, User, ExternalLink } from 'lucide-react';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/admin/applications');
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">System Job Applications Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Global log of student job and internship applications submitted across all posted opportunities.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading global application logs..." />
      ) : applications.length === 0 ? (
        <EmptyState icon={FileCheck} title="No Applications Logged" description="No applications have been submitted yet." />
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Applicant Student</th>
                <th className="py-3.5 px-4">Target Job & Company</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <p>{app.student?.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{app.student?.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-indigo-300">{app.job?.title}</p>
                    <p className="text-[11px] text-slate-400">{app.job?.company}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={app.status} />
                  </td>
                  <td className="py-3.5 px-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default ManageApplications;
