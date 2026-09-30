import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Send,
  FileCheck,
  PlusCircle,
  ShieldAlert,
  Bell,
  CheckCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Find Alumni', path: '/student/find-alumni', icon: Users },
    { name: 'Mentorship Requests', path: '/student/mentorship-requests', icon: Send },
    { name: 'Jobs & Internships', path: '/student/jobs', icon: Briefcase },
    { name: 'My Applications', path: '/student/applications', icon: FileCheck },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  const alumniLinks = [
    { name: 'Dashboard', path: '/alumni/dashboard', icon: LayoutDashboard },
    { name: 'Mentorship Requests', path: '/alumni/mentorship-requests', icon: Send },
    { name: 'My Mentees', path: '/alumni/my-mentees', icon: UserCheck },
    { name: 'Post Opportunity', path: '/alumni/post-job', icon: PlusCircle },
    { name: 'My Job Postings', path: '/alumni/my-jobs', icon: Briefcase },
    { name: 'Applicants List', path: '/alumni/applicants', icon: FileText },
    { name: 'My Profile', path: '/alumni/profile', icon: User },
    { name: 'Notifications', path: '/alumni/notifications', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Overview Stats', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Manage Alumni', path: '/admin/alumni', icon: UserCheck },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Manage Applications', path: '/admin/applications', icon: FileCheck },
    { name: 'Manage Mentorship', path: '/admin/mentorship', icon: ShieldAlert },
  ];

  const links =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'alumni'
      ? alumniLinks
      : studentLinks;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          {user.role} Navigation
        </p>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20">
          <p className="text-xs font-semibold text-indigo-200">College Project Portal</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Final Year Capstone Project</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
