import React from 'react';

// ───────────────────────────────────────────────────────────────
// สติกเกอร์ภาพวาด (inline SVG, viewBox 0 0 120 120) — ไม่ใช้อิโมจิ
// ขอบขาวแบบไดคัทมาจาก CSS `.sticker-cut` ใน globals.css
// ───────────────────────────────────────────────────────────────

const INK = '#4a1f36';
const BLUSH = '#ff9ec2';

const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', overflow: 'visible' }}>
    {children}
  </svg>
);

// หน้ายิ้มน่ารัก ใช้ซ้ำได้
const Face = ({ cx, cy, s = 1, eye = INK, blush = BLUSH }: { cx: number; cy: number; s?: number; eye?: string; blush?: string }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <ellipse cx={-11} cy={0} rx={3.6} ry={4.4} fill={eye} />
    <ellipse cx={11} cy={0} rx={3.6} ry={4.4} fill={eye} />
    <circle cx={-9.8} cy={-1.6} r={1.2} fill="#fff" />
    <circle cx={12.2} cy={-1.6} r={1.2} fill="#fff" />
    <path d="M-4 6 Q0 10 4 6" stroke={eye} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <ellipse cx={-19} cy={7} rx={5} ry={3} fill={blush} opacity={0.75} />
    <ellipse cx={19} cy={7} rx={5} ry={3} fill={blush} opacity={0.75} />
  </g>
);

const Shine = ({ x, y, r = 5 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#fff" opacity={0.7} transform={`rotate(-30 ${x} ${y})`} />
);

export type StickerGroup = 'sweet' | 'classic' | 'label';
export type StickerArt = { id: string; name: string; art: React.ReactNode; group?: StickerGroup };

export const stickerGroups: { id: StickerGroup | 'all'; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'classic', label: '🌈 สีสันปกติ' },
  { id: 'sweet', label: '🎀 หวานชมพู' },
  { id: 'label', label: '💬 ป้ายข้อความ' },
];

