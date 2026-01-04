import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Blog - ProdReady',
    description: 'Learn about code security, SEO best practices, and how to ship production-ready code. Tips for developers building with AI coding assistants.',
};

const posts = [
    {
        slug: 'why-ai-code-needs-review',
        title: 'Why AI-Generated Code Needs Human Review',
        excerpt: 'AI coding assistants are powerful, but they make predictable mistakes. Here\'s what to look for and how to catch issues before they reach production.',
        date: '2024-12-20',
        readTime: '5 min',
        category: 'Security',
        featured: true,
    },
    {
        slug: 'security-mistakes-vibe-coders',
        title: '5 Security Mistakes Every Vibe Coder Makes',
        excerpt: 'From hardcoded API keys to missing input validation — the common security issues hiding in AI-generated code and how to fix them.',
        date: '2024-12-18',
        readTime: '7 min',
        category: 'Best Practices',
        featured: true,
    },
    {
        slug: 'pre-launch-checklist',
        title: 'The Pre-Launch Checklist That Saved Our App',
        excerpt: 'How a 10-minute security scan prevented what could have been a costly data breach. A case study in proactive code auditing.',
        date: '2024-12-15',
        readTime: '4 min',
        category: 'Case Study',
        featured: true,
    },
    {
        slug: 'seo-for-developers',
        title: 'SEO for Developers: What Your IDE Doesn\'t Tell You',
        excerpt: 'Meta tags, OpenGraph, semantic HTML — the SEO essentials that AI coding assistants often miss and how to implement them correctly.',
        date: '2024-12-12',
        readTime: '6 min',
        category: 'SEO',
    },
    {
        slug: 'code-hygiene-matters',
        title: 'Why Code Hygiene Matters More Than You Think',
        excerpt: 'Console.logs in production, unused imports, and TODO comments — small issues that signal bigger problems.',
        date: '2024-12-10',
        readTime: '4 min',
        category: 'Code Quality',
    },
];

export default function BlogPage() {
    const featuredPosts = posts.filter(p => p.featured);
    const regularPosts = posts.filter(p => !p.featured);

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
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="mb-16">
                    <Link href="/" className="text-sm text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl">
                        Learn about code security, SEO, and best practices for shipping production-ready code.
                    </p>
                </div>

                {/* Featured Posts */}
                <section className="mb-16">
                    <h2 className="text-lg font-semibold text-zinc-400 uppercase tracking-wider mb-6">
                        Featured Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group glass rounded-2xl p-6 border border-transparent hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                                        {post.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Clock className="w-3 h-3" />
                                        {post.readTime}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-zinc-400 mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="text-sm text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* All Posts */}
                {regularPosts.length > 0 && (
                    <section>
                        <h2 className="text-lg font-semibold text-zinc-400 uppercase tracking-wider mb-6">
                            More Articles
                        </h2>
                        <div className="space-y-4">
                            {regularPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group flex items-center justify-between gap-4 glass rounded-xl p-4 border border-transparent hover:border-primary/30 transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-zinc-500">{post.readTime}</span>
                                        </div>
                                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <div className="mt-16 glass rounded-2xl p-8 text-center glow">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Scan Your Code?
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Find security vulnerabilities, SEO issues, and code smells in seconds.
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
