import { useState, useRef, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Volume2, VolumeX, Play, Pause, Info, X } from 'lucide-react';

// Gloria in Excelsis Deo - andělský hymnus
const BACKGROUND_MUSIC_URL = '/gloria-in-excelsis-deo.mp3';
const START_TIME = 44; // Začít od 0:44

const STORAGE_KEY = 'background-music-enabled';
const VOLUME_KEY = 'background-music-volume';

export default function BackgroundMusic() {
  const { isPlaying, setIsPlaying } = useMusic();
  const [volume, setVolume] = useState(0.15);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved preferences
  useEffect(() => {
    const savedVolume = localStorage.getItem(VOLUME_KEY);
    const savedPlayState = localStorage.getItem(STORAGE_KEY);
    
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    // Restore play state
    if (savedPlayState === 'true') {
      setIsPlaying(true);
    }
  }, [setIsPlaying]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(BACKGROUND_MUSIC_URL);
      audio.loop = true;
      audio.volume = volume;
      audio.preload = 'none';
      audioRef.current = audio;

      // Handle successful load
      audio.oncanplaythrough = () => {
        setIsLoaded(true);
        setHasError(false);
      };

      // Handle audio errors
      audio.onerror = () => {
        console.error('Background music failed to load');
        setHasError(true);
        setIsLoaded(false);
      };

      // Auto-play if it was playing before
      const savedPlayState = localStorage.getItem(STORAGE_KEY);
      if (savedPlayState === 'true') {
        audio.load();
        audio.currentTime = START_TIME;
        audio.play().catch(err => {
          console.log('Auto-play prevented by browser:', err);
          setIsPlaying(false);
          localStorage.setItem(STORAGE_KEY, 'false');
        });
      }

      // When audio loops, reset to start time
      audio.onended = () => {
        if (audio.loop) {
          audio.currentTime = START_TIME;
          audio.play();
        }
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem(VOLUME_KEY, volume.toString());
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem(STORAGE_KEY, 'false');
      } else {
        // Load audio if not loaded yet
        if (audioRef.current.readyState === 0) {
          audioRef.current.load();
        }
        // Start from 0:44
        audioRef.current.currentTime = START_TIME;
        await audioRef.current.play();
        setIsPlaying(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    } catch (error) {
      console.error('Error toggling background music:', error);
      setHasError(true);
    }
  };

  // Don't render if there's an error loading the audio
  if (hasError) {
    return null;
  }

  return (
    <>
      {/* Info popup */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="text-center space-y-4">
              <div className="text-4xl">👼✨</div>
              <h3 className="text-xl font-bold text-[#2C3E50]">
                Gloria in Excelsis Deo
              </h3>
              <p className="text-lg text-[#D4AF37] font-semibold italic">
                "Sláva na výsostech Bohu"
              </p>
              <div className="text-gray-600 text-sm space-y-2">
                <p>
                  Tento latinský výraz pochází z <strong>Bible (Lukáš 2:14)</strong> a je začátkem 
                  andělského hymnu, který zpívali andělé pastýřům při narození Ježíše Krista v Betlémě.
                </p>
                <p>
                  Tato posvátná hudba vám pomůže navodit stav <strong>vnitřního klidu</strong> a 
                  <strong> duchovní harmonie</strong> při prohlížení našich spirituálních symbolů a amuletů.
                </p>
              </div>
              <div className="pt-2 text-xs text-gray-400">
                🎵 Royalty-free duchovní hudba
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Music player - positioned higher to not overlap notifications */}
      <div 
        className="fixed bottom-44 left-4 z-40 flex items-center gap-2"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {/* Main toggle button */}
        <button
          onClick={togglePlay}
          className={`
            group relative p-3 rounded-full shadow-lg transition-all duration-300
            ${isPlaying 
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-white'
            }
          `}
          title={isPlaying ? 'Vypnout hudbu' : 'Zapnout Gloria in Excelsis Deo'}
        >
          {/* Pulse animation when playing */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-amber-400" />
          )}
          
          {isPlaying ? (
            <Pause className="w-5 h-5 relative z-10" />
          ) : (
            <Play className="w-5 h-5 relative z-10" />
          )}
        </button>

        {/* Info button */}
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 rounded-full bg-white/90 text-gray-500 hover:bg-white hover:text-[#D4AF37] shadow-lg transition-all duration-300"
          title="O této hudbě"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Volume slider - shows on hover */}
        <div 
          className={`
            flex items-center gap-2 bg-white/95 rounded-full px-3 py-2 shadow-lg
            transition-all duration-300 overflow-hidden
            ${showVolumeSlider ? 'w-32 opacity-100' : 'w-0 opacity-0 px-0'}
          `}
        >
          <VolumeX className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        {/* Label - shows when not playing and not hovered */}
        {!isPlaying && !showVolumeSlider && (
          <span className="text-xs text-gray-600 bg-white/90 px-3 py-1.5 rounded-full shadow-sm font-medium">
            👼 Gloria in Excelsis Deo
          </span>
        )}

        {/* Playing indicator */}
        {isPlaying && !showVolumeSlider && (
          <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full shadow-sm font-medium flex items-center gap-1">
            <span className="animate-pulse">🎵</span> Sláva na výsostech Bohu
          </span>
        )}
      </div>
    </>
  );
}
