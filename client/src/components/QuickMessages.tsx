import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Behavioral triggers pro rychlé zprávy
// Zprávy vyskakují z chatbot bubliny podle chování zákazníka

interface QuickMessage {
  id: string;
  message: string;
  trigger: "time" | "scroll" | "section" | "exit_intent" | "inactivity";
  triggerValue: number | string; // seconds for time, percentage for scroll, section name
  priority: number; // Higher = more important
  cta?: {
    text: string;
    action: "open_chat" | "navigate" | "custom";
    value?: string;
  };
  showOnce?: boolean; // Only show once per session
  category?: "premium" | "product" | "help" | "engagement";
}

// Definice rychlých zpráv podle kontextu
const QUICK_MESSAGES: QuickMessage[] = [
  // Time-based triggers
  {
    id: "welcome_30s",
    message: "✨ Ahoj! Hledáš svůj spirituální symbol? Mohu ti pomoci!",
    trigger: "time",
    triggerValue: 30,
    priority: 1,
    cta: { text: "Ano, poraď mi", action: "open_chat" },
    showOnce: true,
    category: "engagement",
  },
  {
    id: "premium_60s",
    message: "🪷 Víš, že PREMIUM členové mají přístup k exkluzivním meditacím?",
    trigger: "time",
    triggerValue: 60,
    priority: 2,
    cta: { text: "Zjistit více", action: "open_chat", value: "Zajímá mě PREMIUM členství" },
    showOnce: true,
    category: "premium",
  },
  {
    id: "help_120s",
    message: "🔮 Potřebuješ poradit s výběrem amuletu nebo kamene?",
    trigger: "time",
    triggerValue: 120,
    priority: 1,
    cta: { text: "Ano, prosím", action: "open_chat" },
    showOnce: true,
    category: "help",
  },
  
  // Scroll-based triggers
  {
    id: "scroll_50",
    message: "💎 Líbí se ti naše produkty? Mohu ti doporučit ten pravý!",
    trigger: "scroll",
    triggerValue: 50, // 50% scroll
    priority: 1,
    cta: { text: "Doporuč mi", action: "open_chat" },
    showOnce: true,
    category: "product",
  },
  {
    id: "scroll_80",
    message: "🌙 Nezapomeň na náš kvíz - zjisti svůj spirituální symbol!",
    trigger: "scroll",
    triggerValue: 80, // 80% scroll
    priority: 2,
    cta: { text: "Spustit kvíz", action: "navigate", value: "/kviz" },
    showOnce: true,
    category: "engagement",
  },
  
  // Section-based triggers
  {
    id: "section_products",
    message: "☥ Máš otázku k některému produktu? Jsem tu pro tebe!",
    trigger: "section",
    triggerValue: "products",
    priority: 1,
    cta: { text: "Zeptat se", action: "open_chat" },
    showOnce: true,
    category: "product",
  },
  {
    id: "section_horoscope",
    message: "🐉 Zajímá tě tvůj čínský horoskop na rok 2026?",
    trigger: "section",
    triggerValue: "horoscope",
    priority: 2,
    cta: { text: "Zjistit", action: "navigate", value: "/cinský-horoskop-2026" },
    showOnce: true,
    category: "engagement",
  },
  
  // Inactivity trigger
  {
    id: "inactivity_45s",
    message: "💜 Jsi tu ještě? Mohu ti s něčím pomoci?",
    trigger: "inactivity",
    triggerValue: 45,
    priority: 3,
    cta: { text: "Ano, potřebuji pomoc", action: "open_chat" },
    showOnce: true,
    category: "help",
  },
  
  // Exit intent
  {
    id: "exit_intent",
    message: "🌟 Počkej! Nechceš si vzít 10% slevu na první nákup?",
    trigger: "exit_intent",
    triggerValue: 0,
    priority: 10,
    cta: { text: "Ano, chci slevu!", action: "open_chat", value: "Zajímá mě sleva na první nákup" },
    showOnce: true,
    category: "premium",
  },
];

interface QuickMessagesProps {
  onOpenChat: (message?: string) => void;
  isChatOpen: boolean;
  currentSection?: string;
}

