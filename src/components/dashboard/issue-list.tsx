'use client';

import { useState } from 'react';
import { Issue } from '@/lib/scanner/types';
import { IssueCard } from './issue-card';
import { FixDrawer } from './fix-drawer';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Search,
    Code2,
    Filter,
    AlertTriangle,
    AlertCircle,
    Info,
    Lock,
    ChevronDown,
} from 'lucide-react';

interface IssueListProps {
    issues: Issue[];
    isBlurred?: boolean;
    onUnlockClick?: () => void;
}

type CategoryFilter = 'all' | 'security' | 'seo' | 'hygiene';
type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

// Show only 5 issues when locked, then require unlock
const FREE_PREVIEW_LIMIT = 5;

export function IssueList({ issues, isBlurred = false, onUnlockClick }: IssueListProps) {
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const filteredIssues = issues.filter((issue) => {
        if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
        if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
        return true;
    });

    const categoryCounts = {
        security: issues.filter(i => i.category === 'security').length,
        seo: issues.filter(i => i.category === 'seo').length,
        hygiene: issues.filter(i => i.category === 'hygiene').length,
    };

    // Calculate severity counts based on current category filter
    const filteredByCategory = categoryFilter === 'all'
        ? issues
        : issues.filter(i => i.category === categoryFilter);

    const severityCounts = {
        critical: filteredByCategory.filter(i => i.severity === 'critical').length,
        high: filteredByCategory.filter(i => i.severity === 'high').length,
        medium: filteredByCategory.filter(i => i.severity === 'medium').length,
        low: filteredByCategory.filter(i => i.severity === 'low').length,
    };

    const handleIssueClick = (issue: Issue) => {
        if (isBlurred) {
            onUnlockClick?.();
        } else {
            setSelectedIssue(issue);
            setDrawerOpen(true);
        }
    };

    // When locked, show only first 5 issues (with first 2 unblurred as preview)
    const visibleIssues = isBlurred
        ? filteredIssues.slice(0, FREE_PREVIEW_LIMIT)
        : filteredIssues;

    const hiddenCount = filteredIssues.length - FREE_PREVIEW_LIMIT;

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-zinc-400" />
                    <span className="font-medium text-white">Filter Issues</span>
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <FilterButton
                        active={categoryFilter === 'all'}
                        onClick={() => setCategoryFilter('all')}
                        count={issues.length}
                    >
                        All
                    </FilterButton>
                    <FilterButton
                        active={categoryFilter === 'security'}
                        onClick={() => setCategoryFilter('security')}
                        icon={<Shield className="w-4 h-4" />}
                        count={categoryCounts.security}
                        color="text-red-400"
                    >
                        Security
                    </FilterButton>
                    <FilterButton
                        active={categoryFilter === 'seo'}
                        onClick={() => setCategoryFilter('seo')}
                        icon={<Search className="w-4 h-4" />}
                        count={categoryCounts.seo}
                        color="text-blue-400"
                    >
                        SEO
                    </FilterButton>
                    <FilterButton
                        active={categoryFilter === 'hygiene'}
                        onClick={() => setCategoryFilter('hygiene')}
                        icon={<Code2 className="w-4 h-4" />}
                        count={categoryCounts.hygiene}
                        color="text-amber-400"
                    >
                        Hygiene
                    </FilterButton>
                </div>

                {/* Severity filters */}
                <div className="flex flex-wrap gap-2">
                    <FilterButton
                        active={severityFilter === 'all'}
                        onClick={() => setSeverityFilter('all')}
                        size="sm"
                    >
                        All Severity
                    </FilterButton>
                    {severityCounts.critical > 0 && (
                        <FilterButton
                            active={severityFilter === 'critical'}
                            onClick={() => setSeverityFilter('critical')}
                            icon={<AlertTriangle className="w-3 h-3" />}
                            count={severityCounts.critical}
                            color="text-red-400"
                            size="sm"
                        >
                            Critical
                        </FilterButton>
                    )}
                    {severityCounts.high > 0 && (
                        <FilterButton
                            active={severityFilter === 'high'}
                            onClick={() => setSeverityFilter('high')}
                            icon={<AlertCircle className="w-3 h-3" />}
                            count={severityCounts.high}
                            color="text-orange-400"
                            size="sm"
                        >
                            High
                        </FilterButton>
                    )}
                    {severityCounts.medium > 0 && (
                        <FilterButton
                            active={severityFilter === 'medium'}
                            onClick={() => setSeverityFilter('medium')}
                            icon={<AlertCircle className="w-3 h-3" />}
                            count={severityCounts.medium}
                            color="text-amber-400"
                            size="sm"
                        >
                            Medium
                        </FilterButton>
                    )}
                    {severityCounts.low > 0 && (
                        <FilterButton
                            active={severityFilter === 'low'}
                            onClick={() => setSeverityFilter('low')}
                            icon={<Info className="w-3 h-3" />}
                            count={severityCounts.low}
                            color="text-blue-400"
                            size="sm"
                        >
                            Low
                        </FilterButton>
                    )}
                </div>
            </div>

            {/* Issue cards */}
            <div className="space-y-3">
                {filteredIssues.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400">
                        <p>No issues found matching the current filters.</p>
                    </div>
                ) : (
                    <>
                        {visibleIssues.map((issue, index) => (
                            <IssueCard
                                key={issue.id}
                                issue={issue}
                                isBlurred={isBlurred && index > 1}
                                onClick={() => handleIssueClick(issue)}
                            />
                        ))}

                        {/* Show unlock prompt when there are more issues */}
                        {isBlurred && hiddenCount > 0 && (
                            <div className="relative">
                                {/* Gradient fade overlay */}
                                <div className="absolute inset-x-0 -top-16 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

                                {/* Unlock card */}
                                <div
                                    onClick={onUnlockClick}
                                    className="glass rounded-xl p-6 border border-primary/30 cursor-pointer hover:border-primary/50 transition-all text-center"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">
                                                +{hiddenCount} more issues found
                                            </h3>
                                            <p className="text-sm text-zinc-400">
                                                Enter your email to unlock full report with fix guides
                                            </p>
                                        </div>
                                        <Button className="bg-primary hover:bg-primary/90 mt-2">
                                            Unlock Full Report — Free
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Fix Drawer */}
            <FixDrawer
                issue={selectedIssue}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </div>
    );
}

interface FilterButtonProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    count?: number;
    color?: string;
    size?: 'default' | 'sm';
}

function FilterButton({
    children,
    active,
    onClick,
    icon,
    count,
    color = 'text-zinc-400',
    size = 'default'
}: FilterButtonProps) {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={`
                ${size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm'}
                ${active
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : `${color} hover:bg-zinc-800 border border-transparent`
                }
                rounded-lg font-medium transition-all
            `}
        >
            {icon && <span className="mr-1.5">{icon}</span>}
            {children}
            {count !== undefined && (
                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${active ? 'bg-primary/30' : 'bg-zinc-700'}`}>
                    {count}
                </span>
            )}
        </Button>
    );
}
