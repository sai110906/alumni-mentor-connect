import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { Send, UserCheck, MessageSquare, Clock, Mail } from 'lucide-react';

const StudentMentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/mentorship/my-requests');
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
        <h1 className="text-2xl font-extrabold text-white">Mentorship Requests</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track status of your sent 1-on-1 mentorship requests to alumni.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your mentorship requests..." />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No Requests Sent"
          description="You haven't sent any mentorship requests yet. Browse the Alumni Directory to get started!"
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
                    req.alumni?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={req.alumni?.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{req.alumni?.name}</h3>
                    <Badge status={req.status} />
                  </div>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                    {req.alumniProfile?.designation} @ {req.alumniProfile?.company || 'Tech Company'}
                  </p>
                  
                  {/* Sent message */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <p className="font-semibold text-slate-400 text-[11px] mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Your Message:
                    </p>
                    <p className="italic">"{req.message}"</p>
                  </div>

                  {/* Alumni Response Notes */}
                  {req.responseNotes && (
                    <div className="mt-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                      <p className="font-semibold text-indigo-300 text-[11px] mb-1">
                        Alumni Response:
                      </p>
                      <p>"{req.responseNotes}"</p>
                    </div>
                  )}

                  {/* Contact Info if Accepted */}
                  {req.status === 'accepted' && (
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <Mail className="w-3.5 h-3.5" /> Direct Contact: {req.alumni?.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 text-xs text-slate-500 flex items-center gap-1 self-start md:self-center">
                <Clock className="w-3.5 h-3.5" />
                {new Date(req.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default StudentMentorshipRequests;
