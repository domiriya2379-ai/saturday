export type ThemeColor = 'pink' | 'purple' | 'blue' | 'gold';

export interface BirthdayData {
  friendName: string;
  age: number;
  personalMessage: string;
  birthdayDate: string; // YYYY-MM-DD
  photoUrl?: string; // Base64 data URL
  theme: ThemeColor;
  creatorName?: string;
}

export interface WishNote {
  id: string;
  author: string;
  message: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  rotation: number;
  createdAt: number;
  likes: number;
}

export interface Balloon {
  id: string;
  x: number; // percentage from left (5% to 90%)
  speed: number; // seconds to float
  color: string;
  size: number;
  wish: string;
}
