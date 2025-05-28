'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { registryService, AgentRegistrationData } from '@/lib/solana/registry';
import Link from 'next/link';

interface AgentFormData {
  agentId: string;
  name: string;
  description: string;
  version: string;
  providerName: string;
  providerUrl: string;
  documentationUrl: string;
  serviceEndpoints: Array<{
    protocol: string;
    url: string;
  }>;
  supportedModes: string[];
  skills: Array<{
    skillId: string;
    name: string;
    tags: string[];
  }>;
  securityInfoUri: string;
  aeaAddress: string;
  economicIntent: string;
  extendedMetadataUri: string;
  tags: string[];
}

const initialFormData: AgentFormData = {
  agentId: '',
  name: '',
  description: '',
  version: '1.0.0',
  providerName: '',
  providerUrl: '',
  documentationUrl: '',
  serviceEndpoints: [{ protocol: 'https', url: '' }],
  supportedModes: ['text'],
  skills: [{ skillId: '', name: '', tags: [] }],
  securityInfoUri: '',
  aeaAddress: '',
  economicIntent: '',
  extendedMetadataUri: '',
  tags: [],
};

export default function RegisterAgentPage() {
  const router = useRouter();
  const { publicKey, connected, signTransaction } = useWallet();
  const [formData, setFormData] = useState<AgentFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [newMode, setNewMode] = useState('');

  const handleInputChange = (field: keyof AgentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addServiceEndpoint = () => {
    if (formData.serviceEndpoints.length < 3) {
      setFormData(prev => ({
        ...prev,
        serviceEndpoints: [...prev.serviceEndpoints, { protocol: 'https', url: '' }]
      }));
    }
  };

  const removeServiceEndpoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceEndpoints: prev.serviceEndpoints.filter((_, i) => i !== index)
    }));
  };

  const updateServiceEndpoint = (index: number, field: 'protocol' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceEndpoints: prev.serviceEndpoints.map((endpoint, i) => 
        i === index ? { ...endpoint, [field]: value } : endpoint
      )
    }));
  };

  const addSkill = () => {
    if (formData.skills.length < 10) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { skillId: '', name: '', tags: [] }]
      }));
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, field: keyof typeof formData.skills[0], value: any) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
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

  const addMode = () => {
    if (newMode.trim() && formData.supportedModes.length < 5 && !formData.supportedModes.includes(newMode.trim())) {
      setFormData(prev => ({
        ...prev,
        supportedModes: [...prev.supportedModes, newMode.trim()]
      }));
      setNewMode('');
    }
  };

  const removeMode = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      supportedModes: prev.supportedModes.filter(m => m !== mode)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.agentId && formData.name && formData.description && formData.version);
      case 2:
        return !!(formData.providerName && formData.serviceEndpoints[0]?.url);
      case 3:
        return formData.skills.every(skill => skill.skillId && skill.name);
      case 4:
        return true; // Optional fields
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

      // Prepare agent registration data
      const agentRegistrationData: AgentRegistrationData = {
        agentId: formData.agentId,
        name: formData.name,
        description: formData.description,
        version: formData.version,
        providerName: formData.providerName,
        providerUrl: formData.providerUrl,
        documentationUrl: formData.documentationUrl,
        serviceEndpoints: formData.serviceEndpoints,
        supportedModes: formData.supportedModes,
        skills: formData.skills,
        securityInfoUri: formData.securityInfoUri,
        aeaAddress: formData.aeaAddress,
        economicIntent: formData.economicIntent,
        extendedMetadataUri: formData.extendedMetadataUri,
        tags: formData.tags,
      };

      // Create the transaction
      const transaction = await registryService.registerAgent(agentRegistrationData, publicKey);

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const signature = await registryService.connection.sendRawTransaction(signedTransaction.serialize());

      // Confirm the transaction
      await registryService.connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Agent registered successfully!');
      router.push('/agents');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('User rejected the request')) {
        toast.error('Transaction rejected by user.');
      } else {
        toast.error(`Failed to register agent: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="ascii-subsection-title">BASIC INFORMATION</h3>
      
      <div>
        <label className="ascii-label">AGENT ID *</label>
        <input
          type="text"
          value={formData.agentId}
          onChange={(e) => handleInputChange('agentId', e.target.value)}
          placeholder="unique-agent-identifier"
          className="ascii-input w-full"
          maxLength={64}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          Unique identifier for your agent (3-64 characters)
        </p>
      </div>

      <div>
        <label className="ascii-label">AGENT NAME *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="My Awesome AI Agent"
          className="ascii-input w-full"
          maxLength={128}
        />
      </div>

      <div>
        <label className="ascii-label">DESCRIPTION *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe what your agent does and its capabilities..."
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
      <h3 className="ascii-subsection-title">PROVIDER & ENDPOINTS</h3>
      
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
          placeholder="https://docs.yourcompany.com/agent"
          className="ascii-input w-full"
          maxLength={256}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">SERVICE ENDPOINTS *</label>
          <button
            type="button"
            onClick={addServiceEndpoint}
            disabled={formData.serviceEndpoints.length >= 3}
            className="ascii-button-secondary text-xs"
          >
            [+ ADD ENDPOINT]
          </button>
        </div>
        {formData.serviceEndpoints.map((endpoint, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={endpoint.protocol}
              onChange={(e) => updateServiceEndpoint(index, 'protocol', e.target.value)}
              className="ascii-select w-24"
            >
              <option value="https">HTTPS</option>
              <option value="http">HTTP</option>
              <option value="ws">WS</option>
              <option value="wss">WSS</option>
            </select>
            <input
              type="url"
              value={endpoint.url}
              onChange={(e) => updateServiceEndpoint(index, 'url', e.target.value)}
              placeholder="https://api.yourservice.com/agent"
              className="ascii-input flex-1"
              maxLength={256}
            />
            {formData.serviceEndpoints.length > 1 && (
              <button
                type="button"
                onClick={() => removeServiceEndpoint(index)}
                className="ascii-button-secondary text-xs"
              >
                [X]
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">SUPPORTED MODES</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMode}
              onChange={(e) => setNewMode(e.target.value)}
              placeholder="mode name"
              className="ascii-input text-xs w-24"
              maxLength={64}
            />
            <button
              type="button"
              onClick={addMode}
              disabled={formData.supportedModes.length >= 5}
              className="ascii-button-secondary text-xs"
            >
              [+ ADD]
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.supportedModes.map((mode) => (
            <span
              key={mode}
              className="ascii-status text-xs px-2 py-1 flex items-center gap-1"
              style={{ backgroundColor: '#E5E5E5', color: '#171717' }}
            >
              {mode.toUpperCase()}
              <button
                type="button"
                onClick={() => removeMode(mode)}
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

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="ascii-subsection-title">SKILLS & CAPABILITIES</h3>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">AGENT SKILLS</label>
          <button
            type="button"
            onClick={addSkill}
            disabled={formData.skills.length >= 10}
            className="ascii-button-secondary text-xs"
          >
            [+ ADD SKILL]
          </button>
        </div>
        {formData.skills.map((skill, index) => (
          <div key={index} className="ascii-card mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="ascii-body-text text-sm font-bold">SKILL #{index + 1}</span>
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ascii-button-secondary text-xs"
                >
                  [REMOVE]
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ascii-label text-xs">SKILL ID *</label>
                <input
                  type="text"
                  value={skill.skillId}
                  onChange={(e) => updateSkill(index, 'skillId', e.target.value)}
                  placeholder="skill-identifier"
                  className="ascii-input w-full text-sm"
                  maxLength={64}
                />
              </div>
              <div>
                <label className="ascii-label text-xs">SKILL NAME *</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  placeholder="Skill Display Name"
                  className="ascii-input w-full text-sm"
                  maxLength={128}
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="ascii-label text-xs">SKILL TAGS (max 5)</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {skill.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="ascii-status text-xs px-1 py-0 flex items-center gap-1"
                    style={{ backgroundColor: '#D4D4D4', color: '#171717' }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = skill.tags.filter((_, i) => i !== tagIndex);
                        updateSkill(index, 'tags', newTags);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {skill.tags.length < 5 && (
                  <input
                    type="text"
                    placeholder="add tag"
                    className="ascii-input text-xs w-20"
                    maxLength={32}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !skill.tags.includes(value)) {
                          updateSkill(index, 'tags', [...skill.tags, value]);
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

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="ascii-label">AGENT TAGS</label>
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

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="ascii-subsection-title">ADDITIONAL INFORMATION</h3>
      
      <div>
        <label className="ascii-label">SECURITY INFO URI</label>
        <input
          type="url"
          value={formData.securityInfoUri}
          onChange={(e) => handleInputChange('securityInfoUri', e.target.value)}
          placeholder="https://yourcompany.com/security"
          className="ascii-input w-full"
          maxLength={256}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          Link to security audit or security information
        </p>
      </div>

      <div>
        <label className="ascii-label">AEA ADDRESS</label>
        <input
          type="text"
          value={formData.aeaAddress}
          onChange={(e) => handleInputChange('aeaAddress', e.target.value)}
          placeholder="Autonomous Economic Agent address"
          className="ascii-input w-full"
          maxLength={128}
        />
      </div>

      <div>
        <label className="ascii-label">ECONOMIC INTENT</label>
        <textarea
          value={formData.economicIntent}
          onChange={(e) => handleInputChange('economicIntent', e.target.value)}
          placeholder="Describe the economic model and intent of your agent..."
          className="ascii-input w-full h-20 resize-none"
          maxLength={256}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          {formData.economicIntent.length}/256 characters
        </p>
      </div>

      <div>
        <label className="ascii-label">EXTENDED METADATA URI</label>
        <input
          type="url"
          value={formData.extendedMetadataUri}
          onChange={(e) => handleInputChange('extendedMetadataUri', e.target.value)}
          placeholder="https://yourcompany.com/agent/metadata.json"
          className="ascii-input w-full"
          maxLength={256}
        />
        <p className="ascii-body-text text-xs mt-1" style={{ color: '#525252' }}>
          Link to additional metadata in JSON format
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/agents" className="ascii-link">
            ← BACK TO AGENTS
          </Link>
        </div>
        <h1 className="ascii-section-title text-3xl mb-2">
          REGISTER AI AGENT
        </h1>
        <p className="ascii-body-text">
          Register your AI agent on the Solana blockchain
        </p>
      </div>

      {/* Progress Steps */}
      <div className="ascii-card mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
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
              {step < 4 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-black' : 'bg-gray-400'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className={currentStep === 1 ? 'font-bold' : ''}>BASIC INFO</span>
          <span className={currentStep === 2 ? 'font-bold' : ''}>PROVIDER</span>
          <span className={currentStep === 3 ? 'font-bold' : ''}>SKILLS</span>
          <span className={currentStep === 4 ? 'font-bold' : ''}>ADDITIONAL</span>
        </div>
      </div>

      {/* Form */}
      <div className="ascii-card mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
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
        
        {currentStep < 4 ? (
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
            {loading ? '[REGISTERING...]' : '[REGISTER AGENT]'}
          </button>
        )}
      </div>

      {/* Wallet Connection Notice */}
      {!connected && (
        <div className="ascii-card mt-4" style={{ backgroundColor: '#FFF3CD', borderColor: '#FFEAA7' }}>
          <p className="ascii-body-text text-sm">
            <strong>Notice:</strong> You need to connect your wallet to register an agent.
          </p>
        </div>
      )}
    </div>
  );
}
