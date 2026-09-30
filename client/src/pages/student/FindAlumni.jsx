import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, Briefcase, MapPin, Send, CheckCircle2, X, ExternalLink, Award } from 'lucide-react';

const FindAlumni = () => {
  const toast = useToast();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  // Request Modal State
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, [selectedDomain]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/profiles/alumni', {
        params: {
          search,
          domain: selectedDomain,
        },
      });
      setAlumni(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!message) {
      toast.error('Please enter a message explaining your mentorship goals');
      return;
    }

    setRequesting(true);
    try {
      await API.post('/mentorship/request', {
        alumniId: selectedAlumni.user._id,
        message,
      });
      toast.success(`Mentorship request sent to ${selectedAlumni.user.name}!`);
      setSelectedAlumni(null);
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setRequesting(false);
    }
  };

  const domains = [
    'All',
    'Software Engineering',
    'Data Science',
    'Product Management',
    'Cybersecurity',
    'Cloud & DevOps',
    'UI/UX Design',
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Find Alumni Mentors</h1>
        <p className="text-xs text-slate-400 mt-1">
          Search experienced alumni, filter by domain expertise, and initiate 1-on-1 mentorship.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by alumni name, company, designation, or skill..."
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

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Domain:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <LoadingSpinner message="Searching alumni network..." />
      ) : alumni.length === 0 ? (
        <EmptyState
          title="No Alumni Found"
          description="Try broadening your search term or select a different domain filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((prof) => (
            <div
              key={prof._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={
                      prof.user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={prof.user?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {prof.user?.name}
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">{prof.designation}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3 text-slate-500" /> {prof.company || 'Tech Leader'}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {prof.bio || 'Experienced professional offering career mentorship to students.'}
                </p>

                {/* Info tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                    Graduated: {prof.graduationYear}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                    Exp: {prof.experienceYears} yrs
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                    {prof.domain}
                  </span>
                </div>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {prof.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {prof.skills.length > 4 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{prof.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedAlumni(prof)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Request Mentorship
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mentorship Request Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={
                  selectedAlumni.user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt={selectedAlumni.user?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h3 className="text-base font-bold text-white">Mentorship Request</h3>
                <p className="text-xs text-slate-400">
                  Sending request to <span className="text-indigo-400 font-semibold">{selectedAlumni.user?.name}</span> ({selectedAlumni.designation} at {selectedAlumni.company})
                </p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mentorship Goals & Introductory Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain why you are seeking mentorship, your career goals, and what areas you would like guidance on (e.g. resume review, technical interview prep)..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlumni(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {requesting ? 'Sending...' : 'Send Request'} <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FindAlumni;
