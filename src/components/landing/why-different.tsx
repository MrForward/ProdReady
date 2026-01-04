'use client';

import { Check, X, Minus, Zap, Shield } from 'lucide-react';

export function WhyDifferent() {
    const features = [
        {
            name: 'Security vulnerability detection',
            eslint: 'partial',
            ide: 'partial',
            prodready: 'full',
        },
        {
            name: 'SEO & accessibility checks',
            eslint: 'none',
            ide: 'none',
            prodready: 'full',
        },
        {
            name: 'Cross-file analysis',
            eslint: 'partial',
            ide: 'partial',
            prodready: 'full',
        },
        {
            name: 'Zero configuration',
            eslint: 'none',
            ide: 'partial',
            prodready: 'full',
        },
        {
            name: 'Pre-launch checklist',
            eslint: 'none',
            ide: 'none',
            prodready: 'full',
        },
        {
            name: 'Actionable fix guides',
            eslint: 'partial',
            ide: 'partial',
            prodready: 'full',
        },
        {
            name: 'Works on any public repo',
            eslint: 'none',
            ide: 'none',
            prodready: 'full',
        },
    ];

    const getIcon = (status: string) => {
        switch (status) {
            case 'full':
                return <Check className="w-5 h-5 text-emerald-400" />;
            case 'partial':
                return <Minus className="w-5 h-5 text-amber-400" />;
            default:
                return <X className="w-5 h-5 text-zinc-600" />;
        }
    };

    return (
        <section className="py-24 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">Why ProdReady?</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Your IDE catches syntax errors. We catch the issues that cost you users, rankings, and security.
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="text-left py-4 px-6 text-zinc-400 font-medium">Feature</th>
                                    <th className="text-center py-4 px-4 text-zinc-400 font-medium">
                                        <span className="flex flex-col items-center gap-1">
                                            <span className="text-lg">⚡</span>
                                            <span>Linters</span>
                                        </span>
                                    </th>
                                    <th className="text-center py-4 px-4 text-zinc-400 font-medium">
                                        <span className="flex flex-col items-center gap-1">
                                            <span className="text-lg">💻</span>
                                            <span>IDE Tools</span>
                                        </span>
                                    </th>
                                    <th className="text-center py-4 px-4 bg-primary/5 border-x border-primary/20">
                                        <span className="flex flex-col items-center gap-1">
                                            <Shield className="w-5 h-5 text-primary" />
                                            <span className="text-primary font-semibold">ProdReady</span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature, index) => (
                                    <tr
                                        key={feature.name}
                                        className={index !== features.length - 1 ? 'border-b border-zinc-800/50' : ''}
                                    >
                                        <td className="py-4 px-6 text-zinc-300">{feature.name}</td>
                                        <td className="py-4 px-4 text-center">{getIcon(feature.eslint)}</td>
                                        <td className="py-4 px-4 text-center">{getIcon(feature.ide)}</td>
                                        <td className="py-4 px-4 text-center bg-primary/5 border-x border-primary/20">
                                            {getIcon(feature.prodready)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom note */}
                <p className="text-center text-sm text-zinc-500 mt-6">
                    <Zap className="w-4 h-4 inline mr-1 text-amber-400" />
                    ProdReady complements your existing tools — it&apos;s not a replacement, it&apos;s your final check before shipping.
                </p>
            </div>
        </section>
    );
}
