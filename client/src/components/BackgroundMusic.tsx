import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Lokální meditační hudba - uložena v public složce
// Použijeme royalty-free hudbu z Pixabay
const BACKGROUND_MUSIC_URL = '/meditation-music.mp3';

const STORAGE_KEY = 'background-music-enabled';
const VOLUME_KEY = 'background-music-volume';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved preferences
  useEffect(() => {
    const savedVolume = localStorage.getItem(VOLUME_KEY);
    
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

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
    <div 
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      {/* Main toggle button */}
      <button
        onClick={togglePlay}
        className={`
          group relative p-3 rounded-full shadow-lg transition-all duration-300
          ${isPlaying 
            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
            : 'bg-white/90 text-gray-600 hover:bg-white'
          }
        `}
        title={isPlaying ? 'Vypnout hudbu' : 'Zapnout meditační hudbu'}
      >
        {/* Pulse animation when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-purple-400" />
        )}
        
        {isPlaying ? (
          <Volume2 className="w-5 h-5 relative z-10" />
        ) : (
          <Music className="w-5 h-5 relative z-10" />
        )}
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
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>

      {/* Label - shows when not playing and not hovered */}
      {!isPlaying && !showVolumeSlider && (
        <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full shadow-sm">
          🎵 Meditační hudba
        </span>
      )}
    </div>
  );
}
