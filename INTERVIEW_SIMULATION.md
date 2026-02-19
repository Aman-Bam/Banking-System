# 🎯 Backend Interview Simulation

## 🔹 EASY LEVEL (Fundamentals – Questions)

### 1. Explain the Schema Design
**Question:** "I see you have an `account` model and a `ledger` model. Why did you separate them? Why not just store an array of transactions inside the `account` document?"

**Expected Strong Answer:**
"Storing transactions inside the `account` document would hit the 16MB BSON limit of MongoDB very quickly. Separating them allows the ledger to grow indefinitely. The `account` model acts as a snapshot for quick read access (caching the balance), while the `ledger` provides an immutable audit trail."

**Weak Answer:**
"I just thought it looked cleaner." or "I followed a tutorial."

**Follow-up Trap Question:**
"If `account.balance` is just a cache, what happens if it gets out of sync with the ledger?"
*(Answer: We need a reconciliation tool, which I see you implemented in `reconciliation.controller.js`.)*

---

### 2. Middleware & Auth
**Question:** "In `auth.middleware.js`, you're checking a blacklist. How does that blacklist get populated, and does this approach scale?"

**Expected Strong Answer:**
"The blacklist is populated on logout. It works for this scale, but in a distributed system with millions of users, querying the DB for every request is slow. A better approach would be using Redis with a TTL (Time To Live) equal to the JWT expiration time."

**Weak Answer:**
"It just blocks tokens." (No mention of performance impact).

**Follow-up Trap Question:**
"Why not just delete the token from the client?"
*(Answer: Because the token is still valid until expiry if stolen. Server-side invalidation is required.)*

---

## 🔹 MEDIUM LEVEL (System Design & Logic – Questions)

### 3. The "Floating Point" Trap
**Question:** "I notice `amount` and `balance` are of type `Number`. If I transfer `0.1` and then `0.2`, what is the result?"

**Expected Strong Answer:**
"Ah, that's a problem. JavaScript uses IEEE 754 floating point math. `0.1 + 0.2` equals `0.30000000000000004`. In a real banking app, we should use integers (store cents/paise) or a library like `decimal.js` to ensure precision. My current implementation might have rounding errors."

**Weak Answer:**
"It equals 0.3." (Lack of awareness of floating point issues).

**Follow-up Trap Question:**
"How would you migrate the live database from Floats to Integers without downtime?"

---

### 4. Concurrency & Atomicity
**Question:** "In `transaction.controller.js`, you use `findOneAndUpdate` with `{ balance: { $gte: amount } }`. Why not just read the balance, check it in JS, and then save?"

**Expected Strong Answer:**
"That would cause a Race Condition (Time-of-Check to Time-of-Use). Two requests could read the same balance (e.g., 100), both see they have enough for a 90 transfer, and both write `balance - 90`. The Atomic Operator pushes the condition into the database engine, ensuring only one succeeds."

**Weak Answer:**
"It's faster this way."

