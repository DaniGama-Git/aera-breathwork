// Breath sound synthesizer using Web Audio API
export class BreathAudio {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioBufferSourceNode[] = [];

  private ensureContext(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  stop() {
    this.activeNodes.forEach((n) => {
      try { n.stop(); } catch (_) {}
    });
    this.activeNodes = [];
  }

  playInhale(durationMs: number) { this.playBreath(durationMs, "inhale"); }
  playExhale(durationMs: number) { this.playBreath(durationMs, "exhale"); }
  playSniff(durationMs: number) { this.playBreath(durationMs, "sniff"); }

  private createPinkNoise(ctx: AudioContext, length: number): AudioBuffer {
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private playBreath(durationMs: number, type: "inhale" | "exhale" | "sniff") {
    this.stop();
    const ctx = this.ensureContext();
    const dur = durationMs / 1000;
    const now = ctx.currentTime;

    const bufferLen = ctx.sampleRate * Math.ceil(dur + 0.5);
    const buffer = this.createPinkNoise(ctx, bufferLen);

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass to remove rumble — breathing doesn't have deep bass
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = type === "sniff" ? 600 : 300;
    hp.Q.value = 0.5;

    // Primary formant — simulates airway resonance
    const formant1 = ctx.createBiquadFilter();
    formant1.type = "bandpass";

    // Secondary formant — adds breathiness
    const formant2 = ctx.createBiquadFilter();
    formant2.type = "bandpass";

    // Gentle lowpass to soften harshness
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";

    const gain = ctx.createGain();

    if (type === "inhale") {
      // Inhale: narrower, slightly higher pitch, "sipping air" quality
      formant1.frequency.value = 1400;
      formant1.Q.value = 1.8;
      formant2.frequency.value = 2800;
      formant2.Q.value = 1.2;
      lp.frequency.value = 4000;

      // Smooth onset, sustained, gentle taper
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + dur * 0.15);
      gain.gain.linearRampToValueAtTime(0.10, now + dur * 0.5);
      gain.gain.linearRampToValueAtTime(0.07, now + dur * 0.85);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      // Subtle pitch rise during inhale
      formant1.frequency.setValueAtTime(1200, now);
      formant1.frequency.linearRampToValueAtTime(1600, now + dur);
    } else if (type === "exhale") {
      // Exhale: wider, softer, "hushing" quality
      formant1.frequency.value = 900;
      formant1.Q.value = 1.0;
      formant2.frequency.value = 2200;
      formant2.Q.value = 0.8;
      lp.frequency.value = 3200;

      // Starts with gentle onset, long decay
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + dur * 0.08);
      gain.gain.linearRampToValueAtTime(0.07, now + dur * 0.3);
      gain.gain.linearRampToValueAtTime(0.04, now + dur * 0.7);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      // Subtle pitch drop during exhale
      formant1.frequency.setValueAtTime(1000, now);
      formant1.frequency.linearRampToValueAtTime(700, now + dur);
    } else if (type === "sniff") {
      // Sniff: sharp, nasal, brief burst
      formant1.frequency.value = 2000;
      formant1.Q.value = 2.5;
      formant2.frequency.value = 3500;
      formant2.Q.value = 1.8;
      lp.frequency.value = 5000;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + dur * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, now + dur * 0.4);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);
    }

    // Parallel formant routing for richer sound
    const merge = ctx.createGain();
    merge.gain.value = 1.0;

    noise.connect(hp);

    // Split into two formant paths
    const split1 = ctx.createGain();
    split1.gain.value = 0.7;
    const split2 = ctx.createGain();
    split2.gain.value = 0.3;

    hp.connect(split1);
    hp.connect(split2);
    split1.connect(formant1);
    split2.connect(formant2);
    formant1.connect(merge);
    formant2.connect(merge);

    merge.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + dur + 0.1);
    this.activeNodes.push(noise);

    noise.onended = () => {
      this.activeNodes = this.activeNodes.filter((n) => n !== noise);
    };
  }
}
