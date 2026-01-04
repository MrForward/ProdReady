'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Search, Code2 } from 'lucide-react';

interface TickerItem {
    id: number;
    type: 'security' | 'seo' | 'hygiene';
    message: string;
    repo: string;
}

const SAMPLE_ISSUES: Omit<TickerItem, 'id'>[] = [
    { type: 'security', message: 'OpenAI API Key exposed', repo: 'ai-startup/chatbot' },
    { type: 'seo', message: 'Missing metadata in 12 pages', repo: 'saas-co/landing' },
    { type: 'hygiene', message: '47 console.log statements', repo: 'dev-team/dashboard' },
    { type: 'security', message: 'Stripe secret key in code', repo: 'ecommerce/store' },
    { type: 'seo', message: 'No OpenGraph tags', repo: 'blog/next-site' },
    { type: 'security', message: '.env file not gitignored', repo: 'startup/mvp' },
    { type: 'hygiene', message: '23 unused imports', repo: 'agency/portfolio' },
    { type: 'security', message: 'dangerouslySetInnerHTML usage', repo: 'cms/editor' },
    { type: 'seo', message: 'Images missing alt text', repo: 'photo/gallery' },
    { type: 'hygiene', message: '15 TODO comments', repo: 'team/project' },
];

export function IssueTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Initialize with sample items
        const initialItems = SAMPLE_ISSUES.slice(0, 5).map((item, index) => ({
            ...item,
            id: index,
        }));
        setItems(initialItems);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % SAMPLE_ISSUES.length;

                // Add new item
                setItems((prevItems) => {
                    const newItem = {
                        ...SAMPLE_ISSUES[next],
                        id: Date.now(),
                    };
                    const updated = [newItem, ...prevItems.slice(0, 4)];
                    return updated;
                });

                return next;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'security':
                return <Shield className="w-4 h-4 text-red-400" />;
            case 'seo':
                return <Search className="w-4 h-4 text-blue-400" />;
            case 'hygiene':
                return <Code2 className="w-4 h-4 text-amber-400" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-zinc-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'security':
                return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'seo':
                return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'hygiene':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default:
                return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <section className="py-12 border-y border-zinc-800/50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
                        Live Issue Feed
                    </span>
                </div>

                <div className="relative h-[180px] overflow-hidden">
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`
                  flex items-center gap-4 p-3 rounded-lg border transition-all duration-500
                  ${getTypeColor(item.type)}
                  ${index === 0 ? 'animate-fade-in' : ''}
                  ${index > 2 ? 'opacity-30' : ''}
                `}
                                style={{
                                    transform: `translateY(${index === 0 ? '0' : '0'})`,
                                }}
                            >
                                <div className="flex-shrink-0">
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.message}</p>
                                    <p className="text-xs opacity-60 font-mono truncate">{item.repo}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="text-xs uppercase font-medium px-2 py-1 rounded bg-black/20">
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fade gradient at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
