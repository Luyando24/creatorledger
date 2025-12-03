import { useState, useEffect } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CURRENCIES } from '../constants';

interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    status: string;
}

interface AnalyticsViewProps {
    currency: string;
}

const COLORS = ['#14b8a6', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#6366f1'];

export default function AnalyticsView({ currency }: AnalyticsViewProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('6m'); // 6m, 1y, all

    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('status', 'completed') // Only count completed transactions for analytics
                .order('date', { ascending: true });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (amount: number) => {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Process Data for Charts

    // 1. Monthly Revenue Trend
    const getMonthlyData = () => {
        const monthlyData: Record<string, number> = {};
        
        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // e.g. "Jan 24"
            monthlyData[key] = (monthlyData[key] || 0) + t.amount;
        });

        // Sort chronologically (simple approach for now, assuming transactions came in sorted or re-sort keys)
        // Since we ordered by date in SQL, we can just iterate, but aggregation might mess up order if not careful.
        // Better approach: Create a map of YYYY-MM to ensure sorting, then format for display.
        
        const sortedKeys = Object.keys(monthlyData).sort((a, b) => {
            // Parse "Jan 24" back to date for sorting is tricky without context, 
            // let's use the raw date for aggregation first.
            return 0; // Placeholder, we'll implement a better aggregation below
        });

        // Re-implementation of aggregation for proper sorting
        const agg = transactions.reduce((acc, t) => {
            const d = new Date(t.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
            acc[key] = (acc[key] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        const sortedAgg = Object.entries(agg).sort((a, b) => a[0].localeCompare(b[0]));

        // Filter based on timeRange (simple slice for now)
        let filtered = sortedAgg;
        if (timeRange === '6m') filtered = sortedAgg.slice(-6);
        if (timeRange === '1y') filtered = sortedAgg.slice(-12);

        return filtered.map(([key, value]) => {
            const [year, month] = key.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return {
                name: date.toLocaleString('default', { month: 'short' }),
                fullDate: key,
                revenue: value
            };
        });
    };

    // 2. Category Distribution
    const getCategoryData = () => {
        const catData: Record<string, number> = {};
        transactions.forEach(t => {
            catData[t.category] = (catData[t.category] || 0) + t.amount;
        });

        return Object.entries(catData)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    };

    const monthlyData = getMonthlyData();
    const categoryData = getCategoryData();

    // 3. Summary Stats
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avgMonthlyRevenue = monthlyData.length > 0 
        ? totalRevenue / (Object.keys(transactions.reduce((acc, t) => {
            const d = new Date(t.date);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>)).length || 1)
        : 0;
    
    const topCategory = categoryData.length > 0 ? categoryData[0].name : 'N/A';

    // Calculate growth (Last month vs Month before)
    const calculateGrowth = () => {
        if (monthlyData.length < 2) return 0;
        const lastMonth = monthlyData[monthlyData.length - 1].revenue;
        const prevMonth = monthlyData[monthlyData.length - 2].revenue;
        if (prevMonth === 0) return 100;
        return ((lastMonth - prevMonth) / prevMonth) * 100;
    };
    const growthRate = calculateGrowth();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-slate-400">Deep dive into your revenue streams and performance metrics.</p>
                </div>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                    {['6m', '1y', 'all'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                timeRange === range
                                    ? 'bg-teal-500 text-white'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {range === '6m' ? '6 Months' : range === '1y' ? '1 Year' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatMoney(totalRevenue)}</p>
                    <p className="text-xs text-slate-500 mt-1">Lifetime earnings</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Avg. Monthly</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatMoney(avgMonthlyRevenue)}</p>
                    <p className="text-xs text-slate-500 mt-1">Based on active months</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <PieChartIcon className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Top Source</span>
                    </div>
                    <p className="text-2xl font-bold text-white truncate">{topCategory}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        {categoryData.length > 0 ? `${Math.round((categoryData[0].value / totalRevenue) * 100)}% of total revenue` : 'No data'}
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">MoM Growth</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-white">{Math.abs(growthRate).toFixed(1)}%</p>
                        {growthRate >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">vs previous month</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `${symbol}${value/1000}k`} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number) => [formatMoney(value), 'Revenue']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#14b8a6" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Revenue by Category</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    formatter={(value: number) => formatMoney(value)}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    content={({ payload }) => (
                                        <ul className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 mt-4">
                                            {payload?.map((entry, index) => (
                                                <li key={`item-${index}`} className="flex items-center gap-2">
                                                    <div 
                                                        className="w-2 h-2 rounded-full" 
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    {entry.value}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-12">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Total</p>
                                <p className="text-lg font-bold text-white">{formatMoney(totalRevenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components for Recharts (Needs to be imported if used, but I used AreaChart in code but imported BarChart/LineChart in header. Let me fix imports in the actual file write)
