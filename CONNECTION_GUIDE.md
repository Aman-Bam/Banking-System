# Connecting Frontend and Backend

This guide explains how the React Frontend and Express Backend are connected in this project.

## 1. Project Structure

- **Backend**: Listens on port `3000` (default).
- **Frontend**: Runs on port `5173` (default) via Vite.

## 2. Backend Configuration (CORS)

The backend must allow requests from the frontend origin. We use the `cors` middleware in `src/app.js`.

```javascript
// Backend-Banking-System/src/app.js
const cors = require("cors")

app.use(cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true // Allow cookies/headers
}))
```

> **Note**: If your frontend runs on a different port (e.g., `5174`), you must update this origin setting in `src/app.js`.

## 3. Frontend Configuration (Proxy)

To avoid CORS issues during development and simplify API calls, the frontend proxies API requests to the backend.

```javascript
// Frontend-Banking-System/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

This means any request to `http://localhost:5173/api/...` is automatically forwarded to `http://localhost:3000/api/...`.

## 4. API Client (Axios)

The frontend uses `axios` for HTTP requests, configured with a base URL relative to the current origin.

```javascript
// Frontend-Banking-System/src/api/axios.js
const api = axios.create({
    baseURL: '/api', // Uses the proxy defined in vite.config.js
    withCredentials: true,
});
```

All API calls in the frontend simply use `/auth/login`, `/accounts`, etc., and the proxy handles the routing to the backend.

## 5. How to Run

1.  **Start Backend**:
    ```bash
    cd Backend-Banking-System
    npm run dev
    # Server runs on port 3000
    ```

2.  **Start Frontend**:
    ```bash
    cd Frontend-Banking-System
    npm run dev
    # Server runs on port 5173
    ```

## Troubleshooting

-   **Port Mismatch**: If the frontend starts on a different port (e.g., `5174` because `5173` is in use), you must update the CORS origin in `Backend-Banking-System/src/app.js` to match the new port.
-   **Backend Not Reachable**: Ensure the backend is running on port `3000`. If it changes, update the target in `vite.config.js`.
