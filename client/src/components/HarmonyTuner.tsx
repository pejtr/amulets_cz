import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Lock,
} from "lucide-react";

// Solfeggio frequencies with Egyptian-inspired names
const FREQUENCIES = [
  { hz: 174, name: "Základní tón", icon: "🔥", description: "Uzemňující energie", color: "#FF6B35", premium: false },
  { hz: 285, name: "Obnova tkání", icon: "🏺", description: "Regenerace těla", color: "#F7C59F", premium: false },
  { hz: 396, name: "Osvobození", icon: "🔓", description: "Uvolnění strachu", color: "#FFD700", premium: false },
  { hz: 417, name: "Změna", icon: "💎", description: "Transformace", color: "#00CED1", premium: true },
  { hz: 432, name: "Harmonie", icon: "✨", description: "Univerzální ladění", color: "#9B59B6", premium: false },
  { hz: 528, name: "Láska", icon: "💚", description: "Frekvence zázraků", color: "#2ECC71", premium: false },
  { hz: 639, name: "Vztahy", icon: "🧡", description: "Spojení duší", color: "#E67E22", premium: true },
  { hz: 741, name: "Probuzení", icon: "🌸", description: "Intuice", color: "#FF69B4", premium: true },
  { hz: 852, name: "Duchovní řád", icon: "🔮", description: "Třetí oko", color: "#8E44AD", premium: true },
  { hz: 963, name: "Jednota", icon: "🌀", description: "Korunní čakra", color: "#3498DB", premium: true },
];

interface HarmonyTunerProps {
  onExpandChange?: (expanded: boolean) => void;
  isPremium?: boolean;
}

