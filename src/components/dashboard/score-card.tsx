'use client';

import { Grade } from '@/lib/scanner/types';
import { Shield, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle } from 'lucide-react';

interface ScoreCardProps {
    grade: Grade;
    score: number;
    issueCount: number;
    passedCount: number;
    isBlurred?: boolean;
}

export function ScoreCard({ grade, score, issueCount, passedCount, isBlurred }: ScoreCardProps) {
    const getGradeColor = (g: Grade) => {
        switch (g) {
            case 'A':
                return 'from-emerald-500 to-emerald-600 text-emerald-400';
            case 'B':
                return 'from-cyan-500 to-cyan-600 text-cyan-400';
            case 'C':
                return 'from-amber-500 to-amber-600 text-amber-400';
            case 'D':
                return 'from-orange-500 to-orange-600 text-orange-400';
            case 'F':
                return 'from-red-500 to-red-600 text-red-400';
            default:
                return 'from-zinc-500 to-zinc-600 text-zinc-400';
        }
    };

    const getGradeGlow = (g: Grade) => {
        switch (g) {
            case 'A':
                return 'shadow-emerald-500/30';
            case 'B':
                return 'shadow-cyan-500/30';
            case 'C':
                return 'shadow-amber-500/30';
            case 'D':
                return 'shadow-orange-500/30';
            case 'F':
                return 'shadow-red-500/30';
            default:
                return 'shadow-zinc-500/30';
        }
    };

    const getScoreTrend = () => {
        if (score >= 80) return { icon: TrendingUp, text: 'Healthy', color: 'text-emerald-400' };
        if (score >= 60) return { icon: Minus, text: 'Needs Work', color: 'text-amber-400' };
        return { icon: TrendingDown, text: 'Critical', color: 'text-red-400' };
    };

    const trend = getScoreTrend();
    const TrendIcon = trend.icon;
    const gradeColors = getGradeColor(grade);

    return (
        <div className={`glass rounded-2xl p-6 ${isBlurred ? 'blur-gate' : ''}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-white">Vibe Score</h2>
                </div>
                <div className={`flex items-center gap-1 ${trend.color}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{trend.text}</span>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Grade circle */}
                <div className="relative">
                    <div
                        className={`
              w-28 h-28 rounded-full flex items-center justify-center
              bg-gradient-to-br ${gradeColors}
              shadow-2xl ${getGradeGlow(grade)}
            `}
                    >
                        <span className="text-5xl font-bold text-white">{grade}</span>
                    </div>
                    {/* Progress ring */}
                    <svg
                        className="absolute inset-0 w-28 h-28 -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-zinc-800"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${score * 2.89} 289`}
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="oklch(0.72 0.19 154)" />
                                <stop offset="100%" stopColor="oklch(0.65 0.20 200)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Score details */}
                <div className="flex-1 space-y-4">
                    <div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {score}
                            <span className="text-lg text-zinc-400">/100</span>
                        </div>
                        <p className="text-sm text-zinc-400">Overall Health Score</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <div>
                                <div className="text-lg font-semibold text-red-400">{issueCount}</div>
                                <div className="text-xs text-red-400/60">Issues Found</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <div>
                                <div className="text-lg font-semibold text-emerald-400">{passedCount}</div>
                                <div className="text-xs text-emerald-400/60">Checks Passed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
