// ───────────────────────────────────────────────────────────────
// "อบ" รูปถ่ายก่อนจับภาพแถบรูป
// ปัญหา: iOS (WebKit ทุกเบราว์เซอร์) และ Android บางรุ่น วาด <img> ที่มี CSS filter / transform
// ภายใน SVG foreignObject (วิธีที่ html-to-image ใช้) ไม่ขึ้น → ไฟล์ที่ดาวน์โหลดได้ช่องรูปว่าง
// วิธีแก้: วาดรูป + ครอปแบบ object-cover + ใส่ฟิลเตอร์ลง canvas เอง แล้วสลับ src ชั่วคราว
// ให้ <img> เหลือแค่รูปธรรมดาไม่มี filter/transform จากนั้นค่อยคืนค่าเดิมหลังจับภาพเสร็จ
// ───────────────────────────────────────────────────────────────

type Op = { fn: string; v: number };

const parseFilter = (filter: string): Op[] => {
  const ops: Op[] = [];
  if (!filter || filter === 'none') return ops;
  const re = /([a-z-]+)\(\s*([-\d.]+)\s*(deg|px|%)?\s*\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(filter))) {
    let v = parseFloat(m[2]);
    if (m[3] === '%') v /= 100;
    ops.push({ fn: m[1].toLowerCase(), v });
  }
  return ops;
};

type M3 = [number, number, number, number, number, number, number, number, number];

const matrixFor = (fn: string, a: number): M3 | null => {
  switch (fn) {
    case 'saturate':
      return [
        0.213 + 0.787 * a, 0.715 - 0.715 * a, 0.072 - 0.072 * a,
        0.213 - 0.213 * a, 0.715 + 0.285 * a, 0.072 - 0.072 * a,
        0.213 - 0.213 * a, 0.715 - 0.715 * a, 0.072 + 0.928 * a,
      ];
    case 'grayscale': {
      const b = 1 - Math.min(1, a);
      return [
        0.2126 + 0.7874 * b, 0.7152 - 0.7152 * b, 0.0722 - 0.0722 * b,
        0.2126 - 0.2126 * b, 0.7152 + 0.2848 * b, 0.0722 - 0.0722 * b,
        0.2126 - 0.2126 * b, 0.7152 - 0.7152 * b, 0.0722 + 0.9278 * b,
      ];
    }
    case 'sepia': {
      const b = 1 - Math.min(1, a);
      return [
        0.393 + 0.607 * b, 0.769 - 0.769 * b, 0.189 - 0.189 * b,
        0.349 - 0.349 * b, 0.686 + 0.314 * b, 0.168 - 0.168 * b,
        0.272 - 0.272 * b, 0.534 - 0.534 * b, 0.131 + 0.869 * b,
      ];
    }
    case 'hue-rotate': {
      const r = (a * Math.PI) / 180;
      const c = Math.cos(r);
      const s = Math.sin(r);
      return [
        0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
        0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283,
        0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
      ];
    }
    default:
      return null;
  }
};

/** ใส่ฟิลเตอร์ทีละพิกเซล (สำหรับเบราว์เซอร์ที่ไม่รองรับ ctx.filter เช่น Safari) ตามสูตร Filter Effects spec */
const applyOpsManually = (ctx: CanvasRenderingContext2D, w: number, h: number, ops: Op[]) => {
  const colorOps = ops.filter(o => o.fn !== 'blur');
  if (colorOps.length === 0) return;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const steps = colorOps.map(o => ({ ...o, m: matrixFor(o.fn, o.v) }));
  const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
    for (const s of steps) {
      if (s.m) {
        const m = s.m;
        const nr = m[0] * r + m[1] * g + m[2] * b;
        const ng = m[3] * r + m[4] * g + m[5] * b;
        const nb = m[6] * r + m[7] * g + m[8] * b;
        r = clamp(nr); g = clamp(ng); b = clamp(nb);
      } else if (s.fn === 'brightness') {
        r = clamp(r * s.v); g = clamp(g * s.v); b = clamp(b * s.v);
      } else if (s.fn === 'contrast') {
        const k = 0.5 - 0.5 * s.v;
        r = clamp(r * s.v + k); g = clamp(g * s.v + k); b = clamp(b * s.v + k);
      } else if (s.fn === 'invert') {
        const a = Math.min(1, s.v);
        r = clamp(a + r * (1 - 2 * a)); g = clamp(a + g * (1 - 2 * a)); b = clamp(a + b * (1 - 2 * a));
      }
    }
    d[i] = r * 255; d[i + 1] = g * 255; d[i + 2] = b * 255;
  }
  ctx.putImageData(img, 0, 0);
};

