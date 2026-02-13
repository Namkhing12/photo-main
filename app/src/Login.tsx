'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient'; // ⚠️ เช็ค path ให้ถูกนะครับ
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // เก็บค่าจากฟอร์ม
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // ฟังก์ชันจัดการ Login
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // ✅ แก้ไข: เด้งไปที่หน้า /screen/PhotoBooth
            router.push('/PhotoBooth');

        } catch (error: any) {
            console.error('Login Error Detailed:', error);
            // ตรวจสอบว่าเป็นปัญหา Network หรือไม่
            if (error.message === 'Failed to fetch') {
                alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: โปรดตรวจสอบอินเทอร์เน็ต หรือตรวจเช็คว่า Supabase URL ถูกต้อง (Failed to fetch)');
            } else {
                alert(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-pink-100">

                {/* --- Header --- */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-pink-500 mb-1">
                        ยินดีต้อนรับ!
                    </h2>
                    <p className="text-gray-400 text-sm">
                        กรอกข้อมูลเพื่อเข้าสู่ระบบ
                    </p>
                </div>

                {/* --- Form --- */}
                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                        <input
                            type="email"
                            placeholder="อีเมล"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-pink-50 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder-pink-300 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-pink-50 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder-pink-300 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-pink-300 hover:text-pink-500 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-xs text-pink-400 hover:text-pink-600 transition-colors">
                            ลืมรหัสผ่าน?
                        </Link>
                    </div>

                    {/* ปุ่ม Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                {/* --- Toggle --- */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        ยังไม่มีบัญชีใช่ไหม?
                        <Link
                            href="/register"
                            className="ml-2 text-pink-500 font-bold hover:underline focus:outline-none"
                        >
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}