'use client';

import React from 'react';

export default function Navbar() {

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-full shadow-sm border border-pink-50 overflow-hidden">
                    <img
                        src="/logo.jpeg"
                        alt="Logo"
                        className="w-10 h-10 object-contain"
                    />
                </div>
                <span className="text-xl font-bold text-pink-500">
                    PhotoCute
                </span>
            </div>
        </nav>
    );
}
