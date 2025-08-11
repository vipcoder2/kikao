import React, { useState, useEffect, useRef } from 'react';

interface IframePlayerProps {
  src: string;
  title: string;
  streamQuality: "hd" | "sd" | "mobile";
  onPlay?: () => void;
}

const IframePlayer: React.FC<IframePlayerProps> = ({ src, title, streamQuality, onPlay }) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;

      const handleLoad = () => {
        setIsLoading(false);
        // Simulate play event after iframe loads
        if (onPlay) {
          setTimeout(() => {
            onPlay();
          }, 2000);
        }
      };

      iframe.addEventListener('load', handleLoad);

      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [src, onPlay]);

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
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-pulse rounded-lg bg-gray-700 w-3/4 h-48"></div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default IframePlayer;