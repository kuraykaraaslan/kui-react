'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faExpand,
  faCompress,
  faSpinner,
  faRotateLeft,
  faRotateRight,
  faGear,
  faChevronRight,
  faChevronLeft,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faChromecast } from '@fortawesome/free-brands-svg-icons';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── types ───────────────────────────────────────────────────────────────────

export type QualityOption = { label: string; value: string };
export type SubtitleTrack = { label: string; srclang?: string; src: string };
export type AudioTrackOption = { label: string; language?: string };

type VideoSource = { src: string; type?: string };
type SubtitleFontSize = 'sm' | 'md' | 'lg' | 'xl';
type SettingsView = 'main' | 'quality' | 'speed' | 'subtitles' | 'subtitle-size' | 'language';

// Minimal type surface for the Google Cast Sender SDK (loaded at runtime).
type CastSession = {
  getCastDevice: () => { friendlyName: string } | null;
  loadMedia: (request: unknown) => Promise<void>;
};
type CastContextInstance = {
  setOptions: (opts: { receiverApplicationId: string; autoJoinPolicy: string }) => void;
  getCastState: () => string;
  getCurrentSession: () => CastSession | null;
  requestSession: () => Promise<void>;
  endCurrentSession: (stopCasting: boolean) => void;
  addEventListener: (event: string, handler: () => void) => void;
  removeEventListener: (event: string, handler: () => void) => void;
};
type RemotePlayer = {
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volumeLevel: number;
  isMuted: boolean;
  isConnected: boolean;
};
type RemotePlayerController = {
  addEventListener: (event: string, handler: () => void) => void;
  removeEventListener: (event: string, handler: () => void) => void;
  playOrPause: () => void;
  seek: () => void;
  setVolumeLevel: () => void;
  muteOrUnmute: () => void;
  stop: () => void;
};
type CastFrameworkNs = {
  CastContext: { getInstance: () => CastContextInstance };
  CastContextEventType: { CAST_STATE_CHANGED: string };
  RemotePlayer: new () => RemotePlayer;
  RemotePlayerController: new (player: RemotePlayer) => RemotePlayerController;
  RemotePlayerEventType: { ANY_CHANGE: string };
};
type ChromeCastNs = {
  AutoJoinPolicy: { ORIGIN_SCOPED: string };
  Image: new (url: string) => unknown;
  media: {
    DEFAULT_MEDIA_RECEIVER_APP_ID: string;
    MediaInfo: new (contentId: string, contentType: string) => {
      metadata?: unknown;
    };
    GenericMediaMetadata: new () => { title?: string; images?: unknown[] };
    LoadRequest: new (mediaInfo: unknown) => { currentTime?: number };
  };
};

// ─── constants ───────────────────────────────────────────────────────────────

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SUBTITLE_SIZES: Record<SubtitleFontSize, string> = {
  sm: '0.8rem',
  md: '1rem',
  lg: '1.3rem',
  xl: '1.65rem',
};

const SUBTITLE_SIZE_LABELS: Record<SubtitleFontSize, string> = {
  sm: 'Küçük',
  md: 'Orta',
  lg: 'Büyük',
  xl: 'Çok Büyük',
};

// ─── props ────────────────────────────────────────────────────────────────────

type VideoPlayerProps = {
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
  onCastStateChange?: (state: 'unavailable' | 'available' | 'connecting' | 'connected') => void;
  className?: string;
};

