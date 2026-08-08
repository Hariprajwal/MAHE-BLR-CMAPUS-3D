import React from 'react';
import { Sparkles, Sun, Moon, Compass, Eye, ShieldCheck, Search, Navigation, DoorOpen, Globe } from 'lucide-react';

interface HeaderNavProps {
  cameraMode: 'orbit' | 'aerial' | 'fps' | 'vr' | 'cesium';
  isNightMode: boolean;
  isAIOpen: boolean;
  isAdminOpen: boolean;
  isGateManagerOpen: boolean;
  isCesiumOpen: boolean;
  onSetCameraMode: (mode: 'orbit' | 'aerial' | 'fps' | 'vr' | 'cesium') => void;
  onToggleNightMode: () => void;
  onToggleAI: () => void;
  onToggleAdmin: () => void;
  onToggleGateManager: () => void;
  onToggleCesium: () => void;
  onOpenSearch: () => void;
  onOpenRoutePlanner: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  cameraMode,
  isNightMode,
  isAIOpen,
  isAdminOpen,
  isGateManagerOpen,
  isCesiumOpen,
  onSetCameraMode,
  onToggleNightMode,
  onToggleAI,
  onToggleAdmin,
  onToggleGateManager,
  onToggleCesium,
  onOpenSearch,
  onOpenRoutePlanner,
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
      {/* Brand Logo & Title */}
      <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 px-4 py-2.5 rounded-2xl shadow-2xl">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
          M
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
            MAHE BENGALURU
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
              3D Twin
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Digital Campus & AI Navigator</p>
        </div>
      </div>

      {/* Mode Selectors & Main Actions */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 p-1.5 rounded-2xl shadow-2xl">
        {/* Orbit 3D */}
        <button
          onClick={() => onSetCameraMode('orbit')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            cameraMode === 'orbit'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>3D Map</span>
        </button>

        {/* Aerial View */}
        <button
          onClick={() => onSetCameraMode('aerial')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            cameraMode === 'aerial'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Aerial View</span>
        </button>

        {/* First Person FPS */}
        <button
          onClick={() => onSetCameraMode('fps')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            cameraMode === 'fps'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>🚶 Walking FPS</span>
        </button>

        {/* WebXR VR */}
        <button
          onClick={() => onSetCameraMode('vr')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            cameraMode === 'vr'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>🥽 WebXR VR</span>
        </button>

        {/* Cesium 3D Tiles Mode */}
        <button
          onClick={onToggleCesium}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isCesiumOpen
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/40'
              : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>🌐 Cesium 3D Tiles</span>
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Campus Gates Hub */}
        <button
          onClick={onToggleGateManager}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isGateManagerOpen
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40'
              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
          }`}
        >
          <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gates 1–3</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Search Campus"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Route Navigator */}
        <button
          onClick={onOpenRoutePlanner}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Campus Navigation"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Day/Night */}
        <button
          onClick={onToggleNightMode}
          className="p-2 rounded-xl text-amber-400 hover:bg-slate-800 transition-all"
          title="Toggle Day/Night"
        >
          {isNightMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* AI Campus Assistant */}
        <button
          onClick={onToggleAI}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isAIOpen
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
              : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>AI Assistant</span>
        </button>

        {/* Admin Center */}
        <button
          onClick={onToggleAdmin}
          className={`p-2 rounded-xl transition-all ${
            isAdminOpen ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Admin Control Dashboard"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
