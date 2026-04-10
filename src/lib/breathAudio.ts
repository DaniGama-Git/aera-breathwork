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

  private playBreath(durationMs: number, type: "inhale" | "exhale" | "sniff") {
    this.stop();
    const ctx = this.ensureContext();
    const dur = durationMs / 1000;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * Math.ceil(dur + 0.5);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";

    const gain = ctx.createGain();

    if (type === "inhale") {
      filter.frequency.value = 800;
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + dur * 0.3);
      gain.gain.linearRampToValueAtTime(0.22, now + dur * 0.7);
      gain.gain.linearRampToValueAtTime(0.05, now + dur);
    } else if (type === "exhale") {
      filter.frequency.value = 600;
      filter.Q.value = 0.5;
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.15, now + dur * 0.4);
      gain.gain.linearRampToValueAtTime(0.08, now + dur * 0.75);
      gain.gain.linearRampToValueAtTime(0.0, now + dur);
    } else if (type === "sniff") {
      filter.frequency.value = 1200;
      filter.Q.value = 1.2;
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + dur * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + dur * 0.5);
      gain.gain.linearRampToValueAtTime(0.0, now + dur);
    }

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = type === "sniff" ? 3000 : 2000;

    noise.connect(filter);
    filter.connect(lp);
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
