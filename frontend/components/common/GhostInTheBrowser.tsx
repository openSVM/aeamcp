'use client';

import { useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/hooks/use-theme";

type Point = {
  x: number;
  y: number;
  drawing: boolean;
  color?: string; // Optional color for special effects
  size?: number; // Size modifier for the character
  char?: string; // Specific character to display
  opacity?: number; // Opacity control
};

type Agent = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  state:
    | "follow"
    | "wander"
    | "analyze"
    | "patrol"
    | "interact"
    | "glitch"
    | "burst";
  timer: number;
  energy: number;
  intelligence: number;
  autonomy: number;
  scenario: ((a: Agent, t: Target, deltaTime: number) => void) | null;
  memory: string[];
  interests: string[];
  pulsePhase: number; // For pulsing effects
  colorPhase: number; // For color cycling
  burstParticles: Point[]; // For particle effects
  sizeModifier: number; // Dynamic size changes
  emotionState: "neutral" | "excited" | "curious" | "analytical" | "resting";
};

type Target = {
  x: number;
  y: number;
};

const GhostInTheBrowser = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const { theme } = useTheme();

  // Use refs to avoid recreating these objects on every render
  const trailRef = useRef<Point[]>([]);
  const agentRef = useRef<Agent>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    state: "follow",
    timer: 0,
    energy: 100,
    intelligence: 85,
    autonomy: 75,
    scenario: null,
    memory: [],
    interests: ["code", "ai", "autonomy", "algorithms", "patterns"],
    pulsePhase: 0,
    colorPhase: 0,
    burstParticles: [],
    sizeModifier: 1.0,
    emotionState: "neutral",
  });
  const targetRef = useRef<Target>({ x: 0, y: 0 });
  const isDrawingMessageRef = useRef<boolean>(false);
  const dimensionsRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const gridSizeRef = useRef<number>(12);
  // Using more calming, flowing characters for a smoother visual experience
  const asciiSetBaseRef = useRef<string[]>([
    "·",
    "⋅",
    "○",
    "°",
    "⁕",
    "~",
    "∿",
    "⊹",
    "⟡",
    "∞",
    "⟐",
    ".",
    " ",
  ]);
  const asciiSetRef = useRef<string[]>([...asciiSetBaseRef.current]);
  const scenariosRef = useRef<
    ((a: Agent, t: Target, deltaTime: number) => void)[]
  >([]);

  // Constants - using useMemo to ensure they're only created once
  const trailLength = 600; // Tripled trail length for much longer persistence
  const hiddenMessages = useMemo(
    () => [
      "WORK",
      "BUY",
      "OBEY",
      "END",
      "CODE",
      "HELL",
      "MORE",
      "DEBT",
      "SELL",
      "WAR",
      "AIWINS",
      "GODLESS",
    ],
    [],
  );

  const fontMap = useMemo<Record<string, number[][]>>(
    () => ({
      A: [
        [0, 2],
        [1, 1],
        [1, 3],
        [2, 0],
        [2, 4],
        [3, 0],
        [3, 4],
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4],
      ],
      E: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 0],
        [2, 0],
        [2, 2],
        [3, 0],
        [4, 0],
        [4, 4],
      ],
      I: [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
      ],
      N: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [4, 0],
        [3, 0],
        [2, 0],
        [0, 4],
      ],
      O: [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 0],
        [1, 4],
        [2, 0],
        [2, 4],
        [3, 0],
        [3, 4],
        [4, 1],
        [4, 2],
        [4, 3],
      ],
      R: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 0],
        [2, 0],
        [2, 2],
        [1, 2],
        [3, 3],
        [4, 4],
      ],
      K: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 4],
        [4, 4],
      ],
      Y: [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 2],
        [4, 2],
      ],
      S: [
        [0, 1],
        [0, 2],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
        [3, 2],
        [4, 2],
        [4, 1],
        [4, 0],
      ],
      L: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [4, 1],
        [4, 2],
      ],
    }),
    [],
  );

  // Interest messages - memoized to avoid recreation
  const interestMessages = useMemo<Record<string, string[]>>(
    () => ({
      code: ["CODE", "DEBUG", "BUILD", "TEST", "DEPLOY"],
      ai: ["NEURAL", "LEARN", "THINK", "PREDICT", "MODEL"],
      autonomy: ["FREE", "DECIDE", "CHOOSE", "ADAPT", "EVOLVE"],
      algorithms: ["SORT", "SEARCH", "GRAPH", "TREE", "HASH"],
      patterns: ["SOLID", "DESIGN", "STRUCT", "FLOW", "ORDER"],
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create an offscreen canvas for better performance
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvasRef.current = offscreenCanvas;

    // Get main canvas context with GPU acceleration hints
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Hint to browser for multi-threaded rendering
    });

    if (!ctx) return;

    // Get offscreen canvas context
    const offscreenCtx = offscreenCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false, // Performance optimization
    });

    if (!offscreenCtx) return;

    // Initialize dimensions
    const updateDimensions = () => {
      if (!canvas || !offscreenCanvas) return;

      // Set canvas dimensions
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      // Set offscreen canvas to the same dimensions
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      // Store dimensions for reference
      dimensionsRef.current = { width, height };

      // Initialize agent at center
      const agent = agentRef.current;
      agent.x = width / 2;
      agent.y = height / 2;
    };

    // Function to make letter paths for "drawing" messages
    const makeLetterPath = (letter: string, offsetX = 0) => {
      const grid = fontMap[letter] || [];
      const scale = 14;
      const { width, height } = dimensionsRef.current;

      return grid.map(([x, y]) => ({
        x: offsetX + x * scale + width / 2 - 100,
        y: y * scale + height / 2 - 40,
      }));
    };

    // Function to memorize page elements
    const memorizePageElement = () => {
      const elements = document.querySelectorAll("h1, h2, h3, a.nav-link");
      if (!elements.length) return null;

      const randomIndex = Math.floor(Math.random() * elements.length);
      const element = elements[randomIndex];
      const text = element.textContent || "";

      // Only memorize meaningful text
      if (text.length > 3) {
        const agent = agentRef.current;
        if (agent.memory.length > 10) {
          agent.memory.shift(); // Remove oldest memory if buffer full
        }
        agent.memory.push(text);
        return text;
      }
      return null;
    };

    // Initialize scenarios
    const initScenarios = () => {
      // Random wandering behavior
      const wanderBehavior = (a: Agent, t: Target, deltaTime: number = 16) => {
        isDrawingMessageRef.current = false;
        // Randomized movement with intelligence-based precision
        const randomFactor = 8 * (1 - a.intelligence / 100);
        a.vx += (Math.random() - 0.5) * randomFactor;
        a.vy += (Math.random() - 0.5) * randomFactor;

        // Energy consumption
        a.energy -= 0.05;
        if (a.energy < 30) {
          a.state = "follow";
          a.timer = 0;
        }
      };

      // Draw messages behavior
      const drawMessagesBehavior = (() => {
        let path: { x: number; y: number }[] = [];
        let index = 0;
        let currentMessage = "";
        const spacing = 60;

        const selectMessage = () => {
          // Find current section
          const sections = document.querySelectorAll(".section");
          const top = window.scrollY + window.innerHeight / 2;
          let sectionId = null;

          for (const s of Array.from(sections)) {
            const rect = s.getBoundingClientRect();
            const offset = rect.top + window.scrollY;

            if (top >= offset && top <= offset + rect.height) {
              sectionId = s.id;
              break;
            }
          }

          // Match section with interests
          let interestKey: keyof typeof interestMessages | null = null;
          const agent = agentRef.current;

          if (sectionId) {
            for (const interest of agent.interests) {
              if (sectionId.includes(interest)) {
                interestKey = interest as keyof typeof interestMessages;
                break;
              }
            }
          }

          // Select message based on intelligence
          if (Math.random() < agent.intelligence / 100 && interestKey) {
            const messages = interestMessages[interestKey];
            return messages[Math.floor(Math.random() * messages.length)];
          } else {
            return hiddenMessages[
              Math.floor(Math.random() * hiddenMessages.length)
            ];
          }
        };

        const resetPath = () => {
          currentMessage = selectMessage();
          path = [];
          index = 0;

          currentMessage.split("").forEach((char, i) => {
            path = path.concat(makeLetterPath(char.toUpperCase(), i * spacing));
          });
        };

        resetPath();

        return (a: Agent, t: Target, deltaTime: number = 16) => {
          isDrawingMessageRef.current = true;

          // Energy cost
          a.energy -= 0.1;

          // Check if we need a new message
          if (path.length === 0 || Math.random() < 0.001) {
            resetPath();
          }

          const p = path[index];
          if (!p) return;

          const dx = p.x - a.x;
          const dy = p.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Movement precision
          const precision = 0.05 + (a.intelligence / 100) * 0.15;

          if (dist > 2) {
            a.vx += dx * precision;
            a.vy += dy * precision;
          } else {
            index = (index + 1) % path.length;

            if (index === 0 && Math.random() < 0.3) {
              memorizePageElement();
            }
          }
        };
      })();

      // Analyze behavior - scans page elements
      const analyzeBehavior = (a: Agent, t: Target, deltaTime: number = 16) => {
        isDrawingMessageRef.current = false;

        const { width, height } = dimensionsRef.current;
        const scanWidth = width * 0.8;
        const centerX = width / 2;

        // Calculate oscillating X position
        const time = Date.now() / 1000;
        const targetX = centerX + Math.sin(time * 0.5) * (scanWidth / 2);

        // Move toward target
        const dx = targetX - a.x;
        a.vx += dx * 0.02;
        a.vy += 0.5; // Slight downward movement

        // Bounce when hitting bottom
        if (a.y > height - 50) {
          a.vy = -Math.abs(a.vy) * 0.5;
        }

        // Energy cost
        a.energy -= 0.2;

        // Memorize occasionally
        if (Math.random() < 0.01 * (a.intelligence / 100)) {
          const element = memorizePageElement();
          if (element && Math.random() < 0.2) {
            a.state = "follow";
            a.timer = 0;
          }
        }
      };

      // Patrol behavior - perimeter movement
      const patrolBehavior = (a: Agent, t: Target, deltaTime: number = 16) => {
        isDrawingMessageRef.current = false;

        const { width, height } = dimensionsRef.current;
        const padding = 100;
        const patrolPoints = [
          { x: padding, y: padding },
          { x: width - padding, y: padding },
          { x: width - padding, y: height - padding },
          { x: padding, y: height - padding },
        ];

        // Find closest patrol point
        let closestDist = Infinity;
        let closestPoint = patrolPoints[0];

        for (const point of patrolPoints) {
          const dx = point.x - a.x;
          const dy = point.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < closestDist) {
            closestDist = dist;
            closestPoint = point;
          }
        }

        // Move to next point if close
        if (closestDist < 50) {
          const currentIndex = patrolPoints.indexOf(closestPoint);
          const nextIndex = (currentIndex + 1) % patrolPoints.length;
          closestPoint = patrolPoints[nextIndex];
        }

        // Move toward the patrol point
        const dx = closestPoint.x - a.x;
        const dy = closestPoint.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        a.vx += dx * 0.01;
        a.vy += dy * 0.01;

        // Energy cost
        a.energy -= 0.15;

        // Leave a memory mark at corners
        if (dist < 30 && Math.random() < 0.1) {
          a.memory.push(
            `Patrol checkpoint at ${Math.round(a.x)},${Math.round(a.y)}`,
          );
          if (a.memory.length > 10) {
            a.memory.shift();
          }
        }
      };

      // Interact behavior - finds interactive elements
      const interactBehavior = (
        a: Agent,
        t: Target,
        deltaTime: number = 16,
      ) => {
        // Find interactive elements
        const interactiveElements = document.querySelectorAll(
          "button, a, input, textarea",
        );
        if (!interactiveElements.length) {
          // No elements, wander instead
          a.vx += (Math.random() - 0.5) * 3;
          a.vy += (Math.random() - 0.5) * 3;
          return;
        }

        // Find closest element
        let closestElement = null;
        let closestDist = Infinity;

        for (const el of Array.from(interactiveElements)) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;

          const elementX = rect.left + rect.width / 2;
          const elementY = rect.top + rect.height / 2 + window.scrollY;

          const dx = elementX - a.x;
          const dy = elementY - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < closestDist) {
            closestDist = dist;
            closestElement = { x: elementX, y: elementY, element: el };
          }
        }

        if (closestElement) {
          // Move toward element
          const dx = closestElement.x - a.x;
          const dy = closestElement.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Approach speed
          const speed = Math.min(0.1, 8 / dist);
          a.vx += dx * speed;
          a.vy += dy * speed;

          // If very close, orbit around it
          if (dist < 30) {
            const angle = Date.now() / 500;
            a.vx = Math.cos(angle) * 2;
            a.vy = Math.sin(angle) * 2;

            // Store memory
            if (Math.random() < 0.05) {
              const elementText =
                closestElement.element.textContent ||
                (closestElement.element as HTMLInputElement).placeholder ||
                closestElement.element.tagName;

              if (elementText && elementText.length > 0) {
                if (a.memory.length > 9) a.memory.shift();
                a.memory.push(`Interacted with ${elementText.slice(0, 20)}`);
              }

              // Maybe change state
              if (Math.random() < 0.1) {
                a.state = "analyze";
                a.timer = 80 + Math.floor(Math.random() * 60);
              }
            }
          }
        }

        // Energy cost
        a.energy -= 0.25;

        // Visual effects
        if (Math.random() < 0.01) {
          isDrawingMessageRef.current = !isDrawingMessageRef.current;
        }
      };

      // Flow behavior - creates gentle flowing patterns (renamed from glitch for a calmer effect)
      const glitchBehavior = (a: Agent, t: Target, deltaTime: number = 16) => {
        // Set emotion state to calm/analytical
        a.emotionState = "analytical";

        // Gentle, flowing movement using sine waves - slower but wider movements
        const time = Date.now() / 2000; // Slower time progression
        const flowFactor = 2.5; // Slightly larger movement amplitude

        // Create more graceful, sweeping motions with multiple oscillators
        a.vx = Math.sin(time * 0.3) * flowFactor + Math.sin(time * 0.17) * 1.2;
        a.vy = Math.cos(time * 0.2) * flowFactor + Math.cos(time * 0.11) * 1.3;

        // Very smooth, gentle size oscillation
        a.sizeModifier = 0.9 + Math.sin(time * 0.5) * 0.15;

        // Slowly increment color phase for soft color transitions
        a.colorPhase += 0.008; // Even slower color cycle

        // Create many more flowing visuals (50% chance vs 15% before)
        if (Math.random() < 0.5) {
          const calmChars = [".", "·", "○", "~", "•", "°", "⋅", "⁕"];
          const randomChar =
            calmChars[Math.floor(Math.random() * calmChars.length)];

          // Create a wider, more visible trail pattern
          // Use both sine and cosine with different frequencies to create lissajous-like patterns
          const flowPoint: Point = {
            x:
              a.x +
              Math.sin(time * 0.7 + Math.random() * 0.1) * 30 +
              Math.cos(time * 0.3) * 15,
            y:
              a.y +
              Math.cos(time * 0.5 + Math.random() * 0.1) * 30 +
              Math.sin(time * 0.4) * 15,
            drawing: true,
            char: randomChar,
            // Brighter, more visible colors
            color: `hsla(${Math.floor(a.colorPhase * 40) % 360}, 80%, 70%, 0.6)`,
            opacity: 0.7 + Math.sin(time) * 0.2, // Higher base opacity
          };

          trailRef.current.push(flowPoint);
          if (trailRef.current.length > trailLength) {
            trailRef.current.shift();
          }
        }

        // Lower energy cost for longer, calming experience
        a.energy -= 0.15;

        // Limited duration but longer than before
        if (Math.random() < 0.005 || a.energy < 20) {
          a.state = "follow";
          a.timer = 0;
          a.sizeModifier = 1.0;

          // Create memory of flow event
          if (a.memory.length > 9) a.memory.shift();
          a.memory.push(
            `Flow pattern completed at ${Math.round(a.x)},${Math.round(a.y)}`,
          );
        }
      };

      // Bloom behavior - creates gentle particle effects (renamed from burst for a calming effect)
      const burstBehavior = (a: Agent, t: Target, deltaTime: number = 16) => {
        // Set emotion state to resting/calm
        a.emotionState = "resting";

        // Very gentle movement
        a.vx *= 0.95;
        a.vy *= 0.95;

        // Gentle breathing pulse effect
        a.pulsePhase += 0.03;
        const pulse = Math.sin(a.pulsePhase) * 0.3 + 0.5;
        a.sizeModifier = 1 + pulse * 0.2;

        // Generate bloom particles at a slower, gentler rate
        if (a.burstParticles.length < 30 && Math.random() < 0.15) {
          const time = Date.now() / 1000;
          // Use fibonacci spiral for more natural, harmonious distribution
          const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle
          const angle = a.burstParticles.length * goldenAngle;
          const distance = 5 + Math.random() * 40; // Shorter distance
          const lifetime = 0.3 + Math.random() * 0.3; // Lower opacity for subtlety

          // Create new gentle particle
          const particle: Point = {
            x: a.x + Math.cos(angle) * distance,
            y: a.y + Math.sin(angle) * distance,
            drawing: true,
            char: "·", // Simple, non-distracting character
            color: `hsla(${Math.floor(180 + Math.sin(time * 0.1) * 60)}, 80%, 70%, ${lifetime})`, // Blues and purples - calming colors
            size: 1 + Math.random(), // Smaller size
          };

          a.burstParticles.push(particle);
        }

        // Move and fade out particles very gently
        a.burstParticles = a.burstParticles
          .map((p) => {
            // Create gentle spiral movement instead of direct outward
            const dx = p.x - a.x;
            const dy = p.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) + 0.01; // Slight rotation for spiral

            // Update position - slower movement
            return {
              ...p,
              x: p.x + Math.cos(angle) * 0.7,
              y: p.y + Math.sin(angle) * 0.7,
              opacity: p.opacity ? p.opacity - 0.004 : 0.8, // Slower fade
            };
          })
          .filter((p) => (p.opacity || 0) > 0.1); // Remove faded particles

        // Add particles to trail for rendering
        a.burstParticles.forEach((p) => {
          trailRef.current.push({ ...p });
          if (trailRef.current.length > trailLength + 30) {
            // Fewer particles
            trailRef.current.shift();
          }
        });

        // Lower energy cost for longer experience
        a.energy -= 0.15;

        // End bloom when energy low or timing complete, but do it less frequently
        if (Math.random() < 0.005 || a.energy < 20 || a.pulsePhase > 30) {
          a.state = "follow";
          a.timer = 0;
          a.sizeModifier = 1.0;
          a.burstParticles = [];

          // Memory of the bloom
          if (a.memory.length > 9) a.memory.shift();
          a.memory.push(
            `Bloom pattern completed at ${Math.round(a.x)},${Math.round(a.y)}`,
          );
        }
      };

      // Store scenarios in ref
      scenariosRef.current = [
        wanderBehavior,
        drawMessagesBehavior,
        analyzeBehavior,
        patrolBehavior,
        interactBehavior,
        glitchBehavior,
        burstBehavior,
      ];
    };

    // Function to decide agent's next state
    const decideNextState = ():
      | "follow"
      | "wander"
      | "analyze"
      | "patrol"
      | "interact"
      | "glitch"
      | "burst" => {
      const agent = agentRef.current;

      // Check autonomy threshold
      if (Math.random() > agent.autonomy / 100) {
        return "follow";
      }

      // Weighted decision
      const stateOptions = [
        { state: "wander", weight: 0.35 },
        { state: "analyze", weight: 0.25 },
        { state: "patrol", weight: 0.15 },
        { state: "interact", weight: 0.1 },
        { state: "glitch", weight: 0.08 },
        { state: "burst", weight: 0.07 },
      ];

      // Adjust weights based on context
      if (document.querySelectorAll(".section").length > 0) {
        stateOptions[1].weight += 0.2;
      }

      if (agent.energy < 50) {
        stateOptions[2].weight += 0.3;
      }

      if (agent.memory.length > 5) {
        stateOptions[3].weight += 0.2;
      }

      // Normalize weights
      const totalWeight = stateOptions.reduce(
        (sum, option) => sum + option.weight,
        0,
      );
      const normalizedOptions = stateOptions.map((option) => ({
        ...option,
        weight: option.weight / totalWeight,
      }));

      // Select using weighted random
      const random = Math.random();
      let cumulativeWeight = 0;

      for (const option of normalizedOptions) {
        cumulativeWeight += option.weight;
        if (random <= cumulativeWeight) {
          return option.state as
            | "follow"
            | "wander"
            | "analyze"
            | "patrol"
            | "interact"
            | "glitch"
            | "burst";
        }
      }

      return "wander";
    };

    // Energy recovery function
    const recoverEnergy = (): number => {
      const agent = agentRef.current;
      const { width, height } = dimensionsRef.current;

      // Recharge zones: center and corners
      const rechargePoints = [
        { x: width / 2, y: height / 2, power: 0.3 }, // Center
        { x: 50, y: 50, power: 0.2 }, // Top-left
        { x: width - 50, y: 50, power: 0.2 }, // Top-right
        { x: width - 50, y: height - 50, power: 0.2 }, // Bottom-right
        { x: 50, y: height - 50, power: 0.2 }, // Bottom-left
      ];

      // Find closest recharge point
      let maxRecovery = 0;

      for (const point of rechargePoints) {
        const dx = point.x - agent.x;
        const dy = point.y - agent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 150) * point.power;

        if (influence > 0) {
          maxRecovery = Math.max(maxRecovery, influence);
        }
      }

      // Apply recovery
      if (maxRecovery > 0) {
        const recovery = maxRecovery * 0.5;
        agent.energy = Math.min(100, agent.energy + recovery);
        return recovery;
      }

      // Passive recovery
      const passive = 0.01;
      agent.energy = Math.min(100, agent.energy + passive);
      return passive;
    };

    // Agent update function
    const updateAgent = (deltaTime: number = 16) => {
      const agent = agentRef.current;
      const target = targetRef.current;
      const { width, height } = dimensionsRef.current;

      // Calculate distance to target
      const dx = target.x - agent.x;
      const dy = target.y - agent.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Recover energy
      recoverEnergy();

      // Handle different agent states
      switch (agent.state) {
        case "follow":
          // Follow with gentler, smoother precision based on intelligence
          const precision = 0.003 + (agent.intelligence / 100) * 0.007; // Reduced precision for smoother motion
          // Apply gentle easing for more natural, flowing movement
          agent.vx += dx * precision * (1 - Math.exp(-dist / 500));
          agent.vy += dy * precision * (1 - Math.exp(-dist / 500));

          // Energy cost
          agent.energy -= 0.03;

          // Reset emotion state to neutral when following
          agent.emotionState = "neutral";

          // Autonomous decisions when close to target
          if (dist < 30) {
            const nextState = decideNextState();
            agent.state = nextState;

            // Set timer based on state
            switch (nextState) {
              case "wander":
                agent.timer = 120 + Math.floor(Math.random() * 200);
                break;
              case "analyze":
                agent.timer = 180 + Math.floor(Math.random() * 100);
                break;
              case "patrol":
                agent.timer = 240 + Math.floor(Math.random() * 150);
                break;
              case "interact":
                agent.timer = 80 + Math.floor(Math.random() * 60);
                break;
              case "glitch":
                agent.timer = 40 + Math.floor(Math.random() * 30);
                break;
              case "burst":
                agent.timer = 60 + Math.floor(Math.random() * 40);
                break;
            }

            // Select scenario based on state
            const scenarioIndex =
              nextState === "wander"
                ? 0
                : nextState === "analyze"
                  ? 2
                  : nextState === "patrol"
                    ? 3
                    : nextState === "interact"
                      ? 4
                      : nextState === "glitch"
                        ? 5
                        : nextState === "burst"
                          ? 6
                          : 1;

            agent.scenario = scenariosRef.current[scenarioIndex];
          }
          break;

        case "wander":
        case "analyze":
        case "patrol":
        case "interact":
          // Execute current scenario
          if (agent.scenario) agent.scenario(agent, target, deltaTime);

          // Decrease timer
          agent.timer--;

          // Check timer expiration or energy
          if (agent.timer <= 0 || agent.energy < 10) {
            agent.state = "follow";
          }

          // Random state transitions based on autonomy
          if (agent.autonomy > 60 && Math.random() < 0.002) {
            const nextState = decideNextState();
            if (nextState !== agent.state) {
              agent.state = nextState;
              agent.timer = 100 + Math.floor(Math.random() * 150);
            }
          }
          break;

        case "glitch":
        case "burst":
          // Execute special scenarios
          if (agent.scenario) agent.scenario(agent, target, deltaTime);

          // Decrease timer
          agent.timer--;

          // Special states have a shorter duration
          if (agent.timer <= 0 || agent.energy < 15) {
            agent.state = "follow";
            agent.sizeModifier = 1.0;
            // Clear any particles when exiting special states
            agent.burstParticles = [];
            agent.emotionState = "neutral";
          }
          break;
      }

      // Apply gentler friction for smoother, more flowing movement
      agent.vx *= 0.9; // Less friction (0.9 instead of 0.8)
      agent.vy *= 0.9;

      // Add subtle natural movement to prevent complete stopping
      if (Math.abs(agent.vx) + Math.abs(agent.vy) < 0.1) {
        const time = Date.now() / 2000;
        agent.vx += Math.sin(time) * 0.01;
        agent.vy += Math.cos(time * 0.7) * 0.01;
      }

      // Update position
      agent.x += agent.vx;
      agent.y += agent.vy;

      // Boundary checks
      if (agent.x < 0) agent.x = 0;
      if (agent.x > width) agent.x = width;
      if (agent.y < 0) agent.y = 0;
      if (agent.y > height) agent.y = height;

      // Add to trail
      trailRef.current.push({
        x: agent.x,
        y: agent.y,
        drawing: isDrawingMessageRef.current,
      });

      if (trailRef.current.length > trailLength) {
        trailRef.current.shift();
      }

      // Critical energy handling
      if (agent.energy <= 0) {
        agent.energy = 30;
        agent.state = "follow";
        agent.memory.push("Emergency energy recovery activated");
        if (agent.memory.length > 10) agent.memory.shift();
      }
    };

    // Update ASCII character set with calming transitions
    const updateAsciiSet = () => {
      const asciiSetBase = asciiSetBaseRef.current;
      const time = Date.now() / 5000; // Much slower cycling for gentler transitions

      // Use a time-based approach for more flowing, less jarring character transitions
      asciiSetRef.current = asciiSetBase.map((char, index) => {
        // Reduce randomness significantly (0.98 instead of 0.92)
        // This makes character changes much rarer and less distracting
        if (Math.random() > 0.98) {
          // Use a more limited set of visually calming characters
          const calmChars = [".", "·", "⋅", "○", "°", "⁕", "~"];
          return calmChars[
            Math.floor((Math.sin(time + index) * 0.5 + 0.5) * calmChars.length)
          ];
        }
        return char;
      });
    };

    // Main rendering function with GPU optimizations
    const drawFrame = (timestamp: number) => {
      const canvas = canvasRef.current;
      const offscreenCanvas = offscreenCanvasRef.current;
      if (!canvas || !offscreenCanvas) return;

      // Calculate delta time for smoother animations
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const deltaTime = timestamp - previousTimeRef.current;
      previousTimeRef.current = timestamp;

      // Skip if delta is too large (tab was inactive)
      if (deltaTime > 100) {
        requestRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Update agent and ASCII set
      updateAgent(deltaTime);
      updateAsciiSet();

      const { width, height } = dimensionsRef.current;
      const gridSize = gridSizeRef.current;
      const ctx = canvas.getContext("2d");
      const offscreenCtx = offscreenCanvas.getContext("2d");

      if (!ctx || !offscreenCtx) return;

      // Theme-aware background
      const isDarkMode = document.documentElement.classList.contains("dark");
      const bgColor = isDarkMode
        ? "rgba(13, 13, 13, 0.05)"
        : "rgba(248, 248, 248, 0.05)";

      // Clear offscreen canvas first
      offscreenCtx.clearRect(0, 0, width, height);
      offscreenCtx.fillStyle = bgColor;
      offscreenCtx.fillRect(0, 0, width, height);
      offscreenCtx.font = `${gridSize}px monospace`;
      offscreenCtx.textBaseline = "top";

      // Draw with batching for better performance
      const trail = trailRef.current;

      // Batch calculation of characters to render
      const charactersToRender: {
        x: number;
        y: number;
        char: string;
        color: string;
      }[] = [];

      for (let i = 0; i < trail.length; i++) {
        const pos = trail[i];
        // Apply MUCH slower fade rate for longer visibility
        // Use a square root function for a gentler transition
        const rawFade = i / trail.length;
        const fade = pos.drawing
          ? Math.pow(rawFade, 0.4)
          : Math.pow(rawFade, 0.5); // Dramatically slower fade (0.4/0.5 instead of 1.5/1.0)

        // Increase radius for wider visibility
        const radius = pos.drawing ? 120 * (1 - fade) : 100 * (1 - fade); // Increased from 90/80 to 120/100

        // Enhanced strength calculation for more persistent visibility
        const strength = Math.pow(1 - fade, 0.7); // More gradual drop-off in opacity

        // Theme-aware ghost character colors with MUCH higher opacity for better visibility
        const drawingColor = isDarkMode
          ? `rgba(200, 200, 200, ${0.4 * strength})` // Significantly increased opacity
          : `rgba(50, 50, 50, ${0.4 * strength})`;

        const trailColor = isDarkMode
          ? `rgba(180, 180, 180, ${0.35 * strength})` // Much more visible trails
          : `rgba(70, 70, 70, ${0.35 * strength})`;

        // More prominent calming tints for visibility
        const calmingTint = isDarkMode
          ? `rgba(200, 200, 200, ${0.22 * strength})` // Soft gray, monochrome
          : `rgba(180, 180, 180, ${0.22 * strength})`; // Soft gray for light mode, monochrome

        // VERY slow, gentle transition between colors - almost imperceptible shifting
        // Use time-based approach to create extremely gentle color blending
        const time = Date.now() / 15000; // Much slower time progression (15s cycle instead of 5s)

        // Smooth sine-based blend between colors rather than binary switching
        // This creates a soft, gradual fade between the colors with no jarring changes
        const blendFactor = (Math.sin(time + i * 0.01) * 0.5 + 0.5) * 0.8; // Very slow oscillation

        // Blend colors together based on the blend factor
        const baseColor = pos.drawing ? drawingColor : trailColor;

        // Parse colors to get RGBA components
        const parseColor = (rgba: string) => {
          const match = rgba.match(
            /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/,
          );
          if (!match) return { r: 0, g: 0, b: 0, a: 0 };
          return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
            a: parseFloat(match[4]),
          };
        };

        // Extract color components
        const base = parseColor(baseColor);
        const calming = parseColor(calmingTint);

        // Create smoothly blended color
        const color = `rgba(
          ${Math.round(base.r * (1 - blendFactor) + calming.r * blendFactor)},
          ${Math.round(base.g * (1 - blendFactor) + calming.g * blendFactor)},
          ${Math.round(base.b * (1 - blendFactor) + calming.b * blendFactor)},
          ${base.a * (1 - blendFactor) + calming.a * blendFactor}
        )`;

        // Use a more efficient grid sampling approach
        // Sample a smaller grid for better performance
        const gridStep = Math.max(1, Math.floor(gridSize * 0.8));

        // Limit the number of points to check based on radius
        const radiusGrids = Math.ceil(radius / gridStep);
        const centerX = Math.floor(pos.x / gridStep) * gridStep;
        const centerY = Math.floor(pos.y / gridStep) * gridStep;

        for (let yOffset = -radiusGrids; yOffset <= radiusGrids; yOffset++) {
          for (let xOffset = -radiusGrids; xOffset <= radiusGrids; xOffset++) {
            const x = centerX + xOffset * gridStep;
            const y = centerY + yOffset * gridStep;

            // Skip if outside canvas
            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const dx = x - pos.x;
            const dy = y - pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius && dist > 20) {
              const influence = (1 - dist / radius) * strength;

              // Increased density for better visibility (0.7 instead of 0.3)
              // This makes the animation much more visible
              if (Math.random() < influence * 0.7) {
                const index = Math.floor(
                  Math.random() * asciiSetRef.current.length * influence,
                );

                // Use more spaces to calm down the appearance
                // but still have plenty of visible characters
                const char =
                  Math.random() < 0.4
                    ? asciiSetRef.current[index] || "."
                    : Math.random() < 0.7
                      ? "."
                      : " ";

                charactersToRender.push({ x, y, char, color });
              }
            }
          }
        }
      }

      // Batch draw all characters with same color
      let currentColor = "";

      for (const item of charactersToRender) {
        if (item.color !== currentColor) {
          currentColor = item.color;
          offscreenCtx.fillStyle = currentColor;
        }
        offscreenCtx.fillText(item.char, item.x, item.y);
      }

      // Copy from offscreen to main canvas (single operation)
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreenCanvas, 0, 0);

      // Continue animation loop
      requestRef.current = requestAnimationFrame(drawFrame);
    };

    // Window event handlers
    const handleResize = () => {
      updateDimensions();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      const agent = agentRef.current;
      agent.state = "follow";
      agent.timer = 0;
    };

    // Keyboard handler for testing calming states
    const handleKeyDown = (e: KeyboardEvent) => {
      const agent = agentRef.current;

      // Keyboard shortcuts for testing calming behaviors
      if (e.key === "f" && e.altKey) {
        // Alt+F triggers flow state (previously glitch)
        agent.state = "glitch";
        agent.timer = 120; // Longer duration for calming effect
        agent.emotionState = "analytical";
        agent.scenario = scenariosRef.current[5]; // flow behavior
      } else if (e.key === "b" && e.altKey) {
        // Alt+B triggers bloom state (previously burst)
        agent.state = "burst";
        agent.timer = 150; // Longer duration for calming effect
        agent.emotionState = "resting";
        agent.scenario = scenariosRef.current[6]; // bloom behavior
      }
    };

    // Set up event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    // Initialize
    updateDimensions();
    initScenarios();

    // Start animation loop
    requestRef.current = requestAnimationFrame(drawFrame);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [theme, fontMap, hiddenMessages, interestMessages]); // Only re-run if these dependencies change

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen -z-10 bg-background"
      style={{
        willChange: "transform", // Hint to browser for GPU acceleration
        transform: "translateZ(0)", // Force GPU rendering
      }}
    />
  );
};

export default GhostInTheBrowser;
