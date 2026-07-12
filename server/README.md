# TransitOps - Smart Transport Operations Platform Backend

This is the production-ready backend API for **TransitOps**, built with Node.js, Express, TypeScript, and Prisma ORM.

## Features

- **OTP Authentication**: Secure 6-digit OTP verification via mobile number with rate limiting (5 per hour) and verification locks.
- **Role-Based Access Control**: Fleet Manager, Dispatcher, Safety Officer, and Financial Analyst roles.
- **Enterprise CRUD**: Vehicles, Drivers, Trips (with wizard dispatch steps), Maintenance, Fuel Logs, and Expense sheets.
- **Operational Rules**: Explores safety checks such as preventing dispatch of retired/in-shop vehicles or suspended/expired-license drivers.
- **Cron Scheduler**: Background alerts for expiring driver licenses and vehicle insurances.
- **Swagger Documentation**: Live OpenAPI Swagger specs at `/api-docs`.

---

## Technical Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, CORS, Express Rate Limit, BCrypt, JWT Access/Refresh tokens
- **SMS Gateway**: Pluggable adapter (fast2sms, twilio, msg91, console fallback)
- **Emailer**: Nodemailer integration with templates
- **Scheduler**: node-cron

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm / yarn

### Installation & Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables inside `.env` (derived from `.env.example`).
   ```bash
   cp .env.example .env
   ```

4. Push the schema to the database and generate Prisma Client:
   ```bash
   npx prisma db push
   ```

5. Seed the database with realistic demo data:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server starts on `http://localhost:5000/`. API documentation is available at `http://localhost:5000/api-docs`.

---

## Docker Quickstart

To spin up the entire stack (PostgreSQL + Express app) using Docker:

```bash
docker-compose up --build
```
