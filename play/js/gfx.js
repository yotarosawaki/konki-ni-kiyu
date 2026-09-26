// ===== 婚期に消ゆ : ドット絵描画 =====
// 192x128 のキャンバスに、四角と点だけで描く（8bitゲーム風）
'use strict';
const W = 192, H = 128;
const C = {
  k: '#000000', w: '#fcfcfc', g: '#7c7c7c', G: '#bcbcbc', d: '#404040',
  red: '#d82800', RED: '#f83800', pink: '#f878f8', PINK: '#f8b8f8',
  skin: '#fcd8a8', skinD: '#f8b878', brown: '#881400', wood: '#ac7c00', woodD: '#503000',
  yl: '#f8b800', YL: '#fce0a8', or: '#e45c10', OR: '#fca044',
  grn: '#00a800', GRN: '#58d854', dgrn: '#005800', lime: '#b8f818',
  blue: '#0058f8', BLUE: '#3cbcfc', sky: '#a4e4fc', navy: '#0000a8', dnavy: '#00004c',
  pur: '#6844fc', PUR: '#9878f8', dpur: '#4428bc', cyan: '#00e8d8', olive: '#887000',
  hair0: '#181818', beige: '#fce0a8', tan: '#f0d090'
};
let cx;
function R(x, y, w, h, c) { cx.fillStyle = c; cx.fillRect(x | 0, y | 0, w | 0, h | 0); }
function D(x, y, w, h, c1, c2, o = 0) {
  R(x, y, w, h, c1); cx.fillStyle = c2;
  for (let j = 0; j < h; j++) for (let i = (j + o) & 1; i < w; i += 2) cx.fillRect(x + i, y + j, 1, 1);
}
function E(x, y, rx, ry, c) {
  cx.fillStyle = c;
  for (let j = -ry; j <= ry; j++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (j * j) / (ry * ry))));
    cx.fillRect(x - w, y + j, w * 2 + 1, 1);
  }
}
function rng(seed) { let s = seed; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; }
function stars(n, x, y, w, h, seed) { const r = rng(seed); for (let i = 0; i < n; i++) R(x + r() * w, y + r() * h, 1, 1, r() > .8 ? C.yl : C.w); }
function skyline(y0, seed, col, lit) {
  const r = rng(seed); let x = 0;
  while (x < W) {
    const w = 10 + (r() * 18 | 0), h = 14 + (r() * 36 | 0);
    R(x, y0 - h, w, h, col);
    for (let yy = y0 - h + 3; yy < y0 - 2; yy += 4) for (let xx = x + 2; xx < x + w - 2; xx += 3) if (r() > .55) R(xx, yy, 1, 2, lit);
    x += w + 1;
  }
}

