export interface GitHubAppConfig {
  appId: string;
  privateKey: string;
  webhookSecret: string;
}

export interface GitHubInstallation {
  id: number;
  installationId: number;
  accountLogin: string;
  accountType: 'User' | 'Organization';
  createdAt: Date;
}

export interface GitHubToken {
  token: string;
  expiresAt: Date;
  permissions: Record<string, string>;
}

export interface GitHubRepository {
  id: number;
  nodeId: string;
  name: string;
  fullName: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    type: 'User' | 'Organization';
  };
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
  description?: string;
  topics: string[];
  language?: string;
  defaultBranch: string;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
  pushedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitHubAuthResult {
  success: boolean;
  installationId?: number;
  repositories?: GitHubRepository[];
  error?: string;
}

export interface RepoAccessRequest {
  url: string;
  branch?: string;
  auth?: {
    type: 'app' | 'token' | 'public';
    installationId?: string;
    token?: string;
  };
}