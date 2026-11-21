// مشاهد اللعبة: البداية ← إسكندرية (الكورنيش) ← البوابة في مكتبة الإسكندرية ← خريطة الجزر ← جزيرة النبات (٣ مهمات) ← نور الفنار
import { SVGS, W, H } from './art.js';
import { FONT, Save, Sfx, speak, hush, button, say, celebrate, idle, gradient, back } from './sys.js';

const FAMILY = { fares: 'فارس', farid: 'فريد', farha: 'فرحة', dad: 'بابي', mom: 'مامي' };

// ===== تحميل الرسومات =====
export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    const { width, height } = this.scale;
    const bar = this.add.graphics();
    this.add.text(width / 2, height / 2 - 60, 'رحلة فارس', { fontFamily: FONT, fontSize: 64, color: '#fff', fontStyle: '800', rtl: true }).setOrigin(0.5);
    this.load.on('progress', p => { bar.clear().fillStyle(0xffffff, 0.25).fillRoundedRect(width / 2 - 250, height / 2 + 10, 500, 24, 12).fillStyle(0xffd43b).fillRoundedRect(width / 2 - 250, height / 2 + 10, 500 * p, 24, 12); });
    for (const [k, svg] of Object.entries(SVGS)) this.load.svg(k, 'data:image/svg+xml;base64,' + btoa(svg.replace(/[^\x00-\x7f]/gu, c => `&#${c.codePointAt(0)};`)));
  }
  async create() {
    try { await document.fonts.load('800 40px Cairo'); await document.fonts.load('700 30px Cairo'); } catch { /* */ }
    this.scene.start('Title');
  }
}

