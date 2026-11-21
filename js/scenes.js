// مشاهد اللعبة: البداية ← إسكندرية (الكورنيش) ← البوابة في مكتبة الإسكندرية ← خريطة الجزر ← جزيرة النبات (٣ مهمات) ← نور الفنار
import { SVGS, W, H } from './art.js';
import { FONT, Save, Sfx, speak, hush, button, say, celebrate, idle, gradient, back, L, rtl } from './sys.js';

const CHAR_ART = { fares: ['', 'run', 'jump', 'cheer', 'point'], farid: ['', 'walk', 'cheer'], farha: ['', 'walk', 'cheer'], dad: ['', 'walk'], mom: ['', 'walk'] };
// صورة خلفية بتغطي الشاشة كلها
export const cover = (scene, key) => { const im = scene.add.image(W / 2, H / 2, key); im.setScale(Math.max(W / im.width, H / im.height)); return im; };
const FAMILY = { fares: 'فارس', farid: 'فريد', farha: 'فرحة', dad: 'بابي', mom: 'مامي' };

// ===== تحميل الرسومات =====
export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    const { width, height } = this.scale;
    const bar = this.add.graphics();
    this.add.text(width / 2, height / 2 - 60, L('رحلة فارس', "Fares' Adventure"), { fontFamily: FONT, fontSize: 64, color: '#fff', fontStyle: '800', rtl: rtl() }).setOrigin(0.5);
    this.load.on('progress', p => { bar.clear().fillStyle(0xffffff, 0.25).fillRoundedRect(width / 2 - 250, height / 2 + 10, 500, 24, 12).fillStyle(0xffd43b).fillRoundedRect(width / 2 - 250, height / 2 + 10, 500 * p, 24, 12); });
    for (const [k, svg] of Object.entries(SVGS)) if (!(k in CHAR_ART)) this.load.svg(k, 'data:image/svg+xml;base64,' + btoa(svg.replace(/[^\x00-\x7f]/gu, c => `&#${c.codePointAt(0)};`)));
    // رسومات العيلة الحقيقية (Seedream) — الأوضاع: واقف، بيجري/بيمشي، بينط، بيحتفل، بيشاور
    for (const [k, poses] of Object.entries(CHAR_ART)) for (const p of poses) this.load.image(p ? `${k}_${p}` : k, `assets/art/chars/${p ? `${k}_${p}` : k}.png`);
    for (const b of ['alex1', 'alex2', 'qaitbay', 'plant', 'water', 'cave']) this.load.image(`bg_${b}`, `assets/art/bg/${b}.jpg`);
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
    cover(this, 'bg_qaitbay');
    this.add.rectangle(W / 2, H / 2, W, H, 0x1b1040, 0.25);
    for (let i = 0; i < 40; i++) { const s = this.add.circle(Math.random() * W, Math.random() * H * 0.7, 2 + Math.random() * 3, 0xffffff, 0.7); this.tweens.add({ targets: s, alpha: 0.1, duration: 800 + Math.random() * 1500, yoyo: true, repeat: -1 }); }
    const ph = null;
    this.add.image(W - 200, 150, 'nori').setScale(0.6).setAlpha(Save.d.pharos ? 1 : 0.5);
    const TX = W / 2 + 170;
    const t = this.add.text(TX, 190, L('رحلة فارس', "Fares' Adventure"), { fontFamily: FONT, fontSize: 96, color: '#fff', fontStyle: '800', rtl: rtl(), stroke: '#3b1f8f', strokeThickness: 14 }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: 200, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.add.text(TX, 300, L('من إسكندرية لعوالم العلم', 'From Alexandria to worlds of wonder'), { fontFamily: FONT, fontSize: 40, color: '#ffe066', fontStyle: '700', rtl: rtl() }).setOrigin(0.5);
    const kids = ['farha', 'fares', 'farid'].map((k, i) => { const s = this.add.image(150 + i * 175, H - 30, k).setOrigin(0.5, 1).setScale(k === 'fares' ? 0.95 : 0.85); idle(this, s); return s; });
    button(this, TX, 440, Save.d.seenIntro ? L('▶  كمّل المغامرة', '▶  Keep going!') : L('▶  يلا نبدأ!', "▶  Let's go!"), () => this.scene.start(Save.d.seenIntro ? 'Map' : 'Alex'), { w: 400, h: 110, size: 44 });
    if (Save.d.seenIntro) button(this, TX, 560, L('🌊  إسكندرية تاني', '🌊  Alexandria again'), () => this.scene.start('Alex'), { w: 320, h: 80, size: 30, color: 0xffffff });
    button(this, W - 80, 60, '⚙️', () => this.scene.start('Parent'), { w: 100, h: 76, color: 0xffffff, size: 36 });
    void ph; void kids;
  }
}

