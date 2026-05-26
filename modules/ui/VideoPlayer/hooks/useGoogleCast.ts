'use client';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type {
  CastState,
  CastFrameworkNs,
  ChromeCastNs,
  RemotePlayer,
  RemotePlayerController,
  VideoSource,
} from '../types';

type Options = {
  enableCast: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string | VideoSource | (string | VideoSource)[];
  title?: string;
  poster?: string;
  setPlaying: (v: boolean) => void;
  setCurrentTime: (v: number) => void;
  setDuration: (v: number) => void;
  setVolume: (v: number) => void;
  setMuted: (v: boolean) => void;
  onCastStateChange?: (state: CastState) => void;
};

function mapState(s: string): CastState {
  if (s === 'CONNECTED') return 'connected';
  if (s === 'CONNECTING') return 'connecting';
  if (s === 'NO_DEVICES_AVAILABLE') return 'unavailable';
  return 'available';
}

export function useGoogleCast({
  enableCast,
  videoRef,
  src,
  title,
  poster,
  setPlaying,
  setCurrentTime,
  setDuration,
  setVolume,
  setMuted,
  onCastStateChange,
}: Options) {
  const [castState, setCastState] = useState<CastState>('unavailable');
  const [castDeviceName, setCastDeviceName] = useState<string | null>(null);
  const remotePlayerRef = useRef<RemotePlayer | null>(null);
  const remoteControllerRef = useRef<RemotePlayerController | null>(null);

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

      const sync = () => {
        const next = mapState(context.getCastState());
        setCastState(next);
        const session = context.getCurrentSession();
        setCastDeviceName(
          next === 'connected' ? (session?.getCastDevice()?.friendlyName ?? null) : null,
        );
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
        remoteController.removeEventListener(
          framework.RemotePlayerEventType.ANY_CHANGE,
          syncRemote,
        );
      };
    };

    if (w.cast?.framework) {
      init();
    } else {
      const SCRIPT_ID = 'google-cast-sdk';
      w.__onGCastApiAvailable = (available: boolean) => {
        if (available) init();
      };
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cleanupListener?.();
    };
  }, [enableCast, setPlaying, setCurrentTime, setDuration, setVolume, setMuted]);

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
      const contentType = typeof first === 'string' ? 'video/mp4' : (first.type ?? 'video/mp4');

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
  }, [castState, src, title, poster, videoRef]);

  return {
    castState,
    castDeviceName,
    remotePlayerRef,
    remoteControllerRef,
    toggleCast,
  };
}
