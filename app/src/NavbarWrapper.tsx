'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
    const pathname = usePathname();
    const hideNavbarOn = ['/login', '/register', '/forgot-password'];

    if (hideNavbarOn.includes(pathname) || pathname === '/') {
        return null;
    }

    return <Navbar />;
}