const supportsCtxFilter = () => {
  try {
    const c = document.createElement('canvas').getContext('2d');
    if (!c || !('filter' in c)) return false;
    c.filter = 'saturate(2)';
    return c.filter === 'saturate(2)';
  } catch {
    return false;
  }
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('โหลดรูปไม่สำเร็จ'));
    im.src = src;
  });

/**
 * อบรูป `img.photo-item` ทุกใบใน node (ครอป object-cover + ฟิลเตอร์) ให้ขนาดพอดีกับที่จะส่งออก
 * คืนค่าฟังก์ชันสำหรับคืนสภาพเดิม
 */
export const bakePhotos = async (node: HTMLElement, pixelRatio: number): Promise<() => void> => {
  const imgs = Array.from(node.querySelectorAll<HTMLImageElement>('img.photo-item'));
  const restores: (() => void)[] = [];
  const ctxFilterOk = supportsCtxFilter();

  for (const el of imgs) {
    const boxW = el.clientWidth;
    const boxH = el.clientHeight;
    if (!boxW || !boxH || !el.src) continue;
    const filter = el.style.filter || 'none';

    const src = await loadImage(el.src);
    const nw = src.naturalWidth;
    const nh = src.naturalHeight;
    if (!nw || !nh) continue;

    // object-cover: ครอปกลางให้สัดส่วนเท่ากล่อง
    const boxRatio = boxW / boxH;
    let sw = nw, sh = nh;
    if (nw / nh > boxRatio) sw = nh * boxRatio; else sh = nw / boxRatio;
    const sx = (nw - sw) / 2;
    const sy = (nh - sh) / 2;

    // ขนาดผลลัพธ์ = ขนาดที่จะออกในไฟล์จริง (ไม่เกินความละเอียดต้นฉบับ) → ไฟล์ SVG เล็กลง เบราว์เซอร์มือถือไม่ล่ม
    const scale = Math.min(1, (boxW * pixelRatio) / sw);
    const ow = Math.max(1, Math.round(sw * scale));
    const oh = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement('canvas');
    canvas.width = ow;
    canvas.height = oh;
    const ctx = canvas.getContext('2d', { willReadFrequently: !ctxFilterOk });
    if (!ctx) continue;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const ops = parseFilter(filter);
    if (ctxFilterOk && ops.length) {
      // ขยายค่า blur ตามสัดส่วนการย่อ/ขยาย
      ctx.filter = filter.replace(/blur\(\s*([\d.]+)px\s*\)/g, (_, px) => `blur(${parseFloat(px) * (ow / boxW)}px)`);
    }
    ctx.drawImage(src, sx, sy, sw, sh, 0, 0, ow, oh);
    if (!ctxFilterOk && ops.length) applyOpsManually(ctx, ow, oh, ops);

    const baked = canvas.toDataURL('image/jpeg', 0.92);
    const prev = { src: el.getAttribute('src') || '', filter: el.style.filter, transform: el.style.transform };
    el.style.filter = 'none';
    el.style.transform = 'none';
    el.src = baked;
    try { await el.decode(); } catch { /* ignore */ }
    restores.push(() => {
      el.src = prev.src;
      el.style.filter = prev.filter;
      el.style.transform = prev.transform;
    });
  }

  return () => restores.forEach(r => r());
};
