# Onboarding Internationalization (i18n) Specifications
## Multi-language Support for Dynamic Onboarding System

### Overview

This document provides comprehensive internationalization specifications for the dynamic onboarding system, including translation keys, locale management, and cultural adaptations for global accessibility.

## 🌍 Supported Languages (Phase 1)

### Primary Languages
- **English (en)** - Default/fallback language
- **Spanish (es)** - Large developer community in Latin America
- **Chinese Simplified (zh-CN)** - Major Asian market
- **Japanese (ja)** - Strong crypto/blockchain adoption
- **Korean (ko)** - Active DeFi community
- **French (fr)** - European market
- **German (de)** - European market
- **Portuguese (pt-BR)** - Brazilian market
- **Russian (ru)** - Eastern European market
- **Hindi (hi)** - Indian market

### Phase 2 Expansion
- Arabic (ar), Italian (it), Dutch (nl), Turkish (tr), Vietnamese (vi)

## 🏗️ Technical Implementation

### i18n Framework Setup
```typescript
// i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    namespaces: ['onboarding', 'common', 'errors'],
    defaultNS: 'onboarding',
  });

export default i18n;
```

### Translation Key Structure
```typescript
// Translation namespace structure
interface OnboardingTranslations {
  common: {
    buttons: {
      continue: string;
      skip: string;
      back: string;
      finish: string;
      getStarted: string;
      learnMore: string;
    };
    navigation: {
      step: string;
      of: string;
      progress: string;
      timeRemaining: string;
    };
  };
  userTypes: {
    developer: {
      title: string;
      description: string;
      benefits: string[];
    };
    endUser: {
      title: string;
      description: string;
      benefits: string[];
    };
    provider: {
      title: string;
      description: string;
      benefits: string[];
    };
  };
  steps: {
    [stepId: string]: {
      title: string;
      content: string;
      callToAction?: string;
      expandableSections?: {
        [sectionId: string]: {
          title: string;
          content: string;
        };
      };
    };
  };
}
```

## 📝 Translation Keys for Developer Path

