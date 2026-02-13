'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/PhotoBooth');
  }, [router]);

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <div className="text-pink-500 font-medium">กำลังไปหน้าถ่ายรูป...</div>
    </div>
  );
}