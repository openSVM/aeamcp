-- Migration: Create repository analyses table
-- Up migration

CREATE TABLE IF NOT EXISTS repository_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_url VARCHAR(500) NOT NULL,
    repo_full_name VARCHAR(255), -- e.g., "owner/repo"
    commit_hash VARCHAR(40) NOT NULL,
    branch VARCHAR(255) DEFAULT 'main',
    
    -- Analysis metadata
    analysis_status VARCHAR(50) DEFAULT 'pending' CHECK (
        analysis_status IN ('pending', 'processing', 'completed', 'failed', 'expired')
    ),
    analysis_result JSONB,
    form_data JSONB,
    error_message TEXT,
    processing_time_ms INTEGER,
    
    -- User and installation tracking
    user_id VARCHAR(255),
    installation_id BIGINT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
    
    -- Constraints
    FOREIGN KEY (installation_id) REFERENCES github_installations(installation_id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_repository_analyses_repo_url ON repository_analyses(repo_url);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_commit_hash ON repository_analyses(commit_hash);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_user_id ON repository_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_installation_id ON repository_analyses(installation_id);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_status ON repository_analyses(analysis_status);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_expires_at ON repository_analyses(expires_at);

-- Composite index for cache lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_repository_analyses_cache_key 
    ON repository_analyses(repo_url, commit_hash) 
    WHERE analysis_status = 'completed';

-- Create trigger for updated_at
CREATE TRIGGER update_repository_analyses_updated_at 
    BEFORE UPDATE ON repository_analyses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired analyses
CREATE OR REPLACE FUNCTION cleanup_expired_analyses() 
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM repository_analyses 
    WHERE expires_at < NOW() AND analysis_status != 'processing';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;