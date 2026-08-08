import React, { useState, useEffect } from 'react';
import { X, Navigation, MapPin, Footprints, Clock, CheckCircle } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';
import { calculateCampusRoute, RouteResult } from '../../data/pathfindingEngine';

interface RoutePlannerPanelProps {
  isOpen: boolean;
  locations: CampusPOI[];
  initialDestination?: CampusPOI | null;
  onClose: () => void;
  onRouteCalculated: (route: RouteResult | null) => void;
}

export const RoutePlannerPanel: React.FC<RoutePlannerPanelProps> = ({
  isOpen,
  locations,
  initialDestination,
  onClose,
  onRouteCalculated
}) => {
  const [startId, setStartId] = useState<string>('HOSTEL_H1');
  const [destId, setDestId] = useState<string>('LIBRARY_MAIN');
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);

  useEffect(() => {
    if (initialDestination) {
      setDestId(initialDestination.id);
    }
  }, [initialDestination]);

  useEffect(() => {
    if (startId && destId && startId !== destId) {
      const res = calculateCampusRoute(startId, destId);
      setActiveRoute(res);
      onRouteCalculated(res);
    } else {
      setActiveRoute(null);
      onRouteCalculated(null);
    }
  }, [startId, destId, onRouteCalculated]);

  if (!isOpen) return null;

  return (
    <aside className="absolute top-20 left-4 z-40 w-96 max-w-[calc(100vw-32px)] bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left-8 duration-300 pointer-events-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Campus Navigation</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Origin & Destination Dropdowns */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-3">
        {/* Start */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Start Location
          </label>
          <select
            value={startId}
            onChange={(e) => setStartId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Destination
          </label>
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculated Route Info */}
      {activeRoute ? (
        <div className="p-4 max-h-72 overflow-y-auto space-y-4 text-xs">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex items-center gap-2">
              <Footprints className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-[10px] text-blue-300 font-bold uppercase block">Walking Distance</span>
                <span className="text-base font-black text-white">{activeRoute.totalDistanceMeter} m</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">Est. Walk Time</span>
                <span className="text-base font-black text-white">{activeRoute.estimatedTimeMin} mins</span>
              </div>
            </div>
          </div>

          {/* Landmarks along route */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Key Landmarks Along Walkway
            </h4>
            <div className="flex flex-wrap gap-1">
              {activeRoute.landmarksAlongRoute.map((lm, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                  📍 {lm}
                </span>
              ))}
            </div>
          </div>

          {/* Step by step directions */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Walking Instructions
            </h4>
            <div className="space-y-2">
              {activeRoute.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-300 bg-slate-800/40 p-2 rounded-xl border border-slate-700/40">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{st.text}</p>
                    <span className="text-[10px] text-slate-400">~ {st.distanceMeter} meters</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">
          Select different Start & Destination locations to calculate 3D campus walking route.
        </div>
      )}
    </aside>
  );
};
