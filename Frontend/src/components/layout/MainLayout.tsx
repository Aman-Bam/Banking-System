import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import {
    LayoutDashboard,
    CreditCard,
    ArrowRightLeft,
    BookOpen,
    ShieldCheck,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
    const { isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // If not authenticated and not on login/register pages (which use MainLayout in the router config currently), 
    // we might want a different layout or just show nothing.
    // However, the router handles redirection via PrivateRoute. 
    // But strictly speaking, the Sidebar only makes sense for authenticated users.
    // For simplicity, if not authenticated, we just render Outlet (which will be Login/Register).
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

    if (!isAuthenticated && isAuthPage) {
        return <div className="min-h-screen bg-gray-50 text-gray-900 font-sans"><Outlet /></div>;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/accounts', label: 'Accounts', icon: CreditCard },
        { to: '/transfer', label: 'Transfer', icon: ArrowRightLeft },
        { to: '/ledger', label: 'Ledger', icon: BookOpen },
        { to: '/audit', label: 'Audit', icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 transform transition-transform duration-200 ease-in-out z-40 lg:translate-x-0 lg:static lg:h-screen ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                B
                            </div>
                            <span className="text-xl font-bold text-gray-900">BankSystem</span>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto h-screen">
                <Outlet />
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
