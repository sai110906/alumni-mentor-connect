import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FileText, ExternalLink, GraduationCap, Building2 } from 'lucide-react';

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const targetJobId = searchParams.get('jobId') || '';

  const toast = useToast();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [targetJobId]);

  const fetchApplicants = async () => {
    try {
      const { data } = await API.get('/applications/job-applicants', {
        params: { jobId: targetJobId },
      });
      setApplicants(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load applicant list');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
      toast.success(`Candidate status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (e) {
      toast.error('Failed to update candidate status');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Job Applicants List</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review student applications and update candidate interview status.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching job applicants..." />
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Applicants Found"
          description="There are currently no student applications submitted for this position."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    app.student?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={app.student?.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{app.student?.name}</h3>
                    <Badge status={app.status} />
                  </div>

                  <p className="text-xs text-indigo-400 font-semibold">
                    Applied for: <span className="text-white">{app.job?.title}</span> @ {app.job?.company}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {app.studentProfile?.department} • Class of {app.studentProfile?.graduationYear}
                  </p>

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic max-w-2xl">
                      "{app.coverLetter}"
                    </div>
                  )}

                  {/* Resume URL */}
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      View Student Resume <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="shrink-0 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Update Candidate Status:
                </label>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="applied">APPLIED</option>
                  <option value="under_review">UNDER REVIEW</option>
                  <option value="interviewing">INTERVIEWING</option>
                  <option value="accepted">ACCEPTED / HIRED</option>
                  <option value="rejected">REJECTED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Applicants;
