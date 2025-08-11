import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import "@/utils/antiInspect";
import "@/utils/consoleWarning";
import { LanguageProvider } from "./contexts/LanguageContext";
// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveMatches from "./pages/LiveMatches";
import LiveScore from "./pages/LiveScore";
import Schedule from "./pages/Schedule";
import Competitions from "./pages/Competitions";
import WatchMatch from "./pages/WatchMatch";
import About from "./pages/About";
import YallaShoot from "./pages/YallaShoot";
import Score808 from "./pages/Score808";
import StreamEast from "./pages/StreamEast";
import TotalSportek from "./pages/TotalSportek";
import Hesgoal from "./pages/Hesgoal";
import KoraLive from "./pages/KoraLive";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import ContactUs from "./pages/ContactUs";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Switch>
                <Route path="/" component={Index} />
                <Route path="/live" component={LiveMatches} />
                <Route path="/live-score" component={LiveScore} />
                <Route path="/schedule" component={Schedule} />
                <Route path="/competitions" component={Competitions} />
                <Route path="/watch/:id" component={WatchMatch} />
                <Route path="/about" component={About} />
                <Route path="/yalla-shoot" component={YallaShoot} />
                <Route path="/score808" component={Score808} />
                <Route path="/streameast" component={StreamEast} />
                <Route path="/totalsportek" component={TotalSportek} />
                <Route path="/hesgoal" component={Hesgoal} />
                <Route path="/kora-live" component={KoraLive} />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route path="/disclaimer" component={Disclaimer} />
                <Route path="/contact-us" component={ContactUs} />
                <Route path="/terms-of-service" component={TermsOfService} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;