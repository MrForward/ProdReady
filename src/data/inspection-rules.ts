// Inspection Rules Data - Used for programmatic SEO pages

import { securityRules } from '@/lib/scanner/rules/security';
import { seoRules } from '@/lib/scanner/rules/seo';
import { hygieneRules } from '@/lib/scanner/rules/hygiene';

export interface RuleData {
    id: string;
    slug: string;
    category: 'security' | 'seo' | 'hygiene';
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    whyBad: string;
    manualFixGuide: string;
    appreciation: string;
    seoTitle: string;
    seoDescription: string;
}

// Convert rules to SEO-friendly format
export const inspectionRules: RuleData[] = [
    // Security Rules
    {
        id: 'secret-scanning',
        slug: 'exposed-api-keys',
        category: 'security',
        severity: 'critical',
        title: 'Exposed API Keys or Secrets',
        description: 'Detects hardcoded API keys, tokens, and secrets in your codebase that could be exploited by attackers.',
        whyBad: securityRules[0].whyBad,
        manualFixGuide: securityRules[0].manualFixGuide,
        appreciation: securityRules[0].appreciation,
        seoTitle: 'How to Fix Exposed API Keys in Next.js | ProdReady',
        seoDescription: 'Learn how to detect and fix exposed API keys in your Next.js application. Protect your OpenAI, Stripe, and AWS credentials from hackers.',
    },
    {
        id: 'debug-routes',
        slug: 'debug-routes-production',
        category: 'security',
        severity: 'high',
        title: 'Debug Routes in Production',
        description: 'Finds test, debug, and mock API routes that should not exist in production.',
        whyBad: securityRules[1].whyBad,
        manualFixGuide: securityRules[1].manualFixGuide,
        appreciation: securityRules[1].appreciation,
        seoTitle: 'Remove Debug Routes from Production in Next.js | ProdReady',
        seoDescription: 'Detect and remove test, debug, and mock routes from your Next.js production build. Prevent security vulnerabilities.',
    },
    {
        id: 'dangerous-html',
        slug: 'dangerous-html-injection',
        category: 'security',
        severity: 'high',
        title: 'Dangerous HTML Injection (XSS)',
        description: 'Detects usage of dangerouslySetInnerHTML which can lead to Cross-Site Scripting attacks.',
        whyBad: securityRules[2].whyBad,
        manualFixGuide: securityRules[2].manualFixGuide,
        appreciation: securityRules[2].appreciation,
        seoTitle: 'Fix dangerouslySetInnerHTML XSS Vulnerability in React | ProdReady',
        seoDescription: 'Learn how to safely use dangerouslySetInnerHTML in React and Next.js applications. Prevent XSS attacks with DOMPurify.',
    },
    {
        id: 'public-env',
        slug: 'env-file-exposed',
        category: 'security',
        severity: 'critical',
        title: 'Environment File Not Gitignored',
        description: 'Checks if .env files are properly excluded from git to prevent credential exposure.',
        whyBad: securityRules[3].whyBad,
        manualFixGuide: securityRules[3].manualFixGuide,
        appreciation: securityRules[3].appreciation,
        seoTitle: 'How to Gitignore .env Files in Next.js | ProdReady',
        seoDescription: 'Prevent your .env files from being pushed to GitHub. Learn the correct .gitignore configuration for Next.js projects.',
    },
    {
        id: 'input-validation',
        slug: 'missing-input-validation',
        category: 'security',
        severity: 'medium',
        title: 'Missing Input Validation',
        description: 'Finds form inputs without proper validation attributes that could be exploited.',
        whyBad: securityRules[4].whyBad,
        manualFixGuide: securityRules[4].manualFixGuide,
        appreciation: securityRules[4].appreciation,
        seoTitle: 'Add Input Validation to React Forms | ProdReady',
        seoDescription: 'Learn how to add proper validation to your React form inputs. Prevent bot attacks and database overflow.',
    },
    {
        id: 'target-blank-risk',
        slug: 'unsafe-external-links',
        category: 'security',
        severity: 'medium',
        title: 'Unsafe External Links',
        description: 'Detects links with target="_blank" that are missing rel="noopener noreferrer".',
        whyBad: securityRules[5].whyBad,
        manualFixGuide: securityRules[5].manualFixGuide,
        appreciation: securityRules[5].appreciation,
        seoTitle: 'Fix Tabnabbing Vulnerability in React Links | ProdReady',
        seoDescription: 'Learn why target="_blank" is dangerous without rel="noopener" and how to fix it in your React app.',
    },

    // SEO Rules
    {
        id: 'metadata-existence',
        slug: 'missing-metadata-nextjs',
        category: 'seo',
        severity: 'high',
        title: 'Missing Page Metadata',
        description: 'Checks for proper metadata exports in Next.js pages and layouts.',
        whyBad: seoRules[0].whyBad,
        manualFixGuide: seoRules[0].manualFixGuide,
        appreciation: seoRules[0].appreciation,
        seoTitle: 'How to Add Metadata to Next.js 14 Pages | ProdReady',
        seoDescription: 'Learn how to add SEO metadata to your Next.js 14 App Router pages. Improve your Google search rankings.',
    },
    {
        id: 'opengraph-tags',
        slug: 'missing-opengraph-social',
        category: 'seo',
        severity: 'medium',
        title: 'Missing OpenGraph Tags',
        description: 'Checks for OpenGraph configuration for social media previews.',
        whyBad: seoRules[1].whyBad,
        manualFixGuide: seoRules[1].manualFixGuide,
        appreciation: seoRules[1].appreciation,
        seoTitle: 'Add OpenGraph Tags to Next.js for Social Previews | ProdReady',
        seoDescription: 'Fix broken social media previews on Twitter, Facebook, and LinkedIn. Add OpenGraph tags to your Next.js app.',
    },
    {
        id: 'image-alt-text',
        slug: 'missing-alt-text-accessibility',
        category: 'seo',
        severity: 'medium',
        title: 'Images Missing Alt Text',
        description: 'Finds images without alt attributes, which hurts accessibility and SEO.',
        whyBad: seoRules[2].whyBad,
        manualFixGuide: seoRules[2].manualFixGuide,
        appreciation: seoRules[2].appreciation,
        seoTitle: 'Add Alt Text to Images in React and Next.js | ProdReady',
        seoDescription: 'Make your React app accessible by adding alt text to all images. Improve SEO and help screen reader users.',
    },
    {
        id: 'semantic-html',
        slug: 'semantic-html-seo',
        category: 'seo',
        severity: 'low',
        title: 'Poor Semantic HTML Structure',
        description: 'Detects excessive div usage and missing semantic HTML elements.',
        whyBad: seoRules[3].whyBad,
        manualFixGuide: seoRules[3].manualFixGuide,
        appreciation: seoRules[3].appreciation,
        seoTitle: 'Use Semantic HTML in React for Better SEO | ProdReady',
        seoDescription: 'Replace div soup with semantic HTML elements like main, section, and article. Improve SEO and accessibility.',
    },
    {
        id: 'robots-sitemap',
        slug: 'missing-robots-sitemap',
        category: 'seo',
        severity: 'medium',
        title: 'Missing robots.txt or sitemap.xml',
        description: 'Checks for essential SEO files that help search engines crawl your site.',
        whyBad: seoRules[4].whyBad,
        manualFixGuide: seoRules[4].manualFixGuide,
        appreciation: seoRules[4].appreciation,
        seoTitle: 'Add robots.txt and sitemap.xml to Next.js | ProdReady',
        seoDescription: 'Create robots.txt and sitemap.xml for your Next.js app. Help Google find and index all your pages.',
    },
    {
        id: 'favicon-check',
        slug: 'default-favicon-branding',
        category: 'seo',
        severity: 'low',
        title: 'Default or Missing Favicon',
        description: 'Detects if the site is using the default Next.js/Vercel favicon.',
        whyBad: seoRules[5].whyBad,
        manualFixGuide: seoRules[5].manualFixGuide,
        appreciation: seoRules[5].appreciation,
        seoTitle: 'Replace Default Favicon in Next.js | ProdReady',
        seoDescription: 'Remove the default Vercel favicon and add your own brand icon. Improve recognition in browser tabs.',
    },

    // Hygiene Rules
    {
        id: 'console-logs',
        slug: 'console-log-pollution',
        category: 'hygiene',
        severity: 'low',
        title: 'Console Logs in Production',
        description: 'Finds console.log statements that should be removed before production.',
        whyBad: hygieneRules[0].whyBad,
        manualFixGuide: hygieneRules[0].manualFixGuide,
        appreciation: hygieneRules[0].appreciation,
        seoTitle: 'Remove console.log from Production React Code | ProdReady',
        seoDescription: 'Clean up console.log statements before deploying your React app. Use proper logging instead.',
    },
    {
        id: 'zombie-imports',
        slug: 'unused-imports-cleanup',
        category: 'hygiene',
        severity: 'low',
        title: 'Unused Imports',
        description: 'Detects imports that are defined but never used in the file.',
        whyBad: hygieneRules[1].whyBad,
        manualFixGuide: hygieneRules[1].manualFixGuide,
        appreciation: hygieneRules[1].appreciation,
        seoTitle: 'Remove Unused Imports in TypeScript and React | ProdReady',
        seoDescription: 'Clean up zombie imports in your React codebase. Reduce bundle size and improve performance.',
    },
    {
        id: 'todo-comments',
        slug: 'todo-comments-cleanup',
        category: 'hygiene',
        severity: 'low',
        title: 'Unresolved TODO Comments',
        description: 'Finds TODO, FIXME, and HACK comments that indicate incomplete work.',
        whyBad: hygieneRules[2].whyBad,
        manualFixGuide: hygieneRules[2].manualFixGuide,
        appreciation: hygieneRules[2].appreciation,
        seoTitle: 'Find and Resolve TODO Comments Before Launch | ProdReady',
        seoDescription: 'Scan your codebase for unfinished TODOs and FIXMEs. Complete all pending work before deployment.',
    },
    {
        id: 'hardcoded-colors',
        slug: 'hardcoded-colors-design',
        category: 'hygiene',
        severity: 'low',
        title: 'Hardcoded Color Values',
        description: 'Finds hex color codes used directly instead of design tokens or Tailwind classes.',
        whyBad: hygieneRules[3].whyBad,
        manualFixGuide: hygieneRules[3].manualFixGuide,
        appreciation: hygieneRules[3].appreciation,
        seoTitle: 'Replace Hardcoded Colors with Tailwind CSS | ProdReady',
        seoDescription: 'Fix hardcoded hex colors in your React app. Use Tailwind CSS classes for consistent dark mode support.',
    },
    {
        id: 'any-types',
        slug: 'typescript-any-unsafe',
        category: 'hygiene',
        severity: 'medium',
        title: 'TypeScript "any" Usage',
        description: 'Detects usage of the "any" type which disables TypeScript safety.',
        whyBad: hygieneRules[4].whyBad,
        manualFixGuide: hygieneRules[4].manualFixGuide,
        appreciation: hygieneRules[4].appreciation,
        seoTitle: 'Replace TypeScript any with Proper Types | ProdReady',
        seoDescription: 'Fix unsafe "any" types in your TypeScript codebase. Use interfaces and type guards instead.',
    },
    {
        id: 'empty-components',
        slug: 'empty-components-waste',
        category: 'hygiene',
        severity: 'low',
        title: 'Empty or Null Components',
        description: 'Finds React components that return null or empty fragments.',
        whyBad: hygieneRules[5].whyBad,
        manualFixGuide: hygieneRules[5].manualFixGuide,
        appreciation: hygieneRules[5].appreciation,
        seoTitle: 'Remove Empty React Components | ProdReady',
        seoDescription: 'Find and delete React components that return null or empty fragments. Clean up abandoned code.',
    },
];

export function getRuleBySlug(slug: string): RuleData | undefined {
    return inspectionRules.find(r => r.slug === slug);
}

export function getAllSlugs(): string[] {
    return inspectionRules.map(r => r.slug);
}

export function getRulesByCategory(category: 'security' | 'seo' | 'hygiene'): RuleData[] {
    return inspectionRules.filter(r => r.category === category);
}
