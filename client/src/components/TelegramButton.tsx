import { Send } from "lucide-react";

export default function TelegramButton() {
  const handleClick = () => {
    window.open("https://t.me/Natalie_Amulets_bot", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-20 left-4 z-[60] w-10 h-10 rounded-full bg-[#0088cc] text-white shadow-lg hover:bg-[#0088cc]/90 transition-all hover:scale-110 animate-in fade-in slide-in-from-bottom-4 duration-300 cursor-pointer"
      aria-label="Telegram chat s Natálií"
      title="Napište mi na Telegram"
    >
      <Send className="h-5 w-5 mx-auto" />
    </button>
  );
}
