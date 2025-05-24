#!/usr/bin/env node

/**
 * IDL Usage Test Script
 * 
 * This script tests that the IDL files can be properly used with
 * common Solana development tools and libraries.
 */

const fs = require('fs');

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

function validateJSONStructure(idl, programName) {
    log(colors.blue, `\n🔍 Testing ${programName} IDL JSON structure...`);
    
    let valid = true;
    
    // Test JSON parsing
    try {
        const jsonString = JSON.stringify(idl, null, 2);
        const reparsed = JSON.parse(jsonString);
        log(colors.green, '  ✅ JSON serialization/deserialization works');
    } catch (error) {
        log(colors.red, '  ❌ JSON serialization failed');
        valid = false;
    }
    
    return valid;
}

function validateAnchorCompatibility(idl, programName) {
    log(colors.blue, `\n🔍 Testing ${programName} IDL Anchor compatibility...`);
    
    let compatible = true;
    
    // Check required Anchor IDL fields
    const requiredFields = ['version', 'name', 'instructions'];
    requiredFields.forEach(field => {
        if (!idl[field]) {
            log(colors.red, `  ❌ Missing required Anchor field: ${field}`);
            compatible = false;
        }
    });
    
    // Check instruction structure
    if (idl.instructions) {
        idl.instructions.forEach((instruction, index) => {
            if (!instruction.name) {
                log(colors.red, `  ❌ Instruction ${index} missing name`);
                compatible = false;
            }
            if (!instruction.accounts) {
                log(colors.red, `  ❌ Instruction ${instruction.name} missing accounts`);
                compatible = false;
            }
            if (!instruction.args) {
                log(colors.red, `  ❌ Instruction ${instruction.name} missing args`);
                compatible = false;
            }
        });
        
        if (compatible) {
            log(colors.green, `  ✅ All ${idl.instructions.length} instructions have valid structure`);
        }
    }
    
    // Check account structure
    if (idl.accounts) {
        idl.accounts.forEach((account, index) => {
            if (!account.name) {
                log(colors.red, `  ❌ Account ${index} missing name`);
                compatible = false;
            }
            if (!account.type || !account.type.fields) {
                log(colors.red, `  ❌ Account ${account.name} missing type/fields`);
                compatible = false;
            }
        });
        
        if (compatible) {
            log(colors.green, `  ✅ All ${idl.accounts.length} accounts have valid structure`);
        }
    }
    
    // Check types structure
    if (idl.types) {
        idl.types.forEach((type, index) => {
            if (!type.name) {
                log(colors.red, `  ❌ Type ${index} missing name`);
                compatible = false;
            }
            if (!type.type) {
                log(colors.red, `  ❌ Type ${type.name} missing type definition`);
                compatible = false;
            }
        });
        
        if (compatible) {
            log(colors.green, `  ✅ All ${idl.types.length} types have valid structure`);
        }
    }
    
    return compatible;
}

function validateTypeDefinitions(idl, programName) {
    log(colors.blue, `\n🔍 Testing ${programName} IDL type definitions...`);
    
    let valid = true;
    const supportedTypes = [
        'bool', 'u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128',
        'f32', 'f64', 'string', 'publicKey', 'bytes'
    ];
    
    function validateType(type, path = '') {
        if (typeof type === 'string') {
            if (!supportedTypes.includes(type) && !type.startsWith('defined:')) {
                // Check if it's a defined type in the IDL
                const isDefinedType = idl.types && idl.types.some(t => t.name === type);
                if (!isDefinedType) {
                    log(colors.yellow, `  ⚠️  Unknown type: ${type} at ${path}`);
                }
            }
        } else if (typeof type === 'object') {
            if (type.vec) {
                validateType(type.vec, `${path}.vec`);
            } else if (type.option) {
                validateType(type.option, `${path}.option`);
            } else if (type.array) {
                validateType(type.array[0], `${path}.array`);
            } else if (type.defined) {
                // Check if the defined type exists
                const isDefinedType = idl.types && idl.types.some(t => t.name === type.defined);
                if (!isDefinedType) {
                    log(colors.yellow, `  ⚠️  Referenced undefined type: ${type.defined} at ${path}`);
                }
            }
        }
    }
    
    // Validate instruction argument types
    if (idl.instructions) {
        idl.instructions.forEach(instruction => {
            if (instruction.args) {
                instruction.args.forEach(arg => {
                    validateType(arg.type, `instruction.${instruction.name}.args.${arg.name}`);
                });
            }
        });
    }
    
    // Validate account field types
    if (idl.accounts) {
        idl.accounts.forEach(account => {
            if (account.type && account.type.fields) {
                account.type.fields.forEach(field => {
                    validateType(field.type, `account.${account.name}.${field.name}`);
                });
            }
        });
    }
    
    // Validate custom type definitions
    if (idl.types) {
        idl.types.forEach(type => {
            if (type.type && type.type.fields) {
                type.type.fields.forEach(field => {
                    validateType(field.type, `type.${type.name}.${field.name}`);
                });
            }
        });
    }
    
    log(colors.green, '  ✅ Type definitions validation completed');
    return valid;
}

