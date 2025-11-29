import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { initFacebookPixel, initGoogleAnalytics } from "@/lib/tracking";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GuideDetail from "./pages/GuideDetail";
import MagazineArticle from "./pages/MagazineArticle";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import CookieConsent from "./components/CookieConsent";
import BackToTop from "./components/BackToTop";

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/symbol/:slug" component={GuideDetail} />
      <Route path="/kamen/:slug" component={GuideDetail} />
      <Route path="/ucel/:slug" component={GuideDetail} />
      <Route path="/magazin/:slug" component={MagazineArticle} />
      <Route path="/kviz" component={Quiz} />
      <Route path="/kviz/vysledek/:symbol" component={QuizResult} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Initialize tracking pixels
  useEffect(() => {
    const fbPixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    
    if (fbPixelId) {
      initFacebookPixel(fbPixelId);
    }
    
    if (gaId) {
      initGoogleAnalytics(gaId);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
          <BackToTop />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
