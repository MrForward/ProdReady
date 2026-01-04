import { Hero } from '@/components/landing/hero';
import { AlertBanner } from '@/components/landing/alert-banner';
import { TrustBar } from '@/components/landing/trust-bar';
import { RepoInput } from '@/components/landing/repo-input';
import { WhyDifferent } from '@/components/landing/why-different';
import { VoteAutofix } from '@/components/landing/vote-autofix';
import { FeaturedBlogs } from '@/components/landing/featured-blogs';
import { FinalCTA } from '@/components/landing/final-cta';
import { MobileNav } from '@/components/ui/mobile-nav';
import {
  Shield,
  Zap,
  Search,
  ArrowRight,
  Github,
  Sparkles,
  FileCheck,
  Twitter,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-white">ProdReady</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/vulnerabilities"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Guides
            </Link>
            <Link
              href="/blog"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Blog
            </Link>
            <a
              href="https://github.com/prodready/prodready"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors hidden sm:flex"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Star</span>
              <Star className="w-3 h-3 text-amber-400" />
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Alert Banner */}
      <div className="pt-16">
        <AlertBanner />
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Trust Bar */}
      <TrustBar />

      {/* Repo Input Section */}
      <RepoInput />

      {/* How It Works Section */}
      <section className="py-24 px-4 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              From URL to actionable report in under a minute. No setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard
              number="01"
              icon={<Github className="w-6 h-6" />}
              title="Paste Your URL"
              description="Any public GitHub repository. Works with React, Vue, Node, Python, and more."
            />
            <StepCard
              number="02"
              icon={<Zap className="w-6 h-6" />}
              title="Instant Scan"
              description="50+ security, SEO, and code quality checks run automatically."
            />
            <StepCard
              number="03"
              icon={<FileCheck className="w-6 h-6" />}
              title="Get Report"
              description="See every issue with severity, location, and step-by-step fix guide."
            />
            <StepCard
              number="04"
              icon={<Sparkles className="w-6 h-6" />}
              title="Auto-Fix"
              description="One-click AI fixing coming soon. Vote below for which fix you want first!"
              isComingSoon
            />
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <WhyDifferent />

      {/* What We Check Section */}
      <section className="py-24 px-4 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">50+ Critical Checks</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              From exposed secrets to missing SEO tags — we catch what other tools miss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CheckCategory
              icon={<Shield className="w-6 h-6 text-red-400" />}
              title="Security"
              color="red"
              count="20+"
              checks={[
                'API keys & secrets in code',
                'Hardcoded credentials',
                'XSS vulnerabilities',
                'Exposed .env files',
                'Missing input validation',
                'Insecure dependencies',
              ]}
            />
            <CheckCategory
              icon={<Search className="w-6 h-6 text-blue-400" />}
              title="SEO & Accessibility"
              color="blue"
              count="15+"
              checks={[
                'Missing page metadata',
                'No OpenGraph tags',
                'Images without alt text',
                'Poor semantic HTML',
                'Missing robots.txt',
                'Broken link detection',
              ]}
            />
            <CheckCategory
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Code Quality"
              color="amber"
              count="15+"
              checks={[
                'Debug statements in production',
                'Unused imports & dead code',
                'Unfinished TODO comments',
                'TypeScript type issues',
                'Empty components',
                'Hardcoded values',
              ]}
            />
          </div>

          <div className="text-center mt-10">
            <Link href="/vulnerabilities">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                View all vulnerability guides
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <FeaturedBlogs />

      {/* Vote for Autofix */}
      <VoteAutofix />

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-white">ProdReady</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <Link href="/vulnerabilities" className="hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <a
                href="https://twitter.com/prodready"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/prodready/prodready"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>

            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} ProdReady. Ship with confidence.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
  isComingSoon = false,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isComingSoon?: boolean;
}) {
  return (
    <div className={`relative glass rounded-2xl p-6 transition-colors ${isComingSoon ? 'border border-purple-500/30' : 'hover:bg-white/5'}`}>
      <div className="absolute -top-3 -left-1 text-5xl font-bold text-zinc-800/50">
        {number}
      </div>
      {isComingSoon && (
        <div className="absolute -top-3 right-4 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Coming Soon
        </div>
      )}
      <div className="relative z-10 pt-2">
        <div className={`w-12 h-12 rounded-xl ${isComingSoon ? 'bg-purple-500/10' : 'bg-primary/10'} flex items-center justify-center ${isComingSoon ? 'text-purple-400' : 'text-primary'} mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

function CheckCategory({
  icon,
  title,
  color,
  count,
  checks,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  count: string;
  checks: string[];
}) {
  const borderColor = {
    red: 'border-red-500/30 hover:border-red-500/50',
    blue: 'border-blue-500/30 hover:border-blue-500/50',
    amber: 'border-amber-500/30 hover:border-amber-500/50',
  }[color] || 'border-zinc-500/30';

  const badgeColor = {
    red: 'bg-red-500/10 text-red-400',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
  }[color] || 'bg-zinc-500/10 text-zinc-400';

  return (
    <div className={`glass rounded-2xl p-6 border ${borderColor} transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${badgeColor}`}>
          {count}
        </span>
      </div>
      <ul className="space-y-2">
        {checks.map((check, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="text-primary mt-0.5">✓</span>
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
