// كل رسومات اللعبة SVG بالكود (أصلية — من غير صور من النت): بتتحول لصور (textures) مرة واحدة في البداية.
// الشخصيات شكل كارتون مؤقت؛ في مرحلة التلميع هنستبدلها برسومات من صور العيلة (Higgsfield).

const skin = '#f2c9a0', skinD = '#e0b085', hairD = '#2b1d14';

// شخصية طفل/كبير بأسلوب «رأس كبير» — كل الأجزاء قابلة للتخصيص
function person({ w = 200, h = 300, shirt = '#e5484d', pants = '#2d4a7a', hair = hairD, hairStyle = 'short', cap = null, beard = false, hijab = null, dress = null, glasses = false, tall = 1, star = false, smile = true }) {
  const headR = 58 / tall, cx = w / 2, headY = 78 * (tall > 1 ? 0.9 : 1);
  const bodyTop = headY + headR - 6, bodyH = 105 * tall, legH = 70 * tall;
  const torso = dress
    ? `<path d="M${cx - 42} ${bodyTop + 6} Q${cx} ${bodyTop - 8} ${cx + 42} ${bodyTop + 6} L${cx + 62} ${bodyTop + bodyH + 18} L${cx - 62} ${bodyTop + bodyH + 18} Z" fill="${dress}"/>`
    : `<rect x="${cx - 44}" y="${bodyTop}" width="88" height="${bodyH}" rx="30" fill="${shirt}"/>`;
  const legs = dress
    ? `<rect x="${cx - 26}" y="${bodyTop + bodyH + 12}" width="18" height="${legH - 12}" rx="9" fill="${skin}"/><rect x="${cx + 8}" y="${bodyTop + bodyH + 12}" width="18" height="${legH - 12}" rx="9" fill="${skin}"/>`
    : `<rect x="${cx - 36}" y="${bodyTop + bodyH - 16}" width="30" height="${legH}" rx="13" fill="${pants}"/><rect x="${cx + 6}" y="${bodyTop + bodyH - 16}" width="30" height="${legH}" rx="13" fill="${pants}"/>`;
  const shoeY = bodyTop + bodyH + legH - 22;
  const shoes = `<ellipse cx="${cx - 22}" cy="${shoeY + 6}" rx="24" ry="12" fill="#222"/><ellipse cx="${cx + 22}" cy="${shoeY + 6}" rx="24" ry="12" fill="#222"/>`;
  const arms = `<rect x="${cx - 66}" y="${bodyTop + 10}" width="24" height="${bodyH * 0.72}" rx="12" fill="${dress || shirt}"/><rect x="${cx + 42}" y="${bodyTop + 10}" width="24" height="${bodyH * 0.72}" rx="12" fill="${dress || shirt}"/>
    <circle cx="${cx - 54}" cy="${bodyTop + 10 + bodyH * 0.72}" r="13" fill="${skin}"/><circle cx="${cx + 54}" cy="${bodyTop + 10 + bodyH * 0.72}" r="13" fill="${skin}"/>`;
  let hairSvg = '', behind = '';
  if (hijab) { behind = `<path d="M${cx - headR - 14} ${headY + 4} Q${cx - headR - 16} ${headY - headR - 22} ${cx} ${headY - headR - 20} Q${cx + headR + 16} ${headY - headR - 22} ${cx + headR + 14} ${headY + 4} L${cx + headR + 22} ${headY + headR + 38} Q${cx} ${headY + headR + 58} ${cx - headR - 22} ${headY + headR + 38} Z" fill="${hijab}"/>`; hairSvg = `<path d="M${cx - headR + 2} ${headY - 10} Q${cx} ${headY - headR - 4} ${cx + headR - 2} ${headY - 10} Q${cx} ${headY - headR + 14} ${cx - headR + 2} ${headY - 10}Z" fill="${hijab}"/>`; }
  else if (false) hairSvg = `<path d="M${cx - headR - 12} ${headY + 10} Q${cx - headR - 14} ${headY - headR - 18} ${cx} ${headY - headR - 16} Q${cx + headR + 14} ${headY - headR - 18} ${cx + headR + 12} ${headY + 10} L${cx + headR + 20} ${headY + headR + 34} Q${cx} ${headY + headR + 54} ${cx - headR - 20} ${headY + headR + 34} Z" fill="${hijab}"/>`;
  else if (hairStyle === 'pigtails') hairSvg = `<path d="M${cx - headR} ${headY - 4} Q${cx} ${headY - headR - 26} ${cx + headR} ${headY - 4} Q${cx + headR - 6} ${headY - headR + 12} ${cx} ${headY - headR + 16} Q${cx - headR + 6} ${headY - headR + 12} ${cx - headR} ${headY - 4}Z" fill="${hair}"/><circle cx="${cx - headR - 10}" cy="${headY + 4}" r="20" fill="${hair}"/><circle cx="${cx + headR + 10}" cy="${headY + 4}" r="20" fill="${hair}"/><circle cx="${cx - headR - 4}" cy="${headY - 12}" r="7" fill="#ff7eb6"/><circle cx="${cx + headR + 4}" cy="${headY - 12}" r="7" fill="#ff7eb6"/>`;
  else hairSvg = `<path d="M${cx - headR - 2} ${headY - 2} Q${cx - headR} ${headY - headR - 20} ${cx} ${headY - headR - 14} Q${cx + headR} ${headY - headR - 20} ${cx + headR + 2} ${headY - 2} Q${cx + headR - 10} ${headY - headR + 14} ${cx + 10} ${headY - headR + 18} Q${cx - 20} ${headY - headR + 6} ${cx - headR - 2} ${headY - 2}Z" fill="${hair}"/>`;
  const capSvg = cap ? `<path d="M${cx - headR + 2} ${headY - headR + 22} Q${cx} ${headY - headR - 30} ${cx + headR - 2} ${headY - headR + 22} Z" fill="${cap}"/><rect x="${cx - 8}" y="${headY - headR + 14}" width="${headR + 30}" height="12" rx="6" fill="${cap}"/>` : '';
  const face = `<circle cx="${cx - 20}" cy="${headY + 4}" r="7" fill="#2a1b12"/><circle cx="${cx + 20}" cy="${headY + 4}" r="7" fill="#2a1b12"/>
    <circle cx="${cx - 18}" cy="${headY + 1}" r="2.4" fill="#fff"/><circle cx="${cx + 22}" cy="${headY + 1}" r="2.4" fill="#fff"/>
    <circle cx="${cx - 34}" cy="${headY + 22}" r="8" fill="#ff9f9f" opacity=".55"/><circle cx="${cx + 34}" cy="${headY + 22}" r="8" fill="#ff9f9f" opacity=".55"/>
    ${smile ? `<path d="M${cx - 14} ${headY + 24} Q${cx} ${headY + 38} ${cx + 14} ${headY + 24}" stroke="#7a3b2a" stroke-width="5" fill="none" stroke-linecap="round"/>` : `<circle cx="${cx}" cy="${headY + 28}" r="6" fill="#7a3b2a"/>`}
    ${glasses ? `<circle cx="${cx - 20}" cy="${headY + 4}" r="15" stroke="#333" stroke-width="4" fill="none"/><circle cx="${cx + 20}" cy="${headY + 4}" r="15" stroke="#333" stroke-width="4" fill="none"/><path d="M${cx - 5} ${headY + 4}h10" stroke="#333" stroke-width="4"/>` : ''}
    ${beard ? `<path d="M${cx - headR + 8} ${headY + 10} Q${cx - headR + 10} ${headY + headR + 14} ${cx} ${headY + headR + 16} Q${cx + headR - 10} ${headY + headR + 14} ${cx + headR - 8} ${headY + 10} Q${cx + 30} ${headY + 46} ${cx} ${headY + 44} Q${cx - 30} ${headY + 46} ${cx - headR + 8} ${headY + 10}Z" fill="${hair}"/>` : ''}`;
  const starSvg = star ? `<path d="M${cx} ${bodyTop + 26} l8 16 18 3 -13 12 3 18 -16 -9 -16 9 3 -18 -13 -12 18 -3z" fill="#ffd60a"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <ellipse cx="${cx}" cy="${h - 10}" rx="60" ry="10" fill="#000" opacity=".15"/>
    ${legs}${shoes}${arms}${torso}${starSvg}${behind}
    <circle cx="${cx}" cy="${headY}" r="${headR}" fill="${skin}"/><circle cx="${cx - headR + 2}" cy="${headY + 6}" r="12" fill="${skinD}"/><circle cx="${cx + headR - 2}" cy="${headY + 6}" r="12" fill="${skinD}"/>
    ${hairSvg}${face}${capSvg}</svg>`;
}

