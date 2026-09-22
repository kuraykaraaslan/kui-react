import { SHOWCASE_BRAND } from '@/libs/config/showcase.config';
import { BrandMark } from './BrandMark';

/**
 * The showcase navigation header: mark + name + "Component library".
 * Identical in the desktop sidebar and the mobile drawer, and 1:1 with
 * kui-ejs (views/showcase/partials/sidebar.ejs) and kui-native
 * (modules/showcase/ui/Sidebar.tsx) — change all three together.
 */
export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <BrandMark className="w-7 h-7" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{SHOWCASE_BRAND.name}</p>
        <p className="text-xs text-text-secondary truncate">Component library</p>
      </div>
    </div>
  );
}
