// ===== 婚期に消ゆ : エンジン =====
'use strict';
var G = null;
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.random() * a.length | 0];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
};
const KEY = { save: 'konki_v1_slot', end: 'konki_v1_endings', opt: 'konki_v1_opt' };
const OPT = Object.assign({ sound: true, bgm: true, speed: 30 }, store.get(KEY.opt) || {});
const ENDSIG = { end: true };

// ---------- 音 ----------
const AU = { ctx: null };
function auInit() { if (AU.ctx) return; try { AU.ctx = new (window.AudioContext || window.webkitAudioContext)(); BGM.resume(); } catch (e) { } }
function tone(freq, dur, type = 'square', vol = 0.05, when = 0) {
  if (!OPT.sound || !AU.ctx) return;
  const t = AU.ctx.currentTime + when, o = AU.ctx.createOscillator(), g = AU.ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(AU.ctx.destination); o.start(t); o.stop(t + dur + 0.03);
}
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
function jingle(seq, step = 0.12, type = 'square', vol = 0.05) { let t = 0; for (const [n, l] of seq) { if (n) tone(NOTE(n), l * step * 0.95, type, vol, t); t += l * step; } }
const SFX = {
  blip: () => tone(1046, 0.025, 'square', 0.015),
  sel: () => tone(1318, 0.04, 'square', 0.03),
  ok: () => { tone(988, 0.05); tone(1318, 0.09, 'square', 0.05, 0.06); },
  no: () => tone(150, 0.18, 'square', 0.05),
  up: () => { tone(784, 0.06); tone(1046, 0.1, 'square', 0.05, 0.07); },
  down: () => { tone(330, 0.08, 'triangle', 0.08); tone(220, 0.16, 'triangle', 0.08, 0.09); },
  phone: () => { for (let i = 0; i < 3; i++) { tone(1568, 0.05, 'square', 0.03, i * 0.13); tone(1318, 0.05, 'square', 0.03, i * 0.13 + 0.06); } },
  chapter: () => jingle([[72, 1], [76, 1], [79, 1], [84, 2], [0, 1], [79, 1], [84, 4]], 0.11),
  sour: () => jingle([[76, 2], [75, 2], [74, 2], [73, 2], [72, 6]], 0.16, 'triangle', 0.08),
  bad: () => jingle([[69, 2], [68, 2], [65, 2], [64, 2], [57, 8]], 0.2, 'triangle', 0.09),
  good: () => jingle([[67, 1], [72, 1], [76, 1], [79, 2], [76, 1], [79, 1], [84, 2], [0, 1], [83, 1], [84, 1], [86, 1], [88, 6]], 0.13),
  boom: () => { tone(80, 0.3, 'sawtooth', 0.06); tone(55, 0.5, 'triangle', 0.08, 0.05); }
};

// ---------- 画面 ----------
let curBg = 'black', curWho = null, curEx = 'n';
function scene(bg, who = null, ex = 'n') { BGM.forBg(bg); curBg = bg; curWho = who; curEx = ex; GFX.draw(bg, who, ex); }
function face(who, ex = 'n') { curWho = who; curEx = ex; GFX.draw(curBg, who, ex); }
function noface() { curWho = null; GFX.draw(curBg); }

function hearts(v) { const n = Math.ceil(v / 20); return '♥'.repeat(n) + '♡'.repeat(5 - n); }
function status() {
  const s = $('status');
  if (!G || !G.ch) { s.innerHTML = ''; return; }
  const c = CH[G.ch];
  s.innerHTML = `<span>第${G.ch === 8 ? '終' : G.ch}章 ${c.month}</span><span class="st-heart" title="こころ">こころ ${hearts(G.mental)}</span><span>ちょきん ${G.money}万円</span>`;
}
function popup(t, cls) {
  const p = document.createElement('div'); p.className = 'pop ' + (cls || ''); p.textContent = t;
  $('picwin').appendChild(p); setTimeout(() => p.remove(), 1600);
}

