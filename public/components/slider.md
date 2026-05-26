# Slider

- **id:** `slider`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Slider/index.tsx`
- **status:** stable
- **since:** 2025-03

Accessible carousel. Includes role="region" + aria-roledescription="carousel" and per-slide aria labels. Supports autoplay, arrow keys, and dot navigation.

## Variants

### Default

```tsx
<Slider
  slides={[
    <HeroSlide title="Slide 1" />,
    <HeroSlide title="Slide 2" />,
    <HeroSlide title="Slide 3" />,
  ]}
/>
```

### Auto-play

```tsx
<Slider slides={slides} autoPlay autoPlayInterval={2000} />
```

### Touch swipe + momentum

```tsx
<Slider
  slides={slides}
  loop={false}
  dragThreshold={50}
  // Drag past 50 px = 1 slide.
  // Flick > 0.5 px/ms = +1 extra slide per 0.5 px/ms of release velocity.
  // Edge resistance (×0.4) keeps you on the rails when loop is off.
/>
```

### No arrows / no loop

```tsx
<Slider slides={slides} showArrows={false} loop={false} />
```

## Full source

```tsx
'use client';
import { useCallback, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Track } from './parts/Track';
import { Slide } from './parts/Slide';
import { Arrows } from './parts/Arrows';
import { Dots } from './parts/Dots';
import { useDrag } from './hooks/useDrag';
import { useAutoPlay } from './hooks/useAutoPlay';

// M1 — PointerEvent drag (touch+mouse+pen) with dragThreshold (50 px default),
// velocity momentum (0.5 px/ms = +1 slide), and edge resistance (×0.4) when
// loop is disabled. See modules/ui/Slider/hooks/useDrag.ts for the math.
export function Slider({ slides, autoPlay = false, autoPlayInterval = 4000, showDots = true, showArrows = true, loop = true, dragThreshold = 50, className, slideClassName, ariaLabel = 'Content slider' }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = slides.length;
  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    const target = loop ? ((index % total) + total) % total : Math.max(0, Math.min(index, total - 1));
    if (target === current) return;
    setIsTransitioning(true);
    setCurrent(target);
    setTimeout(() => setIsTransitioning(false), 350);
  }, [current, isTransitioning, loop, total]);
  const { dragState, handlers } = useDrag({ current, total, loop, dragThreshold, goTo });
  useAutoPlay({ enabled: autoPlay, interval: autoPlayInterval, total, onTick: useCallback(() => { if (dragState.isDragging) return; setCurrent((c) => (c + 1) % total); }, [dragState.isDragging, total]) });
  if (total === 0) return null;
  const canPrev = loop || current > 0;
  const canNext = loop || current < total - 1;
  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)} role="region" aria-label={ariaLabel} aria-roledescription="carousel">
      <Track current={current} isDragging={dragState.isDragging} offsetPx={dragState.offsetPx} pointerHandlers={handlers}>
        {slides.map((slide, i) => (<Slide key={i} index={i} total={total} isActive={i === current} className={slideClassName}>{slide}</Slide>))}
      </Track>
      {showArrows && total > 1 && <Arrows canPrev={canPrev} canNext={canNext} onPrev={() => goTo(current - 1)} onNext={() => goTo(current + 1)} />}
      {showDots && total > 1 && <Dots total={total} current={current} onSelect={goTo} />}
    </div>
  );
}
```
