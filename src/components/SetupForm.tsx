import React, { useState, useRef } from 'react';
import { BirthdayData, ThemeColor } from '../types';
import { THEMES } from '../utils/themes';
import { compressImage, DEFAULT_SAMPLE_DATA } from '../utils/storage';
import { Sparkles, ImagePlus, X, Heart, Gift, Calendar, Palette, User, MessageCircle } from 'lucide-react';

interface SetupFormProps {
  initialData: BirthdayData | null;
  onSubmit: (data: BirthdayData) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ initialData, onSubmit }) => {
  const [friendName, setFriendName] = useState(initialData?.friendName || '');
  const [age, setAge] = useState<number | ''>(initialData?.age ?? 18);
  const [personalMessage, setPersonalMessage] = useState(
    initialData?.personalMessage ||
      "Happy Birthday! 🎉 Wishing you a year full of wonderful memories, boundless joy, and huge wins. Keep being the amazing person you are!"
  );
  const [birthdayDate, setBirthdayDate] = useState(
    initialData?.birthdayDate || new Date().toISOString().split('T')[0]
  );
  const [creatorName, setCreatorName] = useState(initialData?.creatorName || '');
  const [theme, setTheme] = useState<ThemeColor>(initialData?.theme || 'pink');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialData?.photoUrl);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = THEMES[theme];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg(null);
      const compressed = await compressImage(file, 640, 0.82);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not process the photo. Please try a different image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUseSample = () => {
    setFriendName(DEFAULT_SAMPLE_DATA.friendName);
    setAge(DEFAULT_SAMPLE_DATA.age);
    setPersonalMessage(DEFAULT_SAMPLE_DATA.personalMessage);
    setBirthdayDate(DEFAULT_SAMPLE_DATA.birthdayDate);
    setTheme(DEFAULT_SAMPLE_DATA.theme);
    setCreatorName(DEFAULT_SAMPLE_DATA.creatorName || '');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) {
      setErrorMsg("Please enter your friend's name!");
      return;
    }
    const parsedAge = typeof age === 'number' ? age : parseInt(String(age), 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 130) {
      setErrorMsg('Please enter a valid age between 1 and 120.');
      return;
    }

    setErrorMsg(null);
    onSubmit({
      friendName: friendName.trim(),
      age: parsedAge,
      personalMessage: personalMessage.trim(),
      birthdayDate,
      theme,
      photoUrl,
      creatorName: creatorName.trim() || undefined,
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient} py-8 px-4 sm:px-6 transition-colors duration-500`}>
      <div className="max-w-2xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-md shadow-pink-100 text-pink-500 mb-4 animate-bounce">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-playful">
            Personalise a Birthday Surprise
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Craft a memorable, interactive celebration page for your classmate or friend in seconds.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <span className="font-semibold">Note:</span> {errorMsg}
              </div>
            )}

            {/* Friend Name & Age Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Friend's Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya, Jordan, Alex"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-slate-50/50 hover:bg-white text-slate-800 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  Age Turning <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  placeholder="18"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-slate-50/50 hover:bg-white text-slate-800 transition-colors"
                />
              </div>
            </div>

            {/* Birthday Date & Creator Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Birthday Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-slate-50/50 hover:bg-white text-slate-800 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-slate-400" />
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sam, From your dorm mates"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-slate-50/50 hover:bg-white text-slate-800 transition-colors"
                />
              </div>
            </div>

            {/* Theme Colour Picker */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" />
                Theme Colour Choice
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['pink', 'purple', 'blue', 'gold'] as ThemeColor[]).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setTheme(themeKey)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-slate-800 bg-slate-50 shadow-md ring-2 ring-slate-400/20'
                          : 'border-slate-100 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shadow-inner shrink-0"
                        style={{ backgroundColor: t.primary }}
                      />
                      <span className="text-xs font-semibold text-slate-800 capitalize">{themeKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Message */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-slate-400" />
                  Personal Message
                </span>
                <span className="text-xs text-slate-400">{personalMessage.length} characters</span>
              </label>
              <textarea
                rows={4}
                required
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write your special birthday wish here. It will be typed with a handwritten typewriter animation!"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-slate-50/50 hover:bg-white text-slate-800 transition-colors text-sm sm:text-base leading-relaxed"
              />
            </div>

            {/* Photo Upload (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-slate-400" />
                Special Photo (Optional Polaroid Frame)
              </label>

              {photoUrl ? (
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={photoUrl}
                    alt="Uploaded preview"
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">Photo selected</p>
                    <p className="text-xs text-slate-500">Will be framed in a classic Polaroid tilt</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-500 mb-2">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Click to upload a memorable photo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WebP from your phone or computer</p>
                </div>
              )}
              {isCompressing && <p className="text-xs text-slate-500 animate-pulse">Optimising photo...</p>}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-base transition-all transform active:scale-98 shadow-lg cursor-pointer bg-gradient-to-r ${currentTheme.buttonGradient} flex items-center justify-center gap-2`}
              >
                <Sparkles className="w-5 h-5" />
                Create Birthday Surprise
              </button>

              <button
                type="button"
                onClick={handleUseSample}
                className="py-3 px-5 rounded-2xl font-semibold text-sm border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Fill Sample Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
