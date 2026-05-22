'use client';
import { useState } from 'react';
import { UserProfileCard } from '@/modules/domains/common/user/UserProfileCard';
import { UserProfileForm } from '@/modules/domains/common/user/UserProfileForm';
import { Button } from '@/modules/ui/Button';
import { InlineAlert } from '@/modules/app/InlineAlert';
import { DEMO_USER } from '../../common.data';
import type { SafeUser, UserProfile } from '@/modules/domains/common/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

export default function ProfilePage() {
  const [user, setUser]       = useState<SafeUser>(DEMO_USER);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);

  async function handleSave(values: UserProfile) {
    await new Promise((r) => setTimeout(r, 800));
    setUser((u) => ({ ...u, userProfile: values }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <DocumentTitle text="Profile — Common Theme" />
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit profile
          </Button>
        )}
      </div>

      {saved && <InlineAlert message="Profile saved successfully." />}

      <UserProfileCard
        user={user}
        actions={
          !editing ? (
            <Button variant="outline" size="xs" onClick={() => setEditing(true)}>Edit</Button>
          ) : undefined
        }
      />

      {editing && (
        <div className="rounded-xl border border-border bg-surface-raised p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Edit profile</h3>
          <UserProfileForm
            initial={user.userProfile ?? {}}
            onSubmit={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}
    </div>
    </>
  );
}
