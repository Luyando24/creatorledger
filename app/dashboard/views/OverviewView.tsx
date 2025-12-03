import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Briefcase, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CURRENCIES } from '../constants';

interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    status: string;
    created_at: string;
}

export default function OverviewView({ currency }: { currency: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (amount: number) => {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: currency
        });
    };

    // Calculate stats
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const activeDeals = transactions.filter(t => t.status === 'pending').length;

    const stats = [
        {
            title: 'Total Revenue',
            value: formatMoney(totalRevenue),
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-emerald-500/20 text-emerald-400'
        },
        {
            title: 'Active Deals',
            value: activeDeals.toString(),
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

    const recentActivity = transactions.slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Welcome back! Here's what's happening with your content today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                    <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 px-2 overflow-x-auto">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95, 60].map((height, i) => (
                            <div key={i} className="w-full min-w-[20px] bg-slate-800 rounded-t-sm relative group hover:bg-teal-500/20 transition-colors">
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
                        {loading ? (
                            <p className="text-slate-500 text-sm">Loading activity...</p>
                        ) : recentActivity.length === 0 ? (
                            <p className="text-slate-500 text-sm">No recent activity found.</p>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-4">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${
                                        activity.category === 'Brand Deal' ? 'bg-blue-400' :
                                        activity.category === 'Ad Revenue' ? 'bg-emerald-400' : 'bg-purple-400'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{activity.description}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{activity.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-white">{formatMoney(activity.amount)}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors border border-dashed border-slate-700 hover:border-teal-500/50 rounded-lg">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
