# AquaQuest
> **Gamified Water Conservation & Groundwater Awareness Portal**

AquaQuest is an interactive, full-stack web application designed to educate citizens, students, and communities about groundwater depletion, encourage daily water-saving habits, and gamify environmental stewardship through server-authoritative points, streaks, badges, quizzes, and leaderboards.

---

## 🌊 Overview

Groundwater accounts for nearly **40% of global agricultural irrigation** and provides drinking water to over **2 billion people**. However, unmonitored extraction, climate shifts, and urban surface sealing have led to severe water table depletion and land subsidence worldwide.

**AquaQuest** bridges the awareness gap by turning abstract hydrogeological concepts into engaging, actionable daily missions. Users learn about aquifers through curated articles, test their knowledge with interactive quizzes, perform real-world water-saving challenges, and earn server-verified XP, levels, and achievement badges.

---

## ✨ Key Features

- 🔐 **Secure Authentication**: User registration and login using encrypted passwords and JWT access tokens.
- 🎯 **Water Conservation Challenges**: Real-world household and community missions with server-authoritative point awards.
- 🧠 **Educational Quizzes**: Server-evaluated quizzes with instant explanations, passing thresholds, and anti-cheat safeguards.
- 📚 **Awareness Articles Hub**: Rich educational content on groundwater hydrogeology, rainwater harvesting, and pollution prevention.
- ⚡ **Gamification Engine**: Dynamic XP progression, level titles, active daily streak tracking, and unlockable achievement badges.
- 💧 **Water-Saved Metrics**: Cumulative tracking of verified water volume (in Liters) preserved per user and community-wide.
- 🏆 **Global Leaderboard**: Live ranking podium (Gold, Silver, Bronze) sorted by XP, active streaks, or liters saved.
- 👤 **User Profile & History**: Activity timeline, badge showcase, level title, and personal conservation metrics.
- 🛡️ **Admin Command Center**: System telemetry overview, content management (articles, challenges, quizzes), and user role administration.
- 📱 **Fully Responsive UI**: Optimized, fluid layout across Desktop (1920x1080), Tablet (768x1024), and Mobile (390x844) viewports.
- 🔒 **Enterprise-Grade Security Controls**: Rate limiting, CORS origin isolation, strict input sanitization, and RBAC route shielding.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework & Build Tool**: React 18 + Vite 5
- **Styling**: Tailwind CSS v3 + Custom Eco Hydro Utilities
- **Iconography**: Lucide React Icons
- **HTTP Client**: Axios with centralized request/response interceptors
- **Routing**: React Router DOM v6

### **Backend**
- **Runtime & Server**: Node.js v24 + Express.js v4
- **Database & ODM**: MongoDB Atlas / Local MongoDB + Mongoose v8
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` (Salt round 10)
- **Validation**: `express-validator` middleware
- **Rate Limiting**: `express-rate-limit`

### **Security Safeguards**
- **Password Hashing**: `bcryptjs` pre-save hooks
- **Access Control**: Role-Based Access Control (`roleMiddleware`) & Auth Shield (`authMiddleware`)
- **Rate Limiting**: Environment-configurable IP rate limiters (`apiLimiter`, `authLimiter`, `submissionLimiter`)
- **CORS Protection**: Origin restriction via `ALLOWED_ORIGINS` configuration
- **Server-Authoritative Rewards**: All XP calculations, quiz score evaluations, and badge awards take place strictly server-side.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     React 18 + Vite UI                      │
│      (Pages: Dashboard, Challenges, Quizzes, Leaderboard)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js REST API                      │
│  [Rate Limiter] ──> [JWT Auth / RBAC] ──> [Validation]      │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌───────────────────────────┐
│ Server-Authoritative Engine  │ │  Mongoose ODM Schema Layer│
│  - Quiz Score Evaluation     │ │  (User, Article, Quiz,    │
│  - Idempotent Points Award   │ │   Challenge, Badge,       │
│  - Streak & Badge Trigger    │ │   UserProgress)           │
└──────────────────────────────┘ └─────────────┬─────────────┘
                                               │ TCP / MONGODB_URI
                                               ▼
                                 ┌───────────────────────────┐
                                 │       MongoDB Atlas       │
                                 └───────────────────────────┘
```

---

## 📁 Project Structure

