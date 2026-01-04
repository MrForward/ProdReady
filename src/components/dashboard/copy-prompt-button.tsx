'use client';

import { useState } from 'react';
import { Copy, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Issue } from '@/lib/scanner/types';

// Framework-specific fix examples
const FIX_EXAMPLES: Record<string, string> = {
    'metadata-existence': `Example fix for Next.js:
\`\`\`tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Page Title',
  description: 'A brief description of this page (50-160 chars)',
};
\`\`\``,
    'opengraph-tags': `Example fix for Next.js:
\`\`\`tsx
export const metadata: Metadata = {
  title: 'Your Page Title',
  description: 'Your description',
  openGraph: {
    title: 'Your Page Title',
    description: 'Your description',
    images: ['/og-image.png'],
  },
};
\`\`\``,
    'secret-in-code': `Remove the secret and use environment variables:
\`\`\`tsx
// Before (BAD)
const apiKey = 'sk_live_abc123...';

// After (GOOD)
const apiKey = process.env.API_KEY;
\`\`\``,
    'console-statements': `Remove console.log before production:
\`\`\`tsx
// Remove this line:
console.log('debug:', data);

// Or wrap in development check:
if (process.env.NODE_ENV === 'development') {
  console.log('debug:', data);
}
\`\`\``,
    'typescript-any': `Replace 'any' with a proper type:
\`\`\`tsx
// Before (BAD)
function getData(input: any): any { ... }

// After (GOOD)
interface DataInput { id: string; value: number; }
function getData(input: DataInput): DataResult { ... }
\`\`\``,
};

interface CopyPromptButtonProps {
    issue: Issue;
    variant?: 'default' | 'compact';
}

export function CopyPromptButton({ issue, variant = 'default' }: CopyPromptButtonProps) {
    const [copied, setCopied] = useState(false);

    const generatePrompt = () => {
        const example = FIX_EXAMPLES[issue.ruleId] || '';

        return `Fix this ${issue.category} issue in my codebase:

**Issue:** ${issue.title}
**File:** ${issue.filePath}${issue.lineNumber ? ` (line ${issue.lineNumber})` : ''}
**Problem:** ${issue.whyBad}

${issue.codeSnippet ? `**Current code:**
\`\`\`
${issue.codeSnippet}
\`\`\`

` : ''}**How to fix:**
${issue.manualFixGuide}

${example ? `**Example:**
${example}

` : ''}Please apply this fix to the file.`;
    };

    const handleCopy = async () => {
        const prompt = generatePrompt();
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (variant === 'compact') {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-xs text-zinc-400 hover:text-white"
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3 mr-1 text-emerald-400" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Wand2 className="w-3 h-3 mr-1" />
                        Copy Fix Prompt
                    </>
                )}
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            onClick={handleCopy}
            className="border-zinc-700 hover:bg-zinc-800"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 mr-2 text-emerald-400" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy for AI
                </>
            )}
        </Button>
    );
}

export function CopyAllPromptsButton({ issues }: { issues: Issue[] }) {
    const [copied, setCopied] = useState(false);

    const generateAllPrompts = () => {
        const header = `# Code Issues to Fix

I have ${issues.length} issues to fix. Please address each one:

---

`;
        const issuePrompts = issues.slice(0, 20).map((issue, index) => {
            const example = FIX_EXAMPLES[issue.ruleId] || '';
            return `## ${index + 1}. ${issue.title}

**Severity:** ${issue.severity}
**File:** ${issue.filePath}${issue.lineNumber ? ` (line ${issue.lineNumber})` : ''}
**Problem:** ${issue.whyBad}

${issue.codeSnippet ? `**Current code:**
\`\`\`
${issue.codeSnippet}
\`\`\`

` : ''}**Fix:** ${issue.manualFixGuide}
${example ? `\n${example}` : ''}

---
`;
        }).join('\n');

        const footer = issues.length > 20
            ? `\n(Showing first 20 of ${issues.length} issues)\n`
            : '';

        return header + issuePrompts + footer + '\nPlease fix these issues and show me the corrected code.';
    };

    const handleCopy = async () => {
        const prompt = generateAllPrompts();
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            onClick={handleCopy}
            className="bg-purple-600 hover:bg-purple-700 text-sm"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 mr-2 text-white" />
                    Copied!
                </>
            ) : (
                <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Copy All for AI ({issues.length > 20 ? '20' : issues.length})
                </>
            )}
        </Button>
    );
}
