'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    TrendingUp,
    Zap,
    DollarSign,
    BarChart3,
    Brain,
    Shield,
    CheckCircle,
    ArrowRight,
    Star,
    Calendar,
    Home,
    User
} from 'lucide-react';

export default function HomePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">CreatorLedger</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#features" className="text-slate-300 hover:text-white transition">Features</Link>
                            <Link href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</Link>
                            <Link href="#testimonials" className="text-slate-300 hover:text-white transition">Testimonials</Link>
                            
                            {user ? (
                                <Link href="/dashboard" className="px-5 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center gap-2">
                                    My Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <Link href="/signup" className="px-5 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                                    Get Started Free
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-20"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8">
                            <Zap className="w-4 h-4 text-primary-400" />
                            <span className="text-sm text-primary-300">Trusted by 10,000+ creators worldwide</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Your Creator Business,
                            <br />
                            <span className="gradient-text">All In One Place</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
                            Stop juggling multiple platforms. Track revenue, manage brand deals, automate invoicing,
                            and get AI-powered insights—all from one beautiful dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link href="/signup" className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold text-lg hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center gap-2">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link 
                                href="https://calendly.com/" 
                                target="_blank"
                                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition flex items-center gap-2"
                            >
                                <Calendar className="w-5 h-5" />
                                Book Demo
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image Placeholder */}
                    <div className="mt-16 relative">
                        <div className="glass rounded-2xl p-8 shadow-2xl float">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl h-96 flex items-center justify-center border border-white/10">
                                <div className="text-center">
                                    <BarChart3 className="w-24 h-24 text-primary-400 mx-auto mb-4" />
                                    <p className="text-slate-400">Dashboard Preview Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Everything You Need to
                            <span className="gradient-text"> Grow Your Creator Business</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Built specifically for content creators, influencers, and digital entrepreneurs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass rounded-xl p-8 hover:shadow-2xl hover:shadow-primary-500/20 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Multi-Platform Revenue Tracking</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Connect YouTube, TikTok, Instagram, Twitch, and more. See all your earnings in one unified dashboard.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass rounded-xl p-8 hover:shadow-2xl hover:shadow-accent-500/20 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Brand Deal Manager</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Track sponsorships, manage contracts, automate invoicing, and never miss a payment deadline.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass rounded-xl p-8 hover:shadow-2xl hover:shadow-primary-500/20 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Insights</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Get revenue predictions, content recommendations, and smart analytics powered by advanced AI.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="glass rounded-xl p-8 hover:shadow-2xl hover:shadow-accent-500/20 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                <BarChart3 className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Expense & Tax Tracking</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Categorize expenses, upload receipts, and export tax-ready reports with AI categorization.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="glass rounded-xl p-8 hover:shadow-2xl hover:shadow-primary-500/20 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Revenue Forecasting</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Predict next month's income, understand seasonality, and plan your finances like a pro.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="glass rounded-xl p-8 hover:shadow-2xl hover:shadow-accent-500/20 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Multi-Currency Support</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Work globally with support for USD, EUR, GBP, ZAR, NGN, ZMW and 100+ currencies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-2xl p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
                                <div className="text-slate-400">Active Creators</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">$50M+</div>
                                <div className="text-slate-400">Revenue Tracked</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">25+</div>
                                <div className="text-slate-400">Platforms Supported</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
                                <div className="text-slate-400">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Loved by
                            <span className="gradient-text"> Creators Worldwide</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass rounded-xl p-8">
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 mb-6 italic">
                                    "CreatorLedger transformed how I manage my creator business. I finally have clarity on my finances and can focus on creating content."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full"></div>
                                    <div>
                                        <div className="text-white font-semibold">Sarah Johnson</div>
                                        <div className="text-slate-400 text-sm">YouTube Creator, 500K subs</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Simple, Transparent
                            <span className="gradient-text"> Pricing</span>
                        </h2>
                        <p className="text-xl text-slate-400">Start free, upgrade as you grow</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <div className="glass rounded-2xl p-8 hover:shadow-2xl hover:shadow-white/10 transition">
                            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-slate-400">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Up to 3 platforms</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Basic revenue tracking</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">5 brand deals</span>
                                </li>
                            </ul>
                            <Link href="/signup" className="block w-full py-3 bg-white/10 text-white rounded-lg font-semibold text-center hover:bg-white/20 transition">
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="glass rounded-2xl p-8 ring-2 ring-primary-500 hover:shadow-2xl hover:shadow-primary-500/30 transition relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold rounded-full">
                                Most Popular
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$29</span>
                                <span className="text-slate-400">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Unlimited platforms</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Advanced analytics</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Unlimited brand deals</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">AI insights</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Tax reporting</span>
                                </li>
                            </ul>
                            <Link href="/signup" className="block w-full py-3 bg-primary-500 text-white rounded-lg font-semibold text-center hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="glass rounded-2xl p-8 hover:shadow-2xl hover:shadow-white/10 transition">
                            <h3 className="text-2xl font-bold text-white mb-2">Agency</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$99</span>
                                <span className="text-slate-400">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Everything in Pro</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Up to 10 team members</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">White-label reports</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">Priority support</span>
                                </li>
                            </ul>
                            <Link href="/contact" className="block w-full py-3 bg-white/10 text-white rounded-lg font-semibold text-center hover:bg-white/20 transition">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-2xl p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 animated-gradient opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Ready to Take Control of Your Creator Business?
                            </h2>
                            <p className="text-xl text-slate-300 mb-8">
                                Join thousands of creators who have streamlined their finances with CreatorLedger
                            </p>
                            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold text-lg hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all">
                                Start Your Free Trial
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 pb-28 md:pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">CreatorLedger</span>
                            </div>
                            <p className="text-slate-400">
                                The ultimate revenue management platform for content creators.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="#features" className="text-slate-400 hover:text-white transition">Features</Link></li>
                                <li><Link href="#pricing" className="text-slate-400 hover:text-white transition">Pricing</Link></li>
                                <li><Link href="/integrations" className="text-slate-400 hover:text-white transition">Integrations</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-slate-400 hover:text-white transition">About</Link></li>
                                <li><Link href="/blog" className="text-slate-400 hover:text-white transition">Blog</Link></li>
                                <li><Link href="/careers" className="text-slate-400 hover:text-white transition">Careers</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition">Privacy</Link></li>
                                <li><Link href="/terms" className="text-slate-400 hover:text-white transition">Terms</Link></li>
                                <li><Link href="/contact" className="text-slate-400 hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-slate-400">
                        <p>&copy; 2025 CreatorLedger. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-3 pb-6">
                <div className="flex justify-between items-center">
                    <Link href="#" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-white transition-colors">
                        <Home className="w-6 h-6" />
                        <span className="text-xs font-medium">Home</span>
                    </Link>
                    <Link href="#features" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-white transition-colors">
                        <Zap className="w-6 h-6" />
                        <span className="text-xs font-medium">Features</span>
                    </Link>
                    <Link href="#pricing" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-white transition-colors">
                        <DollarSign className="w-6 h-6" />
                        <span className="text-xs font-medium">Pricing</span>
                    </Link>
                    <Link href={user ? "/dashboard" : "/signup"} className="flex flex-col items-center space-y-1 text-primary-400 hover:text-primary-300 transition-colors">
                        <User className="w-6 h-6" />
                        <span className="text-xs font-medium">{user ? "Dashboard" : "Sign Up"}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
