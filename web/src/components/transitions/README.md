# Smart Tourist Safety - Page Transition System

## Overview

This document describes the ultra-smooth 60fps page transition system built with Framer Motion for the Smart Tourist Safety application. The system provides seamless navigation experiences with automatic page type detection and optimized animations.

## Features

- ✨ **60fps Performance**: GPU-accelerated animations with `transform3d` and optimized properties
- 🎯 **Auto Page Type Detection**: Automatically applies appropriate transitions based on route patterns
- 🎬 **Multiple Transition Types**: Slide, fade, scale, and custom variants
- 📱 **Mobile Optimized**: Touch-friendly animations with reduced complexity on smaller devices
- ♿ **Accessibility**: Full support for `prefers-reduced-motion` and WCAG guidelines
- 🔄 **Smart Direction**: Intelligent forward/backward detection based on navigation hierarchy
- 🎨 **Theme Coordinated**: Integrates with the theme system for consistent styling

## Quick Start

The transition system is automatically enabled in the root layout. No additional setup required for basic usage.

```tsx
// All pages automatically get transitions!
export default function MyPage() {
  return <div>Your content here</div>;
}
```

## Page Type Detection

The system automatically detects page types based on URL patterns:

| URL Pattern | Page Type | Transition Style | Features |
|-------------|-----------|------------------|----------|
| `/auth/*`, `/login`, `/register` | `auth` | Fade + Scale | Security-focused, smooth entry |
| `/dashboard/*`, `/admin/*` | `dashboard` | Slide | Data-heavy interfaces |
| `/emergency/*`, `/alert/*`, `/panic/*` | `emergency` | Scale + Glow | Urgent attention, red glow effect |
| All others | `public` | Slide | General navigation |

## Manual Transition Control

```tsx
import { useManualTransition } from '@/components/transitions/page-transition';

function MyComponent() {
  const { triggerTransition } = useManualTransition();
  
  const handleEmergencyNavigation = () => {
    triggerTransition('forward', 'scale');
    router.push('/emergency');
  };
  
  return (
    <button onClick={handleEmergencyNavigation}>
      Emergency Alert
    </button>
  );
}
```

## Custom Page Transitions

### Using PageTransition Component

```tsx
import { PageTransition } from '@/components/transitions/page-transition';

export default function CustomPage() {
  return (
    <PageTransition 
      pageType="emergency"
      transitionType="scale"
      direction="forward"
    >
      <div>Your emergency content</div>
    </PageTransition>
  );
}
```

### Specialized Transition Components

```tsx
import { 
  SlideTransition, 
  FadeTransition, 
  ScaleTransition, 
  EmergencyTransition 
} from '@/components/transitions/page-transition';

// Slide with custom direction
<SlideTransition direction="backward">
  <YourContent />
</SlideTransition>

// Fade for overlays
<FadeTransition>
  <ModalContent />
</FadeTransition>

// Scale for important content
<ScaleTransition>
  <ImportantAlert />
</ScaleTransition>

// Emergency with urgency styling
<EmergencyTransition>
  <CriticalAlert />
</EmergencyTransition>
```

## Layout Transitions

### Navigation Layout

```tsx
import { NavigationLayoutTransition } from '@/components/transitions/layout-transition';

function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <NavigationLayoutTransition
      sidebar={<Sidebar />}
      header={<Header />}
      footer={<Footer />}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
    >
      {children}
    </NavigationLayoutTransition>
  );
}
```

### Dashboard Layout

```tsx
import { DashboardLayoutTransition } from '@/components/transitions/layout-transition';

function Dashboard() {
  const widgets = [
    <MetricsWidget />,
    <ChartWidget />,
    <AlertsWidget />
  ];
  
  return (
    <DashboardLayoutTransition
      widgets={widgets}
      gridColumns={3}
      gridGap={24}
    >
      <MainDashboardContent />
    </DashboardLayoutTransition>
  );
}
```

### Shared Element Transitions

```tsx
import { SharedElementTransition } from '@/components/transitions/layout-transition';

// Same layoutId creates smooth transitions between pages
<SharedElementTransition layoutId="hero-image">
  <img src="/hero.jpg" alt="Hero" />
</SharedElementTransition>
```

## Animation Variants

### Using Pre-built Variants

```tsx
import { motion } from 'framer-motion';
import { childVariants, listItemVariants, containerVariants } from '@/lib/animations';

function MyComponent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.h1 variants={childVariants}>
        Animated Heading
      </motion.h1>
      
      <motion.ul variants={containerVariants}>
        {items.map(item => (
          <motion.li key={item.id} variants={listItemVariants}>
            {item.name}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
```

### Custom Variants

```tsx
import { createCustomVariants } from '@/lib/animations';

const myVariants = createCustomVariants({
  initialY: 50,
  initialOpacity: 0,
  animationDuration: 0.5,
  staggerChildren: 0.1
});
```

