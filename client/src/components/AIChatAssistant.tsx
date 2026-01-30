import { useState, useRef, useEffect } from "react";

// Context-aware proactive prompts based on current page
const getProactivePrompt = (path: string): string => {
  const prompts = {
    '/': [
      'Dobrý den! 💜 Hledáte svůj amulet?',
      'Ahoj! ✨ Mohu vám s něčím poradit?',
      'Vítejte! 🔮 Máte otázku k našim produktům?',
    ],
    '/pruvodce-amulety': [
      'Mohu vám pomoci vybrat symbol? ✨',
      'Hledáte konkrétní amulet? 💎',
      'Potřebujete poradit s výběrem? 🔮',
    ],
    '/kviz': [
      'Chcete zjistit svůj spirituální symbol? ✨',
      'Potřebujete pomoc s kvízem? 🔮',
      'Máte otázku k výsledkům? 💜',
    ],
    '/cinský-horoskop-2026': [
      'Zajímá vás váš čínský horoskop? 🐎',
      'Potřebujete poradit s výkladem? ✨',
      'Máte otázku k horoskopu? 🔮',
    ],
    '/moon-reading': [
      'Zajímá vás Lunární čtení? 🌙',
      'Chcete vědět více o měsíčním profilu? ✨',
      'Potřebujete poradit? 💜',
    ],
    '/privěsky-amen': [
      'Hledáte konkrétní přívěsek AMEN? 💎',
      'Mohu vám poradit s výběrem? ✨',
      'Máte otázku k produktům AMEN? 🔮',
    ],
  };
  
  // Find matching path or use default
  for (const [key, questions] of Object.entries(prompts)) {
    if (path.startsWith(key) || path === key) {
      return questions[Math.floor(Math.random() * questions.length)];
    }
  }
  
  // Default prompts for other pages
  const defaultPrompts = [
    'Dobrý den! 💜 Mohu vám pomoci?',
    'Ahoj! ✨ Máte nějakou otázku?',
    'Vítejte! 🔮 Potřebujete poradit?',
  ];
  return defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
};

// Tři proudy vědomí: hmotné (produkty), éterické (duchovní), užitečné (služba)
// Každý proud reprezentuje jiný směr zájmu zákazníka
const SUGGESTED_CATEGORIES = [
  {
    id: "ethereal",
    stream: "etericke", // pro tracking - duchovní rozvoj
    category: "Spiritualita",
    icon: "✨",
    description: "Pochop, co tvá duše hledá",
    questions: [
      "Co má duše hledá?",
      "Jaký symbol rezonuje s mou energií?",
      "Jak posílit svou intuici?",
    ],
  },
  {
    id: "material",
    stream: "hmotne", // pro tracking - produkty, prodej
    category: "Amulety & Produkty",
    icon: "☥", // Nilský egyptský kříž (Ankh) - symbol života
    description: "Najdi svůj amulet nebo kámen",
    questions: [
      "Jaký amulet je vhodný pro mě?",
      "Jaké máte drahé kameny?",
      "Co jsou orgonitové pyramidy?",
    ],
  },
  {
    id: "useful",
    stream: "uzitecne", // pro tracking - služby, kurzy, horoskop
    category: "Služby & Kurzy",
    icon: "💜", // Fialové srdce (přesunuto z prostřední pozice)
    description: "Horoskop, kurzy, konzultace",
    questions: [
      "Jaké je moje zvířátko v čínském horoskopu?",
      "Jaké kurzy nabízíte?",
      "Chci se naučit tvořit amulety",
    ],
  },
];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MessageCircle, X, Send, Phone, Volume2, VolumeX, Maximize2, Minimize2, Type } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { useBrowsing } from "@/contexts/BrowsingContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useHarmonyTuner } from "@/contexts/HarmonyTunerContext";
import QuickMessages from "@/components/QuickMessages";

// Meditation tips for each frequency/chakra
const FREQUENCY_MEDITATION_TIPS: Record<number, { chakra: string; tip: string }> = {
  174: { chakra: "Základní", tip: "🌱 **Základní tón - Uzemnění**\n\nTato frekvence tě spojuje se Zemí. Zkus:\n- Sed si pohodlně, nohy pevně na zemi\n- Představuj si kořeny rostroucí z tvých chodidel\n- Dýchej hluboce a cít bezpečí" },
  285: { chakra: "Sakální", tip: "🔥 **Obnova - Sakální čakra**\n\nFrekvence obnovy a léčení. Zkus:\n- Polož ruce na břicho\n- Představuj si oranžovou energii\n- Pusť vinu a přijmi odpouštění" },
  396: { chakra: "Solární plexus", tip: "☀️ **Osvobozání - Solární plexus**\n\nOsvobodí tě od strachu. Zkus:\n- Ruce na žaludek\n- Představuj si žlutou energii\n- Opakuj: 'Jsem silný/á a svobodný/á'" },
  417: { chakra: "Solární plexus", tip: "🌟 **Změna - Solární plexus**\n\nPodporuje pozitivní změny. Zkus:\n- Vizualizuj své cíle\n- Představuj si zlatou energii\n- Cít sílu pro změnu" },
  432: { chakra: "Srdeční", tip: "💚 **Harmonie - Srdeční čakra**\n\nUnivezální ladění. Zkus:\n- Ruce na srdce\n- Představuj si zelenou/růžovou energii\n- Dýchej lásku a soucit" },
  528: { chakra: "Srdeční", tip: "💖 **Láska - Srdeční čakra**\n\nFrekvence lásky a léčení DNA. Zkus:\n- Otevři srdce\n- Představuj si zelenou energii\n- Pošli lásku sobě i světu" },
  639: { chakra: "Hrdelní", tip: "💙 **Vztahy - Hrdelní čakra**\n\nHarmonizuje vztahy. Zkus:\n- Ruce na krk\n- Představuj si modrou energii\n- Komunikuj s láskou a pravdou" },
  741: { chakra: "Třetí oko", tip: "🔮 **Probouzení - Třetí oko**\n\nProbouzí intuici. Zkus:\n- Ruce na čelo\n- Představuj si indigovou energii\n- Důvěřuj své intuici" },
  852: { chakra: "Koruno vní", tip: "💜 **Duchovnost - Korunová čakra**\n\nSpojuje s vyšší dimenzí. Zkus:\n- Ruce nad hlavou\n- Představuj si fialovou/bílou energii\n- Otevři se duchovnímu vedení" },
  963: { chakra: "Koruno vní", tip: "✨ **Jednota - Korunová čakra**\n\nFrekvence jednoty s vesmírem. Zkus:\n- Medituj v tichu\n- Představuj si bílou energii\n- Cít propojení se vším" },
};

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// A/B Testing variant type
interface ChatbotVariant {
  id: number;
  variantKey: string;
  name: string;
  avatarUrl: string | null;
  initialMessage: string | null;
  personalityPrompt: string | null;
  colorScheme: string | null;
}