export default function HarmonyTuner({ onExpandChange, isPremium = false }: HarmonyTunerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(FREQUENCIES[4]); // 432 Hz default
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showFrequencyWheel, setShowFrequencyWheel] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play frequency
  const playFrequency = useCallback(() => {
    initAudio();
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }

    if (audioContextRef.current && gainNodeRef.current) {
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = "sine";
      oscillatorRef.current.frequency.setValueAtTime(
        selectedFrequency.hz,
        audioContextRef.current.currentTime
      );
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
      setIsPlaying(true);
    }
  }, [selectedFrequency, initAudio]);

  // Stop frequency
  const stopFrequency = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      stopFrequency();
    } else {
      playFrequency();
    }
  };

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update frequency when changed while playing
  useEffect(() => {
    if (isPlaying && oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        selectedFrequency.hz,
        audioContextRef.current.currentTime
      );
    }
  }, [selectedFrequency, isPlaying]);

  // Notify parent about fullscreen change
  useEffect(() => {
    onExpandChange?.(isFullscreen);
  }, [isFullscreen, onExpandChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFrequency();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopFrequency]);

  // Check if frequency is locked (premium only)
  const isFrequencyLocked = (freq: typeof FREQUENCIES[0]) => {
    return freq.premium && !isPremium;
  };

  // Select frequency
  const handleSelectFrequency = (freq: typeof FREQUENCIES[0]) => {
    if (isFrequencyLocked(freq)) {
      // Show premium modal or toast
      return;
    }
    setSelectedFrequency(freq);
    if (isPlaying) {
      // Frequency will update via useEffect
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-40 p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
        title="Otevřít Ladičku Harmonie"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    );
  }

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-auto">
        {/* Egyptian pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Close button */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="container mx-auto px-4 py-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 mb-2">
              ✨ Ladička Harmonie ✨
            </h1>
            <p className="text-amber-200/70 text-lg">
              Ponořte se do světa léčivých frekvencí starověkého Egypta
            </p>
          </div>

          {/* Main frequency display - Egyptian magical instrument style */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer golden ring */}
              <div 
                className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-amber-500/50 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(139,69,19,0.3) 0%, rgba(0,0,0,0.8) 100%)",
                  boxShadow: isPlaying 
                    ? `0 0 60px ${selectedFrequency.color}40, inset 0 0 40px ${selectedFrequency.color}20` 
                    : "0 0 30px rgba(255,215,0,0.2)",
                }}
              >
                {/* Inner circle with frequency */}
                <div 
                  className={`w-48 h-48 md:w-60 md:h-60 rounded-full border-2 border-amber-400/30 flex flex-col items-center justify-center transition-all duration-500 ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{
                    background: `radial-gradient(circle, ${selectedFrequency.color}20 0%, transparent 70%)`,
                  }}
                >
                  {/* Play button */}
                  <button
                    onClick={togglePlay}
                    className="mb-2 p-4 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-amber-400" />
                    ) : (
                      <Play className="w-8 h-8 text-amber-400 ml-1" />
                    )}
                  </button>
                  
                  {/* Frequency display */}
                  <div className="text-5xl md:text-6xl font-bold text-amber-400">
                    {selectedFrequency.hz} <span className="text-2xl">Hz</span>
                  </div>
                  <div className="text-amber-200 text-lg mt-1">{selectedFrequency.name}</div>
                  <div className="text-amber-200/60 text-sm">{selectedFrequency.description}</div>
                </div>
              </div>

              {/* Frequency selector wheel around the main circle */}
              {FREQUENCIES.map((freq, index) => {
                const angle = (index * 36) - 90; // 360/10 = 36 degrees per item
                const radius = 180; // Distance from center
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isSelected = freq.hz === selectedFrequency.hz;
                const locked = isFrequencyLocked(freq);

                return (
                  <button
                    key={freq.hz}
                    onClick={() => handleSelectFrequency(freq)}
                    className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-amber-500/30 border-2 border-amber-400 scale-110' 
                        : locked
                          ? 'bg-slate-800/80 border border-slate-600 opacity-60'
                          : 'bg-slate-800/80 border border-amber-500/30 hover:border-amber-400 hover:scale-105'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 40px)`,
                      top: `calc(50% + ${y}px - 40px)`,
                    }}
                    disabled={locked}
                  >
                    {locked ? (
                      <Lock className="w-4 h-4 text-slate-500 mb-1" />
                    ) : (
                      <span className="text-lg">{freq.icon}</span>
                    )}
                    <span className={`text-sm font-bold ${isSelected ? 'text-amber-400' : locked ? 'text-slate-500' : 'text-amber-200'}`}>
                      {freq.hz} Hz
                    </span>
                    <span className={`text-xs ${isSelected ? 'text-amber-300' : locked ? 'text-slate-600' : 'text-amber-200/60'}`}>
                      {freq.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-amber-400" />
              ) : (
                <Volume2 className="w-6 h-6 text-amber-400" />
              )}
            </button>
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="w-48"
            />
          </div>

          {/* Premium upgrade prompt */}
          {!isPremium && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600/20 to-purple-600/20 border border-amber-500/30">
                <Lock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-200">
                  Odemkněte všechny frekvence s <strong className="text-amber-400">Premium</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Lite mode - floating bottom bar
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Egyptian-style floating bar */}
      <div 
        className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          boxShadow: isPlaying 
            ? `0 0 30px ${selectedFrequency.color}30, 0 10px 40px rgba(0,0,0,0.5)` 
            : "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Egyptian icon + frequency info */}
          <div className="flex items-center gap-3">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}
              style={{
                background: `radial-gradient(circle, ${selectedFrequency.color}40 0%, transparent 70%)`,
                border: `2px solid ${selectedFrequency.color}60`,
              }}
            >
              <span className="text-2xl">{selectedFrequency.icon}</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-amber-400 font-bold text-lg">
                {selectedFrequency.hz} Hz
              </div>
              <div className="text-amber-200/60 text-sm">
                {selectedFrequency.name}
              </div>
            </div>
          </div>

          {/* Center: Play/Pause + Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white transition-all duration-300 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-amber-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-amber-400" />
              )}
            </button>

            <div className="hidden md:block w-24">
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
              />
            </div>
          </div>

          {/* Right: Frequency selector + Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Quick frequency buttons (lite version - only free ones) */}
            <div className="hidden lg:flex gap-1">
              {FREQUENCIES.filter(f => !f.premium).slice(0, 4).map((freq) => (
                <button
                  key={freq.hz}
                  onClick={() => handleSelectFrequency(freq)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    freq.hz === selectedFrequency.hz
                      ? 'bg-amber-500/30 text-amber-400 border border-amber-400'
                      : 'bg-slate-700/50 text-amber-200/70 hover:bg-slate-700 hover:text-amber-200'
                  }`}
                >
                  {freq.hz}
                </button>
              ))}
            </div>

            {/* Show more frequencies button */}
            <button
              onClick={() => setShowFrequencyWheel(!showFrequencyWheel)}
              className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
              title="Zobrazit frekvence"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
            </button>

            {/* Fullscreen button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-gradient-to-r from-purple-600/30 to-amber-600/30 hover:from-purple-600/50 hover:to-amber-600/50 transition-colors border border-amber-500/30"
              title="Plná verze"
            >
              <Maximize2 className="w-5 h-5 text-amber-400" />
            </button>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors"
              title="Skrýt"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Expandable frequency selector */}
        {showFrequencyWheel && (
          <div className="px-4 pb-4 border-t border-amber-500/20">
            <div className="pt-3 flex flex-wrap gap-2 justify-center">
              {FREQUENCIES.map((freq) => {
                const locked = isFrequencyLocked(freq);
                return (
                  <button
                    key={freq.hz}
                    onClick={() => handleSelectFrequency(freq)}
                    disabled={locked}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      freq.hz === selectedFrequency.hz
                        ? 'bg-amber-500/30 text-amber-400 border border-amber-400'
                        : locked
                          ? 'bg-slate-800/50 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : 'bg-slate-700/50 text-amber-200/70 hover:bg-slate-700 hover:text-amber-200 border border-transparent'
                    }`}
                  >
                    {locked ? <Lock className="w-4 h-4" /> : <span>{freq.icon}</span>}
                    <span className="font-medium">{freq.hz} Hz</span>
                    <span className="text-xs opacity-70">{freq.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
