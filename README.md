# CollabHub - Team Collaboration & Project Management

https://www.notion.so/Collab-Hub-Project-27eb855b64fa80bbb28fdbd3ce5c392b?source=copy_link

CollabHub is a full-stack web application for modern team collaboration and project management. The platform enables users to manage projects, assign tasks, communicate in real time, and share files with a secure, scalable architecture. Built with **Next.js** and **NestJS**, CollabHub leverages modern development practices and powerful cloud integrations.

---

## 🚀 Project Overview

CollabHub brings together everything a team needs to work efficiently:
- Manage projects and tasks with Kanban boards
- Real-time chat per project
- Secure file sharing (AWS S3)
- Dashboards and analytics for project progress
- Flexible authentication (JWT & Google OAuth)

This project is designed to practice end-to-end development using the latest features of Next.js and NestJS.

---

## 🎯 Objectives

- Build a scalable backend (NestJS) with REST and GraphQL APIs
- Develop a responsive frontend (Next.js) with authentication, dashboards, and task boards
- Implement real-time features (chat, notifications) using WebSockets
- Handle file uploads and project documents (AWS S3/local)
- Ensure secure authentication with JWT & OAuth (Google Sign-In)

---

## 🧩 Core Features

### 1. Authentication & Authorization
- Sign up / Login with email & password
- Google login (OAuth)
- JWT authentication with refresh tokens
- Role-based access control: Admin, Project Manager, Team Member

### 2. Project & Task Management
- Create, edit, delete projects
- Add team members to projects
- Kanban-style task board (drag & drop)
- Task details: title, description, assignee, due date, priority

### 3. Real-Time Chat
- Project-specific chatrooms
- WebSockets for instant messaging
- Online/offline status, typing indicators, read receipts

### 4. File Sharing
- Upload documents, images, PDFs within projects
- Store files in AWS S3 (or local for dev)
- Preview images/PDFs in the frontend

### 5. Dashboard & Analytics
- Project overview: active projects, members, completed tasks
- Progress charts (task completion by status)
- Notifications: task assignment, deadlines, chat messages

---

## ⚙️ Tech Stack

**Frontend (Next.js)**
- Next.js 14 (App Router, SSR + CSR)
- TailwindCSS (UI styling)
- React Query (API data fetching & caching)
- NextAuth.js (authentication)
- Zustand or Redux Toolkit (state management)

**Backend (NestJS)**
- NestJS (modular architecture)
- PostgreSQL + TypeORM (database)
- Passport.js (JWT + OAuth strategies)
- WebSockets (real-time chat/notifications)
- Swagger (API documentation)

**Others**
- AWS S3 (file storage)
- Redis (caching + WebSocket scaling)
- Docker (containerization)

---

## 🗄️ Database Schema (Core Tables)

- **Users:** id, name, email, passwordHash, role, avatar
- **Projects:** id, name, description, createdBy, members[]
- **Tasks:** id, title, description, status, priority, dueDate, assigneeId, projectId
- **Messages:** id, content, senderId, projectId, createdAt
- **Files:** id, fileName, url, uploadedBy, projectId

---

## 📦 Installation & Getting Started

**Requirements:** Node.js, PostgreSQL, Docker (optional), AWS credentials (for S3), Google API credentials

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdul-wahab456/CollabHub-Team-Collaboration-Project-Management.git
   cd CollabHub-Team-Collaboration-Project-Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` for both frontend and backend
   - Add your DB, AWS, JWT, and Google API credentials

4. **Start backend (NestJS)**
   ```bash
   cd backend
   npm run start:dev
   ```

5. **Start frontend (Next.js)**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📁 Project Structure

```
CollabHub-Team-Collaboration-Project-Management/
├── backend/      # NestJS API
├── frontend/     # Next.js web app
├── shared/       # Shared types & utilities
├── README.md
└── ...
```

---

## 📚 Documentation

- **API Docs:** Swagger UI at `/api/docs` (when backend is running)
- **Environment Setup:** See `.env.example` files in both `backend` and `frontend`

---

## 🏗️ Deliverables

### **Phase 1: Backend (NestJS)**
- NestJS project with modules: Auth, Users, Projects, Tasks, Chat, Files
- JWT + OAuth authentication
- CRUD APIs for projects & tasks
- WebSocket chat events
- File upload API (AWS/local)
- Swagger documentation

### **Phase 2: Frontend (Next.js)**
- Next.js project with Tailwind
- NextAuth authentication with JWT & Google
- Project list & details page
- Kanban task board (drag & drop)
- Real-time chat UI (WebSocket)
- File upload UI with preview
- Dashboard with charts

---

## 📝 Evaluation Criteria

- Code quality (clean, modular, documented)
- Proper use of Next.js & NestJS features
- Secure authentication & authorization
- Working real-time chat and notifications
- User-friendly, responsive UI
- Proper database design with relationships

---

## 👤 Author

**Abdul Wahab**  
[GitHub Profile](https://github.com/Abdul-wahab456)

---

## 🌐 Demo
*OverView*
<img width="1427" height="750" alt="Overview" src="https://github.com/user-attachments/assets/01e927cb-0e47-4575-a049-e3eb93e01cf8" />

*Project*
<img width="1428" height="732" alt="Project" src="https://github.com/user-attachments/assets/04537d9e-81b7-47c5-95c3-e56851f7d403" />

*Task Board*
<img width="1430" height="734" alt="Task-Board" src="https://github.com/user-attachments/assets/e7ee6674-ed05-445b-bad7-c631d3048932" />

*Message*
<img width="1431" height="789" alt="Message" src="https://github.com/user-attachments/assets/b8a01f79-1a7f-4975-9b7a-8b3245a78681" />

*File*
<img width="1427" height="727" alt="File" src="https://github.com/user-attachments/assets/09231f8b-a9ce-466a-87cd-70aa17d3ec34" />

---

## ⭐️ If you like this project, please star it!

---

## 🗣️ Language Composition

- **TypeScript:** 95.8%
- **CSS:** 3.4%
- **JavaScript:** 0.8%

---