// ---------- 背景 ----------
const BG = {
  black() { R(0, 0, W, H, C.k); },
  home() {
    D(0, 0, W, 86, C.beige, C.tan);
    R(0, 86, W, 42, C.wood); for (let y = 90; y < 128; y += 6) R(0, y, W, 1, C.woodD);
    R(12, 12, 52, 40, C.w); R(14, 14, 48, 36, C.dnavy); stars(18, 14, 14, 48, 36, 7);
    E(52, 22, 4, 4, C.YL); R(37, 14, 2, 36, C.w);
    R(8, 9, 6, 48, C.red); R(62, 9, 6, 48, C.red);
    R(70, 70, 72, 4, C.woodD); R(73, 74, 3, 22, C.woodD); R(136, 74, 3, 22, C.woodD);
    for (let i = 0; i < 3; i++) {
      const x = 74 + i * 21; R(x, 48, 19, 16, C.k); R(x + 1, 49, 17, 13, C.navy);
      for (let l = 0; l < 4; l++) R(x + 3, 51 + l * 3, 4 + ((i * 3 + l * 5) % 10), 1, l % 2 ? C.GRN : C.BLUE);
      R(x + 8, 64, 3, 6, C.g);
    }
    for (let i = 0; i < 5; i++) R(122 + i * 3, 64 - (i % 2) * 0, 2, 6, i % 2 ? C.lime : C.BLUE);
    R(148, 60, 44, 32, C.w); R(148, 56, 44, 6, C.blue); R(150, 64, 14, 6, C.G);
    const clean = window.G && G.f && G.f.cleaned;
    if (!clean) { const r = rng(3); for (let i = 0; i < 14; i++) R(152 + r() * 32, 62 + r() * 18, 8, 5, [C.red, C.navy, C.G, C.olive, C.PINK][i % 5]); }
    R(18, 104, 12, 12, C.brown); R(17, 103, 14, 2, C.or);
    const alive = window.G && G.f && G.f.plant && G.ch >= 3;
    const lc = alive ? C.grn : C.woodD;
    R(23, 88, 2, 15, lc); R(18, 92, 5, 2, lc); R(25, 95, 6, 2, lc); R(19, 98, 4, 2, lc);
    if (alive) { R(16, 90, 3, 3, C.GRN); R(28, 92, 3, 3, C.GRN); R(22, 86, 4, 3, C.GRN); }
  },
  office() {
    R(0, 0, W, H, C.G);
    R(6, 6, 180, 50, C.sky); skyline(56, 11, C.g, C.w);
    for (let x = 6; x <= 186; x += 30) R(x, 6, 2, 50, C.w);
    R(6, 56, 182, 2, C.w);
    D(0, 88, W, 40, C.g, C.G);
    R(0, 74, W, 6, C.w); R(0, 80, W, 3, C.G);
    for (let i = 0; i < 6; i++) {
      const x = 6 + i * 32; R(x, 60, 18, 13, C.k); R(x + 1, 61, 16, 10, i % 2 ? C.navy : C.dnavy);
      R(x + 3, 63, 8, 1, C.GRN); R(x + 3, 66, 11, 1, C.BLUE); R(x + 8, 73, 2, 2, C.d);
    }
    R(20, 70, 8, 4, C.lime); R(24, 66, 3, 4, C.lime);
  },
  cafe() {
    R(0, 0, W, 90, C.brown);
    for (let y = 0; y < 90; y += 6) { R(0, y, W, 1, C.wood); for (let x = (y / 6 % 2) * 8; x < W; x += 16) R(x, y, 1, 6, C.wood); }
    R(10, 12, 44, 30, C.k); R(12, 14, 40, 26, C.dgrn);
    R(15, 17, 20, 1, C.w); R(15, 22, 28, 1, C.YL); R(15, 27, 16, 1, C.w); R(15, 32, 24, 1, C.PINK);
    for (let i = 0; i < 4; i++) { R(80 + i * 26, 0, 1, 16, C.k); E(80 + i * 26, 20, 6, 4, C.yl); R(74 + i * 26, 20, 13, 2, C.brown); }
    R(0, 78, W, 50, C.woodD); R(0, 78, W, 4, C.wood); D(0, 82, W, 46, C.woodD, C.brown);
    R(140, 50, 30, 28, C.G); R(143, 54, 24, 10, C.g); R(150, 66, 3, 8, C.k); R(160, 66, 3, 8, C.k);
    for (let i = 0; i < 3; i++) { R(64 + i * 14, 70, 8, 8, C.w); R(72 + i * 14, 72, 2, 3, C.w); R(65 + i * 14, 72, 6, 2, C.BLUE); }
  },
  gym() {
    R(0, 0, W, 80, C.w); R(10, 8, 120, 60, C.sky); D(10, 8, 120, 60, C.sky, C.w);
    R(10, 8, 120, 2, C.G); R(140, 10, 40, 30, C.red); R(144, 14, 32, 4, C.w); R(144, 22, 20, 3, C.YL); R(144, 30, 26, 3, C.w);
    D(0, 80, W, 48, C.d, C.g);
    R(14, 82, 60, 4, C.k); for (let i = 0; i < 5; i++) { E(20 + i * 12, 94, 3, 3, C.k); R(16 + i * 12, 93, 9, 2, C.g); }
    R(120, 70, 50, 8, C.k); R(125, 78, 4, 20, C.k); R(160, 78, 4, 20, C.k); R(118, 90, 56, 6, C.g);
  },
  lounge() {
    R(0, 0, W, H, C.dnavy);
    R(8, 6, 120, 70, C.k); skyline(76, 23, C.dnavy, C.yl); R(90, 20, 3, 56, C.red); R(86, 38, 11, 2, C.red); R(89, 14, 5, 6, C.OR);
    for (let x = 8; x <= 128; x += 40) R(x, 6, 2, 70, C.wood);
    for (let i = 0; i < 9; i++) R(146 + (i % 3) * 8, 8 + (i / 3 | 0) * 5, 2, 2, C.yl); R(154, 2, 1, 6, C.yl);
    R(0, 96, W, 32, C.brown); D(0, 100, W, 28, C.brown, C.red);
    R(0, 84, W, 12, C.RED); R(0, 82, W, 3, C.red);
    R(150, 90, 30, 4, C.w); R(163, 94, 4, 12, C.g); R(155, 84, 5, 6, C.YL); R(170, 85, 3, 5, C.OR);
  },
  izakaya() {
    R(0, 0, W, H, C.woodD);
    for (let x = 0; x < W; x += 12) R(x, 0, 1, 90, C.brown);
    for (let i = 0; i < 4; i++) { const x = 20 + i * 48; R(x - 1, 0, 2, 8, C.k); E(x, 18, 8, 10, C.red); R(x - 8, 10, 17, 2, C.k); R(x - 8, 26, 17, 2, C.k); R(x - 2, 14, 4, 6, C.yl); }
    R(20, 38, 60, 22, C.w); for (let i = 0; i < 5; i++) R(24 + i * 11, 42, 6, 14, C.k);
    R(110, 40, 70, 20, C.YL); for (let i = 0; i < 4; i++) R(114 + i * 16, 44, 10, 12, C.brown);
    R(0, 86, W, 42, C.wood); R(0, 86, W, 3, C.YL);
    for (let i = 0; i < 6; i++) { const x = 12 + i * 30; R(x, 76, 8, 10, C.yl); R(x, 76, 8, 2, C.w); R(x + 8, 78, 2, 5, C.yl); }
    E(100, 82, 10, 3, C.w); R(94, 79, 12, 3, C.or);
  },
  library() {
    R(0, 0, W, H, C.YL);
    const r = rng(42), cols = [C.red, C.navy, C.grn, C.wood, C.pur, C.or, C.brown, C.blue, C.olive];
    for (let s = 0; s < 3; s++) {
      const sx = 4 + s * 64; R(sx, 4, 56, 84, C.woodD);
      for (let sh = 0; sh < 4; sh++) {
        const sy = 8 + sh * 20; let x = sx + 3;
        while (x < sx + 53) { const bw = 2 + (r() * 3 | 0), bh = 12 + (r() * 5 | 0); if (x + bw > sx + 53) break; R(x, sy + 16 - bh, bw, bh, cols[r() * cols.length | 0]); x += bw + (r() > .8 ? 1 : 0); }
        R(sx, sy + 16, 56, 3, C.wood);
      }
    }
    R(0, 88, W, 40, C.olive); D(0, 92, W, 36, C.olive, C.wood);
    R(0, 86, W, 4, C.wood);
  },
  hanabi() {
    D(0, 0, W, 90, C.dnavy, C.k);
    const burst = (x, y, r, c1, c2) => { for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2; for (let k = 3; k <= r; k += 3) R(x + Math.cos(t) * k, y + Math.sin(t) * k, 1, 1, k > r - 4 ? c2 : c1); } };
    burst(50, 30, 22, C.yl, C.RED); burst(130, 22, 16, C.PINK, C.w); burst(165, 48, 10, C.GRN, C.cyan); burst(96, 50, 8, C.OR, C.YL);
    R(0, 90, W, 38, C.navy); for (let y = 92; y < 128; y += 4) for (let x = (y % 8); x < W; x += 12) R(x, y, 5, 1, C.blue);
    R(0, 86, W, 5, C.k); const r = rng(9); for (let x = 0; x < W; x += 5) E(x, 86, 3, 3 + (r() * 3 | 0), C.k);
  },
  jikka() {
    R(0, 0, W, 90, C.YL);
    R(8, 6, 80, 70, C.w); for (let x = 8; x <= 88; x += 16) R(x, 6, 2, 70, C.wood); for (let y = 6; y <= 76; y += 14) R(8, y, 82, 2, C.wood);
    R(100, 6, 84, 76, C.tan); R(100, 6, 84, 2, C.woodD); R(141, 6, 2, 76, C.woodD); E(130, 44, 3, 3, C.woodD); E(154, 44, 3, 3, C.woodD);
    D(0, 82, W, 46, C.lime, C.olive);
    for (let x = 0; x < W; x += 48) R(x, 82, 2, 46, C.olive);
    R(50, 92, 92, 8, C.wood); D(46, 100, 100, 24, C.red, C.RED);
    for (let i = 0; i < 4; i++) E(80 + i * 10, 89, 3, 3, C.or);
  },
  jewelry() {
    D(0, 0, W, 84, C.w, C.PINK);
    for (let i = 0; i < 3; i++) { const x = 10 + i * 62; R(x, 44, 50, 30, C.sky); R(x, 44, 50, 2, C.w); R(x, 74, 50, 12, C.G);
      for (let j = 0; j < 4; j++) { E(x + 8 + j * 11, 62, 3, 3, C.yl); E(x + 8 + j * 11, 62, 1, 1, C.sky); R(x + 8 + j * 11, 57, 1, 2, C.w); } }
    R(0, 86, W, 42, C.PINK); D(0, 90, W, 38, C.PINK, C.w);
    R(80, 6, 32, 20, C.w); R(82, 8, 28, 16, C.yl); R(90, 12, 12, 8, C.w);
  },
  french() {
    R(0, 0, W, H, C.brown); D(0, 0, W, 70, C.brown, C.woodD);
    R(20, 10, 40, 50, C.yl); R(22, 12, 36, 46, C.or); R(130, 10, 40, 50, C.yl); R(132, 12, 36, 46, C.dpur);
    R(0, 80, W, 48, C.w); R(0, 80, W, 3, C.G);
    R(90, 62, 2, 18, C.w); E(91, 60, 1, 2, C.yl); R(60, 70, 4, 10, C.PUR); R(59, 66, 6, 5, C.red); R(126, 70, 4, 10, C.PUR);
    E(96, 96, 18, 6, C.G); E(96, 95, 14, 4, C.w); E(96, 94, 3, 2, C.or);
  },
  bookfair() {
    R(0, 0, W, 60, C.sky); R(0, 40, W, 20, C.g); skyline(60, 5, C.G, C.w);
    R(0, 60, W, 68, C.G); D(0, 90, W, 38, C.G, C.g);
    const r = rng(77), cols = [C.red, C.navy, C.grn, C.wood, C.YL, C.or, C.w];
    for (let s = 0; s < 3; s++) { const x = 6 + s * 62; R(x, 62, 54, 4, C.red); for (let i = 0; i < 6; i++) R(x + i * 9, 58, 5, 4, i % 2 ? C.w : C.red);
      R(x, 78, 54, 12, C.wood); for (let i = 0; i < 12; i++) R(x + 2 + i * 4, 70 + (r() * 3 | 0), 3, 9, cols[r() * cols.length | 0]); R(x + 4, 90, 3, 14, C.woodD); R(x + 47, 90, 3, 14, C.woodD); }
  },
  street() {
    R(0, 0, W, H, C.dnavy); stars(20, 0, 0, W, 40, 5); skyline(92, 31, C.k, C.yl);
    R(0, 92, W, 36, C.d); for (let x = 0; x < W; x += 24) R(x, 108, 12, 2, C.G);
    R(150, 40, 2, 52, C.g); E(151, 40, 5, 2, C.yl); D(140, 42, 22, 50, 'rgba(0,0,0,0)', 'rgba(248,184,0,.25)');
  },
  libnight() {
    R(0, 0, W, H, C.dnavy); D(0, 0, W, 50, C.dnavy, C.navy);
    R(30, 30, 132, 66, C.g); R(26, 26, 140, 6, C.G); R(24, 24, 144, 3, C.w);
    for (let i = 0; i < 4; i++) { R(40 + i * 30, 42, 18, 26, C.k); R(42 + i * 30, 44, 14, 22, i === 1 ? C.yl : C.dnavy); }
    R(86, 72, 20, 24, C.woodD); R(95, 72, 2, 24, C.k);
    R(0, 96, W, 32, C.G); D(0, 96, W, 32, C.G, C.w);
    const r = rng(12); for (let i = 0; i < 60; i++) R(r() * W, r() * 96, 1, 1, C.w);
    R(30, 30, 132, 2, C.w);
  },
  grape() {
    D(0, 0, W, 128, C.sky, C.w);
    R(0, 20, W, 3, C.woodD); R(40, 0, 3, 24, C.woodD); R(150, 0, 3, 24, C.woodD);
    for (let i = 0; i < 6; i++) E(30 + i * 28, 26, 8, 4, C.grn);
    const bunch = (x, y) => { for (let row = 0; row < 5; row++) for (let k = 0; k <= 4 - row; k++) { E(x + k * 5 - (4 - row) * 2.5, y + row * 5, 2, 2, C.pur); R(x + k * 5 - (4 - row) * 2.5 - 1, y + row * 5 - 1, 1, 1, C.PUR); } R(x + 7, y - 4, 1, 4, C.woodD); };
    bunch(52, 30); bunch(112, 32); bunch(160, 28);
    R(0, 104, W, 24, C.grn); D(0, 108, W, 20, C.grn, C.dgrn);
    // きつね（見上げている）
    const fx = 88, fy = 90;
    R(fx, fy, 16, 12, C.or); R(fx + 12, fy - 10, 10, 10, C.or); R(fx + 13, fy - 14, 3, 4, C.or); R(fx + 19, fy - 14, 3, 4, C.or);
    R(fx + 18, fy - 7, 2, 2, C.k); R(fx + 21, fy - 4, 2, 2, C.k); R(fx + 13, fy - 4, 6, 3, C.w);
    R(fx - 8, fy + 2, 9, 5, C.or); R(fx - 10, fy + 1, 4, 5, C.w);
    R(fx + 2, fy + 12, 3, 4, C.or); R(fx + 11, fy + 12, 3, 4, C.or);
  },
  shinbashi() {
    // 新橋のガード下（夜）
    R(0, 0, W, H, C.dnavy); stars(14, 0, 0, W, 24, 8);
    R(10, 12, 120, 14, C.G); R(10, 24, 120, 2, C.GRN);
    for (let i = 0; i < 9; i++) R(14 + i * 13, 15, 8, 6, C.yl);
    R(0, 26, W, 10, C.g); R(0, 26, W, 2, C.G);
    R(0, 36, W, 66, C.brown);
    for (let y = 36; y < 102; y += 5) { R(0, y, W, 1, C.woodD); for (let x = (y / 5 % 2) * 6; x < W; x += 12) R(x, y, 1, 5, C.woodD); }
    for (let a = 0; a < 3; a++) {
      const ax = 32 + a * 64;
      E(ax, 62, 24, 14, C.k); R(ax - 24, 62, 49, 40, C.k);
      if (a === 1) {
        E(ax, 62, 21, 12, C.or); R(ax - 21, 62, 43, 40, C.or); D(ax - 21, 62, 43, 40, C.or, C.yl);
        R(ax - 20, 60, 41, 8, C.w); for (let i = 0; i < 5; i++) R(ax - 18 + i * 8, 60, 1, 8, C.G);
        R(ax - 18, 84, 36, 3, C.woodD); R(ax - 12, 74, 5, 8, C.w); R(ax + 6, 74, 5, 8, C.w);
      } else {
        for (let i = 0; i < 3; i++) { const lx = ax - 14 + i * 14; R(lx, 54, 1, 4, C.k); E(lx, 62, 4, 5, C.red); R(lx - 1, 60, 3, 4, C.yl); }
      }
    }
    R(0, 102, W, 26, C.d); for (let x = 0; x < W; x += 20) R(x, 114, 10, 1, C.g);
  },
  title() {
    R(0, 0, W, H, C.dnavy); stars(40, 0, 0, W, 60, 99); E(160, 20, 7, 7, C.YL); E(163, 18, 6, 6, C.dnavy);
    skyline(104, 57, C.k, C.yl); R(0, 104, W, 24, C.d);
    R(40, 90, 2, 14, C.g); E(41, 90, 4, 2, C.yl);
    // ひとりの男（シルエット）
    E(96, 86, 3, 3, C.k); R(93, 89, 7, 10, C.k); R(94, 99, 2, 6, C.k); R(97, 99, 2, 6, C.k); R(99, 91, 2, 7, C.k);
  },
  card() { R(0, 0, W, H, C.k); for (let i = 0; i < W; i += 4) { R(i, 8, 2, 1, C.g); R(i, 119, 2, 1, C.g); } }
};

