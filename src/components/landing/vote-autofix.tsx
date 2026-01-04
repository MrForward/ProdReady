'use client';

import { useState } from 'react';
import { Sparkles, Shield, Search, Code2, Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VoteOption {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    votes: number;
}

export function VoteAutofix() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    const options: VoteOption[] = [
        {
            id: 'security',
            title: 'Auto-Fix Security Issues',
            description: 'Automatically patch exposed secrets, XSS vulnerabilities, and more with one click.',
            icon: <Shield className="w-6 h-6 text-red-400" />,
            votes: 847,
        },
        {
            id: 'seo',
            title: 'Auto-Generate SEO Tags',
            description: 'Generate missing metadata, OpenGraph tags, and alt text automatically.',
            icon: <Search className="w-6 h-6 text-blue-400" />,
            votes: 623,
        },
        {
            id: 'hygiene',
            title: 'Auto-Cleanup Code',
            description: 'Remove console.logs, unused imports, and dead code in one sweep.',
            icon: <Code2 className="w-6 h-6 text-amber-400" />,
            votes: 512,
        },
    ];

    const handleVote = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOption && email) {
            setHasVoted(true);
            // In production, this would call an API
            console.log('Vote:', selectedOption, email);
        }
    };

    return (
        <section className="py-24 px-4 border-t border-zinc-800/50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Coming Soon in Phase 2</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">Vote for Auto-Fix</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        One-click AI fixing is coming. Tell us which feature you want us to build first.
                    </p>
                </div>

                {hasVoted ? (
                    <div className="glass rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Thanks for voting!</h3>
                        <p className="text-zinc-400">
                            We&apos;ll notify you when Auto-Fix launches.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleVote} className="space-y-6">
                        {/* Vote options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`
                                        glass rounded-2xl p-6 text-left transition-all
                                        ${selectedOption === option.id
                                            ? 'border-2 border-primary bg-primary/5'
                                            : 'border border-transparent hover:border-zinc-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {option.icon}
                                        <span className="font-semibold text-white">{option.title}</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-4">
                                        {option.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                                            <div
                                                className="h-full bg-primary/50 rounded-full"
                                                style={{ width: `${(option.votes / 1000) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-zinc-500">{option.votes} votes</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Email input */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-12 bg-zinc-900 border-zinc-700"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!selectedOption || !email}
                                    className="h-12 px-8 bg-primary hover:bg-primary/90 disabled:opacity-50"
                                >
                                    Vote & Get Notified
                                </Button>
                            </div>
                            <p className="text-xs text-zinc-500 mt-4">
                                We&apos;ll only email you when this feature launches. No spam, ever.
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
