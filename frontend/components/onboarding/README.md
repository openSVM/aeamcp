# Dynamic Onboarding System

A comprehensive interactive onboarding system for the Solana AI Registries platform, featuring step-by-step guided tours with hotspots and tooltips.

## Features

- **Multi-Path Onboarding**: Three distinct paths for developers, end users, and AI service providers
- **Interactive Hotspots**: Visual highlights with click, hover, and auto-progression actions
- **Smart Tooltips**: Contextual information with adaptive positioning
- **Progress Tracking**: Real-time progress with pause/resume functionality
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Accessibility**: Screen reader support and keyboard navigation
- **Persistent State**: Progress saved across browser sessions

## Components

### Core Components

- **`OnboardingProvider`**: React context provider for global state management
- **`OnboardingManager`**: Main orchestrator component that handles tour lifecycle
- **`TourEngine`**: Core engine that manages tour progression and interactions
- **`UserTypeSelector`**: Modal for selecting user type and starting appropriate tour
- **`Hotspot`**: Interactive overlay component that highlights target elements
- **`Tooltip`**: Information display component with rich content support
- **`ProgressTracker`**: Progress indicator with time tracking and controls

### Configuration

- **`tourConfigs.ts`**: Tour definitions and step configurations
- **`types.ts`**: TypeScript interfaces and type definitions

## Usage

### Basic Setup

The onboarding system is automatically integrated into the main layout:

```tsx
import { OnboardingProvider, OnboardingManager } from '@/components/onboarding';

function App() {
  return (
    <OnboardingProvider>
      <YourApp />
      <OnboardingManager autoStart={true} showOnFirstVisit={true} />
    </OnboardingProvider>
  );
}
```

### Manual Trigger

You can manually start the onboarding from any component:

```tsx
import { useOnboardingTrigger } from '@/components/onboarding';

function MyComponent() {
  const { startOnboarding } = useOnboardingTrigger();
  
  return (
    <button onClick={startOnboarding}>
      Start Tutorial
    </button>
  );
}
```

### Custom Tour Configuration

Create custom tours by adding to `tourConfigs.ts`:

```tsx
export const customTourConfig: TourConfig = {
  id: 'custom-tour',
  userType: 'developer',
  title: 'Custom Tour',
  description: 'A custom onboarding experience',
  estimatedDuration: 300, // 5 minutes
  steps: [
    {
      id: 'step1',
      title: 'Welcome',
      content: 'Welcome to our platform!',
      target: '.hero-section',
      position: 'center',
      action: 'click',
      nextCondition: 'manual',
    },
    // ... more steps
  ],
};
```

## Tour Step Configuration

Each tour step supports the following properties:

```tsx
interface TourStep {
  id: string;                    // Unique step identifier
  title: string;                 // Step title
  content: string | ReactNode;   // Step content (HTML or React component)
  target: string;                // CSS selector for target element
  position: TooltipPosition;     // Tooltip position relative to target
  action: InteractionType;       // How user progresses ('click', 'hover', 'auto')
  nextCondition: NextCondition;  // When to advance ('manual', 'auto', 'validation')
  duration?: number;             // Duration in seconds for auto steps
  validation?: () => boolean;    // Custom validation function
  expandableSections?: object;   // Additional expandable content
}
```

## Styling

The onboarding system uses CSS classes that match the ASCII theme:

- `.onboarding-overlay` - Main overlay styles
- `.onboarding-hotspot` - Hotspot highlight styles
- `.onboarding-tooltip` - Tooltip container styles
- `.onboarding-progress-tracker` - Progress indicator styles

Custom styles can be added to `onboarding.css`.

## Analytics

The system tracks user interactions for analytics:

```tsx
// Tracked events
- tour_started
- step_completed
- step_skipped
- tour_completed
- tour_abandoned
- hotspot_clicked
- user_type_selected
```

Access analytics data through the onboarding context:

```tsx
const { state } = useOnboarding();
console.log(state.analytics);
```

## Accessibility

The onboarding system includes:

- **Keyboard Navigation**: Tab through interactive elements
- **Screen Reader Support**: ARIA labels and descriptions
- **High Contrast Mode**: Enhanced visibility for accessibility
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Proper focus handling during tours

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- **Lazy Loading**: Tour configurations loaded on demand
- **Efficient Rendering**: Only active components rendered
- **Memory Management**: Cleanup on component unmount
- **Optimized Animations**: CSS-based animations for smooth performance

## Troubleshooting

### Common Issues

1. **Target Element Not Found**
   - Ensure the CSS selector in `target` matches an existing element
   - Check if the element is rendered when the tour starts

2. **Tooltip Positioning Issues**
   - The system automatically adjusts position if tooltip goes off-screen
   - Use `position: 'center'` for complex layouts

3. **Tour Not Starting**
   - Verify `OnboardingProvider` wraps your app
   - Check browser console for errors
   - Ensure `autoStart` is enabled if expecting automatic start

### Debug Mode

Enable debug logging by setting localStorage:

```javascript
localStorage.setItem('onboarding-debug', 'true');
```

## Contributing

When adding new tour steps:

1. Add step configuration to appropriate tour in `tourConfigs.ts`
2. Ensure target elements have stable CSS selectors
3. Test across different screen sizes
4. Verify accessibility with screen readers
5. Update this documentation

## Future Enhancements

- **Internationalization**: Multi-language support (framework ready)
- **Advanced Analytics**: Heatmaps and user behavior tracking
- **A/B Testing**: Built-in experimentation framework
- **Voice Guidance**: Audio narration for steps
- **Video Integration**: Embedded video tutorials