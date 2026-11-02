import { ThemeColor } from '../types';

export interface ThemeConfig {
  name: string;
  id: ThemeColor;
  primary: string; // Tailwind hex or class representation
  primaryLight: string;
  bgGradient: string;
  cardBg: string;
  accentBg: string;
  textColor: string;
  accentText: string;
  buttonGradient: string;
  glowColor: string;
  envelopeColor: string;
  envelopeFlapColor: string;
  envelopeInner: string;
  borderAccent: string;
  balloonColors: string[];
}

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  pink: {
    name: 'Strawberry Pink',
    id: 'pink',
    primary: '#ec4899',
    primaryLight: '#fdf2f8',
    bgGradient: 'from-pink-50 via-rose-50/60 to-amber-50/40',
    cardBg: 'bg-white/90 border-pink-100 shadow-pink-100/60',
    accentBg: 'bg-pink-500',
    textColor: 'text-pink-950',
    accentText: 'text-pink-600',
    buttonGradient: 'from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-300/50',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    envelopeColor: '#f472b6',
    envelopeFlapColor: '#ec4899',
    envelopeInner: '#fbcfe8',
    borderAccent: 'border-pink-200',
    balloonColors: ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#facc15'],
  },
  purple: {
    name: 'Magic Purple',
    id: 'purple',
    primary: '#9333ea',
    primaryLight: '#faf5ff',
    bgGradient: 'from-purple-50 via-violet-50/60 to-fuchsia-50/40',
    cardBg: 'bg-white/90 border-purple-100 shadow-purple-100/60',
    accentBg: 'bg-purple-600',
    textColor: 'text-purple-950',
    accentText: 'text-purple-600',
    buttonGradient: 'from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-300/50',
    glowColor: 'rgba(147, 51, 234, 0.45)',
    envelopeColor: '#a855f7',
    envelopeFlapColor: '#9333ea',
    envelopeInner: '#e9d5ff',
    borderAccent: 'border-purple-200',
    balloonColors: ['#8b5cf6', '#a855f7', '#c084fc', '#d946ef', '#6366f1', '#38bdf8'],
  },
  blue: {
    name: 'Sky Blue',
    id: 'blue',
    primary: '#0284c7',
    primaryLight: '#f0f9ff',
    bgGradient: 'from-sky-50 via-cyan-50/60 to-blue-50/40',
    cardBg: 'bg-white/90 border-sky-100 shadow-sky-100/60',
    accentBg: 'bg-sky-500',
    textColor: 'text-slate-900',
    accentText: 'text-sky-600',
    buttonGradient: 'from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-sky-300/50',
    glowColor: 'rgba(14, 165, 233, 0.45)',
    envelopeColor: '#38bdf8',
    envelopeFlapColor: '#0284c7',
    envelopeInner: '#bae6fd',
    borderAccent: 'border-sky-200',
    balloonColors: ['#0ea5e9', '#38bdf8', '#06b6d4', '#3b82f6', '#60a5fa', '#a855f7'],
  },
  gold: {
    name: 'Celebration Gold',
    id: 'gold',
    primary: '#d97706',
    primaryLight: '#fffbeb',
    bgGradient: 'from-amber-50 via-yellow-50/60 to-orange-50/40',
    cardBg: 'bg-white/90 border-amber-100 shadow-amber-100/60',
    accentBg: 'bg-amber-500',
    textColor: 'text-amber-950',
    accentText: 'text-amber-600',
    buttonGradient: 'from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-300/50',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    envelopeColor: '#fbbf24',
    envelopeFlapColor: '#d97706',
    envelopeInner: '#fef3c7',
    borderAccent: 'border-amber-200',
    balloonColors: ['#f59e0b', '#fbbf24', '#f97316', '#ea580c', '#eab308', '#ec4899'],
  },
};
