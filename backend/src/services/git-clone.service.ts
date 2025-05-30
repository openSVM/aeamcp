import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { RepoHandle, RepoMetadata } from '../types/analysis.types';
import { RepoAccessRequest } from '../types/github.types';
import { GitHubAuthService } from './github-auth.service';
import { CacheService } from './cache.service';
import { Logger } from '../utils/logger';

export class GitCloneService {
  private tempDir: string;
  private maxRepoSizeMB: number;
  private timeoutMs: number;
  private githubAuth: GitHubAuthService;
  private cache: CacheService;
  private logger = Logger.getInstance();

  constructor(
    githubAuth: GitHubAuthService,
    cache: CacheService,
    options: {
      tempDir?: string;
      maxRepoSizeMB?: number;
      timeoutMs?: number;
    } = {}
  ) {
    this.githubAuth = githubAuth;
    this.cache = cache;
    this.tempDir = options.tempDir || '/tmp/git-analysis';
    this.maxRepoSizeMB = options.maxRepoSizeMB || 100;
    this.timeoutMs = options.timeoutMs || 300000; // 5 minutes

    this.ensureTempDir();
  }

  /**
   * Ensure temp directory exists
   */
  private async ensureTempDir(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create temp directory:', error);
      throw error;
    }
  }

  /**
   * Clone a repository and return a handle
   */
  async cloneRepository(request: RepoAccessRequest): Promise<RepoHandle> {
    const startTime = Date.now();
    const repoId = uuidv4();
    
    try {
      // Validate URL
      const repoInfo = this.parseGitUrl(request.url);
      if (!repoInfo) {
        throw new Error('Invalid Git repository URL');
      }

      // Check cache first
      const cacheKey = `repo:${request.url}:${request.branch || 'default'}`;
      const cachedHandle = await this.cache.get<RepoHandle>(cacheKey);
      if (cachedHandle && await this.validateCachedRepo(cachedHandle)) {
        this.logger.info(`Using cached repository: ${request.url}`);
        return cachedHandle;
      }

      // Get repository metadata first (for size check)
      let metadata: RepoMetadata;
      if (repoInfo.provider === 'github' && request.auth?.type === 'app') {
        metadata = await this.getGitHubMetadata(repoInfo, request.auth.installationId);
      } else {
        metadata = await this.getPublicGitHubMetadata(repoInfo);
      }

      // Check repository size
      if (metadata.size > this.maxRepoSizeMB * 1024) { // GitHub API returns size in KB
        throw new Error(`Repository too large: ${Math.round(metadata.size / 1024)}MB > ${this.maxRepoSizeMB}MB`);
      }

      // Create local path
      const localPath = path.join(this.tempDir, repoId);
      
      // Clone repository
      await this.performClone(request, localPath, repoInfo);

      // Get commit hash
      const commitHash = await this.getCommitHash(localPath);

      // Create handle
      const handle: RepoHandle = {
        id: repoId,
        url: request.url,
        branch: request.branch || metadata.lastCommit ? 'main' : 'master',
        commitHash,
        localPath,
        metadata,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      };

      // Cache the handle
      await this.cache.set(cacheKey, handle, 3600); // 1 hour TTL

      // Schedule cleanup
      this.scheduleCleanup(handle);

      const processingTime = Date.now() - startTime;
      this.logger.info(`Repository cloned successfully`, {
        url: request.url,
        processingTime,
        size: metadata.size,
      });

      return handle;

    } catch (error) {
      this.logger.error('Failed to clone repository:', {
        url: request.url,
        error: error instanceof Error ? error.message : error,
      });
      
      // Clean up on failure
      try {
        const localPath = path.join(this.tempDir, repoId);
        await this.cleanupDirectory(localPath);
      } catch (cleanupError) {
        this.logger.error('Failed to cleanup after clone failure:', cleanupError);
      }
      
      throw error;
    }
  }

  /**
   * Parse Git URL to extract repository information
   */
  private parseGitUrl(url: string): { 
    provider: string; 
    owner: string; 
    repo: string; 
    isPrivate?: boolean;
  } | null {
    // GitHub HTTPS: https://github.com/owner/repo.git
    const githubHttpsMatch = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/)?$/);
    if (githubHttpsMatch) {
      return {
        provider: 'github',
        owner: githubHttpsMatch[1],
        repo: githubHttpsMatch[2],
      };
    }

    // GitHub SSH: git@github.com:owner/repo.git
    const githubSshMatch = url.match(/^git@github\.com:([^\/]+)\/([^\/]+?)(?:\.git)?$/);
    if (githubSshMatch) {
      return {
        provider: 'github',
        owner: githubSshMatch[1],
        repo: githubSshMatch[2],
        isPrivate: true,
      };
    }

    return null;
  }

  /**
   * Get GitHub repository metadata using GitHub API
   */
  private async getGitHubMetadata(
    repoInfo: { owner: string; repo: string },
    installationId?: string
  ): Promise<RepoMetadata> {
    try {
      let githubRepo;
      
      if (installationId) {
        githubRepo = await this.githubAuth.getRepositoryInfo(
          parseInt(installationId),
          repoInfo.owner,
          repoInfo.repo
        );
      } else {
        // For public repositories, we can use basic GitHub API
        const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        const data = await response.json();
        githubRepo = {
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          stargazersCount: data.stargazers_count,
          language: data.language,
          size: data.size,
          topics: data.topics || [],
          pushedAt: new Date(data.pushed_at),
          owner: { login: data.owner.login },
        };
      }

      return {
        owner: githubRepo.owner.login,
        name: githubRepo.name,
        description: githubRepo.description,
        stars: githubRepo.stargazersCount,
        language: githubRepo.language,
        size: githubRepo.size,
        lastCommit: githubRepo.pushedAt,
        topics: githubRepo.topics,
      };
    } catch (error) {
      this.logger.error('Failed to get GitHub metadata:', error);
      throw new Error(`Failed to get repository metadata: ${error}`);
    }
  }

  /**
   * Get public GitHub repository metadata
   */
  private async getPublicGitHubMetadata(
    repoInfo: { owner: string; repo: string }
  ): Promise<RepoMetadata> {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found or not accessible');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        owner: data.owner.login,
        name: data.name,
        description: data.description || '',
        stars: data.stargazers_count || 0,
        language: data.language || undefined,
        size: data.size || 0,
        lastCommit: new Date(data.pushed_at),
        topics: data.topics || [],
      };
    } catch (error) {
      this.logger.error('Failed to get public GitHub metadata:', error);
      throw error;
    }
  }

  /**
   * Perform the actual git clone operation
   */
  private async performClone(
    request: RepoAccessRequest,
    localPath: string,
    repoInfo: { provider: string; owner: string; repo: string }
  ): Promise<void> {
    try {
      // For now, we'll use simple git commands via child_process
      // In production, you'd want to use nodegit for better control
      const { spawn } = require('child_process');
      
      let cloneUrl = request.url;
      let authOptions: string[] = [];

      // Handle authentication for private repositories
      if (request.auth?.type === 'app' && request.auth.installationId) {
        const token = await this.githubAuth.getInstallationToken(parseInt(request.auth.installationId));
        cloneUrl = `https://x-access-token:${token.token}@github.com/${repoInfo.owner}/${repoInfo.repo}.git`;
      }

      // Git clone command with shallow clone
      const args = [
        'clone',
        '--depth=1', // Shallow clone for performance
        '--single-branch',
        '--branch', request.branch || 'main',
        cloneUrl,
        localPath
      ];

      await new Promise<void>((resolve, reject) => {
        const gitProcess = spawn('git', args, {
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: this.timeoutMs,
        });

        let stdout = '';
        let stderr = '';

        gitProcess.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        gitProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
        });

        gitProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Git clone failed with code ${code}: ${stderr}`));
          }
        });

        gitProcess.on('error', (error) => {
          reject(new Error(`Git clone error: ${error.message}`));
        });
      });

    } catch (error) {
      throw new Error(`Clone operation failed: ${error}`);
    }
  }

  /**
   * Get the commit hash of the cloned repository
   */
  private async getCommitHash(localPath: string): Promise<string> {
    try {
      const { spawn } = require('child_process');
      
      return new Promise<string>((resolve, reject) => {
        const gitProcess = spawn('git', ['rev-parse', 'HEAD'], {
          cwd: localPath,
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        gitProcess.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        gitProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
        });

        gitProcess.on('close', (code) => {
          if (code === 0) {
            resolve(stdout.trim());
          } else {
            reject(new Error(`Failed to get commit hash: ${stderr}`));
          }
        });
      });
    } catch (error) {
      this.logger.error('Failed to get commit hash:', error);
      return 'unknown';
    }
  }

  /**
   * Validate that a cached repository handle is still valid
   */
  private async validateCachedRepo(handle: RepoHandle): Promise<boolean> {
    try {
      // Check if directory still exists
      await fs.access(handle.localPath);
      
      // Check if not expired
      if (handle.expiresAt < new Date()) {
        await this.cleanupDirectory(handle.localPath);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean up a repository directory
   */
  private async cleanupDirectory(localPath: string): Promise<void> {
    try {
      await fs.rm(localPath, { recursive: true, force: true });
      this.logger.debug(`Cleaned up directory: ${localPath}`);
    } catch (error) {
      this.logger.error(`Failed to cleanup directory ${localPath}:`, error);
    }
  }

  /**
   * Schedule cleanup for a repository handle
   */
  private scheduleCleanup(handle: RepoHandle): void {
    const ttlMs = handle.expiresAt.getTime() - Date.now();
    
    setTimeout(async () => {
      await this.cleanupDirectory(handle.localPath);
      await this.cache.delete(`repo:${handle.url}:${handle.branch}`);
    }, ttlMs);
  }

  /**
   * Clean up all expired repositories
   */
  async cleanupExpired(): Promise<number> {
    let cleanedCount = 0;
    
    try {
      const entries = await fs.readdir(this.tempDir);
      
      for (const entry of entries) {
        const entryPath = path.join(this.tempDir, entry);
        const stats = await fs.stat(entryPath);
        
        // Clean up directories older than 2 hours (safety buffer)
        if (stats.isDirectory() && Date.now() - stats.mtime.getTime() > 2 * 60 * 60 * 1000) {
          await this.cleanupDirectory(entryPath);
          cleanedCount++;
        }
      }
      
      if (cleanedCount > 0) {
        this.logger.info(`Cleaned up ${cleanedCount} expired repositories`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup expired repositories:', error);
    }
    
    return cleanedCount;
  }

  /**
   * Get service statistics
   */
  async getStats(): Promise<{
    activeRepositories: number;
    tempDirSize: number;
    oldestRepository: Date | null;
  }> {
    try {
      const entries = await fs.readdir(this.tempDir);
      let totalSize = 0;
      let oldestDate: Date | null = null;

      for (const entry of entries) {
        const entryPath = path.join(this.tempDir, entry);
        const stats = await fs.stat(entryPath);
        
        if (stats.isDirectory()) {
          totalSize += await this.getDirectorySize(entryPath);
          
          if (!oldestDate || stats.mtime < oldestDate) {
            oldestDate = stats.mtime;
          }
        }
      }

      return {
        activeRepositories: entries.length,
        tempDirSize: totalSize,
        oldestRepository: oldestDate,
      };
    } catch (error) {
      this.logger.error('Failed to get stats:', error);
      return {
        activeRepositories: 0,
        tempDirSize: 0,
        oldestRepository: null,
      };
    }
  }

  /**
   * Get directory size recursively
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    let size = 0;
    
    try {
      const entries = await fs.readdir(dirPath);
      
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const stats = await fs.stat(entryPath);
        
        if (stats.isDirectory()) {
          size += await this.getDirectorySize(entryPath);
        } else {
          size += stats.size;
        }
      }
    } catch (error) {
      // Ignore errors (permission issues, etc.)
    }
    
    return size;
  }
}