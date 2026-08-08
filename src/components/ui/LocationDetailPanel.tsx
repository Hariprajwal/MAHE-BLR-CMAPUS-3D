import React, { useState } from 'react';
import { X, Star, Clock, MapPin, ShieldCheck, Navigation, Eye, Utensils, Info, ExternalLink } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';

interface LocationDetailPanelProps {
  poi: CampusPOI | null;
  onClose: () => void;
  onNavigateTo: (poi: CampusPOI) => void;
  onAerialView: () => void;
  onEnterInterior: (poi: CampusPOI) => void;
}

export const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  poi,
  onClose,
  onNavigateTo,
  onAerialView,
  onEnterInterior
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'reviews'>('info');

  if (!poi) return null;

  return (
    <aside className="absolute top-20 right-4 z-40 w-96 max-w-[calc(100vw-32px)] bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300 pointer-events-auto">
      {/* Header Banner */}
      <div className="relative p-5 bg-gradient-to-b from-blue-900/40 via-slate-900/50 to-slate-900 border-b border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-500/30">
            {poi.category}
          </span>
          {poi.status === 'active' && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open Now
            </span>
          )}
        </div>

        <h2 className="text-xl font-black text-white tracking-tight">{poi.name}</h2>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>MAHE Bengaluru Campus</span>
        </p>

        {/* Rating & Verified Source Badge */}
        <div className="mt-3 flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
          {poi.rating ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-400/20 text-amber-300 font-black text-xs rounded-lg border border-amber-400/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {poi.rating}
              </div>
              <span className="text-xs text-slate-400 font-medium">({poi.reviewCount} verified reviews)</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Rating unavailable</span>
          )}

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            {poi.verifiedSource}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/50">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'info' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5 inline mr-1" /> Overview
        </button>

        {poi.menuItems && (
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'menu' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 inline mr-1" /> Menu ({poi.menuItems.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'reviews' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ⭐ Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 max-h-80 overflow-y-auto space-y-4 text-xs text-slate-300">
        {activeTab === 'info' && (
          <>
            <p className="leading-relaxed text-slate-300">{poi.description}</p>

            {/* Timings */}
            {poi.openingHours && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="font-semibold text-slate-200">Operating Hours: </span>
                  <span className="text-slate-400">{poi.openingHours.open} — {poi.openingHours.close} IST</span>
                </div>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2">
              {poi.floors && (
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Floors</span>
                  <span className="text-sm font-bold text-white">{poi.floors} Floors</span>
                </div>
              )}
              {poi.classrooms && (
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Classrooms</span>
                  <span className="text-sm font-bold text-white">{poi.classrooms} Smart Rooms</span>
                </div>
              )}
            </div>

            {/* Facilities Chips */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Facilities</h4>
              <div className="flex flex-wrap gap-1.5">
                {poi.facilities.map((fac, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 font-medium">
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>

            {poi.sourceUrl && (
              <a
                href={poi.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                View Official MAHE Circular <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </>
        )}

        {activeTab === 'menu' && poi.menuItems && (
          <div className="space-y-2">
            {poi.menuItems.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                    <span className="font-bold text-white">{item.name}</span>
                    {item.isPopular && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-extrabold text-blue-400 text-sm">{item.price}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {poi.reviews && poi.reviews.length > 0 ? (
              poi.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-1">
                      {rev.userName}
                      {rev.verifiedStudent && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">
                          Student
                        </span>
                      )}
                    </span>
                    <span className="text-amber-300 font-bold">⭐ {rev.rating}</span>
                  </div>
                  <p className="text-slate-300 text-xs italic">&quot;{rev.comment}&quot;</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{rev.date}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">No community reviews logged yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 grid grid-cols-3 gap-2">
        <button
          onClick={() => onNavigateTo(poi)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30"
        >
          <Navigation className="w-3.5 h-3.5" /> Navigate
        </button>

        <button
          onClick={onAerialView}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> Aerial
        </button>

        <button
          onClick={() => onEnterInterior(poi)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition-all"
        >
          <span>🏢 3D Interior</span>
        </button>
      </div>
    </aside>
  );
};
