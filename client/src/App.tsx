import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { initFacebookPixel, initGoogleAnalytics } from "@/lib/tracking";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowsingProvider } from "./contexts/BrowsingContext";
import Home from "./pages/Home";
import GuideDetail from "./pages/GuideDetail";
import Magazine from "./pages/Magazine";
import MagazineArticle from "./pages/MagazineArticle";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import ChineseZodiac from "./pages/ChineseZodiac";
import Prediction2026 from "./pages/Prediction2026";
import CookieConsent from "./components/CookieConsent";
import BackToTop from "./components/BackToTop";
import AIChatAssistant from "./components/AIChatAssistant";
import AboutNatalie from "./pages/AboutNatalie";
import AmenPendants from "./pages/AmenPendants";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminChatbotAB from "./pages/AdminChatbotAB";
import AdminTickets from "./pages/AdminTickets";
import AdminTelegram from "./pages/AdminTelegram";


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
      <Route path="/magazin" component={Magazine} />
      <Route path="/magazin/:slug" component={MagazineArticle} />
      <Route path="/kviz" component={Quiz} />
      <Route path="/kviz/vysledek/:symbol" component={QuizResult} />
      <Route path="/cinsky-horoskop" component={ChineseZodiac} />
      <Route path="/predpoved-2026/:slug" component={Prediction2026} />
      <Route path="/o-nas" component={AboutNatalie} />
      <Route path="/privěsky-amen" component={AmenPendants} />
      <Route path="/admin/campaigns" component={AdminCampaigns} />
      <Route path="/admin/chatbot-ab" component={AdminChatbotAB} />
      <Route path="/admin/tickets" component={AdminTickets} />
      <Route path="/admin/telegram" component={AdminTelegram} />
      {/* Redirects for old/removed pages */}
      <Route path="/darujte-lasku">{() => <Redirect to="/" />}</Route>
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
        <BrowsingProvider>
          <ExitIntentPopup />
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
          <BackToTop />
          <AIChatAssistant />
        </TooltipProvider>
        </BrowsingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
