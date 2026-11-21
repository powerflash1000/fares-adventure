// الأنظمة: الحفظ، الأصوات، الراوي، وأدوات الواجهة (أزرار، فقاعات كلام، احتفال)
export const FONT = 'Cairo, Tahoma, sans-serif';

// ===== الحفظ (على الجهاز) =====
const KEY = 'fares:save';
const DEF = { lang: 'en', stars: {}, pharos: 0, sound: true, voice: true, limitMin: 30, todayMin: 0, today: '', seenIntro: false };
export const Save = {
  d: (() => { try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEF }; } })(),
  put() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch { /* */ } },
  star(id) { if (!this.d.stars[id]) { this.d.stars[id] = true; this.put(); return true; } return false; },
  count(prefix) { return Object.keys(this.d.stars).filter(k => k.startsWith(prefix)).length; },
};

// اللغة: إنجليزي بسيط (الأساسي) أو عربي — L('عربي', 'English')
export const isAr = () => Save.d.lang === 'ar';
export const L = (ar, en) => (isAr() ? ar : en);
export const rtl = () => isAr();

// ===== أصوات بسيطة بالكود (من غير ملفات): نجاح، غلط لطيف، دوس، احتفال =====
let ac = null;
const ctx = () => (ac ||= new (window.AudioContext || window.webkitAudioContext)());
function tone(f, d = 0.15, type = 'sine', v = 0.15, when = 0) {
  if (!Save.d.sound) return;
  try { const c = ctx(), o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; const t = c.currentTime + when; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + 0.02); } catch { /* */ }
}
export const Sfx = {
  tap: () => tone(660, 0.08, 'triangle', 0.1),
  pick: () => tone(520, 0.1, 'sine', 0.12),
  ok: () => { tone(660, 0.12); tone(880, 0.16, 'sine', 0.15, 0.1); },
  soft: () => tone(300, 0.18, 'sine', 0.08),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.14, i * 0.12)),
  sparkle: () => [1200, 1500, 1800].forEach((f, i) => tone(f, 0.12, 'sine', 0.06, i * 0.06)),
  splash: () => { for (let i = 0; i < 6; i++) tone(900 + Math.random() * 600, 0.05, 'sine', 0.05, i * 0.04); },
};

// ===== الراوي: صوت مؤقت من المتصفح (عربي) لحد ما نولّد الجمل بصوت بابا من ElevenLabs =====
let arVoice = null, enVoice = null;
function pickVoice() {
  const v = speechSynthesis.getVoices();
  arVoice = v.find(x => /ar[-_]EG/i.test(x.lang)) || v.find(x => /^ar/i.test(x.lang)) || null;
  enVoice = v.find(x => /en[-_]US/i.test(x.lang) && /samantha|female|google us/i.test(x.name)) || v.find(x => /en[-_](US|GB)/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
export function speak(text, { rate = 0.95, pitch = 1.15 } = {}) {
  return new Promise(res => {
    if (!Save.d.voice || !('speechSynthesis' in window)) return setTimeout(res, Math.min(4000, 600 + text.length * 55));
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[🌱💧☀️⭐🌟✨🎉👏💪🧭🔦]/gu, ''));
    const vv = isAr() ? arVoice : enVoice;
    u.lang = vv?.lang || (isAr() ? 'ar-EG' : 'en-US'); if (vv) u.voice = vv; u.rate = isAr() ? rate : rate * 0.95; u.pitch = pitch;
    let done = false; const fin = () => { if (!done) { done = true; res(); } };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 1500 + text.length * 120);
    speechSynthesis.speak(u);
  });
}
export const hush = () => { try { speechSynthesis.cancel(); } catch { /* */ } };

