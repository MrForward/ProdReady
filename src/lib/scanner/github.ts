// GitHub API utilities for fetching repository contents

import { FileContent, RepoInfo } from './types';

// Configuration
const MAX_FILES_TO_SCAN = 100; // Limit to prevent timeouts on large repos
const SCAN_TIMEOUT_MS = 30000; // 30 second timeout
const RATE_LIMIT_DELAY_MS = 100; // Delay between batches to avoid rate limiting
const BATCH_SIZE = 10;

// Simple in-memory cache for repo data
const repoCache = new Map<string, { data: FileContent[]; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function parseGitHubUrl(url: string): RepoInfo | null {
    const patterns = [
        /github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/,
        /github\.com\/([^\/]+)\/([^\/]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return {
                owner: match[1],
                repo: match[2].replace('.git', ''),
                branch: 'main', // Default, will be updated
            };
        }
    }
    return null;
}

export async function getDefaultBranch(owner: string, repo: string): Promise<string> {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) {
            // Check for rate limiting
            if (response.status === 403) {
                const remaining = response.headers.get('X-RateLimit-Remaining');
                if (remaining === '0') {
                    throw new Error('GitHub API rate limit exceeded. Please try again later.');
                }
                // 403 without rate limit = private repo or auth required
                throw new Error('Repository not accessible. It may be private.');
            }
            if (response.status === 404) {
                throw new Error('Repository not found. Please check the URL.');
            }
            return 'main';
        }
        const data = await response.json();
        return data.default_branch || 'main';
    } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
            throw error;
        }
        return 'main';
    }
}

export async function fetchRepoTree(owner: string, repo: string, branch: string): Promise<string[]> {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    if (!response.ok) {
        // Check for rate limiting
        if (response.status === 403) {
            const remaining = response.headers.get('X-RateLimit-Remaining');
            if (remaining === '0') {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }
            // 403 without rate limit = private repo
            throw new Error('Repository not accessible. It may be private or require authentication.');
        }
        if (response.status === 404) {
            throw new Error('Repository not found. Please check the URL and ensure it\'s a public repository.');
        }
        throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if tree is truncated (very large repos)
    if (data.truncated) {
        console.warn('Repository tree was truncated due to size');
    }

    return data.tree
        .filter((item: { type: string }) => item.type === 'blob')
        .map((item: { path: string }) => item.path);
}

export async function fetchFileContent(
    owner: string,
    repo: string,
    branch: string,
    path: string
): Promise<string> {
    const response = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${path}`);
    }

    return response.text();
}

const SCANNABLE_EXTENSIONS = [
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.json', '.md', '.css', '.scss', '.html'
];

const IGNORED_PATHS = [
    'node_modules/',
    '.git/',
    '.next/',
    'dist/',
    'build/',
    '.vercel/',
    'coverage/',
    '__tests__/',
    '*.test.',
    '*.spec.',
    '.github/',
    'docs/',
    'examples/',
    'test/',
    'tests/',
];

// Prioritize important files (scanned first)
const PRIORITY_FILES = [
    'package.json',
    'next.config',
    '.env',
    '.gitignore',
    'tsconfig.json',
];

export function shouldScanFile(path: string): boolean {
    // Check if path contains ignored directories
    for (const ignored of IGNORED_PATHS) {
        if (ignored.startsWith('*.')) {
            if (path.includes(ignored.slice(1))) return false;
        } else if (path.includes(ignored)) {
            return false;
        }
    }

    // Check extension
    const ext = '.' + path.split('.').pop();
    return SCANNABLE_EXTENSIONS.includes(ext);
}

function prioritizeFiles(paths: string[]): string[] {
    const priority: string[] = [];
    const rest: string[] = [];

    for (const path of paths) {
        const isPriority = PRIORITY_FILES.some(pf => path.includes(pf));
        if (isPriority) {
            priority.push(path);
        } else {
            rest.push(path);
        }
    }

    return [...priority, ...rest];
}

// Create a timeout promise
function createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Scan timed out after ${ms / 1000} seconds. Repository may be too large.`));
        }, ms);
    });
}

