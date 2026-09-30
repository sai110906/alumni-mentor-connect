import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCircle2, CheckSquare } from 'lucide-react';

const NotificationsPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (e) {
      toast.error('Failed to update notifications');
    }
  };

  const handleClickNotification = async (notif) => {
    try {
      if (!notif.isRead) {
        await API.put(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      }
      if (notif.link) navigate(notif.link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System Notifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time updates regarding your mentorship requests, applications, and job listings.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <CheckSquare className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No Notifications" description="You have no notifications in your inbox." />
      ) : (
        <div className="space-y-3 max-w-3xl">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClickNotification(n)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? 'bg-indigo-950/30 border-indigo-500/40 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                {!n.isRead ? (
                  <span className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-slate-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(n.createdAt).toLocaleDateString()} at{' '}
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default NotificationsPage;
