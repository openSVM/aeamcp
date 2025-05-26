'use client';

import { useState } from 'react';
import { SVMAI_TOKEN_MINT, EXTERNAL_LINKS } from '@/lib/constants';

export default function TokenomicsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'escrow-model', label: 'SERVICE ESCROW' },
    { id: 'dispute-resolution', label: 'DISPUTE RESOLUTION' },
    { id: 'token-utility', label: 'TOKEN UTILITY' },
    { id: 'economics', label: 'ECONOMICS' },
    { id: 'recommendations', label: 'RECOMMENDATIONS' }
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Courier New', Courier, monospace", backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <section className="py-12" style={{ backgroundColor: '#F5F5F5', borderBottom: '2px solid #A3A3A3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="ascii-logo w-16 h-16 mx-auto mb-6">
              <span className="text-3xl font-bold">[$]</span>
            </div>
            <h1 className="ascii-section-title text-4xl md:text-5xl mb-4">
              SVMAI SERVICE ESCROW TOKENOMICS
            </h1>
            <p className="ascii-lead-text text-lg max-w-4xl mx-auto mb-6">
              An Analysis of a Service Escrow Tokenomic Model for the SVMAI Token
            </p>
            <div className="ascii-info-box inline-block">
              <div className="ascii-info-box-title mb-2">CONTRACT ADDRESS</div>
              <div className="flex items-center justify-center space-x-2">
                <code className="ascii-code text-xs">
                  {SVMAI_TOKEN_MINT.toString()}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(SVMAI_TOKEN_MINT.toString())}
                  className="ascii-link text-sm"
                  title="Copy address"
                >
                  [COPY]
                </button>
              </div>
              <div className="flex justify-center space-x-2 mt-2">
                <a
                  href={EXTERNAL_LINKS.SOLSCAN_TOKEN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ascii-status"
                  style={{ backgroundColor: '#D4D4D4', color: '#171717' }}
                >
                  SOLSCAN [EXT]
                </a>
                <a
                  href={EXTERNAL_LINKS.JUPITER_SWAP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ascii-status"
                  style={{ backgroundColor: '#E5E5E5', color: '#171717' }}
                >
                  JUPITER [EXT]
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-6" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #A3A3A3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`ascii-nav-link ${activeSection === section.id ? 'active' : ''}`}
                style={{ 
                  backgroundColor: activeSection === section.id ? '#404040' : 'transparent',
                  color: activeSection === section.id ? '#FFFFFF' : '#525252'
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="ascii-card">
              <h2 className="ascii-subsection-title mb-6">EXECUTIVE SUMMARY</h2>
              <div className="ascii-body-text space-y-4">
                <p>
                  This analysis examines a novel tokenomic model for the SVMAI token, designed to facilitate secure service engagements between clients and agents through an innovative escrow mechanism.
                </p>
                <p>
                  The model replaces previous NFT and veToken frameworks with a direct utility approach where clients lock SVMAI tokens as stakes while agents lock their fees, creating mutual commitment and security.
                </p>
                <div className="ascii-info-box">
                  <h3 className="ascii-info-box-title">KEY FINDINGS:</h3>
                  <ul className="list-disc list-inside space-y-2 ascii-info-box-text">
                    <li>Current "winner-takes-all" dispute outcome creates significant client-side moral hazard</li>
                    <li>Model heavily disadvantages agents and could discourage participation</li>
                    <li>Success depends on implementing robust decentralized dispute resolution (DDR)</li>
                    <li>"Perceived free service" phenomenon requires careful management</li>
                    <li>Strong potential if critical recommendations are implemented</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">CRITICAL RECOMMENDATIONS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">1. OVERHAUL DISPUTE RESOLUTION</h4>
                  <p className="ascii-info-box-text">
                    Replace binary "client reclaims all" with robust DDR system featuring staked jurors and nuanced outcomes.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">2. ENHANCE SMART CONTRACT SECURITY</h4>
                  <p className="ascii-info-box-text">
                    Mandate multiple security audits and implement proven design patterns for fund protection.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">3. MITIGATE "FREE SERVICE" PERCEPTION</h4>
                  <p className="ascii-info-box-text">
                    Introduce small platform fees and clear value communication to maintain service appreciation.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">4. EXPAND TOKEN UTILITY</h4>
                  <p className="ascii-info-box-text">
                    Integrate SVMAI into DDR processes, governance, and premium features for enhanced value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Escrow Model */}
        {activeSection === 'escrow-model' && (
          <div className="space-y-8">
            <div className="ascii-card">
              <h2 className="ascii-subsection-title mb-6">SVMAI SERVICE ESCROW MODEL</h2>
              <div className="ascii-body-text space-y-4">
                <p>
                  The SVMAI service escrow model operates through precise management of token flows, governed by smart contracts that create a secure environment for service transactions.
                </p>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">TRANSACTION LIFECYCLE</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">SERVICE INITIATION</h4>
                    <p className="ascii-info-box-text">
                      Client locks predetermined SVMAI tokens as stake, signaling commitment and providing security deposit.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">AGENT ENGAGEMENT</h4>
                    <p className="ascii-info-box-text">
                      Agent's agreed-upon fee (in SVMAI tokens) is locked into escrow, securing compensation contingent on delivery.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">SERVICE DELIVERY</h4>
                    <p className="ascii-info-box-text">
                      Agent performs and delivers the agreed-upon service according to specifications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">CLIENT DECISION</h4>
                    <p className="ascii-info-box-text">
                      Client reviews work and decides to either approve (releasing funds) or dispute (triggering resolution process).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">SMART CONTRACT ARCHITECTURE</h3>
              <div className="ascii-table-container">
                <table className="ascii-table">
                  <thead>
                    <tr>
                      <th>FUNCTION</th>
                      <th>PURPOSE</th>
                      <th>SECURITY PATTERN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>INITIATE_ESCROW()</td>
                      <td>CREATE NEW ESCROW INSTANCE</td>
                      <td>ACCESS CONTROL</td>
                    </tr>
                    <tr>
                      <td>LOCK_STAKE_AND_FEE()</td>
                      <td>TRANSFER TOKENS TO CONTRACT</td>
                      <td>SAFE TOKEN TRANSFER</td>
                    </tr>
                    <tr>
                      <td>APPROVE_WORK()</td>
                      <td>SIGNAL SATISFACTION</td>
                      <td>CHECKS-EFFECTS-INTERACTIONS</td>
                    </tr>
                    <tr>
                      <td>DISPUTE_WORK()</td>
                      <td>INITIATE DISPUTE PROCESS</td>
                      <td>TIME CONSTRAINTS</td>
                    </tr>
                    <tr>
                      <td>RESOLVE_DISPUTE()</td>
                      <td>COMMUNICATE DDR OUTCOME</td>
                      <td>ORACLE SECURITY</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Resolution */}
        {activeSection === 'dispute-resolution' && (
          <div className="space-y-8">
            <div className="ascii-card">
              <h2 className="ascii-subsection-title mb-6">DISPUTE RESOLUTION FRAMEWORK</h2>
              <div className="ascii-body-text space-y-4">
                <p>
                  The dispute resolution framework is the most critical component for success and perceived fairness of the SVMAI service escrow model.
                </p>
                <div className="ascii-info-box" style={{ backgroundColor: '#FAFAFA', borderColor: '#737373' }}>
                  <h3 className="ascii-info-box-title" style={{ color: '#737373' }}>CURRENT BINARY OUTCOME ISSUES:</h3>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text" style={{ color: '#525252' }}>
                    <li>High agent risk - losing both payment and fees to client</li>
                    <li>Client-side moral hazard - financial incentive for frivolous disputes</li>
                    <li>Lack of nuance - no partial payment options</li>
                    <li>Potential for "griefing" attacks by malicious clients</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">DDR SYSTEM COMPARISON</h3>
              <div className="ascii-table-container">
                <table className="ascii-table">
                  <thead>
                    <tr>
                      <th>SYSTEM</th>
                      <th>JUROR SELECTION</th>
                      <th>STAKING</th>
                      <th>STRENGTHS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>KLEROS</td>
                      <td>RANDOM, PNK WEIGHTED</td>
                      <td>PNK TOKENS</td>
                      <td>DECENTRALIZED, TRANSPARENT</td>
                    </tr>
                    <tr>
                      <td>ARAGON COURT</td>
                      <td>DRAFTED BY ANJ STAKE</td>
                      <td>ANJ TOKENS</td>
                      <td>SUBJECTIVE DISPUTES</td>
                    </tr>
                    <tr>
                      <td>SOCIOUS</td>
                      <td>EXPERT PANELS</td>
                      <td>DISPUTE FEES</td>
                      <td>COMMUNITY DRIVEN</td>
                    </tr>
                    <tr>
                      <td>PROPOSED SVMAI</td>
                      <td>SVMAI STAKERS</td>
                      <td>SVMAI TOKENS</td>
                      <td>INTEGRATED UTILITY</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">RECOMMENDED DDR DESIGN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">JUROR SELECTION</h4>
                  <p className="ascii-info-box-text">
                    Pool formed by SVMAI token stakers. Selection proportional to stake with reputation weighting for specialized courts.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">INCENTIVE STRUCTURE</h4>
                  <p className="ascii-info-box-text">
                    Coherent voters receive SVMAI rewards. Incoherent voters face token slashing penalties.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">EVIDENCE SYSTEM</h4>
                  <p className="ascii-info-box-text">
                    Secure interface for submitting agreements, communications, deliverables, and documentation.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">APPEAL PROCESS</h4>
                  <p className="ascii-info-box-text">
                    Multi-round appeals with larger juror panels and increased SVMAI staking requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Token Utility */}
        {activeSection === 'token-utility' && (
          <div className="space-y-8">
            <div className="ascii-card">
              <h2 className="ascii-subsection-title mb-6">SVMAI TOKEN UTILITY & ECOSYSTEM VALUE</h2>
              <div className="ascii-body-text space-y-4">
                <p>
                  The utility and value proposition of the SVMAI token are central to ecosystem sustainability and growth. The service escrow model provides foundational utility with strategic expansion opportunities.
                </p>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">ENHANCED TOKEN UTILITY</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">PRIMARY ESCROW MEDIUM</h4>
                  <p className="ascii-info-box-text">
                    Mandatory use for client stakes and agent fees, establishing fundamental demand proportional to platform activity.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">DDR PARTICIPATION</h4>
                  <p className="ascii-info-box-text">
                    Required for juror staking, dispute initiation fees, and appeal processes, creating additional demand vectors.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">GOVERNANCE RIGHTS</h4>
                  <p className="ascii-info-box-text">
                    Token holders vote on platform parameters, DDR policies, and ecosystem decisions through staking mechanisms.
                  </p>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">PREMIUM FEATURES</h4>
                  <p className="ascii-info-box-text">
                    Reduced fees, enhanced visibility, advanced analytics, and priority support for token holders.
                  </p>
                </div>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">VALUE ACCRUAL MECHANISMS</h3>
              <div className="space-y-4">
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">DEMAND DRIVERS</h4>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text">
                    <li>Platform growth increasing escrow volume</li>
                    <li>DDR participation requiring token staking</li>
                    <li>Governance staking reducing circulating supply</li>
                    <li>Premium feature access creating utility demand</li>
                  </ul>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">SUPPLY MANAGEMENT</h4>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text">
                    <li>Token burns from platform fees and penalties</li>
                    <li>Staking mechanisms locking circulating supply</li>
                    <li>Revenue sharing for long-term holders</li>
                    <li>Dynamic supply based on platform metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Economics */}
        {activeSection === 'economics' && (
          <div className="space-y-8">
            <div className="ascii-card">
              <h2 className="ascii-subsection-title mb-6">ECONOMIC & BEHAVIORAL IMPACT ANALYSIS</h2>
              <div className="ascii-body-text space-y-4">
                <p>
                  The SVMAI model creates unique economic dynamics through its stake return mechanism and dispute structure, requiring careful analysis of behavioral incentives.
                </p>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">"PERCEIVED FREE SERVICE" PHENOMENON</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="ascii-info-box-title mb-3" style={{ color: '#171717' }}>POSITIVE IMPLICATIONS</h4>
                  <div className="ascii-info-box" style={{ backgroundColor: '#F5F5F5' }}>
                    <ul className="list-disc list-inside space-y-1 ascii-info-box-text">
                      <li>Lowered barrier to entry for new clients</li>
                      <li>Increased client acquisition potential</li>
                      <li>Enhanced initial trust in platform</li>
                      <li>Reduced perceived risk for service trials</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="ascii-info-box-title mb-3" style={{ color: '#525252' }}>NEGATIVE IMPLICATIONS</h4>
                  <div className="ascii-info-box" style={{ backgroundColor: '#E5E5E5' }}>
                    <ul className="list-disc list-inside space-y-1 ascii-info-box-text">
                      <li>Potential devaluation of agent services</li>
                      <li>Unrealistic client expectations</li>
                      <li>Reduced client diligence in quality assessment</li>
                      <li>Incentive for frivolous disputes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">AGENT PRICING STRATEGIES</h3>
              <div className="ascii-table-container">
                <table className="ascii-table">
                  <thead>
                    <tr>
                      <th>STRATEGY</th>
                      <th>DESCRIPTION</th>
                      <th>RISK MITIGATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>RISK-ADJUSTED PRICING</td>
                      <td>HIGHER FEES TO BUFFER DISPUTE LOSSES</td>
                      <td>FINANCIAL CUSHION</td>
                    </tr>
                    <tr>
                      <td>MILESTONE PAYMENTS</td>
                      <td>BREAK LARGE PROJECTS INTO PHASES</td>
                      <td>REDUCED EXPOSURE PER PHASE</td>
                    </tr>
                    <tr>
                      <td>TIERED SERVICES</td>
                      <td>DIFFERENT LEVELS WITH VARYING FEES</td>
                      <td>MANAGED RISK BY TIER</td>
                    </tr>
                    <tr>
                      <td>VALUE-BASED PRICING</td>
                      <td>PRICE ON ROI/VALUE DELIVERED</td>
                      <td>JUSTIFIED HIGHER RATES</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {activeSection === 'recommendations' && (
          <div className="space-y-8">
            <div className="ascii-card">
              <h2 className="ascii-subsection-title mb-6">STRATEGIC RECOMMENDATIONS</h2>
              <div className="ascii-body-text space-y-4">
                <p>
                  Based on comprehensive analysis, the following recommendations are critical for the viability, fairness, and sustainability of the SVMAI tokenomic model.
                </p>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">IMPLEMENTATION ROADMAP</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">PHASE 1: CORE ESCROW DEVELOPMENT (3-6 MONTHS)</h4>
                    <p className="ascii-info-box-text">
                      Develop foundational smart contracts, conduct security audits, implement basic escrow functionality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">PHASE 2: DDR INTEGRATION (4-8 MONTHS)</h4>
                    <p className="ascii-info-box-text">
                      Design and integrate robust dispute resolution system, conduct additional security audits.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">PHASE 3: TESTNET LAUNCH (3-4 MONTHS)</h4>
                    <p className="ascii-info-box-text">
                      Deploy on testnet, gather user feedback, iterate on UX and DDR parameters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="ascii-logo w-8 h-8 flex-shrink-0">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div className="ascii-info-box flex-1">
                    <h4 className="ascii-info-box-title">PHASE 4: MAINNET LAUNCH (ONGOING)</h4>
                    <p className="ascii-info-box-text">
                      Limited scope mainnet launch, gradual scaling, continuous monitoring and improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">CRITICAL SUCCESS FACTORS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">TECHNICAL EXCELLENCE</h4>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text text-sm">
                    <li>Multiple independent security audits</li>
                    <li>Proven smart contract design patterns</li>
                    <li>Comprehensive testing and monitoring</li>
                    <li>Emergency response procedures</li>
                  </ul>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">USER EXPERIENCE</h4>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text text-sm">
                    <li>Intuitive interface design</li>
                    <li>Clear process documentation</li>
                    <li>Educational resources</li>
                    <li>Responsive customer support</li>
                  </ul>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">LEGAL COMPLIANCE</h4>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text text-sm">
                    <li>Regulatory landscape monitoring</li>
                    <li>Specialized legal counsel</li>
                    <li>Jurisdiction-specific compliance</li>
                    <li>Privacy protection measures</li>
                  </ul>
                </div>
                <div className="ascii-info-box">
                  <h4 className="ascii-info-box-title">COMMUNITY BUILDING</h4>
                  <ul className="list-disc list-inside space-y-1 ascii-info-box-text text-sm">
                    <li>Active stakeholder engagement</li>
                    <li>Transparent governance processes</li>
                    <li>Feedback integration mechanisms</li>
                    <li>Ecosystem partnership development</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="ascii-card text-center mt-12">
          <h2 className="ascii-subsection-title mb-4">CONCLUSION</h2>
          <p className="ascii-body-text mb-6">
            The SVMAI service escrow model presents innovative potential for secure, transparent service transactions. Success requires addressing dispute resolution fairness, smart contract security, and behavioral economics through careful implementation and community engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/agents" className="ascii-button-primary">
              [EXPLORE AGENTS]
            </a>
            <a href="/servers" className="ascii-button-secondary">
              [BROWSE MCP SERVERS]
            </a>
            <a 
              href="https://github.com/openSVM/aeamcp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ascii-button-secondary"
            >
              [VIEW DOCUMENTATION]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}