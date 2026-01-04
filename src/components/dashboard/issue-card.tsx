'use client';

import { Issue, IssueSeverity } from '@/lib/scanner/types';
import { Badge } from '@/components/ui/badge';
import { CopyPromptButton } from './copy-prompt-button';
import {
    Shield,
    Search,
    Code2,
    ChevronRight,
    Lock,
    FileCode,
    AlertTriangle,
    AlertCircle,
    Info,
    Star,
} from 'lucide-react';

interface IssueCardProps {
    issue: Issue;
    isBlurred?: boolean;
    onClick?: () => void;
}

export function IssueCard({ issue, isBlurred = false, onClick }: IssueCardProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'security':
                return <Shield className="w-5 h-5" />;
            case 'seo':
                return <Search className="w-5 h-5" />;
            case 'hygiene':
                return <Code2 className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getSeverityIcon = (severity: IssueSeverity) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle className="w-4 h-4" />;
            case 'high':
                return <AlertCircle className="w-4 h-4" />;
            case 'medium':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Info className="w-4 h-4" />;
        }
    };

    const getSeverityColor = (severity: IssueSeverity) => {
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

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'security':
                return 'text-red-400';
            case 'seo':
                return 'text-blue-400';
            case 'hygiene':
                return 'text-amber-400';
            default:
                return 'text-zinc-400';
        }
    };

    const getCardBorderColor = (severity: IssueSeverity) => {
        switch (severity) {
            case 'critical':
                return 'border-red-500/30 hover:border-red-500/50';
            case 'high':
                return 'border-orange-500/30 hover:border-orange-500/50';
            case 'medium':
                return 'border-amber-500/30 hover:border-amber-500/50';
            case 'low':
                return 'border-blue-500/30 hover:border-blue-500/50';
            default:
                return 'border-zinc-500/30 hover:border-zinc-500/50';
        }
    };

    return (
        <div
            className={`
                glass rounded-xl p-4 border transition-all
                hover:bg-white/5
                ${getCardBorderColor(issue.severity)}
                ${isBlurred ? 'relative overflow-hidden' : ''}
            `}
        >
            <div className="flex items-start gap-4">
                {/* Category icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg bg-zinc-800/50 ${getCategoryColor(issue.category)}`}>
                    {getCategoryIcon(issue.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white truncate">{issue.title}</h3>
                        <Badge
                            variant="outline"
                            className={`flex-shrink-0 ${getSeverityColor(issue.severity)}`}
                        >
                            {getSeverityIcon(issue.severity)}
                            <span className="ml-1 capitalize">{issue.severity}</span>
                        </Badge>
                    </div>

                    <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {issue.whyBad}
                    </p>

                    {/* File location - blurred if gated */}
                    <div className={`flex items-center gap-2 text-sm ${isBlurred ? 'blur-gate select-none' : ''}`}>
                        <FileCode className="w-4 h-4 text-zinc-500" />
                        <span className="font-mono text-zinc-500 truncate">
                            {issue.filePath}
                            {issue.lineNumber && <span className="text-primary">:{issue.lineNumber}</span>}
                        </span>
                    </div>

                    {/* Code snippet - blurred if gated */}
                    {issue.codeSnippet && (
                        <div className={`mt-2 p-2 rounded-lg bg-zinc-900/50 ${isBlurred ? 'blur-gate select-none' : ''}`}>
                            <code className="text-xs font-mono text-zinc-400 line-clamp-1">
                                {issue.codeSnippet}
                            </code>
                        </div>
                    )}

                    {/* Action buttons - only show when not blurred */}
                    {!isBlurred && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
                            <CopyPromptButton issue={issue} variant="compact" />
                            <button
                                onClick={onClick}
                                className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                View fix guide
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Blur overlay for gated content */}
            {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Unlock to view</span>
                    </div>
                </div>
            )}
        </div>
    );
}
