// ===== 婚期に消ゆ : BGM（8bitゲーム風 2音 チップチューン） =====
// 楽譜は 1トークン＝8分音符。「-」で前の音をのばす、「.」は休符、「|」は小節の区切り（読み飛ばす）
'use strict';
const TRACKS = {
  title: { bpm: 88,
    lead: 'A4 - C5 - E5 - D5 C5 | B4 - - - G4 - - - | A4 - C5 - E5 - G5 - | F5 - E5 - D5 - - - | C5 - D5 - E5 - A4 - | B4 - C5 - D5 - G4 - | A4 - B4 - C5 - B4 G#4 | A4 - - - . . . .',
    bass: 'A2 - E3 - A3 - E3 - | G2 - D3 - G3 - D3 - | A2 - E3 - A3 - E3 - | D2 - A2 - D3 - A2 - | C3 - G3 - C4 - G3 - | G2 - D3 - G3 - D3 - | F2 - C3 - E2 - B2 - | A2 - E3 - A3 - - -' },
  home: { bpm: 76,
    lead: 'E5 - - D5 C5 - - - | . . G4 - A4 - C5 - | D5 - - C5 B4 - - - | . . G4 - - - . . | E5 - - D5 C5 - A4 - | G4 - - - E4 - G4 - | A4 - - G4 F4 - E4 - | D4 - - - . . . .',
    bass: 'C3 - - - G3 - - - | A2 - - - E3 - - - | D3 - - - A3 - - - | G2 - - - D3 - - - | C3 - - - G3 - - - | A2 - - - E3 - - - | F2 - - - C3 - - - | G2 - - - B2 - - -' },
  office: { bpm: 132,
    lead: 'D5 . D5 . F5 . D5 . | C5 . C5 . E5 . C5 . | D5 . D5 . F5 . A5 . | G5 . F5 . E5 . C5 . | D5 . F5 . A5 . F5 . | E5 . G5 . A#5 . G5 . | F5 . E5 . D5 . C#5 . | D5 . . . . . . .',
    bass: 'D3 D3 D3 D3 D3 D3 D3 D3 | C3 C3 C3 C3 C3 C3 C3 C3 | A#2 A#2 A#2 A#2 A#2 A#2 A#2 A#2 | A2 A2 A2 A2 A2 A2 A2 A2 | D3 D3 D3 D3 D3 D3 D3 D3 | C3 C3 C3 C3 C3 C3 C3 C3 | A#2 A#2 A#2 A#2 A2 A2 A2 A2 | D3 D3 D3 D3 D3 D3 D3 D3' },
  cafe: { bpm: 100,
    lead: 'A4 - C5 - . F5 - E5 | - - D5 - C5 - . . | A4 - C5 - . G5 - F5 | - - E5 - D5 - . . | D5 - F5 - . A5 - G5 | - - F5 - E5 - D5 - | C5 - - A4 G4 - A4 - | F4 - - - . . . .',
    bass: 'F2 - . C3 F2 - C3 . | G2 - . D3 G2 - D3 . | C3 - . G2 C3 - G2 . | F2 - . C3 F2 - C3 . | A#2 - . F3 A#2 - F3 . | G2 - . D3 G2 - D3 . | C3 - . G2 C3 - G2 . | F2 - . C3 F2 - . .' },
  gym: { bpm: 150,
    lead: 'E5 . E5 . G#5 . B5 . | A5 . G#5 . F#5 . E5 . | F#5 . F#5 . A5 . C#6 . | B5 . A5 . G#5 . F#5 . | E5 . G#5 . B5 . E6 . | D#6 . C#6 . B5 . A5 . | G#5 . F#5 . E5 . D#5 . | E5 . . . E5 . . .',
    bass: 'E2 E3 E2 E3 E2 E3 E2 E3 | A2 A3 A2 A3 A2 A3 A2 A3 | F#2 F#3 F#2 F#3 F#2 F#3 F#2 F#3 | B2 B3 B2 B3 B2 B3 B2 B3 | E2 E3 E2 E3 E2 E3 E2 E3 | A2 A3 A2 A3 A2 A3 A2 A3 | B2 B3 B2 B3 B2 B3 B2 B3 | E2 E3 E2 E3 E2 E3 E2 E3' },
  lounge: { bpm: 84,
    lead: 'F5 - E5 - D5 - A4 - | . . C5 D5 - - . . | F5 - E5 - D5 - C#5 - | . . A4 - - - . . | G5 - F5 - E5 - D5 - | C#5 - E5 - A5 - G5 - | F5 - - E5 D5 - C#5 - | D5 - - - . . . .',
    bass: 'D3 - F3 - A3 - C4 - | B2 - D3 - F3 - A3 - | A#2 - D3 - F3 - A3 - | A2 - C#3 - E3 - G3 - | G2 - A#2 - D3 - F3 - | A2 - C#3 - E3 - A3 - | D3 - C3 - A#2 - A2 - | D3 - A2 - D3 - . -' },
  izakaya: { bpm: 120,
    lead: 'D5 - E5 - G5 - E5 D5 | E5 - - - D5 - B4 - | A4 - B4 - D5 - E5 - | D5 - - - . . . . | G5 - A5 - G5 - E5 D5 | E5 - G5 - E5 - D5 B4 | A4 - B4 - D5 - B4 A4 | D5 - - - . . . .',
    bass: 'D3 . A3 . D3 . A3 . | G2 . D3 . G2 . D3 . | A2 . E3 . A2 . E3 . | D3 . A3 . D3 . A3 . | G2 . D3 . G2 . D3 . | E3 . B3 . E3 . B3 . | A2 . E3 . A2 . E3 . | D3 . A3 . D3 . . .' },
  library: { bpm: 70, leadType: 'triangle', leadVol: 0.09,
    lead: 'B5 - D6 - G5 - - - | A5 - B5 - F#5 - - - | G5 - B5 - E5 - - - | F#5 - G5 - D5 - - - | C5 - E5 - A5 - G5 - | F#5 - A5 - D6 - C6 - | B5 - A5 - G5 - F#5 - | G5 - - - . . . .',
    bass: 'G3 - D4 - B3 - D4 - | D3 - A3 - F#3 - A3 - | E3 - B3 - G3 - B3 - | B2 - F#3 - D3 - F#3 - | C3 - G3 - E3 - G3 - | D3 - A3 - F#3 - A3 - | E3 - B3 - D3 - A3 - | G3 - D4 - G3 - . -' },
  hanabi: { bpm: 112,
    lead: 'G5 - E5 - G5 - A5 - | C6 - A5 - G5 - - - | E5 - D5 - E5 - G5 - | A5 - - - . . . . | C6 - D6 - C6 - A5 - | G5 - A5 - G5 - E5 - | D5 - E5 - G5 - D5 - | C5 - - - . . . .',
    bass: 'C3 . G3 . C3 . G3 . | F2 . C3 . F2 . C3 . | A2 . E3 . A2 . E3 . | F2 . C3 . G2 . D3 . | C3 . G3 . C3 . G3 . | A2 . E3 . A2 . E3 . | G2 . D3 . G2 . D3 . | C3 . G3 . C3 . . .' },
  jikka: { bpm: 80,
    lead: 'C5 - - A4 C5 - F5 - | E5 - - D5 C5 - - - | A#4 - - A4 G4 - A4 - | C5 - - - - - . . | C5 - - A4 C5 - F5 - | G5 - - F5 E5 - D5 - | C5 - A4 - G4 - E4 - | F4 - - - - - . .',
    bass: 'F2 - C3 - A3 - C3 - | C3 - G3 - E3 - G3 - | A#2 - F3 - D3 - F3 - | F2 - C3 - A3 - C3 - | F2 - C3 - A3 - C3 - | A#2 - F3 - D3 - F3 - | C3 - G3 - E3 - G3 - | F2 - C3 - F3 - - -' },
  jewelry: { bpm: 108,
    lead: 'E5 - A5 - C#6 - B5 A5 | G#5 - B5 - E5 - - - | F#5 - A5 - D6 - C#6 B5 | A5 - - - E5 - - - | D5 - F#5 - B5 - A5 G#5 | C#5 - E5 - A5 - G#5 F#5 | E5 - G#5 - B5 - D6 - | A5 - - - . . . .',
    bass: 'A2 - E3 A3 C#4 - E3 - | E2 - B2 E3 G#3 - B2 - | D3 - A3 D4 F#3 - A3 - | A2 - E3 A3 C#4 - E3 - | B2 - F#3 B3 D4 - F#3 - | A2 - E3 A3 C#4 - E3 - | E2 - B2 E3 G#3 - B2 - | A2 - E3 - A2 - - -' },
  night: { bpm: 72,
    lead: 'B4 - - - E5 - G5 - | F#5 - - E5 D5 - - - | C5 - - - E5 - A5 - | G5 - - F#5 E5 - - - | B4 - - - E5 - G5 - | A5 - - G5 F#5 - E5 - | D#5 - - - F#5 - B5 - | E5 - - - . . . .',
    bass: 'E3 - B3 - G3 - B3 - | D3 - A3 - F#3 - A3 - | C3 - G3 - E3 - G3 - | B2 - F#3 - D#3 - F#3 - | E3 - B3 - G3 - B3 - | A2 - E3 - C3 - E3 - | B2 - F#3 - D#3 - F#3 - | E3 - B3 - E3 - - -' },
  love: { bpm: 76,
    lead: 'F#5 - - - A5 - F#5 - | E5 - - - D5 - - - | B4 - - - D5 - G5 - | F#5 - - - E5 - - - | F#5 - - - A5 - D6 - | C#6 - - B5 A5 - G5 - | F#5 - - E5 D5 - E5 - | D5 - - - . . . .',
    bass: 'D3 - A3 - F#3 - A3 - | A2 - E3 - C#3 - E3 - | G2 - D3 - B2 - D3 - | A2 - E3 - C#3 - E3 - | D3 - A3 - F#3 - A3 - | G2 - D3 - B2 - D3 - | A2 - E3 - C#3 - E3 - | D3 - A3 - D3 - - -' },
  sour: { bpm: 90, leadType: 'triangle', leadVol: 0.1,
    lead: 'E5 - D#5 - D5 - C#5 - | C5 - - - . . . . | E5 - D#5 - D5 - G#4 - | A4 - - - . . . . | C5 - B4 - A#4 - A4 - | G#4 - - - B4 - - - | E5 - F5 - E5 - D#5 - | E5 - - - . . . .',
    bass: 'A2 . A2 . A2 . A2 . | F2 . F2 . F2 . F2 . | A2 . A2 . A2 . A2 . | E2 . E2 . E2 . E2 . | A2 . A2 . A2 . A2 . | E2 . E2 . E2 . E2 . | F2 . F2 . E2 . E2 . | A2 . A2 . A2 . . .' },
  tension: { bpm: 150,
    lead: 'E5 . E5 F5 E5 . E5 F5 | E5 . D5 . C5 . B4 . | E5 . E5 F5 E5 . E5 F5 | G5 . F5 . E5 . D#5 .',
    bass: 'E2 E2 E2 E2 E2 E2 E2 E2 | F2 F2 F2 F2 F2 F2 F2 F2 | E2 E2 E2 E2 E2 E2 E2 E2 | B2 B2 B2 B2 B2 B2 B2 B2' },
  bad: { bpm: 70,
    lead: 'E5 - - - D5 - C5 - | B4 - - - A4 - - - | F4 - - - E4 - D4 - | E4 - - - - - - -',
    bass: 'A2 - E3 - A3 - E3 - | E2 - B2 - E3 - B2 - | D2 - A2 - D3 - A2 - | E2 - B2 - E3 - - -' },
  true: { bpm: 120,
    lead: 'C5 - E5 - G5 - C6 - | B5 - G5 - A5 - - - | F5 - A5 - C6 - F6 - | E6 - D6 - C6 - - - | A5 - C6 - B5 - A5 - | G5 - E5 - F5 - G5 - | A5 - B5 - C6 - D6 - | C6 - - - - - . .',
    bass: 'C3 . G3 . E3 . G3 . | G2 . D3 . F3 . D3 . | F2 . C3 . A3 . C3 . | C3 . G3 . E3 . G3 . | F2 . C3 . A3 . C3 . | C3 . G3 . E3 . G3 . | F2 . C3 . G2 . D3 . | C3 . G3 . C4 . . .' }
};
// 背景ごとの曲
const BG_BGM = { title: 'title', home: 'home', office: 'office', cafe: 'cafe', gym: 'gym', lounge: 'lounge', izakaya: 'izakaya', library: 'library', hanabi: 'hanabi', jikka: 'jikka', jewelry: 'jewelry', french: 'lounge', bookfair: 'cafe', street: 'night', libnight: 'love', grape: 'sour', shinbashi: 'night' };

