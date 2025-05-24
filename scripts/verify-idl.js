#!/usr/bin/env node

/**
 * IDL Verification Script
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
        log(colors.red, `❌ Failed to load source file: ${filePath}`);
        return null;
    }
}

function verifyInstructions(idl, sourceCode, programName) {
    log(colors.blue, `\n🔍 Verifying ${programName} instructions...`);
    
    const instructions = idl.instructions;
    let passed = 0;
    let total = instructions.length;
    
    instructions.forEach(instruction => {
        const instructionName = instruction.name;
        
        // Check if instruction exists in source code
        const camelCasePattern = new RegExp(`${instructionName}\\s*{`, 'i');
        const snakeCasePattern = new RegExp(`${instructionName.replace(/([A-Z])/g, '_$1').toLowerCase()}`, 'i');
        
        if (camelCasePattern.test(sourceCode) || snakeCasePattern.test(sourceCode)) {
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
        const structPattern = new RegExp(`struct\\s+${accountName}`, 'i');
        
        if (structPattern.test(sourceCode)) {
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
        const structPattern = new RegExp(`struct\\s+${typeName}`, 'i');
        const enumPattern = new RegExp(`enum\\s+${typeName}`, 'i');
        
        if (structPattern.test(sourceCode) || enumPattern.test(sourceCode)) {
            log(colors.green, `  ✅ ${typeName} - found in source`);
            passed++;
        } else {
            log(colors.red, `  ❌ ${typeName} - NOT found in source`);
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
        const eventPattern = new RegExp(`${eventName}`, 'i');
        
        if (eventPattern.test(sourceCode)) {
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
        if (source) {
            combinedSource += source + '\n';
        }
    });
    
    if (!combinedSource) {
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
        log(colors.red, `\n❌ ${programName} IDL verification FAILED`);
    }
    
    return allPassed;
}

function main() {
    log(colors.blue, '🔍 IDL Verification Tool');
    log(colors.blue, '========================\n');
    
    // Verify Agent Registry IDL
    const agentRegistryPassed = verifyProgram(
        'idl/agent_registry.json',
        [
            'programs/agent-registry/src/instruction.rs',
            'programs/agent-registry/src/state.rs',
            'programs/agent-registry/src/events.rs',
            'programs/agent-registry/src/lib.rs'
        ],
        'Agent Registry'
    );
    
    // Verify MCP Server Registry IDL
    const mcpServerPassed = verifyProgram(
        'idl/mcp_server_registry.json',
        [
            'programs/mcp-server-registry/src/instruction.rs',
            'programs/mcp-server-registry/src/state.rs',
            'programs/mcp-server-registry/src/events.rs',
            'programs/mcp-server-registry/src/lib.rs'
        ],
        'MCP Server Registry'
    );
    
    // Final summary
    log(colors.blue, '\n📋 VERIFICATION SUMMARY');
    log(colors.blue, '=======================');
    
    if (agentRegistryPassed && mcpServerPassed) {
        log(colors.green, '✅ All IDL files verified successfully!');
        log(colors.green, '   Both programs have accurate IDL representations.');
        process.exit(0);
    } else {
        log(colors.red, '❌ IDL verification failed!');
        log(colors.red, '   Please review the errors above and update the IDL files.');
        process.exit(1);
    }
}

// Run the verification
main();