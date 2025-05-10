'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import JobCard from '@/components/JobCard'
import SearchBar from '@/components/SearchBar'

interface Job {
  id: string
  name: string
  category: string
  location: string
  description: string
  link_url: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  })
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.location) {
        query = query.eq('location', filters.location)
      }

      const { data, error } = await query
      if (error) throw error

      setJobs(data || [])
      const uniqueCategories = [...new Set(data?.map(job => job.category) || [])]
      const uniqueLocations = [...new Set(data?.map(job => job.location) || [])]
      setCategories(uniqueCategories)
      setLocations(uniqueLocations)
    } catch (error) {
      // אפשר להוסיף הודעת שגיאה בעברית
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, category: e.target.value })
    fetchJobs()
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, location: e.target.value })
    fetchJobs()
  }

  // סינון בצד לקוח לפי החיפוש
  const filteredJobs = jobs.filter(job => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      job.name?.toLowerCase().includes(q) ||
      job.category?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">טוען...</div>
  }

  return (
    <div className="py-12 bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">
          <span className="text-blue-600">כל</span> המשרות
        </h1>

        <div className="mb-8 rounded-lg p-6" style={{ background: 'linear-gradient(90deg, #e0e7ff 0%, #f0f4ff 100%)' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="שם משרה, מילות מפתח או חברה"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                קטגוריה
              </label>
              <select
                value={filters.category}
                onChange={handleCategoryChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">הכל</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                מיקום
              </label>
              <select
                value={filters.location}
                onChange={handleLocationChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">הכל</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              לא נמצאו משרות מתאימות
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))
          )}
        </div>
      </div>
    </div>
  )
} 