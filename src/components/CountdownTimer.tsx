import React, { useState, useEffect } from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { Clock, Cake, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  data: BirthdayData;
}

interface TimeRemaining {
  isToday: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ data }) => {
  const theme = THEMES[data.theme];

  const calculateTime = (): TimeRemaining => {
    const now = new Date();
    // Parse target birthday date
    const [bYear, bMonth, bDay] = data.birthdayDate.split('-').map(Number);

    // Check if today matches month and day
    const isToday =
      now.getMonth() + 1 === bMonth && now.getDate() === bDay;

    if (isToday) {
      return { isToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Determine target date: this year or next year
    let target = new Date(now.getFullYear(), bMonth - 1, bDay, 0, 0, 0);

    // If target already passed this year, count down to next year's birthday
    if (target.getTime() < now.getTime()) {
      target = new Date(now.getFullYear() + 1, bMonth - 1, bDay, 0, 0, 0);
    }

    const diff = target.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { isToday: false, days, hours, minutes, seconds };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [data.birthdayDate]);

  return (
    <section className="py-8 px-4">
      <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 text-center">
        {time.isToday ? (
          <div className="py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mb-3 animate-bounce">
              <Cake className="w-8 h-8" />
            </div>
            <h3 className="font-playful text-3xl sm:text-4xl font-extrabold text-slate-900">
              It's your day! 🎂
            </h3>
            <p className="text-sm font-semibold text-pink-600 mt-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Today is {data.friendName}'s Official Birthday! Have an unforgettable time!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2 mb-4 text-slate-600">
              <Clock className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Countdown to {data.friendName}'s Big Celebration
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { label: 'Days', value: time.days },
                { label: 'Hours', value: time.hours },
                { label: 'Mins', value: time.minutes },
                { label: 'Secs', value: time.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/90 rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-inner flex flex-col items-center justify-center"
                >
                  <span
                    className="text-2xl sm:text-4xl font-extrabold font-playful tabular-nums leading-none"
                    style={{ color: theme.primary }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase mt-1 tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Getting everything ready for the sweetest celebration!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