// ===== أدوات الواجهة =====
// زرار مدوّر كبير مناسب لصباع طفل
export function button(scene, x, y, label, onClick, { w = 280, h = 90, color = 0xffd43b, text = '#3b2a00', size = 34 } = {}) {
  const c = scene.add.container(x, y);
  const shadow = scene.add.graphics().fillStyle(0x000000, 0.18).fillRoundedRect(-w / 2, -h / 2 + 8, w, h, h / 2);
  const bg = scene.add.graphics().fillStyle(color, 1).fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
  const t = scene.add.text(0, 0, label, { fontFamily: FONT, fontSize: size, color: text, fontStyle: '800', rtl: rtl() }).setOrigin(0.5);
  c.add([shadow, bg, t]);
  c.setSize(w, h).setInteractive({ useHandCursor: true });
  c.on('pointerdown', () => { Sfx.tap(); scene.tweens.add({ targets: c, scale: 0.92, duration: 80, yoyo: true, onComplete: () => onClick?.() }); });
  c.on('pointerover', () => c.setScale(1.04)); c.on('pointerout', () => c.setScale(1));
  return c;
}

// فقاعة كلام بتطلع فوق الشخصية + الراوي بيقولها
export function say(scene, who, text, { x, y, width = 520, speakIt = true, hold = 0 } = {}) {
  const bx = x ?? who.x, by = y ?? (who.y - who.displayHeight * who.originY - 20);
  const t = scene.add.text(0, 0, text, { fontFamily: FONT, fontSize: 30, color: '#1d1d1d', fontStyle: '700', rtl: rtl(), align: 'center', wordWrap: { width: width - 40, useAdvancedWrap: true } }).setOrigin(0.5);
  const w = Math.max(160, t.width + 46), h = t.height + 34;
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.15).fillRoundedRect(-w / 2, -h + 6, w, h, 26);
  g.fillStyle(0xffffff, 1).fillRoundedRect(-w / 2, -h, w, h, 26).fillTriangle(-14, -2, 14, -2, 0, 22);
  t.setY(-h / 2);
  const c = scene.add.container(clampX(scene, bx, w), by, [g, t]).setDepth(50).setScale(0);
  scene.tweens.add({ targets: c, scale: 1, duration: 260, ease: 'Back.Out' });
  const p = speakIt ? speak(text) : new Promise(r => setTimeout(r, 900 + text.length * 50));
  return p.then(() => new Promise(r => scene.time.delayedCall(hold, r))).then(() => { if (c.active) scene.tweens.add({ targets: c, scale: 0, duration: 180, onComplete: () => c.destroy() }); });
}
const clampX = (scene, x, w) => Math.min(scene.scale.width - w / 2 - 10, Math.max(w / 2 + 10, x));

// احتفال: نجوم ونور
export function celebrate(scene, x, y, n = 18) {
  Sfx.sparkle();
  for (let i = 0; i < n; i++) {
    const s = scene.add.image(x, y, 'star').setScale(0.18 + Math.random() * 0.2).setDepth(60);
    const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 220;
    scene.tweens.add({ targets: s, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d - 60, angle: 360 * (Math.random() > 0.5 ? 1 : -1), alpha: 0, duration: 900 + Math.random() * 500, ease: 'Cubic.Out', onComplete: () => s.destroy() });
  }
}

// حركة تنفّس/تمايل خفيفة للشخصيات عشان تبان حيّة
export function idle(scene, obj, amt = 0.03) {
  scene.tweens.add({ targets: obj, scaleY: obj.scaleY * (1 + amt), scaleX: obj.scaleX * (1 - amt / 2), duration: 900 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
}

// خلفية متدرّجة لأي مشهد
export function gradient(scene, top, bottom) {
  const { width: w, height: h } = scene.scale;
  const g = scene.add.graphics();
  g.fillGradientStyle(top, top, bottom, bottom, 1).fillRect(0, 0, w, h);
  return g;
}

// زرار رجوع صغير
export function back(scene, target = 'Map') {
  return button(scene, 90, 60, '↩', () => { hush(); scene.scene.start(target); }, { w: 110, h: 76, color: 0xffffff, size: 38 });
}
