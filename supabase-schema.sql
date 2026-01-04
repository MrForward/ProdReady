-- ProdReady Database Schema
-- Run this in your Supabase SQL editor to create the necessary tables

-- Email leads table (for email gate unlocks and newsletter)
CREATE TABLE IF NOT EXISTS email_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  repo_url TEXT,
  scan_id UUID,
  issue_count INTEGER,
  source VARCHAR(50) DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, repo_url)
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);
CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON email_leads(created_at DESC);

-- Scans table (for storing scan results)
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_url TEXT NOT NULL,
  repo_name VARCHAR(255) NOT NULL,
  github_username VARCHAR(255) NOT NULL,
  vibe_score INTEGER NOT NULL,
  grade VARCHAR(1) NOT NULL,
  issue_count INTEGER NOT NULL,
  passed_count INTEGER NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  total_files INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for scans
CREATE INDEX IF NOT EXISTS idx_scans_repo_url ON scans(repo_url);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_github_username ON scans(github_username);

-- Votes table (for autofix feature voting)
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  vote_option VARCHAR(20) NOT NULL CHECK (vote_option IN ('security', 'seo', 'hygiene')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email)
);

-- Create index for votes
CREATE INDEX IF NOT EXISTS idx_votes_vote_option ON votes(vote_option);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for vote counts)
CREATE POLICY "Allow public read access to votes" ON votes
  FOR SELECT USING (true);

-- Create policies for insert (anyone can submit)
CREATE POLICY "Allow public insert to email_leads" ON email_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to scans" ON scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Optional: Create a view for vote counts (for better performance)
CREATE OR REPLACE VIEW vote_counts AS
SELECT 
  vote_option,
  COUNT(*) as count
FROM votes
GROUP BY vote_option;

-- Grant access to the view
GRANT SELECT ON vote_counts TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE email_leads IS 'Stores email addresses from scan unlocks and newsletter signups';
COMMENT ON TABLE scans IS 'Stores scan results for analytics and historical tracking';
COMMENT ON TABLE votes IS 'Stores user votes for which autofix feature to build first';
