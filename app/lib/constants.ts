export type FilterGroup = 'pink' | 'asian' | 'film' | 'mono' | 'fun';

export const filterGroups: { id: FilterGroup | 'all'; label: string }[] = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pink', label: '🩷 ชมพูหวาน' },
    { id: 'asian', label: '🌸 ญี่ปุ่น/เกาหลี' },
    { id: 'film', label: '🎞️ ฟิล์ม' },
    { id: 'mono', label: '🤍 ขาวดำ' },
    { id: 'fun', label: '🌈 สนุก' },
];

// หมายเหตุ: ต้องเขียน class เต็ม ๆ เป็น string คงที่ เพื่อให้ Tailwind สแกนเจอ
export const filters: { id: string; name: string; class: string; group: FilterGroup | 'none' }[] = [
    // --- Standard ---
    { id: 'normal', name: '✨ ปกติ', class: '', group: 'none' },

    // --- Sweet Pink ---
    { id: 'strawberry-milk', name: '🍓 สตรอว์เบอร์รี่มิลค์', class: 'brightness-110 contrast-95 saturate-110 sepia-[.15] hue-rotate-[-25deg]', group: 'pink' },
    { id: 'rose-glow', name: '🌹 โรสโกลว์', class: 'brightness-110 contrast-105 saturate-125 sepia-[.2] hue-rotate-[-30deg]', group: 'pink' },
    { id: 'cotton-candy', name: '🍬 สายไหม', class: 'brightness-115 contrast-90 saturate-130 hue-rotate-[-35deg]', group: 'pink' },
    { id: 'blush', name: '🌸 แก้มใส', class: 'brightness-110 contrast-100 saturate-110 sepia-[.15] hue-rotate-[-50deg]', group: 'pink' },
    { id: 'peach', name: '🍑 พีช', class: 'brightness-110 contrast-105 saturate-110 sepia-[.2] hue-rotate-[-15deg]', group: 'pink' },
    { id: 'pink-mono', name: '🩷 ชมพูโมโน', class: 'grayscale sepia-[.6] hue-rotate-[290deg] saturate-150 brightness-110', group: 'pink' },
    { id: 'marshmallow', name: '☁️ มาร์ชเมลโล', class: 'brightness-125 contrast-90 saturate-90 blur-[0.3px]', group: 'pink' },
    { id: 'unicorn', name: '🦄 ยูนิคอร์น', class: 'contrast-110 brightness-110 hue-rotate-[-20deg] saturate-125', group: 'pink' },

    // --- Japanese / Korean ---
    { id: 'glass-skin', name: '💧 ผิวกระจก', class: 'brightness-115 contrast-95 saturate-95 blur-[0.25px]', group: 'asian' },
    { id: 'sakura', name: '🌸 ซากุระ', class: 'brightness-115 contrast-95 saturate-90 sepia-[.12] hue-rotate-[-20deg]', group: 'asian' },
    { id: 'airy', name: '☁️ แอร์รี่', class: 'brightness-125 contrast-90 saturate-90', group: 'asian' },
    { id: 'fuji', name: '🗻 ฟูจิ', class: 'brightness-110 contrast-100 saturate-110 sepia-[.15]', group: 'asian' },
    { id: 'mori', name: '🌿 โมริ', class: 'brightness-110 contrast-90 saturate-85 sepia-[.1]', group: 'asian' },
    { id: 'k-pop', name: '🎤 เคป๊อป', class: 'brightness-110 contrast-110 saturate-125', group: 'asian' },
    { id: 'cream', name: '🍦 ครีม', class: 'brightness-115 contrast-90 saturate-100 sepia-[.1]', group: 'asian' },
    { id: 'latte', name: '☕ ลาเต้', class: 'sepia-[.35] brightness-105 contrast-95 saturate-80', group: 'asian' },
    { id: 'seoul-night', name: '🌙 โซลไนท์', class: 'brightness-90 contrast-115 saturate-120 hue-rotate-[-15deg]', group: 'asian' },
    { id: 'dreamy', name: '🦋 ดรีมมี่', class: 'brightness-115 contrast-90 saturate-110 blur-[0.4px]', group: 'asian' },

    // --- Film / Retro ---
    { id: 'kodak', name: '📷 โกดัก', class: 'contrast-110 brightness-105 saturate-120 sepia-[.25]', group: 'film' },
    { id: 'honey', name: '🍯 ฮันนี่', class: 'brightness-110 sepia-[.35] saturate-130 contrast-105', group: 'film' },
    { id: 'cinematic', name: '🎬 ซีเนมาติก', class: 'contrast-125 brightness-95 saturate-90 sepia-[.15] hue-rotate-[-5deg]', group: 'film' },
    { id: 'vintage', name: '🎞️ วินเทจ', class: 'sepia-[.5] contrast-110 brightness-90 saturate-85', group: 'film' },
    { id: 'lofi', name: '📼 โลไฟ', class: 'contrast-125 saturate-110 sepia-[.3] brightness-90', group: 'film' },
    { id: '1990s', name: '📸 ยุค 90', class: 'contrast-125 brightness-110 saturate-75 sepia-[.2]', group: 'film' },
    { id: 'polaroid', name: '🖼️ โพลารอยด์', class: 'contrast-110 brightness-110 saturate-100 sepia-[.1] hue-rotate-[-10deg]', group: 'film' },
    { id: 'golden-hour', name: '🌅 แสงเย็น', class: 'sepia-[.5] contrast-110 brightness-110 saturate-150', group: 'film' },
    { id: 'midnight', name: '🌃 มิดไนท์', class: 'brightness-75 contrast-125 saturate-110 hue-rotate-[-10deg] sepia-[.2]', group: 'film' },

    // --- Black & White ---
    { id: 'bw-soft', name: '🤍 ขาวดำละมุน', class: 'grayscale brightness-115 contrast-90', group: 'mono' },
    { id: 'bw-chic', name: '🎥 ขาวดำชิค', class: 'grayscale contrast-125 brightness-110', group: 'mono' },
    { id: 'noir-dark', name: '🧛 นัวร์เข้ม', class: 'grayscale contrast-[1.5] brightness-75', group: 'mono' },
    { id: 'sepia-mood', name: '🤎 ซีเปีย', class: 'sepia-[.8] contrast-105 brightness-105', group: 'mono' },

    // --- Vivid / Fun ---
    { id: 'y2k', name: '💿 Y2K', class: 'contrast-115 brightness-105 saturate-140 hue-rotate-[-12deg]', group: 'fun' },
    { id: 'summer', name: '☀️ ซัมเมอร์', class: 'brightness-110 saturate-150 contrast-110', group: 'fun' },
    { id: 'technicolor', name: '🌈 เทคคัลเลอร์', class: 'contrast-125 saturate-[1.8] sepia-[.1]', group: 'fun' },
    { id: 'cyber', name: '🤖 ไซเบอร์', class: 'contrast-125 brightness-110 saturate-150 hue-rotate-[180deg]', group: 'fun' },
    { id: 'duotone', name: '🟣 ดูโอโทน', class: 'grayscale sepia hue-rotate-[230deg] contrast-125', group: 'fun' },
    { id: 'mint', name: '🍃 มิ้นท์', class: 'grayscale sepia-[.5] hue-rotate-[100deg] saturate-125 brightness-110', group: 'fun' },
    { id: 'invert', name: '🔄 เนกาทีฟ', class: 'invert', group: 'fun' },
];