### English (en) - Base Translations
```json
{
  "onboarding": {
    "common": {
      "buttons": {
        "continue": "Continue",
        "skip": "Skip",
        "back": "Back",
        "finish": "Finish Tour",
        "getStarted": "Get Started",
        "learnMore": "Learn More",
        "watchDemo": "Watch Demo",
        "viewDocs": "View Documentation",
        "tryDemo": "Try Demo",
        "connectWallet": "Connect Wallet",
        "downloadChecklist": "Download Checklist"
      },
      "navigation": {
        "step": "Step",
        "of": "of",
        "progress": "Progress",
        "timeRemaining": "Time remaining",
        "estimatedTime": "Estimated time"
      },
      "status": {
        "loading": "Loading...",
        "error": "Error occurred",
        "success": "Success!",
        "connecting": "Connecting...",
        "connected": "Connected"
      }
    },
    "userTypeSelection": {
      "title": "Welcome to Solana AI Registries",
      "subtitle": "Choose your path to get started",
      "developer": {
        "title": "Developer",
        "description": "Integrate AI agents and MCP servers into your applications",
        "benefits": [
          "SDK integration guides",
          "Technical documentation",
          "Code examples and tutorials",
          "API reference and best practices"
        ]
      },
      "endUser": {
        "title": "End User",
        "description": "Discover and use AI agents and services",
        "benefits": [
          "Service discovery tutorials",
          "Wallet setup guidance",
          "Platform navigation help",
          "Token usage explanations"
        ]
      },
      "provider": {
        "title": "AI Service Provider",
        "description": "Register and monetize your AI services",
        "benefits": [
          "Registration process guide",
          "Monetization strategies",
          "Marketing best practices",
          "Analytics and optimization"
        ]
      }
    },
    "developer": {
      "welcome": {
        "title": "🚀 Welcome, Developer!",
        "subtitle": "Revolutionize your AI integration workflow",
        "description": "You're about to discover how Solana AI Registries can revolutionize your AI integration workflow.",
        "learningPoints": {
          "title": "What you'll learn:",
          "points": [
            "How to find and integrate verified AI agents",
            "Connecting to MCP servers for tools and resources",
            "Using $SVMAI tokens for payments and governance",
            "Best practices for production deployment"
          ]
        },
        "callToAction": "Ready to build the future of AI applications?",
        "testimonial": {
          "quote": "Reduced our AI integration time from weeks to hours",
          "author": "Sarah Chen, Lead Developer at DeFi Labs"
        }
      },
      "agentRegistry": {
        "title": "🤖 Agent Registry: Your AI Marketplace",
        "subtitle": "Think of this as \"npm for AI agents\"",
        "description": "A decentralized registry where you can:",
        "capabilities": [
          {
            "icon": "🔍",
            "title": "Smart Discovery",
            "description": "Find agents by skills, performance, and compatibility"
          },
          {
            "icon": "🔐",
            "title": "Blockchain Verification",
            "description": "Cryptographic proof of agent authenticity"
          },
          {
            "icon": "📡",
            "title": "Standardized APIs",
            "description": "A2A protocol compliance for seamless integration"
          },
          {
            "icon": "📊",
            "title": "Real-time Monitoring",
            "description": "Live status, performance metrics, and SLA tracking"
          }
        ],
        "example": {
          "title": "Real-World Example:",
          "description": "Your DeFi application needs market analysis? Here's how it works:",
          "steps": [
            "**Search**: `registry.agents.findBySkill('market-analysis')`",
            "**Verify**: Check blockchain signatures and performance history",
            "**Integrate**: Use standardized endpoints with guaranteed schemas",
            "**Monitor**: Track usage, costs, and performance in real-time"
          ]
        },
        "expandableSections": {
          "advancedSearch": {
            "title": "🔍 Advanced Search Filters",
            "content": "Learn about complex query examples and filtering options"
          },
          "performanceMetrics": {
            "title": "📊 Performance Metrics Explained",
            "content": "Detailed explanation of SLA tracking and monitoring"
          },
          "security": {
            "title": "🔐 Security & Verification",
            "content": "How cryptographic verification ensures agent authenticity"
          }
        }
      },
      "mcpRegistry": {
        "title": "🔧 MCP Server Registry: Your AI Toolbox",
        "subtitle": "Model Context Protocol (MCP) servers provide the building blocks",
        "resourceTypes": {
          "title": "Three Types of Resources:",
          "tools": {
            "title": "🛠️ Tools (Functions your AI can call)",
            "items": [
              "**APIs**: External service integrations",
              "**Calculations**: Mathematical and statistical functions",
              "**Data Processing**: Transform, validate, and analyze data"
            ]
          },
          "resources": {
            "title": "📊 Resources (Structured data sources)",
            "items": [
              "**Databases**: SQL, NoSQL, vector databases",
              "**Files**: Documents, images, structured data",
              "**Real-time Feeds**: Market data, news, social media"
            ]
          },
          "prompts": {
            "title": "💬 Prompts (Pre-built templates)",
            "items": [
              "**Domain-specific**: Finance, healthcare, legal",
              "**Task-oriented**: Analysis, generation, classification",
              "**Multi-modal**: Text, image, audio processing"
            ]
          }
        },
        "integrationExample": {
          "title": "Real Integration Example:",
          "description": "Building a financial chatbot? Find MCP servers offering:",
          "visualization": "Interactive flow diagram showing AI app → MCP Server → External APIs"
        }
      },
      "tokenIntegration": {
        "title": "💰 $SVMAI: More Than Just Payment",
        "subtitle": "Unlock the full potential of the ecosystem",
        "benefits": {
          "title": "Developer Benefits:",
          "governance": {
            "title": "🗳️ Governance Participation",
            "items": [
              "Vote on protocol upgrades and new features",
              "Propose improvements to developer tools",
              "Influence roadmap priorities"
            ]
          },
          "staking": {
            "title": "💎 Staking Rewards",
            "items": [
              "Earn passive income while securing the network",
              "Higher rewards for long-term commitments",
              "Compound earnings through auto-restaking"
            ]
          },
          "premiumAccess": {
            "title": "🔐 Premium Access",
            "items": [
              "Priority access to high-performance agents",
              "Advanced debugging and monitoring tools",
              "Dedicated developer support channels"
            ]
          },
          "gasOptimization": {
            "title": "⚡ Gas Optimization",
            "items": [
              "Reduced transaction costs for frequent users",
              "Batch operations for cost efficiency",
              "Priority transaction processing"
            ]
          }
        },
        "integrationBenefits": {
          "title": "Integration Benefits:",
          "items": [
            "Built-in payment rails for AI services",
            "Reputation system for quality assurance",
            "Community-driven feature development"
          ]
        },
        "tierSystem": {
          "title": "Developer Tier System:",
          "tiers": [
            {
              "name": "Starter",
              "range": "0-100 $SVMAI",
              "features": ["Basic APIs", "Community Support"]
            },
            {
              "name": "Builder",
              "range": "100-1K $SVMAI",
              "features": ["Premium Support", "Analytics"]
            },
            {
              "name": "Pro",
              "range": "1K-10K $SVMAI",
              "features": ["Priority Support", "Advanced Analytics"]
            },
            {
              "name": "Enterprise",
              "range": "10K+ $SVMAI",
              "features": ["Custom Solutions", "Dedicated Support"]
            }
          ]
        }
      },
      "sdkIntegration": {
        "title": "📚 SDK Integration Made Simple",
        "subtitle": "Everything you need for seamless integration",
        "installation": {
          "title": "Installation & Setup:",
          "commands": [
            "npm install @solana-ai/registries-sdk",
            "# or",
            "yarn add @solana-ai/registries-sdk"
          ]
        },
        "quickStart": {
          "title": "Quick Start Guide:",
          "steps": [
            {
              "title": "1. Import and initialize",
              "code": "import { SolanaAIRegistries, WalletAdapter } from '@solana-ai/registries-sdk';"
            },
            {
              "title": "2. Discover agents",
              "code": "const agents = await registry.agents.search({ skills: ['trading'] });"
            },
            {
              "title": "3. Connect to an agent",
              "code": "const tradingAgent = await registry.agents.connect(agents[0].id);"
            },
            {
              "title": "4. Make requests",
              "code": "const analysis = await tradingAgent.analyze({ symbol: 'SOL' });"
            }
          ]
        },
        "frameworkExamples": {
          "title": "Framework-Specific Examples:",
          "react": {
            "title": "React Hook Example",
            "description": "Using our React integration for seamless development"
          }
        }
      }
    }
  }
}
```