// ---------- 入力 ----------
const IN = { mode: null, resolve: null, typing: false, skip: false, items: [], idx: 0, cancel: false, ul: null };
async function typeText(t) {
  const m = $('msgtext'); $('choices').innerHTML = ''; $('more').hidden = true;
  const tid = IN.tid = (IN.tid || 0) + 1;
  IN.typing = true; IN.skip = false; m.textContent = '';
  let buf = '', i = 0;
  for (const ch of t) {
    if (tid !== IN.tid) return;
    if (IN.skip) { m.textContent = t; break; }
    buf += ch; m.textContent = buf;
    if (ch.trim() && (i++ % 2 === 0)) SFX.blip();
    await sleep(ch === '。' || ch === '…' ? OPT.speed * 3 : OPT.speed);
  }
  IN.typing = false;
}
function waitAdvance() {
  $('more').hidden = false;
  return new Promise(r => { IN.mode = 'text'; IN.resolve = () => { $('more').hidden = true; r(); }; });
}
async function say(...pages) {
  for (const p of pages.flat()) { await typeText(p); await waitAdvance(); }
}
function renderMenu() {
  IN.ul.querySelectorAll('button, a').forEach((b, i) => b.classList.toggle('cur', i === IN.idx));
}
function menu(items, opt = {}) {
  const ul = opt.inMsg ? $('choices') : $('cmds');
  if (!opt.inMsg) { $('cmdtitle').textContent = opt.title || 'コマンド'; }
  ul.innerHTML = '';
  const list = items.slice(); if (opt.cancel) list.push('もどる');
  list.forEach((t, i) => {
    const li = document.createElement('li');
    const href = opt.links && opt.links[i];
    const b = document.createElement(href ? 'a' : 'button');
    if (href) { b.href = href; b.target = '_blank'; b.rel = 'noopener noreferrer'; b.classList.add('ext'); }
    else b.type = 'button';
    b.textContent = t; if (opt.cancel && i === list.length - 1) b.classList.add('back');
    b.addEventListener('mouseenter', () => { IN.idx = i; renderMenu(); });
    b.addEventListener('click', e => { e.stopPropagation(); auInit(); if (href) { IN.idx = i; renderMenu(); if (opt.onLink) opt.onLink(); return; } IN.idx = i; choose(); });
    li.appendChild(b); ul.appendChild(li);
  });
  ul.classList.toggle('two', !!opt.two);
  IN.items = list; IN.idx = 0; IN.cancel = !!opt.cancel; IN.ul = ul; IN.two = !!opt.two;
  renderMenu();
  return new Promise(r => {
    IN.mode = 'menu';
    IN.resolve = i => {
      ul.innerHTML = ''; if (!opt.inMsg) $('cmdtitle').textContent = '';
      r(opt.cancel && i === list.length - 1 ? -1 : i);
    };
  });
}
function choose() {
  if (IN.mode !== 'menu') return;
  const cur = IN.ul.querySelectorAll('button, a')[IN.idx];
  if (cur && cur.tagName === 'A') { SFX.sel(); cur.click(); return; }
  IN.mode = null; SFX.sel(); IN.resolve(IN.idx); }
async function ask(prompt, options, opt = {}) {
  await typeText(prompt);
  return menu(options, Object.assign({ inMsg: true }, opt));
}
function advance() {
  auInit();
  if (IN.typing) { IN.skip = true; return; }
  if (IN.mode === 'text') { IN.mode = null; IN.resolve(); }
}
document.addEventListener('keydown', e => {
  const k = e.key;
  if (IN.mode === 'menu') {
    const n = IN.items.length, step = IN.two ? 2 : 1;
    if (k === 'ArrowDown') { IN.idx = (IN.idx + step) % n; SFX.blip(); renderMenu(); e.preventDefault(); }
    else if (k === 'ArrowUp') { IN.idx = (IN.idx - step + n) % n; SFX.blip(); renderMenu(); e.preventDefault(); }
    else if (IN.two && (k === 'ArrowRight' || k === 'ArrowLeft')) { IN.idx = IN.idx ^ 1; if (IN.idx >= n) IN.idx = n - 1; SFX.blip(); renderMenu(); e.preventDefault(); }
    else if (k === 'Enter' || k === ' ' || k === 'z' || k === 'Z') { auInit(); choose(); e.preventDefault(); }
    else if ((k === 'Escape' || k === 'x' || k === 'X' || k === 'Backspace') && IN.cancel) { IN.idx = n - 1; choose(); e.preventDefault(); }
    else if (/^[1-9]$/.test(k) && +k <= n) { IN.idx = +k - 1; choose(); }
  } else if (k === 'Enter' || k === ' ' || k === 'z' || k === 'Z') { advance(); e.preventDefault(); }
});
['msgwin', 'picwin'].forEach(id => $(id).addEventListener('click', advance));

