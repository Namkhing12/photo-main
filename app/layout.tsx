import type { Metadata, Viewport } from "next";
import { Prompt, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/app/src/NavbarWrapper";
import SilentMedia from "@/app/src/SilentMedia";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
});

// โดเมนจริงของเว็บ ใช้สร้างลิงก์รูปพรีวิวตอนแชร์ (opengraph-image.png)
// เปลี่ยนชั่วคราวได้ด้วย NEXT_PUBLIC_SITE_URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vercel.photos-cute.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PhotoCute ✦ Photo Booth",
  description: "Capture and edit your cute photos",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fff1f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} ${playfair.variable} antialiased h-[100dvh] flex flex-col overflow-hidden`}
      >
        <SilentMedia />
        <NavbarWrapper />
        <main className="flex-1 min-h-0 overflow-y-auto relative custom-scrollbar">
          {children}
        </main>
      </body>
    </html>
  );
}
