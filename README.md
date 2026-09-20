# 🏦 Backend-Ledger & Banking System

A full-stack, enterprise-grade financial ledger and banking platform designed for high integrity, ACID compliance, double-entry accounting, and real-time transaction processing.

Built with **React, TypeScript, Vite, Tailwind CSS** on the frontend, and **Node.js, Express, MongoDB (Mongoose)** on the backend.

---

## 🌐 Live Deployments

- **Frontend (Vercel)**: [https://banking-system-sooty.vercel.app](https://banking-system-sooty.vercel.app)
- **Backend API (Render)**: [https://banking-system-6hif.onrender.com](https://banking-system-6hif.onrender.com)
- **Privacy Policy**: [https://banking-system-sooty.vercel.app/privacy](https://banking-system-sooty.vercel.app/privacy)
- **Terms of Service**: [https://banking-system-sooty.vercel.app/terms](https://banking-system-sooty.vercel.app/terms)

---

## 🚀 Key Features

- 🔐 **Secure Authentication**: Custom JWT authentication with HTTP-only cookies, Bearer token headers, and active MongoDB token blacklisting (`tokenblacklists` TTL collection) on logout.
- 🏦 **Multi-Account Management**: Create and track savings/checking accounts with initial deposits, real-time balance updates, and currency formatting.
- 💸 **Atomic Transfers & Double-Entry Ledger**: Every transfer creates debit/credit ledger records to enforce financial integrity ($Sum(Debits) = Sum(Credits)$).
- 🛡️ **Idempotency Protection**: Prevents duplicate payments using unique idempotency keys per transaction request.
- 📧 **Automated Email Notifications**: Asynchronous email delivery for account registration and successful/failed transactions using Nodemailer with Google OAuth2.
- 📊 **Audit Logs & Reconciliation**: Full transparency with real-time audit trails and administrative ledger reconciliation endpoints.
- 🌐 **Responsive Glassmorphism UI**: High-aesthetic dark mode interface with interactive modals, search filters, and smooth micro-animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Lucide Icons
- **State & Data Fetching**: Context API & TanStack Query (React Query)
- **HTTP Client**: Axios with request/response interceptors
- **Routing**: React Router v6 (with Single Page Application Vercel rewrites)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Validation**: Zod schema validation middleware
- **Email Service**: Nodemailer with Gmail OAuth2 integration
- **Logging**: Winston logger
- **Security**: CORS headers, Express Rate Limiting (30 requests/min on transactions), Bcrypt password hashing

---

## 📚 Complete API Reference (10 Endpoints)

| Category | Method | Endpoint | Description | Auth |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new user & send welcome email | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| **Auth** | `POST` | `/api/auth/logout` | Invalidate token & blacklist JWT | Protected |
| **Accounts** | `POST` | `/api/accounts/` | Create account with initial deposit | Protected |
| **Accounts** | `GET` | `/api/accounts/` | Fetch user's bank accounts | Protected |
| **Accounts** | `GET` | `/api/accounts/all` | Fetch all registered active accounts for transfers | Protected |
| **Accounts** | `GET` | `/api/accounts/balance/:accountId` | Get specific account balance | Protected |
| **Transactions**| `POST` | `/api/transactions/` | Transfer funds between accounts (atomic double-entry) | Protected |
| **Transactions**| `GET` | `/api/transactions/` | Fetch user transaction history & audit logs | Protected |
| **Transactions**| `POST` | `/api/transactions/system/initial-funds` | Deposit system funds into an account | System User |
| **Admin** | `GET` | `/api/admin/reconcile/:accountId` | Reconcile account balance against ledger entries | System User |

---

## 📂 Project Structure

```text
Banking-System/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & logger configuration
│   │   ├── controllers/     # Auth, Account, Transaction, Admin handlers
│   │   ├── middleware/      # JWT auth, Zod validators, Rate limiters
│   │   ├── models/          # User, Account, Transaction, Ledger, TokenBlacklist
│   │   ├── routes/          # Express route definitions
│   │   └── services/        # Email service (Google OAuth2 + Nodemailer)
│   ├── server.js            # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── public/              # Static html assets (privacy.html, terms.html)
│   ├── src/
│   │   ├── api/             # Axios client & API endpoints
│   │   ├── components/      # UI Layout, Inputs, Buttons, Modals
│   │   ├── context/         # AuthContext provider & state sync
│   │   ├── features/        # Accounts, Transactions, Audit, Ledger features
│   │   ├── pages/           # Landing, Login, Register, Dashboard, Privacy, Terms
│   │   ├── store/           # Zustand state store
│   │   └── main.tsx         # React app entry point
│   ├── vercel.json          # Single Page Application SPA rewrite config
│   └── package.json
│
├── vercel.json              # Repository root Vercel configuration
└── README.md
```

---

## 🏁 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/test
JWT_SECRET=your_secure_jwt_secret_key
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

Start the backend dev server:
```bash
npm run dev
# Server running at http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

Start the frontend Vite dev server:
```bash
npm run dev
# App running at http://localhost:5173
```

---

## 📐 System Invariants & Security Principles

1. **Non-Negative Account Balances**: Account balances are validated inside MongoDB sessions to prevent negative balances.
2. **Double-Entry Equality**: Every completed transfer creates an atomic pair of DEBIT and CREDIT ledger records.
3. **Idempotent Executions**: Duplicate requests containing the same `idempotencyKey` return previous transaction results without re-executing transfers.
4. **Token Invalidation on Logout**: Logged out JWT tokens are stored in the `tokenblacklists` TTL collection and rejected on all protected routes.

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
