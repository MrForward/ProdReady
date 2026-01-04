'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Globe, Sparkles, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
    const [scanCount, setScanCount] = useState(0);
    const targetCount = 2847;

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = targetCount / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
                setScanCount(targetCount);
                clearInterval(timer);
            } else {
                setScanCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, []);

    const scrollToScan = () => {
        document.getElementById('scan')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-12">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(oklch(0.72 0.19 154 / 0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.19 154 / 0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass mb-6 md:mb-8 animate-fade-in">
                    <Sparkles className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                    <span className="text-xs md:text-sm font-medium text-zinc-300">Production-Ready in Seconds</span>
                </div>

                {/* Main headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 md:mb-6">
                    <span className="text-white">Your Copilot Writes.</span>
                    <br />
                    <span className="gradient-text">We Verify.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-6 md:mb-8 px-2">
                    Your AI wrote the code, but who verified it? Get a <span className="text-white font-medium">50-point security, SEO, and hygiene audit</span> in 3 seconds—before you deploy.
                </p>

                {/* Stats row - stacked on mobile */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10 mb-8 md:mb-10">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                        <span className="text-sm md:text-base text-zinc-300 font-medium">50+ Checks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                        <span className="text-sm md:text-base text-zinc-300 font-medium">Any Stack</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-emerald-400" />
                        <span className="text-sm md:text-base text-zinc-300">
                            <span className="font-mono font-bold text-white">
                                {scanCount.toLocaleString()}
                            </span>
                            + Scans
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <Button
                    onClick={scrollToScan}
                    size="lg"
                    className="w-full sm:w-auto px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/20"
                >
                    Scan Your Repository — Free
                    <ArrowDown className="w-4 md:w-5 h-4 md:h-5 ml-2 animate-bounce" />
                </Button>

                <p className="mt-3 md:mt-4 text-xs md:text-sm text-zinc-500">
                    No Signup Required • Read-Only Access
                </p>
            </div>
        </section>
    );
}
