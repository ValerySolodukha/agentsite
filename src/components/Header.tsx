'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <header className="bg-white shadow" dir="rtl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">לוח משרות של ולרי</Link>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-blue-700 hover:text-blue-900 font-medium">דף הבית</Link>
          <Link href="/jobs" className="text-blue-700 hover:text-blue-900 font-medium">כל המשרות</Link>
          <Link href="/admin" className="text-blue-700 hover:text-blue-900 font-medium">ניהול משרות</Link>
          {isAdmin && (
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium ml-4">התנתק</button>
          )}
        </nav>
      </div>
    </header>
  );
} 