// ---------- 人物 ----------
const PEOPLE = {
  misaki: { f: 1, hair: C.wood, hs: 'bob', cl: C.PINK, out: 'blouse', acc: ['lanyard'] },
  yui:    { f: 1, hair: C.woodD, hs: 'pony', cl: C.w, out: 'apron' },
  reiko:  { f: 1, hair: C.hair0, hs: 'long', cl: C.navy, out: 'suit', acc: ['earring'], sharp: 1 },
  haruka: { f: 1, hair: C.or, hs: 'pony', cl: C.red, out: 'sport', acc: ['band'] },
  shiori: { f: 1, hair: C.hair0, hs: 'braid', cl: C.olive, out: 'cardigan', acc: ['glasses'] },
  yasu:   { hair: C.hair0, hs: 'short', cl: C.w, out: 'shirt', tie: C.blue, acc: ['stubble'] },
  boss:   { hair: C.G, hs: 'bald', cl: C.g, out: 'suit', tie: C.red, wide: 1 },
  nishida:{ hair: C.woodD, hs: 'messy', cl: C.g, out: 'hoodie' },
  mom:    { f: 1, hair: C.g, hs: 'perm', cl: C.PINK, out: 'apron2' },
  dad:    { hair: C.G, hs: 'short', cl: C.wood, out: 'cardigan', acc: ['glasses'] },
  goto:   { hair: C.hair0, hs: 'short', cl: C.grn, out: 'polo', wide: 1 },
  clerk:  { f: 1, hair: C.woodD, hs: 'bun', cl: C.k, out: 'suit' },
  tanaka: { hair: C.hair0, hs: 'slick', cl: C.w, out: 'suit2', tie: C.yl },
  kenta:  { hair: C.woodD, hs: 'short', cl: C.navy, out: 'polo' }
};

