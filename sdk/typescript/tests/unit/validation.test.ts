import { describe, test, expect } from '@jest/globals';
import { PublicKey } from '@solana/web3.js';
import { Validator } from '../../src/utils/validation.js';
import { ValidationError } from '../../src/errors.js';
import { 
  AgentRegistrationData, 
  AgentUpdateData,
  McpServerRegistrationData,
  McpServerUpdateData,
  CONSTANTS 
} from '../../src/types.js';

describe('Validator', () => {
  describe('validateStringLength', () => {
    test('should pass for valid length', () => {
      expect(() => {
        Validator.validateStringLength('test', 10, 'testField');
      }).not.toThrow();
    });

    test('should throw for exceeded length', () => {
      expect(() => {
        Validator.validateStringLength('toolongstring', 5, 'testField');
      }).toThrow(ValidationError);
    });
  });

  describe('validateRequiredString', () => {
    test('should pass for valid string', () => {
      expect(() => {
        Validator.validateRequiredString('valid', 'testField', 10);
      }).not.toThrow();
    });

    test('should throw for undefined', () => {
      expect(() => {
        Validator.validateRequiredString(undefined, 'testField');
      }).toThrow(ValidationError);
    });

    test('should throw for empty string', () => {
      expect(() => {
        Validator.validateRequiredString('', 'testField');
      }).toThrow(ValidationError);
    });

    test('should throw for whitespace only', () => {
      expect(() => {
        Validator.validateRequiredString('   ', 'testField');
      }).toThrow(ValidationError);
    });
  });

  describe('validateUrl', () => {
    test('should pass for valid HTTP URL', () => {
      expect(() => {
        Validator.validateUrl('http://example.com', 'testUrl');
      }).not.toThrow();
    });

    test('should pass for valid HTTPS URL', () => {
      expect(() => {
        Validator.validateUrl('https://example.com', 'testUrl');
      }).not.toThrow();
    });

    test('should throw for invalid URL', () => {
      expect(() => {
        Validator.validateUrl('not-a-url', 'testUrl');
      }).toThrow(ValidationError);
    });

    test('should throw for disallowed protocol', () => {
      expect(() => {
        Validator.validateUrl('ftp://example.com', 'testUrl');
      }).toThrow(ValidationError);
    });

    test('should allow custom protocols', () => {
      expect(() => {
        Validator.validateUrl('ipfs://hash', 'testUrl', ['ipfs:']);
      }).not.toThrow();
    });
  });

  describe('validatePublicKey', () => {
    test('should pass for valid PublicKey object', () => {
      const key = new PublicKey('11111111111111111111111111111111');
      expect(() => {
        const result = Validator.validatePublicKey(key, 'testKey');
        expect(result).toBe(key);
      }).not.toThrow();
    });

    test('should pass for valid string and return PublicKey', () => {
      const keyString = '11111111111111111111111111111111';
      expect(() => {
        const result = Validator.validatePublicKey(keyString, 'testKey');
        expect(result).toBeInstanceOf(PublicKey);
      }).not.toThrow();
    });

    test('should throw for invalid string', () => {
      expect(() => {
        Validator.validatePublicKey('invalid-key', 'testKey');
      }).toThrow(ValidationError);
    });
  });

  describe('validateAgentId', () => {
    test('should pass for valid agent ID', () => {
      expect(() => {
        Validator.validateAgentId('valid-agent_123');
      }).not.toThrow();
    });

    test('should throw for empty ID', () => {
      expect(() => {
        Validator.validateAgentId('');
      }).toThrow(ValidationError);
    });

    test('should throw for too long ID', () => {
      const longId = 'a'.repeat(CONSTANTS.MAX_AGENT_ID_LEN + 1);
      expect(() => {
        Validator.validateAgentId(longId);
      }).toThrow(ValidationError);
    });

    test('should throw for invalid characters', () => {
      expect(() => {
        Validator.validateAgentId('invalid@agent');
      }).toThrow(ValidationError);
    });
  });

  describe('validateAgentRegistrationData', () => {
    const validData: AgentRegistrationData = {
      agentId: 'test-agent',
      name: 'Test Agent',
      description: 'A test agent',
      version: '1.0.0',
      providerName: 'Test Provider',
      providerUrl: 'https://example.com',
      serviceEndpoints: [
        {
          protocol: 'https',
          url: 'https://api.example.com',
        },
      ],
      supportedModes: ['text'],
      skills: [
        {
          id: 'skill1',
          name: 'Test Skill',
          tags: ['test'],
        },
      ],
      tags: ['test', 'agent'],
    };

    test('should pass for valid data', () => {
      expect(() => {
        Validator.validateAgentRegistrationData(validData);
      }).not.toThrow();
    });

    test('should throw for missing required field', () => {
      const invalidData = { ...validData };
      delete (invalidData as any).agentId;
      
      expect(() => {
        Validator.validateAgentRegistrationData(invalidData as AgentRegistrationData);
      }).toThrow(ValidationError);
    });

    test('should throw for too many service endpoints', () => {
      const invalidData = {
        ...validData,
        serviceEndpoints: new Array(CONSTANTS.MAX_SERVICE_ENDPOINTS + 1).fill({
          protocol: 'https',
          url: 'https://example.com',
        }),
      };
      
      expect(() => {
        Validator.validateAgentRegistrationData(invalidData);
      }).toThrow(ValidationError);
    });

    test('should throw for invalid URL in service endpoint', () => {
      const invalidData = {
        ...validData,
        serviceEndpoints: [
          {
            protocol: 'https',
            url: 'not-a-url',
          },
        ],
      };
      
      expect(() => {
        Validator.validateAgentRegistrationData(invalidData);
      }).toThrow(ValidationError);
    });

    test('should validate optional fields when provided', () => {
      const dataWithOptional = {
        ...validData,
        documentationUrl: 'https://docs.example.com',
        securityInfoUri: 'https://security.example.com',
      };
      
      expect(() => {
        Validator.validateAgentRegistrationData(dataWithOptional);
      }).not.toThrow();
    });

    test('should throw for invalid optional URL', () => {
      const invalidData = {
        ...validData,
        documentationUrl: 'not-a-url',
      };
      
      expect(() => {
        Validator.validateAgentRegistrationData(invalidData);
      }).toThrow(ValidationError);
    });
  });

  describe('validateMcpServerRegistrationData', () => {
    const validData: McpServerRegistrationData = {
      serverId: 'test-server',
      name: 'Test Server',
      version: '1.0.0',
      endpointUrl: 'https://mcp.example.com',
      capabilitiesSummary: 'Test capabilities',
      onchainToolDefinitions: [
        {
          name: 'test-tool',
          tags: ['test'],
        },
      ],
      onchainResourceDefinitions: [
        {
          uriPattern: '/test/*',
          tags: ['resource'],
        },
      ],
      onchainPromptDefinitions: [
        {
          name: 'test-prompt',
          tags: ['prompt'],
        },
      ],
      tags: ['test', 'server'],
    };

    test('should pass for valid data', () => {
      expect(() => {
        Validator.validateMcpServerRegistrationData(validData);
      }).not.toThrow();
    });

    test('should throw for missing required field', () => {
      const invalidData = { ...validData };
      delete (invalidData as any).serverId;
      
      expect(() => {
        Validator.validateMcpServerRegistrationData(invalidData as McpServerRegistrationData);
      }).toThrow(ValidationError);
    });

    test('should throw for too many tool definitions', () => {
      const invalidData = {
        ...validData,
        onchainToolDefinitions: new Array(CONSTANTS.MAX_ONCHAIN_TOOL_DEFINITIONS + 1).fill({
          name: 'tool',
          tags: ['test'],
        }),
      };
      
      expect(() => {
        Validator.validateMcpServerRegistrationData(invalidData);
      }).toThrow(ValidationError);
    });

    test('should throw for invalid endpoint URL', () => {
      const invalidData = {
        ...validData,
        endpointUrl: 'not-a-url',
      };
      
      expect(() => {
        Validator.validateMcpServerRegistrationData(invalidData);
      }).toThrow(ValidationError);
    });
  });

  describe('edge cases and boundary conditions', () => {
    test('should handle exactly max length strings', () => {
      const maxLengthString = 'a'.repeat(CONSTANTS.MAX_AGENT_NAME_LEN);
      expect(() => {
        Validator.validateStringLength(maxLengthString, CONSTANTS.MAX_AGENT_NAME_LEN, 'testField');
      }).not.toThrow();
    });

    test('should handle empty arrays', () => {
      expect(() => {
        Validator.validateArrayLength([], 5, 'testArray');
      }).not.toThrow();
    });

    test('should handle exactly max array length', () => {
      const maxArray = new Array(CONSTANTS.MAX_SKILLS).fill('item');
      expect(() => {
        Validator.validateArrayLength(maxArray, CONSTANTS.MAX_SKILLS, 'testArray');
      }).not.toThrow();
    });

    test('should handle special characters in URLs', () => {
      expect(() => {
        Validator.validateUrl('https://example.com/path?param=value&other=test', 'testUrl');
      }).not.toThrow();
    });

    test('should handle unicode characters in strings', () => {
      expect(() => {
        Validator.validateRequiredString('测试🚀', 'testField', 10);
      }).not.toThrow();
    });
  });

  describe('error message quality', () => {
    test('should provide specific field names in error messages', () => {
      try {
        Validator.validateRequiredString('', 'agentName');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('agentName');
      }
    });

    test('should provide array index in error messages', () => {
      const data: AgentRegistrationData = {
        agentId: 'test',
        name: 'Test',
        description: 'Test',
        version: '1.0.0',
        providerName: 'Test',
        providerUrl: 'https://example.com',
        serviceEndpoints: [
          {
            protocol: 'https',
            url: 'not-a-url', // Invalid URL
          },
        ],
        supportedModes: ['text'],
        skills: [],
        tags: [],
      };

      try {
        Validator.validateAgentRegistrationData(data);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('serviceEndpoints[0]');
      }
    });
  });
});