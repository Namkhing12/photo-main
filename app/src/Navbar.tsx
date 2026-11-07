'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6">
            <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-2 pr-4 sm:pr-5">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="ring-luxe relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.jpeg" alt="PhotoCute" className="h-full w-full object-cover" />
                    </span>
                    <span className="leading-none">
                        <span className="font-display block text-xl italic text-plum sm:text-2xl">
                            Photo<span className="text-shimmer">Cute</span>
                        </span>
                        <span className="eyebrow hidden sm:block mt-1 !text-[9px]">self-portrait studio</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="hidden items-center gap-1.5 rounded-full bg-blush-100/80 px-3 py-1.5 text-[11px] font-medium text-blush-600 sm:inline-flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-blush-500 animate-twinkle" />
                        ฟรี · ไม่ต้องสมัคร
                    </span>
                    <span className="font-display text-lg italic text-rosegold animate-twinkle" aria-hidden>✦</span>
                </div>
            </div>
        </nav>
    );
}
