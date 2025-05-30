import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GitHubAuthService } from '../services/github-auth.service';
import { GitCloneService } from '../services/git-clone.service';
import { TypeScriptMcpParser } from '../parsers/typescript-parser';
import { ReadinessScorer } from '../services/readiness-scorer.service';
import { CacheService } from '../services/cache.service';
import { DatabaseService } from '../services/database.service';
import { RepoAccessRequest } from '../types/github.types';
import { AnalysisResult, RegistrationFormData } from '../types/analysis.types';
import { Logger } from '../utils/logger';

export class AnalysisController {
  private githubAuth: GitHubAuthService;
  private gitClone: GitCloneService;
  private tsParser: TypeScriptMcpParser;
  private scorer: ReadinessScorer;
  private cache: CacheService;
  private db: DatabaseService;
  private logger = Logger.getInstance();

  constructor(
    githubAuth: GitHubAuthService,
    gitClone: GitCloneService,
    cache: CacheService,
    db: DatabaseService
  ) {
    this.githubAuth = githubAuth;
    this.gitClone = gitClone;
    this.cache = cache;
    this.db = db;
    this.tsParser = new TypeScriptMcpParser();
    this.scorer = new ReadinessScorer();
  }

  /**
   * POST /api/v1/git/analyze
   * Start repository analysis
   */
  async analyzeRepository(req: Request, res: Response): Promise<void> {
    try {
      const { url, branch, auth } = req.body as RepoAccessRequest;
      const userId = req.headers['x-user-id'] as string; // From auth middleware

      // Validate request
      if (!url) {
        res.status(400).json({
          error: 'Repository URL is required',
          code: 'MISSING_URL'
        });
        return;
      }

      // Validate URL format
      if (!this.isValidGitUrl(url)) {
        res.status(400).json({
          error: 'Invalid Git repository URL',
          code: 'INVALID_URL'
        });
        return;
      }

      // Check for existing analysis
      const existingAnalysis = await this.checkExistingAnalysis(url, branch);
      if (existingAnalysis) {
        res.json({
          repoId: existingAnalysis.id,
          status: existingAnalysis.analysis_status,
          analysis: existingAnalysis.analysis_result,
          formData: existingAnalysis.form_data,
          cached: true
        });
        return;
      }

      // Validate repository access if private
      if (auth?.type === 'app' && auth.installationId) {
        const hasAccess = await this.validateRepositoryAccess(url, auth.installationId);
        if (!hasAccess) {
          res.status(403).json({
            error: 'Repository not accessible with provided credentials',
            code: 'ACCESS_DENIED'
          });
          return;
        }
      }

      // Create analysis record
      const analysisId = uuidv4();
      await this.db.insert('repository_analyses', {
        id: analysisId,
        repo_url: url,
        repo_full_name: this.extractRepoFullName(url),
        commit_hash: '', // Will be updated after clone
        branch: branch || 'main',
        analysis_status: 'pending',
        user_id: userId,
        installation_id: auth?.installationId ? parseInt(auth.installationId) : null,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // Start async analysis
      this.processAnalysisAsync(analysisId, { url, branch, auth }, userId);

      res.status(202).json({
        repoId: analysisId,
        status: 'pending',
        message: 'Analysis started. Use WebSocket or polling to get updates.',
        analysisUrl: `/api/v1/git/analysis/${analysisId}`
      });

    } catch (error) {
      this.logger.error('Analysis request failed:', error);
      res.status(500).json({
        error: 'Failed to start analysis',
        code: 'ANALYSIS_FAILED'
      });
    }
  }

  /**
   * GET /api/v1/git/analysis/:repoId
   * Get analysis status and results
   */
  async getAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { repoId } = req.params;
      const userId = req.headers['x-user-id'] as string;

      const result = await this.db.query(
        'SELECT * FROM repository_analyses WHERE id = $1 AND user_id = $2',
        [repoId, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          error: 'Analysis not found',
          code: 'NOT_FOUND'
        });
        return;
      }

      const analysis = result.rows[0];

      // Check if expired
      if (new Date(analysis.expires_at) < new Date()) {
        res.status(410).json({
          error: 'Analysis has expired',
          code: 'EXPIRED'
        });
        return;
      }

      res.json({
        repoId: analysis.id,
        repoUrl: analysis.repo_url,
        status: analysis.analysis_status,
        analysis: analysis.analysis_result,
        formData: analysis.form_data,
        error: analysis.error_message,
        processingTime: analysis.processing_time_ms,
        createdAt: analysis.created_at,
        expiresAt: analysis.expires_at
      });

    } catch (error) {
      this.logger.error('Failed to get analysis:', error);
      res.status(500).json({
        error: 'Failed to retrieve analysis',
        code: 'RETRIEVAL_FAILED'
      });
    }
  }

  /**
   * GET /api/v1/git/analyses
   * List user's analyses with pagination
   */
  async listAnalyses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.headers['x-user-id'] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;

      const result = await this.db.findWithPagination('repository_analyses', {
        where: { user_id: userId },
        orderBy: 'created_at DESC',
        limit,
        offset,
        select: 'id, repo_url, repo_full_name, analysis_status, created_at, expires_at'
      });

      res.json({
        analyses: result.rows,
        pagination: {
          page,
          limit,
          total: result.totalCount,
          pages: Math.ceil(result.totalCount / limit)
        }
      });

    } catch (error) {
      this.logger.error('Failed to list analyses:', error);
      res.status(500).json({
        error: 'Failed to list analyses',
        code: 'LIST_FAILED'
      });
    }
  }

  /**
   * DELETE /api/v1/git/analysis/:repoId
   * Delete analysis and cleanup
   */
  async deleteAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { repoId } = req.params;
      const userId = req.headers['x-user-id'] as string;

      const result = await this.db.query(
        'DELETE FROM repository_analyses WHERE id = $1 AND user_id = $2 RETURNING *',
        [repoId, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          error: 'Analysis not found',
          code: 'NOT_FOUND'
        });
        return;
      }

      // Clean up cache
      const analysis = result.rows[0];
      await this.cache.deletePattern(`repo:${analysis.repo_url}:*`);

      res.json({
        message: 'Analysis deleted successfully'
      });

    } catch (error) {
      this.logger.error('Failed to delete analysis:', error);
      res.status(500).json({
        error: 'Failed to delete analysis',
        code: 'DELETE_FAILED'
      });
    }
  }

  /**
   * Process analysis asynchronously
   */
  private async processAnalysisAsync(
    analysisId: string,
    request: RepoAccessRequest,
    userId: string
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Update status to processing
      await this.updateAnalysisStatus(analysisId, 'processing');

      // Clone repository
      const repoHandle = await this.gitClone.cloneRepository(request);

      // Update commit hash
      await this.db.query(
        'UPDATE repository_analyses SET commit_hash = $1 WHERE id = $2',
        [repoHandle.commitHash, analysisId]
      );

      // Parse repository
      const parseResult = await this.tsParser.parse(repoHandle.localPath);

      // Score production readiness
      const analysisResult: AnalysisResult = {
        repoId: analysisId,
        languages: [parseResult.language],
        mcpType: parseResult.mcpType,
        metadata: parseResult.metadata,
        capabilities: {
          supportsTools: parseResult.tools.length > 0,
          supportsResources: parseResult.resources.length > 0,
          supportsPrompts: parseResult.prompts.length > 0,
        },
        dependencies: [], // TODO: Extract from package.json
        securityIssues: [], // TODO: Implement security scanning
        productionReadiness: await this.scorer.calculateScore({
          repoId: analysisId,
          languages: [parseResult.language],
          mcpType: parseResult.mcpType,
          metadata: parseResult.metadata,
          capabilities: {
            supportsTools: parseResult.tools.length > 0,
            supportsResources: parseResult.resources.length > 0,
            supportsPrompts: parseResult.prompts.length > 0,
          },
          dependencies: [],
          securityIssues: [],
          productionReadiness: { overall: 0, categories: {}, recommendations: [], isProductionReady: false } as any,
          analysisTimestamp: new Date(),
          processingTimeMs: 0
        }),
        analysisTimestamp: new Date(),
        processingTimeMs: Date.now() - startTime,
      };

      // Generate form data
      const formData = this.generateFormData(analysisResult, repoHandle);

      // Update database with results
      await this.db.query(
        `UPDATE repository_analyses 
         SET analysis_status = 'completed', 
             analysis_result = $1, 
             form_data = $2,
             processing_time_ms = $3
         WHERE id = $4`,
        [JSON.stringify(analysisResult), JSON.stringify(formData), analysisResult.processingTimeMs, analysisId]
      );

      this.logger.info(`Analysis completed successfully for ${request.url}`, {
        analysisId,
        processingTime: analysisResult.processingTimeMs,
        mcpType: analysisResult.mcpType,
        readinessScore: analysisResult.productionReadiness.overall
      });

    } catch (error) {
      this.logger.error(`Analysis failed for ${request.url}:`, error);

      await this.db.query(
        `UPDATE repository_analyses 
         SET analysis_status = 'failed', 
             error_message = $1,
             processing_time_ms = $2
         WHERE id = $3`,
        [error instanceof Error ? error.message : String(error), Date.now() - startTime, analysisId]
      );
    }
  }

  /**
   * Generate registration form data from analysis results
   */
  private generateFormData(analysis: AnalysisResult, repoHandle: any): RegistrationFormData {
    const metadata = analysis.metadata;
    
    // Generate server ID from repository name
    const serverId = repoHandle.metadata.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Limit tools/resources/prompts for on-chain storage
    const maxOnChainItems = 5;

    return {
      serverId,
      name: metadata.name || repoHandle.metadata.name,
      version: metadata.version || '1.0.0',
      description: metadata.description || repoHandle.metadata.description || '',
      documentationUrl: metadata.documentation || metadata.repository,
      capabilities: analysis.capabilities,
      toolDefinitions: metadata.tools.slice(0, maxOnChainItems),
      resourceDefinitions: metadata.resources.slice(0, maxOnChainItems),
      promptDefinitions: metadata.prompts.slice(0, maxOnChainItems),
      tags: this.generateTags(repoHandle.metadata, analysis),
      productionReadinessScore: analysis.productionReadiness.overall,
      sourceRepoUrl: repoHandle.url,
      repoCommitHash: repoHandle.commitHash,
    };
  }

  /**
   * Generate appropriate tags for the MCP server
   */
  private generateTags(repoMetadata: any, analysis: AnalysisResult): string[] {
    const tags: Set<string> = new Set();

    // Add language tags
    if (repoMetadata.language) {
      tags.add(repoMetadata.language.toLowerCase());
    }

    // Add GitHub topics
    if (repoMetadata.topics) {
      repoMetadata.topics.forEach((topic: string) => tags.add(topic));
    }

    // Add MCP-specific tags
    tags.add('mcp-server');
    if (analysis.capabilities.supportsTools) tags.add('tools');
    if (analysis.capabilities.supportsResources) tags.add('resources');
    if (analysis.capabilities.supportsPrompts) tags.add('prompts');

    // Add readiness tags
    if (analysis.productionReadiness.isProductionReady) {
      tags.add('production-ready');
    }

    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  private async updateAnalysisStatus(analysisId: string, status: string): Promise<void> {
    await this.db.query(
      'UPDATE repository_analyses SET analysis_status = $1 WHERE id = $2',
      [status, analysisId]
    );
  }

  private async checkExistingAnalysis(url: string, branch?: string): Promise<any> {
    const result = await this.db.query(
      `SELECT * FROM repository_analyses 
       WHERE repo_url = $1 
       AND branch = $2 
       AND analysis_status = 'completed'
       AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [url, branch || 'main']
    );

    return result.rows[0] || null;
  }

  private async validateRepositoryAccess(url: string, installationId: string): Promise<boolean> {
    try {
      const repoFullName = this.extractRepoFullName(url);
      if (!repoFullName) return false;

      return await this.githubAuth.validateRepositoryAccess(
        parseInt(installationId),
        repoFullName
      );
    } catch {
      return false;
    }
  }

  private isValidGitUrl(url: string): boolean {
    const gitUrlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+(?:\.git)?(?:\/)?$/;
    return gitUrlPattern.test(url);
  }

  private extractRepoFullName(url: string): string | null {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+?)(?:\.git)?(?:\/)?$/);
    return match ? match[1] : null;
  }
}