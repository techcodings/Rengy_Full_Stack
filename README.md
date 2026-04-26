# TeamVault — Team Management System with RBAC

A production-ready full-stack MERN application for managing teams, users, roles, and permissions with **team-scoped Role-Based Access Control (RBAC)**.

## 🏗️ Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React 18 + Vite + Tailwind CSS     |
| Backend   | Node.js + Express.js               |
| Database  | MongoDB + Mongoose                 |
| Auth      | JWT (JSON Web Tokens)              |
| Styling   | Tailwind CSS + Custom CSS          |
| Animation | Framer Motion                      |

---

## 📁 Folder Structure

```
Rengy_full_stack1/
├── server/                     # Express.js Backend
│   ├── src/
│   │   ├── config/             # DB & env config
│   │   ├── constants/          # Permission enums
│   │   ├── controllers/        # Route handlers (thin)
│   │   ├── middleware/         # auth, authorize, errorHandler, validate
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # ApiError, ApiResponse, JWT helpers
│   │   ├── validators/         # express-validator chains
│   │   └── app.js              # Express app setup
│   ├── seed.js                 # Database seed script
│   ├── server.js               # Entry point
│   └── .env                    # Environment variables
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/                # Axios instance
│   │   ├── components/         # Layout + UI components
│   │   ├── context/            # Auth context
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── App.jsx             # Root component
│   │   └── index.css           # Global styles
│   └── vite.config.js          # Vite config with proxy
│
└── README.md
```

---

## 🗄️ Database Design

### Collections

| Collection   | Purpose                                |
| ------------ | -------------------------------------- |
| `users`      | User accounts (name, email, password)  |
| `teams`      | Teams (name, description, createdBy)   |
| `roles`      | Roles with permissions array           |
| `memberships`| **User-Team-Role mapping** (critical)  |

### Key Design Decision

> **Roles are NOT stored on the User document.**
> 
> The `Membership` collection maps `(userId, teamId, roleId)`, allowing:
> - User A → **Admin** in Team Alpha
> - User A → **Viewer** in Team Beta

---

## 🔐 Permission Flow

1. Client sends request with JWT + `teamId`
2. `auth.js` middleware verifies JWT → attaches `req.user`
3. `checkPermission("CREATE_TASK")` middleware:
   - Looks up `Membership` for `(userId, teamId)`
   - Populates role → gets `permissions[]`
   - Checks if required permission exists
4. **Allow** → `next()` | **Deny** → 403 Forbidden

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017`

### 1. Setup Backend

```bash
cd server
npm install
```

### 2. Seed the Database

```bash
npm run seed
```

This creates:
- 3 Roles: Admin, Manager, Viewer
- 5 Users: Alice, Bob, Charlie, Diana, Eve
- 3 Teams: Alpha, Beta, Gamma
- 9 Memberships with different role mappings

### 3. Start the Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Setup & Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` (proxies API to backend)

### 5. Login

Use seed credentials:
- **Email:** `alice@example.com`
- **Password:** `password123`

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user

### Users
- `POST /api/users` — Create user
- `GET /api/users?search=&page=&limit=` — List users

### Teams
- `POST /api/teams` — Create team
- `GET /api/teams` — List teams
- `POST /api/teams/:id/add-user` — Add member
- `DELETE /api/teams/:id/remove-user` — Remove member
- `GET /api/teams/:id/members` — List members

### Roles
- `POST /api/roles` — Create role
- `GET /api/roles` — List roles

### Role Assignment
- `POST /api/assign-role` — Assign role
- `PUT /api/update-role` — Update role

### Permissions
- `GET /api/permissions?userId=&teamId=` — Resolve permissions
- `GET /api/permissions/constants` — List all permissions

---

## 🎨 Frontend Pages

| Page        | Features                                              |
| ----------- | ----------------------------------------------------- |
| Login       | JWT auth, error handling, demo credentials             |
| Register    | User registration with validation                     |
| Dashboard   | Stat cards, recent users/teams                         |
| Users       | Search, pagination, create user modal                  |
| Teams       | Expandable member panels, add/remove members           |
| Roles       | Permission badges, create role with checkbox picker    |
| Permissions | User+Team selector → dynamic permission cards          |

---

## 🛡️ Authorization Middleware Example

```javascript
// In your routes:
const { checkPermission } = require('./middleware/authorize');

router.post('/tasks', 
  auth,                            // Verify JWT
  checkPermission('CREATE_TASK'),  // Check team permission
  taskController.createTask        // Handle request
);
```

---

## 📌 Sample Data After Seeding

| User    | Team Alpha | Team Beta  | Team Gamma |
| ------- | ---------- | ---------- | ---------- |
| Alice   | **Admin**  | Viewer     | —          |
| Bob     | Manager    | **Admin**  | —          |
| Charlie | Viewer     | —          | **Admin**  |
| Diana   | —          | Manager    | Viewer     |
| Eve     | —          | —          | Manager    |
