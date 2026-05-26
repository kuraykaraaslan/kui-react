'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { formatTime } from './format';
import { ControlRow } from './parts/ControlRow';
import { ProgressBar } from './parts/ProgressBar';
import { SettingsPanel } from './parts/SettingsPanel';
import { CastOverlay, LoadingOverlay, CenterPlayOverlay, SubtitleOverlay } from './parts/Overlays';
import { useControlsVisibility } from './hooks/useControlsVisibility';
import { useVideoEvents } from './hooks/useVideoEvents';
import { useSubtitleCues } from './hooks/useSubtitleCues';
import { useGoogleCast } from './hooks/useGoogleCast';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { usePlayerActions } from './hooks/usePlayerActions';
import type { SettingsView, SubtitleFontSize, VideoPlayerProps } from './types';

export type { QualityOption, SubtitleTrack, AudioTrackOption, VideoPlayerProps } from './types';

export function VideoPlayer({
  src, poster, title, autoPlay = false, loop = false, startMuted = false,
  qualities, defaultQuality, subtitles, audioTracks, onQualityChange, onAudioTrackChange,
  controlsVisible, autoHideControls = true, onControlsVisibilityChange,
  enableCast = true, onCastStateChange, className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(startMuted);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seekHoverX, setSeekHoverX] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>(defaultQuality ?? qualities?.[0]?.value ?? '');
  const [selectedSubtitle, setSelectedSubtitle] = useState<number | null>(null);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<number>(0);
  const [subtitleFontSize, setSubtitleFontSize] = useState<SubtitleFontSize>('md');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>('main');

  const sources = Array.isArray(src) ? src : [src];
  const { castState, castDeviceName, remotePlayerRef, remoteControllerRef, toggleCast } = useGoogleCast({
    enableCast, videoRef, src, title, poster, setPlaying, setCurrentTime, setDuration, setVolume, setMuted, onCastStateChange,
  });
  const isCasting = castState === 'connected';
  const { effectiveControls, scheduleHide, resetHideTimer, forceShow, hideIfPlaying } = useControlsVisibility({
    controlsVisible, autoHideControls, isCasting, playing, onChange: onControlsVisibilityChange,
  });
  useVideoEvents({ videoRef, setCurrentTime, setDuration, setBuffered, setLoading, setPlaying, setIsFullscreen, scheduleHide, forceShow });
  const cueText = useSubtitleCues({ videoRef, selectedSubtitle, subtitles });
  const { toggleFullscreen } = useFullscreen(containerRef);
  const { togglePlay, seekBy, toggleMute, handleVolumeChange, handleSeek } = usePlayerActions({
    isCasting, videoRef, progressRef, remotePlayerRef, remoteControllerRef, setVolume, setMuted,
  });

  const closeSettings = useCallback(() => { setShowSettings(false); setSettingsView('main'); }, []);
  const applySpeed = useCallback((s: number) => { const v = videoRef.current; if (v) v.playbackRate = s; setSpeed(s); closeSettings(); }, [closeSettings]);
  const applyQuality = useCallback((value: string) => { setSelectedQuality(value); onQualityChange?.(value); closeSettings(); }, [onQualityChange, closeSettings]);
  const applySubtitle = useCallback((index: number | null) => { setSelectedSubtitle(index); closeSettings(); }, [closeSettings]);
  const applyAudioTrack = useCallback((index: number) => { setSelectedAudioTrack(index); onAudioTrackChange?.(index); closeSettings(); }, [onAudioTrackChange, closeSettings]);
  const applySubtitleSize = useCallback((size: SubtitleFontSize) => { setSubtitleFontSize(size); setSettingsView('main'); }, []);

  useKeyboardShortcuts({ containerRef, videoRef, togglePlay, seekBy, toggleMute, handleVolumeChange, toggleFullscreen, volume, showSettings, closeSettings });

  useEffect(() => {
    if (!showSettings) return;
    const handler = (e: MouseEvent) => { if (!settingsPanelRef.current?.contains(e.target as Node)) closeSettings(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSettings, closeSettings]);

  const handleSeekMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current; if (!bar) return;
    const rect = bar.getBoundingClientRect();
    setSeekHoverX(Math.max(0, Math.min(rect.width, e.clientX - rect.left)));
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const seekHoverPct = seekHoverX !== null && progressRef.current
    ? (seekHoverX / progressRef.current.getBoundingClientRect().width) * 100 : null;
  const hoverTime = seekHoverPct !== null ? formatTime((seekHoverPct / 100) * duration) : null;

  return (
    <div ref={containerRef} tabIndex={0} aria-label={title ? `Video: ${title}` : 'Video player'}
      className={cn('relative bg-black rounded-xl overflow-hidden select-none outline-none', 'aspect-video min-h-[10rem]',
        'focus-visible:ring-2 focus-visible:ring-border-focus', className)}
      onMouseMove={resetHideTimer} onMouseLeave={hideIfPlaying}>
      <video ref={videoRef} poster={poster} autoPlay={autoPlay} loop={loop} muted={startMuted} crossOrigin="anonymous"
        className="w-full h-full object-contain block" onClick={togglePlay} style={{ cursor: 'pointer' }}>
        {sources.map((s, i) => typeof s === 'string'
          ? <source key={i} src={s} /> : <source key={i} src={s.src} type={s.type} />)}
        {subtitles?.map((sub, i) => (<track key={i} kind="subtitles" label={sub.label} srcLang={sub.srclang} src={sub.src} />))}
      </video>
      {isCasting && <CastOverlay castDeviceName={castDeviceName} title={title} />}
      {loading && <LoadingOverlay />}
      {!loading && <CenterPlayOverlay playing={playing} />}
      {cueText && <SubtitleOverlay cueText={cueText} effectiveControls={effectiveControls} subtitleFontSize={subtitleFontSize} />}
      <div className={cn('absolute inset-0 flex flex-col justify-end transition-opacity duration-300 z-20', effectiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={(e) => { if (e.target === e.currentTarget && !isCasting) togglePlay(); }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)' }} />
        {showSettings && (
          <SettingsPanel ref={settingsPanelRef} view={settingsView} onChangeView={setSettingsView}
            qualities={qualities} subtitles={subtitles} audioTracks={audioTracks}
            selectedQuality={selectedQuality} selectedSubtitle={selectedSubtitle} selectedAudioTrack={selectedAudioTrack}
            speed={speed} subtitleFontSize={subtitleFontSize}
            applyQuality={applyQuality} applySpeed={applySpeed} applySubtitle={applySubtitle}
            applySubtitleSize={applySubtitleSize} applyAudioTrack={applyAudioTrack} />
        )}
        <div className="relative px-4 pb-3 pt-6 space-y-2.5">
          {title && (<p className="text-white/90 text-sm font-medium truncate leading-tight">{title}</p>)}
          <ProgressBar ref={progressRef} progress={progress} buffered={buffered} seekHoverX={seekHoverX} seekHoverPct={seekHoverPct}
            hoverTime={hoverTime} onSeek={handleSeek} onSeekMouseMove={handleSeekMouseMove} onSeekLeave={() => setSeekHoverX(null)} />
          <ControlRow playing={playing} muted={muted} volume={volume} currentTime={currentTime} duration={duration}
            isFullscreen={isFullscreen} showSettings={showSettings} enableCast={enableCast} castState={castState}
            onPlay={togglePlay} onSeekBy={seekBy} onToggleMute={toggleMute} onVolumeChange={handleVolumeChange}
            onToggleSettings={() => { setShowSettings((v) => !v); setSettingsView('main'); }}
            onToggleCast={toggleCast} onToggleFullscreen={toggleFullscreen} />
        </div>
      </div>
    </div>
  );
}
