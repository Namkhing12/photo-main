'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Download, RefreshCw, Ban, X, Type, Lock, Image as ImageIcon, Star, Sparkles, Palette, Smile } from 'lucide-react';
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
  { id: 'Chinese New Year', src: '🧧', name: '🧧 CNY', type: 'emoji', isPremium: false },
  { id: 'Christmas', src: '🎄', name: '🎄 Xmas', type: 'emoji', isPremium: false },
  { id: 'birthday', src: '🎂', name: '🎂 Birthday', type: 'emoji', isPremium: false },
  { id: 'love', src: '❤️', name: '❤️ Love', type: 'emoji', isPremium: false },
  { id: 'space', src: '🚀', name: '🚀 Galaxy', type: 'emoji', isPremium: false },
  { id: 'cat', src: '🐱', name: '🐱 Meow', type: 'emoji', isPremium: false },
  { id: 'custom', src: '✨', name: '✨ เลือกเอง', type: 'emoji', isPremium: false },
  { id: 'heart-frame', src: '/frames/heart-frame.png', name: '❤️ Heart PNG', type: 'image', isPremium: true },
  { id: 'stars-frame', src: '/frames/stars-frame.png', name: '✨ Stars PNG', type: 'image', isPremium: true },
  { id: 'unicorn', src: '🦄', name: '🦄 Uni', type: 'emoji', isPremium: true }
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

  const styleBase = "absolute text-3xl md:text-4xl drop-shadow-md select-none z-20 pointer-events-none";

  const renderEmojis = (tl: string, tr: string, bl: string, br: string) => (
    <>
      <div className={`${styleBase} top-2 left-2`}>{tl}</div>
      <div className={`${styleBase} top-2 right-2`}>{tr}</div>
      <div className={`${styleBase} bottom-2 left-2`}>{bl}</div>
      <div className={`${styleBase} bottom-2 right-2`}>{br}</div>
    </>
  );

  if (id === 'cute') return renderEmojis('🧸', '🎀', '🌸', '🍭');
  if (id === 'sparkle') return renderEmojis('✨', '💖', '🌟', '✨');
  if (id === 'nature') return renderEmojis('🌿', '🍃', '🌼', '🍄');
  if (id === 'cool') return renderEmojis('😎', '🔥', '🎸', '👾');
  if (id === 'Chinese New Year') return renderEmojis('🧧', '🏮', '🔴', '🇨🇳');
  if (id === 'Christmas') return renderEmojis('🎄', '🎅', '🎁', '🦌');
  if (id === 'birthday') return renderEmojis('🎂', '🎈', '🎉', '🕯️');
  if (id === 'love') return renderEmojis('❤️', '💌', '🌹', '💋');
  if (id === 'space') return renderEmojis('🚀', '🪐', '👽', '🌠');
  if (id === 'cat') return renderEmojis('🐱', '🐾', '🧶', '🐟');
  if (id === 'unicorn') return renderEmojis('🦄', '✨', '🌈', '💖');
  if (id === 'custom') return renderEmojis(customEmojis?.topLeft || '✨', customEmojis?.topRight || '💖', customEmojis?.bottomLeft || '🌟', customEmojis?.bottomRight || '✨');
  return null;
};

