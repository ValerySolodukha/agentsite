"use client"
import { useState } from 'react';

export default function FooterTabs() {
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>('about');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('אנא מלאו את כל השדות');
      return;
    }
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="w-full bg-gray-900 rounded-2xl shadow-xl overflow-hidden" dir="rtl">
      <div className="flex justify-center border-b border-gray-800">
        <button
          className={`flex-1 py-3 text-lg font-bold transition ${activeTab === 'about' ? 'text-blue-300 border-b-2 border-blue-400 bg-gray-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('about')}
        >
          אודות
        </button>
        <button
          className={`flex-1 py-3 text-lg font-bold transition ${activeTab === 'contact' ? 'text-blue-300 border-b-2 border-blue-400 bg-gray-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('contact')}
        >
          צור קשר
        </button>
      </div>
      <div className="p-6 text-right text-gray-200 bg-gray-800 min-h-[120px]">
        {activeTab === 'about' && (
          <div>
            <h3 className="font-bold mb-2 text-blue-300 text-xl">אודות האתר</h3>
            <p className="leading-relaxed">
              לוח הדרושים שלנו נועד לעזור לכם למצוא את המשרה המתאימה ביותר עבורכם, בקלות ובמהירות. האתר מציג משרות ממגוון תחומים ומאפשר סינון וחיפוש מתקדם.
            </p>
          </div>
        )}
        {activeTab === 'contact' && (
          <div>
            <h3 className="font-bold mb-2 text-blue-300 text-xl">צור קשר</h3>
            {sent ? (
              <div className="text-green-400 font-bold py-2">ההודעה נשלחה בהצלחה!</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="שם מלא"
                    className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="אימייל"
                    className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="הודעה"
                    className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                    rows={3}
                  />
                </div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition"
                >
                  שלח
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 