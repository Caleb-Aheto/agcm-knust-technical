const MULTI_PAGE_MODE = false;
    const _memStore = {};
    function safeGetItem(k) {
      try { const v = window.localStorage.getItem(k); return v !== null ? v : (_memStore[k] || null); } catch (e) { return _memStore[k] || null; }
    }
    function safeSetItem(k, v) {
      _memStore[k] = String(v); try { window.localStorage.setItem(k, String(v)); } catch (e) {}
    }

    const DEFAULT_EVENTS = [
      {
        id: 'ev_sunday',
        name: 'Sunday Main Service',
        type: 'Sunday Service',
        venue: 'Great Hall',
        time: 'Call: 06:30 AM • Start: 08:30 AM',
        notes: 'Run 15-sec vocal mic scratch check (Red=LV, Blue/Green/Yellow/Purple=BVs) before doors open.',
        crew: [
          { role: 'FOH Console Engineer', person: 'Assigned FOH Console Lead' },
          { role: 'Monitor / Stage Engineer', person: 'Assign Tech' },
          { role: 'Stage / Mic Runner', person: 'Assign Runner' },
          { role: 'Recording & Mastering Lead', person: 'Assign Tech' },
          { role: 'Setup & Conveyance Lead', person: 'Assign Crew' },
          { role: 'Power / Amp Rack', person: 'Assign Power Tech' }
        ],
        cues: [
          { time: '06:30 AM', seg: 'Rig Power-Up & Line Check', lead: 'Technical Crew', audio: 'DX2496 90Hz check, 15s vocal scratch test, Ø on Tom1/Floor/Bass', media: 'Verify Capture 44.1kHz multitrack & truck unload', status: 'Done' },
          { time: '08:30 AM', seg: 'Opening Prayer & Intercession', lead: 'Prayer Lead', audio: 'Unmute Pulpit/LV Red mic; keep BV DCA muted', media: 'Record clean speech stem; check stage handoffs', status: 'Upcoming' },
          { time: '08:50 AM', seg: 'Praise & Worship', lead: 'Worship Team', audio: 'Unmute Full Band + LV + BV DCA; ride Keys 1/2 balance', media: 'Monitor multitrack peaks; prep post-service mix', status: 'Upcoming' },
          { time: '09:35 AM', seg: 'Word / Sermon', lead: 'Speaker', audio: 'Mute BV DCA & Band; engage Pulpit/Headset EQ + Comp', media: 'Mark sermon track split for editing/mastering', status: 'Upcoming' },
          { time: '10:30 AM', seg: 'Altar Call & Ministry', lead: 'Pastor + Keys 1', audio: 'Keys 1 Soft Pad only + LV Red mic (2:1 Expander)', media: 'Stop Capture safely; prep cable coiling & conveyance', status: 'Upcoming' }
        ]
      },
      {
        id: 'ev_midweek',
        name: 'Midweek Word & Worship',
        type: 'Midweek Service',
        venue: 'Great Hall',
        time: 'Call: 05:00 PM • Start: 06:30 PM',
        notes: 'Compact band setup (Keys 1, Acoustic/Electric Guitar, Bass, Cajon/Kit, LV + 2 BVs).',
        crew: [
          { role: 'FOH Console Engineer', person: 'Assigned FOH Console Lead' },
          { role: 'Stage / Mic Runner', person: 'Assign Runner' },
          { role: 'Recording & Mastering Lead', person: 'Assign Tech' },
          { role: 'Setup & Conveyance Lead', person: 'Assign Crew' }
        ],
        cues: [
          { time: '05:00 PM', seg: 'Soundcheck & Color-Tape Check', lead: 'Technical Crew', audio: 'Verify Red/Blue/Green mics + Keys 1 gain', media: 'Confirm Capture armed & mic cases accounted for', status: 'Upcoming' },
          { time: '06:30 PM', seg: 'Worship Session', lead: 'Worship Team', audio: 'LV + BV1/2 + Keys 1 + Bass', media: 'Record stereo + multitrack stems for mastering', status: 'Upcoming' },
          { time: '07:10 PM', seg: 'Bible Study / Word', lead: 'Minister', audio: 'Speaker mic + Keys 1 muted', media: 'Split sermon track; pack spare mics after service', status: 'Upcoming' }
        ]
      }
    ];

    const CHANNELS = {
      lv: {
        id: 'lv',
        name: 'Lead Vocal (LV) — Ch 13',
        shortName: 'Lead Vocal (LV)',
        snakeCh: 'Snake In 13 → 32SX Ch 13 (Or Soft-Patch to In 17 if swapped)',
        peak: '-6.32 dBFS', peakNum: -6.32, rms: '-19.20 dBFS', rmsNum: -19.20,
        gatePct: '13.2%', domFreq: '786.0 Hz', phase: '0° Reference',
        severity: 'CRITICAL', isVocal: true,
        bands7: 'Sub 0.0% | Low 0.0% | Low-Mid 0.2% | Box 26.8% | Mid 57.1% | Upper 15.0% | Air 0.9%',
        forensicSummary: 'Reference benchmark when singing on an unmatched/thin capsule: 57.1% energy piled in 800Hz–2kHz (786Hz honk) with only 0.2% warmth below 350Hz. Always reserve the RED-taped SM58/Beta 58A for LV.',
        preamp: 'Trim: +0 dB (Peak -6.32 dBFS) • Polarity: Normal (0°) • If swapped on stage: Digital Patching → Input Source = Analog 17',
        gate: 'Expander 2:1 (NEVER hard gate LV) • Threshold: -46 dB • Attack: 5 ms • Release: 350 ms',
        comp: 'Stage 1 Standard: -22 dB Thresh, 3.2:1 Ratio, 15 ms Atk, 120 ms Rel • Bus 2 Peak Limiter catch for belt surges',
        stageTip: 'Mark LV handheld + stand with RED electrical tape. If a singer ever grabs a BV mic live, open 32SX HOME → Input → Digital Patching and soft-swap Ch 13 to that Analog Input in 5 seconds.',
        hpf: 80, problemFreq: 786, problemGain: 9.5,
        eq: [
          { freq: 240, q: 1.0, gain: 4.5, desc: 'Restore chest warmth (200–300 Hz body)' },
          { freq: 786, q: 3.0, gain: -4.5, desc: 'Cut nasal capsule resonance @ 786 Hz' },
          { freq: 1150, q: 2.2, gain: -3.5, desc: 'Tame 800Hz–2kHz belt harshness' },
          { freq: 8000, q: 0.7, gain: 3.5, desc: 'High-shelf air & vocal presence' }
        ]
      },
      kick: {
        id: 'kick', name: 'Kick Drum — Ch 01', shortName: 'Kick Drum',
        snakeCh: 'Snake In 1 → 32SX Ch 1 → Aux 10 Center Sub + Main L/R',
        peak: '0.00 dBFS (Clip)', peakNum: 0.00, rms: '-23.31 dBFS', rmsNum: -23.31,
        gatePct: '60.4%', domFreq: '96.9 Hz', phase: '0° Reference', severity: 'CRITICAL', isVocal: false,
        bands7: 'Sub 43.5% | Low 45.2% | Low-Mid 5.6% | Box 0.7% | Mid 0.5% | Upper 1.7% | Air 0.8%',
        forensicSummary: 'Reference Kick showed 0.00 dBFS preamp clipping, 96.9 Hz upper-bass knock (45.2%), and Bass guitar bleed false-triggering the gate.',
        preamp: 'Pad Preamp Gain by -6 dB (target -6 dBFS peak headroom) • Polarity: 0° (Master Drum Reference)',
        gate: 'Gate Threshold: -26 dB • Key Filter: ON @ 145 Hz (Q 2.5) so 102 Hz Bass bleed stops chattering the gate • Hold: 40 ms, Rel: 160 ms',
        comp: 'Threshold: -18 dB • Ratio: 4.5:1 • Attack: 28 ms • Release: 80 ms • Makeup: +3.0 dB',
        stageTip: 'Place Pillow/Towel touching front & batter heads; position mic 5–8 cm inside port angled 30° toward plastic beater.',
        hpf: 35, problemFreq: 97, problemGain: 8.5,
        eq: [
          { freq: 56, q: 1.4, gain: 5.5, desc: 'Deep sub-bass chest thump boost' },
          { freq: 98, q: 2.8, gain: -7.5, desc: 'Cut hollow 96.9 Hz knock & Bass collision' },
          { freq: 210, q: 1.6, gain: -7.0, desc: 'Clear shell cardboard boxiness (160–350 Hz)' },
          { freq: 3800, q: 1.4, gain: 6.5, desc: 'Beater click & transient snap' }
        ]
      },
      tom1: {
        id: 'tom1', name: '1st High Rack Tom — Ch 03', shortName: '1st Tom',
        snakeCh: 'Snake In 3 (Skips Dead Port 2) → 32SX Ch 3',
        peak: '-4.64 dBFS', peakNum: -4.64, rms: '-33.73 dBFS', rmsNum: -33.73,
        gatePct: '27.0%', domFreq: '172.3 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
        bands7: 'Sub 0.1% | Low 9.6% | Low-Mid 40.6% | Box 17.5% | Mid 3.8% | Upper 11.1% | Air 17.2%',
        forensicSummary: 'Gate stayed open 73.0% of the time leaking cymbal/snare bleed, and polarity was inverted (-1) vs. Kick (+2.93 ms).',
        preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on 32SX Ch 3 • Preamp Trim: 0 dB',
        gate: 'Gate Threshold: -24 dB • Key Filter: 170 Hz (Q 3.0) • Range: -40 dB',
        comp: 'Threshold: -18 dB • Ratio: 4:1 • Attack: 20 ms • Release: 110 ms',
        stageTip: 'Route via Snake Input 3 (Port 2 is dead). Angle mic 45° downward toward tom center, pointing null at crash cymbals.',
        hpf: 95, problemFreq: 420, problemGain: 6.0,
        eq: [
          { freq: 165, q: 1.6, gain: 3.5, desc: 'Reinforce 172 Hz fundamental rack tom body' },
          { freq: 420, q: 2.2, gain: -6.5, desc: 'Scoop cardboard boxiness & snare wash' },
          { freq: 850, q: 2.0, gain: -3.0, desc: 'Reduce mid-range ring overhang' },
          { freq: 4800, q: 1.5, gain: 4.0, desc: 'Stick attack definition' }
        ]
      },
      tom2: {
        id: 'tom2', name: '2nd Mid Rack Tom — Ch 04', shortName: '2nd Tom',
        snakeCh: 'Snake In 4 → 32SX Ch 4',
        peak: '-11.06 dBFS', peakNum: -11.06, rms: '-34.49 dBFS', rmsNum: -34.49,
        gatePct: '80.6%', domFreq: '140.0 Hz', phase: '+0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 0.4% | Low 30.1% | Low-Mid 31.7% | Box 9.5% | Mid 5.8% | Upper 8.2% | Air 14.1%',
        forensicSummary: 'Cleanest tom gate (closed 80.6%), positive polarity (+1), and solid 140.0 Hz fundamental; needs +4 dB trim to match Tom 1.',
        preamp: 'Add +4 dB Digital Trim to match Tom 1 level • Polarity: Normal (0°)',
        gate: 'Gate Threshold: -28 dB • Key Filter: 140 Hz (Q 2.8) • Hold: 35 ms • Release: 180 ms',
        comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 22 ms • Release: 120 ms',
        stageTip: 'Keep mic clip distance consistent with Tom 1.',
        hpf: 80, problemFreq: 360, problemGain: 5.0,
        eq: [
          { freq: 138, q: 1.5, gain: 4.0, desc: 'Boost 140 Hz mid-tom fundamental punch' },
          { freq: 360, q: 2.2, gain: -6.0, desc: 'Clean papery boxiness' },
          { freq: 900, q: 1.8, gain: -2.5, desc: 'Tighten sustain tail' },
          { freq: 4500, q: 1.4, gain: 4.5, desc: 'Stick attack snap' }
        ]
      },
      floortom: {
        id: 'floortom', name: 'Floor Tom — Ch 06', shortName: 'Floor Tom',
        snakeCh: 'Snake In 6 (Skips Dead Port 5) → 32SX Ch 6',
        peak: '-7.09 dBFS', peakNum: -7.09, rms: '-35.37 dBFS', rmsNum: -35.37,
        gatePct: '46.8%', domFreq: '204.6 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
        bands7: 'Sub 1.9% | Low 15.1% | Low-Mid 45.8% | Box 14.3% | Mid 1.8% | Upper 12.1% | Air 8.7%',
        forensicSummary: 'Snare bleed (204.6 Hz) false-triggered the gate 53.2% of the time, and polarity was inverted (-1) against Kick.',
        preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on 32SX Ch 6 • Route via Snake Port 6 (Port 5 is dead)',
        gate: 'Gate Threshold: -25 dB • Key Filter: 95 Hz (Q 3.0) so 204 Hz Snare hits cannot open it!',
        comp: 'Threshold: -19 dB • Ratio: 4:1 • Attack: 25 ms • Release: 150 ms',
        stageTip: 'Tune Gate Key Filter to 95 Hz—this blocks Snare bleed from opening the Floor Tom mic.',
        hpf: 55, problemFreq: 205, problemGain: 7.5,
        eq: [
          { freq: 88, q: 1.5, gain: 5.0, desc: 'Deep Floor Tom thunder fundamental' },
          { freq: 205, q: 2.8, gain: -6.5, desc: 'Notch 204.6 Hz Snare bleed & tubby resonance' },
          { freq: 380, q: 2.0, gain: -5.0, desc: 'Remove hollow barrel ring' },
          { freq: 4200, q: 1.5, gain: 4.5, desc: 'Beater/stick articulation' }
        ]
      },
      bass: {
        id: 'bass', name: 'Bass Guitar DI — Ch 07', shortName: 'Bass DI',
        snakeCh: 'Snake In 7 → 32SX Ch 7 → Aux 10 Center Sub + Main L/R',
        peak: '-5.17 dBFS', peakNum: -5.17, rms: '-29.35 dBFS', rmsNum: -29.35,
        gatePct: '27.2%', domFreq: '107.7 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
        bands7: 'Sub 17.9% | Low 59.9% | Low-Mid 20.9% | Box 0.6% | Mid 0.1% | Upper 0.0% | Air 0.0%',
        forensicSummary: '97.2% of energy sat below 250 Hz (colliding with Kick @ 96.9 Hz) with only 0.1% above 800 Hz, plus inverted polarity (-1) vs. Kick.',
        preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on 32SX Ch 7 • Trim: 0 dB',
        gate: 'Expander Threshold: -52 dB',
        comp: 'Tube/FET Model • Threshold: -20 dB • Ratio: 5:1 • Key Input: Ch 1 Kick (ducks 2.5 dB on Kick hits)',
        stageTip: 'Ask bassist to open their tone knob / active preamp mids slightly on stage.',
        hpf: 38, problemFreq: 108, problemGain: 8.0,
        eq: [
          { freq: 62, q: 1.5, gain: -2.5, desc: 'Leave 50–65 Hz sub pocket priority to Kick Drum' },
          { freq: 115, q: 1.8, gain: 2.5, desc: 'Controlled upper-bass note sustain pocket' },
          { freq: 230, q: 2.2, gain: -4.5, desc: 'Clean low-mid mud buildup in Great Hall' },
          { freq: 1100, q: 1.4, gain: 6.5, desc: 'Bring out finger/fret harmonic definition' }
        ]
      },
      keys1: {
        id: 'keys1', name: 'Keys 1 (Main Piano / Pad) — Ch 08', shortName: 'Keys 1 (Main)',
        snakeCh: 'Snake In 8 → 32SX Ch 8 (Pan L45)',
        peak: '-16.05 dBFS', peakNum: -16.05, rms: '-29.89 dBFS', rmsNum: -29.89,
        gatePct: '0.0%', domFreq: '312.2 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: false,
        bands7: 'Sub 0.2% | Low 7.0% | Low-Mid 35.4% | Box 45.9% | Mid 9.8% | Upper 1.6% | Air 0.1%',
        forensicSummary: '10.01 dB quieter than Keys 2, with 81.3% of energy concentrated in 160–800 Hz (312.2 Hz mud colliding with Backing Vocals).',
        preamp: 'Add +6 dB Preamp/Digital Trim so Keys 1 matches Keys 2 gain structure',
        gate: 'Gate OFF',
        comp: 'Threshold: -22 dB • Ratio: 2.5:1 • Attack: 25 ms • Release: 150 ms',
        stageTip: 'Remind Keys 1 player to ease off heavy left-hand C2–C3 doubling when Bass Guitar is playing.',
        hpf: 120, problemFreq: 312, problemGain: 8.0,
        eq: [
          { freq: 180, q: 1.8, gain: -3.5, desc: 'Clear left-hand low-mid chord thickness' },
          { freq: 315, q: 2.2, gain: -6.0, desc: 'Carve 312 Hz pad mud colliding with BV 1' },
          { freq: 580, q: 2.0, gain: -3.5, desc: 'Open pocket for Lead Vocal chest & warmth' },
          { freq: 4500, q: 1.0, gain: 3.5, desc: 'Restore piano hammer clarity & air' }
        ]
      },
      keys2: {
        id: 'keys2', name: 'Keys 2 (Aux Synth / Brass / Bells) — Ch 09', shortName: 'Keys 2 (Aux)',
        snakeCh: 'Snake In 9 → 32SX Ch 9 (Pan R45)',
        peak: '-0.14 dBFS', peakNum: -0.14, rms: '-19.88 dBFS', rmsNum: -19.88,
        gatePct: '0.0%', domFreq: '463.0 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: false,
        bands7: 'Sub 1.0% | Low 3.5% | Low-Mid 14.6% | Box 47.4% | Mid 24.6% | Upper 8.7% | Air 0.2%',
        forensicSummary: 'Peaked at -0.14 dBFS (+10.01 dB hotter than Keys 1), with 72.0% of energy in 350–2,000 Hz stepping on vocals.',
        preamp: 'Pad/Reduce Preamp Gain by -8 dB immediately (engage -20 dB switch on DI box)',
        gate: 'Gate OFF',
        comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 10 ms • Release: 120 ms',
        stageTip: 'Have Keys 2 normalize patch volumes on their keyboard during line check.',
        hpf: 140, problemFreq: 463, problemGain: 7.5,
        eq: [
          { freq: 280, q: 1.8, gain: -3.0, desc: 'Trim lower synth body' },
          { freq: 465, q: 2.4, gain: -5.5, desc: 'Cut dominant 463 Hz boxy synth horn buildup' },
          { freq: 1250, q: 2.0, gain: -4.0, desc: 'Carve vocal presence pocket for LV & BV3' },
          { freq: 7500, q: 0.8, gain: 2.0, desc: 'Smooth top shimmer' }
        ]
      },
      guitar: {
        id: 'guitar', name: 'Electric Guitar — Ch 10', shortName: 'Electric Guitar',
        snakeCh: 'Snake In 10 → 32SX Ch 10 (Pan R35)',
        peak: '-16.93 dBFS', peakNum: -16.93, rms: '-28.10 dBFS', rmsNum: -28.10,
        gatePct: '9.5%', domFreq: '2,508.6 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: false,
        bands7: 'Sub 0.0% | Low 0.0% | Low-Mid 1.1% | Box 1.2% | Mid 2.5% | Upper 94.9% | Air 0.3%',
        forensicSummary: '94.9% of energy concentrated inside 2–5 kHz (2,508.6 Hz spike), fighting Lead Vocal consonant intelligibility.',
        preamp: 'Add +4 dB Preamp Trim (Peak -16.93 dBFS) • Polarity: Normal (0°)',
        gate: 'Expander Threshold: -48 dB',
        comp: 'Threshold: -21 dB • Ratio: 3:1 • Attack: 18 ms • Release: 100 ms',
        stageTip: 'Move amp mic 3 cm off-center from speaker dust cap toward cone edge to warm 250–500 Hz and tame 2.5 kHz.',
        hpf: 110, problemFreq: 2509, problemGain: 11.0,
        eq: [
          { freq: 320, q: 1.4, gain: 4.5, desc: 'Restore missing lower-mid guitar body' },
          { freq: 1100, q: 1.6, gain: 2.0, desc: 'Support musical midrange note weight' },
          { freq: 2510, q: 3.5, gain: -7.5, desc: 'Surgical notch on 2,508.6 Hz ice-pick spike' },
          { freq: 6500, q: 1.2, gain: -4.0, desc: 'Smooth harsh digital fizz above 6 kHz' }
        ]
      },
      bv1: {
        id: 'bv1', name: 'Backing Vocal 1 (Soprano/Alto) — Ch 14', shortName: 'BV 1 (Sop/Alto)',
        snakeCh: 'Snake In 14 → 32SX Ch 14 → BV DCA',
        peak: '-4.43 dBFS', peakNum: -4.43, rms: '-20.08 dBFS', rmsNum: -20.08,
        gatePct: '4.0%', domFreq: '312.2 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: true,
        bands7: 'Sub 0.6% | Low 1.6% | Low-Mid 38.3% | Box 28.9% | Mid 17.7% | Upper 12.6% | Air 0.2%',
        forensicSummary: 'Gate was closed only 4.0% of the time—standing wide open 96.0% of the service flooding the mix with 312.2 Hz stage wash.',
        preamp: 'Trim: -2 dB (Peak -4.43 dBFS) • Colour Code: BLUE Tape',
        gate: 'Expander 3:1 • Threshold: -36 dB • Key Filter: 250 Hz – 4 kHz • Release: 250 ms',
        comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 10 ms • Release: 100 ms',
        stageTip: 'Assign Ch 14, 15, 16, 17 to a single BV DCA fader so you can pull all BVs down -10 dB during spoken prayer.',
        hpf: 135, problemFreq: 312, problemGain: 7.5,
        eq: [
          { freq: 312, q: 2.5, gain: -5.5, desc: 'Cut 312.2 Hz stage wash & proximity mud' },
          { freq: 620, q: 2.2, gain: -3.5, desc: 'Clean boxy honk' },
          { freq: 2800, q: 1.8, gain: -2.0, desc: 'Tuck slightly behind Lead Vocal presence pocket' },
          { freq: 7500, q: 0.8, gain: 2.5, desc: 'Soft harmonic blend air' }
        ]
      },
      bv3: {
        id: 'bv3', name: 'Backing Vocal 3 (Tenor) — Ch 15', shortName: 'BV 3 (Tenor)',
        snakeCh: 'Snake In 15 → 32SX Ch 15 → BV DCA',
        peak: '-11.92 dBFS', peakNum: -11.92, rms: '-28.33 dBFS', rmsNum: -28.33,
        gatePct: '9.1%', domFreq: '699.8 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.5% | Low 1.2% | Low-Mid 8.2% | Box 45.6% | Mid 36.2% | Upper 7.0% | Air 1.2%',
        forensicSummary: '8.25 dB quieter than BV 1 (-28.33 dBFS Active RMS), with 81.8% of energy in 350–2,000 Hz (699.8 Hz throat resonance).',
        preamp: 'Add +6 dB Preamp Gain to match BV 1 level • Colour Code: YELLOW Tape',
        gate: 'Expander 3:1 • Threshold: -38 dB • Release: 250 ms',
        comp: 'Threshold: -22 dB • Ratio: 4:1 • Attack: 12 ms • Release: 110 ms • Makeup: +3.5 dB',
        stageTip: 'Coach Tenor (BV 3) to stay within 2–3 fingers of the grille and match preamp gain during line check.',
        hpf: 130, problemFreq: 700, problemGain: 7.0,
        eq: [
          { freq: 240, q: 1.5, gain: 2.0, desc: 'Support Tenor lower chest note weight' },
          { freq: 700, q: 2.6, gain: -5.5, desc: 'Cut dominant 699.8 Hz boxy/nasal throat resonance' },
          { freq: 1400, q: 2.0, gain: -3.0, desc: 'Prevent Tenor from masking Lead Vocal @ 1–2 kHz' },
          { freq: 7000, q: 0.8, gain: 2.5, desc: 'Blend top air with BV 1' }
        ]
      },
      ch02: {
        id: 'ch02', chNum: 2, defaultSnakePort: 23, category: 'DRUMS',
        name: 'Kick Sub / Out Mic — Ch 02', shortName: 'Kick Out (Ch 02)',
        snakeCh: 'Snake Port 2 DEAD → Plug into Snake Port 23 → Soft-Patch to 32SX Ch 2',
        peak: '-8.20 dBFS', peakNum: -8.20, rms: '-24.10 dBFS', rmsNum: -24.10,
        gatePct: '65.0%', domFreq: '54.0 Hz', phase: '0° Aligned with Kick In', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 68.0% | Low 25.0% | Low-Mid 4.0% | Box 1.0% | Mid 1.0% | Upper 0.5% | Air 0.5%',
        forensicSummary: 'Because AudioLink Port 2 is dead on the stagebox, plug the outer kick sub mic into Port 23 and soft-patch Analog 23 → Ch 2.',
        preamp: 'Trim: -4 dB • Soft-Patch Input Source: Analog 23 (Skips Dead Port 2) • Polarity: 0°',
        gate: 'Gate Threshold: -28 dB • Key Filter: 60 Hz • Release: 140 ms',
        comp: 'FET Compressor • Ratio: 4:1 • Attack: 20 ms • Release: 70 ms',
        stageTip: 'Place outer dynamic/sub-kick mic at resonant head port rim; skip dead Stagebox Port 2 and patch via Port 23.',
        hpf: 30, problemFreq: 180, problemGain: 6.0,
        eq: [
          { freq: 52, q: 1.5, gain: 4.5, desc: 'Deep 52 Hz sub weight' },
          { freq: 160, q: 2.2, gain: -6.0, desc: 'Remove resonant head boom' },
          { freq: 400, q: 1.8, gain: -4.5, desc: 'Scoop outer shell boxiness' },
          { freq: 2500, q: 1.2, gain: -3.0, desc: 'Let Ch 1 Kick In own beater click' }
        ]
      },
      ch05: {
        id: 'ch05', chNum: 5, defaultSnakePort: 24, category: 'DRUMS',
        name: '3rd Rack Tom / Timbale — Ch 05', shortName: '3rd Tom (Ch 05)',
        snakeCh: 'Snake Port 5 DEAD → Plug into Snake Port 24 → Soft-Patch to 32SX Ch 5',
        peak: '-9.40 dBFS', peakNum: -9.40, rms: '-33.90 dBFS', rmsNum: -33.90,
        gatePct: '78.0%', domFreq: '118.0 Hz', phase: '+0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 1.2% | Low 38.0% | Low-Mid 32.0% | Box 10.0% | Mid 5.0% | Upper 8.0% | Air 5.8%',
        forensicSummary: 'AudioLink Port 5 is dead; route 3rd Rack Tom via Stagebox Port 24 and assign Analog 24 to Ch 5 in Digital Patching.',
        preamp: 'Digital Patching: Input Source = Analog 24 (Skips Dead Port 5) • Polarity: 0°',
        gate: 'Gate Threshold: -26 dB • Key Filter: 120 Hz (Q 2.8) • Range: -40 dB',
        comp: 'Standard Comp • Ratio: 4:1 • Attack: 22 ms • Release: 130 ms',
        stageTip: 'Never plug into dead Snake Port 5; run short XLR jumper to Port 24 on stagebox.',
        hpf: 70, problemFreq: 340, problemGain: 5.5,
        eq: [
          { freq: 118, q: 1.5, gain: 4.0, desc: 'Low rack tom fundamental punch' },
          { freq: 340, q: 2.4, gain: -6.0, desc: 'Cut tubby mid-ring' },
          { freq: 800, q: 1.8, gain: -2.5, desc: 'Clean sustain overhang' },
          { freq: 4400, q: 1.4, gain: 4.0, desc: 'Stick attack snap' }
        ]
      },
      ch11: {
        id: 'ch11', chNum: 11, defaultSnakePort: 11, category: 'DRUMS',
        name: 'Snare Drum Top — Ch 11', shortName: 'Snare Top (Ch 11)',
        snakeCh: 'Snake In 11 → 32SX Ch 11 → Drums Bus + Plate Reverb',
        peak: '-4.20 dBFS', peakNum: -4.20, rms: '-21.50 dBFS', rmsNum: -21.50,
        gatePct: '52.0%', domFreq: '185.0 Hz', phase: '0° Reference', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 0.2% | Low 18.0% | Low-Mid 34.0% | Box 16.0% | Mid 12.0% | Upper 14.0% | Air 5.8%',
        forensicSummary: 'PreSonus 32SX Snare Blueprint: HPF at 100 Hz, Standard Compressor (20ms attack), Vintage EQ, and Plate Reverb.',
        preamp: 'Trim: 0 dB (Target -6 dBFS peak on rimshots) • Polarity: Normal (0°)',
        gate: 'Expander 2:1 • Threshold: -34 dB • Key Filter: 190 Hz • Range: -8 dB (preserves ghost notes)',
        comp: 'Standard Compressor • Ratio: 3.5:1 • Attack: 20 ms (lets transient crack through) • Release: 80 ms',
        stageTip: 'Angle SM57 toward center dot with null aimed at Hi-Hat; send -8 dB to FX B Plate Reverb (1.2s decay, 15ms pre-delay).',
        hpf: 100, problemFreq: 520, problemGain: 5.5,
        eq: [
          { freq: 185, q: 1.4, gain: 3.0, desc: 'Fat snare body & chest weight (Vintage EQ)' },
          { freq: 520, q: 2.4, gain: -4.0, desc: 'Cut boxy ring overhang' },
          { freq: 1100, q: 2.0, gain: -2.0, desc: 'Clear vocal pocket' },
          { freq: 4500, q: 1.2, gain: 3.5, desc: 'Crisp rimshot crack & wire snap' }
        ]
      },
      ch12: {
        id: 'ch12', chNum: 12, defaultSnakePort: 12, category: 'DRUMS',
        name: 'Hi-Hat / Overhead Left — Ch 12', shortName: 'Hi-Hat / OH L (Ch 12)',
        snakeCh: 'Snake In 12 (+48V) → 32SX Ch 12 (Pan L35)',
        peak: '-12.40 dBFS', peakNum: -12.40, rms: '-28.90 dBFS', rmsNum: -28.90,
        gatePct: '0.0%', domFreq: '6,800 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 0.0% | Low 0.5% | Low-Mid 2.5% | Box 8.0% | Mid 14.0% | Upper 38.0% | Air 37.0%',
        forensicSummary: 'High-pass aggressively at 350 Hz so low-end drum wash never muddies the kit.',
        preamp: 'Engage +48V Phantom Power • Pad -10 dB if condenser clips • Pan: L35',
        gate: 'Gate OFF (HPF @ 350 Hz acts as frequency gate)',
        comp: 'Standard Comp • Ratio: 2.5:1 • Attack: 10 ms • Release: 90 ms',
        stageTip: 'Aim condenser away from snare shell to minimize snare bleed.',
        hpf: 350, problemFreq: 850, problemGain: 4.5,
        eq: [
          { freq: 420, q: 1.8, gain: -3.5, desc: 'Reject tom & snare body bleed' },
          { freq: 850, q: 2.2, gain: -3.0, desc: 'Remove metallic bronze gong tone' },
          { freq: 3200, q: 2.0, gain: -2.5, desc: 'Prevent harsh ear bite in Great Hall' },
          { freq: 11000, q: 0.7, gain: 2.5, desc: 'Silky top cymbal shimmer' }
        ]
      },
      ch15: {
        id: 'ch15', chNum: 15, defaultSnakePort: 15, category: 'VOCALS',
        name: 'Backing Vocal 2 (Alto) — Ch 15', shortName: 'BV 2 Alto (Ch 15)',
        snakeCh: 'Snake In 15 → 32SX Ch 15 (GREEN Tape) → BV DCA',
        peak: '-7.80 dBFS', peakNum: -7.80, rms: '-22.40 dBFS', rmsNum: -22.40,
        gatePct: '18.5%', domFreq: '340.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.2% | Low 1.1% | Low-Mid 28.0% | Box 34.0% | Mid 24.0% | Upper 11.5% | Air 1.2%',
        forensicSummary: 'Core Alto harmony channel; mark mic with GREEN electrical tape and route to BV Subgroup/DCA.',
        preamp: 'Trim: 0 dB • Colour Code: GREEN Tape • Pan: R25',
        gate: 'Expander 3:1 • Threshold: -36 dB • Release: 250 ms',
        comp: 'Tube Compressor • Threshold: -20 dB • Ratio: 3.5:1 • GR: 3–4 dB',
        stageTip: 'Verify GREEN tape mic during 15-sec pre-service scratch test.',
        hpf: 130, problemFreq: 340, problemGain: 6.5,
        eq: [
          { freq: 210, q: 1.4, gain: -1.5, desc: 'Keep alto chest lean' },
          { freq: 340, q: 2.4, gain: -4.5, desc: 'Cut lower-mid ensemble mud' },
          { freq: 2900, q: 1.8, gain: -2.0, desc: 'Sit behind Lead Vocal pocket' },
          { freq: 9500, q: 0.8, gain: 2.0, desc: 'Smooth choir air blend' }
        ]
      },
      ch18: {
        id: 'ch18', chNum: 18, defaultSnakePort: 18, category: 'SPEECH',
        name: 'Physical Fader 18 — [BROKEN FADER MOTOR BYPASS]', shortName: 'Ch 18 [BYPASS]',
        snakeCh: '32SX Physical Fader 18 is Faulty → Soft-Patch Snake Port 18 to Ch 22!',
        peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
        gatePct: '100.0%', domFreq: 'N/A (Bypassed)', phase: 'Bypassed', severity: 'CRITICAL', isVocal: false,
        bands7: 'Hardware Advisory: Physical Fader 18 motor is faulty on 32SX console.',
        forensicSummary: 'CRITICAL HARDWARE RULE: Stagebox Port 18 works fine, but 32SX Physical Channel 18 fader is faulty. Route Snake Port 18 to Console Ch 22 via Digital Patching.',
        preamp: 'MUTE & LEAVE CH 18 UNASSIGNED • Route Stagebox Port 18 → Console Ch 22',
        gate: 'Channel Muted (Hardware Fader Bypass)',
        comp: 'Bypassed — Use Ch 22 Rescue Strip instead',
        stageTip: 'If you plug an instrument into Stagebox Port 18, go to HOME → Input → Digital Patching and assign Analog 18 to Channel 22.',
        hpf: 120, problemFreq: 500, problemGain: 0.0,
        eq: [
          { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 18 Fader Bypassed' },
          { freq: 500, q: 1.0, gain: 0.0, desc: 'Use Channel 22 for Port 18 sources' },
          { freq: 2000, q: 1.0, gain: 0.0, desc: 'Prevents fader jump mid-service' },
          { freq: 8000, q: 1.0, gain: 0.0, desc: 'Marked in Stagebox Guard' }
        ]
      },
      ch19: {
        id: 'ch19', chNum: 19, defaultSnakePort: 25, category: 'SPEECH',
        name: 'Pastor Wireless Headset / Lapel — Ch 19', shortName: 'Pastor Mic (Ch 19)',
        snakeCh: 'Snake Port 19 DEAD → Plug into Snake Port 25 (or Local In 19) → 32SX Ch 19',
        peak: '-8.50 dBFS', peakNum: -8.50, rms: '-20.10 dBFS', rmsNum: -20.10,
        gatePct: '22.0%', domFreq: '260.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.0% | Low 0.5% | Low-Mid 22.0% | Box 31.0% | Mid 32.0% | Upper 13.0% | Air 1.5%',
        forensicSummary: 'AudioLink Port 19 is dead on stagebox; plug wireless receiver into Snake Port 25 (or local FOH rack) and soft-patch to Ch 19.',
        preamp: 'Digital Patching: Input Source = Analog 25 (Skips Dead Port 19) • Dedicated DCA 8',
        gate: 'Expander 2:1 • Threshold: -45 dB • Gentle release 300 ms (never chop sermon breath)',
        comp: 'Standard Comp • Ratio: 3:1 • Threshold: -22 dB • Attack: 10 ms • Release: 90 ms',
        stageTip: 'Keep Pastor channel 100% dry (Zero FX sends) for maximum sermon intelligibility in Great Hall.',
        hpf: 125, problemFreq: 315, problemGain: 6.0,
        eq: [
          { freq: 190, q: 1.6, gain: -2.5, desc: 'Control chest proximity boom' },
          { freq: 315, q: 2.8, gain: -4.5, desc: 'Ring out primary Great Hall feedback node' },
          { freq: 2500, q: 2.2, gain: -2.0, desc: 'Prevent PA horn harshness on loud preaching' },
          { freq: 6500, q: 1.0, gain: 2.0, desc: 'Crisp consonant diction' }
        ]
      },
      ch20: {
        id: 'ch20', chNum: 20, defaultSnakePort: 26, category: 'SPEECH',
        name: 'Pulpit / Lectern Gooseneck Mic — Ch 20', shortName: 'Pulpit Mic (Ch 20)',
        snakeCh: 'Snake Port 20 DEAD → Plug into Snake Port 26 → Soft-Patch to 32SX Ch 20',
        peak: '-10.20 dBFS', peakNum: -10.20, rms: '-23.40 dBFS', rmsNum: -23.40,
        gatePct: '30.0%', domFreq: '380.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.0% | Low 0.2% | Low-Mid 25.0% | Box 38.0% | Mid 26.0% | Upper 10.0% | Air 0.8%',
        forensicSummary: 'AudioLink Port 20 is dead; patch lectern gooseneck mic into Snake Port 26 and soft-patch Analog 26 → Ch 20.',
        preamp: 'Engage +48V Phantom Power • Input Source = Analog 26 (Skips Dead Port 20)',
        gate: 'Expander 2:1 • Threshold: -46 dB',
        comp: 'Standard Comp • Ratio: 3.5:1 • Attack: 12 ms • Release: 100 ms',
        stageTip: 'Notch lectern boundary reflections at 380 Hz and keep HPF at 135 Hz to block podium thumps.',
        hpf: 135, problemFreq: 380, problemGain: 6.5,
        eq: [
          { freq: 220, q: 1.8, gain: -3.0, desc: 'Reject lectern wood thump' },
          { freq: 380, q: 2.5, gain: -5.0, desc: 'Cut hollow gooseneck resonance' },
          { freq: 1800, q: 2.0, gain: -2.0, desc: 'Prevent feedback ring' },
          { freq: 5500, q: 1.2, gain: 2.5, desc: 'Clear speech articulation' }
        ]
      },
      ch21: {
        id: 'ch21', chNum: 21, defaultSnakePort: 27, category: 'SPEECH',
        name: 'MC / Announcements Handheld — Ch 21', shortName: 'MC Mic (Ch 21)',
        snakeCh: 'Snake Port 21 DEAD → Plug into Snake Port 27 → Soft-Patch to 32SX Ch 21',
        peak: '-9.10 dBFS', peakNum: -9.10, rms: '-21.80 dBFS', rmsNum: -21.80,
        gatePct: '25.0%', domFreq: '290.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.0% | Low 0.8% | Low-Mid 24.0% | Box 32.0% | Mid 29.0% | Upper 13.0% | Air 1.2%',
        forensicSummary: 'AudioLink Port 21 is dead; route MC handheld mic via Snake Port 27 and soft-patch Analog 27 → Ch 21.',
        preamp: 'Digital Patching: Input Source = Analog 27 (Skips Dead Port 21) • White/Silver Tape',
        gate: 'Expander 2:1 • Threshold: -42 dB',
        comp: 'Standard Comp • Ratio: 3.5:1 • Attack: 12 ms • Release: 90 ms',
        stageTip: 'Assign MC Mic to Speech Group with zero reverb sends.',
        hpf: 120, problemFreq: 290, problemGain: 5.5,
        eq: [
          { freq: 180, q: 1.5, gain: -2.0, desc: 'Trim proximity boom' },
          { freq: 290, q: 2.4, gain: -4.0, desc: 'Clean lower-mid mud' },
          { freq: 2800, q: 1.6, gain: 1.5, desc: 'Forward spoken presence' },
          { freq: 8000, q: 0.8, gain: 2.0, desc: 'Natural top air' }
        ]
      },
      ch22: {
        id: 'ch22', chNum: 22, defaultSnakePort: 18, category: 'BAND',
        name: 'Saxophone / Brass & Ch 18 Rescue — Ch 22', shortName: 'Sax / Horn (Ch 22)',
        snakeCh: 'Snake In 18 or 22 → 32SX Ch 22 (Pan L35)',
        peak: '-7.50 dBFS', peakNum: -7.50, rms: '-20.90 dBFS', rmsNum: -20.90,
        gatePct: '35.0%', domFreq: '2,250 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 0.0% | Low 1.0% | Low-Mid 16.0% | Box 28.0% | Mid 36.0% | Upper 17.0% | Air 2.0%',
        forensicSummary: 'Acts as the healthy fader strip for Saxophone/Brass (or any source plugged into Stagebox Port 18).',
        preamp: 'Trim: -2 dB on fortissimo horn blasts • Pan: L35 (opposite Electric Guitar R35)',
        gate: 'Expander 2:1 • Threshold: -40 dB (reduces drum bleed into bell mic)',
        comp: 'Tube Compressor • Ratio: 4:1 • GR: 4–6 dB on high register solos',
        stageTip: 'Cut 2.25 kHz reed bite so Saxophone solos soar smoothly without piercing ears.',
        hpf: 130, problemFreq: 2250, problemGain: 7.0,
        eq: [
          { freq: 220, q: 1.4, gain: 2.0, desc: 'Warm brass body' },
          { freq: 560, q: 2.2, gain: -3.0, desc: 'Reduce horn honk' },
          { freq: 2250, q: 2.8, gain: -4.5, desc: 'Tame piercing reed bite' },
          { freq: 9000, q: 0.8, gain: 1.5, desc: 'Breath air' }
        ]
      },
      ch23: {
        id: 'ch23', chNum: 23, defaultSnakePort: 22, category: 'BAND',
        name: 'Acoustic Guitar DI — Ch 23', shortName: 'Acoustic Gtr (Ch 23)',
        snakeCh: 'Snake In 22 → 32SX Ch 23 (Pan L30)',
        peak: '-11.20 dBFS', peakNum: -11.20, rms: '-25.60 dBFS', rmsNum: -25.60,
        gatePct: '15.0%', domFreq: '215.0 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 0.1% | Low 8.0% | Low-Mid 34.0% | Box 22.0% | Mid 16.0% | Upper 12.0% | Air 7.9%',
        forensicSummary: 'Piezo acoustic pickups boom around 200–230 Hz and click harshly at 2.5–4 kHz.',
        preamp: 'Active DI Box • Trim: +2 dB • Pan: L30',
        gate: 'Expander Threshold: -48 dB',
        comp: 'Tube Compressor • Ratio: 3:1 • Attack: 15 ms • Release: 90 ms',
        stageTip: 'Notch body feedback resonance around 215 Hz for clean strumming.',
        hpf: 110, problemFreq: 215, problemGain: 6.0,
        eq: [
          { freq: 215, q: 2.6, gain: -5.0, desc: 'Cut acoustic body boom & feedback node' },
          { freq: 480, q: 2.0, gain: -3.0, desc: 'Clean boxy piezo midrange' },
          { freq: 3100, q: 2.2, gain: -2.5, desc: 'Soften plastic piezo quack' },
          { freq: 10000, q: 0.7, gain: 3.5, desc: 'Sparkling bronze string air' }
        ]
      },
      ch24: {
        id: 'ch24', chNum: 24, defaultSnakePort: 28, category: 'VOCALS',
        name: 'Backing Vocal 5 (Choir Soprano 2) — Ch 24', shortName: 'BV 5 Sop 2 (Ch 24)',
        snakeCh: 'Snake In 28 → 32SX Ch 24 → BV Subgroup',
        peak: '-8.40 dBFS', peakNum: -8.40, rms: '-23.10 dBFS', rmsNum: -23.10,
        gatePct: '20.0%', domFreq: '330.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.1% | Low 1.0% | Low-Mid 26.0% | Box 33.0% | Mid 25.0% | Upper 13.0% | Air 1.9%',
        forensicSummary: 'Expanded choir Soprano 2 channel for large Sunday services and revivals.',
        preamp: 'Trim: 0 dB • Pan: L40 • Route to BV Subgroup & DCA 2',
        gate: 'Expander 3:1 • Threshold: -36 dB • Release: 250 ms',
        comp: 'Tube Compressor • Ratio: 3.5:1 • GR: 3 dB',
        stageTip: 'Pan L40 wider than BV 1 (L25) to create a wide stereo choir wall.',
        hpf: 140, problemFreq: 330, problemGain: 6.0,
        eq: [
          { freq: 220, q: 1.5, gain: -2.0, desc: 'Keep choir low end lean' },
          { freq: 330, q: 2.4, gain: -4.5, desc: 'Cut cumulative mud' },
          { freq: 3000, q: 1.8, gain: -2.5, desc: 'Carve center Lead Vocal space' },
          { freq: 10500, q: 0.8, gain: 2.5, desc: 'Soprano air halo' }
        ]
      },
      ch25: {
        id: 'ch25', chNum: 25, defaultSnakePort: 29, category: 'VOCALS',
        name: 'Backing Vocal 6 (Choir Alto 2) — Ch 25', shortName: 'BV 6 Alto 2 (Ch 25)',
        snakeCh: 'Snake In 29 → 32SX Ch 25 → BV Subgroup',
        peak: '-8.90 dBFS', peakNum: -8.90, rms: '-23.80 dBFS', rmsNum: -23.80,
        gatePct: '21.0%', domFreq: '350.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.1% | Low 1.2% | Low-Mid 28.0% | Box 35.0% | Mid 23.0% | Upper 11.5% | Air 1.2%',
        forensicSummary: 'Expanded choir Alto 2 channel for full ensemble vocal arrangements.',
        preamp: 'Trim: 0 dB • Pan: R40 • Route to BV Subgroup & DCA 2',
        gate: 'Expander 3:1 • Threshold: -36 dB • Release: 250 ms',
        comp: 'Tube Compressor • Ratio: 3.5:1 • GR: 3 dB',
        stageTip: 'Pan R40 opposite BV 5 (L40) for balanced stereo choir imaging.',
        hpf: 135, problemFreq: 350, problemGain: 6.0,
        eq: [
          { freq: 210, q: 1.5, gain: -2.0, desc: 'Control chest buildup' },
          { freq: 350, q: 2.4, gain: -4.5, desc: 'Clean lower-mid wooliness' },
          { freq: 2800, q: 1.8, gain: -2.0, desc: 'Blend behind Lead Vocal' },
          { freq: 9500, q: 0.8, gain: 2.0, desc: 'Top sheen' }
        ]
      },
      ch26: {
        id: 'ch26', chNum: 26, defaultSnakePort: 31, category: 'VOCALS',
        name: 'Backing Vocal 7 (Choir Tenor 2) — Ch 26', shortName: 'BV 7 Tenor 2 (Ch 26)',
        snakeCh: 'Snake In 31 (Skips Dead Port 30) → 32SX Ch 26 → BV Subgroup',
        peak: '-9.50 dBFS', peakNum: -9.50, rms: '-24.20 dBFS', rmsNum: -24.20,
        gatePct: '19.0%', domFreq: '650.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
        bands7: 'Sub 0.2% | Low 1.5% | Low-Mid 22.0% | Box 40.0% | Mid 26.0% | Upper 9.0% | Air 1.3%',
        forensicSummary: 'AudioLink Port 30 is dead; plug BV 7 Tenor 2 into Stagebox Port 31 and soft-patch Analog 31 → Ch 26.',
        preamp: 'Input Source = Analog 31 (Skips Dead Port 30) • Pan: L18',
        gate: 'Expander 3:1 • Threshold: -37 dB • Release: 250 ms',
        comp: 'Tube Compressor • Ratio: 4:1 • GR: 3.5 dB',
        stageTip: 'Locks with BV 3 Tenor (R18) to create a wide tenor harmony bed.',
        hpf: 130, problemFreq: 650, problemGain: 6.5,
        eq: [
          { freq: 230, q: 1.4, gain: 1.5, desc: 'Tenor warmth' },
          { freq: 650, q: 2.5, gain: -5.0, desc: 'Cut nasal throat honk' },
          { freq: 1500, q: 2.0, gain: -2.5, desc: 'Unmask Lead Vocal' },
          { freq: 8000, q: 0.8, gain: 2.0, desc: 'Air blend' }
        ]
      },
      ch27: {
        id: 'ch27', chNum: 27, defaultSnakePort: null, category: 'DRUMS',
        name: 'Talking Drum / Congas / Perc — Ch 27', shortName: 'Talking Drum (Ch 27)',
        snakeCh: 'Local Console Input 27 (or Spare Snake Port) → 32SX Ch 27',
        peak: '-6.80 dBFS', peakNum: -6.80, rms: '-23.50 dBFS', rmsNum: -23.50,
        gatePct: '58.0%', domFreq: '145.0 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 1.0% | Low 32.0% | Low-Mid 38.0% | Box 14.0% | Mid 8.0% | Upper 5.0% | Air 2.0%',
        forensicSummary: 'Pitch-bending African talking drum and congas require clean 120–220 Hz articulation without muddying the Bass guitar.',
        preamp: 'Trim: 0 dB • Pan: R30 • High headroom for pitch bends',
        gate: 'Expander 2:1 • Threshold: -36 dB • Release: 220 ms (lets pitch bend decay naturally)',
        comp: 'FET Compressor • Ratio: 3.5:1 • Attack: 22 ms • Release: 90 ms',
        stageTip: 'Use a gentle expander rather than a hard gate so talking drum pitch glides are never cut off.',
        hpf: 75, problemFreq: 360, problemGain: 5.5,
        eq: [
          { freq: 145, q: 1.4, gain: 3.0, desc: 'Warm talking drum pitch sweep body' },
          { freq: 360, q: 2.4, gain: -4.5, desc: 'Cut hollow shell boxiness' },
          { freq: 2800, q: 1.6, gain: 3.0, desc: 'Curved stick / hand slap articulation' },
          { freq: 7500, q: 1.0, gain: 1.0, desc: 'Natural skin air' }
        ]
      },
      ch28: {
        id: 'ch28', chNum: 28, defaultSnakePort: null, category: 'DRUMS',
        name: 'Snare Bottom (Wires) — Ch 28', shortName: 'Snare Btm (Ch 28)',
        snakeCh: 'Spare Snake Port / Local In 28 → 32SX Ch 28 (Ø INVERTED)',
        peak: '-8.10 dBFS', peakNum: -8.10, rms: '-26.40 dBFS', rmsNum: -26.40,
        gatePct: '60.0%', domFreq: '3,800 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
        bands7: 'Sub 0.0% | Low 4.0% | Low-Mid 14.0% | Box 18.0% | Mid 22.0% | Upper 30.0% | Air 12.0%',
        forensicSummary: 'Bottom snare mic faces opposite the top snare mic—MUST have Polarity Invert (Ø = ON) engaged.',
        preamp: 'ENGAGE POLARITY INVERT (Ø = ON) • Trim: -4 dB',
        gate: 'Fast Gate • Threshold: -28 dB • Key Filter: 200 Hz • Release: 100 ms',
        comp: 'FET Compressor • Ratio: 4:1 • Attack: 10 ms • Release: 70 ms',
        stageTip: 'Always flip Polarity (Ø) on Snare Bottom so it sums with Ch 11 Snare Top instead of canceling 185 Hz body.',
        hpf: 160, problemFreq: 450, problemGain: 5.0,
        eq: [
          { freq: 185, q: 1.8, gain: -4.0, desc: 'Let Snare Top own fundamental weight' },
          { freq: 450, q: 2.2, gain: -4.5, desc: 'Cut snare buzz ring' },
          { freq: 3800, q: 1.4, gain: 3.5, desc: 'Crisp snare wire snap' },
          { freq: 9500, q: 0.8, gain: 3.0, desc: 'Sizzle air' }
        ]
      },
      ch29: {
        id: 'ch29', chNum: 29, defaultSnakePort: null, category: 'DRUMS',
        name: 'Overhead Right Condenser — Ch 29', shortName: 'Overhead R (Ch 29)',
        snakeCh: 'Spare Snake Port (+48V) → 32SX Ch 29 (Pan R35)',
        peak: '-12.10 dBFS', peakNum: -12.10, rms: '-28.50 dBFS', rmsNum: -28.50,
        gatePct: '0.0%', domFreq: '7,200 Hz', phase: '0° Matched to Ch 12', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 0.0% | Low 0.5% | Low-Mid 2.5% | Box 8.0% | Mid 14.0% | Upper 38.0% | Air 37.0%',
        forensicSummary: 'Stereo partner to Ch 12 Overhead Left; measure equal distance from snare center so snare stays phase-locked.',
        preamp: 'Engage +48V Phantom Power • Pan: R35 (Mirrors Ch 12 L35)',
        gate: 'Gate OFF',
        comp: 'Standard Comp • Ratio: 2.5:1 • Attack: 10 ms • Release: 90 ms',
        stageTip: 'Use a mic cable or tape measure to keep OH Left and OH Right equidistant from the snare drum center.',
        hpf: 350, problemFreq: 850, problemGain: 4.5,
        eq: [
          { freq: 420, q: 1.8, gain: -3.5, desc: 'Clean floor tom rumble' },
          { freq: 850, q: 2.2, gain: -3.0, desc: 'Remove ride cymbal clang' },
          { freq: 3200, q: 2.0, gain: -2.5, desc: 'Smooth upper-mid bite' },
          { freq: 11000, q: 0.7, gain: 2.5, desc: 'Stereo cymbal air' }
        ]
      },
      ch30: {
        id: 'ch30', chNum: 30, defaultSnakePort: null, category: 'BAND',
        name: 'Synth Bass / Backing Track Left — Ch 30', shortName: 'Synth Bass (Ch 30)',
        snakeCh: 'Snake Port 30 DEAD → Use Local TRS/XLR In 30 or USB Return',
        peak: '-9.00 dBFS', peakNum: -9.00, rms: '-20.50 dBFS', rmsNum: -20.50,
        gatePct: '10.0%', domFreq: '68.0 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Sub 35.0% | Low 42.0% | Low-Mid 14.0% | Box 4.0% | Mid 3.0% | Upper 1.5% | Air 0.5%',
        forensicSummary: 'AudioLink Port 30 is dead on stagebox; connect auxiliary synth bass or USB track via local console input or USB interface.',
        preamp: 'Input Source = Local Analog 30 or USB 30 (Skips Dead Snake Port 30)',
        gate: 'Gate OFF',
        comp: 'Tube Compressor • Ratio: 4:1 • Pins sub-bass octave evenly',
        stageTip: 'Mute Bass Guitar DI (Ch 7) when keyboardist plays full key-bass on Ch 30 so two bass sources never clash.',
        hpf: 35, problemFreq: 220, problemGain: 5.0,
        eq: [
          { freq: 65, q: 1.4, gain: 2.5, desc: 'Deep synth sub foundation' },
          { freq: 220, q: 2.2, gain: -4.0, desc: 'Cut synth mud' },
          { freq: 900, q: 1.6, gain: 2.0, desc: 'Sawtooth harmonic definition' },
          { freq: 6000, q: 1.2, gain: -3.0, desc: 'Low-pass synth buzz' }
        ]
      },
      ch31: {
        id: 'ch31', chNum: 31, defaultSnakePort: null, category: 'SPEECH',
        name: 'Laptop / Media Playback Stereo DI — Ch 31', shortName: 'Playback DI (Ch 31)',
        snakeCh: 'Local RCA / Aux Input or Snake Port 31 → 32SX Ch 31',
        peak: '-6.00 dBFS', peakNum: -6.00, rms: '-16.50 dBFS', rmsNum: -16.50,
        gatePct: '0.0%', domFreq: '1,000 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
        bands7: 'Pre-mastered commercial playback track profile.',
        forensicSummary: 'Pre-mastered walk-in tracks and bumper audio already have heavy limiting; keep EQ gentle so PA is not fatigued.',
        preamp: 'Trim: -6 dB • Route via Local Aux/RCA or USB Playback',
        gate: 'Gate OFF',
        comp: 'Limiter Only (-3 dB threshold catch for sudden loud MP3s)',
        stageTip: 'Cut 2.5 kHz by -2 dB on walk-in music so people can converse comfortably before service.',
        hpf: 45, problemFreq: 2500, problemGain: 3.5,
        eq: [
          { freq: 65, q: 1.2, gain: 1.0, desc: 'Warm walk-in sub presence' },
          { freq: 300, q: 1.8, gain: -2.0, desc: 'Reduce hall boom' },
          { freq: 2500, q: 1.8, gain: -2.5, desc: 'Reduce ear fatigue on loud masters' },
          { freq: 10000, q: 0.8, gain: 1.0, desc: 'Smooth top end' }
        ]
      },
      ch32: {
        id: 'ch32', chNum: 32, defaultSnakePort: null, category: 'SPEECH',
        name: 'FOH Talkback / Crowd Room Mic — Ch 32', shortName: 'Talkback / Room (Ch 32)',
        snakeCh: 'Snake Port 32 DEAD → Plug directly into 32SX Rear Local Input 32',
        peak: '-10.00 dBFS', peakNum: -10.00, rms: '-22.00 dBFS', rmsNum: -22.00,
        gatePct: '40.0%', domFreq: '400.0 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: true,
        bands7: 'FOH Talkback to Stage Monitors or Ambient Room Capture for Multitrack.',
        forensicSummary: 'AudioLink Port 32 is dead on stagebox; plug FOH Talkback mic directly into Rear Local Input 32 at the console.',
        preamp: 'Input Source = Local Analog 32 (At FOH Console) • Unassign from Main L/R if used for Talkback!',
        gate: 'Expander Threshold: -40 dB',
        comp: 'Standard Comp • Ratio: 5:1 (Heavy leveling so stage crew hears every FOH instruction)',
        stageTip: 'CRITICAL: Uncheck Main L/R bus assignment on Talkback Ch 32 so FOH instructions only go to Stage Monitors (Mix 1/3/4)!',
        hpf: 150, problemFreq: 400, problemGain: 5.0,
        eq: [
          { freq: 200, q: 1.5, gain: -3.0, desc: 'Strip low rumble from stage wedges' },
          { freq: 400, q: 2.2, gain: -4.0, desc: 'Clear boxiness' },
          { freq: 2200, q: 1.5, gain: 3.0, desc: 'Cut through loud stage rehearsal' },
          { freq: 7000, q: 1.0, gain: -2.0, desc: 'Prevent wedge squeal' }
        ]
      },
      bv4: {
        id: 'bv4', name: 'Backing Vocal 4 (Aux Vocal) — Ch 17', shortName: 'BV 4 (Aux)',
        snakeCh: 'Snake In 17 → 32SX Ch 17 → BV DCA',
        peak: '-6.32 dBFS', peakNum: -6.32, rms: '-19.20 dBFS', rmsNum: -19.20,
        gatePct: '13.2%', domFreq: '786.0 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: true,
        bands7: 'Sub 0.0% | Low 0.0% | Low-Mid 0.2% | Box 26.8% | Mid 57.1% | Upper 15.0% | Air 0.9%',
        forensicSummary: 'Verify Ch 17 reads Analog Input 17 uniquely (no duplicate Capture tap) and keep PURPLE tape strictly on far BV stand.',
        preamp: 'Verify Digital Patching: Ch 17 Input Source = Analog 17 (Unique) • Colour Code: PURPLE Tape',
        gate: 'Expander 3:1 • Threshold: -38 dB • Release: 250 ms',
        comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 12 ms • Release: 110 ms',
        stageTip: 'Mark with PURPLE tape; if LV ever picks up Purple by mistake, execute 5-sec 32SX Digital Patching swap.',
        hpf: 135, problemFreq: 786, problemGain: 9.0,
        eq: [
          { freq: 240, q: 1.2, gain: 3.0, desc: 'Compensate weak low-mid capsule output' },
          { freq: 786, q: 3.0, gain: -5.5, desc: 'Tame 786.0 Hz capsule resonance spike' },
          { freq: 1300, q: 2.2, gain: -3.5, desc: 'Carve nasal upper-mids' },
          { freq: 7500, q: 0.8, gain: 2.5, desc: 'Add top-end air' }
        ]
      }
    };

    const BEFORE_AFTER_DATA = {
      lv: {
        title: 'Lead Vocal Restoration (Raw Capsule → Enhanced Master)',
        subtitle: 'Active Singing RMS lifted -19.20 → -14.26 dBFS | Variance tightened 3.61 → 2.40 dB | Bleed SNR +3.84 dB',
        bands: [
          { name: '80–250 Hz (Chest Warmth)', before: 0.2, after: 1.6, delta: '+9.09 dB' },
          { name: '250–500 Hz (Body & Weight)', before: 5.3, after: 31.6, delta: '+7.74 dB' },
          { name: '500–800 Hz (Boxy Honk)', before: 22.7, after: 9.4, delta: '-3.80 dB' },
          { name: '800–2,000 Hz (Nasal Spike)', before: 52.3, after: 23.7, delta: '-3.44 dB' },
          { name: '2,000–5,000 Hz (Presence)', before: 18.2, after: 27.7, delta: '+1.82 dB' },
          { name: '5,000–15,000 Hz (Silk Air)', before: 1.3, after: 5.9, delta: '+6.65 dB' }
        ]
      },
      kick: {
        title: 'Kick Drum Restoration (Clipped Raw → Enhanced Master)',
        subtitle: '64 Preamp Clips Repaired (-1.00 dBFS True Peak) | Bass Bleed Suppressed by -20.36 dB',
        bands: [
          { name: '40–75 Hz (Deep Sub Thump)', before: 31.3, after: 71.6, delta: '+3.60 dB' },
          { name: '75–125 Hz (96.9 Hz Knock)', before: 45.0, after: 9.9, delta: '-6.59 dB' },
          { name: '125–220 Hz (Upper-Bass Mud)', before: 11.8, after: 1.3, delta: '-9.72 dB' },
          { name: '220–500 Hz (Boxy Shell)', before: 1.8, after: 0.2, delta: '-8.62 dB' },
          { name: '2,000–6,000 Hz (Beater Click)', before: 2.2, after: 10.6, delta: '+6.92 dB' }
        ]
      }
    };

    const CHECKLIST_PHASES = [
      {
        phase: 'Power, DX2496 & Amplifier Protection',
        items: [
          { id: 'p1_1', text: 'Verify Behringer DX2496 Sub HPF @ 38 Hz (LR24) & Sub/Top Crossover @ 90 Hz (LR24) before powering Vatasa IDOL 13.', sdu: true },
          { id: 'p1_2', text: 'Confirm Vatasa IDOL 13 (2×1300W) input attenuators are matched at -3 dB (~1000W ceiling) to protect VS-215P tops.', sdu: false },
          { id: 'p1_3', text: 'Confirm AudioLink 32×8 dead snake ports (2, 5, 19, 20, 21, 30, 32) are taped over with red X marks on stage.', sdu: true }
        ]
      },
      {
        phase: 'Stage Mic Color-Tape & 15-Sec Scratch Check',
        items: [
          { id: 'p2_1', text: 'Inspect physical color tape on vocal mics: RED = LV (Ch 13), BLUE = BV1 (Ch 14), GREEN = BV2 (Ch 15), YELLOW = BV3 (Ch 16), PURPLE = BV4 (Ch 17).', sdu: true },
          { id: 'p2_2', text: 'Run 15-Second Individual Scratch Test: Have LV and each BV scratch their grille one by one while verifying unique 32SX meters.', sdu: true },
          { id: 'p2_3', text: 'Open 32SX HOME → Input → Digital Patching and verify every channel maps 1-to-1 to its unique Analog/Stagebox input.', sdu: true }
        ]
      },
      {
        phase: 'Drum Kit Gain, Polarity (Ø) & Key-Filtered Gates',
        items: [
          { id: 'p3_1', text: 'Pad Kick (Ch 1) preamp by -6 dB so hardest double-stomp peaks at -6 dBFS (prevents digital clipping).', sdu: true },
          { id: 'p3_2', text: 'Engage Polarity Invert (Ø = ON) on 1st Tom (Ch 3), Floor Tom (Ch 6), and Bass DI (Ch 7) to align phase with Kick.', sdu: true },
          { id: 'p3_3', text: 'Turn ON Gate Key Filters: Kick @ 145 Hz (blocks Bass bleed), Tom 1 @ 170 Hz, Floor Tom @ 95 Hz (blocks 204 Hz Snare bleed).', sdu: true }
        ]
      },
      {
        phase: 'Melodic Band Gain Matching & Spectral Pocket Carving',
        items: [
          { id: 'p4_1', text: 'Gain-match Keys 1 (Ch 8) and Keys 2 (Ch 9) so brass/bell patches do not jump +10 dB over piano/pad.', sdu: true },
          { id: 'p4_2', text: 'Cut Keys 1 @ 315 Hz (-6 dB) and Keys 2 @ 465 Hz (-5.5 dB) to unmask Backing & Lead Vocal warmth.', sdu: true },
          { id: 'p4_3', text: 'Notch Electric Guitar (Ch 10) @ 2,510 Hz (-7.5 dB, Q 3.5) and boost 320 Hz (+4.5 dB) to keep lyric presence clear.', sdu: true }
        ]
      },
      {
        phase: 'Lead & Backing Vocal EQ, Expander & DCA Setup',
        items: [
          { id: 'p5_1', text: 'Set Lead Vocal (Ch 13) HPF to 80 Hz, +4.5 dB @ 240 Hz, -4.5 dB @ 786 Hz, and 2:1 soft Expander (never hard-gate LV).', sdu: true },
          { id: 'p5_2', text: 'Add +6 dB preamp gain to BV 3 Tenor (Ch 16) to match BV 1, and cut 700 Hz (-5.5 dB) on Tenor throat resonance.', sdu: true },
          { id: 'p5_3', text: 'Set 3:1 Expanders (-36 dB) on all BVs and assign BVs to DCA 2 so open mics do not bleed during prayer/word.', sdu: true }
        ]
      },
      {
        phase: 'Monitor Wedges & Broken Fader Workarounds',
        items: [
          { id: 'p6_1', text: 'Leave 32SX Physical Channel 18 empty (broken fader motor) and route any Ch 18 source to Ch 22.', sdu: false },
          { id: 'p6_2', text: 'Bypass Mix 2 physical master fader (broken)—use Mix 3/4 on Snake Return C/D or control via Universal Control.', sdu: false },
          { id: 'p6_3', text: 'Ring out vocal wedges at 315 Hz, 786 Hz, and 2.5 kHz before worship team steps on stage.', sdu: true }
        ]
      },
      {
        phase: 'Capture Multitrack & Mid-Service Emergency Drill',
        items: [
          { id: 'p7_1', text: 'Arm PreSonus Capture at 44.1 kHz / 24-bit and verify all active tracks show independent waveforms.', sdu: true },
          { id: 'p7_2', text: 'Brief stage manager: if LV grabs a BV mic mid-song, signal FOH to run the 5-second 32SX Digital Input Source Swap.', sdu: true },
          { id: 'p7_3', text: 'Save scene to 32SX Memory Slot "AGCM_GREAT_HALL_BASE" before service starts.', sdu: false }
        ]
      }
    ];

    const MATRIX_ZONES = [
      { zone: 'Sub-Bass (30 – 80 Hz)', group: 'LOW', owner: 'Kick Drum Fundamental (50–65 Hz)', conflict: 'Kick vs. Bass DI + Stage Rumble', fix: 'Boost Kick +5.5 dB @ 56 Hz; shelf Bass DI -2.5 dB @ 62 Hz; engage 38 Hz LR24 HPF on DX2496 Sub output.' },
      { zone: 'Upper-Bass & Knock (80 – 160 Hz)', group: 'LOW', owner: 'Bass Guitar Fundamental (105–125 Hz) & Floor Tom (88 Hz)', conflict: 'Kick 96.9 Hz knock colliding with Bass DI 107.7 Hz + inverted phase (-1)', fix: 'Flip Polarity (Ø) on Bass DI, Tom 1, and Floor Tom; cut Kick -7.5 dB @ 98 Hz; set Kick Gate Key Filter to 145 Hz.' },
      { zone: 'Low-Mid Warmth vs. Mud (160 – 350 Hz)', group: 'MID', owner: 'Lead Vocal Chest Warmth (220–260 Hz) & Snare/Tom Body', conflict: 'Keys 1 (312.2 Hz) + BV 1 stage wash + Floor Tom 204.6 Hz snare bleed', fix: 'Cut Keys 1 -6.0 dB @ 315 Hz and BV 1 -5.5 dB @ 312 Hz; boost LV +4.5 dB @ 240 Hz; set Floor Tom Key Filter to 95 Hz.' },
      { zone: 'Boxy Lower-Midrange (350 – 800 Hz)', group: 'MID', owner: 'Snare Crack & Natural Piano/Vocal Transition', conflict: 'Keys 2 (463 Hz), Keys 1, BV 3 Tenor (699.8 Hz), and thin vocal capsules (786 Hz)', fix: 'Cut Keys 2 -5.5 dB @ 465 Hz; cut BV 3 -5.5 dB @ 700 Hz; cut LV -4.5 dB @ 786 Hz (Q 3.0).' },
      { zone: 'Core Vocal Midrange (800 – 2,000 Hz)', group: 'HIGH', owner: 'Lead Vocal Note Pitch & Bass Fret Definition (1.1 kHz)', conflict: 'Nasal vocal belt surges + BV 3 + Keys 2 brass patches', fix: 'Cut LV -3.5 dB @ 1.15 kHz; cut Keys 2 -4.0 dB @ 1.25 kHz; boost Bass DI +6.5 dB @ 1.1 kHz.' },
      { zone: 'Presence & Intelligibility (2,000 – 5,000 Hz)', group: 'HIGH', owner: 'Lead Vocal Consonants (3–4.5 kHz) & Kick Beater (3.8 kHz)', conflict: 'Electric Guitar 2,508.6 Hz spike (94.9% band energy) masking lyrics', fix: 'Notch Electric Guitar -7.5 dB @ 2,510 Hz (Q 3.5); boost Kick Beater +6.5 dB @ 3.8 kHz.' },
      { zone: 'Harmonic Air & Brilliance (5,000 – 15,000 Hz)', group: 'HIGH', owner: 'Lead Vocal Air Shelf (8 kHz+) & Cymbal Shimmer', conflict: 'Tom 1 & Tom 2 gates leaking harsh cymbal wash while LV lacks air', fix: 'Tighten Tom gates with Key Filters (170 Hz / 140 Hz); add +3.5 dB high-shelf @ 8 kHz on Lead Vocal.' }
    ];

    const SNAKE_MAP = {
      1: { label: 'Kick Drum', ch: 'Ch 1', status: 'ACTIVE' },
      2: { label: 'DEAD PORT 2', ch: 'DO NOT USE', status: 'DEAD' },
      3: { label: '1st Rack Tom (Ø)', ch: 'Ch 3', status: 'ACTIVE' },
      4: { label: '2nd Rack Tom', ch: 'Ch 4', status: 'ACTIVE' },
      5: { label: 'DEAD PORT 5', ch: 'DO NOT USE', status: 'DEAD' },
      6: { label: 'Floor Tom (Ø)', ch: 'Ch 6', status: 'ACTIVE' },
      7: { label: 'Bass Guitar DI (Ø)', ch: 'Ch 7', status: 'ACTIVE' },
      8: { label: 'Keys 1 (Main)', ch: 'Ch 8', status: 'ACTIVE' },
      9: { label: 'Keys 2 (Aux)', ch: 'Ch 9', status: 'ACTIVE' },
      10: { label: 'Electric Guitar', ch: 'Ch 10', status: 'ACTIVE' },
      11: { label: 'Snare Top', ch: 'Ch 11', status: 'ACTIVE' },
      12: { label: 'Overhead / Hi-Hat', ch: 'Ch 12', status: 'ACTIVE' },
      13: { label: 'Lead Vocal (RED)', ch: 'Ch 13', status: 'ACTIVE' },
      14: { label: 'BV 1 Sop (BLUE)', ch: 'Ch 14', status: 'ACTIVE' },
      15: { label: 'BV 2 Alto (GREEN)', ch: 'Ch 15', status: 'ACTIVE' },
      16: { label: 'BV 3 Tenor (YELLOW)', ch: 'Ch 16', status: 'ACTIVE' },
      17: { label: 'BV 4 Aux (PURPLE)', ch: 'Ch 17', status: 'ACTIVE' },
      18: { label: 'FADER 18 BROKEN', ch: 'Route → Ch 22', status: 'WARN' },
      19: { label: 'DEAD PORT 19', ch: 'DO NOT USE', status: 'DEAD' },
      20: { label: 'DEAD PORT 20', ch: 'DO NOT USE', status: 'DEAD' },
      21: { label: 'DEAD PORT 21', ch: 'DO NOT USE', status: 'DEAD' },
      22: { label: 'Ch 18 Rescue Strip', ch: 'Ch 22', status: 'ACTIVE' },
      30: { label: 'DEAD PORT 30', ch: 'DO NOT USE', status: 'DEAD' },
      32: { label: 'DEAD PORT 32', ch: 'DO NOT USE', status: 'DEAD' }
    };

    const DEFAULT_STRATEGIES = [
      { id: 's1', cat: 'VOCALS', title: 'Vocal Mic Swap Prevention & 5-Sec 32SX Recovery', body: 'Put RED tape on LV (Ch 13) and PURPLE tape on BV4 (Ch 17). If singers ever swap mics mid-service, open 32SX HOME → Input → Digital Patching and assign Ch 13 to the Analog Input in the Lead Singer’s hand.' },
      { id: 's2', cat: 'LOWEND', title: 'Kick 96.9 Hz Knock vs. Bass 107.7 Hz Phase Alignment', body: 'Flip Polarity (Ø) on Bass DI (Ch 7), Tom 1 (Ch 3), and Floor Tom (Ch 6). Cut Kick -7.5 dB @ 98 Hz, boost Kick +5.5 dB @ 56 Hz, and enable Kick Gate Key Filter @ 145 Hz.' },
      { id: 's3', cat: 'VOCALS', title: 'Rescuing a Thin/Budget Handheld Capsule Live', body: 'Lower HPF to 80 Hz, boost +4.5 dB @ 240 Hz (warmth), notch -4.5 dB @ 786 Hz (Q 3.0), cut -3.5 dB @ 1.15 kHz, and add +3.5 dB shelf @ 8 kHz.' },
      { id: 's4', cat: 'LOWEND', title: 'Floor Tom Snare Bleed Elimination', body: 'Turn ON the 32SX Gate Key Filter tuned to 95 Hz (Q 3.0) and notch -6.5 dB @ 205 Hz so Snare hits cannot open the Floor Tom mic.' },
      { id: 's5', cat: 'ROUTING', title: 'Keys 1 vs. Keys 2 Balance & Guitar 2.51 kHz Spike', body: 'Gain-match Keys 1 & Keys 2. Cut Keys 1 @ 315 Hz (-6 dB) and Keys 2 @ 465 Hz (-5.5 dB). On Electric Guitar, notch -7.5 dB @ 2,510 Hz (Q 3.5).' },
      { id: 's6', cat: 'ROUTING', title: '32SX Broken Fader 18, Broken Mix 2 & Aux-Fed Sub Bus', body: 'Never use physical Fader 18 or Mix 2 master fader. Route Aux 10 (Snake Return G) as a dedicated Center/Mono Subwoofer bus feeding ONLY Kick, Bass, Floor Tom, and Keys 1.' }
    ];

    const DEFAULT_GEAR = [
      { id: 'MIC-LV-01', name: 'Lead Vocal Dynamic Mic (RED Tape)', role: 'Ch 13 • Center Stage Lead', note: 'Primary SM58 / Beta 58A capsule. Keep strictly on Lead Stand.', status: 'Healthy' },
      { id: 'MIC-BV-04', name: 'BV 4 Handheld Mic (PURPLE Tape)', role: 'Ch 17 • Far Right Backing Vocal', note: 'Weak <350Hz & +9dB 786Hz honk—flag for capsule upgrade.', status: 'Needs Attention' },
      { id: 'MIC-BV-01', name: 'BV 1 Soprano Mic (BLUE Tape)', role: 'Ch 14 • Front Left Backing Vocal', note: 'Clean signal, requires 3:1 Expander (-36dB) to stop stage bleed.', status: 'Healthy' },
      { id: 'MIC-BV-03', name: 'BV 3 Tenor Mic (YELLOW Tape)', role: 'Ch 16 • Tenor Backing Vocal', note: 'Lower capsule output; needs +6 dB preamp trim.', status: 'Healthy' },
      { id: 'MIC-KICK-01', name: 'Kick Drum Dynamic/Boundary Mic', role: 'Ch 01 • Inside Kick Port', note: 'Clean line; pad preamp -6dB to prevent digital clipping.', status: 'Healthy' },
      { id: 'SNK-32X8', name: 'AudioLink 32×8 Analog Stagebox Snake', role: 'Stage Right → FOH Console', note: '25 working inputs; Ports 2,5,19,20,21,30,32 DEAD.', status: 'Needs Attention' },
      { id: 'CON-32SX', name: 'PreSonus StudioLive Series III 32SX', role: 'FOH Primary Console', note: 'Ch 18 Fader & Mix 2 Fader bypassed via soft-patch.', status: 'Healthy' },
      { id: 'AMP-IDOL13', name: 'Vatasa IDOL 13 Power Amplifier (2×1300W)', role: 'Amp Rack → VS-215P Tops', note: 'Keep attenuators at -3dB to match VS-215P 1000W AES rating.', status: 'Healthy' }
    ];

    const REPO_FILES = {
      'README.md': `# AGCM - KNUST Technical Department Portal\n\nLive Deployment: https://caleb-aheto.github.io/foh-mixing-blueprint/\nRepository: https://github.com/Caleb-Aheto/foh-mixing-blueprint\n\n## Multi-Page Architecture\n- index.html — Department Hub\n- planner.html — Event & Service Planner + Live Cue Runner\n- channels.html — 32SX Channel Strip & EQ\n- checklist.html — Soundcheck Checklist\n- stage-patch.html — 32x8 Snake & Soft-Patch\n- forensics.html — Great Hall Audio Reference Lab\n- matrix.html — Frequency Conflict Matrix\n- calculators.html — Great Hall Calculators & Playbook\n- team-sop.html — Mic Swap SOP & Gear Tracker\n- repo-guide.html — Multi-Page Repo Explorer\n- assets/agcm-logo.png — Official AGCM-KNUST Crest\n`,
      'index.html': `<!-- Department Hub entry page with vertical left sidebar & AGCM-KNUST branding -->`,
      'planner.html': `<!-- Dedicated Event & Service Planner + Live Order of Service Cue Sheet -->`,
      'channels.html': `<!-- Dedicated PreSonus StudioLive 32SX Channel Strip & Parametric EQ page -->`,
      'checklist.html': `<!-- Dedicated Pre-Service Soundcheck Checklist page -->`,
      'stage-patch.html': `<!-- Dedicated AudioLink 32x8 Snake & Soft-Patch Guard page -->`,
      'forensics.html': `<!-- Dedicated Great Hall 12-Channel Audio Reference Lab page -->`,
      'matrix.html': `<!-- Dedicated Frequency Conflict Matrix page -->`,
      'calculators.html': `<!-- Dedicated Great Hall DX2496 & BPM Calculators page -->`,
      'team-sop.html': `<!-- Dedicated Mic Swap SOP & Gear Health Tracker page -->`,
      'backend/schema.sql': `-- PostgreSQL Schema for AGCM-KNUST Technical Department Portal (Spring Boot 4 + Hibernate 6)
CREATE TABLE service_events (
    id UUID PRIMARY KEY,
    event_name VARCHAR(160) NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    venue_name VARCHAR(120) NOT NULL,
    call_time VARCHAR(120) NOT NULL,
    technical_notes TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_patch_assignments (
    id UUID PRIMARY KEY,
    service_event_id UUID NOT NULL REFERENCES service_events(id),
    console_channel INT NOT NULL CHECK (console_channel BETWEEN 1 AND 32 AND console_channel <> 18),
    source_name VARCHAR(120) NOT NULL,
    mic_or_di VARCHAR(120) NOT NULL,
    stagebox_port INT CHECK (stagebox_port NOT IN (2, 5, 19, 20, 21, 30, 32)),
    digital_patch_mode VARCHAR(120) NOT NULL,
    hpf_hz INT NOT NULL DEFAULT 80,
    polarity_inverted BOOLEAN NOT NULL DEFAULT FALSE
);`,
      'backend/PatchAllocationService.java': `package com.agcm.knust.audio.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PatchAllocationService {
    private static final Set<Integer> DEAD_SNAKE_PORTS = Set.of(2, 5, 19, 20, 21, 30, 32);
    private static final int BROKEN_CONSOLE_FADER = 18;

    public Map<Integer, Integer> allocateHealthyStageboxPorts(List<Integer> requestedChannels) {
        Map<Integer, Integer> channelToSnakePort = new LinkedHashMap<>();
        Set<Integer> usedPorts = new HashSet<>();
        for (int ch : requestedChannels) {
            if (ch == BROKEN_CONSOLE_FADER) continue; // Hardware bypass for Ch 18
            if (!DEAD_SNAKE_PORTS.contains(ch) && ch <= 32 && usedPorts.add(ch)) {
                channelToSnakePort.put(ch, ch);
            }
        }
        for (int ch : requestedChannels) {
            if (ch == BROKEN_CONSOLE_FADER || channelToSnakePort.containsKey(ch)) continue;
            for (int candidatePort = 1; candidatePort <= 32; candidatePort++) {
                if (!DEAD_SNAKE_PORTS.contains(candidatePort) && usedPorts.add(candidatePort)) {
                    channelToSnakePort.put(ch, candidatePort);
                    break;
                }
            }
        }
        return channelToSnakePort;
    }
}`
    };

    let currentView = (location.hash && document.getElementById('view-' + location.hash.slice(1))) ? location.hash.slice(1) : 'planner';
    let currentChannelId = 'lv';
    let showProblemGhost = true;
    let checklistFilter = 'ALL';
    let matrixFilter = 'ALL';
    let eventsList = JSON.parse(safeGetItem('agcm_events_v4') || 'null') || DEFAULT_EVENTS;
    let activeEventId = safeGetItem('agcm_active_ev_v4') || eventsList[0].id;
    let checkedItems = JSON.parse(safeGetItem('sdu_checked_v35') || '{}');
    let customStrategies = JSON.parse(safeGetItem('sdu_custom_strats_v35') || '[]');
    let gearInventory = JSON.parse(safeGetItem('sdu_gear_v35') || 'null') || DEFAULT_GEAR;
    let tapTimes = [];

    function showToast(msg) {
      if (typeof window.toast === 'function') window.toast(msg);
    }

    const PORTAL_TAB_ORDER = ['planner', 'channels', 'checklist', 'patch', 'mastering', 'matrix', 'forensics', 'calculators', 'sop', 'handover'];
    const PORTAL_TAB_LABELS = {
      planner: '📅 Service Planner',
      channels: '🎛️ 32SX Channels (32)',
      checklist: '✅ Soundcheck List',
      patch: '🔌 32×8 Snake & Patch',
      mastering: '🎚️ Mixing & Mastering',
      matrix: '🌊 Conflict Matrix',
      forensics: '📊 Audio Reference',
      calculators: '📐 Venue Calculators',
      sop: '🎤 Stage SOPs & Gear',
      handover: '📝 Role Handover Notes'
    };

    function switchView(viewName) {
      if (!PORTAL_TAB_ORDER.includes(viewName)) viewName = 'planner';
      currentView = viewName;
      try { if (location.hash !== '#' + viewName) history.replaceState(null, '', '#' + viewName); } catch (e) {}

      PORTAL_TAB_ORDER.forEach(v => {
        const sec = document.getElementById('view-' + v);
        const btn = document.getElementById('tab-btn-' + v);
        if (sec) {
          if (v === viewName) {
            sec.classList.add('active-view');
            sec.style.display = 'block';
            sec.classList.remove('view-animate');
            void sec.offsetWidth;
            sec.classList.add('view-animate');
          } else {
            sec.classList.remove('active-view');
            sec.style.display = 'none';
          }
        }
        if (btn) {
          btn.classList.toggle('active', v === viewName);
          btn.setAttribute('aria-selected', v === viewName ? 'true' : 'false');
        }
      });

      document.querySelectorAll('[data-mob-tab]').forEach(mb => {
        mb.classList.toggle('active', mb.getAttribute('data-mob-tab') === viewName);
      });
      const mobLbl = document.getElementById('portal-mobile-active-label');
      if (mobLbl && PORTAL_TAB_LABELS[viewName]) mobLbl.textContent = PORTAL_TAB_LABELS[viewName];

      if (viewName === 'channels') setTimeout(drawEQCurve, 30);
    }

    function toggleMobilePortalGrid() {
      const g = document.getElementById('portal-mobile-grid');
      const b = document.getElementById('btn-portal-mob-toggle');
      if (!g) return;
      g.hidden = !g.hidden;
      if (b) b.setAttribute('aria-expanded', String(!g.hidden));
    }
    function closeMobilePortalGrid() {
      const g = document.getElementById('portal-mobile-grid');
      const b = document.getElementById('btn-portal-mob-toggle');
      if (g) g.hidden = true;
      if (b) b.setAttribute('aria-expanded', 'false');
    }

    window.addEventListener('keydown', e => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const idx = PORTAL_TAB_ORDER.indexOf(currentView);
        if (idx === -1) return;
        const nextIdx = (idx + (e.key === 'ArrowRight' ? 1 : -1) + PORTAL_TAB_ORDER.length) % PORTAL_TAB_ORDER.length;
        switchView(PORTAL_TAB_ORDER[nextIdx]);
      }
    });

    function getActiveEvent() {
      return eventsList.find(e => e.id === activeEventId) || eventsList[0];
    }

    function saveEvents() {
      safeSetItem('agcm_events_v4', JSON.stringify(eventsList));
      safeSetItem('agcm_active_ev_v4', activeEventId);
    }

    function renderPlanner() {
      const sel = document.getElementById('event-selector');
      if (sel) {
        sel.innerHTML = eventsList.map(e => `<option value="${e.id}" ${e.id === activeEventId ? 'selected' : ''}>${e.name}</option>`).join('');
      }
      const ev = getActiveEvent();
      if (!ev) return;

      document.getElementById('planner-event-type').textContent = ev.type;
      document.getElementById('ev-name').value = ev.name;
      document.getElementById('ev-venue').value = ev.venue;
      document.getElementById('ev-time').value = ev.time;
      document.getElementById('ev-notes').value = ev.notes;

      // Update Hub Snapshot too
      // hubTitle removed
      // hubMeta removed
      // hubCueCount removed

      const crewGrid = document.getElementById('crew-roster-grid');
      if (crewGrid) {
        crewGrid.innerHTML = ev.crew.map((c, idx) => `
          <div class="dept-subtle-box flex flex-col gap-1">
            <label class="text-[11px] font-bold uppercase text-blue-600">${c.role}</label>
            <input type="text" value="${escapeHTML(c.person)}" oninput="updateCrewMember(${idx}, this.value)" class="dept-input text-xs font-semibold" />
          </div>
        `).join('');
      }

      const cueBody = document.getElementById('cue-sheet-body');
      if (cueBody) {
        cueBody.innerHTML = ev.cues.map((c, idx) => {
          const pill = c.status === 'LIVE NOW'
            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
            : (c.status === 'Done' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-50 text-blue-800 border-blue-200');
          return `
            <tr>
              <td class="font-bold text-main whitespace-nowrap tabular">${c.time}</td>
              <td class="font-bold text-main">${c.seg}</td>
              <td class="text-sec">${c.lead}</td>
              <td class="text-sec max-w-xs">${c.audio}</td>
              <td class="text-sec max-w-xs">${c.media}</td>
              <td>
                <button onclick="cycleCueStatus(${idx})" class="px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${pill} transition">
                  ${c.status}
                </button>
              </td>
              <td>
                <button onclick="removeCue(${idx})" class="text-xs font-bold text-rose-600 hover:underline">Remove</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    function selectEvent(id) {
      activeEventId = id;
      saveEvents();
      renderPlanner();
    }

    function updateActiveEventMeta() {
      const ev = getActiveEvent();
      ev.name = document.getElementById('ev-name').value;
      ev.venue = document.getElementById('ev-venue').value;
      ev.time = document.getElementById('ev-time').value;
      ev.notes = document.getElementById('ev-notes').value;
      saveEvents();
      const sel = document.getElementById('event-selector');
      if (sel) sel.options[sel.selectedIndex].textContent = ev.name;
    }

    function updateCrewMember(idx, val) {
      const ev = getActiveEvent();
      ev.crew[idx].person = val;
      saveEvents();
    }

    function cycleCueStatus(idx) {
      const states = ['Upcoming', 'LIVE NOW', 'Done'];
      const ev = getActiveEvent();
      const cur = ev.cues[idx].status;
      ev.cues[idx].status = states[(states.indexOf(cur) + 1) % states.length];
      saveEvents();
      renderPlanner();
    }

    function removeCue(idx) {
      const ev = getActiveEvent();
      ev.cues.splice(idx, 1);
      saveEvents();
      renderPlanner();
    }

    function openNewEventModal() { const m = document.getElementById('modal-new-event'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeNewEventModal() { const m = document.getElementById('modal-new-event'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function createNewEvent() {
      const name = document.getElementById('new-ev-name').value.trim();
      if (!name) return;
      const newEv = {
        id: 'ev_' + Date.now(),
        name,
        type: document.getElementById('new-ev-type').value.trim() || 'Special Event',
        venue: document.getElementById('new-ev-venue').value.trim() || 'Great Hall',
        time: document.getElementById('new-ev-time').value.trim() || 'Call: TBD',
        notes: 'Run 15-sec vocal mic scratch check & color-tape verification.',
        crew: [
          { role: 'FOH Console Engineer', person: 'Assigned FOH Console Lead' },
          { role: 'Monitor / Stage Engineer', person: 'Assign Tech' },
          { role: 'Stage / Mic Runner', person: 'Assign Runner' },
          { role: 'Recording & Mastering Lead', person: 'Assign Tech' },
          { role: 'Setup & Conveyance Lead', person: 'Assign Crew' }
        ],
        cues: [
          { time: '00:00', seg: 'Soundcheck & Line Check', lead: 'Technical Crew', audio: 'Verify all inputs & 32x8 snake ports', media: 'Verify Capture recording & conveyance checklist', status: 'Upcoming' }
        ]
      };
      eventsList.push(newEv);
      activeEventId = newEv.id;
      saveEvents();
      closeNewEventModal();
      renderPlanner();
      showToast('Created new service plan: ' + name);
    }

    function openAddCueModal() { const m = document.getElementById('modal-add-cue'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeAddCueModal() { const m = document.getElementById('modal-add-cue'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function saveNewCue() {
      const seg = document.getElementById('cue-seg').value.trim();
      if (!seg) return;
      const ev = getActiveEvent();
      ev.cues.push({
        time: document.getElementById('cue-time').value.trim() || 'TBD',
        seg,
        lead: document.getElementById('cue-lead').value.trim() || 'TBD',
        audio: document.getElementById('cue-audio').value.trim() || 'Standard mix',
        media: document.getElementById('cue-media').value.trim() || '—',
        status: 'Upcoming'
      });
      saveEvents();
      closeAddCueModal();
      renderPlanner();
      showToast('Added cue to ' + ev.name);
    }

    function copyEventRunSheetWhatsApp() {
      const ev = getActiveEvent();
      const crewLines = ev.crew.map(c => `• ${c.role}: ${c.person}`).join('\n');
      const cueLines = ev.cues.map(c => `• [${c.time}] ${c.seg} (${c.lead}) → ${c.audio}`).join('\n');
      const txt = `*AGCM - KNUST TECHNICAL — ${ev.name.toUpperCase()}*\n📍 ${ev.venue} | ⏰ ${ev.time}\n\n*CREW ROSTER:*\n${crewLines}\n\n*ORDER OF SERVICE CUES:*\n${cueLines}`;
      navigator.clipboard?.writeText(txt);
      showToast('Copied crew run-sheet for WhatsApp!');
    }

    // =========================================================================
    // OTHER MODULE RENDERERS
    // =========================================================================
    function renderForensicCharts() {
      const container = document.getElementById('chart-forensic-stems');
      if (!container) return;
      container.innerHTML = Object.values(CHANNELS).map(ch => {
        const rmsPct = Math.max(8, Math.min(100, ((ch.rmsNum + 45) / 45) * 100));
        const peakPct = Math.max(10, Math.min(100, ((ch.peakNum + 45) / 45) * 100));
        const barColor = ch.severity === 'CRITICAL' ? 'bg-blue-600' : (ch.severity === 'PHASE' ? 'bg-amber-500' : 'bg-emerald-500');
        return `
          <div class="space-y-1 tabular">
            <div class="flex justify-between text-xs"><span class="font-bold text-main">${ch.shortName}</span><span class="text-mut">RMS ${ch.rms} • Peak ${ch.peak}</span></div>
            <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
              <div class="h-full ${barColor} rounded-full" style="width:${rmsPct.toFixed(1)}%"></div>
              <div class="w-1 h-full bg-rose-600 absolute top-0" style="left:calc(${peakPct.toFixed(1)}% - 2px)"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderBeforeAfterChart(key) {
      const data = BEFORE_AFTER_DATA[key] || BEFORE_AFTER_DATA.lv;
      const btnLv = document.getElementById('btn-ba-lv');
      const btnKick = document.getElementById('btn-ba-kick');
      if (btnLv && btnKick) {
        btnLv.className = key === 'lv' ? 'px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white transition' : 'px-3.5 py-2 rounded-lg text-xs font-bold btn-subtle transition';
        btnKick.className = key === 'kick' ? 'px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white transition' : 'px-3.5 py-2 rounded-lg text-xs font-bold btn-subtle transition';
      }
      const container = document.getElementById('chart-before-after');
      if (!container) return;
      container.innerHTML = `
        <div class="dept-subtle-box mb-3"><div class="text-xs font-bold text-main">${data.title}</div><div class="text-xs text-sec mt-0.5">${data.subtitle}</div></div>
        ${data.bands.map(b => `
          <div class="space-y-1.5 tabular">
            <div class="flex justify-between text-xs"><span class="font-semibold text-main">${b.name}</span><span class="text-blue-600 font-bold">Raw ${b.before}% → Mastered ${b.after}% (${b.delta})</span></div>
            <div class="grid grid-cols-2 gap-2">
              <div class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-rose-400 rounded-full" style="width:${Math.min(100, b.before * 1.3)}%"></div></div>
              <div class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width:${Math.min(100, b.after * 1.3)}%"></div></div>
            </div>
          </div>
        `).join('')}
      `;
    }

    function renderForensicTable() {
      const tbody = document.getElementById('forensic-table-body');
      if (!tbody) return;
      const q = (document.getElementById('forensic-search')?.value || '').toLowerCase();
      const f = document.getElementById('forensic-band-filter')?.value || 'ALL';
      const rows = Object.values(CHANNELS).filter(ch => {
        if (f === 'CRITICAL' && ch.severity !== 'CRITICAL') return false;
        if (f === 'PHASE' && ch.severity !== 'PHASE') return false;
        if (f === 'VOCAL' && !ch.isVocal) return false;
        if (q && !(ch.name.toLowerCase().includes(q) || ch.forensicSummary.toLowerCase().includes(q) || ch.domFreq.toLowerCase().includes(q))) return false;
        return true;
      });
      tbody.innerHTML = rows.map(ch => {
        const badge = ch.severity === 'CRITICAL'
          ? '<span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">CRITICAL</span>'
          : (ch.severity === 'PHASE' ? '<span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">PHASE Ø</span>' : '<span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">VERIFIED</span>');
        return `
          <tr class="tabular">
            <td><div class="font-bold text-main">${ch.shortName}</div><div class="text-xs mt-0.5">${badge}</div></td>
            <td class="text-xs"><div class="font-bold text-main">Peak: ${ch.peak}</div><div class="text-sec">Active: ${ch.rms}</div></td>
            <td class="text-xs font-semibold text-main">${ch.gatePct}</td>
            <td class="text-xs"><div class="font-bold text-blue-600">${ch.domFreq}</div><div class="text-sec">${ch.phase}</div></td>
            <td class="text-xs text-sec max-w-xs">${ch.bands7}</td>
            <td class="text-sm text-sec max-w-md leading-relaxed">${ch.forensicSummary}</td>
            <td><button onclick="safeSetItem('sdu_active_ch', '${ch.id}'); selectChannel('${ch.id}'); switchView('channels');" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap shadow-sm">Load in 32SX Editor →</button></td>
          </tr>
        `;
      }).join('');
    }

    function selectChannel(id) {
      if (!CHANNELS[id]) return;
      currentChannelId = id;
      const ch = CHANNELS[id];
      document.querySelectorAll('#channel-selector-bar .ch-btn').forEach(btn => btn.classList.toggle('active', btn.id === id));
      document.getElementById('selected-channel-badge').textContent = ch.shortName;
      document.getElementById('ch-title').textContent = ch.name;
      document.getElementById('ch-routing-badge').textContent = ch.snakeCh;
      document.getElementById('ch-forensic-summary').textContent = ch.forensicSummary;
      document.getElementById('ch-stat-peak').textContent = ch.peak;
      document.getElementById('ch-stat-rms').textContent = ch.rms;
      document.getElementById('ch-stat-gate').textContent = ch.gatePct;
      document.getElementById('ch-stat-dom').textContent = ch.domFreq;
      document.getElementById('ch-preamp-val').textContent = ch.preamp;
      document.getElementById('ch-gate-val').textContent = ch.gate;
      document.getElementById('ch-comp-val').textContent = ch.comp;
      document.getElementById('ch-stage-tip').textContent = ch.stageTip;
      document.getElementById('slider-hpf').value = ch.hpf;
      document.getElementById('lbl-hpf').textContent = ch.hpf + ' Hz';
      ch.eq.forEach((b, idx) => {
        const n = idx + 1;
        document.getElementById(`lbl-b${n}-freq`).textContent = `Band ${n}: ${b.freq} Hz (Q ${b.q})`;
        document.getElementById(`lbl-b${n}-gain`).textContent = (b.gain >= 0 ? '+' : '') + b.gain + ' dB';
        document.getElementById(`lbl-b${n}-desc`).textContent = b.desc;
        document.getElementById(`slider-b${n}`).value = b.gain;
      });
      drawEQCurve();
    }

    function onEQSliderChange() {
      const hpf = parseFloat(document.getElementById('slider-hpf').value);
      document.getElementById('lbl-hpf').textContent = hpf + ' Hz';
      for (let i = 1; i <= 4; i++) {
        const g = parseFloat(document.getElementById(`slider-b${i}`).value);
        document.getElementById(`lbl-b${i}-gain`).textContent = (g >= 0 ? '+' : '') + g.toFixed(1) + ' dB';
      }
      drawEQCurve();
    }

    function resetCurrentChannelEQ() { selectChannel(currentChannelId); showToast('Restored preset for ' + CHANNELS[currentChannelId].shortName); }
    function toggleProblemGhost() {
      showProblemGhost = !showProblemGhost;
      const btn = document.getElementById('btn-toggle-problem-Ghost');
      if (btn) btn.textContent = 'Show Raw Problem Peak: ' + (showProblemGhost ? 'ON' : 'OFF');
      drawEQCurve();
    }

        let _eqHoverX = -1, _eqHoverY = -1, _eqDragBand = -1, _eqEventsBound = false;
    function drawEQCurve() {
      const canvas = document.getElementById('eq-curve-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      const padL = 42, padR = 22, padT = 26, padB = 28;
      const plotW = W - padL - padR, plotH = H - padT - padB;
      ctx.clearRect(0, 0, W, H);

      const ch = CHANNELS[currentChannelId];
      if (!ch) return;
      const hpf = parseFloat(document.getElementById('slider-hpf').value || ch.hpf);
      const gains = [1, 2, 3, 4].map(i => parseFloat(document.getElementById(`slider-b${i}`).value));

      const fToX = f => padL + (Math.log10(Math.max(20, Math.min(20000, f)) / 20) / 3) * plotW;
      const xToF = x => 20 * Math.pow(1000, Math.max(0, Math.min(1, (x - padL) / plotW)));
      const dbToY = db => padT + (plotH / 2) - (db / 16) * (plotH / 2 - 6);
      const yToDb = y => Math.max(-15, Math.min(15, ((padT + plotH / 2 - y) / (plotH / 2 - 6)) * 16));

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#090d1a');
      bgGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Acoustic spectrum zone headers
      const zones = [
        { name: 'SUB', f1: 20, f2: 60 },
        { name: 'BASS', f1: 60, f2: 250 },
        { name: 'LOW-MID', f1: 250, f2: 500 },
        { name: 'MID', f1: 500, f2: 2000 },
        { name: 'PRESENCE', f1: 2000, f2: 6000 },
        { name: 'AIR', f1: 6000, f2: 20000 }
      ];
      ctx.font = '600 9px Inter, sans-serif';
      zones.forEach((z, idx) => {
        const x1 = fToX(z.f1), x2 = fToX(z.f2);
        if (idx % 2 === 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.018)';
          ctx.fillRect(x1, padT, x2 - x1, plotH);
        }
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText(z.name, (x1 + x2) / 2, 16);
      });

      // Frequency & dB grid
      ctx.lineWidth = 1;
      [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000].forEach(f => {
        const x = fToX(f);
        ctx.strokeStyle = 'rgba(148,163,184,0.10)';
        ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, H - padB); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(f >= 1000 ? (f / 1000) + 'k' : f, x, H - 10);
      });
      [-12, -6, 0, 6, 12].forEach(db => {
        const y = dbToY(db);
        ctx.strokeStyle = db === 0 ? 'rgba(148,163,184,0.32)' : 'rgba(148,163,184,0.10)';
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText((db > 0 ? '+' : '') + db + 'dB', padL - 6, y + 3);
      });

      const bandColors = ['#10b981', '#f59e0b', '#a855f7', '#38bdf8'];
      const bandFillColors = ['rgba(16,185,129,0.14)', 'rgba(245,158,11,0.14)', 'rgba(168,85,247,0.14)', 'rgba(56,189,248,0.14)'];
      const zeroY = dbToY(0);

      // Individual band shaded responses
      ch.eq.forEach((b, idx) => {
        const g = gains[idx];
        if (Math.abs(g) < 0.1) return;
        ctx.beginPath();
        ctx.moveTo(padL, zeroY);
        for (let px = padL; px <= W - padR; px += 3) {
          const f = xToF(px);
          let db = 0;
          if (idx === 3 && b.q < 0.9) db = g * (1 / (1 + Math.pow(b.freq / f, 2)));
          else {
            const oct = Math.log2(f / b.freq), bw = 1 / Math.max(0.5, b.q);
            db = g * Math.exp(-(oct * oct) / (0.18 * bw * bw));
          }
          ctx.lineTo(px, dbToY(db));
        }
        ctx.lineTo(W - padR, zeroY);
        ctx.closePath();
        ctx.fillStyle = bandFillColors[idx];
        ctx.fill();
      });

      // Raw problem resonance ghost curve
      if (showProblemGhost && ch.problemFreq) {
        ctx.beginPath();
        for (let px = padL; px <= W - padR; px += 2) {
          const f = xToF(px);
          const octDist = Math.log2(f / ch.problemFreq);
          const db = ch.problemGain * Math.exp(-(octDist * octDist) / 0.08);
          const y = dbToY(db);
          if (px === padL) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.78)';
        ctx.setLineDash([5, 4]); ctx.lineWidth = 1.8; ctx.stroke(); ctx.setLineDash([]);
      }

      // Composite curve + under-curve glow fill
      const pts = [];
      for (let px = padL; px <= W - padR; px += 2) {
        const f = xToF(px);
        let totalDb = 0;
        if (f < hpf * 1.45) {
          const ratio = hpf / Math.max(10, f);
          if (ratio > 1) totalDb -= 18 * Math.log2(ratio);
        }
        ch.eq.forEach((b, idx) => {
          const g = gains[idx];
          if (idx === 3 && b.q < 0.9) totalDb += g * (1 / (1 + Math.pow(b.freq / f, 2)));
          else {
            const oct = Math.log2(f / b.freq), bw = 1 / Math.max(0.5, b.q);
            totalDb += g * Math.exp(-(oct * oct) / (0.18 * bw * bw));
          }
        });
        totalDb = Math.max(-15.5, Math.min(15.5, totalDb));
        pts.push({ x: px, y: dbToY(totalDb) });
      }

      ctx.beginPath();
      ctx.moveTo(padL, zeroY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(W - padR, zeroY);
      ctx.closePath();
      const compFill = ctx.createLinearGradient(0, padT, 0, H - padB);
      compFill.addColorStop(0, 'rgba(99,102,241,0.22)');
      compFill.addColorStop(0.5, 'rgba(56,189,248,0.05)');
      compFill.addColorStop(1, 'rgba(244,63,94,0.20)');
      ctx.fillStyle = compFill;
      ctx.fill();

      ctx.beginPath();
      pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2.6;
      ctx.shadowColor = 'rgba(56,189,248,0.55)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // HPF marker node
      const hpfX = fToX(hpf), hpfY = dbToY(-3);
      ctx.fillStyle = '#6366f1';
      ctx.beginPath(); ctx.arc(hpfX, hpfY, 5, 0, Math.PI * 2); ctx.fill();

      // Interactive Band Nodes (1-4)
      ch.eq.forEach((b, idx) => {
        const bx = fToX(b.freq), by = dbToY(gains[idx]);
        ctx.fillStyle = bandColors[idx];
        ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = '#090d1a'; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = '700 9px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(String(idx + 1), bx, by + 3);
      });

      // Live cursor frequency + dB readout
      if (_eqHoverX >= padL && _eqHoverX <= W - padR && _eqHoverY >= padT && _eqHoverY <= H - padB) {
        const hf = xToF(_eqHoverX), hdb = yToDb(_eqHoverY);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(_eqHoverX, padT); ctx.lineTo(_eqHoverX, H - padB); ctx.stroke();
        const fTxt = hf >= 1000 ? (hf / 1000).toFixed(2) + ' kHz' : Math.round(hf) + ' Hz';
        const dTxt = (hdb >= 0 ? '+' : '') + hdb.toFixed(1) + ' dB';
        ctx.fillStyle = 'rgba(15,23,42,0.92)';
        ctx.fillRect(W - 148, padT + 4, 120, 22);
        ctx.strokeStyle = 'rgba(148,163,184,0.3)';
        ctx.strokeRect(W - 148, padT + 4, 120, 22);
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 10px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`${fTxt}  •  ${dTxt}`, W - 88, padT + 18);
      }

      if (!_eqEventsBound) {
        _eqEventsBound = true;
        const getCanvasPos = e => {
          const r = canvas.getBoundingClientRect();
          return {
            x: (e.clientX - r.left) * (canvas.width / r.width),
            y: (e.clientY - r.top) * (canvas.height / r.height)
          };
        };
        canvas.style.cursor = 'crosshair';
        canvas.addEventListener('pointerdown', e => {
          const pos = getCanvasPos(e);
          const curCh = CHANNELS[currentChannelId];
          if (!curCh) return;
          curCh.eq.forEach((b, idx) => {
            const bx = fToX(b.freq), by = dbToY(parseFloat(document.getElementById(`slider-b${idx+1}`).value));
            if (Math.hypot(pos.x - bx, pos.y - by) <= 14) _eqDragBand = idx + 1;
          });
        });
        canvas.addEventListener('pointermove', e => {
          const pos = getCanvasPos(e);
          _eqHoverX = pos.x; _eqHoverY = pos.y;
          if (_eqDragBand > 0) {
            const newDb = Math.round(yToDb(pos.y) * 2) / 2;
            const sl = document.getElementById(`slider-b${_eqDragBand}`);
            if (sl) { sl.value = newDb; onEQSliderChange(); return; }
          }
          drawEQCurve();
        });
        window.addEventListener('pointerup', () => { _eqDragBand = -1; });
        canvas.addEventListener('pointerleave', () => { _eqHoverX = -1; _eqHoverY = -1; drawEQCurve(); });
      }
    }

    function setChecklistFilter(f) { checklistFilter = f; renderChecklist(); }
    function toggleCheckItem(id) { checkedItems[id] = !checkedItems[id]; safeSetItem('sdu_checked_v35', JSON.stringify(checkedItems)); renderChecklist(); }
    function resetChecklist() { checkedItems = {}; safeSetItem('sdu_checked_v35', '{}'); renderChecklist(); showToast('Soundcheck checklist reset'); }

    function renderChecklist() {
      const container = document.getElementById('checklist-phases-container');
      if (!container) return;
      let total = 0, done = 0;
      CHECKLIST_PHASES.forEach(p => p.items.forEach(it => { total++; if (checkedItems[it.id]) done++; }));
      const pct = total ? Math.round((done / total) * 100) : 0;
      document.getElementById('checklist-progress-text').textContent = `${done} / ${total} Steps Completed (${pct}%)`;
      document.getElementById('checklist-progress-bar').style.width = pct + '%';
      container.innerHTML = CHECKLIST_PHASES.map(p => {
        const items = p.items.filter(it => !(checklistFilter === 'TODO' && checkedItems[it.id]) && !(checklistFilter === 'SDU' && !it.sdu));
        return `
          <div class="dept-card space-y-4">
            <h3 class="text-base font-bold text-main border-b border-slate-200 dark:border-slate-800 pb-3">${p.phase}</h3>
            <div class="space-y-3">
              ${items.map(it => {
                const isDone = !!checkedItems[it.id];
                return `
                  <label class="flex items-start gap-3 p-3 rounded-xl border ${isDone ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} cursor-pointer transition">
                    <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleCheckItem('${it.id}')" class="mt-1 w-4 h-4 accent-blue-600 rounded" />
                    <div class="text-sm ${isDone ? 'line-through text-mut' : 'text-main'} leading-relaxed">
                      ${it.text}
                      ${it.sdu ? '<span class="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">CRITICAL</span>' : ''}
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
    }

    function filterMatrix(group) { matrixFilter = group; renderMatrix(); }
    function renderMatrix() {
      const container = document.getElementById('matrix-cards-container');
      if (!container) return;
      const rows = MATRIX_ZONES.filter(z => matrixFilter === 'ALL' || z.group === matrixFilter);
      container.innerHTML = rows.map(z => `
        <div class="dept-card space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-main">${z.zone}</h3>
            <span class="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-xs font-bold">${z.group}</span>
          </div>
          <div class="dept-subtle-box"><div class="text-xs font-bold uppercase text-emerald-600">Primary Pocket Owner</div><div class="text-sm font-semibold text-main mt-0.5">${z.owner}</div></div>
          <div class="dept-subtle-box"><div class="text-xs font-bold uppercase text-rose-600">Measured Collision</div><div class="text-sm text-sec mt-0.5">${z.conflict}</div></div>
          <div class="dept-subtle-box border-l-4 border-l-blue-600"><div class="text-xs font-bold uppercase text-blue-600">Surgical 32SX Resolution</div><div class="text-sm text-sec mt-0.5">${z.fix}</div></div>
        </div>
      `).join('');
    }

    function renderSnakeGrid() {
      const grid = document.getElementById('snake-grid');
      if (!grid) return;
      let html = '';
      for (let i = 1; i <= 32; i++) {
        const info = SNAKE_MAP[i] || { label: 'Available Spare', ch: 'Ch ' + i, status: 'SPARE' };
        let badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">${info.ch}</span>`;
        let cardCls = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-main';
        if (info.status === 'DEAD') {
          cardCls = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
          badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">DEAD</span>`;
        } else if (info.status === 'WARN') {
          cardCls = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
          badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">${info.ch}</span>`;
        } else if (info.status === 'ACTIVE') {
          cardCls = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100';
          badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">${info.ch}</span>`;
        }
        html += `
          <div class="p-3 rounded-xl border ${cardCls} flex flex-col justify-between min-h-[92px]">
            <div class="flex items-center justify-between gap-1">
              <span class="text-[11px] font-extrabold tracking-tight">PORT ${String(i).padStart(2, '0')}</span>
              ${badge}
            </div>
            <div class="text-xs font-bold mt-2 leading-snug">${info.label}</div>
          </div>
        `;
      }
      grid.innerHTML = html;
    }

    function copyCrewPatchWhatsApp() {
      const text = `*AGCM - KNUST TECHNICAL — GREAT HALL STAGE PATCH & MIC COLOR SOP*\n• Port 1: Kick Drum (Ch 1, -6dB Pad)\n• Port 2: ❌ DEAD PORT\n• Port 3: 1st Tom (Ch 3, Polarity Ø ON)\n• Port 4: 2nd Tom (Ch 4)\n• Port 5: ❌ DEAD PORT\n• Port 6: Floor Tom (Ch 6, Polarity Ø ON, 95Hz Gate Key)\n• Port 7: Bass DI (Ch 7, Polarity Ø ON)\n• Port 8: Keys 1 | Port 9: Keys 2\n• Port 10: Guitar (-7.5dB @ 2.51kHz)\n• Port 13: Lead Vocal [RED TAPE]\n• Port 14: BV 1 [BLUE] | Port 15: BV 2 [GREEN] | Port 16: BV 3 [YELLOW] | Port 17: BV 4 [PURPLE]`;
      navigator.clipboard?.writeText(text);
      showToast('Copied Crew Patch & Color-Code List!');
    }

    function setQuickDistance(m) { document.getElementById('calc-dist').value = m; updateAcousticCalc(); }
    function updateAcousticCalc() {
      const dist = parseFloat(document.getElementById('calc-dist')?.value || 3.2);
      const temp = parseFloat(document.getElementById('calc-temp')?.value || 28);
      const xover = parseFloat(document.getElementById('calc-xover')?.value || 90);
      const speed = 331.3 + 0.606 * temp;
      const delayMs = (dist / speed) * 1000;
      document.getElementById('out-delay-ms').textContent = delayMs.toFixed(2) + ' ms';
      document.getElementById('out-delay-smp').textContent = Math.round((delayMs / 1000) * 44100) + ' smp';
      document.getElementById('out-speed').textContent = speed.toFixed(1) + ' m/s';
      document.getElementById('out-wavelength').textContent = (speed / Math.max(20, xover)).toFixed(2) + ' m';
    }

    function updateBPMCalc(val) {
      const bpm = Math.max(40, Math.min(220, parseFloat(val || 76)));
      document.getElementById('calc-bpm').value = bpm;
      document.getElementById('slider-bpm').value = bpm;
      const q = 60000 / bpm;
      document.getElementById('bpm-quarter').textContent = Math.round(q) + ' ms';
      document.getElementById('bpm-dotted8').textContent = Math.round(q * 0.75) + ' ms';
      document.getElementById('bpm-eighth').textContent = Math.round(q * 0.5) + ' ms';
      document.getElementById('bpm-predelay').textContent = Math.round(q / 16) + ' ms';
      document.getElementById('bpm-decay').textContent = ((q * 2) / 1000).toFixed(2) + ' s';
    }

    function tapTempo() {
      const now = performance.now();
      tapTimes.push(now);
      if (tapTimes.length > 5) tapTimes.shift();
      if (tapTimes.length >= 2) {
        let sum = 0;
        for (let i = 1; i < tapTimes.length; i++) sum += (tapTimes[i] - tapTimes[i - 1]);
        const bpm = Math.round(60000 / (sum / (tapTimes.length - 1)));
        if (bpm >= 45 && bpm <= 210) updateBPMCalc(bpm);
      }
    }

    function renderStrategies() {
      const grid = document.getElementById('strategy-cards-grid');
      if (!grid) return;
      const cat = document.getElementById('strategy-cat-filter')?.value || 'ALL';
      const all = [...DEFAULT_STRATEGIES, ...customStrategies].filter(s => cat === 'ALL' || s.cat === cat);
      grid.innerHTML = all.map(s => `<div class="dept-card space-y-2.5"><span class="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-xs font-bold">${s.cat}</span><h4 class="text-base font-bold text-main">${s.title}</h4><p class="text-sm text-sec leading-relaxed">${s.body}</p></div>`).join('');
    }
    function openStrategyModal() { const m = document.getElementById('modal-strategy'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeStrategyModal() { const m = document.getElementById('modal-strategy'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function saveCustomStrategy() {
      const title = document.getElementById('strat-title').value.trim(), cat = document.getElementById('strat-cat').value, body = document.getElementById('strat-body').value.trim();
      if (!title || !body) return;
      customStrategies.push({ id: 'cust_' + Date.now(), cat, title, body });
      safeSetItem('sdu_custom_strats_v35', JSON.stringify(customStrategies));
      closeStrategyModal(); renderStrategies(); showToast('Added strategy to Vault!');
    }

    function toggleGearStatus(idx) {
      const states = ['Healthy', 'Needs Attention', 'Faulty / Bypassed'];
      gearInventory[idx].status = states[(states.indexOf(gearInventory[idx].status) + 1) % states.length];
      safeSetItem('sdu_gear_v35', JSON.stringify(gearInventory));
      renderGearInventory();
      showToast(`${gearInventory[idx].id} status updated`);
    }
    function renderGearInventory() {
      const tbody = document.getElementById('gear-inventory-body');
      if (!tbody) return;
      tbody.innerHTML = gearInventory.map((g, idx) => {
        const pill = g.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : (g.status === 'Needs Attention' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300');
        return `<tr><td class="text-xs font-bold text-blue-600">${g.id}</td><td class="font-bold text-main">${g.name}</td><td class="text-sec">${g.role}</td><td class="text-sec max-w-md">${g.note}</td><td><button onclick="toggleGearStatus(${idx})" class="px-3 py-1.5 rounded-full border text-xs font-bold ${pill} transition">${g.status}</button></td></tr>`;
      }).join('');
    }

    let activeRepoFilename = 'README.md';
    function exportStateJSON() { navigator.clipboard?.writeText(JSON.stringify({ eventsList, checkedItems, customStrategies, gearInventory }, null, 2)); showToast('Exported JSON state!'); }
    function openImportModal() { const m = document.getElementById('modal-import'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeImportModal() { const m = document.getElementById('modal-import'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function confirmImportJSON() {
      try {
        const data = JSON.parse(document.getElementById('import-json-textarea').value);
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid root');
        if (Array.isArray(data.eventsList) && data.eventsList.length) { eventsList = data.eventsList; saveEvents(); renderPlanner(); }
        if (data.checkedItems && typeof data.checkedItems === 'object') { checkedItems = data.checkedItems; safeSetItem('sdu_checked_v35', JSON.stringify(checkedItems)); renderChecklist(); }
        if (Array.isArray(data.customStrategies)) { customStrategies = data.customStrategies; safeSetItem('sdu_strats_v35', JSON.stringify(customStrategies)); renderStrategies(); }
        if (Array.isArray(data.gearInventory)) { gearInventory = data.gearInventory; safeSetItem('sdu_gear_v35', JSON.stringify(gearInventory)); renderGearInventory(); }
        closeImportModal();
        showToast('Validated & restored Department Vault state');
      } catch (e) {
        showToast('Invalid JSON backup structure');
      }
    }
    function downloadStandaloneHTML() {
      const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'index.html'; a.click();
    }



    // =========================================================================
    // FULL 32-CHANNEL CATALOG, FILTERING & SMART SERVICE PATCH GENERATOR
    // =========================================================================
    const ALL_32_INPUTS = [
      { ch: 1, key: 'kick', name: 'Kick Drum In', mic: 'Dynamic Kick Mic', prefPort: 1, hpf: '35 Hz', pol: '0°', gateKey: '145 Hz', bus: 'Sub + Main L/R', defaultOn: true },
      { ch: 2, key: 'ch02', name: 'Kick Sub / Out', mic: 'Sub/Boundary Mic', prefPort: 23, hpf: '30 Hz', pol: '0°', gateKey: '60 Hz', bus: 'Sub + Main L/R', defaultOn: false },
      { ch: 3, key: 'tom1', name: '1st High Rack Tom', mic: 'Clip-On Dynamic', prefPort: 3, hpf: '95 Hz', pol: 'Ø ON (-180°)', gateKey: '170 Hz', bus: 'Drums Sub + L/R', defaultOn: true },
      { ch: 4, key: 'tom2', name: '2nd Mid Rack Tom', mic: 'Clip-On Dynamic', prefPort: 4, hpf: '80 Hz', pol: '0°', gateKey: '140 Hz', bus: 'Drums Sub + L/R', defaultOn: true },
      { ch: 5, key: 'ch05', name: '3rd Low Rack Tom', mic: 'Clip-On Dynamic', prefPort: 24, hpf: '70 Hz', pol: '0°', gateKey: '120 Hz', bus: 'Drums Sub + L/R', defaultOn: false },
      { ch: 6, key: 'floortom', name: 'Floor Tom', mic: 'Dynamic Tom Mic', prefPort: 6, hpf: '55 Hz', pol: 'Ø ON (-180°)', gateKey: '95 Hz (Blocks Snare)', bus: 'Drums Sub + L/R', defaultOn: true },
      { ch: 7, key: 'bass', name: 'Bass Guitar DI', mic: 'Active/Passive DI', prefPort: 7, hpf: '38 Hz', pol: 'Ø ON (-180°)', gateKey: 'Exp -52dB', bus: 'Aux 10 Sub + L/R', defaultOn: true },
      { ch: 8, key: 'keys1', name: 'Keys 1 (Main Piano)', mic: 'Mono/Stereo DI', prefPort: 8, hpf: '120 Hz', pol: '0°', gateKey: 'OFF', bus: 'Band Bus (Pan L45)', defaultOn: true },
      { ch: 9, key: 'keys2', name: 'Keys 2 (Aux Synth/Brass)', mic: 'DI (-20dB Pad)', prefPort: 9, hpf: '140 Hz', pol: '0°', gateKey: 'OFF', bus: 'Band Bus (Pan R45)', defaultOn: true },
      { ch: 10, key: 'guitar', name: 'Electric Guitar', mic: 'Amp Cab Dynamic', prefPort: 10, hpf: '110 Hz', pol: '0°', gateKey: 'Exp -48dB', bus: 'Band Bus (Pan R35)', defaultOn: true },
      { ch: 11, key: 'ch11', name: 'Snare Drum Top', mic: 'Cardioid Dynamic', prefPort: 11, hpf: '100 Hz', pol: '0°', gateKey: 'Exp 190 Hz', bus: 'Drums + Plate FX', defaultOn: true },
      { ch: 12, key: 'ch12', name: 'Hi-Hat / Overhead L', mic: 'Condenser (+48V)', prefPort: 12, hpf: '350 Hz', pol: '0°', gateKey: 'OFF', bus: 'Drums (Pan L35)', defaultOn: true },
      { ch: 13, key: 'lv', name: 'Lead Vocal (RED Tape)', mic: 'Primary SM58/Beta58', prefPort: 13, hpf: '80 Hz', pol: '0°', gateKey: 'Soft Exp 2:1', bus: 'Main L/R + Hall FX', defaultOn: true },
      { ch: 14, key: 'bv1', name: 'BV 1 Soprano (BLUE Tape)', mic: 'Cardioid Dynamic', prefPort: 14, hpf: '135 Hz', pol: '0°', gateKey: 'Exp 3:1 (-36dB)', bus: 'BV DCA 2 (Pan L25)', defaultOn: true },
      { ch: 15, key: 'ch15', name: 'BV 2 Alto (GREEN Tape)', mic: 'Cardioid Dynamic', prefPort: 15, hpf: '130 Hz', pol: '0°', gateKey: 'Exp 3:1 (-36dB)', bus: 'BV DCA 2 (Pan R25)', defaultOn: true },
      { ch: 16, key: 'bv3', name: 'BV 3 Tenor (YELLOW Tape)', mic: 'Cardioid Dynamic (+6dB)', prefPort: 16, hpf: '130 Hz', pol: '0°', gateKey: 'Exp 3:1 (-38dB)', bus: 'BV DCA 2 (Pan R15)', defaultOn: true },
      { ch: 17, key: 'bv4', name: 'BV 4 Aux (PURPLE Tape)', mic: 'Cardioid Dynamic', prefPort: 17, hpf: '135 Hz', pol: '0°', gateKey: 'Exp 3:1 (-38dB)', bus: 'BV DCA 2 (Pan L15)', defaultOn: true },
      { ch: 18, key: 'ch18', name: '[BROKEN FADER 18 BYPASS]', mic: 'DO NOT ASSIGN FADER 18', prefPort: null, hpf: 'BYPASS', pol: '—', gateKey: 'Route Port 18 → Ch 22', bus: 'Hardware Bypass', defaultOn: false, brokenFader: true },
      { ch: 19, key: 'ch19', name: 'Pastor Wireless Mic', mic: 'Wireless Headset/Handheld', prefPort: 25, hpf: '125 Hz', pol: '0°', gateKey: 'Soft Exp 2:1', bus: 'Speech DCA 8 (Dry)', defaultOn: true },
      { ch: 20, key: 'ch20', name: 'Pulpit Gooseneck Mic', mic: 'Condenser (+48V)', prefPort: 26, hpf: '135 Hz', pol: '0°', gateKey: 'Soft Exp 2:1', bus: 'Speech DCA 8 (Dry)', defaultOn: true },
      { ch: 21, key: 'ch21', name: 'MC / Host Handheld', mic: 'Wireless/Wired Dynamic', prefPort: 27, hpf: '120 Hz', pol: '0°', gateKey: 'Soft Exp 2:1', bus: 'Speech DCA 8 (Dry)', defaultOn: false },
      { ch: 22, key: 'ch22', name: 'Saxophone / Brass (Ch 18 Rescue)', mic: 'Bell Clip / Dynamic', prefPort: 18, hpf: '130 Hz', pol: '0°', gateKey: 'Exp -40dB', bus: 'Band Bus (Pan L35)', defaultOn: true },
      { ch: 23, key: 'ch23', name: 'Acoustic Guitar DI', mic: 'Active DI Box', prefPort: 22, hpf: '110 Hz', pol: '0°', gateKey: 'Exp -48dB', bus: 'Band Bus (Pan L30)', defaultOn: false },
      { ch: 24, key: 'ch24', name: 'BV 5 Choir Soprano 2', mic: 'Cardioid Dynamic', prefPort: 28, hpf: '140 Hz', pol: '0°', gateKey: 'Exp 3:1', bus: 'BV DCA 2 (Pan L40)', defaultOn: false },
      { ch: 25, key: 'ch25', name: 'BV 6 Choir Alto 2', mic: 'Cardioid Dynamic', prefPort: 29, hpf: '135 Hz', pol: '0°', gateKey: 'Exp 3:1', bus: 'BV DCA 2 (Pan R40)', defaultOn: false },
      { ch: 26, key: 'ch26', name: 'BV 7 Choir Tenor 2', mic: 'Cardioid Dynamic', prefPort: 31, hpf: '130 Hz', pol: '0°', gateKey: 'Exp 3:1', bus: 'BV DCA 2 (Pan L18)', defaultOn: false },
      { ch: 27, key: 'ch27', name: 'Talking Drum / Congas', mic: 'Dynamic Percussion Mic', prefPort: null, hpf: '75 Hz', pol: '0°', gateKey: 'Exp -36dB', bus: 'Drums Bus (Pan R30)', defaultOn: false },
      { ch: 28, key: 'ch28', name: 'Snare Bottom Wires', mic: 'Dynamic Cardioid', prefPort: null, hpf: '160 Hz', pol: 'Ø ON (-180°)', gateKey: 'Key 200 Hz', bus: 'Drums Bus', defaultOn: false },
      { ch: 29, key: 'ch29', name: 'Overhead Right Condenser', mic: 'Condenser (+48V)', prefPort: null, hpf: '350 Hz', pol: '0°', gateKey: 'OFF', bus: 'Drums (Pan R35)', defaultOn: false },
      { ch: 30, key: 'ch30', name: 'Synth Bass / Key Bass', mic: 'Local Console In 30 / DI', prefPort: null, hpf: '35 Hz', pol: '0°', gateKey: 'OFF', bus: 'Sub + Main L/R', defaultOn: false },
      { ch: 31, key: 'ch31', name: 'Laptop / Media Playback', mic: 'Local Stereo DI / USB', prefPort: null, hpf: '45 Hz', pol: '0°', gateKey: 'OFF', bus: 'Main L/R', defaultOn: true },
      { ch: 32, key: 'ch32', name: 'FOH Talkback / Room Mic', mic: 'Local FOH Rear In 32', prefPort: null, hpf: '150 Hz', pol: '0°', gateKey: 'Exp -40dB', bus: 'Monitors Only (No L/R)', defaultOn: true }
    ];

    const HEALTHY_SNAKE_PORTS = [1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 31];
    let selectedServiceChannels = JSON.parse(safeGetItem('agcm_sel_ch_v5') || 'null') || ALL_32_INPUTS.filter(x => x.defaultOn).map(x => x.ch);

    function filterChannelButtons(grp) {
      ['ALL', 'DRUMS', 'BAND', 'VOCALS', 'SPEECH'].forEach(g => {
        const b = document.getElementById('ch-grp-' + g);
        if (b) {
          b.className = (g === grp)
            ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white'
            : 'px-3 py-1.5 rounded-lg text-xs font-bold btn-subtle';
        }
      });
      document.querySelectorAll('#channel-selector-bar .ch-btn').forEach(btn => {
        const bGrp = btn.getAttribute('data-grp') || 'ALL';
        btn.style.display = (grp === 'ALL' || bGrp === grp) ? 'inline-block' : 'none';
      });
    }

    function computeServicePatchAssignments() {
      const usedPorts = new Set();
      const assignments = [];
      const activeList = ALL_32_INPUTS.filter(item => selectedServiceChannels.includes(item.ch) && !item.brokenFader);

      // Pass 1: Honor preferred healthy stagebox port if available
      activeList.forEach(item => {
        if (item.prefPort && HEALTHY_SNAKE_PORTS.includes(item.prefPort) && !usedPorts.has(item.prefPort)) {
          usedPorts.add(item.prefPort);
          assignments.push({ ...item, assignedPort: item.prefPort, mode: item.prefPort === item.ch ? '1:1 Direct' : `Soft-Patch (Analog ${item.prefPort} → Ch ${item.ch})` });
        } else {
          assignments.push({ ...item, assignedPort: null, mode: '' });
        }
      });

      // Pass 2: Allocate remaining active channels to next available healthy stagebox port or Local FOH Rear Input
      assignments.forEach(a => {
        if (a.assignedPort === null) {
          if (a.ch >= 30) {
            a.assignedPort = `Local Rear In ${a.ch}`;
            a.mode = `Console Local Input ${a.ch} (Skips Dead Snake Port ${a.ch === 30 || a.ch === 32 ? a.ch : ''})`;
          } else {
            const freePort = HEALTHY_SNAKE_PORTS.find(p => !usedPorts.has(p));
            if (freePort) {
              usedPorts.add(freePort);
              a.assignedPort = freePort;
              a.mode = freePort === a.ch ? '1:1 Direct' : `Soft-Patch (Analog ${freePort} → Ch ${a.ch})`;
            } else {
              a.assignedPort = `Local Rear In ${a.ch}`;
              a.mode = `Console Local Input ${a.ch}`;
            }
          }
        }
      });

      return { assignments, usedPortsCount: usedPorts.size };
    }

    function toggleServiceChannelSelection(chNum) {
      const item = ALL_32_INPUTS.find(x => x.ch === chNum);
      if (item && item.brokenFader) {
        showToast('Physical Fader 18 is faulty — use Ch 22 Rescue Strip!');
        return;
      }
      if (selectedServiceChannels.includes(chNum)) {
        selectedServiceChannels = selectedServiceChannels.filter(c => c !== chNum);
      } else {
        selectedServiceChannels.push(chNum);
        selectedServiceChannels.sort((a, b) => a - b);
      }
      safeSetItem('agcm_sel_ch_v5', JSON.stringify(selectedServiceChannels));
      renderServicePatchBuilder();
    }

    function applyPatchPreset(preset) {
      if (preset === 'full_sunday') {
        selectedServiceChannels = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 31, 32];
      } else if (preset === 'midweek_compact') {
        selectedServiceChannels = [1, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20];
      } else if (preset === 'acoustic_prayer') {
        selectedServiceChannels = [7, 8, 13, 14, 15, 19, 20, 23];
      } else if (preset === 'all_31') {
        selectedServiceChannels = ALL_32_INPUTS.filter(x => !x.brokenFader).map(x => x.ch);
      }
      safeSetItem('agcm_sel_ch_v5', JSON.stringify(selectedServiceChannels));
      renderServicePatchBuilder();
      showToast('Applied service input preset');
    }

    function renderServicePatchBuilder() {
      const selGrid = document.getElementById('service-input-selector-grid');
      const tbody = document.getElementById('generated-service-patch-tbody');
      if (!selGrid || !tbody) return;

      const { assignments, usedPortsCount } = computeServicePatchAssignments();
      const freeCount = Math.max(0, HEALTHY_SNAKE_PORTS.length - usedPortsCount);

      const cntBadge = document.getElementById('patch-active-count-badge');
      const freeBadge = document.getElementById('patch-spare-ports-badge');
      if (cntBadge) cntBadge.textContent = `${assignments.length} Inputs Active`;
      if (freeBadge) freeBadge.textContent = `${freeCount} / 25 Healthy Snake Ports Free`;

      selGrid.innerHTML = ALL_32_INPUTS.map(item => {
        const isSelected = selectedServiceChannels.includes(item.ch) && !item.brokenFader;
        if (item.brokenFader) {
          return `
            <button type="button" onclick="toggleServiceChannelSelection(18)" class="p-2.5 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-left opacity-80 cursor-not-allowed">
              <div class="flex items-center justify-between text-[11px] font-extrabold text-amber-800 dark:text-amber-300">
                <span>CH 18</span><span>BYPASS</span>
              </div>
              <div class="text-xs font-bold text-amber-900 dark:text-amber-200 truncate mt-1">Broken Fader → Ch 22</div>
            </button>
          `;
        }
        return `
          <button type="button" onclick="toggleServiceChannelSelection(${item.ch})" class="p-2.5 rounded-xl border text-left transition ${
            isSelected
              ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/50 text-main shadow-sm'
              : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-mut hover:border-blue-400'
          }">
            <div class="flex items-center justify-between text-[11px] font-extrabold">
              <span class="${isSelected ? 'text-blue-600' : 'text-mut'}">CH ${String(item.ch).padStart(2, '0')}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-mut'}">${isSelected ? 'ON' : 'OFF'}</span>
            </div>
            <div class="text-xs font-bold truncate mt-1 ${isSelected ? 'text-main' : 'text-mut'}">${item.name}</div>
          </button>
        `;
      }).join('');

      tbody.innerHTML = assignments.map(a => {
        const isSoft = String(a.mode).includes('Soft-Patch');
        const portBadge = typeof a.assignedPort === 'number'
          ? `<span class="px-2.5 py-1 rounded-lg font-extrabold text-xs ${isSoft ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200'}">Stagebox Port ${String(a.assignedPort).padStart(2, '0')}</span>`
          : `<span class="px-2.5 py-1 rounded-lg font-extrabold text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200">${a.assignedPort}</span>`;
        return `
          <tr>
            <td class="font-extrabold text-blue-600">Ch ${String(a.ch).padStart(2, '0')}</td>
            <td>
              <div class="font-bold text-main">${a.name}</div>
              <div class="text-xs text-mut">${a.mic}</div>
            </td>
            <td>${portBadge}</td>
            <td class="text-xs font-semibold ${isSoft ? 'text-amber-600 font-bold' : 'text-sec'}">${a.mode}</td>
            <td class="text-xs text-sec">HPF ${a.hpf} • Pol: ${a.pol} • Gate: ${a.gateKey}</td>
            <td class="text-xs font-semibold text-main">${a.bus}</td>
          </tr>
        `;
      }).join('');
    }

    function downloadServicePatchCSV() {
      const ev = getActiveEvent();
      const { assignments } = computeServicePatchAssignments();
      const rows = [
        ['AGCM - KNUST Technical Department Service Patch Sheet'],
        ['Event', ev.name, 'Venue', ev.venue, 'Time', ev.time],
        ['Dead Stagebox Ports (DO NOT USE)', 'Ports 2, 5, 19, 20, 21, 30, 32'],
        ['Console Hardware Bypass', 'Leave Physical Ch 18 Fader & Mix 2 Unassigned'],
        [],
        ['32SX Channel', 'Input Source', 'Mic / DI', 'Stagebox Port', '32SX Digital Patch Mode', 'HPF', 'Polarity', 'Gate Key', 'Bus Routing']
      ];
      assignments.forEach(a => {
        rows.push([
          `Ch ${String(a.ch).padStart(2, '0')}`,
          a.name,
          a.mic,
          typeof a.assignedPort === 'number' ? `Port ${String(a.assignedPort).padStart(2, '0')}` : a.assignedPort,
          a.mode,
          a.hpf,
          a.pol,
          a.gateKey,
          a.bus
        ]);
      });
      const csvContent = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `AGCM_Patch_${ev.name.replace(/[^a-zA-Z0-9]+/g, '_')}.csv`;
      a.click();
      showToast('Downloaded Service Patch CSV');
    }

    function downloadServicePatchHTML() {
      const ev = getActiveEvent();
      const { assignments } = computeServicePatchAssignments();
      const rowsHtml = assignments.map(a => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;color:#1d4ed8;">Ch ${String(a.ch).padStart(2, '0')}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;"><strong>${a.name}</strong><br><small style="color:#64748b">${a.mic}</small></td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;">${typeof a.assignedPort === 'number' ? 'Stagebox Port ' + String(a.assignedPort).padStart(2, '0') : a.assignedPort}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">${a.mode}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">HPF ${a.hpf} | Pol ${a.pol} | ${a.gateKey}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">${a.bus}</td>
        </tr>
      `).join('');

      const docHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AGCM Patch Sheet — ${ev.name}</title>
      <style>body{font-family:Inter,system-ui,sans-serif;padding:32px;color:#0f172a;max-width:1050px;margin:0 auto;}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px;}th{background:#f1f5f9;padding:10px 12px;border:1px solid #cbd5e1;text-align:left;text-transform:uppercase;font-size:11px;}.warn{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 16px;border-radius:10px;margin-top:12px;font-size:13px;}</style></head>
      <body>
        <h1 style="margin:0;font-size:22px;">AGCM - KNUST Technical Department — Official Service Patch Sheet</h1>
        <p style="margin:4px 0 0;color:#475569;font-size:14px;"><strong>Service:</strong> ${ev.name} &nbsp;|&nbsp; <strong>Venue:</strong> ${ev.venue} &nbsp;|&nbsp; <strong>Schedule:</strong> ${ev.time}</p>
        <div class="warn"><strong>HARDWARE GUARDRAILS:</strong> Do NOT plug into Dead AudioLink Snake Ports <strong>2, 5, 19, 20, 21, 30, 32</strong>. Leave Physical Console <strong>Fader 18</strong> and <strong>Mix 2</strong> unassigned. Vocal Mic Tape: <strong>RED</strong>=LV (Ch 13), <strong>BLUE</strong>=BV1 (Ch 14), <strong>GREEN</strong>=BV2 (Ch 15), <strong>YELLOW</strong>=BV3 (Ch 16), <strong>PURPLE</strong>=BV4 (Ch 17).</div>
        <table><thead><tr><th>32SX Ch</th><th>Input Source & Mic</th><th>Physical Stagebox Port</th><th>32SX Digital Patch</th><th>HPF / Polarity / Gate</th><th>Bus & Monitor</th></tr></thead><tbody>${rowsHtml}</tbody></table>
      </body></html>`;
      const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `AGCM_Patch_${ev.name.replace(/[^a-zA-Z0-9]+/g, '_')}.html`;
      a.click();
      showToast('Downloaded Printable Service Patch Sheet');
    }


    function previewHomeGalleryPhoto(input) {
      if (!input || !input.files || !input.files[0]) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.getElementById('gallery-preview-img');
        const title = document.getElementById('gallery-preview-title');
        if (img) {
          img.src = e.target.result;
          img.className = 'w-full h-28 object-cover rounded-lg mb-3';
        }
        if (title) title.textContent = file.name.replace(/\.[^/.]+$/, '');
        showToast('Loaded photo preview on Home page!');
      };
      reader.readAsDataURL(file);
    }

    function downloadDeptDoc(docKey) {
      const docs = {
        conveyance_sop: {
          fname: 'AGCM_7_Venue_Conveyance_and_Setup_SOP.md',
          content: `# AGCM - KNUST Technical Department: Equipment Conveyance & Venue Setup SOP\n\n## 1. Approved KNUST Campus Venues\n- Great Hall (48.1m x 28.0m Main Auditorium)\n- Great Hall Foyer\n- Independence Hall Dining Hall\n- Queens Hall Dining Hall\n- Africa Hall Dining Hall\n- Katanga Hall Dining Hall\n- CCB Auditorium\n\n## 2. Pre-Transport Conveyance Protocol\n1. Coil all XLR and power looms using the Over-Under method; never wrap cables tightly around elbows.\n2. Secure PreSonus StudioLive 32SX inside its padded flight case before loading into the conveyance vehicle.\n3. Load heavy Vatasa VS-215P cabinets and subwoofers on the truck floor first; place mic cases and console on top.\n\n## 3. Power-Up & Power-Down Sequence\n- **Power-Up**: Console (32SX) -> DSP (Behringer DX2496) -> Power Amplifiers (Vatasa IDOL 13 LAST).\n- **Power-Down**: Power Amplifiers FIRST -> DSP -> Console LAST.`
        },
        training_manual: {
          fname: 'AGCM_Audio_Recruit_Training_Manual.md',
          content: `# AGCM - KNUST Technical Department: Audio Engineering Training Curriculum\n\n## Module 1: Signal Flow & Digital Gain Staging (-18 dBFS)\n- Analog Microphone -> AudioLink 32x8 Stagebox -> PreSonus XMAX Preamp -> A/D Converter (-18 dBFS target) -> Fat Channel (HPF, Gate, Comp, EQ) -> Subgroups/Main L/R -> Behringer DX2496 Crossover -> Vatasa IDOL 13 Amplifiers -> Loudspeakers.\n\n## Module 2: Subtractive EQ & Frequency Unmasking\n- Always cut mud (200-400 Hz) and nasal boxiness (500-800 Hz) before applying additive boosts.\n- Engage High-Pass Filters on every non-sub channel.\n\n## Module 3: Stage Mic Color-Coding & 5-Sec Swap Recovery\n- RED = Lead Vocal (Ch 13), BLUE = BV1 (Ch 14), GREEN = BV2 (Ch 15), YELLOW = BV3 (Ch 16), PURPLE = BV4 (Ch 17).\n- If LV swaps mics with a BV on stage, open HOME -> Input -> Digital Patching on the 32SX and swap their Analog Input Sources in 5 seconds.`
        },
        rig_spec: {
          fname: 'AGCM_32SX_and_DX2496_Master_Config.md',
          content: `# AGCM - KNUST Master Hardware & DSP Specification\n\n## 1. Behringer DX2496 Crossover & Limiter Guardrails\n- Subwoofers: HPF 38 Hz (LR24) to LPF 90 Hz (LR24) fed via Aux 10 Center Sub Bus.\n- Stacked Line Arrays & Vatasa VS-215P Tops: HPF 90 Hz (LR24).\n- Vatasa IDOL 13 Amplifier (2x1300W): Attenuate input -3 dB to protect 1000W AES VS-215P drivers.\n\n## 2. AudioLink 32x8 Snake & 32SX Hardware Workarounds\n- Dead Stagebox Ports (Tape Over): 2, 5, 19, 20, 21, 30, 32 (25 healthy ports active).\n- Broken Console Faders: Leave Physical Channel 18 (route to Ch 22) and Mix 2 unassigned.`
        }
      };
      const d = docs[docKey];
      if (!d) return;
      const blob = new Blob([d.content], { type: 'text/markdown;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = d.fname;
      a.click();
      showToast('Downloaded ' + d.fname);
    }

    function updateMasteringSim() {
      const driveEl = document.getElementById('slider-mast-drive');
      const compEl = document.getElementById('slider-mast-comp');
      const widthEl = document.getElementById('slider-mast-width');
      const ceilEl = document.getElementById('slider-mast-ceiling');
      if (!driveEl || !compEl || !widthEl || !ceilEl) return;

      const drive = parseFloat(driveEl.value);
      const comp = parseFloat(compEl.value);
      const width = parseInt(widthEl.value, 10);
      const ceil = parseFloat(ceilEl.value);

      document.getElementById('lbl-mast-drive').textContent = (drive >= 0 ? '+' : '') + drive.toFixed(1) + ' dB';
      document.getElementById('lbl-mast-comp').textContent = comp.toFixed(1) + ':1 ' + (comp <= 2.5 ? '(Glue)' : '(Dense)');
      document.getElementById('lbl-mast-width').textContent = width + '%';
      document.getElementById('lbl-mast-ceiling').textContent = ceil.toFixed(1) + ' dBTP';

      const gr = -Math.min(6.5, Math.max(0.5, (drive + 6) * 0.18 * (comp / 2)));
      const lufs = Math.min(-6.5, Math.max(-22.0, -17.5 + drive + (gr * 0.35)));
      document.getElementById('mast-lufs-readout').textContent = lufs.toFixed(1) + ' LUFS';
      document.getElementById('mast-gr-readout').textContent = gr.toFixed(1) + ' dB';
      document.getElementById('mast-tp-readout').textContent = ceil.toFixed(1) + ' dBTP';

      const pct = Math.min(98, Math.max(18, Math.round(((lufs + 24) / 18) * 100)));
      const fill = document.getElementById('mast-meter-fill');
      if (fill) fill.style.width = pct + '%';

      const verdict = document.getElementById('mast-profile-verdict');
      if (verdict) {
        if (lufs > -10.5) {
          verdict.textContent = 'Hot / Competitive Loudness — watch for transient squashing on drums.';
          verdict.className = 'text-amber-600 font-bold';
        } else if (lufs >= -15.0) {
          verdict.textContent = 'Optimal Streaming & Broadcast Sweet Spot (-14 to -12 LUFS) with clean punch.';
          verdict.className = 'text-emerald-600 font-bold';
        } else {
          verdict.textContent = 'Wide Dynamic / Sermon Broadcast Headroom (-16 LUFS range).';
          verdict.className = 'text-blue-600 font-bold';
        }
      }
    }

    function applyMasteringPreset(mode) {
      const driveEl = document.getElementById('slider-mast-drive');
      const compEl = document.getElementById('slider-mast-comp');
      const widthEl = document.getElementById('slider-mast-width');
      const ceilEl = document.getElementById('slider-mast-ceiling');
      if (!driveEl) return;
      if (mode === 'streaming') {
        driveEl.value = 4.2; compEl.value = 2.0; widthEl.value = 112; ceilEl.value = -1.0;
      } else if (mode === 'sermon') {
        driveEl.value = 2.0; compEl.value = 1.5; widthEl.value = 100; ceilEl.value = -1.5;
      } else {
        driveEl.value = 6.5; compEl.value = 3.0; widthEl.value = 118; ceilEl.value = -0.8;
      }
      updateMasteringSim();
      showToast('Loaded ' + mode.replace('_', ' ') + ' mastering chain preset');
    }

    window.addEventListener('DOMContentLoaded', () => {
      updateMasteringSim();
      const savedTheme = safeGetItem('sdu_theme_v35');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-icon-sync').forEach(el => { el.textContent = savedTheme === 'light' ? '☀️' : '🌙'; });
      }
      renderPlanner();
      renderForensicCharts();
      renderBeforeAfterChart('lv');
      renderForensicTable();
      const savedCh = safeGetItem('sdu_active_ch') || 'lv';
      selectChannel(savedCh);
      renderChecklist();
      renderMatrix();
      renderSnakeGrid();
      renderServicePatchBuilder();
      updateAcousticCalc();
      updateBPMCalc(76);
      renderStrategies();
      renderGearInventory();
      
      switchView(currentView);
    });
  
    (function(){function go(){var v=location.hash.slice(1);if(v&&document.getElementById('view-'+v))switchView(v);}go();window.addEventListener('hashchange',go);})();

window.addEventListener('agcm-theme-change', () => {
  try { drawEQCurve(); } catch (e) {}
});