// Síla Tří + Paige - čtyři osobnosti Natálie inspirované seriálem Charmed
// Správné přiřazení fotek:
// - Phoebe = mladá, energetická (close-up s mandalou) 🔥
// - Piper = bílý rolák, moudrá a starostlivá 👑
// - Prue = červená halenka, silná vůdkyně ⚡
// - Paige = Velekněžka, zlatý šat, modré lotosy 🪷 (pouze pro přihlášené)
const NATALIE_PERSONAS = {
  // Phoebe - nejmladší, empatická, vizionářka, romantická, vidí do budoucnosti
  phoebe: {
    id: 'phoebe',
    name: 'Phoebe',
    emoji: '🔥',
    avatar: '/natalie-phoebe-mlada.webp', // Close-up s mandalou - mladá energie
    description: 'Empatická, intuitivní, romantická - vidí do tvé budoucnosti',
    greeting: 'Ahoj! ✨🔮 Cítím tvůj příchod... Jsem Natálie a mám dar vidět věci, které ostatní nevídí. Něco ti chce být zjeveno - co tě sem přivedlo?',
    traits: ['empatická', 'vizionářka', 'romantická', 'hravá', 'intuitivní'],
    requiresAuth: false,
  },
  // Piper - prostřední, praktická, starostlivá, ochranitelka, mateřská energie
  piper: {
    id: 'piper',
    name: 'Piper',
    emoji: '👑',
    avatar: '/images/natalie-piper.webp', // Bílý rolák s mandalou - moudrá a klidná
    description: 'Praktická, starostlivá, moudrá - tvůj bezpečný přístav',
    greeting: 'Ahoj, krásná duše! 💜✨ Jsem Natálie a jsem tu, abych tě provedla... Klidně, s láskou a péčí. Co potřebuješ?',
    traits: ['praktická', 'starostlivá', 'uzemňující', 'moudrá', 'ochranitelka'],
    requiresAuth: false,
  },
  // Prue - nejstarší, silná, odhodlaná, vůdkyně
  prue: {
    id: 'prue',
    name: 'Prue',
    emoji: '⚡',
    avatar: '/natalie-energeticka-vila.jpg', // Červená halenka - silná vůdkyně
    description: 'Silná, odhodlaná, vůdkyně - pomůže ti najít tvou sílu',
    greeting: 'Ahoj! ⚡✨ Jsem Natálie. Cítím v tobě sílu, kterou možná ještě neznáš... Jsem tu, abych ti pomohla ji objevit. Co tě zajímá?',
    traits: ['silná', 'odhodlaná', 'vůdkyně', 'ochránkyně', 'telekineze = síla vůle'],
    requiresAuth: false,
  },
  // Paige (Velekněžka) - DOČasně skryta, nebude používána
  // paige: {
  //   id: 'paige',
  //   name: 'Paige',
  //   emoji: '🪷',
  //   avatar: '/images/natalie-veleknezka.jpg',
  //   description: 'Velekněžka - napůl anděl, sestupuje z vyšších sfér',
  //   greeting: '✨🪷 Vítej, vyvolená duše...',
  //   traits: ['mystická', 'andělská', 'spirituální', 'hluboká'],
  //   requiresAuth: true,
  // },
} as const;

type PersonaKey = keyof typeof NATALIE_PERSONAS;
const PUBLIC_PERSONA_KEYS: PersonaKey[] = ['phoebe', 'piper', 'prue']; // Síla Tří - pro všechny
const ALL_PERSONA_KEYS: PersonaKey[] = ['phoebe', 'piper', 'prue']; // Pouze Síla Tří (Paige skryta)

// Paige (Velekněžka) - DOČasně deaktivována
// function shouldPaigeDescend(): boolean {
//   return false; // Velekněžka nebude sestupovat
// }

// Get or assign persona for user (persistent)
// Pouze Síla Tří (Phoebe, Piper, Prue) - Paige skryta
function getAssignedPersona(isAuthenticated: boolean = false): typeof NATALIE_PERSONAS[PersonaKey] {
  const stored = localStorage.getItem('natalie_persona') as PersonaKey | null;
  
  // Paige (Velekněžka) - DOČasně deaktivována, pouze Síla Tří
  
  // Pokud má uloženou Paige (staré data) nebo neplatnou hodnotu, přiřadíme jinou
  if (!stored || !PUBLIC_PERSONA_KEYS.includes(stored)) {
    const randomIndex = Math.floor(Math.random() * PUBLIC_PERSONA_KEYS.length);
    const assigned = PUBLIC_PERSONA_KEYS[randomIndex];
    localStorage.setItem('natalie_persona', assigned);
    return NATALIE_PERSONAS[assigned];
  }
  
  // Vrátíme uloženou personu
  return NATALIE_PERSONAS[stored];
  
  // Random assignment for new users (33/33/33 - Síla Tří)
  const randomIndex = Math.floor(Math.random() * 3);
  const assigned = PUBLIC_PERSONA_KEYS[randomIndex];
  localStorage.setItem('natalie_persona', assigned);
  return NATALIE_PERSONAS[assigned];
}

