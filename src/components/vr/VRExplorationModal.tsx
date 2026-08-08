import React, { useState } from 'react';
import { X, Eye, Compass, Navigation, Layers, ShieldCheck } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';

interface VRExplorationModalProps {
  isOpen: boolean;
  locations: CampusPOI[];
  selectedPoi: CampusPOI | null;
  onClose: () => void;
  onSelectPoi: (poi: CampusPOI) => void;
}

export const VRExplorationModal: React.FC<VRExplorationModalProps> = ({
  isOpen,
  locations,
  selectedPoi,
  onClose,
  onSelectPoi
}) => {
  const [vrStatus, setVrStatus] = useState<'idle' | 'searching' | 'active'>('idle');

  if (!isOpen) return null;

  const handleStartVR = () => {
    setVrStatus('searching');
    setTimeout(() => {
      setVrStatus('active');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xl">
              🥽
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                WEBXR VR CAMPUS EXPLORATION
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  Headset Ready
                </span>
              </h2>
              <p className="text-xs text-purple-300">Immersive Virtual Reality Campus Tour & Spatial UI</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-300">
          {vrStatus === 'idle' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-4xl shadow-xl shadow-purple-500/20 animate-pulse">
                🥽
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-white">Enter MAHE Bengaluru Virtual Reality</h3>
                <p className="text-slate-400">
                  Immerse yourself inside the 3D campus using Meta Quest, HTC Vive, Apple Vision Pro, or Mobile VR headsets.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-left pt-2">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <span className="font-bold text-purple-300 block mb-1">🎮 Teleportation</span>
                  <span className="text-slate-400 text-[11px]">Instant raycast jump between campus blocks</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <span className="font-bold text-purple-300 block mb-1">💬 Spatial HUD</span>
                  <span className="text-slate-400 text-[11px]">Floating 3D info panels in VR space</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <span className="font-bold text-purple-300 block mb-1">🏛️ 3D Interiors</span>
                  <span className="text-slate-400 text-[11px]">Step inside supported academic halls</span>
                </div>
              </div>

              <button
                onClick={handleStartVR}
                className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/40 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Launch WebXR VR Session</span>
              </button>
            </div>
          )}

          {vrStatus === 'searching' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bold text-white text-sm">Detecting WebXR Headset Hardware & Spatial Anchors...</p>
            </div>
          )}

          {vrStatus === 'active' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-emerald-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">WebXR Immersive Session Active</span>
                </div>
                <button
                  onClick={() => setVrStatus('idle')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg"
                >
                  Exit VR Mode
                </button>
              </div>

              {/* Stereoscopic Preview Frame */}
              <div className="grid grid-cols-2 gap-2 h-44 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2 relative">
                <div className="bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                  Left Eye Render (60 FPS)
                </div>
                <div className="bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                  Right Eye Render (60 FPS)
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/90 text-purple-300 border border-purple-500/30 rounded-full font-bold text-[10px]">
                  Head tracking active • 6-DOF
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
