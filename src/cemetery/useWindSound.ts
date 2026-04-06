import { useEffect } from 'react';

// Różowy szum — generowany offline jako AudioBuffer (Kellet algorithm)
function generatePinkNoiseBuffer(ctx: AudioContext, durationSec = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const out = buffer.getChannelData(0);

  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.1538520;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }

  return buffer;
}

export function useWindSound() {
  useEffect(() => {
    // Dedykowany AudioContext dla tego hooka — unika konfliktów z innymi węzłami
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('[Wind] AudioContext created, state:', ctx.state);

    // ── Bufor różowego szumu ──────────────────────────────────────────────────
    const buffer = generatePinkNoiseBuffer(ctx, 2);
    console.log('[Wind] pink noise buffer ready, sampleRate:', ctx.sampleRate);

    // ── Graf audio: source → masterGain → destination ─────────────────────────
    // (filtry tymczasowo wyłączone — diagnostyka ścieżki audio)
      // Bandpass — wycinamy "świst" wiatru (~200-600 Hz)
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 320;
      bandpass.Q.value = 0.7;

      // Lowpass — ściemnia ostre góry, wiatr brzmi miękko
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 900;
      lowpass.Q.value = 0.5;

      // Master gain — startuje od niewielkiej wartości, żeby węzeł był 'ciepły'
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.005;

      // Routing: source → bandpass → lowpass → masterGain → destination
      bandpass.connect(lowpass);
      lowpass.connect(masterGain);
      masterGain.connect(ctx.destination);

    // ── Stan lokalny w domknięciu (bez ryzyka przestarzałych ref-ów) ─────────
    let source: AudioBufferSourceNode | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let active = false;

    let seqSeed = Date.now();
    const rand = () => {
      seqSeed = (seqSeed * 1664525 + 1013904223) & 0xffffffff;
      return (seqSeed >>> 0) / 0xffffffff;
    };

    // ── Sekwencer podmuchów ───────────────────────────────────────────────────
    const scheduleGust = () => {
      if (!active) return;

      const t = ctx.currentTime;

      // Parametry podmuchu
        const peakGain = 0.05 + rand() * 0.15; // 0.05..0.2
      const attackTime = 0.8 + rand() * 2.2;
      const holdTime = 0.3 + rand() * 1.5;
      const decayTime = 1.2 + rand() * 3.0;
      const gustDur = attackTime + holdTime + decayTime;

      // Barwa per podmuch — losujemy bazową częstotliwość filtrem
      const baseFreq = 200 + rand() * 400; // 200..600 Hz
      bandpass.frequency.setTargetAtTime(baseFreq, t, attackTime * 0.4);

      // Envelope na masterGain
      masterGain.gain.cancelScheduledValues(t);
      masterGain.gain.setValueAtTime(masterGain.gain.value, t);
      masterGain.gain.linearRampToValueAtTime(peakGain, t + attackTime);
      masterGain.gain.setValueAtTime(peakGain, t + attackTime + holdTime);
      masterGain.gain.linearRampToValueAtTime(0.005, t + gustDur); // return to gentle base instead of silence

      const pauseMs = 1500 + rand() * 5000;
        const totalMs = gustDur * 1000 + pauseMs; // use totalMs for setTimeout
      console.log('[Wind] gust → attack:', attackTime.toFixed(1), 's | dur:', gustDur.toFixed(1), 's | next in:', Math.round(totalMs), 'ms');

      timeout = setTimeout(scheduleGust, totalMs);
    };

    // ── Uruchomienie po geście użytkownika ────────────────────────────────────
    const onInteraction = async () => {
      if (active) return;

      console.log('[Wind] interaction detected, ctx.state:', ctx.state);

      try {
        await ctx.resume();
      } catch (err) {
        console.error('[Wind] ctx.resume() failed:', err);
        return;
      }

      console.log('[Wind] ctx.state after resume:', ctx.state);

      if (ctx.state !== 'running') {
        console.error('[Wind] AudioContext still not running after resume!');
        return;
      }

      // Stwórz i uruchom źródło szumu
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      // Connect source into the filter chain: source -> bandpass -> lowpass -> masterGain
      source.connect(bandpass);
      source.start();
      console.log('[Wind] source started, loop=true');

      active = true;
      const initialDelay = 300 + Math.random() * 500;
      console.log('[Wind] first gust in:', Math.round(initialDelay), 'ms');
      timeout = setTimeout(scheduleGust, initialDelay);
    };

    window.addEventListener('click', onInteraction, { once: true });
    window.addEventListener('keydown', onInteraction, { once: true });
    window.addEventListener('touchstart', onInteraction, { once: true });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      active = false;
      window.removeEventListener('click', onInteraction);
      window.removeEventListener('keydown', onInteraction);
      window.removeEventListener('touchstart', onInteraction);

      if (timeout !== null) clearTimeout(timeout);

      if (source) {
        try { source.stop(); } catch (_) { /* ignore */ }
        try { source.disconnect(); } catch (_) { /* ignore */ }
        source = null;
      }

      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.disconnect();

      ctx.close().catch(() => { /* ignore */ });
      console.log('[Wind] cleanup done');
    };
  }, []);
}
