'use client';

import React from 'react';

const COLORS = ['#ff7eaa', '#ffd0e1', '#f2568f', '#d9a08b', '#e8d7ff', '#f3d9c4', '#ffffff'];
const SHAPES = ['💖', '✦', '🎀', '✧', '🌸'];

/** พลุกระดาษตกลงมาเต็มจอ (ตำแหน่งสุ่มแบบกำหนดได้ เพื่อให้ render ซ้ำแล้วผลเหมือนเดิม) */
export default function Confetti({ count = 46 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = ((i * 53) % 60) / 100; // 0–0.6s
        const duration = 2.2 + ((i * 29) % 14) / 10; // 2.2–3.5s
        const drift = ((i * 41) % 160) - 80; // -80..80px
        const spin = ((i * 67) % 720) - 360;
        const isEmoji = i % 4 === 0;
        const style = {
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          '--drift': `${drift}px`,
          '--spin': `${spin}deg`,
        } as React.CSSProperties;
        return isEmoji ? (
          <span key={i} className="confetti-piece text-lg" style={style}>{SHAPES[i % SHAPES.length]}</span>
        ) : (
          <span
            key={i}
            className="confetti-piece rounded-[2px]"
            style={{ ...style, width: 7 + (i % 3) * 2, height: 11 + (i % 4) * 2, background: COLORS[i % COLORS.length] }}
          />
        );
      })}
    </div>
  );
}
