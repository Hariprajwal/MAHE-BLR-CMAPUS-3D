import React, { useState } from 'react';
import { Layers, MapPin, Globe } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';

interface MinimapProps {
  locations: CampusPOI[];
  selectedPoi: CampusPOI | null;
  onSelectPoi: (poi: CampusPOI) => void;
}

export type OpenFreeMapStyle = 'positron' | 'liberty' | 'bright';

export const Minimap: React.FC<MinimapProps> = ({ locations, selectedPoi, onSelectPoi }) => {
  const [mapStyle, setMapStyle] = useState<OpenFreeMapStyle>('positron');
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // Map world bounds [-60, 60] to 2D radar grid [0, 100]%
  const mapCoord = (val: number, isZ = false) => {
    const min = isZ ? -50 : -60;
    const max = isZ ? 60 : 60;
    const pct = ((val - min) / (max - min)) * 100;
    return Math.max(5, Math.min(95, pct));
  };

  // OpenFreeMap tile style URL generator (Free & Open Source, No API Key needed)
  // https://openfreemap.org
  const openFreeMapStyleUrl = `https://tiles.openfreemap.org/styles/${mapStyle}`;

  return (
    <div className="absolute bottom-6 right-6 z-40 w-52 h-52 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto hidden md:block">

      {/* Grid Overlay */}
      <div className={`absolute inset-0 transition-all ${
        mapStyle === 'positron' ? 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)] opacity-20' :
        mapStyle === 'bright' ? 'bg-[radial-gradient(#0284c7_1px,transparent_1px)] opacity-30' :
        'bg-[radial-gradient(#10b981_1px,transparent_1px)] opacity-25'
      } [background-size:12px_12px] pointer-events-none`} />

      {/* Center Radar Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-slate-700/40" />
        <div className="h-full w-px bg-slate-700/40 absolute" />
      </div>

      {/* Top Header Controls */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
        <div className="text-[9px] font-black uppercase text-blue-400 tracking-widest bg-slate-950/90 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
          <Globe className="w-3 h-3 text-emerald-400" />
          <span>OpenFreeMap</span>
        </div>

        <button
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className="p-1 rounded bg-slate-950/90 text-slate-300 hover:text-white border border-slate-700/60"
          title="Change Map Style"
        >
          <Layers className="w-3 h-3" />
        </button>
      </div>

      {/* Style Switcher Menu */}
      {showStyleMenu && (
        <div className="absolute top-8 right-2 z-30 bg-slate-950/95 border border-slate-700 rounded-xl p-1.5 shadow-2xl text-[10px] space-y-1">
          <button
            onClick={() => { setMapStyle('positron'); setShowStyleMenu(false); }}
            className={`w-full px-2 py-1 rounded text-left font-bold block ${mapStyle === 'positron' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Positron (Dark GIS)
          </button>
          <button
            onClick={() => { setMapStyle('liberty'); setShowStyleMenu(false); }}
            className={`w-full px-2 py-1 rounded text-left font-bold block ${mapStyle === 'liberty' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Liberty (OSM Std)
          </button>
          <button
            onClick={() => { setMapStyle('bright'); setShowStyleMenu(false); }}
            className={`w-full px-2 py-1 rounded text-left font-bold block ${mapStyle === 'bright' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Bright (High Contrast)
          </button>
        </div>
      )}

      {/* POI Blips */}
      {locations.map((loc) => {
        const left = mapCoord(loc.position[0]);
        const top = mapCoord(loc.position[2], true);
        const isSelected = selectedPoi?.id === loc.id;
        const isSrishti = loc.category === 'srishti_house';

        return (
          <button
            key={loc.id}
            onClick={() => onSelectPoi(loc)}
            style={{ left: `${left}%`, top: `${top}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150 ${
              isSelected
                ? 'w-3.5 h-3.5 bg-sky-400 ring-4 ring-sky-400/50 scale-125 z-10'
                : isSrishti
                ? 'w-2.5 h-2.5 bg-amber-400'
                : loc.category === 'academic'
                ? 'w-2.5 h-2.5 bg-blue-400'
                : 'w-2.5 h-2.5 bg-emerald-400'
            }`}
            title={`${loc.name} (${loc.shortName})`}
          />
        );
      })}

      {/* Bottom Footer Info */}
      <div className="absolute bottom-1 left-2 text-[8px] font-mono text-slate-500 pointer-events-none">
        OpenFreeMap • OSM Vector Data
      </div>
    </div>
  );
};