## Performance Optimization

### CSS Classes

The system includes optimized CSS classes in `globals.css`:

```css
/* GPU acceleration */
.page-transition-wrapper {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  contain: layout style paint;
}

/* Emergency styling */
.emergency-transition {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  border: 1px solid rgba(239, 68, 68, 0.2);
}
```

### Best Practices

1. **Use transform properties**: Always prefer `transform` over `left/top` for animations
2. **Avoid layout changes**: Use `scale` instead of changing `width/height`
3. **Contain paint**: Use `contain: layout style paint` for complex components
4. **Will-change sparingly**: Only add `will-change` when actively animating

## Hooks and Utilities

### usePageTransition

```tsx
import { usePageTransition } from '@/components/transitions/page-transition';

function MyComponent() {
  const { isAnimating, direction, setDirection } = usePageTransition();
  
  useEffect(() => {
    if (isAnimating) {
      // Handle animation state
    }
  }, [isAnimating]);
}
```

### useTransitionState

```tsx
import { useTransitionState } from '@/components/transitions/page-transition';

function TransitionIndicator() {
  const { isAnimating, direction, transitionType } = useTransitionState();
  
  return (
    <div className="transition-indicator">
      Status: {isAnimating ? 'Animating' : 'Ready'}
      Direction: {direction}
      Type: {transitionType}
    </div>
  );
}
```

### useEmergencyPageDetection

```tsx
import { useEmergencyPageDetection } from '@/components/transitions/page-transition';

function EmergencyBanner() {
  const { isEmergencyPage, shouldUseEmergencyTransition } = useEmergencyPageDetection();
  
  if (!isEmergencyPage) return null;
  
  return <div className="emergency-banner">Emergency Mode Active</div>;
}
```

## Accessibility

### Reduced Motion Support

The system automatically respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .page-transition-wrapper {
    animation: none !important;
    transition: none !important;
  }
}
```

### Focus Management

```tsx
// Focus is automatically managed during transitions
// Skip navigation link is provided in layout
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Screen Reader Announcements

```tsx
import { useEmergencyAnnouncements } from '@/components/providers/providers';

function MyComponent() {
  const { announce } = useEmergencyAnnouncements();
  
  const handleEmergency = () => {
    announce('Emergency alert activated', 'assertive');
  };
}
```

## Development Tools

### Debug Mode

Enable development indicators by setting `data-dev-mode="true"`:

```tsx
<PageTransition 
  className="page-transition-wrapper"
  data-dev-mode={process.env.NODE_ENV === 'development'}
>
  {children}
</PageTransition>
```

This shows a 🎬 indicator during animations.

### Performance Monitoring

```javascript
// Built-in performance monitoring in layout.tsx
window.addEventListener('load', function() {
  const loadTime = performance.now();
  console.log('Page load time:', loadTime);
});
```

## Troubleshooting

### Common Issues

1. **Animations not working**: Check if `framer-motion` is installed and components are client-side
2. **Performance issues**: Ensure you're using `transform` properties and GPU acceleration
3. **Layout shifts**: Use `contain: layout` and avoid animating layout properties
4. **Mobile performance**: Simplify animations on smaller screens using CSS media queries

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Known Limitations

- Safari < 11: Some `will-change` properties not supported
- iOS Safari: Requires `-webkit-` prefixes for some properties
- Older Android: Reduced animation complexity automatically applied

## Examples

See the demo pages for comprehensive examples:

- `/demo/transitions` - Full transition showcase
- `/emergency` - Emergency transition example
- `/auth/login` - Auth transition example
- `/dashboard` - Dashboard transition example

## API Reference

### PageTransition Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageType` | `'auth' \| 'dashboard' \| 'public' \| 'emergency' \| 'default'` | `'default'` | Page type for automatic variant selection |
| `transitionType` | `'slide' \| 'fade' \| 'scale' \| 'auto'` | `'auto'` | Transition animation type |
| `direction` | `'forward' \| 'backward' \| 'auto'` | `'auto'` | Animation direction |
| `disabled` | `boolean` | `false` | Disable transitions |
| `exitBeforeEnter` | `boolean` | `true` | Wait for exit before enter |
| `customVariants` | `AnimationPreset` | - | Custom animation preset |

### LayoutTransition Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layoutId` | `string` | - | Shared layout ID for transitions |
| `enableSharedElements` | `boolean` | `true` | Enable shared element transitions |
| `animateHeight` | `boolean` | `false` | Animate height changes |
| `animateWidth` | `boolean` | `false` | Animate width changes |

## Contributing

When adding new transition features:

1. Maintain 60fps performance
2. Support reduced motion preferences
3. Include proper TypeScript types
4. Add CSS optimizations
5. Update this documentation

## License

Part of the Smart Tourist Safety System - SIH 2025 Project.