import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
      <span className="text-sm text-slate-300 font-medium">
        {user ? `Welcome, ${user.name}` : 'NeoBank Portal'}
      </span>
      {user && (
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      )}
    </header>
  );
}