// نوري: نور صغير من فنار إسكندرية القديم — الصاحب اللي بيرشد فارس
const nori = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs><radialGradient id="g" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fff9d6"/><stop offset=".55" stop-color="#ffd84d"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient></defs>
  <circle cx="80" cy="80" r="78" fill="url(#g)"/><circle cx="80" cy="82" r="40" fill="#ffe680"/>
  <circle cx="66" cy="78" r="7" fill="#3a2a00"/><circle cx="94" cy="78" r="7" fill="#3a2a00"/><circle cx="68" cy="75" r="2.5" fill="#fff"/><circle cx="96" cy="75" r="2.5" fill="#fff"/>
  <path d="M68 94 Q80 104 92 94" stroke="#3a2a00" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M80 40 l5 -18 M58 48 l-10 -14 M102 48 l10 -14" stroke="#fff3b0" stroke-width="5" stroke-linecap="round"/></svg>`;

const W = 1280, H = 800;
// مشهد الكورنيش (خلفية واسعة عرضها 3 شاشات): بحر، سما، كورنيش، نخل
const corniche = (() => {
  const L = W * 3;
  let palms = '', lamps = '', rail = '';
  for (let x = 120; x < L; x += 420) palms += `<g transform="translate(${x} 470)"><rect x="-8" y="0" width="16" height="140" rx="8" fill="#8a5a2b"/><path d="M0 0 q-70 -10 -110 30 M0 0 q70 -10 110 30 M0 0 q-40 -50 -90 -40 M0 0 q40 -50 90 -40 M0 0 q0 -60 -10 -80" stroke="#2f9e44" stroke-width="18" fill="none" stroke-linecap="round"/></g>`;
  for (let x = 300; x < L; x += 420) lamps += `<g transform="translate(${x} 470)"><rect x="-4" y="0" width="8" height="150" fill="#3d4b5c"/><circle cx="0" cy="-6" r="14" fill="#fff3b0"/></g>`;
  for (let x = 0; x < L; x += 40) rail += `<rect x="${x}" y="560" width="8" height="40" fill="#e9ecef"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#d9f0ff"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c7ed6"/><stop offset="1" stop-color="#0b4f8a"/></linearGradient></defs>
    <rect width="${L}" height="${H}" fill="url(#sky)"/>
    <circle cx="${L - 300}" cy="120" r="70" fill="#fff3b0"/>
    <rect y="330" width="${L}" height="240" fill="url(#sea)"/>
    ${Array.from({ length: 40 }, (_, i) => `<path d="M${i * 100} ${360 + (i % 3) * 50} q25 -12 50 0 t50 0" stroke="#a5d8ff" stroke-width="5" fill="none" opacity=".7"/>`).join('')}
    <rect y="560" width="${L}" height="40" fill="#adb5bd"/>${rail}<rect y="556" width="${L}" height="10" fill="#f8f9fa"/>
    <rect y="600" width="${L}" height="200" fill="#e8d5b0"/><rect y="600" width="${L}" height="14" fill="#cdb48a"/>
    ${palms}${lamps}</svg>`;
})();

