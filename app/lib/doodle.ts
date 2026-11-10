// ปากกา Doodle — เก็บเส้นเป็นพิกัดสัดส่วน (0–1) ของแถบรูป
// วาดใหม่ได้ทุกขนาด: บนจอ (ตามขนาดแถบ) และตอนบันทึก (ความละเอียดเต็ม)

export type PenKind = 'neon' | 'gel';
export type Stroke = {
  kind: PenKind;
  color: string;
  /** ความหนาเป็นสัดส่วนของความกว้างแถบรูป */
  size: number;
  points: [number, number][];
};

export const neonColors = ['#ff4fa3', '#ff8a3d', '#ffe14d', '#3dffb0', '#3dd8ff', '#8f7bff', '#ffffff'];
export const gelColors = ['#4a1f36', '#ff7eaa', '#d93a76', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ffffff'];

const tracePath = (ctx: CanvasRenderingContext2D, pts: [number, number][], w: number, h: number) => {
  ctx.beginPath();
  const [x0, y0] = pts[0];
  ctx.moveTo(x0 * w, y0 * h);
  if (pts.length === 1) { ctx.lineTo(x0 * w + 0.01, y0 * h); return; } // จุดเดียว = แตะทีเดียว
  // ลากเส้นโค้งผ่านจุดกึ่งกลาง ให้เส้นนุ่มไม่หยัก
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    ctx.quadraticCurveTo(x * w, y * h, ((x + nx) / 2) * w, ((y + ny) / 2) * h);
  }
  const [lx, ly] = pts[pts.length - 1];
  ctx.lineTo(lx * w, ly * h);
};

export const drawStroke = (ctx: CanvasRenderingContext2D, s: Stroke, w: number, h: number) => {
  if (!s.points.length) return;
  const lw = Math.max(1, s.size * w);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (s.kind === 'neon') {
    // แสงเรืองรอบเส้น + แกนกลางสีขาว
    tracePath(ctx, s.points, w, h);
    ctx.shadowColor = s.color;
    ctx.shadowBlur = lw * 2.2;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.stroke(); // ซ้ำอีกรอบให้เรืองชัดขึ้น
    ctx.shadowBlur = 0;
    tracePath(ctx, s.points, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = lw * 0.38;
    ctx.stroke();
  } else {
    // ปากกาเจล: สีทึบเนียน + ไฮไลต์มันวาวบาง ๆ
    tracePath(ctx, s.points, w, h);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.translate(-lw * 0.15, -lw * 0.15);
    tracePath(ctx, s.points, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = lw * 0.28;
    ctx.stroke();
  }
  ctx.restore();
};

export const drawStrokes = (ctx: CanvasRenderingContext2D, strokes: Stroke[], w: number, h: number) => {
  for (const s of strokes) drawStroke(ctx, s, w, h);
};
