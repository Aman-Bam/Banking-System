import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ArrowRight, Wallet, History, FileSpreadsheet, Lock, CheckCircle2, Server, Database, Code, Cpu } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation Bar */}
            <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Backend-Ledger
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Home
                        </Link>
                        <Link to="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                            Terms of Service
                        </Link>
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
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                        <Lock className="w-4 h-4" /> Application Purpose & Technical Overview
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                        About <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Backend-Ledger</span>
                    </h1>
                    <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                        An enterprise-grade, full-stack financial ledger and banking application engineered to ensure high transaction integrity, double-entry accounting compliance, and secure user management.
                    </p>
                </div>

                {/* Core Purpose Statement */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                            <Cpu className="w-6 h-6" />
                        </div>
                        Why Was This Application Built?
                    </h2>
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                        Financial systems require absolute data integrity, zero silent failures, and strict auditability. <strong>Backend-Ledger</strong> was designed to serve as a reference implementation for high-integrity banking infrastructure.
                    </p>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Whether managing multi-currency user balances, executing atomic transfers, or preventing double-spending via idempotency headers, every layer of this system prioritizes financial correctness ($Sum(Debits) = Sum(Credits)$).
                    </p>
                </div>

                {/* Key System Capabilities */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Key Platform Pillars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-5">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Double-Entry Accounting</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Money is never created or destroyed arbitrarily. Every transfer generates balanced debit and credit ledger pairs in MongoDB sessions.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition-all">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-5">
                                <History className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Idempotency Protection</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Prevents duplicate payments caused by network retries or fast double-clicking by tracking unique idempotency keys per transaction request.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-all">
                            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-5">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">OAuth2 & Email Service</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Google Authentication (GAuth) for secure login combined with automated Nodemailer email notifications for instant transaction receipts.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Breakdown */}
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 mb-16 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                        <Code className="w-6 h-6 text-purple-400" /> Technology Architecture
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Frontend */}
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                                    <Code className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Frontend Architecture</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span><strong>React 18 & TypeScript:</strong> Type-safe UI components</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span><strong>Vite:</strong> Ultra-fast build tool & dev server</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span><strong>Tailwind CSS & Lucide:</strong> Modern dark glassmorphism design system</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span><strong>State & Query Management:</strong> Context API, Zustand & React Query</span>
                                </li>
                            </ul>
                        </div>

                        {/* Backend */}
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                                    <Server className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Backend Infrastructure</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span><strong>Node.js & Express:</strong> Scalable RESTful API middleware architecture</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span><strong>MongoDB Atlas & Mongoose:</strong> Document database with schemas & sessions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span><strong>Security:</strong> Google OAuth2, JWT with MongoDB TTL blacklisting, Zod schema validation</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span><strong>Logging & Alerts:</strong> Winston logger & Nodemailer notifications</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* System Guarantees & Invariants */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">System Guarantees & Safety Standards</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-1">Non-Negative Balances</strong>
                                <span className="text-slate-400 text-sm">Account balances are validated at transaction boundaries to strictly prevent negative funds.</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-1">Token TTL Blacklisting</strong>
                                <span className="text-slate-400 text-sm">Logging out immediately invalidates JWTs via MongoDB automatic TTL expiration collections.</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-1">Audit Trail Transparency</strong>
                                <span className="text-slate-400 text-sm">Full administrative reconciliation endpoints to cross-check account balances against ledger histories.</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-1">API Rate Limiting</strong>
                                <span className="text-slate-400 text-sm">Express rate limiting protects financial endpoints against automated abuse and DDoS attempts.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-10 shadow-2xl">
                    <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Explore the Platform?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Experience atomic transfers, real-time double-entry ledgers, and seamless authentication today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-base transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2"
                        >
                            Get Started Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-slate-400 text-sm">
                        © 2026 Backend-Ledger. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <Link to="/about" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                            About App
                        </Link>
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

export default About;