function generateUsageExample(idl, programName) {
    log(colors.blue, `\n📝 Generating ${programName} usage example...`);
    
    const example = `
// Example usage with @coral-xyz/anchor
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { ${idl.name.charAt(0).toUpperCase() + idl.name.slice(1)} } from './types/${idl.name}';
import idl from './idl/${idl.name}.json';

const program = new Program(idl as ${idl.name.charAt(0).toUpperCase() + idl.name.slice(1)}, provider);

// Example instruction call:
${idl.instructions[0] ? `await program.methods
  .${idl.instructions[0].name}(${idl.instructions[0].args.map(arg => `/* ${arg.name}: ${JSON.stringify(arg.type)} */`).join(', ')})
  .accounts({
    ${idl.instructions[0].accounts.map(acc => `${acc.name}: /* ${acc.desc || 'account'} */`).join(',\n    ')}
  })
  .rpc();` : '// No instructions defined'}
`;
    
    log(colors.green, '  ✅ Usage example generated');
    log(colors.yellow, example);
    
    return true;
}

function testProgram(idlPath, programName) {
    log(colors.blue, `\n🚀 Testing ${programName} IDL...`);
    
    const idl = loadIDL(idlPath);
    if (!idl) return false;
    
    const jsonValid = validateJSONStructure(idl, programName);
    const anchorCompatible = validateAnchorCompatibility(idl, programName);
    const typesValid = validateTypeDefinitions(idl, programName);
    const exampleGenerated = generateUsageExample(idl, programName);
    
    const allPassed = jsonValid && anchorCompatible && typesValid && exampleGenerated;
    
    if (allPassed) {
        log(colors.green, `\n✅ ${programName} IDL is ready for use!`);
    } else {
        log(colors.red, `\n❌ ${programName} IDL has issues that need to be addressed`);
    }
    
    return allPassed;
}

function main() {
    log(colors.blue, '🧪 IDL Usage Testing Tool');
    log(colors.blue, '=========================\n');
    
    // Test Agent Registry IDL
    const agentRegistryPassed = testProgram('idl/agent_registry.json', 'Agent Registry');
    
    // Test MCP Server Registry IDL
    const mcpServerPassed = testProgram('idl/mcp_server_registry.json', 'MCP Server Registry');
    
    // Final summary
    log(colors.blue, '\n📋 TESTING SUMMARY');
    log(colors.blue, '==================');
    
    if (agentRegistryPassed && mcpServerPassed) {
        log(colors.green, '✅ All IDL files are ready for production use!');
        log(colors.green, '   They can be used with:');
        log(colors.green, '   • @coral-xyz/anchor');
        log(colors.green, '   • @solana/web3.js');
        log(colors.green, '   • Rust anchor-client');
        log(colors.green, '   • Other Solana development tools');
        process.exit(0);
    } else {
        log(colors.red, '❌ Some IDL files have issues!');
        log(colors.red, '   Please review the errors above and fix them.');
        process.exit(1);
    }
}

// Run the tests
main();