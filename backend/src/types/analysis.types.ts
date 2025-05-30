export interface RepoHandle {
  id: string;
  url: string;
  branch: string;
  commitHash: string;
  localPath: string;
  metadata: RepoMetadata;
  createdAt: Date;
  expiresAt: Date;
}

export interface RepoMetadata {
  owner: string;
  name: string;
  description?: string;
  stars: number;
  language?: string;
  size: number;
  lastCommit: Date;
  topics: string[];
}

export interface McpMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  license?: string;
  documentation?: string;
  repository?: string;
  
  // MCP-specific
  tools: McpTool[];
  resources: McpResource[];
  prompts: McpPrompt[];
  
  // Configuration
  configSchema?: object;
  environmentVars?: string[];
  requiredServices?: string[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema?: object;
  outputSchema?: object;
  handler?: string;
  examples?: Array<{
    input: object;
    output: object;
    description?: string;
  }>;
}

export interface McpResource {
  name: string;
  description: string;
  uri: string;
  mimeType?: string;
  schema?: object;
}

export interface McpPrompt {
  name: string;
  description: string;
  template: string;
  variables?: Array<{
    name: string;
    type: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface AnalysisResult {
  repoId: string;
  languages: string[];
  mcpType: 'server' | 'agent' | 'both' | 'unknown';
  metadata: McpMetadata;
  capabilities: {
    supportsTools: boolean;
    supportsResources: boolean;
    supportsPrompts: boolean;
  };
  dependencies: Dependency[];
  securityIssues: SecurityIssue[];
  productionReadiness: ReadinessScore;
  analysisTimestamp: Date;
  processingTimeMs: number;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer';
  ecosystem: 'npm' | 'cargo' | 'pip' | 'maven' | 'go';
  vulnerabilities?: Vulnerability[];
}

export interface Vulnerability {
  id: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  fixedIn?: string;
}

export interface SecurityIssue {
  type: 'hardcoded_secret' | 'insecure_dependency' | 'missing_validation' | 'exposed_api_key';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line?: number;
  description: string;
  recommendation: string;
}

export interface ReadinessScore {
  overall: number; // 0-100
  categories: {
    errorHandling: CategoryScore;
    security: CategoryScore;
    documentation: CategoryScore;
    testing: CategoryScore;
    configuration: CategoryScore;
    performance: CategoryScore;
  };
  recommendations: Recommendation[];
  isProductionReady: boolean; // overall >= 70
}

export interface CategoryScore {
  score: number; // 0-100
  weight: number; // 0-1
  details: string[];
  passed: Check[];
  failed: Check[];
}

export interface Check {
  name: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  fix?: string;
  passed: boolean;
}

export interface Recommendation {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface RegistrationFormData {
  // Basic Information
  serverId: string;
  name: string;
  version: string;
  description: string;
  
  // Technical Details
  serviceEndpoint?: string;
  documentationUrl?: string;
  capabilities: {
    supportsTools: boolean;
    supportsResources: boolean;
    supportsPrompts: boolean;
  };
  
  // On-chain summaries (limited by Solana account size)
  toolDefinitions: McpTool[];
  resourceDefinitions: McpResource[];
  promptDefinitions: McpPrompt[];
  
  // Metadata
  tags: string[];
  productionReadinessScore: number;
  
  // Git information
  sourceRepoUrl: string;
  repoCommitHash: string;
  
  // Deployment options (user choice)
  deploymentPreference?: 'self-hosted' | 'cloud' | 'hybrid';
}