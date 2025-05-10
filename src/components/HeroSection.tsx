"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function HeroSection() {
  const [search, setSearch] = useState('');
  const [popularCategories, setPopularCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('jobs')
        .select('category');
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((row: { category: string }) => {
          if (row.category) counts[row.category] = (counts[row.category] || 0) + 1;
        });
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([cat]) => cat);
        setPopularCategories(sorted);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = () => {
    // אפשר להוסיף ניווט או חיפוש בפועל
  };

  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-600 py-20" dir="rtl">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">מצאו את המשרה הבאה שלכם היום</h1>
          <p className="mb-6 text-lg">גלו מאות משרות עם כל המידע שאתם צריכים. הקריירה הבאה שלכם מחכה לכם כאן.</p>
          <div className="mb-6 rounded-lg p-2" style={{ background: 'linear-gradient(90deg, #e0e7ff 0%, #f0f4ff 100%)' }}>
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
              placeholder="שם משרה, מילות מפתח או חברה"
              className="shadow-lg"
            />
          </div>
          <div className="flex gap-4 mb-2">
            <Link href="/admin" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded font-semibold transition">ניהול משרות</Link>
            <Link href="/jobs" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded font-semibold transition">כל המשרות</Link>
          </div>
          <div className="text-sm">
            פופולרי:
            {popularCategories.length === 0 ? (
              <span className="text-blue-200 ml-2">לא נמצאו קטגוריות</span>
            ) : (
              popularCategories.map((category) => (
                <div
                  key={category}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:ml-10 flex-shrink-0">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/avatar.png"
              alt="Avatar"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 