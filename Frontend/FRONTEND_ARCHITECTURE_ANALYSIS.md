# Frontend Architecture Analysis

## 1. Tech Stack Overview
- **Core:** React 19 + Vite (Build Tool) + TypeScript
- **Styling:** Tailwind CSS (Utility-first framework)
- **Routing:** React Router v7 (`createBrowserRouter`)
- **State Management:** Zustand (Global Auth) + TanStack Query (Server State)

## 2. Communication Layer
**Library:** **Axios**

### Implementation Details:
-   **Instance:** centrally configured in `src/api/axios.js`.
-   **Configuration:**
    -   `baseURL: '/api'` (Proxied in development or relative in production).
    -   `withCredentials: true`: Critical for sending/receiving `httpOnly` cookies for authentication.
-   **Interceptors:**
    -   **Response Interceptor:** global handler for `401 Unauthorized` errors. It dispatches a custom `auth:unauthorized` event to trigger logout/redirects, ensuring token expiration is handled gracefully.

## 3. Authentication Strategy
**Method:** **Cookie-based (httpOnly) + Client-side allow-list**

-   **Token Storage:** The actual JWT (Access Token) is **NOT** stored in LocalStorage. It is stored in an `httpOnly` cookie by the backend, which prevents XSS attacks from stealing the token.
-   **UI State Persistence:** `localStorage` is used via Zustand middleware (`auth-storage`) to persist *non-sensitive* user details (Name, Email, Role) and the `isAuthenticated` boolean flag so the UI remains logged in on refresh.

## 4. Security Implementations

| Feature | Implemented? | Implementation Details |
| :--- | :--- | :--- |
| **Protected Routes** | **YES** | • `PrivateRoute.tsx` wrapper component.<br>• Checks `useAuthStore.isAuthenticated`.<br>• Redirects unauthenticated users to `/login` while preserving the intended destination (`state={{ from: location }}`). |
| **Role-Based Access** | **FOUNDATIONS** | • The `User` interface in `auth.store.ts` includes a `role` field.<br>• *Current Status:* Logic usually exists in specific components or a higher-order component (e.g., `<AdminRoute>`) which filters based on `user.role`. |
| **Token Expiration** | **YES** | • Passive handling via Axios Interceptor.<br>• If the backend returns `401` (token expired), the interceptor catches it. |

## 5. State Management
The application uses a **Hybrid Approach**:

1.  **Global Client State (Zustand):**
    -   Used for **Authentication State** (`user`, `token`, `isAuthenticated`).
    -   Why? Simple, small footprint, easy integration with `localStorage` for persistence.
2.  **Server State (TanStack Query / React Query):**
    -   Used for **Business Data** (Accounts, Transactions, Ledger).
    -   Why? Automatic caching, background refetching, loading/error states (`isLoading`, `error` props), and deduping of requests.
3.  **Local State (useState):**
    -   Used for UI-only state like Modals (`isModalOpen`) and Form inputs.

## 6. Performance Optimizations

1.  **TanStack Query (React Query):**
    -   **Caching:** Prevents redundant API calls. If you visit "Accounts" -> "Dashboard" -> "Accounts", the data is served instantly from cache.
    -   **Stale-while-revalidate:** Keeps UI responsive while updating data in the background.
2.  **Vite:**
    -   Uses ES Modules for lightning-fast HMR (Hot Module Replacement) during development.
3.  **Tailwind CSS:**
    -   Generates minimal CSS bundle by purging unused styles at build time.