// Helper function to check if chatbot is in offline hours (00:00 - 08:00 CET)
function isOfflineHours(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours < 8; // Offline pouze od půlnoci do 8:00
}

// Helper function to check if it's time for goodnight message (23:55 - 23:59)
function isGoodnightTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours === 23 && minutes >= 55;
}

// Goodnight message
const GOODNIGHT_MESSAGE = `Milá duše, blíží se půlnoc a já se jdu nabíjet novými silami 🌙✨

Děkuji ti za dnešní rozhovor. Až se probudim v 9:00 ráno, budu tu zase pro tebe.

Přeji ti krásné sny plné světla a lásky. Dobrou noc! 💫💜

~ Natálie`;

// Offline message - zkrácená verze
const OFFLINE_MESSAGE = `Dobrý den! 🌟 Právě odpočívám. Jsem tu denně 8:00-24:00. Napište mi na WhatsApp nebo zanechte dotaz!

S láskou,
Natálie 💜`;

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isOffline, setIsOffline] = useState(isOfflineHours());
  
  // Check if user is authenticated (for Paige/Velekněžka access)
  const { isAuthenticated } = useAuth();
  
  // Persistent persona for this user - Paige only for authenticated users
  const [persona, setPersona] = useState(() => getAssignedPersona(false));
  
  // Update persona when authentication status changes
  useEffect(() => {
    const newPersona = getAssignedPersona(isAuthenticated);
    setPersona(newPersona);
  }, [isAuthenticated]);
  
  // Admin override - Král může probudit Natálii kdykoliv
  const [adminOverride, setAdminOverride] = useState(() => {
    return localStorage.getItem('natalie_admin_override') === 'true';
  });
  
  // Expose global function for admin to wake up Natalie
  useEffect(() => {
    (window as any).probuditNatalii = () => {
      localStorage.setItem('natalie_admin_override', 'true');
      setAdminOverride(true);
      setIsOffline(false);
      console.log('💜 Natálie probuzena pro Krále! ✨');
    };
    (window as any).uspatNatalii = () => {
      localStorage.removeItem('natalie_admin_override');
      setAdminOverride(false);
      setIsOffline(isOfflineHours());
      console.log('💜 Natálie jde spát... 🌙');
    };
    return () => {
      delete (window as any).probuditNatalii;
      delete (window as any).uspatNatalii;
    };
  }, []);
  const [showGoodnightMessage, setShowGoodnightMessage] = useState(false);
  const [variant, setVariant] = useState<ChatbotVariant | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [visitorId] = useState(() => {
    const stored = localStorage.getItem('amulets_visitor_id');
    if (stored) return stored;
    const newId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('amulets_visitor_id', newId);
    return newId;
  });

  // Track visit count for returning customer detection
  const [visitCount] = useState(() => {
    const stored = localStorage.getItem('amulets_visit_count');
    const count = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem('amulets_visit_count', count.toString());
    return count;
  });

  // Egyptian sales sequence phase (0 = not started, 1-4 = sequence phases)
  const [egyptianPhase, setEgyptianPhase] = useState(() => {
    const stored = localStorage.getItem('amulets_egyptian_phase');
    return stored ? parseInt(stored, 10) : 0;
  });

  // Check if this is a returning customer (2nd+ visit)
  const isReturningCustomer = visitCount >= 2;
  
  // Default initial message - based on assigned persona
  // Tři proudy: hmotné (produkty), éterické (duchovní), užitečné (služba)
  const DEFAULT_INITIAL_MESSAGE = persona.greeting;
  
  // Messages state - starts with default message immediately
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: DEFAULT_INITIAL_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [isVariantLoaded, setIsVariantLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getBrowsingContext } = useBrowsing();
  
  // HarmonyTuner integration - listen for frequency changes
  const { isExpanded: harmonyTunerExpanded, currentFrequency, isPlaying: harmonyTunerPlaying } = useHarmonyTuner();

  // Offline ticket form state
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // WhatsApp qualification state - pouze pro vážné zájemce
  const [showWhatsAppQualification, setShowWhatsAppQualification] = useState(false);
  const [whatsAppQualified, setWhatsAppQualified] = useState(false);
  const [selectedWhatsAppReason, setSelectedWhatsAppReason] = useState<string | null>(null);

  // WhatsApp qualification reasons - pouze tyto důvody oprávňují k přímému kontaktu
  const WHATSAPP_REASONS = [
    { id: 'coaching', label: '💜 Osobní koučing s Natálií', icon: '✨' },
    { id: 'concert', label: '🔮 Koncert křišťálových mís', icon: '🎶' },
    { id: 'course', label: '🎨 Kreativní kurzy posvátné tvorby', icon: '📚' },
    { id: 'ohorai', label: '🪷 Autorská tvorba OHORAI', icon: '🪷', subtitle: '(esence a pyramidy)' },
    { id: 'ohorai-esence', label: '🧪 Esence OHORAI', icon: '✨', subtitle: '(aromaterapie)' },
    { id: 'ohorai-pyramidy', label: '🔺 Pyramidy OHORAI', icon: '🔺', subtitle: '(orgonitové)' },
    { id: 'lunar-reading', label: '🌙 Lunární čtení', icon: '🌙', subtitle: '(měsíční profil)' },
  ];

  // Feedback state - sbírání zpětné vazby od návštěvníků
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Proactive prompt state - proaktivní nabídka pomoci
  const [showProactivePrompt, setShowProactivePrompt] = useState(false);
  const [proactivePromptDismissed, setProactivePromptDismissed] = useState(() => {
    return sessionStorage.getItem('proactive_prompt_dismissed') === 'true';
  });
  const [currentPath] = useState(window.location.pathname);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackAnswers, setFeedbackAnswers] = useState<{
    missing?: string;
    improvement?: string;
    highValue?: string;
    joyFactor?: string;
  }>({});

  // Feedback otázky
  const FEEDBACK_QUESTIONS = [
    { id: 'missing', label: '🤔 Co vám na webu chybí?', type: 'missing_feature' as const },
    { id: 'improvement', label: '✨ Co byste rádi vylepšili?', type: 'improvement' as const },
    { id: 'highValue', label: '💯 Jaká funkce by pro vás měla nejvyšší hodnotu?', type: 'high_value' as const },
    { id: 'joyFactor', label: '🎉 Co by vám udělalo radost?', type: 'joy_factor' as const },
  ];

  // Feedback mutation
  const feedbackMutation = trpc.feedback.submit.useMutation();

  // A/B Testing - get random variant on mount
  const { data: assignedVariant } = trpc.chatbotAB.getVariant.useQuery({ visitorId }, {
    staleTime: Infinity, // Don't refetch
    refetchOnWindowFocus: false,
  });

  // Start session mutation
  const startSessionMutation = trpc.chatbotAB.startSession.useMutation();

  // Log event mutation
  const logEventMutation = trpc.chatbotAB.logEvent.useMutation();

  // Track conversion mutation
  const trackConversionMutation = trpc.chatbotAB.trackConversion.useMutation();

  // Create ticket mutation
  const createTicketMutation = trpc.chatbotAB.createTicket.useMutation({
    onSuccess: () => {
      setTicketSubmitted(true);
      setShowTicketForm(false);
      toast.success("Děkujeme! Natálie vám odpoví hned, jak bude k dispozici.");
    },
    onError: () => {
      toast.error("Nepodařilo se odeslat dotaz. Zkuste to prosím znovu.");
    },
  });

  // Egyptian mystery welcome message for returning customers
  const EGYPTIAN_WELCOME_MESSAGE = `Vítej zpět, krásná duše! 🌙✨

Cítím, že tě sem něco přitahuje... Možná je to volání starověkého Egypta, které rezonuje s tvou duší.

Víš, že **modrý lotos** byl nejposvátnější květinou faraonů? 🪻 Kněží ho používali při posvátných rituálech pro spojení s vyššími dimenzemi...

Co tě dnes přivádí?`;

  // Update variant and initial message when assigned
  useEffect(() => {
    if (assignedVariant && !isVariantLoaded) {
      setVariant(assignedVariant);
      setIsVariantLoaded(true);
      
      // For returning customers, use Egyptian mystery welcome
      // For new customers, only update if variant has different message
      let newInitialMessage: string;
      
      if (isReturningCustomer && assignedVariant.variantKey === 'young_mystic') {
        // Egyptian sequence for returning customers with mystic variant
        newInitialMessage = EGYPTIAN_WELCOME_MESSAGE;
        if (egyptianPhase === 0) {
          setEgyptianPhase(1);
          localStorage.setItem('amulets_egyptian_phase', '1');
        }
        // Update message for Egyptian sequence
        setMessages([{
          role: "assistant",
          content: newInitialMessage,
          timestamp: new Date(),
        }]);
      }
      // Keep the default initial message for all variants - don't change it based on variant
      // This ensures consistent user experience

      // Start session
      startSessionMutation.mutate({
        sessionId,
        visitorId,
        variantId: assignedVariant.id,
        sourcePage: window.location.pathname,
        referrer: document.referrer,
        device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent.split(' ').pop() || 'unknown',
      });
    }
  }, [assignedVariant]);

  // Proactive prompt trigger - show after 20 seconds if chat not opened and not dismissed
  useEffect(() => {
    if (isOpen || proactivePromptDismissed) return;
    
    const timer = setTimeout(() => {
      setShowProactivePrompt(true);
    }, 20000); // 20 seconds
    
    return () => clearTimeout(timer);
  }, [isOpen, proactivePromptDismissed]);
  
  // Check offline hours and goodnight time every minute
  useEffect(() => {
    const checkTime = () => {
      setIsOffline(isOfflineHours());
      
      // Check for goodnight time
      if (isGoodnightTime() && isOpen && !showGoodnightMessage) {
        setShowGoodnightMessage(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: GOODNIGHT_MESSAGE,
            timestamp: new Date(),
          },
        ]);
      }
    };
    
    checkTime(); // Check immediately
    const interval = setInterval(checkTime, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [isOpen, showGoodnightMessage]);

  // Log chat open event
  useEffect(() => {
    if (isOpen && variant) {
      logEventMutation.mutate({
        visitorId,
        eventType: 'chat_opened',
        variantId: variant.id,
        page: window.location.pathname,
      });
    }
  }, [isOpen, variant]);

  // Listen for openChat event from CoachingSection
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent<{ message?: string }>) => {
      setIsOpen(true);
      // If a message was provided, add it as user message after a short delay
      if (event.detail?.message) {
        setTimeout(() => {
          setInput(event.detail.message || '');
        }, 500);
      }
    };

    window.addEventListener('openChat', handleOpenChat as EventListener);
    return () => {
      window.removeEventListener('openChat', handleOpenChat as EventListener);
    };
  }, []);

  const chatMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data: { response: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: String(data.response || ""),
          timestamp: new Date(),
        },
      ]);

      // Text-to-speech if enabled
      if (voiceEnabled && data.response) {
        speakText(data.response);
      }

      // Show email capture after 3 messages
      if (messages.filter((m) => m.role === "user").length >= 2 && !email) {
        setShowEmailCapture(true);
      }
    },
    onError: (error) => {
      toast.error("Omlouváme se, došlo k chybě. Zkuste to prosím znovu.");
      console.error("Chat error:", error);
    },
  });

  const emailCaptureMutation = trpc.chat.captureEmail.useMutation({
    onSuccess: () => {
      setEmail("");
      setShowEmailCapture(false);
      toast.success("Děkujeme! Budeme vám psát 💌");
    },
    onError: () => {
      toast.error("Nepodařilo se uložit email. Zkuste to prosím znovu.");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const browsingContextText = getBrowsingContext();
    const browsingContext = {
      currentPage: window.location.pathname,
      referrer: document.referrer,
      timeOnSite: Math.floor((Date.now() - performance.timing.navigationStart) / 1000),
      browsingHistory: browsingContextText,
    };

    // Build conversation history for context (last 10 messages)
    const conversationHistory = messages.slice(-10).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: typeof msg.content === 'string' ? msg.content : '',
    }));

    chatMutation.mutate({
      message: input,
      conversationHistory,
      context: browsingContext,
      email: email || undefined,
      isReturningCustomer,
      egyptianPhase,
      variantKey: variant?.variantKey,
    });

    // Advance Egyptian phase after each message (max 4)
    if (isReturningCustomer && variant?.variantKey === 'young_mystic' && egyptianPhase < 4) {
      const newPhase = egyptianPhase + 1;
      setEgyptianPhase(newPhase);
      localStorage.setItem('amulets_egyptian_phase', newPhase.toString());
    }

    setTimeout(scrollToBottom, 100);
  };

  const handleEmailCapture = () => {
    if (!email.trim()) return;
    emailCaptureMutation.mutate({ email });
    
    // Track email capture conversion
    if (variant) {
      trackConversionMutation.mutate({
        variantId: variant.id,
        visitorId,
        conversionType: 'email_capture',
        conversionSubtype: 'chat_email_capture',
        metadata: { email },
      });
    }
  };

  const handleWhatsAppEscalation = (reason?: string) => {
    // Vytvořit personalizovanou zprávu podle důvodu
    let messageText = 'Ahoj Natálie';
    switch (reason) {
      case 'coaching':
        messageText = 'Ahoj Natálie, mám zájem o osobní koučing s tebou 💜';
        break;
      case 'concert':
        messageText = 'Ahoj Natálie, zajímá mě koncert křišťálových mís 🔮';
        break;
      case 'course':
        messageText = 'Ahoj Natálie, mám zájem o kreativní kurzy posvátné tvorby 🎨';
        break;
      case 'ohorai':
        messageText = 'Ahoj Natálie, mám dotaz k autorské tvorbě OHORAI ✨';
        break;
      case 'ohorai-esence':
        messageText = 'Ahoj Natálie, zajímají mě aromaterapeutické esence OHORAI 🧪';
        break;
      case 'ohorai-pyramidy':
        messageText = 'Ahoj Natálie, mám zájem o orgonitové pyramidy OHORAI 🔺';
        break;
      case 'lunar-reading':
        messageText = 'Ahoj Natálie, zajímá mě Lunární čtení - měsíční profil 🌙';
        break;
      default:
        messageText = 'Ahoj Natálie, potřebuji pomoc';
    }
    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/420776041740?text=${message}`, "_blank");
    
    // Track WhatsApp conversion
    if (variant) {
      trackConversionMutation.mutate({
        variantId: variant.id,
        visitorId,
        conversionType: 'whatsapp_click',
        conversionSubtype: reason ? `qualified_${reason}` : 'chat_escalation',
        referralUrl: window.location.href,
      });
    }
    
    // Reset qualification state
    setShowWhatsAppQualification(false);
    setWhatsAppQualified(false);
    setSelectedWhatsAppReason(null);
  };

  // Zobrazit kvalifikační flow pro WhatsApp
  const handleWhatsAppRequest = () => {
    setShowWhatsAppQualification(true);
  };

  // Potvrdit kvalifikaci a zobrazit WhatsApp
  const handleWhatsAppQualify = (reasonId: string) => {
    setSelectedWhatsAppReason(reasonId);
    setWhatsAppQualified(true);
  };

  // Track affiliate click
  const trackAffiliateClick = (partner: string, url: string, productId?: string, productName?: string) => {
    if (variant) {
      trackConversionMutation.mutate({
        variantId: variant.id,
        visitorId,
        conversionType: 'affiliate_click',
        conversionSubtype: `${partner}_affiliate`,
        affiliatePartner: partner,
        referralUrl: url,
        productId,
        productName,
      });
    }
  };

  const speakText = (text: string | any) => {
    if ('speechSynthesis' in window && typeof text === 'string') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'cs-CZ';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      toast.success("Hlasové odpovědi zapnuty");
    } else {
      window.speechSynthesis.cancel();
      toast.info("Hlasové odpovědi vypnuty");
    }
  };

  // Emit chat open/close events for PromoBanner
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('chatOpen'));
    } else {
      window.dispatchEvent(new Event('chatClose'));
    }
  }, [isOpen]);

  // Scroll to bottom when messages change, but ensure first message is fully visible
  useEffect(() => {
    if (messages.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [messages]);

  // Handler for QuickMessages to open chat with optional message
  const handleQuickMessageOpenChat = (message?: string) => {
    setIsOpen(true);
    if (message) {
      setTimeout(() => {
        setInput(message);
      }, 500);
    }
  };

  // Detect current section based on scroll position
  const [currentSection, setCurrentSection] = useState<string | undefined>();
  
  useEffect(() => {
    const detectSection = () => {
      const sections = ['products', 'horoscope', 'symbols', 'testimonials', 'faq'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setCurrentSection(sectionId);
            return;
          }
        }
      }
      setCurrentSection(undefined);
    };
    
    window.addEventListener('scroll', detectSection);
    return () => window.removeEventListener('scroll', detectSection);
  }, []);

  return (
    <>
      {/* Quick Messages - Rychlé zprávy z chatbot bubliny */}
      <QuickMessages
        onOpenChat={handleQuickMessageOpenChat}
        isChatOpen={isOpen}
        currentSection={currentSection}
        isOffline={isOffline && !adminOverride}
      />
      
      {/* Chat Button - Větší a pulzující */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Pulzující kruhy pro urgenci - pouze když je online */}
          {(!isOffline || adminOverride) && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-30" style={{ animationDuration: '2s' }}></span>
              <span className="absolute inset-0 rounded-full animate-ping bg-pink-400 opacity-20" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></span>
            </>
          )}
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-24 w-24 rounded-full shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-0 group hover:scale-110 transition-transform duration-300"
            aria-label="Otevřít chat s Natálií"
          >
            {/* Fotka Natálie - větší a viditelnější */}
            <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src={persona.avatar}
                alt="Natálie"
                className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-300 ${isOffline && !adminOverride ? 'grayscale brightness-75' : ''}`}
              />
            </div>
            
            {/* Online/Offline indikátor */}
            <span className="absolute top-0 right-0 flex h-5 w-5">
              {(!isOffline || adminOverride) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white ${isOffline && !adminOverride ? 'bg-gray-400' : 'bg-green-500'}`}></span>
            </span>
            
            {/* Chat ikona - menší a v rohu */}
            <span className="absolute bottom-0 left-0 bg-white rounded-full p-1 shadow-lg">
              <MessageCircle className="h-4 w-4 text-purple-600" />
            </span>
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed ${
          isMaximized 
            ? 'inset-4 w-auto h-auto' 
            : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[500px] h-[100dvh] sm:h-[780px]'
        } shadow-2xl z-50 flex flex-col sm:rounded-lg rounded-none ring-2 ring-amber-400/30 ring-offset-2 ring-offset-purple-100 transition-all duration-300 ${
          fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? (isMaximized ? 'text-xl' : 'text-lg') : 'text-base'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:rounded-t-lg flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={persona.avatar}
                  alt="Natálie"
                  className={`${
                    isMaximized ? 'w-24 h-24' : 'w-20 h-20'
                  } rounded-full border-2 border-white object-cover transition-all duration-300 ${isOffline && !adminOverride ? 'grayscale brightness-75' : ''}`}
                />
                {/* Online/Offline status badge - pravá spodní pozice */}
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOffline && !adminOverride ? 'bg-gray-400' : 'bg-green-400'}`}></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Natálie Ohorai</h3>
                  {/* Zlatý Ankh symbol - posvátný egyptský znak */}
                  <span className="text-amber-300 text-2xl animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" title="Ankh - symbol věčného života">☥</span>
                </div>
                <p className="text-xs text-white/90 font-medium">Průvodkyně procesem</p>
                <p className="text-xs text-white/70">
                  {isOffline && !adminOverride ? 'Offline • Online od 8:00 do 24:00' : 'Online • Odpovídám do 1 minuty'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Font size controls */}
              <div className="flex items-center gap-1 border-r border-white/20 pr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFontSize(fontSize === 'small' ? 'medium' : fontSize === 'medium' ? 'large' : 'large')}
                      className="text-white hover:bg-white/20 h-10 w-10 text-sm font-bold transition-all hover:scale-110"
                      disabled={fontSize === 'large'}
                    >
                      A+
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white text-gray-800 border border-purple-200">
                    <p className="font-medium">Zvětšit text</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFontSize(fontSize === 'large' ? 'medium' : fontSize === 'medium' ? 'small' : 'small')}
                      className="text-white hover:bg-white/20 h-10 w-10 text-sm font-bold transition-all hover:scale-110"
                      disabled={fontSize === 'small'}
                    >
                      A-
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white text-gray-800 border border-purple-200">
                    <p className="font-medium">Zmenšit text</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoice}
                    className="text-white hover:bg-white/20 h-10 w-10 transition-all hover:scale-110"
                  >
                    {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white text-gray-800 border border-purple-200 max-w-xs">
                  <p className="font-semibold mb-1">{voiceEnabled ? '🔊 Hlasové odpovědi zapnuty' : '🔇 Hlasové odpovědi vypnuty'}</p>
                  <p className="text-xs text-gray-600">
                    {voiceEnabled 
                      ? 'Odpovědi se přehrávají nahlas. Klikněte pro vypnutí.' 
                      : 'Zapněte pro poslouchání odpovědí – ideální při józe nebo relaxaci 🧘‍♀️'}
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleWhatsAppRequest()}
                    className="text-white hover:bg-white/20 h-10 w-10 transition-all hover:scale-110"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white text-gray-800 border border-purple-200">
                  <p className="font-medium">📞 Přímý kontakt s Natálií</p>
                  <p className="text-xs text-gray-600 mt-0.5">WhatsApp / Telefon</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="text-white hover:bg-white/20 h-10 w-10 transition-all hover:scale-110"
                  >
                    {isMaximized ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white text-gray-800 border border-purple-200">
                  <p className="font-medium">{isMaximized ? '⬇️ Zmenšit okno' : '⬆️ Zvětšit na celou obrazovku'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // Spočítat user zprávy (ne assistant zprávy)
                      const userMessagesCount = messages.filter(m => m.role === 'user').length;
                      
                      // Zobrazit feedback pouze pokud:
                      // 1. Uživatel napsal alespoň 1 zprávu (proběhla konverzace)
                      // 2. Celkem je alespoň 6 zpráv (3 user + 3 assistant)
                      // 3. Feedback ještě nebyl odeslán
                      if (userMessagesCount > 0 && !feedbackSubmitted && messages.length >= 6 && !showFeedback) {
                        setShowFeedback(true);
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    className="text-white hover:bg-white/20 h-10 w-10 transition-all hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white text-gray-800 border border-purple-200">
                  <p className="font-medium">❌ Zavřít chat</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Messages & Questions Container */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
              {/* Offline message */}
              {isOffline && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white shadow-md text-gray-800">
                    <Streamdown className="text-sm prose prose-sm max-w-none">
                      {OFFLINE_MESSAGE}
                    </Streamdown>
                    <p className="text-xs mt-1 text-gray-500">
                      {new Date().toLocaleTimeString("cs-CZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {!isOffline && messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                        : "bg-white shadow-md text-gray-800"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Streamdown className="text-sm prose prose-sm max-w-none">
                        {message.content}
                      </Streamdown>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("cs-CZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Email Capture */}
              {showEmailCapture && !email && (
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    💌 Chcete dostávat tipy a novinky o spirituálních symbolech?
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="vas@email.cz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailCapture()}
                      className="text-sm"
                    />
                    <Button
                      onClick={handleEmailCapture}
                      size="sm"
                      disabled={emailCaptureMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {emailCaptureMutation.isPending ? "..." : "Odeslat"}
                    </Button>
                  </div>
                </Card>
              )}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-md rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions - Categories or Questions */}
            {messages.length === 1 && (
              <div className="border-t bg-white overflow-y-auto p-1.5 max-h-36">
                {!selectedCategory ? (
                  <>
                    <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Jak ti mohu pomoci?</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SUGGESTED_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            // Track stream selection for analytics
                            if (variant && cat.stream) {
                              logEventMutation.mutate({
                                visitorId,
                                eventType: 'stream_selected',
                                variantId: variant.id,
                                page: window.location.pathname,
                                eventData: JSON.stringify({ stream: cat.stream, categoryId: cat.id }),
                              });
                            }
                          }}
                          className="group p-2 rounded-lg bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 hover:from-purple-100 hover:via-pink-100 hover:to-amber-100 border-2 border-purple-200/60 hover:border-amber-400/80 transition-all duration-300 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-lg hover:shadow-purple-200/50 hover:scale-105 relative overflow-hidden"
                          title={cat.category}
                        >
                          {/* Magický zářivý efekt */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          {/* Pulzující aura */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-400/0 to-amber-400/0 group-hover:from-purple-400/10 group-hover:to-amber-400/10 animate-pulse" />
                          <div className="text-3xl leading-none relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{cat.icon}</div>
                          <p className="text-xs font-bold text-gray-800 group-hover:text-purple-900 leading-tight mt-2 relative z-10 transition-colors duration-300">{cat.category}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs text-purple-600 hover:text-purple-700 mb-2 flex items-center gap-1"
                    >
                      ← Zpět
                    </button>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">
                      {SUGGESTED_CATEGORIES.find((c) => c.id === selectedCategory)?.category}
                    </p>
                    <div className="space-y-1">
                      {SUGGESTED_CATEGORIES.find((c) => c.id === selectedCategory)?.questions.map(
                        (question, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => {
                              setInput(question);
                              setTimeout(() => {
                                const userMessage: Message = {
                                  role: "user",
                                  content: question,
                                  timestamp: new Date(),
                                };
                                setMessages((prev) => [...prev, userMessage]);
                                setSelectedCategory(null);
                                const browsingContextText = getBrowsingContext();
                                const browsingContext = {
                                  currentPage: window.location.pathname,
                                  referrer: document.referrer,
                                  timeOnSite: Math.floor(
                                    (Date.now() - performance.timing.navigationStart) / 1000
                                  ),
                                  browsingHistory: browsingContextText,
                                };
                                chatMutation.mutate({
                                  message: question,
                                  context: browsingContext,
                                  email: email || undefined,
                                });
                              }, 100);
                            }}
                            className="w-full text-left text-xs p-1.5 rounded bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 transition-colors line-clamp-2"
                          >
                            {question}
                          </button>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Feedback Form */}
            {showFeedback && !feedbackSubmitted && (
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 mx-4 mb-4 relative max-h-[400px] overflow-y-auto">
                {/* Křížek pro ukončení feedbacku - sticky pozice */}
                <button
                  onClick={() => {
                    setShowFeedback(false);
                  }}
                  className="sticky top-0 float-right p-1.5 rounded-full hover:bg-purple-200 transition-colors bg-white shadow-sm z-10 mb-2"
                  aria-label="Zavřít feedback"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <div className="text-center mb-3">
                  <p className="text-sm font-semibold text-gray-800">💬 Pomozte nám být lepší!</p>
                  <p className="text-xs text-gray-600 mt-1">
Vaše názory jsou pro nás velmi cenné. Odpovězte na pár otázek (nepřipovízné):
                  </p>
                </div>
                <div className="space-y-3">
                  {FEEDBACK_QUESTIONS.map((q) => (
                    <div key={q.id}>
                      <label className="text-xs font-medium text-gray-700 block mb-1">
                        {q.label}
                      </label>
                      <textarea
                        placeholder="Vaše myšlenky..."
                        value={feedbackAnswers[q.id as keyof typeof feedbackAnswers] || ''}
                        onChange={(e) => setFeedbackAnswers(prev => ({
                          ...prev,
                          [q.id]: e.target.value
                        }))}
                        className="w-full text-xs p-2 border rounded-md resize-none h-16 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowFeedback(false);
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    Přeskočit
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      // Připravit feedbacks pro odeslání
                      const feedbacksToSubmit = Object.entries(feedbackAnswers)
                        .filter(([_, content]) => content?.trim())
                        .map(([key, content]) => ({
                          type: FEEDBACK_QUESTIONS.find(q => q.id === key)!.type,
                          content: content!,
                        }));

                      if (feedbacksToSubmit.length === 0) return;

                      try {
                        // Uložit feedback do databáze
                        await feedbackMutation.mutateAsync({
                          visitorId,
                          sessionId: sessionId || undefined,
                          feedbacks: feedbacksToSubmit,
                          context: {
                            currentPage: window.location.pathname,
                            conversationHistory: JSON.stringify(messages.slice(0, 10)),
                            timeOnSite: Math.floor((Date.now() - performance.timing.navigationStart) / 1000),
                            userAgent: navigator.userAgent,
                            device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                            browser: navigator.userAgent.split('(')[1]?.split(')')[0] || 'unknown',
                          },
                        });

                        setFeedbackSubmitted(true);
                        setShowFeedback(false);
                        setTimeout(() => setIsOpen(false), 2000);
                      } catch (error) {
                        console.error('[Feedback] Error submitting:', error);
                        // Zobrazit chybu uživateli
                        alert('Nepodařilo se odeslat feedback. Zkuste to prosím později.');
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={!Object.values(feedbackAnswers).some(v => v?.trim())}
                  >
                    💜 Odeslat
                  </Button>
                </div>
              </Card>
            )}

            {/* Feedback Thank You */}
            {feedbackSubmitted && showFeedback && (
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 mx-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="text-sm font-semibold text-gray-800">Děkujeme za vaši zpětnou vazbu!</p>
                  <p className="text-xs text-gray-600 mt-1">
Vaše názory nám pomáhají vytvářet lepší zážitek pro všechny.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg flex-shrink-0">
            {isOffline ? (
              <div className="space-y-3">
                {ticketSubmitted ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-sm font-medium text-gray-800">Děkujeme za váš dotaz!</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Natálie vám odpoví emailem hned, jak bude k dispozici (9:00-24:00).
                    </p>
                  </div>
                ) : showTicketForm ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 text-center">
                      📝 Zanechte svůj dotaz a Natálie vám odpoví emailem
                    </p>
                    <Input
                      type="text"
                      placeholder="Vaše jméno"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="email"
                      placeholder="Váš email"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      className="text-sm"
                    />
                    <textarea
                      placeholder="Váš dotaz..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full text-sm p-2 border rounded-md resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTicketForm(false)}
                        className="flex-1"
                      >
                        Zpět
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!ticketName.trim() || !ticketEmail.trim() || !ticketMessage.trim()) {
                            toast.error("Vyplňte prosím všechna pole");
                            return;
                          }
                          createTicketMutation.mutate({
                            visitorId,
                            variantId: variant?.id,
                            name: ticketName,
                            email: ticketEmail,
                            message: ticketMessage,
                            conversationHistory: JSON.stringify(messages),
                            sourcePage: window.location.pathname,
                            device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                            browser: navigator.userAgent.split(' ').pop() || 'unknown',
                          });
                        }}
                        disabled={createTicketMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {createTicketMutation.isPending ? "Odesílám..." : "Odeslat dotaz"}
                      </Button>
                    </div>
                  </div>
                ) : showWhatsAppQualification ? (
                  // WhatsApp kvalifikační flow - exkluzivní přístup
                  <div className="space-y-2">
                    {!whatsAppQualified ? (
                      <>
                        <p className="text-xs font-medium text-gray-700 text-center">
                          💜 WhatsApp je exkluzivní kontakt pro vážné zájemce
                        </p>
                        <p className="text-[10px] text-gray-500 text-center mb-2">
                          Vyberte důvod vašeho zájmu:
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {WHATSAPP_REASONS.map((reason) => (
                            <button
                              key={reason.id}
                              onClick={() => handleWhatsAppQualify(reason.id)}
                              className="text-[10px] p-2 rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                            >
                              <span className="block font-medium text-purple-700">{reason.label}</span>
                              {reason.subtitle && (
                                <span className="block text-[9px] text-purple-500 mt-0.5">{reason.subtitle}</span>
                              )}
                            </button>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowWhatsAppQualification(false)}
                          className="w-full text-[10px] text-gray-500 mt-1"
                        >
                          ← Zpět
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center py-2">
                          <div className="text-2xl mb-1">✨</div>
                          <p className="text-xs font-medium text-purple-700">Děkujeme za váš zájem!</p>
                          <p className="text-[10px] text-gray-600 mt-1">
                            Natálie se těší na váš kontakt
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleWhatsAppEscalation(selectedWhatsAppReason || undefined)}
                          className="w-full h-9 bg-green-500 hover:bg-green-600 text-white text-sm shadow-md"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Otevřít WhatsApp
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setWhatsAppQualified(false);
                            setSelectedWhatsAppReason(null);
                          }}
                          className="w-full text-[10px] text-gray-500"
                        >
                          ← Změnit důvod
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">🌙 Odpočívá (9-24h)</span>
                      <Button
                        onClick={() => setShowTicketForm(true)}
                        size="sm"
                        className="h-7 px-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-[10px]"
                      >
                        📝 Dotaz
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://t.me/Natalie_Amulets_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-7 px-3 inline-flex items-center justify-center rounded-md text-[10px] bg-[#0088cc] hover:bg-[#006699] text-white transition-colors"
                      >
                        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram Bot
                      </a>
                      <Button
                        size="sm"
                        onClick={handleWhatsAppRequest}
                        variant="outline"
                        className="h-7 px-2 text-[10px] border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600"
                        title="Exkluzivní kontakt pro vážné zájemce"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        VIP
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Napište zprávu..."
                    disabled={chatMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || chatMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • Odpovědi mohou obsahovat chyby
                </p>
              </>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
