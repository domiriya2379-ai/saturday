import { BirthdayData, WishNote } from '../types';

const STORAGE_KEY_DATA = 'birthday_surprise_data_v1';
const STORAGE_KEY_WISHES = 'birthday_surprise_wishes_v1';

export const DEFAULT_SAMPLE_DATA: BirthdayData = {
  friendName: 'Alex',
  age: 18,
  personalMessage:
    "Happy 18th Birthday, Alex! 🎉 You're an incredible friend, an unstoppable study partner, and the person who always brings positive energy to every room. May this year be filled with exciting new adventures, endless laughter, and your biggest dreams turning into reality!",
  birthdayDate: new Date().toISOString().split('T')[0],
  theme: 'pink',
  creatorName: 'Sam',
};

export const INITIAL_WISHES: WishNote[] = [
  {
    id: 'wish-1',
    author: 'Jordan & Maya',
    message: 'Happy Birthday! 🎉 So grateful for all our late-night study sessions and laughs. Have the best day ever!',
    color: 'yellow',
    rotation: -2,
    createdAt: Date.now() - 3600000 * 5,
    likes: 4,
  },
  {
    id: 'wish-2',
    author: 'Coach Miller',
    message: 'Keep shining and inspiring everyone around you! Happy milestone birthday! 🌟',
    color: 'pink',
    rotation: 1.5,
    createdAt: Date.now() - 3600000 * 2,
    likes: 2,
  },
  {
    id: 'wish-3',
    author: 'Elena K.',
    message: 'Wishing you huge smiles, unlimited cake, and an awesome year ahead! 🎂✨',
    color: 'blue',
    rotation: -1,
    createdAt: Date.now() - 3600000,
    likes: 5,
  },
];

export function saveBirthdayData(data: BirthdayData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('Failed to save birthday data to localStorage:', err);
    return false;
  }
}

export function loadBirthdayData(): BirthdayData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (!raw) return null;
    return JSON.parse(raw) as BirthdayData;
  } catch (err) {
    console.warn('Failed to load birthday data from localStorage:', err);
    return null;
  }
}

export function saveWishes(wishes: WishNote[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishes));
    return true;
  } catch (err) {
    console.warn('Failed to save wishes to localStorage:', err);
    return false;
  }
}

export function loadWishes(): WishNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WISHES);
    if (!raw) return INITIAL_WISHES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_WISHES;
  } catch (err) {
    console.warn('Failed to load wishes from localStorage:', err);
    return INITIAL_WISHES;
  }
}

/**
 * Encode birthday data for shareable URL
 */
export function encodeSurpriseToUrl(data: BirthdayData): string {
  try {
    // Create copy without excessively heavy data if any
    const payload = {
      friendName: data.friendName,
      age: data.age,
      personalMessage: data.personalMessage,
      birthdayDate: data.birthdayDate,
      theme: data.theme,
      creatorName: data.creatorName || '',
      // If photoUrl exists and is reasonable length (under 300KB), include it
      photoUrl: data.photoUrl && data.photoUrl.length < 350000 ? data.photoUrl : undefined,
    };

    const jsonString = JSON.stringify(payload);
    // Safe UTF-8 base64 encoding
    const base64 = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return `${window.location.origin}${window.location.pathname}#surprise=${base64}`;
  } catch (err) {
    console.warn('Failed to encode surprise to URL:', err);
    return window.location.href;
  }
}

/**
 * Decode birthday data from URL hash or query param
 */
export function decodeSurpriseFromUrl(): BirthdayData | null {
  try {
    let base64 = '';
    const hash = window.location.hash;
    if (hash.includes('#surprise=')) {
      base64 = hash.split('#surprise=')[1];
    } else {
      const params = new URLSearchParams(window.location.search);
      const querySurprise = params.get('surprise');
      if (querySurprise) {
        base64 = querySurprise;
      }
    }

    if (!base64) return null;

    // Clean hash
    base64 = decodeURIComponent(base64);
    const jsonString = decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonString) as BirthdayData;
    if (parsed && parsed.friendName && parsed.age) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to decode surprise from URL:', err);
  }
  return null;
}

/**
 * Helper to compress user uploaded photo to lightweight JPEG data URL
 */
export function compressImage(file: File, maxWidth = 640, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