// ===== شاشة البداية =====
export class Title extends Phaser.Scene {
  constructor() { super('Title'); }
  create() {
    gradient(this, 0x5f3dc4, 0x1c7ed6);
    for (let i = 0; i < 40; i++) { const s = this.add.circle(Math.random() * W, Math.random() * H * 0.7, 2 + Math.random() * 3, 0xffffff, 0.7); this.tweens.add({ targets: s, alpha: 0.1, duration: 800 + Math.random() * 1500, yoyo: true, repeat: -1 }); }
    const ph = this.add.image(W - 200, H - 40, `pharos${Math.min(3, Save.d.pharos)}`).setOrigin(0.5, 1).setScale(0.85);
    this.add.image(W - 200, 150, 'nori').setScale(0.6).setAlpha(Save.d.pharos ? 1 : 0.5);
    const t = this.add.text(W / 2 - 120, 190, 'رحلة فارس', { fontFamily: FONT, fontSize: 110, color: '#fff', fontStyle: '800', rtl: true, stroke: '#3b1f8f', strokeThickness: 14 }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: 200, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.add.text(W / 2 - 120, 300, 'من إسكندرية لعوالم العلم', { fontFamily: FONT, fontSize: 40, color: '#ffe066', fontStyle: '700', rtl: true }).setOrigin(0.5);
    const kids = ['farha', 'fares', 'farid'].map((k, i) => { const s = this.add.image(W / 2 - 300 + i * 180, H - 40, k).setOrigin(0.5, 1).setScale(k === 'fares' ? 0.95 : 0.85); idle(this, s); return s; });
    button(this, W / 2 - 120, 440, Save.d.seenIntro ? '▶  كمّل المغامرة' : '▶  يلا نبدأ!', () => this.scene.start(Save.d.seenIntro ? 'Map' : 'Alex'), { w: 400, h: 110, size: 44 });
    if (Save.d.seenIntro) button(this, W / 2 - 120, 560, '🌊  إسكندرية تاني', () => this.scene.start('Alex'), { w: 320, h: 80, size: 30, color: 0xffffff });
    button(this, W - 80, 60, '⚙️', () => this.scene.start('Parent'), { w: 100, h: 76, color: 0xffffff, size: 36 });
    void ph; void kids;
  }
}

// ===== إسكندرية: الكورنيش (بتمشي يمين وشمال بالدوس) =====
export class Alex extends Phaser.Scene {
  constructor() { super('Alex'); }
  create() {
    const L = W * 3;
    this.cameras.main.setBounds(0, 0, L, H);
    this.add.image(0, 0, 'corniche').setOrigin(0, 0);
    this.add.image(L - 520, 560, 'qaitbay').setOrigin(0.5, 1).setScale(1.05);
    this.add.image(1500, 562, 'stanley').setOrigin(0.5, 1);
    this.add.image(560, 640, 'school').setOrigin(0.5, 1).setScale(0.75).setDepth(2);
    const lib = this.add.image(2550, 650, 'library').setOrigin(0.5, 1).setScale(1.1).setDepth(2);
    const tram = this.add.image(-400, 770, 'tram').setOrigin(0.5, 1).setScale(0.9).setDepth(3);
    this.tweens.add({ targets: tram, x: L + 400, duration: 26000, repeat: -1, delay: 2000 });
    // البوابة مستخبية في المكتبة — بتظهر لما فارس يوصل
    this.portal = this.add.image(lib.x + 30, 560, 'portal').setScale(0).setDepth(4);
    // العيلة
    this.dad = this.add.image(380, 760, 'dad').setOrigin(0.5, 1).setScale(0.62).setDepth(5);
    this.mom = this.add.image(250, 760, 'mom').setOrigin(0.5, 1).setScale(0.62).setDepth(5);
    this.farid = this.add.image(620, 770, 'farid').setOrigin(0.5, 1).setScale(0.55).setDepth(6);
    this.farha = this.add.image(720, 775, 'farha').setOrigin(0.5, 1).setScale(0.52).setDepth(6);
    this.fares = this.add.image(860, 780, 'fares').setOrigin(0.5, 1).setScale(0.58).setDepth(7);
    [this.dad, this.mom, this.farid, this.farha, this.fares].forEach(s => idle(this, s, 0.02));
    this.cameras.main.startFollow(this.fares, true, 0.08, 0.08, 0, 140);
    // أسهم المشي
    this.walking = 0;
    const arrow = (x, dir, label) => button(this, x, H - 70, label, () => {}, { w: 120, h: 100, size: 50, color: 0xffffff }).setScrollFactor(0).setDepth(80)
      .on('pointerdown', () => { this.walking = dir; }).on('pointerup', () => { this.walking = 0; }).on('pointerout', () => { this.walking = 0; });
    arrow(W - 90, 1, '←'); arrow(90, -1, '→'); // RTL: السهم الشمال = قدّام في اتجاه المكتبة
    this.input.on('pointerdown', p => { if (p.y < H - 140) this.target = p.worldX; });
    this.input.on('pointerup', () => { this.walking = 0; });
    back(this, 'Title').setScrollFactor(0).setDepth(80).setPosition(W - 90, 60);
    this.hint = this.add.text(W / 2, 40, 'امشي على الكورنيش لحد مكتبة الإسكندرية ←', { fontFamily: FONT, fontSize: 30, color: '#0b3a66', fontStyle: '800', rtl: true, backgroundColor: '#ffffffcc', padding: { x: 18, y: 8 } }).setOrigin(0.5).setScrollFactor(0).setDepth(80);
    this.busy = true;
    this.intro();
  }
  async intro() {
    await say(this, this.fares, 'أنا فارس! وده الكورنيش في إسكندرية 🌊 بحبه أوي');
    await say(this, this.farha, 'وأنا فرحة! وده فريد أخونا الكبير');
    await say(this, this.dad, 'يلا يا أبطال، النهارده هنروح مكتبة الإسكندرية!');
    this.busy = false;
  }
  update(t, dt) {
    if (this.busy || this.arrived) return;
    let dir = this.walking;
    if (!dir && this.target != null) { const d = this.target - this.fares.x; if (Math.abs(d) < 12) this.target = null; else dir = Math.sign(d); }
    if (dir) {
      const v = 0.42 * dt * dir;
      this.fares.x = Phaser.Math.Clamp(this.fares.x + v, 120, W * 3 - 120);
      this.fares.setFlipX(dir < 0);
      this.fares.y = 780 - Math.abs(Math.sin(t / 90)) * 10;
      // العيلة بتمشي ورا فارس
      [[this.farha, -110], [this.farid, -210], [this.dad, -360], [this.mom, -480]].forEach(([s, off]) => { s.x += (this.fares.x + off - s.x) * 0.06; s.setFlipX(dir < 0); });
    }
    if (this.fares.x > 2440 && !this.arrived) this.reachLibrary();
  }
  async reachLibrary() {
    this.arrived = true; this.target = null; this.walking = 0;
    this.hint.setText('مكتبة الإسكندرية 📚');
    await say(this, this.dad, 'دي مكتبة الإسكندرية، فيها كتب من كل الدنيا!');
    Sfx.sparkle();
    this.tweens.add({ targets: this.portal, scale: 1.1, angle: 360, duration: 1400, ease: 'Back.Out' });
    this.tweens.add({ targets: this.portal, angle: '+=360', duration: 6000, repeat: -1, delay: 1400 });
    const nori = this.add.image(this.portal.x, this.portal.y, 'nori').setScale(0).setDepth(9);
    this.tweens.add({ targets: nori, scale: 0.7, y: this.portal.y - 170, duration: 900, delay: 900, ease: 'Back.Out' });
    this.time.delayedCall(1800, async () => {
      idle(this, nori, 0.06);
      await say(this, nori, 'أهلًا يا فارس! أنا نوري، نور فنار إسكندرية القديم ✨');
      await say(this, nori, 'الفنار نوره انطفى… ومحتاج نجمع نجوم العلم من جزر بعيدة علشان يرجع ينوّر!');
      await say(this, this.fares, 'أنا جاهز! ومعايا فريد وفرحة 💪');
      await say(this, this.mom, 'خلّوا بالكم من بعض يا حبايبي، ونستناكم هنا 🤍');
      Save.d.seenIntro = true; Save.put();
      Sfx.win();
      this.cameras.main.flash(500, 255, 255, 255);
      this.tweens.add({ targets: [this.fares, this.farid, this.farha], x: this.portal.x, y: this.portal.y + 60, scale: 0.05, duration: 1000, ease: 'Cubic.In' });
      this.time.delayedCall(1100, () => this.scene.start('Map'));
    });
  }
}

// ===== خريطة الجزر + الفنار =====
const ISLANDS = [
  { id: 'plant', name: 'جزيرة النبات 🌱', x: 380, y: 330, scene: 'Plant1', open: true },
  { id: 'water', name: 'جزيرة المية 💧', x: 720, y: 520, open: false },
  { id: 'cave', name: 'كهف الشجاعة 🔦', x: 460, y: 640, open: false },
];
export class Map extends Phaser.Scene {
  constructor() { super('Map'); }
  create() {
    gradient(this, 0x74c0fc, 0x1971c2);
    for (let i = 0; i < 26; i++) this.add.text(Math.random() * W, Math.random() * H, '〰', { fontSize: 30, color: '#d0ebff' }).setAlpha(0.5);
    const lit = Math.min(3, Save.d.pharos);
    const ph = this.add.image(W - 180, H - 20, `pharos${lit}`).setOrigin(0.5, 1).setScale(0.95);
    this.add.text(W - 180, 40, `الفنار: ${'⭐'.repeat(lit)}${'☆'.repeat(3 - lit)}`, { fontFamily: FONT, fontSize: 30, color: '#fff', fontStyle: '800', rtl: true }).setOrigin(0.5);
    for (const is of ISLANDS) {
      const c = this.add.container(is.x, is.y);
      const img = this.add.image(0, 0, 'island').setScale(0.9);
      const lbl = this.add.text(0, 78, is.name, { fontFamily: FONT, fontSize: 30, color: '#fff', fontStyle: '800', rtl: true, stroke: '#0b3a66', strokeThickness: 8 }).setOrigin(0.5);
      c.add([img, lbl]);
      if (is.open) {
        const n = Save.count(is.id);
        c.add(this.add.text(0, 118, `${'⭐'.repeat(n)}${'☆'.repeat(3 - n)}`, { fontFamily: FONT, fontSize: 30, rtl: true }).setOrigin(0.5));
        c.setSize(260, 180).setInteractive({ useHandCursor: true }).on('pointerdown', () => { Sfx.tap(); hush(); this.scene.start(is.scene); });
        this.tweens.add({ targets: c, y: is.y - 10, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      } else { img.setTint(0x99aabb); c.add(this.add.image(0, -10, 'lock').setScale(0.7)); c.add(this.add.text(0, 118, 'قريب…', { fontFamily: FONT, fontSize: 26, color: '#e7f5ff', rtl: true }).setOrigin(0.5)); c.setSize(260, 180).setInteractive().on('pointerdown', () => { Sfx.soft(); say(this, nori, 'الجزيرة دي لسه بنبنيها… قريب جدًا!', { x: is.x, y: is.y - 70 }); }); }
    }
    const nori = this.add.image(170, 300, 'nori').setScale(0.55); idle(this, nori, 0.06);
    this.fares = this.add.image(170, H - 20, 'fares').setOrigin(0.5, 1).setScale(0.5); idle(this, this.fares);
    back(this, 'Title');
    const n = Save.count('plant');
    if (!this.registry.get('mapHello')) { this.registry.set('mapHello', 1); say(this, nori, n >= 3 ? 'برافو! يلا نشوف الجزيرة الجاية قريب ✨' : 'اختار جزيرة النبات علشان نبدأ! 🌱', { x: 420, y: 250 }); }
    void ph;
  }
}

// ===== أساس المهمات: عنوان + نوري + نجمة في الآخر =====
class Mission extends Phaser.Scene {
  head(title, top = 0xd3f9d8, bottom = 0x8ce99a) {
    gradient(this, top, bottom);
    this.add.rectangle(W / 2, H - 70, W, 140, 0x8d5524).setAlpha(0.35);
    this.add.text(W / 2, 50, title, { fontFamily: FONT, fontSize: 38, color: '#1b4332', fontStyle: '800', rtl: true }).setOrigin(0.5);
    back(this, 'Map');
    this.nori = this.add.image(W - 110, 170, 'nori').setScale(0.5); idle(this, this.nori, 0.06);
    this.kid = this.add.image(W - 120, H - 20, 'fares').setOrigin(0.5, 1).setScale(0.55); idle(this, this.kid);
  }
  hint(text) { return say(this, this.nori, text, { x: W - 330, y: 120 }); }
  async win(id, next) {
    const first = Save.star(id);
    Sfx.win(); celebrate(this, W / 2, H / 2, 26);
    const s = this.add.image(W / 2, H / 2, 'star').setScale(0).setDepth(70);
    this.tweens.add({ targets: s, scale: 2.2, angle: 360, duration: 900, ease: 'Back.Out' });
    await say(this, this.kid, first ? 'هييييه! كسبنا نجمة علم ⭐' : 'برافو عليا! ⭐', { x: W / 2, y: H / 2 - 160 });
    if (Save.count('plant') >= 3 && Save.d.pharos < 1) { Save.d.pharos = 1; Save.put(); this.scene.start('Light'); return; }
    this.scene.start(next || 'Map');
  }
}

// المهمة ١: ازرع البذرة (بالترتيب: بذرة ← مية ← شمس)
export class Plant1 extends Mission {
  constructor() { super('Plant1'); }
  create() {
    this.head('🌱 المهمة ١: ازرع البذرة');
    this.step = 0;
    const pot = this.add.image(W / 2 - 60, H - 150, 'pot').setScale(1.2);
    this.potZone = new Phaser.Geom.Rectangle(pot.x - 130, pot.y - 120, 260, 200);
    this.plant = this.add.image(pot.x, pot.y - 70, 'sprout').setOrigin(0.5, 1).setScale(0);
    const mk = (key, x, y, s) => { const o = this.add.image(x, y, key).setScale(s).setInteractive({ draggable: true, useHandCursor: true }); o.home = { x, y }; idle(this, o, 0.04); return o; };
    this.seed = mk('seed', 200, 300, 0.9); this.can = mk('can', 220, 520, 0.9); this.sun = mk('sun', 470, 180, 0.8);
    this.input.on('dragstart', (p, o) => { Sfx.pick(); o.setScale(o.scale * 1.15).setDepth(20); });
    this.input.on('drag', (p, o, x, y) => { o.x = x; o.y = y; });
    this.input.on('dragend', (p, o) => { o.setScale(o.scale / 1.15); this.drop(o); });
    this.hint('بص يا فارس! النبتة بتبدأ من بذرة صغيرة. حط البذرة في القصرية 🌱');
  }
  async drop(o) {
    const inPot = this.potZone.contains(o.x, o.y);
    const want = [this.seed, this.can, this.sun][this.step];
    if (inPot && o === want) {
      Sfx.ok(); this.input.setDraggable(o, false);
      if (o === this.seed) { this.tweens.add({ targets: o, x: this.potZone.centerX, y: this.potZone.y + 40, scale: 0.4, alpha: 0, duration: 500 }); this.step = 1; await this.hint('البذرة نامت في الطينة! دلوقتي محتاجة تشرب… اسقيها بالرشاشة 💧'); }
      else if (o === this.can) {
        Sfx.splash(); this.tweens.add({ targets: o, angle: -35, duration: 300, yoyo: true, hold: 600, onComplete: () => this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400 }) });
        for (let i = 0; i < 14; i++) { const d = this.add.image(this.potZone.centerX - 60 + Math.random() * 120, this.potZone.y - 40, 'water').setScale(0.18); this.tweens.add({ targets: d, y: this.potZone.y + 60, alpha: 0, duration: 600, delay: i * 50, onComplete: () => d.destroy() }); }
        this.tweens.add({ targets: this.plant, scale: 0.6, duration: 900, delay: 500, ease: 'Back.Out' });
        this.step = 2; await this.hint('شوف! طلعت نبتة صغيرة 🌿 بس محتاجة نور الشمس علشان تكبر. هات الشمس ☀️');
      } else {
        this.tweens.add({ targets: o, x: this.potZone.centerX, y: 140, duration: 500 });
        this.plant.setTexture('flower'); this.plant.setScale(0.3);
        this.tweens.add({ targets: this.plant, scale: 1, duration: 1200, ease: 'Elastic.Out' });
        celebrate(this, this.potZone.centerX, this.potZone.y - 100);
        await this.hint('الله! بقت وردة جميلة 🌸 النبات محتاج: بذرة + مية + شمس. وكمان شوية صبر!');
        this.win('plant1', 'Plant2');
      }
    } else {
      Sfx.soft(); this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400, ease: 'Back.Out' });
      if (inPot) this.hint(['لسه بدري! الأول نحط البذرة 🌱', 'البذرة لازم تشرب الأول قبل الشمس 💧', ''][this.step] || 'قربت! جرّب تاني 💪');
    }
  }
}

