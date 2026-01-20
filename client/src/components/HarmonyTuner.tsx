import { useState, useRef, useEffect, useCallback } from "react";
import { useHarmonyTuner, FREQUENCY_MEDITATION_TIPS } from "@/contexts/HarmonyTunerContext";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Solfeggio frequencies with chakra information
const FREQUENCIES = [
  { hz: 174, name: "Základní tón", chakra: "Kořenová", icon: "🔥", description: "Uzemňující energie", color: "#C41E3A", premium: false },
  { hz: 285, name: "Obnova", chakra: "Sakální", icon: "🏺", description: "Regenerace těla", color: "#FF6B35", premium: false },
  { hz: 396, name: "Osvobození", chakra: "Solarní plexus", icon: "🔓", description: "Uvolnění strachu", color: "#FFD700", premium: false },
  { hz: 417, name: "Změna", chakra: "Solarní plexus", icon: "💎", description: "Transformace", color: "#F7C59F", premium: false },
  { hz: 432, name: "Harmonie", chakra: "Srdeční", icon: "✨", description: "Univerzální ladění", color: "#2ECC71", premium: false },
  { hz: 528, name: "Láska", chakra: "Srdeční", icon: "💚", description: "Frekvence zázraků", color: "#00D084", premium: false },
  { hz: 639, name: "Vztahy", chakra: "Hrdelní", icon: "🧡", description: "Spojení duší", color: "#00CED1", premium: false },
  { hz: 741, name: "Probuzení", chakra: "Třetí oko", icon: "🌸", description: "Intuice", color: "#4B0082", premium: false },
  { hz: 852, name: "Duchovnost", chakra: "Třetí oko", icon: "🔮", description: "Duchovní řád", color: "#8E44AD", premium: false },
  { hz: 963, name: "Jednota", chakra: "Korunní", icon: "🌀", description: "Korunní čakra", color: "#9B59B6", premium: false },
];

interface HarmonyTunerProps {
  onExpandChange?: (expanded: boolean) => void;
  isPremium?: boolean;
}

