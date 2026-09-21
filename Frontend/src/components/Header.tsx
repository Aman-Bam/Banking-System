import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user} = useAuth();

  return (
    <header className="w-full p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
      <span className="text-sm text-slate-300 font-medium">
        {user ? `Welcome, ${user.name}` : 'MyBank Portal'}
      </span>
    </header>
  );
}
