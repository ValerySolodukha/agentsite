'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import JobCard from '@/components/JobCard'

interface FormData {
  name: string;
  category: string;
  location: string;
  description: string;
  link_url: string;
}

interface Job {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
  link_url: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') !== 'true') {
      router.replace('/login')
    }
  }, [router])

  const [jobs, setJobs] = useState<Job[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    location: '',
    description: '',
    link_url: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setError('שגיאה בטעינת המשרות')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { data, error: submitError } = await supabase
        .from('jobs')
        .insert([formData])
        .select();

      if (submitError) throw submitError;
      setSuccess('המשרה נוספה בהצלחה!');
      setFormData({
        name: '',
        category: '',
        location: '',
        description: '',
        link_url: ''
      });
      fetchJobs();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSuccess('המשרה נמחקה בהצלחה!');
      fetchJobs();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const handleEdit = (id: string) => {
    const job = jobs.find(j => j.id === id)
    if (job) {
      setCurrentJob(job)
      setIsEditing(true)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">טוען...</div>
  }

  return (
    <div className="py-12 bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">
          <span className="text-blue-600">ניהול</span> משרות
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">
            {isEditing ? 'עריכת משרה' : 'הוספת משרה חדשה'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right">שם המשרה</label>
              <input
                type="text"
                value={currentJob.name || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="הכנס שם משרה"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right">קטגוריה</label>
              <input
                type="text"
                value={currentJob.category || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="הכנס קטגוריה"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right">מיקום</label>
              <input
                type="text"
                value={currentJob.location || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="הכנס מיקום"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right">תיאור</label>
              <textarea
                value={currentJob.description || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                required
                placeholder="הכנס תיאור משרה"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right">קישור להגשת מועמדות</label>
              <input
                type="url"
                value={currentJob.link_url || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, link_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="הכנס קישור למשרה"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setCurrentJob({})
                  setError(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ביטול
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'שמירת שינויים' : 'הוספת משרה'}
            </button>
          </div>
        </form>

        <div className="space-y-4 max-w-2xl mx-auto">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              isAdmin={true}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 