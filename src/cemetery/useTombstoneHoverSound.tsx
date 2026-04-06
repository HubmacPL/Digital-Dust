import { useRef, useCallback } from 'react'

function hashId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash)
}

// ─── Globalny singleton ───────────────────────────────────────────────────────
let sharedAudioContext: AudioContext | null = null

const getSharedCtx = () => {
  if (!sharedAudioContext)
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  return sharedAudioContext
}

let activeNodes: {
  osc1: OscillatorNode
  osc2: OscillatorNode
  gain: GainNode
  timeoutId: ReturnType<typeof setTimeout> | null
} | null = null
// ─────────────────────────────────────────────────────────────────────────────

// Syntetyczny reverb — krótki impulse response z białego szumu z wykładniczym zanikaniem
function buildReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver()
  const sampleRate = ctx.sampleRate
  const length = sampleRate * 1.2          // 1.2s ogon
  const impulse = ctx.createBuffer(2, length, sampleRate)

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      // Biały szum * wykładnicze zanikanie — symuluje odbicia w pustej przestrzeni
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8)
    }
  }

  convolver.buffer = impulse
  return convolver
}

// Jeden reverb na cały AudioContext — drogi obliczeniowo, nie tworzymy go co hover
let cachedReverb: ConvolverNode | null = null
const getReverb = (ctx: AudioContext) => {
  if (!cachedReverb) cachedReverb = buildReverb(ctx)
  return cachedReverb
}

function killActiveNodes() {
  if (!activeNodes) return
  const n = activeNodes
  activeNodes = null

  if (n.timeoutId !== null) clearTimeout(n.timeoutId)

  const ctx = getSharedCtx()
  const now = ctx.currentTime
  n.gain.gain.cancelScheduledValues(now)
  n.gain.gain.setValueAtTime(n.gain.gain.value, now)
  n.gain.gain.linearRampToValueAtTime(0, now + 0.005)

  setTimeout(() => {
    try { n.osc1.stop(); n.osc2.stop() } catch (_) {}
    try {
      n.osc1.disconnect()
      n.osc2.disconnect()
      n.gain.disconnect()
    } catch (_) {}
  }, 20)
}

export function useTombstoneHoverSound(id: string) {
  const isActiveRef = useRef(false)

  const _createNodes = useCallback(() => {
    killActiveNodes()

    const ctx = getSharedCtx()
    void ctx.resume()
    const seed = hashId(id)

    // ── Parametry per-nagrobek ──────────────────────────────────────────────
    const beepFreq = 600  + (seed % 600)          // 600..1199 Hz
    const beepDur  = 0.08 + (seed % 120) / 1000   // 0.08..0.2s — nieco dłuższe niż poprzednio
    const minGap   = 200  + (seed % 400)           // 200..599ms
    const maxGap   = 800  + (seed % 1200)          // 800..1999ms
    // Detuning między osc1 a osc2 — "bicie" analogowego nadajnika
    const beatHz   = 1.5  + (seed % 40) / 10      // 1.5..5.5 Hz

    // ── Graf audio ─────────────────────────────────────────────────────────
    // Dwa oscylatory sinusoidalne z lekkim detunigiem → sumują się w gain
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = beepFreq

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = beepFreq + beatHz      // lekko rozstrojony

    // Gain — envelope
    const gain = ctx.createGain()
    gain.gain.value = 0

    // Lowpass — tłumi ostre wysokie częstotliwości jak stare radio
    const lpf = ctx.createBiquadFilter()
    lpf.type = 'lowpass'
    lpf.frequency.value = beepFreq * 2.2
    lpf.Q.value = 0.8

    // Dry/wet mix dla reverbu
    const dryGain = ctx.createGain()
    dryGain.gain.value = 0.75

    const wetGain = ctx.createGain()
    wetGain.gain.value = 0.35

    const reverb = getReverb(ctx)

    // Routing:
    // osc1 + osc2 → gain → lpf → dryGain → destination
    //                           → wetGain → reverb → destination
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(lpf)
    lpf.connect(dryGain)
    lpf.connect(wetGain)
    dryGain.connect(ctx.destination)
    wetGain.connect(reverb)
    reverb.connect(ctx.destination)

    osc1.start()
    osc2.start()

    isActiveRef.current = true
    activeNodes = { osc1, osc2, gain, timeoutId: null }

    // ── Sekwencer pipnięć ──────────────────────────────────────────────────
    let seqSeed = seed ^ Date.now()
    const nextRand = () => {
      seqSeed = (seqSeed * 1664525 + 1013904223) & 0xffffffff
      return (seqSeed >>> 0) / 0xffffffff
    }

    const scheduleBeep = () => {
      if (!isActiveRef.current || !activeNodes) return

      const t = ctx.currentTime

      // Envelope — atak 6ms, decay wykładniczy
      gain.gain.cancelScheduledValues(t)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.22, t + 0.006)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + beepDur)

      // Chirp — częstotliwość opada na końcu pipu (jak wyczerpana bateria)
      const chirpDrop = beepFreq * (0.985 + nextRand() * 0.008) // opada o ~0.7-1.5%
      osc1.frequency.setValueAtTime(beepFreq, t)
      osc1.frequency.exponentialRampToValueAtTime(chirpDrop, t + beepDur)
      osc2.frequency.setValueAtTime(beepFreq + beatHz, t)
      osc2.frequency.exponentialRampToValueAtTime(chirpDrop + beatHz, t + beepDur)

      // Następna przerwa
      const gap = minGap + nextRand() * (maxGap - minGap)
      activeNodes.timeoutId = setTimeout(scheduleBeep, beepDur * 1000 + gap)
    }

    scheduleBeep()
  }, [id])

  const start = useCallback(() => {
    if (isActiveRef.current && activeNodes) return
    _createNodes()
  }, [_createNodes])

  const stop = useCallback(() => {
    if (!isActiveRef.current) return
    isActiveRef.current = false
    if (activeNodes) killActiveNodes()
  }, [])

  return { start, stop }
}