// ---------- 立ち絵画像（img/chara/<id>_<表情>.png）----------
// 表情差分があるのはヒロイン5人。ほかは「ふつう」1枚を全表情で使う
const SPRITE_EX = ['n', 's', 'sad', 'ang', 'sur', 'blush'];
const SPRITE_HAS_EX = ['shiori', 'misaki', 'yui', 'reiko', 'haruka'];
const SPR = {};
function loadSprites() {
  const jobs = [];
  for (const id of Object.keys(PEOPLE)) {
    for (const e of SPRITE_HAS_EX.includes(id) ? SPRITE_EX : ['n']) {
      jobs.push(new Promise(res => {
        const im = new Image();
        im.onload = () => { SPR[id + '_' + e] = im; res(); };
        im.onerror = res;
        im.src = `${window.SPRITE_BASE || ''}img/chara/${id}_${e}.png`;
      }));
    }
  }
  return Promise.all(jobs);
}

function drawPerson(id, ex = 'n', x = 96) {
  const s = PEOPLE[id]; if (!s) return;
  const sp = SPR[id + '_' + ex] || SPR[id + '_n'];
  if (sp) { cx.drawImage(sp, Math.round(x - sp.width / 2), H - sp.height); return; }
  const hx = x, hy = 69, hr = s.hair, sk = C.skin;
  // 後ろ髪
  if (s.hs === 'long') R(hx - 17, hy - 12, 34, 50, hr);
  if (s.hs === 'bob') { R(hx - 17, hy - 10, 34, 26, hr); }
  if (s.hs === 'braid') { R(hx - 16, hy - 10, 32, 22, hr); for (let i = 0; i < 6; i++) E(hx + 16, hy + 10 + i * 5, 3, 3, hr); }
  if (s.hs === 'pony') { E(hx + 16, hy - 8, 5, 5, hr); R(hx + 16, hy - 6, 6, 26, hr); }
  if (s.hs === 'perm') E(hx, hy - 4, 19, 17, hr);
  if (s.hs === 'bun') E(hx, hy - 18, 7, 6, hr);
  // 体
  const bw = s.wide ? 38 : 32;
  R(hx - 5, hy + 12, 10, 10, C.skinD);
  E(hx, 134, bw + 8, 44, s.cl);
  cx.save(); cx.translate(0, -6);
  const out = s.out;
  if (out === 'suit' || out === 'suit2') {
    for (let j = 0; j < 16; j++) R(hx - 7 + (j >> 1), 98 + j, 14 - (j >> 1) * 2, 1, C.w);
    if (s.tie) { R(hx - 1, 99, 3, 4, s.tie); R(hx - 2, 103, 5, 14, s.tie); }
  } else if (out === 'shirt') {
    R(hx - 8, 97, 16, 4, C.w); R(hx - 9, 98, 4, 5, C.G); R(hx + 5, 98, 4, 5, C.G);
    if (s.tie) { R(hx, 100, 3, 3, s.tie); R(hx - 1, 103, 5, 16, s.tie); }
  } else if (out === 'blouse') {
    R(hx - 9, 97, 18, 5, C.w); R(hx - 1, 100, 2, 28, C.w);
  } else if (out === 'apron' || out === 'apron2') {
    const ac = out === 'apron' ? C.grn : C.RED;
    R(hx - 14, 106, 28, 22, ac); R(hx - 14, 98, 3, 8, ac); R(hx + 11, 98, 3, 8, ac); R(hx - 6, 97, 12, 4, C.w);
  } else if (out === 'sport') {
    R(hx - 22, 112, 44, 3, C.w); R(hx - 20, 118, 40, 2, C.w); R(hx - 6, 97, 12, 5, C.skinD);
  } else if (out === 'cardigan') {
    R(hx - 7, 97, 14, 31, id === 'dad' ? C.YL : C.w); R(hx - 9, 97, 18, 3, C.w);
    for (let i = 0; i < 4; i++) R(hx - 9, 104 + i * 6, 2, 2, C.YL);
  } else if (out === 'hoodie') {
    R(hx - 14, 94, 28, 6, C.G); R(hx - 3, 100, 1, 10, C.w); R(hx + 3, 100, 1, 10, C.w); R(hx - 8, 116, 16, 8, C.d);
  } else if (out === 'polo') {
    R(hx - 8, 97, 16, 4, C.w); R(hx - 1, 100, 2, 8, C.w);
  }
  if ((s.acc || []).includes('lanyard')) { R(hx - 7, 99, 1, 14, C.blue); R(hx + 6, 99, 1, 14, C.blue); R(hx - 5, 112, 11, 12, C.w); R(hx - 3, 114, 7, 3, C.BLUE); }
  if (id === 'misaki' && window.G && G.ch >= 5) R(hx - 24, 122, 3, 2, C.yl);
  cx.restore();
  // 頭
  E(hx, hy, 13, 16, sk); R(hx - 15, hy - 1, 3, 7, sk); R(hx + 13, hy - 1, 3, 7, sk);
  // 前髪
  switch (s.hs) {
    case 'bald': R(hx - 15, hy - 5, 4, 10, hr); R(hx + 12, hy - 5, 4, 10, hr); R(hx - 6, hy - 16, 12, 1, C.w); break;
    case 'short': case 'messy':
      E(hx, hy - 10, 15, 8, hr); R(hx - 15, hy - 10, 4, 12, hr); R(hx + 12, hy - 10, 4, 12, hr);
      for (let i = -12; i < 12; i += 4) R(hx + i, hy - 5, 3, s.hs === 'messy' ? 3 + ((i + 12) % 8 === 0 ? 2 : 0) : 2, hr);
      if (s.hs === 'messy') { R(hx - 4, hy - 20, 2, 3, hr); R(hx + 4, hy - 20, 2, 2, hr); }
      break;
    case 'slick': E(hx, hy - 11, 15, 7, hr); R(hx - 15, hy - 10, 4, 9, hr); R(hx + 12, hy - 10, 4, 9, hr); R(hx - 6, hy - 15, 10, 1, C.G); break;
    case 'perm': E(hx, hy - 12, 15, 6, hr); for (let i = -14; i <= 12; i += 5) E(hx + i, hy - 6, 2, 2, hr); break;
    default:
      E(hx, hy - 9, 15, 9, hr);
      for (let i = -14; i < 14; i += 3) R(hx + i, hy - 6, 3, ((i + 14) / 3 | 0) % 2 ? 4 : 2, hr);
      R(hx - 15, hy - 8, 3, s.hs === 'bob' ? 22 : 14, hr); R(hx + 13, hy - 8, 3, s.hs === 'bob' ? 22 : 14, hr);
      if (s.hs === 'long') { R(hx - 16, hy, 3, 30, hr); R(hx + 14, hy, 3, 30, hr); }
  }
  if (s.hs === 'bun') { R(hx - 15, hy - 8, 3, 10, hr); R(hx + 13, hy - 8, 3, 10, hr); }
  // 目・眉・口
  const ey = hy + 1, lx = hx - 7, rx = hx + 4, eyec = C.k;
  const brow = (dx, tilt) => { R(dx, hy - 4 + (tilt > 0 ? 1 : 0), 2, 1, hr === C.G ? C.g : hr === C.or ? C.woodD : hr); R(dx + 2, hy - 4 + (tilt < 0 ? 1 : 0), 2, 1, hr === C.G ? C.g : hr === C.or ? C.woodD : hr); };
  if (ex === 'ang' || s.sharp && ex === 'n') { brow(lx - 1, -1); brow(rx, 1); }
  else if (ex === 'sad') { brow(lx - 1, 1); brow(rx, -1); }
  else { brow(lx - 1, 0); brow(rx, 0); }
  if (ex === 's') {
    for (const e of [lx, rx]) { R(e, ey + 2, 1, 1, eyec); R(e + 1, ey + 1, 1, 1, eyec); R(e + 2, ey + 2, 1, 1, eyec); }
  } else if (ex === 'sur') {
    for (const e of [lx, rx]) { R(e, ey - 1, 3, 5, eyec); R(e + 1, ey, 1, 1, C.w); }
  } else if (ex === 'cl') {
    for (const e of [lx, rx]) R(e, ey + 2, 3, 1, eyec);
  } else {
    for (const e of [lx, rx]) { R(e, ey, 3, 4, eyec); R(e + 1, ey, 1, 1, C.w); }
  }
  if (s.f) { R(lx - 1, ey, 1, 1, eyec); R(rx + 3, ey, 1, 1, eyec); }
  R(hx - 1, hy + 6, 1, 2, C.skinD);
  const my = hy + 10;
  if (ex === 's') { R(hx - 3, my, 6, 1, C.brown); R(hx - 4, my - 1, 1, 1, C.brown); R(hx + 3, my - 1, 1, 1, C.brown); }
  else if (ex === 'sad') { R(hx - 2, my, 4, 1, C.brown); R(hx - 3, my + 1, 1, 1, C.brown); R(hx + 2, my + 1, 1, 1, C.brown); }
  else if (ex === 'sur') { R(hx - 1, my - 1, 3, 3, C.brown); }
  else if (ex === 'ang') { R(hx - 3, my, 6, 1, C.brown); }
  else R(hx - 2, my, 4, 1, C.brown);
  if (ex === 'blush' || ex === 's' && s.f) { R(hx - 11, hy + 5, 4, 1, C.pink); R(hx + 7, hy + 5, 4, 1, C.pink); }
  if (ex === 'blush') { R(hx - 11, hy + 6, 4, 1, C.pink); R(hx + 7, hy + 6, 4, 1, C.pink); }
  // 小物
  const acc = s.acc || [];
  if (acc.includes('glasses')) {
    for (const e of [lx - 2, rx - 1]) { R(e, ey - 2, 7, 1, C.k); R(e, ey + 5, 7, 1, C.k); R(e, ey - 2, 1, 8, C.k); R(e + 6, ey - 2, 1, 8, C.k); }
    R(hx - 2, ey, 3, 1, C.k);
  }
  if (acc.includes('earring')) { R(hx - 15, hy + 7, 2, 2, C.yl); R(hx + 14, hy + 7, 2, 2, C.yl); }
  if (acc.includes('band')) R(hx - 14, hy - 9, 28, 3, C.w);
  if (acc.includes('stubble')) for (let i = -6; i <= 6; i += 2) R(hx + i, hy + 13 - (Math.abs(i) > 4 ? 1 : 0), 1, 1, C.skinD);
}

