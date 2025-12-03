import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Welcome to CreatorLedger. We respect your privacy and are committed to protecting your personal data. 
                            This privacy policy will inform you as to how we look after your personal data when you visit our website 
                            and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong className="text-white">Identity Data:</strong> includes first name, last name, username or similar identifier.
                                </li>
                                <li>
                                    <strong className="text-white">Contact Data:</strong> includes email address and telephone numbers.
                                </li>
                                <li>
                                    <strong className="text-white">Financial Data:</strong> includes details about your revenue, transactions, and brand deal values that you input into the system.
                                </li>
                                <li>
                                    <strong className="text-white">Social Media Data:</strong> includes public profile information, follower counts, and engagement metrics from connected platforms (Instagram, YouTube, etc.) when you choose to integrate them.
                                </li>
                                <li>
                                    <strong className="text-white">Usage Data:</strong> includes information about how you use our website and services.
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-300">
                            <li>To register you as a new customer.</li>
                            <li>To provide the analytics and dashboard features you request.</li>
                            <li>To manage our relationship with you.</li>
                            <li>To improve our website, products/services, marketing or customer relationships.</li>
                            <li>To comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                        <p className="text-slate-300 leading-relaxed">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Links and Integrations</h2>
                        <p className="text-slate-300 leading-relaxed">
                            This website may include links to third-party websites, plug-ins and applications (such as Instagram, YouTube, Facebook). Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Your Legal Rights</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-300">
                            <li>Request access to your personal data.</li>
                            <li>Request correction of your personal data.</li>
                            <li>Request erasure of your personal data.</li>
                            <li>Object to processing of your personal data.</li>
                            <li>Request restriction of processing your personal data.</li>
                            <li>Request transfer of your personal data.</li>
                            <li>Right to withdraw consent.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
                        <p className="text-slate-300 leading-relaxed">
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            <br />
                            <a href="mailto:support@creatorledger.com" className="text-teal-400 hover:text-teal-300 transition-colors mt-2 inline-block">
                                support@creatorledger.com
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
