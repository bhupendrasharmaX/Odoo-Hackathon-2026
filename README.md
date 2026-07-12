# TransitOps - Enterprise Fleet & Transport Management System

A production-ready Enterprise Transport Management System featuring a React frontend, Node.js backend, and multiple database configurations.

## 📁 Repository Structure

- `/src`: Frontend Application (React, Vite, Tailwind CSS v4, TypeScript)
- `/server`: Backend Application (Express, TypeScript, Prisma ORM, PostgreSQL)
- `/queries.sql`, `/schema.sql`, `/seed.sql`: SQLite database schemas and seeds (managed by the DB team)

---

## 🚀 Setup and Installation

### 1. Database Setup (SQLite Option)
For testing queries locally using the SQLite schema:
```bash
sqlite3 transitops.db
```
Inside the sqlite terminal, execute:
```sql
.read schema.sql
.read seed.sql
```

### 2. Full Application Setup (PostgreSQL + Prisma Option)
Follow the setup instructions in `/server/README.md` to run the active PostgreSQL + Express Backend and the React Frontend simultaneously.
