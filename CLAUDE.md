# CLAUDE.md — رحلة فارس (fares-adventure)

Working memory for Claude sessions. Talk to the user in Egyptian Arabic, short and practical.

## The user & the child
- Game for the user's son **فارس (5 y, Alexandria)**; siblings **فريد** and **فرحة**, parents «بابي» and «مامي». User explicitly chose (2026-11-21) to keep the real names and Alexandria setting in the public code (warned about privacy). Do NOT add the real school name, home address or photos of the children to the repo.
- Goal: «wow» quality, incremental. Ages 5–10: everything voiced (5-year-olds can't read), big touch targets, no fail screens (gentle hints), no ads/IAP/chat, offline, parent gate + daily time limit.

## Hard decisions
- Static PWA, no build step: `index.html` + `vendor/phaser.min.js` (Phaser 3.80.1, MIT) + ES modules in `js/`. GitHub Pages. Later Capacitor for stores.
- Art = original SVG drawn in code (`js/art.js`, loaded as base64 data URIs; non-ASCII chars must be converted to `&#NNN;` entities first — Phaser decodes as Latin-1). Characters are placeholders until the polish stage (Higgsfield character refs exist in the user's account: father Alaa, Fares, Farid, maybe Farha).
- Narration now = browser `speechSynthesis` (ar-EG/ar); planned: user's ElevenLabs voice «Alaa Reader» (`e6vPzasYhrgOl8FATPyp`) after the user tests and lines are final (user chose "after I try").
- Design 1280×800 landscape, `Scale.FIT`. Portrait phones show «لفّ الجهاز».
- Save in localStorage `fares:save` ({stars, pharos, sound, voice, limitMin, todayMin, today, seenIntro}).
- Bump `sw.js` VERSION and `?v=` in index.html with each release.

## Code map
- `js/art.js`: `person()` chibi generator, `nori`, corniche (3 screens wide), qaitbay, library, stanley, tram, school, portal, `pharos(lit)`, mission items.
- `js/sys.js`: Save, Sfx (WebAudio synth), `speak()`, UI helpers `button`, `say` (speech bubble + narration), `celebrate`, `idle`, `gradient`, `back`.
- `js/scenes.js`: Boot, Title, Alex (corniche walk → library → portal + Nori intro), Map (islands + Pharos), Mission base (`head`, `hint`, `win`), Plant1 (seed→water→sun order), Plant2 (sort needs vs not), Plant3 (count apples 3/2/5), Light (first Pharos floor), Parent (multiplication gate), Rest (daily limit).
- Tested with Playwright at iPad size: full flow, missions 1–3 to the Light scene, no errors.

## Roadmap
M0+M1 done (Alexandria, portal, Plant island). Next: 💧 water island, 🔦 courage cave, ElevenLabs narration, art polish (Higgsfield), parent dashboard, Capacitor/App Store.
- Language (2026-11-21, user-requested): **simple English is the default** (Fares understands English well); Arabic optional via the parents' corner «🌐 Language» (`Save.d.lang`, reload). `sys.js L(ar, en)`, `isAr()`, `rtl()`; speech voice en-US/ar-EG accordingly; SVG text uses `isAr()` (box shows ✖ instead of words). Never name a local variable `L` in scenes (it shadows the translator — broke the Alexandria scene once).
