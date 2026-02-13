import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Upload, X, Music, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

// Solfeggio frequencies for matching
const SOLFEGGIO_FREQUENCIES = [
  { hz: 174, name: "Základní tón", chakra: "Kořenová", color: "#FF6B6B", icon: "🔴" },
  { hz: 285, name: "Obnova", chakra: "Sakrální", color: "#FFA500", icon: "🟠" },
  { hz: 396, name: "Osvobození", chakra: "Solar plexus", color: "#FFD700", icon: "🟡" },
  { hz: 417, name: "Změna", chakra: "Solar plexus", color: "#9ACD32", icon: "🟢" },
  { hz: 432, name: "Harmonie", chakra: "Srdeční", color: "#00CED1", icon: "💚" },
  { hz: 528, name: "Láska", chakra: "Srdeční", color: "#FF69B4", icon: "💗" },
  { hz: 639, name: "Vztahy", chakra: "Hrdelní", color: "#DA70D6", icon: "💜" },
  { hz: 741, name: "Probuzení", chakra: "Třetí oko", color: "#9370DB", icon: "🔮" },
  { hz: 852, name: "Duchovnost", chakra: "Třetí oko", color: "#4169E1", icon: "👁️" },
  { hz: 963, name: "Jednota", chakra: "Korunní", color: "#EE82EE", icon: "👑" },
];

// Meditation tips for each frequency range
const MEDITATION_TIPS: Record<string, string[]> = {
  low: [
    "Tato nízká frekvence rezonuje s kořenovou čakrou.",
    "Zkuste meditaci zaměřenou na uzemnění a stabilitu.",
    "Doporučujeme 174 Hz nebo 285 Hz pro hlubší relaxaci.",
  ],
  mid: [
    "Střední frekvence podporují emocionální rovnováhu.",
    "Ideální pro práci se srdeční čakrou a vztahy.",
    "Zkuste 528 Hz pro léčení a transformaci.",
  ],
  high: [
    "Vysoké frekvence aktivují vyšší vědomí.",
    "Podporují intuici a duchovní probuzení.",
    "852 Hz nebo 963 Hz pro hlubokou meditaci.",
  ],
};

interface AudioAnalyzerProps {
  onFrequencyDetected?: (frequency: number, closestSolfeggio: typeof SOLFEGGIO_FREQUENCIES[0]) => void;
  onClose?: () => void;
}

