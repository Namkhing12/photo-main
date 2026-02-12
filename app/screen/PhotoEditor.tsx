'use client';

import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Ban, X, Type, Lock, Image as ImageIcon, Star, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { filters } from '../lib/constants';

const frameColors = [
  { id: 'white', hex: '#ffffff', isPremium: false },
  { id: 'black', hex: '#000000', isPremium: false },
  { id: 'pink', hex: '#fbcfe8', isPremium: false },
  { id: 'blue', hex: '#bfdbfe', isPremium: false },
  { id: 'cream', hex: '#fef3c7', isPremium: false },

  //สีพรีเมียม 
  { id: 'emerald', hex: '#a7f3d0', isPremium: true },
  { id: 'teal', hex: '#99f6e4', isPremium: true },
  { id: 'cyan', hex: '#a5f3fc', isPremium: true },
  { id: 'blue-premium', hex: '#bfdbfe', isPremium: true },
  { id: 'indigo', hex: '#c7d2fe', isPremium: true },
  { id: 'violet', hex: '#ddd6fe', isPremium: true },
  { id: 'purple', hex: '#e9d5ff', isPremium: true },
  { id: 'fuchsia', hex: '#f5d0fe', isPremium: true },
  { id: 'rose', hex: '#fecdd3', isPremium: true },


  { id: 'gradient-1', hex: 'linear-gradient(135deg, #fbcfe8 0%, #e9d5ff 100%)', isPremium: true },
  { id: 'gradient-2', hex: 'linear-gradient(135deg, #fef08a 0%, #fed7aa 100%)', isPremium: true },
  { id: 'gradient-3', hex: 'linear-gradient(135deg, #bfdbfe 0%, #a5f3fc 100%)', isPremium: true },
  { id: 'gradient-sunset', hex: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 50%, #fbcfe8 100%)', isPremium: true },
  { id: 'gradient-ocean', hex: 'linear-gradient(135deg, #bbf7d0 0%, #93c5fd 100%)', isPremium: true },
  { id: 'gradient-nature', hex: 'linear-gradient(135deg, #d9f99d 0%, #86efac 100%)', isPremium: true },
  { id: 'gradient-dusk', hex: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)', isPremium: true },
  { id: 'gradient-sweet', hex: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #fda4af 100%)', isPremium: true },

  // --- ลวดลาย ---
  { id: 'rainbow', hex: 'linear-gradient(90deg, #fecaca, #fef08a, #bfdbfe)', isPremium: true },
];

// --- 2. ข้อมูลรูปกรอบ (Overlay Frames) ---
const overlayFrames = [
  { id: 'none', src: '', name: 'ไม่ใส่กรอบ' },
  { id: 'cute', src: '🧸', name: '🧸 Cute' },
  { id: 'sparkle', src: '✨', name: '✨ Sparkle' },
  { id: 'nature', src: '🌿', name: '🌿 Nature' },
  { id: 'cool', src: '😎', name: '😎 Cool' }
];

// --- Helper: Render Frame Overlay as DOM Elements ---
const renderOverlayFrame = (id: string | null) => {
  if (!id || id === 'none') return null;

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

  // เปลี่ยนจาก Sticker เป็น Frame Overlay
  const [selectedFrameOverlay, setSelectedFrameOverlay] = useState<string | null>(null);

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState<string>(filterId);
  const [favoriteFilters, setFavoriteFilters] = useState<string[]>([]);

  const [footerTitle, setFooterTitle] = useState('Photo Booth');
  const [footerSubtitle, setFooterSubtitle] = useState('2025 By PhotoCute');

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
  }, []);

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

      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center px-4">
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
              background: selectedColor.hex,
              color: selectedColor.id === 'black' ? 'white' : '#333'
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
            {renderOverlayFrame(selectedFrameOverlay)}

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

                    setSelectedColor(color);
                  }}
                  className={`w-10 h-10 rounded-full shadow-sm transition-all flex-shrink-0 border-2 ${selectedColor.id === color.id ? (color.isPremium ? 'border-red-500' : 'border-pink-500') : 'border-gray-200'}`}
                  style={{ background: color.hex }}
                >
                  {color.isPremium && <Lock size={12} className="text-white mx-auto" />}
                </button>
              ))}
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
                  onClick={() => setSelectedFrameOverlay(frame.id)}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center overflow-hidden transition-all relative
                    ${selectedFrameOverlay === frame.id
                      ? 'border-2 border-pink-500 ring-2 ring-pink-100 bg-pink-50'
                      : 'border border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  {frame.id === 'none' ? (
                    <Ban size={24} className="text-gray-400" />
                  ) : (
                    <span className="text-2xl">{frame.src}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
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