// المهمة ٢: النبتة محتاجة إيه؟ (فرز)
export class Plant2 extends Mission {
  constructor() { super('Plant2'); }
  create() {
    this.head('🌿 المهمة ٢: النبتة محتاجة إيه؟');
    this.plantImg = this.add.image(W / 2 - 220, H - 110, 'flower').setOrigin(0.5, 1).setScale(0.8);
    this.box = this.add.image(W / 2 + 230, H - 120, 'box').setScale(1);
    this.plantZone = new Phaser.Geom.Rectangle(this.plantImg.x - 140, H - 420, 280, 330);
    this.boxZone = new Phaser.Geom.Rectangle(this.box.x - 130, this.box.y - 100, 260, 190);
    const all = Phaser.Utils.Array.Shuffle([['water', true, 'المية'], ['sun', true, 'الشمس'], ['air', true, 'الهوا'], ['candy', false, 'الحلويات'], ['phone', false, 'الموبايل'], ['toy', false, 'الدبدوب']]);
    this.left = 6;
    all.forEach(([k, need, name], i) => {
      const o = this.add.image(170 + i * 160, 200 + (i % 2) * 70, k).setScale(k === 'sun' ? 0.6 : 0.75).setInteractive({ draggable: true, useHandCursor: true });
      Object.assign(o, { need, nm: name, home: { x: o.x, y: o.y } }); idle(this, o, 0.04);
    });
    this.input.on('dragstart', (p, o) => { Sfx.pick(); o.setDepth(20); });
    this.input.on('drag', (p, o, x, y) => { o.x = x; o.y = y; });
    this.input.on('dragend', (p, o) => this.drop(o));
    this.hint('النبتة عايزة إيه علشان تعيش؟ حط اللي بتحتاجه جنبها، واللي مش محتاجاه في الصندوق!');
  }
  async drop(o) {
    const toPlant = this.plantZone.contains(o.x, o.y), toBox = this.boxZone.contains(o.x, o.y);
    if (!toPlant && !toBox) { this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 300 }); return; }
    if (toPlant === o.need) {
      Sfx.ok(); this.input.setDraggable(o, false);
      this.tweens.add({ targets: o, scale: o.scale * 0.6, x: toPlant ? this.plantImg.x + Phaser.Math.Between(-110, 110) : this.box.x + Phaser.Math.Between(-60, 60), y: toPlant ? H - 360 + Phaser.Math.Between(-30, 30) : this.box.y - 30, duration: 400 });
      if (toPlant) this.tweens.add({ targets: this.plantImg, scale: this.plantImg.scale * 1.06, duration: 300 });
      say(this, this.kid, toPlant ? `أيوه! النبتة محتاجة ${o.nm} ✔️` : `${o.nm}؟ لأ، النبتة مش محتاجاه 😄`, { x: W / 2, y: 120 });
      if (--this.left === 0) { await new Promise(r => this.time.delayedCall(1800, r)); await this.hint('ممتاز! النبات بيحتاج مية وشمس وهوا… زينا بالظبط بنحتاج نشرب ونتنفس 🌍'); this.win('plant2', 'Plant3'); }
    } else {
      Sfx.soft(); this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400, ease: 'Back.Out' });
      this.hint(o.need ? `فكّر تاني… النبتة من غير ${o.nm} تقدر تعيش؟ 🤔` : `هههه، النبتة مش بتاكل ${o.nm}! 😄`);
    }
  }
}

