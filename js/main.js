import { W, H } from './art.js';
import { Boot, Title, Alex, Map, Plant1, Plant2, Plant3, Light, Parent, Rest } from './scenes.js';
import { Save } from './sys.js';
import { Plant4, Plant5, Water1, Water2, Water3, Cave1, Cave2, Cave3, Safari1, Safari2, Safari3, Space1, Space2, Space3 } from './islands.js';
import { ALL_VOICE_FILES } from './voice.js';
import { Gallery, Coloring } from './coloring.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W, height: H,
  backgroundColor: '#1c7ed6',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, roundPixels: false },
  input: { activePointers: 3 },
  scene: [Boot, Title, Alex, Map, Plant1, Plant2, Plant3, Plant4, Plant5, Water1, Water2, Water3, Cave1, Cave2, Cave3, Safari1, Safari2, Safari3, Space1, Space2, Space3, Light, Parent, Rest, Gallery, Coloring],
});

// ⏰ حد اللعب اليومي (بيتعد بس والتاب مفتوح وظاهر)
setInterval(() => {
  if (document.hidden) return;
  const d = new Date().toISOString().slice(0, 10);
  if (Save.d.today !== d) { Save.d.today = d; Save.d.todayMin = 0; }
  Save.d.todayMin += 1 / 6; Save.put();
  if (Save.d.todayMin >= Save.d.limitMin) {
    const active = game.scene.getScenes(true)[0]?.scene.key;
    if (active && !['Rest', 'Parent'].includes(active)) game.scene.getScenes(true).forEach(s => s.scene.start('Rest'));
  }
}, 10000);

// PWA: يشتغل من غير نت بعد أول مرة
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
// حمّل الأصوات المسجّلة في الخلفية علشان تشتغل فورًا ومن غير نت بعد كده
addEventListener('load', () => setTimeout(() => ALL_VOICE_FILES.forEach((f, i) => setTimeout(() => fetch(f).catch(() => {}), i * 120)), 1500));
window.__game = game;
