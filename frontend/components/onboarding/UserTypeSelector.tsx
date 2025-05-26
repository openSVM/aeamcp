'use client';

import React from 'react';
import { UserType } from './types';

interface UserTypeSelectorProps {
  onSelectUserType: (userType: UserType) => void;
  onClose: () => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  onSelectUserType,
  onClose,
}) => {
  const userTypes = [
    {
      type: 'developer' as UserType,
      title: 'Developer',
      icon: '💻',
      description: 'Integrate AI agents and MCP servers into your applications',
      benefits: [
        'SDK integration guides',
        'Technical documentation',
        'Code examples and tutorials',
        'API reference and best practices'
      ],
      estimatedTime: '15 minutes',
      color: 'border-blue-500 bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      type: 'enduser' as UserType,
      title: 'End User',
      icon: '👤',
      description: 'Discover and use AI agents and services',
      benefits: [
        'Service discovery tutorials',
        'Wallet setup guidance',
        'Platform navigation help',
        'Token usage explanations'
      ],
      estimatedTime: '10 minutes',
      color: 'border-green-500 bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      type: 'provider' as UserType,
      title: 'AI Service Provider',
      icon: '🏢',
      description: 'Register and monetize your AI services',
      benefits: [
        'Registration process guide',
        'Monetization strategies',
        'Marketing best practices',
        'Analytics and optimization'
      ],
      estimatedTime: '12 minutes',
      color: 'border-purple-500 bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            boxShadow: '8px 8px 0px #A3A3A3',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b-2 border-gray-300">
            <div>
              <h1 className="text-2xl font-bold mb-2">WELCOME TO SOLANA AI REGISTRIES</h1>
              <p className="text-gray-600">Choose your path to get started with our interactive onboarding</p>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 text-2xl font-bold leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userTypes.map((userType) => (
                <div
                  key={userType.type}
                  className={`border-2 ${userType.color} ${userType.hoverColor} p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
                  onClick={() => onSelectUserType(userType.type)}
                >
                  {/* Icon and Title */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{userType.icon}</div>
                    <h2 className="text-xl font-bold">{userType.title}</h2>
                    <div className="text-sm text-gray-600 mt-1">
                      ⏱️ {userType.estimatedTime}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4 text-center">
                    {userType.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm">What you'll learn:</h3>
                    <ul className="text-xs space-y-1">
                      {userType.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-6 text-center">
                    <div className="inline-block px-4 py-2 bg-black text-white text-sm font-bold">
                      [START {userType.title.toUpperCase()} TOUR]
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-gray-100 border border-gray-300">
              <h3 className="font-bold mb-2">💡 Not sure which path to choose?</h3>
              <div className="text-sm space-y-2">
                <p><strong>Choose Developer</strong> if you want to build applications that use AI agents or MCP servers.</p>
                <p><strong>Choose End User</strong> if you want to discover and use AI services for personal or business needs.</p>
                <p><strong>Choose AI Service Provider</strong> if you have AI capabilities you want to monetize on our platform.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                You can always restart the tour or try a different path later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 border-2 border-gray-400 bg-white hover:bg-gray-100 text-sm"
              >
                [SKIP ONBOARDING]
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTypeSelector;