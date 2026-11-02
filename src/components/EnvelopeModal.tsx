import React, { useState } from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { audioSynth } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';

interface EnvelopeModalProps {
  data: BirthdayData;
  onOpen: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ data, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const theme = THEMES[data.theme];

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play sweet chime audio
    audioSynth.playEnvelopeOpen();

    // Trigger opening confetti explosion!
    try {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.6 },
        colors: theme.balloonColors,
      });
    } catch {
      // safe fallback
    }

    // After animation finishes, notify parent
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-700">
      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* Helper instruction */}
        <div className="mb-6 text-center animate-bounce">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-medium tracking-wide border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Special Delivery for {data.friendName}
          </span>
        </div>

        {/* Envelope Container */}
        <div
          onClick={handleOpenEnvelope}
          className="relative w-80 sm:w-96 h-56 sm:h-64 cursor-pointer group select-none transition-transform duration-300 hover:scale-102 active:scale-98"
          style={{ perspective: '1200px' }}
        >
          {/* Card sliding out of envelope */}
          <div
            className={`absolute inset-x-4 top-2 h-48 bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out z-10 ${
              isOpening ? '-translate-y-28 opacity-100 shadow-2xl' : 'translate-y-2 opacity-90'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-2">
              <GiftBoxIcon className="w-6 h-6" />
            </div>
            <h3 className="font-playful text-xl font-bold text-slate-800">
              Happy {data.age}th Birthday!
            </h3>
            <p className="text-xs text-slate-500 mt-1">Tap to unfold your celebration...</p>
          </div>

          {/* Envelope Pocket Body (Bottom and sides) */}
          <div
            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-end z-20"
            style={{
              backgroundColor: theme.envelopeColor,
              boxShadow: `0 20px 40px -15px ${theme.glowColor}, 0 0 1px 1px rgba(255,255,255,0.2) inset`,
            }}
          >
            {/* Stamp in upper corner */}
            <div className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-lg border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center rotate-3">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span className="text-[9px] font-mono font-bold text-slate-600 mt-0.5">AIRMAIL</span>
            </div>

            {/* Recipient Handwritten Label */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2">
              <p className="text-xs tracking-wider uppercase text-white/70 font-semibold">To:</p>
              <h2 className="font-handwriting text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-sm">
                {data.friendName}
              </h2>
              {data.creatorName && (
                <p className="text-xs font-handwriting text-white/90 mt-1">
                  with love from {data.creatorName}
                </p>
              )}
            </div>

            {/* Bottom triangular folds effect via SVG */}
            <svg
              className="w-full h-full absolute inset-0 pointer-events-none"
              viewBox="0 0 384 256"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Left fold */}
              <polygon points="0,0 192,150 0,256" fill="rgba(0,0,0,0.06)" />
              {/* Right fold */}
              <polygon points="384,0 192,150 384,256" fill="rgba(0,0,0,0.09)" />
              {/* Bottom fold */}
              <polygon points="0,256 192,130 384,256" fill="rgba(0,0,0,0.14)" />
            </svg>
          </div>

          {/* Envelope Top Flap (Triangular 3D flap) */}
          <div
            className={`absolute top-0 inset-x-0 h-32 origin-top z-30 transition-transform duration-700 ease-in-out ${
              isOpening ? '-rotate-x-180' : 'rotate-x-0'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of flap (visible when closed) */}
            <svg
              className="w-full h-full drop-shadow-md backface-hidden"
              viewBox="0 0 384 128"
              fill="none"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 384,0 192,128" fill={theme.envelopeFlapColor} />
            </svg>

            {/* Wax Seal in center of flap */}
            {!isOpening && (
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 shadow-md border-2 border-amber-300/60 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
            )}
          </div>
        </div>

        {/* Action Prompt */}
        <button
          onClick={handleOpenEnvelope}
          className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl shadow-black/20 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4 text-pink-500" />
          Tap to open envelope
        </button>
      </div>
    </div>
  );
};

function GiftBoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M12 8a3 3 0 0 0-3-3 3 3 0 0 0-3 3" />
      <path d="M12 8a3 3 0 0 1 3-3 3 3 0 0 1 3 3" />
    </svg>
  );
}
