import { Settings, User, Bell, Shield, HelpCircle } from 'lucide-react';

export default function SettingsView() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your account preferences and app settings.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Settings Section (Placeholder) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-teal-500" />
                            Profile Settings
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-400 text-sm">
                            Profile management features are coming soon. You will be able to update your email, password, and personal details here.
                        </p>
                    </div>
                </div>

                {/* Notifications Section (Placeholder) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-purple-500" />
                            Notifications
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                            <div>
                                <p className="text-white font-medium">Email Notifications</p>
                                <p className="text-xs text-slate-500">Receive daily summaries and alerts</p>
                            </div>
                            <div className="w-11 h-6 bg-slate-700 rounded-full relative cursor-not-allowed">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-white font-medium">Push Notifications</p>
                                <p className="text-xs text-slate-500">Get real-time updates on your device</p>
                            </div>
                            <div className="w-11 h-6 bg-slate-700 rounded-full relative cursor-not-allowed">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section (Placeholder) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                            Security
                        </h2>
                    </div>
                    <div className="p-6">
                        <button className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Help & Support (Placeholder) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-orange-500" />
                            Support
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-400 text-sm mb-4">
                            Need help? Check our documentation or contact support.
                        </p>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
