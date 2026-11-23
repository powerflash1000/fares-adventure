// 🎨 التلوين: فرشة بصباعك + «تلوين ذكي» (اللون ما بيعدّيش الخط) — زي Smart Coloring بتاع PenUP
import { W, H } from './art.js';
import { Save, Sfx, FONT, L, rtl, button, gradient, celebrate, hush } from './sys.js';
import { SHARKS } from './sharks.js';

const PW = 1280, PH = 960;              // دقة الرسمة (البكسلات الحقيقية)
const SC = 0.625;                       // بتتعرض 800×600
const PX = 20, PY = 96;                 // مكان الرسمة على الشاشة
const MAXUNDO = 6;

// ---------- تخزين الرسمات الملوّنة (IndexedDB) ----------
const idb = {
  db: null,
  open() {
    return this.db || (this.db = new Promise((res, rej) => {
      const r = indexedDB.open('fares-color', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  },
  async get(k) { try { const d = await this.open(); return await new Promise(res => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); }); } catch { return undefined; } },
  async set(k, v) { try { const d = await this.open(); await new Promise(res => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = res; }); } catch { /* */ } },
};

// ---------- ٨٠ لون ----------
export const PALETTE = (() => {
  const out = ['#ffffff', '#e9ecef', '#adb5bd', '#495057', '#212529', '#8d5524', '#e0ac69', '#ffc9de'];
  const hsl = (h, s, l) => { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l); const f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join(''); };
  for (const hue of [0, 24, 48, 90, 140, 175, 205, 235, 275]) for (const l of [88, 76, 64, 54, 46, 38, 30, 22]) out.push(hsl(hue, l > 70 ? 90 : 85, l));
  return out;
})();
const hexRGB = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// ---------- مناطق الرسمة (علشان اللون يفضل جوه الخطوط) ----------
// بنوسّع الخط شوية عشان نقفل الفتحات الصغيرة، وبعدين نقسّم الأبيض لمناطق منفصلة
function buildRegions(alpha) {
  const n = PW * PH, solid = new Uint8Array(n);
  for (let i = 0; i < n; i++) solid[i] = alpha[i] > 110 ? 1 : 0;
  const dil = (src, r) => {                       // توسيع مربّع (مرحلتين أفقي/رأسي)
    const tmp = new Uint8Array(n), out = new Uint8Array(n);
    for (let y = 0; y < PH; y++) { const o = y * PW; for (let x = 0; x < PW; x++) { let v = 0; for (let k = -r; k <= r && !v; k++) { const xx = x + k; if (xx >= 0 && xx < PW && src[o + xx]) v = 1; } tmp[o + x] = v; } }
    for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) { let v = 0; for (let k = -r; k <= r && !v; k++) { const yy = y + k; if (yy >= 0 && yy < PH && tmp[yy * PW + x]) v = 1; } out[y * PW + x] = v; }
    return out;
  };
  const wall = dil(solid, 2);
  const lab = new Int32Array(n); let next = 0;
  const stack = new Int32Array(n);
  for (let s = 0; s < n; s++) {
    if (wall[s] || lab[s]) continue;
    next++; let sp = 0; stack[sp++] = s; lab[s] = next;
    while (sp) {
      const p = stack[--sp], x = p % PW, y = (p / PW) | 0;
      if (x > 0 && !wall[p - 1] && !lab[p - 1]) { lab[p - 1] = next; stack[sp++] = p - 1; }
      if (x < PW - 1 && !wall[p + 1] && !lab[p + 1]) { lab[p + 1] = next; stack[sp++] = p + 1; }
      if (y > 0 && !wall[p - PW] && !lab[p - PW]) { lab[p - PW] = next; stack[sp++] = p - PW; }
      if (y < PH - 1 && !wall[p + PW] && !lab[p + PW]) { lab[p + PW] = next; stack[sp++] = p + PW; }
    }
  }
  // بنمدّ كل منطقة تحت الخط (٣ مرّات) علشان ما يفضلش إطار أبيض حوالين الخطوط
  for (let it = 0; it < 4; it++) {
    const cp = lab.slice();
    for (let i = 0; i < n; i++) {
      if (cp[i]) continue; const x = i % PW;
      const v = (x > 0 && cp[i - 1]) || (x < PW - 1 && cp[i + 1]) || (i >= PW && cp[i - PW]) || (i < n - PW && cp[i + PW]);
      if (v) lab[i] = v;
    }
  }
  return lab;
}

