import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Calendar, Shield, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Blog post data
const posts: Record<string, {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    content: string;
}> = {
    'why-ai-code-needs-review': {
        title: 'Why AI-Generated Code Needs Human Review',
        excerpt: 'AI coding assistants are powerful, but they make predictable mistakes.',
        date: '2024-12-20',
        readTime: '5 min',
        category: 'Security',
        content: `
AI coding assistants like Cursor, GitHub Copilot, and ChatGPT have revolutionized how we write code. They're fast, they understand context, and they can scaffold entire applications in minutes. But there's a catch: **they consistently make the same types of mistakes**.

## The Problem with "Vibe Coding"

When you're in the flow, prompting your AI assistant and watching code appear like magic, it's easy to skip the review step. We call this "vibe coding" — trusting the AI output and moving on to the next feature.

But AI assistants are trained on code from the internet, which includes:
- Tutorials that prioritize simplicity over security
- Stack Overflow answers optimized for upvotes, not production use
- Outdated patterns from years past

## Common Issues We See

### 1. Hardcoded Secrets
AI assistants often generate examples with placeholder API keys like \`sk_test_xxx\` or environment variables read directly in client-side code. Without proper review, these patterns slip through.

### 2. Missing Input Validation
When scaffolding forms or API routes, AI tends to trust user input implicitly. You get working code, but not secure code.

### 3. Debug Code in Production
Console.logs, TODO comments, and test routes are standard in AI-generated code. They're helpful during development but dangerous in production.

## The Solution

This is why we built ProdReady — a pre-launch checklist for AI-generated codebases. In seconds, it scans your repository for the specific issues that AI coding creates.

Think of it as the experienced developer review that every AI-generated codebase needs, but automated and instant.

## Key Takeaways

1. **AI is a great first draft** — but not a final one
2. **Security issues are predictable** — which means they're catchable
3. **Automated scanning saves time** — and prevents costly mistakes

Ready to see what's hiding in your code? [Scan your repository now](/).
        `,
    },
    'security-mistakes-vibe-coders': {
        title: '5 Security Mistakes Every Vibe Coder Makes',
        excerpt: 'From hardcoded API keys to missing input validation — the common security issues hiding in AI-generated code.',
        date: '2024-12-18',
        readTime: '7 min',
        category: 'Best Practices',
        content: `
We've scanned thousands of repositories and the same issues keep appearing. Here are the top 5 security mistakes that AI-assisted development tends to create.

## 1. Exposed API Keys

The most common and most dangerous. AI assistants often:
- Generate example code with placeholder keys that look real
- Put sensitive configuration in client-side code
- Forget to add \`.env\` to \`.gitignore\`

**The fix:** Always use environment variables. ProdReady scans for patterns like \`sk-\`, \`ghp_\`, \`AWS_\`, and other key formats.

## 2. Debug Routes Left Behind

That \`/api/test\` route or \`/debug\` page seemed harmless during development. In production, it's a security hole.

**The fix:** Search your codebase for "test", "debug", "temp", and "mock" before deploying.

## 3. Missing Input Validation

AI-generated forms often work perfectly — with valid input. But what happens with malicious input?

\`\`\`typescript
// AI-generated (vulnerable)
const user = req.body.user;
await db.query(\`SELECT * FROM users WHERE name = '\${user}'\`);

// Should be
const user = sanitize(req.body.user);
await db.query('SELECT * FROM users WHERE name = ?', [user]);
\`\`\`

## 4. dangerouslySetInnerHTML Usage

React's escape hatch for raw HTML is appropriately named — it's dangerous. AI assistants use it liberally.

**The fix:** Replace with safer alternatives or properly sanitize content with DOMPurify.

## 5. target="_blank" Without rel="noopener"

A subtle security issue that allows opened pages to access your page's \`window.opener\` object.

**The fix:** Always add \`rel="noopener noreferrer"\` to external links.

## Catch These Issues Automatically

Instead of manually checking for each of these issues, [run a ProdReady scan](/) on your repository. It takes seconds and catches all 50+ common issues.
        `,
    },
    'pre-launch-checklist': {
        title: 'The Pre-Launch Checklist That Saved Our App',
        excerpt: 'How a 10-minute security scan prevented what could have been a costly data breach.',
        date: '2024-12-15',
        readTime: '4 min',
        category: 'Case Study',
        content: `
Last month, we almost shipped a Stripe secret key to production. Here's what happened and what we learned.

## The Setup

We were building a SaaS application using Next.js. Like many teams in 2024, we were using AI coding assistants heavily — probably 60% of our code was AI-generated or AI-assisted.

Development was moving fast. We were about to launch.

## The Discovery

On a whim, we decided to run our own tool (ProdReady) on our codebase before deploying. Within 30 seconds, it flagged something terrifying:

> **Critical: Exposed API Key Detected**
> File: \`src/lib/stripe.ts\`
> Line: 14
> Pattern matched: \`sk_live_\` prefix

Someone had pasted a live Stripe secret key directly into the code while testing. The AI assistant had helpfully used it in the example. And it was about to be deployed.

## The Impact

If this had shipped:
- Our Stripe key would have been in our public GitHub repository
- Anyone could have made charges on our account
- Customer payment data could have been at risk

**Estimated potential damage: Anywhere from $10K to catastrophic**

## The Fix

We immediately:
1. Rotated the Stripe key
2. Added proper environment variable usage
3. Updated our \`.gitignore\`
4. Made ProdReady scans a required step in our CI/CD pipeline

## The Lesson

It's not about blaming AI assistants or blaming developers. It's about having a safety net.

**AI coding is powerful, but it's a first draft.** You need a final check before shipping — something that catches the predictable mistakes that happen when you're moving fast.

## Your Pre-Launch Checklist

Before every deploy, ask:
1. ✅ Have I scanned for exposed secrets?
2. ✅ Are all debug routes removed?
3. ✅ Is user input validated?
4. ✅ Are there console.logs in production code?
5. ✅ Is SEO metadata in place?

Or just run a [ProdReady scan](/) and check all boxes at once.
        `,
    },
    'seo-for-developers': {
        title: 'SEO for Developers: What Your IDE Doesn\'t Tell You',
        excerpt: 'Meta tags, OpenGraph, semantic HTML — the SEO essentials that AI coding assistants often miss.',
        date: '2024-12-12',
        readTime: '6 min',
        category: 'SEO',
        content: `
Most developers don't think about SEO until marketing asks, "Why aren't we ranking?" By then, it's often too late.

## The Problem

AI coding assistants are great at building functionality, but they often skip:
- Meta tags and page titles
- OpenGraph images for social sharing
- Semantic HTML structure
- Alt text for images
- robots.txt and sitemap.xml

These aren't just nice-to-haves. They're the difference between being discovered and being invisible.

## Essential SEO for Every Page

### 1. Metadata
In Next.js, every page should export metadata:

\`\`\`typescript
export const metadata = {
  title: 'Your Page Title | Brand',
  description: 'A compelling description under 160 characters',
};
\`\`\`

### 2. OpenGraph Tags
When someone shares your link on Twitter or LinkedIn:

\`\`\`typescript
export const metadata = {
  openGraph: {
    title: 'Your Share Title',
    description: 'What appears in the social preview',
    images: ['/og-image.png'],
  },
};
\`\`\`

### 3. Semantic HTML
Replace \`<div>\` with appropriate elements:
- \`<main>\` for primary content
- \`<article>\` for blog posts
- \`<nav>\` for navigation
- \`<header>\` and \`<footer>\` appropriately

### 4. Image Alt Text
Every \`<img>\` and Next.js \`<Image>\` needs an \`alt\` attribute. Not just for SEO — for accessibility.

## Check Your SEO Automatically

ProdReady scans for 15+ SEO issues including missing metadata, default favicons, and broken semantic structure.

[Scan your site now →](/)
        `,
    },
    'code-hygiene-matters': {
        title: 'Why Code Hygiene Matters More Than You Think',
        excerpt: 'Console.logs in production, unused imports, and TODO comments — small issues that signal bigger problems.',
        date: '2024-12-10',
        readTime: '4 min',
        category: 'Code Quality',
        content: `
"It's just a console.log, what's the worst that could happen?"

Actually, quite a lot.

## The Hidden Costs of Poor Hygiene

### 1. Security Risks
Console.log statements can leak sensitive information:
- User data
- API responses
- Internal state

Browser developer tools are accessible to anyone. Your debug logs are too.

### 2. Performance Impact
- Unused imports increase bundle size
- Console statements add runtime overhead
- Dead code confuses treeshaking

### 3. Maintainability
When you see a codebase with TODO comments from 2 years ago, what does it tell you? That issues are ignored, corners are cut, and the codebase isn't maintained.

## Common Hygiene Issues

1. **console.log, console.warn, console.error** — Remove or replace with proper logging
2. **Unused imports** — Delete them
3. **TODO/FIXME/HACK comments** — Resolve or remove
4. **Hardcoded colors** — Use a design system
5. **TypeScript \`any\`** — Type it properly
6. **Empty components** — Delete or implement

## Make It Automatic

Don't rely on manual review to catch these issues. They're easily automated.

ProdReady scans for 15+ hygiene issues and gives you exact file paths and line numbers.

[Clean up your codebase →](/)
        `,
    },
};

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = posts[slug];

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: `${post.title} | ProdReady Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = posts[slug];

    if (!post) {
        notFound();
    }

    // Simple markdown-like rendering
    const renderContent = (content: string) => {
        return content
            .split('\n\n')
            .map((block, index) => {
                // Headers
                if (block.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{block.slice(3)}</h2>;
                }
                if (block.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{block.slice(4)}</h3>;
                }

                // Code blocks
                if (block.startsWith('```')) {
                    const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
                    if (match) {
                        return (
                            <pre key={index} className="my-4 p-4 bg-zinc-900 rounded-lg overflow-x-auto">
                                <code className="text-sm font-mono text-zinc-300">{match[2].trim()}</code>
                            </pre>
                        );
                    }
                }

                // Blockquotes
                if (block.startsWith('> ')) {
                    return (
                        <blockquote key={index} className="my-4 pl-4 border-l-4 border-primary text-white font-medium italic">
                            {block.slice(2)}
                        </blockquote>
                    );
                }

                // Lists
                if (block.match(/^[-\d]./)) {
                    const items = block.split('\n');
                    return (
                        <ul key={index} className="my-4 space-y-2">
                            {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-zinc-300">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{item.replace(/^[-\d.]\s*/, '')}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }

                // Regular paragraphs with formatting
                return (
                    <p key={index} className="text-zinc-300 leading-relaxed my-4"
                        dangerouslySetInnerHTML={{
                            __html: block
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                .replace(/\`([^\`]+)\`/g, '<code class="px-1.5 py-0.5 bg-zinc-800 rounded text-primary font-mono text-sm">$1</code>')
                                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                        }}
                    />
                );
            });
    };

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

            <article className="max-w-3xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <Link href="/blog" className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to blog
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                        {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-500">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                    {post.title}
                </h1>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                    {renderContent(post.content)}
                </div>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-zinc-800">
                    <p className="text-sm text-zinc-500 mb-4">Share this article</p>
                    <div className="flex items-center gap-3">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://prodready.dev/blog/${slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://prodready.dev/blog/${slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 glass rounded-2xl p-8 text-center glow">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Ready to Scan Your Code?
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Find these issues in your codebase automatically.
                    </p>
                    <Link href="/#scan">
                        <Button className="bg-primary hover:bg-primary/90">
                            Scan Repository Free
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </article>
        </main>
    );
}
