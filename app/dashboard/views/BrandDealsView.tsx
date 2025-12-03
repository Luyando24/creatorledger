import { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Calendar, 
    DollarSign, 
    User, 
    Mail, 
    CheckCircle2, 
    Clock, 
    XCircle,
    MessageCircle,
    FileText,
    Pencil,
    Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CURRENCIES } from '../constants';

interface BrandDeal {
    id: string;
    brand_name: string;
    contact_person: string;
    contact_email: string;
    deal_value: number;
    status: string;
    deliverables: string;
    deadline: string;
    currency: string;
}

interface BrandDealsViewProps {
    currency: string;
}

const STATUSES = {
    pitching: { label: 'Pitching', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: MessageCircle },
    negotiating: { label: 'Negotiating', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: User },
    contract_sent: { label: 'Contract Sent', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: FileText },
    signed: { label: 'Signed', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', icon: CheckCircle2 },
    in_progress: { label: 'In Progress', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: Clock },
    completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: XCircle },
};

export default function BrandDealsView({ currency }: BrandDealsViewProps) {
    const [deals, setDeals] = useState<BrandDeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        brand_name: '',
        contact_person: '',
        contact_email: '',
        deal_value: '',
        status: 'pitching',
        deliverables: '',
        deadline: '',
        currency: currency
    });

    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    useEffect(() => {
        fetchDeals();
    }, []);

    // Update form currency when global currency changes, only if adding new
    useEffect(() => {
        if (!editingId) {
            setFormData(prev => ({ ...prev, currency: currency }));
        }
    }, [currency, editingId]);

    const fetchDeals = async () => {
        try {
            const { data, error } = await supabase
                .from('brand_deals')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setDeals(data || []);
        } catch (error) {
            console.error('Error fetching deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (deal?: BrandDeal) => {
        if (deal) {
            setEditingId(deal.id);
            setFormData({
                brand_name: deal.brand_name,
                contact_person: deal.contact_person || '',
                contact_email: deal.contact_email || '',
                deal_value: deal.deal_value.toString(),
                status: deal.status,
                deliverables: deal.deliverables || '',
                deadline: deal.deadline || '',
                currency: deal.currency || currency
            });
        } else {
            setEditingId(null);
            setFormData({
                brand_name: '',
                contact_person: '',
                contact_email: '',
                deal_value: '',
                status: 'pitching',
                deliverables: '',
                deadline: '',
                currency: currency
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const dealData = {
                user_id: user.id,
                brand_name: formData.brand_name,
                contact_person: formData.contact_person,
                contact_email: formData.contact_email,
                deal_value: parseFloat(formData.deal_value) || 0,
                status: formData.status,
                deliverables: formData.deliverables,
                deadline: formData.deadline || null,
                currency: formData.currency,
                updated_at: new Date().toISOString()
            };

            if (editingId) {
                const { error } = await supabase
                    .from('brand_deals')
                    .update(dealData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('brand_deals')
                    .insert([dealData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchDeals();
        } catch (error) {
            console.error('Error saving deal:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this deal?')) return;
        
        try {
            const { error } = await supabase
                .from('brand_deals')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchDeals();
        } catch (error) {
            console.error('Error deleting deal:', error);
        }
    };

    const formatMoney = (amount: number, dealCurrency: string) => {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: dealCurrency
        });
    };

    const getStatusStyle = (status: string) => {
        return STATUSES[status as keyof typeof STATUSES] || STATUSES.pitching;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Brand Deals</h1>
                    <p className="text-slate-400">Manage your partnerships and sponsorships pipeline.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    New Deal
                </button>
            </div>

            {/* Pipeline Summary (Optional - maybe later) */}
            
            {/* Deals Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">Loading deals...</p>
                </div>
            ) : deals.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No deals yet</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">Start tracking your brand partnerships by adding your first deal.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Add Your First Deal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deals.map((deal) => {
                        const statusStyle = getStatusStyle(deal.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                            <div key={deal.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusStyle.color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusStyle.label}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenModal(deal)}
                                            className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(deal.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{deal.brand_name}</h3>
                                <div className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                    {formatMoney(deal.deal_value, deal.currency)}
                                </div>

                                <div className="space-y-3 text-sm">
                                    {deal.contact_person && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span>{deal.contact_person}</span>
                                        </div>
                                    )}
                                    {deal.deadline && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span>Due {new Date(deal.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {deal.deliverables && (
                                        <div className="pt-3 border-t border-slate-800 mt-3">
                                            <p className="text-slate-500 text-xs uppercase font-medium mb-1">Deliverables</p>
                                            <p className="text-slate-300 line-clamp-2">{deal.deliverables}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl my-8 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 rounded-t-xl z-10">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Deal' : 'New Brand Deal'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Brand Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.brand_name}
                                            onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                            placeholder="e.g. Nike"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Deal Value</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={formData.deal_value}
                                                onChange={(e) => setFormData({...formData, deal_value: e.target.value})}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <select
                                                    value={formData.currency}
                                                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                                                    className="bg-slate-700 text-white text-xs rounded px-1 py-0.5 border-none focus:ring-0"
                                                >
                                                    {CURRENCIES.map(c => (
                                                        <option key={c.code} value={c.code}>{c.code}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                        >
                                            {Object.entries(STATUSES).map(([key, value]) => (
                                                <option key={key} value={key}>{value.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Deadline</label>
                                        <input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formData.contact_person}
                                            onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                            placeholder="Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                                            placeholder="email@brand.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Deliverables</label>
                                        <textarea
                                            rows={4}
                                            value={formData.deliverables}
                                            onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 resize-none"
                                            placeholder="e.g. 1 Instagram Reel, 2 Stories..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
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
                                    {editingId ? 'Save Changes' : 'Create Deal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
