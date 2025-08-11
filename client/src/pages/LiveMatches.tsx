
import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Trophy, Users, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MatchCard from "../components/MatchCard";
import TelegramBanner from "../components/TelegramBanner";
import { fetchMatches } from "../services/matchesService";
import { Match } from "../types/match";
import { isMatchLive } from "../utils/dateUtils";


// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// AdSense Banner Component - Clean white design
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
  }, [isMobile, adLoaded]);

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

    return () => clearTimeout(timer);
  }, [isMobile]);

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

            {/* <div className="absolute bottom-2 left-2">
              <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                Ad
              </span>
            </div> */}

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

            {/* <div className="absolute bottom-2 left-2">
              <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                Ad
              </span>
            </div> */}

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

const LiveMatches = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTelegramBanner, setShowTelegramBanner] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const matches = await fetchMatches();
        const live = matches.filter(match => 
          match.score.status === "LIVE" || isMatchLive(match.kickoff.date, match.kickoff.time, match.score.status)
        );
        setLiveMatches(live);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // Show Telegram banner after matches load
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowTelegramBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Create sidebar data structure matching the homepage layout
  const leagues = [
    { id: "uefa-cl", name: "UEFA Champions League" },
    { id: "uefa-el", name: "UEFA Europa League" },
    { id: "premier", name: "Premier League" },
    { id: "la-liga", name: "La Liga" },
    { id: "serie-a", name: "Serie A" },
    { id: "pro-league", name: "Pro League" },
    { id: "eredivisie", name: "Eredivisie" },
    { id: "fa-cup", name: "FA Cup" }
  ];

  const teams = [
    { id: "man-city", name: "Manchester City" },
    { id: "man-utd", name: "Manchester United" },
    { id: "chelsea", name: "Chelsea" },
    { id: "bayern", name: "Bayern München" },
    { id: "bayer", name: "Bayer Leverkusen" },
    { id: "napoli", name: "Napoli" },
    { id: "inter", name: "Inter" },
    { id: "marseille", name: "Marseille" },
    { id: "psg", name: "Paris Saint Germain" },
    { id: "real", name: "Real Madrid" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-sport-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-primary mx-auto mb-4"></div>
            <p className="text-sport-text-light">Loading live matches...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Live Football Matches - KikaSports</title>
        <meta name="description" content="Watch live football matches streaming now. Current live games from Premier League, Champions League, and more competitions." />
        <link rel="canonical" href={`${window.location.origin}/live`} />
      </Helmet>

      <div className="min-h-screen bg-sport-background">
        <Navbar />

        <div className="flex max-w-7xl mx-auto">
          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 bg-sport-sidebar p-4 min-h-screen border-r border-sport-border">
            {/* Leagues Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-sport-primary" />
                <h2 className="font-semibold text-sport-text">Leagues</h2>
              </div>
              <ul className="space-y-1">
                {leagues.map(league => (
                  <li key={league.id}>
                    <a href="" className="flex items-center gap-2 px-3 py-2 text-sm text-sport-text-light hover:text-sport-primary hover:bg-sport-card rounded-lg transition-colors">
                      <Trophy className="w-4 h-4" />
                      {league.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Teams Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-sport-primary" />
                <h2 className="font-semibold text-sport-text">Teams</h2>
              </div>
              <ul className="space-y-1">
                {teams.map(team => (
                  <li key={team.id}>
                    <a href="" className="flex items-center gap-2 px-3 py-2 text-sm text-sport-text-light hover:text-sport-primary hover:bg-sport-card rounded-lg transition-colors">
                      <div className="w-4 h-4 bg-sport-border rounded-full"></div>
                      {team.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="p-4 lg:p-6">

                                          <AdSenseBanner />

              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-sport-text">Live Matches</span>
                  <span className="text-sport-primary">🔴</span>
                </div>
                <p className="text-sport-text-light">Watch football matches currently being played live</p>
              </div>

              {/* Live Matches Section */}
              {liveMatches.length > 0 ? (
                <div className="space-y-3">
                  {liveMatches.map(match => (
                    <MatchCard key={match.id} match={match} variant="thin" />
                  ))}
                </div>
              ) : (
                <div className="bg-sport-card border border-sport-border rounded-xl p-8 text-center">
                  <div className="mb-4">
                    <Calendar className="w-12 h-12 text-sport-text-light mx-auto mb-2" />
                  </div>
                  <h3 className="text-xl font-bold text-sport-text mb-2">No Live Matches Right Now</h3>
                  <p className="text-sport-text-light mb-3">
                    There are no matches being played at the moment.
                  </p>
                  <p className="text-sport-text-light text-sm">
                    Check back later or view the <a href="/schedule" className="text-sport-primary hover:underline">upcoming schedule</a> to see when the next matches will be played.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Telegram Banner */}
        <TelegramBanner 
          isVisible={showTelegramBanner} 
          onClose={() => setShowTelegramBanner(false)} 
        />

        <Footer />
      </div>
    </>
  );
};

export default LiveMatches;
