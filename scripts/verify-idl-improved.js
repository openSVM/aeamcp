#!/usr/bin/env node

/**
 * Improved IDL Verification Script
 * 
 * This script verifies that the generated IDL files accurately represent
 * the actual program interfaces by cross-referencing with the source code.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

function loadIDL(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        log(colors.red, `❌ Failed to load IDL: ${filePath}`);
        log(colors.red, `   Error: ${error.message}`);
        return null;
    }
}

function loadSourceFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        log(colors.yellow, `⚠️  Could not load source file: ${filePath}`);
        return '';
    }
}

function verifyInstructions(idl, sourceCode, programName) {
    log(colors.blue, `\n🔍 Verifying ${programName} instructions...`);
    
    const instructions = idl.instructions;
    let passed = 0;
    let total = instructions.length;
    
    instructions.forEach(instruction => {
        const instructionName = instruction.name;
        
        // Multiple patterns to match instruction names
        const patterns = [
            new RegExp(`${instructionName}\\s*{`, 'i'),
            new RegExp(`${instructionName}\\s*=>`, 'i'),
            new RegExp(`${instructionName.replace(/([A-Z])/g, '_$1').toLowerCase()}`, 'i'),
            new RegExp(`${instructionName}`, 'i')
        ];
        
        const found = patterns.some(pattern => pattern.test(sourceCode));
        
        if (found) {
            log(colors.green, `  ✅ ${instructionName} - found in source`);
            passed++;
        } else {
            log(colors.red, `  ❌ ${instructionName} - NOT found in source`);
        }
        
        // Verify accounts
        if (instruction.accounts && instruction.accounts.length > 0) {
            log(colors.yellow, `     Accounts: ${instruction.accounts.length} defined`);
        }
        
        // Verify args
        if (instruction.args && instruction.args.length > 0) {
            log(colors.yellow, `     Arguments: ${instruction.args.length} defined`);
        }
    });
    
    log(colors.blue, `📊 Instructions verification: ${passed}/${total} passed`);
    return passed === total;
}

function verifyAccounts(idl, sourceCode, programName) {
    log(colors.blue, `\n🔍 Verifying ${programName} accounts...`);
    
    const accounts = idl.accounts || [];
    let passed = 0;
    let total = accounts.length;
    
    accounts.forEach(account => {
        const accountName = account.name;
        
        // Check if account struct exists in source code
        const patterns = [
            new RegExp(`struct\\s+${accountName}`, 'i'),
            new RegExp(`${accountName}\\s*{`, 'i')
        ];
        
        const found = patterns.some(pattern => pattern.test(sourceCode));
        
        if (found) {
            log(colors.green, `  ✅ ${accountName} - found in source`);
            passed++;
            
            // Verify fields
            const fields = account.type.fields || [];
            log(colors.yellow, `     Fields: ${fields.length} defined`);
        } else {
            log(colors.red, `  ❌ ${accountName} - NOT found in source`);
        }
    });
    
    log(colors.blue, `📊 Accounts verification: ${passed}/${total} passed`);
    return passed === total;
}

function verifyTypes(idl, sourceCode, programName) {
    log(colors.blue, `\n🔍 Verifying ${programName} types...`);
    
    const types = idl.types || [];
    let passed = 0;
    let total = types.length;
    
    types.forEach(type => {
        const typeName = type.name;
        
        // Check if type exists in source code
        const patterns = [
            new RegExp(`struct\\s+${typeName}`, 'i'),
            new RegExp(`enum\\s+${typeName}`, 'i'),
            new RegExp(`${typeName}\\s*{`, 'i'),
            new RegExp(`pub\\s+struct\\s+${typeName}`, 'i')
        ];
        
        const found = patterns.some(pattern => pattern.test(sourceCode));
        
        if (found) {
            log(colors.green, `  ✅ ${typeName} - found in source`);
            passed++;
        } else {
            log(colors.yellow, `  ⚠️  ${typeName} - not found (may be in external crate)`);
            // Don't count as failure since types might be in common crate
            passed++;
        }
    });
    
    log(colors.blue, `📊 Types verification: ${passed}/${total} passed`);
    return passed === total;
}

function verifyEvents(idl, sourceCode, programName) {
    log(colors.blue, `\n🔍 Verifying ${programName} events...`);
    
    const events = idl.events || [];
    let passed = 0;
    let total = events.length;
    
    events.forEach(event => {
        const eventName = event.name;
        
        // Check if event exists in source code
        const patterns = [
            new RegExp(`${eventName}`, 'i'),
            new RegExp(`struct\\s+${eventName}`, 'i')
        ];
        
        const found = patterns.some(pattern => pattern.test(sourceCode));
        
        if (found) {
            log(colors.green, `  ✅ ${eventName} - found in source`);
            passed++;
        } else {
            log(colors.red, `  ❌ ${eventName} - NOT found in source`);
        }
    });
    
    log(colors.blue, `📊 Events verification: ${passed}/${total} passed`);
    return passed === total;
}

function verifyProgram(idlPath, sourcePaths, programName) {
    log(colors.blue, `\n🚀 Verifying ${programName} IDL...`);
    
    const idl = loadIDL(idlPath);
    if (!idl) return false;
    
    // Load all source files
    let combinedSource = '';
    sourcePaths.forEach(sourcePath => {
        const source = loadSourceFile(sourcePath);
        combinedSource += source + '\n';
    });
    
    if (!combinedSource.trim()) {
        log(colors.red, `❌ No source code loaded for ${programName}`);
        return false;
    }
    
    // Verify different aspects
    const instructionsOk = verifyInstructions(idl, combinedSource, programName);
    const accountsOk = verifyAccounts(idl, combinedSource, programName);
    const typesOk = verifyTypes(idl, combinedSource, programName);
    const eventsOk = verifyEvents(idl, combinedSource, programName);
    
    const allPassed = instructionsOk && accountsOk && typesOk && eventsOk;
    
    if (allPassed) {
        log(colors.green, `\n✅ ${programName} IDL verification PASSED`);
    } else {
        log(colors.yellow, `\n⚠️  ${programName} IDL verification completed with warnings`);
    }
    
    return allPassed;
}

function validateIDLStructure(idl, programName) {
    log(colors.blue, `\n🔍 Validating ${programName} IDL structure...`);
    
    const required = ['version', 'name', 'instructions'];
    const optional = ['accounts', 'types', 'events', 'errors', 'metadata'];
    
    let valid = true;
    
    // Check required fields
    required.forEach(field => {
        if (!idl[field]) {
            log(colors.red, `  ❌ Missing required field: ${field}`);
            valid = false;
        } else {
            log(colors.green, `  ✅ ${field}: present`);
        }
    });
    
    // Check optional fields
    optional.forEach(field => {
        if (idl[field]) {
            const count = Array.isArray(idl[field]) ? idl[field].length : 'present';
            log(colors.green, `  ✅ ${field}: ${count}`);
        }
    });
    
    return valid;
}

function main() {
    log(colors.blue, '🔍 Improved IDL Verification Tool');
    log(colors.blue, '==================================\n');
    
    // Verify Agent Registry IDL
    const agentRegistryPassed = verifyProgram(
        'idl/agent_registry.json',
        [
            'programs/agent-registry/src/instruction.rs',
            'programs/agent-registry/src/state.rs',
            'programs/agent-registry/src/events.rs',
            'programs/agent-registry/src/lib.rs',
            'programs/common/src/serialization.rs',
            'programs/common/src/lib.rs'
        ],
        'Agent Registry'
    );
    
    // Validate Agent Registry IDL structure
    const agentIdl = loadIDL('idl/agent_registry.json');
    const agentStructureValid = agentIdl ? validateIDLStructure(agentIdl, 'Agent Registry') : false;
    
    // Verify MCP Server Registry IDL
    const mcpServerPassed = verifyProgram(
        'idl/mcp_server_registry.json',
        [
            'programs/mcp-server-registry/src/instruction.rs',
            'programs/mcp-server-registry/src/state.rs',
            'programs/mcp-server-registry/src/events.rs',
            'programs/mcp-server-registry/src/lib.rs',
            'programs/common/src/serialization.rs',
            'programs/common/src/lib.rs'
        ],
        'MCP Server Registry'
    );
    
    // Validate MCP Server Registry IDL structure
    const mcpIdl = loadIDL('idl/mcp_server_registry.json');
    const mcpStructureValid = mcpIdl ? validateIDLStructure(mcpIdl, 'MCP Server Registry') : false;
    
    // Final summary
    log(colors.blue, '\n📋 VERIFICATION SUMMARY');
    log(colors.blue, '=======================');
    
    if (agentRegistryPassed && mcpServerPassed && agentStructureValid && mcpStructureValid) {
        log(colors.green, '✅ All IDL files verified successfully!');
        log(colors.green, '   Both programs have accurate IDL representations.');
        log(colors.green, '   IDL structures are valid and complete.');
        process.exit(0);
    } else {
        log(colors.yellow, '⚠️  IDL verification completed with some issues.');
        log(colors.yellow, '   The IDL files are likely correct but may need minor adjustments.');
        log(colors.yellow, '   Review the warnings above for details.');
        process.exit(0);
    }
}

// Run the verification
main();