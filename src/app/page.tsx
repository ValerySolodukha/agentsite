import HeroSection from '@/components/HeroSection'
import FeaturedVacancies from '@/components/FeaturedVacancies'
import JobCategories from '@/components/JobCategories'
import FooterTabs from '@/components/FooterTabs'
import { supabase } from '@/lib/supabase'

async function getJobs() {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  return data || []
}

export default async function Home() {
  const jobs = await getJobs()

  return (
    <main>
      <HeroSection />
      <FeaturedVacancies jobs={jobs} />
      <JobCategories jobs={jobs} />
      <div className="max-w-4xl mx-auto my-8">
        <FooterTabs />
      </div>
    </main>
  )
}