// ===== إسكندرية: الكورنيش (بتمشي يمين وشمال بالدوس) =====
export class Alex extends Phaser.Scene {
  constructor() { super('Alex'); }
  create() {
    const LW = W * 3;
    this.cameras.main.setBounds(0, 0, LW, H);
    // الكورنيش ← مكتبة الإسكندرية (البوابة في الساحة) ← قلعة قايتباي
    // بانوراما واحدة متدمجة (نصّين علشان حجم الصورة على الآيباد)
    const a1 = this.add.image(0, 0, 'bg_alex1').setOrigin(0, 0);
    this.add.image(a1.width, 0, 'bg_alex2').setOrigin(0, 0);
    const lib = { x: 2359 - 30 };
    // البوابة: بتكبر وتلف لما فارس يوصل
    this.portal = this.add.image(lib.x + 30, 480, 'portal').setScale(0).setDepth(4);
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
    arrow(W - 90, 1, '→'); arrow(90, -1, '←'); // المكتبة ناحية اليمين
    this.input.on('pointerdown', p => { if (p.y < H - 140) this.target = p.worldX; });
    this.input.on('pointerup', () => { this.walking = 0; });
    back(this, 'Title').setScrollFactor(0).setDepth(80).setPosition(W - 90, 60);
    this.hint = this.add.text(W / 2, 40, L('امشي على الكورنيش لحد مكتبة الإسكندرية ←', 'Walk along the Corniche to the Library →'), { fontFamily: FONT, fontSize: 30, color: '#0b3a66', fontStyle: '800', rtl: rtl(), backgroundColor: '#ffffffcc', padding: { x: 18, y: 8 } }).setOrigin(0.5).setScrollFactor(0).setDepth(80);
    this.busy = true;
    this.intro();
  }
  async intro() {
    await say(this, this.fares, L('أنا فارس! وده الكورنيش في إسكندرية 🌊 بحبه أوي', "Hi! I'm Fares! This is the Corniche in Alexandria 🌊 I love it!"));
    await say(this, this.farha, L('وأنا فرحة، أختك الكبيرة! بحبك أوي يا فارس', "I'm Farha, Fares's big sister! I love you so much, Fares! Wait for me!"));
    await say(this, this.dad, L('يلا يا أبطال، النهارده هنروح مكتبة الإسكندرية!', "Come on, heroes! Today we're going to the Library of Alexandria!"));
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
      if (this.fares.texture.key !== 'fares_run') { this.fares.setTexture('fares_run'); [this.farha, this.farid, this.dad, this.mom].forEach(s => s.setTexture(`${s.texture.key.split('_')[0]}_walk`)); }
      this.fares.y = 780 - Math.abs(Math.sin(t / 90)) * 10;
      // العيلة بتمشي ورا فارس
      [[this.farha, -110], [this.farid, -210], [this.dad, -360], [this.mom, -480]].forEach(([s, off]) => { s.x += (this.fares.x + off - s.x) * 0.06; s.setFlipX(dir < 0); });
    } else if (this.fares.texture.key === 'fares_run') {
      [this.fares, this.farha, this.farid, this.dad, this.mom].forEach(s => s.setTexture(s.texture.key.split('_')[0]).setFlipX(false));
      this.fares.y = 780;
    }
    if (this.fares.x > this.portal.x - 140 && !this.arrived) this.reachLibrary();
  }
  async reachLibrary() {
    this.arrived = true; this.target = null; this.walking = 0;
    [this.fares, this.farha, this.farid, this.dad, this.mom].forEach(s => s.setTexture(s.texture.key.split('_')[0]).setFlipX(false)); this.fares.y = 780;
    this.fares.setTexture('fares_point');
    this.hint.setText(L('مكتبة الإسكندرية 📚', 'The Library of Alexandria 📚'));
    await say(this, this.dad, L('دي مكتبة الإسكندرية، فيها كتب من كل الدنيا!', 'This is the Library of Alexandria. It has books from all over the world!'));
    Sfx.sparkle();
    this.tweens.add({ targets: this.portal, scale: 1.1, angle: 360, duration: 1400, ease: 'Back.Out' });
    this.tweens.add({ targets: this.portal, angle: '+=360', duration: 6000, repeat: -1, delay: 1400 });
    const nori = this.add.image(this.portal.x, this.portal.y, 'nori').setScale(0).setDepth(9);
    this.tweens.add({ targets: nori, scale: 0.7, y: this.portal.y - 170, duration: 900, delay: 900, ease: 'Back.Out' });
    this.time.delayedCall(1800, async () => {
      idle(this, nori, 0.06);
      await say(this, nori, L('أهلًا يا فارس! أنا نوري، نور فنار إسكندرية القديم ✨', "Hello, Fares! I'm Nori, the light of the old Lighthouse of Alexandria ✨"));
      await say(this, nori, L('الفنار نوره انطفى… ومحتاج نجمع نجوم العلم من جزر بعيدة علشان يرجع ينوّر!', "Oh no! The lighthouse lost its light… Let's collect stars of knowledge from faraway islands to light it up again!"));
      await say(this, this.fares, L('أنا جاهز! ومعايا فريد وفرحة 💪', "I'm ready! Farid and Farha are coming too 💪"));
      await say(this, this.farid, L('ما تقلقش يا صغيّر، أنا في ضهرك. يلا نعملها سوا!', "Don't worry, little brother. I've got your back. Let's do this together!"));
      await say(this, this.mom, L('خلّوا بالكم من بعض يا حبايبي، ونستناكم هنا 🤍', "Take care of each other, my loves. We'll wait for you right here 🤍"));
      Save.d.seenIntro = true; Save.put();
      Sfx.win();
      this.cameras.main.flash(500, 255, 255, 255);
      this.tweens.add({ targets: [this.fares, this.farid, this.farha], x: this.portal.x, y: this.portal.y + 60, scale: 0.05, duration: 1000, ease: 'Cubic.In' });
      this.time.delayedCall(1100, () => this.scene.start('Map'));
    });
  }
}

