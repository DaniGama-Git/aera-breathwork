// Breath sound synthesizer using Web Audio API
class BreathAudio {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
  }

  _ensureContext() {
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  stop() {
    this.activeNodes.forEach(n => {
      try { n.stop(); } catch (_) {}
    });
    this.activeNodes = [];
  }

  // Play a breath sound for the given duration in ms
  playInhale(durationMs) { this._playBreath(durationMs, "inhale"); }
  playExhale(durationMs) { this._playBreath(durationMs, "exhale"); }
  playSniff(durationMs) { this._playBreath(durationMs, "sniff"); }

  _playBreath(durationMs, type) {
    this.stop();
    const ctx = this._ensureContext();
    const dur = durationMs / 1000;
    const now = ctx.currentTime;

    // White noise source
    const bufferSize = ctx.sampleRate * Math.ceil(dur + 0.5);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter for breath character
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";

    // Gain envelope
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

    // Secondary filter for warmth
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
      this.activeNodes = this.activeNodes.filter(n => n !== noise);
    };
  }
}
