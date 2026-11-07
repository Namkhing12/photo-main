'use client';

import React, { useState, useRef } from 'react';
import { Download, Share2, RefreshCw, Ban, Type, Lock, Image as ImageIcon, Star, Sparkles, Palette, Smile, ArrowLeft, Pipette, Sticker, X, RotateCw, Copy, Trash2 } from 'lucide-react';
import { getFilterStyle, filterGroups, type FilterGroup } from '../lib/constants';
import { useFavoriteFilters } from '../lib/useFavoriteFilters';
import { stickerArts, getStickerArt, STICKER_CUT_FILTER, stickerGroups, type StickerGroup } from '../lib/stickers';
import { detectPlatform, captureNode, canShareFile, shareFile, downloadUrl, makeFileName } from '../lib/saveImage';
import Confetti from '../src/Confetti';
import emojisData from '../lib/emojis.json';

// Type definition for emojilib data
const emojis: Record<string, string[]> = emojisData;

const frameColors = [
  // ── signature pinks ──
  { id: 'ballet', hex: '#ffe4ec', isPremium: false },
  { id: 'strawberry-milk', hex: 'linear-gradient(160deg, #fff1f5 0%, #ffd0e1 100%)', isPremium: false },
  { id: 'rose-gold', hex: 'linear-gradient(135deg, #f8d7d0 0%, #f3c1b6 40%, #e8a998 70%, #f9dcd3 100%)', isPremium: false },
  { id: 'hot-pink', hex: '#ff7eaa', isPremium: false },
  { id: 'y2k-chrome', hex: 'linear-gradient(135deg, #ffd6e8 0%, #ffffff 30%, #e8d7ff 60%, #ffc1d8 100%)', isPremium: false },
  { id: 'champagne', hex: '#f6e6d8', isPremium: false },
  { id: 'cherry', hex: '#b0275c', isPremium: false },
  { id: 'white', hex: '#ffffff', isPremium: false },
  { id: 'black', hex: '#000000', isPremium: false },
  { id: 'pink', hex: '#fbcfe8', isPremium: false },
  { id: 'blue', hex: '#bfdbfe', isPremium: false },
  { id: 'cream', hex: '#fef3c7', isPremium: false },
  { id: 'Chinese New Year', hex: '#ff8c8aff', isPremium: false },
  { id: 'Christmas', hex: '#23652bff', isPremium: false },
  { id: 'emerald', hex: '#a7f3d0', isPremium: false },
  { id: 'teal', hex: '#99f6e4', isPremium: false },
  { id: 'cyan', hex: '#a5f3fc', isPremium: false },
  { id: 'indigo', hex: '#c7d2fe', isPremium: false },
  { id: 'violet', hex: '#ddd6fe', isPremium: false },
  { id: 'purple', hex: '#e9d5ff', isPremium: false },
  { id: 'fuchsia', hex: '#f5d0fe', isPremium: false },
  { id: 'rose', hex: '#fecdd3', isPremium: false },
  { id: 'gradient-1', hex: 'linear-gradient(135deg, #fbcfe8 0%, #e9d5ff 100%)', isPremium: false },
  { id: 'gradient-2', hex: 'linear-gradient(135deg, #fef08a 0%, #fed7aa 100%)', isPremium: false },
  { id: 'gradient-3', hex: 'linear-gradient(135deg, #bfdbfe 0%, #a5f3fc 100%)', isPremium: false },
  { id: 'gradient-sunset', hex: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 50%, #fbcfe8 100%)', isPremium: false },
  { id: 'gradient-ocean', hex: 'linear-gradient(135deg, #bbf7d0 0%, #93c5fd 100%)', isPremium: false },
  { id: 'gradient-nature', hex: 'linear-gradient(135deg, #d9f99d 0%, #86efac 100%)', isPremium: false },
  { id: 'gradient-dusk', hex: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)', isPremium: false },
  { id: 'gradient-sweet', hex: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #fda4af 100%)', isPremium: false },
  { id: 'rainbow', hex: 'linear-gradient(90deg, #fecaca, #fef08a, #bfdbfe)', isPremium: false },
  // ── seasonal ──
  { id: 'loy-krathong', hex: 'linear-gradient(180deg, #1b2559 0%, #34296b 55%, #5d3f86 100%)', isPremium: false },
  { id: 'xmas-red', hex: 'linear-gradient(165deg, #d7263d 0%, #a3122a 100%)', isPremium: false },
  { id: 'xmas-snow', hex: 'linear-gradient(180deg, #f3fbff 0%, #dceefa 100%)', isPremium: false },
  { id: 'new-year', hex: 'linear-gradient(170deg, #241038 0%, #4a1f5e 100%)', isPremium: false },
  { id: 'valentine', hex: 'linear-gradient(160deg, #ff5f7e 0%, #ff9eb5 100%)', isPremium: false },
  { id: 'cny', hex: 'linear-gradient(165deg, #c8102e 0%, #8b0000 100%)', isPremium: false },
  { id: 'songkran', hex: 'linear-gradient(180deg, #4fc3f7 0%, #b3e5fc 100%)', isPremium: false },
  { id: 'summer', hex: 'linear-gradient(180deg, #ffe29a 0%, #7fd8ff 100%)', isPremium: false },
  { id: 'sakura', hex: 'linear-gradient(180deg, #ffe4ec 0%, #fffafc 100%)', isPremium: false },
  { id: 'mothers-day', hex: 'linear-gradient(180deg, #cfe8ff 0%, #f5fbff 100%)', isPremium: false },
  { id: 'fathers-day', hex: 'linear-gradient(180deg, #fff6c2 0%, #ffd84d 100%)', isPremium: false },
  { id: 'halloween', hex: 'linear-gradient(170deg, #2b1b3d 0%, #5b2a5e 60%, #e8692c 140%)', isPremium: false },
  { id: 'graduation', hex: 'linear-gradient(170deg, #1e3a5f 0%, #2c5282 100%)', isPremium: false },
  { id: 'birthday', hex: 'linear-gradient(170deg, #fff3b0 0%, #ffe0ec 100%)', isPremium: false },
];

// ลวดลายพื้นหลังของแถบรูป (ใช้ radial-gradient เพื่อให้ html-to-image จับภาพได้)
const patterns = [
  { id: 'none', name: 'ไม่มี', icon: '⨯' },
  { id: 'snow', name: 'หิมะ', icon: '❄️' },
  { id: 'gold-stars', name: 'ดาวทอง', icon: '✨' },
  { id: 'hearts', name: 'จุดหัวใจ', icon: '💗' },
  { id: 'lanterns', name: 'แสงโคม', icon: '🏮' },
  { id: 'confetti', name: 'คอนเฟตติ', icon: '🎊' },
  { id: 'bubbles', name: 'ฟองน้ำ', icon: '🫧' },
  { id: 'petals', name: 'กลีบดอก', icon: '🌸' },
] as const;
type PatternId = typeof patterns[number]['id'];

const renderPattern = (id: PatternId) => {
  const bg: Record<Exclude<PatternId, 'none'>, React.CSSProperties> = {
    snow: {
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.95) 1.6px, transparent 2.2px), radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1.6px)',
      backgroundSize: '34px 34px, 21px 21px',
      backgroundPosition: '0 0, 11px 14px',
    },
    'gold-stars': {
      backgroundImage: 'radial-gradient(circle, rgba(255,214,120,0.95) 1.4px, transparent 2px), radial-gradient(circle, rgba(255,236,180,0.6) 0.8px, transparent 1.4px)',
      backgroundSize: '28px 28px, 17px 17px',
      backgroundPosition: '4px 6px, 13px 2px',
    },
    hearts: {
      backgroundImage: 'radial-gradient(circle, rgba(255,126,170,0.45) 2.5px, transparent 3.2px)',
      backgroundSize: '22px 22px',
    },
    confetti: {
      backgroundImage: 'radial-gradient(circle, rgba(255,99,132,0.55) 2px, transparent 2.6px), radial-gradient(circle, rgba(54,162,235,0.5) 2px, transparent 2.6px), radial-gradient(circle, rgba(255,205,86,0.6) 2px, transparent 2.6px), radial-gradient(circle, rgba(75,192,120,0.5) 1.6px, transparent 2.2px)',
      backgroundSize: '38px 38px, 46px 46px, 30px 30px, 52px 52px',
      backgroundPosition: '0 0, 17px 23px, 9px 31px, 29px 7px',
    },
    bubbles: {
      backgroundImage: 'radial-gradient(circle, transparent 4px, rgba(255,255,255,0.75) 4.6px, rgba(255,255,255,0.75) 5.4px, transparent 6px), radial-gradient(circle, transparent 2px, rgba(255,255,255,0.6) 2.5px, rgba(255,255,255,0.6) 3.2px, transparent 3.7px)',
      backgroundSize: '44px 44px, 27px 27px',
      backgroundPosition: '0 0, 15px 19px',
    },
    petals: {
      backgroundImage: 'radial-gradient(ellipse 4px 2.6px, rgba(255,150,185,0.7) 90%, transparent 100%), radial-gradient(ellipse 2.6px 4px, rgba(255,190,210,0.65) 90%, transparent 100%)',
      backgroundSize: '36px 36px, 29px 29px',
      backgroundPosition: '0 0, 14px 18px',
    },
    lanterns: {
      backgroundImage: 'radial-gradient(circle at 15% 12%, rgba(255,190,90,0.55) 0, transparent 22%), radial-gradient(circle at 85% 30%, rgba(255,160,80,0.4) 0, transparent 18%), radial-gradient(circle at 30% 88%, rgba(255,210,120,0.45) 0, transparent 20%), radial-gradient(circle at 78% 80%, rgba(255,180,100,0.35) 0, transparent 16%)',
    },
  };
  if (id === 'none') return null;
  return <div className="pointer-events-none absolute inset-0 z-0" style={bg[id]} aria-hidden />;
};

