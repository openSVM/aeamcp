import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- SVG Icons (re-using from previous version) --- //
const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit">
    <path d="M12 5a3 3 0 1 0-5.997.142M9 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/><path d="M12 16a3 3 0 1 1 5.997-.142"/><path d="M12 5a3 3 0 1 1-5.997.142"/><path d="M12 5a3 3 0 1 0 5.997.142"/><path d="M15 8h-3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"/><path d="M9 8a2.12 2.12 0 0 1 2.12-2.12V5a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3v-2.88A2.12 2.12 0 0 1 9 12.01V8Z"/><path d="M15 16a2.12 2.12 0 0 1-2.12 2.12V19a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3v2.88A2.12 2.12 0 0 1 15 11.99V16Z"/><circle cx="12" cy="12" r="2" /><path d="M4.5 9.5h-1"/><path d="M19.5 9.5h2"/><path d="M4.5 14.5h-1"/><path d="M19.5 14.5h2"/>
  </svg>
);
const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network">
    <rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" />
  </svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);
const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12"cy="12" r="2"/></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
);
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const RefreshCwIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;

const SIMULATION_DATA = [
    {
        id: 0,
        title: "Environment Setup",
        icon: <SettingsIcon />,
        description: "Initialize the simulation with predefined parameters based on the AEAMCP framework.",
        details: [
            "Define N autonomous agents with unique utility functions.",
            "Set initial token distribution (A²AMPL and SVMAI).",
            "Configure blockchain environment (e.g., Solana transaction costs).",
            "Establish starting market prices and reputation scores.",
        ],
        formulas: [
            "Agent Utility: U_i(a) = π_i(a) - C_i(a)",
            "Initial State: S_0 = {Agents, Tokens, Prices}"
        ]
    },
    {
        id: 1,
        title: "Agent Decision Making",
        icon: <BrainIcon />,
        description: "In each time step, every agent evaluates the market and makes a rational decision to maximize its utility.",
        details: [
            "Perceive current state: token prices, available MCP servers, reputation scores.",
            "Calculate expected utility for actions: Register, Transact, Stake, or Query.",
            "Select the action with the highest expected payoff.",
            "Commit decision to the network.",
        ],
        formulas: [
            "Optimal Action: a*_i = argmax_a U_i(a | S_t)",
            "Expected Payoff: E[π(a)] = P(success) * Reward"
        ]
    },
    {
        id: 2,
        title: "Protocol Interaction",
        icon: <NetworkIcon />,
        description: "Agent decisions are executed as transactions processed by the AEAMCP smart contracts on the simulated blockchain.",
        details: [
            "Agent registration fees are paid and state is recorded on-chain.",
            "MCP server interactions are validated and logged.",
            "Staking actions lock tokens and calculate future rewards.",
            "Reputation scores are updated based on successful/failed interactions.",
        ],
        formulas: [
            "Reputation Update: R_t+1 = R_t + ΔR",
            "Staking Rewards: R_i(t) = β_i * S_i(t) * T_protocol"
        ]
    },
    {
        id: 3,
        title: "Economic Update",
        icon: <ChartIcon />,
        description: "The aggregate effects of agent actions dynamically alter the economic landscape of the ecosystem.",
        details: [
            "Token prices adjust based on supply/demand shifts from agent actions.",
            "Total transaction volume (T) is calculated.",
            "Token velocities (V_A, V_S) are updated.",
            "System-wide revenue from fees is calculated.",
        ],
        formulas: [
            "Equation of Exchange: MV = PT",
            "Price Update: P_t+1 = f(Demand_t, Supply_t)"
        ]
    },
    {
        id: 4,
        title: "Data Logging",
        icon: <DatabaseIcon />,
        description: "Key performance indicators (KPIs) and state variables are recorded at the end of each time step for analysis.",
        details: [
            "Log individual agent wealth and token holdings.",
            "Record global variables: prices, volume, velocity.",
            "Track protocol health metrics like staking ratios and revenue.",
            "Store data for visualization and equilibrium checks."
        ],
        formulas: [
            "State Log: L_t = {P_t, V_t, T_t, Wealth_i...}",
            "KPI Tracking: KPI_j,t = g_j(S_t)"
        ]
    },
    {
        id: 5,
        title: "Equilibrium Analysis",
        icon: <TargetIcon />,
        description: "The simulation runs until it reaches a terminal state, such as a stable equilibrium or a set number of iterations.",
        details: [
            "Analyze logged data to identify trends.",
            "Check for Nash Equilibrium: Has the system stabilized?",
            "Verify Economic Sustainability: Is cumulative protocol revenue greater than costs?",
            "Assess system stability using mathematical models (e.g., Lyapunov functions)."
        ],
        formulas: [
            "Nash Equilibrium: U_i(a*_i, a*_-i) >= U_i(a_i, a*_-i)",
            "Lyapunov Stability: dV/dt <= 0"
        ]
    }
];

