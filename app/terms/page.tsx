import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link 
                        href="/" 
                        className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
                    >
                        CreatorLedger
                    </Link>
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-300 leading-relaxed">
                            By accessing and using CreatorLedger ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="text-slate-300 leading-relaxed">
                            CreatorLedger provides a comprehensive revenue management platform for content creators, including but not limited to revenue tracking, brand deal management, analytics, and financial insights. We reserve the right to modify, suspend or discontinue the Service with or without notice at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Account and Security</h2>
                        <div className="text-slate-300 leading-relaxed space-y-4">
                            <p>
                                To access certain features of the Service, you must register for an account. You agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide accurate, current, and complete information during the registration process.</li>
                                <li>Maintain the security of your password and identification.</li>
                                <li>Maintain and promptly update your registration information.</li>
                                <li>Accept all responsibility for any and all activities that occur under your account.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Payments</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or CreatorLedger cancels it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                        <p className="text-slate-300 leading-relaxed">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of CreatorLedger and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                        <p className="text-slate-300 leading-relaxed">
                            In no event shall CreatorLedger, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                        <p className="text-slate-300 leading-relaxed">
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Governing Law</h2>
                        <p className="text-slate-300 leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
                        <p className="text-slate-300 leading-relaxed">
                            If you have any questions about these Terms, please contact us at:
                            <br />
                            <a href="mailto:legal@creatorledger.com" className="text-teal-400 hover:text-teal-300 transition-colors mt-2 inline-block">
                                legal@creatorledger.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 mt-12 bg-slate-900/50">
                <div className="max-w-4xl mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} CreatorLedger. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