// ธีมเทศกาล: แตะทีเดียวได้ทั้งสี กรอบ ลวดลาย และข้อความ
const seasonalThemes = [
  {
    id: 'loy-krathong', name: 'ลอยกระทง', icon: '🪷', months: [10], // เดือนที่โชว์ป้าย "ช่วงนี้" (0 = ม.ค., 10 = พ.ย.)
    colorId: 'loy-krathong', overlay: 'loy-krathong', pattern: 'gold-stars' as PatternId,
    title: 'Loy Krathong 2026', subtitle: '✦ ขอให้สมหวังทุกคำอธิษฐาน ✦',
    preview: 'linear-gradient(180deg, #1b2559, #5d3f86)',
  },
  {
    id: 'christmas', name: 'คริสต์มาส', icon: '🎄', months: [11],
    colorId: 'xmas-red', overlay: 'Christmas', pattern: 'snow' as PatternId,
    title: 'Merry Christmas', subtitle: '✦ 25 · 12 · 2026 ✦',
    preview: 'linear-gradient(165deg, #d7263d, #a3122a)',
  },
  {
    id: 'snowy', name: 'หิมะขาว', icon: '⛄', months: [11, 0],
    colorId: 'xmas-snow', overlay: 'snowy', pattern: 'snow' as PatternId,
    title: 'let it snow ❄', subtitle: '✦ winter · 2026 ✦',
    preview: 'linear-gradient(180deg, #f3fbff, #b9dcf2)',
  },
  {
    id: 'new-year', name: 'ปีใหม่ 2027', icon: '🎆', months: [11, 0],
    colorId: 'new-year', overlay: 'new-year', pattern: 'gold-stars' as PatternId,
    title: 'Happy New Year', subtitle: '✦ hello 2027 ✦',
    preview: 'linear-gradient(170deg, #241038, #4a1f5e)',
  },
  {
    id: 'cny', name: 'ตรุษจีน', icon: '🧧', months: [0, 1],
    colorId: 'cny', overlay: 'Chinese New Year', pattern: 'gold-stars' as PatternId,
    title: 'ซินเจียยู่อี่ ซินนี้ฮวดไช้', subtitle: '✦ Happy Lunar New Year 2027 ✦',
    preview: 'linear-gradient(165deg, #c8102e, #8b0000)',
  },
  {
    id: 'valentine', name: 'วาเลนไทน์', icon: '💘', months: [1],
    colorId: 'valentine', overlay: 'love', pattern: 'hearts' as PatternId,
    title: 'Be My Valentine', subtitle: '✦ 14 · 02 · 2027 ✦',
    preview: 'linear-gradient(160deg, #ff5f7e, #ff9eb5)',
  },
  {
    id: 'graduation', name: 'รับปริญญา', icon: '🎓', months: [0, 1, 2],
    colorId: 'graduation', overlay: 'graduation', pattern: 'gold-stars' as PatternId,
    title: 'Congrats, Grad!', subtitle: '✦ class of 2026 ✦',
    preview: 'linear-gradient(170deg, #1e3a5f, #2c5282)',
  },
  {
    id: 'sakura', name: 'ซากุระ', icon: '🌸', months: [2, 3],
    colorId: 'sakura', overlay: 'sakura', pattern: 'petals' as PatternId,
    title: 'sakura season', subtitle: '✦ spring · 2027 ✦',
    preview: 'linear-gradient(180deg, #ffd1df, #fffafc)',
  },
  {
    id: 'songkran', name: 'สงกรานต์', icon: '💦', months: [3],
    colorId: 'songkran', overlay: 'songkran', pattern: 'bubbles' as PatternId,
    title: 'Happy Songkran', subtitle: '✦ สาดความสุข 2027 ✦',
    preview: 'linear-gradient(180deg, #4fc3f7, #b3e5fc)',
  },
  {
    id: 'summer', name: 'ซัมเมอร์', icon: '🏖️', months: [2, 3, 4],
    colorId: 'summer', overlay: 'summer', pattern: 'bubbles' as PatternId,
    title: 'summer vibes', subtitle: '✦ sun · sea · us ✦',
    preview: 'linear-gradient(180deg, #ffe29a, #7fd8ff)',
  },
  {
    id: 'mothers-day', name: 'วันแม่', icon: '💙', months: [7],
    colorId: 'mothers-day', overlay: 'mothers-day', pattern: 'bubbles' as PatternId,
    title: 'รักแม่ที่สุดในโลก', subtitle: '✦ 12 สิงหาคม ✦',
    preview: 'linear-gradient(180deg, #9ccfff, #f5fbff)',
  },
  {
    id: 'halloween', name: 'ฮาโลวีน', icon: '🎃', months: [9],
    colorId: 'halloween', overlay: 'halloween', pattern: 'gold-stars' as PatternId,
    title: 'Trick or Treat', subtitle: '✦ spooky season ✦',
    preview: 'linear-gradient(170deg, #2b1b3d, #e8692c)',
  },
  {
    id: 'fathers-day', name: 'วันพ่อ', icon: '💛', months: [11],
    colorId: 'fathers-day', overlay: 'fathers-day', pattern: 'gold-stars' as PatternId,
    title: 'รักพ่อที่สุด', subtitle: '✦ 5 ธันวาคม ✦',
    preview: 'linear-gradient(180deg, #fff6c2, #ffd84d)',
  },
  {
    id: 'birthday', name: 'วันเกิด', icon: '🎂', months: [],
    colorId: 'birthday', overlay: 'birthday', pattern: 'confetti' as PatternId,
    title: 'Happy Birthday!', subtitle: '✦ make a wish ✦',
    preview: 'linear-gradient(170deg, #fff3b0, #ffc8dc)',
  },
];

