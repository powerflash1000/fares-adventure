# CLAUDE.md — رحلة فارس (fares-adventure)

Working memory for Claude sessions. Talk to the user in Egyptian Arabic, short and practical.

## The user & the child
- Game for the user's son **فارس (5 y, Alexandria)**; siblings **فريد** and **فرحة**, parents «بابي» and «مامي». User explicitly chose (2026-11-21) to keep the real names and Alexandria setting in the public code (warned about privacy). Do NOT add the real school name, home address or photos of the children to the repo.
- Goal: «wow» quality, incremental. Ages 5–10: everything voiced (5-year-olds can't read), big touch targets, no fail screens (gentle hints), no ads/IAP/chat, offline, parent gate + daily time limit.

## Hard decisions
- Static PWA, no build step: `index.html` + `vendor/phaser.min.js` (Phaser 3.80.1, MIT) + ES modules in `js/`. GitHub Pages. Later Capacitor for stores.
- Art = original SVG drawn in code (`js/art.js`, loaded as base64 data URIs; non-ASCII chars must be converted to `&#NNN;` entities first — Phaser decodes as Latin-1). Characters are placeholders until the polish stage (Higgsfield character refs exist in the user's account: father Alaa, Fares, Farid, Farha). Family ages: Farha 16 (oldest), Farid 15, Fares 5 — Farha is the big sister; never call Farid the "big brother" of Farha.
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
- Voices: recorded English lines live in `assets/voice/*.mp3` (ElevenLabs flow "Fares Adventure — voice casting", model eleven_v4 with [emotion] tags). `js/voice.js` maps each English line (as written in scenes.js; matching ignores case/punctuation/emoji) to its file; `speak()` plays the clip and falls back to browser TTS only for unrecorded lines or Arabic. When you add/change an English spoken line, record it with the same voice and add it to `LINES`, or it will fall back to TTS. Cast: Fares = "Fares my son" BDxSTCF2sn9jodTDlihx (the family's own clone), Dad = "Alaa Reader" e6vPzasYhrgOl8FATPyp, Mom/Wafaa = Georgia K h5EerLZbdVHFXe9rEGjM, Farid (15) = Lip DGqQmo441r9TwJq0migX, Farha (16) = Yuria vGfq3y2g8QTWjuUhrNYc, Nori = Belle B CqSwFbfWKBt9DQkSW9UV. Always pass generations_count: 1.
- Art: real character sprites in `assets/art/chars/` (Seedream 5 lite via Higgsfield reference elements, generated on #00FF00 and chroma-keyed locally — 1 credit each, never GPT/Nano Banana). Texture keys: `fares|farid|farha|dad|mom` (standing) plus poses `fares_run/jump/cheer/point`, `farid_walk/cheer`, `farha_walk/cheer`, `dad_walk`, `mom_walk` (see `CHAR_ART` in scenes.js; these override the old SVG `CHARS`). PNG heights are pre-sized so the existing `setScale` values give real proportions (Farha ≈ Farid height, Fares small). Backgrounds in `assets/art/bg/`: `alex1+alex2` = one blended panorama Corniche → Library (portal plaza centre x≈2359) → Qaitbay, split in two to stay under iPad texture limits; `qaitbay` (title), `plant` (missions). Fares skin: light olive.
- Islands (see `ISLANDS` in scenes.js): Plant (5 stars: Plant1 seed, Plant2 needs, Plant3 counting, Plant4 fruit colors, Plant5 shape path w/ Farid) → Water (3: Water1 float/sink, Water2 clean the beach w/ Farha, Water3 Dad's fish big/small + counting) → Brave Cave (3: Cave1 flashlight w/ RenderTexture darkness, Cave2 shadow match, Cave3 kindness/honesty choices w/ Mom). New missions live in `js/islands.js` (extend `Mission`; items are emoji text objects). An island opens when the previous one is complete; each completed island lights one lighthouse floor (`Light` scene takes `{level}`). Backgrounds `bg_water`, `bg_cave` (Seedream).
- Short word clips (colors, shapes, animals, "It floats!"…) were recorded as one take per group and split on silences with ffmpeg (`w_*.mp3`, `count*.mp3`).
