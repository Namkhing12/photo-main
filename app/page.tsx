// หน้าหลัก (Landing) — กดปุ่มแล้วไปหน้าถ่ายรูปที่ /PhotoBooth
import Link from 'next/link';
import { Camera, LayoutGrid, Sparkles, Download, ArrowRight } from 'lucide-react';
import { getStickerArt } from '@/app/lib/stickers';

const Sticker = ({ id, className = '' }: { id: string; className?: string }) => (
  <span aria-hidden className={`sticker-cut pointer-events-none absolute block ${className}`}>
    {getStickerArt(id)}
  </span>
);

// ช่องรูปตัวอย่างในแถบโฟโต้สตริป
const stripCells = [
  { sticker: 'bear', bg: 'from-blush-200 to-champagne' },
  { sticker: 'bunny', bg: 'from-lilac to-blush-100' },
  { sticker: 'kitty', bg: 'from-champagne to-blush-200' },
];

const steps = [
  { icon: LayoutGrid, title: 'เลือกเฟรม', desc: '1–10 รูป ตามใจชอบ' },
  { icon: Camera, title: 'ยิ้ม & ถ่าย', desc: 'ตั้งเวลา ใส่ฟิลเตอร์น่ารัก' },
  { icon: Sparkles, title: 'แต่งรูป', desc: 'แปะสติกเกอร์ เลือกกรอบ' },
  { icon: Download, title: 'เซฟเก็บไว้', desc: 'ดาวน์โหลดได้ทันที' },
];

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden px-4 pb-12 pt-6 sm:px-6 sm:pt-10">
      {/* ก้อนสีพาสเทลลอยๆ ด้านหลัง */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-16 top-10 h-64 w-64 rounded-full bg-blush-200/60 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-10 top-40 h-72 w-72 rounded-full bg-lilac/70 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-champagne/70 blur-3xl" />
      </div>

      <section className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-6">
        {/* ข้อความหลัก */}
        <div className="animate-rise text-center md:text-left">
          <span className="chip px-3 py-1.5 text-xs">
            <span className="animate-twinkle text-blush-500">✦</span>
            ตู้ถ่ายรูปออนไลน์ · ฟรี ไม่ต้องสมัคร
          </span>

          <h1 className="font-display mt-5 text-4xl leading-tight text-plum sm:text-5xl lg:text-6xl">
            ยิ้มกว้างๆ <br />
            แล้วมา<span className="text-shimmer italic">ถ่ายรูป</span>กัน!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-plum-soft md:mx-0">
            สร้างโฟโต้สตริปสุดน่ารักได้ในไม่กี่คลิก เลือกเฟรม ใส่ฟิลเตอร์
            แปะสติกเกอร์ แล้วเซฟเก็บเป็นความทรงจำ 💗
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link href="/PhotoBooth" className="btn-candy group px-8 py-4 text-lg">
              <Camera className="h-5 w-5" />
              เริ่มถ่ายรูปเลย
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-xs text-plum-soft">ใช้กล้องหรืออัปโหลดรูปก็ได้ 📸</span>
          </div>
        </div>

        {/* โฟโต้สตริปตัวอย่าง + สติกเกอร์ลอยๆ */}
        <div className="relative mx-auto h-[400px] w-[280px] sm:h-[440px] sm:w-[320px]">
          <div className="animate-boing absolute left-1/2 top-1/2 w-[168px] -translate-x-1/2 -translate-y-1/2 sm:w-[184px]">
            <div className="rotate-[-5deg] rounded-[14px] bg-white p-3 pb-4 shadow-[0_30px_60px_-25px_rgb(217_58_118/0.55)] ring-1 ring-blush-100">
              <div className="flex flex-col gap-2.5">
                {stripCells.map((c) => (
                  <div
                    key={c.sticker}
                    className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-gradient-to-br ${c.bg}`}
                  >
                    <span className="block h-[70%] w-[70%] sticker-cut">{getStickerArt(c.sticker)}</span>
                  </div>
                ))}
              </div>
              <p className="font-display mt-3 text-center text-sm italic text-plum">
                Photo<span className="text-blush-500">Cute</span> ♡
              </p>
            </div>
          </div>

          <Sticker id="heart" className="animate-float left-0 top-6 h-14 w-14" />
          <Sticker id="bow" className="animate-wiggle right-2 top-2 h-16 w-16" />
          <Sticker id="star" className="animate-float animation-delay-2000 -left-2 bottom-20 h-14 w-14" />
          <Sticker id="strawberry" className="animate-float animation-delay-4000 right-0 bottom-10 h-14 w-14" />
          <Sticker id="label-xoxo" className="animate-wiggle bottom-0 left-10 h-14 w-14" />
          <span aria-hidden className="animate-twinkle absolute right-10 top-1/3 text-2xl text-rosegold">✦</span>
          <span aria-hidden className="animate-twinkle animation-delay-2000 absolute left-6 top-1/2 text-lg text-blush-400">✦</span>
        </div>
      </section>

      {/* ขั้นตอนการใช้งาน */}
      <section className="mx-auto mt-12 max-w-5xl">
        <p className="eyebrow text-center">how it works</p>
        <ol className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <li
              key={title}
              className="glass animate-rise rounded-3xl p-4 text-center sm:p-5"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-blush-200 text-blush-600">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-plum">
                <span className="text-blush-400">{i + 1}.</span> {title}
              </p>
              <p className="mt-1 text-xs text-plum-soft">{desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