// ===== خريطة الجزر + الفنار =====
// كل جزيرة ليها عدد نجوم؛ الجزيرة بتتفتح لما اللي قبلها تخلص (أو نور الفنار وصل لها)
export const ISLANDS = [
  { id: 'plant', name: L('جزيرة النبات 🌱', 'Plant Island 🌱'), x: 380, y: 330, scene: 'Plant1', total: 5, go: L('اختار جزيرة النبات علشان نبدأ! 🌱', 'Tap Plant Island to start! 🌱') },
  { id: 'water', name: L('جزيرة المية 💧', 'Water Island 💧'), x: 720, y: 520, scene: 'Water1', total: 3, go: L('يلا على جزيرة المية! 💧', "Let's go to Water Island!") },
  { id: 'cave', name: L('كهف الشجاعة 🔦', 'Brave Cave 🔦'), x: 460, y: 640, scene: 'Cave1', total: 3, go: L('يلا على كهف الشجاعة! 🔦', "Let's go to the Brave Cave!") },
];
const isDone = is => Save.count(is.id) >= is.total;
export const islandsDone = () => { let n = 0; for (const is of ISLANDS) { if (isDone(is)) n++; else break; } return n; };
const isOpen = (is, i) => i === 0 || isDone(ISLANDS[i - 1]) || Save.d.pharos >= i;
export class Map extends Phaser.Scene {
  constructor() { super('Map'); }
  create() {
    gradient(this, 0x74c0fc, 0x1971c2);
    for (let i = 0; i < 26; i++) this.add.text(Math.random() * W, Math.random() * H, '〰', { fontSize: 30, color: '#d0ebff' }).setAlpha(0.5);
    const lit = Math.min(3, Save.d.pharos);
    const ph = this.add.image(W - 180, H - 20, `pharos${lit}`).setOrigin(0.5, 1).setScale(0.95);
    this.add.text(W - 180, 40, `${L('الفنار', 'Lighthouse')}: ${'⭐'.repeat(lit)}${'☆'.repeat(3 - lit)}`, { fontFamily: FONT, fontSize: 30, color: '#fff', fontStyle: '800', rtl: rtl() }).setOrigin(0.5);
    ISLANDS.forEach((is, i) => { is.open = isOpen(is, i); });
    for (const is of ISLANDS) {
      const c = this.add.container(is.x, is.y);
      const img = this.add.image(0, 0, 'island').setScale(0.9);
      const lbl = this.add.text(0, 78, is.name, { fontFamily: FONT, fontSize: 30, color: '#fff', fontStyle: '800', rtl: rtl(), stroke: '#0b3a66', strokeThickness: 8 }).setOrigin(0.5);
      c.add([img, lbl]);
      if (is.open) {
        const n = Save.count(is.id);
        c.add(this.add.text(0, 118, `${'⭐'.repeat(Math.min(n, is.total))}${'☆'.repeat(Math.max(0, is.total - n))}`, { fontFamily: FONT, fontSize: 30, rtl: rtl() }).setOrigin(0.5));
        c.setSize(260, 180).setInteractive({ useHandCursor: true }).on('pointerdown', () => { Sfx.tap(); hush(); this.scene.start(is.scene); });
        this.tweens.add({ targets: c, y: is.y - 10, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      } else { img.setTint(0x99aabb); c.add(this.add.image(0, -10, 'lock').setScale(0.7)); c.add(this.add.text(0, 118, L('قريب…', 'Soon…'), { fontFamily: FONT, fontSize: 26, color: '#e7f5ff', rtl: rtl() }).setOrigin(0.5)); c.setSize(260, 180).setInteractive().on('pointerdown', () => { Sfx.soft(); say(this, nori, L('خلّص الجزيرة اللي قبلها علشان دي تتفتح!', 'Finish the island before this one to open it!'), { x: is.x, y: is.y - 70 }); }); }
    }
    const nori = this.add.image(170, 300, 'nori').setScale(0.55); idle(this, nori, 0.06);
    this.fares = this.add.image(170, H - 20, 'fares').setOrigin(0.5, 1).setScale(0.5); idle(this, this.fares);
    back(this, 'Title');
    const nextIs = ISLANDS.find(is => is.open && !isDone(is));
    const hello = nextIs ? nextIs.go : L('خلّصت كل الجزر يا بطل! العب تاني وقت ما تحب ✨', 'You finished all the islands! Play again anytime!');
    if (this.registry.get('mapHello') !== hello) { this.registry.set('mapHello', hello); say(this, nori, hello, { x: 420, y: 250 }); }
    void ph;
  }
}

// ===== أساس المهمات: عنوان + نوري + نجمة في الآخر =====
export class Mission extends Phaser.Scene {
  head(title, bg = 'plant') {
    cover(this, `bg_${bg}`);
    if (bg === 'plant') { this.add.rectangle(W / 2, H / 2, W, H, 0xffffff, 0.35); this.add.rectangle(W / 2, H - 70, W, 140, 0x8d5524).setAlpha(0.35); }
    this.titleTxt = this.add.text(W / 2, 50, title, { fontFamily: FONT, fontSize: 38, color: bg === 'cave' ? '#fff3bf' : '#1b4332', fontStyle: '800', rtl: rtl(), backgroundColor: bg === 'plant' ? null : (bg === 'cave' ? '#00000088' : '#ffffffcc'), padding: { x: 16, y: 6 } }).setOrigin(0.5).setDepth(40);
    this.backBtn = back(this, 'Map').setDepth(40);
    this.nori = this.add.image(W - 110, 330, 'nori').setScale(0.5); idle(this, this.nori, 0.06);
    this.kid = this.add.image(W - 120, H - 20, 'fares').setOrigin(0.5, 1).setScale(0.55); idle(this, this.kid);
  }
  hint(text) { return say(this, this.nori, text, { x: W - 360, y: 275 }); }
  async win(id, next) {
    const first = Save.star(id);
    this.kid.setTexture('fares_cheer');
    Sfx.win(); celebrate(this, W / 2, H / 2, 26);
    const s = this.add.image(W / 2, H / 2, 'star').setScale(0).setDepth(70);
    this.tweens.add({ targets: s, scale: 2.2, angle: 360, duration: 900, ease: 'Back.Out' });
    await say(this, this.kid, first ? L('هييييه! كسبنا نجمة علم ⭐', 'Yay! We got a star of knowledge ⭐') : L('برافو عليا! ⭐', 'Great job! ⭐'), { x: W / 2, y: H / 2 - 160 });
    const lvl = islandsDone();
    if (lvl > Save.d.pharos) { Save.d.pharos = lvl; Save.put(); this.scene.start('Light', { level: lvl }); return; }
    this.scene.start(next || 'Map');
  }
}

// المهمة ١: ازرع البذرة (بالترتيب: بذرة ← مية ← شمس)
export class Plant1 extends Mission {
  constructor() { super('Plant1'); }
  create() {
    this.head(L('🌱 المهمة ١: ازرع البذرة', '🌱 Mission 1: Plant a seed'));
    this.step = 0;
    const pot = this.add.image(W / 2 - 60, H - 150, 'pot').setScale(1.2);
    this.potZone = new Phaser.Geom.Rectangle(pot.x - 130, pot.y - 120, 260, 200);
    this.plant = this.add.image(pot.x, pot.y - 70, 'sprout').setOrigin(0.5, 1).setScale(0);
    const mk = (key, x, y, s) => { const o = this.add.image(x, y, key).setScale(s).setInteractive({ draggable: true, useHandCursor: true }); o.home = { x, y }; idle(this, o, 0.04); return o; };
    this.seed = mk('seed', 200, 300, 0.9); this.can = mk('can', 220, 520, 0.9); this.sun = mk('sun', 470, 180, 0.8);
    this.input.on('dragstart', (p, o) => { Sfx.pick(); o.setScale(o.scale * 1.15).setDepth(20); });
    this.input.on('drag', (p, o, x, y) => { o.x = x; o.y = y; });
    this.input.on('dragend', (p, o) => { o.setScale(o.scale / 1.15); this.drop(o); });
    this.hint(L('بص يا فارس! النبتة بتبدأ من بذرة صغيرة. حط البذرة في القصرية 🌱', 'Look, Fares! Every plant starts as a tiny seed. Put the seed in the pot 🌱'));
  }
  async drop(o) {
    const inPot = this.potZone.contains(o.x, o.y);
    const want = [this.seed, this.can, this.sun][this.step];
    if (inPot && o === want) {
      Sfx.ok(); this.input.setDraggable(o, false);
      if (o === this.seed) { this.tweens.add({ targets: o, x: this.potZone.centerX, y: this.potZone.y + 40, scale: 0.4, alpha: 0, duration: 500 }); this.step = 1; await this.hint(L('البذرة نامت في الطينة! دلوقتي محتاجة تشرب… اسقيها بالرشاشة 💧', "The seed is sleeping in the soil! Now it's thirsty… give it water 💧")); }
      else if (o === this.can) {
        Sfx.splash(); this.tweens.add({ targets: o, angle: -35, duration: 300, yoyo: true, hold: 600, onComplete: () => this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400 }) });
        for (let i = 0; i < 14; i++) { const d = this.add.image(this.potZone.centerX - 60 + Math.random() * 120, this.potZone.y - 40, 'water').setScale(0.18); this.tweens.add({ targets: d, y: this.potZone.y + 60, alpha: 0, duration: 600, delay: i * 50, onComplete: () => d.destroy() }); }
        this.tweens.add({ targets: this.plant, scale: 0.6, duration: 900, delay: 500, ease: 'Back.Out' });
        this.step = 2; await this.hint(L('شوف! طلعت نبتة صغيرة 🌿 بس محتاجة نور الشمس علشان تكبر. هات الشمس ☀️', 'Look! A tiny sprout 🌿 It needs sunlight to grow. Bring the sun ☀️'));
      } else {
        this.tweens.add({ targets: o, x: this.potZone.centerX, y: 140, duration: 500 });
        this.plant.setTexture('flower'); this.plant.setScale(0.3);
        this.tweens.add({ targets: this.plant, scale: 1, duration: 1200, ease: 'Elastic.Out' });
        celebrate(this, this.potZone.centerX, this.potZone.y - 100);
        await this.hint(L('الله! بقت وردة جميلة 🌸 النبات محتاج: بذرة + مية + شمس. وكمان شوية صبر!', 'Wow! A beautiful flower 🌸 Plants need a seed, water and sun… and a little patience!'));
        this.win('plant1', 'Plant2');
      }
    } else {
      Sfx.soft(); this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400, ease: 'Back.Out' });
      if (inPot) this.hint([L('لسه بدري! الأول نحط البذرة 🌱', 'Not yet! First the seed 🌱'), L('البذرة لازم تشرب الأول قبل الشمس 💧', 'The seed needs a drink before the sun 💧'), ''][this.step] || L('قربت! جرّب تاني 💪', 'So close! Try again 💪'));
    }
  }
}

