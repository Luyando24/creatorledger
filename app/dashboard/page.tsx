'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    TrendingUp,
    Loader2,
    LayoutDashboard,
    DollarSign,
    PieChart,
    Briefcase,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';
import OverviewView from './views/OverviewView';
import RevenueView from './views/RevenueView';
import SettingsView from './views/SettingsView';
import { CURRENCIES } from './constants';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('Overview');
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        checkUser();
        // Close sidebar on mobile by default, open on desktop
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            setUser(session.user);
            
            // Fetch user profile/settings
            const { data: profile } = await supabase
                .from('profiles')
                .select('currency')
                .eq('id', session.user.id)
                .single();

            if (profile?.currency) {
                setCurrency(profile.currency);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const updateCurrency = async (newCurrency: string) => {
        try {
            setCurrency(newCurrency);
            
            const { error } = await supabase
                .from('profiles')
                .update({ currency: newCurrency })
                .eq('id', user.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating currency:', error);
            // Revert on error if needed, but for now just log
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
        );
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview' },
        { icon: DollarSign, label: 'Revenue' },
        { icon: PieChart, label: 'Analytics' },
        { icon: Briefcase, label: 'Brand Deals' },
        { icon: Settings, label: 'Settings' },
    ];

    const renderView = () => {
        switch (activeView) {
            case 'Overview':
                return <OverviewView currency={currency} />;
            case 'Revenue':
                return <RevenueView currency={currency} />;
            case 'Settings':
                return <SettingsView />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                            <Settings className="w-8 h-8 text-slate-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
                        <p className="text-slate-400 max-w-md">
                            The {activeView} dashboard is currently under development. 
                            Check back soon for updates!
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">CreatorLedger</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    setActiveView(item.label);
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeView === item.label
                                        ? 'bg-teal-500/10 text-teal-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                <p className="text-xs text-slate-400 truncate">Creator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center flex-1 max-w-xl mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search analytics, deals, or messages..."
                                className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden sm:block">
                            <select
                                value={currency}
                                onChange={(e) => updateCurrency(e.target.value)}
                                className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} ({c.symbol})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}