export default function AudioAnalyzer({ onFrequencyDetected, onClose }: AudioAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [closestSolfeggio, setClosestSolfeggio] = useState<typeof SOLFEGGIO_FREQUENCIES[0] | null>(null);
  const [meditationTips, setMeditationTips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(0));
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find closest Solfeggio frequency
  const findClosestSolfeggio = useCallback((frequency: number) => {
    let closest = SOLFEGGIO_FREQUENCIES[0];
    let minDiff = Math.abs(frequency - closest.hz);
    
    for (const sf of SOLFEGGIO_FREQUENCIES) {
      const diff = Math.abs(frequency - sf.hz);
      if (diff < minDiff) {
        minDiff = diff;
        closest = sf;
      }
    }
    
    return closest;
  }, []);

  // Get meditation tips based on frequency
  const getMeditationTips = useCallback((frequency: number) => {
    if (frequency < 300) return MEDITATION_TIPS.low;
    if (frequency < 600) return MEDITATION_TIPS.mid;
    return MEDITATION_TIPS.high;
  }, []);

  // Autocorrelation pitch detection (more accurate than FFT peak)
  const autoCorrelate = useCallback((buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;
    let foundGoodCorrelation = false;
    const correlations = new Array(MAX_SAMPLES);

    // Calculate RMS
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    // Not enough signal
    if (rms < 0.01) return -1;

    let lastCorrelation = 1;
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - correlation / MAX_SAMPLES;
      correlations[offset] = correlation;

      if (correlation > 0.9 && correlation > lastCorrelation) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
        return sampleRate / (bestOffset + 8 * shift);
      }
      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01) {
      return sampleRate / bestOffset;
    }
    return -1;
  }, []);

  // Analyze audio in real-time
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const analyze = () => {
      if (!analyserRef.current) return;
      
      analyser.getFloatTimeDomainData(dataArray);
      analyser.getByteFrequencyData(frequencyData);
      
      // Update visualizer
      const visualizerBins = 32;
      const binSize = Math.floor(frequencyData.length / visualizerBins);
      const newVisualizerData = [];
      for (let i = 0; i < visualizerBins; i++) {
        let sum = 0;
        for (let j = 0; j < binSize; j++) {
          sum += frequencyData[i * binSize + j];
        }
        newVisualizerData.push(sum / binSize / 255);
      }
      setVisualizerData(newVisualizerData);

      // Detect pitch using autocorrelation
      const frequency = autoCorrelate(dataArray, audioContextRef.current!.sampleRate);
      
      if (frequency > 50 && frequency < 2000) {
        setDetectedFrequency(Math.round(frequency));
        const closest = findClosestSolfeggio(frequency);
        setClosestSolfeggio(closest);
        setMeditationTips(getMeditationTips(frequency));
        
        if (onFrequencyDetected) {
          onFrequencyDetected(frequency, closest);
        }
      }

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  }, [autoCorrelate, findClosestSolfeggio, getMeditationTips, onFrequencyDetected]);

  // Start recording from microphone
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setIsRecording(true);
      analyzeAudio();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Nepodařilo se získat přístup k mikrofonu. Zkontrolujte oprávnění.');
    }
  }, [analyzeAudio]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsRecording(false);
    setVisualizerData(new Array(32).fill(0));
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Analyze the audio buffer
      const channelData = audioBuffer.getChannelData(0);
      const frequency = autoCorrelate(channelData, audioBuffer.sampleRate);
      
      if (frequency > 50 && frequency < 2000) {
        setDetectedFrequency(Math.round(frequency));
        const closest = findClosestSolfeggio(frequency);
        setClosestSolfeggio(closest);
        setMeditationTips(getMeditationTips(frequency));
        
        if (onFrequencyDetected) {
          onFrequencyDetected(frequency, closest);
        }
      } else {
        setError('Nepodařilo se detekovat frekvenci. Zkuste jiný soubor.');
      }
      
      audioContext.close();
    } catch (err) {
      console.error('Error processing audio file:', err);
      setError('Nepodařilo se zpracovat audio soubor.');
    }
  }, [autoCorrelate, findClosestSolfeggio, getMeditationTips, onFrequencyDetected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#D4AF37]/20">
            <Waves className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37]">Audio Analyzér</h3>
            <p className="text-sm text-slate-400">Detekce tóniny a frekvence</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Visualizer */}
      <div className="h-24 flex items-end justify-center gap-1 mb-6 bg-slate-800/50 rounded-xl p-4">
        {visualizerData.map((value, index) => (
          <div
            key={index}
            className="w-2 bg-gradient-to-t from-[#D4AF37] to-purple-500 rounded-t transition-all duration-75"
            style={{ height: `${Math.max(4, value * 100)}%` }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex-1 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gradient-to-r from-[#D4AF37] to-purple-600 hover:from-[#E5C158] hover:to-purple-500'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Zastavit nahrávání
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Nahrávat z mikrofonu
            </>
          )}
        </Button>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          disabled={isRecording}
        >
          <Upload className="w-5 h-5 mr-2" />
          Nahrát soubor
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Detection results */}
      {detectedFrequency && closestSolfeggio && (
        <div className="space-y-4">
          {/* Detected frequency */}
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Detekovaná frekvence</span>
              <span className="text-3xl font-bold text-white">{detectedFrequency} Hz</span>
            </div>
          </div>

          {/* Closest Solfeggio */}
          <div 
            className="p-4 rounded-xl border-2"
            style={{ 
              backgroundColor: `${closestSolfeggio.color}15`,
              borderColor: `${closestSolfeggio.color}50`
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{closestSolfeggio.icon}</span>
              <div>
                <div className="text-lg font-bold" style={{ color: closestSolfeggio.color }}>
                  {closestSolfeggio.hz} Hz - {closestSolfeggio.name}
                </div>
                <div className="text-sm text-slate-400">
                  Čakra: {closestSolfeggio.chakra}
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-300">
              Rozdíl: {Math.abs(detectedFrequency - closestSolfeggio.hz)} Hz
            </div>
          </div>

          {/* Meditation tips */}
          <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-purple-300">Meditační tipy</span>
            </div>
            <ul className="space-y-2">
              {meditationTips.map((tip, index) => (
                <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400">✨</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Instructions when not recording */}
      {!isRecording && !detectedFrequency && (
        <div className="text-center text-slate-400 py-8">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">
            Klikněte na "Nahrávat z mikrofonu" nebo nahrajte audio soubor
            <br />
            pro detekci frekvence a doporučení meditace.
          </p>
        </div>
      )}
    </div>
  );
}
