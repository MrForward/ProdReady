// Scanner Engine Types

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IssueCategory = 'security' | 'seo' | 'hygiene';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface Issue {
  id: string;
  ruleId: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  whyBad: string;
  manualFixGuide: string;
  codeSnippet?: string;
  filePath: string;
  lineNumber?: number;
}

export interface PassedCheck {
  ruleId: string;
  category: IssueCategory;
  title: string;
  appreciation: string;
}

export interface ScanReport {
  id: string;
  repoUrl: string;
  repoName: string;
  githubUsername: string;
  vibeScore: number;
  grade: Grade;
  issues: Issue[];
  passed: PassedCheck[];
  techStack: string[];
  totalFiles: number;
  scannedAt: Date;
}

export interface InspectionRule {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  slug: string;
  description: string;
  whyBad: string;
  manualFixGuide: string;
  appreciation: string;
  check: (files: FileContent[]) => Issue[];
}

export interface FileContent {
  path: string;
  content: string;
  extension: string;
}

export interface ScanProgress {
  step: string;
  status: 'pending' | 'running' | 'done' | 'found';
  message: string;
  issuesFound?: number;
}

export interface RepoInfo {
  owner: string;
  repo: string;
  branch: string;
}
