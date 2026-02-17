# Backend Banking System

A rigorous, production-grade financial ledger system designed for high integrity, auditability, and concurrency control. This backend service implements a double-entry ledger with strict ACID compliance, ensuring that every transaction is balanced and verifiable.

## 🚀 Key Features

*   **Robust Double-Entry Ledger**: Every transaction records a debit and a credit, ensuring the sum of all ledger entries is always zero.
*   **Strict Concurrency Control**: Utilizes snapshot isolation and atomic updates to prevent race conditions, double-spending, and phantom reads.
*   **Auditability & Integrity**: Immutable ledger entries serve as the single source of truth. Discrepancies can be detected via built-in reconciliation tools.
*   **Secure Authentication**: JWT-based authentication with secure cookie storage, rate limiting, and input validation using Zod.
*   **Idempotency**: Guarantees exactly-once execution for transactions using unique idempotency keys.
*   **System Hardening**: Protection against negative balances, drift detection, and automated consistency checks.

## 🛠️ Technology Stack

*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
*   **Authentication**: JSON Web Tokens (JWT), Bcrypt
*   **Validation**: Zod
*   **Logging**: Winston
*   **Testing**: Jest, Supertest

## 📋 Prerequisites

Ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)

## ⚙️ Installation

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd Backend-Banking-System
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**

    Create a `.env` file in the root directory. You can use `.env.example` as a reference (if available) or add the following required variables:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/banking-system
    JWT_SECRET=your_secure_jwt_secret
    NODE_ENV=development
    EMAIL_SERVICE=gmail
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-password
    # Add other configuration keys as needed
    ```

## ▶️ Running the Application

### Development Mode
Runs the server with `nodemon` for hot-reloading.

```bash
npm run dev
```

### Production Mode
Runs the server using standard Node.js.

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured `PORT`).

## 🧪 Testing

The project includes a comprehensive test suite (using Jest) to verify transaction integrity, concurrency handling, and API functionality.

```bash
# Run all tests
npm test

# Run specifically the transaction tests (includes double-spend simulations)
npm test tests/transaction.test.js
```

## 📚 API Documentation

A detailed guide on how to use the API with Postman is available in [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md).

### Quick API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a token |
| `POST` | `/api/auth/logout` | Logout the current user |
| **Accounts** | | |
| `POST` | `/api/accounts` | Create a new account |
| `GET` | `/api/accounts` | List user's accounts |
| `GET` | `/api/accounts/balance/:id` | Get account balance |
| **Transactions** | | |
| `POST` | `/api/transactions` | Transfer funds between accounts |
| **Admin** | | |
| `GET` | `/api/admin/reconcile/:id` | Check for ledger drift |

## 📐 System Invariants

The system is built upon four core invariants that are rigorously enforced:

1.  **Non-Negative Balance**: No account balance can drop below zero.
2.  **Double-Entry Integrity**: Sum of Debits must equal Sum of Credits for every transaction transaction.
3.  **Audit Consistency**: The calculated balance from the ledger must match the stored account balance.
4.  **Idempotency**: Requests with the same key are processed exactly once.

## 📂 Project Structure

```
Backend-Banking-System/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose schemas (User, Account, Transaction)
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── middlewares/      # Auth, Validation, Rate Limiters
│   └── utils/            # Helper functions (Logger, Errors)
├── tests/                # Jest test specs
├── POSTMAN_GUIDE.md      # API usage guide
├── server.js             # Entry point
└── package.json          # Dependencies and scripts
```

## 📄 License

This project is licensed under the ISC License.