// แปลง Tailwind filter classes เป็นค่า CSS `filter`
// (ต้องใช้ inline style เพื่อให้ html-to-image จับภาพพร้อมฟิลเตอร์ได้)
const FILTER_FNS = ['brightness', 'contrast', 'saturate', 'sepia', 'grayscale', 'invert', 'blur', 'hue-rotate'] as const;
const PERCENT_FNS = new Set(['brightness', 'contrast', 'saturate', 'sepia', 'grayscale', 'invert']);

export const tailwindToCssFilter = (classNames: string): string => {
  if (!classNames) return 'none';
  const parts: string[] = [];
  for (const cls of classNames.split(/\s+/).filter(Boolean)) {
    const fn = FILTER_FNS.find(f => cls === f || cls.startsWith(`${f}-`));
    if (!fn) continue;
    if (cls === fn) {
      // grayscale / invert / sepia ไม่มีค่า = 100%
      if (fn !== 'blur' && fn !== 'hue-rotate') parts.push(`${fn}(1)`);
      continue;
    }
    const raw = cls.slice(fn.length + 1);
    const arbitrary = raw.match(/^\[(.+)\]$/);
    if (arbitrary) {
      parts.push(`${fn}(${arbitrary[1]})`); // เช่น sepia-[.15] → sepia(.15)
    } else if (/^-?\d+(\.\d+)?$/.test(raw)) {
      const n = parseFloat(raw);
      if (PERCENT_FNS.has(fn)) parts.push(`${fn}(${n / 100})`);
      else if (fn === 'hue-rotate') parts.push(`hue-rotate(${n}deg)`);
    }
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
};

export const getFilterStyle = (filterId: string): string =>
  tailwindToCssFilter(filters.find(f => f.id === filterId)?.class || '');
