import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'לוח משרות של ולרי',
  description: 'מערכת לוח משרות של ולרי עם סופאבייס',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} antialiased bg-blue-50 min-h-screen`} suppressHydrationWarning>
        <Header />
        <main className="min-h-[80vh]">{children}</main>
      </body>
    </html>
  )
}