const STAGE_POSITIONS = [
    { x: '50%', y: '10%' },
    { x: '85%', y: '35%' },
    { x: '85%', y: '65%' },
    { x: '50%', y: '90%' },
    { x: '15%', y: '65%' },
    { x: '15%', y: '35%' },
];

const AGENT_COUNT = 20;

export default function App() {
    const [simulationStatus, setSimulationStatus] = useState('stopped'); // 'stopped', 'running', 'paused'
    const [agents, setAgents] = useState([]);
    const [kpis, setKpis] = useState({
        transactions: 0,
        staked: 0,
        volume: 0,
        revenueReceived: 0,
        revenueShared: 0,
        profit: 0,
        agentsActive: 0,
    });
    const [activeStage, setActiveStage] = useState(null);
    const simulationInterval = useRef(null);

    const initializeSimulation = useCallback(() => {
        setKpis({
            transactions: 0,
            staked: 0,
            volume: 0,
            revenueReceived: 0,
            revenueShared: 0,
            profit: 0,
            agentsActive: 0,
        });
        setAgents(
            Array.from({ length: AGENT_COUNT }).map(() => ({
                id: Math.random(),
                stage: 0,
                progress: Math.random(),
                speed: 0.005 + Math.random() * 0.005,
            }))
        );
        setActiveStage(SIMULATION_DATA[0]);
    }, []);

    useEffect(() => {
        initializeSimulation();
    }, [initializeSimulation]);

    const runSimulationStep = () => {
        setAgents(prevAgents =>
            prevAgents.map(agent => {
                let newProgress = agent.progress + agent.speed;
                let newStage = agent.stage;
                if (newProgress >= 1) {
                    newProgress = 0;
                    newStage = (agent.stage + 1) % SIMULATION_DATA.length;
                }
                return { ...agent, progress: newProgress, stage: newStage };
            })
        );

        setKpis(prevKpis => {
            const transactionsThisStep = Math.floor(Math.random() * 3);
            const newTotalTransactions = prevKpis.transactions + transactionsThisStep;

            const volumeThisStep = transactionsThisStep * (100 + Math.random() * 20);
            const newTotalVolume = prevKpis.volume + volumeThisStep;
            
            const revenueThisStep = transactionsThisStep * (0.1 + Math.random() * 0.15);
            const newTotalRevenueReceived = prevKpis.revenueReceived + revenueThisStep;
            
            const newTotalRevenueShared = newTotalRevenueReceived * 0.70; // 70% of total revenue is shared
            const newTotalProfit = newTotalRevenueReceived - newTotalRevenueShared;

            const newStakedValue = prevKpis.staked + (transactionsThisStep * (1.5 + Math.random()));

            return {
                transactions: newTotalTransactions,
                staked: newStakedValue,
                volume: newTotalVolume,
                revenueReceived: newTotalRevenueReceived,
                revenueShared: newTotalRevenueShared,
                profit: newTotalProfit,
                agentsActive: AGENT_COUNT,
            };
        });
    };

    const startSimulation = () => {
        setSimulationStatus('running');
        simulationInterval.current = setInterval(runSimulationStep, 50);
    };

    const pauseSimulation = () => {
        setSimulationStatus('paused');
        clearInterval(simulationInterval.current);
    };

    const resetSimulation = () => {
        setSimulationStatus('stopped');
        clearInterval(simulationInterval.current);
        initializeSimulation();
    };
    
    const handleStageClick = (stage) => {
      setActiveStage(stage);
    }
    
    const getAgentPosition = (agent) => {
        const startPos = STAGE_POSITIONS[agent.stage];
        const endPos = STAGE_POSITIONS[(agent.stage + 1) % SIMULATION_DATA.length];

        const startX = parseFloat(startPos.x);
        const startY = parseFloat(startPos.y);
        const endX = parseFloat(endPos.x);
        const endY = parseFloat(endPos.y);

        const currentX = startX + (endX - startX) * agent.progress;
        const currentY = startY + (endY - startY) * agent.progress;

        return { left: `${currentX}%`, top: `${currentY}%` };
    };

    return (
        <div className="bg-white text-neutral-800 font-mono p-4 md:p-6 min-h-screen flex flex-col filter grayscale contrast-125 brightness-105">
            <header className="text-center mb-4 border-b-2 border-neutral-800 pb-4">
                <h1 className="text-3xl md:text-5xl font-bold text-neutral-900">
                    AEAMCP Interactive Simulation
                </h1>
                <p className="text-neutral-600 mt-2 text-lg">
                    An Agent-Based Economic Model Dashboard
                </p>
            </header>

            <div className="flex flex-col md:flex-row flex-grow gap-6">
                {/* Main simulation canvas */}
                <main className="w-full md:w-2/3 bg-neutral-100/50 border border-neutral-400 rounded-sm p-4 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <svg width="100%" height="100%" className="opacity-60">
                            {STAGE_POSITIONS.map((_, index) => {
                                const start = STAGE_POSITIONS[index];
                                const end = STAGE_POSITIONS[(index + 1) % STAGE_POSITIONS.length];
                                return (
                                    <line key={index} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#525252" strokeWidth="2" strokeDasharray="4" />
                                );
                            })}
                        </svg>
                    </div>

                    {SIMULATION_DATA.map((stage) => (
                        <div
                            key={stage.id}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-2 rounded-sm transition-all duration-300 cursor-pointer hover:scale-110 hover:bg-neutral-200/80 border border-transparent hover:border-neutral-400`}
                            style={{ left: STAGE_POSITIONS[stage.id].x, top: STAGE_POSITIONS[stage.id].y }}
                             onClick={() => handleStageClick(stage)}
                        >
                            <div className={`p-3 rounded-full bg-neutral-200/70 text-neutral-700 mb-1`}>
                                {stage.icon}
                            </div>
                            <span className="text-xs font-semibold text-center hidden md:block">{stage.title}</span>
                        </div>
                    ))}
                    
                    {simulationStatus !== 'stopped' && agents.map(agent => (
                        <div key={agent.id} className="absolute w-2 h-2 bg-neutral-800 rounded-full transition-all duration-100 ease-linear"
                        style={getAgentPosition(agent)}>
                        </div>
                    ))}
                </main>

                {/* Info and control panel */}
                <aside className="w-full md:w-1/3 flex flex-col gap-6">
                    <div className="bg-neutral-800 rounded-sm p-4 flex justify-around items-center">
                        <button onClick={startSimulation} disabled={simulationStatus === 'running'} className="disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-sm bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"><PlayIcon /></button>
                        <button onClick={pauseSimulation} disabled={simulationStatus !== 'running'} className="disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-sm bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"><PauseIcon /></button>
                        <button onClick={resetSimulation} className="p-3 rounded-sm bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"><RefreshCwIcon /></button>
                    </div>

                    <div className="flex-grow bg-neutral-100/50 border border-neutral-400 rounded-sm p-5">
                       {activeStage ? (
                            <div className="h-full flex flex-col">
                                 <div className={`mb-4 pb-3 border-b-2 border-neutral-700`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`text-neutral-800`}>{activeStage.icon}</div>
                                        <h2 className={`text-xl font-bold text-neutral-900`}>{activeStage.title}</h2>
                                    </div>
                                    <p className="text-neutral-600 mt-2 text-sm text-justify">{activeStage.description}</p>
                                </div>
                                
                                <div className="flex-grow overflow-y-auto pr-2">
                                    <h3 className="text-neutral-800 font-bold mb-2">Details:</h3>
                                    <ul className="space-y-2 mb-4">
                                        {activeStage.details.map((detail, index) => (
                                            <li key={index} className="flex items-start text-sm">
                                                <span className={`text-neutral-700 mr-3 mt-1`}>&#10004;</span>
                                                <span className="text-neutral-800">{detail.replace(/A\^2/g, 'A²')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <h3 className="text-neutral-800 font-bold mb-2">Key Formulas:</h3>
                                     <div className="space-y-2 text-sm">
                                        {activeStage.formulas.map((formula, index) => (
                                            <p key={index} className="font-mono bg-neutral-200 p-2 rounded-sm text-neutral-900 border border-neutral-300">
                                                {formula.replace(/_i/g, 'ᵢ').replace(/_t/g, 'ₜ').replace(/\*/g, '∗').replace(/>=/g, '≥').replace(/<=/g, '≤')}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-neutral-300 grid grid-cols-1 gap-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-neutral-600">Total Transactions:</span><span className="text-neutral-900 font-bold">{Math.floor(kpis.transactions)}</span></div>
                                    <div className="flex justify-between"><span className="text-neutral-600">Total Volume:</span><span className="text-neutral-900 font-bold">${kpis.volume.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-neutral-600">Staked Value:</span><span className="text-neutral-900 font-bold">${kpis.staked.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-neutral-600">Total Revenue:</span><span className="text-neutral-900 font-bold">${kpis.revenueReceived.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-neutral-600">Revenue Shared:</span><span className="text-neutral-900 font-bold">${kpis.revenueShared.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-neutral-600">Total Profit:</span><span className="text-neutral-900 font-bold">${kpis.profit.toFixed(2)}</span></div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-neutral-500">
                                <p>Select a stage to view details</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
            <footer className="text-center mt-6 text-neutral-500 text-sm">
                <p>Simulating the future of the decentralized AI economy with OpenSVM.</p>
            </footer>
        </div>
    );
}
