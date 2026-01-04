import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRuleBySlug, getAllSlugs, RuleData } from '@/data/inspection-rules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Search,
    Code2,
    ArrowLeft,
    ArrowRight,
    AlertTriangle,
    AlertCircle,
    Info,
    Wrench,
    CheckCircle2,
    Scan,
} from 'lucide-react';

interface VulnerabilityPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: VulnerabilityPageProps): Promise<Metadata> {
    const { slug } = await params;
    const rule = getRuleBySlug(slug);

    if (!rule) {
        return {
            title: 'Vulnerability Not Found | ProdReady',
        };
    }

    return {
        title: rule.seoTitle,
        description: rule.seoDescription,
        openGraph: {
            title: rule.seoTitle,
            description: rule.seoDescription,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: rule.seoTitle,
            description: rule.seoDescription,
        },
    };
}

export default async function VulnerabilityPage({ params }: VulnerabilityPageProps) {
    const { slug } = await params;
    const rule = getRuleBySlug(slug);

    if (!rule) {
        notFound();
    }

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
                            <Scan className="w-4 h-4 mr-2" />
                            Scan Your Repo
                        </Button>
                    </Link>
                </div>
            </header>

            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
                    <Link href="/vulnerabilities" className="hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        All Vulnerabilities
                    </Link>
                    <span>/</span>
                    <span className="text-zinc-300">{rule.title}</span>
                </div>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <CategoryIcon category={rule.category} />
                        <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                            <SeverityIcon severity={rule.severity} />
                            <span className="ml-1 capitalize">{rule.severity}</span>
                        </Badge>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 capitalize">
                            {rule.category}
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {rule.title}
                    </h1>
                    <p className="text-xl text-zinc-400">
                        {rule.description}
                    </p>
                </header>

                {/* Why This Is Bad */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-semibold text-white">Why This Is Bad</h2>
                    </div>
                    <div className="glass rounded-xl p-6 border border-amber-500/20">
                        <p className="text-amber-200 text-lg leading-relaxed">
                            {rule.whyBad}
                        </p>
                    </div>
                </section>

                {/* How To Fix */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Wrench className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-semibold text-white">How To Fix</h2>
                    </div>
                    <div className="glass rounded-xl p-6 border border-emerald-500/20">
                        <FixGuideContent content={rule.manualFixGuide} />
                    </div>
                </section>

                {/* When You Pass */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-semibold text-white">When You Pass This Check</h2>
                    </div>
                    <div className="glass rounded-xl p-6 border border-emerald-500/20 bg-emerald-500/5">
                        <p className="text-emerald-300 text-lg">
                            {rule.appreciation}
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="glass rounded-2xl p-8 text-center glow">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Check If Your Repo Has This Issue
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Our free scanner will detect this and 17 other common issues in your codebase.
                    </p>
                    <Link href="/#scan">
                        <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                            <Scan className="w-5 h-5 mr-2" />
                            Scan Your Repository Free
                        </Button>
                    </Link>
                </section>

                {/* Navigation */}
                <nav className="mt-12 pt-8 border-t border-zinc-800">
                    <div className="flex justify-between">
                        <Link
                            href="/vulnerabilities"
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All Vulnerabilities
                        </Link>
                        <Link
                            href="/#scan"
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                            Scan Your Repo
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </nav>
            </article>
        </main>
    );
}

function CategoryIcon({ category }: { category: string }) {
    const iconClass = "w-8 h-8 p-1.5 rounded-lg";

    switch (category) {
        case 'security':
            return (
                <div className={`${iconClass} bg-red-500/10`}>
                    <Shield className="w-full h-full text-red-400" />
                </div>
            );
        case 'seo':
            return (
                <div className={`${iconClass} bg-blue-500/10`}>
                    <Search className="w-full h-full text-blue-400" />
                </div>
            );
        case 'hygiene':
            return (
                <div className={`${iconClass} bg-amber-500/10`}>
                    <Code2 className="w-full h-full text-amber-400" />
                </div>
            );
        default:
            return null;
    }
}

function SeverityIcon({ severity }: { severity: string }) {
    switch (severity) {
        case 'critical':
            return <AlertTriangle className="w-4 h-4" />;
        case 'high':
            return <AlertCircle className="w-4 h-4" />;
        default:
            return <Info className="w-4 h-4" />;
    }
}

function getSeverityColor(severity: string) {
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
}

function FixGuideContent({ content }: { content: string }) {
    // Parse markdown-style code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="prose prose-invert prose-sm max-w-none">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
                    if (match) {
                        const [, lang, code] = match;
                        return (
                            <div key={index} className="my-4">
                                <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 rounded-t-lg border-b border-zinc-700">
                                    <span className="text-xs font-mono text-zinc-400">
                                        {lang || 'code'}
                                    </span>
                                </div>
                                <pre className="p-4 bg-zinc-900 rounded-b-lg overflow-x-auto m-0">
                                    <code className="text-sm font-mono text-zinc-300 whitespace-pre-wrap">
                                        {code.trim()}
                                    </code>
                                </pre>
                            </div>
                        );
                    }
                }

                // Split by newlines and render paragraphs
                return part.split('\n\n').map((paragraph, pIndex) => (
                    <p key={`${index}-${pIndex}`} className="text-zinc-300 leading-relaxed mb-4">
                        {paragraph}
                    </p>
                ));
            })}
        </div>
    );
}
