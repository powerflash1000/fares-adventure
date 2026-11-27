// مكتبة التلوين: ٥٠ شارك. الملف assets/color/sharkNN.png (خطوط سودا على شفاف) + assets/color/t/sharkNN.jpg (مصغّرة)
// الترتيب ثابت (الرقم = اسم الملف). الجوايز: بعد كل جزيرة شارك مخصوص.
export const SHARKS = [
  ['Hammerhead', 'القرش المطرقة'], ['Great White', 'القرش الأبيض العظيم'], ['Whale Shark', 'قرش الحوت'], ['Tiger Shark', 'قرش النمر'],
  ['Bull Shark', 'قرش الثور'], ['Blacktip Reef Shark', 'قرش الشعاب أسود الزعنفة'], ['Whitetip Reef Shark', 'قرش الشعاب أبيض الزعنفة'], ['Nurse Shark', 'القرش الممرّض'],
  ['Lemon Shark', 'القرش الليموني'], ['Mako Shark', 'قرش ماكو'], ['Thresher Shark', 'قرش الدرّاس'], ['Goblin Shark', 'القرش العفريت'],
  ['Megamouth Shark', 'القرش واسع الفم'], ['Basking Shark', 'القرش الشمسي'], ['Zebra Shark', 'القرش الحمار الوحشي'], ['Leopard Shark', 'قرش الفهد'],
  ['Wobbegong', 'قرش السجادة'], ['Angel Shark', 'القرش الملاك'], ['Epaulette Shark', 'قرش الكتف'], ['Bamboo Shark', 'قرش الخيزران'],
  ['Horn Shark', 'القرش ذو القرون'], ['Port Jackson Shark', 'قرش بورت جاكسون'], ['Cookiecutter Shark', 'قرش البسكويت'], ['Frilled Shark', 'القرش المزخرف'],
  ['Sawshark', 'القرش المنشار'], ['Greenland Shark', 'قرش جرينلاند'], ['Sixgill Shark', 'قرش الست خياشيم'], ['Sevengill Shark', 'قرش السبع خياشيم'],
  ['Blue Shark', 'القرش الأزرق'], ['Silky Shark', 'القرش الحريري'], ['Oceanic Whitetip', 'قرش المحيط أبيض الزعنفة'], ['Dusky Shark', 'القرش الداكن'],
  ['Sandbar Shark', 'قرش الرمال'], ['Spinner Shark', 'القرش الدوّار'], ['Caribbean Reef Shark', 'قرش الكاريبي'], ['Grey Reef Shark', 'قرش الشعاب الرمادي'],
  ['Blacknose Shark', 'القرش أسود الأنف'], ['Bonnethead Shark', 'قرش رأس المجرفة'], ['Winghead Shark', 'القرش ذو الجناحين'], ['Great Hammerhead', 'المطرقة العظيم'],
  ['Smooth Hammerhead', 'المطرقة الناعم'], ['Longfin Mako', 'ماكو طويل الزعنفة'], ['Salmon Shark', 'قرش السلمون'], ['Porbeagle', 'قرش بوربيجل'],
  ['School Shark', 'قرش المدرسة'], ['Catshark', 'قرش القط'], ['Swell Shark', 'القرش المنتفخ'], ['Lantern Shark', 'قرش الفانوس'],
  ['Pyjama Shark', 'قرش البيجاما'], ['Mama & Baby Shark', 'ماما وبيبي شارك'],
].map(([en, ar], i) => ({ n: i + 1, id: `shark${String(i + 1).padStart(2, '0')}`, en, ar }));

// جايزة كل جزيرة (بالترتيب: النبات، المية، كهف الشجاعة)
export const PRIZES = [2, 3, 1, 4, 5];
