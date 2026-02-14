# 🚀 MERN Stack Boilerplate (Vite + Express)

A production-ready **MERN (MongoDB, Express, React, Node.js)** starter template designed for scalability and developer experience.

It features a **Monorepo structure** with a unified "One-Command" startup, pre-configured **CORS & Proxy** for seamless client-server communication, and a robust **Error Handling** architecture.

![MERN Architecture](https://upload.wikimedia.org/wikipedia/commons/9/94/MERN-logo.png)

---

## ✨ Key Features

### 🏗 Architecture

- **Monorepo Setup:** Distinct `client` and `server` directories for clean separation of concerns.
- **Concurrent Execution:** Boot both frontend and backend with a single command (`npm run dev`).
- **MVC Backend:** Organized server structure (Models, Views/Routes, Controllers).
- **Graceful Shutdown:** Handles `SIGINT` to close database connections cleanly.

### ⚡️ Frontend (Client)

- **Vite:** Lightning-fast HMR (Hot Module Replacement) and bundling.
- **Axios Instance:** Centralized API configuration with `withCredentials: true` for secure cookie handling.
- **Proxy Configured:** Zero CORS issues during development (`/api` requests are automatically proxied).
- **Linting & Formatting:** ESLint + Prettier + Husky (pre-commit hooks) pre-installed.

### 🛡 Backend (Server)

- **Security First:** Configured `cors` to allow credentials from specific origins.
- **Robust Error Handling:** Dedicated middleware to catch async errors and return standardized JSON responses.
- **Database:** Mongoose setup with "Fail Fast" connection logic.

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Running locally or via Atlas URI)

### 2. Installation

Run the automated script to install dependencies for **Root**, **Client**, and **Server** simultaneously:

```bash
npm run install-all
```

## Environment Setup

Create a .env file in the server directory:

```bash
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)

Backend: [http://localhost:5000](http://localhost:5000)

## 📂 Project Structure

```text
react-starter-template/
├── client/                 # React (Vite) Frontend
│   ├── src/
│   │   ├── api/            # Centralized Axios instance
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route views
│   │   └── App.jsx
│   └── vite.config.js      # Proxy configuration
├── server/                 # Express Backend
│   ├── config/             # DB Connection logic
│   ├── controllers/        # Request logic
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Error & Auth Middleware
│   ├── app.js              # App Factory
│   └── server.js           # Server Entry Point
└── package.json            # Root scripts

## 🛠 Tech Stack

| Domain   | Technology                           |
|----------|--------------------------------------|
| Frontend | React 19, Vite, Axios, React Router v7 |
| Backend  | Node.js, Express, Mongoose          |
| Database | MongoDB                             |
| Tooling  | ESLint, Prettier, Concurrently, Nodemon |
