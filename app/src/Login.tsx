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
            alert(error.message || 'เกิดข้อผิดพลาดบางอย่าง');
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชัน Login ด้วย Google
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/PhotoBooth`
                }
            });
            if (error) throw error;
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google');
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

                {/* --- Divider --- */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400">หรือ</span>
                    </div>
                </div>

                {/* --- Social Buttons --- */}
                <div className="flex justify-center">
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="flex items-center justify-center gap-2 py-2.5 px-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer w-full max-w-xs"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">ลงชื่อเข้าใช้ด้วย Google</span>
                    </button>
                </div>

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