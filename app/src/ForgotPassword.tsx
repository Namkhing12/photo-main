'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            // สำเร็จ: แจ้งผู้ใช้และเด้งไปหน้าตั้งรหัสผ่านใหม่ทันที
            alert('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้วค่ะ กรุณาตรวจสอบอีเมลและทำตามขั้นตอนนะคะ');
            router.push('/update-password');
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'เกิดข้อผิดพลาดในการส่งอีเมล'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-pink-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-pink-100 relative">

                {/* ปุ่มย้อนกลับ */}
                <button
                    onClick={() => router.push('/login')}
                    className="absolute top-6 left-6 text-gray-400 hover:text-pink-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* --- Header --- */}
                <div className="text-center mb-8 mt-4">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-pink-500 mb-2">
                        ลืมรหัสผ่าน?
                    </h2>
                    <p className="text-gray-400 text-sm px-6">
                        กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่ค่ะ
                    </p>
                </div>

                {/* --- Form --- */}
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                        <input
                            type="email"
                            placeholder="กรอกอีเมลของคุณ"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-pink-50 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder-pink-300 transition-all"
                        />
                    </div>

                    {message && (
                        <div className={`text-sm px-4 py-2 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Send size={20} className="mr-2" />}
                        {loading ? 'กำลังส่ง...' : 'ส่งลิงก์เปลี่ยนรหัสผ่าน'}
                    </button>
                </form>

                {/* --- Footer --- */}
                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                    <Link href="/login" className="text-sm text-gray-400 hover:text-pink-500 flex items-center justify-center gap-1 transition-colors">
                        กลับไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>

            </div>
        </div>
    );
}