// قلعة قايتباي
const qaitbay = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="300" viewBox="0 0 520 300">
  <rect x="20" y="170" width="480" height="120" fill="#d9b77a"/><rect x="150" y="70" width="220" height="220" fill="#e3c48d"/>
  <rect x="210" y="20" width="100" height="60" fill="#e9cd98"/>${[20, 470].map(x => `<rect x="${x}" y="130" width="40" height="160" fill="#c9a466"/><path d="M${x} 130 h40 l-6 -14 h-28z" fill="#b8924f"/>`).join('')}
  ${Array.from({ length: 12 }, (_, i) => `<rect x="${24 + i * 40}" y="158" width="22" height="14" fill="#d9b77a"/>`).join('')}
  <path d="M240 290 v-60 a20 20 0 0 1 40 0 v60z" fill="#7a5a2b"/>${[180, 320].map(x => `<rect x="${x}" y="120" width="20" height="34" rx="10" fill="#7a5a2b"/>`).join('')}
  <rect x="254" y="0" width="12" height="24" fill="#555"/><path d="M266 2 h40 l-10 10 10 10 h-40z" fill="#e5484d"/></svg>`;

// مكتبة الإسكندرية: قرص مايل كبير عليه حروف + البوابة السحرية
const library = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="320" viewBox="0 0 560 320">
  <defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa9b8"/><stop offset="1" stop-color="#d7dee5"/></linearGradient></defs>
  <path d="M20 300 L80 140 Q280 40 540 150 L540 300 Z" fill="#c3ccd5"/>
  <path d="M80 140 Q280 40 540 150 L540 175 Q280 70 80 165 Z" fill="url(#d)"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${110 + i * 48} ${176 - (i < 5 ? i * 6 : (8 - i) * 6)} v120" stroke="#8796a5" stroke-width="3"/>`).join('')}
  ${'أ ب ج ع ر A Ω 文 Ж'.split(' ').map((c, i) => `<text x="${120 + i * 46}" y="${250 + (i % 2) * 22}" font-size="26" fill="#6c7a89" font-family="serif">${c}</text>`).join('')}
  <rect x="0" y="296" width="560" height="24" fill="#a3b1bf"/></svg>`;

// كوبري ستانلي: أقواس + أبراج
const stanley = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="260" viewBox="0 0 700 260">
  <rect x="0" y="130" width="700" height="26" fill="#e9ecef"/><rect x="0" y="152" width="700" height="10" fill="#ced4da"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${i * 100} 260 Q${i * 100 + 50} 170 ${i * 100 + 100} 260" fill="none" stroke="#dee2e6" stroke-width="16"/>`).join('')}
  ${[60, 320, 600].map(x => `<g transform="translate(${x} 40)"><rect x="0" y="20" width="44" height="80" fill="#f1f3f5"/><path d="M-6 22 h56 l-28 -30z" fill="#adb5bd"/><rect x="14" y="44" width="16" height="28" rx="8" fill="#868e96"/></g>`).join('')}</svg>`;

// الترام الإسكندراني
const tram = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="170" viewBox="0 0 360 170">
  <rect x="10" y="30" width="340" height="110" rx="20" fill="#1c64c7"/><rect x="10" y="100" width="340" height="40" rx="0" fill="#f1e3c0"/>
  ${[30, 100, 170, 240, 300].map(x => `<rect x="${x}" y="48" width="44" height="40" rx="8" fill="#d0ebff"/>`).join('')}
  <rect x="175" y="0" width="10" height="32" fill="#555"/><circle cx="70" cy="148" r="18" fill="#333"/><circle cx="290" cy="148" r="18" fill="#333"/></svg>`;

