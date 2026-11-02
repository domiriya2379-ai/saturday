import React, { useState, useEffect, useCallback } from 'react';
import { Balloon, ThemeColor } from '../types';
import { THEMES } from '../utils/themes';
import { audioSynth } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Sparkles, Plus } from 'lucide-react';

const FUN_WISHES = [
  'May your upcoming year be filled with 100% good vibes and zero stress! ✨',
  'May all your exams feel easy and all your snacks be delicious! 🍕',
  'You officially have permission to eat the largest slice of cake today! 🍰',
  'You are not just leveling up in age, you are upgrading your wisdom stats! 🎮',
  'May your favorite songs always come on shuffle when you need them! 🎵',
  'The universe became at least 10x cooler the day you entered it! 🚀',
  'Wishing you endless laughter, true friendships, and incredible adventures! 💫',
  'May your year hold surprise road trips, A+ grades, and great coffee! ☕',
  'Keep shining and inspiring everyone around you! 🌟',
  'May every single wish you make when blowing candles come true! 🎂',
];

interface BalloonsLayerProps {
  themeColor: ThemeColor;
  friendName: string;
}

export const BalloonsLayer: React.FC<BalloonsLayerProps> = ({ themeColor, friendName }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedWish, setPoppedWish] = useState<{ wish: string; color: string } | null>(null);
  const [poppedCount, setPoppedCount] = useState(0);

  const theme = THEMES[themeColor];

  const spawnBalloon = useCallback(() => {
    const id = `balloon-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const randomColor = theme.balloonColors[Math.floor(Math.random() * theme.balloonColors.length)];
    const randomWish = FUN_WISHES[Math.floor(Math.random() * FUN_WISHES.length)].replace(
      'You',
      `${friendName}`
    );

    const newBalloon: Balloon = {
      id,
      x: 5 + Math.random() * 85, // 5% to 90% horizontal position
      speed: 12 + Math.random() * 8, // 12-20s duration
      color: randomColor,
      size: 48 + Math.floor(Math.random() * 24), // 48px to 72px width
      wish: randomWish,
    };

    setBalloons((prev) => [...prev.slice(-14), newBalloon]);
  }, [theme.balloonColors, friendName]);

  // Initial balloons and steady spawn interval
  useEffect(() => {
    // Initial 4 balloons
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnBalloon(), i * 1200);
    }

    const interval = setInterval(() => {
      spawnBalloon();
    }, 4500);

    return () => clearInterval(interval);
  }, [spawnBalloon]);

  const handlePopBalloon = (balloon: Balloon, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Sound effect
    audioSynth.playBalloonPop();

    // Trigger local confetti burst at pop coordinate
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x, y },
        colors: [balloon.color, '#ffffff', '#fbbf24'],
        disableForReducedMotion: true,
      });
    } catch {
      // fallback
    }

    // Remove balloon from state
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    setPoppedCount((c) => c + 1);

    // Show fun wish toast
    setPoppedWish({
      wish: balloon.wish,
      color: balloon.color,
    });
  };

  return (
    <>
      {/* Floating balloons container - non-blocking for background clicks */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            onClick={(e) => handlePopBalloon(balloon, e)}
            className="absolute bottom-[-120px] pointer-events-auto cursor-pointer select-none group transition-transform duration-150 hover:scale-110 active:scale-90"
            style={{
              left: `${balloon.x}%`,
              animation: `floatUpward ${balloon.speed}s linear forwards, swaySlightly 3s ease-in-out infinite alternate`,
            }}
          >
            {/* Balloon Body */}
            <div
              className="relative rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-lg transition-transform"
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.25}px`,
                backgroundColor: balloon.color,
                boxShadow: `0 8px 16px -4px ${balloon.color}80, inset -6px -6px 12px rgba(0,0,0,0.2), inset 6px 6px 12px rgba(255,255,255,0.45)`,
              }}
            >
              {/* Balloon reflection highlight */}
              <div className="absolute top-2 left-2.5 w-3 h-5 rounded-full bg-white/60 blur-[1px] transform -rotate-30" />

              {/* Knot */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 rounded-sm"
                style={{ backgroundColor: balloon.color }}
              />

              {/* String */}
              <svg
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4 h-10 overflow-visible"
                viewBox="0 0 16 40"
              >
                <path
                  d="M8,0 Q3,10 10,20 T8,40"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.45)"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Tap hint on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow pointer-events-none">
                Pop me! 🎈
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Balloon counter and Release button widget */}
      <div className="fixed bottom-4 left-4 z-30 flex items-center gap-2">
        <button
          onClick={spawnBalloon}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Release a new floating balloon"
        >
          <span className="text-base">🎈</span>
          <span>Release Balloon</span>
          <Plus className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {poppedCount > 0 && (
          <div className="px-3 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{poppedCount} Popped!</span>
          </div>
        )}
      </div>

      {/* Popped balloon wish modal / toast */}
      {poppedWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setPoppedWish(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg"
              style={{ backgroundColor: poppedWish.color }}
            >
              <span className="text-2xl">🎉</span>
            </div>

            <h3 className="font-playful text-lg font-bold text-slate-900 mb-2">
              Secret Balloon Wish!
            </h3>

            <p className="text-slate-700 text-sm leading-relaxed mb-6 font-medium">
              "{poppedWish.wish}"
            </p>

            <button
              onClick={() => setPoppedWish(null)}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              Sweet! Keep Celebrating
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animations for floating balloons */}
      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0);
            opacity: 0.9;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-115vh);
            opacity: 0.2;
          }
        }
        @keyframes swaySlightly {
          0% {
            margin-left: -15px;
            transform: rotate(-3deg);
          }
          100% {
            margin-left: 15px;
            transform: rotate(3deg);
          }
        }
      `}</style>
    </>
  );
};
