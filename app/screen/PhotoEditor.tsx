'use client';

import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Ban, X, Type, Lock, Image as ImageIcon, Star, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { filters } from '../lib/constants';
import emojisData from '../lib/emojis.json';

// Type definition for emojilib data
const emojis: Record<string, string[]> = emojisData;

const frameColors = [
  { id: 'white', hex: '#ffffff', isPremium: false },
  { id: 'black', hex: '#000000', isPremium: false },
  { id: 'pink', hex: '#fbcfe8', isPremium: false },
  { id: 'blue', hex: '#bfdbfe', isPremium: false },
  { id: 'cream', hex: '#fef3c7', isPremium: false },
  { id: 'Chinese New Year', hex: '#ff8c8aff', isPremium: false },
  { id: 'Christmas', hex: '#23652bff', isPremium: false },

  //สีพรีเมียม 
  { id: 'emerald', hex: '#a7f3d0', isPremium: false },
  { id: 'teal', hex: '#99f6e4', isPremium: false },
  { id: 'cyan', hex: '#a5f3fc', isPremium: false },
  { id: 'blue-premium', hex: '#bfdbfe', isPremium: false },
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
  { id: 'Chinese New Year', src: '🧧', name: '🧧 Chinese New Year', type: 'emoji', isPremium: false },
  { id: 'Christmas', src: '🎄', name: '🎄 Christmas', type: 'emoji', isPremium: false },
  { id: 'birthday', src: '🎂', name: '🎂 Birthday', type: 'emoji', isPremium: false },
  { id: 'love', src: '❤️', name: '❤️ Love', type: 'emoji', isPremium: false },
  { id: 'space', src: '🚀', name: '🚀 Galaxy', type: 'emoji', isPremium: false },
  { id: 'cat', src: '🐱', name: '🐱 Meow', type: 'emoji', isPremium: false },
  { id: 'custom', src: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M12 5v14M5 12h14"/></svg>', name: 'กำหนดเอง', type: 'custom', isPremium: false },

  // Premium PNG Frames
  // { id: 'heart-premium', src: '/frames/heart-frame.png', name: '💖 Premium Heart', type: 'image', isPremium: true },
  // { id: 'stars-premium', src: '/frames/stars-frame.png', name: '⭐ Premium Stars', type: 'image', isPremium: true }
];

// --- Helper: Render Frame Overlay as DOM Elements ---
// --- Helper: Render Frame Overlay as DOM Elements ---
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
        <img
          src={frame.src}
          alt={frame.name}
          className="w-full h-full object-fill opacity-90"
          style={{ mixBlendMode: 'multiply' }} // Optional: adjust for how PNG frames should blend
        />
      </div>
    );
  }

  const styleBase = "absolute text-3xl md:text-4xl drop-shadow-md select-none z-20 pointer-events-none";

  if (id === 'cute') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🧸</div>
      <div className={`${styleBase} top-2 right-2`}>🎀</div>
      <div className={`${styleBase} bottom-2 left-2`}>🌸</div>
      <div className={`${styleBase} bottom-2 right-2`}>🍭</div>
    </>
  );
  if (id === 'sparkle') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>✨</div>
      <div className={`${styleBase} top-2 right-2`}>💖</div>
      <div className={`${styleBase} bottom-2 left-2`}>🌟</div>
      <div className={`${styleBase} bottom-2 right-2`}>✨</div>
    </>
  );
  if (id === 'nature') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🌿</div>
      <div className={`${styleBase} top-2 right-2`}>🍃</div>
      <div className={`${styleBase} bottom-2 left-2`}>🌼</div>
      <div className={`${styleBase} bottom-2 right-2`}>🍄</div>
    </>
  );
  if (id === 'cool') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>😎</div>
      <div className={`${styleBase} top-2 right-2`}>🔥</div>
      <div className={`${styleBase} bottom-2 left-2`}>🎸</div>
      <div className={`${styleBase} bottom-2 right-2`}>👾</div>
    </>
  );

  if (id === 'Chinese New Year') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🧧</div>
      <div className={`${styleBase} top-2 right-2`}>🏮</div>
      <div className={`${styleBase} bottom-2 left-2`}>🔴</div>
      <div className={`${styleBase} bottom-2 right-2`}>🇨🇳</div>
    </>
  );
  if (id === 'Christmas') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🎄</div>
      <div className={`${styleBase} top-2 right-2`}>🎅</div>
      <div className={`${styleBase} bottom-2 left-2`}>🎁</div>
      <div className={`${styleBase} bottom-2 right-2`}>🦌</div>
    </>
  );


  if (id === 'birthday') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🎂</div>
      <div className={`${styleBase} top-2 right-2`}>🎈</div>
      <div className={`${styleBase} bottom-2 left-2`}>🎉</div>
      <div className={`${styleBase} bottom-2 right-2`}>🕯️</div>
    </>
  );

  if (id === 'love') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>❤️</div>
      <div className={`${styleBase} top-2 right-2`}>💌</div>
      <div className={`${styleBase} bottom-2 left-2`}>🌹</div>
      <div className={`${styleBase} bottom-2 right-2`}>💋</div>
    </>
  );

  if (id === 'space') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🚀</div>
      <div className={`${styleBase} top-2 right-2`}>🪐</div>
      <div className={`${styleBase} bottom-2 left-2`}>👽</div>
      <div className={`${styleBase} bottom-2 right-2`}>🌠</div>
    </>
  );

  if (id === 'cat') return (
    <>
      <div className={`${styleBase} top-2 left-2`}>🐱</div>
      <div className={`${styleBase} top-2 right-2`}>🐾</div>
      <div className={`${styleBase} bottom-2 left-2`}>🧶</div>
      <div className={`${styleBase} bottom-2 right-2`}>🐟</div>
    </>
  );

  if (id === 'custom') return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className={`${styleBase} top-2 left-2`}>{customEmojis?.topLeft || '✨'}</div>
      <div className={`${styleBase} top-2 right-2`}>{customEmojis?.topRight || '💖'}</div>
      <div className={`${styleBase} bottom-2 left-2`}>{customEmojis?.bottomLeft || '🌟'}</div>
      <div className={`${styleBase} bottom-2 right-2`}>{customEmojis?.bottomRight || '✨'}</div>
    </div>
  );
  return null;
};

