import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Application
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <ShieldCheck className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                            <p className="text-slate-400 text-sm">Last updated: September 20, 2026</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                        <p>
                            Welcome to Backend-Ledger ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal data.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
                        <p>We may collect personal identification information from you in a variety of ways, including:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong className="text-slate-200">Personal Information:</strong> Name, email address, phone number, and account authentication details.</li>
                            <li><strong className="text-slate-200">Financial Data:</strong> Account balances, transaction history, ledger logs, and transfer activity.</li>
                            <li><strong className="text-slate-200">Technical Data:</strong> IP address, browser type, operating system, and login session tokens.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>To process transactions, transfers, and maintain system ledgers securely.</li>
                            <li>To authenticate user logins and send automated transactional or welcome notifications.</li>
                            <li>To prevent fraudulent activities, system abuse, and enforce security compliance.</li>
                            <li>To improve system performance, UI responsiveness, and user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Information Sharing and Disclosure</h2>
                        <p>
                            We do not sell, trade, or rent your personal identification information to third parties. We may share information only:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>To comply with legal obligations or valid governmental requests.</li>
                            <li>With essential service providers (e.g., email notification systems, cloud database hosts) bound by strict confidentiality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures including SSL/TLS encryption, JWT authentication,
                            hashed passwords (bcrypt), and secured HTTP-only cookies to protect your personal information against unauthorized access.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights & Contact Information</h2>
                        <p>
                            You have the right to access, update, or request deletion of your personal data.
                            If you have questions regarding this Privacy Policy, please contact our support team at:
                        </p>
                        <p className="font-semibold text-purple-400 mt-2">support@banking-system-sooty.vercel.app</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
