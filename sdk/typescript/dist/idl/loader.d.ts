/**
 * IDL loader with caching and hash verification
 */
export declare class IdlLoader {
    private static cache;
    private static readonly CACHE_TTL;
    /**
     * Load and cache IDL with hash verification
     */
    static loadIdl(programName: 'agent_registry' | 'mcp_server_registry', expectedHash?: string, forceFresh?: boolean): Promise<any>;
    /**
     * Get the cached IDL hash
     */
    static getCachedHash(programName: 'agent_registry' | 'mcp_server_registry'): string | undefined;
    /**
     * Calculate SHA256 hash of IDL content
     */
    static calculateIdlHash(idlContent: string): string;
    /**
     * Get the file path for the IDL
     */
    private static getIdlPath;
    /**
     * Clear the IDL cache
     */
    static clearCache(): void;
    /**
     * Get cache statistics
     */
    static getCacheStats(): {
        entries: number;
        keys: string[];
    };
}
/**
 * Known IDL hashes for verification (these would be updated when IDLs change)
 */
export declare const KNOWN_IDL_HASHES: {
    readonly agent_registry: {
        readonly mainnet: "0000000000000000000000000000000000000000000000000000000000000000";
        readonly devnet: "0000000000000000000000000000000000000000000000000000000000000000";
        readonly testnet: "0000000000000000000000000000000000000000000000000000000000000000";
    };
    readonly mcp_server_registry: {
        readonly mainnet: "0000000000000000000000000000000000000000000000000000000000000000";
        readonly devnet: "0000000000000000000000000000000000000000000000000000000000000000";
        readonly testnet: "0000000000000000000000000000000000000000000000000000000000000000";
    };
};
/**
 * Load IDL with network-specific hash verification
 */
export declare function loadIdlForNetwork(programName: 'agent_registry' | 'mcp_server_registry', network: 'mainnet-beta' | 'devnet' | 'testnet', forceFresh?: boolean): Promise<any>;
//# sourceMappingURL=loader.d.ts.map