const convertTailwindToCssFilter = (classNameString: string) => {
  if (!classNameString) return 'none';
  const classes = classNameString.split(' ');
  const filters: string[] = [];

  classes.forEach(cls => {
    if (cls.startsWith('contrast-')) {
      const val = cls.match(/contrast-\[?([\d.]+)%?\]?/);
      if (val) filters.push(`contrast(${val[1].includes('.') ? val[1] : parseInt(val[1]) / 100})`);
      else filters.push(`contrast(${parseInt(cls.replace('contrast-', '')) / 100})`);
    } else if (cls.startsWith('brightness-')) {
      const val = cls.match(/brightness-\[?([\d.]+)%?\]?/);
      if (val) filters.push(`brightness(${val[1].includes('.') ? val[1] : parseInt(val[1]) / 100})`);
      else filters.push(`brightness(${parseInt(cls.replace('brightness-', '')) / 100})`);
    } else if (cls.startsWith('saturate-')) {
      const val = cls.match(/saturate-\[?([\d.]+)%?\]?/);
      if (val) filters.push(`saturate(${val[1].includes('.') ? val[1] : parseInt(val[1]) / 100})`);
      else filters.push(`saturate(${parseInt(cls.replace('saturate-', '')) / 100})`);
    } else if (cls.startsWith('sepia')) {
      const val = cls.match(/sepia-\[?\.?([\d.]+)\]?/);
      if (val) filters.push(`sepia(${val[1]})`);
      else filters.push('sepia(1)');
    } else if (cls === 'grayscale') filters.push('grayscale(1)');
    else if (cls === 'invert') filters.push('invert(1)');
    else if (cls.startsWith('hue-rotate-')) {
      const val = cls.match(/hue-rotate-\[?(-?\d+)deg\]?/);
      if (val) filters.push(`hue-rotate(${val[1]}deg)`);
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
  const [selectedFrameOverlay, setSelectedFrameOverlay] = useState<string | null>(null);
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
  const [favoriteFilters, setFavoriteFilters] = useState<string[]>([]);
  const [footerTitle, setFooterTitle] = useState('Photo Booth');
  const [footerSubtitle, setFooterSubtitle] = useState('2026 By PhotoCute');
  const [activeTab, setActiveTab] = useState<'frame' | 'emoji' | 'filter' | 'text'>('frame');

  const stripRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('favoriteFilters');
    if (saved) try { setFavoriteFilters(JSON.parse(saved)); } catch (e) { }

    const fetchEmojis = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort('timeout'), 10000);
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
          catData.forEach((item: any) => {
            const isHeart = item.description?.toLowerCase().includes('heart') || item.category?.toLowerCase().includes('heart') || item.aliases?.some((a: string) => a.toLowerCase().includes('heart'));
            if (isHeart) heartIcons.push(item.emoji);
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item.emoji);
          });
          let formatted = Object.entries(groups).map(([name, icons]) => ({ category: name, icons: icons.slice(0, 48) }));
          if (heartIcons.length > 0) formatted = [{ category: 'heart', icons: Array.from(new Set(heartIcons)).slice(0, 48) }, ...formatted];
          setDynamicCategories(formatted);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') setEmojiFetchError('ไม่สามารถโหลดอิโมจิได้');
      } finally {
        clearTimeout(timeoutId);
        setIsEmojiLoading(false);
      }
    };
    fetchEmojis();
  }, [fetchTrigger]);

  React.useEffect(() => { localStorage.setItem('favoriteFilters', JSON.stringify(favoriteFilters)); }, [favoriteFilters]);

  const toggleFavorite = (e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    setFavoriteFilters(prev => prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]);
  };

  const sortedFilters = useMemo(() => {
    return [...filters].sort((a, b) => {
      const aIsFav = favoriteFilters.includes(a.id);
      const bIsFav = favoriteFilters.includes(b.id);
      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      return 0;
    });
  }, [favoriteFilters]);

  const activeFilterClass = filters.find(f => f.id === selectedFilter)?.class || '';

  const handleDownload = async () => {
    if (stripRef.current && !loading) {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const cssFilter = convertTailwindToCssFilter(activeFilterClass);
        const processedImages = new Map<number, string>();
        const imageElements = stripRef.current.querySelectorAll('.photo-item');
        await Promise.all(Array.from(imageElements).map(async (img: any, index) => {
          // ประกันว่ารูปโหลดเสร็จ 100% ก่อนประมวลผล
          if (!img.complete) {
            await new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
          }

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            if (cssFilter !== 'none' && 'filter' in ctx) ctx.filter = cssFilter;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            processedImages.set(index, canvas.toDataURL('image/png'));
          }
        }));

        const canvas = await html2canvas(stripRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          onclone: (clonedDoc) => {
            const container = clonedDoc.querySelector('.photo-strip-container') as HTMLElement;
            if (container) {
              // ลบ transform เพื่อให้ html2canvas จับภาพได้ตรงตำแหน่ง (สำคัญมากในมือถือ)
              container.style.transform = 'none';
              container.style.display = 'flex'; // มั่นใจว่ามองเห็น

              if (processedImages.size > 0) {
                // เจาะจงหาเฉพาะรูปที่อยู่ใน container นี้เท่านั้น
                const clonedImages = container.querySelectorAll('.photo-item');
                clonedImages.forEach((img: any, index) => {
                  if (processedImages.has(index)) {
                    img.src = processedImages.get(index)!;
                    img.style.filter = 'none';
                    img.style.WebkitFilter = 'none';
                  }
                });
              }
            }
          }
        });

        canvas.toBlob(async (blob) => {
          if (!blob) throw new Error('Canvas to Blob failed');
          const fileName = `photocute-${Date.now()}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: 'PhotoCute', text: 'Boom!' }); } catch (shareErr: any) { if (shareErr.name !== 'AbortError') fallbackDownload(blob, fileName); }
          } else { fallbackDownload(blob, fileName); }
          setLoading(false);
        }, 'image/png');
      } catch (err) {
        alert("เกิดข้อผิดพลาด: " + err);
        setLoading(false);
      }
    }
  };

  const fallbackDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="w-full h-[100dvh] bg-[#FFF0F5] flex flex-col items-center font-sans overflow-hidden overscroll-behavior-none">
      {/* Header - Hidden on mobile to save space */}
      <h1 className="hidden md:block text-xl md:text-2xl font-bold text-pink-500 my-4 text-center px-4">
        Photo Booth By PhotoCute
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-6xl h-full md:p-4 overflow-hidden gap-4">

        {/* --- LEFT: Shared Preview (Sticky on Mobile) --- */}
        <div className="w-full md:w-auto flex-shrink-0 flex justify-center bg-[#FFF0F5] md:bg-transparent p-4 md:p-0 z-20 shadow-sm md:shadow-none">
          <div
            ref={stripRef}
            className="photo-strip-container relative p-4 md:p-6 shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center gap-4 overflow-hidden origin-top scale-[0.5] min-[380px]:scale-[0.6] sm:scale-[0.7] md:scale-90 lg:scale-100"
            style={{
              minWidth: '320px',
              maxWidth: '380px',
              background: isCustomActive ? customColor : selectedColor.hex,
              color: (isCustomActive && customColor === '#000000') || (!isCustomActive && selectedColor.id === 'black') ? 'white' : '#333'
            }}
          >
            <div className={`grid gap-3 w-full relative z-10 ${photos.length <= 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {photos.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] overflow-hidden group bg-white rounded-sm shadow-sm border border-gray-100/50">
                  <img
                    src={img}
                    alt={`snap-${idx}`}
                    className={`photo-item w-full h-full object-cover ${activeFilterClass}`}
                    style={{ transform: 'translateZ(0)', filter: convertTailwindToCssFilter(activeFilterClass) }}
                  />
                  {/* Remove Button - Hidden during html2canvas but visible to user */}
                  <button
                    onClick={() => onRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 z-40"
                    data-html2canvas-ignore="true"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
            {renderOverlayFrame(selectedFrameOverlay, customEmojis)}
            <div className="mt-4 text-center font-bold tracking-widest uppercase opacity-80 break-words w-full px-2 relative z-30" style={{ color: 'inherit' }}>
              <div className="text-sm">{footerTitle}</div>
              <div className="text-[10px] mt-1 font-medium opacity-70">{footerSubtitle}</div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Tools Panel (Bottom Sheet style on Mobile) --- */}
        <div className="flex-1 w-full bg-white md:bg-white/80 md:backdrop-blur-sm rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl md:shadow-lg border-t md:border border-white/50 flex flex-col overflow-hidden">

          {/* Tab Navigation */}
          <div className="flex justify-around items-center border-b border-gray-100 p-2 md:p-4 bg-white/50 backdrop-blur-sm z-30">
            <button onClick={() => setActiveTab('frame')} className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all ${activeTab === 'frame' ? 'text-pink-500 bg-pink-50' : 'text-gray-400'}`}>
              <Palette size={20} />
              <span className="text-[10px] font-bold mt-1">กรอบ/สี</span>
            </button>
            <button onClick={() => setActiveTab('emoji')} className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all ${activeTab === 'emoji' ? 'text-pink-500 bg-pink-50' : 'text-gray-400'}`}>
              <Smile size={20} />
              <span className="text-[10px] font-bold mt-1">อิโมจิ</span>
            </button>
            <button onClick={() => setActiveTab('filter')} className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all ${activeTab === 'filter' ? 'text-pink-500 bg-pink-50' : 'text-gray-400'}`}>
              <Sparkles size={20} />
              <span className="text-[10px] font-bold mt-1">ฟิลเตอร์</span>
            </button>
            <button onClick={() => setActiveTab('text')} className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all ${activeTab === 'text' ? 'text-pink-500 bg-pink-50' : 'text-gray-400'}`}>
              <Type size={20} />
              <span className="text-[10px] font-bold mt-1">ข้อความ</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 custom-scrollbar">
            {activeTab === 'frame' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section className="mb-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">สีพื้นหลัง / กราเดียนท์</h3>
                  <div className="flex flex-wrap gap-2">
                    {frameColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => { setIsCustomActive(false); setSelectedColor(color); }}
                        className={`w-10 h-10 rounded-full border-2 transform transition-all shadow-sm ${(!isCustomActive && selectedColor.id === color.id) ? 'border-pink-500 scale-110' : 'border-white'}`}
                        style={{ background: color.hex }}
                      />
                    ))}
                    <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden" style={{ background: customColor }}>
                      <input type="color" value={customColor} onChange={(e) => { setCustomColor(e.target.value); setIsCustomActive(true); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Sparkles size={16} className={isCustomActive ? 'text-pink-500' : 'text-gray-400'} />
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">รูปแบบกรอบ</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
                    {overlayFrames.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrameOverlay(frame.id)}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all relative ${selectedFrameOverlay === frame.id ? 'bg-pink-100 border-2 border-pink-400' : 'bg-gray-50 border border-gray-100'}`}
                      >
                        {frame.id === 'none' ? <Ban className="text-gray-300" /> : (
                          <div className="relative">
                            <span className="text-xl">
                              {frame.type === 'image' ? <ImageIcon size={20} className="text-pink-400" /> : frame.src}
                            </span>
                            {frame.isPremium && (
                              <div className="absolute -top-3 -right-3 bg-white p-0.5 rounded-full shadow-sm">
                                <Lock size={8} className="text-yellow-500" fill="currentColor" />
                              </div>
                            )}
                          </div>
                        )}
                        {frame.type === 'image' && <span className="absolute bottom-1 left-0 right-0 text-[8px] font-bold text-center opacity-60">PNG</span>}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'emoji' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(corner => (
                    <button key={corner} onClick={() => setActiveCorner(corner)} className={`p-3 rounded-2xl border transition-all ${activeCorner === corner ? 'bg-pink-50 border-pink-300 shadow-sm' : 'border-gray-100 bg-gray-50'}`}>
                      <span className="text-[10px] text-gray-400 block mb-1 uppercase text-center font-bold">{corner}</span>
                      <div className="text-2xl text-center">{(customEmojis as any)[corner]}</div>
                    </button>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-3 border-b flex gap-2 items-center bg-white/50">
                    <input type="text" placeholder="ค้นหา..." value={emojiSearch} onChange={e => setEmojiSearch(e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-pink-200" />
                    <button
                      onClick={() => setCustomEmojis({ topLeft: '✨', topRight: '💖', bottomLeft: '🌟', bottomRight: '✨' })}
                      className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                      title="ล้างทั้งหมด"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                  <div className="p-3 grid grid-cols-6 gap-2 h-48 overflow-y-auto">
                    {isEmojiLoading ? <div className="col-span-6 text-center text-gray-400 text-xs py-10">กำลังโหลด...</div> : (
                      (emojiSearch ? Object.entries(fetchedEmojis).filter(([e, k]) => k.some(ki => ki.includes(emojiSearch.toLowerCase()))).slice(0, 72).map(([e]) => e) : dynamicCategories[activeEmojiCategory]?.icons || [])
                        .map((emoji, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setCustomEmojis(p => ({ ...p, [activeCorner]: emoji }));
                              setSelectedFrameOverlay('custom'); // Auto-switch to custom frame
                            }}
                            className="text-2xl h-10 flex items-center justify-center hover:bg-white rounded-lg transition-transform active:scale-90"
                          >
                            {emoji}
                          </button>
                        ))
                    )}
                  </div>
                  {!emojiSearch && (
                    <div className="flex overflow-x-auto p-2 bg-white border-t border-gray-100 no-scrollbar">
                      {dynamicCategories.map((cat, i) => (
                        <button key={cat.category} onClick={() => setActiveEmojiCategory(i)} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap mr-2 font-bold transition-colors ${activeEmojiCategory === i ? 'bg-pink-500 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>{cat.category}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'filter' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-3 gap-3">
                  {sortedFilters.map(f => {
                    const isF = favoriteFilters.includes(f.id);
                    return (
                      <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedFilter === f.id ? 'bg-pink-50 border-pink-300' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="relative mb-2">
                          <div className={`w-12 h-12 rounded-lg bg-gray-200 ${f.class}`} />
                          <div onClick={e => toggleFavorite(e, f.id)} className={`absolute -top-2 -right-2 p-1 rounded-full shadow-sm bg-white ${isF ? 'text-yellow-400' : 'text-gray-300'}`}>
                            <Star size={10} fill={isF ? 'currentColor' : 'none'} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-center">{f.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">หัวข้อหลัก</label>
                  <input type="text" value={footerTitle} onChange={e => setFooterTitle(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-pink-200 outline-none" placeholder="Photo Booth" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">คำอธิบาย</label>
                  <input type="text" value={footerSubtitle} onChange={e => setFooterSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-pink-200 outline-none" placeholder="2024 By PhotoCute" />
                </div>
              </div>
            )}
          </div>

          {/* Persistent Action Buttons */}
          <div className="relative mt-auto p-4 md:p-6 bg-white/90 backdrop-blur-md border-t md:border-t-0 flex gap-4 z-40 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6">
            <button onClick={handleDownload} disabled={loading} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full font-bold shadow-xl flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
              {loading ? 'กำลังประมวลผล...' : 'ดาวน์โหลด'}
            </button>
            <button onClick={onRetake} disabled={loading} className="flex-1 bg-white border-2 border-pink-100 text-pink-400 hover:bg-pink-50 py-4 rounded-full font-bold shadow-sm flex justify-center items-center gap-2 transition-all active:scale-95">
              <RefreshCw size={20} /> ถ่ายใหม่
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}