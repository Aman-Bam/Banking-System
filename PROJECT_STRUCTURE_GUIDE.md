# Project Structure & Functionality Guide

This guide maps the files and folders in the project to their specific roles and functionalities, organized from basic setup to advanced system features.

## 📂 Project Overview

- **Backend Folder**: Contains the Node.js/Express API server, database models, and business logic.
- **Frontend Folder**: Contains the React application, UI components, and client-side logic.

---

## Part 1: The Basics (Setup & Configuration)
*Essential files that get the application running and connected.*

### Backend (Server Side)
| File / Folder | Description |
| :--- | :--- |
| **`server.js`** | **The Entry Point**. Starts the HTTP server and connects to the database. |
| **`src/app.js`** | **The App Config**. Sets up middleware (CORS, JSON parsing) and mounts routes. |
| **`src/config/db.js`** | **Database Connection**. Handles the connection logic to MongoDB. |
| **`.env`** | **Secrets**. Stores sensitive keys like `MONGO_URI`, `JWT_SECRET`, and `PORT`. |
| **`package.json`** | **Dependencies**. Lists all installed libraries (Express, Mongoose, etc.) and run scripts. |

### Frontend (Client Side)
| File / Folder | Description |
| :--- | :--- |
| **`vite.config.js`** | **Build Tool Config**. Configures the dev server and **proxy** (to connect to backend). |
| **`src/main.jsx`** | **React Entry**. The root file that mounts the React app to the HTML. |
| **`src/App.jsx`** | **Router Setup**. Defines the main routes (Login, Register, Dashboard) and layout. |
| **`src/api/axios.js`** | **API Client**. A pre-configured Axios instance for making HTTP requests to the backend. |

---

## Part 2: Core Functionality (Authentication & Users)
*Files responsible for user sign-up, login, and security sessions.*

### Backend
| File | Role | Functionality |
| :--- | :--- | :--- |
| **`models/user.model.js`** | **Schema** | Defines user data: `username`, `email`, `password` (hashed). |
| **`controllers/auth.controller.js`** | **Logic** | Handles `register`, `login`, `logout`, and `verify-email`. |
| **`routes/auth.routes.js`** | **API** | Defines endpoints like `POST /api/auth/login`. |
| **`middleware/auth.middleware.js`** | **Security** | Verifies JWT tokens to protect private routes. |
| **`models/blackList.model.js`** | **Security** | Stores invalidated tokens (for logout). |

### Frontend
| File | Role | Functionality |
| :--- | :--- | :--- |
| **`context/AuthContext.jsx`** | **State** | Global state for "Is user logged in?". Stores user profile data. |
| **`pages/Login.jsx`** | **UI** | Form for users to sign in. Calls `login` API. |
| **`pages/Register.jsx`** | **UI** | Form for new users to create an account. |
| **`components/ProtectedRoute.jsx`** | **Guard** | Redirects unauthenticated users away from the Dashboard. |

---

## Part 3: Banking Operations (Accounts & Money)
*The core business logic: managing money and moving it around.*

### Backend
| File | Role | Functionality |
| :--- | :--- | :--- |
| **`models/account.model.js`** | **Schema** | Defines a bank account: `accountNumber`, `balance`, `owner`. |
| **`controllers/account.controller.js`** | **Logic** | Handles creating accounts, fetching balance, and verifying ownership. |
| **`models/transaction.model.js`** | **Schema** | Records money movement: `sender`, `receiver`, `amount`, `status`, `reference`. |
| **`controllers/transaction.controller.js`** | **Logic** | **CRITICAL**. Handles the complex logic of transfers, ACID transactions, and rollback. |
| **`routes/transaction.routes.js`** | **API** | Endpoints for `POST /transfer` and `GET /history`. |

### Frontend
| File | Role | Functionality |
| :--- | :--- | :--- |
| **`pages/Dashboard.jsx`** | **View** | The main hub. Shows balance, recent transactions, and transfer forms. |
| **`components/ui/`** | **UI** | Reusable bits like Buttons, Cards, Inputs used in the Dashboard. |

---

## Part 4: Advanced & Security (Reliability & Admin)
*Advanced features for system integrity, consistency, and administration.*

### Backend
| File | Role | Functionality |
| :--- | :--- | :--- |
| **`models/ledger.model.js`** | **Audit** | **Double-Entry Ledger**. An immutable record of every single credit and debit. |
| **`controllers/reconciliation.controller.js`** | **Consistency** | **Drift Detection**. Checks if `Account Balance` == `Sum of Ledger entries`. |
| **`routes/admin.routes.js`** | **Admin** | Special routes for system monitoring (e.g., triggering reconciliation). |
| **`middleware/validation.middleware.js`** | **Safety** | Ensures data sent to APIs is correct (e.g., "amount must be positive"). |

---

## 🚀 How functionality flows together

1.  **User Visits Page**: `Frontend/src/main.jsx` starts app -> `App.jsx` shows `Login.jsx`.
2.  **User Logs In**: `Login.jsx` calls `api/axios.js` -> sends request to `Backend/routes/auth.routes.js`.
3.  **Backend Processes**: `auth.controller.js` checks `user.model.js`, generates Token, sends back cookie.
4.  **User Accesses Dashboard**: `AuthContext.jsx` sees token -> `ProtectedRoute.jsx` allows access to `Dashboard.jsx`.
5.  **User Makes Transfer**:
    *   `Dashboard.jsx` sends transfer data to `transaction.routes.js`.
    *   `transaction.controller.js` starts a MongoDB Session (**ACID**).
    *   It updates `account.model.js` (sender -$, receiver +$).
    *   It creates `transaction.model.js` record.
    *   It creates two `ledger.model.js` entries (one debit, one credit).
    *   If anything fails, it **rolls back** everything.
