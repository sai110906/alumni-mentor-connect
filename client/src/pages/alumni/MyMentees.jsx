import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import API from '../../services/api';
import { UserCheck, Mail, ExternalLink, GraduationCap, Calendar } from 'lucide-react';

const MyMentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    try {
      const { data } = await API.get('/mentorship/my-mentees');
      setMentees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">My Active Mentees</h1>
        <p className="text-xs text-slate-400 mt-1">
          Students you are currently guiding through 1-on-1 mentorship.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your mentees list..." />
      ) : mentees.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Active Mentees"
          description="You currently don't have any accepted mentees. Review pending requests to accept new students."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentees.map((item) => (
            <div
              key={item.request._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      item.student?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={item.student?.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{item.student?.name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> {item.profile?.degree || 'Student'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 mb-4">
                  <p className="text-slate-400">
                    <strong className="text-white">Department:</strong> {item.profile?.department}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-white">Graduation:</strong> Class of {item.profile?.graduationYear}
                  </p>
                  {item.profile?.bio && (
                    <p className="text-slate-400 italic line-clamp-2 mt-1">"{item.profile?.bio}"</p>
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.profile?.skills?.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${item.student?.email}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Student
                </a>

                {item.profile?.resumeUrl && (
                  <a
                    href={item.profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Resume <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyMentees;
