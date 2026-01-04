import { ScanReport, Issue } from '@/lib/scanner/types';

interface EmailReportProps {
    report: ScanReport;
}

/**
 * Email HTML template for scan reports.
 * This is designed to be used with email services like Resend, SendGrid, etc.
 */
export function generateEmailReportHtml(report: ScanReport): string {
    const gradeColors: Record<string, string> = {
        A: '#10b981',
        B: '#22c55e',
        C: '#f59e0b',
        D: '#f97316',
        F: '#ef4444',
    };

    const gradeColor = gradeColors[report.grade] || gradeColors.F;

    const topIssues = report.issues.slice(0, 10);

    const issuesByCategory = {
        security: report.issues.filter(i => i.category === 'security'),
        seo: report.issues.filter(i => i.category === 'seo'),
        hygiene: report.issues.filter(i => i.category === 'hygiene'),
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProdReady Scan Report - ${report.repoName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: #22c55e; padding: 8px 12px; border-radius: 8px; margin-bottom: 16px;">
                <span style="color: white; font-weight: bold; font-size: 18px;">ProdReady</span>
            </div>
            <h1 style="color: white; font-size: 24px; margin: 0 0 8px 0;">Your Code Audit Report</h1>
            <p style="color: #71717a; font-size: 14px; margin: 0;">${report.repoName} • Scanned on ${new Date(report.scannedAt).toLocaleDateString()}</p>
        </div>

        <!-- Grade Card -->
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
            <div style="display: inline-block; width: 100px; height: 100px; background: ${gradeColor}20; border-radius: 50%; line-height: 100px; margin-bottom: 16px;">
                <span style="color: ${gradeColor}; font-size: 48px; font-weight: bold;">${report.grade}</span>
            </div>
            <h2 style="color: white; font-size: 32px; margin: 0 0 8px 0;">${report.vibeScore}/100</h2>
            <p style="color: #71717a; font-size: 14px; margin: 0;">Vibe Score</p>
            
            <div style="display: flex; justify-content: center; gap: 32px; margin-top: 24px;">
                <div>
                    <div style="color: #ef4444; font-size: 24px; font-weight: bold;">${report.issues.length}</div>
                    <div style="color: #71717a; font-size: 12px;">Issues Found</div>
                </div>
                <div>
                    <div style="color: #10b981; font-size: 24px; font-weight: bold;">${report.passed.length}</div>
                    <div style="color: #71717a; font-size: 12px;">Checks Passed</div>
                </div>
            </div>
        </div>

        <!-- Summary by Category -->
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: white; font-size: 16px; margin: 0 0 16px 0;">Issues by Category</h3>
            
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 120px; background: #27272a; padding: 16px; border-radius: 8px; border-left: 3px solid #ef4444;">
                    <div style="color: #ef4444; font-size: 20px; font-weight: bold;">${issuesByCategory.security.length}</div>
                    <div style="color: #a1a1aa; font-size: 12px;">Security</div>
                </div>
                <div style="flex: 1; min-width: 120px; background: #27272a; padding: 16px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                    <div style="color: #3b82f6; font-size: 20px; font-weight: bold;">${issuesByCategory.seo.length}</div>
                    <div style="color: #a1a1aa; font-size: 12px;">SEO</div>
                </div>
                <div style="flex: 1; min-width: 120px; background: #27272a; padding: 16px; border-radius: 8px; border-left: 3px solid #f59e0b;">
                    <div style="color: #f59e0b; font-size: 20px; font-weight: bold;">${issuesByCategory.hygiene.length}</div>
                    <div style="color: #a1a1aa; font-size: 12px;">Hygiene</div>
                </div>
            </div>
        </div>

        <!-- Top Issues -->
        ${topIssues.length > 0 ? `
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: white; font-size: 16px; margin: 0 0 16px 0;">Top Issues to Fix</h3>
            
            ${topIssues.map((issue, index) => renderIssueRow(issue, index)).join('')}
            
            ${report.issues.length > 10 ? `
                <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 16px;">
                    +${report.issues.length - 10} more issues in full report
                </p>
            ` : ''}
        </div>
        ` : ''}

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://prodready.dev/scan?repo=${encodeURIComponent(report.repoUrl)}" 
               style="display: inline-block; background: #22c55e; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                View Full Report →
            </a>
        </div>

        <!-- Quick Fix Tip -->
        <div style="background: #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="color: #a855f7; font-size: 14px; font-weight: 600; margin-bottom: 8px;">💡 Quick Fix Tip</div>
            <p style="color: #d4d4d8; font-size: 14px; margin: 0; line-height: 1.5;">
                Copy the fix prompts from your report and paste them into Cursor, Copilot, or your favorite AI coding assistant to fix issues in seconds.
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #52525b; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">
                Sent by <a href="https://prodready.dev" style="color: #22c55e; text-decoration: none;">ProdReady</a>
            </p>
            <p style="margin: 0;">
                The pre-launch checklist your IDE missed.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

function renderIssueRow(issue: Issue, index: number): string {
    const severityColors: Record<string, string> = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#f59e0b',
        low: '#3b82f6',
    };

    const color = severityColors[issue.severity] || severityColors.low;

    return `
        <div style="padding: 12px 0; border-bottom: 1px solid #27272a; ${index === 9 ? 'border-bottom: none;' : ''}">
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="flex-shrink: 0; width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-top: 6px;"></div>
                <div style="flex: 1;">
                    <div style="color: white; font-size: 14px; font-weight: 500; margin-bottom: 4px;">${issue.title}</div>
                    <div style="color: #71717a; font-size: 12px; font-family: monospace;">${issue.filePath}${issue.lineNumber ? `:${issue.lineNumber}` : ''}</div>
                </div>
                <div style="flex-shrink: 0;">
                    <span style="background: ${color}20; color: ${color}; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: capitalize;">
                        ${issue.severity}
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Plain text version of the email report for email clients that don't support HTML
 */
export function generateEmailReportText(report: ScanReport): string {
    const topIssues = report.issues.slice(0, 10);

    return `
ProdReady Scan Report
=====================

Repository: ${report.repoName}
Scanned: ${new Date(report.scannedAt).toLocaleDateString()}

SCORE: ${report.grade} (${report.vibeScore}/100)
Issues Found: ${report.issues.length}
Checks Passed: ${report.passed.length}

---

ISSUES BY CATEGORY

Security: ${report.issues.filter(i => i.category === 'security').length}
SEO: ${report.issues.filter(i => i.category === 'seo').length}
Hygiene: ${report.issues.filter(i => i.category === 'hygiene').length}

---

TOP ISSUES TO FIX

${topIssues.map((issue, i) => `
${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}
   File: ${issue.filePath}${issue.lineNumber ? `:${issue.lineNumber}` : ''}
`).join('')}

${report.issues.length > 10 ? `+${report.issues.length - 10} more issues in full report` : ''}

---

View your full report: https://prodready.dev/scan?repo=${encodeURIComponent(report.repoUrl)}

Quick Tip: Copy fix prompts from your report and paste them into Cursor or Copilot to fix issues in seconds.

--
ProdReady - The pre-launch checklist your IDE missed.
https://prodready.dev
    `.trim();
}
