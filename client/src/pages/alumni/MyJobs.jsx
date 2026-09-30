import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Trash2, ToggleLeft, ToggleRight, Users, PlusCircle } from 'lucide-react';

const MyJobs = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const { data } = await API.get('/jobs/my-jobs');
      setJobs(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load your job postings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const { data } = await API.put(`/jobs/${job._id}`, {
        isActive: !job.isActive,
      });
      toast.success(`Job status updated to ${data.isActive ? 'Active' : 'Inactive'}`);
      setJobs((prev) => prev.map((j) => (j._id === job._id ? data : j)));
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job posting deleted');
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (e) {
      toast.error('Failed to delete job posting');
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Job Postings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your active hiring referrals and internship opportunities.
          </p>
        </div>

        <Link
          to="/alumni/post-job"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your job posts..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Job Postings Yet"
          description="You haven't posted any jobs or internship opportunities yet."
          action={
            <Link
              to="/alumni/post-job"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Post First Opportunity
            </Link>
          }
        />
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

                <p className="text-xs text-slate-400">
                  {job.company} • {job.location} • Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  to={`/alumni/applicants?jobId=${job._id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" /> View Applicants
                </Link>

                <button
                  onClick={() => handleToggleStatus(job)}
                  title="Toggle Active Status"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  {job.isActive ? (
                    <ToggleRight className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-500" />
                  )}
                </button>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  title="Delete Job"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
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

export default MyJobs;
