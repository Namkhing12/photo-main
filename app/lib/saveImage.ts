import { toCanvas } from 'html-to-image';
import { renderPhoto } from './renderPhoto';

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

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('โหลดรูปไม่สำเร็จ'));
    im.src = src;
  });

const layerOf = (n: Node) => (n instanceof HTMLElement ? n.dataset.layer : undefined);
const notIgnored = (n: HTMLElement | SVGElement) => !(n instanceof HTMLElement && n.dataset.html2canvasIgnore === 'true');
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * จับภาพ "ชั้นเดียว" ของแถบรูป จากสำเนาที่วางไว้นอกจอ
 * ชั้นที่ไม่ต้องการจะถูกซ่อนด้วย visibility (layout เดิมไม่ขยับ และผู้ใช้ไม่เห็นรูปกะพริบ)
 */
const captureLayer = async (
  node: HTMLElement,
  keep: (child: Element) => boolean,
  options: Parameters<typeof toCanvas>[1],
  rootStyle?: Partial<CSSStyleDeclaration>,
) => {
  const W = node.offsetWidth;
  const H = node.offsetHeight;
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = `position:fixed;left:-100000px;top:0;width:${W}px;height:${H}px;pointer-events:none;`;
  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.width = `${W}px`;
  clone.style.height = `${H}px`;
  if (rootStyle) Object.assign(clone.style, rootStyle);
  for (const child of Array.from(clone.children)) {
    if (keep(child)) continue;
    (child as HTMLElement).style.visibility = 'hidden';
    // ไม่ต้องฝังรูปใหญ่ที่ถูกซ่อนลงใน SVG (ไฟล์เล็กลง เร็วขึ้น)
    child.querySelectorAll('img').forEach(im => { im.src = BLANK; im.removeAttribute('srcset'); });
  }
  host.appendChild(clone);
  document.body.appendChild(host);
  try {
    await Promise.all(Array.from(clone.querySelectorAll('img')).map(im => im.decode().catch(() => undefined)));
    return await toCanvas(clone, { width: W, height: H, ...options });
  } finally {
    host.remove();
  }
};

/**
 * สร้างไฟล์รูปจากแถบรูป โดยประกอบเป็นชั้น ๆ บน canvas เดียว
 *  1) พื้นหลัง + ลาย (data-layer="bottom")   ← html-to-image
 *  2) รูปถ่าย img.photo-item + ฟิลเตอร์ของแต่ละรูป ← วาดเองด้วย drawImage
 *  3) กรอบรูปแบบภาพ (data-layer="multiply")  ← วาดเองด้วยโหมด multiply
 *  4) ข้อความ/สติกเกอร์/กรอบอิโมจิ (ชั้นอื่น)   ← html-to-image พื้นโปร่งใส
 *  5) drawOverlay (เช่น เส้นปากกา Doodle)      ← วาดเองที่ความละเอียดเต็ม
 * เหตุผล: iOS/Android บางรุ่นวาดรูปถ่าย (<img> ขนาดใหญ่) ใน SVG foreignObject ไม่ขึ้นเลย
 */
export const captureNode = async (
  node: HTMLElement,
  drawOverlay?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
): Promise<Blob> => {
  const p = detectPlatform();
  const W = node.offsetWidth;
  const H = node.offsetHeight;
  const nodeRect = node.getBoundingClientRect();
  const k = nodeRect.width ? W / nodeRect.width : 1; // ตัดผลของ transform (อนิเมชันพิมพ์) ออก
  const rel = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: (r.left - nodeRect.left) * k, y: (r.top - nodeRect.top) * k, w: r.width * k, h: r.height * k };
  };

  // ห้ามส่ง backgroundColor ที่ต่างจากสีจริง: html-to-image จะเขียนทับ background-color ของแถบรูป
  const bg = getComputedStyle(node).backgroundColor;
  const isTransparent = !bg || bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg);
  const pixelRatio = pickPixelRatio(node, p);
  const baseStyle = { margin: '0', boxShadow: 'none', transform: 'none', borderRadius: '0' };
  const common = { pixelRatio, skipAutoScale: true, style: baseStyle, filter: notIgnored };

  // ชั้น 1: พื้นหลัง + ลาย
  const out = await captureLayer(node, child => layerOf(child) === 'bottom', {
    ...common,
    backgroundColor: isTransparent ? '#ffffff' : bg,
  });
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  const sx = out.width / W;
  const sy = out.height / H;

  // ชั้น 2: รูปถ่าย (แต่ละรูปมีฟิลเตอร์ของตัวเอง)
  for (const img of Array.from(node.querySelectorAll<HTMLImageElement>('img.photo-item'))) {
    const box = rel(img);
    if (!box.w || !box.h || !img.src) continue;
    const photo = await renderPhoto(img.src, img.style.filter || 'none', box.w, box.h, pixelRatio);
    const cell = img.parentElement;
    const radius = cell ? parseFloat(getComputedStyle(cell).borderTopLeftRadius) || 0 : 0;
    ctx.save();
    ctx.beginPath();
    if (radius > 0 && typeof ctx.roundRect === 'function') ctx.roundRect(box.x * sx, box.y * sy, box.w * sx, box.h * sy, radius * sx);
    else ctx.rect(box.x * sx, box.y * sy, box.w * sx, box.h * sy);
    ctx.clip();
    ctx.drawImage(photo, box.x * sx, box.y * sy, box.w * sx, box.h * sy);
    ctx.restore();
    photo.width = 0; photo.height = 0; // คืนหน่วยความจำ (สำคัญบน iOS)
  }

  // ชั้น 3: กรอบรูปแบบภาพที่ใช้ mix-blend-mode: multiply
  for (const img of Array.from(node.querySelectorAll<HTMLImageElement>('[data-layer="multiply"] img'))) {
    const box = rel(img);
    try {
      const im = await loadImg(img.currentSrc || img.src);
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = parseFloat(getComputedStyle(img).opacity) || 1;
      ctx.drawImage(im, box.x * sx, box.y * sy, box.w * sx, box.h * sy);
      ctx.restore();
    } catch { /* ข้ามกรอบที่โหลดไม่ได้ */ }
  }

  // ชั้น 4: ข้อความ สติกเกอร์ กรอบอิโมจิ (พื้นโปร่งใส)
  const keepTop = (child: Element) => !['bottom', 'photos', 'multiply'].includes(layerOf(child) ?? '');
  const clearBg = { background: 'transparent', backgroundColor: 'transparent', backgroundImage: 'none' };
  // WebKit มักวาดฟอนต์/SVG ไม่ครบในรอบแรก → อุ่นเครื่องหนึ่งรอบ
  if (p.isIOS || p.isSafari) {
    try { const w = await captureLayer(node, keepTop, { ...common, pixelRatio: 1 }, clearBg); w.width = 0; w.height = 0; } catch { /* ignore */ }
  }
  const top = await captureLayer(node, keepTop, common, clearBg);
  ctx.drawImage(top, 0, 0, out.width, out.height);
  top.width = 0; top.height = 0;

  // ชั้น 5: วาดทับด้านบนสุด
  if (drawOverlay) drawOverlay(ctx, out.width, out.height);

  const blob = await new Promise<Blob | null>(resolve => out.toBlob(resolve, 'image/png'));
  out.width = 0; out.height = 0;
  if (!blob) throw new Error('สร้างรูปไม่สำเร็จ');
  return blob;
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
