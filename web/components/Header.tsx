'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fdfcfb]/80 border-b border-[#e8e4de]/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d5a47] to-[#1a3629] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">Oasis</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link 
              href="/" 
              className={`nav-link text-sm font-medium transition ${
                isActive('/') && !isActive('/saved') && !isActive('/sources')
                  ? 'active text-[#2d5a47]' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Feed
            </Link>
            <Link 
              href="/saved" 
              className={`nav-link text-sm font-medium transition ${
                isActive('/saved') ? 'active text-[#2d5a47]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Saved
            </Link>
            <Link 
              href="/sources" 
              className={`nav-link text-sm font-medium transition ${
                isActive('/sources') ? 'active text-[#2d5a47]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sources
            </Link>
          </nav>
          
          {/* Search (placeholder for now) */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-56 px-4 py-2 pl-9 bg-white/60 border border-[#e8e4de] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/20 focus:border-[#2d5a47] transition"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

