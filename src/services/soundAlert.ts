/**
 * Serenity Luxury Salon - Audio Notification & Reception Bell Sound Engine
 * Provides crystal-clear, loud, unmistakable ring chimes when clients confirm bookings.
 */

let sharedAudioCtx: AudioContext | null = null;
let isAudioUnlocked = false;

// Fallback pre-rendered WAV Data URI (Ding-Dong Reception Chime)
let cachedWavDataUri: string | null = null;

function generateReceptionChimeWav(): string {
  if (cachedWavDataUri) return cachedWavDataUri;
  try {
    const sampleRate = 22050;
    const duration = 1.6; // 1.6 seconds total
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, 1, true); // NumChannels (1 = mono)
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample (16-bit)
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Synthesize Ding-Dong reception ring (Note 1: 880Hz, Note 2: 659.25Hz, Note 3: 1046.5Hz)
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Note 1: 880Hz (Ding) - starts at 0.0s
      if (t >= 0 && t < 0.5) {
        const env1 = Math.exp(-t * 6);
        sample += 0.45 * Math.sin(2 * Math.PI * 880 * t) * env1;
        sample += 0.2 * Math.sin(2 * Math.PI * 1760 * t) * env1;
      }

      // Note 2: 659.25Hz (Dong) - starts at 0.22s
      if (t >= 0.22 && t < 0.9) {
        const t2 = t - 0.22;
        const env2 = Math.exp(-t2 * 5);
        sample += 0.5 * Math.sin(2 * Math.PI * 659.25 * t2) * env2;
        sample += 0.25 * Math.sin(2 * Math.PI * 1318.5 * t2) * env2;
      }

      // Note 3: 1046.5Hz (High Bell) - starts at 0.55s
      if (t >= 0.55 && t < 1.6) {
        const t3 = t - 0.55;
        const env3 = Math.exp(-t3 * 3.5);
        sample += 0.55 * Math.sin(2 * Math.PI * 1046.5 * t3) * env3;
        sample += 0.25 * Math.sin(2 * Math.PI * 2093 * t3) * env3;
      }

      // Clamp to 16-bit signed integer
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }

    // Convert to base64
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    cachedWavDataUri = `data:audio/wav;base64,${btoa(binary)}`;
    return cachedWavDataUri;
  } catch (err) {
    console.debug('WAV synthesis fallback error:', err);
    return '';
  }
}

/**
 * Get or initialize shared AudioContext
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!sharedAudioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    } catch (err) {
      console.warn('AudioContext creation notice:', err);
    }
  }

  return sharedAudioCtx;
}

/**
 * Unlocks the Web Audio context on user gesture (click, tap, or keydown)
 */
export async function unlockAudio(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    isAudioUnlocked = ctx.state === 'running';
    return isAudioUnlocked;
  } catch (err) {
    console.debug('Audio unlock notice:', err);
    return false;
  }
}

/**
 * Automatically hook user gestures to unlock audio context immediately on dashboard visit
 */
if (typeof window !== 'undefined') {
  const handleUserInteraction = () => {
    unlockAudio();
    // Warm up fallback WAV audio
    try {
      generateReceptionChimeWav();
    } catch {
      // ignore
    }
  };

  window.addEventListener('click', handleUserInteraction, { passive: true });
  window.addEventListener('touchstart', handleUserInteraction, { passive: true });
  window.addEventListener('keydown', handleUserInteraction, { passive: true });
}

export interface PlayRingOptions {
  volume?: number; // 0.1 to 1.0 (default 0.7)
  repeatCount?: number; // 1 or 2
  type?: 'reception-ring' | 'crystal-chime' | 'urgent-bell';
}

/**
 * Plays a loud, clear, unmistakable luxury reception bell chime ring
 * Designed specifically so salon managers hear it clearly when any client confirms a booking.
 */
export async function playBookingRingSound(options: PlayRingOptions = {}): Promise<boolean> {
  const volume = Math.max(0.1, Math.min(1.0, options.volume ?? 0.7));
  let webAudioSuccess = false;

  // 1. Try Web Audio API with multi-oscillator brass bell harmonics
  const ctx = getAudioContext();
  if (ctx) {
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (ctx.state === 'running') {
        const now = ctx.currentTime;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, now);
        masterGain.connect(ctx.destination);

        // Helper to schedule a bell note
        const scheduleBellNote = (freq: number, harmonicFreq: number, startTime: number, decayDuration: number, noteGain: number) => {
          const oscMain = ctx.createOscillator();
          const oscHarmonic = ctx.createOscillator();
          const noteGainNode = ctx.createGain();

          oscMain.type = 'sine';
          oscMain.frequency.setValueAtTime(freq, startTime);

          oscHarmonic.type = 'triangle';
          oscHarmonic.frequency.setValueAtTime(harmonicFreq, startTime);

          // Natural bell envelope: rapid attack, smooth exponential decay
          noteGainNode.gain.setValueAtTime(0.001, startTime);
          noteGainNode.gain.linearRampToValueAtTime(noteGain, startTime + 0.008);
          noteGainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + decayDuration);

          oscMain.connect(noteGainNode);
          oscHarmonic.connect(noteGainNode);
          noteGainNode.connect(masterGain);

          oscMain.start(startTime);
          oscHarmonic.start(startTime);
          oscMain.stop(startTime + decayDuration);
          oscHarmonic.stop(startTime + decayDuration);
        };

        // Note 1: High crisp bell (G5 - 783.99 Hz + G6 harmonic 1567.98 Hz)
        scheduleBellNote(783.99, 1567.98, now + 0.02, 0.45, 0.6);

        // Note 2: Warm harmony bell (E5 - 659.25 Hz + E6 harmonic 1318.5 Hz)
        scheduleBellNote(659.25, 1318.5, now + 0.22, 0.55, 0.7);

        // Note 3: Ascending bright chime (A5 - 880 Hz + A6 harmonic 1760 Hz)
        scheduleBellNote(880.0, 1760.0, now + 0.44, 0.6, 0.75);

        // Note 4: Sustained signature high bell (High C6 - 1046.5 Hz + C7 harmonic 2093 Hz)
        scheduleBellNote(1046.5, 2093.0, now + 0.66, 1.1, 0.85);

        // Reprise Echo at +0.95s (Ding-Dong finish!)
        scheduleBellNote(880.0, 1760.0, now + 0.98, 0.45, 0.55);
        scheduleBellNote(1046.5, 2093.0, now + 1.18, 1.2, 0.75);

        webAudioSuccess = true;
      }
    } catch (err) {
      console.warn('Web Audio synthesis notice:', err);
    }
  }

  // 2. Fallback to pre-rendered WAV Audio element if Web Audio didn't play or was suspended
  if (!webAudioSuccess) {
    try {
      const dataUri = generateReceptionChimeWav();
      if (dataUri) {
        const audio = new Audio(dataUri);
        audio.volume = volume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          return true;
        }
      }
    } catch (audioErr) {
      console.debug('HTML5 Audio fallback notice:', audioErr);
    }
  }

  return webAudioSuccess;
}
