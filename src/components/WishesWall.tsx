import React, { useState, useEffect } from 'react';
import { BirthdayData, WishNote } from '../types';
import { THEMES } from '../utils/themes';
import { loadWishes, saveWishes } from '../utils/storage';
import confetti from 'canvas-confetti';
import { Heart, Plus, Send, Sparkles, MessageSquare, Trash2 } from 'lucide-react';

interface WishesWallProps {
  data: BirthdayData;
}

const STICKY_COLORS: Record<WishNote['color'], { bg: string; border: string; text: string; pin: string }> = {
  yellow: { bg: 'bg-amber-100/95', border: 'border-amber-200', text: 'text-amber-950', pin: 'bg-amber-500' },
  pink: { bg: 'bg-rose-100/95', border: 'border-rose-200', text: 'text-rose-950', pin: 'bg-rose-500' },
  blue: { bg: 'bg-sky-100/95', border: 'border-sky-200', text: 'text-sky-950', pin: 'bg-sky-500' },
  green: { bg: 'bg-emerald-100/95', border: 'border-emerald-200', text: 'text-emerald-950', pin: 'bg-emerald-500' },
  purple: { bg: 'bg-purple-100/95', border: 'border-purple-200', text: 'text-purple-950', pin: 'bg-purple-500' },
};

export const WishesWall: React.FC<WishesWallProps> = ({ data }) => {
  const [wishes, setWishes] = useState<WishNote[]>([]);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState<WishNote['color']>('yellow');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const theme = THEMES[data.theme];

  useEffect(() => {
    setWishes(loadWishes());
  }, []);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newNote: WishNote = {
      id: `wish-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      color: selectedColor,
      rotation: Number((Math.random() * 6 - 3).toFixed(1)), // -3deg to +3deg
      createdAt: Date.now(),
      likes: 0,
    };

    const updated = [newNote, ...wishes];
    setWishes(updated);
    saveWishes(updated);

    // Reset inputs
    setAuthor('');
    setMessage('');
    setIsFormOpen(false);

    // Confetti celebration!
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // fallback
    }
  };

  const handleLike = (id: string) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, likes: w.likes + 1 } : w
    );
    setWishes(updated);
    saveWishes(updated);
  };

  const handleDelete = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    saveWishes(updated);
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-slate-700 text-xs font-bold shadow-sm border border-slate-200/60 mb-2">
            <MessageSquare className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>Friends & Classmates Board</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-playful">
            The Wishes Wall for {data.friendName} 💌
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Leave a sticky note with your warm wishes, funny memories, or inside jokes!
          </p>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer bg-gradient-to-r ${theme.buttonGradient}`}
          >
            <Plus className="w-4 h-4" />
            {isFormOpen ? 'Close Form' : 'Stick a New Wish'}
          </button>
        </div>

        {/* Add Wish Form (Collapsible/Toggled) */}
        {isFormOpen && (
          <div className="mb-10 max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-playful text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Write Your Sticky Note
            </h3>

            <form onSubmit={handleAddWish} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taylor from bio class"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Wish
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={`Write something sweet or funny for ${data.friendName}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>

              {/* Note color choice */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sticky Note Color
                </label>
                <div className="flex items-center gap-2">
                  {(['yellow', 'pink', 'blue', 'green', 'purple'] as WishNote['color'][]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                        selectedColor === c ? 'scale-125 ring-2 ring-slate-800' : 'hover:scale-110'
                      }`}
                      style={{
                        backgroundColor:
                          c === 'yellow'
                            ? '#fef08a'
                            : c === 'pink'
                            ? '#fbcfe8'
                            : c === 'blue'
                            ? '#bae6fd'
                            : c === 'green'
                            ? '#bbf7d0'
                            : '#e9d5ff',
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                Post on Wishes Wall
              </button>
            </form>
          </div>
        )}

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
          {wishes.map((wish) => {
            const style = STICKY_COLORS[wish.color] || STICKY_COLORS.yellow;
            return (
              <div
                key={wish.id}
                className={`relative p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-102 flex flex-col justify-between min-h-[170px] ${style.bg} ${style.border}`}
                style={{
                  transform: `rotate(${wish.rotation}deg)`,
                }}
              >
                {/* Push Pin on top center */}
                <div
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md ${style.pin} border-2 border-white`}
                />

                {/* Wish Message */}
                <div className="pt-2">
                  <p className={`font-handwriting text-2xl leading-snug ${style.text}`}>
                    "{wish.message}"
                  </p>
                </div>

                {/* Author & Footer */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 font-playful">
                      — {wish.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(wish.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-rose-600 transition-colors cursor-pointer group"
                      title="Send love"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          wish.likes > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400 group-hover:text-rose-500'
                        }`}
                      />
                      <span>{wish.likes}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(wish.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