// ===== المكتبة: ٥٠ شارك =====
export class Gallery extends Phaser.Scene {
  constructor() { super('Gallery'); }
  init(d) { this.page = d?.page || 0; }
  preload() {
    this.add.text(W / 2, H / 2, L('جاري التحميل…', 'Loading…'), { fontFamily: FONT, fontSize: 40, color: '#fff', rtl: rtl() }).setOrigin(0.5);
    SHARKS.forEach(s => { if (!this.textures.exists('t_' + s.id)) this.load.image('t_' + s.id, `assets/color/t/${s.id}.jpg`); });
  }
  create() {
    gradient(this, 0x74c0fc, 0x1971c2);
    this.add.text(W / 2, 48, L('🎨 التلوين', '🎨 Coloring'), { fontFamily: FONT, fontSize: 44, color: '#fff', fontStyle: '800', stroke: '#0b3a66', strokeThickness: 8, rtl: rtl() }).setOrigin(0.5);
    button(this, 90, 60, '↩', () => { hush(); this.scene.start('Map'); }, { w: 110, h: 76, color: 0xffffff, size: 38 });
    const per = 12, cols = 4, tw = 208, th = 156, gx = 56, gy = 50;
    const pages = Math.ceil(SHARKS.length / per);
    const x0 = (W - (cols * tw + (cols - 1) * gx)) / 2, y0 = 106;
    SHARKS.slice(this.page * per, this.page * per + per).forEach((s, i) => {
      const x = x0 + (i % cols) * (tw + gx), y = y0 + Math.floor(i / cols) * (th + gy);
      const card = this.add.container(x + tw / 2, y + th / 2);
      const bg = this.add.rectangle(0, 0, tw + 12, th + 12, 0xffffff).setStrokeStyle(4, 0xffd43b);
      const img = this.add.image(0, 0, 't_' + s.id).setDisplaySize(tw, th);
      const nm = this.add.text(0, th / 2 + 22, L(s.ar, s.en), { fontFamily: FONT, fontSize: 22, color: '#fff', fontStyle: '800', stroke: '#0b3a66', strokeThickness: 5, rtl: rtl() }).setOrigin(0.5);
      card.add([bg, img, nm]);
      card.setSize(tw, th + 40).setInteractive({ useHandCursor: true }).on('pointerup', p => { if (Math.hypot(p.x - p.downX, p.y - p.downY) > 25) return; Sfx.tap(); hush(); this.scene.start('Coloring', { id: s.id, from: 'Gallery', page: this.page }); });
      idb.get('thumb:' + s.id).then(t => { if (!t || !this.sys.isActive()) return; const k = 'c_' + s.id; const im = new Image(); im.onload = () => { if (!this.sys.isActive()) return; if (this.textures.exists(k)) this.textures.remove(k); this.textures.addImage(k, im); img.setTexture(k).setDisplaySize(tw, th); card.add(this.add.text(tw / 2 - 6, -th / 2 + 4, '🎨', { fontSize: 30 }).setOrigin(1, 0)); }; im.src = t; });
    });
    this.input.on('pointerup', p => { const dx = p.x - p.downX; if (Math.abs(dx) < 90 || Math.abs(p.y - p.downY) > 120) return; const np = this.page + (dx < 0 ? 1 : -1); if (np >= 0 && np < pages) { Sfx.tap(); this.scene.restart({ page: np }); } });
    if (this.page > 0) button(this, 110, H - 52, '◀', () => this.scene.restart({ page: this.page - 1 }), { w: 130, h: 70, size: 36 });
    if (this.page < pages - 1) button(this, W - 110, H - 52, '▶', () => this.scene.restart({ page: this.page + 1 }), { w: 130, h: 70, size: 36 });
    this.add.text(W / 2, H - 52, `${this.page + 1} / ${pages}`, { fontFamily: FONT, fontSize: 30, color: '#fff', fontStyle: '800' }).setOrigin(0.5);
  }
}

