import React, { useState, useEffect } from 'react';
import { BirthdayData } from './types';
import { THEMES } from './utils/themes';
import {
  saveBirthdayData,
  loadBirthdayData,
  decodeSurpriseFromUrl,
} from './utils/storage';
import { audioSynth } from './utils/audio';
import { SetupForm } from './components/SetupForm';
import { EnvelopeModal } from './components/EnvelopeModal';
import { HeroSection } from './components/HeroSection';
import { BalloonsLayer } from './components/BalloonsLayer';
import { BirthdayCake } from './components/BirthdayCake';
import { CountdownTimer } from './components/CountdownTimer';
import { MessageCard } from './components/MessageCard';
import { PolaroidPhoto } from './components/PolaroidPhoto';
import { WishesWall } from './components/WishesWall';
import { FunFacts } from './components/FunFacts';
import { MusicPlayer } from './components/MusicPlayer';
import confetti from 'canvas-confetti';
import { Heart, PlusCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<BirthdayData | null>(null);
  const [isSettingUp, setIsSettingUp] = useState<boolean>(true);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);

  // Initial load check: from URL or localStorage
  useEffect(() => {
    // 1. Check if URL has surprise payload (e.g. shared link)
    const fromUrl = decodeSurpriseFromUrl();
    if (fromUrl) {
      setData(fromUrl);
      setIsSettingUp(false);
      setIsEnvelopeOpen(false); // Friend sees closed envelope first!
      return;
    }

    // 2. Check localStorage
    const saved = loadBirthdayData();
    if (saved) {
      setData(saved);
      setIsSettingUp(false);
      setIsEnvelopeOpen(false); // Start with envelope experience
    } else {
      // First time user: show Setup screen
      setIsSettingUp(true);
    }
  }, []);

  const handleCreateSurprise = (newData: BirthdayData) => {
    setData(newData);
    saveBirthdayData(newData);
    setIsSettingUp(false);
    setIsEnvelopeOpen(false); // Show envelope so creator can preview the exact reveal!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);

    // Initial big burst of confetti when envelope opened
    if (data) {
      const theme = THEMES[data.theme];
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: theme.balloonColors,
        });

        // Also start soft Happy Birthday melody automatically when opened!
        audioSynth.startSong();
      } catch {
        // safe fallback
      }
    }
  };

  const handleEditDetails = () => {
    audioSynth.stopSong();
    setIsSettingUp(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayEnvelope = () => {
    setIsEnvelopeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    audioSynth.stopSong();
    setData(null);
    setIsSettingUp(true);
    setIsEnvelopeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If currently in setup mode
  if (isSettingUp || !data) {
    return <SetupForm initialData={data} onSubmit={handleCreateSurprise} />;
  }

  const currentTheme = THEMES[data.theme];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${currentTheme.bgGradient} transition-colors duration-700 relative text-slate-800`}
    >
      {/* Closed Animated Envelope Modal (shown until opened) */}
      {!isEnvelopeOpen && (
        <EnvelopeModal data={data} onOpen={handleOpenEnvelope} />
      )}

      {/* Persistent Floating Music Player Toggle */}
      <MusicPlayer themePrimary={currentTheme.primary} />

      {/* Floating Interactive Balloons Layer */}
      <BalloonsLayer themeColor={data.theme} friendName={data.friendName} />

      {/* Main Surprise Birthday Page Content */}
      <main className="relative z-10 max-w-5xl mx-auto pb-20">
        {/* 1. Hero Section */}
        <HeroSection
          data={data}
          onEdit={handleEditDetails}
          onReplayEnvelope={handleReplayEnvelope}
        />

        {/* 2. Birthday Countdown / It's Your Day Banner */}
        <CountdownTimer data={data} />

        {/* 3. Birthday Cake with Blowable Candles */}
        <BirthdayCake data={data} />

        {/* 4. Personal Message Card (Typewriter & Handwritten) */}
        <MessageCard data={data} />

        {/* 5. Photo Section (Polaroid Style with Tilt) */}
        <PolaroidPhoto data={data} />

        {/* 6. Fun Milestone Statistics & Facts */}
        <FunFacts data={data} />

        {/* 7. Wishes Wall (Sticky Notes) */}
        <WishesWall data={data} />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/60 text-center px-4">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 mb-2">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for {data.friendName}</span>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Share this link with {data.friendName} so they can pop balloons, blow out candles, and read the wishes!
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              Create a Surprise for Another Friend
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
