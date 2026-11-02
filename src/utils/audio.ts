/**
 * Web Audio API Synthesizer for Happy Birthday Melody & Sound Effects
 * Zero external audio files required.
 */

// Note frequencies in Hz
const NOTE_FREQS: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  REST: 0,
};

// Birthday song note sequences: note, duration in beats (quarter note = 1 beat, ~110 BPM)
const BIRTHDAY_SCORE: Array<{ note: string; beats: number; chord?: string[] }> = [
  // Happy Birthday to you
  { note: 'G4', beats: 0.75 },
  { note: 'G4', beats: 0.25 },
  { note: 'A4', beats: 1.0, chord: ['C4', 'E4'] },
  { note: 'G4', beats: 1.0 },
  { note: 'C5', beats: 1.0, chord: ['E4', 'G4'] },
  { note: 'B4', beats: 2.0, chord: ['G4', 'D4'] },
  { note: 'REST', beats: 0.5 },

  // Happy Birthday to you
  { note: 'G4', beats: 0.75 },
  { note: 'G4', beats: 0.25 },
  { note: 'A4', beats: 1.0, chord: ['D4', 'F4'] },
  { note: 'G4', beats: 1.0 },
  { note: 'D5', beats: 1.0, chord: ['G4', 'B4'] },
  { note: 'C5', beats: 2.0, chord: ['C4', 'E4'] },
  { note: 'REST', beats: 0.5 },

  // Happy Birthday dear [Friend]
  { note: 'G4', beats: 0.75 },
  { note: 'G4', beats: 0.25 },
  { note: 'G5', beats: 1.0, chord: ['C4', 'E4', 'G4'] },
  { note: 'E5', beats: 1.0, chord: ['C4'] },
  { note: 'C5', beats: 1.0, chord: ['A4'] },
  { note: 'B4', beats: 1.0, chord: ['F4'] },
  { note: 'A4', beats: 2.0, chord: ['F4', 'C5'] },
  { note: 'REST', beats: 0.5 },

  // Happy Birthday to you!
  { note: 'F5', beats: 0.75, chord: ['F4', 'A4'] },
  { note: 'F5', beats: 0.25 },
  { note: 'E5', beats: 1.0, chord: ['C4', 'G4'] },
  { note: 'C5', beats: 1.0, chord: ['E4'] },
  { note: 'D5', beats: 1.0, chord: ['G4', 'B4'] },
  { note: 'C5', beats: 2.5, chord: ['C4', 'E4', 'G4'] },
  { note: 'REST', beats: 1.5 },
];

class AudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isSongPlaying: boolean = false;
  private songTimer: number | null = null;
  private currentNoteIndex: number = 0;
  private masterGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a gentle music box / chime bell tone
  private playTone(freq: number, durationSec: number, volume: number = 0.25) {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain || freq <= 0) return;

    const now = ctx.currentTime;

    // Fundamental oscillator (warm triangle wave)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Harmonic bell chime oscillator (sine at 2x freq for sparkle)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Envelope gain
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0.001, now);
    toneGain.gain.linearRampToValueAtTime(volume, now + 0.02);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    // Subtle low pass filter for warm soft sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(toneGain);
    toneGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSec + 0.05);
    osc2.stop(now + durationSec + 0.05);
  }

  public startSong(onStatusChange?: (playing: boolean) => void) {
    this.initContext();
    if (this.isSongPlaying) return;

    this.isSongPlaying = true;
    onStatusChange?.(true);

    const tempoBpm = 100;
    const beatDurationMs = (60 / tempoBpm) * 1000;

    const scheduleNextNote = () => {
      if (!this.isSongPlaying) return;

      const item = BIRTHDAY_SCORE[this.currentNoteIndex];
      const durationSec = (item.beats * beatDurationMs) / 1000;

      if (item.note !== 'REST' && NOTE_FREQS[item.note]) {
        // Play main melody
        this.playTone(NOTE_FREQS[item.note], durationSec * 0.95, 0.35);

        // Play subtle soft chords if available
        if (item.chord) {
          item.chord.forEach((chordNote) => {
            if (NOTE_FREQS[chordNote]) {
              this.playTone(NOTE_FREQS[chordNote], durationSec * 0.8, 0.12);
            }
          });
        }
      }

      const noteDurationMs = item.beats * beatDurationMs;

      this.currentNoteIndex = (this.currentNoteIndex + 1) % BIRTHDAY_SCORE.length;

      this.songTimer = window.setTimeout(() => {
        scheduleNextNote();
      }, noteDurationMs);
    };

    scheduleNextNote();
  }

  public stopSong(onStatusChange?: (playing: boolean) => void) {
    this.isSongPlaying = false;
    if (this.songTimer !== null) {
      clearTimeout(this.songTimer);
      this.songTimer = null;
    }
    this.currentNoteIndex = 0;
    onStatusChange?.(false);
  }

  public toggleSong(onStatusChange?: (playing: boolean) => void) {
    if (this.isSongPlaying) {
      this.stopSong(onStatusChange);
    } else {
      this.startSong(onStatusChange);
    }
  }

  public isPlaying(): boolean {
    return this.isSongPlaying;
  }

  // Sound effect: Balloon Pop!
  public playBalloonPop() {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sudden pitch drop like rubber snapping
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Sound effect: Blowing out a candle (gentle breath puff)
  public playCandleBlow() {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const bufferSize = ctx.sampleRate * 0.25; // 250ms of noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter to sound like soft breath puff
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
    } catch {
      // Fallback simple tone if buffer source fails
      this.playTone(200, 0.2, 0.1);
    }
  }

  // Sound effect: Envelope Opening Rustle & Chime
  public playEnvelopeOpen() {
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      window.setTimeout(() => {
        this.playTone(freq, 0.6, 0.2);
      }, idx * 90);
    });
  }

  // Sound effect: Celebration Fanfare when all candles blown out!
  public playCelebrationFanfare() {
    const ctx = this.initContext();
    if (!ctx) return;

    const fanfare = [
      { f: 523.25, delay: 0, dur: 0.2 },
      { f: 659.25, delay: 150, dur: 0.2 },
      { f: 783.99, delay: 300, dur: 0.3 },
      { f: 1046.5, delay: 500, dur: 0.8 },
    ];

    fanfare.forEach(({ f, delay, dur }) => {
      window.setTimeout(() => {
        this.playTone(f, dur, 0.35);
      }, delay);
    });
  }
}

export const audioSynth = new AudioController();
