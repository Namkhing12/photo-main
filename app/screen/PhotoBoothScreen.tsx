'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
  Camera, ChevronDown, ImagePlus, Timer,
  RefreshCw, ArrowRight, Trash2, SwitchCamera,
  ZoomIn, ZoomOut, Star, RotateCcw, Grid3x3, CameraOff, Loader2,
  Sparkles, Lightbulb
} from 'lucide-react';
import { filters, filterGroups, getFilterStyle, type FilterGroup } from '../lib/constants';
import Confetti from '../src/Confetti';
import { useFavoriteFilters } from '../lib/useFavoriteFilters';

// --- ส่วนประกอบไอคอนเฟรมคงเดิม (ย่อเพื่อประหยัดพื้นที่) ---
const FrameIcon = ({ type }: { type: string }) => {
  const baseClass = "border border-blush-400/80 bg-blush-100 rounded-[1px]";
  if (type === '2-v') return <div className="flex flex-col gap-[1px] w-3 h-5"><div className={`w-full h-1/2 ${baseClass}`}></div><div className={`w-full h-1/2 ${baseClass}`}></div></div>;
  if (type === '3-v') return <div className="flex flex-col gap-[1px] w-3 h-5"><div className={`w-full h-1/3 ${baseClass}`}></div><div className={`w-full h-1/3 ${baseClass}`}></div><div className={`w-full h-1/3 ${baseClass}`}></div></div>;
  if (type === '4-v') return <div className="flex flex-col gap-[1px] w-3 h-5"><div className={`w-full h-1/4 ${baseClass}`}></div><div className={`w-full h-1/4 ${baseClass}`}></div><div className={`w-full h-1/4 ${baseClass}`}></div><div className={`w-full h-1/4 ${baseClass}`}></div></div>;
  if (type === '4-grid') return <div className="grid grid-cols-2 gap-[1px] w-4 h-4"><div className={`aspect-square ${baseClass}`}></div><div className={`aspect-square ${baseClass}`}></div><div className={`aspect-square ${baseClass}`}></div><div className={`aspect-square ${baseClass}`}></div></div>;
  if (type === '6-grid') return <div className="grid grid-cols-2 gap-[1px] w-4 h-5"><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div></div>;
  if (type === '8-grid') return <div className="grid grid-cols-2 gap-[1px] w-4 h-6"><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div><div className={`h-1.5 ${baseClass}`}></div></div>;
  if (type === '10-grid') return <div className="grid grid-cols-2 gap-[1px] w-4 h-8">{[...Array(10)].map((_, i) => (<div key={i} className={`h-1.5 ${baseClass}`}></div>))}</div>;
  return <div className={`w-4 h-4 ${baseClass}`}></div>;
};

// --- ข้อมูลตัวเลือกคงเดิม ---
type FrameOption = { id: string; label: string; count: number; iconType: string; };
const frameOptions: FrameOption[] = [
  { id: '1-full', label: '1 รูปภาพ', count: 1, iconType: '1-full' },
  { id: '2-strip', label: '2 รูปภาพ', count: 2, iconType: '2-v' },
  { id: '4-grid', label: '4 รูปภาพ', count: 4, iconType: '4-grid' },
  { id: '6-grid', label: '6 รูปภาพ', count: 6, iconType: '6-grid' },
  { id: '8-grid', label: '8 รูปภาพ', count: 8, iconType: '8-grid' },
  { id: '10-grid', label: '10 รูปภาพ', count: 10, iconType: '10-grid' },
];
const timerOptions = [0, 3, 5, 10];

/** รูปที่ถ่าย + ฟิลเตอร์ที่เลือกไว้ตอนถ่าย (แต่ละรูปฟิลเตอร์ต่างกันได้) */
export type Shot = { src: string; filterId: string };
interface PhotoBoothProps { onFinish?: (shots: Shot[]) => void; }

