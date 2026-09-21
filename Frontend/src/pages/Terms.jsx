import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Application
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <FileText className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                            <p className="text-slate-400 text-sm">Last updated: September 20, 2026</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Backend-Ledger platform ("Services"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use or access our Services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. User Account Responsibilities</h2>
                        <p>When creating an account on our platform, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Provide accurate, current, and complete registration information.</li>
                            <li>Maintain the security and confidentiality of your credentials (passwords, tokens).</li>
                            <li>Promptly notify us of any unauthorized use or security breach of your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Permitted Use & Conduct</h2>
                        <p>You agree not to engage in any of the following prohibited activities:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Attempting to bypass security mechanisms, rate limiters, or authentication layers.</li>
                            <li>Executing automated scripts, bots, or unauthorized scraping against our API endpoints.</li>
                            <li>Using the service for illegal financial transactions or money laundering.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Service Availability & Modifications</h2>
                        <p>
                            We strive to maintain continuous uptime of the platform; however, we reserve the right to modify, suspend,
                            or discontinue any part of the service at any time for maintenance, upgrades, or security enhancements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by applicable law, Backend-Ledger and its operators shall not be liable for any indirect,
                            incidental, or consequential damages resulting from your access to or inability to access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Governing Law & Contact</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with standard legal principles.
                            For questions regarding these Terms of Service, contact:
                        </p>
                        <p className="font-semibold text-purple-400 mt-2">legal@banking-system-sooty.vercel.app</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
