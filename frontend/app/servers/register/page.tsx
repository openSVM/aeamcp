'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { registryService, McpServerRegistrationData } from '@/lib/solana/registry';
import Link from 'next/link';

interface ToolDefinition {
  name: string;
  tags: string[];
}

interface ResourceDefinition {
  uriPattern: string;
  tags: string[];
}

interface PromptDefinition {
  name: string;
  tags: string[];
}

interface ServerFormData {
  serverId: string;
  name: string;
  description: string;
  version: string;
  providerName: string;
  providerUrl: string;
  documentationUrl: string;
  endpointUrl: string;
  capabilitiesSummary: string;
  toolDefinitions: ToolDefinition[];
  resourceDefinitions: ResourceDefinition[];
  promptDefinitions: PromptDefinition[];
  fullCapabilitiesUri: string;
  tags: string[];
}

const initialFormData: ServerFormData = {
  serverId: '',
  name: '',
  description: '',
  version: '1.0.0',
  providerName: '',
  providerUrl: '',
  documentationUrl: '',
  endpointUrl: '',
  capabilitiesSummary: '',
  toolDefinitions: [{ name: '', tags: [] }],
  resourceDefinitions: [{ uriPattern: '', tags: [] }],
  promptDefinitions: [{ name: '', tags: [] }],
  fullCapabilitiesUri: '',
  tags: [],
};

