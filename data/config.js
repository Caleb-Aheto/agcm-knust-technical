/* =========================================================
   AGCM - KNUST Audio Portal Configuration & Engineering Data
   Single source of truth for console, venue, AudioLink snake,
   DSP, crew roles, and full 32-channel master patch presets.
   ========================================================= */
(function () {
  const C = {
    accessGate: {
      enabled: true,
      passcodeHash: "96d57a668a1eb0c38b79d28ec8b0a05dbe5180a1ab6791d01fb01ebb394e060f",
      sessionTtlMs: 12 * 60 * 60 * 1000,
      hint: "Enter the AGCM-KNUST Technical Lead access code to unlock the workspace."
    },
    siteUrl: "https://agcm-knust-technical.vercel.app",
    departmentName: "AGCM - KNUST Technical Department",
    consoleShort: "Console",
    consoleName: "FOH Console",
    consoleModel: "FOH Mixing Console",
    consoleFull: "Digital FOH Mixing Console",
    channelCount: 32,
    brokenFaderCh: 18,
    rescueCh: 22,
    brokenMix: "MIX 2",
    subAuxBus: "MIX 1 (Subs)",
    captureApp: "PreSonus Capture",
    sceneSlot: "AGCM_GREAT_HALL_BASE",

    snakeBrand: "AudioLink",
    snakeSpec: "32×8",
    snakeTotalPorts: 32,
    deadSnakePorts: [18, 19, 20, 21, 30, 31, 32],
    healthySnakePorts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 28, 29],

    dspShort: "DX2496",
    dspFull: "Behringer DX2496",
    ampModel: "Vatasa IDOL 13",
    topSpeaker: "VS-215P",

    primaryVenue: "Great Hall",
    midweekVenue: "Independence Hall Dining Hall",
    venues: [
      "Great Hall",
      "Great Hall Foyer",
      "Independence Hall Dining Hall",
      "Queens Hall Dining Hall",
      "Africa Hall Dining Hall",
      "Katanga Hall Dining Hall",
      "CCB Auditorium"
    ],

    quickDistances: [
      { label: "Kick→Tom1 (1.0m)", m: 1.0 },
      { label: "Kick→FloorTom (1.4m)", m: 1.4 },
      { label: "Stage Depth (3.2m)", m: 3.2 },
      { label: "Mid-Hall Delay Fill (18.5m)", m: 18.5 },
      { label: "Back Wall (48.1m)", m: 48.1 }
    ],

    defaultCrewRoles: [
      { role: "FOH Console Engineer", person: "Assigned FOH Console Lead" },
      { role: "Monitor / Stage Engineer", person: "Assign Tech" },
      { role: "Stage / Mic Runner", person: "Assign Runner" },
      { role: "Recording & Mastering Lead", person: "Assign Tech" },
      { role: "Setup & Conveyance Lead", person: "Assign Crew" }
    ]
  };

  const DEFAULT_EVENTS = [
    {
      id: 'ev_sunday',
      name: 'Sunday Main Service',
      type: 'Sunday Service',
      venue: C.primaryVenue,
      time: 'Call: 06:30 AM • Start: 08:30 AM',
      notes: 'Verify Physical AudioLink Patch (Ports 1–17, 22–27, 29→Ch 32; Ports 18–21 & 30–32 BROKEN) and 15-sec vocal scratch check.',
      crew: [
        { role: 'FOH Console Engineer', person: 'Assigned FOH Console Lead' },
        { role: 'Monitor / Stage Engineer', person: 'Assign Tech' },
        { role: 'Stage / Mic Runner', person: 'Assign Runner' },
        { role: 'Recording & Mastering Lead', person: 'Assign Tech' },
        { role: 'Setup & Conveyance Lead', person: 'Assign Crew' },
        { role: 'Power / Amp Rack', person: 'Assign Power Tech' }
      ],
      cues: [
        { time: '06:30 AM', seg: 'Rig Power-Up & Line Check', lead: 'Technical Crew', audio: `${C.dspShort} 90Hz check, 15s vocal scratch test, Ø on Snare Btm / Tom 1 / Floor Tom / Bass`, media: 'Verify Capture multitrack & truck unload', status: 'Done' },
        { time: '08:30 AM', seg: 'Opening Prayer & Intercession', lead: 'Prayer Lead', audio: 'Unmute Pastor (Ch 16) / Lead Vocal (Ch 17); keep BV DCA muted', media: 'Record clean speech stem; check stage handoffs', status: 'Upcoming' },
        { time: '08:50 AM', seg: 'Praise & Worship', lead: 'Worship Team', audio: 'Unmute Full Band (Ch 1–15) + LV (Ch 17) + BVs (Ch 22–27); balance Main/Aux Keys', media: 'Monitor multitrack peaks; prep post-service mix', status: 'Upcoming' },
        { time: '09:35 AM', seg: 'Word / Sermon', lead: 'Speaker', audio: 'Mute BV DCA & Band; focus Pastor (Ch 16) EQ + Comp', media: 'Mark sermon track split for editing/mastering', status: 'Upcoming' },
        { time: '10:30 AM', seg: 'Altar Call & Ministry', lead: 'Pastor + Main Keys', audio: 'Main Keys (Ch 11) Soft Pad + Pastor (Ch 16) / LV (Ch 17)', media: 'Stop Capture safely; prep cable coiling & conveyance', status: 'Upcoming' }
      ]
    },
    {
      id: 'ev_midweek',
      name: 'Midweek Word & Worship',
      type: 'Midweek Service',
      venue: C.midweekVenue,
      time: 'Call: 05:00 PM • Start: 06:30 PM',
      notes: 'Compact band setup (Kick In, Snare Top, Rack Tom 1, Floor Tom, Bass, Electric Guitar, Main/Aux Keys, Pastor, LV + BVs).',
      crew: [
        { role: 'FOH Console Engineer', person: 'Assigned FOH Console Lead' },
        { role: 'Stage / Mic Runner', person: 'Assign Runner' },
        { role: 'Recording & Mastering Lead', person: 'Assign Tech' },
        { role: 'Setup & Conveyance Lead', person: 'Assign Crew' }
      ],
      cues: [
        { time: '05:00 PM', seg: 'Soundcheck & Color-Tape Check', lead: 'Technical Crew', audio: 'Verify LV (Ch 17) & BVs (Ch 22–25) + Main Keys (Ch 11) gain', media: 'Confirm Capture armed & mic cases accounted for', status: 'Upcoming' },
        { time: '06:30 PM', seg: 'Worship Session', lead: 'Worship Team', audio: 'LV (Ch 17) + BVs (Ch 22–25) + Main Keys (Ch 11) + Bass (Ch 9)', media: 'Record stereo + multitrack stems for mastering', status: 'Upcoming' },
        { time: '07:10 PM', seg: 'Bible Study / Word', lead: 'Minister', audio: 'Pastor Mic (Ch 16) + Main Keys muted', media: 'Split sermon track; pack spare mics after service', status: 'Upcoming' }
      ]
    }
  ];

  // Physical AudioLink Patch List (Inputs 1–32)
  const SNAKE_MAP = {
    1:  { label: 'Kick In',         ch: 'Ch 1',          status: 'ACTIVE' },
    2:  { label: 'Kick Out',        ch: 'Ch 2',          status: 'ACTIVE' },
    3:  { label: 'Snare Top',       ch: 'Ch 3',          status: 'ACTIVE' },
    4:  { label: 'Snare Bottom',    ch: 'Ch 4',          status: 'ACTIVE' },
    5:  { label: 'Rack Tom 1',      ch: 'Ch 5',          status: 'ACTIVE' },
    6:  { label: 'Rack Tom 2',      ch: 'Ch 6',          status: 'ACTIVE' },
    7:  { label: 'Rack Tom 3',      ch: 'Ch 7',          status: 'ACTIVE' },
    8:  { label: 'Floor Tom',       ch: 'Ch 8',          status: 'ACTIVE' },
    9:  { label: 'Bass Guitar',     ch: 'Ch 9',          status: 'ACTIVE' },
    10: { label: 'Electric Guitar', ch: 'Ch 10',         status: 'ACTIVE' },
    11: { label: 'Main Keys',       ch: 'Ch 11',         status: 'ACTIVE' },
    12: { label: 'Aux Keys',        ch: 'Ch 12',         status: 'ACTIVE' },
    13: { label: 'Saxophone',       ch: 'Ch 13',         status: 'ACTIVE' },
    14: { label: 'Trumpet',         ch: 'Ch 14',         status: 'ACTIVE' },
    15: { label: 'Loops / Stems',   ch: 'Ch 15',         status: 'ACTIVE' },
    16: { label: 'Pastor',          ch: 'Ch 16',         status: 'ACTIVE' },
    17: { label: 'Lead Vocal',      ch: 'Ch 17',         status: 'ACTIVE' },
    18: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   },
    19: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   },
    20: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   },
    21: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   },
    22: { label: 'BV 1 (Soprano)',  ch: 'Ch 22',         status: 'ACTIVE' },
    23: { label: 'BV 2 (Soprano)',  ch: 'Ch 23',         status: 'ACTIVE' },
    24: { label: 'BV 3 (Alto)',     ch: 'Ch 24',         status: 'ACTIVE' },
    25: { label: 'BV 4 (Alto)',     ch: 'Ch 25',         status: 'ACTIVE' },
    26: { label: 'BV 5 (Tenor)',    ch: 'Ch 26',         status: 'ACTIVE' },
    27: { label: 'BV 6 (Tenor)',    ch: 'Ch 27',         status: 'ACTIVE' },
    28: { label: 'Open',            ch: 'Open',          status: 'SPARE'  },
    29: { label: 'Playback',        ch: 'Route → Ch 32', status: 'ACTIVE' },
    30: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   },
    31: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   },
    32: { label: '❌ BROKEN',       ch: 'DO NOT USE',    status: 'DEAD'   }
  };

  // Physical AudioLink Patch List (Outputs A–H)
  const AUDIOLINK_OUTPUTS = [
    { port: 'A', name: 'Main PA Left',  consoleOut: 'MIX 5 - MAIN L',       role: 'Primary Left Line Array / FOH Top' },
    { port: 'B', name: 'Main PA Right', consoleOut: 'MIX 6 - MAIN R',       role: 'Primary Right Line Array / FOH Top' },
    { port: 'C', name: 'Subs',          consoleOut: 'MIX 1 - SUBS',         role: `Mono/Center Subwoofer Bus → ${C.dspShort} (38–90 Hz)` },
    { port: 'D', name: 'Delay Left',    consoleOut: 'MIX 7 - DELAY L',      role: 'Mid-Hall Delay Fill Left (Time-Aligned)' },
    { port: 'E', name: 'Delay Right',   consoleOut: 'MIX 8 - DELAY R',      role: 'Mid-Hall Delay Fill Right (Time-Aligned)' },
    { port: 'F', name: 'BV Monitors',   consoleOut: 'MIX 4 - BV MONITOR',   role: 'Backing Vocal Stage Wedge Mix' },
    { port: 'G', name: 'Front Fills / IEMs (Depending on event/service)', consoleOut: 'Aux / Event Dependent', role: 'Front Fill Speakers or In-Ear Monitor Feed' },
    { port: 'H', name: 'Band Monitor',  consoleOut: 'MIX 3 - BAND MONITOR', role: 'Drums, Keys & Band Stage Wedge Mix' }
  ];

  // Console Patch List (Outputs MIX 1–8)
  const CONSOLE_OUTPUTS = [
    { mix: 'MIX 1', name: 'SUBS',         snakeOut: 'Output C - Subs',          status: 'ACTIVE', note: 'Aux-fed Sub Bus (Kick, Bass, Floor Tom, Keys/Loops)' },
    { mix: 'MIX 2', name: 'Open',         snakeOut: 'Unassigned (Open)',        status: 'OPEN',   note: 'Leave Physical MIX 2 Unassigned / Open' },
    { mix: 'MIX 3', name: 'BAND MONITOR', snakeOut: 'Output H - Band Monitor',  status: 'ACTIVE', note: 'Stage Instrument & Drum Monitor Bus' },
    { mix: 'MIX 4', name: 'BV MONITOR',   snakeOut: 'Output F - BV Monitors',   status: 'ACTIVE', note: 'Vocalists & Choir Stage Wedge Bus' },
    { mix: 'MIX 5', name: 'MAIN L',       snakeOut: 'Output A - Main PA Left',  status: 'ACTIVE', note: 'FOH Left Master Matrix / Bus' },
    { mix: 'MIX 6', name: 'MAIN R',       snakeOut: 'Output B - Main PA Right', status: 'ACTIVE', note: 'FOH Right Master Matrix / Bus' },
    { mix: 'MIX 7', name: 'DELAY L',      snakeOut: 'Output D - Delay Left',    status: 'ACTIVE', note: 'Delay Fill Left Bus' },
    { mix: 'MIX 8', name: 'DELAY R',      snakeOut: 'Output E - Delay Right',   status: 'ACTIVE', note: 'Delay Fill Right Bus' }
  ];

  // Console Patch List (Inputs 1–32)
  const ALL_32_INPUTS = [
    { ch: 1,  key: 'kick',     name: 'Kick In',         mic: 'Dynamic Kick Mic',         prefPort: 1,  hpf: '35 Hz',  pol: '0°',           gateKey: '145 Hz',              bus: 'MIX 1 Subs + Main L/R', defaultOn: true },
    { ch: 2,  key: 'ch02',     name: 'Kick Out',        mic: 'Sub / Outer Kick Mic',     prefPort: 2,  hpf: '30 Hz',  pol: '0°',           gateKey: '60 Hz',               bus: 'MIX 1 Subs + Main L/R', defaultOn: true },
    { ch: 3,  key: 'ch11',     name: 'Snare Top',       mic: 'Cardioid Dynamic',         prefPort: 3,  hpf: '100 Hz', pol: '0°',           gateKey: 'Exp 190 Hz',          bus: 'Drums + Plate FX',      defaultOn: true },
    { ch: 4,  key: 'ch28',     name: 'Snare Bottom',    mic: 'Cardioid Dynamic',         prefPort: 4,  hpf: '160 Hz', pol: 'Ø ON (-180°)', gateKey: 'Key 200 Hz',          bus: 'Drums Bus',             defaultOn: true },
    { ch: 5,  key: 'tom1',     name: 'Rack Tom 1',      mic: 'Clip-On Dynamic',          prefPort: 5,  hpf: '95 Hz',  pol: 'Ø ON (-180°)', gateKey: '170 Hz',              bus: 'Drums + Main L/R',      defaultOn: true },
    { ch: 6,  key: 'tom2',     name: 'Rack Tom 2',      mic: 'Clip-On Dynamic',          prefPort: 6,  hpf: '80 Hz',  pol: '0°',           gateKey: '140 Hz',              bus: 'Drums + Main L/R',      defaultOn: true },
    { ch: 7,  key: 'ch05',     name: 'Rack Tom 3',      mic: 'Clip-On Dynamic',          prefPort: 7,  hpf: '70 Hz',  pol: '0°',           gateKey: '120 Hz',              bus: 'Drums + Main L/R',      defaultOn: true },
    { ch: 8,  key: 'floortom', name: 'Floor Tom',       mic: 'Dynamic Tom Mic',          prefPort: 8,  hpf: '55 Hz',  pol: 'Ø ON (-180°)', gateKey: '95 Hz (Blocks Snare)',bus: 'MIX 1 Subs + Main L/R', defaultOn: true },
    { ch: 9,  key: 'bass',     name: 'Bass Guitar',     mic: 'Active / Passive DI',      prefPort: 9,  hpf: '38 Hz',  pol: 'Ø ON (-180°)', gateKey: 'Exp -52dB',           bus: 'MIX 1 Subs + Main L/R', defaultOn: true },
    { ch: 10, key: 'guitar',   name: 'Electric Guitar', mic: 'Amp Cab Dynamic / DI',     prefPort: 10, hpf: '110 Hz', pol: '0°',           gateKey: 'Exp -48dB',           bus: 'Band Bus (Pan R35)',    defaultOn: true },
    { ch: 11, key: 'keys1',    name: 'Main Keys',       mic: 'Mono / Stereo DI',         prefPort: 11, hpf: '120 Hz', pol: '0°',           gateKey: 'OFF',                 bus: 'Band Bus (Pan L45)',    defaultOn: true },
    { ch: 12, key: 'keys2',    name: 'Aux Keys',        mic: 'DI (-20dB Pad)',           prefPort: 12, hpf: '140 Hz', pol: '0°',           gateKey: 'OFF',                 bus: 'Band Bus (Pan R45)',    defaultOn: true },
    { ch: 13, key: 'ch22',     name: 'Saxophone',       mic: 'Bell Clip / Dynamic',      prefPort: 13, hpf: '130 Hz', pol: '0°',           gateKey: 'Exp -40dB',           bus: 'Band Bus (Pan L30)',    defaultOn: true },
    { ch: 14, key: 'ch14',     name: 'Trumpet',         mic: 'Dynamic Brass Mic',        prefPort: 14, hpf: '140 Hz', pol: '0°',           gateKey: 'Exp -40dB',           bus: 'Band Bus (Pan R30)',    defaultOn: true },
    { ch: 15, key: 'ch30',     name: 'Loops / Stems',   mic: 'Audio Interface / DI',     prefPort: 15, hpf: '40 Hz',  pol: '0°',           gateKey: 'OFF',                 bus: 'MIX 1 Subs + Main L/R', defaultOn: true },
    { ch: 16, key: 'ch19',     name: 'Pastor',          mic: 'Wireless Headset/Handheld',prefPort: 16, hpf: '125 Hz', pol: '0°',           gateKey: 'Soft Exp 2:1',        bus: 'Speech DCA (100% Dry)', defaultOn: true },
    { ch: 17, key: 'lv',       name: 'Lead Vocal',      mic: 'Primary SM58 / Beta 58A',  prefPort: 17, hpf: '80 Hz',  pol: '0°',           gateKey: 'Soft Exp 2:1',        bus: 'Main L/R + Hall FX',    defaultOn: true },
    { ch: 18, key: 'ch18',     name: 'Open (Port 18 Broken)', mic: 'Leave Ch 18 Open',   prefPort: null, hpf: 'OPEN', pol: '—',            gateKey: 'Port 18 ❌ BROKEN',   bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 19, key: 'ch20',     name: 'Open (Port 19 Broken)', mic: 'Leave Ch 19 Open',   prefPort: null, hpf: 'OPEN', pol: '—',            gateKey: 'Port 19 ❌ BROKEN',   bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 20, key: 'ch21',     name: 'Open (Port 20 Broken)', mic: 'Leave Ch 20 Open',   prefPort: null, hpf: 'OPEN', pol: '—',            gateKey: 'Port 20 ❌ BROKEN',   bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 21, key: 'ch23',     name: 'Open (Port 21 Broken)', mic: 'Leave Ch 21 Open',   prefPort: null, hpf: 'OPEN', pol: '—',            gateKey: 'Port 21 ❌ BROKEN',   bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 22, key: 'bv1',      name: 'BV 1 (Soprano)',  mic: 'Cardioid Dynamic',         prefPort: 22, hpf: '135 Hz', pol: '0°',           gateKey: 'Exp 3:1 (-36dB)',     bus: 'BV DCA + MIX 4 (L25)',  defaultOn: true },
    { ch: 23, key: 'ch24',     name: 'BV 2 (Soprano)',  mic: 'Cardioid Dynamic',         prefPort: 23, hpf: '135 Hz', pol: '0°',           gateKey: 'Exp 3:1 (-36dB)',     bus: 'BV DCA + MIX 4 (R25)',  defaultOn: true },
    { ch: 24, key: 'ch15',     name: 'BV 3 (Alto)',     mic: 'Cardioid Dynamic',         prefPort: 24, hpf: '130 Hz', pol: '0°',           gateKey: 'Exp 3:1 (-36dB)',     bus: 'BV DCA + MIX 4 (L35)',  defaultOn: true },
    { ch: 25, key: 'ch25',     name: 'BV 4 (Alto)',     mic: 'Cardioid Dynamic',         prefPort: 25, hpf: '130 Hz', pol: '0°',           gateKey: 'Exp 3:1 (-36dB)',     bus: 'BV DCA + MIX 4 (R35)',  defaultOn: true },
    { ch: 26, key: 'bv3',      name: 'BV 5 (Tenor)',    mic: 'Cardioid Dynamic (+6dB)',  prefPort: 26, hpf: '130 Hz', pol: '0°',           gateKey: 'Exp 3:1 (-38dB)',     bus: 'BV DCA + MIX 4 (L15)',  defaultOn: true },
    { ch: 27, key: 'bv4',      name: 'BV 6 (Tenor)',    mic: 'Cardioid Dynamic',         prefPort: 27, hpf: '130 Hz', pol: '0°',           gateKey: 'Exp 3:1 (-38dB)',     bus: 'BV DCA + MIX 4 (R15)',  defaultOn: true },
    { ch: 28, key: 'ch26',     name: 'Open (Port 28 Spare)',  mic: 'Spare Healthy Port 28', prefPort: 28, hpf: '100 Hz', pol: '0°',        gateKey: 'Open / Spare',        bus: 'Assignable Spare',      defaultOn: false, openSlot: true },
    { ch: 29, key: 'ch27',     name: 'Open (Ch 29)',    mic: 'Port 29 Soft-Patched → Ch 32', prefPort: null, hpf: 'OPEN', pol: '—',       gateKey: 'Open',                bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 30, key: 'ch29',     name: 'Open (Port 30 Broken)', mic: 'Leave Ch 30 Open',   prefPort: null, hpf: 'OPEN', pol: '—',            gateKey: 'Port 30 ❌ BROKEN',   bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 31, key: 'ch12',     name: 'Open (Port 31 Broken)', mic: 'Leave Ch 31 Open',   prefPort: null, hpf: 'OPEN', pol: '—',            gateKey: 'Port 31 ❌ BROKEN',   bus: 'Unassigned / Open',     defaultOn: false, openSlot: true },
    { ch: 32, key: 'ch31',     name: 'Playback',        mic: 'Port 29 → Soft-Patch Ch 32', prefPort: 29, hpf: '45 Hz',  pol: '0°',          gateKey: 'OFF',                 bus: 'Main L/R (MIX 5/6)',    defaultOn: true }
  ];

  // Channel Strip & Parametric EQ Presets (aligned with the 1-32 Master Patch)
  const CHANNELS = {
    lv: {
      id: 'lv',
      name: 'Lead Vocal (LV) — Ch 17',
      shortName: 'Lead Vocal (Ch 17)',
      snakeCh: 'Port 17 → Console Ch 17 (1:1 Direct)',
      peak: '-6.32 dBFS', peakNum: -6.32, rms: '-19.20 dBFS', rmsNum: -19.20,
      gatePct: '13.2%', domFreq: '786.0 Hz', phase: '0° Reference',
      severity: 'CRITICAL', isVocal: true,
      bands7: 'Sub 0.0% | Low 0.0% | Low-Mid 0.2% | Box 26.8% | Mid 57.1% | Upper 15.0% | Air 0.9%',
      forensicSummary: 'Reference benchmark when singing on an unmatched/thin capsule: 57.1% energy piled in 800Hz–2kHz (786Hz honk) with only 0.2% warmth below 350Hz. Always reserve the RED-taped SM58/Beta 58A for Ch 17 Lead Vocal.',
      preamp: 'Trim: +0 dB (Peak -6.32 dBFS) • Polarity: Normal (0°) • Port 17 → Console Ch 17',
      gate: 'Expander 2:1 (NEVER hard gate LV) • Threshold: -46 dB • Attack: 5 ms • Release: 350 ms',
      comp: 'Stage 1 Standard: -22 dB Thresh, 3.2:1 Ratio, 15 ms Atk, 120 ms Rel • Peak Limiter catch for belt surges',
      stageTip: 'Patch Lead Vocal into Port 17 → Console Ch 17. If a singer ever grabs a BV mic live, open Console Digital Patching and soft-swap Ch 17 to that Port in 5 seconds.',
      hpf: 80, problemFreq: 786, problemGain: 9.5,
      eq: [
        { freq: 240, q: 1.0, gain: 4.5, desc: 'Restore chest warmth (200–300 Hz body)' },
        { freq: 786, q: 3.0, gain: -4.5, desc: 'Cut nasal capsule resonance @ 786 Hz' },
        { freq: 1150, q: 2.2, gain: -3.5, desc: 'Tame 800Hz–2kHz belt harshness' },
        { freq: 8000, q: 0.7, gain: 3.5, desc: 'High-shelf air & vocal presence' }
      ]
    },
    kick: {
      id: 'kick', name: 'Kick In — Ch 01', shortName: 'Kick In (Ch 01)',
      snakeCh: 'Port 1 → Console Ch 1 → MIX 1 Subs + Main L/R',
      peak: '0.00 dBFS (Clip)', peakNum: 0.00, rms: '-23.31 dBFS', rmsNum: -23.31,
      gatePct: '60.4%', domFreq: '96.9 Hz', phase: '0° Reference', severity: 'CRITICAL', isVocal: false,
      bands7: 'Sub 43.5% | Low 45.2% | Low-Mid 5.6% | Box 0.7% | Mid 0.5% | Upper 1.7% | Air 0.8%',
      forensicSummary: 'Reference Kick showed 0.00 dBFS preamp clipping, 96.9 Hz upper-bass knock (45.2%), and Bass guitar bleed false-triggering the gate.',
      preamp: 'Pad Preamp Gain by -6 dB (target -6 dBFS peak headroom) • Polarity: 0° (Master Drum Reference)',
      gate: 'Gate Threshold: -26 dB • Key Filter: ON @ 145 Hz (Q 2.5) so 102 Hz Bass bleed stops chattering the gate • Hold: 40 ms, Rel: 160 ms',
      comp: 'Threshold: -18 dB • Ratio: 4.5:1 • Attack: 28 ms • Release: 80 ms • Makeup: +3.0 dB',
      stageTip: 'Place pillow/towel touching front & batter heads; position Kick In mic 5–8 cm inside port angled 30° toward plastic beater on Port 1.',
      hpf: 35, problemFreq: 97, problemGain: 8.5,
      eq: [
        { freq: 56, q: 1.4, gain: 5.5, desc: 'Deep sub-bass chest thump boost' },
        { freq: 98, q: 2.8, gain: -7.5, desc: 'Cut hollow 96.9 Hz knock & Bass collision' },
        { freq: 210, q: 1.6, gain: -7.0, desc: 'Clear shell cardboard boxiness (160–350 Hz)' },
        { freq: 3800, q: 1.4, gain: 6.5, desc: 'Beater click & transient snap' }
      ]
    },
    ch02: {
      id: 'ch02', chNum: 2, defaultSnakePort: 2, category: 'DRUMS',
      name: 'Kick Out — Ch 02', shortName: 'Kick Out (Ch 02)',
      snakeCh: 'Port 2 → Console Ch 2 → MIX 1 Subs + Main L/R',
      peak: '-8.20 dBFS', peakNum: -8.20, rms: '-24.10 dBFS', rmsNum: -24.10,
      gatePct: '65.0%', domFreq: '54.0 Hz', phase: '0° Aligned with Kick In', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 68.0% | Low 25.0% | Low-Mid 4.0% | Box 1.0% | Mid 1.0% | Upper 0.5% | Air 0.5%',
      forensicSummary: 'Outer kick resonant head mic on Port 2 → Ch 2 adds deep 50–60 Hz sub weight while Ch 1 Kick In provides beater attack.',
      preamp: 'Trim: -4 dB • Port 2 → Console Ch 2 (1:1 Direct) • Polarity: 0°',
      gate: 'Gate Threshold: -28 dB • Key Filter: 60 Hz • Release: 140 ms',
      comp: 'FET Compressor • Ratio: 4:1 • Attack: 20 ms • Release: 70 ms',
      stageTip: 'Position outer dynamic/sub-kick mic at the resonant head port rim and patch directly into Port 2.',
      hpf: 30, problemFreq: 180, problemGain: 6.0,
      eq: [
        { freq: 52, q: 1.5, gain: 4.5, desc: 'Deep 52 Hz sub weight' },
        { freq: 160, q: 2.2, gain: -6.0, desc: 'Remove resonant head boom' },
        { freq: 400, q: 1.8, gain: -4.5, desc: 'Scoop outer shell boxiness' },
        { freq: 2500, q: 1.2, gain: -3.0, desc: 'Let Ch 1 Kick In own beater click' }
      ]
    },
    ch11: {
      id: 'ch11', chNum: 3, defaultSnakePort: 3, category: 'DRUMS',
      name: 'Snare Top — Ch 03', shortName: 'Snare Top (Ch 03)',
      snakeCh: 'Port 3 → Console Ch 3 → Drums Bus + Plate Reverb',
      peak: '-4.20 dBFS', peakNum: -4.20, rms: '-21.50 dBFS', rmsNum: -21.50,
      gatePct: '52.0%', domFreq: '185.0 Hz', phase: '0° Reference', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 0.2% | Low 18.0% | Low-Mid 34.0% | Box 16.0% | Mid 12.0% | Upper 14.0% | Air 5.8%',
      forensicSummary: 'Snare Top Blueprint on Port 3 → Ch 3: HPF at 100 Hz, Standard Compressor (20ms attack), and Plate Reverb.',
      preamp: 'Trim: 0 dB (Target -6 dBFS peak on rimshots) • Polarity: Normal (0°)',
      gate: 'Expander 2:1 • Threshold: -34 dB • Key Filter: 190 Hz • Range: -8 dB (preserves ghost notes)',
      comp: 'Standard Compressor • Ratio: 3.5:1 • Attack: 20 ms (lets transient crack through) • Release: 80 ms',
      stageTip: 'Patch Snare Top into Port 3 → Ch 3. Angle SM57 toward center dot with null aimed at Hi-Hat.',
      hpf: 100, problemFreq: 520, problemGain: 5.5,
      eq: [
        { freq: 185, q: 1.4, gain: 3.0, desc: 'Fat snare body & chest weight' },
        { freq: 520, q: 2.4, gain: -4.0, desc: 'Cut boxy ring overhang' },
        { freq: 1100, q: 2.0, gain: -2.0, desc: 'Clear vocal pocket' },
        { freq: 4500, q: 1.2, gain: 3.5, desc: 'Crisp rimshot crack & wire snap' }
      ]
    },
    ch28: {
      id: 'ch28', chNum: 4, defaultSnakePort: 4, category: 'DRUMS',
      name: 'Snare Bottom — Ch 04', shortName: 'Snare Btm (Ch 04)',
      snakeCh: 'Port 4 → Console Ch 4 (Ø INVERTED)',
      peak: '-8.10 dBFS', peakNum: -8.10, rms: '-26.40 dBFS', rmsNum: -26.40,
      gatePct: '60.0%', domFreq: '3,800 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
      bands7: 'Sub 0.0% | Low 4.0% | Low-Mid 14.0% | Box 18.0% | Mid 22.0% | Upper 30.0% | Air 12.0%',
      forensicSummary: 'Snare Bottom on Port 4 → Ch 4 faces opposite Snare Top (Ch 3)—MUST have Polarity Invert (Ø = ON) engaged.',
      preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on Console Ch 4 • Trim: -4 dB',
      gate: 'Fast Gate • Threshold: -28 dB • Key Filter: 200 Hz • Release: 100 ms',
      comp: 'FET Compressor • Ratio: 4:1 • Attack: 10 ms • Release: 70 ms',
      stageTip: 'Always flip Polarity (Ø) on Ch 4 Snare Bottom so it sums with Ch 3 Snare Top instead of canceling 185 Hz body.',
      hpf: 160, problemFreq: 450, problemGain: 5.0,
      eq: [
        { freq: 185, q: 1.8, gain: -4.0, desc: 'Let Snare Top own fundamental weight' },
        { freq: 450, q: 2.2, gain: -4.5, desc: 'Cut snare buzz ring' },
        { freq: 3800, q: 1.4, gain: 3.5, desc: 'Crisp snare wire snap' },
        { freq: 9500, q: 0.8, gain: 3.0, desc: 'Sizzle air' }
      ]
    },
    tom1: {
      id: 'tom1', name: 'Rack Tom 1 — Ch 05', shortName: 'Rack Tom 1 (Ch 05)',
      snakeCh: 'Port 5 → Console Ch 5 (1:1 Direct)',
      peak: '-4.64 dBFS', peakNum: -4.64, rms: '-33.73 dBFS', rmsNum: -33.73,
      gatePct: '27.0%', domFreq: '172.3 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
      bands7: 'Sub 0.1% | Low 9.6% | Low-Mid 40.6% | Box 17.5% | Mid 3.8% | Upper 11.1% | Air 17.2%',
      forensicSummary: 'Gate stayed open 73.0% of the time leaking cymbal/snare bleed, and polarity was inverted (-1) vs. Kick (+2.93 ms).',
      preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on Console Ch 5 • Preamp Trim: 0 dB',
      gate: 'Gate Threshold: -24 dB • Key Filter: 170 Hz (Q 3.0) • Range: -40 dB',
      comp: 'Threshold: -18 dB • Ratio: 4:1 • Attack: 20 ms • Release: 110 ms',
      stageTip: 'Patch Rack Tom 1 into Port 5 → Ch 5. Angle mic 45° downward toward tom center, pointing null at crash cymbals.',
      hpf: 95, problemFreq: 420, problemGain: 6.0,
      eq: [
        { freq: 165, q: 1.6, gain: 3.5, desc: 'Reinforce 172 Hz fundamental rack tom body' },
        { freq: 420, q: 2.2, gain: -6.5, desc: 'Scoop cardboard boxiness & snare wash' },
        { freq: 850, q: 2.0, gain: -3.0, desc: 'Reduce mid-range ring overhang' },
        { freq: 4800, q: 1.5, gain: 4.0, desc: 'Stick attack definition' }
      ]
    },
    tom2: {
      id: 'tom2', name: 'Rack Tom 2 — Ch 06', shortName: 'Rack Tom 2 (Ch 06)',
      snakeCh: 'Port 6 → Console Ch 6 (1:1 Direct)',
      peak: '-11.06 dBFS', peakNum: -11.06, rms: '-34.49 dBFS', rmsNum: -34.49,
      gatePct: '80.6%', domFreq: '140.0 Hz', phase: '+0° Normal', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 0.4% | Low 30.1% | Low-Mid 31.7% | Box 9.5% | Mid 5.8% | Upper 8.2% | Air 14.1%',
      forensicSummary: 'Cleanest tom gate (closed 80.6%), positive polarity (+1), and solid 140.0 Hz fundamental; needs +4 dB trim to match Rack Tom 1.',
      preamp: 'Add +4 dB Digital Trim to match Rack Tom 1 level • Polarity: Normal (0°)',
      gate: 'Gate Threshold: -28 dB • Key Filter: 140 Hz (Q 2.8) • Hold: 35 ms • Release: 180 ms',
      comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 22 ms • Release: 120 ms',
      stageTip: 'Patch Rack Tom 2 into Port 6 → Ch 6 and keep clip height consistent with Rack Tom 1.',
      hpf: 80, problemFreq: 360, problemGain: 5.0,
      eq: [
        { freq: 138, q: 1.5, gain: 4.0, desc: 'Boost 140 Hz mid-tom fundamental punch' },
        { freq: 360, q: 2.2, gain: -6.0, desc: 'Clean papery boxiness' },
        { freq: 900, q: 1.8, gain: -2.5, desc: 'Tighten sustain tail' },
        { freq: 4500, q: 1.4, gain: 4.5, desc: 'Stick attack snap' }
      ]
    },
    ch05: {
      id: 'ch05', chNum: 7, defaultSnakePort: 7, category: 'DRUMS',
      name: 'Rack Tom 3 — Ch 07', shortName: 'Rack Tom 3 (Ch 07)',
      snakeCh: 'Port 7 → Console Ch 7 (1:1 Direct)',
      peak: '-9.40 dBFS', peakNum: -9.40, rms: '-33.90 dBFS', rmsNum: -33.90,
      gatePct: '78.0%', domFreq: '118.0 Hz', phase: '+0° Normal', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 1.2% | Low 38.0% | Low-Mid 32.0% | Box 10.0% | Mid 5.0% | Upper 8.0% | Air 5.8%',
      forensicSummary: 'Low rack tom on Port 7 → Console Ch 7; tune Gate Key Filter to 120 Hz for tight low-mid decay.',
      preamp: 'Port 7 → Console Ch 7 (1:1 Direct) • Polarity: 0°',
      gate: 'Gate Threshold: -26 dB • Key Filter: 120 Hz (Q 2.8) • Range: -40 dB',
      comp: 'Standard Comp • Ratio: 4:1 • Attack: 22 ms • Release: 130 ms',
      stageTip: 'Patch Rack Tom 3 directly into Port 7 → Console Ch 7.',
      hpf: 70, problemFreq: 340, problemGain: 5.5,
      eq: [
        { freq: 118, q: 1.5, gain: 4.0, desc: 'Low rack tom fundamental punch' },
        { freq: 340, q: 2.4, gain: -6.0, desc: 'Cut tubby mid-ring' },
        { freq: 800, q: 1.8, gain: -2.5, desc: 'Clean sustain overhang' },
        { freq: 4400, q: 1.4, gain: 4.0, desc: 'Stick attack snap' }
      ]
    },
    floortom: {
      id: 'floortom', name: 'Floor Tom — Ch 08', shortName: 'Floor Tom (Ch 08)',
      snakeCh: 'Port 8 → Console Ch 8 → MIX 1 Subs + Main L/R',
      peak: '-7.09 dBFS', peakNum: -7.09, rms: '-35.37 dBFS', rmsNum: -35.37,
      gatePct: '46.8%', domFreq: '204.6 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
      bands7: 'Sub 1.9% | Low 15.1% | Low-Mid 45.8% | Box 14.3% | Mid 1.8% | Upper 12.1% | Air 8.7%',
      forensicSummary: 'Snare bleed (204.6 Hz) false-triggered the gate 53.2% of the time, and polarity was inverted (-1) against Kick.',
      preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on Console Ch 8 • Port 8 → Ch 8 (1:1 Direct)',
      gate: 'Gate Threshold: -25 dB • Key Filter: 95 Hz (Q 3.0) so 204 Hz Snare hits cannot open it!',
      comp: 'Threshold: -19 dB • Ratio: 4:1 • Attack: 25 ms • Release: 150 ms',
      stageTip: 'Patch Floor Tom into Port 8 → Ch 8 and tune Gate Key Filter to 95 Hz to block Snare bleed.',
      hpf: 55, problemFreq: 205, problemGain: 7.5,
      eq: [
        { freq: 88, q: 1.5, gain: 5.0, desc: 'Deep Floor Tom thunder fundamental' },
        { freq: 205, q: 2.8, gain: -6.5, desc: 'Notch 204.6 Hz Snare bleed & tubby resonance' },
        { freq: 380, q: 2.0, gain: -5.0, desc: 'Remove hollow barrel ring' },
        { freq: 4200, q: 1.5, gain: 4.5, desc: 'Beater/stick articulation' }
      ]
    },
    bass: {
      id: 'bass', name: 'Bass Guitar — Ch 09', shortName: 'Bass Guitar (Ch 09)',
      snakeCh: 'Port 9 → Console Ch 9 → MIX 1 Subs + Main L/R',
      peak: '-5.17 dBFS', peakNum: -5.17, rms: '-29.35 dBFS', rmsNum: -29.35,
      gatePct: '27.2%', domFreq: '107.7 Hz', phase: '-180° INVERTED', severity: 'PHASE', isVocal: false,
      bands7: 'Sub 17.9% | Low 59.9% | Low-Mid 20.9% | Box 0.6% | Mid 0.1% | Upper 0.0% | Air 0.0%',
      forensicSummary: '97.2% of energy sat below 250 Hz (colliding with Kick @ 96.9 Hz) with only 0.1% above 800 Hz, plus inverted polarity (-1) vs. Kick.',
      preamp: 'ENGAGE POLARITY INVERT (Ø = ON) on Console Ch 9 • Trim: 0 dB',
      gate: 'Expander Threshold: -52 dB',
      comp: 'Tube/FET Model • Threshold: -20 dB • Ratio: 5:1 • Key Input: Ch 1 Kick (ducks 2.5 dB on Kick hits)',
      stageTip: 'Patch Bass DI into Port 9 → Ch 9 and ask bassist to open their active preamp mids slightly on stage.',
      hpf: 38, problemFreq: 108, problemGain: 8.0,
      eq: [
        { freq: 62, q: 1.5, gain: -2.5, desc: 'Leave 50–65 Hz sub pocket priority to Kick Drum' },
        { freq: 115, q: 1.8, gain: 2.5, desc: 'Controlled upper-bass note sustain pocket' },
        { freq: 230, q: 2.2, gain: -4.5, desc: 'Clean low-mid mud buildup' },
        { freq: 1100, q: 1.4, gain: 6.5, desc: 'Bring out finger/fret harmonic definition' }
      ]
    },
    guitar: {
      id: 'guitar', name: 'Electric Guitar — Ch 10', shortName: 'Electric Guitar (Ch 10)',
      snakeCh: 'Port 10 → Console Ch 10 (Pan R35)',
      peak: '-16.93 dBFS', peakNum: -16.93, rms: '-28.10 dBFS', rmsNum: -28.10,
      gatePct: '9.5%', domFreq: '2,508.6 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: false,
      bands7: 'Sub 0.0% | Low 0.0% | Low-Mid 1.1% | Box 1.2% | Mid 2.5% | Upper 94.9% | Air 0.3%',
      forensicSummary: '94.9% of energy concentrated inside 2–5 kHz (2,508.6 Hz spike), fighting Lead Vocal consonant intelligibility.',
      preamp: 'Add +4 dB Preamp Trim (Peak -16.93 dBFS) • Polarity: Normal (0°)',
      gate: 'Expander Threshold: -48 dB',
      comp: 'Threshold: -21 dB • Ratio: 3:1 • Attack: 18 ms • Release: 100 ms',
      stageTip: 'Patch Electric Guitar into Port 10 → Ch 10. Move amp mic 3 cm off-center from speaker dust cap toward cone edge.',
      hpf: 110, problemFreq: 2509, problemGain: 11.0,
      eq: [
        { freq: 320, q: 1.4, gain: 4.5, desc: 'Restore missing lower-mid guitar body' },
        { freq: 1100, q: 1.6, gain: 2.0, desc: 'Support musical midrange note weight' },
        { freq: 2510, q: 3.5, gain: -7.5, desc: 'Surgical notch on 2,508.6 Hz ice-pick spike' },
        { freq: 6500, q: 1.2, gain: -4.0, desc: 'Smooth harsh digital fizz above 6 kHz' }
      ]
    },
    keys1: {
      id: 'keys1', name: 'Main Keys — Ch 11', shortName: 'Main Keys (Ch 11)',
      snakeCh: 'Port 11 → Console Ch 11 (Pan L45)',
      peak: '-16.05 dBFS', peakNum: -16.05, rms: '-29.89 dBFS', rmsNum: -29.89,
      gatePct: '0.0%', domFreq: '312.2 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: false,
      bands7: 'Sub 0.2% | Low 7.0% | Low-Mid 35.4% | Box 45.9% | Mid 9.8% | Upper 1.6% | Air 0.1%',
      forensicSummary: '10.01 dB quieter than Aux Keys, with 81.3% of energy concentrated in 160–800 Hz (312.2 Hz mud colliding with Backing Vocals).',
      preamp: 'Add +6 dB Preamp/Digital Trim so Main Keys (Ch 11) matches Aux Keys (Ch 12) gain structure',
      gate: 'Gate OFF',
      comp: 'Threshold: -22 dB • Ratio: 2.5:1 • Attack: 25 ms • Release: 150 ms',
      stageTip: 'Patch Main Keys into Port 11 → Ch 11. Remind player to ease off heavy left-hand C2–C3 doubling when Bass Guitar is playing.',
      hpf: 120, problemFreq: 312, problemGain: 8.0,
      eq: [
        { freq: 180, q: 1.8, gain: -3.5, desc: 'Clear left-hand low-mid chord thickness' },
        { freq: 315, q: 2.2, gain: -6.0, desc: 'Carve 312 Hz pad mud colliding with BVs' },
        { freq: 580, q: 2.0, gain: -3.5, desc: 'Open pocket for Lead Vocal chest & warmth' },
        { freq: 4500, q: 1.0, gain: 3.5, desc: 'Restore piano hammer clarity & air' }
      ]
    },
    keys2: {
      id: 'keys2', name: 'Aux Keys — Ch 12', shortName: 'Aux Keys (Ch 12)',
      snakeCh: 'Port 12 → Console Ch 12 (Pan R45)',
      peak: '-0.14 dBFS', peakNum: -0.14, rms: '-19.88 dBFS', rmsNum: -19.88,
      gatePct: '0.0%', domFreq: '463.0 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: false,
      bands7: 'Sub 1.0% | Low 3.5% | Low-Mid 14.6% | Box 47.4% | Mid 24.6% | Upper 8.7% | Air 0.2%',
      forensicSummary: 'Peaked at -0.14 dBFS (+10.01 dB hotter than Main Keys), with 72.0% of energy in 350–2,000 Hz stepping on vocals.',
      preamp: 'Pad/Reduce Preamp Gain by -8 dB immediately (engage -20 dB switch on DI box on Port 12)',
      gate: 'Gate OFF',
      comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 10 ms • Release: 120 ms',
      stageTip: 'Patch Aux Keys into Port 12 → Ch 12 and normalize synth/brass patch volumes during line check.',
      hpf: 140, problemFreq: 463, problemGain: 7.5,
      eq: [
        { freq: 280, q: 1.8, gain: -3.0, desc: 'Trim lower synth body' },
        { freq: 465, q: 2.4, gain: -5.5, desc: 'Cut dominant 463 Hz boxy synth horn buildup' },
        { freq: 1250, q: 2.0, gain: -4.0, desc: 'Carve vocal presence pocket for LV & Tenors' },
        { freq: 7500, q: 0.8, gain: 2.0, desc: 'Smooth top shimmer' }
      ]
    },
    ch22: {
      id: 'ch22', chNum: 13, defaultSnakePort: 13, category: 'BAND',
      name: 'Saxophone — Ch 13', shortName: 'Saxophone (Ch 13)',
      snakeCh: 'Port 13 → Console Ch 13 (Pan L30)',
      peak: '-7.50 dBFS', peakNum: -7.50, rms: '-20.90 dBFS', rmsNum: -20.90,
      gatePct: '35.0%', domFreq: '2,250 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 0.0% | Low 1.0% | Low-Mid 16.0% | Box 28.0% | Mid 36.0% | Upper 17.0% | Air 2.0%',
      forensicSummary: 'Dedicated Saxophone strip on Port 13 → Console Ch 13; tame 2.25 kHz reed bite so solos sit smoothly.',
      preamp: 'Trim: -2 dB on fortissimo horn blasts • Pan: L30 (opposite Trumpet R30)',
      gate: 'Expander 2:1 • Threshold: -40 dB (reduces drum bleed into bell mic)',
      comp: 'Tube Compressor • Ratio: 4:1 • GR: 4–6 dB on high register solos',
      stageTip: 'Patch Saxophone into Port 13 → Ch 13 and cut 2.25 kHz reed bite.',
      hpf: 130, problemFreq: 2250, problemGain: 7.0,
      eq: [
        { freq: 220, q: 1.4, gain: 2.0, desc: 'Warm brass body' },
        { freq: 560, q: 2.2, gain: -3.0, desc: 'Reduce horn honk' },
        { freq: 2250, q: 2.8, gain: -4.5, desc: 'Tame piercing reed bite' },
        { freq: 9000, q: 0.8, gain: 1.5, desc: 'Breath air' }
      ]
    },
    ch14: {
      id: 'ch14', chNum: 14, defaultSnakePort: 14, category: 'BAND',
      name: 'Trumpet — Ch 14', shortName: 'Trumpet (Ch 14)',
      snakeCh: 'Port 14 → Console Ch 14 (Pan R30)',
      peak: '-6.90 dBFS', peakNum: -6.90, rms: '-20.40 dBFS', rmsNum: -20.40,
      gatePct: '38.0%', domFreq: '1,850 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 0.0% | Low 0.5% | Low-Mid 12.0% | Box 26.0% | Mid 40.0% | Upper 19.5% | Air 2.0%',
      forensicSummary: 'Dedicated Trumpet strip on Port 14 → Console Ch 14; control 1.8–2.8 kHz brass projection to protect vocal clarity.',
      preamp: 'Trim: -4 dB (high SPL brass transients) • Pan: R30 (mirrors Saxophone L30)',
      gate: 'Expander 2:1 • Threshold: -38 dB',
      comp: 'Tube Compressor • Ratio: 4.5:1 • Attack: 10 ms • Release: 90 ms',
      stageTip: 'Patch Trumpet into Port 14 → Ch 14 and position bell 15–20 cm off-axis from dynamic mic.',
      hpf: 140, problemFreq: 1850, problemGain: 6.5,
      eq: [
        { freq: 260, q: 1.4, gain: 2.0, desc: 'Add lower brass warmth' },
        { freq: 680, q: 2.0, gain: -3.0, desc: 'Clear midrange horn boxiness' },
        { freq: 1850, q: 2.6, gain: -4.5, desc: 'Tame aggressive upper-mid brass bite' },
        { freq: 8500, q: 1.0, gain: -2.0, desc: 'Smooth harsh high harmonics' }
      ]
    },
    ch30: {
      id: 'ch30', chNum: 15, defaultSnakePort: 15, category: 'BAND',
      name: 'Loops / Stems — Ch 15', shortName: 'Loops / Stems (Ch 15)',
      snakeCh: 'Port 15 → Console Ch 15 → MIX 1 Subs + Main L/R',
      peak: '-9.00 dBFS', peakNum: -9.00, rms: '-20.50 dBFS', rmsNum: -20.50,
      gatePct: '10.0%', domFreq: '68.0 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
      bands7: 'Sub 35.0% | Low 42.0% | Low-Mid 14.0% | Box 4.0% | Mid 3.0% | Upper 1.5% | Air 0.5%',
      forensicSummary: 'Backing loops, shaker/percussion stems, and synth sub tracks patched via Port 15 → Console Ch 15.',
      preamp: 'Port 15 → Console Ch 15 (1:1 Direct) • Trim: -3 dB',
      gate: 'Gate OFF',
      comp: 'Standard Compressor • Ratio: 3:1 • Glues loop transients evenly',
      stageTip: 'Patch Loops / Stems DI into Port 15 → Ch 15 and carve 300 Hz so loops never clutter live drums.',
      hpf: 40, problemFreq: 280, problemGain: 5.0,
      eq: [
        { freq: 65, q: 1.4, gain: 2.0, desc: 'Controlled sub-loop warmth' },
        { freq: 280, q: 2.2, gain: -4.0, desc: 'Cut loop low-mid mud' },
        { freq: 1200, q: 1.8, gain: -2.5, desc: 'Keep vocal pocket open' },
        { freq: 8000, q: 0.8, gain: 2.0, desc: 'Crisp shaker/percussion top air' }
      ]
    },
    ch19: {
      id: 'ch19', chNum: 16, defaultSnakePort: 16, category: 'SPEECH',
      name: 'Pastor — Ch 16', shortName: 'Pastor (Ch 16)',
      snakeCh: 'Port 16 → Console Ch 16 (1:1 Direct • 100% Dry)',
      peak: '-8.50 dBFS', peakNum: -8.50, rms: '-20.10 dBFS', rmsNum: -20.10,
      gatePct: '22.0%', domFreq: '260.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
      bands7: 'Sub 0.0% | Low 0.5% | Low-Mid 22.0% | Box 31.0% | Mid 32.0% | Upper 13.0% | Air 1.5%',
      forensicSummary: 'Primary Pastor channel on Port 16 → Console Ch 16; ring out 315 Hz room node and keep 100% dry for sermon clarity.',
      preamp: 'Port 16 → Console Ch 16 (1:1 Direct) • Dedicated Speech DCA',
      gate: 'Expander 2:1 • Threshold: -45 dB • Gentle release 300 ms (never chop sermon breath)',
      comp: 'Standard Comp • Ratio: 3:1 • Threshold: -22 dB • Attack: 10 ms • Release: 90 ms',
      stageTip: 'Patch Pastor receiver into Port 16 → Ch 16 and keep zero reverb/delay sends during preaching.',
      hpf: 125, problemFreq: 315, problemGain: 6.0,
      eq: [
        { freq: 190, q: 1.6, gain: -2.5, desc: 'Control chest proximity boom' },
        { freq: 315, q: 2.8, gain: -4.5, desc: 'Ring out primary hall feedback node' },
        { freq: 2500, q: 2.2, gain: -2.0, desc: 'Prevent PA horn harshness on loud preaching' },
        { freq: 6500, q: 1.0, gain: 2.0, desc: 'Crisp consonant diction' }
      ]
    },
    ch18: {
      id: 'ch18', chNum: 18, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 18 • Port 18 Broken)', shortName: 'Ch 18 [Open]',
      snakeCh: 'Port 18 ❌ BROKEN → Leave Console Ch 18 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 18 is ❌ BROKEN on the AudioLink snake; Console Ch 18 is left Open.',
      forensicSummary: 'Port 18 on the AudioLink snake is broken. Leave Console Ch 18 Open and start BV 1 (Soprano) at Port 22 → Ch 22.',
      preamp: 'Channel Open / Unassigned (Port 18 ❌ BROKEN)',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Do not plug mics into broken AudioLink Ports 18–21; patch BV 1–6 into Ports 22–27.',
      hpf: 120, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 18 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 18 Broken' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Start BVs at Ch 22' }
      ]
    },
    ch20: {
      id: 'ch20', chNum: 19, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 19 • Port 19 Broken)', shortName: 'Ch 19 [Open]',
      snakeCh: 'Port 19 ❌ BROKEN → Leave Console Ch 19 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 19 is ❌ BROKEN on the AudioLink snake; Console Ch 19 is left Open.',
      forensicSummary: 'Port 19 on the AudioLink snake is broken. Leave Console Ch 19 Open.',
      preamp: 'Channel Open / Unassigned (Port 19 ❌ BROKEN)',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Keep Port 19 taped over on the AudioLink snake and leave Console Ch 19 Open.',
      hpf: 120, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 19 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 19 Broken' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Start BVs at Ch 22' }
      ]
    },
    ch21: {
      id: 'ch21', chNum: 20, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 20 • Port 20 Broken)', shortName: 'Ch 20 [Open]',
      snakeCh: 'Port 20 ❌ BROKEN → Leave Console Ch 20 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 20 is ❌ BROKEN on the AudioLink snake; Console Ch 20 is left Open.',
      forensicSummary: 'Port 20 on the AudioLink snake is broken. Leave Console Ch 20 Open.',
      preamp: 'Channel Open / Unassigned (Port 20 ❌ BROKEN)',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Keep Port 20 taped over on the AudioLink snake and leave Console Ch 20 Open.',
      hpf: 120, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 20 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 20 Broken' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Start BVs at Ch 22' }
      ]
    },
    ch23: {
      id: 'ch23', chNum: 21, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 21 • Port 21 Broken)', shortName: 'Ch 21 [Open]',
      snakeCh: 'Port 21 ❌ BROKEN → Leave Console Ch 21 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 21 is ❌ BROKEN on the AudioLink snake; Console Ch 21 is left Open.',
      forensicSummary: 'Port 21 on the AudioLink snake is broken. Leave Console Ch 21 Open.',
      preamp: 'Channel Open / Unassigned (Port 21 ❌ BROKEN)',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Keep Port 21 taped over on the AudioLink snake and leave Console Ch 21 Open.',
      hpf: 120, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 21 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 21 Broken' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Start BVs at Ch 22' }
      ]
    },
    bv1: {
      id: 'bv1', name: 'BV 1 (Soprano) — Ch 22', shortName: 'BV 1 Soprano (Ch 22)',
      snakeCh: 'Port 22 → Console Ch 22 → BV DCA + MIX 4',
      peak: '-4.43 dBFS', peakNum: -4.43, rms: '-20.08 dBFS', rmsNum: -20.08,
      gatePct: '4.0%', domFreq: '312.2 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: true,
      bands7: 'Sub 0.6% | Low 1.6% | Low-Mid 38.3% | Box 28.9% | Mid 17.7% | Upper 12.6% | Air 0.2%',
      forensicSummary: 'Gate was closed only 4.0% of the time—standing wide open 96.0% of the service flooding the mix with 312.2 Hz stage wash.',
      preamp: 'Port 22 → Console Ch 22 (1:1 Direct) • Trim: -2 dB (Peak -4.43 dBFS) • Pan: L25',
      gate: 'Expander 3:1 • Threshold: -36 dB • Key Filter: 250 Hz – 4 kHz • Release: 250 ms',
      comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 10 ms • Release: 100 ms',
      stageTip: 'Patch BV 1 (Soprano) into Port 22 → Ch 22 and assign Ch 22–27 to the BV DCA fader.',
      hpf: 135, problemFreq: 312, problemGain: 7.5,
      eq: [
        { freq: 312, q: 2.5, gain: -5.5, desc: 'Cut 312.2 Hz stage wash & proximity mud' },
        { freq: 620, q: 2.2, gain: -3.5, desc: 'Clean boxy honk' },
        { freq: 2800, q: 1.8, gain: -2.0, desc: 'Tuck slightly behind Lead Vocal presence pocket' },
        { freq: 7500, q: 0.8, gain: 2.5, desc: 'Soft harmonic blend air' }
      ]
    },
    ch24: {
      id: 'ch24', chNum: 23, defaultSnakePort: 23, category: 'VOCALS',
      name: 'BV 2 (Soprano) — Ch 23', shortName: 'BV 2 Soprano (Ch 23)',
      snakeCh: 'Port 23 → Console Ch 23 → BV DCA + MIX 4',
      peak: '-8.40 dBFS', peakNum: -8.40, rms: '-23.10 dBFS', rmsNum: -23.10,
      gatePct: '20.0%', domFreq: '330.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
      bands7: 'Sub 0.1% | Low 1.0% | Low-Mid 26.0% | Box 33.0% | Mid 25.0% | Upper 13.0% | Air 1.9%',
      forensicSummary: 'Second Soprano harmony channel on Port 23 → Console Ch 23; panned R25 opposite BV 1 (L25).',
      preamp: 'Port 23 → Console Ch 23 (1:1 Direct) • Trim: 0 dB • Pan: R25',
      gate: 'Expander 3:1 • Threshold: -36 dB • Release: 250 ms',
      comp: 'Tube Compressor • Ratio: 3.5:1 • GR: 3 dB',
      stageTip: 'Patch BV 2 (Soprano) into Port 23 → Ch 23 and route to BV DCA & MIX 4 (BV Monitor).',
      hpf: 140, problemFreq: 330, problemGain: 6.0,
      eq: [
        { freq: 220, q: 1.5, gain: -2.0, desc: 'Keep choir low end lean' },
        { freq: 330, q: 2.4, gain: -4.5, desc: 'Cut cumulative mud' },
        { freq: 3000, q: 1.8, gain: -2.5, desc: 'Carve center Lead Vocal space' },
        { freq: 10500, q: 0.8, gain: 2.5, desc: 'Soprano air halo' }
      ]
    },
    ch15: {
      id: 'ch15', chNum: 24, defaultSnakePort: 24, category: 'VOCALS',
      name: 'BV 3 (Alto) — Ch 24', shortName: 'BV 3 Alto (Ch 24)',
      snakeCh: 'Port 24 → Console Ch 24 → BV DCA + MIX 4',
      peak: '-7.80 dBFS', peakNum: -7.80, rms: '-22.40 dBFS', rmsNum: -22.40,
      gatePct: '18.5%', domFreq: '340.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
      bands7: 'Sub 0.2% | Low 1.1% | Low-Mid 28.0% | Box 34.0% | Mid 24.0% | Upper 11.5% | Air 1.2%',
      forensicSummary: 'Primary Alto harmony channel on Port 24 → Console Ch 24; cut 340 Hz lower-mid wooliness.',
      preamp: 'Port 24 → Console Ch 24 (1:1 Direct) • Trim: 0 dB • Pan: L35',
      gate: 'Expander 3:1 • Threshold: -36 dB • Release: 250 ms',
      comp: 'Tube Compressor • Threshold: -20 dB • Ratio: 3.5:1 • GR: 3–4 dB',
      stageTip: 'Patch BV 3 (Alto) into Port 24 → Ch 24.',
      hpf: 130, problemFreq: 340, problemGain: 6.5,
      eq: [
        { freq: 210, q: 1.4, gain: -1.5, desc: 'Keep alto chest lean' },
        { freq: 340, q: 2.4, gain: -4.5, desc: 'Cut lower-mid ensemble mud' },
        { freq: 2900, q: 1.8, gain: -2.0, desc: 'Sit behind Lead Vocal pocket' },
        { freq: 9500, q: 0.8, gain: 2.0, desc: 'Smooth choir air blend' }
      ]
    },
    ch25: {
      id: 'ch25', chNum: 25, defaultSnakePort: 25, category: 'VOCALS',
      name: 'BV 4 (Alto) — Ch 25', shortName: 'BV 4 Alto (Ch 25)',
      snakeCh: 'Port 25 → Console Ch 25 → BV DCA + MIX 4',
      peak: '-8.90 dBFS', peakNum: -8.90, rms: '-23.80 dBFS', rmsNum: -23.80,
      gatePct: '21.0%', domFreq: '350.0 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
      bands7: 'Sub 0.1% | Low 1.2% | Low-Mid 28.0% | Box 35.0% | Mid 23.0% | Upper 11.5% | Air 1.2%',
      forensicSummary: 'Second Alto harmony channel on Port 25 → Console Ch 25; panned R35 opposite BV 3 (L35).',
      preamp: 'Port 25 → Console Ch 25 (1:1 Direct) • Trim: 0 dB • Pan: R35',
      gate: 'Expander 3:1 • Threshold: -36 dB • Release: 250 ms',
      comp: 'Tube Compressor • Ratio: 3.5:1 • GR: 3 dB',
      stageTip: 'Patch BV 4 (Alto) into Port 25 → Ch 25 for balanced stereo alto imaging.',
      hpf: 135, problemFreq: 350, problemGain: 6.0,
      eq: [
        { freq: 210, q: 1.5, gain: -2.0, desc: 'Control chest buildup' },
        { freq: 350, q: 2.4, gain: -4.5, desc: 'Clean lower-mid wooliness' },
        { freq: 2800, q: 1.8, gain: -2.0, desc: 'Blend behind Lead Vocal' },
        { freq: 9500, q: 0.8, gain: 2.0, desc: 'Top sheen' }
      ]
    },
    bv3: {
      id: 'bv3', name: 'BV 5 (Tenor) — Ch 26', shortName: 'BV 5 Tenor (Ch 26)',
      snakeCh: 'Port 26 → Console Ch 26 → BV DCA + MIX 4',
      peak: '-11.92 dBFS', peakNum: -11.92, rms: '-28.33 dBFS', rmsNum: -28.33,
      gatePct: '9.1%', domFreq: '699.8 Hz', phase: '0° Normal', severity: 'VOCAL', isVocal: true,
      bands7: 'Sub 0.5% | Low 1.2% | Low-Mid 8.2% | Box 45.6% | Mid 36.2% | Upper 7.0% | Air 1.2%',
      forensicSummary: '8.25 dB quieter than Soprano BVs (-28.33 dBFS Active RMS), with 81.8% of energy in 350–2,000 Hz (699.8 Hz throat resonance).',
      preamp: 'Port 26 → Console Ch 26 (1:1 Direct) • Add +6 dB Preamp Gain to match BV 1 • Pan: L15',
      gate: 'Expander 3:1 • Threshold: -38 dB • Release: 250 ms',
      comp: 'Threshold: -22 dB • Ratio: 4:1 • Attack: 12 ms • Release: 110 ms • Makeup: +3.5 dB',
      stageTip: 'Patch BV 5 (Tenor) into Port 26 → Ch 26 and coach Tenor to stay within 2–3 fingers of the grille.',
      hpf: 130, problemFreq: 700, problemGain: 7.0,
      eq: [
        { freq: 240, q: 1.5, gain: 2.0, desc: 'Support Tenor lower chest note weight' },
        { freq: 700, q: 2.6, gain: -5.5, desc: 'Cut dominant 699.8 Hz boxy/nasal throat resonance' },
        { freq: 1400, q: 2.0, gain: -3.0, desc: 'Prevent Tenor from masking Lead Vocal @ 1–2 kHz' },
        { freq: 7000, q: 0.8, gain: 2.5, desc: 'Blend top air with BV group' }
      ]
    },
    bv4: {
      id: 'bv4', name: 'BV 6 (Tenor) — Ch 27', shortName: 'BV 6 Tenor (Ch 27)',
      snakeCh: 'Port 27 → Console Ch 27 → BV DCA + MIX 4',
      peak: '-6.32 dBFS', peakNum: -6.32, rms: '-19.20 dBFS', rmsNum: -19.20,
      gatePct: '13.2%', domFreq: '786.0 Hz', phase: '0° Normal', severity: 'CRITICAL', isVocal: true,
      bands7: 'Sub 0.0% | Low 0.0% | Low-Mid 0.2% | Box 26.8% | Mid 57.1% | Upper 15.0% | Air 0.9%',
      forensicSummary: 'Second Tenor harmony channel on Port 27 → Console Ch 27; verify unique analog input source (no duplicate tap with Ch 17 LV).',
      preamp: 'Port 27 → Console Ch 27 (1:1 Direct) • Pan: R15',
      gate: 'Expander 3:1 • Threshold: -38 dB • Release: 250 ms',
      comp: 'Threshold: -20 dB • Ratio: 4:1 • Attack: 12 ms • Release: 110 ms',
      stageTip: 'Patch BV 6 (Tenor) into Port 27 → Ch 27; if LV ever swaps mics with BV 6, soft-swap Ch 17 and Ch 27 input sources on the Console.',
      hpf: 135, problemFreq: 786, problemGain: 9.0,
      eq: [
        { freq: 240, q: 1.2, gain: 3.0, desc: 'Compensate weak low-mid capsule output' },
        { freq: 786, q: 3.0, gain: -5.5, desc: 'Tame 786.0 Hz capsule resonance spike' },
        { freq: 1300, q: 2.2, gain: -3.5, desc: 'Carve nasal upper-mids' },
        { freq: 7500, q: 0.8, gain: 2.5, desc: 'Add top-end air' }
      ]
    },
    ch26: {
      id: 'ch26', chNum: 28, defaultSnakePort: 28, category: 'SPEECH',
      name: 'Open Spare — Ch 28 (Port 28)', shortName: 'Ch 28 [Open Spare]',
      snakeCh: 'Port 28 (Healthy Open Spare) → Console Ch 28',
      peak: '-12.00 dBFS', peakNum: -12.00, rms: '-26.00 dBFS', rmsNum: -26.00,
      gatePct: '25.0%', domFreq: '300.0 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: true,
      bands7: 'Healthy open spare channel (Port 28 → Ch 28) ready for guest solo, acoustic guitar, or MC mic.',
      forensicSummary: 'Port 28 is the healthy open spare on the AudioLink snake; keep Ch 28 pre-configured with a safe vocal/DI starting curve.',
      preamp: 'Port 28 → Console Ch 28 (1:1 Direct Spare)',
      gate: 'Expander 2:1 • Threshold: -42 dB',
      comp: 'Standard Comp • Ratio: 3.2:1',
      stageTip: 'Use Port 28 → Ch 28 whenever an extra guest mic or instrument is added on stage.',
      hpf: 100, problemFreq: 320, problemGain: 4.0,
      eq: [
        { freq: 200, q: 1.5, gain: -2.0, desc: 'Control proximity boom' },
        { freq: 320, q: 2.2, gain: -3.5, desc: 'Clean low-mid mud' },
        { freq: 2800, q: 1.6, gain: 1.5, desc: 'Clear articulation' },
        { freq: 8000, q: 0.8, gain: 2.0, desc: 'Natural air' }
      ]
    },
    ch27: {
      id: 'ch27', chNum: 29, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 29 • Port 29 Routed to Ch 32)', shortName: 'Ch 29 [Open]',
      snakeCh: 'Port 29 Soft-Patched to Ch 32 (Playback) → Leave Ch 29 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 29 feeds Console Ch 32 (Playback); Console Ch 29 is left Open.',
      forensicSummary: 'Because Ports 30–32 are broken on the AudioLink snake, Port 29 is used for Playback and soft-patched to Console Ch 32, leaving Ch 29 Open.',
      preamp: 'Channel Open / Unassigned',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Control Port 29 Playback on Console Ch 32.',
      hpf: 100, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 29 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 29 → Ch 32' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Use Ch 32 for Playback' }
      ]
    },
    ch29: {
      id: 'ch29', chNum: 30, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 30 • Port 30 Broken)', shortName: 'Ch 30 [Open]',
      snakeCh: 'Port 30 ❌ BROKEN → Leave Console Ch 30 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 30 is ❌ BROKEN on the AudioLink snake; Console Ch 30 is left Open.',
      forensicSummary: 'Port 30 on the AudioLink snake is broken. Leave Console Ch 30 Open.',
      preamp: 'Channel Open / Unassigned (Port 30 ❌ BROKEN)',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Do not plug into broken Port 30 on the AudioLink snake.',
      hpf: 100, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 30 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 30 Broken' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Leave Open' }
      ]
    },
    ch12: {
      id: 'ch12', chNum: 31, defaultSnakePort: null, category: 'SPEECH',
      name: 'Open (Ch 31 • Port 31 Broken)', shortName: 'Ch 31 [Open]',
      snakeCh: 'Port 31 ❌ BROKEN → Leave Console Ch 31 Open',
      peak: '-99.0 dBFS', peakNum: -45.0, rms: '-45.0 dBFS', rmsNum: -45.0,
      gatePct: '100.0%', domFreq: 'N/A (Open)', phase: 'Open', severity: 'NORMAL', isVocal: false,
      bands7: 'Port 31 is ❌ BROKEN on the AudioLink snake; Console Ch 31 is left Open.',
      forensicSummary: 'Port 31 on the AudioLink snake is broken. Leave Console Ch 31 Open.',
      preamp: 'Channel Open / Unassigned (Port 31 ❌ BROKEN)',
      gate: 'Channel Muted / Open',
      comp: 'Bypassed',
      stageTip: 'Do not plug into broken Port 31 on the AudioLink snake.',
      hpf: 100, problemFreq: 500, problemGain: 0.0,
      eq: [
        { freq: 120, q: 1.0, gain: 0.0, desc: 'Channel 31 Open' },
        { freq: 500, q: 1.0, gain: 0.0, desc: 'Port 31 Broken' },
        { freq: 2000, q: 1.0, gain: 0.0, desc: 'Leave Unassigned' },
        { freq: 8000, q: 1.0, gain: 0.0, desc: 'Leave Open' }
      ]
    },
    ch31: {
      id: 'ch31', chNum: 32, defaultSnakePort: 29, category: 'SPEECH',
      name: 'Playback — Ch 32 (Via Port 29)', shortName: 'Playback (Ch 32)',
      snakeCh: 'Port 29 → Soft-Patch to Console Ch 32 (Port 32 ❌ BROKEN)',
      peak: '-6.00 dBFS', peakNum: -6.00, rms: '-16.50 dBFS', rmsNum: -16.50,
      gatePct: '0.0%', domFreq: '1,000 Hz', phase: '0° Normal', severity: 'NORMAL', isVocal: false,
      bands7: 'Pre-mastered commercial playback track profile on Port 29 → Console Ch 32.',
      forensicSummary: 'Because Port 32 is broken on the AudioLink snake, plug Playback into Port 29 and soft-patch Analog 29 → Console Ch 32.',
      preamp: 'Digital Patching: Input Source = Analog 29 (Port 29 → Ch 32) • Trim: -6 dB',
      gate: 'Gate OFF',
      comp: 'Limiter Only (-3 dB threshold catch for sudden loud MP3s)',
      stageTip: 'Plug Playback DI into Port 29 on the AudioLink snake and route it to Console Ch 32.',
      hpf: 45, problemFreq: 2500, problemGain: 3.5,
      eq: [
        { freq: 65, q: 1.2, gain: 1.0, desc: 'Warm walk-in sub presence' },
        { freq: 300, q: 1.8, gain: -2.0, desc: 'Reduce hall boom' },
        { freq: 2500, q: 1.8, gain: -2.5, desc: 'Reduce ear fatigue on loud masters' },
        { freq: 10000, q: 0.8, gain: 1.0, desc: 'Smooth top end' }
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
      phase: `Power, ${C.dspShort} & Amplifier Protection`,
      items: [
        { id: 'p1_1', text: `Verify ${C.dspFull} Sub HPF @ 38 Hz (LR24) & Sub/Top Crossover @ 90 Hz (LR24) before powering ${C.ampModel}.`, sdu: true },
        { id: 'p1_2', text: `Confirm ${C.ampModel} (2×1300W) input attenuators are matched at -3 dB (~1000W ceiling) to protect ${C.topSpeaker} tops.`, sdu: false },
        { id: 'p1_3', text: `Confirm ${C.snakeBrand} 32×8 broken ports (18, 19, 20, 21, 30, 31, 32) are taped over with red X marks on stage.`, sdu: true }
      ]
    },
    {
      phase: 'Stage Mic Color-Tape & 15-Sec Scratch Check',
      items: [
        { id: 'p2_1', text: 'Verify vocal patch on AudioLink & Console: Pastor = Port 16 (Ch 16), Lead Vocal = Port 17 (Ch 17), BVs 1–6 = Ports 22–27 (Ch 22–27).', sdu: true },
        { id: 'p2_2', text: 'Run 15-Second Individual Scratch Test: Have Pastor, LV, and each BV scratch their grille one by one while verifying unique Console meters.', sdu: true },
        { id: 'p2_3', text: 'Verify Console Digital Patching maps Ports 1–17 to Ch 1–17, Ports 22–27 to Ch 22–27, and Port 29 (Playback) to Ch 32.', sdu: true }
      ]
    },
    {
      phase: 'Drum Kit Gain, Polarity (Ø) & Key-Filtered Gates',
      items: [
        { id: 'p3_1', text: 'Pad Kick In (Ch 1) preamp by -6 dB so hardest double-stomp peaks at -6 dBFS (prevents digital clipping).', sdu: true },
        { id: 'p3_2', text: 'Engage Polarity Invert (Ø = ON) on Snare Bottom (Ch 4), Rack Tom 1 (Ch 5), Floor Tom (Ch 8), and Bass Guitar (Ch 9).', sdu: true },
        { id: 'p3_3', text: 'Turn ON Gate Key Filters: Kick In (Ch 1) @ 145 Hz, Rack Tom 1 (Ch 5) @ 170 Hz, Floor Tom (Ch 8) @ 95 Hz (blocks 204 Hz Snare bleed).', sdu: true }
      ]
    },
    {
      phase: 'Melodic Band Gain Matching & Spectral Pocket Carving',
      items: [
        { id: 'p4_1', text: 'Gain-match Main Keys (Ch 11) and Aux Keys (Ch 12) so brass/bell patches do not jump +10 dB over piano/pad.', sdu: true },
        { id: 'p4_2', text: 'Cut Main Keys (Ch 11) @ 315 Hz (-6 dB) and Aux Keys (Ch 12) @ 465 Hz (-5.5 dB) to unmask Backing & Lead Vocal warmth.', sdu: true },
        { id: 'p4_3', text: 'Notch Electric Guitar (Ch 10) @ 2,510 Hz (-7.5 dB, Q 3.5) and boost 320 Hz (+4.5 dB) to keep lyric presence clear.', sdu: true }
      ]
    },
    {
      phase: 'Lead & Backing Vocal EQ, Expander & DCA Setup',
      items: [
        { id: 'p5_1', text: 'Set Lead Vocal (Ch 17) HPF to 80 Hz, +4.5 dB @ 240 Hz, -4.5 dB @ 786 Hz, and 2:1 soft Expander (never hard-gate LV).', sdu: true },
        { id: 'p5_2', text: 'Add +6 dB preamp gain to Tenors (Ch 26–27) to match Soprano BVs (Ch 22–23), and cut 700 Hz (-5.5 dB) on Tenor throat resonance.', sdu: true },
        { id: 'p5_3', text: 'Set 3:1 Expanders (-36 dB) on all BVs (Ch 22–27) and assign BVs to DCA Group so open mics do not bleed during prayer/word.', sdu: true }
      ]
    },
    {
      phase: 'Output Bus Routing & Monitor Wedges (Outputs A–H / MIX 1–8)',
      items: [
        { id: 'p6_1', text: 'Verify Console Outputs: MIX 1 = SUBS (Out C), MIX 2 = Open, MIX 3 = BAND MONITOR (Out H), MIX 4 = BV MONITOR (Out F).', sdu: true },
        { id: 'p6_2', text: 'Verify FOH & Delay Matrix: MIX 5 = MAIN L (Out A), MIX 6 = MAIN R (Out B), MIX 7 = DELAY L (Out D), MIX 8 = DELAY R (Out E).', sdu: true },
        { id: 'p6_3', text: 'Ring out vocal wedges (MIX 4 / Out F) at 315 Hz, 786 Hz, and 2.5 kHz before worship team steps on stage.', sdu: true }
      ]
    },
    {
      phase: 'FOH Scene Memory & Mid-Service Emergency Drill',
      items: [
        { id: 'p7_1', text: 'Verify Ch 18–21 and Ch 28–31 are muted/open and Port 29 (Playback) routes cleanly to Console Ch 32.', sdu: true },
        { id: 'p7_2', text: 'Brief stage manager: if LV (Ch 17) grabs a BV mic mid-song, signal FOH to run the 5-second Console Digital Input Source Swap.', sdu: true },
        { id: 'p7_3', text: `Save calibrated soundcheck scene to Console Memory Slot "${C.sceneSlot}" before doors open.`, sdu: false }
      ]
    }
  ];

  const MATRIX_ZONES = [
    { zone: 'Sub-Bass (30 – 80 Hz)', group: 'LOW', owner: 'Kick In/Out Fundamental (50–65 Hz • Ch 1 & Ch 2)', conflict: 'Kick vs. Bass Guitar (Ch 9) + Stage Rumble', fix: `Boost Kick +5.5 dB @ 56 Hz; shelf Bass Guitar -2.5 dB @ 62 Hz; engage 38 Hz LR24 HPF on ${C.dspShort} Sub output (MIX 1 → Out C).` },
    { zone: 'Upper-Bass & Knock (80 – 160 Hz)', group: 'LOW', owner: 'Bass Guitar Fundamental (105–125 Hz • Ch 9) & Floor Tom (88 Hz • Ch 8)', conflict: 'Kick 96.9 Hz knock colliding with Bass 107.7 Hz + inverted phase (-1)', fix: 'Flip Polarity (Ø) on Bass Guitar (Ch 9), Rack Tom 1 (Ch 5), and Floor Tom (Ch 8); cut Kick -7.5 dB @ 98 Hz; set Kick Gate Key Filter to 145 Hz.' },
    { zone: 'Low-Mid Warmth vs. Mud (160 – 350 Hz)', group: 'MID', owner: 'Lead Vocal Chest Warmth (220–260 Hz • Ch 17) & Snare/Tom Body (Ch 3)', conflict: 'Main Keys (Ch 11 @ 312.2 Hz) + BV 1 stage wash (Ch 22) + Floor Tom 204.6 Hz snare bleed', fix: 'Cut Main Keys -6.0 dB @ 315 Hz and BV 1 -5.5 dB @ 312 Hz; boost LV +4.5 dB @ 240 Hz; set Floor Tom Key Filter to 95 Hz.' },
    { zone: 'Boxy Lower-Midrange (350 – 800 Hz)', group: 'MID', owner: 'Snare Crack & Natural Piano/Vocal Transition', conflict: 'Aux Keys (Ch 12 @ 463 Hz), Main Keys, Tenor BVs (Ch 26–27 @ 699.8 Hz), and thin vocal capsules (786 Hz)', fix: 'Cut Aux Keys -5.5 dB @ 465 Hz; cut Tenor BVs -5.5 dB @ 700 Hz; cut LV -4.5 dB @ 786 Hz (Q 3.0).' },
    { zone: 'Core Vocal Midrange (800 – 2,000 Hz)', group: 'HIGH', owner: 'Lead Vocal Note Pitch (Ch 17) & Bass Fret Definition (1.1 kHz • Ch 9)', conflict: 'Nasal vocal belt surges + Trumpet (Ch 14) + Aux Keys brass patches (Ch 12)', fix: 'Cut LV -3.5 dB @ 1.15 kHz; cut Aux Keys -4.0 dB @ 1.25 kHz; cut Trumpet -4.5 dB @ 1.85 kHz; boost Bass +6.5 dB @ 1.1 kHz.' },
    { zone: 'Presence & Intelligibility (2,000 – 5,000 Hz)', group: 'HIGH', owner: 'Lead Vocal Consonants (3–4.5 kHz • Ch 17) & Kick Beater (3.8 kHz • Ch 1)', conflict: 'Electric Guitar (Ch 10 @ 2,508.6 Hz spike) & Saxophone (Ch 13 @ 2.25 kHz) masking lyrics', fix: 'Notch Electric Guitar -7.5 dB @ 2,510 Hz (Q 3.5); cut Saxophone -4.5 dB @ 2.25 kHz; boost Kick Beater +6.5 dB @ 3.8 kHz.' },
    { zone: 'Harmonic Air & Brilliance (5,000 – 15,000 Hz)', group: 'HIGH', owner: 'Lead Vocal Air Shelf (8 kHz+ • Ch 17) & Soprano BV Shimmer (Ch 22–23)', conflict: 'Rack Tom gates leaking harsh cymbal wash while LV lacks air', fix: 'Tighten Tom gates with Key Filters (170 Hz / 140 Hz / 120 Hz); add +3.5 dB high-shelf @ 8 kHz on Lead Vocal (Ch 17).' }
  ];

  const DEFAULT_STRATEGIES = [
    { id: 's1', cat: 'VOCALS', title: 'Vocal Mic Swap Prevention & 5-Sec Console Recovery', body: 'Patch Pastor on Port 16 (Ch 16), Lead Vocal on Port 17 (Ch 17), and BVs 1–6 on Ports 22–27 (Ch 22–27). If singers ever swap mics mid-service, open Console Digital Patching and swap Ch 17 to the Analog Port in the Lead Singer’s hand.' },
    { id: 's2', cat: 'LOWEND', title: 'Kick 96.9 Hz Knock vs. Bass 107.7 Hz Phase Alignment', body: 'Flip Polarity (Ø) on Bass Guitar (Ch 9), Rack Tom 1 (Ch 5), Snare Bottom (Ch 4), and Floor Tom (Ch 8). Cut Kick -7.5 dB @ 98 Hz, boost Kick +5.5 dB @ 56 Hz, and enable Kick Gate Key Filter @ 145 Hz.' },
    { id: 's3', cat: 'VOCALS', title: 'Rescuing a Thin/Budget Handheld Capsule Live', body: 'Lower HPF to 80 Hz, boost +4.5 dB @ 240 Hz (warmth), notch -4.5 dB @ 786 Hz (Q 3.0), cut -3.5 dB @ 1.15 kHz, and add +3.5 dB shelf @ 8 kHz.' },
    { id: 's4', cat: 'LOWEND', title: 'Floor Tom Snare Bleed Elimination (Ch 8)', body: 'Turn ON the Console Gate Key Filter tuned to 95 Hz (Q 3.0) and notch -6.5 dB @ 205 Hz so Snare hits cannot open the Floor Tom mic.' },
    { id: 's5', cat: 'ROUTING', title: 'Main Keys (Ch 11) vs. Aux Keys (Ch 12) & Guitar 2.51 kHz Spike (Ch 10)', body: 'Gain-match Main Keys & Aux Keys. Cut Main Keys @ 315 Hz (-6 dB) and Aux Keys @ 465 Hz (-5.5 dB). On Electric Guitar (Ch 10), notch -7.5 dB @ 2,510 Hz (Q 3.5).' },
    { id: 's6', cat: 'ROUTING', title: 'Master Output Bus Architecture (MIX 1–8 → AudioLink A–H)', body: 'Route MIX 1 → Out C (Subs), MIX 2 → Open, MIX 3 → Out H (Band Monitor), MIX 4 → Out F (BV Monitor), MIX 5 → Out A (Main L), MIX 6 → Out B (Main R), MIX 7 → Out D (Delay L), MIX 8 → Out E (Delay R), and Out G → Front Fills / IEMs.' }
  ];

  const DEFAULT_GEAR = [
    { id: 'MIC-LV-17', name: 'Lead Vocal Dynamic Mic (RED Tape)', role: 'Port 17 → Ch 17 • Center Stage Lead', note: 'Primary SM58 / Beta 58A capsule. Keep strictly on Lead Stand.', status: 'Healthy' },
    { id: 'MIC-PAS-16', name: 'Pastor Wireless Mic', role: 'Port 16 → Ch 16 • Pulpit / Wireless', note: 'Keep 100% dry (no FX sends); notch 315 Hz hall ring.', status: 'Healthy' },
    { id: 'MIC-BV-22', name: 'BV 1–2 Soprano Mics (BLUE Tape)', role: 'Ports 22–23 → Ch 22–23 • Soprano BVs', note: 'Clean signal; engage 3:1 Expander (-36dB) to stop stage bleed.', status: 'Healthy' },
    { id: 'MIC-BV-24', name: 'BV 3–4 Alto Mics (GREEN Tape)', role: 'Ports 24–25 → Ch 24–25 • Alto BVs', note: 'Matched cardioid dynamics routed to BV DCA & MIX 4 (Out F).', status: 'Healthy' },
    { id: 'MIC-BV-26', name: 'BV 5–6 Tenor Mics (YELLOW/PURPLE)', role: 'Ports 26–27 → Ch 26–27 • Tenor BVs', note: 'Add +6 dB preamp trim on Tenor and cut -5.5 dB @ 700–786 Hz.', status: 'Healthy' },
    { id: 'SNK-32X8', name: 'AudioLink 32×8 Analog Snake', role: 'Stage → FOH Console (Inputs 1–32, Outputs A–H)', note: '25 working inputs; Ports 18, 19, 20, 21, 30, 31, 32 BROKEN.', status: 'Needs Attention' },
    { id: 'CON-FOH', name: 'Digital FOH Mixing Console (32-Ch)', role: 'FOH Primary Console', note: 'Ch 18–21 & Ch 28–31 Open; Port 29 soft-patched to Ch 32 (Playback); MIX 2 Open.', status: 'Healthy' },
    { id: 'AMP-IDOL13', name: 'Vatasa IDOL 13 Power Amplifier (2×1300W)', role: 'Amp Rack → VS-215P Tops', note: 'Keep attenuators at -3dB to match VS-215P 1000W AES rating.', status: 'Healthy' }
  ];

  const RECORDING_CHECKLIST = [
    { id: 'rec_1', phase: 'PreSonus Capture Setup (Pre-Service)', text: `Launch ${C.captureApp}, select Console USB 32×32 interface, and set sample rate to 48 kHz / 24-bit (or 44.1 kHz / 24-bit) with at least 25 GB free SSD space.`, critical: true },
    { id: 'rec_2', phase: 'PreSonus Capture Setup (Pre-Service)', text: 'Verify Digital Send tap point is Pre-EQ / Pre-Fader on all active stems (Ch 1–17, Ch 22–27, Ch 32) and confirm average input RMS sits at -18 dBFS (-6 dBFS max peak headroom).', critical: true },
    { id: 'rec_3', phase: 'PreSonus Capture Setup (Pre-Service)', text: 'Check Ch 16 (Pastor), Ch 17 (Lead Vocal), and Ch 22–27 (BVs 1–6) waveforms separately during scratch check to guarantee zero duplicate analog input patching.', critical: true },
    { id: 'rec_4', phase: 'Live Service Recording & Markers', text: `Engage Record Lock in ${C.captureApp} and drop Session Markers (M key) at Opening Prayer, Praise & Worship, Choir Ministration, Sermon Start, and Altar Call.`, critical: false },
    { id: 'rec_5', phase: 'Post-Service Stem Export & Backup', text: 'Save .capture session, export individual WAV stems + stereo board mix (YYYY-MM-DD_Service_Venue), and back up raw files before opening DAW.', critical: true },
    { id: 'rec_6', phase: 'Adobe Audition Surgical Cleanup', text: 'Open stems in Adobe Audition, run Adaptive Noise Reduction + DeHummer (50 Hz mains), and apply Diagnostics → Delete Silence / Auto-Gate (-38 dB) on idle BV stems (Ch 22–27).', critical: true },
    { id: 'rec_7', phase: 'Adobe Audition Phase & Clip-Gain Prep', text: 'Time-align lagging drum/bass stems (+2.93 ms Rack Tom 1, +4.04 ms Floor Tom, +1.79 ms Bass Guitar) and level uneven sermon/vocal phrases with manual Clip Gain.', critical: false },
    { id: 'rec_8', phase: 'Dunamis Pod Broadcast Export', text: 'Master sermon to -16 LUFS (-1.5 dBTP) and worship mixdown to -14 LUFS (-1.0 dBTP); export 320 kbps MP3 for Spotify (Dunamis Pod) and 96 kbps MP3/M4A for Telegram.', critical: true }
  ];

  const AUDITION_RACK_PRESETS = {
    sermon: {
      title: 'Dunamis Pod Sermon Broadcast Chain (-16 LUFS • Ch 16 Pastor)',
      subtitle: 'Optimized in Adobe Audition for Pastor wireless/pulpit speech clarity, room de-reverb, and consistent mobile playback.',
      targetLufs: '-16.0 LUFS',
      truePeak: '-1.5 dBTP',
      exportFmt: '320 kbps MP3 (Spotify) + 96 kbps Mono MP3 (Telegram)',
      slots: [
        { slot: 'Slot 1 • FFT Filter / HPF', setting: 'High-Pass @ 85 Hz (24 dB/oct Lin-Phase)', purpose: 'Strips podium thumps, HVAC rumble, and plosive sub energy.' },
        { slot: 'Slot 2 • Adaptive Noise Reduction & DeReverb', setting: 'Noise Reduction 40% (6–8 dB) • DeReverb 25%', purpose: `Removes wireless RF hiss and ${C.primaryVenue} tail slapback.` },
        { slot: 'Slot 3 • Parametric Equalizer', setting: '-4.0 dB @ 315 Hz (Q 2.5) • -2.5 dB @ 786 Hz • +2.0 dB @ 5.8 kHz', purpose: 'Cuts hall boom and nasal honk while restoring crisp consonant diction.' },
        { slot: 'Slot 4 • Single-Band / Tube Compressor + DeEsser', setting: 'Thresh -20 dB • Ratio 3.2:1 • Atk 12 ms • Rel 100 ms • DeEsser @ 6.5 kHz', purpose: 'Levels quiet teaching moments with passionate preaching peaks.' },
        { slot: 'Slot 5 • Hard Limiter (True Peak)', setting: 'Max Amplitude -1.5 dBTP • Input Boost +3.5 dB • Lookahead 7 ms', purpose: 'Locks integrated loudness at -16 LUFS with zero AAC/MP3 clipping.' }
      ]
    },
    worship: {
      title: 'Full Band Live Worship Multitrack Master (-14 LUFS • Stereo)',
      subtitle: 'Adobe Audition Multitrack mixbus chain for 24-stem live worship recordings from PreSonus Capture.',
      targetLufs: '-14.0 LUFS',
      truePeak: '-1.0 dBTP',
      exportFmt: '24-Bit / 48 kHz WAV Master + 320 kbps CBR MP3',
      slots: [
        { slot: 'Slot 1 • Phase & Polarity Alignment', setting: 'Invert Ø on Snare Btm (Ch 4), Rack Tom 1 (Ch 5), Floor Tom (Ch 8) & Bass (Ch 9)', purpose: 'Restores tight low-end punch between Kick Drum and Bass Guitar.' },
        { slot: 'Slot 2 • Parametric Equalizer (Mixbus)', setting: 'HPF 30 Hz (24 dB/oct) • -2.0 dB @ 320 Hz (Q 1.8) • +1.5 dB Shelf @ 10 kHz', purpose: 'Clears cumulative low-mid mud and adds open top-end air.' },
        { slot: 'Slot 3 • Multiband Compressor', setting: 'Low (<120Hz) 3:1 • Low-Mid (120–800Hz) 2.5:1 • High-Mid (800–5kHz) 2:1', purpose: 'Pins sub-bass weight and controls vocal/keys midrange build-up.' },
        { slot: 'Slot 4 • Stereo Imagery / Mid-Side', setting: '100% Mono below 140 Hz • +112% Stereo Width above 1.5 kHz', purpose: 'Centers Kick/Bass/LV while widening choir harmonies (Ch 22–27) and keys.' },
        { slot: 'Slot 5 • Hard Limiter (Broadcast Master)', setting: 'Max Amplitude -1.0 dBTP • Target -14.0 LUFS Integrated', purpose: 'Meets Spotify, Apple Music, and YouTube normalization standards.' }
      ]
    },
    debleed: {
      title: 'Idle Backing Vocal (Ch 22–27) & Tom Gate De-Bleed Workflow',
      subtitle: 'Eliminates 312 Hz stage wash from open BV mics and 204 Hz snare bleed from Floor/Rack Tom stems in Adobe Audition.',
      targetLufs: '-18.0 dBFS Stem',
      truePeak: '-6.0 dBFS Stem',
      exportFmt: 'Cleaned 24-Bit WAV Stems (Pre-Mixbus)',
      slots: [
        { slot: 'Step 1 • Diagnostics → Delete Silence', setting: 'Signal Below -38 dB for >180 ms • Mute/Strip with 15 ms Crossfades', purpose: 'Silences BV 1–6 stems (Ch 22–27) during spoken prayer, announcements, and solos.' },
        { slot: 'Step 2 • Spectral Frequency Display (Shift+D)', setting: 'Lasso & Attenuate 786 Hz / 2.51 kHz feedback rings by -8 dB', purpose: 'Surgically removes localized mic squeals or stage clicks without dulling vocals.' },
        { slot: 'Step 3 • Dynamics Processing (Expander)', setting: '3:1 Expander below -36 dB • Release 250 ms', purpose: 'Smoothly tapers room decay between vocal harmony lines.' },
        { slot: 'Step 4 • Drum Stem Key-Filter Gate', setting: 'Bandpass Key 90–150 Hz on Floor Tom (Ch 8) • Notch -6.5 dB @ 205 Hz', purpose: 'Prevents snare drum bleed from opening tom tracks.' },
        { slot: 'Step 5 • Manual Clip Gain Envelope', setting: 'Boost Tenors (Ch 26–27) +6 dB • Trim Aux Keys (Ch 12) brass spikes -8 dB', purpose: 'Balances raw stem levels before hitting any compressor.' }
      ]
    },
    declip: {
      title: 'Clipped Preamp & Swapped Capsule Rescue Protocol',
      subtitle: 'Restores 0.00 dBFS flat-topped drum/keys stems and thin swapped vocal capsules in Adobe Audition.',
      targetLufs: '-15.0 LUFS',
      truePeak: '-1.0 dBTP',
      exportFmt: 'Restored 24-Bit WAV Stem',
      slots: [
        { slot: 'Step 1 • Pre-Process Clip Gain', setting: 'Pull Clip Gain down -6.0 dB before running DeClipper', purpose: 'Creates headroom for reconstructed waveform peaks above 0.00 dBFS.' },
        { slot: 'Step 2 • Diagnostics → DeClipper', setting: 'Cubic Spline Interpolation • Tolerance 1% • Auto-Gain ON', purpose: 'Rebuilds clipped Kick In (Ch 1) and hot Aux Keys (Ch 12) transient peaks.' },
        { slot: 'Step 3 • Capsule Restoration EQ', setting: '+4.5 dB @ 240 Hz (Q 1.0) • -4.5 dB @ 786 Hz (Q 3.0) • -3.5 dB @ 1.15 kHz', purpose: 'Restores chest warmth and removes nasal honk if LV sang on a BV capsule.' },
        { slot: 'Step 4 • Dynamic Harmonic Exciter / Air', setting: 'High-Shelf +3.5 dB @ 8.0 kHz + Tube Saturation 8%', purpose: 'Restores top-end sheen lost on budget handheld capsules.' },
        { slot: 'Step 5 • True-Peak Safety Catch', setting: 'Hard Limiter Ceiling -1.0 dBTP', purpose: 'Guarantees zero reconstructed peaks exceed digital full scale.' }
      ]
    }
  };

  const DEPT_DOCS = {
    recording_sop: {
      fname: 'AGCM_PreSonus_Capture_and_Adobe_Audition_SOP.md',
      content: `# ${C.departmentName}: Multitrack Recording & Adobe Audition Post-Production SOP\n\n## 1. PreSonus Capture Live Recording Setup\n- Interface: Digital FOH Console (32x32 USB 2.0)\n- Format: 24-Bit / 48 kHz (or 44.1 kHz), Pre-EQ / Pre-Fader Digital Send\n- Active Stems: Ch 1–17 (Drums, Band, Horns, Loops, Pastor, Lead Vocal), Ch 22–27 (BVs 1–6), Ch 32 (Playback via Port 29)\n- Headroom: -18 dBFS average RMS, -6 dBFS max peak\n- Markers: Press M at Prayer, Worship, Choir, Sermon, and Altar Call\n\n## 2. Adobe Audition Sermon & Worship Editing Workflow\n1. Run Diagnostics -> DeClipper (if any stem hit 0.00 dBFS) after pulling clip gain down -6 dB.\n2. Run Adaptive Noise Reduction + DeHummer (50 Hz) on Ch 16 Pastor / spoken-word channels.\n3. Run Diagnostics -> Delete Silence (-38 dB threshold) on Ch 22–27 Backing Vocal stems.\n4. Apply Sermon Rack (-16 LUFS / -1.5 dBTP) or Worship Mixbus Rack (-14 LUFS / -1.0 dBTP).\n5. Export 320 kbps CBR MP3 for Dunamis Pod (Spotify) and 96 kbps MP3 for Telegram.`
    },
    conveyance_sop: {
      fname: 'AGCM_7_Venue_Conveyance_and_Setup_SOP.md',
      content: `# ${C.departmentName}: Equipment Conveyance & Venue Setup SOP\n\n## 1. Approved KNUST Campus Venues\n- ${C.primaryVenue} (48.1m x 28.0m Main Auditorium)\n- ${C.venues.slice(1).join('\n- ')}\n\n## 2. Pre-Transport Conveyance Protocol\n1. Coil all XLR and power looms using the Over-Under method; never wrap cables tightly around elbows.\n2. Secure the FOH Console inside its padded flight case before loading into the conveyance vehicle.\n3. Load heavy ${C.topSpeaker} cabinets and subwoofers on the truck floor first; place mic cases and console on top.\n\n## 3. Power-Up & Power-Down Sequence\n- **Power-Up**: Console -> DSP (${C.dspFull}) -> Power Amplifiers (${C.ampModel} LAST).\n- **Power-Down**: Power Amplifiers FIRST -> DSP -> Console LAST.`
    },
    training_manual: {
      fname: 'AGCM_Audio_Recruit_Training_Manual.md',
      content: `# ${C.departmentName}: Audio Engineering Training Curriculum\n\n## Module 1: Signal Flow & Digital Gain Staging (-18 dBFS)\n- Analog Microphone -> ${C.snakeBrand} 32x8 Snake -> Console Preamp -> A/D Converter (-18 dBFS target) -> Fat Channel (HPF, Gate, Comp, EQ) -> Subgroups/Main L/R -> ${C.dspFull} Crossover -> ${C.ampModel} Amplifiers -> Loudspeakers.\n\n## Module 2: Subtractive EQ & Frequency Unmasking\n- Always cut mud (200-400 Hz) and nasal boxiness (500-800 Hz) before applying additive boosts.\n- Engage High-Pass Filters on every non-sub channel.\n\n## Module 3: Official Master Patch & 5-Sec Swap Recovery\n- Ports 1–17 -> Console Ch 1–17 (Drums, Band, Horns, Loops, Pastor Ch 16, Lead Vocal Ch 17).\n- Ports 18–21 & 30–32 -> BROKEN (Leave Ch 18–21 & Ch 28–31 Open).\n- Ports 22–27 -> Console Ch 22–27 (BV 1–2 Soprano, BV 3–4 Alto, BV 5–6 Tenor).\n- Port 29 -> Soft-Patched to Console Ch 32 (Playback).`
    },
    rig_spec: {
      fname: `AGCM_Console_and_${C.dspShort}_Master_Config.md`,
      content: `# AGCM - KNUST Master Hardware, Patch & DSP Specification\n\n## 1. ${C.dspFull} Crossover & Limiter Guardrails\n- Subwoofers: HPF 38 Hz (LR24) to LPF 90 Hz (LR24) fed via MIX 1 -> AudioLink Out C (Subs).\n- Stacked Line Arrays & ${C.topSpeaker} Tops: HPF 90 Hz (LR24) fed via MIX 5/6 -> AudioLink Out A/B.\n- ${C.ampModel} Amplifier (2x1300W): Attenuate input -3 dB to protect 1000W AES ${C.topSpeaker} drivers.\n\n## 2. Physical AudioLink 32x8 Snake & Console Master Patch\n- Working Input Ports: 1–17, 22–29 (Ports 18, 19, 20, 21, 30, 31, 32 are BROKEN).\n- AudioLink Outputs: A=Main L (MIX 5), B=Main R (MIX 6), C=Subs (MIX 1), D=Delay L (MIX 7), E=Delay R (MIX 8), F=BV Monitors (MIX 4), G=Front Fills/IEMs, H=Band Monitor (MIX 3).`
    }
  };

  window.PORTAL_CONFIG = C;
  window.PORTAL_DATA = {
    DEFAULT_EVENTS,
    CHANNELS,
    BEFORE_AFTER_DATA,
    CHECKLIST_PHASES,
    MATRIX_ZONES,
    SNAKE_MAP,
    AUDIOLINK_OUTPUTS,
    CONSOLE_OUTPUTS,
    DEFAULT_STRATEGIES,
    DEFAULT_GEAR,
    ALL_32_INPUTS,
    HEALTHY_SNAKE_PORTS: C.healthySnakePorts,
    RECORDING_CHECKLIST,
    AUDITION_RACK_PRESETS,
    DEPT_DOCS
  };
})();
