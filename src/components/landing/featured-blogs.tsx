import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export function FeaturedBlogs() {
    const posts = [
        {
            slug: 'why-ai-code-needs-review',
            title: 'Why AI-Generated Code Still Needs a Human (or AI) Review',
            excerpt: 'AI assistants are powerful but make predictable mistakes. Learn the patterns.',
            readTime: '5 min read',
            category: 'Security',
        },
        {
            slug: 'security-mistakes-vibe-coders',
            title: '5 Security Mistakes Every Vibe Coder Makes (And How to Fix Them)',
            excerpt: 'The most common security issues hiding in AI-generated code bases.',
            readTime: '7 min read',
            category: 'Best Practices',
        },
        {
            slug: 'pre-launch-checklist',
            title: 'The Pre-Launch Checklist That Saved Our Startup',
            excerpt: 'How a 5-minute code scan prevented a data breach before launch.',
            readTime: '4 min read',
            category: 'Case Study',
        },
    ];

    return (
        <section className="py-24 px-4 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">
                            <span className="gradient-text">Learn</span>
                        </h2>
                        <p className="text-zinc-400">Best practices for shipping secure code</p>
                    </div>
                    <Link
                        href="/blog"
                        className="text-primary hover:underline flex items-center gap-1"
                    >
                        All articles <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group glass rounded-2xl p-6 border border-transparent hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
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
                            <p className="text-sm text-zinc-400">
                                {post.excerpt}
                            </p>
                            <div className="mt-4 text-sm text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Read article <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
