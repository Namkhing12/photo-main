import { toBlob } from 'html-to-image';
import { bakePhotos } from './bakePhotos';

// ───────────────────────────────────────────────────────────────
// จับภาพแถบรูป + บันทึกให้เหมาะกับแต่ละแพลตฟอร์ม
//  • iOS (Safari/Chrome บน iPhone/iPad): ใช้ Web Share → "บันทึกภาพ" ลงคลังรูปภาพ
//    ถ้าแชร์ไม่ได้ ใช้ <a download> (ไปที่แอป Files) หรือกดค้างที่รูปพรีวิว
//  • Android: <a download> → โฟลเดอร์ Download (เห็นในแกลเลอรี) / แชร์ไปแอปอื่นได้
//  • In-app browser (LINE, Facebook, Instagram, TikTok): มักดาวน์โหลดไม่ได้ → ให้กดค้างที่รูป
// ───────────────────────────────────────────────────────────────

export type Platform = {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isInApp: boolean;
  isSafari: boolean;
};

export const detectPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return { isIOS: false, isAndroid: false, isMobile: false, isInApp: false, isSafari: false };
  const ua = navigator.userAgent;
  // iPadOS 13+ รายงานตัวเองเป็น Mac → เช็ค touch เพิ่ม
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isInApp = /Line\/|FBAN|FBAV|Instagram|TikTok|musical_ly|Bytedance|Twitter|MicroMessenger/i.test(ua);
  const isSafari = /^((?!chrome|chromium|android|crios|fxios|edgios).)*safari/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobi/i.test(ua);
  return { isIOS, isAndroid, isMobile, isInApp, isSafari };
};

// iOS จำกัดพื้นที่ canvas ~16.7 ล้านพิกเซล — เกินแล้วได้รูปว่าง จึงต้องคำนวณ pixelRatio ให้พอดี
const pickPixelRatio = (node: HTMLElement, p: Platform) => {
  const w = node.offsetWidth || 1;
  const h = node.offsetHeight || 1;
  // iOS ~16.7M px / Android รุ่นเล็กหน่วยความจำน้อย → จำกัดต่ำกว่า PC
  const maxArea = p.isIOS || p.isSafari ? 12_000_000 : p.isMobile ? 16_000_000 : 28_000_000;
  return Math.max(1, Math.min(3, Math.sqrt(maxArea / (w * h))));
};

export const captureNode = async (node: HTMLElement): Promise<Blob> => {
  const p = detectPlatform();
  // ห้ามส่ง backgroundColor ของไลบรารี: html-to-image จะเอาไปเขียนทับ background-color ของแถบรูป
  // ทำให้สีกรอบแบบสีทึบ (ดำ ชมพู ฟ้า ฯลฯ) กลายเป็นสีขาวในไฟล์ที่ดาวน์โหลด
  // ใช้สีพื้นจริงของ node แทน (ถ้าโปร่งใสค่อยใช้ขาว)
  const bg = getComputedStyle(node).backgroundColor;
  const isTransparent = !bg || bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg);
  const pixelRatio = pickPixelRatio(node, p);
  const options = {
    pixelRatio,
    backgroundColor: isTransparent ? '#ffffff' : bg,
    // ตัดมุมโค้ง/เงา/การเลื่อนของอนิเมชันพิมพ์ ออกจากไฟล์
    style: { margin: '0', boxShadow: 'none', transform: 'none', borderRadius: '0' },
    filter: (n: HTMLElement | SVGElement) => !(n instanceof HTMLElement && n.dataset.html2canvasIgnore === 'true'),
  };
  // อบฟิลเตอร์ลงรูปถ่ายก่อน — iOS / Android บางรุ่นวาดรูปที่มี CSS filter ใน foreignObject ไม่ขึ้น
  const restore = await bakePhotos(node, pixelRatio);
  try {
    // WebKit และ Android บางรุ่นถอดรหัสรูปใน SVG ไม่ทันในรอบแรก → อุ่นเครื่องก่อน (iOS 2 รอบ)
    const warmups = p.isIOS || p.isSafari ? 2 : p.isMobile ? 1 : 0;
    for (let i = 0; i < warmups; i++) {
      try { await toBlob(node, { ...options, pixelRatio: 1 }); } catch { /* ignore warm-up errors */ }
    }
    const blob = await toBlob(node, options);
    if (!blob) throw new Error('สร้างรูปไม่สำเร็จ');
    return blob;
  } finally {
    restore();
  }
};

export const canShareFile = (file: File) => {
  try {
    return typeof navigator !== 'undefined' && !!navigator.canShare && navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
};

/** แชร์ไฟล์ผ่าน share sheet ของระบบ (ต้องเรียกจากการแตะโดยตรง) */
export const shareFile = async (file: File): Promise<'shared' | 'cancelled'> => {
  try {
    await navigator.share({ files: [file], title: 'PhotoCute' });
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    throw err;
  }
};

/** ดาวน์โหลดผ่าน <a download> */
export const downloadUrl = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const makeFileName = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `photocute-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.png`;
};
