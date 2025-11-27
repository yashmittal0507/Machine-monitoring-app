# Machine Monitoring Dashboard

A real-time machine monitoring application built with **Next.js** (Frontend) and **NestJS** (Backend), featuring live updates via WebSockets and MongoDB persistence.

## Features

- **Real-time Monitoring**: Live temperature updates broadcasted via WebSockets every 5 seconds.
- **Dashboard**: View status, temperature, and energy consumption of all machines.
- **Machine Details**: Detailed view with historical temperature chart (mock data) and edit functionality.
- **JWT Authentication**: Secure login with JWT tokens. Protected endpoints return 401 on token expiration.
- **Auto-Logout on Token Expiry**: Frontend automatically logs out when JWT expires (configurable, currently 10s for demo).
- **Idle Timeout**: Automatic logout after 10 minutes of inactivity for security.
- **Persistence**: Machine data stored in MongoDB with automatic seeding.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Recharts, Socket.io-client
- **Backend**: NestJS, Mongoose (MongoDB), Socket.io, Passport JWT

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (running locally on default port `27017`)
- **pnpm** (recommended package manager)

## Setup Instructions

### 1. Database Setup

Ensure MongoDB is installed and running locally.

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
pnpm install
```

Start the backend server:
```bash
npm run start:dev
```
The backend will run on `http://localhost:3002`.
*Note: The server will automatically seed initial machine data if the database is empty.*

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
pnpm install
```

Start the frontend development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000` in your browser.
2. Login with the demo credentials:
   - **Email**: `admin@example.com`
   - **Password**: `password123`
3. You will be redirected to the Dashboard.
4. Observe real-time temperature updates (simulated by backend every 5 seconds).
5. Click on a machine to view details or edit its status.

### Authentication Behavior
- JWT tokens expire after 1 hour (configurable in `backend/src/auth/auth.module.ts`)
- When a token expires, the backend returns 401 Unauthorized
- The frontend automatically detects this, clears the session, and redirects to login
- Idle timeout triggers logout after 10 minutes of no user activity

## Troubleshooting

- **Database Connection Error**: Ensure MongoDB is running (`brew services list`).
- **Port Conflicts**: Ensure ports `3000` (frontend) and `3002` (backend) are free.
