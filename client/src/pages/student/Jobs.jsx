import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Briefcase, MapPin, DollarSign, Calendar, Building2, Send, X, FileText } from 'lucide-react';

const Jobs = () => {
  const toast = useToast();
  const { userProfile } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Application Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [selectedDomain, selectedType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/jobs', {
        params: {
          search,
          domain: selectedDomain,
          type: selectedType,
        },
      });
      setJobs(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setResumeUrl(userProfile?.resumeUrl || 'https://example.com/student-resume.pdf');
    setCoverLetter(`Dear Hiring Team at ${job.company},\n\nI am writing to express my strong interest in the ${job.title} position...`);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await API.post('/applications/apply', {
        jobId: selectedJob._id,
        resumeUrl,
        coverLetter,
      });
      toast.success(`Application for "${selectedJob.title}" submitted successfully!`);
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const domains = ['All', 'Software Engineering', 'Data Science', 'Product Management', 'Cybersecurity', 'Cloud & DevOps'];
  const types = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote'];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Jobs & Internship Referrals</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore career openings posted directly by working college alumni.
        </p>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title, company name, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          {/* Domain Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Domain:
            </span>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedDomain === dom
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Job Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Type:
            </span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedType === t
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Listing Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching job opportunities..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Openings Found"
          description="There are currently no job postings matching your selected filters."
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold">
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                  </span>
                  {job.postedBy && (
                    <span className="text-slate-500">
                      Posted by Alumnus <span className="text-slate-300 font-medium">{job.postedBy.name}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-medium text-slate-400"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="shrink-0">
                <button
                  onClick={() => handleOpenApplyModal(job)}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Apply Now <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Apply for Position</h3>
            <p className="text-xs text-indigo-400 font-semibold mb-6">
              {selectedJob.title} @ {selectedJob.company}
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resume URL Link *</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cover Letter / Note to Alumni Referral</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a brief cover letter describing your fit for this role..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'} <FileText className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Jobs;
