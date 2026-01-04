'use client';

import { Issue } from '@/lib/scanner/types';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Search,
    Code2,
    FileCode,
    AlertTriangle,
    AlertCircle,
    Info,
    Wrench,
    BookOpen,
    Sparkles,
    Lock,
    Copy,
    Check,
} from 'lucide-react';
import { useState } from 'react';

interface FixDrawerProps {
    issue: Issue | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FixDrawer({ issue, open, onOpenChange }: FixDrawerProps) {
    const [copied, setCopied] = useState(false);

    if (!issue) return null;

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'security':
                return <Shield className="w-5 h-5 text-red-400" />;
            case 'seo':
                return <Search className="w-5 h-5 text-blue-400" />;
            case 'hygiene':
                return <Code2 className="w-5 h-5 text-amber-400" />;
            default:
                return <Info className="w-5 h-5 text-zinc-400" />;
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle className="w-4 h-4" />;
            case 'high':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Info className="w-4 h-4" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500/10 text-red-400 border-red-500/30';
            case 'high':
                return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
            case 'medium':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'low':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(issue.manualFixGuide);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Parse markdown-style code blocks from manual fix guide
    const renderFixGuide = (text: string) => {
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
                if (match) {
                    const [, lang, code] = match;
                    return (
                        <div key={index} className="my-4">
                            <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 rounded-t-lg border-b border-zinc-700">
                                <span className="text-xs font-mono text-zinc-400">{lang || 'code'}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-6 px-2 text-xs"
                                >
                                    {copied ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                </Button>
                            </div>
                            <pre className="p-4 bg-zinc-900 rounded-b-lg overflow-x-auto">
                                <code className="text-sm font-mono text-zinc-300 whitespace-pre-wrap">
                                    {code.trim()}
                                </code>
                            </pre>
                        </div>
                    );
                }
            }

            return (
                <p key={index} className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {part}
                </p>
            );
        });
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-zinc-950 border-zinc-800 max-h-[90vh]">
                <div className="mx-auto w-full max-w-3xl overflow-y-auto">
                    <DrawerHeader className="border-b border-zinc-800 pb-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-zinc-800/50">
                                {getCategoryIcon(issue.category)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                        {getSeverityIcon(issue.severity)}
                                        <span className="ml-1 capitalize">{issue.severity}</span>
                                    </Badge>
                                    <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                                        {issue.category}
                                    </Badge>
                                </div>
                                <DrawerTitle className="text-xl text-white">{issue.title}</DrawerTitle>
                                <DrawerDescription className="text-zinc-400 mt-1">
                                    <div className="flex items-center gap-2">
                                        <FileCode className="w-4 h-4" />
                                        <span className="font-mono">
                                            {issue.filePath}
                                            {issue.lineNumber && `:${issue.lineNumber}`}
                                        </span>
                                    </div>
                                </DrawerDescription>
                            </div>
                        </div>
                    </DrawerHeader>

                    <div className="p-6 space-y-6">
                        {/* Code snippet if available */}
                        {issue.codeSnippet && (
                            <div>
                                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                    Problematic Code
                                </h3>
                                <pre className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg overflow-x-auto">
                                    <code className="text-sm font-mono text-red-300">
                                        {issue.codeSnippet}
                                    </code>
                                </pre>
                            </div>
                        )}

                        {/* Why it's bad */}
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                Why This Is Bad
                            </h3>
                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                <p className="text-amber-200">{issue.whyBad}</p>
                            </div>
                        </div>

                        {/* Manual fix guide */}
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                                <Wrench className="w-4 h-4 text-emerald-400" />
                                How To Fix (Manual)
                            </h3>
                            <div className="prose prose-invert prose-sm max-w-none">
                                {renderFixGuide(issue.manualFixGuide)}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                                <BookOpen className="w-4 h-4 mr-2" />
                                View Full Guide
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-zinc-700 hover:bg-zinc-800"
                                disabled
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                <span>Auto-Fix</span>
                                <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                    Coming Soon
                                </Badge>
                            </Button>
                        </div>

                        {/* Phase 2 teaser */}
                        <div className="glass rounded-xl p-4 border border-purple-500/20">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-purple-300 mb-1">
                                        🚀 Auto-Fix Coming Soon
                                    </h4>
                                    <p className="text-sm text-purple-300/60">
                                        Our AI agent is learning to fix these issues automatically.
                                        Join the waitlist to be notified when it&apos;s ready.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
