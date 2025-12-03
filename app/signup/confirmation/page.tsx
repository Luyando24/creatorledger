'use client';

import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignupConfirmationPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-teal-500" />
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
                
                <p className="text-slate-400 mb-8">
                    We've sent a confirmation link to your email address. 
                    Please click the link to verify your account and get started.
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 mb-8 text-left">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-slate-300">
                            <p className="font-medium text-white mb-1">Next steps:</p>
                            <ol className="list-decimal list-inside space-y-1 text-slate-400">
                                <li>Open the email from CreatorLedger</li>
                                <li>Click the confirmation link</li>
                                <li>Sign in to your new account</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link 
                        href="/login"
                        className="block w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Return to Login
                    </Link>
                    
                    <p className="text-sm text-slate-500">
                        Didn't receive the email?{' '}
                        <button className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                            Resend email
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
