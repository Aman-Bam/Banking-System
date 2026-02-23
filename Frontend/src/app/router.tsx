import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PrivateRoute from '../components/layout/PrivateRoute';
import LoginPage from '../features/auth/login/LoginPage';
import RegisterPage from '../features/auth/register/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import AccountList from '../features/accounts/AccountList';
import AccountDetails from '../features/accounts/AccountDetails';
import TransactionForm from '../features/transactions/TransactionForm';
import LedgerViewer from '../features/ledger/LedgerViewer';
import AuditLog from '../features/audit/AuditLog';
import ErrorBoundary from '../components/ErrorBoundary';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            {
                element: <PrivateRoute />,
                children: [
                    // Dashboard and other protected routes will go here
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'accounts', element: <AccountList /> },
                    { path: 'accounts/:id', element: <AccountDetails /> },
                    { path: 'transfer', element: <TransactionForm /> },
                    { path: 'ledger', element: <LedgerViewer /> },
                    { path: 'audit', element: <AuditLog /> },
                    { index: true, element: <Navigate to="/dashboard" replace /> },
                ]
            },
        ],
    },
]);