// المهمة ٢: النبتة محتاجة إيه؟ (فرز)
export class Plant2 extends Mission {
  constructor() { super('Plant2'); }
  create() {
    this.head(L('🌿 المهمة ٢: النبتة محتاجة إيه؟', '🌿 Mission 2: What does a plant need?'));
    this.plantImg = this.add.image(W / 2 - 220, H - 110, 'flower').setOrigin(0.5, 1).setScale(0.8);
    this.box = this.add.image(W / 2 + 230, H - 120, 'box').setScale(1);
    this.plantZone = new Phaser.Geom.Rectangle(this.plantImg.x - 140, H - 420, 280, 330);
    this.boxZone = new Phaser.Geom.Rectangle(this.box.x - 130, this.box.y - 100, 260, 190);
    const all = Phaser.Utils.Array.Shuffle([['water', true, L('المية', 'water')], ['sun', true, L('الشمس', 'the sun')], ['air', true, L('الهوا', 'air')], ['candy', false, L('الحلويات', 'candy')], ['phone', false, L('الموبايل', 'a phone')], ['toy', false, L('الدبدوب', 'a teddy bear')]]);
    this.left = 6;
    all.forEach(([k, need, name], i) => {
      const o = this.add.image(170 + i * 160, 200 + (i % 2) * 70, k).setScale(k === 'sun' ? 0.6 : 0.75).setInteractive({ draggable: true, useHandCursor: true });
      Object.assign(o, { need, nm: name, home: { x: o.x, y: o.y } }); idle(this, o, 0.04);
    });
    this.input.on('dragstart', (p, o) => { Sfx.pick(); o.setDepth(20); });
    this.input.on('drag', (p, o, x, y) => { o.x = x; o.y = y; });
    this.input.on('dragend', (p, o) => this.drop(o));
    this.hint(L('النبتة عايزة إيه علشان تعيش؟ حط اللي بتحتاجه جنبها، واللي مش محتاجاه في الصندوق!', "What does a plant need to live? Put what it needs next to it, and what it doesn't need in the box!"));
  }
  async drop(o) {
    const toPlant = this.plantZone.contains(o.x, o.y), toBox = this.boxZone.contains(o.x, o.y);
    if (!toPlant && !toBox) { this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 300 }); return; }
    if (toPlant === o.need) {
      Sfx.ok(); this.input.setDraggable(o, false);
      this.tweens.add({ targets: o, scale: o.scale * 0.6, x: toPlant ? this.plantImg.x + Phaser.Math.Between(-110, 110) : this.box.x + Phaser.Math.Between(-60, 60), y: toPlant ? H - 360 + Phaser.Math.Between(-30, 30) : this.box.y - 30, duration: 400 });
      if (toPlant) this.tweens.add({ targets: this.plantImg, scale: this.plantImg.scale * 1.06, duration: 300 });
      say(this, this.kid, toPlant ? L(`أيوه! النبتة محتاجة ${o.nm} ✔️`, `Yes! A plant needs ${o.nm} ✔️`) : L(`${o.nm}؟ لأ، النبتة مش محتاجاه 😄`, `${o.nm}? No, plants don't need that 😄`), { x: W / 2, y: 120 });
      if (--this.left === 0) { await new Promise(r => this.time.delayedCall(1800, r)); await this.hint(L('ممتاز! النبات بيحتاج مية وشمس وهوا… زينا بالظبط بنحتاج نشرب ونتنفس 🌍', 'Super! Plants need water, sun and air… just like us! We drink and breathe too 🌍')); this.win('plant2', 'Plant3'); }
    } else {
      Sfx.soft(); this.tweens.add({ targets: o, x: o.home.x, y: o.home.y, duration: 400, ease: 'Back.Out' });
      this.hint(o.need ? L(`فكّر تاني… النبتة من غير ${o.nm} تقدر تعيش؟ 🤔`, `Hmm… can a plant live without ${o.nm}? 🤔`) : L(`هههه، النبتة مش بتاكل ${o.nm}! 😄`, `Ha ha! Plants don't need ${o.nm}! 😄`));
    }
  }
}

