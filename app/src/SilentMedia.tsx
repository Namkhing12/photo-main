'use client';

import { useEffect } from 'react';

// ปิดเสียงทั้งเว็บ: บังคับ mute ทุก <audio>/<video> ทั้งที่มีอยู่และที่ถูกเพิ่มทีหลัง
export default function SilentMedia() {
    useEffect(() => {
        const mute = (el: Element) => {
            if (el instanceof HTMLMediaElement) {
                el.muted = true;
                el.volume = 0;
            }
        };
        document.querySelectorAll('audio, video').forEach(mute);

        // event 'play' / 'volumechange' ไม่ bubble จึงต้องดักแบบ capture
        const onMedia = (e: Event) => {
            const el = e.target;
            if (el instanceof HTMLMediaElement && (!el.muted || el.volume !== 0)) mute(el);
        };
        document.addEventListener('play', onMedia, true);
        document.addEventListener('volumechange', onMedia, true);

        const observer = new MutationObserver((records) => {
            for (const r of records) {
                r.addedNodes.forEach((node) => {
                    if (node instanceof Element) {
                        mute(node);
                        node.querySelectorAll?.('audio, video').forEach(mute);
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('play', onMedia, true);
            document.removeEventListener('volumechange', onMedia, true);
            observer.disconnect();
        };
    }, []);

    return null;
}
