import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface EmailLead {
    id?: string;
    email: string;
    repo_url?: string;
    scan_id?: string;
    created_at?: string;
}

export interface ScanRecord {
    id: string;
    repo_url: string;
    repo_name: string;
    github_username: string;
    vibe_score: number;
    grade: string;
    issue_count: number;
    passed_count: number;
    tech_stack: string[];
    total_files: number;
    created_at?: string;
}

export interface VoteRecord {
    id?: string;
    email: string;
    vote_option: 'security' | 'seo' | 'hygiene';
    created_at?: string;
}

// Email lead capture
export async function saveEmailLead(email: string, repoUrl?: string, scanId?: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('email_leads')
            .insert([
                {
                    email,
                    repo_url: repoUrl,
                    scan_id: scanId,
                },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to save email:', error);
        return { success: false, error: 'Failed to save email' };
    }
}

// Save scan results
export async function saveScanRecord(scanData: ScanRecord): Promise<{ success: boolean; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('scans')
            .insert([scanData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to save scan:', error);
        return { success: false, error: 'Failed to save scan' };
    }
}

// Save vote
export async function saveVote(email: string, voteOption: 'security' | 'seo' | 'hygiene'): Promise<{ success: boolean; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('votes')
            .insert([
                {
                    email,
                    vote_option: voteOption,
                },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to save vote:', error);
        return { success: false, error: 'Failed to save vote' };
    }
}

// Get vote counts
export async function getVoteCounts(): Promise<{ security: number; seo: number; hygiene: number }> {
    try {
        const { data, error } = await supabase
            .from('votes')
            .select('vote_option');

        if (error) {
            console.error('Supabase error:', error);
            return { security: 847, seo: 623, hygiene: 512 }; // Fallback to hardcoded
        }

        const counts = { security: 0, seo: 0, hygiene: 0 };
        data?.forEach((vote: { vote_option: string }) => {
            if (vote.vote_option in counts) {
                counts[vote.vote_option as keyof typeof counts]++;
            }
        });

        return counts;
    } catch (error) {
        console.error('Failed to get vote counts:', error);
        return { security: 847, seo: 623, hygiene: 512 }; // Fallback
    }
}

// Generic lead save function (used by scan unlock)
export interface LeadData {
    email: string;
    repo_url?: string;
    issue_count?: number;
    source?: string;
}

export async function saveLead(leadData: LeadData): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('email_leads')
            .insert([
                {
                    email: leadData.email,
                    repo_url: leadData.repo_url,
                    issue_count: leadData.issue_count,
                    source: leadData.source || 'unknown',
                },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to save lead:', error);
        return false;
    }
}
