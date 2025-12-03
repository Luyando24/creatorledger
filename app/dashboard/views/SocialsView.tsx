import { useState, useEffect } from 'react';
import { 
    Instagram, Youtube, Twitter, Linkedin, Share2, Globe, 
    RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2, ExternalLink 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SocialAccount {
    id: string;
    platform: string;
    handle: string;
    follower_count: number;
    previous_follower_count: number;
    engagement_rate: number;
    last_synced_at: string | null;
    status: 'connected' | 'disconnected' | 'error';
}

const PLATFORMS = [
    { id: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { id: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'Twitter', icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'border-blue-600/20' },
    { id: 'TikTok', icon: Share2, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
    { id: 'Other', icon: Globe, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' }
];

export default function SocialsView() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({
        platform: 'Instagram',
        handle: ''
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const { data, error } = await supabase
                .from('social_accounts')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setAccounts(data || []);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async () => {
        if (!newAccount.handle) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Simulate fetching initial data
            const initialFollowers = Math.floor(Math.random() * 10000) + 500;
            const initialEngagement = (Math.random() * 5 + 1).toFixed(1);

            const { error } = await supabase
                .from('social_accounts')
                .insert([{
                    user_id: user.id,
                    platform: newAccount.platform,
                    handle: newAccount.handle,
                    follower_count: initialFollowers,
                    previous_follower_count: initialFollowers - Math.floor(Math.random() * 100),
                    engagement_rate: parseFloat(initialEngagement),
                    status: 'connected',
                    last_synced_at: new Date().toISOString()
                }]);

            if (error) throw error;

            setNewAccount({ platform: 'Instagram', handle: '' });
            setIsAdding(false);
            fetchAccounts();
        } catch (error) {
            console.error('Error adding account:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('social_accounts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setAccounts(accounts.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            // Simulate API sync for all accounts
            // In a real app, this would call an Edge Function or backend service
            const updates = accounts.map(async (account) => {
                // Simulate slight changes in stats
                const growth = Math.random() > 0.3 ? Math.floor(Math.random() * 50) : -Math.floor(Math.random() * 10);
                const newFollowers = Math.max(0, account.follower_count + growth);
                const newEngagement = Math.max(0, Math.min(10, account.engagement_rate + (Math.random() * 0.4 - 0.2)));

                const { error } = await supabase
                    .from('social_accounts')
                    .update({
                        follower_count: newFollowers,
                        engagement_rate: parseFloat(newEngagement.toFixed(1)),
                        last_synced_at: new Date().toISOString(),
                        status: 'connected'
                    })
                    .eq('id', account.id);
                
                if (error) throw error;
            });

            await Promise.all(updates);
            await fetchAccounts();
        } catch (error) {
            console.error('Error syncing accounts:', error);
        } finally {
            setSyncing(false);
        }
    };

    const getPlatformConfig = (platformId: string) => {
        return PLATFORMS.find(p => p.id === platformId) || PLATFORMS[5];
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Social Integration</h1>
                    <p className="text-slate-400">Manage your connected social profiles and track performance.</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing || accounts.length === 0}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        syncing 
                            ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                            : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                    }`}
                >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync All Data'}
                </button>
            </div>

            {/* Connected Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {accounts.map((account) => {
                    const config = getPlatformConfig(account.platform);
                    const Icon = config.icon;

                    return (
                        <div key={account.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group">
                            <button 
                                onClick={() => handleDelete(account.id)}
                                className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                title="Disconnect Account"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-xl ${config.bg} ${config.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">{account.platform}</h3>
                                    <a href="#" className="text-slate-400 text-sm hover:text-teal-400 flex items-center gap-1">
                                        {account.handle}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-950/50 rounded-lg p-3">
                                    <p className="text-slate-500 text-xs font-medium mb-1">Followers</p>
                                    <p className="text-white text-xl font-bold">{formatNumber(account.follower_count)}</p>
                                </div>
                                <div className="bg-slate-950/50 rounded-lg p-3">
                                    <p className="text-slate-500 text-xs font-medium mb-1">Engagement</p>
                                    <p className="text-white text-xl font-bold">{account.engagement_rate}%</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    {account.status === 'connected' ? (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-emerald-500 font-medium">Connected</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                            <span className="text-red-500 font-medium">Error</span>
                                        </>
                                    )}
                                </div>
                                <span className="text-slate-600">
                                    Synced: {account.last_synced_at ? new Date(account.last_synced_at).toLocaleTimeString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Account Card */}
                {isAdding ? (
                    <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-6 flex flex-col justify-center animate-in fade-in zoom-in-95">
                        <h3 className="text-white font-semibold mb-4">Connect Account</h3>
                        <div className="space-y-3 mb-4">
                            <select
                                value={newAccount.platform}
                                onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                            >
                                {PLATFORMS.map(p => (
                                    <option key={p.id} value={p.id}>{p.id}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="@handle"
                                value={newAccount.handle}
                                onChange={(e) => setNewAccount({ ...newAccount, handle: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddAccount}
                                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                            >
                                Connect
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-slate-900/50 border border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-teal-400 transition-all group h-full min-h-[200px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-teal-500/10 flex items-center justify-center transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium">Connect New Account</span>
                    </button>
                )}
            </div>
        </div>
    );
}
