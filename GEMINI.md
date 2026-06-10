# Lexora Project - Getting Started

This project is a full-stack application for undertrial prisoners' aid.

## Prerequisites
- Node.js (v18+)
- MySQL (running on port 3306)
- MongoDB (running on port 27017)
- **OR** Docker & Docker Compose

## Quick Start (Local)

### 1. Database Setup
Ensure MySQL and MongoDB are running.
- MySQL: Create a database named `lexora`. Default user `root`, password `root`.
- MongoDB: Running on `localhost:27017`.

### 2. Backend
```bash
cd backend
npm install
npm start
```
*Note: The backend is configured to stay running even if databases are down (for demo purposes), but features like logins and case tracking will require DB connectivity.*

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Using Docker (Recommended)
If you have Docker installed, you can start everything with one command:
```bash
docker-compose up --build
```

## Features for Demo
- **Landing Page:** Explore features and access portals.
- **Family Portal:** View case timeline, earnings, and marketplace.
- **Grievance Portal:** Submit anonymous complaints.
- **Admin Center:** View global statistics and analytics.
- **E-Court Room:** Simulated virtual hearing room (WebRTC).

## Known Issues & Fixes
- **Port 5000 in use:** If the backend fails to start because port 5000 is busy, stop any existing node/nodemon processes.
- **DB Connection Refused:** Ensure your local DB services are started or use Docker. The application now automatically attempts to connect to `127.0.0.1` to avoid IPv6 resolution issues.
