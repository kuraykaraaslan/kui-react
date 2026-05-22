'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Input } from '@/modules/ui/Input';
import { Textarea } from '@/modules/ui/Textarea';
import { Button } from '@/modules/ui/Button';
import { Toggle } from '@/modules/ui/Toggle';
import { Avatar } from '@/modules/ui/Avatar';
import { LanguageSwitcher } from '@/modules/domains/common/i18n/LanguageSwitcher';
import { CountrySelector } from '@/modules/domains/common/location/CountrySelector';
import { CurrencySelector } from '@/modules/domains/common/money/CurrencySelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBell,
  faGlobe,
  faShield,
  faPalette,
  faCamera,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { ME } from '../social.data';
import type { AppLanguage } from '@/modules/domains/common/I18nTypes';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'regional' | 'privacy';

const TABS: { id: SettingsTab; label: string; icon: typeof faUser }[] = [
  { id: 'profile',       label: 'Profile',       icon: faUser    },
  { id: 'appearance',    label: 'Appearance',     icon: faPalette  },
  { id: 'notifications', label: 'Notifications',  icon: faBell    },
  { id: 'regional',      label: 'Regional',       icon: faGlobe   },
  { id: 'privacy',       label: 'Privacy',        icon: faShield  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const [displayName, setDisplayName] = useState(ME.name);
  const [username, setUsername] = useState(ME.username);
  const [bio, setBio] = useState(ME.bio ?? '');
  const [location, setLocation] = useState(ME.location ?? '');
  const [website, setWebsite] = useState(ME.website ?? '');

  const [language, setLanguage] = useState<AppLanguage>('en');
  const [country, setCountry] = useState('NL');
  const [currency, setCurrency] = useState('EUR');

  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);
  const [notifMentions, setNotifMentions] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  const [privateAccount, setPrivateAccount] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDMs, setAllowDMs] = useState(true);

  return (
    <div className="px-4 py-6 bg-surface-base border-r border-border min-h-full">
      <DocumentTitle text={`Settings — ${THEME_TITLES.social}`} />
      <div className="flex items-center gap-2 mb-6">
        <FontAwesomeIcon icon={faGear} className="w-5 h-5 text-primary" aria-hidden="true" />
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">

        {/* Tab list */}
        <nav className="md:w-44 shrink-0" aria-label="Settings sections">
          <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-fg'
                      : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab panels */}
        <div className="flex-1 min-w-0">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <section aria-label="Profile settings" className="space-y-6">
              <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-5">
                <h2 className="text-sm font-semibold text-text-primary">Public Profile</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar src={ME.avatar ?? undefined} name={ME.name} size="xl" />
                    <button
                      type="button"
                      aria-label="Change avatar"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                      <FontAwesomeIcon icon={faCamera} className="w-5 h-5 text-white" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary mb-0.5">Profile photo</p>
                    <p className="text-xs text-text-secondary">JPG, PNG or GIF · max 5 MB</p>
                    <Button variant="outline" size="xs" className="mt-2">Upload photo</Button>
                  </div>
                </div>

                <Input
                  id="display-name"
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
                <Input
                  id="username"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  hint="nexus.social/@username"
                />
                <Textarea
                  id="bio"
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people a little about yourself…"
                  rows={3}
                />
                <Input
                  id="location"
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
                <Input
                  id="website"
                  label="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yoursite.com"
                  type="url"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save changes</Button>
              </div>
            </section>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'appearance' && (
            <section aria-label="Appearance settings" className="space-y-4">
              <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-text-primary">Display</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Dark mode</p>
                    <p className="text-xs text-text-secondary">Switch to a dark color scheme</p>
                  </div>
                  <Toggle id="dark-mode" checked={darkMode} onChange={setDarkMode} label="Dark mode" />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Compact mode</p>
                    <p className="text-xs text-text-secondary">Show more content with reduced spacing</p>
                  </div>
                  <Toggle id="compact-mode" checked={compactMode} onChange={setCompactMode} label="Compact mode" />
                </div>
              </div>
            </section>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <section aria-label="Notification settings" className="space-y-4">
              <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-text-primary">Push Notifications</h2>
                {[
                  { id: 'notif-likes',    label: 'Likes',         desc: 'When someone likes your post',        value: notifLikes,    setter: setNotifLikes    },
                  { id: 'notif-comments', label: 'Comments',       desc: 'When someone comments on your post',  value: notifComments, setter: setNotifComments  },
                  { id: 'notif-follows',  label: 'New followers',  desc: 'When someone follows you',            value: notifFollows,  setter: setNotifFollows   },
                  { id: 'notif-mentions', label: 'Mentions',       desc: 'When someone mentions you',           value: notifMentions, setter: setNotifMentions  },
                ].map(({ id, label, desc, value, setter }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{label}</p>
                      <p className="text-xs text-text-secondary">{desc}</p>
                    </div>
                    <Toggle id={id} checked={value} onChange={setter} label={label} />
                  </div>
                ))}
              </div>

              <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-text-primary">Email Notifications</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Weekly digest</p>
                    <p className="text-xs text-text-secondary">A summary of your activity each week</p>
                  </div>
                  <Toggle id="notif-email" checked={notifEmail} onChange={setNotifEmail} label="Weekly digest" />
                </div>
              </div>
            </section>
          )}

          {/* ── Regional ── */}
          {activeTab === 'regional' && (
            <section aria-label="Regional settings" className="space-y-4">
              <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-5">
                <h2 className="text-sm font-semibold text-text-primary">Language & Region</h2>

                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">Interface language</p>
                  <LanguageSwitcher value={language} onChange={setLanguage} />
                </div>

                <CountrySelector
                  value={country}
                  onChange={setCountry}
                  label="Country / Region"
                  hint="Used to personalise content recommendations"
                />

                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">Currency</p>
                  <p className="text-xs text-text-secondary mb-2">Used in the Marketplace</p>
                  <CurrencySelector
                    value={currency}
                    onChange={setCurrency}
                    label="Currency"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save changes</Button>
              </div>
            </section>
          )}

          {/* ── Privacy ── */}
          {activeTab === 'privacy' && (
            <section aria-label="Privacy settings" className="space-y-4">
              <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-text-primary">Account Privacy</h2>
                {[
                  { id: 'privacy-private',  label: 'Private account',      desc: 'Only approved followers can see your posts', value: privateAccount,   setter: setPrivateAccount   },
                  { id: 'privacy-online',   label: 'Show online status',   desc: "Let others see when you're active",          value: showOnlineStatus, setter: setShowOnlineStatus },
                  { id: 'privacy-dms',      label: 'Allow direct messages',desc: 'Anyone can send you a message',              value: allowDMs,         setter: setAllowDMs         },
                ].map(({ id, label, desc, value, setter }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{label}</p>
                      <p className="text-xs text-text-secondary">{desc}</p>
                    </div>
                    <Toggle id={id} checked={value} onChange={setter} label={label} />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Padding for mobile bottom nav */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
