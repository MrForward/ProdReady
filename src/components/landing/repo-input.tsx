'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, ArrowRight, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sanitizeRepoUrl } from '@/lib/sanitize';

export function RepoInput() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Use sanitized validation
        const result = sanitizeRepoUrl(url);

        if (!result.isValid) {
            setError(result.error || 'Please enter a valid GitHub repository URL');
            return;
        }

        setIsLoading(true);
        router.push(`/scan?repo=${encodeURIComponent(result.url)}`);
    };

    const handleExampleClick = (exampleUrl: string) => {
        setUrl(exampleUrl);
        setError('');
    };

    // Verified popular repos that produce interesting scan results
    // These are all well-maintained open source projects
    const examples = [
        { name: 'Next.js', url: 'https://github.com/vercel/next.js', description: 'React framework' },
        { name: 'shadcn/ui', url: 'https://github.com/shadcn-ui/ui', description: 'UI components' },
        { name: 'Docusaurus', url: 'https://github.com/facebook/docusaurus', description: 'Documentation' },
    ];

    return (
        <section id="scan" className="py-16 px-4 scroll-mt-20">
            <div className="max-w-2xl mx-auto">
                {/* Main input card */}
                <div className="glass rounded-2xl p-8 glow">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <Input
                                type="url"
                                placeholder="https://github.com/username/repository"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setError('');
                                }}
                                className="pl-12 h-14 text-lg bg-zinc-900 border-zinc-700 placeholder:text-zinc-500 focus:border-primary"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-red-400" />
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Starting scan...
                                </>
                            ) : (
                                <>
                                    Scan Repository
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-zinc-500 text-center">
                            ℹ️ Currently supports <strong className="text-zinc-400">public repositories</strong> only. Private repo support coming soon!
                        </p>
                    </form>

                    {/* Example repos */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                        <p className="text-sm text-zinc-500 mb-3">Try with a popular repository:</p>
                        <div className="flex flex-wrap gap-2">
                            {examples.map((example) => (
                                <button
                                    key={example.url}
                                    onClick={() => handleExampleClick(example.url)}
                                    className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                >
                                    {example.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* GitHub star CTA */}
                <div className="mt-6 text-center">
                    <a
                        href="https://github.com/prodready/prodready"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <Star className="w-4 h-4" />
                        Love ProdReady? Star us on GitHub
                    </a>
                </div>
            </div>
        </section>
    );
}