// ---------- 画面へ ----------
const GFX = {
  canvas: null,
  init(c) { this.canvas = c; cx = c.getContext('2d'); cx.imageSmoothingEnabled = false; },
  draw(bg, who, ex) {
    (BG[bg] || BG.black)();
    if (who) drawPerson(who, ex);
  },
  text(lines, opt = {}) {
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    lines.forEach((l, i) => {
      const size = l.size || 12; cx.font = `${size}px "DotGothic16", monospace`;
      const y = (l.y != null ? l.y : 64 + (i - (lines.length - 1) / 2) * (size + 8));
      if (l.shadow) { cx.fillStyle = l.shadow; cx.fillText(l.t, 97, y + 1); }
      cx.fillStyle = l.c || C.w; cx.fillText(l.t, 96, y);
    });
  },
  card(a, b) { BG.card(); this.text([{ t: a, size: 11, c: C.G }, { t: b, size: 16, c: C.w, shadow: C.red }]); },
  title() {
    BG.title();
    R(0, 18, W, 40, 'rgba(0,0,0,.55)');
    this.text([{ t: '婚期に消ゆ', size: 24, c: C.w, shadow: C.red, y: 34 }, { t: 'KONKI NI KIYU', size: 8, c: C.YL, y: 52 }]);
  },
  ending(bg, kind, title) {
    (BG[bg] || BG.street)();
    R(0, 44, W, 40, 'rgba(0,0,0,.7)');
    this.text([{ t: kind, size: 16, c: kind === 'TRUE END' ? C.yl : C.RED, shadow: C.k, y: 56 }, { t: title, size: 10, c: C.w, y: 74 }]);
  }
};