// --- 3. ฟังก์ชันแปลง Tailwind เป็น CSS (ปรับปรุงเพื่อรองรับฟิลเตอร์ใหม่ๆ) ---
const convertTailwindToCssFilter = (classNameString: string) => {
  if (!classNameString) return 'none';
  const classes = classNameString.split(' ');
  const filters: string[] = [];

  classes.forEach(cls => {
    // contrast
    if (cls.startsWith('contrast-')) {
      const val = cls.match(/contrast-\[?([\d.]+)%?\]?/);
      if (val) filters.push(`contrast(${val[1].includes('.') ? val[1] : parseInt(val[1]) / 100})`);
      else {
        const standardVal = parseInt(cls.replace('contrast-', ''));
        filters.push(`contrast(${standardVal / 100})`);
      }
    }
    // brightness
    else if (cls.startsWith('brightness-')) {
      const val = cls.match(/brightness-\[?([\d.]+)%?\]?/);
      if (val) filters.push(`brightness(${val[1].includes('.') ? val[1] : parseInt(val[1]) / 100})`);
      else {
        const standardVal = parseInt(cls.replace('brightness-', ''));
        filters.push(`brightness(${standardVal / 100})`);
      }
    }
    // saturate
    else if (cls.startsWith('saturate-')) {
      const val = cls.match(/saturate-\[?([\d.]+)%?\]?/);
      if (val) filters.push(`saturate(${val[1].includes('.') ? val[1] : parseInt(val[1]) / 100})`);
      else {
        const standardVal = parseInt(cls.replace('saturate-', ''));
        filters.push(`saturate(${standardVal / 100})`);
      }
    }
    // sepia
    else if (cls.startsWith('sepia')) {
      const val = cls.match(/sepia-\[?\.?([\d.]+)\]?/);
      if (val) filters.push(`sepia(${val[1].startsWith('.') ? val[1] : val[1]})`);
      else filters.push('sepia(1)');
    }
    // grayscale
    else if (cls === 'grayscale') filters.push('grayscale(1)');
    // invert
    else if (cls === 'invert') filters.push('invert(1)');
    // hue-rotate
    else if (cls.startsWith('hue-rotate-')) {
      const val = cls.match(/hue-rotate-\[?(-?\d+)deg\]?/);
      if (val) filters.push(`hue-rotate(${val[1]}deg)`);
    }
    // blur (optional, subtle)
    else if (cls.startsWith('blur-')) {
      const val = cls.match(/blur-\[?([\d.]+)px\]?/);
      if (val) filters.push(`blur(${val[1]}px)`);
    }
  });

  return filters.length > 0 ? filters.join(' ') : 'none';
};

