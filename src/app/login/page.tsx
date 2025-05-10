"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true') {
      router.replace('/admin')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'solodohavalery@gmail.com' && password === 'hypsin245') {
      localStorage.setItem('isAdmin', 'true')
      router.replace('/admin')
    } else {
      setError('שם המשתמש או הסיסמה אינם נכונים')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm" dir="rtl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">התחברות למערכת הניהול</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">שם משתמש</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
            placeholder="הכנס שם משתמש"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">סיסמה</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="הכנס סיסמה"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 font-bold"
        >
          התחבר
        </button>
      </form>
    </div>
  )
} 