// المهمة ٣: قطف التفاح بالعدد (فرحة عايزة عدد معيّن)
export class Plant3 extends Mission {
  constructor() { super('Plant3'); }
  create() {
    this.head('🍎 المهمة ٣: ساعد فرحة تقطف التفاح');
    this.add.image(W / 2 - 120, H - 60, 'tree').setOrigin(0.5, 1).setScale(1.15);
    this.basket = this.add.image(W / 2 + 370, H - 110, 'basket').setScale(1);
    this.farha = this.add.image(W / 2 + 200, H - 20, 'farha').setOrigin(0.5, 1).setScale(0.46); idle(this, this.farha);
    this.rounds = [3, 2, 5]; this.r = 0;
    this.countTxt = this.add.text(this.basket.x, this.basket.y - 110, '', { fontFamily: FONT, fontSize: 64, color: '#c92a2a', fontStyle: '800', rtl: true, stroke: '#fff', strokeThickness: 10 }).setOrigin(0.5);
    this.round();
  }
  round() {
    (this.apples || []).forEach(a => a.destroy());
    this.need = this.rounds[this.r]; this.got = 0; this.countTxt.setText('٠');
    const spots = Phaser.Utils.Array.Shuffle([[-200, -330], [-90, -420], [40, -380], [150, -300], [-260, -230], [-30, -260], [90, -200], [220, -380]]);
    this.apples = spots.slice(0, 7).map(([dx, dy]) => {
      const a = this.add.image(W / 2 - 120 + dx * 1.15, H - 60 + dy * 1.15, 'apple').setScale(0.8).setInteractive({ useHandCursor: true });
      a.on('pointerdown', () => this.pick(a)); return a;
    });
    say(this, this.farha, `أنا عايزة ${['', 'تفاحة واحدة', 'تفاحتين', '٣ تفاحات', '٤ تفاحات', '٥ تفاحات'][this.need]} 🍎`, { x: this.farha.x - 60, y: H - 360 });
  }
  pick(a) {
    if (a.used || this.done) return;
    a.used = true; this.got++; Sfx.pick();
    const n = '٠١٢٣٤٥٦٧٨٩'[this.got];
    this.countTxt.setText(n); this.tweens.add({ targets: this.countTxt, scale: 1.4, duration: 120, yoyo: true });
    speak(['', 'واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة', 'ستة', 'سبعة'][this.got]);
    this.tweens.add({ targets: a, x: this.basket.x + Phaser.Math.Between(-50, 50), y: this.basket.y - 20, scale: 0.55, duration: 500, ease: 'Quad.In' });
    if (this.got === this.need) this.roundDone();
    else if (this.got > this.need) { this.done = true; Sfx.soft(); say(this, this.farha, `دول كتير! أنا عايزة ${this.need} بس… يلا نعدّ تاني 😊`, { x: this.farha.x - 60, y: H - 360 }).then(() => { this.done = false; this.round(); }); }
  }
  async roundDone() {
    this.done = true; Sfx.ok(); celebrate(this, this.basket.x, this.basket.y - 60, 12);
    await say(this, this.farha, 'شكرًا يا فارس! بالظبط كده 🤍', { x: this.farha.x - 60, y: H - 360 });
    this.done = false;
    if (++this.r < this.rounds.length) this.round();
    else { await this.hint('برافو! الشجرة كانت بذرة صغيرة زمان، وكبرت بالمية والشمس والصبر 🌳'); this.win('plant3'); }
  }
}

