import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Wallet, History, FileSpreadsheet, Lock, CheckCircle2 } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
            {/* Background Blurs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation Header */}
            <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Backend-Ledger
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                            Terms of Service
                        </Link>

                        {user ? (
                            <Link
                                to="/dashboard"
                                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2"
                            >
                                Dashboard <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2"
                                >
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section: Purpose of Application */}
            <main className="relative z-10">
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
                        <Lock className="w-4 h-4" /> Secure Enterprise Financial Platform
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Welcome to <br />
                        <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                            Backend-Ledger
                        </span>
                    </h1>

                    {/* Purpose Statement for Google Reviewers */}
                    <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-12">
                        <h2 className="text-lg font-semibold text-purple-400 mb-2 uppercase tracking-wider text-xs">
                            Application Purpose Overview
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            <strong>Backend-Ledger</strong> is a full-stack financial application designed to manage digital bank accounts,
                            execute secure money transfers with double-entry ledger verification, prevent double-spending with idempotency protection,
                            and send automated transactional notifications.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all shadow-xl shadow-purple-600/25 flex items-center gap-2"
                        >
                            Create Account <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-lg transition-all"
                        >
                            Sign In to Portal
                        </Link>
                    </div>
                </section>

                {/* Core Application Features Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Core Platform Features</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Built with enterprise security, atomic transaction boundaries, and immutable audit logs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Multi-Account Management</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Create and manage checking and savings accounts with real-time balance calculations derived directly from the Backend-Ledger system.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/50 transition-all group">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                <History className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Atomic Transfers & Idempotency</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Send funds instantly between accounts with strict double-entry verification. Guaranteed idempotency prevents accidental duplicate payments.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all group">
                            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Audit Trails & Notifications</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Automated email receipts for every transaction, system user initial funding, and continuous ledger reconciliation for administrative compliance.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trust & Security Highlights */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
                    <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-8 sm:p-12">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">Security & Compliance Highlights</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                                <span>JWT & HttpOnly cookie-based session protection</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                                <span>Double-entry accounting ledger architecture</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                                <span>Automated transactional notification system</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                                <span>Rate limiting & input schema validation</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer with Google OAuth Required Links */}
            <footer className="border-t border-slate-800 bg-slate-950 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-slate-400 text-sm">
                        © 2026 Backend-Ledger. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <Link to="/privacy" className="text-slate-400 hover:text-purple-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-slate-400 hover:text-purple-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/login" className="text-slate-400 hover:text-purple-400 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="text-slate-400 hover:text-purple-400 transition-colors">
                            Register
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