```text
aqua_quest/
├── package.json               # Root scripts for concurrently managing frontend & backend
├── README.md                  # Comprehensive documentation
├── .gitignore                 # Root git exclusion rules (.env, node_modules, dist, logs)
│
├── backend/
│   ├── .env                   # Local environment configuration (IGNORED by Git)
│   ├── .env.example           # Environment variable template with placeholders
│   ├── .gitignore             # Backend exclusion rules
│   ├── package.json           # Node.js backend dependencies & start scripts
│   └── src/
│       ├── server.js          # Express app initialization & server entrypoint
│       ├── config/
│       │   └── db.js          # Mongoose MongoDB connection builder
│       ├── controllers/       # Business logic (Auth, Users, Challenges, Quizzes, Admin, Leaderboard)
│       ├── middleware/        # Security middleware (Auth JWT, RBAC, Validation, Rate Limiting, Error Handler)
│       ├── models/            # Mongoose schemas (User, Article, Challenge, Quiz, Badge, UserProgress)
│       ├── routes/            # Express API endpoint definitions
│       └── utils/
│           ├── gamification.js# Server-side XP, Level, Streak, and Badge calculation engine
│           └── seedData.js    # Idempotent demo database seeder
│
└── frontend/
    ├── .env                   # Local frontend environment config (VITE_API_BASE_URL)
    ├── .env.example           # Frontend environment template
    ├── .gitignore             # Frontend exclusion rules (dist, node_modules, .env)
    ├── index.html             # HTML5 entrypoint
    ├── package.json           # Frontend dependencies & Vite scripts
    ├── postcss.config.js      # PostCSS configuration
    ├── tailwind.config.js     # Tailwind CSS design system theme configuration
    ├── vite.config.js         # Vite bundler setup
    └── src/
        ├── App.jsx            # React Router tree & application shell
        ├── main.jsx           # React DOM root renderer
        ├── index.css          # Global styling & eco hydro CSS components
        ├── api/               # Axios instance with auth header injection
        ├── context/           # AuthContext provider (user state, login, logout)
        ├── components/
        │   └── common/        # Shared Navbar, Footer, ProtectedRoute, LoadingSpinner
        └── pages/             # Home, Dashboard, Challenges, Quizzes, QuizTake, Articles, ArticleDetail, Leaderboard, Profile, AdminDashboard
```

---

## 🎮 Gamification Engine

AquaQuest implements a **server-authoritative gamification model**:

1. **XP & Levels**: Points earned from completed challenges and quizzes increase `totalPoints`. Levels progress dynamically every 200 XP with titles ranging from *Water Saver Trainee* (Level 1) to *Water Conservation Hero* (Level 5+).
2. **Daily Streaks**: Consecutive daily check-ins or completed activities maintain the `currentStreak` counter. Missing a day resets the active streak.
3. **Idempotent Rewards**: Activity completions generate unique `activityKey` hashes stored in `UserProgress`. Attempting duplicate completions yields 0 additional XP, preventing point exploits.
4. **Badges**: Awarded automatically when milestones are met (`totalPoints`, `currentStreak`, `quizzesCompleted`, `challengesCompleted`, `waterSavedLiters`).
5. **Water Saved**: Each completed challenge awards a verified volume of saved water (e.g., 30 Liters for fixing a leak), tracked globally and per user.

---

## 🔐 Security Architecture

- **Password Hashing**: Uses `bcryptjs` with salt rounds = 10. Passwords are stripped from standard database queries (`select: false`).
- **JWT Authorization**: Stateless bearer tokens signed with `JWT_SECRET` and evaluated by `authMiddleware`.
- **RBAC Shielding**: Admin routes (`/api/admin/*`) are protected by `roleMiddleware(['admin'])`.
- **Environment Isolation**: Sensitive configuration exists strictly in `.env` files. `.gitignore` ensures zero secrets leak to source control.
- **Anti-Cheat Quiz Engine**: Correct quiz option indices are never transmitted to the frontend prior to submission; all answers are evaluated server-side.
- **Rate Limiting**: Protects against brute-force attacks via configurable request ceilings (`RATE_LIMIT_AUTH_MAX`, `RATE_LIMIT_SUBMISSION_MAX`).

---

## 🚀 Installation & Local Setup

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/aquaquest`) or MongoDB Atlas connection URI

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/aqua_quest.git
cd aqua_quest
```

### **2. Install Dependencies**
Using the root helper script:
```bash
npm run install:all
```
*Or manually:*
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### **3. Environment Setup**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aquaquest
JWT_SECRET=aquaquest_jwt_secret_key_secure_auth_98765
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

RATE_LIMIT_API_MAX=200
RATE_LIMIT_AUTH_MAX=60
RATE_LIMIT_SUBMISSION_MAX=60

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@aquaquest.com
ADMIN_PASSWORD=AquaAdmin123!
DEMO_USER_PASSWORD=AquaUser123!
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### **4. Seed Initial & Demo Data**
Run the idempotent database seed script:
```bash
npm run seed
```

### **5. Run Applications**