// ===== أول نور في الفنار =====
export class Light extends Phaser.Scene {
  constructor() { super('Light'); }
  create() {
    gradient(this, 0x0b1d3a, 0x1c3f75);
    for (let i = 0; i < 60; i++) this.add.circle(Math.random() * W, Math.random() * H * 0.6, 1.5 + Math.random() * 2, 0xffffff, 0.8);
    const ph = this.add.image(W / 2, H - 10, 'pharos0').setOrigin(0.5, 1).setScale(1.1);
    const nori = this.add.image(W / 2 - 300, 180, 'nori').setScale(0.6); idle(this, nori, 0.06);
    const kids = ['farha', 'fares', 'farid'].map((k, i) => this.add.image(220 + i * 140, H - 10, k).setOrigin(0.5, 1).setScale(0.5));
    (async () => {
      await say(this, nori, 'جمعتوا ٣ نجوم من جزيرة النبات! يلا ننوّر أول دور في الفنار ✨');
      Sfx.win(); this.cameras.main.flash(700, 255, 230, 150);
      ph.setTexture('pharos1'); celebrate(this, W / 2, H - 200, 30);
      await say(this, kids[1], 'شوفوا! الفنار بدأ ينوّر! 🌟');
      await say(this, nori, 'لسه فيه جزر تانية مستنيانا… قريب جدًا!');
      button(this, W / 2, 120, 'للخريطة 🗺️', () => this.scene.start('Map'), { w: 320 });
    })();
  }
}

