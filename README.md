# 🎓 CampusHub — Full-Stack University Web Application

CampusHub is a full-stack digital campus ecosystem designed for modern universities. It connects students, faculty, and administration with features including an official announcement board, campus events & RSVPs, a peer marketplace & lost-and-found board, and role-based access control.

---

## 🛠️ Architecture & Tech Stack

- **Monorepo Structure**: Separate `frontend/` and `backend/` folders for independent development, deployment, and testing.
- **Frontend (`frontend/`)**: React 18 + Vite + Material UI (MUI v6) + Emotion + React Router v6 + Axios.
- **Backend (`backend/`)**: Node.js + Fastify + `@fastify/jwt` + `@fastify/cors` + `@fastify/sensible`.
- **Database (`backend/src/db/`)**: MySQL with connection pooling (`mysql2/promise`) and automatic schema migrations (`schema.sql`). Seamlessly runs with a live MySQL instance or built-in high-performance in-memory fallback mode for zero-setup demoing.

---

## 📂 Repository Structure

```text
CampusHub/
├── package.json                 # Monorepo scripts runner
├── .gitignore                   # Root ignore rules
├── README.md                    # Project documentation
├── backend/                     # Fastify API Server
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js    # MySQL connection pool & DAL
│   │   │   ├── schema.sql       # MySQL DDL table schemas
│   │   │   └── seedData.js      # Seed demo records
│   │   ├── middleware/
│   │   │   └── auth.js          # Fastify JWT & RBAC verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # Register, login, me
│   │   │   ├── noticeRoutes.js  # Campus notice board CRUD
│   │   │   ├── eventRoutes.js   # Events & RSVPs
│   │   │   ├── marketplaceRoutes.js # Marketplace & lost/found
│   │   │   └── statsRoutes.js   # Dashboard metrics overview
│   │   └── server.js            # Fastify server entry
│   ├── .env                     # Local environment file
│   ├── .env.example             # Template config
│   └── package.json
└── frontend/                    # React + Vite + Material UI Client
    ├── src/
    │   ├── components/          # Navbar, Sidebar, AuthModal
    │   ├── context/             # AuthContext (JWT session state)
    │   ├── layouts/             # MainLayout (Responsive App Shell)
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Metrics, recent notices & upcoming events
    │   │   ├── NoticesPage.jsx  # Categorized & pinned announcements
    │   │   ├── EventsPage.jsx   # Event cards & interactive RSVPs
    │   │   ├── MarketplacePage.jsx # Items for sale & lost & found
    │   │   └── ProfilePage.jsx  # Student/Staff profile & RSVPs
    │   ├── services/
    │   │   └── api.js           # Axios client with interceptors
    │   ├── theme/
    │   │   └── theme.js         # Custom MUI Theme (Light/Dark mode)
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── vite.config.js           # Vite config with API proxy
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **MySQL Server** (optional; the backend automatically connects to MySQL if available, or activates the built-in development memory fallback)

### 2. Quick Start
From the project root:

```bash
# Install dependencies in both folders
npm run install:all

# Run Backend (Port 5000)
npm run dev:backend

# In another terminal, run Frontend (Port 3000)
npm run dev:frontend
```

Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

Use the **One-Click Demo Access** buttons in the Sign In modal, or log in with these pre-seeded credentials:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campushub.edu` | `Student@123` | View notices, RSVP to events, post marketplace items |
| **Faculty** | `faculty@campushub.edu` | `Faculty@123` | Post department notices, host events, browse marketplace |
| **Administrator** | `admin@campushub.edu` | `Admin@123` | Full access, publish critical alerts, delete announcements |

---

## 🛢️ Connecting to MySQL

To link your live MySQL database:
1. Open `backend/.env`.
2. Configure your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=campushub_db
   ```
3. Restart the backend (`npm run dev:backend`). The server will automatically create `campushub_db`, generate the required tables, and seed the initial dataset.
