import { useState, useRef } from "react";

const SUGGESTED_CATEGORIES = [
  {
    id: "amulets",
    category: "Amulets & Symboly",
    icon: "💜",
    questions: [
      "Jaký amulet je vhodný pro ochranu?",
      "Co znamená Květina života?",
      "Jak vybrat správný symbol?",
    ],
  },
  {
    id: "stones",
    category: "Drahé kameny",
    icon: "💎",
    questions: [
      "Jaké jsou léčivé účinky ametysty?",
      "Který kámen pomáhá na stres?",
      "Jak se péčuje o drahé kameny?",
    ],
  },
  {
    id: "spirituality",
    category: "Spiritualita",
    icon: "✨",
    questions: [
      "Jak začít s meditací?",
      "Co je to chakra?",
      "Jak se zvýšit spirituální vědomí?",
    ],
  },
  {
    id: "products",
    category: "Produkty",
    icon: "🔮",
    questions: [
      "Jaké máte šperky?",
      "Co jsou orgonitové pyramidy?",
      "Jak se používá aromaterapie?",
    ],
  },
  {
    id: "horoscope",
    category: "Čínský horoskop",
    icon: "🐉",
    questions: [
      "Jaké je moje zvířátko v čínském horoskopu?",
      "Jaká je má předpověď na rok 2026?",
      "Jak se počítá čínský horoskop?",
    ],
  },
];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Phone, Volume2, VolumeX } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { useBrowsing } from "@/contexts/BrowsingContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ahoj! 💜 Jsem Natálie z Amulets.cz. Jsem tu pro ty, kteří vědí, co chtějí - ať už je to správný amulet, porozumění svému potenciálu, nebo cesta k pravé svobodě. Ale víš co? Nejdříve mě poslouchej. Co tě sem přivedlo?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getBrowsingContext } = useBrowsing();

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

    chatMutation.mutate({
      message: input,
      context: browsingContext,
      email: email || undefined,
    });

    setTimeout(scrollToBottom, 100);
  };

  const handleEmailCapture = () => {
    if (!email.trim()) return;
    emailCaptureMutation.mutate({ email });
  };

  const handleWhatsAppEscalation = () => {
    const message = encodeURIComponent(
      `Ahoj Natálie, potřebuji pomoc s produkty na Amulets.cz`
    );
    window.open(`https://wa.me/420776041740?text=${message}`, "_blank");
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

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 z-50 p-0 overflow-hidden group"
          aria-label="Otevřít chat s Natálií"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/natalie-avatar.png"
              alt="Natálie"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80 group-hover:from-purple-700/80 group-hover:to-pink-700/80 transition-colors duration-300" />
          <MessageCircle className="relative z-10 h-8 w-8 text-white" />
          
          {/* Pulsing indicator */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/natalie-avatar.png"
                  alt="Natálie"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Natálie Ohorai</h3>
                <p className="text-xs text-white/80">Online • Odpovídám do 1 minuty</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoice}
                className="text-white hover:bg-white/20 h-8 w-8"
                title={voiceEnabled ? "Vypnout hlas" : "Zapnout hlas"}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWhatsAppEscalation}
                className="text-white hover:bg-white/20 h-8 w-8"
                title="Pokračovat na WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages & Questions Container */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
              {messages.map((message, index) => (
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
              <div className="border-t bg-white overflow-y-auto p-3 max-h-64">
                {!selectedCategory ? (
                  <>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Vyberte téma:</p>
                    <div className="grid grid-cols-5 gap-1">
                      {SUGGESTED_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 transition-all text-center flex flex-col items-center justify-center h-20"
                          title={cat.category}
                        >
                          <div className="text-lg mb-0.5">{cat.icon}</div>
                          <p className="text-xs font-medium text-gray-700 break-words">{cat.category}</p>
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
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg flex-shrink-0">
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
          </div>
        </Card>
      )}
    </>
  );
}
