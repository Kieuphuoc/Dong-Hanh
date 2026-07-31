'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, X, PlusCircle, Play } from 'lucide-react';
import { db, Category } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    // Load categories
    db.getCategories().then(setCategories);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card-bg/85 backdrop-blur-md border-b border-border text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-all duration-300">
                AR
              </span>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Arito<span className="text-foreground">.vn</span>
              </span>
            </Link>
          </div>

          {/* Desktop Categories Menu */}
          <nav className="hidden md:flex space-x-6 text-sm font-semibold text-foreground/80">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className="hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/multimedia" className="flex items-center gap-1 text-accent hover:text-accent-hover transition-colors font-bold">
              <Play size={14} className="fill-accent" /> Multimedia
            </Link>
          </nav>

          {/* Action Buttons (Search, Admin, Menu Mobile) */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tin tức..."
                className="w-48 xl:w-64 pl-10 pr-4 py-1.5 rounded-full bg-muted-bg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-foreground"
              />
              <Search className="absolute left-3 top-2.5 text-muted h-4.5 w-4.5" />
            </form>

            {/* Write article / Admin Link */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all duration-300 active:scale-95"
            >
              <PlusCircle size={16} /> Admin
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-muted-bg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card-bg border-b border-border transition-colors duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="px-3 py-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-muted-bg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <Search className="absolute left-6 top-5 text-muted h-4.5 w-4.5" />
            </form>

            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted-bg hover:text-primary transition-colors text-foreground"
            >
              Trang chủ
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted-bg hover:text-primary transition-colors text-foreground"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              href="/multimedia"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-bold text-accent hover:bg-muted-bg transition-colors"
            >
              Multimedia
            </Link>

            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white text-center mt-3"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