**Start Backend API** (Terminal 1):
```bash
npm run backend:dev
```
*Backend will run on `http://localhost:5000`*

**Start Frontend Client** (Terminal 2):
```bash
npm run frontend
```
*Frontend will run on `http://localhost:5173`*

---

## 📊 Environment Variables Reference

| Variable Name | Description | Example / Default Value |
|---|---|---|
| `PORT` | Backend HTTP Port | `5000` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb://127.0.0.1:27017/aquaquest` |
| `JWT_SECRET` | Secret key for JWT signing | `<strong_secret_key>` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://localhost:3000` |
| `RATE_LIMIT_API_MAX` | Max general API requests / 15m | `200` |
| `RATE_LIMIT_AUTH_MAX` | Max auth requests / 15m | `60` |
| `ADMIN_USERNAME` | Default seeded admin username | `admin` |
| `ADMIN_EMAIL` | Default seeded admin email | `admin@aquaquest.com` |
| `ADMIN_PASSWORD` | Default seeded admin password | `AquaAdmin@2026!` |
| `VITE_API_BASE_URL` | Frontend API client base URL | `http://localhost:5000/api` |

---

## 👥 Seeded Demo Data (Development / Viva Demo Only)

For evaluation and demonstration, the database includes pre-seeded demo accounts:

> [!NOTE]
> **DEVELOPMENT & EVALUATION CREDENTIALS ONLY**

- **Admin Account**:
  - **Username**: `admin`
  - **Email**: `admin@aquaquest.com`
  - **Password**: `AquaAdmin123!`
  - **Role**: `admin` (Access to `/admin` telemetry, user management, content creation)

- **Standard User Account**:
  - **Username**: `user`
  - **Email**: `user@aquaquest.com`
  - **Password**: `AquaUser123!`
  - **Role**: `user` (Normal participant with points, challenges, and badges)

- **Demo User Accounts**:
  - **Email**: `aarav@aquaquest.org` | **Password**: `DemoUser@123` (Level 4, 680 XP, 12-day streak)
  - **Email**: `priya@aquaquest.org` | **Password**: `DemoUser@123` (Level 3, 450 XP, 6-day streak)
  - **Email**: `rohan@aquaquest.org` | **Password**: `DemoUser@123` (Level 3, 340 XP, 5-day streak)

---

## 🧪 Testing & Quality Assurance

- **Production Frontend Build**:
  ```bash
  npm run frontend:build
  ```
  *Generates optimized production bundle in `frontend/dist/`.*

- **Automated E2E Playwright Suite**:
  Run full 18-step E2E verification test across Desktop (1920x1080), Tablet (768x1024), and Mobile (390x844) viewports:
  ```bash
  node scratch/e2e_test.js
  ```

---

## 🔌 API Overview

| Endpoint Group | Method | Path | Description | Access |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new user account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and return JWT token | Public |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| **Users** | `POST` | `/api/users/checkin` | Claim daily streak check-in XP | Private |
| **Articles** | `GET` | `/api/articles` | Retrieve educational articles | Public |
| **Articles** | `GET` | `/api/articles/:id` | Retrieve single article details | Public |
| **Challenges** | `GET` | `/api/challenges` | Retrieve water conservation challenges | Public |
| **Challenges** | `POST` | `/api/challenges/:id/complete` | Complete challenge & earn server XP | Private |
| **Quizzes** | `GET` | `/api/quizzes` | Retrieve interactive quizzes | Public |
| **Quizzes** | `POST` | `/api/quizzes/:id/submit` | Evaluate quiz submission server-side | Private |
| **Leaderboard**| `GET` | `/api/leaderboard` | Retrieve global user rankings | Public |
| **Admin** | `GET` | `/api/admin/stats` | Fetch system telemetry statistics | Admin |
| **Admin** | `GET` | `/api/admin/users` | List registered user accounts | Admin |

---

## 🔮 Future Enhancements

- 📍 **Location-Aware Hydro Data**: Real-time regional water table depth mapping via GIS integration.
- 📡 **IoT Smart Water Metering**: Automated water saving verification via smart ultrasonic meter telemetry.
- 🌐 **Multilingual Support**: Internationalization (i18n) for regional language availability.
- 🏫 **Campus & School Campaigns**: Institutional leaderboards for inter-school water conservation competitions.
- 🔔 **Push Notifications**: Daily streak reminders and new mission alerts.

---

## 🎓 Academic Context

Developed as a capstone full-stack web engineering project, **AquaQuest** demonstrates how gamification principles (behavioral feedback loops, server-authoritative scoring, progression systems) combined with modern web technology (React, Node.js, Express, MongoDB) can effectively drive environmental awareness and foster sustainable daily water habits.
