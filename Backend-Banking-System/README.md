# Professional Financial Ledger System

## Core Architecture & Invariants

This system implements a rigorous double-entry ledger with strict concurrency controls and auditability.

### 🔒 System Invariants (Formal Definitions)

1.  **Non-Negative Balance**:
    - `∀ account ∈ Accounts : account.balance ≥ 0`
    - Enforced by atomic MongoDB update condition: `{ balance: { $gte: amount } }`.

2.  **Double-Entry Integrity**:
    - `∀ transaction ∈ Transactions : Σ(Ledger.Debit) == Σ(Ledger.Credit)`
    - Every transaction creates exactly one DEBIT and one CREDIT ledger entry of equal amount.

3.  **Audit Consistency**:
    - `Account.balance ≡ Σ(Ledger.Credit where account=A) - Σ(Ledger.Debit where account=A)`
    - The stored balance is an optimization; the ledger is the immutable source of truth.
    - Drift detection is available via `/api/admin/reconcile/:accountId`.

4.  **Idempotency**:
    - `UniqueIndex({ idempotencyKey: 1, fromAccount: 1 })`
    - Ensures exactly one successful transaction execution per client request key.

### 🛡️ Transaction Isolation

We explicitly use **Snapshot Isolation** to prevent phantom reads and write skew.

-   **Read Concern**: `snapshot` (Reads consistent data at transaction start time).
-   **Write Concern**: `majority` (Acknowledged by majority of voting nodes).

### 🧪 Verification

Run the comprehensive test suite, including double-spend simulations:

```bash
npm test tests/transaction.test.js
```

### 🚨 Drift Detection

In the event of a system failure or manual database intervention, use the reconciliation endpoint to detect state drift:

```http
GET /api/admin/reconcile/:accountId
```

If `isSynchronized` is `false`, a critical alert is logged.
