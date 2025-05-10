import { MdWork, MdComputer, MdBusiness, MdLocalHospital, MdSchool, MdShoppingCart, MdEngineering, MdCategory } from 'react-icons/md';

interface Job {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  link_url: string;
}

interface JobCategoriesProps {
  jobs: Job[];
}

function getCategoryIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes('הייטק') || lower.includes('טכנולוגיה') || lower.includes('טכנולוגי') || lower.includes('מחשבים')) return <MdComputer size={32} className="text-blue-400" />;
  if (lower.includes('עסקים') || lower.includes('ניהול')) return <MdBusiness size={32} className="text-blue-400" />;
  if (lower.includes('בריאות') || lower.includes('רפואה')) return <MdLocalHospital size={32} className="text-blue-400" />;
  if (lower.includes('חינוך') || lower.includes('הוראה')) return <MdSchool size={32} className="text-blue-400" />;
  if (lower.includes('מכירות') || lower.includes('שיווק')) return <MdShoppingCart size={32} className="text-blue-400" />;
  if (lower.includes('הנדסה')) return <MdEngineering size={32} className="text-blue-400" />;
  if (lower.includes('עבודה') || lower.includes('משרה')) return <MdWork size={32} className="text-blue-400" />;
  return <MdCategory size={32} className="text-blue-400" />;
}

export default function JobCategories({ jobs }: JobCategoriesProps) {
  // Only show categories that actually exist in the jobs data from Supabase
  const categories = Array.from(new Set(jobs.map(job => job.category).filter(Boolean)));
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: jobs.filter(job => job.category === cat).length,
  }));

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-900">
          קטגוריות
        </h2>
        <p className="text-center text-gray-500 mb-8">
          חפשו משרות לפי תחום עיסוק והתמחות
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categoryCounts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">לא נמצאו קטגוריות</div>
          ) : (
            categoryCounts.map(cat => (
              <div key={cat.name} className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  {getCategoryIcon(cat.name)}
                </div>
                <div className="font-semibold text-lg mb-1 text-white">{cat.name}</div>
                <div className="text-gray-400 text-sm">{cat.count} משרות</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
} 