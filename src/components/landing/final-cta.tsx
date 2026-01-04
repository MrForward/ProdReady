'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
    const scrollToScan = () => {
        document.getElementById('scan')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <div className="glass rounded-3xl p-12 glow">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Ship with Confidence?
                    </h2>
                    <p className="text-zinc-400 text-lg mb-8">
                        Catch the issues your IDE missed. Free, instant, no sign-up required.
                    </p>
                    <Button
                        onClick={scrollToScan}
                        size="lg"
                        className="px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl transition-all hover:scale-105"
                    >
                        Scan Your Repository Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
