import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Calendar, Trophy, Users, ChevronRight, Play, Clock, Star, TrendingUp, Target, Globe, Shield, Zap, X, HelpCircle, ChevronDown } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MatchCard from '../components/MatchCard';
import TelegramBanner from '../components/TelegramBanner';
import ShareSection from '../components/ShareSection';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { Skeleton } from '../components/ui/skeleton';
import { fetchMatches } from '../services/matchesService';
import { isMatchLive, isMatchToday, isMatchFinished } from '../utils/dateUtils';
import { useLanguage } from '../contexts/LanguageContext';
import type { Match } from '../types/match';
import { Flame, Radio} from 'lucide-react';



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






const FAQSection = () => {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqItems = [
    {
      id: 'watch-matches',
      question: t('howToWatchMatches'),
      answer: t('howToWatchAnswer')
    },
    {
      id: 'free-service',
      question: t('isKikaFree'),
      answer: t('isKikaFreeAnswer')
    },
    {
      id: 'coverage',
      question: t('whichLeagues'),
      answer: t('whichLeaguesAnswer')
    },
    {
      id: 'mobile-support',
      question: t('mobileSupport'),
      answer: t('mobileSupportAnswer')
    },
    {
      id: 'upcoming-matches',
      question: t('findUpcoming'),
      answer: t('findUpcomingAnswer')
    },
    {
      id: 'streaming-issues',
      question: t('streamingIssues'),
      answer: t('streamingIssuesAnswer')
    }
  ];

  return (
    <div className="space-y-3">
      {faqItems.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900 text-left">{item.question}</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openItems[item.id] ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openItems[item.id] && (
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Index = () => {
  const { t } = useLanguage();
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const [showTelegramBanner, setShowTelegramBanner] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const matchesData = await fetchMatches();
        setMatches(matchesData);

        // Find live matches first
        const live = matchesData.filter(match => 
          match.score.status === "LIVE" || 
          isMatchLive(match.kickoff.date, match.kickoff.time, match.score.status)
        );
        setLiveMatches(live);

        // Get upcoming matches (exclude live matches)
        const upcoming = matchesData.filter(match => 
          match.score.status === "" && 
          !live.some(liveMatch => liveMatch.id === match.id)
        );
        setUpcomingMatches(upcoming);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        // Increase loading time to 8 seconds for better UX
        setTimeout(() => {
          setLoading(false);
        }, 8000);
      }
    };
    loadMatches();
  }, []);

  // Load Twitter widgets script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Load league table widget script
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.appHeight && event.data.inst === '48730') {
        const container = document.querySelector('#scoreaxis-widget-48730 iframe') as HTMLIFrameElement;
        if (container) {
          container.style.height = parseInt(event.data.appHeight) + 'px';
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Create sidebar data structure matching the image layout
  const leagues = [
    { id: "uefa-cl", name: t('uefaChampionsLeague') },
    { id: "uefa-el", name: t('uefaEuropaLeague') },
    { id: "premier", name: t('premierLeague') },
    { id: "la-liga", name: t('laLiga') },
    { id: "serie-a", name: t('serieA') },
    { id: "pro-league", name: t('proLeague') },
    { id: "eredivisie", name: t('eredivisie') },
    { id: "fa-cup", name: t('faCup') }
  ];

  const teams = [
    { id: "man-city", name: t('manchesterCity'), color: "#6CABDD" },
    { id: "man-utd", name: t('manchesterUnited'), color: "#DA020E" },
    { id: "chelsea", name: t('chelsea'), color: "#034694" },
    { id: "bayern", name: t('bayernMunchen'), color: "#DC052D" },
    { id: "bayer", name: t('bayerLeverkusen'), color: "#E32221" },
    { id: "napoli", name: t('napoli'), color: "#087FD1" },
    { id: "inter", name: t('inter'), color: "#0068A8" },
    { id: "marseille", name: t('marseille'), color: "#2FAEE0" },
    { id: "psg", name: t('parisStGermain'), color: "#004170" },
    { id: "real", name: t('realMadrid'), color: "#FEBE10" }
  ];

  // Get hot matches first (exclude live matches)
  const hotMatches = matches.filter(match => 
    match.score.type === "HOT" && 
    !liveMatches.some(liveMatch => liveMatch.id === match.id)
  ).slice(0, 3);

  // Exclude both live and hot matches from all matches section
  const allMatches = upcomingMatches.filter(match => 
    !hotMatches.some(hotMatch => hotMatch.id === match.id)
  );

  const SkeletonMatchCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-12" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );

  const SkeletonSidebar = () => (
    <aside className="hidden lg:block w-64 bg-sport-sidebar p-4 min-h-screen border-r border-sport-border">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-16" />
        </div>
        <ul className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="flex items-center gap-2 px-3 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-12" />
        </div>
        <ul className="space-y-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="flex items-center gap-2 px-3 py-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-sport-background">
        <Navbar />
        <div className="flex max-w-7xl mx-auto">
          <SkeletonSidebar />
          <main className="flex-1">
            <div className="p-4 lg:p-6">
              {/* AdSense Banner Skeleton */}
              <div className="w-full mb-6">
                <Skeleton className="h-[200px] md:h-[250px] rounded-lg" />
              </div>

              {/* Share Section Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-20 rounded-xl" />
              </div>

              {/* Live Matches Section Skeleton */}
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonMatchCard key={i} />
                  ))}
                </div>
              </section>

              {/* Hot Matches Section Skeleton */}
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonMatchCard key={i} />
                  ))}
                </div>
              </section>

              {/* All Matches Section Skeleton */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonMatchCard key={i} />
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Free Football Streaming | Live Soccer TV HD & Sports Chat</title>
        <meta name="description" content="Enjoy free football live stream in HD! Live soccer TV, football match today, sports streaming, and fan chat, no sign-up, watch instantly" />
        <link rel="canonical" href={window.location.origin} />
        <meta property="og:title" content="Free Football Streaming | Live Soccer TV HD & Sports Chat" />
        <meta property="og:description" content="Enjoy free football live stream in HD! Live soccer TV, football match today, sports streaming, and fan chat, no sign-up, watch instantly" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:image" content="public/cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Football Streaming | Live Soccer TV HD & Sports Chat" />
        <meta name="twitter:description" content="Enjoy free football live stream in HD! Live soccer TV, football match today, sports streaming, and fan chat, no sign-up, watch instantly" />
        <meta name="twitter:image" content="/public/cover.png" />
      </Helmet>

      <div className="min-h-screen bg-sport-background">


        <Navbar />

        {/* <main className="container mx-auto max-w-7xl">
              <AdSenseBanner />
        </main> */}


        <div className="flex max-w-7xl mx-auto">
          {/* Sidebar - Hidden on mobile */}
          <aside className="bg-gradient-to-br from-sport-card/40 to-sport-card/20 rounded-2xl p-4 mt-6 mb-6 border border-sport-muted/20">
            {/* Leagues Section */}
            <div className="mb-8 font-bold text-gray-900">
              <div className="flex items-center gap-2 mb-4" >
                <Trophy className="w-5 h-5 hover:text-sport-primary" />
Top leagues              <h2 className="font-bold text-gray-900">{t('leagues')}</h2>
              </div>
              <ul className="space-y-1">
                {leagues.map(league => (
                  <li key={league.id}>
                    <a href="" className="flex items-center gap-2 px-3 py-2 text-sm !text-black font-medium hover:text-sport-primary rounded-lg transition-colors">
                      <Trophy className="w-4 h-4" />
                      {league.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Teams Section */}
            <div className="mb-8 font-bold text-gray-900">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 hover:text-sport-primary" />
                Top leagues              <h2 className="font-bold text-gray-900">{t('leagues')}</h2>
              </div>
              <ul className="space-y-1">
                {teams.map(team => (
                  <li key={team.id}>
                    <a href="" className="flex items-center gap-2 px-3 py-2 text-sm !text-black font-medium hover:text-sport-primary rounded-lg transition-colors">
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.name.charAt(0)}
                      </div>
                      {team.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* League Table Widget */}



          </aside>

          {/* Main Content */}
          <main className="flex-1">

            <div className="p-4 lg:p-6">

              <AdSenseBanner />

              {/* Share Section */}
              <ShareSection />

              {/* Live Matches Section - Show first when there are live matches */}
              {liveMatches.length > 0 && (
                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                   {<Radio className="w-6 h-6 text-green-500" />}
                    <span className="text-lg font-bold text-sport-text">{t('liveMatchesSection')}</span>
                  </div>
                  <div className="space-y-3">
                    {liveMatches.map(match => (
                      <MatchCard key={match.id} match={match} variant="thin" />
                    ))}
                  </div>
                </section>
              )}

              {/* Hot Match Section - Only show if there are hot matches */}
              {hotMatches.length > 0 && (
                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                  {<Flame className="w-6 h-6 text-red-500" />}
                    <span className="text-lg font-bold text-sport-text">{t('hotMatchesSection')}</span>
                  </div>
                  <div className="space-y-3">
                    {hotMatches.map(match => (
                      <MatchCard key={match.id} match={match} variant="thin" />
                    ))}
                  </div>
                </section>
              )}


              {/* All Matches Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                {<Calendar className="w-6 h-6 text-blue-500" />}
                  <span className="text-lg font-bold text-sport-text">{t('Other Matches')}</span>
                </div>
                <div className="space-y-3">
                  {allMatches.length > 0 ? allMatches.map(match => (
                    <MatchCard key={match.id} match={match} variant="thin" />
                  )) : (
                    <div className="bg-sport-card border border-sport-border rounded-xl p-4 text-center">
                      <p className="text-sport-text-light text-sm">{t('noMatches')}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* tt News Section */}
              {/* <section className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sport-primary">📰</span>
                  <span className="text-lg font-semibold text-sport-text">Latest News</span>
                </div>
                <div className="bg-sport-card border border-sport-border rounded-xl p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span className="text-sport-text font-medium">Football Transfer News</span>
                  </div>
                  <div className="twitter-embed-container">
                    <a 
                      className="twitter-timeline" 
                      href="https://twitter.com/FabrizioRomano?ref_src=twsrc%5Etfw"
                      data-height="400"
                      data-theme="light"
                      data-chrome="noheader nofooter noborders"
                    >
                      Tweets by FabrizioRomano
                    </a>
                  </div>
                </div>
              </section> */}




              {/* About Us Section */}
              <section className="mt-8 md:mt-12">
                <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 text-red-500 rounded-lg">
                      <Trophy className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('aboutTitle')}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-1 h-6 text-red-500 rounded-full"></div>
                          {t('ourMission')}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {t('missionContent')}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {t('goalContent')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 text-red-500 rounded-full"></div>
                        {t('whatWeOffer')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 text-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium">{t('liveStreamsDesc')}</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 text-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium">{t('catchUpOnHighlights')}</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 text-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium">{t('detailedCalendar')}</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 text-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium">{t('userFriendlyDesc')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              {/* <section className="mt-8 md:mt-12">
                <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 text-red-500 rounded-lg">
                      <HelpCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('frequentlyAskedQuestions')}</h2>
                  </div>

                  <FAQSection />
                </div>
              </section> */}

            </div>
          </main>
        </div>

        <TelegramBanner 
          isVisible={showTelegramBanner} 
          onClose={() => setShowTelegramBanner(false)} 
        />

        <PWAInstallPrompt />

        <Footer />
      </div>
    </>
  );
};

export default Index;