'use client';

import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push('/login');
        } catch (error: any) {
            console.error('Logout error:', error.message);
            alert('เกิดข้อผิดพลาดในการออกจากระบบ');
        }
    };

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
