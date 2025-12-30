# Background Job Tracker

A **full-stack background job tracking dashboard** built with **Next.js, React, Node.js, Express, and MongoDB**. This app allows users to **create, monitor, retry, and manage background jobs** in real-time.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Setup & Run](#setup--run)
6. [Challenges & Learnings](#challenges--learnings)
7. [Demo / Usage](#demo--usage)
8. [Future Enhancements](#future-enhancements)
9. [Deployment](#deployment)

---

## Project Overview

**Goal:** Build a dashboard to manage and monitor background jobs with **retry mechanisms and live status updates**.  

This project demonstrates:

* Full-stack development skills  
* Job queue handling and retry logic  
* REST API design and real-time updates  
* Conditional rendering and interactive components  
* Type-safe frontend and backend using TypeScript  

---

## Tech Stack

* **Frontend:** Next.js 13, React 18, Tailwind CSS, Axios  
* **Backend:** Node.js, Express.js, TypeScript  
* **Database:** MongoDB  
* **Other:** dotenv, Cors  

---

## Features

1. Create background jobs with custom payloads  
2. View job queue with **status indicators** (Pending, Running, Completed, Failed)  
3. Retry failed jobs manually  
4. Automatic retry for retryable failures  
5. Loading and error states for API requests  
6. Responsive and mobile-friendly UI  

---

## Architecture

```
Frontend (Next.js)          Backend (Express)          MongoDB
-----------------          ----------------          -------
React Components             REST API                 users & transactions collections
State Management              JWT Auth                  
CSV Import via Multer         CRUD Endpoints            
Charts with Recharts         ------------------
```

**Flow**

1. User creates a new job → Frontend calls `/api/jobs` (POST).  
2. Backend stores job in MongoDB with `status: pending`.  
3. Worker processes the job and updates status (`running`, `completed`, `failed`).  
4. Frontend polls `/api/jobs` to fetch the latest job statuses.  
5. Failed jobs can be retried manually via the UI.  

---

## Setup & Run

1. **Clone the repo**  
2. **Install dependencies**

```bash
# backend
cd backend
npm install

# frontend
cd frontend
npm install
```

3. **Set environment variables** (`.env`)

```env
MONGO_URI=your_mongo_uri
DB_NAME=job_tracker_db
BACKEND_PORT=3000
FRONTEND_PORT=3001
URL=http://localhost
```

4. **Run backend**

```bash
cd backend
npm run dev
```

5. **Run frontend**

```bash
cd frontend
npm run dev
```

6. Open in browser → `http://localhost:3001`

---

## Challenges & Learnings

* Building a robust retry mechanism for failed jobs
* Type-safe API integration with Axios and TypeScript
* Real-time UI updates with polling and conditional rendering
* Handling async job processing with Node.js
* Designing a responsive and mobile-friendly dashboard

---

## Demo / Usage

* View all background jobs in a queue with live status
* Retry failed jobs manually
* See job details and payloads
* Dashboard adapts to desktop and mobile screens

---

## Future Enhancements

* Add user authentication and roles (admin vs regular user)
* Add scheduled jobs with cron-like functionality
* Push notifications for job completion or failures
* Unit and integration tests for frontend and backend

## Deployment Link
https://background-job-tracker.vercel.app
