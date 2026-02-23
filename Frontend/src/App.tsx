import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import AccountList from './features/accounts/AccountList';
import TransactionForm from './features/transactions/TransactionForm';
import LedgerViewer from './features/ledger/LedgerViewer';
import AuditLog from './features/audit/AuditLog';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/transfer" element={<TransactionForm />} />
            <Route path="/ledger" element={<LedgerViewer />} />
            <Route path="/audit" element={<AuditLog />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
