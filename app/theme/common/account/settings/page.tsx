'use client';
import { useState } from 'react';
import { UserPreferencesForm } from '@/modules/domains/common/user/UserPreferencesForm';
import { ChangePasswordForm } from '@/modules/domains/common/auth/ChangePasswordForm';
import { SectionCard } from '@/modules/app/SectionCard';
import { InlineAlert } from '@/modules/app/InlineAlert';
import { DEMO_USER } from '../../common.data';
import type { UserPreferences, ChangePassword } from '@/modules/domains/common/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

type SaveState = 'idle' | 'saved' | 'error';

export default function SettingsPage() {
  const [prefState, setPrefState] = useState<SaveState>('idle');
  const [pwState,   setPwState]   = useState<SaveState>('idle');

  async function handlePreferences(values: UserPreferences) {
    await new Promise((r) => setTimeout(r, 800));
    setPrefState('saved');
    setTimeout(() => setPrefState('idle'), 3000);
  }

  async function handlePassword(values: ChangePassword) {
    await new Promise((r) => setTimeout(r, 900));
    if (values.currentPassword === 'wrong') { setPwState('error'); setTimeout(() => setPwState('idle'), 3000); return; }
    setPwState('saved');
    setTimeout(() => setPwState('idle'), 3000);
  }

  return (
    <>
      <DocumentTitle text="Settings — Common Theme" />
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Settings</h2>

      <SectionCard title="Preferences">
        {prefState !== 'idle' && (
          <InlineAlert
            variant={prefState === 'saved' ? 'success' : 'error'}
            message={prefState === 'saved' ? 'Changes saved.' : 'Something went wrong.'}
          />
        )}
        <UserPreferencesForm
          initial={DEMO_USER.userPreferences}
          onSubmit={handlePreferences}
        />
      </SectionCard>

      <SectionCard title="Change Password">
        {pwState !== 'idle' && (
          <InlineAlert
            variant={pwState === 'saved' ? 'success' : 'error'}
            message={pwState === 'saved' ? 'Changes saved.' : 'Something went wrong.'}
          />
        )}
        <ChangePasswordForm onSubmit={handlePassword} />
      </SectionCard>
    </div>
    </>
  );
}
