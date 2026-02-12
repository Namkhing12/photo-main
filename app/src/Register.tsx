'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Eye, EyeOff, Mail, Lock, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // State สำหรับเก็บข้อมูล
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    // ฟังก์ชันสมัครสมาชิก
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        setLoading(true);

        try {
            // ส่งข้อมูลไปสร้าง User ใน Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;

            // เช็คว่าสมัครสำเร็จ
            if (data.user) {
                router.push('/PhotoBooth');
            }

        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/PhotoBooth`
            }
        });
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
                    <h2 className="text-3xl font-bold text-pink-500 mb-1">สมัครสมาชิก</h2>
                    <p className="text-gray-400 text-sm">เริ่มต้นใช้งานฟรี</p>
                </div>

                {/* --- Form --- */}
                <form onSubmit={handleRegister} className="space-y-4">

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
                            minLength={6}
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

                    {/* Confirm Password */}
                    <div className="relative">
                        <CheckCircle className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-10 pr-12 py-3 bg-pink-50 border rounded-xl focus:outline-none focus:ring-2 text-gray-700 placeholder-pink-300 transition-all ${confirmPassword && password !== confirmPassword
                                ? 'border-red-300 focus:ring-red-200'
                                : 'border-pink-100 focus:ring-pink-300'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3.5 text-pink-300 hover:text-pink-500 focus:outline-none"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Validation Message */}
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-400 ml-2 animate-pulse">
                            * รหัสผ่านยังไม่ตรงกันค่ะ
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'สร้างบัญชีผู้ใช้'}
                    </button>
                </form>

                {/* --- Social Login --- */}
                <div className="mt-6">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">หรือสมัครด้วย</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /></svg>
                            <span className="text-sm text-gray-600">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-1.04 4.09-.82c.79.05 1.99.39 2.76 1.4-2.55 1.55-2.09 5.35.53 6.44-.67 1.83-1.6 3.63-2.46 5.21zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                            <span className="text-sm text-gray-600">Apple</span>
                        </button>
                    </div>
                </div>

                {/* --- Footer Link --- */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        มีบัญชีอยู่แล้วใช่ไหมคะ?
                        <Link href="/login" className="ml-2 text-pink-500 font-bold hover:underline">
                            เข้าสู่ระบบเลย
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}