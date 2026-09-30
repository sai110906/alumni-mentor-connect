# Integrated Alumni–Student Mentorship & Job Portal

A full-stack MERN (MongoDB, Express.js, React.js + Vite + Tailwind CSS, Node.js) web application designed as a college final-year capstone project. It bridges the gap between current college students, working alumni, and administrators for 1-on-1 mentorship, career referrals, and administrative supervision.

---

## 🚀 Features & Modules Overview

### 1. User Management & Authentication
- JWT Authentication (Bearer Tokens) with `bcryptjs` password encryption.
- Role-based authorization for **Student**, **Alumni**, and **Admin**.
- Pre-seeded presentation-ready demo accounts.

### 2. Student Module
- **Dashboard**: Quick metrics, active mentors, submitted applications overview.
- **Alumni Search & Mentorship**: Search alumni by keyword, domain, or skills; send custom mentorship requests.
- **Jobs Board**: Filter jobs by domain & type (Full-time, Internship, Remote); submit direct applications with resume links & cover letters.
- **Application Tracking**: View application progress (`APPLIED`, `UNDER REVIEW`, `INTERVIEWING`, `ACCEPTED`, `REJECTED`).

### 3. Alumni Module
- **Alumni Workspace**: Overview of pending mentorship requests, active mentees, and posted opportunities.
- **Mentorship Pipeline**: Accept/Decline student mentorship requests with custom notes.
- **Job Posting & Applicant Management**: Post job openings, toggle active hiring status, review candidate resumes, and update applicant review stage.

### 4. Admin Module
- **System Analytics**: Real-time stats on total students, alumni, jobs, applications, and mentorships.
- **User Moderation**: Manage student and alumni accounts (Toggle active status / Delete records).
- **Content Moderation**: Audit and manage global job postings, applications, and mentorship pairs.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (v18), Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM v6
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS, Dotenv
- **Database**: MongoDB & Mongoose ORM

---

## 💻 Installation & Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 1. Clone & Navigate to Project
```bash
cd alumni-mentorship-portal
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```

#### Environment Variables (`server/.env`)
Create a `.env` file in the `/server` directory with:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/alumni_mentorship_db
JWT_SECRET=super_secret_jwt_key_alumni_portal_2026
```

#### Pre-populate Seed Database
Populate demo users, profiles, jobs, applications, and mentorship requests:
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
# or npm start
```
The server will run at `http://localhost:5000`.

---

### 3. Frontend Setup (`/client`)
Open a new terminal window:
```bash
cd client
npm install
```

#### Start Frontend Dev Server
```bash
npm run dev
```
The web application will open at `http://localhost:3000`.

---

## 🔑 Demo User Accounts for Presentation Review

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@college.edu` | `Admin@123` | Full administrative control & system metrics |
| **Alumni** | `sarah.alumni@techcorp.com` | `Alumni@123` | Staff Software Engineer @ TechCorp Solutions |
| **Alumni** | `david.data@analytics.io` | `Alumni@123` | Lead Data Scientist @ Analytics.io |
| **Student** | `alex.student@college.edu` | `Student@123` | 4th Year CS Student seeking Web Dev mentor |
| **Student** | `maria.student@college.edu` | `Student@123` | 4th Year CS Student interested in Data Science |

*(Note: On the login page, click any of the "Quick Demo Pre-fill" buttons for instant 1-click login!)*

---

## 📁 Directory Structure

```
alumni-mentorship-portal/
├── server/
│   ├── config/             # MongoDB connection setup
│   ├── controllers/        # Express route controllers (Auth, Profile, Jobs, Mentorship, Admin)
│   ├── middleware/         # Auth, Role authorization, Error handler
│   ├── models/             # Mongoose schemas (User, Profile, Job, Application, MentorshipRequest, Notification)
│   ├── routes/             # RESTful API route definitions
│   ├── utils/              # Seed data script & JWT generator
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── components/     # Reusable UI elements (Navbar, Sidebar, Layout, Badge, Modal, Toast)
    │   ├── context/        # AuthContext & ToastContext
    │   ├── pages/          # Public, Student, Alumni, and Admin views
    │   ├── services/       # Axios API client
    │   ├── App.jsx         # Client-side router configuration
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```
