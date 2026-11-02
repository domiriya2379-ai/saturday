import React, { useState, useEffect } from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { audioSynth } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, RotateCcw, Heart } from 'lucide-react';

interface BirthdayCakeProps {
  data: BirthdayData;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ data }) => {
  const candleCount = Math.min(Math.max(data.age, 1), 20);
  const theme = THEMES[data.theme];

  // State of each candle: true = lit, false = blown out
  const [candles, setCandles] = useState<boolean[]>(() =>
    Array(candleCount).fill(true)
  );
  const [wishingMode, setWishingMode] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  // Sync if age changes
  useEffect(() => {
    setCandles(Array(candleCount).fill(true));
    setCelebrated(false);
    setWishingMode(false);
  }, [candleCount]);

  const activeCandlesCount = candles.filter(Boolean).length;

  const blowOutCandle = (index: number) => {
    if (!candles[index]) return;

    audioSynth.playCandleBlow();

    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    // Check if that was the last candle
    if (newCandles.every((lit) => !lit)) {
      handleAllCandlesOut();
    }
  };

  const blowAllCandles = () => {
    audioSynth.playCandleBlow();
    setCandles(Array(candleCount).fill(false));
    handleAllCandlesOut();
  };

  const relightCandles = () => {
    setCandles(Array(candleCount).fill(true));
    setCelebrated(false);
    setWishingMode(false);
  };

  const handleAllCandlesOut = () => {
    setCelebrated(true);
    audioSynth.playCelebrationFanfare();

    try {
      // Massive confetti shower!
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#10b981'],
      });

      // Firework cannons from sides
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: theme.balloonColors,
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: theme.balloonColors,
        });
      }, 350);
    } catch {
      // fallback
    }
  };

  const startMakeAWish = () => {
    setWishingMode(true);
    audioSynth.playEnvelopeOpen();
  };

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.primary }}
        />

        {/* Section Heading */}
        <div className="relative z-10 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Birthday Cake</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-playful">
            Make a Wish, {data.friendName}! 🎂
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {wishingMode
              ? 'Now tap each candle to blow it out with your wish!'
              : 'Click "Make a Wish" to light up the candles for blowing!'}
          </p>
        </div>

        {/* Cake Canvas Container */}
        <div className="relative mx-auto my-6 w-full max-w-md flex flex-col items-center justify-end h-80 sm:h-96 select-none">
          {/* Candle Rack on top tier */}
          <div className="absolute top-2 inset-x-4 sm:inset-x-8 z-20 flex flex-wrap justify-center items-end gap-1.5 sm:gap-2.5 min-h-[90px]">
            {candles.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => blowOutCandle(idx)}
                className="relative flex flex-col items-center cursor-pointer group"
                style={{
                  transition: 'transform 0.15s ease',
                  padding: '2px',
                }}
                title={isLit ? 'Tap to blow out candle' : 'Candle blown out'}
              >
                {/* Flame or Smoke */}
                <div className="h-7 flex items-end justify-center">
                  {isLit ? (
                    <div className="relative animate-flame">
                      {/* Outer yellow flame */}
                      <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                      {/* Inner blue/white core */}
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full bg-sky-200/90" />
                    </div>
                  ) : (
                    <div className="relative animate-smoke flex flex-col items-center">
                      <div className="w-1.5 h-3 rounded-full bg-slate-300 blur-[0.5px]" />
                    </div>
                  )}
                </div>

                {/* Wick */}
                <div className="w-0.5 h-2 bg-slate-800 -mt-0.5" />

                {/* Candle Stick */}
                <div
                  className="w-2.5 sm:w-3 h-10 sm:h-12 rounded-t-sm shadow-sm border-x border-t border-black/10 transition-transform group-hover:scale-105"
                  style={{
                    background: `repeating-linear-gradient(
                      -45deg,
                      ${idx % 2 === 0 ? '#f472b6' : '#60a5fa'},
                      ${idx % 2 === 0 ? '#f472b6' : '#60a5fa'} 4px,
                      #ffffff 4px,
                      #ffffff 8px
                    )`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* SVG Illustrated Cake */}
          <div className="w-full relative z-10 flex flex-col items-center">
            <svg
              viewBox="0 0 360 220"
              className="w-full max-w-[340px] sm:max-w-[380px] drop-shadow-xl"
              fill="none"
            >
              <defs>
                <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="cakeTierTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#fde047" />
                </linearGradient>
                <linearGradient id="cakeTierBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbcfe8" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
                <linearGradient id="frostingWhite" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>
              </defs>

              {/* Silver Cake Stand Platter */}
              <ellipse cx="180" cy="200" rx="170" ry="16" fill="url(#plateGrad)" />
              <ellipse cx="180" cy="198" rx="160" ry="12" fill="#e2e8f0" />
              <ellipse cx="180" cy="196" rx="150" ry="9" fill="#f8fafc" />

              {/* Bottom Tier (Main Sponge) */}
              <rect x="45" y="125" width="270" height="65" rx="10" fill="url(#cakeTierBottom)" />
              {/* Bottom tier top rim */}
              <ellipse cx="180" cy="125" rx="135" ry="12" fill="#fda4af" />

              {/* Bottom Tier Decorative Frosting Drips */}
              <path
                d="M45,125 
                   C60,145 75,145 90,125 
                   C105,150 120,150 135,125 
                   C150,148 165,148 180,125 
                   C195,152 210,152 225,125 
                   C240,146 255,146 270,125 
                   C285,150 300,140 315,125
                   L315,125 L45,125 Z"
                fill="url(#frostingWhite)"
                opacity="0.95"
              />

              {/* Colorful Sprinkles on Bottom Tier */}
              <rect x="70" y="150" width="8" height="3" rx="1.5" fill="#38bdf8" transform="rotate(25 70 150)" />
              <rect x="110" y="165" width="8" height="3" rx="1.5" fill="#facc15" transform="rotate(-15 110 165)" />
              <rect x="150" y="152" width="8" height="3" rx="1.5" fill="#4ade80" transform="rotate(40 150 152)" />
              <rect x="195" y="162" width="8" height="3" rx="1.5" fill="#c084fc" transform="rotate(-30 195 162)" />
              <rect x="235" y="148" width="8" height="3" rx="1.5" fill="#f43f5e" transform="rotate(10 235 148)" />
              <rect x="275" y="160" width="8" height="3" rx="1.5" fill="#38bdf8" transform="rotate(-45 275 160)" />

              {/* Top Tier (Smaller Tier) */}
              <rect x="80" y="70" width="200" height="55" rx="8" fill="url(#cakeTierTop)" />
              <ellipse cx="180" cy="70" rx="100" ry="10" fill="#fef9c3" />

              {/* Top Tier Frosting Drips */}
              <path
                d="M80,70 
                   C95,88 110,88 125,70 
                   C140,92 155,92 170,70 
                   C185,90 200,90 215,70 
                   C230,92 245,92 260,70 
                   C270,82 275,78 280,70
                   L280,70 L80,70 Z"
                fill="url(#frostingWhite)"
              />

              {/* Sprinkles on Top Tier */}
              <circle cx="105" cy="98" r="2.5" fill="#ec4899" />
              <circle cx="140" cy="104" r="2.5" fill="#3b82f6" />
              <circle cx="180" cy="96" r="2.5" fill="#10b981" />
              <circle cx="220" cy="102" r="2.5" fill="#f59e0b" />
              <circle cx="255" cy="95" r="2.5" fill="#8b5cf6" />

              {/* Ripe Strawberry on Front Tier */}
              <g transform="translate(170, 56) scale(0.9)">
                <path d="M12,2 C18,2 24,8 20,20 C18,25 12,28 12,28 C12,28 6,25 4,20 C0,8 6,2 12,2 Z" fill="#e11d48" />
                {/* Leaves */}
                <path d="M7,3 C10,5 12,2 12,2 C12,2 14,5 17,3 C15,7 13,6 12,8 C11,6 9,7 7,3 Z" fill="#16a34a" />
                {/* Seeds */}
                <circle cx="9" cy="10" r="0.75" fill="#fef08a" />
                <circle cx="15" cy="11" r="0.75" fill="#fef08a" />
                <circle cx="12" cy="16" r="0.75" fill="#fef08a" />
                <circle cx="8" cy="18" r="0.75" fill="#fef08a" />
                <circle cx="16" cy="19" r="0.75" fill="#fef08a" />
              </g>
            </svg>
          </div>
        </div>

        {/* Milestone Candle Note */}
        {data.age > 20 && (
          <p className="text-xs text-slate-400 mt-1 mb-4">
            (Displaying 20 symbolic candles for {data.friendName}'s {data.age}th milestone!)
          </p>
        )}

        {/* Celebration Wish Banner when all candles out */}
        {celebrated && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2 font-playful text-xl sm:text-2xl font-bold">
              <span>🎉</span>
              <span>WISH GRANTED!</span>
              <span>🎉</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-pink-50 mt-1">
              May every wish you made come true this year, {data.friendName}! You deserve the best!
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!wishingMode ? (
            <button
              onClick={startMakeAWish}
              className={`py-3 px-6 rounded-2xl font-bold text-sm text-white shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer bg-gradient-to-r ${theme.buttonGradient} flex items-center gap-2`}
            >
              <Heart className="w-4 h-4 fill-white" />
              Make a Wish ✨
            </button>
          ) : (
            <>
              {activeCandlesCount > 0 ? (
                <button
                  onClick={blowAllCandles}
                  className="py-2.5 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Wind className="w-4 h-4 text-sky-400" />
                  Blow Out All ({activeCandlesCount} left)
                </button>
              ) : null}

              <button
                onClick={relightCandles}
                className="py-2.5 px-4 rounded-2xl font-semibold text-xs sm:text-sm border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Relight Candles
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
