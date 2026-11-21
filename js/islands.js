// المهمات الجديدة: جزيرة النبات (الألوان + الأشكال) — جزيرة المية — كهف الشجاعة
import { W, H } from './art.js';
import { FONT, Sfx, say, speak, celebrate, idle, button, L, rtl } from './sys.js';
import { Mission } from './scenes.js';

// إيموجي كبير بيتسحب (فاكهة، حيوانات، حاجات)
function emo(scene, x, y, ch, size = 96, drag = true) {
  const t = scene.add.text(x, y, ch, { fontSize: size, padding: { x: 8, y: 8 } }).setOrigin(0.5);
  if (drag) { t.setInteractive({ draggable: true, useHandCursor: true }); scene.input.setDraggable(t); }
  t.home = { x, y };
  return t;
}
function dragSetup(scene, onDrop) {
  scene.input.on('dragstart', (p, o) => { Sfx.pick(); o.setDepth(20); scene.tweens.add({ targets: o, scale: 1.15, duration: 100 }); });
  scene.input.on('drag', (p, o, x, y) => { o.x = x; o.y = y; });
  scene.input.on('dragend', (p, o) => { scene.tweens.add({ targets: o, scale: 1, duration: 100 }); onDrop(o); });
}
const goHome = (scene, o) => scene.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400, ease: 'Back.Out' });
const near = (a, b, d) => Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) < d;
// كلمة قصيرة من فارس (فقاعة صغيرة)
const shout = (scene, text) => say(scene, scene.kid, text, { x: W / 2, y: 130, width: 360 });
const OOPS_SHAPE = () => L('أوبس! بص على الشكل تاني 👀', 'Oops! Look at the shape again.');
const OOPS_COLOR = () => L('أوبس! بص على اللون تاني 👀', 'Oops! Look at the color again.');

// ================= جزيرة النبات — المهمة ٤: ألوان الفاكهة =================
const COLORS = [
  { id: 'red', hex: 0xe03131, word: () => L('أحمر!', 'Red!'), fruits: ['🍎', '🍓'] },
  { id: 'yellow', hex: 0xfab005, word: () => L('أصفر!', 'Yellow!'), fruits: ['🍌', '🍋'] },
  { id: 'green', hex: 0x2f9e44, word: () => L('أخضر!', 'Green!'), fruits: ['🥦', '🥒'] },
  { id: 'purple', hex: 0x9c36b5, word: () => L('بنفسجي!', 'Purple!'), fruits: ['🍇', '🍆'] },
];
export class Plant4 extends Mission {
  constructor() { super('Plant4'); }
  create() {
    this.head(L('🌈 المهمة ٤: ألوان الفاكهة', '🌈 Mission 4: Fruit colors'));
    this.baskets = COLORS.map((c, i) => {
      const x = 170 + i * 215, y = H - 120;
      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.15).fillRoundedRect(x - 92, y - 52, 184, 120, 22);
      g.fillStyle(c.hex, 1).fillRoundedRect(x - 90, y - 60, 180, 118, 22);
      g.lineStyle(6, 0xffffff, 0.9).strokeRoundedRect(x - 90, y - 60, 180, 118, 22);
      return { ...c, x, y, rect: new Phaser.Geom.Rectangle(x - 100, y - 90, 200, 170), n: 0 };
    });
    const all = Phaser.Utils.Array.Shuffle(COLORS.flatMap(c => c.fruits.map(f => [f, c.id])));
    this.left = all.length;
    all.forEach(([f, id], i) => { const o = emo(this, 120 + (i % 4) * 170 + (i >= 4 ? 85 : 0), 200 + (i >= 4 ? 150 : 0), f, 92); o.col = id; idle(this, o, 0.04); });
    dragSetup(this, o => this.drop(o));
    this.hint(L('الفاكهة ليها ألوان كتير! حط كل فاكهة في السبت اللي بنفس لونها', 'Fruits come in many colors! Put each fruit in the basket with the same color.'));
  }
  async drop(o) {
    const b = this.baskets.find(k => k.rect.contains(o.x, o.y));
    if (!b) return goHome(this, o);
    if (b.id !== o.col) { Sfx.soft(); goHome(this, o); return this.hint(OOPS_COLOR()); }
    Sfx.ok(); this.input.setDraggable(o, false); o.disableInteractive();
    this.tweens.add({ targets: o, x: b.x - 40 + b.n * 80, y: b.y - 10, scale: 0.8, duration: 300 }); b.n++;
    shout(this, b.word());
    if (--this.left === 0) { await new Promise(r => this.time.delayedCall(1300, r)); await this.hint(L('هايل! أحمر وأصفر وأخضر وبنفسجي. إنت شاطر في الألوان!', 'Wonderful! Red, yellow, green and purple. You know your colors!')); this.win('plant4', 'Plant5'); }
  }
}

// ================= جزيرة النبات — المهمة ٥: طريق الأشكال (مع فريد) =================
const SHAPES = [
  { id: 'circle', word: () => L('دايرة!', 'Circle!'), color: 0xff6b6b },
  { id: 'square', word: () => L('مربع!', 'Square!'), color: 0x4dabf7 },
  { id: 'triangle', word: () => L('مثلث!', 'Triangle!'), color: 0x51cf66 },
  { id: 'star', word: () => L('نجمة!', 'Star!'), color: 0xfcc419 },
];
function drawShape(g, id, r, fill, line) {
  if (fill != null) g.fillStyle(fill, 1); if (line != null) g.lineStyle(8, line, 1);
  const pts = id === 'square' ? [[-r, -r], [r, -r], [r, r], [-r, r]]
    : id === 'triangle' ? [[0, -r * 1.1], [r * 1.1, r * 0.8], [-r * 1.1, r * 0.8]]
      : id === 'star' ? Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.5 : r * 1.15; return [Math.cos(a) * rr, Math.sin(a) * rr]; }) : null;
  if (!pts) { if (fill != null) g.fillCircle(0, 0, r); if (line != null) g.strokeCircle(0, 0, r); return; }
  const P = pts.map(([x, y]) => new Phaser.Geom.Point(x, y));
  if (fill != null) g.fillPoints(P, true); if (line != null) g.strokePoints(P, true);
}
export class Plant5 extends Mission {
  constructor() { super('Plant5'); }
  create() {
    this.head(L('🔷 المهمة ٥: طريق الأشكال', '🔷 Mission 5: The shape path'));
    // النهر
    this.add.rectangle(W / 2 - 60, H - 210, W - 300, 150, 0x4dabf7, 0.75);
    this.farid = this.add.image(90, H - 20, 'farid').setOrigin(0.5, 1).setScale(0.48); idle(this, this.farid);
    const order = Phaser.Utils.Array.Shuffle([...SHAPES]);
    this.holes = order.map((s, i) => { const x = 270 + i * 175, y = H - 210; const g = this.add.graphics({ x, y }); drawShape(g, s.id, 52, 0x1864ab, 0xffffff); return { ...s, x, y, done: false }; });
    this.left = SHAPES.length;
    Phaser.Utils.Array.Shuffle([...SHAPES]).forEach((s, i) => {
      const x = 220 + i * 190, y = 230;
      const g = this.add.graphics(); drawShape(g, s.id, 52, s.color, 0x8a5a2b);
      const c = this.add.container(x, y, [g]).setSize(130, 130).setInteractive({ draggable: true, useHandCursor: true });
      this.input.setDraggable(c); c.home = { x, y }; c.shape = s.id; idle(this, c, 0.03);
    });
    dragSetup(this, o => this.drop(o));
    (async () => {
      await say(this, this.farid, L('فارس! ساعدني نبني طريق بالأشكال علشان نعدّي النهر!', 'Fares! Help me build a path with shapes so we can cross the river!'), { x: 330, y: H - 330 });
      this.hint(L('حط كل حجر في الحفرة اللي بنفس الشكل', 'Put each stone in the hole with the same shape.'));
    })();
  }
  async drop(o) {
    const h = this.holes.find(k => !k.done && near(o, k, 85));
    if (!h) return goHome(this, o);
    if (h.id !== o.shape) { Sfx.soft(); goHome(this, o); return this.hint(OOPS_SHAPE()); }
    h.done = true; Sfx.ok(); o.disableInteractive();
    this.tweens.add({ targets: o, x: h.x, y: h.y, duration: 250 });
    shout(this, h.word());
    if (--this.left === 0) {
      await new Promise(r => this.time.delayedCall(1200, r));
      this.farid.setTexture('farid_cheer'); celebrate(this, W / 2, H - 220, 20);
      await say(this, this.farid, L('عملناها! دايرة ومربع ومثلث ونجمة. شكرًا يا صغيّر!', 'We did it! Circle, square, triangle and star. Thanks, little brother!'), { x: 330, y: H - 360 });
      this.win('plant5');
    }
  }
}

