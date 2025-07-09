import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { IdlError } from '../errors.js';
/**
 * IDL loader with caching and hash verification
 */
export class IdlLoader {
    static cache = new Map();
    static CACHE_TTL = 300_000; // 5 minutes
    /**
     * Load and cache IDL with hash verification
     */
    static async loadIdl(programName, expectedHash, forceFresh = false) {
        const cacheKey = `${programName}_idl`;
        // Check cache first (unless forcing fresh)
        if (!forceFresh) {
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.lastUpdated < this.CACHE_TTL) {
                return cached.idl;
            }
        }
        try {
            // Load IDL from file
            const idlPath = this.getIdlPath(programName);
            const idlContent = readFileSync(idlPath, 'utf8');
            const idl = JSON.parse(idlContent);
            // Verify hash if provided
            if (expectedHash) {
                const actualHash = this.calculateIdlHash(idlContent);
                if (actualHash !== expectedHash) {
                    throw new IdlError(`IDL hash mismatch for ${programName}. Expected: ${expectedHash}, Actual: ${actualHash}`);
                }
            }
            // Cache the IDL
            this.cache.set(cacheKey, {
                idl,
                hash: this.calculateIdlHash(idlContent),
                lastUpdated: Date.now(),
            });
            return idl;
        }
        catch (error) {
            if (error instanceof IdlError) {
                throw error;
            }
            throw new IdlError(`Failed to load IDL for ${programName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get the cached IDL hash
     */
    static getCachedHash(programName) {
        const cacheKey = `${programName}_idl`;
        return this.cache.get(cacheKey)?.hash;
    }
    /**
     * Calculate SHA256 hash of IDL content
     */
    static calculateIdlHash(idlContent) {
        return createHash('sha256').update(idlContent, 'utf8').digest('hex');
    }
    /**
     * Get the file path for the IDL
     */
    static getIdlPath(programName) {
        // In a real implementation, these paths would be relative to the package root
        // or loaded from a remote source
        const basePath = process.env.IDL_BASE_PATH || '../../idl';
        switch (programName) {
            case 'agent_registry':
                return `${basePath}/agent_registry.json`;
            case 'mcp_server_registry':
                return `${basePath}/mcp_server_registry.json`;
            default:
                throw new IdlError(`Unknown program name: ${programName}`);
        }
    }
    /**
     * Clear the IDL cache
     */
    static clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    static getCacheStats() {
        return {
            entries: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}
/**
 * Known IDL hashes for verification (these would be updated when IDLs change)
 */
export const KNOWN_IDL_HASHES = {
    agent_registry: {
        // These would be the actual hashes of the IDL files
        mainnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        devnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        testnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
    },
    mcp_server_registry: {
        mainnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        devnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        testnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
    },
};
/**
 * Load IDL with network-specific hash verification
 */
export async function loadIdlForNetwork(programName, network, forceFresh = false) {
    const networkKey = network === 'mainnet-beta' ? 'mainnet' : network;
    const expectedHash = KNOWN_IDL_HASHES[programName][networkKey];
    return IdlLoader.loadIdl(programName, expectedHash, forceFresh);
}
//# sourceMappingURL=loader.js.map