import React, { useState, useEffect } from 'react';
import { audioSynth } from '../utils/audio';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  themePrimary: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ themePrimary }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Keep in sync with audioSynth
    setIsPlaying(audioSynth.isPlaying());
  }, []);

  const handleToggle = () => {
    audioSynth.toggleSong((playing) => {
      setIsPlaying(playing);
    });
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
          isPlaying
            ? 'bg-slate-900 text-white border-slate-700 shadow-slate-900/20'
            : 'bg-white/90 text-slate-700 border-slate-200/80 hover:bg-white'
        }`}
        title={isPlaying ? 'Pause Birthday Tune' : 'Play Birthday Tune'}
      >
        {isPlaying ? (
          <>
            {/* Animated Equalizer Waves */}
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.1s] h-3.5" />
              <span className="w-0.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
            </div>
            <span className="text-xs font-bold tracking-tight">Tune Playing</span>
            <Volume2 className="w-3.5 h-3.5 text-pink-400" />
          </>
        ) : (
          <>
            <Music className="w-3.5 h-3.5" style={{ color: themePrimary }} />
            <span className="text-xs font-bold tracking-tight">Play Music</span>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
      </button>
    </div>
  );
};
