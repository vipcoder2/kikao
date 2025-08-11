import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import LiveStreamViewer from "../components/LiveStreamViewer";
import StreamQualitySelector from "../components/StreamQualitySelector";
import TelegramBanner from "../components/TelegramBanner";
import { fetchMatches } from "../services/matchesService";
import { Match } from "../types/match";
import { useLanguage } from "../contexts/LanguageContext";
import { formatMatchDate } from "../utils/dateUtils";
import { Calendar, MapPin, Trophy, Star, Play, Clock, AlertTriangle, X, Theater, Minimize, Monitor, Smartphone, Wifi, Globe, TrendingUp, Settings, MessageCircle } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import CountdownTimer from "../components/CountdownTimer";
import PollsVoting from "../components/PollsVoting";
import MatchChat from "../components/MatchChat";
// import { isMatchLive, getLocalDateTime } from "../utils/dateUtils";

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// AdSense Banner Component - Clean white design
interface TabsSectionProps {
  match: Match;
  getAvailableStreams: () => any[];
  activeStreamUrl: string;
  onStreamChange: (url: string, quality: "hd" | "sd" | "mobile", type: "hls" | "mobile-hls" | "iframe") => void;
  onMobileWarning: () => void;
  toggleTheaterMode: () => void;
  t: (key: string) => string;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  match,
  getAvailableStreams,
  activeStreamUrl,
  onStreamChange,
  onMobileWarning,
  toggleTheaterMode,
  t
}) => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none border-b border-gray-200">
          <TabsTrigger
            value="polls"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Poll</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="streams"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="polls" className="mt-0 p-0">
          <PollsVoting match={match} />
        </TabsContent>

        <TabsContent value="chat" className="mt-0 p-0">
          <div style={{ height: '500px' }}>
            <MatchChat matchId={match.id} />
          </div>
        </TabsContent>

        <TabsContent value="streams" className="mt-0 p-4">
          {match.score.status === "LIVE" ? (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-red-500" />
                  <span>{t('streamSources')}</span>
                </h3>

                <button
                  onClick={toggleTheaterMode}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 self-start md:self-auto"
                  title={t('theaterMode')}
                >
                  <Theater className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium text-sm md:text-base">{t('theaterMode')}</span>
                </button>
              </div>

              <StreamQualitySelector
                streams={getAvailableStreams()}
                activeStream={activeStreamUrl}
                onStreamChange={onStreamChange}
                onMobileWarning={onMobileWarning}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Stream Sources</h3>
              <p className="text-gray-500 text-sm">
                Stream sources will be available when the match goes live
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AdSenseBanner = () => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adHeight, setAdHeight] = useState(0);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const adElements = document.querySelectorAll('.main-ad-banner .adsbygoogle');
      const hasLoadedAd = Array.from(adElements).some(el =>
        el.getAttribute('data-adsbygoogle-status') === 'done'
      );

      if (!hasLoadedAd) {
        setAdError(true);
      } else {
        setAdLoaded(true);
      }
    }, 3000);

    if (!isMobile || !adRef.current) { // Only attempt to push ads if on mobile and ref is available
      if (typeof window !== 'undefined') {
        try {
          setTimeout(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }, 100);
        } catch (err) {
          console.error('AdSense error:', err);
          setAdError(true);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [isMobile]); // Rerun effect when isMobile changes

  // Resize observer logic moved to a separate effect that depends on isMobile and adLoaded
  useEffect(() => {
    if (!isMobile || !adRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        setAdHeight(height);
      }
    });

    const adElement = adRef.current.querySelector('.adsbygoogle');
    if (adElement) {
      observer.observe(adElement);
    }

    return () => observer.disconnect();
  }, [isMobile]); // Observe when isMobile changes

  if (adError) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      {isMobile && (
        <div
          ref={adRef}
          className="main-ad-banner bg-gray-50 rounded-lg border border-gray-200 overflow-hidden relative flex justify-center items-center"
          style={{
            minHeight: adLoaded && adHeight > 0 ? `${adHeight}px` : '200px',
            height: adLoaded && adHeight > 0 ? 'auto' : '200px'
          }}
        >
          <div className="relative w-full flex justify-center">
            <ins
              className="adsbygoogle block"
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '400px'
              }}
              data-ad-client="ca-pub-9955658533931358"
              data-ad-slot="7180274959"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />

            {!adLoaded && !adError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-500 text-sm">Loading ad...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="main-ad-banner bg-gray-50 rounded-lg border border-gray-200 overflow-hidden relative flex justify-center items-center min-h-[250px]">
          <div className="relative w-full flex justify-center">
            <ins
              className="adsbygoogle block"
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '728px'
              }}
              data-ad-client="ca-pub-9955658533931358"
              data-ad-slot="7180274959"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />

            {!adLoaded && !adError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-500 text-sm">Loading ad...</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const WatchMatch = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string; }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string>("");
  const [activeStreamQuality, setActiveStreamQuality] = useState<"hd" | "sd" | "mobile">("hd");
  const [activeStreamType, setActiveStreamType] = useState<"hls" | "mobile-hls" | "iframe">("hls");
  const [loading, setLoading] = useState(true);
  const [showTelegramBanner, setShowTelegramBanner] = useState(false); // State to control Telegram banner visibility
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [theaterMode, setTheaterMode] = useState(false);

  // State to manage the last time the Telegram banner was shown
  const [lastTelegramBannerShow, setLastTelegramBannerShow] = useState<number | null>(null);

  useEffect(() => {
    const loadMatch = async () => {
      try {
        const matchesData = await fetchMatches();
        const foundMatch = matchesData.find(m => m.id === id);
        if (foundMatch) {
          setMatch(foundMatch);
          selectOptimalStream(foundMatch);
        }
      } catch (error) {
        console.error("Error loading match:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatch();
  }, [id]);

  // Show Telegram banner when video starts playing
  const handleVideoPlay = () => {
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if the banner has been shown in the last 30 minutes
    if (match && !loading && (lastTelegramBannerShow === null || now - lastTelegramBannerShow > thirtyMinutes)) {
      setShowTelegramBanner(true);
      setLastTelegramBannerShow(now); // Record the time the banner is shown
      // Optionally, hide the banner after a certain duration or if the user interacts
      setTimeout(() => {
        setShowTelegramBanner(false);
      }, 5000); // Hide after 5 seconds
    }
  };

  const selectOptimalStream = (match: Match) => {
    const isMobile = window.innerWidth <= 768;

    // Priority order: mobile streams for mobile devices (if available), then regular HLS, then iframe
    if (isMobile && match.streams.mhls1) {
      console.log('Setting initial mobile stream for mobile device:', match.streams.mhls1);
      setActiveStreamUrl(match.streams.mhls1);
      setActiveStreamQuality("mobile");
      setActiveStreamType("mobile-hls");
    } else if (match.streams.hls1) {
      console.log('Setting initial HLS stream (works on mobile and desktop):', match.streams.hls1);
      setActiveStreamUrl(match.streams.hls1);
      setActiveStreamQuality("hd");
      setActiveStreamType("hls");
    } else if (match.streams.hls2) {
      console.log('Setting initial HLS stream (server 2):', match.streams.hls2);
      setActiveStreamUrl(match.streams.hls2);
      setActiveStreamQuality("sd");
      setActiveStreamType("hls");
    } else if (match.streams.src1) {
      console.log('Setting initial iframe stream:', match.streams.src1);
      setActiveStreamUrl(match.streams.src1);
      setActiveStreamQuality("hd");
      setActiveStreamType("iframe");
    }
  };

  const handleStreamChange = (url: string, quality: "hd" | "sd" | "mobile", type: "hls" | "mobile-hls" | "iframe") => {
    console.log('Stream change requested:', { url, quality, type });

    setStreamLoading(true);
    if (type === "hls") {
      setLoadingMessage(`Loading HLS ${quality.toUpperCase()} stream...`);
    } else if (type === "mobile-hls") {
      setLoadingMessage(`Loading Mobile ${quality.toUpperCase()} stream...`);
    } else if (type === "iframe") {
      setLoadingMessage(`Loading ${quality === "hd" ? "server 1" : "server 2"}...`);
    }

    // Simulate loading delay for stream change
    setTimeout(() => {
      setActiveStreamUrl(url);
      setActiveStreamQuality(quality);
      setActiveStreamType(type);
      setStreamLoading(false);
      setLoadingMessage("");
      console.log('Stream state updated to:', { url, quality, type });
    }, 800);
  };

  const handleMobileWarning = () => {
    setShowMobileWarning(true);
    setTimeout(() => {
      setShowMobileWarning(false);
    }, 3000);
  };

  const getAvailableStreams = () => {
    if (!match) return [];
    const streams = [];

    if (match.streams.hls1) {
      streams.push({
        id: "hls-hd",
        name: "server 1",
        url: match.streams.hls1,
        quality: "hd" as const,
        type: "hls" as const
      });
    }
    if (match.streams.hls2) {
      streams.push({
        id: "hls-sd",
        name: "server 2",
        url: match.streams.hls2,
        quality: "sd" as const,
        type: "hls" as const
      });
    }

    if (match.streams.mhls1) {
      streams.push({
        id: "mobile-hd",
        name: "server 1",
        url: match.streams.mhls1,
        quality: "mobile" as const,
        type: "mobile-hls" as const
      });
    }
    if (match.streams.mhls2) {
      streams.push({
        id: "mobile-sd",
        name: "server 2",
        url: match.streams.mhls2,
        quality: "mobile" as const,
        type: "mobile-hls" as const
      });
    }

    if (match.streams.src1) {
      streams.push({
        id: "iframe-1",
        name: "server 1",
        url: match.streams.src1,
        quality: "hd" as const,
        type: "iframe" as const
      });
    }
    if (match.streams.src2) {
      streams.push({
        id: "iframe-2",
        name: "server 2",
        url: match.streams.src2,
        quality: "sd" as const,
        type: "iframe" as const
      });
    }
    console.log('Available streams:', streams);
    return streams;
  };

  const toggleTheaterMode = () => {
    setTheaterMode(!theaterMode);
  };

  const getStreamTypeIcon = (type: string) => {
    switch (type) {
      case "mobile-hls":
        return <Smartphone className="w-3 h-3 md:w-4 md:h-4" />;
      case "hls":
        return <Wifi className="w-3 h-3 md:w-4 md:h-4" />;
      case "iframe":
        return <Globe className="w-3 h-3 md:w-4 md:h-4" />;
      default:
        return <Monitor className="w-3 h-3 md:w-4 md:h-4" />;
    }
  };

  const getStreamButtonStyle = (stream: any, isActive: boolean) => {
    if (isActive) {
      return "bg-red-500 text-white border-red-500 shadow-sm";
    }
    switch (stream.type) {
      case "mobile-hls":
        return "bg-white hover:bg-purple-50 text-white hover:text-purple-700 border-gray-200 hover:border-purple-300";
      case "hls":
        return "bg-white hover:bg-blue-50 text-white hover:text-blue-700 border-gray-200 hover:border-blue-300";
      case "iframe":
        return "bg-white hover:bg-green-50 text-white hover:text-green-700 border-gray-200 hover:border-green-300";
      default:
        return "bg-white hover:bg-gray-50 text-white hover:text-gray-700 border-gray-200 hover:border-gray-300";
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && theaterMode) {
        setTheaterMode(false);
      }
    };
    if (theaterMode) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [theaterMode]);

  const SkeletonPlayer = () => (
    <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden shadow-2xl border border-gray-700 rounded-3xl">
      <Skeleton className="w-full h-full" />
    </div>
  );

  const SkeletonMatchHeader = () => (
    <div className="mb-6">
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );

  const SkeletonStreamControls = () => (
    <div className="mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );

  const SkeletonMatchInfo = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-5 w-5" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-sport-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* AdSense Banner Skeleton */}
          <div className="w-full mb-6">
            <Skeleton className="h-[200px] md:h-[250px] rounded-lg" />
          </div>

          <SkeletonMatchHeader />

          {/* Polls & Voting Section Skeleton - Mobile */}
          <div className="mb-8 md:hidden">
            <Skeleton className="h-32 rounded-lg" />
          </div>

          {/* Player Skeleton */}
          <div className="mb-8">
            <SkeletonPlayer />
          </div>

          <SkeletonStreamControls />

          {/* Polls & Voting Section Skeleton - Desktop */}
          <div className="mb-2 hidden md:block mt-10">
            <Skeleton className="h-32 rounded-lg" />
          </div>

          {/* AdSense Banner Skeleton */}
          <div className="w-full mb-6">
            <Skeleton className="h-[200px] md:h-[250px] rounded-lg" />
          </div>

          <SkeletonMatchInfo />
        </main>
        <Footer />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('matchNotFound')}</h2>
            <Link to="/" className="text-red-500 hover:text-red-600">
              {t('returnToHomepage')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Watch ${match.clubs.home.name} vs ${match.clubs.away.name} Live Stream HD Free Online`}</title>
        <meta name="description" content={`Watch ${match.clubs.home.name} vs ${match.clubs.away.name} live stream in HD quality for free. ${match.competition.name} match streaming online with multiple sources and real-time updates.`} />
        <link rel="canonical" href={`${window.location.origin}/watch/${id}`} />
        <meta name="keywords" content={`${match.clubs.home.name} vs ${match.clubs.away.name}, live stream, ${match.competition.name}, football streaming, watch online free, HD quality`} />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={`Watch ${match.clubs.home.name} vs ${match.clubs.away.name} Live Stream HD`} />
        <meta property="og:description" content={`Watch ${match.clubs.home.name} vs ${match.clubs.away.name} live stream in HD quality for free. ${match.competition.name} match streaming online.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/watch/${id}`} />
        <meta property="og:image" content="https://i.ibb.co/sdC85N9X/Kikasports-cover.png" />
        <meta property="og:site_name" content="KoraSports" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Watch ${match.clubs.home.name} vs ${match.clubs.away.name} Live Stream HD`} />
        <meta name="twitter:description" content={`Watch ${match.clubs.home.name} vs ${match.clubs.away.name} live stream in HD quality for free. ${match.competition.name} match streaming online.`} />
        <meta name="twitter:image" content="https://i.ibb.co/sdC85N9X/Kikasports-cover.png" />
      </Helmet>

      <div className="min-h-screen bg-sport-background">
        <Navbar />

        {theaterMode && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="hidden md:flex items-center justify-between p-4 bg-black/80 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <img src={match.clubs.home.logo} alt={match.clubs.home.name} className="w-6 h-6 object-contain" />
                <span className="text-white font-medium text-sm">
                  {match.clubs.home.name} vs {match.clubs.away.name}
                </span>
                <img src={match.clubs.away.logo} alt={match.clubs.away.name} className="w-6 h-6 object-contain" />
                {match.score.status === "LIVE" && (
                  <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-medium text-xs">LIVE</span>
                  </div>
                )}
              </div>

              {match.score.status === "LIVE" && getAvailableStreams().length > 0 && (
                <div className="flex items-center gap-2">
                  {getAvailableStreams().map(stream => {
                    const isActive = activeStreamUrl === stream.url;
                    return (
                      <button
                        key={stream.id}
                        onClick={() => handleStreamChange(stream.url, stream.quality, stream.type)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 flex items-center gap-1.5 border ${
                          isActive ? 'bg-red-500 text-white border-red-500' : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {getStreamTypeIcon(stream.type)}
                        <span className="font-medium">{stream.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={toggleTheaterMode}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/60"
                title="Exit Theater Mode (Esc)"
              >
                <X className="w-4 h-4" />
                <span className="text-xs font-medium">Exit</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="min-h-full flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl mx-auto aspect-video">
                  <LiveStreamViewer
                    match={match}
                    streamUrl={activeStreamUrl}
                    streamQuality={activeStreamQuality}
                    streamType={activeStreamType}
                    onVideoPlay={handleVideoPlay} // Pass the handler here
                  />
                </div>
              </div>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 border-t border-gray-800 max-h-[40vh] overflow-y-auto">
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <img src={match.clubs.home.logo} alt={match.clubs.home.name} className="w-5 h-5 object-contain" />
                  <span className="text-white font-medium text-sm">
                    {match.clubs.home.name} vs {match.clubs.away.name}
                  </span>
                  <img src={match.clubs.away.logo} alt={match.clubs.away.name} className="w-5 h-5 object-contain" />
                  {match.score.status === "LIVE" && (
                    <div className="flex items-center gap-1 bg-red px-2 py-1 rounded-full">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium text-xs">LIVE</span>
                    </div>
                  )}
                </div>

                {match.score.status === "LIVE" && getAvailableStreams().length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {getAvailableStreams().map(stream => {
                      const isActive = activeStreamUrl === stream.url;
                      return (
                        <button
                          key={stream.id}
                          onClick={() => handleStreamChange(stream.url, stream.quality, stream.type)}
                          className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                            isActive ? 'bg-red-500 text-white border-red-500' : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                          }`}
                        >
                          {getStreamTypeIcon(stream.type)}
                          <span className="font-medium">{stream.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={toggleTheaterMode}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/60"
                  title="Exit Theater Mode (Esc)"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">Exit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {!theaterMode && (
          <>
            {streamLoading && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-gray-800 font-medium">{loadingMessage}</p>
                </div>
              </div>
            )}

            {showMobileWarning && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-800">Mobile Only Stream</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    This stream source is optimized for mobile devices only and may not work properly on desktop browsers.
                  </p>
                  <button
                    onClick={() => setShowMobileWarning(false)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}

            <main className="container mx-auto px-4 py-6 max-w-7xl">
              <AdSenseBanner />

              <div className="mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {t('watchLiveText')} : {match.clubs.home.name} {t('vs')} {match.clubs.away.name}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    {t('liveStreamsDesc')} {match.clubs.home.name} {t('vs')} {match.clubs.away.name}.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="lg:col-span-3 relative">
                  <LiveStreamViewer
                    match={match}
                    streamUrl={activeStreamUrl}
                    streamQuality={activeStreamQuality}
                    streamType={activeStreamType}
                    onVideoPlay={handleVideoPlay} // Pass the handler here
                  />

                  
                </div>
              </div>

              {/* Telegram Banner - positioned at page level outside player */}
              {showTelegramBanner && (
                <TelegramBanner
                  isVisible={showTelegramBanner}
                  onClose={() => setShowTelegramBanner(false)}
                />
              )}

              {/* Tabs Section - Only show when match is live */}
              {match.score.status === "LIVE" && (
                <div className="mb-8">
                  <TabsSection
                    match={match}
                    getAvailableStreams={getAvailableStreams}
                    activeStreamUrl={activeStreamUrl}
                    onStreamChange={handleStreamChange}
                    onMobileWarning={handleMobileWarning}
                    toggleTheaterMode={toggleTheaterMode}
                    t={t}
                  />
                </div>
              )}

               <AdSenseBanner />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Star className="w-6 h-6 text-red-500" />
                    <span>{t('matchInformation')}</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-gray-500 text-sm font-medium">{t('dateTime')}</p>
                        <p className="text-gray-800 font-medium">{formatMatchDate(match.kickoff.date, match.kickoff.time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-gray-500 text-sm font-medium">{t('stadium')}</p>
                        <p className="text-gray-800 font-medium">{match.venue.name}</p>
                        <p className="text-gray-500 text-sm">{match.venue.city}, {match.venue.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Play className="w-6 h-6 text-red-500" />
                    <span>Live Streaming Details</span>
                  </h3>

                  <div className="space-y-4 text-gray-600">
                    <div className="text-gray-600 leading-relaxed mb-4">
                      Experience the excitement of <strong className="text-gray-800">{match.clubs.home.name}</strong> vs <strong className="text-gray-800">{match.clubs.away.name} </strong>
                      with our premium HD live streaming service. This {match.competition.name} match brings together two competitive teams
                      at the prestigious {match.venue.name} stadium.
                    </div>
                    <div className="text-gray-600 leading-relaxed mb-4">
                      Our streaming platform offers multiple viewing options including HD, SD, and mobile-optimized streams to ensure
                      the best possible viewing experience on any device. Watch with real-time commentary and live match statistics
                      for a complete football experience.
                    </div>
                    {match.score.status === "LIVE" && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                        <div className="text-red-600 font-semibold flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Live streaming is available now! Join thousands of fans watching online.</span>
                        </div>
                      </div>
                    )}
                    <div className="text-gray-600 text-sm">
                      Looking for more matches? Check our <a href="/" className="text-red-500 hover:text-red-600 underline">homepage</a> for
                      live games or browse our <a href="/schedule" className="text-red-500 hover:text-red-600 underline">fixture schedule</a> for
                      upcoming matches.
                    </div>
                  </div>
                </div>
              </div>



            </main>

            

            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default WatchMatch;