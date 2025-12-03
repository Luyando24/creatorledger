import { useState, useEffect } from 'react';
import { DollarSign, Plus, Filter, Download, TrendingUp, Calendar, Pencil, Trash2 } from 'lucide-react';
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

export default function RevenueView({ currency }: { currency: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'Brand Deal',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
    });

    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    const formatMoney = (amount: number) => {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: currency
        });
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (transaction?: Transaction) => {
        if (transaction) {
            setEditingId(transaction.id);
            setFormData({
                amount: transaction.amount.toString(),
                description: transaction.description,
                category: transaction.category,
                date: transaction.date,
                status: transaction.status
            });
        } else {
            setEditingId(null);
            setFormData({
                amount: '',
                description: '',
                category: 'Brand Deal',
                date: new Date().toISOString().split('T')[0],
                status: 'completed'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const transactionData = {
                user_id: user.id,
                amount: parseFloat(formData.amount),
                description: formData.description,
                category: formData.category,
                date: formData.date,
                status: formData.status
            };

            if (editingId) {
                const { error } = await supabase
                    .from('transactions')
                    .update(transactionData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('transactions')
                    .insert([transactionData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchTransactions();
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyRevenue = transactions
        .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Revenue Management</h1>
                    <p className="text-slate-400">Track your earnings and manage financial records.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </button>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatMoney(totalRevenue)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">This Month</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatMoney(monthlyRevenue)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Average Deal</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {transactions.length > 0 
                            ? formatMoney(totalRevenue / transactions.length)
                            : formatMoney(0)}
                    </p>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading transactions...</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transactions found. Add one to get started!</td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-300 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-white font-medium text-sm">{t.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                t.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                                {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-white font-medium text-sm">
                                            {formatMoney(t.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(t)}
                                                    className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                    placeholder="e.g. Nike Brand Deal"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Amount ({symbol})</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                    >
                                        <option value="Brand Deal">Brand Deal</option>
                                        <option value="Ad Revenue">Ad Revenue</option>
                                        <option value="Affiliate">Affiliate</option>
                                        <option value="Digital Product">Digital Product</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    {editingId ? 'Save Changes' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
