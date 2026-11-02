import React, { useState } from 'react';
import { BirthdayData } from '../types';
import { THEMES } from '../utils/themes';
import { Maximize2, X, Sparkles, Heart } from 'lucide-react';

interface PolaroidPhotoProps {
  data: BirthdayData;
}

export const PolaroidPhoto: React.FC<PolaroidPhotoProps> = ({ data }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const theme = THEMES[data.theme];

  // If no photo was uploaded, we can show an artistic Polaroid with a sweet celebratory icon/message
  const hasPhoto = Boolean(data.photoUrl);

  return (
    <section className="py-10 px-4">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            Captured Memory
          </span>
        </div>

        {/* Polaroid Card */}
        <div
          onClick={() => hasPhoto && setIsOpenModal(true)}
          className={`relative bg-white p-3.5 sm:p-4 pb-8 sm:pb-10 rounded-sm shadow-2xl border border-slate-200/60 transition-all duration-300 transform -rotate-2 hover:rotate-0 hover:scale-102 group select-none ${
            hasPhoto ? 'cursor-pointer' : ''
          }`}
          style={{
            boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
            maxWidth: '340px',
            width: '100%',
          }}
        >
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-100/90 border border-pink-200/80 rounded-xs shadow-xs transform rotate-1 pointer-events-none" />

          {/* Photo frame */}
          <div className="relative aspect-square w-full bg-slate-100 overflow-hidden rounded-xs border border-slate-200/50">
            {hasPhoto ? (
              <>
                <img
                  src={data.photoUrl}
                  alt={`Memory with ${data.friendName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Maximize2 className="w-3 h-3" /> Zoom
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-pink-500 mb-3 animate-pulse">
                  <Heart className="w-8 h-8 fill-pink-500" />
                </div>
                <h4 className="font-playful text-lg font-bold text-slate-800">
                  {data.friendName}'s Golden Year
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ready to fill this year with countless new memories!
                </p>
              </div>
            )}
          </div>

          {/* Polaroid Handwritten Caption */}
          <div className="mt-4 px-2 text-center">
            <p className="font-handwriting text-2xl sm:text-3xl font-bold text-slate-800 tracking-wide">
              {data.friendName} · Turning {data.age} ✨
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              {new Date(data.birthdayDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Modal Lightbox when photo is clicked */}
        {isOpenModal && hasPhoto && (
          <div
            onClick={() => setIsOpenModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white rounded-3xl p-4 shadow-2xl animate-in zoom-in-95 duration-200"
            >
              <button
                onClick={() => setIsOpenModal(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={data.photoUrl}
                alt={data.friendName}
                referrerPolicy="no-referrer"
                className="w-full max-h-[75vh] object-contain rounded-2xl"
              />
              <div className="mt-3 text-center">
                <p className="font-handwriting text-2xl text-slate-800 font-bold">
                  {data.friendName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