const CHEEK = '#ffab91'; // แก้มสีส้มพีช สำหรับสติกเกอร์สีปกติ
const FONT_DISPLAY = { fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic' as const, fontWeight: 700 };
const FONT_SANS = { fontFamily: 'var(--font-prompt), sans-serif', fontWeight: 800 };

const sweetStickers: StickerArt[] = [
  {
    id: 'heart', name: 'หัวใจ',
    art: (
      <Svg>
        <path d="M60 104 C22 78 8 54 18 35 C28 16 50 18 60 37 C70 18 92 16 102 35 C112 54 98 78 60 104Z" fill="#ff7eaa" />
        <path d="M60 94 C30 73 20 55 27 41 C33 30 47 31 55 43" fill="none" stroke="#ff9ec2" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        <Shine x={36} y={38} r={7} />
      </Svg>
    ),
  },
  {
    id: 'heart-face', name: 'หัวใจยิ้ม',
    art: (
      <Svg>
        <path d="M60 104 C22 78 8 54 18 35 C28 16 50 18 60 37 C70 18 92 16 102 35 C112 54 98 78 60 104Z" fill="#ffc1d8" />
        <Face cx={60} cy={58} s={0.95} />
        <Shine x={34} y={36} r={6} />
      </Svg>
    ),
  },
  {
    id: 'bow', name: 'โบว์',
    art: (
      <Svg>
        <path d="M56 66 L40 106 L50 100 L56 110 L64 68Z" fill="#d93a76" />
        <path d="M64 66 L80 106 L70 100 L64 110 L56 68Z" fill="#f2568f" />
        <path d="M58 58 C42 26 10 30 12 56 C14 82 44 76 58 64Z" fill="#ff7eaa" />
        <path d="M62 58 C78 26 110 30 108 56 C106 82 76 76 62 64Z" fill="#ff7eaa" />
        <path d="M54 58 C40 40 22 42 22 56" fill="none" stroke="#d93a76" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        <path d="M66 58 C80 40 98 42 98 56" fill="none" stroke="#d93a76" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        <rect x={49} y={49} width={22} height={22} rx={9} fill="#f2568f" />
        <Shine x={28} y={46} r={5} />
        <Shine x={56} y={55} r={3} />
      </Svg>
    ),
  },
  {
    id: 'star', name: 'ดาวยิ้ม',
    art: (
      <Svg>
        <path d="M60 8 L74 42 L110 45 L82 68 L91 104 L60 85 L29 104 L38 68 L10 45 L46 42Z" fill="#ffd36e" strokeLinejoin="round" stroke="#ffd36e" strokeWidth={6} />
        <Face cx={60} cy={60} s={0.8} />
        <Shine x={48} y={34} r={4} />
      </Svg>
    ),
  },
  {
    id: 'sparkle', name: 'วิบวับ',
    art: (
      <Svg>
        <path d="M52 10 C56 42 66 52 98 56 C66 60 56 70 52 102 C48 70 38 60 6 56 C38 52 48 42 52 10Z" fill="#fff1a8" />
        <path d="M94 70 C96 84 100 88 112 90 C100 92 96 96 94 110 C92 96 88 92 76 90 C88 88 92 84 94 70Z" fill="#ffc1d8" />
        <path d="M96 12 C97 20 100 22 108 24 C100 26 97 28 96 36 C95 28 92 26 84 24 C92 22 95 20 96 12Z" fill="#e8d7ff" />
      </Svg>
    ),
  },
  {
    id: 'cloud', name: 'เมฆ',
    art: (
      <Svg>
        <path d="M30 92 C12 92 8 70 24 64 C20 44 44 36 54 48 C60 28 92 30 92 54 C110 52 116 76 100 88 C96 92 92 92 88 92Z" fill="#ffffff" stroke="#ffd0e1" strokeWidth={4} />
        <Face cx={62} cy={70} s={0.85} />
      </Svg>
    ),
  },
  {
    id: 'bear', name: 'หมี',
    art: (
      <Svg>
        <circle cx={28} cy={30} r={17} fill="#d9a08b" />
        <circle cx={92} cy={30} r={17} fill="#d9a08b" />
        <circle cx={28} cy={30} r={9} fill="#f3d9c4" />
        <circle cx={92} cy={30} r={9} fill="#f3d9c4" />
        <ellipse cx={60} cy={66} rx={44} ry={40} fill="#d9a08b" />
        <ellipse cx={60} cy={80} rx={18} ry={13} fill="#f6e6d8" />
        <ellipse cx={60} cy={74} rx={6} ry={4.5} fill={INK} />
        <path d="M60 78 L60 84 M60 84 Q55 89 51 85 M60 84 Q65 89 69 85" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <ellipse cx={42} cy={60} rx={4} ry={5} fill={INK} />
        <ellipse cx={78} cy={60} rx={4} ry={5} fill={INK} />
        <circle cx={43.3} cy={58.2} r={1.4} fill="#fff" />
        <circle cx={79.3} cy={58.2} r={1.4} fill="#fff" />
        <ellipse cx={30} cy={74} rx={7} ry={4} fill={BLUSH} opacity={0.8} />
        <ellipse cx={90} cy={74} rx={7} ry={4} fill={BLUSH} opacity={0.8} />
        <path d="M84 22 C88 14 98 16 96 24 C104 22 106 32 98 34 C94 36 88 30 84 22Z" fill="#ff7eaa" />
      </Svg>
    ),
  },
  {
    id: 'bunny', name: 'กระต่าย',
    art: (
      <Svg>
        <ellipse cx={40} cy={30} rx={12} ry={28} fill="#ffffff" transform="rotate(-12 40 30)" />
        <ellipse cx={80} cy={30} rx={12} ry={28} fill="#ffffff" transform="rotate(12 80 30)" />
        <ellipse cx={40} cy={32} rx={6} ry={19} fill="#ffc1d8" transform="rotate(-12 40 32)" />
        <ellipse cx={80} cy={32} rx={6} ry={19} fill="#ffc1d8" transform="rotate(12 80 32)" />
        <ellipse cx={60} cy={76} rx={42} ry={36} fill="#ffffff" stroke="#ffe0ec" strokeWidth={3} />
        <ellipse cx={45} cy={72} rx={4} ry={5} fill={INK} />
        <ellipse cx={75} cy={72} rx={4} ry={5} fill={INK} />
        <circle cx={46.3} cy={70.2} r={1.4} fill="#fff" />
        <circle cx={76.3} cy={70.2} r={1.4} fill="#fff" />
        <path d="M56 82 L64 82 L60 87Z" fill="#ff7eaa" />
        <path d="M60 87 Q56 92 52 89 M60 87 Q64 92 68 89" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
        <ellipse cx={33} cy={84} rx={7} ry={4} fill={BLUSH} opacity={0.8} />
        <ellipse cx={87} cy={84} rx={7} ry={4} fill={BLUSH} opacity={0.8} />
      </Svg>
    ),
  },
  {
    id: 'kitty', name: 'แมวเหมียว',
    art: (
      <Svg>
        <path d="M22 54 L26 14 L52 36Z" fill="#ffffff" stroke="#ffe0ec" strokeWidth={3} strokeLinejoin="round" />
        <path d="M98 54 L94 14 L68 36Z" fill="#ffffff" stroke="#ffe0ec" strokeWidth={3} strokeLinejoin="round" />
        <path d="M29 42 L31 24 L43 35Z" fill="#ffc1d8" />
        <path d="M91 42 L89 24 L77 35Z" fill="#ffc1d8" />
        <ellipse cx={60} cy={68} rx={46} ry={38} fill="#ffffff" stroke="#ffe0ec" strokeWidth={3} />
        <ellipse cx={44} cy={66} rx={4} ry={5.4} fill={INK} />
        <ellipse cx={76} cy={66} rx={4} ry={5.4} fill={INK} />
        <circle cx={45.3} cy={64} r={1.4} fill="#fff" />
        <circle cx={77.3} cy={64} r={1.4} fill="#fff" />
        <ellipse cx={60} cy={76} rx={4} ry={3} fill="#ffd36e" />
        <path d="M14 70 L32 72 M14 80 L32 78 M106 70 L88 72 M106 80 L88 78" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M76 30 C78 24 86 24 86 30 C92 28 94 36 88 38 C84 40 78 36 76 30Z" fill="#f2568f" />
      </Svg>
    ),
  },
  {
    id: 'strawberry', name: 'สตรอว์เบอร์รี่',
    art: (
      <Svg>
        <path d="M60 110 C30 96 14 70 22 50 C28 36 46 34 60 40 C74 34 92 36 98 50 C106 70 90 96 60 110Z" fill="#ff5c8a" />
        {[[42, 58], [60, 54], [78, 58], [48, 76], [72, 76], [60, 92], [36, 72], [84, 72]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={2.2} ry={3.2} fill="#ffe08a" />
        ))}
        <path d="M60 42 C50 30 36 32 32 38 C42 38 48 42 52 46 C44 48 40 54 40 58 C50 52 56 50 60 48 C64 50 70 52 80 58 C80 54 76 48 68 46 C72 42 78 38 88 38 C84 32 70 30 60 42Z" fill="#7ed6a5" />
        <path d="M60 42 L62 26" stroke="#5bbf8a" strokeWidth={5} strokeLinecap="round" />
        <Shine x={38} y={58} r={5} />
      </Svg>
    ),
  },
  {
    id: 'cherry', name: 'เชอร์รี่',
    art: (
      <Svg>
        <path d="M40 74 C46 50 60 30 78 16 M84 70 C80 50 78 32 78 16" stroke="#5bbf8a" strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d="M78 16 C88 8 104 12 108 22 C96 26 86 24 78 16Z" fill="#7ed6a5" />
        <circle cx={38} cy={84} r={22} fill="#e8336d" />
        <circle cx={84} cy={80} r={22} fill="#f2568f" />
        <Shine x={30} y={76} r={6} />
        <Shine x={76} y={72} r={6} />
      </Svg>
    ),
  },
  {
    id: 'flower', name: 'ดอกไม้',
    art: (
      <Svg>
        {[0, 72, 144, 216, 288].map(r => (
          <ellipse key={r} cx={60} cy={34} rx={20} ry={26} fill="#ffb3cf" transform={`rotate(${r} 60 60)`} />
        ))}
        <circle cx={60} cy={60} r={20} fill="#ffd36e" />
        <Face cx={60} cy={58} s={0.6} />
      </Svg>
    ),
  },
  {
    id: 'rainbow', name: 'สายรุ้ง',
    art: (
      <Svg>
        {[['#ff9ec2', 44], ['#ffc8a8', 36], ['#fff1a8', 28], ['#bdf0d2', 20], ['#d7c6ff', 12]].map(([c, r]) => (
          <path key={c as string} d={`M${60 - (r as number)} 82 A${r} ${r} 0 0 1 ${60 + (r as number)} 82`} stroke={c as string} strokeWidth={8.5} fill="none" />
        ))}
        <path d="M6 88 C4 76 18 70 24 76 C28 66 44 68 44 80 C52 80 54 92 46 94 L12 94 C8 94 6 92 6 88Z" fill="#fff" stroke="#ffe0ec" strokeWidth={3} />
        <path d="M76 88 C74 76 88 70 94 76 C98 66 114 68 114 80 C122 80 122 92 116 94 L82 94 C78 94 76 92 76 88Z" fill="#fff" stroke="#ffe0ec" strokeWidth={3} />
      </Svg>
    ),
  },
  {
    id: 'moon', name: 'พระจันทร์',
    art: (
      <Svg>
        <path d="M74 10 C40 12 18 40 22 72 C26 100 58 116 86 106 C58 100 44 78 48 54 C52 32 64 18 74 10Z" fill="#ffe08a" />
        <path d="M34 62 Q38 66 42 62" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M38 78 Q42 82 46 78" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <ellipse cx={34} cy={72} rx={4} ry={2.4} fill={BLUSH} />
        <path d="M92 30 C93 36 95 38 101 39 C95 40 93 42 92 48 C91 42 89 40 83 39 C89 38 91 36 92 30Z" fill="#fff1a8" />
        <circle cx={100} cy={70} r={3} fill="#fff1a8" />
      </Svg>
    ),
  },
  {
    id: 'crown', name: 'มงกุฎ',
    art: (
      <Svg>
        <path d="M16 86 L10 34 L38 58 L60 22 L82 58 L110 34 L104 86Z" fill="#ffd36e" strokeLinejoin="round" stroke="#ffd36e" strokeWidth={5} />
        <rect x={14} y={84} width={92} height={16} rx={6} fill="#f6c552" />
        <circle cx={60} cy={92} r={6} fill="#ff7eaa" />
        <circle cx={34} cy={92} r={4.5} fill="#d7c6ff" />
        <circle cx={86} cy={92} r={4.5} fill="#d7c6ff" />
        <circle cx={10} cy={32} r={6} fill="#ff9ec2" />
        <circle cx={60} cy={20} r={7} fill="#ff7eaa" />
        <circle cx={110} cy={32} r={6} fill="#ff9ec2" />
        <Shine x={36} y={68} r={5} />
      </Svg>
    ),
  },
  {
    id: 'butterfly', name: 'ผีเสื้อ',
    art: (
      <Svg>
        <path d="M58 56 C40 20 6 22 12 50 C16 66 40 66 58 60Z" fill="#d7c6ff" />
        <path d="M62 56 C80 20 114 22 108 50 C104 66 80 66 62 60Z" fill="#ffb3cf" />
        <path d="M58 64 C40 66 22 80 30 96 C38 108 54 92 58 70Z" fill="#ffb3cf" />
        <path d="M62 64 C80 66 98 80 90 96 C82 108 66 92 62 70Z" fill="#d7c6ff" />
        <ellipse cx={60} cy={64} rx={5} ry={24} fill={INK} />
        <path d="M58 42 C54 30 48 26 44 26 M62 42 C66 30 72 26 76 26" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <circle cx={30} cy={46} r={6} fill="#fff" opacity={0.7} />
        <circle cx={90} cy={46} r={6} fill="#fff" opacity={0.7} />
      </Svg>
    ),
  },
  {
    id: 'bubble-cute', name: 'cute!',
    art: (
      <Svg>
        <path d="M14 26 C14 16 22 10 32 10 L88 10 C98 10 106 16 106 26 L106 66 C106 76 98 82 88 82 L48 82 L28 104 L32 82 C22 82 14 76 14 66Z" fill="#ff7eaa" />
        <text x={60} y={56} textAnchor="middle" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", fontWeight: 700 }} fontSize={30} fill="#fff">cute!</text>
        <path d="M94 20 C95 25 96 26 101 27 C96 28 95 29 94 34 C93 29 92 28 87 27 C92 26 93 25 94 20Z" fill="#fff1a8" />
      </Svg>
    ),
  },
  {
    id: 'label-xoxo', name: 'xoxo',
    art: (
      <Svg>
        <rect x={6} y={36} width={108} height={48} rx={24} fill="#fff" stroke="#ff7eaa" strokeWidth={4} strokeDasharray="7 6" />
        <text x={60} y={70} textAnchor="middle" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", fontWeight: 700 }} fontSize={32} fill="#f2568f">xoxo</text>
      </Svg>
    ),
  },
  {
    id: 'label-love', name: 'love u',
    art: (
      <Svg>
        <path d="M4 44 L22 40 L18 60 L22 80 L4 76 L12 60Z" fill="#d93a76" />
        <path d="M116 44 L98 40 L102 60 L98 80 L116 76 L108 60Z" fill="#d93a76" />
        <path d="M18 38 L102 38 L102 82 L18 82Z" fill="#ff7eaa" />
        <text x={60} y={68} textAnchor="middle" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", fontWeight: 700 }} fontSize={26} fill="#fff">love u</text>
      </Svg>
    ),
  },
  {
    id: 'label-bff', name: 'BFF',
    art: (
      <Svg>
        <path d="M60 10 L70 22 L86 18 L88 34 L104 40 L96 54 L104 68 L88 74 L86 90 L70 86 L60 98 L50 86 L34 90 L32 74 L16 68 L24 54 L16 40 L32 34 L34 18 L50 22Z" fill="#ffd36e" />
        <text x={60} y={63} textAnchor="middle" style={{ fontFamily: "var(--font-prompt), sans-serif", fontWeight: 800 }} fontSize={24} fill="#d93a76">BFF</text>
      </Svg>
    ),
  },
];