// Delay helper for rate limiting
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchRepoContents(
    repoUrl: string,
    onProgress?: (message: string) => void
): Promise<FileContent[]> {
    const repoInfo = parseGitHubUrl(repoUrl);
    if (!repoInfo) {
        throw new Error('Invalid GitHub URL');
    }

    const cacheKey = `${repoInfo.owner}/${repoInfo.repo}`;

    // Check cache
    const cached = repoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        onProgress?.('Using cached scan results...');
        return cached.data;
    }

    onProgress?.('Connecting to GitHub...');

    // Wrap the entire fetch process in a timeout
    const fetchWithTimeout = async (): Promise<FileContent[]> => {
        const branch = await getDefaultBranch(repoInfo.owner, repoInfo.repo);
        onProgress?.(`Found branch: ${branch}`);

        const allPaths = await fetchRepoTree(repoInfo.owner, repoInfo.repo, branch);
        const scannablePaths = prioritizeFiles(allPaths.filter(shouldScanFile));

        // Limit files to prevent timeouts
        const pathsToScan = scannablePaths.slice(0, MAX_FILES_TO_SCAN);
        const wasLimited = scannablePaths.length > MAX_FILES_TO_SCAN;

        if (wasLimited) {
            onProgress?.(`Found ${scannablePaths.length} files, scanning top ${MAX_FILES_TO_SCAN} for performance...`);
        } else {
            onProgress?.(`Found ${pathsToScan.length} files to scan...`);
        }

        const files: FileContent[] = [];

        for (let i = 0; i < pathsToScan.length; i += BATCH_SIZE) {
            const batch = pathsToScan.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(
                batch.map(async (path) => {
                    try {
                        const content = await fetchFileContent(repoInfo.owner, repoInfo.repo, branch, path);
                        return {
                            path,
                            content,
                            extension: '.' + path.split('.').pop()!,
                        };
                    } catch {
                        return null;
                    }
                })
            );

            files.push(...results.filter((f): f is FileContent => f !== null));
            onProgress?.(`Fetched ${Math.min(i + BATCH_SIZE, pathsToScan.length)}/${pathsToScan.length} files...`);

            // Add small delay between batches to avoid rate limiting
            if (i + BATCH_SIZE < pathsToScan.length) {
                await delay(RATE_LIMIT_DELAY_MS);
            }
        }

        return files;
    };

    try {
        const files = await Promise.race([
            fetchWithTimeout(),
            createTimeout(SCAN_TIMEOUT_MS)
        ]);

        // Cache the results
        repoCache.set(cacheKey, { data: files, timestamp: Date.now() });

        return files;
    } catch (error) {
        // Clear from cache on error
        repoCache.delete(cacheKey);
        throw error;
    }
}

export function detectTechStack(files: FileContent[]): string[] {
    const stack: string[] = [];

    const packageJson = files.find(f => f.path === 'package.json');
    if (packageJson) {
        try {
            const pkg = JSON.parse(packageJson.content);
            const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

            if (allDeps['next']) stack.push('nextjs');
            if (allDeps['react']) stack.push('react');
            if (allDeps['tailwindcss']) stack.push('tailwind');
            if (allDeps['typescript']) stack.push('typescript');
            if (allDeps['prisma'] || allDeps['@prisma/client']) stack.push('prisma');
            if (allDeps['@supabase/supabase-js']) stack.push('supabase');
            if (allDeps['drizzle-orm']) stack.push('drizzle');
            if (allDeps['shadcn'] || allDeps['@radix-ui/react-dialog']) stack.push('shadcn');
            if (allDeps['framer-motion']) stack.push('framer-motion');
            if (allDeps['zod']) stack.push('zod');
        } catch {
            // Invalid package.json
        }
    }

    return stack;
}

export function extractRepoInfo(repoUrl: string): { owner: string; repo: string } | null {
    const info = parseGitHubUrl(repoUrl);
    if (!info) return null;
    return { owner: info.owner, repo: info.repo };
}

// Export for testing
export function clearCache(): void {
    repoCache.clear();
}