function parseScore(s) {
  const ev = []; let step = 0;
  for (const t of s.split(/\s+/)) {
    if (!t || t === '|') continue;
    if (t === '-') { if (ev.length) ev[ev.length - 1].len++; step++; continue; }
    if (t === '.') { step++; continue; }
    const m = t.match(/^([A-G])(#|b)?(\d)$/);
    const pc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    ev.push({ n: 12 * (+m[3] + 1) + pc, s: step, len: 1 }); step++;
  }
  return { ev, L: step };
}

const BGM = {
  cur: null, want: null, timer: null, out: null, parts: null, stepDur: 0,
  play(name) {
    this.want = name;
    if (name === this.cur && this.timer) return;
    this.stop(true); this.want = name;
    if (!name || !AU.ctx || !OPT.bgm || !OPT.sound) return;
    const tr = TRACKS[name]; if (!tr) return;
    const ctx = AU.ctx;
    this.out = ctx.createGain(); this.out.gain.value = 1; this.out.connect(ctx.destination);
    this.stepDur = 60 / tr.bpm / 2;
    const t0 = ctx.currentTime + 0.08;
    this.parts = [
      Object.assign(parseScore(tr.lead), { type: tr.leadType || 'square', vol: tr.leadVol || 0.03, i: 0, loop0: t0 }),
      Object.assign(parseScore(tr.bass), { type: 'triangle', vol: 0.09, i: 0, loop0: t0 })
    ];
    this.cur = name;
    this.tick();
    this.timer = setInterval(() => this.tick(), 60);
  },
  tick() {
    const ctx = AU.ctx, now = ctx.currentTime, ahead = now + 0.3, sd = this.stepDur;
    for (const p of this.parts) {
      if (!p.ev.length) continue;
      for (let guard = 0; guard < 64; guard++) {
        const e = p.ev[p.i], t = p.loop0 + e.s * sd;
        if (t > ahead) break;
        if (t >= now - 0.02) this.note(e.n, t, e.len * sd, p.type, p.vol);
        if (++p.i >= p.ev.length) { p.i = 0; p.loop0 += p.L * sd; }
      }
    }
  },
  note(n, t, dur, type, vol) {
    const ctx = AU.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = 440 * Math.pow(2, (n - 69) / 12);
    const end = t + Math.max(0.05, dur * 0.92);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol * 0.75, t + Math.min(0.08, dur * 0.4)); g.gain.linearRampToValueAtTime(0.0001, end);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(end + 0.02);
  },
  stop(keepWant) {
    if (this.timer) clearInterval(this.timer);
    this.timer = null; this.cur = null; if (!keepWant) this.want = null;
    if (this.out && AU.ctx) {
      const o = this.out; o.gain.setTargetAtTime(0, AU.ctx.currentTime, 0.05);
      setTimeout(() => { try { o.disconnect(); } catch (e) { } }, 400);
    }
    this.out = null;
  },
  resume() { if (this.want) { const w = this.want; this.cur = null; this.play(w); } },
  forBg(bg) { if (bg in BG_BGM) this.play(BG_BGM[bg]); }
};
