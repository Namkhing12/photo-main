'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Phone, ArrowLeft, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<1 | 2>(1); // Step 1: Phone, Step 2: OTP

    // ขั้นตอนที่ 1: ส่ง OTP ไปที่เบอร์โทรศัพท์
    const handleRequestOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber,
            });
            if (error) throw error;

            setStep(2); // ไปยังขั้นตอนกรอก OTP
        } catch (error: any) {
            alert(error.message || 'เกิดข้อผิดพลาดในการส่ง SMS');
        } finally {
            setLoading(false);
        }
    };

    // ขั้นตอนที่ 2: ตรวจสอบ OTP
    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token: otp,
                type: 'sms',
            });

            if (error) throw error;

            // ตรวจสอบสำเร็จ พาไปหน้าตั้งรหัสผ่านใหม่
            router.push('/update-password');
        } catch (error: any) {
            alert(error.message || 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-pink-100 relative">

                {/* ปุ่มย้อนกลับ */}
                <button
                    onClick={() => step === 2 ? setStep(1) : router.push('/login')}
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
                        {step === 1 ? 'ลืมรหัสผ่าน?' : 'ยืนยันรหัส OTP'}
                    </h2>
                    <p className="text-gray-400 text-sm px-6">
                        {step === 1
                            ? 'กรอกเบอร์โทรศัพท์เพื่อรับรหัส OTP สำหรับตั้งรหัสผ่านใหม่'
                            : `เราได้ส่งรหัส 6 หลักไปที่ ${phoneNumber} แล้วค่ะ`
                        }
                    </p>
                </div>

                {/* --- Step 1: Request OTP --- */}
                {step === 1 && (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <div className="relative">
                            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                            <input
                                type="tel"
                                placeholder="เบอร์โทรศัพท์ (เช่น +66812345678)"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-pink-50 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder-pink-300 transition-all"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 px-2 mt-[-10px]">
                            * กรุณาใส่รหัสประเทศด้วยนะคะ เช่น +66 นำหน้าเบอร์โทร
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Phone size={20} className="mr-2" />}
                            {loading ? 'กำลังส่ง...' : 'ส่งรหัส OTP ทาง SMS'}
                        </button>
                    </form>
                )}

                {/* --- Step 2: Verify OTP --- */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                            <input
                                type="text"
                                placeholder="กรอกรหัส OTP 6 หลัก"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-pink-50 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-center text-2xl font-bold tracking-widest text-gray-700 placeholder-pink-200 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <KeyRound size={20} className="mr-2" />}
                            {loading ? 'กำลังยืนยัน...' : 'ยืนยันรหัส OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-pink-400 hover:text-pink-600 transition-colors"
                        >
                            ลองใช้เบอร์อื่น
                        </button>
                    </form>
                )}

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