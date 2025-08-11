import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import Hls from 'hls.js';
import Artplayer from 'artplayer';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';

interface HLSPlayerProps {
  src: string;
  title: string;
  streamQuality: "hd" | "sd" | "mobile";
  onVideoPlay?: () => void;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src, title, streamQuality, onVideoPlay }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const artPlayerRef = useRef<Artplayer | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRY_ATTEMPTS = 5;
  const RETRY_DELAY = 2000;

  // Retry mechanism
  const retryConnection = useCallback(() => {
    if (reconnectAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
      setError('Stream connection failed after multiple attempts');
      setIsRetrying(false);
      return;
    }

    reconnectAttemptsRef.current++;
    setRetryCount(reconnectAttemptsRef.current);
    setIsRetrying(true);
    setError(null);

    const delay = RETRY_DELAY * Math.pow(1.5, reconnectAttemptsRef.current - 1);

    retryTimeoutRef.current = setTimeout(() => {
      console.log(`Retry attempt ${reconnectAttemptsRef.current}/${MAX_RETRY_ATTEMPTS}`);
      setupPlayer();
    }, delay);
  }, []);

  const resetRetryCounter = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setRetryCount(0);
    setIsRetrying(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  // Setup ArtPlayer
  const setupPlayer = useCallback(async () => {
    if (!src || !containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Clean up existing instance
      if (artPlayerRef.current) {
        artPlayerRef.current.destroy();
        artPlayerRef.current = null;
      }

      console.log('Setting up ArtPlayer for:', src);

      const art = new Artplayer({
        container: containerRef.current,
        url: src,
        type: 'm3u8',
        volume: 1,
        isLive: true,
        muted: false,
        autoplay: false,
        pip: false,
        autoSize: true,
        autoMini: false,
        screenshot: true,
        setting: true,
        loop: false,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        airplay: true,
        theme: '#ff6b35',
        lang: 'en',
        moreVideoAttr: {
          crossOrigin: 'anonymous',
        },
        plugins: [
          artplayerPluginHlsControl({
            quality: {
              control: true,
              setting: true,
              getName: (level: any) => level.height ? level.height + 'P' : 'Auto',
              title: 'Quality',
              auto: 'Auto',
            },
            audio: {
              control: true,
              setting: true,
              getName: (track: any) => track.name || 'Default',
              title: 'Audio',
              auto: 'Auto',
            }
          }),
        ],
        customType: {
          m3u8: function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
            if (Hls.isSupported()) {
              if (art.hls) art.hls.destroy();
              const hls = new Hls({
                enableWorker: false,
                lowLatencyMode: false,
                backBufferLength: 60,
                maxBufferLength: 90,
                maxMaxBufferLength: 180,
                startLevel: -1,
                capLevelToPlayerSize: true,
                debug: false,
                manifestLoadingTimeOut: 15000,
                manifestLoadingMaxRetry: 4,
                manifestLoadingRetryDelay: 1500,
                levelLoadingTimeOut: 15000,
                levelLoadingMaxRetry: 4,
                levelLoadingRetryDelay: 1500,
                fragLoadingTimeOut: 30000,
                fragLoadingMaxRetry: 8,
                fragLoadingRetryDelay: 1500,
                liveSyncDurationCount: 5,
                liveMaxLatencyDurationCount: 15,
                nudgeOffset: 0.1,
                nudgeMaxRetry: 5,
                maxFragLookUpTolerance: 0.25,
                maxBufferHole: 0.5,
              });

              hls.loadSource(url);
              hls.attachMedia(video);
              art.hls = hls;

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('ArtPlayer HLS manifest parsed successfully');
                setIsLoading(false);
                resetRetryCounter();
              });

              hls.on(Hls.Events.ERROR, (event: any, data: any) => {
                console.error('ArtPlayer HLS error:', data);
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      console.log('Fatal network error, attempting to recover...');
                      if (data.details === 'bufferAppendError') {
                        setTimeout(() => hls.recoverMediaError(), 100);
                      } else {
                        retryConnection();
                      }
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      console.log('Fatal media error, attempting to recover...');
                      setTimeout(() => hls.recoverMediaError(), 100);
                      break;
                    default:
                      console.log('Fatal error, cannot recover');
                      retryConnection();
                      break;
                  }
                }
              });

              art.on('destroy', () => hls.destroy());
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              video.src = url;
              setIsLoading(false);
              resetRetryCounter();
            } else {
              art.notice.show = 'Unsupported playback format: m3u8';
              setError('Your browser does not support HLS streaming');
              setIsLoading(false);
            }
          }
        },
      });

      // Event listeners
      art.on('ready', () => {
        console.log('ArtPlayer ready');
        setIsLoading(false);
        resetRetryCounter();
      });

      art.on('error', (err: any) => {
        console.error('ArtPlayer error:', err);
        retryConnection();
      });

      art.on('play', () => {
        console.log('ArtPlayer playing');
        onVideoPlay?.();
      });

      art.on('canplay', () => {
        console.log('ArtPlayer can play');
        setIsLoading(false);
      });

      artPlayerRef.current = art;

    } catch (error) {
      console.error('ArtPlayer setup error:', error);
      retryConnection();
    }
  }, [src, retryConnection, resetRetryCounter, onVideoPlay]);

  // Initial setup
  useEffect(() => {
    setupPlayer();

    return () => {
      if (artPlayerRef.current) {
        artPlayerRef.current.destroy();
        artPlayerRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [setupPlayer]);

  const handleRetry = () => {
    reconnectAttemptsRef.current = 0;
    setRetryCount(0);
    setupPlayer();
  };

  if (!src) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-white text-lg font-semibold">No Stream Available</p>
          <p className="text-white text-sm mt-2">Please try selecting a different quality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden shadow-2xl border border-gray-700 rounded-3xl">
      {/* ArtPlayer container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Error overlay */}
      {error && !isRetrying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 z-30">
          <p className="text-white text-lg font-semibold mb-4">Stream Error</p>
          <p className="text-white/80 text-sm mb-6 text-center px-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default HLSPlayer;