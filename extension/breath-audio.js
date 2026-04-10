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

  playInhale(durationMs) { this._playBreath(durationMs, "inhale"); }
  playExhale(durationMs) { this._playBreath(durationMs, "exhale"); }
  playSniff(durationMs) { this._playBreath(durationMs, "sniff"); }

  _createBreathNoise(ctx, length) {
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let slow = 0;
    let fast = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      slow = slow * 0.996 + white * 0.004;
      fast = fast * 0.88 + white * 0.12;
      const shaped = white - fast * 0.8 - slow * 0.15;
      data[i] = Math.tanh(shaped * 1.2) * 0.18;
    }
    return buffer;
  }

  _playBreath(durationMs, type) {
    this.stop();
    const ctx = this._ensureContext();
    const dur = durationMs / 1000;
    const now = ctx.currentTime;

    const bufferLen = ctx.sampleRate * Math.ceil(dur + 0.5);
    const buffer = this._createBreathNoise(ctx, bufferLen);

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.Q.value = 0.8;

    const airy = ctx.createBiquadFilter();
    airy.type = "highpass";
    airy.Q.value = 0.9;

    const formant1 = ctx.createBiquadFilter();
    formant1.type = "bandpass";

    const formant2 = ctx.createBiquadFilter();
    formant2.type = "bandpass";

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";

    const airGain = ctx.createGain();
    const formant1Gain = ctx.createGain();
    const formant2Gain = ctx.createGain();
    const merge = ctx.createGain();
    const gain = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();

    compressor.threshold.value = -26;
    compressor.knee.value = 10;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.12;

    if (type === "inhale") {
      hp.frequency.value = 1100;
      airy.frequency.value = 2200;
      formant1.frequency.value = 1800;
      formant1.Q.value = 3.2;
      formant2.frequency.value = 3200;
      formant2.Q.value = 2.0;
      lp.frequency.value = 4800;
      airGain.gain.value = 0.45;
      formant1Gain.gain.value = 0.12;
      formant2Gain.gain.value = 0.05;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + dur * 0.15);
      gain.gain.linearRampToValueAtTime(0.05, now + dur * 0.5);
      gain.gain.linearRampToValueAtTime(0.038, now + dur * 0.82);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      formant1.frequency.setValueAtTime(1650, now);
      formant1.frequency.linearRampToValueAtTime(2050, now + dur);
      airy.frequency.setValueAtTime(2000, now);
      airy.frequency.linearRampToValueAtTime(2500, now + dur);
    } else if (type === "exhale") {
      hp.frequency.value = 800;
      airy.frequency.value = 1600;
      formant1.frequency.value = 1200;
      formant1.Q.value = 2.2;
      formant2.frequency.value = 2100;
      formant2.Q.value = 1.4;
      lp.frequency.value = 3800;
      airGain.gain.value = 0.5;
      formant1Gain.gain.value = 0.1;
      formant2Gain.gain.value = 0.04;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + dur * 0.1);
      gain.gain.linearRampToValueAtTime(0.045, now + dur * 0.3);
      gain.gain.linearRampToValueAtTime(0.028, now + dur * 0.72);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      formant1.frequency.setValueAtTime(1300, now);
      formant1.frequency.linearRampToValueAtTime(900, now + dur);
      airy.frequency.setValueAtTime(1700, now);
      airy.frequency.linearRampToValueAtTime(1400, now + dur);
    } else if (type === "sniff") {
      hp.frequency.value = 1600;
      airy.frequency.value = 3000;
      formant1.frequency.value = 2800;
      formant1.Q.value = 3.8;
      formant2.frequency.value = 4200;
      formant2.Q.value = 2.5;
      lp.frequency.value = 6000;
      airGain.gain.value = 0.5;
      formant1Gain.gain.value = 0.1;
      formant2Gain.gain.value = 0.04;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + dur * 0.08);
      gain.gain.linearRampToValueAtTime(0.018, now + dur * 0.35);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);
    }

    noise.connect(hp);
    hp.connect(airy);
    hp.connect(formant1);
    hp.connect(formant2);

    airy.connect(airGain);
    formant1.connect(formant1Gain);
    formant2.connect(formant2Gain);
    airGain.connect(merge);
    formant1Gain.connect(merge);
    formant2Gain.connect(merge);

    merge.gain.value = 1.0;
    merge.connect(lp);
    lp.connect(gain);
    gain.connect(compressor);
    compressor.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + dur + 0.1);
    this.activeNodes.push(noise);

    noise.onended = () => {
      this.activeNodes = this.activeNodes.filter(n => n !== noise);
    };
  }
}