### Spanish (es) Translations
```json
{
  "onboarding": {
    "common": {
      "buttons": {
        "continue": "Continuar",
        "skip": "Omitir",
        "back": "Atrás",
        "finish": "Finalizar Tour",
        "getStarted": "Comenzar",
        "learnMore": "Aprender Más",
        "watchDemo": "Ver Demo",
        "viewDocs": "Ver Documentación",
        "tryDemo": "Probar Demo",
        "connectWallet": "Conectar Billetera",
        "downloadChecklist": "Descargar Lista"
      },
      "navigation": {
        "step": "Paso",
        "of": "de",
        "progress": "Progreso",
        "timeRemaining": "Tiempo restante",
        "estimatedTime": "Tiempo estimado"
      }
    },
    "userTypeSelection": {
      "title": "Bienvenido a Solana AI Registries",
      "subtitle": "Elige tu camino para comenzar",
      "developer": {
        "title": "Desarrollador",
        "description": "Integra agentes de IA y servidores MCP en tus aplicaciones",
        "benefits": [
          "Guías de integración SDK",
          "Documentación técnica",
          "Ejemplos de código y tutoriales",
          "Referencia API y mejores prácticas"
        ]
      },
      "endUser": {
        "title": "Usuario Final",
        "description": "Descubre y usa agentes y servicios de IA",
        "benefits": [
          "Tutoriales de descubrimiento de servicios",
          "Guía de configuración de billetera",
          "Ayuda de navegación de plataforma",
          "Explicaciones de uso de tokens"
        ]
      },
      "provider": {
        "title": "Proveedor de Servicios IA",
        "description": "Registra y monetiza tus servicios de IA",
        "benefits": [
          "Guía del proceso de registro",
          "Estrategias de monetización",
          "Mejores prácticas de marketing",
          "Análisis y optimización"
        ]
      }
    },
    "developer": {
      "welcome": {
        "title": "🚀 ¡Bienvenido, Desarrollador!",
        "subtitle": "Revoluciona tu flujo de trabajo de integración de IA",
        "description": "Estás a punto de descubrir cómo Solana AI Registries puede revolucionar tu flujo de trabajo de integración de IA.",
        "learningPoints": {
          "title": "Lo que aprenderás:",
          "points": [
            "Cómo encontrar e integrar agentes de IA verificados",
            "Conectar a servidores MCP para herramientas y recursos",
            "Usar tokens $SVMAI para pagos y gobernanza",
            "Mejores prácticas para despliegue en producción"
          ]
        },
        "callToAction": "¿Listo para construir el futuro de las aplicaciones de IA?",
        "testimonial": {
          "quote": "Redujimos nuestro tiempo de integración de IA de semanas a horas",
          "author": "Sarah Chen, Desarrolladora Principal en DeFi Labs"
        }
      },
      "agentRegistry": {
        "title": "🤖 Registro de Agentes: Tu Mercado de IA",
        "subtitle": "Piensa en esto como \"npm para agentes de IA\"",
        "description": "Un registro descentralizado donde puedes:",
        "capabilities": [
          {
            "icon": "🔍",
            "title": "Descubrimiento Inteligente",
            "description": "Encuentra agentes por habilidades, rendimiento y compatibilidad"
          },
          {
            "icon": "🔐",
            "title": "Verificación Blockchain",
            "description": "Prueba criptográfica de autenticidad del agente"
          },
          {
            "icon": "📡",
            "title": "APIs Estandarizadas",
            "description": "Cumplimiento del protocolo A2A para integración perfecta"
          },
          {
            "icon": "📊",
            "title": "Monitoreo en Tiempo Real",
            "description": "Estado en vivo, métricas de rendimiento y seguimiento SLA"
          }
        ]
      }
    }
  }
}
```

