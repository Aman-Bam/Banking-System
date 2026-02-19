# Backend Architecture Overview

## 1. System Overview
The backend is a **Node.js** application using **Express.js** as the web framework and **MongoDB** (via Mongoose) for persistence. It implements a robust, double-entry ledger system designed for high concurrency and data integrity.

## 2. Core Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Replica Set required for transactions)
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens) with Blacklisting
- **Security:** Helmet (assumed), Rate Limiting, CORS

## 3. Data Models
The system relies on five core interrelated models:

### 3.1 User (`user.model.js`)
- Stores authentication details (Email, Password Hash).
- Distinguishes between regular users and system users.

### 3.2 Account (`account.model.js`)
- Represents a financial account linked to a user.
- **Critical Field:** `balance` (Mutable).
- **Concurrency Gate:** The `balance` field serves as the primary optimistic lock. Updates are performed atomically using MongoDB's `$inc` operator with strict conditions (e.g., balance >= amount).

### 3.3 Transaction (`transaction.model.js`)
- Represents the intent and status of a money movement.
- **Fields:** `fromAccount`, `toAccount`, `amount`, `status` (PENDING, COMPLETED, FAILED), `idempotencyKey`.
- **Idempotency:** Enforced via a unique index on `idempotencyKey` to prevent duplicate processing.

### 3.4 Ledger (`ledger.model.js`)
- Implements **Double-Entry Bookkeeping**.
- **Immutable:** Records cannot be updated or deleted (enforced via Mongoose middleware).
- Every valid transaction creates **two** ledger entries:
  1. **DEBIT** entry for the sender.
  2. **CREDIT** entry for the receiver.

### 3.5 TokenBlacklist (`blackList.model.js`)
- Stores invalidated JWTs to enforce logout functionality before token expiration.
- Uses TTL (Time-To-Live) indexes for auto-cleanup.

## 4. Transaction Lifecycle & Concurrency Control
The system prioritizes data consistency using **MongoDB Multi-Document ACID Transactions**.

### The Transfer Flow (`transaction.controller.js`)
1. **Idempotency Check:** Checks if `idempotencyKey` already exists to prevent duplicates.
2. **Session Start:** Initiates a MongoDB session with `snapshot` isolation.
3. **Validation:** Verifies account ownership and status (`ACTIVE`) within the session.
4. **Atomic Debit (The Lock):**
   - Performs a conditional update: `balance = balance - amount`
   - **Condition:** `{ _id: fromAccount, balance: { $gte: amount } }`
   - If this fails, the transaction aborts instantly (Insufficient Funds).
5. **Atomic Credit:** Updates receiver's balance: `balance = balance + amount`.
6. **Record Creation:**
   - Creates a `Transaction` document (PENDING).
   - Creates `Ledger` entries (DEBIT & CREDIT).
7. **Completion:** Updates `Transaction` status to COMPLETED.
8. **Commit:** Commits the session so all changes persist together.
9. **Async Notifications:** Emails are sent *after* the commit (outside the transaction) to prevent non-transactional side effects from blocking the flow.

## 5. Security Architecture
- **Authentication:** Bearer Token (JWT) strategy.
- **Authorization:** Ownership checks ensure users can only debit their own accounts.
- **Rate Limiting:** Applied specifically to transaction routes (30 req/min) to prevent abuse.
- **Input Validation:** Zod schemas (inferred from package.json) likely used for request body validation.

## 6. Directory Structure
```
Backend/src/
├── config/         # DB connection, Logger
├── controllers/    # Business logic (Transaction, Auth, Account)
├── middleware/     # Auth checks, Rate limiters
├── models/         # Mongoose schemas (User, Account, Ledger)
├── routes/         # API Route definitions
└── services/       # External services (Email)
```
