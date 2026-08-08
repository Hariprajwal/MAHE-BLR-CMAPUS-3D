import React from 'react';
import { CampusPOI } from '../../data/campusData';

interface MinimapProps {
  locations: CampusPOI[];
  selectedPoi: CampusPOI | null;
  onSelectPoi: (poi: CampusPOI) => void;
}

export const Minimap: React.FC<MinimapProps> = ({ locations, selectedPoi, onSelectPoi }) => {
  // Map world bounds [-60, 60] to 2D radar grid [0, 100]%
  const mapCoord = (val: number, isZ = false) => {
    const min = isZ ? -50 : -60;
    const max = isZ ? 60 : 60;
    const pct = ((val - min) / (max - min)) * 100;
    return Math.max(5, Math.min(95, pct));
  };

  return (
    <div className="absolute bottom-6 right-6 z-40 w-44 h-44 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto hidden md:block">
      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

      {/* Center Radar Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-slate-700/50" />
        <div className="h-full w-px bg-slate-700/50 absolute" />
      </div>

      {/* Label */}
      <div className="absolute top-2 left-2 text-[9px] font-black uppercase text-blue-400 tracking-widest bg-slate-950/80 px-1.5 py-0.5 rounded border border-blue-500/30">
        Radar 2D
      </div>

      {/* POI Blips */}
      {locations.map((loc) => {
        const left = mapCoord(loc.position[0]);
        const top = mapCoord(loc.position[2], true);
        const isSelected = selectedPoi?.id === loc.id;

        return (
          <button
            key={loc.id}
            onClick={() => onSelectPoi(loc)}
            style={{ left: `${left}%`, top: `${top}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-transform hover:scale-150 ${
              isSelected
                ? 'bg-blue-500 ring-4 ring-blue-400/50 scale-125 z-10'
                : loc.category === 'restaurant' || loc.category === 'cafe'
                ? 'bg-amber-400'
                : loc.category === 'academic'
                ? 'bg-blue-400'
                : 'bg-emerald-400'
            }`}
            title={loc.name}
          />
        );
      })}
    </div>
  );
};