const commonEmojisFallback = [
  { category: 'Smileys & Emotion', icons: ['✨', '💖', '🌟', '🌈', '🎀', '🧸', '🌸'] },
  { category: 'Animals & Nature', icons: ['🐱', '🐶', '🧸', '🐰', '🐼', '🐨', '🐣', '🐥'] },
];

const overlayFrames = [
  { id: 'none', src: '', name: 'ไม่ใส่กรอบ', type: 'emoji', isPremium: false },
  { id: 'cute', src: '🧸', name: '🧸 Cute', type: 'emoji', isPremium: false },
  { id: 'sparkle', src: '✨', name: '✨ Sparkle', type: 'emoji', isPremium: false },
  { id: 'nature', src: '🌿', name: '🌿 Nature', type: 'emoji', isPremium: false },
  { id: 'cool', src: '😎', name: '😎 Cool', type: 'emoji', isPremium: false },
  { id: 'Chinese New Year', src: '🧧', name: '🧧 CNY', type: 'emoji', isPremium: false },
  { id: 'Christmas', src: '🎄', name: '🎄 Xmas', type: 'emoji', isPremium: false },
  { id: 'loy-krathong', src: '🪷', name: '🪷 ลอยกระทง', type: 'emoji', isPremium: false },
  { id: 'snowy', src: '⛄', name: '⛄ Snowy', type: 'emoji', isPremium: false },
  { id: 'new-year', src: '🎆', name: '🎆 ปีใหม่', type: 'emoji', isPremium: false },
  { id: 'birthday', src: '🎂', name: '🎂 Birthday', type: 'emoji', isPremium: false },
  { id: 'love', src: '❤️', name: '❤️ Love', type: 'emoji', isPremium: false },
  { id: 'space', src: '🚀', name: '🚀 Galaxy', type: 'emoji', isPremium: false },
  { id: 'cat', src: '🐱', name: '🐱 Meow', type: 'emoji', isPremium: false },
  { id: 'songkran', src: '💦', name: '💦 สงกรานต์', type: 'emoji', isPremium: false },
  { id: 'halloween', src: '🎃', name: '🎃 Halloween', type: 'emoji', isPremium: false },
  { id: 'graduation', src: '🎓', name: '🎓 รับปริญญา', type: 'emoji', isPremium: false },
  { id: 'summer', src: '🏖️', name: '🏖️ Summer', type: 'emoji', isPremium: false },
  { id: 'sakura', src: '🌸', name: '🌸 Sakura', type: 'emoji', isPremium: false },
  { id: 'mothers-day', src: '💙', name: '💙 วันแม่', type: 'emoji', isPremium: false },
  { id: 'fathers-day', src: '💛', name: '💛 วันพ่อ', type: 'emoji', isPremium: false },
  { id: 'custom', src: '✨', name: '✨ เลือกเอง', type: 'emoji', isPremium: false },
  { id: 'unicorn', src: '🦄', name: '🦄 Uni', type: 'emoji', isPremium: false }
];

const renderOverlayFrame = (
  id: string | null,
  customEmojis?: { topLeft: string, topRight: string, bottomLeft: string, bottomRight: string }
) => {
  if (!id || id === 'none') return null;
  const frame = overlayFrames.find(f => f.id === id);
  if (!frame) return null;

  if (frame.type === 'image') {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none select-none">
        <img src={frame.src} alt={frame.name} className="w-full h-full object-fill opacity-90" style={{ mixBlendMode: 'multiply' }} />
      </div>
    );
  }

  const styleBase = "absolute text-2xl sm:text-3xl md:text-4xl drop-shadow-md select-none z-20 pointer-events-none";

  const renderEmojis = (tl: string, tr: string, bl: string, br: string) => (
    <>
      <div className={`${styleBase} top-1 left-1 sm:top-2 sm:left-2`}>{tl}</div>
      <div className={`${styleBase} top-1 right-1 sm:top-2 sm:right-2`}>{tr}</div>
      <div className={`${styleBase} bottom-1 left-1 sm:bottom-2 sm:left-2`}>{bl}</div>
      <div className={`${styleBase} bottom-1 right-1 sm:bottom-2 sm:right-2`}>{br}</div>
    </>
  );

  if (id === 'cute') return renderEmojis('🧸', '🎀', '🌸', '🍭');
  if (id === 'sparkle') return renderEmojis('✨', '💖', '🌟', '✨');
  if (id === 'nature') return renderEmojis('🌿', '🍃', '🌼', '🍄');
  if (id === 'cool') return renderEmojis('😎', '🔥', '🎸', '👾');
  if (id === 'Chinese New Year') return renderEmojis('🧧', '🏮', '🔴', '🇨🇳');
  if (id === 'Christmas') return renderEmojis('🎄', '🎅', '🎁', '🦌');
  if (id === 'loy-krathong') return renderEmojis('🏮', '🌕', '🪷', '✨');
  if (id === 'snowy') return renderEmojis('❄️', '⛄', '🧣', '❄️');
  if (id === 'new-year') return renderEmojis('🎆', '🥂', '🎉', '✨');
  if (id === 'songkran') return renderEmojis('💦', '🌼', '🔫', '🐘');
  if (id === 'halloween') return renderEmojis('🎃', '👻', '🦇', '🕸️');
  if (id === 'graduation') return renderEmojis('🎓', '📜', '💐', '🌟');
  if (id === 'summer') return renderEmojis('☀️', '🍉', '🌴', '🏖️');
  if (id === 'sakura') return renderEmojis('🌸', '🍡', '🌸', '🍵');
  if (id === 'mothers-day') return renderEmojis('💙', '🌼', '💐', '🤍');
  if (id === 'fathers-day') return renderEmojis('💛', '🌻', '👔', '✨');
  if (id === 'birthday') return renderEmojis('🎂', '🎈', '🎉', '🕯️');
  if (id === 'love') return renderEmojis('❤️', '💌', '🌹', '💋');
  if (id === 'space') return renderEmojis('🚀', '🪐', '👽', '🌠');
  if (id === 'cat') return renderEmojis('🐱', '🐾', '🧶', '🐟');
  if (id === 'unicorn') return renderEmojis('🦄', '✨', '🌈', '💖');
  if (id === 'custom') return renderEmojis(customEmojis?.topLeft || '✨', customEmojis?.topRight || '💖', customEmojis?.bottomLeft || '🌟', customEmojis?.bottomRight || '✨');
  return null;
};

