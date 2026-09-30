import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Code, Database, Server, ShieldCheck, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">AlumniConnect.edu</span>
          </Link>

          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            Project Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Integrated Alumni–Student Mentorship & Job Portal
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            College Final Year Project Technical Documentation & Presentation Details
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Objective */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-3">Project Objective</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              The primary objective of this project is to create an integrated ecosystem connecting college students, working alumni, and administrators. It resolves traditional communication barriers by providing direct 1-on-1 mentorship request pipelines, skill/domain filtering, job/internship posting tools, application tracking, and administrative moderation.
            </p>
          </div>

          {/* Section 2: Tech Stack */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-6">Technical Architecture</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3 text-indigo-400 font-bold text-sm mb-2">
                  <Code className="w-5 h-5" /> Frontend (Client)
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li>• React.js (Component-driven architecture)</li>
                  <li>• Vite (Fast build tool & dev server)</li>
                  <li>• Tailwind CSS (Utility-first styling system)</li>
                  <li>• React Router DOM v6 (Client-side routing)</li>
                  <li>• Axios (HTTP API client)</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3 text-purple-400 font-bold text-sm mb-2">
                  <Server className="w-5 h-5" /> Backend (Server)
                </div>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li>• Node.js + Express.js Framework</li>
                  <li>• RESTful API Design pattern</li>
                  <li>• JWT Authentication (Bearer Header)</li>
                  <li>• bcryptjs (Password hashing security)</li>
                  <li>• Role-based Access Middleware</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 sm:col-span-2">
                <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm mb-2">
                  <Database className="w-5 h-5" /> Database (MongoDB + Mongoose)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                  <span className="p-2 rounded-lg bg-slate-900 border border-slate-800">1. users</span>
                  <span className="p-2 rounded-lg bg-slate-900 border border-slate-800">2. profiles</span>
                  <span className="p-2 rounded-lg bg-slate-900 border border-slate-800">3. mentorshipRequests</span>
                  <span className="p-2 rounded-lg bg-slate-900 border border-slate-800">4. jobs</span>
                  <span className="p-2 rounded-lg bg-slate-900 border border-slate-800">5. applications</span>
                  <span className="p-2 rounded-lg bg-slate-900 border border-slate-800">6. notifications</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Key Modules Summary */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">Key Functional Requirements Met</h2>
            <div className="space-y-3">
              {[
                'JWT Authentication & Role Protection for Student, Alumni, and Admin roles.',
                'Alumni Directory search & domain/skill filtering.',
                '1-on-1 Mentorship pipeline with status updates (Pending, Accepted, Rejected).',
                'Job & Internship posting, application submission, and status management.',
                'System Administration oversight dashboard for user & content moderation.',
                'Responsive Sidebar navigation, toast notifications, loading & empty states.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
