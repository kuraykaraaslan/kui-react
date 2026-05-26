'use client';
// Shim — forwards to the split component under ./CommandPalette/.
// Keeps `import { AppCommandBar, type CommandItem } from '@/modules/app/AppCommandBar'`
// working for existing consumers.
export { AppCommandBar, CommandPalette } from './CommandPalette';
export type {
  CommandItem,
  CommandPaletteProps,
  CommandGroup,
  ScoredCommand,
} from './CommandPalette';
export { useRegisterCommand, registerCommand, useCommandStore } from './CommandPalette';