// ---------- 状態 ----------
function newState() {
  return { ch: 1, loc: 'home', love: { misaki: 0, yui: 0, reiko: 0, haruka: 0, shiori: 0 }, mental: 70, money: 300, items: [], f: {}, c: {}, turn: 0, pending: 'intro' };
}
function n(k) { G.c[k] = (G.c[k] || 0) + 1; return G.c[k]; }
function once(k) { if (G.f['_' + k]) return false; G.f['_' + k] = 1; return true; }
function love(w, d) { G.love[w] = (G.love[w] || 0) + d; }
function mental(d) {
  G.mental = Math.max(0, Math.min(100, G.mental + d));
  if (d < 0) { SFX.down(); popup('こころ ' + d, 'neg'); } else if (d > 0) { SFX.up(); popup('こころ +' + d, 'pos'); }
  status();
}
function money(d) { G.money += d; popup('ちょきん ' + (d > 0 ? '+' : '') + d + '万', d < 0 ? 'neg' : 'pos'); status(); }
function give(it) { if (!G.items.includes(it)) G.items.push(it); SFX.ok(); popup('「' + it + '」を てにいれた'); }
function has(it) { return G.items.includes(it); }
function take(it) { G.items = G.items.filter(x => x !== it); }
function seenEndings() { return (store.get(KEY.end) || []).filter(k => ENDINGS[k]); }

// ---------- 結婚相談所への案内（BAD END の最後）----------
const CFM_URL = 'https://cf-m.jp/contact';
const CFM_LINK = id => CFM_URL + '?utm_source=konki&utm_medium=game&utm_campaign=badend&utm_content=' + id;
async function consult(id) {
  const gentle = id === 'mental';
  noface(); BGM.play('cafe');
  GFX.card('ITエンジニア専門の結婚相談所', 'CODE FOR MARRIAGE');
  const pages = gentle ? [
    '（PR）CODE FOR MARRIAGE からの ごあんない',
    'しんどい ときは、婚活を 休んで いい。急がなくて いい。',
    '話を 聞いて ほしく なったら、ITエンジニア専門の 結婚相談所「CODE FOR MARRIAGE」の オンライン無料相談 という 手も ある。'
  ] : [
    '（PR）CODE FOR MARRIAGE からの ごあんない',
    '婚活を ひとりで 抱えこむのは、障害対応を ひとりで 抱えこむのと 同じくらい 危ない。',
    'ITエンジニア専門の 結婚相談所「CODE FOR MARRIAGE」。担当カウンセラーは、元ITエンジニア。仕様書に ない 気持ちも、いっしょに 考えて くれる。'
  ];
  track('consult_view', { ending_id: id });
  await say(...pages);
  while (true) {
    const i = await ask('まずは オンライン無料相談から。', ['オンライン無料相談を みる（cf-m.jp）', 'ゲームを おわる'], { links: { 0: CFM_LINK(id) }, onLink: () => track('consult_click', { ending_id: id }) });
    if (i === 1) break;
  }
}

