import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { GitHubAppConfig, GitHubInstallation, GitHubToken, GitHubRepository, GitHubAuthResult } from '../types/github.types';
import { CacheService } from './cache.service';
import { DatabaseService } from './database.service';
import { Logger } from '../utils/logger';

export class GitHubAuthService {
  private octokit: Octokit;
  private appConfig: GitHubAppConfig;
  private cache: CacheService;
  private db: DatabaseService;
  private logger = Logger.getInstance();

  constructor(config: GitHubAppConfig, cache: CacheService, db: DatabaseService) {
    this.appConfig = config;
    this.cache = cache;
    this.db = db;

    // Initialize Octokit with GitHub App authentication
    this.octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: config.appId,
        privateKey: config.privateKey,
      },
    });
  }

  /**
   * Generate JWT token for GitHub App authentication
   */
  private generateJWT(): string {
    const payload = {
      iat: Math.floor(Date.now() / 1000) - 60, // Issued 1 minute ago
      exp: Math.floor(Date.now() / 1000) + 600, // Expires in 10 minutes
      iss: this.appConfig.appId,
    };

    return jwt.sign(payload, this.appConfig.privateKey, { algorithm: 'RS256' });
  }

  /**
   * Get installation token for a specific installation
   */
  async getInstallationToken(installationId: number): Promise<GitHubToken> {
    const cacheKey = `gh_token:${installationId}`;
    
    // Check cache first
    const cachedToken = await this.cache.get<GitHubToken>(cacheKey);
    if (cachedToken && new Date(cachedToken.expiresAt) > new Date()) {
      return cachedToken;
    }

    try {
      // Get fresh token from GitHub
      const { data } = await this.octokit.rest.apps.createInstallationAccessToken({
        installation_id: installationId,
      });

      const token: GitHubToken = {
        token: data.token,
        expiresAt: new Date(data.expires_at),
        permissions: data.permissions,
      };

      // Cache token until it expires (minus 5 minutes for safety)
      const ttlSeconds = Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000) - 300;
      await this.cache.set(cacheKey, token, ttlSeconds);

      return token;
    } catch (error) {
      this.logger.error('Failed to get installation token:', error);
      throw new Error(`Failed to get installation token: ${error}`);
    }
  }

  /**
   * Handle GitHub App installation
   */
  async handleInstallation(installationData: any): Promise<GitHubInstallation> {
    const installation: GitHubInstallation = {
      id: installationData.id,
      installationId: installationData.id,
      accountLogin: installationData.account.login,
      accountType: installationData.account.type,
      createdAt: new Date(),
    };

    try {
      // Store installation in database
      await this.db.query(
        `INSERT INTO github_installations (installation_id, account_login, account_type, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (installation_id) DO UPDATE SET
         account_login = $2, account_type = $3, created_at = $4`,
        [installation.installationId, installation.accountLogin, installation.accountType, installation.createdAt]
      );

      this.logger.info(`GitHub App installed for ${installation.accountLogin} (ID: ${installation.installationId})`);
      return installation;
    } catch (error) {
      this.logger.error('Failed to store GitHub installation:', error);
      throw new Error(`Failed to store installation: ${error}`);
    }
  }

  /**
   * Handle GitHub App uninstallation
   */
  async handleUninstallation(installationId: number): Promise<void> {
    try {
      // Remove installation from database
      await this.db.query(
        'DELETE FROM github_installations WHERE installation_id = $1',
        [installationId]
      );

      // Clear cached tokens
      await this.cache.delete(`gh_token:${installationId}`);

      this.logger.info(`GitHub App uninstalled for installation ID: ${installationId}`);
    } catch (error) {
      this.logger.error('Failed to handle uninstallation:', error);
      throw new Error(`Failed to handle uninstallation: ${error}`);
    }
  }

  /**
   * Get accessible repositories for an installation
   */
  async getAccessibleRepositories(installationId: number): Promise<GitHubRepository[]> {
    const cacheKey = `gh_repos:${installationId}`;
    
    // Check cache first (5 minute TTL)
    const cachedRepos = await this.cache.get<GitHubRepository[]>(cacheKey);
    if (cachedRepos) {
      return cachedRepos;
    }

    try {
      const token = await this.getInstallationToken(installationId);
      const installationOctokit = new Octokit({
        auth: token.token,
      });

      const repositories: GitHubRepository[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const { data } = await installationOctokit.rest.apps.listReposAccessibleToInstallation({
          per_page: perPage,
          page,
        });

        const repos = data.repositories.map(repo => ({
          id: repo.id,
          nodeId: repo.node_id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          owner: {
            login: repo.owner.login,
            id: repo.owner.id,
            type: repo.owner.type as 'User' | 'Organization',
          },
          htmlUrl: repo.html_url,
          cloneUrl: repo.clone_url,
          sshUrl: repo.ssh_url,
          description: repo.description || undefined,
          topics: repo.topics || [],
          language: repo.language || undefined,
          defaultBranch: repo.default_branch,
          size: repo.size,
          stargazersCount: repo.stargazers_count,
          watchersCount: repo.watchers_count,
          forksCount: repo.forks_count,
          openIssuesCount: repo.open_issues_count,
          pushedAt: new Date(repo.pushed_at),
          createdAt: new Date(repo.created_at),
          updatedAt: new Date(repo.updated_at),
        }));

        repositories.push(...repos);

        if (data.repositories.length < perPage) {
          break;
        }
        page++;
      }

      // Cache repositories for 5 minutes
      await this.cache.set(cacheKey, repositories, 300);

      return repositories;
    } catch (error) {
      this.logger.error('Failed to get accessible repositories:', error);
      throw new Error(`Failed to get repositories: ${error}`);
    }
  }

  /**
   * Validate repository access for an installation
   */
  async validateRepositoryAccess(installationId: number, repoFullName: string): Promise<boolean> {
    try {
      const repositories = await this.getAccessibleRepositories(installationId);
      return repositories.some(repo => repo.fullName === repoFullName);
    } catch (error) {
      this.logger.error('Failed to validate repository access:', error);
      return false;
    }
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(installationId: number, owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const token = await this.getInstallationToken(installationId);
      const installationOctokit = new Octokit({
        auth: token.token,
      });

      const { data } = await installationOctokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id,
        nodeId: data.node_id,
        name: data.name,
        fullName: data.full_name,
        private: data.private,
        owner: {
          login: data.owner.login,
          id: data.owner.id,
          type: data.owner.type as 'User' | 'Organization',
        },
        htmlUrl: data.html_url,
        cloneUrl: data.clone_url,
        sshUrl: data.ssh_url,
        description: data.description || undefined,
        topics: data.topics || [],
        language: data.language || undefined,
        defaultBranch: data.default_branch,
        size: data.size,
        stargazersCount: data.stargazers_count,
        watchersCount: data.watchers_count,
        forksCount: data.forks_count,
        openIssuesCount: data.open_issues_count,
        pushedAt: new Date(data.pushed_at),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      this.logger.error('Failed to get repository info:', error);
      throw new Error(`Failed to get repository info: ${error}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.appConfig.webhookSecret)
      .update(payload)
      .digest('hex');

    const expectedSignatureWithPrefix = `sha256=${expectedSignature}`;
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignatureWithPrefix)
    );
  }

  /**
   * Get user installations
   */
  async getUserInstallations(userId: string): Promise<GitHubInstallation[]> {
    try {
      const result = await this.db.query(
        `SELECT installation_id, account_login, account_type, created_at
         FROM github_installations 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows.map(row => ({
        id: row.installation_id,
        installationId: row.installation_id,
        accountLogin: row.account_login,
        accountType: row.account_type,
        createdAt: row.created_at,
      }));
    } catch (error) {
      this.logger.error('Failed to get user installations:', error);
      throw new Error(`Failed to get user installations: ${error}`);
    }
  }

  /**
   * Rate limiting check for GitHub API
   */
  async checkRateLimit(installationId: number): Promise<{ remaining: number; resetTime: Date }> {
    try {
      const token = await this.getInstallationToken(installationId);
      const installationOctokit = new Octokit({
        auth: token.token,
      });

      const { data } = await installationOctokit.rest.rateLimit.get();

      return {
        remaining: data.rate.remaining,
        resetTime: new Date(data.rate.reset * 1000),
      };
    } catch (error) {
      this.logger.error('Failed to check rate limit:', error);
      throw new Error(`Failed to check rate limit: ${error}`);
    }
  }
}