// ─── component ───────────────────────────────────────────────────────────────

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  loop = false,
  startMuted = false,
  qualities,
  defaultQuality,
  subtitles,
  audioTracks,
  onQualityChange,
  onAudioTrackChange,
  controlsVisible,
  autoHideControls = true,
  onControlsVisibilityChange,
  enableCast = true,
  onCastStateChange,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remotePlayerRef = useRef<RemotePlayer | null>(null);
  const remoteControllerRef = useRef<RemotePlayerController | null>(null);

  // playback
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(startMuted);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [seekHoverX, setSeekHoverX] = useState<number | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // settings
  const [selectedQuality, setSelectedQuality] = useState<string>(
    defaultQuality ?? qualities?.[0]?.value ?? '',
  );
  const [selectedSubtitle, setSelectedSubtitle] = useState<number | null>(null);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<number>(0);
  const [subtitleFontSize, setSubtitleFontSize] = useState<SubtitleFontSize>('md');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [cueText, setCueText] = useState<string | null>(null);

  // cast
  const [castState, setCastState] = useState<'unavailable' | 'available' | 'connecting' | 'connected'>('unavailable');
  const [castDeviceName, setCastDeviceName] = useState<string | null>(null);

  const sources = Array.isArray(src) ? src : [src];

  // ── controls visibility ──────────────────────────────────────────────────

  // Controlled mode: controlsVisible prop overrides internal state entirely.
  // Uncontrolled mode: internal auto-hide logic runs (respects autoHideControls).
  const isControlled = controlsVisible !== undefined;
  const isCasting = castState === 'connected';
  const effectiveControls = isCasting
    ? true
    : isControlled
      ? (controlsVisible as boolean)
      : showControls;

  // Fire callback whenever effective visibility changes.
  useEffect(() => {
    onControlsVisibilityChange?.(effectiveControls);
  }, [effectiveControls, onControlsVisibilityChange]);

  const scheduleHide = useCallback((isPlaying: boolean) => {
    if (isControlled) return; // parent owns visibility
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    if (isCasting) return; // keep controls pinned while casting
    if (isPlaying && autoHideControls)
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, [isControlled, autoHideControls, isCasting]);

  const resetHideTimer = useCallback(() => {
    scheduleHide(playing);
  }, [playing, scheduleHide]);

  // ── video events ─────────────────────────────────────────────────────────

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration)
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
    };
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onPlay = () => { setPlaying(true); scheduleHide(true); };
    const onPause = () => { setPlaying(false); if (!isControlled) setShowControls(true); };
    const onEnded = () => { setPlaying(false); if (!isControlled) setShowControls(true); };
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('progress', onProgress);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    document.addEventListener('fullscreenchange', onFSChange);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('fullscreenchange', onFSChange);
    };
  }, [scheduleHide]);

  // ── subtitle cue overlay ─────────────────────────────────────────────────

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    Array.from(video.textTracks).forEach((t) => { t.mode = 'disabled'; });
    setCueText(null);

    if (selectedSubtitle === null || !subtitles?.[selectedSubtitle]) return;

    const track = video.textTracks[selectedSubtitle];
    if (!track) return;

    // 'hidden' fires cuechange but lets us own the rendering
    track.mode = 'hidden';

    const onCueChange = () => {
      const active = track.activeCues;
      if (!active || active.length === 0) { setCueText(null); return; }
      const text = Array.from(active)
        .map((c) => (c as VTTCue).text.replace(/<[^>]+>/g, ''))
        .join('\n');
      setCueText(text || null);
    };

    track.addEventListener('cuechange', onCueChange);
    return () => track.removeEventListener('cuechange', onCueChange);
  }, [selectedSubtitle, subtitles]);

  // ── Google Cast SDK ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!enableCast || typeof window === 'undefined') return;

    const w = window as unknown as {
      cast?: { framework?: CastFrameworkNs };
      chrome?: { cast?: ChromeCastNs };
      __onGCastApiAvailable?: (available: boolean) => void;
    };

    let cleanupListener: (() => void) | undefined;

    const init = () => {
      const framework = w.cast?.framework;
      const chromeCast = w.chrome?.cast;
      if (!framework || !chromeCast) return;

      const context = framework.CastContext.getInstance();
      context.setOptions({
        receiverApplicationId: chromeCast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chromeCast.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      const mapState = (s: string): 'unavailable' | 'available' | 'connecting' | 'connected' => {
        if (s === 'CONNECTED') return 'connected';
        if (s === 'CONNECTING') return 'connecting';
        if (s === 'NO_DEVICES_AVAILABLE') return 'unavailable';
        return 'available';
      };

      const sync = () => {
        const next = mapState(context.getCastState());
        setCastState(next);
        const session = context.getCurrentSession();
        setCastDeviceName(next === 'connected' ? session?.getCastDevice()?.friendlyName ?? null : null);
      };

      const handler = () => sync();
      context.addEventListener(framework.CastContextEventType.CAST_STATE_CHANGED, handler);
      sync();

      // remote player — mirrors playback state of the cast session
      const remotePlayer = new framework.RemotePlayer();
      const remoteController = new framework.RemotePlayerController(remotePlayer);
      remotePlayerRef.current = remotePlayer;
      remoteControllerRef.current = remoteController;

      const syncRemote = () => {
        if (!remotePlayer.isConnected) return;
        setPlaying(!remotePlayer.isPaused);
        if (isFinite(remotePlayer.currentTime)) setCurrentTime(remotePlayer.currentTime);
        if (remotePlayer.duration > 0) setDuration(remotePlayer.duration);
        setVolume(remotePlayer.volumeLevel);
        setMuted(remotePlayer.isMuted);
      };
      remoteController.addEventListener(framework.RemotePlayerEventType.ANY_CHANGE, syncRemote);

      cleanupListener = () => {
        context.removeEventListener(framework.CastContextEventType.CAST_STATE_CHANGED, handler);
        remoteController.removeEventListener(framework.RemotePlayerEventType.ANY_CHANGE, syncRemote);
      };
    };

    if (w.cast?.framework) {
      init();
    } else {
      const SCRIPT_ID = 'google-cast-sdk';
      w.__onGCastApiAvailable = (available: boolean) => { if (available) init(); };
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => { cleanupListener?.(); };
  }, [enableCast]);

  useEffect(() => {
    onCastStateChange?.(castState);
  }, [castState, onCastStateChange]);

  const toggleCast = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as {
      cast?: { framework?: CastFrameworkNs };
      chrome?: { cast?: ChromeCastNs };
    };
    const framework = w.cast?.framework;
    const chromeCast = w.chrome?.cast;
    if (!framework || !chromeCast) return;

    const context = framework.CastContext.getInstance();

    if (castState === 'connected') {
      context.endCurrentSession(true);
      return;
    }

    try {
      await context.requestSession();
      const session = context.getCurrentSession();
      const v = videoRef.current;
      if (!session || !v) return;

      const first = Array.isArray(src) ? src[0] : src;
      const videoSrc = v.currentSrc || (typeof first === 'string' ? first : first.src);
      const contentType = typeof first === 'string' ? 'video/mp4' : first.type ?? 'video/mp4';

      const mediaInfo = new chromeCast.media.MediaInfo(videoSrc, contentType);
      const metadata = new chromeCast.media.GenericMediaMetadata();
      if (title) metadata.title = title;
      if (poster) metadata.images = [new chromeCast.Image(poster)];
      mediaInfo.metadata = metadata;

      const request = new chromeCast.media.LoadRequest(mediaInfo);
      request.currentTime = v.currentTime;
      await session.loadMedia(request);
      v.pause();
    } catch {
      // user cancelled or no session
    }
  }, [castState, src, title, poster]);

  // ── close settings on outside click ─────────────────────────────────────

  useEffect(() => {
    if (!showSettings) return;
    const handler = (e: MouseEvent) => {
      if (!settingsPanelRef.current?.contains(e.target as Node)) {
        setShowSettings(false);
        setSettingsView('main');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSettings]);

  // ── playback handlers ────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    if (isCasting && remoteControllerRef.current) {
      remoteControllerRef.current.playOrPause();
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  }, [isCasting]);

  const seekBy = useCallback((delta: number) => {
    if (isCasting && remotePlayerRef.current && remoteControllerRef.current) {
      const rp = remotePlayerRef.current;
      rp.currentTime = Math.max(0, Math.min(rp.duration || 0, rp.currentTime + delta));
      remoteControllerRef.current.seek();
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
  }, [isCasting]);

  const toggleMute = useCallback(() => {
    if (isCasting && remoteControllerRef.current) {
      remoteControllerRef.current.muteOrUnmute();
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, [isCasting]);

  const handleVolumeChange = useCallback((val: number) => {
    const c = Math.max(0, Math.min(1, val));
    if (isCasting && remotePlayerRef.current && remoteControllerRef.current) {
      remotePlayerRef.current.volumeLevel = c;
      remoteControllerRef.current.setVolumeLevel();
      setVolume(c);
      setMuted(c === 0);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.volume = c;
    v.muted = c === 0;
    setVolume(c);
    setMuted(c === 0);
  }, [isCasting]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (isCasting && remotePlayerRef.current && remoteControllerRef.current) {
      const rp = remotePlayerRef.current;
      if (!rp.duration) return;
      rp.currentTime = ratio * rp.duration;
      remoteControllerRef.current.seek();
      return;
    }
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = ratio * v.duration;
  }, [isCasting]);

  const handleSeekMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    setSeekHoverX(Math.max(0, Math.min(rect.width, e.clientX - rect.left)));
  }, []);

  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) c.requestFullscreen(); else document.exitFullscreen();
  }, []);

  // ── settings handlers ────────────────────────────────────────────────────

  const closeSettings = useCallback(() => {
    setShowSettings(false);
    setSettingsView('main');
  }, []);

  const applySpeed = useCallback((s: number) => {
    const v = videoRef.current;
    if (v) v.playbackRate = s;
    setSpeed(s);
    closeSettings();
  }, [closeSettings]);

  const applyQuality = useCallback((value: string) => {
    setSelectedQuality(value);
    onQualityChange?.(value);
    closeSettings();
  }, [onQualityChange, closeSettings]);

  const applySubtitle = useCallback((index: number | null) => {
    setSelectedSubtitle(index);
    closeSettings();
  }, [closeSettings]);

  const applyAudioTrack = useCallback((index: number) => {
    setSelectedAudioTrack(index);
    onAudioTrackChange?.(index);
    closeSettings();
  }, [onAudioTrackChange, closeSettings]);

  const applySubtitleSize = useCallback((size: SubtitleFontSize) => {
    setSubtitleFontSize(size);
    setSettingsView('main');
  }, []);

  // ── keyboard ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const focused = document.activeElement;
      if (!c.contains(focused) && focused !== c) return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': e.preventDefault(); seekBy(-10); break;
        case 'ArrowRight': e.preventDefault(); seekBy(10); break;
        case 'ArrowUp': e.preventDefault(); handleVolumeChange(volume + 0.1); break;
        case 'ArrowDown': e.preventDefault(); handleVolumeChange(volume - 0.1); break;
        case 'm': e.preventDefault(); toggleMute(); break;
        case 'f': e.preventDefault(); toggleFullscreen(); break;
        case 'Escape': if (showSettings) { e.preventDefault(); closeSettings(); } break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [togglePlay, toggleMute, toggleFullscreen, handleVolumeChange, seekBy, volume, showSettings, closeSettings]);

  // ── derived values ───────────────────────────────────────────────────────

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const seekHoverPct =
    seekHoverX !== null && progressRef.current
      ? (seekHoverX / progressRef.current.getBoundingClientRect().width) * 100
      : null;
  const hoverTime = seekHoverPct !== null ? formatTime((seekHoverPct / 100) * duration) : null;
  const volumeIcon = muted || volume === 0 ? faVolumeOff : volume < 0.5 ? faVolumeLow : faVolumeHigh;

  const currentQualityLabel = qualities?.find((q) => q.value === selectedQuality)?.label ?? 'Auto';
  const currentSubtitleLabel =
    selectedSubtitle !== null ? (subtitles?.[selectedSubtitle]?.label ?? 'Kapalı') : 'Kapalı';
  const currentAudioLabel = audioTracks?.[selectedAudioTrack]?.label ?? '';

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label={title ? `Video: ${title}` : 'Video player'}
      className={cn(
        'relative bg-black rounded-xl overflow-hidden select-none outline-none',
        'aspect-video min-h-[10rem]',
        'focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { if (!isControlled && autoHideControls && playing) setShowControls(false); }}
    >
      {/* ── video element ── */}
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={startMuted}
        crossOrigin="anonymous"
        className="w-full h-full object-contain block"
        onClick={togglePlay}
        style={{ cursor: 'pointer' }}
      >
        {sources.map((s, i) =>
          typeof s === 'string'
            ? <source key={i} src={s} />
            : <source key={i} src={s.src} type={s.type} />,
        )}
        {subtitles?.map((sub, i) => (
          <track
            key={i}
            kind="subtitles"
            label={sub.label}
            srcLang={sub.srclang}
            src={sub.src}
          />
        ))}
      </video>

      {/* ── casting overlay ── */}
      {isCasting && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-3 text-center px-6"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0) 100%)' }}
        >
          <FontAwesomeIcon icon={faChromecast} className="text-white text-5xl drop-shadow-lg" aria-hidden="true" />
          <p className="text-white/90 text-sm font-medium">
            {castDeviceName ? `${castDeviceName} cihazına yayınlanıyor` : 'Cihaza yayınlanıyor'}
          </p>
          {title && <p className="text-white/60 text-xs max-w-[90%] truncate">{title}</p>}
        </div>
      )}

      {/* ── loading spinner ── */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <FontAwesomeIcon icon={faSpinner} className="text-white text-4xl animate-spin drop-shadow-lg" aria-hidden="true" />
        </div>
      )}

      {/* ── centre play overlay ── */}
      {!loading && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none',
            'transition-opacity duration-300 ease-out',
            playing ? 'opacity-0' : 'opacity-100',
          )}
          aria-hidden="true"
        >
          <div
            className={cn(
              'w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm',
              'flex items-center justify-center shadow-2xl ring-2 ring-white/20',
              'transition-transform duration-300 ease-out',
              playing ? 'scale-125' : 'scale-100',
            )}
          >
            <FontAwesomeIcon icon={faPlay} className="text-white text-2xl ml-1" />
          </div>
        </div>
      )}

      {/* ── subtitle overlay ── */}
      {cueText && (
        <div
          className={cn(
            'absolute left-0 right-0 flex justify-center px-6 pointer-events-none z-10 transition-all duration-300',
            effectiveControls ? 'bottom-[4.5rem]' : 'bottom-4',
          )}
        >
          <span
            className="bg-black/80 text-white px-3 py-1 rounded-md text-center max-w-[85%] whitespace-pre-line leading-snug font-medium"
            style={{ fontSize: SUBTITLE_SIZES[subtitleFontSize] }}
          >
            {cueText}
          </span>
        </div>
      )}

      {/* ── controls layer ── */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end transition-opacity duration-300 z-20',
          effectiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={(e) => { if (e.target === e.currentTarget && !isCasting) togglePlay(); }}
      >
        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)' }}
        />

        {/* ── settings panel ── */}
        {showSettings && (
          <div
            ref={settingsPanelRef}
            className="absolute bottom-14 right-4 w-60 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden z-20"
          >
            {settingsView === 'main' && (
              <>
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGear} className="text-white/50 text-xs" aria-hidden="true" />
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Ayarlar</p>
                </div>
                <div className="py-1">
                  {qualities && qualities.length > 0 && (
                    <SettingsRow label="Kalite" value={currentQualityLabel} onClick={() => setSettingsView('quality')} />
                  )}
                  <SettingsRow
                    label="Oynatma Hızı"
                    value={speed === 1 ? 'Normal' : `${speed}×`}
                    onClick={() => setSettingsView('speed')}
                  />
                  {subtitles && subtitles.length > 0 && (
                    <>
                      <SettingsRow label="Altyazı" value={currentSubtitleLabel} onClick={() => setSettingsView('subtitles')} />
                      <SettingsRow
                        label="Altyazı Boyutu"
                        value={SUBTITLE_SIZE_LABELS[subtitleFontSize]}
                        onClick={() => setSettingsView('subtitle-size')}
                      />
                    </>
                  )}
                  {audioTracks && audioTracks.length > 1 && (
                    <SettingsRow label="Ses Dili" value={currentAudioLabel} onClick={() => setSettingsView('language')} />
                  )}
                </div>
              </>
            )}

            {settingsView === 'quality' && (
              <SettingsSubMenu title="Kalite" onBack={() => setSettingsView('main')}>
                {qualities!.map((q) => (
                  <SettingsOption key={q.value} label={q.label} selected={selectedQuality === q.value} onClick={() => applyQuality(q.value)} />
                ))}
              </SettingsSubMenu>
            )}

            {settingsView === 'speed' && (
              <SettingsSubMenu title="Oynatma Hızı" onBack={() => setSettingsView('main')}>
                {SPEEDS.map((s) => (
                  <SettingsOption key={s} label={s === 1 ? '1× (Normal)' : `${s}×`} selected={speed === s} onClick={() => applySpeed(s)} />
                ))}
              </SettingsSubMenu>
            )}

            {settingsView === 'subtitles' && (
              <SettingsSubMenu title="Altyazı" onBack={() => setSettingsView('main')}>
                <SettingsOption label="Kapalı" selected={selectedSubtitle === null} onClick={() => applySubtitle(null)} />
                {subtitles!.map((sub, i) => (
                  <SettingsOption key={i} label={sub.label} selected={selectedSubtitle === i} onClick={() => applySubtitle(i)} />
                ))}
              </SettingsSubMenu>
            )}

            {settingsView === 'subtitle-size' && (
              <SettingsSubMenu title="Altyazı Boyutu" onBack={() => setSettingsView('main')}>
                {(Object.entries(SUBTITLE_SIZE_LABELS) as [SubtitleFontSize, string][]).map(([key, label]) => (
                  <SettingsOption
                    key={key}
                    label={label}
                    sublabel={SUBTITLE_SIZES[key]}
                    selected={subtitleFontSize === key}
                    onClick={() => applySubtitleSize(key)}
                  />
                ))}
              </SettingsSubMenu>
            )}

            {settingsView === 'language' && (
              <SettingsSubMenu title="Ses Dili" onBack={() => setSettingsView('main')}>
                {audioTracks!.map((track, i) => (
                  <SettingsOption key={i} label={track.label} sublabel={track.language} selected={selectedAudioTrack === i} onClick={() => applyAudioTrack(i)} />
                ))}
              </SettingsSubMenu>
            )}
          </div>
        )}

        <div className="relative px-4 pb-3 pt-6 space-y-2.5">
          {/* title */}
          {title && (
            <p className="text-white/90 text-sm font-medium truncate leading-tight">{title}</p>
          )}

          {/* ── progress bar ── */}
          <div
            ref={progressRef}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            tabIndex={0}
            className="relative h-1.5 rounded-full bg-white/20 cursor-pointer group/seek hover:h-2 transition-all"
            onClick={handleSeek}
            onMouseMove={handleSeekMouseMove}
            onMouseLeave={() => setSeekHoverX(null)}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${buffered}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            {seekHoverPct !== null && (
              <div className="absolute inset-y-0 left-0 rounded-full bg-white/15" style={{ width: `${seekHoverPct}%` }} />
            )}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover/seek:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
            {hoverTime && seekHoverX !== null && (
              <div
                className="absolute -top-8 -translate-x-1/2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap"
                style={{ left: seekHoverX }}
              >
                {hoverTime}
              </div>
            )}
          </div>

          {/* ── control row ── */}
          <div className="flex items-center gap-1">
            {/* rewind */}
            <CtrlBtn onClick={() => seekBy(-10)} aria-label="Rewind 10 seconds">
              <FontAwesomeIcon icon={faRotateLeft} className="text-sm" aria-hidden="true" />
            </CtrlBtn>

            {/* play/pause */}
            <CtrlBtn onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} primary>
              <FontAwesomeIcon icon={playing ? faPause : faPlay} className="text-base" aria-hidden="true" />
            </CtrlBtn>

            {/* forward */}
            <CtrlBtn onClick={() => seekBy(10)} aria-label="Forward 10 seconds">
              <FontAwesomeIcon icon={faRotateRight} className="text-sm" aria-hidden="true" />
            </CtrlBtn>

            {/* volume */}
            <div
              className="flex items-center gap-1.5"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <CtrlBtn onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                <FontAwesomeIcon icon={volumeIcon} className="text-sm" aria-hidden="true" />
              </CtrlBtn>
              <div className={cn('overflow-hidden transition-all duration-200 ease-out', showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0')}>
                <input
                  type="range" min={0} max={1} step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="w-full h-1 cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* time */}
            <span className="text-white/70 text-xs tabular-nums flex-1 pl-1 select-none">
              {formatTime(currentTime)}<span className="text-white/30 mx-0.5">/</span>{formatTime(duration)}
            </span>

            {/* settings gear */}
            <CtrlBtn
              onClick={() => { setShowSettings((v) => !v); setSettingsView('main'); }}
              aria-label="Settings"
              aria-expanded={showSettings}
              active={showSettings}
            >
              <FontAwesomeIcon
                icon={faGear}
                className={cn('text-sm transition-transform duration-300', showSettings && 'rotate-[30deg]')}
                aria-hidden="true"
              />
            </CtrlBtn>

            {/* cast */}
            {enableCast && castState !== 'unavailable' && (
              <CtrlBtn
                onClick={toggleCast}
                aria-label={castState === 'connected' ? 'Stop casting' : 'Cast to device'}
                aria-pressed={castState === 'connected'}
                active={castState === 'connected' || castState === 'connecting'}
              >
                <FontAwesomeIcon
                  icon={faChromecast}
                  className={cn('text-sm', castState === 'connecting' && 'animate-pulse')}
                  aria-hidden="true"
                />
              </CtrlBtn>
            )}

            {/* fullscreen */}
            <CtrlBtn onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="text-sm" aria-hidden="true" />
            </CtrlBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── internal sub-components ─────────────────────────────────────────────────

type CtrlBtnProps = {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function CtrlBtn({ onClick, children, primary, active, className, ...rest }: CtrlBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white',
        primary ? 'w-9 h-9 text-white hover:text-primary' : 'w-8 h-8',
        !primary && active && 'text-primary',
        !primary && !active && 'text-white/80 hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function SettingsRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors group"
    >
      <span className="text-white/85 text-sm">{label}</span>
      <div className="flex items-center gap-1.5 text-white/45 text-xs group-hover:text-white/65 transition-colors">
        <span>{value}</span>
        <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" aria-hidden="true" />
      </div>
    </button>
  );
}

function SettingsSubMenu({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-white/50 text-xs" aria-hidden="true" />
        <span className="text-white text-sm font-semibold">{title}</span>
      </button>
      <div className="py-1">{children}</div>
    </div>
  );
}

function SettingsOption({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/10',
        selected ? 'text-primary font-semibold' : 'text-white/80',
      )}
    >
      <span className="flex flex-col items-start gap-0.5">
        <span>{label}</span>
        {sublabel && <span className="text-xs text-white/35 font-normal">{sublabel}</span>}
      </span>
      {selected && <FontAwesomeIcon icon={faCheck} className="text-primary text-xs shrink-0" aria-hidden="true" />}
    </button>
  );
}
