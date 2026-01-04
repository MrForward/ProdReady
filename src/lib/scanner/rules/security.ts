// Security Rules - 6 checks for detecting security vulnerabilities

import { Issue, FileContent, IssueSeverity, IssueCategory } from '../types';

interface SecurityRule {
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

// Patterns for secret detection
const SECRET_PATTERNS: { name: string; pattern: RegExp; example: string }[] = [
    { name: 'OpenAI API Key', pattern: /sk-[a-zA-Z0-9]{20,}/g, example: 'sk-...' },
    { name: 'GitHub Personal Token', pattern: /ghp_[a-zA-Z0-9]{36}/g, example: 'ghp_...' },
    { name: 'GitHub OAuth Token', pattern: /gho_[a-zA-Z0-9]{36}/g, example: 'gho_...' },
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, example: 'AKIA...' },
    { name: 'Stripe Secret Key', pattern: /sk_live_[a-zA-Z0-9]{24,}/g, example: 'sk_live_...' },
    { name: 'Stripe Publishable Key', pattern: /pk_live_[a-zA-Z0-9]{24,}/g, example: 'pk_live_...' },
    { name: 'Supabase Key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, example: 'eyJ...' },
    { name: 'Generic API Key', pattern: /['"`](?:api[_-]?key|apikey|api_secret)['"`:=\s]+['"`]?[a-zA-Z0-9]{20,}['"`]?/gi, example: 'api_key=...' },
    { name: 'Private Key', pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, example: '-----BEGIN PRIVATE KEY-----' },
];

export const securityRules: SecurityRule[] = [
    {
        id: 'secret-scanning',
        title: 'Exposed API Keys or Secrets',
        slug: 'exposed-api-keys',
        category: 'security',
        severity: 'critical',
        whyBad: "You left the keys to your house under the doormat. Hackers scan GitHub for these keys to steal your money and access your services.",
        manualFixGuide: `1. Move this secret to a \`.env.local\` file
2. Use \`process.env.KEY_NAME\` to access it
3. Add \`.env.local\` to your \`.gitignore\`
4. Revoke and rotate the exposed key immediately

\`\`\`typescript
// Before (BAD)
const apiKey = "sk-abc123...";

// After (GOOD)
const apiKey = process.env.OPENAI_API_KEY;
\`\`\``,
        appreciation: "Excellent work keeping your API keys hidden! Your secrets are safe.",
        check: (files) => {
            const issues: Issue[] = [];

            for (const file of files) {
                // Skip .env files and config examples
                if (file.path.includes('.env') || file.path.includes('example')) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    for (const { name, pattern } of SECRET_PATTERNS) {
                        const matches = line.match(pattern);
                        if (matches) {
                            issues.push({
                                id: `secret-${file.path}-${i}`,
                                ruleId: 'secret-scanning',
                                category: 'security',
                                severity: 'critical',
                                title: `${name} Exposed`,
                                whyBad: "You left the keys to your house under the doormat. Hackers scan GitHub for these keys.",
                                manualFixGuide: "Move to .env.local and use process.env.KEY_NAME",
                                filePath: file.path,
                                lineNumber: i + 1,
                                codeSnippet: line.trim().substring(0, 100),
                            });
                        }
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'debug-routes',
        title: 'Debug or Test Routes in Production',
        slug: 'debug-routes-production',
        category: 'security',
        severity: 'high',
        whyBad: "These pages are for testing only. If users find them, they might break your app or expose sensitive functionality.",
        manualFixGuide: `Delete this file or wrap the logic in an environment check:

\`\`\`typescript
// Option 1: Delete the file entirely

// Option 2: Guard with environment check
if (process.env.NODE_ENV !== 'development') {
  return new Response('Not Found', { status: 404 });
}
\`\`\``,
        appreciation: "Great job! No debug routes found in your codebase.",
        check: (files) => {
            const issues: Issue[] = [];
            const debugPatterns = [
                /test\.tsx?$/,
                /temp\.tsx?$/,
                /debug\.tsx?$/,
                /\/api\/mock/,
                /\/api\/test/,
                /_test\.tsx?$/,
                /\.test\.tsx?$/,
            ];

            for (const file of files) {
                for (const pattern of debugPatterns) {
                    if (pattern.test(file.path) && !file.path.includes('__tests__')) {
                        issues.push({
                            id: `debug-route-${file.path}`,
                            ruleId: 'debug-routes',
                            category: 'security',
                            severity: 'high',
                            title: 'Debug Route Detected',
                            whyBad: "These pages are for testing only. If users find them, they might break your app.",
                            manualFixGuide: "Delete or wrap in process.env.NODE_ENV === 'development' check",
                            filePath: file.path,
                        });
                        break;
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'dangerous-html',
        title: 'Dangerous HTML Injection',
        slug: 'dangerous-html-injection',
        category: 'security',
        severity: 'high',
        whyBad: "This command allows hackers to inject malicious scripts into your website. It's called Cross-Site Scripting (XSS).",
        manualFixGuide: `Use a sanitization library like DOMPurify:

\`\`\`typescript
// Install: npm install dompurify @types/dompurify
import DOMPurify from 'dompurify';

// Before (DANGEROUS)
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// After (SAFE)
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
\`\`\``,
        appreciation: "Perfect! No dangerous HTML injection points found.",
        check: (files) => {
            const issues: Issue[] = [];

            for (const file of files) {
                if (!['.tsx', '.jsx', '.ts', '.js'].includes(file.extension)) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('dangerouslySetInnerHTML')) {
                        issues.push({
                            id: `dangerous-html-${file.path}-${i}`,
                            ruleId: 'dangerous-html',
                            category: 'security',
                            severity: 'high',
                            title: 'dangerouslySetInnerHTML Used',
                            whyBad: "This allows hackers to inject malicious scripts (XSS attack).",
                            manualFixGuide: "Use a sanitization library like DOMPurify",
                            filePath: file.path,
                            lineNumber: i + 1,
                            codeSnippet: lines[i].trim(),
                        });
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'public-env',
        title: 'Environment File Not Gitignored',
        slug: 'env-file-exposed',
        category: 'security',
        severity: 'critical',
        whyBad: "You are about to upload your passwords to the public internet. Anyone can see your database credentials, API keys, and secrets.",
        manualFixGuide: `Add .env to your .gitignore file immediately:

\`\`\`gitignore
# .gitignore
.env
.env.local
.env.*.local
\`\`\`

Then remove any previously committed .env files from git history using \`git filter-branch\` or BFG Repo Cleaner.`,
        appreciation: "Your .env file is properly gitignored. Well done!",
        check: (files) => {
            const issues: Issue[] = [];

            const gitignore = files.find(f => f.path === '.gitignore');
            const hasEnvFile = files.some(f => f.path === '.env' || f.path.match(/^\.env\./));

            if (hasEnvFile) {
                if (!gitignore) {
                    issues.push({
                        id: 'public-env-no-gitignore',
                        ruleId: 'public-env',
                        category: 'security',
                        severity: 'critical',
                        title: '.env File May Be Public',
                        whyBad: "No .gitignore found - your .env file might be committed to git!",
                        manualFixGuide: "Create a .gitignore and add .env to it",
                        filePath: '.gitignore',
                    });
                } else if (!gitignore.content.includes('.env')) {
                    issues.push({
                        id: 'public-env-not-ignored',
                        ruleId: 'public-env',
                        category: 'security',
                        severity: 'critical',
                        title: '.env Not in .gitignore',
                        whyBad: "Your .env file is not in .gitignore - it may be public!",
                        manualFixGuide: "Add .env to your .gitignore file",
                        filePath: '.gitignore',
                    });
                }
            }

            return issues;
        },
    },
    {
        id: 'input-validation',
        title: 'Missing Input Validation',
        slug: 'missing-input-validation',
        category: 'security',
        severity: 'medium',
        whyBad: "Without limits, a bot can paste a 1 million character message and crash your database or fill up your storage.",
        manualFixGuide: `Add validation attributes to your form inputs:

\`\`\`tsx
// Before (VULNERABLE)
<input type="text" name="message" />

// After (PROTECTED)
<input 
  type="text" 
  name="message" 
  required 
  maxLength={500}
  minLength={1}
/>
\`\`\`

For server-side validation, use Zod or similar:
\`\`\`typescript
import { z } from 'zod';

const MessageSchema = z.object({
  message: z.string().min(1).max(500),
});
\`\`\``,
        appreciation: "All your form inputs have proper validation. Nice work!",
        check: (files) => {
            const issues: Issue[] = [];
            const inputPattern = /<input[^>]*>/g;
            const hasValidation = /(?:required|maxLength|max|pattern)/;

            for (const file of files) {
                if (!['.tsx', '.jsx'].includes(file.extension)) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const matches = lines[i].match(inputPattern);
                    if (matches) {
                        for (const match of matches) {
                            // Skip hidden, submit, checkbox, radio inputs
                            if (/type=["'](?:hidden|submit|checkbox|radio|button)["']/.test(match)) continue;

                            if (!hasValidation.test(match)) {
                                issues.push({
                                    id: `input-validation-${file.path}-${i}`,
                                    ruleId: 'input-validation',
                                    category: 'security',
                                    severity: 'medium',
                                    title: 'Input Missing Validation',
                                    whyBad: "Without limits, bots can submit huge data and crash your app.",
                                    manualFixGuide: "Add required and maxLength attributes",
                                    filePath: file.path,
                                    lineNumber: i + 1,
                                    codeSnippet: match.substring(0, 80),
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
        id: 'target-blank-risk',
        title: 'Unsafe External Links',
        slug: 'unsafe-external-links',
        category: 'security',
        severity: 'medium',
        whyBad: "Links with target='_blank' without rel='noopener' allow the new page to control your original page. This is a phishing risk called 'tabnabbing'.",
        manualFixGuide: `Add rel='noopener noreferrer' to all external links:

\`\`\`tsx
// Before (RISKY)
<a href="https://example.com" target="_blank">
  Visit Site
</a>

// After (SAFE)
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  Visit Site
</a>
\`\`\``,
        appreciation: "All your external links are properly secured. Great security awareness!",
        check: (files) => {
            const issues: Issue[] = [];

            for (const file of files) {
                if (!['.tsx', '.jsx'].includes(file.extension)) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.includes('target="_blank"') || line.includes("target='_blank'")) {
                        if (!line.includes('noopener')) {
                            issues.push({
                                id: `target-blank-${file.path}-${i}`,
                                ruleId: 'target-blank-risk',
                                category: 'security',
                                severity: 'medium',
                                title: 'External Link Missing rel="noopener"',
                                whyBad: "The new page can control your original page - phishing risk!",
                                manualFixGuide: "Add rel='noopener noreferrer' to the link",
                                filePath: file.path,
                                lineNumber: i + 1,
                                codeSnippet: line.trim().substring(0, 80),
                            });
                        }
                    }
                }
            }

            return issues;
        },
    },
];

export function runSecurityChecks(files: FileContent[]): { issues: Issue[]; passed: string[] } {
    const allIssues: Issue[] = [];
    const passedRules: string[] = [];

    for (const rule of securityRules) {
        const issues = rule.check(files);
        if (issues.length === 0) {
            passedRules.push(rule.id);
        } else {
            allIssues.push(...issues);
        }
    }

    return { issues: allIssues, passed: passedRules };
}

export { type SecurityRule };
