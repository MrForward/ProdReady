'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export interface LogEntry {
    id: string;
    message: string;
    type: 'info' | 'success' | 'found' | 'error';
    timestamp: Date;
}

interface TerminalLogProps {
    logs: LogEntry[];
    isComplete?: boolean;
}

export function TerminalLog({ logs, isComplete }: TerminalLogProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);

    // Auto-scroll to bottom when new logs appear
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [visibleLogs]);

    // Animate logs appearing one by one
    useEffect(() => {
        if (logs.length > visibleLogs.length) {
            const timer = setTimeout(() => {
                setVisibleLogs(logs.slice(0, visibleLogs.length + 1));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [logs, visibleLogs.length]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            case 'found':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            default:
                return <span className="w-4 h-4 text-zinc-500">›</span>;
        }
    };

    const getClass = (type: string) => {
        switch (type) {
            case 'success':
                return 'terminal-success';
            case 'found':
                return 'terminal-found';
            case 'error':
                return 'terminal-error';
            default:
                return 'terminal-command';
        }
    };

    return (
        <div className="glass rounded-2xl overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 ml-4 text-sm text-zinc-400">
                    <Terminal className="w-4 h-4" />
                    <span className="font-mono">prodready-scanner</span>
                </div>
            </div>

            {/* Terminal content */}
            <div
                ref={containerRef}
                className="terminal p-4 h-[350px] overflow-y-auto"
            >
                {visibleLogs.map((log, index) => (
                    <div
                        key={log.id}
                        className={`terminal-line flex items-start gap-2 ${getClass(log.type)}`}
                        style={{
                            opacity: 0,
                            animation: 'fadeIn 0.3s ease-out forwards',
                            animationDelay: `${index * 0.05}s`,
                        }}
                    >
                        {getIcon(log.type)}
                        <span className="flex-1">{log.message}</span>
                        {log.type === 'found' && (
                            <span className="text-xs text-red-400/60 font-mono">[ISSUE]</span>
                        )}
                    </div>
                ))}

                {/* Blinking cursor */}
                {!isComplete && (
                    <div className="terminal-line flex items-center gap-2 mt-2">
                        <span className="terminal-prompt">$</span>
                        <span className="w-2 h-5 bg-primary animate-pulse" />
                    </div>
                )}

                {isComplete && (
                    <div className="terminal-line flex items-center gap-2 mt-4 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Scan complete! Generating report...</span>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-5px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
        </div>
    );
}