export default function RegisterServerPage() {
  const router = useRouter();
  const { publicKey, connected, signTransaction } = useWallet();
  const [formData, setFormData] = useState<ServerFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof ServerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToolDefinition = () => {
    if (formData.toolDefinitions.length < 5) {
      setFormData(prev => ({
        ...prev,
        toolDefinitions: [...prev.toolDefinitions, { name: '', tags: [] }]
      }));
    }
  };

  const removeToolDefinition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      toolDefinitions: prev.toolDefinitions.filter((_, i) => i !== index)
    }));
  };

  const updateToolDefinition = (index: number, field: keyof ToolDefinition, value: any) => {
    setFormData(prev => ({
      ...prev,
      toolDefinitions: prev.toolDefinitions.map((tool, i) => 
        i === index ? { ...tool, [field]: value } : tool
      )
    }));
  };

  const addResourceDefinition = () => {
    if (formData.resourceDefinitions.length < 5) {
      setFormData(prev => ({
        ...prev,
        resourceDefinitions: [...prev.resourceDefinitions, { uriPattern: '', tags: [] }]
      }));
    }
  };

  const removeResourceDefinition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resourceDefinitions: prev.resourceDefinitions.filter((_, i) => i !== index)
    }));
  };

  const updateResourceDefinition = (index: number, field: keyof ResourceDefinition, value: any) => {
    setFormData(prev => ({
      ...prev,
      resourceDefinitions: prev.resourceDefinitions.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const addPromptDefinition = () => {
    if (formData.promptDefinitions.length < 5) {
      setFormData(prev => ({
        ...prev,
        promptDefinitions: [...prev.promptDefinitions, { name: '', tags: [] }]
      }));
    }
  };

  const removePromptDefinition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      promptDefinitions: prev.promptDefinitions.filter((_, i) => i !== index)
    }));
  };

  const updatePromptDefinition = (index: number, field: keyof PromptDefinition, value: any) => {
    setFormData(prev => ({
      ...prev,
      promptDefinitions: prev.promptDefinitions.map((prompt, i) => 
        i === index ? { ...prompt, [field]: value } : prompt
      )
    }));
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags.length < 10 && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.serverId && formData.name && formData.description && formData.version);
      case 2:
        return !!(formData.providerName && formData.endpointUrl && formData.capabilitiesSummary);
      case 3:
        return formData.toolDefinitions.every(tool => tool.name) &&
               formData.resourceDefinitions.every(resource => resource.uriPattern) &&
               formData.promptDefinitions.every(prompt => prompt.name);
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // Validate all required fields
      if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Prepare MCP server registration data
      const mcpServerRegistrationData: McpServerRegistrationData = {
        serverId: formData.serverId,
        name: formData.name,
        description: formData.description,
        version: formData.version,
        providerName: formData.providerName,
        providerUrl: formData.providerUrl,
        documentationUrl: formData.documentationUrl,
        endpointUrl: formData.endpointUrl,
        capabilitiesSummary: formData.capabilitiesSummary,
        toolDefinitions: formData.toolDefinitions,
        resourceDefinitions: formData.resourceDefinitions,
        promptDefinitions: formData.promptDefinitions,
        fullCapabilitiesUri: formData.fullCapabilitiesUri,
        tags: formData.tags,
      };

      // Create the transaction
      const transaction = await registryService.registerMcpServer(mcpServerRegistrationData, publicKey);

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const signature = await registryService.connection.sendRawTransaction(signedTransaction.serialize());

      // Confirm the transaction
      await registryService.connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('MCP Server registered successfully!');
      router.push('/servers');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('User rejected the request')) {
        toast.error('Transaction rejected by user.');
      } else {
        toast.error(`Failed to register MCP server: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="ascii-subsection-title">BASIC INFORMATION</h3>
      
      <div>
        <label className="ascii-label">SERVER ID *</label>
        <input
          type="text"
          value={formData.serverId}
          onChange={(e) => handleInputChange('serverId', e.target.value)}
          placeholder="unique-server-identifier"
          className="ascii-input w-full"
          maxLength={64}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          Unique identifier for your MCP server (3-64 characters)
        </p>
      </div>

      <div>
        <label className="ascii-label">SERVER NAME *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="My Awesome MCP Server"
          className="ascii-input w-full"
          maxLength={128}
        />
      </div>

      <div>
        <label className="ascii-label">DESCRIPTION *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe what your MCP server provides and its capabilities..."
          className="ascii-input w-full h-24 resize-none"
          maxLength={512}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          {formData.description.length}/512 characters
        </p>
      </div>

      <div>
        <label className="ascii-label">VERSION *</label>
        <input
          type="text"
          value={formData.version}
          onChange={(e) => handleInputChange('version', e.target.value)}
          placeholder="1.0.0"
          className="ascii-input w-full"
          maxLength={32}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="ascii-subsection-title">PROVIDER & ENDPOINT</h3>
      
      <div>
        <label className="ascii-label">PROVIDER NAME *</label>
        <input
          type="text"
          value={formData.providerName}
          onChange={(e) => handleInputChange('providerName', e.target.value)}
          placeholder="Your Company Name"
          className="ascii-input w-full"
          maxLength={128}
        />
      </div>

      <div>
        <label className="ascii-label">PROVIDER URL</label>
        <input
          type="url"
          value={formData.providerUrl}
          onChange={(e) => handleInputChange('providerUrl', e.target.value)}
          placeholder="https://yourcompany.com"
          className="ascii-input w-full"
          maxLength={256}
        />
      </div>

      <div>
        <label className="ascii-label">DOCUMENTATION URL</label>
        <input
          type="url"
          value={formData.documentationUrl}
          onChange={(e) => handleInputChange('documentationUrl', e.target.value)}
          placeholder="https://docs.yourcompany.com/mcp-server"
          className="ascii-input w-full"
          maxLength={256}
        />
      </div>

      <div>
        <label className="ascii-label">ENDPOINT URL *</label>
        <input
          type="url"
          value={formData.endpointUrl}
          onChange={(e) => handleInputChange('endpointUrl', e.target.value)}
          placeholder="https://api.yourcompany.com/mcp"
          className="ascii-input w-full"
          maxLength={256}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          The main endpoint URL for your MCP server
        </p>
      </div>

      <div>
        <label className="ascii-label">CAPABILITIES SUMMARY *</label>
        <textarea
          value={formData.capabilitiesSummary}
          onChange={(e) => handleInputChange('capabilitiesSummary', e.target.value)}
          placeholder="Brief summary of what tools, resources, and prompts your server provides..."
          className="ascii-input w-full h-20 resize-none"
          maxLength={256}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          {formData.capabilitiesSummary.length}/256 characters
        </p>
      </div>

      <div>
        <label className="ascii-label">FULL CAPABILITIES URI</label>
        <input
          type="url"
          value={formData.fullCapabilitiesUri}
          onChange={(e) => handleInputChange('fullCapabilitiesUri', e.target.value)}
          placeholder="https://api.yourcompany.com/mcp/capabilities.json"
          className="ascii-input w-full"
          maxLength={256}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          Link to detailed capabilities specification (JSON format)
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="ascii-subsection-title">TOOLS, RESOURCES & PROMPTS</h3>
      
      {/* Tool Definitions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">TOOL DEFINITIONS</label>
          <button
            type="button"
            onClick={addToolDefinition}
            disabled={formData.toolDefinitions.length >= 5}
            className="ascii-button-secondary text-xs"
          >
            [+ ADD TOOL]
          </button>
        </div>
        {formData.toolDefinitions.map((tool, index) => (
          <div key={index} className="ascii-card mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="ascii-body-text text-sm font-bold">TOOL #{index + 1}</span>
              {formData.toolDefinitions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeToolDefinition(index)}
                  className="ascii-button-secondary text-xs"
                >
                  [REMOVE]
                </button>
              )}
            </div>
            <div className="mb-2">
              <label className="ascii-label text-xs">TOOL NAME *</label>
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateToolDefinition(index, 'name', e.target.value)}
                placeholder="tool_name"
                className="ascii-input w-full text-sm"
                maxLength={64}
              />
            </div>
            <div>
              <label className="ascii-label text-xs">TOOL TAGS (max 3)</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {tool.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="ascii-status text-xs px-1 py-0 flex items-center gap-1"
                    style={{ backgroundColor: '#D4D4D4', color: '#171717' }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = tool.tags.filter((_, i) => i !== tagIndex);
                        updateToolDefinition(index, 'tags', newTags);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {tool.tags.length < 3 && (
                  <input
                    type="text"
                    placeholder="add tag"
                    className="ascii-input text-xs w-20"
                    maxLength={32}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !tool.tags.includes(value)) {
                          updateToolDefinition(index, 'tags', [...tool.tags, value]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Definitions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">RESOURCE DEFINITIONS</label>
          <button
            type="button"
            onClick={addResourceDefinition}
            disabled={formData.resourceDefinitions.length >= 5}
            className="ascii-button-secondary text-xs"
          >
            [+ ADD RESOURCE]
          </button>
        </div>
        {formData.resourceDefinitions.map((resource, index) => (
          <div key={index} className="ascii-card mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="ascii-body-text text-sm font-bold">RESOURCE #{index + 1}</span>
              {formData.resourceDefinitions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResourceDefinition(index)}
                  className="ascii-button-secondary text-xs"
                >
                  [REMOVE]
                </button>
              )}
            </div>
            <div className="mb-2">
              <label className="ascii-label text-xs">URI PATTERN *</label>
              <input
                type="text"
                value={resource.uriPattern}
                onChange={(e) => updateResourceDefinition(index, 'uriPattern', e.target.value)}
                placeholder="file://**/*.txt"
                className="ascii-input w-full text-sm"
                maxLength={128}
              />
            </div>
            <div>
              <label className="ascii-label text-xs">RESOURCE TAGS (max 3)</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {resource.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="ascii-status text-xs px-1 py-0 flex items-center gap-1"
                    style={{ backgroundColor: '#E5E5E5', color: '#525252' }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = resource.tags.filter((_, i) => i !== tagIndex);
                        updateResourceDefinition(index, 'tags', newTags);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {resource.tags.length < 3 && (
                  <input
                    type="text"
                    placeholder="add tag"
                    className="ascii-input text-xs w-20"
                    maxLength={32}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !resource.tags.includes(value)) {
                          updateResourceDefinition(index, 'tags', [...resource.tags, value]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Definitions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">PROMPT DEFINITIONS</label>
          <button
            type="button"
            onClick={addPromptDefinition}
            disabled={formData.promptDefinitions.length >= 5}
            className="ascii-button-secondary text-xs"
          >
            [+ ADD PROMPT]
          </button>
        </div>
        {formData.promptDefinitions.map((prompt, index) => (
          <div key={index} className="ascii-card mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="ascii-body-text text-sm font-bold">PROMPT #{index + 1}</span>
              {formData.promptDefinitions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePromptDefinition(index)}
                  className="ascii-button-secondary text-xs"
                >
                  [REMOVE]
                </button>
              )}
            </div>
            <div className="mb-2">
              <label className="ascii-label text-xs">PROMPT NAME *</label>
              <input
                type="text"
                value={prompt.name}
                onChange={(e) => updatePromptDefinition(index, 'name', e.target.value)}
                placeholder="prompt_name"
                className="ascii-input w-full text-sm"
                maxLength={64}
              />
            </div>
            <div>
              <label className="ascii-label text-xs">PROMPT TAGS (max 3)</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {prompt.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="ascii-status text-xs px-1 py-0 flex items-center gap-1"
                    style={{ backgroundColor: '#F5F5F5', color: '#404040' }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = prompt.tags.filter((_, i) => i !== tagIndex);
                        updatePromptDefinition(index, 'tags', newTags);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {prompt.tags.length < 3 && (
                  <input
                    type="text"
                    placeholder="add tag"
                    className="ascii-input text-xs w-20"
                    maxLength={32}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !prompt.tags.includes(value)) {
                          updatePromptDefinition(index, 'tags', [...prompt.tags, value]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Server Tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">SERVER TAGS</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="tag name"
              className="ascii-input text-xs w-24"
              maxLength={32}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={formData.tags.length >= 10}
              className="ascii-button-secondary text-xs"
            >
              [+ ADD]
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="ascii-status text-xs px-2 py-1 flex items-center gap-1"
              style={{ backgroundColor: '#E5E5E5', color: '#171717' }}
            >
              {tag.toUpperCase()}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/servers" className="ascii-link">
            ← BACK TO SERVERS
          </Link>
        </div>
        <h1 className="ascii-section-title text-3xl mb-2">
          REGISTER MCP SERVER
        </h1>
        <p className="ascii-body-text">
          Register your Model Context Protocol server on the Solana blockchain
        </p>
      </div>

      {/* Progress Steps */}
      <div className="ascii-card mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  step === currentStep
                    ? 'border-black bg-black text-white'
                    : step < currentStep
                    ? 'border-black bg-white text-black'
                    : 'border-gray-400 bg-white text-gray-400'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-24 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-black' : 'bg-gray-400'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className={currentStep === 1 ? 'font-bold' : ''}>BASIC INFO</span>
          <span className={currentStep === 2 ? 'font-bold' : ''}>PROVIDER & ENDPOINT</span>
          <span className={currentStep === 3 ? 'font-bold' : ''}>CAPABILITIES</span>
        </div>
      </div>

      {/* Form */}
      <div className="ascii-card mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="ascii-button-secondary"
        >
          [← PREVIOUS]
        </button>
        
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={() => {
              if (validateStep(currentStep)) {
                setCurrentStep(currentStep + 1);
              } else {
                toast.error('Please fill in all required fields');
              }
            }}
            className="ascii-button-primary"
          >
            [NEXT →]
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !connected}
            className="ascii-button-primary"
          >
            {loading ? '[REGISTERING...]' : '[REGISTER SERVER]'}
          </button>
        )}
      </div>

      {/* Wallet Connection Notice */}
      {!connected && (
        <div className="ascii-card mt-4" style={{ backgroundColor: '#FFF3CD', borderColor: '#FFEAA7' }}>
          <p className="ascii-body-text text-sm">
            <strong>Notice:</strong> You need to connect your wallet to register an MCP server.
          </p>
        </div>
      )}
    </div>
  );
}