// ---------- エンディング ----------
async function END(id) {
  const e = ENDINGS[id];
  const seen = seenEndings(); if (!seen.includes(id)) { seen.push(id); store.set(KEY.end, seen); }
  const kind = e.type === 'true' ? 'TRUE END' : 'BAD END';
  track('ending_reached', { ending_id: id, ending_no: e.no, ending_type: e.type === 'true' ? 'true' : 'bad' });
  $('cmdtitle').textContent = ''; $('cmds').innerHTML = '';
  scene(e.bg || 'street');
  BGM.play(e.type === 'true' ? 'true' : 'bad');
  await sleep(300);
  await say(...e.text);
  GFX.ending(e.bg || 'street', kind, `No.${e.no}「${e.title}」`);
  await say(`――― ${kind} No.${e.no}「${e.title}」 ―――`, `タツの ひとこと：\n「${e.yasu}」`);
  if (e.type !== 'true') await consult(id);
  const total = Object.keys(ENDINGS).length;
  await say(`みた エンディング：${seenEndings().length} / ${total}\n\nおわり`);
  G = null;
  throw ENDSIG;
}

// ---------- すっぱいブドウ ----------
async function sour(def) {
  scene('grape'); noface();
  await say('〜 すっぱい ブドウの じかん 〜', ...def.intro);
  let opts = shuffle(def.opts.slice());
  while (true) {
    const shaky = G.mental < 35;
    const labels = opts.map(o => o.cont && shaky ? '……' + o.t.replace(/^……/, '') + '……？' : o.t);
    const i = await ask(shaky ? '（こころの こえが、やけに 大きく 聞こえる）' : '（こころの こえが する）', labels);
    const o = opts[i];
    if (o.end) { await say(o.say || '……そうだ。そうに ちがいない。', 'オレは 静かに、婚活を 降りた。'); await END(o.end); }
    if (o.fn) { const r = await o.fn(); if (r === 'again') { opts = opts.filter(x => x !== o); continue; } }
    if (o.cont) { await say(o.after || '……もう少しだけ、がんばってみよう。'); mental(5); }
    G.sourPassed = (G.sourPassed || 0) + 1;
    return;
  }
}

// ---------- セーブ ----------
function slotInfo(i) { const d = store.get(KEY.save + i); return d ? `${i}: 第${d.g.ch === 8 ? '終' : d.g.ch}章 ${LOCS[d.g.loc] ? LOCS[d.g.loc].name : ''}（${d.t}）` : `${i}: ―― からっぽ ――`; }
async function saveMenu() {
  const i = await menu([1, 2, 3].map(slotInfo), { title: 'どこに？', cancel: true });
  if (i < 0) return;
  const d = new Date(), t = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (store.set(KEY.save + (i + 1), { g: G, t })) { SFX.ok(); await say(`きろく ${i + 1} に きろく しました。`); }
  else { SFX.no(); await say('きろく できませんでした。（ブラウザの 保存領域が つかえない ようです）'); }
}
async function loadMenu() {
  const i = await menu([1, 2, 3].map(slotInfo), { title: 'どれを？', cancel: true });
  if (i < 0) return false;
  const d = store.get(KEY.save + (i + 1));
  if (!d) { SFX.no(); await say('その きろくは からっぽです。'); return false; }
  G = JSON.parse(JSON.stringify(d.g)); SFX.ok(); return true;
}
async function optMenu() {
  while (true) {
    const i = await menu([`おと：${OPT.sound ? 'ON' : 'OFF'}`, `BGM：${OPT.bgm ? 'ON' : 'OFF'}`, `もじ：${OPT.speed <= 12 ? 'はやい' : OPT.speed >= 45 ? 'おそい' : 'ふつう'}`], { title: 'せってい', cancel: true });
    if (i < 0) return;
    if (i === 0) OPT.sound = !OPT.sound;
    if (i === 1) OPT.bgm = !OPT.bgm;
    if (i === 0 || i === 1) { if (OPT.sound && OPT.bgm) BGM.resume(); else BGM.stop(true); }
    if (i === 2) OPT.speed = OPT.speed <= 12 ? 30 : OPT.speed >= 45 ? 10 : 50;
    store.set(KEY.opt, OPT);
  }
}
async function sysMenu() {
  const i = await menu(['きろくする', 'よみこむ', 'せってい', 'タイトルへ'], { title: 'きろく', cancel: true });
  if (i === 0) await saveMenu();
  if (i === 1) { if (await loadMenu()) { await say('きろくを よみこみました。'); return 'reload'; } }
  if (i === 2) await optMenu();
  if (i === 3) { const k = await ask('タイトルに もどりますか？（きろく していない しんこうは きえます）', ['もどる', 'やめる']); if (k === 0) { G = null; throw ENDSIG; } }
}