// ===== ركن الأهل (بقفل) =====
export class Parent extends Phaser.Scene {
  constructor() { super('Parent'); }
  create() {
    gradient(this, 0xf1f3f5, 0xdee2e6);
    back(this, 'Title');
    const a = Phaser.Math.Between(6, 9), b = Phaser.Math.Between(3, 9);
    this.add.text(W / 2, 140, `ركن الأهل 🔒  —  كام ${a} × ${b}؟`, { fontFamily: FONT, fontSize: 40, color: '#212529', fontStyle: '800', rtl: true }).setOrigin(0.5);
    const opts = Phaser.Utils.Array.Shuffle([a * b, a * b + a, a * b - b, a * b + 2]);
    opts.forEach((v, i) => button(this, 260 + i * 250, 280, String(v), () => (v === a * b ? this.open() : this.scene.start('Title')), { w: 200, color: 0xffffff }));
  }
  open() {
    this.children.removeAll(); gradient(this, 0xf1f3f5, 0xdee2e6); back(this, 'Title');
    const T = (y, s) => this.add.text(W / 2, y, s, { fontFamily: FONT, fontSize: 32, color: '#212529', fontStyle: '700', rtl: true }).setOrigin(0.5);
    T(80, 'ركن الأهل');
    T(150, `النجوم: ${Object.keys(Save.d.stars).length} — أدوار الفنار المنوّرة: ${Save.d.pharos}`);
    T(200, 'فارس اتعلم: مراحل نمو النبات، احتياجات الكائن الحي، العدّ لحد ٥');
    const tog = (y, label, key) => { const b = button(this, W / 2, y, `${label}: ${Save.d[key] ? 'شغّال' : 'مقفول'}`, () => { Save.d[key] = !Save.d[key]; Save.put(); this.open(); }, { w: 520, color: 0xffffff, size: 30 }); return b; };
    tog(310, '🔊 الأصوات', 'sound'); tog(420, '🗣️ صوت الراوي', 'voice');
    button(this, W / 2, 530, `⏰ حد اللعب اليومي: ${Save.d.limitMin} دقيقة`, () => { const L = [15, 20, 30, 45, 60]; Save.d.limitMin = L[(L.indexOf(Save.d.limitMin) + 1) % L.length]; Save.put(); this.open(); }, { w: 520, color: 0xffffff, size: 30 });
    button(this, W / 2, 660, '🗑️ ابدأ من الأول', () => { if (confirm('تمسح التقدم كله؟')) { localStorage.removeItem('fares:save'); location.reload(); } }, { w: 400, color: 0xffc9c9, size: 28 });
  }
}

// ===== استراحة: حد اللعب اليومي =====
export class Rest extends Phaser.Scene {
  constructor() { super('Rest'); }
  create() {
    gradient(this, 0x0b1d3a, 0x1c3f75);
    const n = this.add.image(W / 2, 260, 'nori').setScale(0.9); idle(this, n, 0.06);
    say(this, n, 'لعبنا كتير النهارده يا فارس 🌙 يلا نريّح عنينا ونكمّل بكرة!', { x: W / 2, y: 140 });
    this.add.text(W / 2, 520, 'خلص وقت اللعب لليوم — الأهل يقدروا يغيّروه من ⚙️', { fontFamily: FONT, fontSize: 30, color: '#d0ebff', rtl: true }).setOrigin(0.5);
  }
}
export { FAMILY };
