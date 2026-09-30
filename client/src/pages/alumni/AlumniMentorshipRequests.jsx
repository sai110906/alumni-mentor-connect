import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Send, CheckCircle2, XCircle, MessageSquare, Clock, X } from 'lucide-react';

const AlumniMentorshipRequests = () => {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Response Modal state
  const [activeRequest, setActiveRequest] = useState(null);
  const [targetStatus, setTargetStatus] = useState('accepted');
  const [responseNotes, setResponseNotes] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/mentorship/incoming');
      setRequests(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load mentorship requests');
    } finally {
      setLoading(false);
    }
  };

  const openRespondModal = (req, status) => {
    setActiveRequest(req);
    setTargetStatus(status);
    setResponseNotes(
      status === 'accepted'
        ? "I am happy to mentor you! Let's schedule our first 1-on-1 check-in."
        : 'Thank you for reaching out. Unfortunately my mentorship roster is currently full.'
    );
  };

  const handleRespondSubmit = async (e) => {
    e.preventDefault();
    setResponding(true);
    try {
      await API.put(`/mentorship/respond/${activeRequest._id}`, {
        status: targetStatus,
        responseNotes,
      });

      toast.success(`Request successfully ${targetStatus}!`);
      setActiveRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request.');
    } finally {
      setResponding(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Incoming Mentorship Requests</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review 1-on-1 mentorship applications submitted by students.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading mentorship applications..." />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No Incoming Requests"
          description="You currently have no mentorship requests from students."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    req.student?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={req.student?.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{req.student?.name}</h3>
                    <Badge status={req.status} />
                  </div>

                  <p className="text-xs text-indigo-400 font-semibold">
                    {req.studentProfile?.department} • Graduating {req.studentProfile?.graduationYear}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {req.studentProfile?.skills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Student Message */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-2xl">
                    <p className="font-semibold text-slate-400 text-[11px] mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Student Goals & Message:
                    </p>
                    <p className="italic">"{req.message}"</p>
                  </div>

                  {req.responseNotes && (
                    <p className="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30">
                      Your Note: "{req.responseNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-2 self-start md:self-center">
                {req.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => openRespondModal(req, 'accepted')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Mentee
                    </button>
                    <button
                      onClick={() => openRespondModal(req, 'rejected')}
                      className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    Responded on {new Date(req.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveRequest(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              {targetStatus === 'accepted' ? 'Accept Mentorship Request' : 'Decline Mentorship Request'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Responding to student <span className="text-indigo-400 font-semibold">{activeRequest.student?.name}</span>
            </p>

            <form onSubmit={handleRespondSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message / Response Note to Student
                </label>
                <textarea
                  rows={4}
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Include instructions or meeting link..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRequest(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={responding}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 text-white ${
                    targetStatus === 'accepted'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                  }`}
                >
                  {responding ? 'Submitting...' : `Confirm ${targetStatus === 'accepted' ? 'Acceptance' : 'Decline'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AlumniMentorshipRequests;
