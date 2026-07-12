<div align="center">

<!-- Animated Header -->
<img src="public/logo.png" alt="TransportAI Logo" width="250" />

<br/>

<!-- Badges Row 1 -->
<img src="https://img.shields.io/badge/Status-Live%20%F0%9F%9F%A2-brightgreen?style=for-the-badge" />
<img src="https://img.shields.io/badge/Hackathon-Odoo%202026-purple?style=for-the-badge&logo=odoo" />
<img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />

<br/><br/>

<!-- Tech Stack Badges -->
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

<br/>

<img src="https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-6.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" />

<br/>

<img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/API%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />

<br/><br/>

---

## 🌐 Live Links

<a href="https://odoo-hackathon-2026-eight.vercel.app">
  <img src="https://img.shields.io/badge/🚀%20Live%20App-odoo--hackathon--2026.vercel.app-6366F1?style=for-the-badge" />
</a>

<a href="https://odoo-hackathon-2026-yikf.onrender.com/api-docs">
  <img src="https://img.shields.io/badge/📖%20API%20Docs-Swagger%20UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
</a>

<a href="https://github.com/bhupendrasharmaX/Odoo-Hackathon-2026">
  <img src="https://img.shields.io/badge/⭐%20Star%20us-GitHub-181717?style=for-the-badge&logo=github" />
</a>

</div>

---

## 📖 What is TransitOps?

> **TransitOps** is a full-stack **Smart Transport Operations Platform** built for the **Odoo Hackathon 2026**. It digitizes and centralizes fleet management — giving transport companies a real-time, data-driven command center for vehicles, drivers, trips, fuel, maintenance, and financials.

### 🎯 Problem We Solve
Transport companies lose lakhs of rupees every month due to:
- 📋 Manual paper-based trip records
- ⛽ Untracked fuel consumption
- 🔧 Reactive (not preventive) vehicle maintenance
- 👨‍✈️ No driver performance monitoring
- 💸 Uncontrolled operational expenses

**TransitOps solves ALL of these in one platform.**

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🚛 Fleet Management
- Add, edit, track **50+ vehicles**
- Real-time vehicle status (Active / In Shop / Retired)
- Insurance expiry alerts
- Complete vehicle history & documents

### 👨‍✈️ Driver Management
- Driver profiles with license tracking
- Safety scores & performance ratings
- License expiry notifications via cron jobs
- Suspend / activate drivers

### 🗺️ Trip Dispatch Wizard
- Multi-step trip creation (vehicle → driver → cargo → route)
- Dispatch, complete, cancel workflows
- Revenue & fuel cost tracking
- ETA management

</td>
<td width="50%">

### ⛽ Fuel Log Tracking
- Log every fuel fill with cost & quantity
- Per-vehicle fuel efficiency analysis
- Monthly fuel spend reports

### 🔧 Maintenance Management
- Preventive maintenance scheduling
- Repair history per vehicle
- Cost tracking

### 💸 Expense Management
- Categorized expense sheets
- Approve/reject expense workflows
- Financial summaries

### 📊 Analytics Dashboard
- Live KPIs — revenue, trips, fleet utilization
- Interactive charts (Recharts)
- Role-based data views

</td>
</tr>
</table>

---

## 🔐 Role-Based Access Control

| Role | Access |
|---|---|
| 🟣 **Fleet Manager** | Full access — vehicles, reports, maintenance |
| 🔵 **Dispatcher** | Create & manage trips, view vehicles/drivers |
| 🟢 **Safety Officer** | Driver management, safety monitoring |
| 🟡 **Financial Analyst** | Fuel, expenses, financial reports |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Vercel)                   │
│    React 19 + TypeScript + Vite + TailwindCSS 4     │
│         Framer Motion + Recharts + React Hook Form  │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS API calls
┌────────────────────▼────────────────────────────────┐
│                  BACKEND (Render)                    │
│         Node.js + Express.js + TypeScript            │
│    JWT Auth + Helmet + CORS + Rate Limiting          │
│         Prisma ORM + Swagger API Docs                │
└────────────────────┬────────────────────────────────┘
                     │ Prisma queries
┌────────────────────▼────────────────────────────────┐
│               DATABASE (Render PostgreSQL)           │
│    50 Vehicles | 100 Drivers | 300 Trips             │
│    150 Fuel Logs | 80 Maintenance | 300 Expenses     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- PostgreSQL 16+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/bhupendrasharmaX/Odoo-Hackathon-2026.git
cd Odoo-Hackathon-2026
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Configure Backend Environment
```bash
cp server/.env.example server/.env
# Edit server/.env and set your DATABASE_URL
```

### 5. Setup Database
```bash
cd server
npx prisma db push      # Create all tables
npm run db:seed         # Load demo data
```