### Chinese Simplified (zh-CN) Translations
```json
{
  "onboarding": {
    "common": {
      "buttons": {
        "continue": "继续",
        "skip": "跳过",
        "back": "返回",
        "finish": "完成导览",
        "getStarted": "开始",
        "learnMore": "了解更多",
        "watchDemo": "观看演示",
        "viewDocs": "查看文档",
        "tryDemo": "试用演示",
        "connectWallet": "连接钱包",
        "downloadChecklist": "下载清单"
      },
      "navigation": {
        "step": "步骤",
        "of": "共",
        "progress": "进度",
        "timeRemaining": "剩余时间",
        "estimatedTime": "预计时间"
      }
    },
    "userTypeSelection": {
      "title": "欢迎来到 Solana AI 注册中心",
      "subtitle": "选择您的路径开始",
      "developer": {
        "title": "开发者",
        "description": "将AI代理和MCP服务器集成到您的应用程序中",
        "benefits": [
          "SDK集成指南",
          "技术文档",
          "代码示例和教程",
          "API参考和最佳实践"
        ]
      },
      "endUser": {
        "title": "终端用户",
        "description": "发现和使用AI代理和服务",
        "benefits": [
          "服务发现教程",
          "钱包设置指导",
          "平台导航帮助",
          "代币使用说明"
        ]
      },
      "provider": {
        "title": "AI服务提供商",
        "description": "注册并货币化您的AI服务",
        "benefits": [
          "注册流程指南",
          "货币化策略",
          "营销最佳实践",
          "分析和优化"
        ]
      }
    },
    "developer": {
      "welcome": {
        "title": "🚀 欢迎，开发者！",
        "subtitle": "革新您的AI集成工作流程",
        "description": "您即将发现Solana AI注册中心如何革新您的AI集成工作流程。",
        "learningPoints": {
          "title": "您将学到：",
          "points": [
            "如何找到并集成经过验证的AI代理",
            "连接到MCP服务器获取工具和资源",
            "使用$SVMAI代币进行支付和治理",
            "生产部署的最佳实践"
          ]
        },
        "callToAction": "准备好构建AI应用程序的未来了吗？",
        "testimonial": {
          "quote": "将我们的AI集成时间从几周缩短到几小时",
          "author": "Sarah Chen，DeFi Labs首席开发者"
        }
      }
    }
  }
}
```