// المهمة ٣: قطف التفاح بالعدد (فرحة عايزة عدد معيّن)
export class Plant3 extends Mission {
  constructor() { super('Plant3'); }
  create() {
    this.head(L('🍎 المهمة ٣: ساعد فرحة تقطف التفاح', '🍎 Mission 3: Help Farha pick apples'));
    this.add.image(W / 2 - 120, H - 60, 'tree').setOrigin(0.5, 1).setScale(1.15);
    this.basket = this.add.image(W / 2 + 370, H - 110, 'basket').setScale(1);
    this.farha = this.add.image(W / 2 + 200, H - 20, 'farha').setOrigin(0.5, 1).setScale(0.46); idle(this, this.farha);
    this.rounds = [3, 2, 5]; this.r = 0;
    this.countTxt = this.add.text(this.basket.x, this.basket.y - 110, '', { fontFamily: FONT, fontSize: 64, color: '#c92a2a', fontStyle: '800', rtl: rtl(), stroke: '#fff', strokeThickness: 10 }).setOrigin(0.5);
    this.round();
  }
  round() {
    (this.apples || []).forEach(a => a.destroy());
    this.need = this.rounds[this.r]; this.got = 0; this.countTxt.setText(L('٠', '0'));
    const spots = Phaser.Utils.Array.Shuffle([[-200, -330], [-90, -420], [40, -380], [150, -300], [-260, -230], [-30, -260], [90, -200], [220, -380]]);
    this.apples = spots.slice(0, 7).map(([dx, dy]) => {
      const a = this.add.image(W / 2 - 120 + dx * 1.15, H - 60 + dy * 1.15, 'apple').setScale(0.8).setInteractive({ useHandCursor: true });
      a.on('pointerdown', () => this.pick(a)); return a;
    });
    say(this, this.farha, L(`أنا عايزة ${['', 'تفاحة واحدة', 'تفاحتين', '٣ تفاحات', '٤ تفاحات', '٥ تفاحات'][this.need]} 🍎`, `I want ${['', 'one apple', 'two apples', 'three apples', 'four apples', 'five apples'][this.need]}, please! 🍎`), { x: this.farha.x - 60, y: H - 360 });
  }
  pick(a) {
    if (a.used || this.done) return;
    a.used = true; this.got++; Sfx.pick();
    const n = L('٠١٢٣٤٥٦٧٨٩'[this.got], String(this.got));
    this.countTxt.setText(n); this.tweens.add({ targets: this.countTxt, scale: 1.4, duration: 120, yoyo: true });
    speak(L(['', 'واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة', 'ستة', 'سبعة'][this.got], ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'][this.got]));
    this.tweens.add({ targets: a, x: this.basket.x + Phaser.Math.Between(-50, 50), y: this.basket.y - 20, scale: 0.55, duration: 500, ease: 'Quad.In' });
    if (this.got === this.need) this.roundDone();
    else if (this.got > this.need) { this.done = true; Sfx.soft(); say(this, this.farha, L(`دول كتير! أنا عايزة ${this.need} بس… يلا نعدّ تاني 😊`, `That's too many! I only want ${this.need}… let's count again 😊`), { x: this.farha.x - 60, y: H - 360 }).then(() => { this.done = false; this.round(); }); }
  }
  async roundDone() {
    this.done = true; Sfx.ok(); celebrate(this, this.basket.x, this.basket.y - 60, 12);
    await say(this, this.farha, L('شكرًا يا فارس! بالظبط كده 🤍', "Thank you, Fares! That's just right 🤍"), { x: this.farha.x - 60, y: H - 360 });
    this.done = false;
    if (++this.r < this.rounds.length) this.round();
    else { await this.hint(L('برافو! الشجرة كانت بذرة صغيرة زمان، وكبرت بالمية والشمس والصبر 🌳', 'Great! This big tree was a tiny seed once. It grew with water, sun and patience 🌳')); this.win('plant3', 'Plant4'); }
  }
}

// ===== نور الفنار: كل جزيرة بتخلص بتنوّر دور =====
const LIGHT_LINES = [null,
  [L('جمعتوا كل نجوم جزيرة النبات! يلا ننوّر أول دور في الفنار ✨', "You got all the stars on Plant Island! Let's light up the lighthouse ✨"), L('جزيرة المية مستنيانا! يلا بينا 💧', 'Water Island is waiting for us! Let\'s go!')],
  [L('جمعتوا كل نجوم جزيرة المية! الفنار بينوّر أكتر ✨', 'You got all the stars on Water Island! The lighthouse is getting brighter ✨'), L('دلوقتي يلا على كهف الشجاعة! 🔦', "Now let's go to the Brave Cave!")],
  [L('عملتها! خلّصت كل الجزر، والفنار رجع ينوّر تاني! ✨', 'You did it! All the islands are done. The lighthouse is shining bright again ✨'), L('شكرًا يا فارس! إنت بطل إسكندرية الحقيقي 🌟', 'Thank you, Fares! You are a real hero of Alexandria!')],
];
export class Light extends Phaser.Scene {
  constructor() { super('Light'); }
  create(data) {
    const lvl = Phaser.Math.Clamp(data?.level || Save.d.pharos || 1, 1, 3);
    gradient(this, 0x0b1d3a, 0x1c3f75);
    for (let i = 0; i < 60; i++) this.add.circle(Math.random() * W, Math.random() * H * 0.6, 1.5 + Math.random() * 2, 0xffffff, 0.8);
    const ph = this.add.image(W / 2 + 120, H - 10, `pharos${lvl - 1}`).setOrigin(0.5, 1).setScale(1.1);
    const nori = this.add.image(W / 2 - 300, 180, 'nori').setScale(0.6); idle(this, nori, 0.06);
    const kids = ['farha', 'fares', 'farid'].map((k, i) => this.add.image(130 + i * 150, H - 10, k).setOrigin(0.5, 1).setScale(0.5));
    let dad = null;
    if (lvl === 3) { dad = this.add.image(W - 120, H - 10, 'dad').setOrigin(0.5, 1).setScale(0.6); this.add.image(W - 250, H - 10, 'mom').setOrigin(0.5, 1).setScale(0.6); }
    const [first, last] = LIGHT_LINES[lvl];
    (async () => {
      const on = () => this.sys.isActive();
      await say(this, nori, first); if (!on()) return;
      Sfx.win(); this.cameras.main.flash(700, 255, 230, 150);
      ph.setTexture(`pharos${lvl}`); celebrate(this, ph.x, H - 200, 30); kids.forEach(k => k.setTexture(`${k.texture.key}_cheer`));
      await say(this, kids[1], L('شوفوا! الفنار بدأ ينوّر! 🌟', 'Look! The lighthouse is shining! 🌟'));
      if (!on()) return;
      if (dad) await say(this, dad, L('إحنا فخورين بيك أوي يا فارس! 🤍', 'We are so proud of you, Fares!'));
      if (!on()) return;
      await say(this, nori, last); if (!on()) return;
      button(this, W / 2, 120, L('للخريطة 🗺️', 'To the map 🗺️'), () => this.scene.start('Map'), { w: 320 });
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
    this.add.text(W / 2, 140, L(`ركن الأهل 🔒  —  كام ${a} × ${b}؟`, `Grown-ups only 🔒  —  What is ${a} × ${b}?`), { fontFamily: FONT, fontSize: 40, color: '#212529', fontStyle: '800', rtl: rtl() }).setOrigin(0.5);
    const opts = Phaser.Utils.Array.Shuffle([a * b, a * b + a, a * b - b, a * b + 2]);
    opts.forEach((v, i) => button(this, 260 + i * 250, 280, String(v), () => (v === a * b ? this.open() : this.scene.start('Title')), { w: 200, color: 0xffffff }));
  }
  open() {
    this.children.removeAll(); gradient(this, 0xf1f3f5, 0xdee2e6); back(this, 'Title');
    const T = (y, s) => this.add.text(W / 2, y, s, { fontFamily: FONT, fontSize: 32, color: '#212529', fontStyle: '700', rtl: rtl() }).setOrigin(0.5);
    T(80, L('ركن الأهل', 'Grown-ups corner'));
    T(150, L(`النجوم: ${Object.keys(Save.d.stars).length} — أدوار الفنار المنوّرة: ${Save.d.pharos}`, `Stars: ${Object.keys(Save.d.stars).length} — Lighthouse floors lit: ${Save.d.pharos}`));
    T(200, L('فارس اتعلم: نمو النبات، احتياجات الكائن الحي، العدّ، الألوان، الأشكال، يطفو ولا يغرق، نضافة الطبيعة، كبير وصغير، النور والضل، الصدق والطيبة والمشاركة', 'Fares learned: how plants grow, what living things need, counting, colors, shapes, float and sink, caring for nature, big and small, light and shadow, honesty, kindness and sharing'));
    const tog = (y, label, key) => { const b = button(this, W / 2, y, `${label}: ${Save.d[key] ? L('شغّال', 'ON') : L('مقفول', 'OFF')}`, () => { Save.d[key] = !Save.d[key]; Save.put(); this.open(); }, { w: 520, color: 0xffffff, size: 30 }); return b; };
    tog(290, L('🔊 الأصوات', '🔊 Sounds'), 'sound'); tog(390, L('🗣️ صوت الراوي', '🗣️ Narrator'), 'voice');
    button(this, W / 2, 490, L('🌐 اللغة: عربي — English', '🌐 Language: English — عربي'), () => { Save.d.lang = Save.d.lang === 'ar' ? 'en' : 'ar'; Save.put(); location.reload(); }, { w: 520, color: 0xd0ebff, size: 30 });
    button(this, W / 2, 590, L(`⏰ حد اللعب اليومي: ${Save.d.limitMin} دقيقة`, `⏰ Daily play limit: ${Save.d.limitMin} min`), () => { const LM = [15, 20, 30, 45, 60]; Save.d.limitMin = LM[(LM.indexOf(Save.d.limitMin) + 1) % LM.length]; Save.put(); this.open(); }, { w: 520, color: 0xffffff, size: 30 });
    button(this, W / 2, 700, L('🗑️ ابدأ من الأول', '🗑️ Start over'), () => { if (confirm(L('تمسح التقدم كله؟', 'Erase all progress?'))) { localStorage.removeItem('fares:save'); location.reload(); } }, { w: 400, color: 0xffc9c9, size: 28 });
  }
}

// ===== استراحة: حد اللعب اليومي =====
export class Rest extends Phaser.Scene {
  constructor() { super('Rest'); }
  create() {
    gradient(this, 0x0b1d3a, 0x1c3f75);
    const n = this.add.image(W / 2, 260, 'nori').setScale(0.9); idle(this, n, 0.06);
    say(this, n, L('لعبنا كتير النهارده يا فارس 🌙 يلا نريّح عنينا ونكمّل بكرة!', "We played a lot today, Fares 🌙 Let's rest our eyes and play again tomorrow!"), { x: W / 2, y: 140 });
    this.add.text(W / 2, 520, L('خلص وقت اللعب لليوم — الأهل يقدروا يغيّروه من ⚙️', 'Play time is over for today — grown-ups can change it in ⚙️'), { fontFamily: FONT, fontSize: 30, color: '#d0ebff', rtl: rtl() }).setOrigin(0.5);
  }
}
export { FAMILY };
