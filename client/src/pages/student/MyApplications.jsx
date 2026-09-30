import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';
import API from '../../services/api';
import { FileCheck, Building2, MapPin, ExternalLink, Clock } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/my-applications');
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
        <h1 className="text-2xl font-extrabold text-white">My Job Applications</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track real-time candidate review status for positions you've applied for.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your submitted applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No Applications Submitted"
          description="You haven't applied for any jobs or internships yet."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white">{app.job?.title}</h3>
                  <Badge status={app.status} />
                </div>

                <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {app.job?.company}
                </p>

                {app.coverLetter && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 max-w-2xl">
                    "{app.coverLetter}"
                  </p>
                )}

                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white underline font-medium mt-1"
                  >
                    View Submitted Resume <ExternalLink className="w-3 h-3 text-indigo-400" />
                  </a>
                )}
              </div>

              <div className="text-right shrink-0 text-xs text-slate-500 flex items-center gap-1 self-start md:self-center">
                <Clock className="w-3.5 h-3.5" />
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyApplications;
