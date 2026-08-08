import React, { useState } from 'react';
import {
  X, Globe, Layers, MapPin, ExternalLink, ShieldCheck,
  Maximize2, Cpu, CheckCircle, RefreshCw, Compass, Play
} from 'lucide-react';
import { MAHE_CENTER_GEO } from '../../data/campusData';

interface Cesium3DTilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cesium3DTilesModal: React.FC<Cesium3DTilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTileset, setActiveTileset] = useState<string>('google_3d_photogrammetry');
  const [currentLat, setCurrentLat] = useState<number>(MAHE_CENTER_GEO.lat);
  const [currentLng, setCurrentLng] = useState<number>(MAHE_CENTER_GEO.lng);
  const [tileFormat, setTileFormat] = useState<'b3dm' | 'i3dm' | 'pnts' | 'gltf'>('b3dm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OGC 3D Tiles Standard (CesiumGS / 3D-Tiles)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-bold">Live Geospatial Stream</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                MAHE Bengaluru — Cesium 3D Tiles Engine
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/CesiumGS/3d-tiles"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> CesiumGS Spec
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Geo-Controls */}
        <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-bold">Target GPS:</span>
            <span className="text-white font-mono font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
            </span>
            <span className="text-[10px] text-slate-500">BSF Campus, Govindapura, Yelahanka 560064</span>
          </div>

          {/* Tile Format Indicator */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase mr-1">Tile Payload:</span>
            {['b3dm', 'i3dm', 'pnts', 'gltf'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setTileFormat(fmt as any)}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition-all ${
                  tileFormat === fmt
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                .{fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 3D Tiles Viewer Canvas Area */}
        <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Simulated Photogrammetry / 3D Tileset Viewport */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-90" />

          {/* Grid lines simulating 3D spatial tileset bounding box */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)] [background-size:32px_32px]" />

          {/* 3D Tile Stream Active Card */}
          <div className="relative z-10 p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 max-w-lg text-center space-y-4 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-cyan-500/20">
              🌐
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Cesium OGC 3D Tiles Specification
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                MAHE Campus Photogrammetry Tileset
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Streaming Batched 3D Model (<code className="text-cyan-300 font-mono">.b3dm</code>) & Instanced 3D Model (<code className="text-cyan-300 font-mono">.i3dm</code>) tilesets for Govindapura Yelahanka 85-acre campus footprint.
              </p>
            </div>

            {/* Tileset Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-2">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-500 block">LOD Levels</span>
                <span className="font-black text-white block mt-0.5">LOD 0 – 4</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-500 block">Bounding Volume</span>
                <span className="font-black text-cyan-400 block mt-0.5">Oriented Box</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-500 block">Renderer</span>
                <span className="font-black text-emerald-400 block mt-0.5">3DTilesRendererJS</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCurrentLat(13.1169);
                  setCurrentLng(77.5901);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-600/30"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Recenter on MAHE Lat/Lng
              </button>
            </div>
          </div>

          {/* Floating Geo-Overlay Info */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-3 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Cesium OGC 3D Tileset Active</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Root Tile: tileset.json | Spatial Ref: EPSG:4978 (ECEF WGS84)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">CesiumGS 3D Tiles Engine v1.1 • Open Geospatial Consortium (OGC)</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
