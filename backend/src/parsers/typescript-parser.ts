import * as fs from 'fs';
import * as path from 'path';
import { McpMetadata, McpTool, McpResource, McpPrompt } from '../types/analysis.types';
import { Logger } from '../utils/logger';

export interface ParseResult {
  language: 'typescript' | 'javascript';
  mcpType: 'server' | 'agent' | 'both' | 'unknown';
  metadata: McpMetadata;
  tools: McpTool[];
  resources: McpResource[];
  prompts: McpPrompt[];
  confidence: number; // 0-1 score of how confident we are this is an MCP project
}

export class TypeScriptMcpParser {
  private logger = Logger.getInstance();

  /**
   * Parse a TypeScript/JavaScript project for MCP patterns
   */
  async parse(projectPath: string): Promise<ParseResult> {
    try {
      const startTime = Date.now();
      
      // 1. Parse package.json
      const packageJson = await this.parsePackageJson(projectPath);
      
      // 2. Detect MCP SDK usage
      const mcpImports = await this.findMcpImports(projectPath);
      
      // 3. Extract tool definitions
      const tools = await this.extractTools(projectPath);
      
      // 4. Extract resource definitions
      const resources = await this.extractResources(projectPath);
      
      // 5. Extract prompt definitions
      const prompts = await this.extractPrompts(projectPath);
      
      // 6. Determine MCP type and confidence
      const mcpType = this.determineMcpType(tools, resources, prompts, mcpImports);
      const confidence = this.calculateConfidence(packageJson, mcpImports, tools, resources, prompts);
      
      // 7. Build metadata
      const metadata = this.buildMetadata(packageJson, tools, resources, prompts, projectPath);
      
      const processingTime = Date.now() - startTime;
      this.logger.info(`TypeScript parser completed in ${processingTime}ms`, {
        tools: tools.length,
        resources: resources.length,
        prompts: prompts.length,
        confidence,
      });

      return {
        language: this.detectLanguage(projectPath),
        mcpType,
        metadata,
        tools,
        resources,
        prompts,
        confidence,
      };
    } catch (error) {
      this.logger.error('TypeScript parser failed:', error);
      throw new Error(`Failed to parse TypeScript project: ${error}`);
    }
  }

  /**
   * Parse package.json for project metadata and dependencies
   */
  private async parsePackageJson(projectPath: string): Promise<any> {
    try {
      const packagePath = path.join(projectPath, 'package.json');
      const packageContent = await fs.promises.readFile(packagePath, 'utf-8');
      return JSON.parse(packageContent);
    } catch (error) {
      this.logger.warn('No package.json found or invalid JSON');
      return {};
    }
  }