// ---------- メインループ ----------
const CMDS = ['いどう', 'はなす', 'みる', 'しらべる', 'もちもの', 'スマホ', 'かんがえる', 'きろく'];
const LONELY = ['だれも いない。ひとりごとを いった。……むなしい。', 'はなし相手が いない。スマートスピーカーに 話しかけた。\n「すみません、よく わかりません」', 'だれも いない。壁に むかって「こんにちは」と 言った。壁は なにも 言わなかった。'];
function peopleHere() { const L = LOCS[G.loc]; return L.people ? L.people() : []; }
function drawLoc() { const L = LOCS[G.loc]; const ps = peopleHere(); scene(L.bg, ps[0] || null, 'n'); }

async function chapterStart() {
  track('chapter_start', { chapter: G.ch });
  const c = CH[G.ch];
  $('cmdtitle').textContent = ''; $('cmds').innerHTML = '';
  GFX.card(G.ch === 8 ? '最終章' : `第${G.ch}章`, c.title); BGM.stop(); SFX.chapter(); status();
  await say(`${G.ch === 8 ? '最終章' : '第' + G.ch + '章'}「${c.title}」\n― ${c.month} ―`);
  if (c.intro) await c.intro();
}

async function runCmd(cmd) {
  const L = LOCS[G.loc];
  switch (cmd) {
    case 'いどう': {
      const ids = CH[G.ch].locs.filter(id => id !== G.loc && (!LOCS[id].open || LOCS[id].open()));
      if (!ids.length) { await say('いまは どこにも いけない。'); return; }
      if (L.leave && (await L.leave()) === false) return;
      const i = await menu(ids.map(id => LOCS[id].name), { title: 'どこへ？', cancel: true });
      if (i < 0) return;
      G.loc = ids[i]; drawLoc();
      await say(`${LOCS[G.loc].name}に いどうした。`);
      if (LOCS[G.loc].enter) await LOCS[G.loc].enter();
      return;
    }
    case 'はなす': {
      const ps = peopleHere();
      if (!ps.length) { noface(); await say(pick(LONELY)); return; }
      let who = ps[0];
      if (ps.length > 1) { const i = await menu(ps.map(p => NAMES[p]), { title: 'だれと？', cancel: true }); if (i < 0) return; who = ps[i]; }
      face(who, 'n');
      const h = L.talk && L.talk[who];
      if (h) await h(); else await say(`${NAMES[who]}「……」`);
      return;
    }
    case 'みる': if (L.look) await L.look(); else await say('とくに かわった ところは ない。'); return;
    case 'しらべる': {
      const ex = typeof L.exam === 'function' ? L.exam() : (L.exam || {});
      const names = Object.keys(ex);
      if (!names.length) { await say('しらべる ものは なさそうだ。'); return; }
      const i = await menu(names, { title: 'なにを？', cancel: true, two: names.length > 4 });
      if (i < 0) return;
      await ex[names[i]]();
      return;
    }
    case 'もちもの': {
      if (!G.items.length) { await say(`なにも もっていない。\nちょきんは ${G.money}万円。`); return; }
      const i = await menu(G.items, { title: 'もちもの', cancel: true });
      if (i < 0) return;
      const it = G.items[i];
      const j = await menu(['みる', 'つかう'], { title: it, cancel: true });
      if (j === 0) await say(ITEM_DESC[it] || `${it}だ。`);
      if (j === 1) { const u = (L.use && L.use[it]) || USE[it]; if (u) await u(); else await say(pick(['いまは つかえない。', 'ここで つかっても しかたがない。', '……なにも おこらない。'])); }
      return;
    }
    case 'スマホ': {
      const ops = phoneOptions();
      const labels = Object.keys(ops);
      const i = await menu(labels, { title: 'スマホ', cancel: true });
      if (i < 0) return;
      await ops[labels[i]]();
      return;
    }
    case 'かんがえる': { noface(); if (L.think && (await L.think()) !== false) return; await CH[G.ch].think(); return; }
    case 'きろく': return sysMenu();
  }
}

