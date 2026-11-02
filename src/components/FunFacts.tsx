import React from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { Heart, Clock, Sun, Moon, Wind, Compass } from 'lucide-react';

interface FunFactsProps {
  data: BirthdayData;
}

export const FunFacts: React.FC<FunFactsProps> = ({ data }) => {
  const theme = THEMES[data.theme];
  const age = Math.max(data.age, 1);

  // Exact or approximate calculation
  const totalDays = Math.round(age * 365.2425);
  const totalHours = totalDays * 24;
  const approximateHeartbeats = Math.round(totalDays * 24 * 60 * 75); // ~75 bpm average
  const approximateBreaths = Math.round(totalDays * 24 * 60 * 16); // ~16 breaths/min
  const kilometersTraveledInSpace = Math.round(age * 940000000); // Earth orbit around Sun is ~940M km/year
  const hoursOfSleep = Math.round(totalDays * 8.2); // ~8.2 hours/day

  const facts = [
    {
      icon: <Clock className="w-5 h-5 text-sky-500" />,
      label: 'Days of Life',
      value: totalDays.toLocaleString(),
      subtext: `That's over ${totalHours.toLocaleString()} full hours lived!`,
      bg: 'bg-sky-50/80 border-sky-100',
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />,
      label: 'Heartbeats Beaten',
      value: approximateHeartbeats.toLocaleString(),
      subtext: 'Pumping love, energy and courage every second',
      bg: 'bg-rose-50/80 border-rose-100',
    },
    {
      icon: <Wind className="w-5 h-5 text-teal-500" />,
      label: 'Breaths Taken',
      value: approximateBreaths.toLocaleString(),
      subtext: 'Inspiring life and fresh ideas into the world',
      bg: 'bg-teal-50/80 border-teal-100',
    },
    {
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      label: 'Solar Orbits',
      value: `${age} Orbits`,
      subtext: `Cruised ~${(kilometersTraveledInSpace / 1000000).toLocaleString()}M km through space!`,
      bg: 'bg-amber-50/80 border-amber-100',
    },
    {
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      label: 'Dream & Rest Hours',
      value: hoursOfSleep.toLocaleString(),
      subtext: 'Hours of sweet dreaming and recharging',
      bg: 'bg-indigo-50/80 border-indigo-100',
    },
    {
      icon: <Compass className="w-5 h-5 text-violet-500" />,
      label: 'Earth Rotations',
      value: totalDays.toLocaleString(),
      subtext: 'Mornings greeted and sunsets witnessed',
      bg: 'bg-violet-50/80 border-violet-100',
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-slate-700 text-xs font-bold shadow-sm border border-slate-200/60 mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Milestone Statistics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-playful">
            {data.friendName} by the Numbers 🌟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            A look back at everything your heart, mind, and body have accomplished so far!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {facts.map((fact, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${fact.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {fact.label}
                </span>
                <div className="p-2 bg-white rounded-xl shadow-xs">{fact.icon}</div>
              </div>

              <div>
                <div
                  className="text-2xl sm:text-3xl font-extrabold font-playful tabular-nums tracking-tight text-slate-900"
                  style={{ color: idx === 1 ? theme.primary : undefined }}
                >
                  {fact.value}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed">
                  {fact.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
