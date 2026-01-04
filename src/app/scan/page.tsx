'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { scanRepository } from '@/lib/scanner/engine';
import { ScanReport } from '@/lib/scanner/types';
import { TerminalLog, LogEntry } from '@/components/scanner/terminal-log';
import { ScoreCard } from '@/components/dashboard/score-card';
import { IssueList } from '@/components/dashboard/issue-list';
import { EmailModal } from '@/components/gate/email-modal';
import { CopyAllPromptsButton } from '@/components/dashboard/copy-prompt-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Shield,
    ArrowLeft,
    ExternalLink,
    Github,
    RefreshCw,
    CheckCircle2,
    Clock,
    FileCode,
    Star,
    Download,
    Share2,
    Wand2,
} from 'lucide-react';

function ScanPageContent() {
    const searchParams = useSearchParams();
    const repoUrl = searchParams.get('repo');

    const [isScanning, setIsScanning] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [report, setReport] = useState<ScanReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isBlurred, setIsBlurred] = useState(true);
    const [emailModalOpen, setEmailModalOpen] = useState(false);

    const addLog = useCallback((message: string, type: 'info' | 'success' | 'found' | 'error' = 'info') => {
        setLogs((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                message,
                type,
                timestamp: new Date(),
            },
        ]);
    }, []);

    useEffect(() => {
        if (!repoUrl) {
            setError('No repository URL provided');
            setIsScanning(false);
            return;
        }

        const decodedUrl = decodeURIComponent(repoUrl);

        const runScan = async () => {
            try {
                addLog('Initializing ProdReady scanner v1.0...', 'info');
                await new Promise((resolve) => setTimeout(resolve, 500));

                const result = await scanRepository(decodedUrl, {
                    onProgress: (message, type) => {
                        addLog(message, type || 'info');
                    },
                });

                setReport(result);
                addLog('Scan complete! Generating report...', 'success');
            } catch (err) {
                let errorMessage = 'Unknown error occurred';

                if (err instanceof Error) {
                    // Handle specific error types
                    if (err.message.includes('rate limit')) {
                        errorMessage = 'GitHub API rate limit exceeded. Please try again in a few minutes.';
                    } else if (err.message.includes('not found') || err.message.includes('404')) {
                        errorMessage = 'Repository not found. Please check the URL and ensure it\'s a public repository.';
                    } else if (err.message.includes('timeout') || err.message.includes('timed out')) {
                        errorMessage = 'Scan timed out. The repository may be too large. Try a smaller repository.';
                    } else if (err.message.includes('Invalid')) {
                        errorMessage = err.message;
                    } else if (err.message.includes('private')) {
                        errorMessage = 'This appears to be a private repository. ProdReady can only scan public repositories.';
                    } else {
                        errorMessage = err.message;
                    }
                }

                addLog(`Error: ${errorMessage}`, 'error');
                setError(errorMessage);
            } finally {
                setIsScanning(false);
            }
        };

        runScan();
    }, [repoUrl, addLog]);

    const handleUnlock = async (email: string) => {
        // Import saveLead dynamically to keep component clean
        const { saveLead } = await import('@/lib/supabase');

        // Save lead to database
        const saved = await saveLead({
            email,
            repo_url: repoUrl ? decodeURIComponent(repoUrl) : undefined,
            issue_count: report?.issues.length,
            source: 'scan_unlock',
        });

        if (!saved) {
            throw new Error('Failed to save your information');
        }

        setIsBlurred(false);
    };

    const handleRescan = () => {
        window.location.reload();
    };

    if (!repoUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">No Repository URL</h1>
                    <p className="text-zinc-400 mb-8">Please provide a GitHub repository URL to scan.</p>
                    <Link href="/">
                        <Button className="bg-primary hover:bg-primary/90">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const decodedUrl = decodeURIComponent(repoUrl);

    return (
        <main className="min-h-screen pb-12">
            {/* Header */}
            <header className="border-b border-zinc-800/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl text-white">ProdReady</span>
                    </Link>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRescan}
                            disabled={isScanning}
                            className="border-zinc-700 hover:bg-zinc-800"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Rescan</span>
                        </Button>
                        <Link
                            href={decodedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="ghost" size="sm">
                                <Github className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">View Repo</span>
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Repo Info */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {report?.repoName || 'Scanning Repository...'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                        <span className="font-mono text-xs md:text-sm truncate max-w-xs md:max-w-none">{decodedUrl}</span>
                        {report && (
                            <>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-1">
                                    <FileCode className="w-4 h-4" />
                                    {report.totalFiles} files
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(report.scannedAt).toLocaleTimeString()}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Tech Stack Badges */}
                    {report && report.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {report.techStack.map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="outline"
                                    className="text-xs capitalize border-zinc-700 text-zinc-300"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scanning State */}
                {isScanning && (
                    <div className="mb-8">
                        <TerminalLog logs={logs} isComplete={false} />
                    </div>
                )}

                {/* Error State */}
                {error && !isScanning && (
                    <div className="glass rounded-2xl p-8 text-center mb-8 border border-red-500/30">
                        <h2 className="text-xl font-semibold text-red-400 mb-2">Scan Failed</h2>
                        <p className="text-zinc-400 mb-6">{error}</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/">
                                <Button variant="outline" className="border-zinc-700 w-full sm:w-auto">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Try Different Repo
                                </Button>
                            </Link>
                            <Button onClick={handleRescan} className="bg-primary hover:bg-primary/90">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry Scan
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results */}
                {report && !isScanning && (
                    <div className="space-y-8">
                        {/* Score Card */}
                        <ScoreCard
                            grade={report.grade}
                            score={report.vibeScore}
                            issueCount={report.issues.length}
                            passedCount={report.passed.length}
                        />

                        {/* Quick Actions */}
                        {report.issues.length > 0 && !isBlurred && (
                            <div className="glass rounded-2xl p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-semibold text-white flex items-center gap-2">
                                            <Wand2 className="w-5 h-5 text-purple-400" />
                                            Quick DIY Fix
                                        </h2>
                                        <p className="text-sm text-zinc-400 mt-1">
                                            Copy all issues as prompts for your AI coding agent (Cursor, Copilot, etc.)
                                        </p>
                                    </div>
                                    <CopyAllPromptsButton issues={report.issues} />
                                </div>
                            </div>
                        )}

                        {/* GitHub Star Ask */}
                        {report.vibeScore >= 70 && (
                            <div className="glass rounded-xl p-4 border border-emerald-500/20 bg-emerald-500/5">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-amber-400" />
                                        <p className="text-sm text-zinc-300">
                                            Great score! If ProdReady helped, consider starring us on GitHub.
                                        </p>
                                    </div>
                                    <a
                                        href="https://github.com/prodready/prodready"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button size="sm" variant="outline" className="border-zinc-700">
                                            <Star className="w-4 h-4 mr-1" />
                                            Star
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Passed Checks */}
                        {report.passed.length > 0 && (
                            <div className="glass rounded-2xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    Checks Passed ({report.passed.length})
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {report.passed.map((check) => (
                                        <div
                                            key={check.ruleId}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-emerald-300 text-sm">{check.title}</p>
                                                <p className="text-xs text-emerald-400/60 mt-1">{check.appreciation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Issues List */}
                        {report.issues.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white">
                                        Issues Found ({report.issues.length})
                                    </h2>
                                </div>

                                <IssueList
                                    issues={report.issues}
                                    isBlurred={isBlurred}
                                    onUnlockClick={() => setEmailModalOpen(true)}
                                />

                                {/* Unlock CTA - only show when blurred */}
                                {isBlurred && (
                                    <div className="mt-8 text-center">
                                        <div className="glass rounded-2xl p-8 glow max-w-xl mx-auto">
                                            <h3 className="text-xl font-semibold text-white mb-2">
                                                Unlock Full Report
                                            </h3>
                                            <p className="text-zinc-400 mb-6">
                                                Enter your email to reveal all file paths, line numbers, and copy AI-ready fix prompts.
                                            </p>
                                            <Button
                                                onClick={() => setEmailModalOpen(true)}
                                                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
                                            >
                                                Reveal Full Report — Free
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="glass rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Perfect Score! 🎉</h2>
                                <p className="text-zinc-400 mb-6">
                                    No issues found. Your codebase is in excellent shape.
                                </p>
                                <a
                                    href="https://github.com/prodready/prodready"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" className="border-zinc-700">
                                        <Star className="w-4 h-4 mr-2 text-amber-400" />
                                        Star us on GitHub
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Email Modal */}
            <EmailModal
                open={emailModalOpen}
                onOpenChange={setEmailModalOpen}
                onSubmit={handleUnlock}
                issueCount={report?.issues.length}
            />
        </main>
    );
}

export default function ScanPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Loading scanner...</p>
                </div>
            </div>
        }>
            <ScanPageContent />
        </Suspense>
    );
}