async function play() {
  try {
    while (true) {
      if (G.pending === 'intro') { G.pending = null; await chapterStart(); continue; }
      drawLoc(); status();
      await typeText(`〔${LOCS[G.loc].name}〕 どうする？`);
      const i = await menu(CMDS, { title: 'コマンド', two: true });
      const r = await runCmd(CMDS[i]);
      if (r === 'reload') continue;
      await afterCmd(CMDS[i]);
    }
  } catch (e) {
    if (e === ENDSIG) return titleScreen();
    console.error(e); throw e;
  }
}

async function afterCmd(cmd) {
  if (cmd === 'きろく') return;
  G.turn++;
  if (G.mental <= 0) { await say('……もう、なにも かんがえたく ない。'); await END('mental'); }
  const c = CH[G.ch];
  if (c.tick) await c.tick();
  if (c.done && c.done()) {
    if (c.outro) await c.outro();
    if (c.sour) await sour(c.sour);
    G.ch++; G.loc = CH[G.ch].start; G.turn = 0; G.pending = 'intro';
    return;
  }
  if (c.limit) {
    if (G.turn === c.limit - 10) { noface(); await say('……季節が 少しずつ うつろって いく。\n（いそいだ ほうが いいかも しれない）'); }
    if (G.turn >= c.limit) { await say('迷っている うちに、季節は 過ぎて いった。'); await END('season'); }
  }
}

// ---------- タイトル ----------
async function titleScreen() {
  G = null; status(); curWho = null;
  GFX.title(); BGM.play('title');
  typeText('〜33さい エンジニア、けっこんへの ながい みち〜\n\n© 2026 CodeForMarriage');
  while (true) {
    const i = await menu(['はじめから', 'つづきから', 'エンディング', 'あそびかた', 'せってい'], { title: 'タイトル' });
    IN.skip = true;
    if (i === 0) { G = newState(); track('game_start'); return play(); }
    if (i === 1) { if (await loadMenu()) { track('game_continue', { chapter: G.ch }); return play(); } }
    if (i === 2) await endingList();
    if (i === 3) await howTo();
    if (i === 4) await optMenu();
    GFX.title(); BGM.play('title');
    typeText('〜33さい エンジニア、けっこんへの ながい みち〜\n\n© 2026 CodeForMarriage');
  }
}
async function endingList() {
  const seen = seenEndings(), all = Object.entries(ENDINGS).sort((a, b) => a[1].no - b[1].no);
  const lines = all.map(([id, e]) => `${String(e.no).padStart(2, '0')} ${seen.includes(id) ? e.title : '？？？？？？'}`);
  const pages = [];
  for (let i = 0; i < lines.length; i += 6) pages.push(`みた エンディング ${seen.length}/${all.length}\n` + lines.slice(i, i + 6).join('\n'));
  await say(...pages);
}
async function howTo() {
  await say(
    'あなたは 33歳の エンジニア。\n町や 職場で 出会う 女性たちと 仲良くなり、プロポーズを 成功させれば クリア です。',
    'コマンドを えらんで 物語を すすめます。\n同じ 人に 何度も「はなす」と、話が 進むことが あります。',
    '「しらべる」で 見つけた ことは、あとで 役に 立つ かも しれません。\n困ったら「かんがえる」か、スマホで タツに LINE。',
    'ときどき「すっぱい ブドウの じかん」が やってきます。\nもっともらしい 言いわけに 負けると、そこで 婚活は 終わり です。',
    'プロポーズ成功の 到達率は、およそ 1%を 想定しています。\nこまめに「きろく」しましょう。（3か所まで）',
    'そうさ：クリック／タップ、または ↑↓ と Enter（Esc で もどる）'
  );
}

// ---------- 起動 ----------
window.addEventListener('load', async () => {
  GFX.init($('pic'));
  try { await Promise.all([document.fonts.load('16px "DotGothic16"'), loadSprites()]); } catch (e) { }
  titleScreen();
});
