'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sanitizeEmail } from '@/lib/sanitize';
import {
    Lock,
    Mail,
    Unlock,
    Loader2,
    CheckCircle2,
    FileText,
    Wrench,
    Sparkles
} from 'lucide-react';

interface EmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (email: string) => Promise<void>;
    issueCount?: number;
    repoUrl?: string;
}

export function EmailModal({ open, onOpenChange, onSubmit, issueCount = 0, repoUrl }: EmailModalProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Use sanitized validation
        const result = sanitizeEmail(email);

        if (!result.isValid) {
            setError(result.error || 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            await onSubmit(result.email);
            setIsSuccess(true);
            setTimeout(() => {
                onOpenChange(false);
                setIsSuccess(false);
                setEmail('');
            }, 2000);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-lg">
                {isSuccess ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Report Unlocked!</h3>
                        <p className="text-zinc-400">
                            Your full report is now visible. Check your email for the PDF version.
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <DialogTitle className="text-2xl text-center text-white">
                                Unlock Your Full Report
                            </DialogTitle>
                            <DialogDescription className="text-center text-zinc-400">
                                Enter your email to reveal file paths, line numbers, and get a detailed fix guide.
                            </DialogDescription>
                        </DialogHeader>

                        {/* What you get */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4">
                            <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/50">
                                <FileText className="w-5 h-5 text-primary mb-2" />
                                <span className="text-xs text-zinc-300 text-center">Full Report</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/50">
                                <Wrench className="w-5 h-5 text-amber-400 mb-2" />
                                <span className="text-xs text-zinc-300 text-center">Fix Guides</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/50">
                                <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                                <span className="text-xs text-zinc-300 text-center">PDF Export</span>
                            </div>
                        </div>

                        {issueCount > 0 && (
                            <div className="text-center py-2">
                                <span className="text-sm text-zinc-400">
                                    Unlock <span className="text-primary font-semibold">{issueCount} issues</span> found in your repo
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <Input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className="pl-11 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-400 text-center">{error}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Unlocking...
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="w-5 h-5 mr-2" />
                                        Unlock Full Report
                                    </>
                                )}
                            </Button>
                        </form>

                        <p className="text-xs text-zinc-500 text-center">
                            We&apos;ll send you the report and occasional product updates. Unsubscribe anytime.
                        </p>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
