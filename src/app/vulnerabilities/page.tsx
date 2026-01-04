import { Metadata } from 'next';
import Link from 'next/link';
import { inspectionRules, getRulesByCategory } from '@/data/inspection-rules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Search,
    Code2,
    ArrowRight,
    AlertTriangle,
    AlertCircle,
    Info,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Common Code Vulnerabilities | ProdReady',
    description: 'Learn about the most common security, SEO, and code hygiene issues in Next.js and React applications. Free guides to fix each vulnerability.',
    openGraph: {
        title: 'Common Code Vulnerabilities | ProdReady',
        description: 'Learn about the most common security, SEO, and code hygiene issues in Next.js and React applications.',
    },
};

export default function VulnerabilitiesPage() {
    const securityRules = getRulesByCategory('security');
    const seoRules = getRulesByCategory('seo');
    const hygieneRules = getRulesByCategory('hygiene');

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

                    <Link href="/#scan">
                        <Button className="bg-primary hover:bg-primary/90">
                            Scan Your Repo
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Code Vulnerabilities Guide</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
                        The most common security, SEO, and code hygiene issues we find in Next.js and React applications.
                        Click any issue to learn how to fix it.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Badge className="bg-zinc-800 text-zinc-300">
                            50+ Issues Covered
                        </Badge>
                    </div>
                </div>

                {/* Security Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <Shield className="w-6 h-6 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Security Vulnerabilities</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {securityRules.map((rule) => (
                            <VulnerabilityCard key={rule.id} rule={rule} />
                        ))}
                    </div>
                </section>

                {/* SEO Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Search className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">SEO Issues</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {seoRules.map((rule) => (
                            <VulnerabilityCard key={rule.id} rule={rule} />
                        ))}
                    </div>
                </section>

                {/* Hygiene Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <Code2 className="w-6 h-6 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Code Hygiene</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hygieneRules.map((rule) => (
                            <VulnerabilityCard key={rule.id} rule={rule} />
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="glass rounded-2xl p-8 text-center glow">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Check Your Repository for These Issues
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Our free scanner checks for all 50+ vulnerabilities automatically in seconds.
                    </p>
                    <Link href="/#scan">
                        <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                            Scan Your Repository Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

function VulnerabilityCard({ rule }: { rule: typeof inspectionRules[0] }) {
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

    return (
        <Link href={`/vulnerabilities/${rule.slug}`}>
            <div className="glass rounded-xl p-5 hover:bg-white/5 transition-all border border-transparent hover:border-primary/30 cursor-pointer group">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                        {rule.title}
                    </h3>
                    <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                        {getSeverityIcon(rule.severity)}
                        <span className="ml-1 capitalize">{rule.severity}</span>
                    </Badge>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2">{rule.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read fix guide</span>
                    <ArrowRight className="w-3 h-3" />
                </div>
            </div>
        </Link>
    );
}
