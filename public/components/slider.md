# Slider

- **id:** `slider`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Slider.tsx`
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

### No arrows / no loop

```tsx
<Slider slides={slides} showArrows={false} loop={false} />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState, useEffect, useCallback, useRef } from 'react';

export function Slider({ slides, autoPlay = false, autoPlayInterval = 4000, showDots = true, showArrows = true, loop = true, className, slideClassName }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const goTo = useCallback((index) => setCurrent(loop ? ((index + total) % total) : Math.max(0, Math.min(index, total - 1))), [loop, total]);
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlay, autoPlayInterval, total]);
  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)} role="region" aria-label="Content slider" aria-roledescription="carousel">
      <div className="flex transition-transform duration-350 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} role="group" aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${total}`} aria-hidden={i !== current} className={cn('w-full shrink-0', slideClassName)}>{slide}</div>
        ))}
      </div>
      {showArrows && (loop || current > 0) && <button onClick={prev} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">‹</button>}
      {showArrows && (loop || current < total - 1) && <button onClick={next} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">›</button>}
      {showDots && total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" role="tablist" aria-label="Slide indicators">
          {slides.map((_, i) => <button key={i} role="tab" aria-selected={i === current} aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)} className={cn('h-2 rounded-full transition-all', i === current ? 'w-5 bg-white' : 'w-2 bg-white/40')} />)}
        </div>
      )}
    </div>
  );
}
```
