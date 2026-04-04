# Banking System

A full-stack banking application built with React (Frontend) and Node.js/Express with MongoDB (Backend). The application supports user authentication, secure sessions, banking operations (account management, money transfers), and an advanced double-entry ledger system for auditability and financial consistency.

## 🚀 Features

- **User Authentication**: Secure sign-up, login, logout, and email verification. JWT-based authentication with protected routes.
- **Banking Operations**: View account balances, handle robust ACID money transfers between accounts.
- **Double-Entry Ledger**: Immutable tracking of all credits and debits to ensure consistency.
- **Microservices-ready Architecture**: Clear separation of concerns between client and server. Backed by a MongoDB replica set for transaction support.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Context API for state management, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (running as a replica set via Docker for ACID transaction support) and Mongoose ODM.
- **Containerization**: Docker & Docker Compose (for the database setup).

## 📂 Project Structure

- **`/Backend`**: Contains the Express API server, databases schemas (Mongoose models), and business logic.
- **`/Frontend`**: Contains the React application, UI components, and pages.
- **`PROJECT_STRUCTURE_GUIDE.md`**: Detailed document outlining file-by-file functionality.
- **`CONNECTION_GUIDE.md`**: Guide for handling connection logic.
- **`docker-compose.yml`**: Docker configuration for setting up the MongoDB replica set locally.

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v16+)
- Docker & Docker Compose (Required for the MongoDB Replica Set)

### 1. Start the Database

The application relies on MongoDB transactions (ACID), which requires a MongoDB Replica Set. Start it using Docker:

```bash
docker-compose up -d
```
*Wait a few seconds for the replica set to initialize (`mongo1` container).*

### 2. Setup and Run the Backend

Open a new terminal and navigate to the backend directory:

```bash
cd Backend
npm install
```

Create a `.env` file in the `/Backend` directory with your configuration (such as `MONGO_URI`, `JWT_SECRET`, and `PORT`). Then start the development server:

```bash
npm run dev
```

### 3. Setup and Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend should now be running (usually at http://localhost:5173).

## 📄 Documentation

Check `PROJECT_STRUCTURE_GUIDE.md` and `CONNECTION_GUIDE.md` for more in-depth architectural overviews and technical details about how the frontend and backend interact.
