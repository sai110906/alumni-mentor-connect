import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Trash2, ToggleLeft, ToggleRight, Building2 } from 'lucide-react';

const ManageJobs = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/admin/jobs');
      setJobs(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const { data } = await API.put(`/jobs/${job._id}`, {
        isActive: !job.isActive,
      });
      toast.success(`Job status changed to ${data.isActive ? 'Active' : 'Inactive'}`);
      setJobs((prev) => prev.map((j) => (j._id === job._id ? data : j)));
    } catch (e) {
      toast.error('Failed to update job status');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job posting deleted');
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (e) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Manage System Job Postings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, moderate, and manage job & internship referrals posted across the portal.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching job directory..." />
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No Job Postings" description="No jobs have been posted on the platform yet." />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white">{job.title}</h3>
                  <Badge status={job.isActive ? 'active' : 'inactive'} />
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold">
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {job.company} • {job.location}
                </p>

                <p className="text-[11px] text-slate-400">
                  Posted by <span className="text-slate-200 font-medium">{job.postedBy?.name || 'Alumnus'}</span> ({job.postedBy?.email})
                </p>

                <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => handleToggleStatus(job)}
                  title="Toggle Active Status"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  {job.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" /> Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-500" /> Inactive
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  title="Delete Job"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ManageJobs;