### 6. Start Both Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# ✅ Running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
# ✅ Running on http://localhost:5173
```

---

## 🔑 Demo Credentials

| Email | Password | Role |
|---|---|---|
| `admin@transitops.com` | `password123` | 🟣 Fleet Manager |
| `amit.patel@transitops.com` | `password123` | 🔵 Dispatcher |
| `priya.nair@transitops.com` | `password123` | 🟢 Safety Officer |
| `anjali.gupta@transitops.com` | `password123` | 🟡 Financial Analyst |

**Phone OTP Login:**
- Mobile: `9876543210` → OTP: `123456`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/auth/login` | Email/password login |
| `POST` | `/api/auth/send-otp` | Send OTP to mobile |
| `POST` | `/api/auth/verify-otp` | Verify OTP & get token |
| `GET` | `/api/vehicles` | List all vehicles |
| `POST` | `/api/vehicles` | Create new vehicle |
| `GET` | `/api/drivers` | List all drivers |
| `POST` | `/api/trips` | Create new trip |
| `PUT` | `/api/trips/:id/dispatch` | Dispatch a trip |
| `GET` | `/api/reports/dashboard` | Dashboard statistics |
| `GET` | `/api/fuel` | Fuel logs |
| `GET` | `/api/expenses` | Expense records |

📖 **Full API docs:** https://odoo-hackathon-2026-yikf.onrender.com/api-docs

---

## 🗄️ Database Schema

```
users ──────┐
roles ───────┤
             ▼
vehicles ──► trips ◄── drivers
    │                      │
    ▼                      ▼
maintenance_logs      otp_verifications
fuel_logs
    │
    ▼
expenses
audit_logs
notifications
vehicle_documents
```

---

## 📁 Project Structure

```
Odoo-Hackathon-2026/
├── 📂 src/                    # React Frontend
│   ├── 📂 components/         # Reusable UI components
│   ├── 📂 pages/              # Page components (17 pages)
│   ├── 📂 lib/                # API client + utilities
│   ├── 📂 data/               # Mock data fallback
│   └── 📂 types/              # TypeScript types
│
├── 📂 server/                 # Express Backend
│   ├── 📂 src/
│   │   ├── 📂 controllers/    # Route controllers
│   │   ├── 📂 services/       # Business logic
│   │   ├── 📂 repositories/   # DB queries (Prisma)
│   │   ├── 📂 middlewares/    # Auth, RBAC, rate limiting
│   │   ├── 📂 routes/         # API route definitions
│   │   ├── 📂 validators/     # Zod validation schemas
│   │   ├── 📂 cron/           # Background scheduler
│   │   └── 📂 sms/            # SMS provider adapters
│   ├── 📂 prisma/             # Schema + seed data
│   └── 📄 swagger.json        # OpenAPI documentation
│
├── 📄 schema.sql              # Raw SQL schema
├── 📄 queries.sql             # Useful SQL queries
└── 📄 seed.sql                # SQL seed data
```

---

## 🛡️ Security Features

- 🔒 **JWT** Access + Refresh token authentication
- 🪖 **Helmet.js** — HTTP security headers
- 🚦 **Rate Limiting** — 100 req/15min, 5 OTPs/hour
- 🔐 **BCrypt** — Password hashing (10 rounds)
- 🌐 **CORS** — Configured origin whitelist
- 📋 **Audit Logs** — Every action is tracked
- ✅ **Zod** — Request validation on all endpoints

---

## ⚡ Background Jobs (Cron)

| Job | Schedule | Purpose |
|---|---|---|
| License Expiry Alert | Daily 9 AM | Notify drivers with expiring licenses |
| Insurance Expiry Alert | Daily 9 AM | Flag vehicles with expiring insurance |

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel (Free) | https://odoo-hackathon-2026-eight.vercel.app |
| Backend | Render (Free) | https://odoo-hackathon-2026-yikf.onrender.com |
| Database | Render PostgreSQL | Oregon, US West |

---

## 👥 Team

<div align="center">

Built with ❤️ for **Odoo Hackathon 2026**

| Member | GitHub |
|---|---|
| Bhupendra Sharma | [@bhupendrasharmaX](https://github.com/bhupendrasharmaX) |

</div>

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Made+for+Odoo+Hackathon+2026+🏆;Full+Stack+%7C+Production+Ready+✅;React+%2B+Node.js+%2B+PostgreSQL+🚀" />

<br/>

⭐ **Star this repo if you found it useful!** ⭐

<img src="https://img.shields.io/github/stars/bhupendrasharmaX/Odoo-Hackathon-2026?style=social" />
<img src="https://img.shields.io/github/forks/bhupendrasharmaX/Odoo-Hackathon-2026?style=social" />

</div>