// ================= جزيرة المية — المهمة ١: يطفو ولا يغرق؟ =================
const FLOATS = [
  { ch: '🦆', f: true, q: () => L('البطة هتطفو ولا تغرق؟', 'Will the duck float or sink?') },
  { ch: '🪨', f: false, q: () => L('الحجر هيطفو ولا يغرق؟', 'Will the stone float or sink?') },
  { ch: '🍃', f: true, q: () => L('ورقة الشجر هتطفو ولا تغرق؟', 'Will the leaf float or sink?') },
  { ch: '🔑', f: false, q: () => L('المفتاح هيطفو ولا يغرق؟', 'Will the key float or sink?') },
  { ch: '⚽', f: true, q: () => L('الكورة هتطفو ولا تغرق؟', 'Will the ball float or sink?') },
  { ch: '🪙', f: false, q: () => L('العملة هتطفو ولا تغرق؟', 'Will the coin float or sink?') },
];
export class Water1 extends Mission {
  constructor() { super('Water1'); }
  create() {
    this.head(L('🛟 مهمة المية ١: يطفو ولا يغرق؟', '🛟 Water mission 1: Float or sink?'), 'water');
    // حوض مية شفاف
    const tx = W / 2 - 80, ty = H - 230;
    this.tank = { x: tx, top: ty - 120, bottom: ty + 150 };
    this.add.rectangle(tx, ty + 15, 460, 270, 0x74c0fc, 0.55).setStrokeStyle(10, 0xffffff, 0.9);
    this.add.rectangle(tx, ty - 120, 460, 10, 0xd0ebff, 0.9);
    this.items = Phaser.Utils.Array.Shuffle([...FLOATS]); this.i = 0;
    this.btns = [];
    (async () => { await this.hint(L('في حاجات بتطفو على المية، وحاجات بتغرق. يلا نشوف!', "Some things float on water, and some things sink. Let's find out!")); this.round(); })();
  }
  round() {
    const it = this.items[this.i];
    this.cur = emo(this, this.tank.x, 190, it.ch, 110, false);
    this.tweens.add({ targets: this.cur, y: 205, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.hint(it.q());
    this.btns = [
      button(this, 190, 330, L('🛟 يطفو', '🛟 Float'), () => this.pick(true), { w: 240, color: 0x99e9f2 }),
      button(this, 190, 450, L('⬇️ يغرق', '⬇️ Sink'), () => this.pick(false), { w: 240, color: 0xffd8a8 }),
    ];
  }
  async pick(guess) {
    if (this.busy) return; this.busy = true;
    this.btns.forEach(b => b.destroy());
    const it = this.items[this.i], o = this.cur; this.tweens.killTweensOf(o);
    Sfx.splash();
    if (it.f) { this.tweens.add({ targets: o, y: this.tank.top - 10, duration: 700, ease: 'Bounce.Out', onComplete: () => this.tweens.add({ targets: o, y: this.tank.top + 4, angle: 6, duration: 800, yoyo: true, repeat: -1 }) }); }
    else this.tweens.add({ targets: o, y: this.tank.bottom - 40, duration: 1400, ease: 'Quad.In' });
    await new Promise(r => this.time.delayedCall(1300, r));
    if (guess === it.f) { Sfx.ok(); celebrate(this, o.x, o.y, 10); } else Sfx.soft();
    await shout(this, it.f ? L('بتطفو! 🛟', 'It floats!') : L('بتغرق! ⬇️', 'It sinks!'));
    this.tweens.killTweensOf(o); o.destroy();
    this.busy = false;
    if (++this.i < this.items.length) this.round();
    else { await this.hint(L('الحاجات الخفيفة زي البطة والورقة بتطفو، والتقيلة زي الحجر والمفتاح بتغرق!', 'Light things like ducks and leaves float. Heavy things like stones and keys sink!')); this.win('water1', 'Water2'); }
  }
}

// ================= جزيرة المية — المهمة ٢: نضّف الشط (مع فرحة) =================
export class Water2 extends Mission {
  constructor() { super('Water2'); }
  create() {
    this.head(L('🏖️ مهمة المية ٢: نضّف الشط', '🏖️ Water mission 2: Clean the beach'), 'water');
    this.farha = this.add.image(90, H - 20, 'farha').setOrigin(0.5, 1).setScale(0.46); idle(this, this.farha);
    this.bin = this.add.text(W - 330, H - 110, '🗑️', { fontSize: 150 }).setOrigin(0.5);
    const trash = ['🥤', '🧴', '🛍️', '🥫', '🥤'], life = ['🦀', '🐚', '🐢'];
    const spots = Phaser.Utils.Array.Shuffle([[260, 560], [400, 640], [540, 560], [680, 650], [330, 420], [600, 430], [470, 470], [760, 520]]);
    this.left = trash.length;
    [...trash.map(t => [t, true]), ...life.map(t => [t, false])].forEach(([ch, isTrash], i) => { const o = emo(this, spots[i][0], spots[i][1], ch, 80); o.trash = isTrash; if (!isTrash) idle(this, o, 0.05); });
    dragSetup(this, o => this.drop(o));
    say(this, this.farha, L('يا خبر، الشط متوسّخ! يلا نرمي الزبالة في السلة. بس براحة على حيوانات البحر!', "Oh no, the beach is dirty! Let's put the trash in the bin. But be gentle with the sea animals!"), { x: 360, y: H - 340 });
  }
  async drop(o) {
    if (!near(o, this.bin, 110)) return;
    if (!o.trash) { Sfx.soft(); goHome(this, o); return say(this, this.farha, L('لأ لأ! حيوانات البحر عايشة هنا. خلّيها في بيتها 🦀', "No, no! Sea animals live here. Let's leave them at home."), { x: 360, y: H - 340 }); }
    Sfx.ok(); o.disableInteractive();
    this.tweens.add({ targets: o, x: this.bin.x, y: this.bin.y - 20, scale: 0.2, alpha: 0, duration: 350 });
    this.tweens.add({ targets: this.bin, scale: 1.12, duration: 120, yoyo: true });
    shout(this, L('في السلة! 🗑️', 'Into the bin!'));
    if (--this.left === 0) {
      await new Promise(r => this.time.delayedCall(1200, r));
      this.farha.setTexture('farha_cheer'); celebrate(this, W / 2, H - 300, 22);
      await say(this, this.farha, L('شكرًا يا فارس! الشط النضيف بيفرّح الكل 🤍', 'Thank you, Fares! A clean beach makes everyone happy.'), { x: 360, y: H - 360 });
      await this.hint(L('لما بنحافظ على الطبيعة نضيفة، الحيوانات بتفرح هي كمان!', 'When we keep nature clean, the animals are happy too!'));
      this.win('water2', 'Water3');
    }
  }
}

// ================= جزيرة المية — المهمة ٣: سمك بابا (كبير/صغير + عدّ) =================
export class Water3 extends Mission {
  constructor() { super('Water3'); }
  create() {
    this.head(L('🐟 مهمة المية ٣: سمك بابا', "🐟 Water mission 3: Dad's fish"), 'water');
    this.dad = this.add.image(100, H - 20, 'dad').setOrigin(0.5, 1).setScale(0.5); idle(this, this.dad, 0.02);
    this.rounds = Phaser.Utils.Array.Shuffle(['big', 'small']).concat(['count4', 'count5']); this.r = 0; this.fish = [];
    this.round();
  }
  dadSay(t) { return say(this, this.dad, t, { x: 380, y: H - 330 }); }
  clear() { this.fish.forEach(f => f.destroy()); this.fish = []; (this.btns || []).forEach(b => b.destroy()); this.btns = []; }
  swim(f) { this.tweens.add({ targets: f, x: f.x + Phaser.Math.Between(-40, 40), y: f.y + Phaser.Math.Between(-15, 15), duration: 1600 + Math.random() * 800, yoyo: true, repeat: -1, ease: 'Sine.InOut' }); }
  round() {
    this.clear(); const kind = this.rounds[this.r];
    if (kind === 'big' || kind === 'small') {
      const sizes = Phaser.Utils.Array.Shuffle(kind === 'big' ? [150, 70, 70] : [60, 140, 140]);
      sizes.forEach((sz, i) => {
        const f = emo(this, 330 + i * 230, 230 + (i % 2) * 90, i % 2 ? '🐠' : '🐟', sz, false).setInteractive({ useHandCursor: true });
        f.ok = kind === 'big' ? sz > 100 : sz < 100; this.swim(f); this.fish.push(f);
        f.on('pointerdown', () => this.tapFish(f));
      });
      this.dadSay(kind === 'big' ? L('دوس على السمكة الكبيرة! 🐟', 'Tap the big fish!') : L('دلوقتي دوس على السمكة الصغيرة!', 'Now tap the small fish!'));
    } else {
      const n = kind === 'count4' ? 4 : 5;
      for (let i = 0; i < n; i++) { const f = emo(this, 300 + i * 120, 210 + (i % 2) * 100, '🐠', 90, false); this.swim(f); this.fish.push(f); }
      this.dadSay(L('شايف كام سمكة؟', 'How many fish can you see?'));
      this.btns = [3, 4, 5].map((v, i) => button(this, 340 + i * 200, H - 90, L('٣٤٥'[i], String(v)), () => this.answer(v, n), { w: 150, h: 100, size: 52 }));
    }
  }
  async tapFish(f) {
    if (this.busy) return; this.busy = true;
    if (f.ok) { Sfx.ok(); celebrate(this, f.x, f.y, 10); await this.dadSay(L('أيوه! برافو عليك!', 'Yes! Well done!')); this.next(); }
    else { Sfx.soft(); this.tweens.add({ targets: f, angle: 15, duration: 80, yoyo: true, repeat: 2 }); await this.dadSay(L('هممم، جرّب تاني!', 'Hmm, try again!')); }
    this.busy = false;
  }
  async answer(v, n) {
    if (this.busy) return; this.busy = true;
    if (v === n) { Sfx.ok(); celebrate(this, W / 2, 350, 14); await this.dadSay(L('صح! شاطر في العدّ!', "That's right! Great counting!")); this.busy = false; return this.next(); }
    Sfx.soft(); await this.dadSay(L('يلا نعدّهم سوا!', "Let's count them together!"));
    for (let i = 0; i < this.fish.length; i++) { const f = this.fish[i]; this.tweens.add({ targets: f, scale: 1.4, duration: 200, yoyo: true }); await speak(L(['واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة'][i], ['one', 'two', 'three', 'four', 'five'][i])); }
    this.busy = false;
  }
  next() { if (++this.r < this.rounds.length) this.round(); else { this.clear(); this.win('water3'); } }
}

// ================= كهف الشجاعة — المهمة ١: الكشاف =================
const CAVE_ANIMALS = [
  { ch: '🦉', x: 230, y: 260, w: () => L('بومة!', 'An owl!') },
  { ch: '🦇', x: 720, y: 170, w: () => L('خفّاش!', 'A bat!') },
  { ch: '🦔', x: 420, y: 650, w: () => L('قنفد!', 'A hedgehog!') },
  { ch: '🐸', x: 870, y: 600, w: () => L('ضفدعة!', 'A frog!') },
  { ch: '🐱', x: 560, y: 400, w: () => L('قطة!', 'A cat!') },
];
export class Cave1 extends Mission {
  constructor() { super('Cave1'); }
  create() {
    this.head(L('🔦 الكهف ١: الكشاف', '🔦 Cave mission 1: The flashlight'), 'cave');
    this.found = 0;
    CAVE_ANIMALS.forEach(a => {
      const o = emo(this, a.x, a.y, a.ch, 90, false).setInteractive({ useHandCursor: true });
      o.on('pointerdown', () => this.find(o, a));
    });
    // ضلمة + دايرة نور بتمشي مع الصباع
    if (!this.textures.exists('glow')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      for (let r = 170; r > 0; r -= 6) g.fillStyle(0xffffff, Math.min(1, 0.06 + (170 - r) / 120)).fillCircle(170, 170, r);
      g.generateTexture('glow', 340, 340); g.destroy();
    }
    this.dark = this.add.renderTexture(0, 0, W, H).setOrigin(0, 0).setDepth(30);
    this.light = { x: W / 2, y: H / 2 };
    this.input.on('pointermove', p => { this.light = { x: p.x, y: p.y }; });
    this.input.on('pointerdown', p => { this.light = { x: p.x, y: p.y }; });
    this.nori.setDepth(41); this.kid.setDepth(41);
    this.count = this.add.text(150, H - 60, '0 / 5', { fontFamily: FONT, fontSize: 44, color: '#fff3bf', fontStyle: '800' }).setOrigin(0.5).setDepth(41);
    this.hint(L('الكهف ضلمة، بس إحنا شجعان! استخدم الكشاف ودوّر على ٥ حيوانات لطيفة', "It's dark in the cave, but we are brave! Use your flashlight to find five friendly animals."));
  }
  update() { if (this.dark) this.dark.clear().fill(0x05060f, 0.94).erase('glow', this.light.x - 170, this.light.y - 170); }
  async find(o, a) {
    if (o.found) return; o.found = true; Sfx.ok();
    this.tweens.add({ targets: o, scale: 1.5, duration: 250, yoyo: true });
    o.setDepth(35); this.count.setText(`${++this.found} / 5`);
    await shout(this, a.w());
    if (this.found === CAVE_ANIMALS.length) {
      this.tweens.add({ targets: this.dark, alpha: 0, duration: 900 });
      const d = this.dark; this.dark = null; this.time.delayedCall(950, () => d.destroy());
      await this.hint(L('لقيتهم كلهم! شفت؟ الضلمة مش مخيفة لما نكون مع بعض', 'You found them all! See? The dark is not scary when we are together.'));
      this.win('cave1', 'Cave2');
    }
  }
}

// ================= كهف الشجاعة — المهمة ٢: الضل =================
const SHADOWS = [
  { ch: '🍎', w: () => L('تفاحة!', 'An apple!') },
  { ch: '⭐', w: () => L('نجمة!', 'A star!') },
  { ch: '🧸', w: () => L('دبدوب!', 'A teddy bear!') },
  { ch: '🔑', w: () => L('مفتاح!', 'A key!') },
];
export class Cave2 extends Mission {
  constructor() { super('Cave2'); }
  create() {
    this.head(L('🌓 الكهف ٢: لعبة الضل', '🌓 Cave mission 2: Shadow match'), 'cave');
    this.add.rectangle(W / 2 - 60, 330, 820, 220, 0xfff3bf, 0.25).setStrokeStyle(4, 0xfff3bf, 0.5);
    const order = Phaser.Utils.Array.Shuffle([...SHADOWS]);
    this.slots = order.map((s, i) => { const t = this.add.text(190 + i * 200, 330, s.ch, { fontSize: 120 }).setOrigin(0.5).setTintFill(0x14102a).setAlpha(0.85); return { ...s, x: t.x, y: t.y, done: false }; });
    this.left = SHADOWS.length;
    Phaser.Utils.Array.Shuffle([...SHADOWS]).forEach((s, i) => { const o = emo(this, 190 + i * 200, H - 150, s.ch, 110); o.k = s.ch; idle(this, o, 0.04); });
    dragSetup(this, o => this.drop(o));
    this.hint(L('النور بيعمل ضل! وصّل كل حاجة بالضل بتاعها', 'Light makes shadows! Match each thing to its shadow.'));
  }
  async drop(o) {
    const s = this.slots.find(k => !k.done && near(o, k, 90));
    if (!s) return goHome(this, o);
    if (s.ch !== o.k) { Sfx.soft(); goHome(this, o); return this.hint(OOPS_SHAPE()); }
    s.done = true; Sfx.ok(); o.disableInteractive();
    this.tweens.add({ targets: o, x: s.x, y: s.y, duration: 250 });
    shout(this, s.w());
    if (--this.left === 0) { await new Promise(r => this.time.delayedCall(1200, r)); await this.hint(L('برافو! الضل ليه نفس شكل الحاجة اللي عاملاه', 'Great! A shadow has the same shape as the thing that makes it.')); this.win('cave2', 'Cave3'); }
  }
}

// ================= كهف الشجاعة — المهمة ٣: الشجاعة والطيبة (مع ماما) =================
const CHOICES = [
  { q: () => L('فرحة وقعت كل كتبها. نساعدها ولا نمشي؟', 'Farha dropped all her books. Should we help her, or walk away?'), a: [L('🤝 نساعدها', '🤝 Help her'), L('🚶 نمشي', '🚶 Walk away')], ok: 0, yes: () => L('صح! المساعدة طيبة 🤍', "That's right! Helping is kind.") },
  { q: () => L('أوبس! كسرت كوباية من غير قصد. تقول آسف وتقول الحقيقة، ولا تخبّيها؟', 'Oops! You broke a cup by mistake. Do you say sorry and tell the truth, or hide it?'), a: [L('🙈 أخبّيها', '🙈 Hide it'), L('🗣️ أقول آسف', '🗣️ Say sorry')], ok: 1, yes: () => L('صح! قول الحقيقة شجاعة 💪', "That's right! Telling the truth is brave.") },
  { q: () => L('صاحبك خايف من الضلمة. تضحك عليه ولا تمسك إيده؟', 'Your friend is scared of the dark. Do you laugh at him, or hold his hand?'), a: [L('😂 أضحك عليه', '😂 Laugh at him'), L('🫶 أمسك إيده', '🫶 Hold his hand')], ok: 1, yes: () => L('صح! الصحاب بيساعدوا بعض 🤍', "That's right! Good friends help each other.") },
  { q: () => L('فاضل بسكوتة واحدة، وفريد عايزها كمان. تقسمها ولا تخطفها؟', 'There is one cookie left, and Farid wants it too. Do you share it, or grab it?'), a: [L('🍪 أقسمها', '🍪 Share it'), L('😠 أخطفها', '😠 Grab it')], ok: 0, yes: () => L('صح! المشاركة بتفرّح الكل 🍪', "That's right! Sharing makes everyone happy.") },
];
export class Cave3 extends Mission {
  constructor() { super('Cave3'); }
  create() {
    this.head(L('💛 الكهف ٣: البطل الطيب', '💛 Cave mission 3: The kind hero'), 'cave');
    this.mom = this.add.image(110, H - 20, 'mom').setOrigin(0.5, 1).setScale(0.5); idle(this, this.mom, 0.02);
    this.i = 0; this.btns = []; this.round();
  }
  momSay(t) { return say(this, this.mom, t, { x: 420, y: H - 330, width: 600 }); }
  async round() {
    const c = CHOICES[this.i];
    this.btns.forEach(b => b.destroy());
    this.btns = c.a.map((label, k) => button(this, 420 + k * 330, 240, label, () => this.pick(k), { w: 300, h: 120, size: 34, color: 0xffffff }));
    await this.momSay(c.q());
  }
  async pick(k) {
    if (this.busy) return; this.busy = true;
    const c = CHOICES[this.i];
    if (k === c.ok) {
      Sfx.ok(); celebrate(this, this.btns[k].x, this.btns[k].y, 14); this.btns.forEach(b => b.disableInteractive());
      await this.momSay(c.yes()); this.busy = false;
      if (++this.i < CHOICES.length) this.round();
      else { this.btns.forEach(b => b.destroy()); await this.hint(L('إنت شجاع وطيب يا فارس! وده اللي بيعمله الأبطال الحقيقيين', "You are brave AND kind, Fares! That's what real heroes do.")); this.win('cave3'); }
    } else { Sfx.soft(); await this.momSay(L('هممم، تفتكر ده هيخليهم يحسّوا بإيه؟ جرّب تاني', 'Hmm, how would that make them feel? Try again.')); this.busy = false; }
  }
}
