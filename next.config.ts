import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // เพิ่มบรรทัดนี้
  images: {
    unoptimized: true, // จำเป็นต้องปิด Image Optimization ของ Next.js ถ้าใช้ 'export'
  },
};

export default nextConfig;