import React, { useState } from 'react';
import {
  X, Star, Clock, MapPin, ShieldCheck, Navigation, Eye,
  Utensils, Info, ExternalLink, Building2, CheckCircle, Bot, Sparkles
} from 'lucide-react';
import { CampusPOI } from '../../data/campusData';
import { getBuildingAgent } from '../../data/buildingAgentEngine';

interface LocationDetailPanelProps {
  poi: CampusPOI | null;
  onClose: () => void;
  onNavigateTo: (poi: CampusPOI) => void;
  onAerialView: () => void;
  onEnterInterior: (poi: CampusPOI) => void;
  onOpenBuildingAgent?: (poi: CampusPOI) => void;
}

function gpsAccuracyBadge(accuracy: string) {
  switch (accuracy) {
    case 'exact_verified':
      return { label: 'GPS Exact', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' };
    case 'zone_approximate':
      return { label: 'Zone Approximate', color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' };
    case 'off_campus':
      return { label: 'Off-Campus Location', color: 'text-slate-400 bg-slate-800/60 border-slate-600/30' };
    default:
      return { label: 'Unknown', color: 'text-slate-400 bg-slate-800 border-slate-700' };
  }
}

export const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  poi,
  onClose,
  onNavigateTo,
  onAerialView,
  onEnterInterior,
  onOpenBuildingAgent,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'floorplan' | 'menu' | 'reviews'>('info');

  if (!poi) return null;

  const gpsBadge = gpsAccuracyBadge(poi.gpsAccuracy);
  const buildingAgent = getBuildingAgent(poi.id);

  return (
    <aside className="absolute top-20 right-4 z-40 w-[26rem] max-w-[calc(100vw-32px)] bg-slate-900/92 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300 pointer-events-auto">

      {/* Header Banner */}
      <div className="relative p-5 bg-gradient-to-b from-blue-900/40 via-slate-900/50 to-slate-900 border-b border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-500/30 capitalize">
            {poi.category.replace('_', ' ')}
          </span>
          {poi.status === 'active' && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open Now
            </span>
          )}
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${gpsBadge.color}`}>
            <MapPin className="w-2.5 h-2.5" />
            {gpsBadge.label}
          </span>
        </div>

        <h2 className="text-lg font-black text-white tracking-tight leading-snug">{poi.name}</h2>

        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
          {poi.latitude.toFixed(4)}° N, {poi.longitude.toFixed(4)}° E
        </p>

        {/* Building In-Charge Agent Quick Bar */}
        {onOpenBuildingAgent && (
          <button
            onClick={() => onOpenBuildingAgent(poi)}
            className="mt-3 w-full p-2.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-blue-500/40 hover:border-blue-400 transition-all flex items-center justify-between text-left group shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-lg">
                {buildingAgent.avatarIcon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                  Building In-Charge Agent
                </span>
                <span className="text-xs font-black text-white group-hover:text-blue-300 transition-colors">
                  {buildingAgent.agentName}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Talk
            </span>
          </button>
        )}

        {/* Rating & Verified Source */}
        <div className="mt-3 flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
          {poi.rating ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-400/20 text-amber-300 font-black text-xs rounded-lg border border-amber-400/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {poi.rating}
              </div>
              <span className="text-xs text-slate-400 font-medium">({poi.reviewCount} reviews)</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Rating unavailable</span>
          )}

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 max-w-[140px] truncate">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span className="truncate">{poi.verifiedSource}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-2 bg-slate-900/50 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-2.5 px-3 text-[11px] font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'info' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5 inline mr-1" />Overview
        </button>

        {poi.floorPlan && poi.floorPlan.length > 0 && (
          <button
            onClick={() => setActiveTab('floorplan')}
            className={`py-2.5 px-3 text-[11px] font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'floorplan' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 inline mr-1" />Floor Plan
          </button>
        )}

        {poi.menuItems && (
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 px-3 text-[11px] font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'menu' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 inline mr-1" />Menu ({poi.menuItems.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-2.5 px-3 text-[11px] font-bold border-b-2 transition-all whitespace-nowrap ${
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

            {poi.openingHours && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">
                    {poi.openingHours.open === '00:00' && poi.openingHours.close === '23:59'
                      ? '24/7 Always Open'
                      : `${poi.openingHours.open} – ${poi.openingHours.close} IST`}
                  </span>
                  {poi.openingHours.note && (
                    <span className="block text-[10px] text-slate-400 mt-0.5">{poi.openingHours.note}</span>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {poi.floors && (
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Floors</span>
                  <span className="text-sm font-bold text-white">{poi.floors}</span>
                </div>
              )}
              {poi.classrooms && (
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Classrooms</span>
                  <span className="text-sm font-bold text-white">{poi.classrooms}</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Facilities</h4>
              <div className="flex flex-wrap gap-1.5">
                {poi.facilities.map((fac, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 font-medium">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> {fac}
                  </span>
                ))}
              </div>
            </div>

            {poi.sourceUrl && (
              <a href={poi.sourceUrl} target="_blank" rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-semibold">
                View Official Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </>
        )}

        {/* Floor Plan Tab */}
        {activeTab === 'floorplan' && poi.floorPlan && (
          <div className="space-y-3">
            {poi.floorPlan.map((floor) => (
              <div key={floor.floor} className="border border-slate-700/60 rounded-xl overflow-hidden bg-slate-800/30">
                <div className="px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/40 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/40 text-blue-300 text-[10px] font-black flex items-center justify-center border border-blue-500/30">
                    {floor.floor}
                  </span>
                  <span className="text-[11px] font-bold text-slate-200">{floor.label}</span>
                </div>
                <div className="p-2.5 grid grid-cols-2 gap-1.5">
                  {floor.rooms.map((room) => (
                    <div key={room.id} className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50">
                      <span className="text-[10px] font-bold text-slate-200 block">{room.name}</span>
                      <span className="text-[9px] font-bold uppercase text-purple-400 mt-0.5 block">{room.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && poi.menuItems && (
          <div className="space-y-2">
            {poi.menuItems.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/40 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                  <span className="font-bold text-white">{item.name}</span>
                </div>
                <span className="font-extrabold text-blue-400 text-sm">{item.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {poi.reviews && poi.reviews.length > 0 ? (
              poi.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-1">{rev.userName}</span>
                    <span className="text-amber-300 font-bold">⭐ {rev.rating}</span>
                  </div>
                  <p className="text-slate-300 text-xs italic">&quot;{rev.comment}&quot;</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">No community reviews yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
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

        {onOpenBuildingAgent ? (
          <button
            onClick={() => onOpenBuildingAgent(poi)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold text-xs border border-indigo-500/40 transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" /> Agent
          </button>
        ) : (
          <button
            onClick={() => onEnterInterior(poi)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition-all"
          >
            <span>🏢 Interior</span>
          </button>
        )}
      </div>
    </aside>
  );
};
