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
    let edge = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      slow = slow * 0.992 + white * 0.008;
      fast = fast * 0.82 + white * 0.18;
      const aspirated = white - fast * 0.72 - slow * 0.18;
      edge = edge * 0.75 + aspirated * 0.25;
      data[i] = Math.tanh((aspirated * 1.9 + edge * 0.35) * 0.9) * 0.34;
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
      hp.frequency.value = 720;
      airy.frequency.value = 1700;
      formant1.frequency.value = 1450;
      formant1.Q.value = 2.4;
      formant2.frequency.value = 2650;
      formant2.Q.value = 1.6;
      lp.frequency.value = 5400;
      airGain.gain.value = 0.95;
      formant1Gain.gain.value = 0.22;
      formant2Gain.gain.value = 0.1;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + dur * 0.12);
      gain.gain.linearRampToValueAtTime(0.048, now + dur * 0.45);
      gain.gain.linearRampToValueAtTime(0.04, now + dur * 0.82);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      formant1.frequency.setValueAtTime(1320, now);
      formant1.frequency.linearRampToValueAtTime(1680, now + dur);
      airy.frequency.setValueAtTime(1550, now);
      airy.frequency.linearRampToValueAtTime(1900, now + dur);
    } else if (type === "exhale") {
      hp.frequency.value = 520;
      airy.frequency.value = 1320;
      formant1.frequency.value = 980;
      formant1.Q.value = 1.8;
      formant2.frequency.value = 1850;
      formant2.Q.value = 1.1;
      lp.frequency.value = 4200;
      airGain.gain.value = 0.8;
      formant1Gain.gain.value = 0.18;
      formant2Gain.gain.value = 0.08;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.034, now + dur * 0.1);
      gain.gain.linearRampToValueAtTime(0.042, now + dur * 0.28);
      gain.gain.linearRampToValueAtTime(0.028, now + dur * 0.72);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      formant1.frequency.setValueAtTime(1080, now);
      formant1.frequency.linearRampToValueAtTime(760, now + dur);
      airy.frequency.setValueAtTime(1450, now);
      airy.frequency.linearRampToValueAtTime(1180, now + dur);
    } else if (type === "sniff") {
      hp.frequency.value = 1250;
      airy.frequency.value = 2600;
      formant1.frequency.value = 2300;
      formant1.Q.value = 3.3;
      formant2.frequency.value = 3600;
      formant2.Q.value = 2.1;
      lp.frequency.value = 6500;
      airGain.gain.value = 1.05;
      formant1Gain.gain.value = 0.16;
      formant2Gain.gain.value = 0.07;

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + dur * 0.06);
      gain.gain.linearRampToValueAtTime(0.028, now + dur * 0.32);
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
