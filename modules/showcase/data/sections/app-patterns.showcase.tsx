'use client';
import { buildAppShellData } from './app-shell.showcase';
import { buildAppNavData } from './app-nav.showcase';
import { buildAppUserData } from './app-user.showcase';
import { buildAppFormData } from './app-form.showcase';
import { buildAppContentData } from './app-content.showcase';
import { buildAppExtrasData } from './app-extras.showcase';
import { buildAppEditorData } from './app-editor.showcase';
import type { ShowcaseComponent } from '../showcase.types';

export function buildAppPatternsData(): ShowcaseComponent[] {
  return [
    ...buildAppShellData(),
    ...buildAppNavData(),
    ...buildAppUserData(),
    ...buildAppFormData(),
    ...buildAppContentData(),
    ...buildAppExtrasData(),
    ...buildAppEditorData(),
  ];
}
