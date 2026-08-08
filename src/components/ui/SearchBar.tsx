import React, { useState } from 'react';
import { Search, X, MapPin, Star, ArrowRight } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';

interface SearchBarProps {
  isOpen: boolean;
  locations: CampusPOI[];
  onClose: () => void;
  onSelectLocation: (poi: CampusPOI) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  locations,
  onClose,
  onSelectLocation
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = locations.filter((loc) => {
    const q = query.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.shortName.toLowerCase().includes(q) ||
      loc.category.toLowerCase().includes(q) ||
      loc.facilities.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Input Field Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, food court, library, gym, hostels..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No campus locations found matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((poi) => (
              <div
                key={poi.id}
                onClick={() => {
                  onSelectLocation(poi);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-slate-800/80 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0 group-hover:border-blue-500/50">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {poi.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="capitalize font-medium text-slate-300">{poi.category}</span>
                      {poi.rating && (
                        <span className="flex items-center gap-1 text-amber-300 font-semibold">
                          <Star className="w-3 h-3 fill-amber-300" /> {poi.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