// ===== شاشة التلوين =====
export class Coloring extends Phaser.Scene {
  constructor() { super('Coloring'); }
  init(d) { this.sid = d?.id || 'shark01'; this.from = d?.from || 'Gallery'; this.page = d?.page || 0; this.prize = !!d?.prize; }
  preload() {
    this.add.text(W / 2, H / 2, L('جاري التحميل…', 'Loading…'), { fontFamily: FONT, fontSize: 40, color: '#fff', rtl: rtl() }).setOrigin(0.5);
    const k = 'line_' + this.sid; if (!this.textures.exists(k)) this.load.image(k, `assets/color/${this.sid}.png`);
  }
  create() {
    this.children.removeAll(true);
    gradient(this, 0xfff3bf, 0xffd8a8);
    const sh = SHARKS.find(s => s.id === this.sid);
    this.color = PALETTE[22]; this.size = 22; this.smart = true; this.eraser = false; this.undo = []; this.dirty = false; this.drawing = null;

    // ورقة الرسم: أبيض ← طبقة اللون ← الخطوط
    this.add.rectangle(PX + 400, PY + 300, 808, 608, 0x000000, 0.15).setOrigin(0.5);
    this.add.rectangle(PX + 400, PY + 300, 800, 600, 0xffffff);
    this.paintTex = this.textures.exists('paint') ? this.textures.get('paint') : this.textures.createCanvas('paint', PW, PH);
    const ctx = this.paintTex.getContext(); ctx.clearRect(0, 0, PW, PH);
    this.add.image(PX, PY, 'paint').setOrigin(0).setScale(SC);
    this.add.image(PX, PY, 'line_' + this.sid).setOrigin(0).setScale(SC);
    this.buf = ctx.getImageData(0, 0, PW, PH);

    // مناطق التلوين الذكي من ألفا الخطوط
    const src = this.textures.get('line_' + this.sid).getSourceImage();
    const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
    const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(src, 0, 0, PW, PH);
    const id = cx.getImageData(0, 0, PW, PH).data, alpha = new Uint8Array(PW * PH);
    for (let i = 0; i < alpha.length; i++) alpha[i] = id[i * 4 + 3];
    this.lab = buildRegions(alpha);

    // رجّع آخر تلوين محفوظ
    idb.get('paint:' + this.sid).then(url => { if (!url || !this.sys.isActive()) return; const im = new Image(); im.onload = () => { if (!this.sys.isActive()) return; ctx.drawImage(im, 0, 0); this.buf = ctx.getImageData(0, 0, PW, PH); this.paintTex.refresh(); }; im.src = url; });

    // الشريط العلوي
    button(this, 90, 52, '↩', () => this.leave(), { w: 110, h: 76, color: 0xffffff, size: 38 });
    this.add.text(PX + 270, 50, L(sh.ar, sh.en), { fontFamily: FONT, fontSize: 42, color: '#1864ab', fontStyle: '800', stroke: '#ffffff', strokeThickness: 8, rtl: rtl() }).setOrigin(0.5);
    const idx = SHARKS.findIndex(x => x.id === this.sid);
    this.idx = idx;
    if (!this.prize) {
      button(this, 640, 52, '◀', () => this.go(idx - 1), { w: 100, h: 76, color: 0xffffff, size: 34 });
      button(this, 760, 52, '▶', () => this.go(idx + 1), { w: 100, h: 76, color: 0xffffff, size: 34 });
    }
    if (this.prize) this.add.text(W - 130, 50, L('🎁 جايزتك!', '🎁 Your prize!'), { fontFamily: FONT, fontSize: 34, color: '#e8590c', fontStyle: '800', stroke: '#fff', strokeThickness: 7, rtl: rtl() }).setOrigin(0.5);

    // لوحة الألوان (٨٠ لون)
    const gx = 856, gy = PY + 4, cell = 51;
    this.add.rectangle(gx - 6 + 207, gy - 6 + 262, 416, 530, 0xffffff, 0.85).setStrokeStyle(4, 0xffffff);
    this.sel = this.add.rectangle(0, 0, 50, 50).setStrokeStyle(6, 0x212529).setDepth(5);
    PALETTE.forEach((hex, i) => {
      const x = gx + (i % 8) * cell + cell / 2 - 1, y = gy + Math.floor(i / 8) * cell + cell / 2 - 1;
      const sw = this.add.rectangle(x, y, 44, 44, parseInt(hex.slice(1), 16)).setStrokeStyle(2, 0x00000033).setInteractive({ useHandCursor: true });
      sw.on('pointerdown', () => { Sfx.pick(); this.color = hex; this.eraser = false; this.sel.setPosition(x, y).setVisible(true); this.refreshTools(); });
      if (hex === this.color) this.sel.setPosition(x, y);
    });
    // أدوات: حجم الفرشة + ذكي + ممحاة + تراجع + مسح + تم
    const ty = H - 52; this.toolBtns = {};
    const tool = (key, x, label, fn, w = 92) => { const b = button(this, x, ty, label, fn, { w, h: 76, color: 0xffffff, size: 34 }); this.toolBtns[key] = b; return b; };
    const bx = (PX + 60);
    tool('s1', bx, '•', () => { this.size = 10; this.eraser = false; this.refreshTools(); });
    tool('s2', bx + 100, '●', () => { this.size = 22; this.eraser = false; this.refreshTools(); });
    tool('s3', bx + 200, '⬤', () => { this.size = 40; this.eraser = false; this.refreshTools(); });
    tool('smart', bx + 340, L('🧠 ذكي', '🧠 Smart'), () => { this.smart = !this.smart; this.refreshTools(); }, 180);
    tool('erase', bx + 500, '🩹', () => { this.eraser = !this.eraser; this.refreshTools(); });
    tool('undo', bx + 600, '↶', () => this.doUndo());
    tool('clear', bx + 700, '🗑️', () => this.doClear());
    button(this, W - 190, ty, L('تمّ ✔', 'Done ✔'), () => this.finish(), { w: 260, h: 80, color: 0x69db7c, text: '#0b3d1a', size: 38 });
    this.refreshTools();

    // الرسم بالصباع
    this.input.on('pointerdown', p => this.down(p));
    this.input.on('pointermove', p => this.move(p));
    this.input.on('pointerup', p => this.up(p));
    this.input.on('pointerupoutside', p => this.up(p));
    this.events.once('shutdown', () => this.saveNow());
  }
  update() { if (this.needRefresh) { this.paintTex.getContext().putImageData(this.buf, 0, 0); this.paintTex.refresh(); this.needRefresh = false; } }
  refreshTools() {
    const mark = (k, on) => this.toolBtns[k].setAlpha(on ? 1 : 0.7).setScale(on ? 1.06 : 1);
    mark('s1', this.size === 10 && !this.eraser); mark('s2', this.size === 22 && !this.eraser); mark('s3', this.size === 40 && !this.eraser);
    mark('smart', this.smart); mark('erase', this.eraser);
    this.toolBtns.smart.list[2].setText(this.smart ? L('🧠 ذكي', '🧠 Smart') : L('✏️ حر', '✏️ Free'));
  }
  toPaint(p) { return [(p.x - PX) / SC, (p.y - PY) / SC]; }
  inSheet(p) { return p.x >= PX && p.y >= PY && p.x < PX + 800 && p.y < PY + 600; }
  down(p) {
    if (this.drawing != null || !this.inSheet(p)) return;
    const [x, y] = this.toPaint(p), xi = Math.floor(x), yi = Math.floor(y);
    this.undo.push(this.buf.data.slice()); if (this.undo.length > MAXUNDO) this.undo.shift();
    this.drawing = p.id; this.last = [x, y];
    this.region = this.smart ? this.lab[Math.min(PH - 1, Math.max(0, yi)) * PW + Math.min(PW - 1, Math.max(0, xi))] : -1;
    this.stamp(x, y); this.dirty = true;
  }
  move(p) {
    if (this.drawing !== p.id) return;
    const [x, y] = this.toPaint(p), [lx, ly] = this.last;
    const d = Math.hypot(x - lx, y - ly), step = Math.max(2, this.size / 3), n = Math.ceil(d / step);
    for (let i = 1; i <= n; i++) this.stamp(lx + (x - lx) * i / n, ly + (y - ly) * i / n);
    this.last = [x, y];
  }
  up(p) { if (this.drawing === p.id) { this.drawing = null; this.saveSoon(); } }
  // نقطة فرشة: دايرة ناعمة الحواف، بتتلون بس جوه المنطقة المختارة
  stamp(cx, cy) {
    const r = this.size, d = this.buf.data, lab = this.lab, reg = this.region;
    const x0 = Math.max(0, Math.floor(cx - r - 1)), x1 = Math.min(PW - 1, Math.ceil(cx + r + 1));
    const y0 = Math.max(0, Math.floor(cy - r - 1)), y1 = Math.min(PH - 1, Math.ceil(cy + r + 1));
    const [cr, cg, cb] = hexRGB(this.color), er = this.eraser;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const i = y * PW + x;
      if (reg !== -1 && lab[i] !== reg) continue;
      const cov = Math.max(0, Math.min(1, r + 0.5 - Math.hypot(x + 0.5 - cx, y + 0.5 - cy)));
      if (cov <= 0) continue;
      const o = i * 4;
      if (er) { d[o + 3] = Math.round(d[o + 3] * (1 - cov)); continue; }
      const a0 = d[o + 3] / 255, a = cov + a0 * (1 - cov);
      d[o] = (cr * cov + d[o] * a0 * (1 - cov)) / a; d[o + 1] = (cg * cov + d[o + 1] * a0 * (1 - cov)) / a; d[o + 2] = (cb * cov + d[o + 2] * a0 * (1 - cov)) / a; d[o + 3] = a * 255;
    }
    this.needRefresh = true;
  }
  doUndo() { const s = this.undo.pop(); if (!s) { Sfx.soft(); return; } this.buf.data.set(s); this.needRefresh = true; this.dirty = true; Sfx.pick(); this.saveSoon(); }
  doClear() { this.undo.push(this.buf.data.slice()); if (this.undo.length > MAXUNDO) this.undo.shift(); this.buf.data.fill(0); this.needRefresh = true; this.dirty = true; Sfx.pick(); this.saveSoon(); }
  saveSoon() { this.saveTimer?.remove(); this.saveTimer = this.time.delayedCall(800, () => this.saveNow()); }
  saveNow() {
    if (!this.dirty) return; this.dirty = false;
    try {
      const ctx = this.paintTex.getContext(); ctx.putImageData(this.buf, 0, 0);
      idb.set('paint:' + this.sid, this.paintTex.canvas.toDataURL('image/png'));
      const t = document.createElement('canvas'); t.width = 320; t.height = 240; const c = t.getContext('2d');
      c.fillStyle = '#fff'; c.fillRect(0, 0, 320, 240); c.drawImage(this.paintTex.canvas, 0, 0, 320, 240); c.drawImage(this.textures.get('line_' + this.sid).getSourceImage(), 0, 0, 320, 240);
      idb.set('thumb:' + this.sid, t.toDataURL('image/jpeg', 0.8));
    } catch { /* */ }
  }
  finish() {
    this.saveTimer?.remove(); this.saveNow();
    Sfx.win(); celebrate(this, PX + 400, PY + 300, 30);
    const t = this.add.text(PX + 400, PY + 300, L('جميل أوي! 🌟', 'Beautiful! 🌟'), { fontFamily: FONT, fontSize: 70, color: '#fff', fontStyle: '800', stroke: '#e8590c', strokeThickness: 12, rtl: rtl() }).setOrigin(0.5).setDepth(80).setScale(0);
    this.tweens.add({ targets: t, scale: 1, duration: 500, ease: 'Back.Out' });
    this.time.delayedCall(1700, () => { if (this.prize || this.idx >= SHARKS.length - 1) this.leave(); else this.go(this.idx + 1); });
  }
  // تنقّل لشارك تاني (الحالي بيتحفظ)
  go(i) {
    if (i < 0 || i >= SHARKS.length) { Sfx.soft(); return; }
    this.saveTimer?.remove(); this.saveNow(); hush();
    this.scene.start('Coloring', { id: SHARKS[i].id, from: this.from, page: Math.floor(i / 12) });
  }
  leave() { this.saveTimer?.remove(); this.saveNow(); hush(); this.scene.start(this.from, this.from === 'Gallery' ? { page: this.page } : undefined); }
}
