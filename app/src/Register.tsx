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