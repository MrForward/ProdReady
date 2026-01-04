// Scanner Engine - Main orchestrator for all security, SEO, and hygiene checks

import { ScanReport, Issue, PassedCheck, Grade, FileContent } from './types';
import { fetchRepoContents, detectTechStack, extractRepoInfo } from './github';
import { runSecurityChecks, securityRules } from './rules/security';
import { runSeoChecks, seoRules } from './rules/seo';
import { runHygieneChecks, hygieneRules } from './rules/hygiene';

// Combine all rules for reference
export const allRules = [...securityRules, ...seoRules, ...hygieneRules];

// Severity weights for score calculation
const SEVERITY_WEIGHTS = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
};

function calculateVibeScore(issues: Issue[]): number {
    // Start with perfect score
    let score = 100;

    // Deduct points based on severity
    for (const issue of issues) {
        score -= SEVERITY_WEIGHTS[issue.severity];
    }

    // Ensure score doesn't go below 0
    return Math.max(0, score);
}

function getGrade(score: number): Grade {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

function generatePassedChecks(passedRuleIds: string[]): PassedCheck[] {
    const passed: PassedCheck[] = [];

    for (const ruleId of passedRuleIds) {
        const rule = allRules.find(r => r.id === ruleId);
        if (rule) {
            passed.push({
                ruleId: rule.id,
                category: rule.category,
                title: rule.title,
                appreciation: rule.appreciation,
            });
        }
    }

    return passed;
}

export interface ScanOptions {
    onProgress?: (message: string, type?: 'info' | 'found' | 'success' | 'error') => void;
}

export async function scanRepository(
    repoUrl: string,
    options: ScanOptions = {}
): Promise<ScanReport> {
    const { onProgress } = options;

    // Extract repo info
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
        throw new Error('Invalid GitHub repository URL');
    }

    onProgress?.('Initializing scanner...', 'info');

    // Fetch repository contents
    onProgress?.('Cloning repository...', 'info');
    const files = await fetchRepoContents(repoUrl, (msg) => onProgress?.(msg, 'info'));

    onProgress?.(`Loaded ${files.length} files for analysis`, 'success');

    // Detect tech stack
    onProgress?.('Detecting tech stack...', 'info');
    const techStack = detectTechStack(files);
    if (techStack.length > 0) {
        onProgress?.(`Found: ${techStack.join(', ')}`, 'success');
    }

    // Run all checks
    onProgress?.('Scanning for security vulnerabilities...', 'info');
    const securityResults = runSecurityChecks(files);
    if (securityResults.issues.length > 0) {
        onProgress?.(`Found ${securityResults.issues.length} security issues!`, 'found');
    } else {
        onProgress?.('No security issues found', 'success');
    }

    onProgress?.('Checking SEO configuration...', 'info');
    const seoResults = runSeoChecks(files);
    if (seoResults.issues.length > 0) {
        onProgress?.(`Found ${seoResults.issues.length} SEO issues`, 'found');
    } else {
        onProgress?.('SEO looks good!', 'success');
    }

    onProgress?.('Running code hygiene checks...', 'info');
    const hygieneResults = runHygieneChecks(files);
    if (hygieneResults.issues.length > 0) {
        onProgress?.(`Found ${hygieneResults.issues.length} hygiene issues`, 'found');
    } else {
        onProgress?.('Code is clean!', 'success');
    }

    // Combine all results
    const allIssues = [
        ...securityResults.issues,
        ...seoResults.issues,
        ...hygieneResults.issues,
    ];

    const allPassedRuleIds = [
        ...securityResults.passed,
        ...seoResults.passed,
        ...hygieneResults.passed,
    ];

    // Calculate score and grade
    const vibeScore = calculateVibeScore(allIssues);
    const grade = getGrade(vibeScore);

    onProgress?.(`Analysis complete! Score: ${vibeScore}/100 (${grade})`, 'success');

    // Generate report
    const report: ScanReport = {
        id: crypto.randomUUID(),
        repoUrl,
        repoName: repoInfo.repo,
        githubUsername: repoInfo.owner,
        vibeScore,
        grade,
        issues: allIssues,
        passed: generatePassedChecks(allPassedRuleIds),
        techStack,
        totalFiles: files.length,
        scannedAt: new Date(),
    };

    return report;
}

// Export individual check runners for testing
export { runSecurityChecks, runSeoChecks, runHygieneChecks };

// Get rule by ID
export function getRuleById(ruleId: string) {
    return allRules.find(r => r.id === ruleId);
}

// Get all rules by category
export function getRulesByCategory(category: 'security' | 'seo' | 'hygiene') {
    return allRules.filter(r => r.category === category);
}

// Get rule by slug (for programmatic SEO pages)
export function getRuleBySlug(slug: string) {
    return allRules.find(r => r.slug === slug);
}

// Get all slugs (for static generation)
export function getAllRuleSlugs(): string[] {
    return allRules.map(r => r.slug);
}
