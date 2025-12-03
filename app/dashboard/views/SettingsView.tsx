import { Globe } from 'lucide-react';

export default function SettingsView() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your dashboard preferences and account settings.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-teal-500" />
                        General Settings
                    </h2>
                </div>
                
                <div className="p-12 text-center">
                    <p className="text-slate-400">
                        More settings will be available soon.
                    </p>
                </div>
            </div>
        </div>
    );
}