export default function QuickMessages({ onOpenChat, isChatOpen, currentSection }: QuickMessagesProps) {
  const [activeMessage, setActiveMessage] = useState<QuickMessage | null>(null);
  const [shownMessages, setShownMessages] = useState<Set<string>>(() => {
    const stored = sessionStorage.getItem("quick_messages_shown");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = Math.round((scrollTop / docHeight) * 100);
      setScrollPercentage(percentage);
      setLastActivity(Date.now());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isChatOpen) {
        const exitMessage = QUICK_MESSAGES.find(
          (m) => m.trigger === "exit_intent" && !shownMessages.has(m.id)
        );
        if (exitMessage) {
          showMessage(exitMessage);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [shownMessages, isChatOpen]);

  // Check triggers
  useEffect(() => {
    if (isChatOpen || activeMessage) return;

    // Time-based triggers
    const timeMessages = QUICK_MESSAGES.filter(
      (m) =>
        m.trigger === "time" &&
        !shownMessages.has(m.id) &&
        timeOnPage >= (m.triggerValue as number)
    );

    // Scroll-based triggers
    const scrollMessages = QUICK_MESSAGES.filter(
      (m) =>
        m.trigger === "scroll" &&
        !shownMessages.has(m.id) &&
        scrollPercentage >= (m.triggerValue as number)
    );

    // Section-based triggers
    const sectionMessages = QUICK_MESSAGES.filter(
      (m) =>
        m.trigger === "section" &&
        !shownMessages.has(m.id) &&
        currentSection === m.triggerValue
    );

    // Inactivity triggers
    const inactivityTime = (Date.now() - lastActivity) / 1000;
    const inactivityMessages = QUICK_MESSAGES.filter(
      (m) =>
        m.trigger === "inactivity" &&
        !shownMessages.has(m.id) &&
        inactivityTime >= (m.triggerValue as number)
    );

    // Combine and sort by priority
    const allMessages = [
      ...timeMessages,
      ...scrollMessages,
      ...sectionMessages,
      ...inactivityMessages,
    ].sort((a, b) => b.priority - a.priority);

    if (allMessages.length > 0) {
      showMessage(allMessages[0]);
    }
  }, [timeOnPage, scrollPercentage, currentSection, lastActivity, isChatOpen, activeMessage, shownMessages]);

  const showMessage = (message: QuickMessage) => {
    setActiveMessage(message);
    setIsVisible(true);

    // Mark as shown
    const newShown = new Set(shownMessages);
    newShown.add(message.id);
    setShownMessages(newShown);
    sessionStorage.setItem("quick_messages_shown", JSON.stringify(Array.from(newShown)));

    // Auto-hide after 10 seconds if not interacted
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setActiveMessage(null), 300);
    }, 10000);
  };

  const handleCTA = () => {
    if (!activeMessage?.cta) return;

    switch (activeMessage.cta.action) {
      case "open_chat":
        onOpenChat(activeMessage.cta.value);
        break;
      case "navigate":
        if (activeMessage.cta.value) {
          window.location.href = activeMessage.cta.value;
        }
        break;
    }

    setIsVisible(false);
    setTimeout(() => setActiveMessage(null), 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setActiveMessage(null), 300);
  };

  if (!activeMessage || isChatOpen) return null;

  return (
    <div
      className={`fixed bottom-32 right-6 z-40 max-w-xs transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Speech bubble */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-purple-200 p-4 animate-bounce-gentle">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Message */}
        <p className="text-sm text-gray-800 mb-3 leading-relaxed">{activeMessage.message}</p>

        {/* CTA Button */}
        {activeMessage.cta && (
          <button
            onClick={handleCTA}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
          >
            {activeMessage.cta.text}
          </button>
        )}

        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-purple-200 transform rotate-45"></div>
      </div>

      {/* Pulsing indicator connecting to chat button */}
      <div className="absolute -bottom-8 right-4 w-2 h-8 flex flex-col items-center justify-end gap-1">
        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
      </div>
    </div>
  );
}