  /**
   * Find MCP SDK imports and usage patterns
   */
  private async findMcpImports(projectPath: string): Promise<string[]> {
    const mcpPatterns = [
      // Import patterns
      /import\s+.*from\s+['"]@modelcontextprotocol\/sdk['"]/g,
      /require\(['"]@modelcontextprotocol\/sdk['"]\)/g,
      
      // Server instantiation
      /new\s+Server\s*\(/g,
      /Server\s*\.\s*create\s*\(/g,
      
      // Method calls
      /server\s*\.\s*addTool\s*\(/g,
      /server\s*\.\s*addResource\s*\(/g,
      /server\s*\.\s*addPrompt\s*\(/g,
      /server\s*\.\s*setRequestHandler\s*\(/g,
    ];

    const foundPatterns: string[] = [];
    const files = await this.findSourceFiles(projectPath);

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf-8');
        
        for (const pattern of mcpPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            foundPatterns.push(...matches);
          }
        }
      } catch (error) {
        this.logger.warn(`Failed to read file ${file}:`, error);
      }
    }

    return [...new Set(foundPatterns)]; // Remove duplicates
  }

  /**
   * Extract tool definitions from source code
   */
  private async extractTools(projectPath: string): Promise<McpTool[]> {
    const tools: McpTool[] = [];
    const files = await this.findSourceFiles(projectPath);

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf-8');
        const fileTools = this.extractToolsFromContent(content, file);
        tools.push(...fileTools);
      } catch (error) {
        this.logger.warn(`Failed to extract tools from ${file}:`, error);
      }
    }

    return tools;
  }

  /**
   * Extract tools from file content
   */
  private extractToolsFromContent(content: string, filePath: string): McpTool[] {
    const tools: McpTool[] = [];

    // Pattern 1: server.addTool({ name: "...", description: "...", ... })
    const addToolPattern = /server\s*\.\s*addTool\s*\(\s*\{([^}]+)\}/g;
    let match;

    while ((match = addToolPattern.exec(content)) !== null) {
      const toolConfig = match[1];
      const tool = this.parseToolConfig(toolConfig, filePath);
      if (tool) {
        tools.push(tool);
      }
    }

    // Pattern 2: setRequestHandler with tool names
    const handlerPattern = /setRequestHandler\s*\(\s*['"]tools\/([^'"]+)['"]/g;
    while ((match = handlerPattern.exec(content)) !== null) {
      const toolName = match[1];
      tools.push({
        name: toolName,
        description: `Tool handler for ${toolName}`,
        handler: `tools/${toolName}`,
      });
    }

    // Pattern 3: Tool registration in arrays or objects
    const toolListPattern = /tools\s*:\s*\[([^\]]+)\]/g;
    while ((match = toolListPattern.exec(content)) !== null) {
      const toolsArray = match[1];
      const arrayTools = this.parseToolsArray(toolsArray);
      tools.push(...arrayTools);
    }

    return tools;
  }

  /**
   * Parse tool configuration object
   */
  private parseToolConfig(configStr: string, filePath: string): McpTool | null {
    try {
      // Extract name
      const nameMatch = configStr.match(/name\s*:\s*['"]([^'"]+)['"]/);
      if (!nameMatch) return null;

      const name = nameMatch[1];

      // Extract description
      const descMatch = configStr.match(/description\s*:\s*['"]([^'"]+)['"]/);
      const description = descMatch ? descMatch[1] : `Tool: ${name}`;

      // Extract input schema (basic parsing)
      const schemaMatch = configStr.match(/inputSchema\s*:\s*(\{[^}]+\})/);
      let inputSchema;
      if (schemaMatch) {
        try {
          // This is a simplified schema extraction - in production you'd want proper AST parsing
          inputSchema = this.parseSimpleSchema(schemaMatch[1]);
        } catch {
          inputSchema = undefined;
        }
      }

      // Extract handler function name
      const handlerMatch = configStr.match(/handler\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)/);
      const handler = handlerMatch ? handlerMatch[1] : undefined;

      return {
        name,
        description,
        inputSchema,
        handler,
      };
    } catch (error) {
      this.logger.warn(`Failed to parse tool config in ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Parse tools from an array definition
   */
  private parseToolsArray(arrayStr: string): McpTool[] {
    const tools: McpTool[] = [];
    
    // Split by objects (simplified approach)
    const objectPattern = /\{([^}]+)\}/g;
    let match;

    while ((match = objectPattern.exec(arrayStr)) !== null) {
      const tool = this.parseToolConfig(match[1], 'array');
      if (tool) {
        tools.push(tool);
      }
    }

    return tools;
  }

  /**
   * Extract resource definitions
   */
  private async extractResources(projectPath: string): Promise<McpResource[]> {
    const resources: McpResource[] = [];
    const files = await this.findSourceFiles(projectPath);

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf-8');
        
        // Pattern: server.addResource() or similar
        const resourcePattern = /server\s*\.\s*addResource\s*\(\s*\{([^}]+)\}/g;
        let match;

        while ((match = resourcePattern.exec(content)) !== null) {
          const resourceConfig = match[1];
          const resource = this.parseResourceConfig(resourceConfig);
          if (resource) {
            resources.push(resource);
          }
        }
      } catch (error) {
        this.logger.warn(`Failed to extract resources from ${file}:`, error);
      }
    }

    return resources;
  }

  /**
   * Parse resource configuration
   */
  private parseResourceConfig(configStr: string): McpResource | null {
    try {
      const nameMatch = configStr.match(/name\s*:\s*['"]([^'"]+)['"]/);
      const uriMatch = configStr.match(/uri\s*:\s*['"]([^'"]+)['"]/);
      const descMatch = configStr.match(/description\s*:\s*['"]([^'"]+)['"]/);

      if (!nameMatch || !uriMatch) return null;

      return {
        name: nameMatch[1],
        uri: uriMatch[1],
        description: descMatch ? descMatch[1] : `Resource: ${nameMatch[1]}`,
      };
    } catch {
      return null;
    }
  }

  /**
   * Extract prompt definitions
   */
  private async extractPrompts(projectPath: string): Promise<McpPrompt[]> {
    const prompts: McpPrompt[] = [];
    const files = await this.findSourceFiles(projectPath);

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf-8');
        
        // Pattern: server.addPrompt() or similar
        const promptPattern = /server\s*\.\s*addPrompt\s*\(\s*\{([^}]+)\}/g;
        let match;

        while ((match = promptPattern.exec(content)) !== null) {
          const promptConfig = match[1];
          const prompt = this.parsePromptConfig(promptConfig);
          if (prompt) {
            prompts.push(prompt);
          }
        }
      } catch (error) {
        this.logger.warn(`Failed to extract prompts from ${file}:`, error);
      }
    }

    return prompts;
  }

  /**
   * Parse prompt configuration
   */
  private parsePromptConfig(configStr: string): McpPrompt | null {
    try {
      const nameMatch = configStr.match(/name\s*:\s*['"]([^'"]+)['"]/);
      const templateMatch = configStr.match(/template\s*:\s*['"]([^'"]+)['"]/);
      const descMatch = configStr.match(/description\s*:\s*['"]([^'"]+)['"]/);

      if (!nameMatch || !templateMatch) return null;

      return {
        name: nameMatch[1],
        template: templateMatch[1],
        description: descMatch ? descMatch[1] : `Prompt: ${nameMatch[1]}`,
      };
    } catch {
      return null;
    }
  }

  /**
   * Find all TypeScript/JavaScript source files
   */
  private async findSourceFiles(projectPath: string): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

    async function scanDirectory(dir: string): Promise<void> {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            // Skip node_modules and other common directories
            if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
              await scanDirectory(fullPath);
            }
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Ignore permission errors and continue
      }
    }

    await scanDirectory(projectPath);
    return files;
  }

  /**
   * Determine MCP type based on found components
   */
  private determineMcpType(
    tools: McpTool[],
    resources: McpResource[],
    prompts: McpPrompt[],
    imports: string[]
  ): 'server' | 'agent' | 'both' | 'unknown' {
    const hasTools = tools.length > 0;
    const hasResources = resources.length > 0;
    const hasPrompts = prompts.length > 0;
    const hasMcpImports = imports.length > 0;

    if (!hasMcpImports && !hasTools && !hasResources && !hasPrompts) {
      return 'unknown';
    }

    // Simple heuristic: if it provides tools/resources/prompts, it's likely a server
    if (hasTools || hasResources || hasPrompts) {
      return 'server';
    }

    // If it has MCP imports but no obvious server patterns, might be an agent
    if (hasMcpImports) {
      return 'agent';
    }

    return 'unknown';
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    packageJson: any,
    imports: string[],
    tools: McpTool[],
    resources: McpResource[],
    prompts: McpPrompt[]
  ): number {
    let score = 0;

    // Package.json indicators
    if (packageJson.dependencies?.['@modelcontextprotocol/sdk']) score += 0.4;
    if (packageJson.name?.includes('mcp')) score += 0.1;
    if (packageJson.description?.toLowerCase().includes('mcp')) score += 0.1;

    // Import patterns
    if (imports.length > 0) score += Math.min(0.3, imports.length * 0.1);

    // Found components
    if (tools.length > 0) score += Math.min(0.2, tools.length * 0.05);
    if (resources.length > 0) score += Math.min(0.1, resources.length * 0.05);
    if (prompts.length > 0) score += Math.min(0.1, prompts.length * 0.05);

    return Math.min(1, score);
  }

  /**
   * Detect primary language
   */
  private detectLanguage(projectPath: string): 'typescript' | 'javascript' {
    try {
      // Check for TypeScript files or tsconfig.json
      const tsconfigExists = fs.existsSync(path.join(projectPath, 'tsconfig.json'));
      if (tsconfigExists) return 'typescript';

      // Check for TypeScript files in the project
      // This is a simplified check - in production you'd scan the directory
      return 'javascript';
    } catch {
      return 'javascript';
    }
  }

  /**
   * Build comprehensive metadata
   */
  private buildMetadata(
    packageJson: any,
    tools: McpTool[],
    resources: McpResource[],
    prompts: McpPrompt[],
    projectPath: string
  ): McpMetadata {
    return {
      name: packageJson.name || path.basename(projectPath),
      version: packageJson.version || '1.0.0',
      description: packageJson.description || '',
      author: packageJson.author || undefined,
      license: packageJson.license || undefined,
      repository: packageJson.repository?.url || undefined,
      tools,
      resources,
      prompts,
      environmentVars: this.extractEnvironmentVars(projectPath),
      configSchema: this.extractConfigSchema(packageJson),
    };
  }

  /**
   * Extract environment variables from various sources
   */
  private extractEnvironmentVars(projectPath: string): string[] {
    const envVars: Set<string> = new Set();

    try {
      // Check for .env.example file
      const envExamplePath = path.join(projectPath, '.env.example');
      if (fs.existsSync(envExamplePath)) {
        const envContent = fs.readFileSync(envExamplePath, 'utf-8');
        const matches = envContent.match(/^([A-Z_][A-Z0-9_]*)\s*=/gm);
        if (matches) {
          matches.forEach(match => {
            const varName = match.split('=')[0];
            envVars.add(varName);
          });
        }
      }

      // TODO: Scan source code for process.env.VARIABLE_NAME patterns
    } catch (error) {
      this.logger.warn('Failed to extract environment variables:', error);
    }

    return Array.from(envVars);
  }

  /**
   * Extract configuration schema from package.json or config files
   */
  private extractConfigSchema(packageJson: any): object | undefined {
    // Look for MCP-specific configuration in package.json
    if (packageJson.mcp) {
      return packageJson.mcp;
    }

    // Could also check for config files like mcp.config.json
    return undefined;
  }

  /**
   * Parse simple schema objects (very basic implementation)
   */
  private parseSimpleSchema(schemaStr: string): object | undefined {
    try {
      // This is a very simplified schema parser
      // In production, you'd want proper AST parsing
      const cleanStr = schemaStr
        .replace(/'/g, '"')
        .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
      
      return JSON.parse(cleanStr);
    } catch {
      return undefined;
    }
  }
}