**Follow-up Trap Question:**
"You are already inside a Transaction (`session`). Doesn't `session` prevent this race condition?"
*(Answer: It depends on the Isolation Level. MongoDB's default snapshot isolation *might* allow write conflicts, but the atomic operator is the safest guard regardless of isolation level.)*

---

### 5. Idempotency Race Condition
**Question:** "Look at `executeTransaction`. You check `transactionModel.findOne` *before* starting the session. Is it possible for two requests to pass that check simultaneously?"

**Expected Strong Answer:**
"Yes, it is a race condition. Both could check, find nothing, and proceed to `startSession`. However, inside the transaction, the `transactionModel.create` call relies on the unique index `idempotencyKey_1`. The second one would fail with `E11000 duplicate key error`. My retry logic or error handler needs to catch that specifically and return the existing transaction instead of a 500 error."

**Weak Answer:**
"No, `await` makes it run one by one." (Incorrect understanding of Node.js concurrency).

---

## 🔹 HARD LEVEL (Senior-Level Challenges – Questions)

### 6. Distributed Failure Modes
**Question:** "Imagine the `commitTransaction` succeeds, but the server crashes *before* sending the response to the user. The user sees a timeout. They hit 'Retry'. What happens?"

**Expected Strong Answer:**
"The user sends the same `idempotencyKey`. My code checks `transactionModel.findOne` at the start. It sees the transaction exists and is `COMPLETED`. It returns the 200 OK + Transaction details immediately. The user gets confirmation without double-spending. This is why the Idempotency Key must come from the client."

**Weak Answer:**
"They usually don't retry." or "The database rolls back?" (No, commit happened).

**How I Would Challenge You Further:**
"What if the User Interface generates a *new* idempotency key on retry? How do we prevent that?"

### 7. Ledger Scaling
**Question:** "Your `ledger` table grows by 2 rows for every transaction. In 5 years, you have 5 billion rows. `aggregate` for reconciliation becomes too slow. What do you do?"

**Expected Strong Answer:**
"We would need **Partitioning** or **Sharding** (likely by `account_id` or `time`). We could also implement 'Snapshotting': every month, we calculate the rigid balance, store it in a `BalanceSnapshot` table, and archive older ledger entries to cold storage (S3/Data Lake). Reconciliation then only sums from the last snapshot."

**How This Might Fail in Production:**
Index size exceeds RAM -> Performance falls off a cliff.

### 8. The Email "Outbox" Pattern
**Question:** "You send the email *after* the transaction commits, but without `await`. If the email server is down, the user never knows. If you `await` it inside the transaction, the transaction is slow. How do you fix this?"

**Expected Strong Answer:**
"I should use the **Transactional Outbox Pattern**. I would write an event `EmailSendPending` to a collection *inside* the MongoDB transaction. Then, a separate worker process picks up that event and sends the email. If it fails, the worker retries. This guarantees that if Money Moves -> Email Sent."

---

## 🔹 ARCHITECTURE CRITIQUE

### ✅ What Impresses a Senior Engineer
*   **MongoDB Transactions**: Correct use of `startSession`, `startTransaction`, and `commitTransaction`.
*   **Atomic Accounting**: using `$inc` and `$gte` is the gold standard for high-concurrency balance updates.
*   **Idempotency**: explicitly handling it with unique keys and checks (even with the slight race, the logic is sound).
*   **Reconciliation**: The fact that you even *have* a reconciliation controller puts you ahead of 90% of juniors.
*   **Immutable Ledger**: Using `immutable: true` and pre-save hooks to prevent tampering is excellent security depth.

### ⚠️ What Would Block Hiring (Must Fix)
*   **Floating Point Math**: `Number` type for money is dangerous. Use **Integer** (cents) or a Decimal library.
*   **Error Handling in Idempotency**: The `E11000` duplicate key error might cause a 500 loop instead of cleanly returning the existing transaction if the race condition hits.
*   **Hardcoded Currency**: `INR` default is fine for MVP, but system design implies scalability.

### ℹ️ Code Smells / Minor Issues
*   `console.log` vs `logger`: Make sure you are consistent (I saw `logger`, which is good).
*   **Magic Strings**: Status enums ("PENDING", "COMPLETED") are strings. Should be constants (`TransactionStatus.PENDING`).
*   **System Account Logic**: `createInitialFundsTransaction` implies the system account can go negative indefinitely. You need a "Minting" concept or a "Central Bank" account that is exempt from balance checks, rather than just "hoping" it exists.

---

## 🔹 FINAL VERDICT

*   **Junior Level Ready?** **YES**. (Overqualified).
*   **Mid-Level Ready?** **YES**. (Strong understanding of DB transactions and async logic).
*   **Senior Level Ready?** **ALMOST**. (Needs better distributed patterns like Outbox, clearer handling of the float math issue, and more rigorous error classification).

### 🚀 Hiring Confidence Score: 8.5 / 10
*If you fix the Floating Point issue and explain the Outbox pattern in an interview, this is a hire.*
