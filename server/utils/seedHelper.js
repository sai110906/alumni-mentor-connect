const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const MentorshipRequest = require('../models/MentorshipRequest');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    // Clear existing collections
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await MentorshipRequest.deleteMany({});
    await Notification.deleteMany({});

    // 1. Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const alumni1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.alumni@techcorp.com',
      password: 'Alumni@123',
      role: 'alumni',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    });

    const alumni2 = await User.create({
      name: 'David Chen',
      email: 'david.data@analytics.io',
      password: 'Alumni@123',
      role: 'alumni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const alumni3 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.product@innovate.com',
      password: 'Alumni@123',
      role: 'alumni',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    });

    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex.student@college.edu',
      password: 'Student@123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    });

    const student2 = await User.create({
      name: 'Maria Garcia',
      email: 'maria.student@college.edu',
      password: 'Student@123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    });

    // 2. Create Profiles
    await Profile.create([
      {
        user: admin._id,
        department: 'Department of Computer Science & Engineering',
        graduationYear: 2015,
        degree: 'M.Tech',
        company: 'College Administration',
        designation: 'Portal Administrator',
        location: 'Main Campus',
        bio: 'Overseeing alumni-student relations and mentorship workflows.',
        domain: 'Administration',
      },
      {
        user: alumni1._id,
        department: 'Computer Science & Engineering',
        graduationYear: 2020,
        degree: 'B.Tech CS',
        company: 'TechCorp Solutions',
        designation: 'Staff Software Engineer',
        location: 'San Francisco, CA (Remote)',
        bio: 'Full-stack engineering leader passionate about distributed systems, React, and helping college graduates transition into top tier tech roles.',
        skills: ['React', 'Node.js', 'MongoDB', 'System Design', 'TypeScript', 'AWS'],
        domain: 'Software Engineering',
        experienceYears: 5,
        linkedinUrl: 'https://linkedin.com/in/sarahjenkins-demo',
        githubUrl: 'https://github.com/sarahjenkins-demo',
        isAvailableForMentorship: true,
      },
      {
        user: alumni2._id,
        department: 'Data Science & AI',
        graduationYear: 2019,
        degree: 'B.Tech CS',
        company: 'Analytics.io',
        designation: 'Lead Data Scientist',
        location: 'New York, NY',
        bio: 'Specializing in Machine Learning, PyTorch, and Big Data pipelines. Always open to guiding students interested in AI careers.',
        skills: ['Python', 'PyTorch', 'Data Science', 'Machine Learning', 'SQL', 'FastAPI'],
        domain: 'Data Science',
        experienceYears: 6,
        linkedinUrl: 'https://linkedin.com/in/davidchen-demo',
        githubUrl: 'https://github.com/davidchen-demo',
        isAvailableForMentorship: true,
      },
      {
        user: alumni3._id,
        department: 'Information Technology',
        graduationYear: 2021,
        degree: 'B.Tech IT',
        company: 'Innovate Labs',
        designation: 'Senior Product Manager',
        location: 'Austin, TX',
        bio: 'Bridging engineering and user experience. Mentoring students on product strategy, resume building, and tech interviews.',
        skills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping', 'Figma'],
        domain: 'Product Management',
        experienceYears: 4,
        linkedinUrl: 'https://linkedin.com/in/elenarostova-demo',
        isAvailableForMentorship: true,
      },
      {
        user: student1._id,
        department: 'Computer Science & Engineering',
        graduationYear: 2026,
        degree: 'B.Tech CS',
        company: 'College Senior',
        designation: 'Student',
        location: 'Campus Hostel Block B',
        bio: 'Final year CS student interested in full-stack web development and scalable backend APIs.',
        skills: ['JavaScript', 'React', 'Node.js', 'Express', 'Tailwind CSS'],
        domain: 'Software Engineering',
        resumeUrl: 'https://example.com/alex-johnson-resume.pdf',
      },
      {
        user: student2._id,
        department: 'Computer Science & Engineering',
        graduationYear: 2026,
        degree: 'B.Tech CS',
        company: 'College Senior',
        designation: 'Student',
        location: 'Campus Hostel Block A',
        bio: 'Undergraduate student building projects in Python, SQL, and Deep Learning.',
        skills: ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Scikit-Learn'],
        domain: 'Data Science',
        resumeUrl: 'https://example.com/maria-garcia-resume.pdf',
      },
    ]);

    // 3. Create Sample Jobs
    const job1 = await Job.create({
      postedBy: alumni1._id,
      title: 'Graduate Frontend Software Engineer',
      company: 'TechCorp Solutions',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      domain: 'Software Engineering',
      description: 'We are seeking an enthusiastic fresh graduate to join our core web platform team building next-generation web applications with React, TypeScript, and Tailwind CSS.',
      requirements: ['Strong JavaScript/TypeScript fundamentals', 'Hands-on project experience with React.js', 'Understanding of RESTful APIs', 'Good problem-solving skills'],
      salary: '$95,000 - $115,000 / year',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    const job2 = await Job.create({
      postedBy: alumni1._id,
      title: 'Full Stack Web Developer Intern',
      company: 'TechCorp Solutions',
      location: 'Remote',
      type: 'Internship',
      domain: 'Software Engineering',
      description: 'Summer 2026 3-month paid internship working directly with senior engineers on MERN stack features.',
      requirements: ['Node.js & Express.js basics', 'MongoDB or SQL knowledge', 'Eager to learn modern web architecture'],
      salary: '$3,500 / month',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    const job3 = await Job.create({
      postedBy: alumni2._id,
      title: 'Junior Data Analyst & ML Engineer',
      company: 'Analytics.io',
      location: 'New York, NY',
      type: 'Full-time',
      domain: 'Data Science',
      description: 'Analyze real-world data pipelines, build predictive models, and collaborate with product teams on customer analytics.',
      requirements: ['Proficiency in Python and Pandas', 'Solid grasp of SQL queries', 'Familiarity with Scikit-learn or PyTorch'],
      salary: '$90,000 - $105,000 / year',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    // 4. Create Mentorship Requests
    await MentorshipRequest.create({
      student: student1._id,
      alumni: alumni1._id,
      message: 'Hi Sarah, I am a 4th year CS student aspiring to become a Full Stack Engineer. I would love your guidance on resume review and system design preparation.',
      status: 'accepted',
      responseNotes: 'Welcome Alex! I am glad to assist. Let us schedule our first monthly 1-on-1 check-in.',
    });

    await MentorshipRequest.create({
      student: student2._id,
      alumni: alumni2._id,
      message: 'Hello David! I am focusing on machine learning projects this semester and would appreciate advice on transitioning into Data Science roles.',
      status: 'pending',
    });

    // 5. Create Applications
    await Application.create({
      job: job1._id,
      student: student1._id,
      resumeUrl: 'https://example.com/alex-johnson-resume.pdf',
      coverLetter: 'I have built several React and Node.js full-stack applications and am thrilled to apply for the Graduate Engineer role.',
      status: 'under_review',
    });

    await Application.create({
      job: job3._id,
      student: student2._id,
      resumeUrl: 'https://example.com/maria-garcia-resume.pdf',
      coverLetter: 'My background in Python data analysis directly aligns with Analytics.io values.',
      status: 'applied',
    });

    // 6. Create Notifications
    await Notification.create([
      {
        recipient: student1._id,
        sender: alumni1._id,
        title: 'Mentorship Request ACCEPTED',
        message: 'Sarah Jenkins has accepted your mentorship request.',
        type: 'mentorship',
        isRead: false,
        link: '/student/my-mentors',
      },
      {
        recipient: alumni1._id,
        sender: student1._id,
        title: 'New Job Application',
        message: 'Alex Johnson applied for Graduate Frontend Software Engineer.',
        type: 'application',
        isRead: false,
        link: '/alumni/applicants',
      },
    ]);

    console.log('✓ Database pre-populated with presentation demo data!');
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedDatabase;
