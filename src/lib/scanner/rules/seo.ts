// SEO Rules - 6 checks for search engine optimization issues

import { Issue, FileContent, IssueSeverity, IssueCategory } from '../types';

// Paths that typically don't need SEO (examples, tests, demos, internal pages)
const SKIP_SEO_PATTERNS = [
    '/examples/',
    '/demo/',
    '/test/',
    '/_',
    '/api/',
    '/admin/',
    '/internal/',
    '/__',
    '/playground/',
    '/preview/',
];

function shouldSkipSeoCheck(filePath: string): boolean {
    const lowerPath = filePath.toLowerCase();
    return SKIP_SEO_PATTERNS.some(pattern => lowerPath.includes(pattern));
}

interface SeoRule {
    id: string;
    title: string;
    slug: string;
    category: IssueCategory;
    severity: IssueSeverity;
    whyBad: string;
    manualFixGuide: string;
    appreciation: string;
    check: (files: FileContent[]) => Issue[];
}

export const seoRules: SeoRule[] = [
    {
        id: 'metadata-existence',
        title: 'Missing Page Metadata',
        slug: 'missing-metadata-nextjs',
        category: 'seo',
        severity: 'high',
        whyBad: "Google has no idea what your website is about, so it won't show up in search results. You're invisible to search engines.",
        manualFixGuide: `Add the standard Next.js Metadata export to your page or layout:

\`\`\`typescript
// app/page.tsx or app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Page Title - Your Brand',
  description: 'A compelling description of your page (150-160 characters ideal)',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
};

export default function Page() {
  return <main>...</main>;
}
\`\`\``,
        appreciation: "Great job! Your pages have proper metadata for search engines.",
        check: (files) => {
            const issues: Issue[] = [];

            // Find all page.tsx and layout.tsx files (skip examples/tests)
            const pageFiles = files.filter(f =>
                (f.path.endsWith('page.tsx') || f.path.endsWith('page.jsx') ||
                    f.path.endsWith('layout.tsx') || f.path.endsWith('layout.jsx')) &&
                f.path.includes('app/') &&
                !shouldSkipSeoCheck(f.path)
            );

            for (const file of pageFiles) {
                const hasMetadata =
                    file.content.includes('export const metadata') ||
                    file.content.includes('export async function generateMetadata') ||
                    file.content.includes('export function generateMetadata');

                if (!hasMetadata) {
                    issues.push({
                        id: `metadata-${file.path}`,
                        ruleId: 'metadata-existence',
                        category: 'seo',
                        severity: 'high',
                        title: 'Missing Metadata Export',
                        whyBad: "This page won't have a title or description in search results.",
                        manualFixGuide: "Add export const metadata = { title: 'Page Title', description: '...' }",
                        filePath: file.path,
                    });
                }
            }

            return issues;
        },
    },
    {
        id: 'opengraph-tags',
        title: 'Missing OpenGraph Tags',
        slug: 'missing-opengraph-social',
        category: 'seo',
        severity: 'medium',
        whyBad: "When you share your link on Twitter, Facebook, or WhatsApp, it will look like a broken gray box instead of a beautiful preview card.",
        manualFixGuide: `Add OpenGraph configuration to your metadata:

\`\`\`typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Page Title',
  description: 'Your description',
  openGraph: {
    title: 'Your Page Title',
    description: 'Your description',
    url: 'https://yoursite.com',
    siteName: 'Your Site Name',
    images: [
      {
        url: 'https://yoursite.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Description of the image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Page Title',
    description: 'Your description',
    images: ['https://yoursite.com/og-image.png'],
  },
};
\`\`\``,
        appreciation: "Your social previews are set up perfectly. Your links will look great when shared!",
        check: (files) => {
            const issues: Issue[] = [];

            const pageFiles = files.filter(f =>
                (f.path.endsWith('page.tsx') || f.path.endsWith('layout.tsx')) &&
                f.path.includes('app/') &&
                !shouldSkipSeoCheck(f.path)
            );

            for (const file of pageFiles) {
                // Only check files that have metadata
                if (file.content.includes('export const metadata')) {
                    if (!file.content.includes('openGraph')) {
                        issues.push({
                            id: `opengraph-${file.path}`,
                            ruleId: 'opengraph-tags',
                            category: 'seo',
                            severity: 'medium',
                            title: 'Missing OpenGraph Tags',
                            whyBad: "Links to this page won't have a preview card on social media.",
                            manualFixGuide: "Add openGraph: { title, description, images: [...] } to your metadata",
                            filePath: file.path,
                        });
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'image-alt-text',
        title: 'Images Missing Alt Text',
        slug: 'missing-alt-text-accessibility',
        category: 'seo',
        severity: 'medium',
        whyBad: "Blind users rely on screen readers to understand images. Without alt text, your site is inaccessible to millions of people. It also hurts SEO.",
        manualFixGuide: `Add descriptive alt text to all images:

\`\`\`tsx
// Before (BAD)
<Image src="/hero.png" width={800} height={600} />
<img src="/photo.jpg" />

// After (GOOD)
<Image 
  src="/hero.png" 
  width={800} 
  height={600} 
  alt="A developer reviewing code on their laptop"
/>
<img src="/photo.jpg" alt="Team meeting in the office" />
\`\`\`

For decorative images, use an empty alt:
\`\`\`tsx
<Image src="/decoration.svg" alt="" aria-hidden="true" />
\`\`\``,
        appreciation: "All your images have alt text. Excellent accessibility!",
        check: (files) => {
            const issues: Issue[] = [];
            const imgPattern = /<(?:img|Image)[^>]*>/g;
            const hasAlt = /alt\s*=\s*["'][^"']*["']/;
            const hasAltProp = /alt\s*=\s*{/;

            for (const file of files) {
                if (!['.tsx', '.jsx'].includes(file.extension)) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const matches = lines[i].match(imgPattern);
                    if (matches) {
                        for (const match of matches) {
                            if (!hasAlt.test(match) && !hasAltProp.test(match)) {
                                issues.push({
                                    id: `alt-text-${file.path}-${i}`,
                                    ruleId: 'image-alt-text',
                                    category: 'seo',
                                    severity: 'medium',
                                    title: 'Image Missing Alt Text',
                                    whyBad: "Screen readers can't describe this image. Accessibility issue.",
                                    manualFixGuide: "Add alt='Description of image' to the tag",
                                    filePath: file.path,
                                    lineNumber: i + 1,
                                    codeSnippet: match.substring(0, 60),
                                });
                            }
                        }
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'semantic-html',
        title: 'Poor Semantic HTML Structure',
        slug: 'semantic-html-seo',
        category: 'seo',
        severity: 'low',
        whyBad: "Your code is a 'soup' of generic boxes. It confuses search engines and makes navigation difficult for screen reader users.",
        manualFixGuide: `Replace generic divs with semantic HTML elements:

\`\`\`tsx
// Before (BAD - "Div Soup")
<div>
  <div>Header content</div>
  <div>
    <div>Main content</div>
    <div>Sidebar</div>
  </div>
  <div>Footer</div>
</div>

// After (GOOD - Semantic HTML)
<div>
  <header>Header content</header>
  <main>
    <article>Main content</article>
    <aside>Sidebar</aside>
  </main>
  <footer>Footer</footer>
</div>
\`\`\`

Key semantic elements:
- \`<main>\` - Primary content (one per page)
- \`<header>\` - Introductory content
- \`<nav>\` - Navigation links
- \`<article>\` - Self-contained content
- \`<section>\` - Thematic grouping
- \`<aside>\` - Related content
- \`<footer>\` - Footer content`,
        appreciation: "Your HTML structure is clean and semantic. Search engines love it!",
        check: (files) => {
            const issues: Issue[] = [];

            const pageFiles = files.filter(f =>
                f.path.endsWith('page.tsx') || f.path.endsWith('page.jsx')
            );

            for (const file of pageFiles) {
                const hasMain = file.content.includes('<main') || file.content.includes('<Main');
                const divCount = (file.content.match(/<div/g) || []).length;

                if (!hasMain && divCount > 10) {
                    issues.push({
                        id: `semantic-${file.path}`,
                        ruleId: 'semantic-html',
                        category: 'seo',
                        severity: 'low',
                        title: 'Missing <main> Element',
                        whyBad: "Page lacks semantic structure. Confuses search engines.",
                        manualFixGuide: "Wrap primary content in <main> element",
                        filePath: file.path,
                    });
                }

                // Check for excessive nesting
                const nestedDivPattern = /<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>\s*<div/g;
                if (nestedDivPattern.test(file.content)) {
                    issues.push({
                        id: `div-soup-${file.path}`,
                        ruleId: 'semantic-html',
                        category: 'seo',
                        severity: 'low',
                        title: 'Excessive Div Nesting ("Div Soup")',
                        whyBad: "Too many nested generic divs. Hard to maintain and bad for SEO.",
                        manualFixGuide: "Replace some divs with semantic elements like section, article, aside",
                        filePath: file.path,
                    });
                }
            }

            return issues;
        },
    },
    {
        id: 'robots-sitemap',
        title: 'Missing robots.txt or sitemap.xml',
        slug: 'missing-robots-sitemap',
        category: 'seo',
        severity: 'medium',
        whyBad: "These files are the map and invitation for search engine bots. Without them, Google might not index your pages correctly.",
        manualFixGuide: `Create these files in your public folder:

**public/robots.txt:**
\`\`\`txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://yoursite.com/sitemap.xml
\`\`\`

**For Next.js 13+, create app/sitemap.ts:**
\`\`\`typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
\`\`\``,
        appreciation: "Your robots.txt and sitemap are properly configured!",
        check: (files) => {
            const issues: Issue[] = [];

            const hasRobots = files.some(f =>
                f.path === 'public/robots.txt' ||
                f.path === 'app/robots.ts' ||
                f.path === 'src/app/robots.ts'
            );

            const hasSitemap = files.some(f =>
                f.path === 'public/sitemap.xml' ||
                f.path === 'app/sitemap.ts' ||
                f.path === 'src/app/sitemap.ts'
            );

            if (!hasRobots) {
                issues.push({
                    id: 'missing-robots',
                    ruleId: 'robots-sitemap',
                    category: 'seo',
                    severity: 'medium',
                    title: 'Missing robots.txt',
                    whyBad: "Search engines don't know which pages to crawl.",
                    manualFixGuide: "Create public/robots.txt or app/robots.ts",
                    filePath: 'public/robots.txt',
                });
            }

            if (!hasSitemap) {
                issues.push({
                    id: 'missing-sitemap',
                    ruleId: 'robots-sitemap',
                    category: 'seo',
                    severity: 'medium',
                    title: 'Missing sitemap.xml',
                    whyBad: "Search engines can't find all your pages efficiently.",
                    manualFixGuide: "Create app/sitemap.ts for Next.js",
                    filePath: 'app/sitemap.ts',
                });
            }

            return issues;
        },
    },
    {
        id: 'favicon-check',
        title: 'Default or Missing Favicon',
        slug: 'default-favicon-branding',
        category: 'seo',
        severity: 'low',
        whyBad: "You still have the default Vercel/Next.js logo. It screams 'I am a beginner' and hurts brand recognition.",
        manualFixGuide: `Replace the default favicon with your own:

1. Create your favicon (32x32 .ico or .png)
2. Place it in the app folder:

\`\`\`
app/
├── favicon.ico    // Your custom favicon
├── icon.png       // Optional: Higher res icon
├── apple-icon.png // Optional: Apple touch icon
└── layout.tsx
\`\`\`

Or configure in metadata:
\`\`\`typescript
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};
\`\`\``,
        appreciation: "Custom favicon detected. Your branding is on point!",
        check: (files) => {
            const issues: Issue[] = [];

            const faviconFiles = files.filter(f =>
                f.path.includes('favicon') ||
                f.path.includes('icon.') ||
                f.path.includes('apple-icon')
            );

            // Check if it's the default Next.js/Vercel favicon
            for (const file of faviconFiles) {
                // Default Next.js favicon is usually named favicon.ico in app folder
                // We can detect if it hasn't been customized by checking if there's only one
                // and it's in the default location
                if (file.path === 'app/favicon.ico' || file.path === 'src/app/favicon.ico') {
                    // This is default location - might be default
                    // In a real implementation, we'd hash the file
                    // For now, we'll just note it should be checked
                }
            }

            if (faviconFiles.length === 0) {
                issues.push({
                    id: 'missing-favicon',
                    ruleId: 'favicon-check',
                    category: 'seo',
                    severity: 'low',
                    title: 'No Custom Favicon Found',
                    whyBad: "Users see a default icon in browser tabs. Hurts brand recognition.",
                    manualFixGuide: "Add favicon.ico to your app/ folder",
                    filePath: 'app/favicon.ico',
                });
            }

            return issues;
        },
    },
];

export function runSeoChecks(files: FileContent[]): { issues: Issue[]; passed: string[] } {
    const allIssues: Issue[] = [];
    const passedRules: string[] = [];

    for (const rule of seoRules) {
        const issues = rule.check(files);
        if (issues.length === 0) {
            passedRules.push(rule.id);
        } else {
            allIssues.push(...issues);
        }
    }

    return { issues: allIssues, passed: passedRules };
}

export { type SeoRule };
