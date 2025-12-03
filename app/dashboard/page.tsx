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
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Video
} from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            setUser(session.user);
        } catch (error) {
            console.error('Error checking auth:', error);
            router.push('/login');
        } finally {
            setLoading(false);
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
        { icon: LayoutDashboard, label: 'Overview', active: true },
        { icon: DollarSign, label: 'Revenue', active: false },
        { icon: PieChart, label: 'Analytics', active: false },
        { icon: Briefcase, label: 'Brand Deals', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    const stats = [
        {
            title: 'Total Revenue',
            value: '$12,450',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-emerald-500/20 text-emerald-400'
        },
        {
            title: 'Active Deals',
            value: '8',
            change: '+2',
            trend: 'up',
            icon: Briefcase,
            color: 'bg-blue-500/20 text-blue-400'
        },
        {
            title: 'Total Followers',
            value: '85.2k',
            change: '+5.4%',
            trend: 'up',
            icon: Users,
            color: 'bg-purple-500/20 text-purple-400'
        },
        {
            title: 'Engagement Rate',
            value: '4.8%',
            change: '-0.2%',
            trend: 'down',
            icon: TrendingUp,
            color: 'bg-orange-500/20 text-orange-400'
        }
    ];

    const recentActivity = [
        {
            title: 'New Brand Deal Proposal',
            company: 'TechStart Inc.',
            amount: '$2,500',
            time: '2 hours ago',
            type: 'deal'
        },
        {
            title: 'Payment Received',
            company: 'Fashion Weekly',
            amount: '$1,200',
            time: '5 hours ago',
            type: 'payment'
        },
        {
            title: 'Video Performance Alert',
            company: 'Viral Tech Review',
            amount: '10k views',
            time: '1 day ago',
            type: 'content'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
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
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    item.active
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
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
                            <p className="text-slate-400">Welcome back! Here's what's happening with your content today.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat) => (
                                <div key={stat.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2 rounded-lg ${stat.color}`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <span className={`flex items-center text-xs font-medium ${
                                            stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                            {stat.change}
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="w-3 h-3 ml-1" />
                                            ) : (
                                                <ArrowDownRight className="w-3 h-3 ml-1" />
                                            )}
                                        </span>
                                    </div>
                                    <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Chart Section (Placeholder) */}
                            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
                                    <select className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1">
                                        <option>Last 7 days</option>
                                        <option>Last 30 days</option>
                                        <option>Last year</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-end justify-between gap-2 px-2">
                                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95, 60].map((height, i) => (
                                        <div key={i} className="w-full bg-slate-800 rounded-t-sm relative group hover:bg-teal-500/20 transition-colors">
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-teal-500 rounded-t-sm transition-all duration-500 group-hover:bg-teal-400"
                                                style={{ height: `${height}%` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-xs text-slate-500">
                                    <span>Jan</span>
                                    <span>Feb</span>
                                    <span>Mar</span>
                                    <span>Apr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                    <span>Aug</span>
                                    <span>Sep</span>
                                    <span>Oct</span>
                                    <span>Nov</span>
                                    <span>Dec</span>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
                                <div className="space-y-6">
                                    {recentActivity.map((activity, i) => (
                                        <div key={i} className="flex items-start space-x-4">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${
                                                activity.type === 'deal' ? 'bg-blue-400' :
                                                activity.type === 'payment' ? 'bg-emerald-400' : 'bg-purple-400'
                                            }`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white">{activity.title}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{activity.company}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-white">{activity.amount}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors border border-dashed border-slate-700 hover:border-teal-500/50 rounded-lg">
                                    View All Activity
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
