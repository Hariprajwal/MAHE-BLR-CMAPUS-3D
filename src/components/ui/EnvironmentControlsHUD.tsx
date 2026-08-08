import React, { useState } from 'react';
import { Sun, Moon, CloudRain, Eye, Layers, Compass, Sparkles } from 'lucide-react';

export type TimeOfDay = 'day' | 'dusk' | 'night';
export type RenderPreset = 'realistic' | 'blueprint' | 'cinematic';

interface EnvironmentControlsHUDProps {
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (mode: TimeOfDay) => void;
  sunAngle: number;
  onSunAngleChange: (angle: number) => void;
  renderPreset: RenderPreset;
  onRenderPresetChange: (preset: RenderPreset) => void;
  isRainActive: boolean;
  onToggleRain: () => void;
}

export const EnvironmentControlsHUD: React.FC<EnvironmentControlsHUDProps> = ({
  timeOfDay,
  onTimeOfDayChange,
  sunAngle,
  onSunAngleChange,
  renderPreset,
  onRenderPresetChange,
  isRainActive,
  onToggleRain,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-20 left-4 z-40 pointer-events-auto">
      {/* Trigger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl backdrop-blur-xl border transition-all shadow-xl font-bold text-xs ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/40'
            : 'bg-slate-900/85 text-slate-200 border-slate-700/80 hover:bg-slate-800'
        }`}
      >
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>3D Render HUD</span>
      </button>

      {/* Expanded Controls Panel */}
      {isOpen && (
        <div className="mt-2 w-72 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl space-y-4 text-xs animate-in fade-in slide-in-from-top-3 duration-200">

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-black text-white tracking-wide uppercase text-[11px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-400" /> Lighting & FX
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 text-[10px] font-bold"
            >
              Close
            </button>
          </div>

          {/* Time of Day Presets */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Environment Lighting</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => onTimeOfDayChange('day')}
                className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all ${
                  timeOfDay === 'day'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Day</span>
              </button>

              <button
                onClick={() => onTimeOfDayChange('dusk')}
                className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all ${
                  timeOfDay === 'dusk'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-orange-400 rotate-45" />
                <span>Dusk</span>
              </button>

              <button
                onClick={() => onTimeOfDayChange('night')}
                className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all ${
                  timeOfDay === 'night'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Night</span>
              </button>
            </div>
          </div>

          {/* Sun Position Slider */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Sun Elevation Angle</span>
              <span className="text-blue-400 font-mono">{sunAngle}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={sunAngle}
              onChange={(e) => onSunAngleChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Render Mode Preset */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Shading & Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onRenderPresetChange('realistic')}
                className={`py-2 px-2.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                  renderPreset === 'realistic'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Realistic
              </button>

              <button
                onClick={() => onRenderPresetChange('blueprint')}
                className={`py-2 px-2.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                  renderPreset === 'blueprint'
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Wireframe
              </button>
            </div>
          </div>

          {/* Atmosphere Weather FX */}
          <div>
            <button
              onClick={onToggleRain}
              className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-between border transition-all ${
                isRainActive
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>Monsoon Rain Particles</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                isRainActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {isRainActive ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