### Japanese (ja) Translations
```json
{
  "onboarding": {
    "common": {
      "buttons": {
        "continue": "続行",
        "skip": "スキップ",
        "back": "戻る",
        "finish": "ツアー完了",
        "getStarted": "始める",
        "learnMore": "詳細を見る",
        "watchDemo": "デモを見る",
        "viewDocs": "ドキュメントを見る",
        "tryDemo": "デモを試す",
        "connectWallet": "ウォレット接続",
        "downloadChecklist": "チェックリストダウンロード"
      },
      "navigation": {
        "step": "ステップ",
        "of": "/",
        "progress": "進行状況",
        "timeRemaining": "残り時間",
        "estimatedTime": "予想時間"
      }
    },
    "userTypeSelection": {
      "title": "Solana AI レジストリへようこそ",
      "subtitle": "開始するパスを選択してください",
      "developer": {
        "title": "開発者",
        "description": "AIエージェントとMCPサーバーをアプリケーションに統合",
        "benefits": [
          "SDK統合ガイド",
          "技術文書",
          "コード例とチュートリアル",
          "APIリファレンスとベストプラクティス"
        ]
      },
      "endUser": {
        "title": "エンドユーザー",
        "description": "AIエージェントとサービスを発見・使用",
        "benefits": [
          "サービス発見チュートリアル",
          "ウォレット設定ガイダンス",
          "プラットフォームナビゲーションヘルプ",
          "トークン使用説明"
        ]
      },
      "provider": {
        "title": "AIサービスプロバイダー",
        "description": "AIサービスを登録・収益化",
        "benefits": [
          "登録プロセスガイド",
          "収益化戦略",
          "マーケティングベストプラクティス",
          "分析と最適化"
        ]
      }
    },
    "developer": {
      "welcome": {
        "title": "🚀 ようこそ、開発者の皆様！",
        "subtitle": "AI統合ワークフローを革新",
        "description": "Solana AI レジストリがAI統合ワークフローをどのように革新するかを発見しようとしています。",
        "learningPoints": {
          "title": "学習内容：",
          "points": [
            "検証済みAIエージェントの発見と統合方法",
            "ツールとリソースのためのMCPサーバーへの接続",
            "支払いとガバナンスのための$SVMAIトークンの使用",
            "本番デプロイメントのベストプラクティス"
          ]
        },
        "callToAction": "AIアプリケーションの未来を構築する準備はできていますか？",
        "testimonial": {
          "quote": "AI統合時間を数週間から数時間に短縮しました",
          "author": "Sarah Chen、DeFi Labs リード開発者"
        }
      }
    }
  }
}
```

## 🎨 Cultural Adaptations

### Right-to-Left (RTL) Language Support
```css
/* RTL language adaptations for Arabic */
[dir="rtl"] .onboarding-tooltip {
  text-align: right;
  direction: rtl;
}

[dir="rtl"] .onboarding-progress {
  direction: rtl;
}

[dir="rtl"] .onboarding-navigation {
  flex-direction: row-reverse;
}
```

### Cultural Considerations by Region

#### Asian Markets (zh-CN, ja, ko)
- **Color Preferences**: Red for prosperity (Chinese), avoid pure white backgrounds
- **Number Formatting**: Use appropriate thousand separators (Chinese: 万, Japanese: 万)
- **Currency Display**: Show local currency equivalents alongside $SVMAI
- **Cultural References**: Use region-appropriate metaphors and examples

