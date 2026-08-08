import React, { Suspense, useState } from 'react';
import { X, Globe, Layers, MapPin, ExternalLink, RefreshCw, Cpu } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import { TilesRenderer, TilesPlugin } from '3d-tiles-renderer/r3f';
import { CesiumIonAuthPlugin } from '3d-tiles-renderer/plugins';
import * as THREE from 'three';

// Cesium Ion token from env
const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN as string;

// Cesium Ion Asset IDs
const ASSETS = {
  OSM_BUILDINGS: 96188,       // Cesium OSM Buildings (global coverage)
  WORLD_TERRAIN: 1,           // Cesium World Terrain
};

interface Cesium3DTilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Inner canvas scene with TilesRenderer
const CesiumTileScene: React.FC<{ assetId: number }> = ({ assetId }) => {
  return (
    <>
      <ambientLight intensity={0.7} color="#e2e8f0" />
      <directionalLight
        position={[80, 120, 60]}
        intensity={1.4}
        color="#fff8e1"
        castShadow
      />
      <hemisphereLight args={['#bfdbfe', '#1e3a2b', 0.5]} />
      <Sky sunPosition={[80, 120, 60]} />
      <Environment preset="city" background={false} />

      <Suspense fallback={null}>
        <TilesRenderer>
          <TilesPlugin
            plugin={CesiumIonAuthPlugin}
            args={[{ apiToken: CESIUM_ION_TOKEN, assetId }] as any}
          />
        </TilesRenderer>
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={50}
        maxDistance={5000}
        target={[0, 0, 0]}
      />
    </>
  );
};

export const Cesium3DTilesModal: React.FC<Cesium3DTilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeAsset, setActiveAsset] = useState<number>(ASSETS.OSM_BUILDINGS);
  const [tileKey, setTileKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900/98 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OGC 3D Tiles — CesiumGS Standard
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-bold">Live Streaming</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                Cesium Ion Geospatial Engine
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Powered by <span className="text-cyan-400 font-bold">3DTilesRendererJS (NASA-AMMOS)</span> · Asset: Cesium Ion #{activeAsset}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/NASA-AMMOS/3DTilesRendererJS"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> NASA-AMMOS Renderer
            </a>
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

        {/* Toolbar — Asset Selector & GPS Info */}
        <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Asset Selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-bold">Tileset:</span>
            {[
              { id: ASSETS.OSM_BUILDINGS, label: '🌆 OSM Buildings (Global)' },
              { id: ASSETS.WORLD_TERRAIN, label: '⛰️ World Terrain' },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setActiveAsset(a.id);
                  setTileKey((k) => k + 1);
                  setHasError(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeAsset === a.id
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">13.1169°N, 77.5901°E — MAHE Bengaluru, Govindapura</span>
            </div>
            <button
              onClick={() => { setTileKey((k) => k + 1); setHasError(false); }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-all border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>
          </div>
        </div>

        {/* ── Live 3D Tiles Canvas ── */}
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          {hasError ? (
            // Error State
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
              <h3 className="text-lg font-black text-white">Tileset Load Error</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">
                Failed to connect to Cesium Ion asset #{activeAsset}. Check your network connection or Cesium Ion token permissions.
              </p>
              <button
                onClick={() => { setTileKey((k) => k + 1); setHasError(false); }}
                className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />Retry
              </button>
            </div>
          ) : (
            <Canvas
              key={tileKey}
              shadows
              camera={{ position: [0, 2000, 5000], fov: 50, near: 1, far: 100000 }}
              gl={{
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0,
                outputColorSpace: THREE.SRGBColorSpace,
                antialias: true,
              }}
              className="w-full h-full"
            >
              <Suspense
                fallback={
                  <mesh>
                    <sphereGeometry args={[100]} />
                    <meshBasicMaterial color="#0f172a" />
                  </mesh>
                }
              >
                <CesiumTileScene assetId={activeAsset} />
              </Suspense>
            </Canvas>
          )}

          {/* HUD Overlays */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-3 rounded-2xl text-xs space-y-1 pointer-events-none">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>NASA-AMMOS 3DTilesRendererJS · EPSG:4978 (WGS84 ECEF)</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Asset ID: {activeAsset} · Token: Cesium Ion Community Free Tier
            </p>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-slate-900/85 backdrop-blur-xl border border-cyan-500/20 px-3 py-2 rounded-xl text-[11px] text-slate-400 pointer-events-none">
            <span className="text-cyan-400 font-bold">DRAG</span> to orbit ·{' '}
            <span className="text-cyan-400 font-bold">SCROLL</span> to zoom ·{' '}
            <span className="text-cyan-400 font-bold">RIGHT DRAG</span> to pan
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-mono">
            CesiumGS OGC 3D Tiles v1.1 · Open Geospatial Consortium Standard · Apache 2.0
          </span>
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
