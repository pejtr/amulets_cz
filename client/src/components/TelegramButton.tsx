import { Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function TelegramButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleChatOpen = () => setIsChatOpen(true);
    const handleChatClose = () => setIsChatOpen(false);

    window.addEventListener('chatOpen', handleChatOpen);
    window.addEventListener('chatClose', handleChatClose);

    return () => {
      window.removeEventListener('chatOpen', handleChatOpen);
      window.removeEventListener('chatClose', handleChatClose);
    };
  }, []);

  const handleClick = () => {
    window.open("https://t.me/Natalie_Amulets_bot", "_blank");
  };

  // Skrýt tlačítko když je chat otevřený
  if (isChatOpen) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 z-[60]">
      {/* Puls efekt - jemná animace */}
      <div className="absolute inset-0 rounded-full bg-[#0088cc] opacity-75 animate-ping" style={{ animationDuration: '2s' }}></div>
      
      {/* Hlavní tlačítko */}
      <button
        onClick={handleClick}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#0088cc] to-[#0077b3] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 animate-in fade-in slide-in-from-left-4 duration-500 cursor-pointer flex items-center justify-center group"
        aria-label="Telegram chat s Natálií"
        title="Napište mi na Telegram @Natalie_Amulets_bot"
      >
        <Send className="h-5 w-5 group-hover:rotate-12 transition-transform" />
        
        {/* Vnitřní záře */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
    </div>
  );
}