export default function HarmonyTuner({ onExpandChange, isPremium = false }: HarmonyTunerProps) {
  // Use context to share state with chatbot
  const { setIsExpanded, setCurrentFrequency, setIsPlaying: setContextIsPlaying } = useHarmonyTuner();
  
  // Multi-frequency playback - track which frequencies are playing
  const [playingFrequencies, setPlayingFrequencies] = useState<Set<number>>(new Set());
  const [selectedFrequency, setSelectedFrequency] = useState(FREQUENCIES[4]); // 432 Hz default for display
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showFrequencyWheel, setShowFrequencyWheel] = useState(false);
  
  // Audio contexts for each frequency (multi-frequency support)
  const audioContextsRef = useRef<Map<number, {
    context: AudioContext;
    oscillator: OscillatorNode;
    gainNode: GainNode;
  }>>(new Map());

  // Initialize audio for a specific frequency
  const initAudioForFrequency = useCallback((hz: number) => {
    if (!audioContextsRef.current.has(hz)) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.value = isMuted ? 0 : volume;
      
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(hz, context.currentTime);
      oscillator.connect(gainNode);
      
      audioContextsRef.current.set(hz, { context, oscillator, gainNode });
    }
  }, [volume, isMuted]);

  // Play a specific frequency
  const playFrequency = useCallback((hz: number) => {
    initAudioForFrequency(hz);
    const audio = audioContextsRef.current.get(hz);
    if (audio && audio.oscillator.context.state !== 'running') {
      audio.oscillator.start();
      setPlayingFrequencies(prev => new Set([...Array.from(prev), hz]));
    }
  }, [initAudioForFrequency]);

  // Stop a specific frequency
  const stopFrequency = useCallback((hz: number) => {
    const audio = audioContextsRef.current.get(hz);
    if (audio) {
      try {
        audio.oscillator.stop();
        audio.oscillator.disconnect();
        audio.context.close();
      } catch (e) {
        // Already stopped
      }
      audioContextsRef.current.delete(hz);
      setPlayingFrequencies(prev => {
        const newSet = new Set(prev);
        newSet.delete(hz);
        return newSet;
      });
    }
  }, []);

  // Toggle play/pause for a specific frequency
  const toggleFrequency = (hz: number) => {
    if (playingFrequencies.has(hz)) {
      stopFrequency(hz);
    } else {
      playFrequency(hz);
    }
  };

  // Stop all frequencies
  const stopAllFrequencies = useCallback(() => {
    Array.from(playingFrequencies).forEach(hz => stopFrequency(hz));
  }, [playingFrequencies, stopFrequency]);

  // Update volume for all playing frequencies
  useEffect(() => {
    audioContextsRef.current.forEach((audio) => {
      audio.gainNode.gain.value = isMuted ? 0 : volume;
    });
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllFrequencies();
    };
  }, [stopAllFrequencies]);

  // Notify parent and context of expansion state
  useEffect(() => {
    onExpandChange?.(isFullscreen);
    setIsExpanded(isFullscreen);
    
    // When expanded, notify chatbot with current frequency
    if (isFullscreen) {
      setCurrentFrequency({
        hz: selectedFrequency.hz,
        name: selectedFrequency.name,
        icon: selectedFrequency.icon,
        description: selectedFrequency.description,
        meditationTip: FREQUENCY_MEDITATION_TIPS[selectedFrequency.hz] || '',
      });
    }
  }, [isFullscreen, onExpandChange, setIsExpanded, setCurrentFrequency, selectedFrequency]);
  
  // Update context when playing state changes
  useEffect(() => {
    setContextIsPlaying(playingFrequencies.size > 0);
  }, [playingFrequencies, setContextIsPlaying]);
  
  // Update context when frequency changes
  useEffect(() => {
    if (isFullscreen) {
      setCurrentFrequency({
        hz: selectedFrequency.hz,
        name: selectedFrequency.name,
        icon: selectedFrequency.icon,
        description: selectedFrequency.description,
        meditationTip: FREQUENCY_MEDITATION_TIPS[selectedFrequency.hz] || '',
      });
    }
  }, [selectedFrequency, isFullscreen, setCurrentFrequency]);

  // Check if frequency is locked
  const isFrequencyLocked = (freq: typeof FREQUENCIES[0]) => {
    return freq.premium && !isPremium;
  };

  // Handle frequency selection (for display, not for playing)
  const handleSelectFrequency = (freq: typeof FREQUENCIES[0]) => {
    if (isFrequencyLocked(freq)) {
      alert("Tato frekvence je dostupná pouze pro Premium uživatele. Kontaktujte nás pro více informací.");
      return;
    }
    
    setSelectedFrequency(freq);
  };

  // Hidden state - show reopen button
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-40 p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E5B8] to-[#D4AF37] mb-2">
              ✨ Ladička Harmonie ✨
            </h1>
            <p className="text-[#D4AF37]/70 text-lg">
              Ponořte se do světa léčivých frekvencí starověkého Egypta
            </p>
          </div>

          {/* Main frequency display - Egyptian magical instrument style */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer golden ring */}
              <div 
                className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-[#D4AF37]/50 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(139,69,19,0.3) 0%, rgba(0,0,0,0.8) 100%)",
                  boxShadow: playingFrequencies.size > 0
                    ? `0 0 60px ${selectedFrequency.color}40, inset 0 0 40px ${selectedFrequency.color}20` 
                    : "0 0 30px rgba(212,175,55,0.2)",
                }}
              >
                {/* Inner circle with frequency */}
                <div 
                  className={`w-48 h-48 md:w-60 md:h-60 rounded-full border-2 border-[#D4AF37]/30 flex flex-col items-center justify-center transition-all duration-500 ${playingFrequencies.size > 0 ? 'animate-pulse' : ''}`}
                  style={{
                    background: `radial-gradient(circle, ${selectedFrequency.color}20 0%, transparent 70%)`,
                  }}
                >
                  {/* Play button */}
                  <button
                    onClick={() => toggleFrequency(selectedFrequency.hz)}
                    className="mb-2 p-4 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 transition-colors"
                  >
                    {playingFrequencies.has(selectedFrequency.hz) ? (
                      <Pause className="w-8 h-8 text-[#D4AF37]" />
                    ) : (
                      <Play className="w-8 h-8 text-[#D4AF37] ml-1" />
                    )}
                  </button>
                  
                  {/* Frequency display */}
                  <div className="text-5xl md:text-6xl font-bold text-[#D4AF37]">
                    {selectedFrequency.hz} <span className="text-2xl">Hz</span>
                  </div>
                  <div className="text-[#D4AF37]/90 text-lg mt-1">{selectedFrequency.name}</div>
                  <div className="text-[#D4AF37]/60 text-sm">{selectedFrequency.description}</div>
                </div>
              </div>

              {/* Frequency selector wheel around the main circle */}
              {FREQUENCIES.map((freq, index) => {
                const angle = (index * 36) - 90; // 360/10 = 36 degrees per item
                const radius = 180; // Distance from center
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isSelected = freq.hz === selectedFrequency.hz;
                const isPlaying = playingFrequencies.has(freq.hz);
                const locked = isFrequencyLocked(freq);

                return (
                  <button
                    key={freq.hz}
                    onClick={() => {
                      handleSelectFrequency(freq);
                      toggleFrequency(freq.hz);
                    }}
                    className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#D4AF37]/30 border-2 border-[#D4AF37] scale-110' 
                        : isPlaying
                          ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]/70 animate-pulse'
                          : locked
                            ? 'bg-slate-800/80 border border-slate-600 opacity-60'
                            : 'bg-slate-800/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:scale-105'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 2rem)`,
                      top: `calc(50% + ${y}px - 2rem)`,
                    }}
                    title={locked ? "🔒 Premium" : freq.description}
                  >
                    {locked ? (
                      <Lock className="w-6 h-6 text-slate-500" />
                    ) : (
                      <span className="text-lg">{freq.icon}</span>
                    )}
                    <span className={`text-sm font-bold ${isSelected ? 'text-[#D4AF37]' : isPlaying ? 'text-[#D4AF37]' : locked ? 'text-slate-500' : 'text-[#D4AF37]/90'}`}>
                      {freq.hz} Hz
                    </span>
                    <span className={`text-xs ${isSelected ? 'text-[#D4AF37]/90' : isPlaying ? 'text-[#D4AF37]/80' : locked ? 'text-slate-600' : 'text-[#D4AF37]/60'}`}>
                      {freq.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume control */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-[#D4AF37]" />
              ) : (
                <Volume2 className="w-6 h-6 text-[#D4AF37]" />
              )}
            </button>
            <div className="w-48">
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
              />
            </div>
          </div>

          {/* Playing frequencies indicator */}
          {playingFrequencies.size > 0 && (
            <div className="text-center mb-4">
              <p className="text-[#D4AF37]/80 text-sm">
                Hraje {playingFrequencies.size} {playingFrequencies.size === 1 ? 'frekvence' : playingFrequencies.size < 5 ? 'frekvence' : 'frekvencí'}
              </p>
              <button
                onClick={stopAllFrequencies}
                className="mt-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm transition-colors"
              >
                Zastavit vše
              </button>
            </div>
          )}

          {/* Premium upsell */}
          {!isPremium && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-purple-600/20 border border-[#D4AF37]/30">
                <Lock className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#D4AF37]/90">
                  Odemkněte všechny frekvence s <strong className="text-[#D4AF37]">Premium</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Lite mode - floating bottom bar (redesigned layout)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      {/* Egyptian-style floating bar - redesigned with wave animation */}
      <div 
        className={`mx-4 mb-4 rounded-2xl overflow-hidden shadow-2xl max-w-full w-full relative ${
          playingFrequencies.size > 0 ? 'animate-wave' : ''
        }`}
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          boxShadow: playingFrequencies.size > 0
            ? `0 0 30px ${selectedFrequency.color}30, 0 10px 40px rgba(0,0,0,0.5)` 
            : "0 10px 40px rgba(0,0,0,0.5)",
          animation: playingFrequencies.size > 0 ? 'wave-pulse 2s ease-in-out infinite' : 'none',
        }}
      >
        {/* Wave animation overlay when playing */}
        {playingFrequencies.size > 0 && (
          <>
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${selectedFrequency.color}15 0%, transparent 70%)`,
                animation: 'wave-ripple 3s ease-out infinite',
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${selectedFrequency.color}10 0%, transparent 70%)`,
                animation: 'wave-ripple 3s ease-out infinite 1s',
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${selectedFrequency.color}08 0%, transparent 70%)`,
                animation: 'wave-ripple 3s ease-out infinite 2s',
              }}
            />
          </>
        )}
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Play/Pause + Volume + Description */}
          <div className="flex items-center gap-3">
            {/* Play/Pause - úplně vlevo */}
            <button
              onClick={() => toggleFrequency(selectedFrequency.hz)}
              className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#D4AF37] text-white transition-all duration-300 shadow-lg flex-shrink-0"
            >
              {playingFrequencies.has(selectedFrequency.hz) ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {/* Volume */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 transition-colors flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#D4AF37]" />
              )}
            </button>

            <div className="hidden md:block w-24 flex-shrink-0">
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
              />
            </div>

            {/* Description - hned po volume */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-2xl">{selectedFrequency.icon}</span>
              <div>
                <div className="text-[#D4AF37] font-bold text-sm">
                  {selectedFrequency.hz} Hz - {selectedFrequency.name}
                </div>
                <div className="text-[#D4AF37]/60 text-xs">
                  {selectedFrequency.description}
                </div>
              </div>
            </div>
          </div>

          {/* Center: All 10 frequency buttons - menší aby se vešly všechny */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {FREQUENCIES.map((freq) => {
              const isSelected = freq.hz === selectedFrequency.hz;
              const isPlaying = playingFrequencies.has(freq.hz);

              return (
                <button
                  key={freq.hz}
                  onClick={() => {
                    handleSelectFrequency(freq);
                    toggleFrequency(freq.hz);
                  }}
                  className={`w-[75px] h-[75px] rounded-xl flex flex-col items-center justify-center gap-0.5 font-medium transition-all duration-300 relative flex-shrink-0 ${
                    isPlaying
                      ? 'scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: isSelected || isPlaying
                      ? `linear-gradient(135deg, ${freq.color}40 0%, ${freq.color}20 100%)`
                      : `linear-gradient(135deg, ${freq.color}20 0%, ${freq.color}10 100%)`,
                    border: `2px solid ${isSelected || isPlaying ? freq.color : freq.color + '60'}`,
                    boxShadow: isPlaying
                      ? `0 0 25px ${freq.color}60, 0 0 50px ${freq.color}30, inset 0 0 20px ${freq.color}10`
                      : isSelected
                        ? `0 0 20px ${freq.color}40, inset 0 0 15px ${freq.color}08`
                        : `0 0 10px ${freq.color}20`,
                  }}
                >
                  {/* Wave animation overlay when playing */}
                  {isPlaying && (
                    <>
                      <span
                        className="absolute inset-0 rounded-2xl animate-ping"
                        style={{
                          background: `radial-gradient(circle, ${freq.color}30 0%, transparent 70%)`,
                        }}
                      />
                      <span
                        className="absolute inset-0 rounded-2xl animate-pulse"
                        style={{
                          background: `radial-gradient(circle, ${freq.color}20 0%, transparent 80%)`,
                        }}
                      />
                    </>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    {/* Hz */}
                    <div 
                      className="text-xs font-bold tracking-wide"
                      style={{ color: freq.color }}
                    >
                      {freq.hz} Hz
                    </div>
                    
                    {/* Název */}
                    <div 
                      className="text-sm font-semibold leading-tight text-center"
                      style={{ color: freq.color }}
                    >
                      {freq.name}
                    </div>
                    
                    {/* Čakra */}
                    <div 
                      className="text-[10px] opacity-80 leading-tight text-center"
                      style={{ color: freq.color }}
                    >
                      {freq.chakra}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Fullscreen + Close */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Fullscreen button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-gradient-to-r from-purple-600/30 to-[#D4AF37]/30 hover:from-purple-600/50 hover:to-[#D4AF37]/50 transition-colors border border-[#D4AF37]/30"
              title="Plná verze"
            >
              <Maximize2 className="w-5 h-5 text-[#D4AF37]" />
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

        {/* Playing frequencies indicator */}
        {playingFrequencies.size > 1 && (
          <div className="px-4 pb-2 flex items-center justify-between border-t border-[#D4AF37]/10">
            <p className="text-[#D4AF37]/70 text-xs">
              Hraje {playingFrequencies.size} frekvencí najednou
            </p>
            <button
              onClick={stopAllFrequencies}
              className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs transition-colors"
            >
              Zastavit vše
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
