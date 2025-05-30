-- Migration: Create GitHub installations table
-- Up migration

CREATE TABLE IF NOT EXISTS github_installations (
    id SERIAL PRIMARY KEY,
    installation_id BIGINT UNIQUE NOT NULL,
    account_login VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('User', 'Organization')),
    user_id VARCHAR(255), -- Link to user who installed the app
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_github_installations_installation_id ON github_installations(installation_id);
CREATE INDEX IF NOT EXISTS idx_github_installations_user_id ON github_installations(user_id);
CREATE INDEX IF NOT EXISTS idx_github_installations_account_login ON github_installations(account_login);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_github_installations_updated_at 
    BEFORE UPDATE ON github_installations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();