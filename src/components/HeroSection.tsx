import React, { useState } from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { encodeSurpriseToUrl } from '../utils/storage';
import confetti from 'canvas-confetti';
import { Share2, Edit3, Check, Sparkles, PartyPopper, Mail } from 'lucide-react';

interface HeroSectionProps {
  data: BirthdayData;
  onEdit: () => void;
  onReplayEnvelope: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  onEdit,
  onReplayEnvelope,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = THEMES[data.theme];

  const handleShare = async () => {
    const url = encodeSurpriseToUrl(data);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // In case copy fails
      prompt('Copy this link to share the birthday surprise:', url);
    }
  };

  const handleBurstConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: theme.balloonColors,
      });
    } catch {
      // fallback
    }
  };

  return (
    <section className="relative pt-6 pb-12 sm:pb-16 text-center overflow-hidden">
      {/* Top action bar */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            Edit details
          </button>

          <button
            onClick={onReplayEnvelope}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
            title="Re-open envelope"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            Envelope
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBurstConfetti}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
            title="Confetti Cannon"
          >
            <PartyPopper className="w-3.5 h-3.5 text-pink-500" />
            Confetti!
          </button>

          <button
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : `bg-slate-900 hover:bg-slate-800 text-white shadow-slate-300`
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Link copied!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Share Surprise
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Celebratory Hero Content */}
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-600 mb-6">
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
          <span>It's a very special milestone day!</span>
        </div>

        {/* Large Animated Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-playful leading-tight">
          <span className="text-slate-900 inline-block hover:scale-105 transition-transform duration-300">
            Happy Birthday,
          </span>{' '}
          <span
            className="inline-block bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            style={{
              textShadow: `0 4px 20px ${theme.glowColor}`,
            }}
          >
            {data.friendName}!
          </span>{' '}
          <span className="inline-block animate-bounce">🎉</span>
        </h1>

        {/* Big Glowing Age Numbers */}
        <div className="mt-8 relative inline-flex items-center justify-center">
          {/* Background subtle radial glow */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-60 pointer-events-none transform scale-150"
            style={{ backgroundColor: theme.primary }}
          />

          <div className="relative px-8 py-4 rounded-3xl bg-white/70 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Officially Turning
            </span>
            <div
              className="text-7xl sm:text-8xl md:text-9xl font-black font-playful tracking-tighter leading-none my-1 tabular-nums animate-glow"
              style={{
                color: theme.primary,
                textShadow: `0 0 30px ${theme.glowColor}, 0 0 60px ${theme.glowColor}`,
              }}
            >
              {data.age}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Years of Pure Awesomeness ✨
            </span>
          </div>
        </div>

        {/* Subtitle / Wish Lead */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
          Pop floating balloons, make a wish on the cake, and explore sweet memories made just for you!
        </p>
      </div>
    </section>
  );
};
