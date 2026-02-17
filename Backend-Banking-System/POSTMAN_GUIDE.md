# Postman Guide for Backend Banking System

This file explains how to set up Postman to test the backend API.

## 1. Prerequisites
- **Base URL**: `http://localhost:3000`

## 2. Authentication

### **POST /api/auth/register**
- **URL**: `http://localhost:3000/api/auth/register`
- **Method**: `POST`
- **Body** (raw JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "John Doe"
  }
  ```
- **Response**: Returns the created user and a token.

### **POST /api/auth/login**
- **URL**: `http://localhost:3000/api/auth/login`
- **Method**: `POST`
- **Body** (raw JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**: Copy the `token` string. You'll use this for all other protected requests.

### **POST /api/auth/logout**
- **URL**: `http://localhost:3000/api/auth/logout`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Response**: Clears the cookie and blacklists the token.

---

## 3. Account Management

### **POST /api/accounts** (Create Account)
- **URL**: `http://localhost:3000/api/accounts`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Body** (raw JSON):
  ```json
  {}
  ```
- **Response**: Returns the created account details including `_id`.

### **GET /api/accounts** (Get User Accounts)
- **URL**: `http://localhost:3000/api/accounts`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Response**: Returns a list of accounts belonging to the logged-in user. The `_id` field in the response is your Account ID.

### **GET /api/accounts/balance/:accountId** (Get Account Balance)
- **URL**: `http://localhost:3000/api/accounts/balance/:accountId`
  - Replace `:accountId` with the actual Account ID (e.g., `65c4...`).
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Response**: Returns the current balance of the specified account.

---

## 4. Transactions

### **POST /api/transactions** (Send Money)
- **URL**: `http://localhost:3000/api/transactions`
- **Method**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Body** (raw JSON):
  ```json
  {
    "fromAccount": "YOUR_ACCOUNT_ID",
    "toAccount": "TARGET_ACCOUNT_ID",
    "amount": 100,
    "idempotencyKey": "unique-transaction-id-123"
  }
  ```
  > **Note**: `idempotencyKey` MUST be unique for every new transaction.

### **POST /api/transactions/system/initial-funds** (Admin/System Only)
- **URL**: `http://localhost:3000/api/transactions/system/initial-funds`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer <SYSTEM_USER_TOKEN>`
  > **Note**: The token must belong to a user with `systemUser: true`.
- **Body** (raw JSON):
  ```json
  {
    "toAccount": "TARGET_ACCOUNT_ID",
    "amount": 1000,
    "idempotencyKey": "funding-1"
  }
  ```

---

## 5. Admin

### **GET /api/admin/reconcile/:accountId** (Reconcile Account)
- **URL**: `http://localhost:3000/api/admin/reconcile/:accountId`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer <SYSTEM_USER_TOKEN>`
