'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ส่งคำขอรีเซ็ตรหัสผ่านไปที่ Supabase
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // ใช้ window.location.origin เพื่อให้ redirect กลับมาที่ domain ปัจจุบัน (เช่น localhost:3000)
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setSubmitted(true); // เปลี่ยนสถานะเป็นส่งสำเร็จ

        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาดในการส่งอีเมล');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-pink-100 relative">

                {/* ปุ่มย้อนกลับ (Back Button) */}
                <Link href="/login" className="absolute top-6 left-6 text-gray-400 hover:text-pink-500 transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                {/* --- Header --- */}
                <div className="text-center mb-8 mt-4">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-pink-500 mb-2">ลืมรหัสผ่าน?</h2>
                    <p className="text-gray-400 text-sm px-6">
                        กรอกอีเมลของคุณ เพื่อส่งลิงก์ตั้งรหัสผ่านใหม่
                    </p>
                </div>

                {/* --- Content (สลับหน้าระหว่าง ฟอร์ม กับ ข้อความส่งสำเร็จ) --- */}
                {!submitted ? (
                    <form onSubmit={handleResetPassword} className="space-y-6">

                        {/* Email Input */}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <KeyRound size={20} className="mr-2" />}
                            {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                        </button>

                    </form>
                ) : (
                    /* --- Success State (แสดงเมื่อส่งอีเมลแล้ว) --- */
                    <div className="text-center animate-fade-in">
                        <div className="bg-green-100 text-green-500 p-4 rounded-xl mb-6 border border-green-200">
                            <p className="font-bold">ส่งอีเมลเรียบร้อยแล้ว</p>
                            <p className="text-xs mt-1 text-green-600">กรุณาตรวจสอบกล่องจดหมาย หรือ จดหมายขยะ เพื่อตั้งรหัสผ่านใหม่</p>
                        </div>

                        <Link
                            href="/login"
                            className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-all"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                )}

                {/* --- Footer --- */}
                {!submitted && (
                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm text-gray-400 hover:text-pink-500 flex items-center justify-center gap-1 transition-colors">
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}