// المدرسة
const school = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="320" viewBox="0 0 420 320">
  <rect x="20" y="100" width="380" height="210" fill="#ffd8a8"/><path d="M0 104 L210 10 L420 104 Z" fill="#e8590c"/>
  ${[60, 150, 250, 340].map(x => `<rect x="${x - 25}" y="140" width="50" height="50" rx="6" fill="#a5d8ff"/>`).join('')}
  <rect x="180" y="220" width="60" height="90" rx="8" fill="#8c5a2b"/><circle cx="210" cy="70" r="24" fill="#fff"/><path d="M210 56v14l10 6" stroke="#333" stroke-width="4" fill="none"/>
  <text x="210" y="125" font-size="26" text-anchor="middle" fill="#7a3b10" font-family="Cairo">مدرستي</text></svg>`;

// البوابة السحرية (حلقة نور)
const portal = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">
  <defs><radialGradient id="p" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#b197fc"/><stop offset=".7" stop-color="#5f3dc4"/><stop offset="1" stop-color="#5f3dc4" stop-opacity="0"/></radialGradient></defs>
  <circle cx="130" cy="130" r="128" fill="url(#p)"/><circle cx="130" cy="130" r="92" fill="none" stroke="#e5dbff" stroke-width="8" stroke-dasharray="20 14"/></svg>`;