// ── สติกเกอร์สีสันปกติ (ไม่เน้นชมพู) ──
const classicStickers: StickerArt[] = [
  {
    id: 'dog', name: 'น้องหมา',
    art: (
      <Svg>
        <ellipse cx={22} cy={52} rx={14} ry={28} fill="#8d6e63" transform="rotate(18 22 52)" />
        <ellipse cx={98} cy={52} rx={14} ry={28} fill="#8d6e63" transform="rotate(-18 98 52)" />
        <ellipse cx={60} cy={62} rx={40} ry={38} fill="#f5deb3" />
        <ellipse cx={78} cy={48} rx={13} ry={11} fill="#d7b48a" />
        <ellipse cx={60} cy={80} rx={17} ry={12} fill="#fff8ec" />
        <ellipse cx={60} cy={74} rx={7} ry={5} fill="#3e2723" />
        <path d="M60 79 L60 84 M60 84 Q55 89 50 85 M60 84 Q65 89 70 85" stroke="#3e2723" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M56 88 Q60 100 64 88Z" fill="#ef5350" />
        <ellipse cx={44} cy={56} rx={4} ry={5} fill="#3e2723" />
        <ellipse cx={77} cy={52} rx={4} ry={5} fill="#3e2723" />
        <circle cx={45.3} cy={54.2} r={1.4} fill="#fff" />
        <circle cx={78.3} cy={50.2} r={1.4} fill="#fff" />
      </Svg>
    ),
  },
  {
    id: 'panda', name: 'แพนด้า',
    art: (
      <Svg>
        <circle cx={26} cy={30} r={15} fill="#263238" />
        <circle cx={94} cy={30} r={15} fill="#263238" />
        <ellipse cx={60} cy={64} rx={44} ry={40} fill="#ffffff" stroke="#eceff1" strokeWidth={3} />
        <ellipse cx={42} cy={60} rx={11} ry={14} fill="#263238" transform="rotate(-25 42 60)" />
        <ellipse cx={78} cy={60} rx={11} ry={14} fill="#263238" transform="rotate(25 78 60)" />
        <circle cx={43} cy={59} r={4} fill="#fff" />
        <circle cx={77} cy={59} r={4} fill="#fff" />
        <ellipse cx={60} cy={77} rx={6} ry={4} fill="#263238" />
        <path d="M60 81 Q55 87 51 83 M60 81 Q65 87 69 83" stroke="#263238" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <ellipse cx={30} cy={80} rx={6} ry={3.5} fill={CHEEK} opacity={0.6} />
        <ellipse cx={90} cy={80} rx={6} ry={3.5} fill={CHEEK} opacity={0.6} />
      </Svg>
    ),
  },
  {
    id: 'frog', name: 'กบน้อย',
    art: (
      <Svg>
        <circle cx={36} cy={36} r={18} fill="#7cc576" />
        <circle cx={84} cy={36} r={18} fill="#7cc576" />
        <ellipse cx={60} cy={70} rx={48} ry={36} fill="#7cc576" />
        <circle cx={36} cy={34} r={11} fill="#fff" />
        <circle cx={84} cy={34} r={11} fill="#fff" />
        <circle cx={38} cy={35} r={6} fill="#263238" />
        <circle cx={82} cy={35} r={6} fill="#263238" />
        <circle cx={40} cy={33} r={2} fill="#fff" />
        <circle cx={84} cy={33} r={2} fill="#fff" />
        <path d="M34 74 Q60 96 86 74" stroke="#2e7d32" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <ellipse cx={26} cy={74} rx={7} ry={4} fill={CHEEK} opacity={0.75} />
        <ellipse cx={94} cy={74} rx={7} ry={4} fill={CHEEK} opacity={0.75} />
      </Svg>
    ),
  },
  {
    id: 'chick', name: 'ลูกเจี๊ยบ',
    art: (
      <Svg>
        <path d="M54 18 C56 8 64 8 62 18 C68 10 74 14 66 22Z" fill="#ffca28" />
        <ellipse cx={60} cy={66} rx={44} ry={42} fill="#ffd54f" />
        <path d="M18 70 C6 64 8 50 20 56Z" fill="#ffca28" />
        <path d="M102 70 C114 64 112 50 100 56Z" fill="#ffca28" />
        <path d="M50 66 L70 66 L60 78Z" fill="#ff8f00" />
        <Face cx={60} cy={56} s={1} eye="#3e2723" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'penguin', name: 'เพนกวิน',
    art: (
      <Svg>
        <ellipse cx={60} cy={64} rx={42} ry={48} fill="#2f3e5c" />
        <path d="M18 64 C6 76 10 90 22 84Z" fill="#2f3e5c" />
        <path d="M102 64 C114 76 110 90 98 84Z" fill="#2f3e5c" />
        <ellipse cx={60} cy={72} rx={30} ry={36} fill="#fff" />
        <path d="M52 58 L68 58 L60 68Z" fill="#ffa726" />
        <ellipse cx={46} cy={50} rx={4} ry={5} fill="#263238" />
        <ellipse cx={74} cy={50} rx={4} ry={5} fill="#263238" />
        <circle cx={47.3} cy={48.2} r={1.4} fill="#fff" />
        <circle cx={75.3} cy={48.2} r={1.4} fill="#fff" />
        <ellipse cx={38} cy={62} rx={6} ry={3.5} fill={CHEEK} opacity={0.75} />
        <ellipse cx={82} cy={62} rx={6} ry={3.5} fill={CHEEK} opacity={0.75} />
        <ellipse cx={46} cy={110} rx={10} ry={5} fill="#ffa726" />
        <ellipse cx={74} cy={110} rx={10} ry={5} fill="#ffa726" />
      </Svg>
    ),
  },
  {
    id: 'orange-cat', name: 'แมวส้ม',
    art: (
      <Svg>
        <path d="M20 56 L24 14 L52 36Z" fill="#f4a259" strokeLinejoin="round" />
        <path d="M100 56 L96 14 L68 36Z" fill="#f4a259" strokeLinejoin="round" />
        <path d="M28 44 L30 26 L42 36Z" fill="#ffd8b0" />
        <path d="M92 44 L90 26 L78 36Z" fill="#ffd8b0" />
        <ellipse cx={60} cy={68} rx={46} ry={38} fill="#f4a259" />
        <path d="M60 32 L60 44 M50 34 L52 44 M70 34 L68 44" stroke="#d9773a" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={60} cy={82} rx={18} ry={12} fill="#fff3e3" />
        <ellipse cx={44} cy={64} rx={4} ry={5.4} fill="#3e2723" />
        <ellipse cx={76} cy={64} rx={4} ry={5.4} fill="#3e2723" />
        <circle cx={45.3} cy={62} r={1.4} fill="#fff" />
        <circle cx={77.3} cy={62} r={1.4} fill="#fff" />
        <path d="M56 76 L64 76 L60 80Z" fill="#e57373" />
        <path d="M60 80 Q56 85 52 82 M60 80 Q64 85 68 82" stroke="#3e2723" strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M12 72 L30 74 M12 82 L30 80 M108 72 L90 74 M108 82 L90 80" stroke="#3e2723" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'sun', name: 'พระอาทิตย์',
    art: (
      <Svg>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M60 4 L66 20 L54 20Z" fill="#ffb300" transform={`rotate(${i * 30} 60 60)`} />
        ))}
        <circle cx={60} cy={60} r={36} fill="#ffd54f" />
        <Face cx={60} cy={60} s={1.05} eye="#5d4037" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'boba', name: 'ชาไข่มุก',
    art: (
      <Svg>
        <path d="M66 4 L58 40" stroke="#4fc3f7" strokeWidth={7} strokeLinecap="round" />
        <path d="M24 38 L96 38 L88 110 C88 114 84 116 80 116 L40 116 C36 116 32 114 32 110Z" fill="#d7b899" />
        <path d="M20 32 C20 26 26 24 32 24 L88 24 C94 24 100 26 100 32 L100 40 L20 40Z" fill="#ffffff" stroke="#e0d4c4" strokeWidth={2} />
        {[[44, 100], [56, 104], [68, 100], [80, 104], [50, 92], [74, 92], [62, 94]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill="#3e2723" />
        ))}
        <Face cx={60} cy={62} s={0.9} eye="#3e2723" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'coffee', name: 'กาแฟ',
    art: (
      <Svg>
        <path d="M44 22 C38 14 50 10 44 2 M60 22 C54 14 66 10 60 2 M76 22 C70 14 82 10 76 2" stroke="#bcaaa4" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M92 50 C112 50 112 84 90 82" stroke="#fafafa" strokeWidth={9} fill="none" />
        <path d="M92 50 C112 50 112 84 90 82" stroke="#e0e0e0" strokeWidth={2} fill="none" />
        <path d="M20 34 L96 34 L90 102 C89 110 84 114 76 114 L40 114 C32 114 27 110 26 102Z" fill="#fafafa" stroke="#e0e0e0" strokeWidth={2} />
        <ellipse cx={58} cy={36} rx={37} ry={7} fill="#6d4c41" />
        <Face cx={58} cy={72} s={1} eye="#4e342e" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'ice-cream', name: 'ไอศกรีม',
    art: (
      <Svg>
        <path d="M34 62 L86 62 L60 116Z" fill="#e0a96d" />
        <path d="M42 70 L74 102 M56 64 L80 88 M70 64 L50 106 M84 66 L62 110" stroke="#c48a4c" strokeWidth={2.5} />
        <circle cx={46} cy={52} r={20} fill="#a8e6cf" />
        <circle cx={74} cy={52} r={20} fill="#8d5b4c" />
        <circle cx={60} cy={34} r={20} fill="#fff3d6" />
        <circle cx={62} cy={12} r={7} fill="#e53935" />
        <path d="M62 6 C64 0 70 0 72 2" stroke="#43a047" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Face cx={60} cy={36} s={0.7} eye="#4e342e" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'donut', name: 'โดนัท',
    art: (
      <Svg>
        <circle cx={60} cy={60} r={50} fill="#e8b37a" />
        <path d="M14 56 C14 30 34 14 60 14 C86 14 106 30 106 56 C100 62 96 54 90 62 C84 70 78 60 70 66 C62 72 56 62 48 68 C40 74 34 62 26 66 C20 68 16 62 14 56Z" fill="#6d4c41" />
        <circle cx={60} cy={56} r={14} fill="#fff" stroke="#d9a066" strokeWidth={3} />
        {[[34, 36, '#ffeb3b', 20], [82, 34, '#4fc3f7', -30], [44, 22, '#ef5350', 60], [92, 50, '#81c784', 10], [26, 52, '#fff', -40], [74, 22, '#ffeb3b', -10]].map(([x, y, c, r], i) => (
          <rect key={i} x={(x as number) - 5} y={(y as number) - 1.6} width={10} height={3.2} rx={1.6} fill={c as string} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </Svg>
    ),
  },
  {
    id: 'avocado', name: 'อะโวคาโด',
    art: (
      <Svg>
        <path d="M60 6 C80 6 90 36 98 62 C106 92 86 114 60 114 C34 114 14 92 22 62 C30 36 40 6 60 6Z" fill="#4c7a34" />
        <path d="M60 16 C76 16 84 40 90 64 C96 88 80 104 60 104 C40 104 24 88 30 64 C36 40 44 16 60 16Z" fill="#c5e17a" />
        <circle cx={60} cy={74} r={20} fill="#9c6b3f" />
        <Face cx={60} cy={72} s={0.75} eye="#3e2723" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'cactus', name: 'กระบองเพชร',
    art: (
      <Svg>
        <path d="M30 50 C20 50 20 30 30 30 C34 30 36 34 36 40 L36 56" stroke="#6bbf59" strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M90 42 C100 42 100 24 90 24 C86 24 84 28 84 34 L84 52" stroke="#6bbf59" strokeWidth={14} fill="none" strokeLinecap="round" />
        <rect x={38} y={14} width={44} height={70} rx={22} fill="#6bbf59" />
        <circle cx={60} cy={12} r={7} fill="#ff8a65" />
        <path d="M28 82 L92 82 L84 116 L36 116Z" fill="#d9774b" />
        <rect x={24} y={78} width={72} height={12} rx={4} fill="#e8915f" />
        <Face cx={60} cy={50} s={0.85} eye="#1b5e20" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'clover', name: 'ใบโคลเวอร์',
    art: (
      <Svg>
        {[0, 90, 180, 270].map(r => (
          <path key={r} d="M60 58 C40 52 30 30 44 22 C52 18 58 24 60 32 C62 24 68 18 76 22 C90 30 80 52 60 58Z" fill="#5cb85c" transform={`rotate(${r} 60 60)`} />
        ))}
        <path d="M60 60 C66 80 76 96 92 108" stroke="#3d8b3d" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Shine x={44} y={30} r={4} />
      </Svg>
    ),
  },
  {
    id: 'balloon', name: 'ลูกโป่ง',
    art: (
      <Svg>
        <path d="M60 86 C58 96 66 102 60 116" stroke="#78909c" strokeWidth={2.5} fill="none" />
        <path d="M60 4 C86 4 100 24 98 46 C96 70 74 86 60 86 C46 86 24 70 22 46 C20 24 34 4 60 4Z" fill="#64b5f6" />
        <path d="M54 86 L66 86 L60 94Z" fill="#42a5f5" />
        <Shine x={42} y={28} r={9} />
      </Svg>
    ),
  },
  {
    id: 'camera', name: 'กล้อง',
    art: (
      <Svg>
        <rect x={14} y={30} width={92} height={70} rx={16} fill="#f5e6c8" />
        <rect x={14} y={52} width={92} height={26} fill="#8d6e63" />
        <rect x={26} y={20} width={24} height={14} rx={5} fill="#5d4037" />
        <circle cx={60} cy={66} r={24} fill="#5d4037" />
        <circle cx={60} cy={66} r={16} fill="#263238" />
        <circle cx={60} cy={66} r={8} fill="#455a64" />
        <circle cx={54} cy={60} r={4} fill="#fff" opacity={0.8} />
        <circle cx={92} cy={42} r={5} fill="#ffca28" />
      </Svg>
    ),
  },
  {
    id: 'music', name: 'โน้ตเพลง',
    art: (
      <Svg>
        <path d="M44 86 L44 26 L100 14 L100 74" stroke="#5c6bc0" strokeWidth={8} fill="none" strokeLinejoin="round" />
        <path d="M44 26 L100 14 L100 30 L44 42Z" fill="#5c6bc0" />
        <ellipse cx={32} cy={88} rx={16} ry={12} fill="#5c6bc0" transform="rotate(-20 32 88)" />
        <ellipse cx={88} cy={76} rx={16} ry={12} fill="#5c6bc0" transform="rotate(-20 88 76)" />
        <Shine x={26} y={84} r={4} />
        <Shine x={82} y={72} r={4} />
      </Svg>
    ),
  },
  {
    id: 'bolt', name: 'สายฟ้า',
    art: (
      <Svg>
        <path d="M70 4 L24 68 L54 68 L42 116 L96 46 L64 46 L80 4Z" fill="#ffca28" strokeLinejoin="round" stroke="#ffca28" strokeWidth={4} />
        <path d="M66 14 L40 56" stroke="#fff59d" strokeWidth={4} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'planet', name: 'ดาวเคราะห์',
    art: (
      <Svg>
        <circle cx={60} cy={60} r={34} fill="#7e8ce0" />
        <path d="M36 44 C50 40 70 50 84 46" stroke="#9fa8ea" strokeWidth={6} fill="none" strokeLinecap="round" />
        <ellipse cx={60} cy={62} rx={56} ry={14} fill="none" stroke="#ffd54f" strokeWidth={7} transform="rotate(-18 60 62)" />
        <Face cx={60} cy={62} s={0.8} eye="#283593" blush={CHEEK} />
        <circle cx={104} cy={22} r={4} fill="#ffd54f" />
        <circle cx={14} cy={100} r={3} fill="#ffd54f" />
      </Svg>
    ),
  },
  {
    id: 'whale', name: 'วาฬ',
    art: (
      <Svg>
        <path d="M52 30 C48 20 40 18 36 22 M52 30 C54 20 62 16 66 20 M52 30 L52 40" stroke="#4fc3f7" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M10 70 C10 46 34 40 58 40 C86 40 100 56 100 70 C108 62 118 62 116 70 C114 78 108 82 100 80 C96 98 76 104 56 104 C30 104 10 92 10 70Z" fill="#5aa9e6" />
        <path d="M16 80 C26 98 74 102 94 84 C80 94 40 96 16 80Z" fill="#e3f2fd" />
        <Face cx={42} cy={66} s={0.85} eye="#0d47a1" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'dino', name: 'ไดโนเสาร์',
    art: (
      <Svg>
        {[[44, 26], [58, 22], [72, 26], [84, 36]].map(([x, y], i) => (
          <path key={i} d={`M${x - 7} ${y + 8} L${x} ${y - 6} L${x + 7} ${y + 8}Z`} fill="#ffb74d" />
        ))}
        <path d="M18 72 C18 40 40 28 64 30 C92 32 104 52 102 74 C112 76 116 90 104 94 L100 94 C96 106 84 112 62 112 C34 112 18 98 18 72Z" fill="#8bc34a" />
        <ellipse cx={58} cy={88} rx={26} ry={16} fill="#dcedc8" />
        <Face cx={56} cy={60} s={1} eye="#33691e" blush={CHEEK} />
      </Svg>
    ),
  },
  {
    id: 'ghost', name: 'ผีน้อย',
    art: (
      <Svg>
        <path d="M22 108 L22 56 C22 30 40 12 60 12 C80 12 98 30 98 56 L98 108 L86 98 L74 110 L60 98 L46 110 L34 98Z" fill="#ffffff" stroke="#cfd8dc" strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={46} cy={54} rx={5} ry={7} fill="#37474f" />
        <ellipse cx={74} cy={54} rx={5} ry={7} fill="#37474f" />
        <ellipse cx={60} cy={72} rx={6} ry={8} fill="#37474f" />
        <ellipse cx={34} cy={66} rx={6} ry={3.5} fill="#b3e5fc" />
        <ellipse cx={86} cy={66} rx={6} ry={3.5} fill="#b3e5fc" />
      </Svg>
    ),
  },
  {
    id: 'label-wow', name: 'WOW!',
    art: (
      <Svg>
        <path d="M60 4 L70 24 L92 14 L88 38 L112 42 L94 58 L112 76 L88 80 L92 104 L70 94 L60 116 L50 94 L28 104 L32 80 L8 76 L26 58 L8 42 L32 38 L28 14 L50 24Z" fill="#29b6f6" />
        <text x={60} y={68} textAnchor="middle" style={FONT_SANS} fontSize={26} fill="#fff">WOW!</text>
      </Svg>
    ),
  },
  {
    id: 'label-yay', name: 'YAY',
    art: (
      <Svg>
        <path d="M14 28 C14 18 22 12 32 12 L88 12 C98 12 106 18 106 28 L106 70 C106 80 98 86 88 86 L76 86 L92 108 L60 86 L32 86 C22 86 14 80 14 70Z" fill="#66bb6a" />
        <text x={60} y={60} textAnchor="middle" style={FONT_SANS} fontSize={30} fill="#fff">YAY</text>
      </Svg>
    ),
  },
  {
    id: 'label-hbd', name: 'HBD',
    art: (
      <Svg>
        <path d="M4 44 L22 40 L18 60 L22 80 L4 76 L12 60Z" fill="#ef6c00" />
        <path d="M116 44 L98 40 L102 60 L98 80 L116 76 L108 60Z" fill="#ef6c00" />
        <path d="M18 38 L102 38 L102 82 L18 82Z" fill="#ffa726" />
        <text x={60} y={69} textAnchor="middle" style={FONT_DISPLAY} fontSize={28} fill="#fff">HBD!</text>
      </Svg>
    ),
  },
  {
    id: 'label-omg', name: 'OMG',
    art: (
      <Svg>
        <ellipse cx={60} cy={56} rx={52} ry={40} fill="#ffee58" />
        <path d="M30 86 L22 110 L50 92Z" fill="#ffee58" />
        <text x={60} y={68} textAnchor="middle" style={FONT_SANS} fontSize={32} fill="#5d4037">OMG</text>
      </Svg>
    ),
  },
];

const LABEL_IDS = new Set(['bubble-cute', 'label-xoxo', 'label-love', 'label-bff']);

export const stickerArts: StickerArt[] = [
  ...classicStickers.map(s => ({ ...s, group: (s.id.startsWith('label-') ? 'label' : 'classic') as StickerGroup })),
  ...sweetStickers.map(s => ({ ...s, group: (LABEL_IDS.has(s.id) ? 'label' : 'sweet') as StickerGroup })),
];

// ขอบขาวไดคัท + เงาชมพู — ใช้เป็น inline style เพื่อให้ html-to-image จับภาพติดไปด้วย
export const STICKER_CUT_FILTER =
  'drop-shadow(1.6px 0 0 #fff) drop-shadow(-1.6px 0 0 #fff) drop-shadow(0 1.6px 0 #fff) drop-shadow(0 -1.6px 0 #fff) drop-shadow(0 3px 4px rgba(176,39,92,0.35))';

export const getStickerArt = (id: string) => stickerArts.find(s => s.id === id)?.art ?? null;
