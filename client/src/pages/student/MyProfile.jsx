import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Save, Linkedin, Github, FileText, GraduationCap } from 'lucide-react';

const MyProfile = () => {
  const { user, userProfile, updateProfileState } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(userProfile?.department || 'Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(userProfile?.graduationYear || 2026);
  const [degree, setDegree] = useState(userProfile?.degree || 'B.Tech');
  const [domain, setDomain] = useState(userProfile?.domain || 'Software Engineering');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [skills, setSkills] = useState(userProfile?.skills?.join(', ') || '');
  const [resumeUrl, setResumeUrl] = useState(userProfile?.resumeUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(userProfile?.githubUrl || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDepartment(userProfile.department || 'Computer Science & Engineering');
      setGraduationYear(userProfile.graduationYear || 2026);
      setDegree(userProfile.degree || 'B.Tech');
      setDomain(userProfile.domain || 'Software Engineering');
      setBio(userProfile.bio || '');
      setSkills(userProfile.skills?.join(', ') || '');
      setResumeUrl(userProfile.resumeUrl || '');
      setLinkedinUrl(userProfile.linkedinUrl || '');
      setGithubUrl(userProfile.githubUrl || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/profiles/me', {
        name,
        department,
        graduationYear: Number(graduationYear),
        degree,
        domain,
        bio,
        skills,
        resumeUrl,
        linkedinUrl,
        githubUrl,
      });

      updateProfileState(data, { name });
      toast.success('Profile details updated successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Student Profile Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Keep your academic and professional details updated for alumni mentors.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-indigo-400 font-semibold">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Student Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech CS"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Graduation Year</label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Interest Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Software Engineering, Data Science"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="JavaScript, React, Python, MongoDB"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Profile Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your academic interests and career goals..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Default Resume URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/resume.pdf"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-sky-400" /> LinkedIn Profile Link
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Saving changes...' : 'Save Profile Changes'} <Save className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default MyProfile;