// فنار إسكندرية القديم (هدف اللعبة) — 3 أدوار؛ كل جزيرة بتنوّر دور
function pharos(lit) {
  const glow = lit >= 3 ? `<circle cx="150" cy="40" r="60" fill="#ffe066" opacity=".5"/>` : '';
  const c = i => (lit > i ? '#ffe8a3' : '#c9b48a');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="520" viewBox="0 0 300 520">${glow}
    <rect x="40" y="300" width="220" height="210" fill="${c(0)}" stroke="#a88c5a" stroke-width="4"/>
    <path d="M70 300 L90 160 L210 160 L230 300 Z" fill="${c(1)}" stroke="#a88c5a" stroke-width="4"/>
    <rect x="115" y="70" width="70" height="90" fill="${c(2)}" stroke="#a88c5a" stroke-width="4"/>
    <circle cx="150" cy="50" r="24" fill="${lit >= 3 ? '#fff3b0' : '#8d7b5a'}"/>
    ${[90, 150, 210].map(x => `<rect x="${x - 12}" y="360" width="24" height="40" rx="12" fill="#8a7650"/>`).join('')}</svg>`;
}

// عناصر جزيرة النبات
const items = {
  seed: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><ellipse cx="60" cy="64" rx="26" ry="36" fill="#8d5524" transform="rotate(-20 60 64)"/><path d="M50 40 q10 -14 22 -6" stroke="#5c3310" stroke-width="5" fill="none"/></svg>`,
  can: `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="140"><rect x="30" y="40" width="90" height="80" rx="14" fill="#4dabf7"/><path d="M120 60 L170 30 L174 40 L126 80Z" fill="#339af0"/><path d="M40 40 q35 -40 70 0" stroke="#1971c2" stroke-width="10" fill="none"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><circle cx="80" cy="80" r="44" fill="#ffd43b"/>${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<path d="M${80 + Math.cos(a) * 56} ${80 + Math.sin(a) * 56} L${80 + Math.cos(a) * 74} ${80 + Math.sin(a) * 74}" stroke="#fab005" stroke-width="9" stroke-linecap="round"/>`; }).join('')}<circle cx="66" cy="74" r="6" fill="#7a4d00"/><circle cx="94" cy="74" r="6" fill="#7a4d00"/><path d="M66 94 q14 12 28 0" stroke="#7a4d00" stroke-width="5" fill="none"/></svg>`,
  pot: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="170"><path d="M20 30 h180 l-24 130 h-132z" fill="#d9480f"/><rect x="10" y="18" width="200" height="30" rx="10" fill="#e8590c"/><ellipse cx="110" cy="34" rx="88" ry="12" fill="#5c3d2e"/></svg>`,
  sprout: `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="200"><path d="M70 200 V80" stroke="#2f9e44" stroke-width="10"/><path d="M70 110 q-50 -10 -56 -50 q46 4 56 50z" fill="#40c057"/><path d="M70 90 q50 -14 60 -56 q-50 6 -60 56z" fill="#51cf66"/></svg>`,
  flower: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><path d="M100 300 V110" stroke="#2f9e44" stroke-width="12"/><path d="M100 220 q-60 -10 -70 -60 q56 6 70 60z" fill="#40c057"/><path d="M100 190 q60 -14 72 -64 q-60 6 -72 64z" fill="#51cf66"/>${Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return `<circle cx="${100 + Math.cos(a) * 34}" cy="${80 + Math.sin(a) * 34}" r="26" fill="#ff8787"/>`; }).join('')}<circle cx="100" cy="80" r="24" fill="#ffd43b"/></svg>`,
  water: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="140"><path d="M60 10 Q100 70 100 92 a40 40 0 0 1 -80 0 Q20 70 60 10z" fill="#4dabf7"/><circle cx="46" cy="90" r="8" fill="#d0ebff"/></svg>`,
  air: `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="120"><path d="M10 40 h80 a18 18 0 1 0 -18 -18 M10 66 h100 a18 18 0 1 1 -18 18 M10 92 h60" stroke="#74c0fc" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`,
  candy: `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="100"><circle cx="70" cy="50" r="30" fill="#f06595"/><path d="M40 50 l-28 -20 v40z M100 50 l28 -20 v40z" fill="#faa2c1"/><path d="M56 36 q14 28 28 0" stroke="#fff" stroke-width="5" fill="none"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="140"><rect x="10" y="6" width="70" height="128" rx="14" fill="#343a40"/><rect x="18" y="20" width="54" height="96" rx="6" fill="#74c0fc"/></svg>`,
  toy: `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130"><circle cx="65" cy="78" r="40" fill="#c08457"/><circle cx="65" cy="40" r="28" fill="#c08457"/><circle cx="42" cy="18" r="12" fill="#c08457"/><circle cx="88" cy="18" r="12" fill="#c08457"/><circle cx="56" cy="38" r="4" fill="#222"/><circle cx="74" cy="38" r="4" fill="#222"/></svg>`,
  apple: `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><circle cx="45" cy="50" r="32" fill="#e03131"/><path d="M45 20 q4 -14 14 -16" stroke="#5c3d2e" stroke-width="5" fill="none"/><path d="M48 18 q18 -10 26 4 q-16 6 -26 -4z" fill="#40c057"/><circle cx="34" cy="40" r="7" fill="#ffa8a8"/></svg>`,
  basket: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="150"><path d="M20 50 h180 l-20 90 h-140z" fill="#c08457"/>${[0, 1, 2, 3].map(i => `<path d="M${40 + i * 45} 50 l-8 90" stroke="#a0663f" stroke-width="5"/>`).join('')}<path d="M40 50 q70 -80 140 0" stroke="#a0663f" stroke-width="10" fill="none"/></svg>`,
  tree: `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="520"><rect x="200" y="300" width="60" height="220" rx="20" fill="#8a5a2b"/><circle cx="230" cy="210" r="190" fill="#40c057"/><circle cx="130" cy="230" r="110" fill="#37b24d"/><circle cx="340" cy="230" r="110" fill="#37b24d"/></svg>`,
  box: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="170"><rect x="10" y="40" width="220" height="120" rx="10" fill="#adb5bd"/><path d="M10 40 l30 -30 h160 l30 30z" fill="#ced4da"/><text x="120" y="112" font-size="30" text-anchor="middle" fill="#495057" font-family="Cairo">مش محتاجها</text></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M60 6 l16 34 38 5 -28 26 7 37 -33 -18 -33 18 7 -37 -28 -26 38 -5z" fill="#ffd43b" stroke="#f08c00" stroke-width="5" stroke-linejoin="round"/></svg>`,
  starOff: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M60 6 l16 34 38 5 -28 26 7 37 -33 -18 -33 18 7 -37 -28 -26 38 -5z" fill="#dee2e6" stroke="#adb5bd" stroke-width="5" stroke-linejoin="round"/></svg>`,
  island: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><ellipse cx="150" cy="150" rx="140" ry="44" fill="#ffe8a3"/><ellipse cx="150" cy="140" rx="110" ry="34" fill="#69db7c"/><rect x="140" y="60" width="12" height="80" fill="#8a5a2b"/><path d="M146 62 q-50 -6 -70 22 M146 62 q50 -6 70 22 M146 62 q-20 -40 -56 -36 M146 62 q20 -40 56 -36" stroke="#2f9e44" stroke-width="12" fill="none" stroke-linecap="round"/></svg>`,
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="100"><rect x="10" y="44" width="70" height="52" rx="10" fill="#868e96"/><path d="M24 44 v-12 a21 21 0 0 1 42 0 v12" stroke="#868e96" stroke-width="10" fill="none"/></svg>`,
};

export const CHARS = {
  fares: person({ shirt: '#e5484d', pants: '#1c3d6e', cap: '#1c7ed6', star: true }),
  farid: person({ shirt: '#2f9e44', pants: '#343a40', tall: 1.12, hairStyle: 'short' }),
  farha: person({ dress: '#f783ac', hairStyle: 'pigtails', hair: '#3b2416', tall: 0.92 }),
  dad: person({ w: 220, h: 360, shirt: '#495057', pants: '#212529', tall: 1.45, beard: true, glasses: true }),
  mom: person({ w: 220, h: 350, dress: '#748ffc', hijab: '#e599f7', tall: 1.38 }),
};
export const SVGS = { nori, corniche, qaitbay, library, stanley, tram, school, portal, pharos0: pharos(0), pharos1: pharos(1), pharos2: pharos(2), pharos3: pharos(3), ...items, ...CHARS };
export { W, H };
