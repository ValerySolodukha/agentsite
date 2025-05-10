import JobCard from './JobCard';

export default function FeaturedVacancies({ jobs }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-900">
          <span className="text-blue-600">משרות</span> נבחרות
        </h2>
        <p className="text-center text-gray-500 mb-8">
          בחרנו עבורכם משרות איכותיות מהחברות המובילות במשק
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {jobs.slice(0, 6).map(job => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        <div className="flex justify-center">
          <a href="/jobs" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
            צפה בכל המשרות
          </a>
        </div>
      </div>
    </section>
  );
} 