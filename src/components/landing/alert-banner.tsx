'use client';

import { AlertTriangle } from 'lucide-react';

// Realistic, non-exaggerated alerts based on common issues
const alerts = [
    { what: 'Exposed API keys', impact: 'can lead to unauthorized access' },
    { what: 'Missing input validation', impact: 'opens the door to injection attacks' },
    { what: 'Debug code in production', impact: 'exposes internal logic to users' },
    { what: 'No SEO metadata', impact: 'hurts your search rankings' },
    { what: 'Hardcoded secrets', impact: 'can be scraped from public repos' },
];

export function AlertBanner() {
    return (
        <div className="bg-amber-500/10 border-b border-amber-500/20 overflow-hidden">
            <div className="relative flex overflow-hidden">
                <div className="animate-scroll-x flex items-center gap-8 py-2 px-4 whitespace-nowrap">
                    {[...alerts, ...alerts, ...alerts].map((alert, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="text-amber-200/80">
                                <span className="font-medium text-amber-100">{alert.what}</span>
                                {' '}{alert.impact}
                            </span>
                            <span className="text-amber-500/40 ml-4">•</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
