import React from 'react';
import { CampusPOI } from '../../data/campusData';

interface CategoryBarProps {
  locations: CampusPOI[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Campus', icon: '📍' },
  { id: 'academic', label: 'Academic Blocks', icon: '🏢' },
  { id: 'hostel', label: 'Hostels', icon: '🏨' },
  { id: 'restaurant', label: 'Food Court & Dining', icon: '🍕' },
  { id: 'cafe', label: 'Cafes & Bakeries', icon: '☕' },
  { id: 'library', label: 'Library & Learning', icon: '📚' },
  { id: 'sports', label: 'Sports & Fitness', icon: '🏟️' },
  { id: 'medical', label: 'Health & Clinic', icon: '🏥' },
  { id: 'parking', label: 'Parking & EV', icon: '🅿️' },
  { id: 'atm', label: 'ATMs & Banking', icon: '🏧' },
  { id: 'entrance', label: 'Campus Gates', icon: '🚪' }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  locations,
  activeCategory,
  onSelectCategory
}) => {
  const getCount = (catId: string) => {
    if (catId === 'all') return locations.length;
    return locations.filter((loc) => loc.category === catId).length;
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[90vw] pointer-events-auto">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl">
        {CATEGORIES.map((cat) => {
          const isActive = (activeCategory === cat.id) || (!activeCategory && cat.id === 'all');
          const count = getCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-700/70 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
