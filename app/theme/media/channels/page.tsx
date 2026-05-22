import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { ChannelCard } from '@/modules/domains/media/channel/ChannelCard';
import { CHANNELS } from '../media.data';

export const metadata: Metadata = {
  title: buildPageTitle('Channels', THEME_TITLES.media),
};

export default function ChannelsPage() {
  return (
    <div className="bg-surface-base text-text-primary">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Channels</h1>
          <p className="text-text-secondary text-sm mt-1">Discover creators and subscribe to your favourites</p>
        </div>

        {/* Channel grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((channel) => (
            <ChannelCard
              key={channel.channelId}
              channel={{
                channelId: channel.channelId,
                name: channel.name,
                handle: channel.handle,
                description: channel.description,
                avatarUrl: channel.avatarUrl,
                subscriberCount: channel.subscriberCount,
                videoCount: channel.videoCount,
                verified: channel.verified,
              }}
              href={`/theme/media/channels`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