// เลือกสีตัวอักษรให้อ่านออกบนพื้นหลัง (รองรับ #rgb, #rrggbb, #rrggbbaa และ gradient โดยใช้สีแรก)
const getReadableTextColor = (background: string): string => {
  const m = background.match(/#([0-9a-f]{3,8})\b/i);
  if (!m) return '#333';
  let hex = m[1];
  if (hex.length === 3 || hex.length === 4) hex = hex.slice(0, 3).split('').map(c => c + c).join('');
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? '#ffffff' : '#333';
};

// สติกเกอร์ที่วางบนแถบรูป (ตำแหน่งเป็น % ของแถบ เพื่อให้ตรงกันทุกขนาดจอ)
type PlacedSticker = { uid: string; kind: 'art' | 'emoji'; value: string; x: number; y: number; size: number; rot: number };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

interface PhotoEditorProps {
  photos: string[];
  onRetake: () => void;
  filterId?: string;
}

export default function PhotoEditor({ photos, onRetake, filterId = 'normal' }: PhotoEditorProps) {
  const [selectedColor, setSelectedColor] = useState(frameColors[1]);
  const [customColor, setCustomColor] = useState('#ffffff');
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [selectedFrameOverlay, setSelectedFrameOverlay] = useState<string | null>('none');
  const [loading, setLoading] = useState<boolean>(false);
  const [customEmojis, setCustomEmojis] = useState({ topLeft: '✨', topRight: '💖', bottomLeft: '🌟', bottomRight: '✨' });
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [fetchedEmojis, setFetchedEmojis] = useState<Record<string, string[]>>(emojis);
  const [isEmojiLoading, setIsEmojiLoading] = useState(true);
  const [emojiFetchError, setEmojiFetchError] = useState<string | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<{ category: string, icons: string[] }[]>(commonEmojisFallback);
  const [activeCorner, setActiveCorner] = useState<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'>('topLeft');
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>(filterId);
  const { favoriteFilters, toggleFavorite, sortedFilters } = useFavoriteFilters();
  const [footerTitle, setFooterTitle] = useState('Photo Booth');
  const [footerSubtitle, setFooterSubtitle] = useState('✦ 2026 · PhotoCute ✦');
  const [filterGroup, setFilterGroup] = useState<FilterGroup | 'all' | 'fav'>('all');
  const [activeTab, setActiveTab] = useState<'frame' | 'sticker' | 'emoji' | 'filter' | 'text'>('frame');
  const [placed, setPlaced] = useState<PlacedSticker[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [emojiPlaceMode, setEmojiPlaceMode] = useState<'corner' | 'free'>('corner');
  const [stripWidth, setStripWidth] = useState(340);
  const [stickerGroup, setStickerGroup] = useState<StickerGroup | 'all'>('all');
  const [selectedPattern, setSelectedPattern] = useState<PatternId>('none');
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [currentMonth] = useState(() => new Date().getMonth());

  // เก็บค่าก่อนใช้ธีม เพื่อให้กด "ยกเลิกธีม" แล้วย้อนกลับได้
  const themeBackupRef = useRef<{ color: typeof frameColors[number]; isCustom: boolean; overlay: string | null; pattern: PatternId; title: string; subtitle: string } | null>(null);

  const cancelTheme = () => {
    const b = themeBackupRef.current;
    if (b) {
      setSelectedColor(b.color);
      setIsCustomActive(b.isCustom);
      setSelectedFrameOverlay(b.overlay);
      setSelectedPattern(b.pattern);
      setFooterTitle(b.title);
      setFooterSubtitle(b.subtitle);
    }
    themeBackupRef.current = null;
    setActiveTheme(null);
  };

  const applyTheme = (theme: typeof seasonalThemes[number]) => {
    if (activeTheme === theme.id) { cancelTheme(); return; } // แตะซ้ำ = ยกเลิก
    if (!activeTheme) {
      themeBackupRef.current = { color: selectedColor, isCustom: isCustomActive, overlay: selectedFrameOverlay, pattern: selectedPattern, title: footerTitle, subtitle: footerSubtitle };
    }
    const color = frameColors.find(c => c.id === theme.colorId);
    if (color) { setSelectedColor(color); setIsCustomActive(false); }
    setSelectedFrameOverlay(theme.overlay);
    setSelectedPattern(theme.pattern);
    setFooterTitle(theme.title);
    setFooterSubtitle(theme.subtitle);
    setActiveTheme(theme.id);
  };

  const stripRef = useRef<HTMLDivElement>(null);
  const [isPrinted, setIsPrinted] = useState(false);
  const [printRun, setPrintRun] = useState(0); // เพิ่มค่าเพื่อเล่นอนิเมชันพิมพ์ซ้ำ
  const [celebrateKey, setCelebrateKey] = useState(0);

  // วัดความกว้างแถบรูป (ใช้คำนวณขนาดฟอนต์ของอิโมจิที่วางอิสระ)
  React.useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStripWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [printRun]); // แถบรูปถูก remount ทุกครั้งที่พิมพ์ใหม่

  const addSticker = (kind: PlacedSticker['kind'], value: string) => {
    const uid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const jitter = () => (Math.random() - 0.5) * 16;
    setPlaced(prev => [...prev, { uid, kind, value, x: clamp(50 + jitter(), 10, 90), y: clamp(40 + jitter(), 10, 90), size: kind === 'art' ? 28 : 18, rot: Math.round((Math.random() - 0.5) * 24) }]);
    setSelectedUid(uid);
  };
  const updateSticker = (uid: string, patch: Partial<PlacedSticker>) =>
    setPlaced(prev => prev.map(s => (s.uid === uid ? { ...s, ...patch } : s)));
  const removeSticker = (uid: string) => {
    setPlaced(prev => prev.filter(s => s.uid !== uid));
    setSelectedUid(cur => (cur === uid ? null : cur));
  };
  const duplicateSticker = (uid: string) => {
    const src = placed.find(s => s.uid === uid);
    if (!src) return;
    const copy = { ...src, uid: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, x: clamp(src.x + 6, 0, 100), y: clamp(src.y + 6, 0, 100) };
    setPlaced(prev => [...prev, copy]);
    setSelectedUid(copy.uid);
  };
  const selectedSticker = placed.find(s => s.uid === selectedUid) ?? null;

  // ลาก / หมุน+ย่อขยาย ด้วย Pointer Events (รองรับทั้งเมาส์และนิ้ว)
  const startStickerGesture = (e: React.PointerEvent, uid: string, mode: 'move' | 'transform') => {
    e.stopPropagation();
    e.preventDefault();
    const strip = stripRef.current;
    const st = placed.find(s => s.uid === uid);
    if (!strip || !st) return;
    const rect = strip.getBoundingClientRect();
    setSelectedUid(uid);
    setActiveTab('sticker');
    if (mode === 'move') setPlaced(prev => [...prev.filter(s => s.uid !== uid), st]); // ยกขึ้นบนสุด
    const cx = rect.left + (st.x / 100) * rect.width;
    const cy = rect.top + (st.y / 100) * rect.height;
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const onMove = (ev: PointerEvent) => {
      if (mode === 'move') {
        updateSticker(uid, {
          x: clamp(st.x + ((ev.clientX - e.clientX) / rect.width) * 100, 0, 100),
          y: clamp(st.y + ((ev.clientY - e.clientY) / rect.height) * 100, 0, 100),
        });
      } else {
        const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
        const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx);
        updateSticker(uid, {
          size: clamp((st.size * dist) / startDist, 6, 95),
          rot: Math.round(st.rot + ((angle - startAngle) * 180) / Math.PI),
        });
      }
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // PC: กด Delete/Backspace เพื่อลบ, Esc เพื่อยกเลิกเลือก
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (!selectedUid || (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeSticker(selectedUid); }
      if (e.key === 'Escape') setSelectedUid(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedUid]);

  const handlePrinted = () => {
    setIsPrinted(true);
    setCelebrateKey(k => k + 1);
  };
  const reprint = () => { setIsPrinted(false); setPrintRun(r => r + 1); };

  React.useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);

    const fetchEmojis = async () => {
      try {
        setIsEmojiLoading(true);
        setEmojiFetchError(null);
        const searchResp = await fetch('https://raw.githubusercontent.com/muan/emojilib/main/dist/emoji-en-US.json', { signal: controller.signal });
        if (searchResp.ok) setFetchedEmojis(await searchResp.json());
        const catResp = await fetch('https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json', { signal: controller.signal });
        if (catResp.ok) {
          const catData = await catResp.json();
          const groups: Record<string, string[]> = {};
          const heartIcons: string[] = [];
          (catData as { emoji: string; category: string; description?: string; aliases?: string[] }[]).forEach((item) => {
            const isHeart = item.description?.toLowerCase().includes('heart') || item.aliases?.some((a) => a.toLowerCase().includes('heart'));
            if (isHeart) heartIcons.push(item.emoji);
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item.emoji);
          });
          let formatted = Object.entries(groups).map(([name, icons]) => ({ category: name, icons: icons.slice(0, 48) }));
          if (heartIcons.length > 0) formatted = [{ category: 'heart', icons: Array.from(new Set(heartIcons)).slice(0, 48) }, ...formatted];
          if (controller.signal.aborted) return;
          setDynamicCategories(formatted);
          setActiveEmojiCategory(0);
        }
      } catch {
        // ถูกยกเลิกเพราะ unmount → ไม่ต้องแจ้ง, หมดเวลา/เน็ตหลุด → แจ้ง (ยังใช้อิโมจิสำรองได้)
        if (!controller.signal.aborted || timedOut) setEmojiFetchError('โหลดอิโมจิเพิ่มเติมไม่สำเร็จ');
      } finally {
        clearTimeout(timeoutId);
        if (!controller.signal.aborted || timedOut) setIsEmojiLoading(false);
      }
    };
    fetchEmojis();
    return () => { clearTimeout(timeoutId); controller.abort(); };
  }, [fetchTrigger]);

  const photoFilterStyle = getFilterStyle(selectedFilter);
  const stripBackground = isCustomActive ? customColor : selectedColor.hex;
  const stripTextColor = getReadableTextColor(stripBackground);

  // ── ดาวน์โหลด / บันทึกรูป ──
  type SavedImage = { blob: Blob; url: string; file: File };
  const [saved, setSaved] = useState<SavedImage | null>(null);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [platform] = useState(() => detectPlatform());
  const savedCanShare = saved ? canShareFile(saved.file) : false;

  const closeSaved = () => {
    if (saved) URL.revokeObjectURL(saved.url);
    setSaved(null);
    setSaveNote(null);
  };

  const handleDownload = async () => {
    if (!stripRef.current || loading) return;
    try {
      setLoading(true);
      setSelectedUid(null); // ซ่อนกรอบเลือกสติกเกอร์ก่อนจับภาพ
      await new Promise(resolve => setTimeout(resolve, 300));
      const blob = await captureNode(stripRef.current);
      const fileName = makeFileName();
      const file = new File([blob], fileName, { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      if (!platform.isMobile) {
        // PC: ดาวน์โหลดทันที
        downloadUrl(url, fileName);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        return;
      }
      // มือถือ: เปิดหน้าต่างพรีวิว แล้วให้ผู้ใช้แตะ "บันทึก" อีกครั้ง
      // (iOS ต้องเรียก share จากการแตะโดยตรง ถ้าเรียกหลังสร้างรูปเสร็จจะถูกบล็อก)
      setSaved({ blob, url, file });
    } catch (err) {
      console.error('Capture failure:', err);
      alert('ขออภัย! สร้างรูปไม่สำเร็จ: ' + (err instanceof Error ? err.message : 'ข้อผิดพลาดที่ไม่รู้จัก'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDevice = async () => {
    if (!saved) return;
    try {
      if (platform.isIOS && savedCanShare) {
        const r = await shareFile(saved.file);
        if (r === 'shared') setSaveNote('เรียบร้อย! ถ้าเลือก "บันทึกภาพ" รูปจะอยู่ในแอปรูปภาพ ✦');
        return;
      }
      downloadUrl(saved.url, saved.file.name);
      setSaveNote(platform.isIOS
        ? 'รูปถูกบันทึกในแอป "ไฟล์" (Files) › ดาวน์โหลด — หรือกดค้างที่รูปด้านบนแล้วเลือก "บันทึกลงในรูปภาพ"'
        : 'บันทึกแล้ว! ดูได้ในแกลเลอรี หรือโฟลเดอร์ Download ✦');
    } catch (err) {
      console.error('Save failure:', err);
      setSaveNote('บันทึกอัตโนมัติไม่ได้ — กดค้างที่รูปด้านบนแล้วเลือก "บันทึกรูปภาพ" ได้เลย');
    }
  };

  const handleShare = async () => {
    if (!saved) return;
    try { await shareFile(saved.file); } catch (err) { console.error('Share failure:', err); }
  };



  const tabs = [
    { id: 'frame', label: 'กรอบ', icon: Palette },
    { id: 'sticker', label: 'สติกเกอร์', icon: Sticker },
    { id: 'emoji', label: 'อิโมจิ', icon: Smile },
    { id: 'filter', label: 'ฟิลเตอร์', icon: Sparkles },
    { id: 'text', label: 'ข้อความ', icon: Type },
  ] as const;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden font-sans text-plum">
      {celebrateKey > 0 && <Confetti key={celebrateKey} />}
      {/* Aura */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 top-0 h-[380px] w-[380px] rounded-full bg-blush-300/40 blur-3xl animate-blob" />
        <div className="absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-lilac/70 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-0 overflow-hidden md:flex-row md:gap-6 md:px-6 md:py-6">

        {/* ───── Preview ───── */}
        <div className="custom-scrollbar relative flex w-full flex-1 flex-col items-center overflow-y-auto px-4 pb-8 pt-5 md:flex-[1.3] md:pt-2">
          <div className="mb-4 flex w-full max-w-[380px] items-center justify-between">
            <button onClick={onRetake} disabled={loading} className="chip px-3 py-1.5 text-xs">
              <ArrowLeft size={14} /> ถ่ายใหม่
            </button>
            <p className="font-display text-lg italic text-plum">the <span className="text-shimmer">edit</span> ✦</p>
          </div>

          <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px]">
            {/* Printer slot */}
            <div className="relative z-40 -mx-4 rounded-[1.4rem] bg-gradient-to-b from-white to-blush-100 px-4 pb-3 pt-2.5 shadow-[0_14px_30px_-16px_rgba(176,39,92,0.55)] ring-1 ring-white sm:-mx-5">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="font-display text-sm italic text-plum">Photo<span className="text-blush-500">Cute</span> <span className="text-rosegold">✦</span> printer</span>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-plum-soft">
                  <span className={`h-2 w-2 rounded-full ${isPrinted ? 'bg-emerald-400' : 'bg-blush-400 animate-twinkle'}`} />
                  {isPrinted ? 'ready!' : 'printing…'}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-plum/85 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Paper comes out of the slot */}
            <div className="relative -mx-6 -mt-2 overflow-hidden px-6 pb-14">
              <span className="pointer-events-none absolute -bottom-0 right-3 z-30 text-xl text-blush-400 animate-twinkle animation-delay-2000" aria-hidden>✧</span>
              <div key={printRun} className="animate-print" onAnimationEnd={(e) => { if (e.target === e.currentTarget) handlePrinted(); }}>
                <div
                  ref={stripRef}
                  onPointerDown={() => setSelectedUid(null)}
                  className="photo-strip-container relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-[6px] p-3 shadow-[0_40px_80px_-30px_rgba(176,39,92,0.55),0_10px_20px_-12px_rgba(74,31,54,0.25)] transition-all duration-300 ease-in-out sm:gap-4 sm:p-4 md:p-5"
                  style={{ background: stripBackground, color: stripTextColor }}
                >
                  {renderPattern(selectedPattern)}
                  <div className={`relative z-10 grid w-full gap-2 sm:gap-2.5 ${photos.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {photos.map((img, idx) => (
                      <div key={idx} className="relative aspect-[3/4] overflow-hidden rounded-[3px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`snap-${idx}`}
                          className="photo-item h-full w-full object-cover"
                          style={{ transform: 'translateZ(0)', filter: photoFilterStyle }}
                        />
                      </div>
                    ))}
                  </div>
                  {renderOverlayFrame(selectedFrameOverlay, customEmojis)}
                  <div className="relative z-30 mt-1 w-full break-words px-2 text-center sm:mt-2" style={{ color: 'inherit' }}>
                    <div className="font-display text-lg italic leading-tight sm:text-xl">{footerTitle}</div>
                    <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] opacity-70 sm:text-[10px]">{footerSubtitle}</div>
                  </div>

                  {/* Free stickers */}
                  <div className="pointer-events-none absolute inset-0 z-40">
                    {placed.map(st => {
                      const sel = st.uid === selectedUid;
                      return (
                        <div
                          key={st.uid}
                          onPointerDown={(e) => startStickerGesture(e, st.uid, 'move')}
                          className="pointer-events-auto absolute cursor-grab touch-none select-none active:cursor-grabbing"
                          style={{ left: `${st.x}%`, top: `${st.y}%`, width: `${st.size}%`, aspectRatio: '1 / 1', transform: `translate(-50%, -50%) rotate(${st.rot}deg)` }}
                        >
                          <div className="h-full w-full" style={{ filter: STICKER_CUT_FILTER }}>
                            {st.kind === 'art' ? getStickerArt(st.value) : (
                              <span className="grid h-full w-full place-items-center leading-none" style={{ fontSize: `${(st.size / 100) * stripWidth * 0.8}px` }}>{st.value}</span>
                            )}
                          </div>
                          {sel && (
                            <>
                              <div data-html2canvas-ignore="true" className="pointer-events-none absolute -inset-1.5 rounded-xl border-2 border-dashed border-white shadow-[0_0_0_1px_rgba(242,86,143,0.7)]" />
                              <button
                                data-html2canvas-ignore="true"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => removeSticker(st.uid)}
                                aria-label="ลบสติกเกอร์"
                                className="absolute -left-4 -top-4 grid h-8 w-8 place-items-center rounded-full bg-white text-blush-600 shadow-md md:h-7 md:w-7"
                              >
                                <X size={14} />
                              </button>
                              <button
                                data-html2canvas-ignore="true"
                                onPointerDown={(e) => startStickerGesture(e, st.uid, 'transform')}
                                aria-label="หมุนหรือย่อขยาย"
                                className="absolute -bottom-4 -right-4 grid h-8 w-8 cursor-nwse-resize touch-none place-items-center rounded-full bg-blush-500 text-white shadow-md md:h-7 md:w-7"
                              >
                                <RotateCw size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {isPrinted && (
              <button onClick={reprint} className="mx-auto -mt-10 flex items-center gap-1.5 text-xs font-medium text-plum-soft transition-colors hover:text-blush-600">
                <RefreshCw size={12} /> พิมพ์อีกครั้ง
              </button>
            )}
          </div>
        </div>

        {/* ───── Tools panel ───── */}
        <div className="glass relative z-30 flex h-[46vh] min-h-[340px] w-full shrink-0 flex-col overflow-hidden rounded-t-[2rem] md:h-full md:w-[400px] md:rounded-[2.25rem] lg:w-[420px]">

          {/* Tabs */}
          <div className="p-3 md:p-4">
            <div className="grid grid-cols-5 gap-1 rounded-[1.4rem] bg-blush-100/70 p-1 sm:rounded-full">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-[1.1rem] py-2 text-[10px] font-semibold transition-all sm:flex-row sm:gap-1.5 sm:rounded-full sm:py-2.5 sm:text-xs ${activeTab === id ? 'bg-white text-blush-600 shadow-[0_6px_16px_-8px_rgba(242,86,143,0.6)]' : 'text-plum-soft hover:text-blush-600'}`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 pb-6 md:px-6">
            {activeTab === 'frame' && (
              <div key="frame" className="animate-rise space-y-6">
                <section>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="eyebrow">ธีมเทศกาล · แตะทีเดียวครบ</h3>
                    {activeTheme && (
                      <button onClick={cancelTheme} className="chip px-2.5 py-1 text-[11px] !text-blush-600">
                        <X size={12} /> ยกเลิกธีม
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-2">
                    {[...seasonalThemes].sort((a, b) => Number(b.months.includes(currentMonth)) - Number(a.months.includes(currentMonth))).map(theme => {
                      const inSeason = theme.months.includes(currentMonth);
                      const active = activeTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => applyTheme(theme)}
                          aria-pressed={active}
                          title={active ? 'แตะอีกครั้งเพื่อยกเลิกธีม' : theme.name}
                          className={`relative flex items-center gap-2.5 overflow-hidden rounded-2xl border p-2 text-left transition-all ${active ? 'border-blush-400 bg-white shadow-[0_8px_18px_-10px_rgba(242,86,143,0.8)]' : 'border-blush-100 bg-white/60 hover:bg-white'}`}
                        >
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl shadow-inner" style={{ background: theme.preview }}>{theme.icon}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-semibold text-plum">{theme.name}</span>
                            <span className="block truncate text-[10px] text-plum-soft">{theme.title}</span>
                          </span>
                          {active ? (
                            <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-blush-500 text-white shadow-sm" aria-hidden><X size={11} /></span>
                          ) : inSeason && (
                            <span className="absolute right-1.5 top-1.5 rounded-full bg-gradient-to-r from-blush-400 to-blush-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">ช่วงนี้</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
                <section>
                  <h3 className="eyebrow mb-3 px-1">สีพื้นหลัง</h3>
                  <div className="grid grid-cols-6 gap-2.5 sm:grid-cols-7">
                    {frameColors.map((color) => {
                      const active = !isCustomActive && selectedColor.id === color.id;
                      return (
                        <button
                          key={color.id}
                          title={color.id}
                          aria-label={color.id}
                          onClick={() => { setIsCustomActive(false); setSelectedColor(color); setActiveTheme(null); }}
                          className={`aspect-square w-full rounded-full border-2 shadow-sm transition-all ${active ? 'scale-110 border-white ring-2 ring-blush-400 ring-offset-1' : 'border-white hover:scale-105'}`}
                          style={{ background: color.hex }}
                        />
                      );
                    })}
                    <label
                      className={`relative grid aspect-square w-full cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-white shadow-sm ${isCustomActive ? 'scale-110 ring-2 ring-blush-400 ring-offset-1' : ''}`}
                      style={{ background: isCustomActive ? customColor : 'conic-gradient(#ff7eaa, #f3d9c4, #e8d7ff, #a5f3fc, #ff7eaa)' }}
                      title="เลือกสีเอง"
                    >
                      <input type="color" value={customColor} onChange={(e) => { setCustomColor(e.target.value); setIsCustomActive(true); setActiveTheme(null); }} className="absolute inset-0 cursor-pointer opacity-0" />
                      <Pipette size={14} className="text-white drop-shadow" />
                    </label>
                  </div>
                </section>
                <section>
                  <h3 className="eyebrow mb-3 px-1">ลวดลาย</h3>
                  <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
                    {patterns.map(pt => (
                      <button
                        key={pt.id}
                        onClick={() => { setSelectedPattern(pt.id); setActiveTheme(null); }}
                        className={`chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] ${selectedPattern === pt.id ? 'chip-active' : ''}`}
                      >
                        <span>{pt.icon}</span> {pt.name}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="eyebrow mb-3 px-1">ธีมกรอบ</h3>
                  <div className="grid grid-cols-4 gap-2.5">
                    {overlayFrames.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => { setSelectedFrameOverlay(frame.id); setActiveTheme(null); }}
                        title={frame.name}
                        className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl border transition-all ${selectedFrameOverlay === frame.id ? 'border-blush-400 bg-white shadow-[0_8px_18px_-10px_rgba(242,86,143,0.8)]' : 'border-blush-100 bg-white/60 hover:bg-white'}`}
                      >
                        {frame.id === 'none' ? <Ban size={20} className="text-blush-300" /> : (
                          <span className="text-2xl">{frame.type === 'image' ? <ImageIcon size={22} className="text-blush-400" /> : frame.src}</span>
                        )}
                        <span className="max-w-full truncate px-1 text-[9px] font-medium text-plum-soft">{frame.id === 'none' ? 'ไม่ใส่' : frame.name.replace(/^\S+\s/, '')}</span>
                        {frame.isPremium && (
                          <span className="absolute right-1 top-1 rounded-full bg-white p-0.5 shadow-sm">
                            <Lock size={8} className="text-amber-500" fill="currentColor" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'sticker' && (
              <div key="sticker" className="animate-rise space-y-5">
                {selectedSticker && (
                  <section className="rounded-3xl border border-blush-100 bg-white/80 p-4 shadow-[0_10px_24px_-16px_rgba(242,86,143,0.6)]">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="sticker-cut grid h-12 w-12 shrink-0 place-items-center">
                        {selectedSticker.kind === 'art' ? getStickerArt(selectedSticker.value) : <span className="text-3xl leading-none">{selectedSticker.value}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-plum">ปรับสติกเกอร์</p>
                        <p className="text-[11px] text-plum-soft">ลากบนรูปเพื่อย้ายได้เลย</p>
                      </div>
                      <button onClick={() => duplicateSticker(selectedSticker.uid)} className="chip h-9 w-9 justify-center" aria-label="ทำซ้ำ" title="ทำซ้ำ"><Copy size={14} /></button>
                      <button onClick={() => removeSticker(selectedSticker.uid)} className="chip h-9 w-9 justify-center !text-blush-600" aria-label="ลบ" title="ลบ"><Trash2 size={14} /></button>
                    </div>
                    <label className="mb-2 flex items-center gap-3 text-[11px] font-semibold text-plum-soft">
                      <span className="w-10">ขนาด</span>
                      <input type="range" min={6} max={95} step={1} value={selectedSticker.size} onChange={e => updateSticker(selectedSticker.uid, { size: Number(e.target.value) })} className="flex-1 accent-blush-500" />
                    </label>
                    <label className="flex items-center gap-3 text-[11px] font-semibold text-plum-soft">
                      <span className="w-10">หมุน</span>
                      <input type="range" min={-180} max={180} step={1} value={((selectedSticker.rot + 540) % 360) - 180} onChange={e => updateSticker(selectedSticker.uid, { rot: Number(e.target.value) })} className="flex-1 accent-blush-500" />
                    </label>
                  </section>
                )}
                <section>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="eyebrow">สติกเกอร์น่ารัก · แตะเพื่อวาง</h3>
                    {placed.length > 0 && (
                      <button onClick={() => { setPlaced([]); setSelectedUid(null); }} className="text-[11px] font-medium text-plum-soft underline-offset-2 hover:text-blush-600 hover:underline">ลบทั้งหมด</button>
                    )}
                  </div>
                  <div className="no-scrollbar -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1">
                    {stickerGroups.map(g => (
                      <button key={g.id} onClick={() => setStickerGroup(g.id)} className={`chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] ${stickerGroup === g.id ? 'chip-active' : ''}`}>{g.label}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-4">
                    {stickerArts.filter(st => stickerGroup === 'all' || st.group === stickerGroup).map(st => (
                      <button
                        key={st.id}
                        onClick={() => addSticker('art', st.id)}
                        title={st.name}
                        aria-label={`วางสติกเกอร์ ${st.name}`}
                        className="group aspect-square rounded-2xl border border-blush-100 bg-white/60 p-2.5 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_18px_-10px_rgba(242,86,143,0.8)] active:scale-95"
                      >
                        <div className="sticker-cut h-full w-full transition-transform group-hover:rotate-6">{st.art}</div>
                      </button>
                    ))}
                  </div>
                </section>
                <p className="px-1 text-[11px] leading-relaxed text-plum-soft">
                  ✦ ลากเพื่อย้าย · จับปุ่มชมพูมุมขวาล่างเพื่อหมุน/ย่อขยาย<span className="hidden md:inline"> · กด Delete เพื่อลบ</span>
                </p>
              </div>
            )}

            {activeTab === 'emoji' && (
              <div key="emoji" className="animate-rise">
                <div className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-blush-100/70 p-1">
                  {([['corner', 'วางที่มุมกรอบ'], ['free', 'วางอิสระ ✦']] as const).map(([mode, label]) => (
                    <button key={mode} onClick={() => setEmojiPlaceMode(mode)} className={`rounded-full py-2 text-xs font-semibold transition-all ${emojiPlaceMode === mode ? 'bg-white text-blush-600 shadow-sm' : 'text-plum-soft'}`}>{label}</button>
                  ))}
                </div>
                {emojiPlaceMode === 'free' ? (
                  <p className="mb-3 px-1 text-[11px] text-plum-soft">แตะอิโมจิเพื่อวางบนรูป แล้วลาก/หมุน/ย่อขยายได้เหมือนสติกเกอร์</p>
                ) : (
                <>
                <div className="mb-2 flex items-end justify-between px-1">
                  <span className="eyebrow">เลือกมุม แล้วแตะอิโมจิ</span>
                </div>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(corner => {
                    const labels = { topLeft: 'บนซ้าย', topRight: 'บนขวา', bottomLeft: 'ล่างซ้าย', bottomRight: 'ล่างขวา' };
                    return (
                      <button key={corner} onClick={() => setActiveCorner(corner)} className={`rounded-2xl border p-2 transition-all ${activeCorner === corner ? 'border-blush-400 bg-white shadow-[0_8px_18px_-10px_rgba(242,86,143,0.8)]' : 'border-blush-100 bg-white/60'}`}>
                        <div className="text-center text-2xl">{customEmojis[corner]}</div>
                        <span className={`mt-1 block text-center text-[9px] font-semibold ${activeCorner === corner ? 'text-blush-600' : 'text-plum-soft'}`}>{labels[corner]}</span>
                      </button>
                    );
                  })}
                </div>
                </>
                )}
                <div className="overflow-hidden rounded-3xl border border-blush-100 bg-white/70">
                  <div className="flex items-center gap-2 border-b border-blush-100 p-2.5">
                    <input type="text" placeholder="ค้นหา (ภาษาอังกฤษ) เช่น heart, cat" value={emojiSearch} onChange={e => setEmojiSearch(e.target.value)} className="flex-1 rounded-full border border-blush-100 bg-blush-50 px-4 py-2 text-sm text-plum outline-none placeholder:text-blush-300 focus:ring-2 focus:ring-blush-200" />
                    <button
                      onClick={() => setCustomEmojis({ topLeft: '✨', topRight: '💖', bottomLeft: '🌟', bottomRight: '✨' })}
                      className="grid h-9 w-9 place-items-center rounded-full text-plum-soft transition-colors hover:bg-blush-100 hover:text-blush-600"
                      title="รีเซ็ตสติกเกอร์"
                      aria-label="รีเซ็ตสติกเกอร์"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                  <div className="custom-scrollbar grid h-48 grid-cols-6 gap-1 overflow-y-auto p-2.5">
                    {isEmojiLoading ? <div className="col-span-6 py-10 text-center text-xs text-plum-soft">กำลังโหลดสติกเกอร์ ✦</div> : (
                      (emojiSearch.trim() ? Object.entries(fetchedEmojis).filter(([, k]) => Array.isArray(k) && k.some(ki => ki.includes(emojiSearch.trim().toLowerCase()))).slice(0, 72).map(([e]) => e) : dynamicCategories[activeEmojiCategory]?.icons || [])
                        .map((emoji, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (emojiPlaceMode === 'free') { addSticker('emoji', emoji); return; }
                              setCustomEmojis(p => ({ ...p, [activeCorner]: emoji }));
                              setSelectedFrameOverlay('custom');
                            }}
                            className="flex h-10 items-center justify-center rounded-xl text-2xl transition-transform hover:bg-blush-50 active:scale-90"
                          >
                            {emoji}
                          </button>
                        ))
                    )}
                  </div>
                  {emojiFetchError && !isEmojiLoading && (
                    <div className="flex items-center justify-between gap-2 border-t border-blush-100 bg-blush-50 px-3 py-2 text-[11px] text-blush-600">
                      <span>{emojiFetchError}</span>
                      <button onClick={() => setFetchTrigger(t => t + 1)} className="font-semibold underline">ลองใหม่</button>
                    </div>
                  )}
                  {!emojiSearch.trim() && (
                    <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-blush-100 p-2">
                      {dynamicCategories.map((cat, i) => (
                        <button key={cat.category} onClick={() => setActiveEmojiCategory(i)} className={`chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[10px] ${activeEmojiCategory === i ? 'chip-active' : ''}`}>{cat.category}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'filter' && (
              <div key="filter" className="animate-rise">
                <h3 className="eyebrow mb-3 px-1">filter mood · แตะดาวเพื่อปักหมุด</h3>
                <div className="no-scrollbar -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1">
                  {[...(favoriteFilters.length > 0 ? [{ id: 'fav' as const, label: '⭐ ที่ชอบ' }] : []), ...filterGroups].map(g => (
                    <button key={g.id} onClick={() => setFilterGroup(g.id)} className={`chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] ${filterGroup === g.id ? 'chip-active' : ''}`}>{g.label}</button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-3">
                  {sortedFilters.filter(f =>
                    filterGroup === 'all' ? true
                      : filterGroup === 'fav' ? favoriteFilters.includes(f.id) || f.id === 'normal'
                        : f.group === filterGroup || f.id === 'normal'
                  ).map(f => {
                    const isF = favoriteFilters.includes(f.id);
                    const active = selectedFilter === f.id;
                    return (
                      <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`flex flex-col items-center rounded-2xl border p-2 transition-all ${active ? 'border-blush-400 bg-white shadow-[0_8px_18px_-10px_rgba(242,86,143,0.8)]' : 'border-blush-100 bg-white/60 hover:bg-white'}`}>
                        <div className="relative mb-1.5 w-full">
                          <div className="aspect-square w-full overflow-hidden rounded-xl">
                            {photos[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={photos[0]} alt="" className="h-full w-full object-cover" style={{ filter: getFilterStyle(f.id) }} />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-blush-300 via-champagne to-lilac" style={{ filter: getFilterStyle(f.id) }} />
                            )}
                          </div>
                          <span
                            role="button"
                            aria-label={isF ? 'เลิกปักหมุด' : 'ปักหมุด'}
                            onClick={e => toggleFavorite(e, f.id)}
                            className={`absolute -right-1 -top-1 rounded-full bg-white p-1 shadow-sm ${isF ? 'text-amber-400' : 'text-blush-200 hover:text-amber-400'}`}
                          >
                            <Star size={11} fill={isF ? 'currentColor' : 'none'} />
                          </span>
                        </div>
                        <span className={`w-full truncate text-center text-[10px] font-semibold ${active ? 'text-blush-600' : 'text-plum-soft'}`}>{f.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div key="text" className="animate-rise space-y-4">
                <div className="space-y-2">
                  <label className="eyebrow ml-1">หัวข้อหลัก</label>
                  <input type="text" value={footerTitle} maxLength={40} onChange={e => setFooterTitle(e.target.value)} className="w-full rounded-2xl border border-blush-100 bg-white/80 px-4 py-3 text-plum outline-none placeholder:text-blush-300 focus:ring-2 focus:ring-blush-200" placeholder="Photo Booth" />
                </div>
                <div className="space-y-2">
                  <label className="eyebrow ml-1">คำอธิบาย</label>
                  <input type="text" value={footerSubtitle} maxLength={60} onChange={e => setFooterSubtitle(e.target.value)} className="w-full rounded-2xl border border-blush-100 bg-white/80 px-4 py-3 text-plum outline-none placeholder:text-blush-300 focus:ring-2 focus:ring-blush-200" placeholder="✦ 2026 · PhotoCute ✦" />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['besties forever ♡', 'girls night ✦', 'hbd babe 🎂', 'สวยปังมาก', 'core memory'].map(t => (
                    <button key={t} onClick={() => setFooterTitle(t)} className="chip px-3 py-1.5 text-xs">{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-white/70 bg-white/60 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md md:p-5">
            <button onClick={onRetake} disabled={loading} className="chip justify-center px-5 py-3.5 text-sm">
              <RefreshCw size={16} /> <span className="hidden sm:inline">ถ่ายใหม่</span>
            </button>
            <button onClick={handleDownload} disabled={loading} className="btn-candy flex-1 py-3.5 text-base">
              {loading ? <RefreshCw className="relative z-10 animate-spin" size={18} /> : <Download className="relative z-10" size={18} />}
              <span className="relative z-10">{loading ? 'กำลังเซฟความน่ารัก...' : 'ดาวน์โหลดรูป'}</span>
            </button>
          </div>

        </div>
      </div>
      {/* ───── Save sheet (มือถือ) ───── */}
      {saved && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-plum/40 backdrop-blur-sm sm:items-center" onClick={closeSaved} role="dialog" aria-modal="true" aria-label="บันทึกรูป">
          <div className="glass animate-rise flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-[2rem] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:rounded-[2rem]" onClick={e => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="font-display text-xl italic text-plum">ready to <span className="text-shimmer">save</span> ✦</p>
              <button onClick={closeSaved} aria-label="ปิด" className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-plum-soft shadow-sm"><X size={16} /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-white/60 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={saved.url} alt="รูปของคุณ" className="mx-auto max-h-[52dvh] w-auto rounded-lg object-contain shadow-md" style={{ WebkitTouchCallout: 'default' }} />
            </div>
            <p className="mt-3 px-1 text-center text-[11px] leading-relaxed text-plum-soft">
              {platform.isInApp
                ? 'เบราว์เซอร์ในแอป (LINE / IG / Facebook) อาจบันทึกไม่ได้ — กดค้างที่รูปแล้วเลือก "บันทึก" หรือเปิดลิงก์นี้ใน Safari / Chrome'
                : platform.isIOS
                  ? 'แตะ "บันทึกลงรูปภาพ" แล้วเลือก "บันทึกภาพ" · หรือกดค้างที่รูปก็ได้'
                  : 'แตะ "ดาวน์โหลดรูป" เพื่อเก็บลงเครื่อง · หรือกดค้างที่รูปแล้วเลือก "ดาวน์โหลดรูปภาพ"'}
            </p>
            {saveNote && <p className="animate-pop mt-2 rounded-xl bg-blush-50 px-3 py-2 text-center text-xs font-medium text-blush-600">{saveNote}</p>}
            <div className="mt-3 flex gap-2.5">
              {savedCanShare && !platform.isIOS && (
                <button onClick={handleShare} className="chip justify-center px-4 py-3.5 text-sm"><Share2 size={16} /> แชร์</button>
              )}
              <button onClick={handleSaveToDevice} className="btn-candy flex-1 py-3.5 text-base">
                <Download size={18} className="relative z-10" />
                <span className="relative z-10">{platform.isIOS ? 'บันทึกลงรูปภาพ' : 'ดาวน์โหลดรูป'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