#### European Markets (de, fr, es, it)
- **GDPR Compliance**: Include privacy notices in data collection steps
- **Currency**: Euro equivalents for pricing examples
- **Formal vs Informal**: Adjust tone based on cultural norms (formal German vs casual Spanish)

#### Latin American Markets (es, pt-BR)
- **Regional Variations**: Mexican Spanish vs Argentinian Spanish
- **Economic Context**: Inflation-aware pricing examples
- **Community Focus**: Emphasize community and social aspects

### Number and Currency Formatting
```typescript
// Internationalized number formatting
const formatCurrency = (amount: number, locale: string, currency: string) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount);
};

// Usage examples
formatCurrency(0.05, 'en-US', 'USD'); // $0.05
formatCurrency(0.05, 'ja-JP', 'JPY'); // ¥0.05
formatCurrency(0.05, 'de-DE', 'EUR'); // 0,05 €
```

### Date and Time Formatting
```typescript
// Internationalized date/time formatting
const formatDateTime = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
```

## 🔧 Implementation Guidelines

### Translation Management Workflow
```typescript
// Translation key validation
interface TranslationValidator {
  validateKeys(locale: string, namespace: string): ValidationResult;
  findMissingKeys(baseLocale: string, targetLocale: string): string[];
  validateInterpolations(key: string, value: string): boolean;
}

// Usage in development
const validator = new TranslationValidator();
const missingKeys = validator.findMissingKeys('en', 'es');
console.log('Missing Spanish translations:', missingKeys);
```

### Dynamic Content Loading
```typescript
// Lazy loading of translation files
const loadTranslations = async (locale: string, namespace: string) => {
  try {
    const translations = await import(`/locales/${locale}/${namespace}.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load ${locale}/${namespace}, falling back to English`);
    return import(`/locales/en/${namespace}.json`);
  }
};
```

### Context-Aware Translations
```typescript
// React component with i18n
import { useTranslation } from 'react-i18next';

const OnboardingStep: React.FC<{ stepId: string; userType: string }> = ({ 
  stepId, 
  userType 
}) => {
  const { t, i18n } = useTranslation('onboarding');
  
  const stepKey = `${userType}.${stepId}`;
  const title = t(`${stepKey}.title`);
  const content = t(`${stepKey}.content`);
  
  return (
    <div className="onboarding-step" dir={i18n.dir()}>
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};
```

### Pluralization Support
```json
{
  "agentCount": {
    "zero": "No agents found",
    "one": "{{count}} agent found",
    "other": "{{count}} agents found"
  },
  "agentCount_es": {
    "zero": "No se encontraron agentes",
    "one": "{{count}} agente encontrado",
    "other": "{{count}} agentes encontrados"
  }
}
```

## 📊 Quality Assurance

### Translation Quality Metrics
- **Completeness**: 100% key coverage for all supported languages
- **Consistency**: Terminology consistency across all content
- **Cultural Appropriateness**: Region-specific adaptations
- **Technical Accuracy**: Correct translation of technical terms
- **User Testing**: Native speaker validation for each language

### Automated Testing
```typescript
// Translation completeness test
describe('Translation Completeness', () => {
  const supportedLocales = ['en', 'es', 'zh-CN', 'ja', 'ko', 'fr', 'de', 'pt-BR', 'ru', 'hi'];
  const namespaces = ['onboarding', 'common', 'errors'];
  
  supportedLocales.forEach(locale => {
    namespaces.forEach(namespace => {
      it(`should have complete translations for ${locale}/${namespace}`, async () => {
        const baseKeys = await getTranslationKeys('en', namespace);
        const targetKeys = await getTranslationKeys(locale, namespace);
        
        expect(targetKeys).toEqual(baseKeys);
      });
    });
  });
});
```

This comprehensive i18n specification ensures that the dynamic onboarding system is accessible to users worldwide, with culturally appropriate content and seamless language switching capabilities.