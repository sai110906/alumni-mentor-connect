import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import FindAlumni from './pages/student/FindAlumni';
import StudentMentorshipRequests from './pages/student/MentorshipRequests';
import Jobs from './pages/student/Jobs';
import MyApplications from './pages/student/MyApplications';
import MyProfile from './pages/student/MyProfile';

// Alumni Pages
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniMentorshipRequests from './pages/alumni/AlumniMentorshipRequests';
import MyMentees from './pages/alumni/MyMentees';
import PostJob from './pages/alumni/PostJob';
import MyJobs from './pages/alumni/MyJobs';
import Applicants from './pages/alumni/Applicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageAlumni from './pages/admin/ManageAlumni';
import ManageJobs from './pages/admin/ManageJobs';
import ManageApplications from './pages/admin/ManageApplications';
import ManageMentorship from './pages/admin/ManageMentorship';

// Common Pages
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/find-alumni" element={<FindAlumni />} />
        <Route path="/student/mentorship-requests" element={<StudentMentorshipRequests />} />
        <Route path="/student/jobs" element={<Jobs />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/profile" element={<MyProfile />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Alumni Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['alumni']} />}>
        <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
        <Route path="/alumni/mentorship-requests" element={<AlumniMentorshipRequests />} />
        <Route path="/alumni/my-mentees" element={<MyMentees />} />
        <Route path="/alumni/post-job" element={<PostJob />} />
        <Route path="/alumni/my-jobs" element={<MyJobs />} />
        <Route path="/alumni/applicants" element={<Applicants />} />
        <Route path="/alumni/profile" element={<MyProfile />} />
        <Route path="/alumni/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/alumni" element={<ManageAlumni />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
        <Route path="/admin/applications" element={<ManageApplications />} />
        <Route path="/admin/mentorship" element={<ManageMentorship />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
