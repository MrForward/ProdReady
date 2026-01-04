// Hygiene Rules - 6 checks for code quality and cleanliness

import { Issue, FileContent, IssueSeverity, IssueCategory } from '../types';

interface HygieneRule {
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

export const hygieneRules: HygieneRule[] = [
    {
        id: 'console-logs',
        title: 'Console Logs in Production',
        slug: 'console-log-pollution',
        category: 'hygiene',
        severity: 'low',
        whyBad: "It looks unprofessional if a user opens their browser inspector and sees your debugging messages. It can also leak sensitive information.",
        manualFixGuide: `Remove console.log statements or replace with a proper logger:

\`\`\`typescript
// Option 1: Remove entirely
// console.log("debugging stuff"); // DELETE THIS

// Option 2: Use environment-aware logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// Option 3: Use a proper logger (recommended)
// npm install pino
import pino from 'pino';
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
logger.info('This is properly logged');
\`\`\``,
        appreciation: "Your production logs are squeaky clean. Professional code!",
        check: (files) => {
            const issues: Issue[] = [];
            const consolePattern = /console\.(log|warn|error|info|debug)\s*\(/g;

            for (const file of files) {
                if (!['.ts', '.tsx', '.js', '.jsx'].includes(file.extension)) continue;
                // Skip test files
                if (file.path.includes('.test.') || file.path.includes('.spec.')) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Skip if commented out
                    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

                    const matches = line.match(consolePattern);
                    if (matches) {
                        issues.push({
                            id: `console-${file.path}-${i}`,
                            ruleId: 'console-logs',
                            category: 'hygiene',
                            severity: 'low',
                            title: 'Console Statement Found',
                            whyBad: "Debug logs visible to users in browser inspector.",
                            manualFixGuide: "Remove or wrap in development check",
                            filePath: file.path,
                            lineNumber: i + 1,
                            codeSnippet: line.trim().substring(0, 60),
                        });
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'zombie-imports',
        title: 'Unused Imports',
        slug: 'unused-imports-cleanup',
        category: 'hygiene',
        severity: 'low',
        whyBad: "This bloats your file size for no reason, making the site load slower. It also makes code harder to read and maintain.",
        manualFixGuide: `Delete the unused import lines:

\`\`\`typescript
// Before (BLOATED)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Card, Dialog, Drawer } from './ui';

// Only using useState and Button...

// After (CLEAN)
import { useState } from 'react';
import { Button } from './ui';
\`\`\`

Pro tip: Use ESLint with the 'no-unused-vars' rule, or enable "Organize Imports" in your IDE.`,
        appreciation: "No zombie imports found. Your imports are lean and clean!",
        check: (files) => {
            const issues: Issue[] = [];

            for (const file of files) {
                if (!['.ts', '.tsx', '.js', '.jsx'].includes(file.extension)) continue;

                // Simple regex-based unused import detection
                const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from/g;
                const content = file.content;
                let match;

                while ((match = importRegex.exec(content)) !== null) {
                    const imports = match[1] || match[2];
                    if (!imports) continue;

                    // Parse individual imports
                    const importNames = imports.split(',').map(s => s.trim().split(' as ').pop()!.trim());

                    for (const importName of importNames) {
                        if (!importName) continue;

                        // Check if the import is used elsewhere in the file
                        // Remove the import statement itself from check
                        const restOfFile = content.replace(match[0], '');
                        const usagePattern = new RegExp(`\\b${importName}\\b`, 'g');
                        const usages = restOfFile.match(usagePattern);

                        if (!usages || usages.length === 0) {
                            // Find line number
                            const beforeMatch = content.substring(0, match.index);
                            const lineNumber = beforeMatch.split('\n').length;

                            issues.push({
                                id: `zombie-import-${file.path}-${importName}`,
                                ruleId: 'zombie-imports',
                                category: 'hygiene',
                                severity: 'low',
                                title: `Unused Import: ${importName}`,
                                whyBad: "Bloats file size and slows down the app.",
                                manualFixGuide: `Remove the unused import '${importName}'`,
                                filePath: file.path,
                                lineNumber,
                                codeSnippet: `import { ..., ${importName}, ... }`,
                            });
                        }
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'todo-comments',
        title: 'Unresolved TODO Comments',
        slug: 'todo-comments-cleanup',
        category: 'hygiene',
        severity: 'low',
        whyBad: "You left notes to yourself that you forgot to finish. These TODOs might indicate incomplete features or known bugs.",
        manualFixGuide: `Review and resolve each TODO:

\`\`\`typescript
// Examples of TODOs to address:

// TODO: Add error handling <- Implement this!
// FIXME: This breaks on mobile <- Fix it before launch
// HACK: Temporary workaround <- Replace with proper solution

// Options:
// 1. Implement the missing feature
// 2. Create a GitHub issue and reference it:
//    // TODO(#123): Add error handling
// 3. Delete if no longer relevant
\`\`\``,
        appreciation: "No unfinished TODOs found. Your code is complete!",
        check: (files) => {
            const issues: Issue[] = [];
            const todoPattern = /\/\/\s*(TODO|FIXME|HACK|XXX|BUG)[\s:]/gi;

            for (const file of files) {
                if (!['.ts', '.tsx', '.js', '.jsx'].includes(file.extension)) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const match = lines[i].match(todoPattern);
                    if (match) {
                        issues.push({
                            id: `todo-${file.path}-${i}`,
                            ruleId: 'todo-comments',
                            category: 'hygiene',
                            severity: 'low',
                            title: `${match[0].replace(/[/:]/g, '').trim()} Comment Found`,
                            whyBad: "Unfinished work that might indicate incomplete features.",
                            manualFixGuide: "Resolve the issue or create a tracked ticket",
                            filePath: file.path,
                            lineNumber: i + 1,
                            codeSnippet: lines[i].trim().substring(0, 60),
                        });
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'hardcoded-colors',
        title: 'Hardcoded Color Values',
        slug: 'hardcoded-colors-design',
        category: 'hygiene',
        severity: 'low',
        whyBad: "Hardcoded colors break Dark Mode and make your design inconsistent. They can't be themed and are hard to maintain.",
        manualFixGuide: `Replace hex codes with Tailwind classes or CSS variables:

\`\`\`tsx
// Before (BAD)
<div className="text-[#ff0000] bg-[#1a1a1a]">
  <span style={{ color: '#3b82f6' }}>Text</span>
</div>

// After (GOOD - Tailwind)
<div className="text-red-500 bg-zinc-900 dark:bg-zinc-100">
  <span className="text-blue-500">Text</span>
</div>

// Or use CSS variables for custom colors:
// In globals.css:
:root {
  --brand-primary: 59 130 246; /* RGB values */
}

// In component:
<span className="text-[rgb(var(--brand-primary))]">Text</span>
\`\`\``,
        appreciation: "No hardcoded colors found. Your design system is consistent!",
        check: (files) => {
            const issues: Issue[] = [];
            const hexPattern = /#[0-9a-fA-F]{3,8}/g;

            for (const file of files) {
                if (!['.tsx', '.jsx'].includes(file.extension)) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    // Look for hex colors in className or style
                    if ((line.includes('className') || line.includes('style')) && hexPattern.test(line)) {
                        const matches = line.match(hexPattern);
                        if (matches) {
                            issues.push({
                                id: `hardcoded-color-${file.path}-${i}`,
                                ruleId: 'hardcoded-colors',
                                category: 'hygiene',
                                severity: 'low',
                                title: 'Hardcoded Color Value',
                                whyBad: "Breaks dark mode and makes design inconsistent.",
                                manualFixGuide: `Replace ${matches[0]} with Tailwind class`,
                                filePath: file.path,
                                lineNumber: i + 1,
                                codeSnippet: line.trim().substring(0, 60),
                            });
                        }
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'any-types',
        title: 'TypeScript "any" Usage',
        slug: 'typescript-any-unsafe',
        category: 'hygiene',
        severity: 'medium',
        whyBad: "Using 'any' turns off TypeScript's safety features. It invites bugs and makes refactoring dangerous.",
        manualFixGuide: `Replace 'any' with proper types:

\`\`\`typescript
// Before (UNSAFE)
function processData(data: any) {
  return data.items.map((item: any) => item.name);
}

// After (SAFE)
interface Item {
  name: string;
  id: number;
}

interface Data {
  items: Item[];
}

function processData(data: Data) {
  return data.items.map((item) => item.name);
}

// If you truly need flexibility, use 'unknown':
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

// Then narrow with type guards:
if (typeof result === 'object' && result !== null) {
  // Now TypeScript knows it's an object
}
\`\`\``,
        appreciation: "No 'any' types found. Your code is fully type-safe!",
        check: (files) => {
            const issues: Issue[] = [];
            const anyPattern = /:\s*any\b/g;
            const asAnyPattern = /as\s+any\b/g;

            for (const file of files) {
                if (!['.ts', '.tsx'].includes(file.extension)) continue;
                // Skip declaration files
                if (file.path.endsWith('.d.ts')) continue;

                const lines = file.content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Skip if commented
                    if (line.trim().startsWith('//')) continue;

                    if (anyPattern.test(line) || asAnyPattern.test(line)) {
                        issues.push({
                            id: `any-type-${file.path}-${i}`,
                            ruleId: 'any-types',
                            category: 'hygiene',
                            severity: 'medium',
                            title: '"any" Type Used',
                            whyBad: "Disables TypeScript type checking. Invites bugs.",
                            manualFixGuide: "Define a proper interface or use 'unknown'",
                            filePath: file.path,
                            lineNumber: i + 1,
                            codeSnippet: line.trim().substring(0, 60),
                        });
                    }
                }
            }

            return issues;
        },
    },
    {
        id: 'empty-components',
        title: 'Empty or Null Components',
        slug: 'empty-components-waste',
        category: 'hygiene',
        severity: 'low',
        whyBad: "This code runs but displays nothing. It wastes processing power and indicates abandoned or incomplete work.",
        manualFixGuide: `Either implement the component or delete it:

\`\`\`tsx
// Before (WASTEFUL)
export function EmptyComponent() {
  return null;
}

export function FragmentOnly() {
  return <></>;
}

// Options:

// 1. Implement it properly
export function UsefulComponent() {
  return (
    <div>
      <h1>Actual content</h1>
    </div>
  );
}

// 2. Delete the file entirely if not needed

// 3. If intentionally empty (e.g., placeholder), add a comment:
/** @todo Implement user profile component */
export function UserProfile() {
  return null;
}
\`\`\``,
        appreciation: "All your components render meaningful content!",
        check: (files) => {
            const issues: Issue[] = [];

            for (const file of files) {
                if (!['.tsx', '.jsx'].includes(file.extension)) continue;
                // Skip index/barrel files
                if (file.path.endsWith('index.tsx') || file.path.endsWith('index.jsx')) continue;

                const content = file.content;

                // Check for components that only return null or empty fragments
                const returnNullPattern = /return\s+null\s*;?\s*}/g;
                const returnFragmentPattern = /return\s+<><\/>\s*;?\s*}/g;

                if (returnNullPattern.test(content)) {
                    // Find line number
                    const match = content.match(returnNullPattern);
                    if (match) {
                        const index = content.indexOf(match[0]);
                        const lineNumber = content.substring(0, index).split('\n').length;

                        issues.push({
                            id: `empty-component-null-${file.path}`,
                            ruleId: 'empty-components',
                            category: 'hygiene',
                            severity: 'low',
                            title: 'Component Returns null',
                            whyBad: "Code runs but renders nothing. Likely abandoned work.",
                            manualFixGuide: "Implement the component or delete it",
                            filePath: file.path,
                            lineNumber,
                            codeSnippet: 'return null',
                        });
                    }
                }

                if (returnFragmentPattern.test(content)) {
                    const match = content.match(returnFragmentPattern);
                    if (match) {
                        const index = content.indexOf(match[0]);
                        const lineNumber = content.substring(0, index).split('\n').length;

                        issues.push({
                            id: `empty-component-fragment-${file.path}`,
                            ruleId: 'empty-components',
                            category: 'hygiene',
                            severity: 'low',
                            title: 'Component Returns Empty Fragment',
                            whyBad: "Code runs but renders nothing useful.",
                            manualFixGuide: "Implement the component or delete it",
                            filePath: file.path,
                            lineNumber,
                            codeSnippet: 'return <></>',
                        });
                    }
                }
            }

            return issues;
        },
    },
];

export function runHygieneChecks(files: FileContent[]): { issues: Issue[]; passed: string[] } {
    const allIssues: Issue[] = [];
    const passedRules: string[] = [];

    for (const rule of hygieneRules) {
        const issues = rule.check(files);
        if (issues.length === 0) {
            passedRules.push(rule.id);
        } else {
            allIssues.push(...issues);
        }
    }

    return { issues: allIssues, passed: passedRules };
}

export { type HygieneRule };
