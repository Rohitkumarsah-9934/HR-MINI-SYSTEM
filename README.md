# 🏢 HRMS — Employee Leave & Attendance Management System

A full-stack HR management system built with React + Node.js + MongoDB.

---

## 📌 Project Overview

A mini HR portal that lets employees apply for leave, mark attendance, and track history — while admins can approve/reject leaves and monitor all employee data.

---

## 🛠 Tech Stack

| Layer      | Technology                  | Why                                      |
|------------|-----------------------------|------------------------------------------|
| Frontend   | React 18 + Vite             | Fast, modern SPA with HMR                |
| Styling    | Tailwind CSS                | Utility-first, responsive by default     |
| Routing    | React Router v6             | Declarative, nested routes               |
| HTTP       | Axios                       | Clean API calls with interceptors        |
| Backend    | Node.js + Express           | Lightweight, flexible REST API           |
| Database   | MongoDB + Mongoose          | Schema flexibility, easy relations       |
| Auth       | JWT + bcryptjs              | Stateless, secure token-based auth       |

---

## 📁 Project Structure

```
hrms-project/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── leaveController.js
│   │   ├── attendanceController.js
│   │   └── userController.js
│   ├── middleware/auth.js       # JWT protect + adminOnly
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Leave.js
│   │   └── Attendance.js
│   ├── routes/                 # Express routers
│   │   ├── authRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── userRoutes.js
│   ├── seed.js                 # Admin seeder script
│   ├── server.js               # Entry point
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── App.jsx             # Routes
    │   ├── main.jsx            # Entry point
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Badge.jsx
    │   │   └── Spinner.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── EmployeeDashboard.jsx
    │   │   ├── ApplyLeave.jsx
    │   │   ├── MyLeaves.jsx
    │   │   ├── Attendance.jsx
    │   │   ├── Profile.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ManageLeaves.jsx
    │   │   ├── AllAttendance.jsx
    │   │   └── Employees.jsx
    │   └── services/api.js     # All API calls (Axios)
    └── .env
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/hrms-project.git
cd hrms-project
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Seed Admin
```bash
node seed.js
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs on: `http://localhost:3000`  
Backend runs on: `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend `.env`
| Variable        | Description                  | Example                          |
|-----------------|------------------------------|----------------------------------|
| `PORT`          | Server port                  | `5000`                           |
| `MONGO_URI`     | MongoDB connection string    | `mongodb://localhost:27017/hrms` |
| `JWT_SECRET`    | Secret key for JWT signing   | `your_secret_key`                |
| `JWT_EXPIRES_IN`| Token expiry duration        | `7d`                             |

### Frontend `.env`
| Variable       | Description            | Example                        |
|----------------|------------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL   | `http://localhost:5000/api`    |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Description          | Access |
|--------|---------------------|----------------------|--------|
| POST   | /api/auth/register  | Register user        | Public |
| POST   | /api/auth/login     | Login user           | Public |
| GET    | /api/auth/me        | Get current user     | Private |

### Leaves
| Method | Endpoint                  | Description              | Access   |
|--------|---------------------------|--------------------------|----------|
| POST   | /api/leaves               | Apply for leave          | Employee |
| GET    | /api/leaves/my            | Get my leaves            | Employee |
| PUT    | /api/leaves/:id/cancel    | Cancel pending leave     | Employee |
| GET    | /api/leaves/all           | Get all leaves           | Admin    |
| PUT    | /api/leaves/:id/decide    | Approve or reject leave  | Admin    |

### Attendance
| Method | Endpoint               | Description               | Access   |
|--------|------------------------|---------------------------|----------|
| POST   | /api/attendance/mark   | Mark today's attendance   | Employee |
| GET    | /api/attendance/my     | Get my attendance         | Employee |
| GET    | /api/attendance/all    | Get all attendance        | Admin    |

### Users
| Method | Endpoint              | Description          | Access |
|--------|-----------------------|----------------------|--------|
| GET    | /api/users/profile    | Get own profile      | Private |
| GET    | /api/users/employees  | Get all employees    | Admin  |

---

## 🗄 Database Models

### User
```
name, email, password (hashed), role (employee|admin),
joinDate, leaveBalance (default: 20)
```

### Leave
```
userId (ref: User), type (Casual|Sick|Paid),
startDate, endDate, totalDays, status (Pending|Approved|Rejected),
appliedDate, reason
```

### Attendance
```
userId (ref: User), date, status (Present|Absent)
Unique index: (userId, date) — one record per day
```

---

## 👑 Admin Credentials

After running `node seed.js`:

| Field    | Value            |
|----------|------------------|
| Email    | admin@hrms.com   |
| Password | admin123         |

---

## 🤖 AI Tools Declaration

| Tool       | Contribution                                                         |
|------------|----------------------------------------------------------------------|
| Claude AI  | Generated boilerplate structure, Tailwind component styling,         |
|            | route wiring, API service layer, and README documentation.           |
|            | All business logic (leave balance deduction, attendance rules,       |
|            | JWT auth flow, role-based access) was reviewed and validated manually.|

---

## ⚠️ Known Limitations

- No email notifications (mock or real)
- No pagination on large datasets
- No unit tests
- No Docker setup
- JWT stored in localStorage (use httpOnly cookies for production)

---

## ⏱ Time Spent

| Task                          | Time     |
|-------------------------------|----------|
| Backend API + Models          | ~3 hours |
| Frontend pages + components   | ~4 hours |
| Auth, routing, context        | ~1 hour  |
| Styling + polish              | ~1 hour  |
| README + documentation        | ~30 min  |
| **Total**                     | **~9.5 hours** |
