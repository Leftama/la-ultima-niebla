/**
 * Retro Arcade & Martial Arts Synth Audio Engine using Web Audio API
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on the first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      } catch (e) {
        console.error('Web Audio API is not supported in this browser:', e);
      }
    }
    // Resume context if suspended (browser security autoplays)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  /**
   * Play a synthesized martial arts "KIHAP!" shout
   */
  public playKihap() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Vocal Chord Simulator (Oscillator with rapid pitch slide)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    // Triangle wave has voice-like harmonics
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    // 2. Breath Aspiration Simulator (Filtered White Noise)
    const bufferSize = ctx.sampleRate * 0.3; // 0.3 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    // Connect both nodes
    osc.connect(oscGain);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    // Combine into main output
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, now);
    
    oscGain.connect(masterGain);
    noiseGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Start playback
    osc.start(now);
    noise.start(now);

    osc.stop(now + 0.35);
    noise.stop(now + 0.35);
  }

  /**
   * Play classic 8-bit double coin insert sound
   */
  public playCoin() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    
    // Classic arcade coin chime: first note, then rapid step to higher note
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Play classic low punch/kick impact sound
   */
  public playHit() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Bass thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    // High frequency impact crack (filtered noise)
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(oscGain);
    noise.connect(filter);
    filter.connect(noiseGain);

    const master = ctx.createGain();
    oscGain.connect(master);
    noiseGain.connect(master);
    master.connect(ctx.destination);

    osc.start(now);
    noise.start(now);

    osc.stop(now + 0.2);
    noise.stop(now + 0.2);
  }

  /**
   * Play retro sword slash/special move sweep sound
   */
  public playSlash() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  /**
   * Play minor descending chord game over chime
   */
  public playGameOver() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392.00, 311.13, 261.63, 196.00]; // G4, Eb4, C4, G3 (C minor)
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      
      gain.gain.setValueAtTime(0.15, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.15 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.65);
    });
  }

  /**
   * Play major ascending fanfare victory chime
   */
  public playVictory() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6 (C Major)
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square'; // Arcade-y square wave
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  /**
   * Play soft success chime
   */
  public playSuccess() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // --- GHOST MODE EXPANSION AUDIO EFFECTS ---
  private breathInterval: any = null;
  private clockInterval: any = null;

  /**
   * Play a single procedural click (tick/tock)
   */
  public playClockTick(isTick: boolean = true) {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isTick ? 1800 : 1200, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);

    gain.gain.setValueAtTime(0.04, now); // low background volume
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Play a single procedural breathing wave (inhale + exhale) using noise
   */
  public playDeepBreath() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3.6; // 3.6 seconds for breathing cycle

    // Procedural noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    
    // Smooth inhalation and exhalation sweeps
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 1.6); // inhale peak
    filter.frequency.exponentialRampToValueAtTime(200, now + 3.6); // exhale drop

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.6); // inhale volume peak
    gain.gain.linearRampToValueAtTime(0.12, now + 2.0); // exhale start
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  /**
   * Play screen shattering glass crack with noise and high bell tones
   */
  public playScreenShatter() {
    if (!this.soundEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Crash explosion (noise)
    const crashBufferSize = ctx.sampleRate * 0.8;
    const crashBuffer = ctx.createBuffer(1, crashBufferSize, ctx.sampleRate);
    const crashData = crashBuffer.getChannelData(0);
    for (let i = 0; i < crashBufferSize; i++) {
      crashData[i] = Math.random() * 2 - 1;
    }
    const crashSource = ctx.createBufferSource();
    crashSource.buffer = crashBuffer;

    const crashFilter = ctx.createBiquadFilter();
    crashFilter.type = 'bandpass';
    crashFilter.frequency.setValueAtTime(1000, now);
    crashFilter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    const crashGain = ctx.createGain();
    crashGain.gain.setValueAtTime(0.3, now);
    crashGain.gain.exponentialRampToValueAtTime(0.005, now + 0.7);

    crashSource.connect(crashFilter);
    crashFilter.connect(crashGain);
    crashGain.connect(ctx.destination);
    crashSource.start(now);
    crashSource.stop(now + 0.8);

    // 2. High glass shard splinters (multiple short sine/square waves)
    const frequencies = [3500, 4200, 2800, 5000, 6000];
    frequencies.forEach((freq, idx) => {
      const delay = idx * 0.04;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.linearRampToValueAtTime(freq * 0.7, now + delay + 0.35);

      oscGain.gain.setValueAtTime(0.12, now + delay);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.4);
    });
  }

  /**
   * Start constant background tick-tock and breathing loop for Ghost Mode
   */
  public startGhostAmbience() {
    this.stopGhostAmbience();
    const ctx = this.initCtx();
    if (!ctx) return;

    let ticks = 0;
    this.clockInterval = setInterval(() => {
      this.playClockTick(ticks++ % 2 === 0);
    }, 1000);

    const runBreath = () => {
      this.playDeepBreath();
    };
    runBreath();
    this.breathInterval = setInterval(runBreath, 4000);
  }

  /**
   * Stop Ghost Mode background loops
   */
  public stopGhostAmbience() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    if (this.breathInterval) {
      clearInterval(this.breathInterval);
      this.breathInterval = null;
    }
  }
}

export const audio = new AudioEngine();