interface PhotoEditorProps {
  photos: string[];
  onRetake: () => void;
  onRemovePhoto: (index: number) => void;
  filterId?: string;
}

export default function PhotoEditor({ photos, onRetake, onRemovePhoto, filterId = 'normal' }: PhotoEditorProps) {
  const [selectedColor, setSelectedColor] = useState(frameColors[0]);
  const [customColor, setCustomColor] = useState('#ffffff');
  const [isCustomActive, setIsCustomActive] = useState(false);

  // เปลี่ยนจาก Sticker เป็น Frame Overlay
  const [selectedFrameOverlay, setSelectedFrameOverlay] = useState<string | null>(null);

  // Custom Emoji State
  const [customEmojis, setCustomEmojis] = useState({
    topLeft: '✨',
    topRight: '💖',
    bottomLeft: '🌟',
    bottomRight: '✨'
  });
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [emojiSearch, setEmojiSearch] = useState('');

  // Runtime Emoji Data
  const [fetchedEmojis, setFetchedEmojis] = useState<Record<string, string[]>>(emojis);
  const [isEmojiLoading, setIsEmojiLoading] = useState(true);
  const [emojiFetchError, setEmojiFetchError] = useState<string | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<{ category: string, icons: string[] }[]>(commonEmojisFallback);
  const [activeCorner, setActiveCorner] = useState<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'>('topLeft');
  const [fetchTrigger, setFetchTrigger] = useState(0); // For retry logic

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState<string>(filterId);
  const [favoriteFilters, setFavoriteFilters] = useState<string[]>([]);

  const [footerTitle, setFooterTitle] = useState('Photo Booth');
  const [footerSubtitle, setFooterSubtitle] = useState('2026 By PhotoCute');

  const stripRef = useRef<HTMLDivElement>(null);

  // Load Favorites from LocalStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('favoriteFilters');
    if (saved) {
      try {
        setFavoriteFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favoriteFilters', e);
      }
    }

    // Fetch Emojis from GitHub
    const fetchEmojis = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort('timeout');
      }, 10000); // 10s timeout

      try {
        setIsEmojiLoading(true);
        setEmojiFetchError(null);

        // 1. Fetch search library
        const searchResp = await fetch('https://raw.githubusercontent.com/muan/emojilib/main/dist/emoji-en-US.json', {
          signal: controller.signal
        });
        if (searchResp.ok) {
          const data = await searchResp.json();
          setFetchedEmojis(data);
        }

        // 2. Fetch categorized library (gemoji)
        const catResp = await fetch('https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json', {
          signal: controller.signal
        });
        if (catResp.ok) {
          const catData = await catResp.json();
          // Group by category
          const groups: Record<string, string[]> = {};
          const heartIcons: string[] = [];

          catData.forEach((item: any) => {
            // Extract hearts for dedicated category
            const isHeart = item.description?.toLowerCase().includes('heart') ||
              item.category?.toLowerCase().includes('heart') ||
              item.aliases?.some((a: string) => a.toLowerCase().includes('heart')) ||
              item.tags?.some((t: string) => t.toLowerCase().includes('heart'));

            if (isHeart) {
              heartIcons.push(item.emoji);
            }

            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item.emoji);
          });

          let formatted = Object.entries(groups).map(([name, icons]) => ({
            category: name,
            icons: icons.slice(0, 48) // Limit icons per category for UI performance
          }));

          // Prepend Dedicated Heart Category
          if (heartIcons.length > 0) {
            // Remove duplicates and limit
            const uniqueHearts = Array.from(new Set(heartIcons)).slice(0, 48);
            formatted = [
              { category: 'heart', icons: uniqueHearts },
              ...formatted
            ];
          }

          setDynamicCategories(formatted);
        }
      } catch (error: any) {
        // Only log and show error if it's NOT a manual abort from unmount
        if (error.name === 'AbortError') {
          if (controller.signal.reason === 'timeout') {
            console.warn('Emoji fetch timed out');
            setEmojiFetchError('การเชื่อมต่อกับ GitHub ใช้เวลานานเกินไป (Timeout)');
          }
          // Silent for other aborts (unmount)
        } else {
          console.error('Failed to fetch emojis from Git:', error);
          setEmojiFetchError('ไม่สามารถโหลดอิโมจิจาก GitHub ได้ กรุณาลองใหม่อีกครั้ง');
        }
      } finally {
        clearTimeout(timeoutId);
        setIsEmojiLoading(false);
      }

      // Cleanup function to abort if component unmounts or trigger changes
      return () => {
        controller.abort('unmount');
        clearTimeout(timeoutId);
      };
    };

    const cleanup = fetchEmojis();
    return () => {
      cleanup.then(abortFn => abortFn?.());
    };
  }, [fetchTrigger]);

  // Save Favorites to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('favoriteFilters', JSON.stringify(favoriteFilters));
  }, [favoriteFilters]);

  const toggleFavorite = (e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    setFavoriteFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const sortedFilters = React.useMemo(() => {
    return [...filters].sort((a, b) => {
      const aIsFav = favoriteFilters.includes(a.id);
      const bIsFav = favoriteFilters.includes(b.id);
      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      return 0;
    });
  }, [favoriteFilters]);

  const activeFilterClass = filters.find(f => f.id === selectedFilter)?.class || '';

  // --- ฟังก์ชันดาวน์โหลด (Logic เดิมที่เสถียรแล้ว) ---
  const handleDownload = async () => {
    if (stripRef.current) {
      try {
        await new Promise(resolve => setTimeout(resolve, 200)); // รอโหลดรูปกรอบ

        const currentFilterClass = filters.find(f => f.id === selectedFilter)?.class || '';
        const cssFilter = convertTailwindToCssFilter(currentFilterClass);
        const processedImages = new Map<number, string>();

        // Bake Filter ลงรูป
        if (cssFilter !== 'none') {
          const imageElements = stripRef.current.querySelectorAll('.photo-item');
          await Promise.all(Array.from(imageElements).map(async (img: any, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.filter = cssFilter;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              processedImages.set(index, canvas.toDataURL('image/png'));
            }
          }));
        }

        const canvas = await html2canvas(stripRef.current, {
          scale: 4, // Maximize quality (Scale 4x)
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          onclone: (clonedDoc) => {
            const container = clonedDoc.querySelector('.photo-strip-container') as HTMLElement;
            if (container) container.style.transform = 'none';

            if (processedImages.size > 0) {
              const clonedImages = clonedDoc.querySelectorAll('.photo-item');
              clonedImages.forEach((img: any, index) => {
                if (processedImages.has(index)) {
                  img.src = processedImages.get(index)!;
                  img.style.filter = 'none';
                }
              });
            }
          }
        });

        const link = document.createElement('a');
        link.download = `photo-booth-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png'); // Lossless PNG
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (err) {
        console.error("Save failed:", err);
        alert("เกิดข้อผิดพลาด: " + err);
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center py-8 font-sans">

      <h1 className="text-xl md:text-2xl font-bold text-pink-500 mb-8 text-center px-4">
        Photo Booth By PhotoCute
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full max-w-5xl px-4">


        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div
            ref={stripRef}
            className="photo-strip-container relative p-4 md:p-6 shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center gap-4 overflow-hidden"
            style={{
              minWidth: '320px',
              maxWidth: '380px',
              background: isCustomActive ? customColor : selectedColor.hex,
              color: (isCustomActive && customColor === '#000000') || (!isCustomActive && selectedColor.id === 'black') ? 'white' : '#333'
            }}
          >
            {/* Grid รูปภาพ */}
            <div className={`grid gap-3 w-full relative z-10 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {photos.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] overflow-hidden group bg-white"
                >
                  <img
                    src={img}
                    alt={`snap-${idx}`}
                    className={`photo-item w-full h-full object-cover ${activeFilterClass}`}
                    style={{
                      transform: 'translateZ(0)',
                      filter: convertTailwindToCssFilter(activeFilterClass),
                      WebkitFilter: convertTailwindToCssFilter(activeFilterClass)
                    }}
                  />


                </div>
              ))}
            </div>

            {/* --- 🖼️ ส่วนแสดงกรอบรูป (Frame Overlay) --- */}
            {renderOverlayFrame(selectedFrameOverlay, customEmojis)}

            {/* Footer Text */}
            <div
              className="mt-4 text-center font-bold tracking-widest uppercase opacity-80 break-words w-full px-2 relative z-30"
              style={{ color: 'inherit' }}
            >
              <div className="text-sm">{footerTitle}</div>
              <div className="text-[10px] mt-1 font-medium opacity-70">{footerSubtitle}</div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Tools Panel --- */}
        <div className="flex-1 w-full max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-lg border border-white/50">

          {/* 1. Color Picker */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">สีพื้นหลัง</h3>
            <div className="flex flex-wrap gap-3 max-h-[160px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-pink-200">
              {frameColors.map((color) => (

                <button
                  key={color.id}
                  onClick={() => {
                    if (color.isPremium) {
                      // สามารถเปลี่ยนเป็นเปิด Modal จ่ายเงินตรงนี้
                      alert('🔒 กรอบนี้สำหรับสมาชิก Premium (Demo)');
                    }

                    setIsCustomActive(false);
                    setSelectedColor(color);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transform transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${(!isCustomActive && selectedColor.id === color.id) ? 'border-pink-500 scale-110' : 'border-white/50'}`}
                  style={{ background: color.hex }}
                  title={color.id}
                >
                  {color.isPremium && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <Lock size={8} className="text-pink-500" />
                    </div>
                  )}
                </button>
              ))}

              {/* Custom Color Picker */}
              <div className="relative group">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setIsCustomActive(true);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${isCustomActive ? 'border-pink-500 scale-110' : 'border-white/50'}`}
                  style={{ background: customColor }}
                  title="เลือกสีเอง"
                >
                  <Sparkles size={14} className={isCustomActive ? 'text-pink-500' : 'text-gray-400'} />
                </button>
              </div>
            </div>
          </div>



          {/* 2. Frame Overlay Picker (เปลี่ยนจาก Sticker เป็น Frame) */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <ImageIcon size={16} /> กรอบรูป
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {overlayFrames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => {
                    if (frame.isPremium) {
                      alert('🔒 กรอบนี้สำหรับสมาชิก Premium (Demo)');
                    }
                    setSelectedFrameOverlay(frame.id);
                  }}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center overflow-hidden transition-all relative
                    ${selectedFrameOverlay === frame.id
                      ? 'border-2 border-pink-500 ring-2 ring-pink-100 bg-pink-50'
                      : 'border border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  {frame.isPremium && (
                    <div className="absolute top-1 right-1 z-10 bg-pink-500 rounded-full p-0.5 shadow-sm">
                      <Lock size={10} className="text-white" />
                    </div>
                  )}

                  {frame.id === 'none' ? (
                    <Ban size={24} className="text-gray-400" />
                  ) : frame.type === 'image' ? (
                    <img src={frame.src} alt={frame.name} className="w-full h-full object-cover" />
                  ) : frame.src.startsWith('<svg') ? (
                    <div className="text-pink-400 scale-125 transition-transform" dangerouslySetInnerHTML={{ __html: frame.src }} />
                  ) : (
                    <span className="text-2xl">{frame.src}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2.5 Custom Emoji Editor (Visible only when 'custom' frame is selected) */}
          {selectedFrameOverlay === 'custom' && (
            <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Star size={16} className="text-yellow-400" /> เลือกอิโมจิเอง
              </h3>
              <div className="grid grid-cols-2 gap-3 bg-pink-50/50 p-4 rounded-2xl border border-pink-100 mb-4">
                <div className={`flex flex-col gap-1 p-2 rounded-xl transition-all cursor-pointer ${activeCorner === 'topLeft' ? 'bg-pink-100 ring-1 ring-pink-300' : 'hover:bg-pink-50'}`} onClick={() => setActiveCorner('topLeft')}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">มุมซ้ายบน</span>
                  <div className="w-full py-2 text-center text-xl bg-white rounded-lg border border-pink-50">{customEmojis.topLeft}</div>
                </div>
                <div className={`flex flex-col gap-1 p-2 rounded-xl transition-all cursor-pointer ${activeCorner === 'topRight' ? 'bg-pink-100 ring-1 ring-pink-300' : 'hover:bg-pink-50'}`} onClick={() => setActiveCorner('topRight')}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase ml-1 text-right">มุมขวาบน</span>
                  <div className="w-full py-2 text-center text-xl bg-white rounded-lg border border-pink-50">{customEmojis.topRight}</div>
                </div>
                <div className={`flex flex-col gap-1 p-2 rounded-xl transition-all cursor-pointer ${activeCorner === 'bottomLeft' ? 'bg-pink-100 ring-1 ring-pink-300' : 'hover:bg-pink-50'}`} onClick={() => setActiveCorner('bottomLeft')}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">มุมซ้ายล่าง</span>
                  <div className="w-full py-2 text-center text-xl bg-white rounded-lg border border-pink-50">{customEmojis.bottomLeft}</div>
                </div>
                <div className={`flex flex-col gap-1 p-2 rounded-xl transition-all cursor-pointer ${activeCorner === 'bottomRight' ? 'bg-pink-100 ring-1 ring-pink-300' : 'hover:bg-pink-50'}`} onClick={() => setActiveCorner('bottomRight')}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase ml-1 text-right">มุมขวาล่าง</span>
                  <div className="w-full py-2 text-center text-xl bg-white rounded-lg border border-pink-50">{customEmojis.bottomRight}</div>
                </div>
              </div>

              {/* Emoji Picker */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                {/* Search Bar */}
                <div className="p-2 border-b border-gray-50 flex gap-2 items-center bg-gray-50/30">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="ค้นหาอิโมจิ"
                      value={emojiSearch}
                      onChange={(e) => setEmojiSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-pink-100 focus:border-pink-300 outline-none shadow-sm"
                    />
                    <Sparkles size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-pink-300" />
                    {emojiSearch && (
                      <button
                        onClick={() => setEmojiSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories - Only show when NOT searching */}
                {!emojiSearch && (
                  <div className="flex overflow-x-auto border-b border-gray-50 scrollbar-hide">
                    {dynamicCategories.map((cat, idx) => (
                      <button
                        key={cat.category}
                        onClick={() => setActiveEmojiCategory(idx)}
                        className={`px-3 py-2 text-[10px] font-bold whitespace-nowrap transition-colors ${activeEmojiCategory === idx ? 'bg-pink-50 text-pink-500 border-b-2 border-pink-500' : 'text-gray-400 hover:bg-gray-50'}`}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-3 grid grid-cols-4 gap-2 h-[160px] overflow-y-auto custom-scrollbar">
                  {isEmojiLoading && !emojiSearch ? (
                    <div className="col-span-4 h-full flex items-center justify-center flex-col gap-2 text-gray-400">
                      <RefreshCw size={24} className="animate-spin text-pink-300" />
                      <span className="text-[10px]">กำลังโหลดอิโมจิจาก GitHub...</span>
                    </div>
                  ) : emojiFetchError && !emojiSearch ? (
                    <div className="col-span-4 h-full flex items-center justify-center flex-col gap-2 p-4 text-center">
                      <Ban size={24} className="text-pink-300" />
                      <span className="text-[10px] text-gray-500 leading-tight">{emojiFetchError}</span>
                      <button
                        onClick={() => setFetchTrigger(prev => prev + 1)}
                        className="mt-1 px-3 py-1 bg-pink-500 text-white text-[10px] rounded-full font-bold hover:bg-pink-600 transition-colors"
                      >
                        ลองใหม่
                      </button>
                      <span className="text-[9px] text-gray-400 mt-1 italic">(กำลังใช้อิโมจิสำรองแบบออฟไลน์)</span>
                    </div>
                  ) : emojiSearch ? (
                    // Search Results
                    Object.entries(fetchedEmojis)
                      .filter(([emoji, keywords]) =>
                        keywords.some(k => k.toLowerCase().includes(emojiSearch.toLowerCase()))
                      )
                      .slice(0, 100) // Limit results for performance
                      .map(([emoji], idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCustomEmojis(prev => ({ ...prev, [activeCorner]: emoji }));
                            // setEmojiSearch(''); // Optional: clear search after picking
                          }}
                          className="aspect-square flex items-center justify-center text-2xl hover:bg-pink-50 rounded-lg transition-all active:scale-90"
                        >
                          {emoji}
                        </button>
                      ))
                  ) : (
                    // Categorized Icons
                    dynamicCategories[activeEmojiCategory]?.icons.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCustomEmojis(prev => ({ ...prev, [activeCorner]: emoji }))}
                        className="aspect-square flex items-center justify-center text-2xl hover:bg-pink-50 rounded-lg transition-all active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))
                  )}

                  {emojiSearch && Object.entries(fetchedEmojis).filter(([emoji, keywords]) =>
                    keywords.some(k => k.toLowerCase().includes(emojiSearch.toLowerCase()))
                  ).length === 0 && (
                      <div className="col-span-4 py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                        <span>ไม่พบอิโมจิที่ค้นหา 😿</span>
                        <button
                          onClick={() => setEmojiSearch('')}
                          className="text-pink-500 hover:underline"
                        >
                          ล้างการค้นหา
                        </button>
                      </div>
                    )}
                </div>
                <div className="p-2 bg-gray-50 text-[10px] text-gray-400 text-center italic border-t border-gray-100">
                  {emojiSearch ? `ผลการค้นหาสำหรับ "${emojiSearch}"` : 'คลิกที่มุมด้านบนแล้วเลือกอิโมจิที่ต้องการ ✨'}
                </div>
              </div>
            </div>
          )}
          {/* 3. Filters Slider */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="text-pink-500" size={16} /> ฟิลเตอร์
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {sortedFilters.map((filter) => {
                const isActive = selectedFilter === filter.id;
                const isFav = favoriteFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${isActive ? 'bg-pink-50 border-pink-400 text-pink-500' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span
                      onClick={(e) => toggleFavorite(e, filter.id)}
                      className={`transition-colors ${isFav ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                    >
                      <Star size={12} fill={isFav ? 'currentColor' : 'none'} />
                    </span>
                    {filter.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Text Editor */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Type size={16} /> ข้อความ 🩷 (สามารถแก้ไขได้)
            </h3>
            <div className="flex flex-col gap-3 bg-white/50 p-4 rounded-2xl border border-white">
              <input type="text" value={footerTitle} onChange={(e) => setFooterTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm outline-none" maxLength={25} />
              <input type="text" value={footerSubtitle} onChange={(e) => setFooterSubtitle(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm outline-none" maxLength={30} />
            </div>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex gap-4">
            <button onClick={handleDownload} className="flex-1 bg-[#FF5C8D] hover:bg-[#ff407b] text-white py-3.5 rounded-full font-bold shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95">
              <Download size={20} /> ดาวน์โหลด
            </button>
            <button onClick={onRetake} className="flex-1 bg-white border-2 border-pink-200 text-pink-500 hover:bg-pink-50 py-3.5 rounded-full font-bold flex justify-center items-center gap-2 transition-all active:scale-95">
              <RefreshCw size={20} /> ถ่ายใหม่
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}