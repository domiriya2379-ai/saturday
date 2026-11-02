import React, { useState, useEffect } from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { RotateCcw, FastForward, Heart, Sparkles } from 'lucide-react';

interface MessageCardProps {
  data: BirthdayData;
}

export const MessageCard: React.FC<MessageCardProps> = ({ data }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const theme = THEMES[data.theme];

  const fullText = data.personalMessage || 'Wishing you the happiest birthday full of joyful moments!';

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28); // typing speed ~28ms per character

    return () => clearInterval(timer);
  }, [fullText]);

  const handleSkipTyping = () => {
    setDisplayedText(fullText);
    setIsTyping(false);
  };

  const handleReplay = () => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28);
  };

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            Personal Letter From The Heart
          </span>
        </div>

        {/* Stationery Paper Container */}
        <div className="relative bg-[#fffdfa] rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/60 border border-amber-100/80 transform hover:-translate-y-0.5 transition-transform">
          {/* Decorative Washi Tape at Top */}
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 rounded-sm opacity-85 shadow-sm transform -rotate-1 pointer-events-none"
            style={{
              backgroundColor: theme.primaryLight,
              border: `1px dashed ${theme.primary}`,
            }}
          />

          {/* Salutation */}
          <div className="mb-4">
            <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-slate-800">
              Dearest {data.friendName},
            </h3>
          </div>

          {/* Typewriter animated text */}
          <div className="min-h-[140px] font-handwriting text-2xl sm:text-3xl text-slate-700 leading-relaxed tracking-wide">
            <span>{displayedText}</span>
            {isTyping && (
              <span className="inline-block w-1.5 h-6 bg-pink-500 ml-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Sign off */}
          <div className="mt-8 pt-4 border-t border-amber-100 flex items-center justify-between flex-wrap gap-4">
            <div className="font-handwriting text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <span>Warmly,</span>
              <span style={{ color: theme.primary }}>
                {data.creatorName || 'Your Good Friend'}
              </span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
            </div>

            {/* Animation controls */}
            <div className="flex items-center gap-2">
              {isTyping ? (
                <button
                  onClick={handleSkipTyping}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  Fast forward
                </button>
              ) : (
                <button
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Replay typewriter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Replay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
