// ─── public types ───────────────────────────────────────────────────────────

export type QualityOption = { label: string; value: string };
export type SubtitleTrack = { label: string; srclang?: string; src: string };
export type AudioTrackOption = { label: string; language?: string };

export type VideoSource = { src: string; type?: string };
export type SubtitleFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type SettingsView =
  | 'main'
  | 'quality'
  | 'speed'
  | 'subtitles'
  | 'subtitle-size'
  | 'language';

export type CastState = 'unavailable' | 'available' | 'connecting' | 'connected';

export type VideoPlayerProps = {
  src: string | VideoSource | (string | VideoSource)[];
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  startMuted?: boolean;
  /** Video quality options — switching is delegated to onQualityChange */
  qualities?: QualityOption[];
  defaultQuality?: string;
  /** WebVTT subtitle tracks rendered as a custom overlay (supports font-size) */
  subtitles?: SubtitleTrack[];
  /** Audio language options — actual switching via onAudioTrackChange */
  audioTracks?: AudioTrackOption[];
  onQualityChange?: (value: string) => void;
  onAudioTrackChange?: (index: number) => void;
  /**
   * Controlled visibility of the controls overlay.
   * When provided, the component ignores internal auto-hide logic.
   */
  controlsVisible?: boolean;
  /** When false, controls stay visible while playing (no auto-hide). Default: true */
  autoHideControls?: boolean;
  /** Fired whenever the controls overlay visibility changes */
  onControlsVisibilityChange?: (visible: boolean) => void;
  /** Enable Google Cast (Chromecast) integration. Loads the Cast SDK on mount. Default: true */
  enableCast?: boolean;
  /** Fired when cast session state changes */
  onCastStateChange?: (state: CastState) => void;
  className?: string;
};

// ─── internal Cast SDK type surface ──────────────────────────────────────────

// Minimal type surface for the Google Cast Sender SDK (loaded at runtime).
export type CastSession = {
  getCastDevice: () => { friendlyName: string } | null;
  loadMedia: (request: unknown) => Promise<void>;
};
export type CastContextInstance = {
  setOptions: (opts: { receiverApplicationId: string; autoJoinPolicy: string }) => void;
  getCastState: () => string;
  getCurrentSession: () => CastSession | null;
  requestSession: () => Promise<void>;
  endCurrentSession: (stopCasting: boolean) => void;
  addEventListener: (event: string, handler: () => void) => void;
  removeEventListener: (event: string, handler: () => void) => void;
};
export type RemotePlayer = {
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volumeLevel: number;
  isMuted: boolean;
  isConnected: boolean;
};
export type RemotePlayerController = {
  addEventListener: (event: string, handler: () => void) => void;
  removeEventListener: (event: string, handler: () => void) => void;
  playOrPause: () => void;
  seek: () => void;
  setVolumeLevel: () => void;
  muteOrUnmute: () => void;
  stop: () => void;
};
export type CastFrameworkNs = {
  CastContext: { getInstance: () => CastContextInstance };
  CastContextEventType: { CAST_STATE_CHANGED: string };
  RemotePlayer: new () => RemotePlayer;
  RemotePlayerController: new (player: RemotePlayer) => RemotePlayerController;
  RemotePlayerEventType: { ANY_CHANGE: string };
};
export type ChromeCastNs = {
  AutoJoinPolicy: { ORIGIN_SCOPED: string };
  Image: new (url: string) => unknown;
  media: {
    DEFAULT_MEDIA_RECEIVER_APP_ID: string;
    MediaInfo: new (
      contentId: string,
      contentType: string,
    ) => {
      metadata?: unknown;
    };
    GenericMediaMetadata: new () => { title?: string; images?: unknown[] };
    LoadRequest: new (mediaInfo: unknown) => { currentTime?: number };
  };
};
