'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Lock, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
    const router = useRouter();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleUpdatePassword = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            alert('ตั้งรหัสผ่านใหม่เรียบร้อยแล้วค่ะ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่');
            router.push('/login');

        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาดในการตั้งรหัสผ่านใหม่');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-pink-100">

                {/* --- Header --- */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-pink-500 mb-2">ตั้งรหัสผ่านใหม่</h2>
                    <p className="text-gray-400 text-sm px-6">
                        กรุณากำหนดรหัสผ่านใหม่ที่คุณต้องการใช้งาน
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่านใหม่"
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
                            placeholder="ยืนยันรหัสผ่านใหม่"
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
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Lock size={20} className="mr-2" />}
                        {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
                    </button>
                </form>

            </div>
        </div>
    );
}
