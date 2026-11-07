'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { filters } from './constants';

const STORAGE_KEY = 'favoriteFilters';

// โหลด/บันทึก favorite filters ใน localStorage
// ใช้ loadedRef กันไม่ให้ effect บันทึกค่าว่าง [] ทับค่าที่เก็บไว้ก่อนโหลดเสร็จ
// (เคยเกิดใน React StrictMode ทำให้ favorite หาย)
export function useFavoriteFilters() {
  const [favoriteFilters, setFavoriteFilters] = useState<string[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // อ่าน localStorage ได้หลัง hydrate เท่านั้น (static export) จึงต้อง setState ใน effect
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setFavoriteFilters(parsed.filter((v): v is string => typeof v === 'string'));
      }
    } catch (e) {
      console.error('Failed to load favoriteFilters', e);
    }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteFilters));
    } catch {
      // private mode / storage ถูกปิด — ไม่เป็นไร
    }
  }, [favoriteFilters]);

  const toggleFavorite = useCallback((e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    setFavoriteFilters(prev => (prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]));
  }, []);

  // favorite ขึ้นก่อน ที่เหลือคงลำดับเดิม
  const sortedFilters = useMemo(() => {
    const favs = filters.filter(f => favoriteFilters.includes(f.id));
    const rest = filters.filter(f => !favoriteFilters.includes(f.id));
    return [...favs, ...rest];
  }, [favoriteFilters]);

  return { favoriteFilters, toggleFavorite, sortedFilters };
}
