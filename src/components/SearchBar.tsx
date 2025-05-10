import { MdAutoFixHigh } from 'react-icons/md';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, onSearch, placeholder = 'שם משרה, מילות מפתח או חברה', className = '' }: SearchBarProps) {
  return (
    <div className={`flex items-center w-full ${className}`} dir="rtl">
      <button
        type="button"
        onClick={onSearch}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-l-lg text-xl font-bold whitespace-nowrap"
        style={{ minWidth: 120 }}
      >
        <span className="flex items-center gap-2">
          <MdAutoFixHigh size={32} className="text-blue-200" />
          חפש משרות
        </span>
      </button>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-4 rounded-r-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg outline-none"
      />
    </div>
  );
} 