export default function PhotoBooth({ onFinish }: PhotoBoothProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Shot[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(frameOptions[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const { favoriteFilters, toggleFavorite, sortedFilters } = useFavoriteFilters();
  const [timerSetting, setTimerSetting] = useState<number>(0);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [cameraKey, setCameraKey] = useState(0); // เปลี่ยนค่าเพื่อ remount กล้อง (ลองใหม่)
  const [showGrid, setShowGrid] = useState(false);
  // ไฟวงแหวน: ทำขอบจอให้สว่าง ช่วยส่องหน้าตอนใช้กล้องหน้าในที่มืด (แตะวน ปิด → ขาว → อุ่น)
  const [ringLight, setRingLight] = useState<'off' | 'white' | 'warm'>('off');
  const cycleRingLight = () => setRingLight(r => (r === 'off' ? 'white' : r === 'white' ? 'warm' : 'off'));
  const [flashKey, setFlashKey] = useState(0);
  const [reviewShot, setReviewShot] = useState<Shot | null>(null); // ค้างภาพที่เพิ่งถ่าย 1 วินาที
  const [filterGroup, setFilterGroup] = useState<FilterGroup | 'all' | 'fav'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false); // มือถือ: แถบฟิลเตอร์พับเก็บได้ (PC แสดงตลอด)
  // Zoom State (Digital Zoom)
  const [zoom, setZoom] = useState(1);
  const minZoom = 1;
  const maxZoom = 3;

  // จับภาพจาก <video> โดยตรงที่ความละเอียดเต็มของกล้อง
  // (getScreenshot() ของ react-webcam ใช้ขนาดที่แสดงบนจอ เช่น ~280px บนมือถือ → รูปเบลอ)
  // ตัดเป็น 3:4 ตรงกลางแบบเดียวกับ object-cover ที่เห็นบนจอ + ซูม + กลับด้านกล้องหน้า
  const captureFrame = (zoomLevel: number): string | null => {
    const video = webcamRef.current?.video;
    if (!video || !video.videoWidth || !video.videoHeight) return null;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const target = 3 / 4;
    let sw = vw, sh = vh;
    if (vw / vh > target) sw = vh * target; else sh = vw / target;
    sw /= zoomLevel;
    sh /= zoomLevel;
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;
    // ไม่ขยายเกินความละเอียดจริง และจำกัดสูงสุด 1600px เพื่อไม่ให้หน่วยความจำมือถือเต็ม (เฟรม 10 รูป)
    const scale = Math.min(1, 1600 / sh);
    const ow = Math.round(sw * scale);
    const oh = Math.round(sh * scale);
    const canvas = document.createElement('canvas');
    canvas.width = ow;
    canvas.height = oh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (facingMode === 'user') { ctx.translate(ow, 0); ctx.scale(-1, 1); } // กล้องหน้า: ให้ตรงกับภาพกระจกที่เห็น
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, ow, oh);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const toggleCamera = useCallback(() => { setCameraStatus('loading'); setFacingMode(prev => (prev === 'user' ? 'environment' : 'user')); }, []);
  const retryCamera = () => { setCameraStatus('loading'); setCameraKey(k => k + 1); };

  // เก็บ interval ไว้เพื่อยกเลิกเมื่อ unmount / เปลี่ยนเฟรม / รีเซ็ต
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cheeseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reviewRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCapturingRef = useRef(false);
  const endReview = useCallback(() => {
    if (reviewRef.current) { clearTimeout(reviewRef.current); reviewRef.current = null; }
    setReviewShot(null);
  }, []);
  const stopCountdown = useCallback(() => {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    if (cheeseRef.current) { clearTimeout(cheeseRef.current); cheeseRef.current = null; }
    endReview();
    isCapturingRef.current = false;
    setCountDown(null);
  }, [endReview]);
  useEffect(() => () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (cheeseRef.current) clearTimeout(cheeseRef.current);
    if (reviewRef.current) clearTimeout(reviewRef.current);
  }, []);

  const startCapture = useCallback(() => {
    if (isCapturingRef.current || reviewRef.current) return; // กันกดซ้ำระหว่างนับถอยหลัง/ประมวลผล/ค้างภาพ
    isCapturingRef.current = true;
    setShowFrameMenu(false); setShowTimerMenu(false);
    const maxCount = selectedFrame.count;
    const takePhoto = () => {
      try {
        const shot = captureFrame(zoom);
        if (!shot) {
          alert('ยังไม่พร้อมถ่ายภาพ: โปรดตรวจสอบว่ากล้องเปิดอยู่');
          return;
        }
        setFlashKey(k => k + 1); // เอฟเฟกต์แฟลช
        // ไม่ให้เกินจำนวนช่องของเฟรม
        const newShot: Shot = { src: shot, filterId: selectedFilter };
        setPhotos(prev => (prev.length >= maxCount ? prev : [...prev, newShot]));
        // ค้างภาพที่ถ่ายไว้บนจอกล้อง 1 วินาที ให้ดูผลก่อนถ่ายรูปต่อไป
        setReviewShot(newShot);
        if (reviewRef.current) clearTimeout(reviewRef.current);
        reviewRef.current = setTimeout(() => { reviewRef.current = null; setReviewShot(null); }, 1000);
      } finally {
        isCapturingRef.current = false;
        setCountDown(null);
      }
    };
    if (timerSetting === 0) { takePhoto(); return; }
    let time = timerSetting; setCountDown(time);
    countdownRef.current = setInterval(() => {
      time -= 1; setCountDown(time);
      if (time <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = null;
        // โชว์ "ยิ้มมม~ 🧀" แป๊บนึงก่อนกดชัตเตอร์
        cheeseRef.current = setTimeout(() => { cheeseRef.current = null; takePhoto(); }, 550);
      }
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSetting, zoom, selectedFrame.count, facingMode, selectedFilter]);

  const resetAll = () => { stopCountdown(); setPhotos([]); setZoom(1); };
  const deletePhoto = (indexToDelete: number) => { endReview(); setPhotos(prev => prev.filter((_, index) => index !== indexToDelete)); };
  const handleUploadClick = () => fileInputRef.current?.click();
  // Utility to resize image
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        URL.revokeObjectURL(objectUrl);
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // PNG คงความโปร่งใส ที่เหลือแปลงเป็น JPEG (รองรับทุกเบราว์เซอร์ เช่น HEIC/WebP/GIF)
          resolve(file.type === 'image/png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95));
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้')); };
      img.src = objectUrl;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // รีเซ็ต input เพื่อให้เลือกไฟล์เดิมซ้ำได้
    event.target.value = '';
    if (file) {
      if (photos.length >= selectedFrame.count) {
        alert(`เฟรมนี้ใส่ได้ ${selectedFrame.count} รูปแล้ว ลบรูปเดิมก่อนหากต้องการเพิ่มรูปใหม่`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      try {
        // Resize image to max 1280x1280 to save memory and ensure html-to-image works
        const resizedImage = await resizeImage(file, 1280, 1280);
        setPhotos(prev => (prev.length >= selectedFrame.count ? prev : [...prev, { src: resizedImage, filterId: selectedFilter }]));
      } catch (error) {
        console.error("Error resizing image:", error);
        alert("เกิดข้อผิดพลาดในการโหลดรูปภาพ โปรดลองอีกครั้ง");
      }
    }
  };

  // ใช้ค่า CSS filter ชุดเดียวกับหน้าแต่งรูป/ไฟล์ดาวน์โหลด (ลำดับตามที่กำหนดในฟิลเตอร์)
  // ห้ามใช้ Tailwind class: Tailwind v4 เรียงลำดับฟังก์ชันใหม่เอง (เช่น hue-rotate ก่อน sepia) ทำให้สีก่อน/หลังถ่ายไม่ตรงกัน
  const activeFilterStyle = getFilterStyle(selectedFilter);
  const isComplete = photos.length >= selectedFrame.count;
  const closeMenus = () => { setShowFrameMenu(false); setShowTimerMenu(false); };
  const activeFilterName = filters.find(f => f.id === selectedFilter)?.name ?? '';
  const visibleFilters = sortedFilters.filter(f =>
    filterGroup === 'all' ? true
      : filterGroup === 'fav' ? favoriteFilters.includes(f.id) || f.id === 'normal'
        : f.group === filterGroup || f.id === 'normal'
  );
  const swatchPhoto = photos[photos.length - 1]?.src;

  return (
    <div className="relative w-full min-h-full font-sans text-plum" onClick={closeMenus}>
      {isComplete && <Confetti key={`${selectedFrame.id}-${photos.length}`} />}
      {ringLight !== 'off' && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] transition-opacity duration-300"
          style={{
            // ขอบหนาสว่าง + แสงฟุ้งเข้าด้านใน (ไม่บังกล้องตรงกลาง)
            boxShadow: ringLight === 'white'
              ? 'inset 0 0 0 clamp(22px, 5vmin, 48px) #ffffff, inset 0 0 clamp(60px, 14vmin, 140px) clamp(30px, 8vmin, 80px) rgba(255,255,255,0.92)'
              : 'inset 0 0 0 clamp(22px, 5vmin, 48px) #fff1d6, inset 0 0 clamp(60px, 14vmin, 140px) clamp(30px, 8vmin, 80px) rgba(255,226,180,0.9)',
          }}
        />
      )}
      {/* Aura */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-blush-300/40 blur-3xl animate-blob" />
        <div className="absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-lilac/70 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-120px] left-1/3 h-[360px] w-[360px] rounded-full bg-champagne/70 blur-3xl animate-blob animation-delay-4000" />
        <span className="absolute left-[8%] top-[22%] text-2xl text-blush-300 animate-twinkle">✦</span>
        <span className="absolute right-[10%] top-[38%] text-xl text-rosegold animate-twinkle animation-delay-2000">✧</span>
        <span className="absolute bottom-[14%] left-[14%] text-lg text-blush-400 animate-twinkle animation-delay-4000">✦</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 md:py-8">
        {/* Hero */}
        <header className="mb-3 text-center md:mb-8">
          <p className="eyebrow mb-2 hidden sm:block">✦ Photo Booth · Vol. 01 ✦</p>
          <h1 className="font-display text-3xl leading-[1.05] text-plum sm:text-5xl md:text-6xl">
            say cheese, <span className="italic text-shimmer">babe</span>
            <span className="ml-2 inline-block animate-float">🎀</span>
          </h1>
          <p className="mt-2 hidden text-sm text-plum-soft sm:block md:text-base">ถ่ายรูปสวย ๆ แต่งให้ฉ่ำ แล้วเก็บไว้เป็นความทรงจำ</p>
        </header>

        <div className="flex flex-col items-start gap-3 md:flex-row md:gap-6" onClick={(e) => e.stopPropagation()}>
          {/* ───── Studio card ───── */}
          <section className="glass flex w-full flex-1 flex-col rounded-[2rem] p-2.5 sm:p-5 md:block md:rounded-[2.5rem] md:p-7">
            {/* Controls */}
            <div className="relative z-40 mb-3 flex flex-wrap items-center justify-center gap-1.5 sm:mb-4 sm:gap-2">
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowFrameMenu(!showFrameMenu); setShowTimerMenu(false); }}
                  className={`chip min-h-[40px] px-3 text-xs sm:min-h-[44px] sm:px-4 sm:text-sm ${showFrameMenu ? '!border-blush-400 !text-blush-600 bg-white' : ''}`}
                  aria-expanded={showFrameMenu}
                >
                  <FrameIcon type={selectedFrame.iconType} />
                  <span>{selectedFrame.label}</span>
                  <ChevronDown size={14} className={`transition-transform ${showFrameMenu ? 'rotate-180' : ''}`} />
                </button>
                {showFrameMenu && (
                  <div className="glass animate-pop absolute left-0 top-full mt-2 grid w-[250px] grid-cols-2 gap-1 rounded-2xl p-2">
                    {frameOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { stopCountdown(); setSelectedFrame(option); setPhotos([]); setShowFrameMenu(false); }}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${selectedFrame.id === option.id ? 'bg-blush-100 font-semibold text-blush-600' : 'text-plum-soft hover:bg-white'}`}
                      >
                        <FrameIcon type={option.iconType} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTimerMenu(!showTimerMenu); setShowFrameMenu(false); }}
                  className={`chip min-h-[40px] px-3 text-xs sm:min-h-[44px] sm:px-4 sm:text-sm ${showTimerMenu ? '!border-blush-400 !text-blush-600 bg-white' : ''}`}
                  aria-expanded={showTimerMenu}
                >
                  <Timer size={16} />
                  <span>{timerSetting === 0 ? 'ถ่ายทันที' : `${timerSetting} วิ`}</span>
                  <ChevronDown size={14} className={`transition-transform ${showTimerMenu ? 'rotate-180' : ''}`} />
                </button>
                {showTimerMenu && (
                  <div className="glass animate-pop absolute left-0 top-full mt-2 w-[150px] rounded-2xl p-1.5">
                    {timerOptions.map((time) => (
                      <button
                        key={time}
                        onClick={() => { setTimerSetting(time); setShowTimerMenu(false); }}
                        className={`flex w-full justify-between rounded-xl px-3 py-2.5 text-sm ${timerSetting === time ? 'bg-blush-100 font-semibold text-blush-600' : 'text-plum-soft hover:bg-white'}`}
                      >
                        <span>{time === 0 ? 'ถ่ายทันที' : `${time} วินาที`}</span>
                        {timerSetting === time && <span>✦</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button onClick={handleUploadClick} disabled={isComplete || countDown !== null} className="chip min-h-[40px] px-3 text-xs sm:min-h-[44px] sm:px-4 sm:text-sm">
                <ImagePlus size={16} />
                <span className="sm:hidden">อัปโหลด</span><span className="hidden sm:inline">อัปโหลดรูป</span>
              </button>
            </div>

            {/* Camera — polaroid-style body */}
            <div className="relative mx-auto w-full max-w-[max(240px,calc((100dvh_-_280px)*0.75))] sm:max-w-[400px] md:max-w-[max(320px,min(440px,calc((100dvh_-_380px)*0.75)))]">
              {/* stickers */}
              <span className="pointer-events-none absolute -left-4 -top-5 z-50 -rotate-12 text-4xl drop-shadow-md animate-float" aria-hidden>🎀</span>
              <span className="pointer-events-none absolute -right-3 top-1/3 z-50 text-2xl text-rosegold animate-twinkle" aria-hidden>✦</span>
              <span className="pointer-events-none absolute -bottom-3 -left-2 z-50 text-xl text-blush-400 animate-twinkle animation-delay-2000" aria-hidden>✧</span>

              <div className="ring-luxe relative rounded-[2rem] bg-gradient-to-b from-white to-blush-50 p-2 pb-0 sm:p-2.5 sm:pb-0 shadow-[0_40px_80px_-30px_rgba(217,58,118,0.6),0_10px_25px_-15px_rgba(74,31,54,0.3)] md:rounded-[2.4rem] md:p-3 md:pb-0">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-blush-200 via-blush-100 to-lilac md:rounded-[1.9rem]">
                  <Webcam
                    key={cameraKey}
                    audio={false}
                    muted
                    playsInline
                    ref={webcamRef}
                    mirrored={facingMode === 'user'}
                    onUserMedia={() => setCameraStatus('ready')}
                    onUserMediaError={(err) => {
                      console.error("Camera Error:", err);
                      setCameraStatus('error');
                    }}
                    videoConstraints={{
                      facingMode: facingMode,
                      // ขอความละเอียดสูงตามสัดส่วนเซนเซอร์ 4:3 (มือถือจะหมุนเป็นแนวตั้งให้เอง) แล้วค่อยตัดเป็น 3:4
                      width: { ideal: 1920 },
                      height: { ideal: 1440 }
                    }}
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', filter: activeFilterStyle }}
                    className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-300 ease-out ${cameraStatus === 'ready' ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {/* Loading / error states */}
                  {cameraStatus !== 'ready' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-8 text-center">
                      {cameraStatus === 'loading' ? (
                        <>
                          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/70 text-blush-500 shadow-lg shadow-blush-200">
                            <Loader2 size={26} className="animate-spin" />
                          </span>
                          <p className="font-display text-xl italic text-plum">getting ready…</p>
                          <p className="text-xs text-plum-soft">กำลังเปิดกล้อง กดอนุญาตใช้กล้องได้เลยนะ</p>
                        </>
                      ) : (
                        <>
                          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/70 text-blush-500 shadow-lg shadow-blush-200">
                            <CameraOff size={26} />
                          </span>
                          <p className="font-display text-xl italic text-plum">oops, no camera</p>
                          <p className="text-xs text-plum-soft">เปิดกล้องไม่ได้ ลองอนุญาตกล้องในเบราว์เซอร์ หรืออัปโหลดรูปแทนก็ได้</p>
                          <div className="mt-1 flex gap-2">
                            <button onClick={retryCamera} className="chip px-4 py-2 text-xs"><RefreshCw size={13} /> ลองใหม่</button>
                            <button onClick={handleUploadClick} disabled={isComplete} className="btn-candy px-4 py-2 text-xs"><ImagePlus size={13} className="relative z-10" /><span className="relative z-10">อัปโหลด</span></button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {cameraStatus === 'ready' && (
                    <>
                      {/* Rule-of-thirds grid */}
                      {showGrid && (
                        <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3" aria-hidden>
                          {Array.from({ length: 9 }).map((_, i) => (
                            <span key={i} className="border-[0.5px] border-white/35" />
                          ))}
                        </div>
                      )}

                      {/* Viewfinder corners */}
                      <div className="pointer-events-none absolute inset-4 z-10" aria-hidden>
                        <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-white/80" />
                        <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-xl border-r-2 border-t-2 border-white/80" />
                        <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-white/80" />
                        <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-xl border-b-2 border-r-2 border-white/80" />
                      </div>

                      {/* filter name */}
                      <div key={selectedFilter} className="animate-pop absolute left-1/2 top-3 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-blush-600 shadow-sm backdrop-blur-md">
                        {activeFilterName}
                      </div>
                    </>
                  )}

                  {/* Top-left tools: ไฟวงแหวน */}
                  <div className="absolute left-3 top-3 z-40 flex flex-col gap-2">
                    <button
                      onClick={cycleRingLight}
                      aria-label={ringLight === 'off' ? 'เปิดไฟวงแหวน' : ringLight === 'white' ? 'ไฟวงแหวนสีขาว (แตะเพื่อเปลี่ยนเป็นโทนอุ่น)' : 'ไฟวงแหวนโทนอุ่น (แตะเพื่อปิด)'}
                      title="ไฟวงแหวน · ส่องหน้าในที่มืด"
                      aria-pressed={ringLight !== 'off'}
                      className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition-all active:scale-90 ${ringLight === 'white' ? 'border-white bg-white text-blush-600' : ringLight === 'warm' ? 'border-amber-100 bg-amber-100 text-amber-600' : 'border-white/40 bg-black/20 text-white hover:bg-blush-500'}`}
                    >
                      <Lightbulb size={16} />
                    </button>
                  </div>

                  {/* Top-right tools */}
                  <div className="absolute right-3 top-3 z-40 flex flex-col gap-2">
                    <button
                      onClick={toggleCamera}
                      aria-label="สลับกล้อง"
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-blush-500 active:scale-90"
                    >
                      <SwitchCamera size={16} />
                    </button>
                    <button
                      onClick={() => setShowGrid(g => !g)}
                      aria-label="เส้นกริด"
                      aria-pressed={showGrid}
                      className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition-all active:scale-90 ${showGrid ? 'border-white bg-white text-blush-600' : 'border-white/40 bg-black/20 text-white hover:bg-blush-500'}`}
                    >
                      <Grid3x3 size={16} />
                    </button>
                  </div>

                  {/* Countdown */}
                  {countDown !== null && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-plum/20 backdrop-blur-[2px]">
                      {countDown > 0 ? (
                        <>
                          <span key={countDown} className="animate-boing grid h-36 w-36 place-items-center rounded-full bg-white/25 shadow-[0_0_0_10px_rgba(255,255,255,0.15)] backdrop-blur-sm md:h-44 md:w-44">
                            <span className="font-display text-[6rem] italic leading-none text-white drop-shadow-[0_6px_30px_rgba(242,86,143,0.9)] md:text-[8rem]">{countDown}</span>
                          </span>
                          <span className="animate-wiggle rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-blush-600 shadow-lg">ยิ้มหวาน ๆ นะ ✦</span>
                        </>
                      ) : (
                        <span className="animate-boing font-display whitespace-nowrap text-5xl italic text-white drop-shadow-[0_6px_30px_rgba(242,86,143,0.9)] md:text-6xl">ยิ้มมม~ 🧀</span>
                      )}
                    </div>
                  )}

                  {/* ค้างภาพที่เพิ่งถ่าย 1 วินาที (แตะเพื่อข้าม) */}
                  {reviewShot && (
                    <button
                      type="button"
                      onClick={endReview}
                      aria-label="ปิดภาพที่เพิ่งถ่าย"
                      className="absolute inset-0 z-30 block h-full w-full cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={reviewShot.src} alt="ภาพที่เพิ่งถ่าย" className="h-full w-full object-cover" style={{ filter: getFilterStyle(reviewShot.filterId) }} />
                      <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-blush-600 shadow-sm">
                        ✓ รูปที่ {photos.length}/{selectedFrame.count}
                      </span>
                      <span className="absolute inset-x-6 bottom-5 h-1.5 overflow-hidden rounded-full bg-white/40">
                        <span key={reviewShot.src.length + photos.length} className="animate-review block h-full rounded-full bg-white" />
                      </span>
                    </button>
                  )}

                  {/* Shutter — อยู่ในกล้อง */}
                  {cameraStatus === 'ready' && !isComplete && countDown === null && !reviewShot && (
                    <button
                      onClick={startCapture}
                      aria-label="ถ่ายรูป"
                      className="absolute bottom-4 left-1/2 z-40 grid h-[70px] w-[70px] -translate-x-1/2 place-items-center rounded-full border-[3px] border-white/90 bg-white/25 shadow-[0_10px_30px_-8px_rgba(242,86,143,0.8)] backdrop-blur-md transition-transform hover:scale-105 active:scale-90 md:h-20 md:w-20"
                    >
                      <span className="btn-candy h-[54px] w-[54px] !gap-0 md:h-[62px] md:w-[62px]">
                        <Camera className="relative z-10 h-6 w-6" />
                      </span>
                    </button>
                  )}

                  {/* Flash */}
                  {flashKey > 0 && <div key={flashKey} className="animate-flash pointer-events-none absolute inset-0 z-50 bg-white" aria-hidden />}

                  {/* Zoom */}
                  {cameraStatus === 'ready' && (
                    <div className="absolute right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-full border border-white/30 bg-black/15 px-1.5 py-3 backdrop-blur-md">
                      <ZoomIn size={14} className="text-white" />
                      <div className="relative flex h-24 w-2 items-center justify-center">
                        <input
                          type="range"
                          min={minZoom}
                          max={maxZoom}
                          step={0.1}
                          value={zoom}
                          onChange={handleZoomChange}
                          aria-label="ซูม"
                          className="absolute h-1.5 w-24 origin-center -rotate-90 cursor-pointer appearance-none rounded-full bg-white/40 accent-blush-400 outline-none"
                        />
                      </div>
                      <ZoomOut size={14} className="text-white" />
                      <button onClick={() => setZoom(1)} className="text-[9px] font-semibold text-white" aria-label="รีเซ็ตซูม">{zoom.toFixed(1)}×</button>
                    </div>
                  )}
                </div>

                {/* Polaroid chin */}
                <div className="flex items-center justify-between px-2 py-2.5 md:py-3.5">
                  <span className="font-display text-base italic text-plum">Photo<span className="text-blush-500">Cute</span> <span className="text-rosegold">✦</span> cam</span>
                  <div className="flex items-center gap-1">
                    <span className="mr-1 text-[11px] font-semibold text-plum-soft">{Math.min(photos.length, selectedFrame.count)}/{selectedFrame.count}</span>
                    {Array.from({ length: selectedFrame.count }).map((_, i) => (
                      <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < photos.length ? 'w-4 bg-blush-500' : 'w-1.5 bg-blush-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters — มือถือ: พับเก็บได้ และอยู่ใต้ปุ่มชัตเตอร์ */}
            <div className="order-3 mx-auto mt-3 w-full max-w-[520px] md:order-none md:mt-6">
              <button
                onClick={() => setFiltersOpen(o => !o)}
                aria-expanded={filtersOpen}
                className="chip w-full justify-between px-4 py-2.5 text-sm md:hidden"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Sparkles size={15} className="shrink-0" /> ฟิลเตอร์
                  <span className="truncate font-semibold text-blush-600">{activeFilterName}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[11px]">
                  {filtersOpen ? 'พับเก็บ' : 'เลือก'}
                  <ChevronDown size={16} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>
              <div className={filtersOpen ? 'animate-rise mt-3 md:mt-0' : 'hidden md:block'}>
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="eyebrow">filter mood</p>
                <p className="text-[10px] text-plum-soft">แตะ ☆ เพื่อปักหมุด</p>
              </div>
              <div className="no-scrollbar -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1">
                {[...(favoriteFilters.length > 0 ? [{ id: 'fav' as const, label: '⭐ ที่ชอบ' }] : []), ...filterGroups].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setFilterGroup(g.id)}
                    className={`chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] ${filterGroup === g.id ? 'chip-active' : ''}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pt-1">
                {visibleFilters.map((filter) => {
                  const isActive = selectedFilter === filter.id;
                  const isFav = favoriteFilters.includes(filter.id);
                  const [emoji, ...rest] = filter.name.split(' ');
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className="group flex w-[68px] shrink-0 flex-col items-center gap-1.5"
                    >
                      <span className={`relative block h-[60px] w-[60px] rounded-full p-[3px] transition-all ${isActive ? 'bg-gradient-to-br from-blush-400 via-rosegold to-blush-300 shadow-[0_8px_18px_-8px_rgba(242,86,143,0.8)]' : 'bg-white group-hover:bg-blush-200'}`}>
                        <span className="block h-full w-full overflow-hidden rounded-full border-2 border-white">
                          {swatchPhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={swatchPhoto} alt="" className="h-full w-full object-cover" style={{ filter: getFilterStyle(filter.id) }} />
                          ) : (
                            <span className="grid h-full w-full place-items-center bg-gradient-to-br from-blush-300 via-champagne to-lilac text-xl" style={{ filter: getFilterStyle(filter.id) }}>{emoji}</span>
                          )}
                        </span>
                        <span
                          role="button"
                          aria-label={isFav ? 'เลิกปักหมุด' : 'ปักหมุด'}
                          onClick={(e) => toggleFavorite(e, filter.id)}
                          className={`absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-white shadow-sm transition-colors ${isFav ? 'text-amber-400' : 'text-blush-200 hover:text-amber-400'}`}
                        >
                          <Star size={10} fill={isFav ? 'currentColor' : 'none'} />
                        </span>
                      </span>
                      <span className={`w-full truncate text-center text-[10px] font-semibold ${isActive ? 'text-blush-600' : 'text-plum-soft'}`}>{rest.join(' ') || emoji}</span>
                    </button>
                  );
                })}
              </div>
              </div>
            </div>

            {/* Actions — เมื่อถ่ายครบแล้ว */}
            {isComplete && (
              <div className="order-2 mt-3 flex w-full flex-col-reverse items-center justify-center gap-2.5 sm:flex-row md:order-none md:mt-5 md:gap-3">
                <button onClick={() => deletePhoto(photos.length - 1)} className="chip w-full justify-center px-6 py-3 text-sm sm:w-auto md:py-3.5">
                  <RefreshCw size={16} /> ถ่ายรูปสุดท้ายใหม่
                </button>
                <button onClick={() => onFinish?.(photos.slice(0, selectedFrame.count))} className="btn-candy w-full px-9 py-3 text-base sm:w-auto md:py-3.5">
                  <span className="relative z-10">ไปแต่งรูปกันเลย</span>
                  <ArrowRight size={18} className="relative z-10" />
                </button>
              </div>
            )}
          </section>

          {/* ───── Film strip ───── */}
          <aside className="glass w-full rounded-[1.75rem] p-3 md:sticky md:top-24 md:w-[176px] md:rounded-[2rem] md:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="eyebrow">your shots</p>
              <span className="text-[11px] font-semibold text-blush-600">{photos.length}/{selectedFrame.count}</span>
            </div>
            <div className="no-scrollbar flex flex-row gap-2.5 overflow-x-auto pb-1 md:max-h-[calc(100dvh-260px)] md:flex-col md:overflow-x-hidden md:overflow-y-auto">
              {Array.from({ length: selectedFrame.count }).map((_, i) => {
                const photo = photos[i];
                return (
                  <div
                    key={i}
                    className={`group relative aspect-[3/4] w-16 shrink-0 overflow-hidden sm:w-20 rounded-2xl md:w-full ${photo ? 'animate-pop bg-white p-1 shadow-md shadow-blush-200' : 'border-2 border-dashed border-blush-200 bg-white/50'}`}
                  >
                    {photo ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.src} alt={`รูปที่ ${i + 1}`} className="h-full w-full rounded-xl object-cover" style={{ filter: getFilterStyle(photo.filterId) }} />
                        <button
                          onClick={() => deletePhoto(i)}
                          aria-label={`ลบรูปที่ ${i + 1}`}
                          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-blush-600 shadow-sm transition-all hover:bg-blush-500 hover:text-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <span className="font-display absolute inset-0 grid place-items-center text-2xl italic text-blush-300">{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {photos.length > 0 && (
              <button onClick={resetAll} className="mx-auto mt-3 flex items-center gap-1.5 text-xs font-medium text-plum-soft transition-colors hover:text-blush-600">
                <RotateCcw size={12} /> เริ่มใหม่ทั้งหมด
              </button>
            )}
          </aside>
        </div>

        <footer className="mt-8 text-center">
          <p className="font-display text-sm italic text-plum-soft">made with love — <span className="text-blush-500">PhotoCute</span> ✦ 2026</p>
        </footer>
      </div>
    </div>
  );
}
