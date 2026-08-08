import React from 'react';
import { EffectComposer, Bloom, Vignette, SSAO, DepthOfField, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

interface PostProcessingEffectsProps {
  selectedPoiDepth?: number;
  renderPreset?: 'performance' | 'balanced' | 'photorealistic';
  isNightMode?: boolean;
}

export const PostProcessingEffects: React.FC<PostProcessingEffectsProps> = ({
  selectedPoiDepth = 0,
  renderPreset = 'photorealistic',
  isNightMode = false,
}) => {
  const isPerformance = renderPreset === 'performance';
  const isBalanced = renderPreset === 'balanced';
  const isFull = renderPreset === 'photorealistic';

  if (isPerformance) return null;

  const ssaoColor = new THREE.Color(isNightMode ? '#000000' : '#0f172a');

  return (
    <EffectComposer multisampling={isBalanced ? 4 : 8}>
      {/* ACES Filmic Tone Mapping */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

      {/* Bloom */}
      <Bloom
        luminanceThreshold={isNightMode ? 0.18 : 0.35}
        luminanceSmoothing={0.82}
        intensity={isNightMode ? 1.4 : 0.65}
        mipmapBlur
      />

      {/* SSAO — full preset only */}
      {isFull ? (
        <SSAO
          radius={0.06}
          intensity={18}
          bias={0.0015}
          samples={24}
          rings={4}
          distanceThreshold={0.95}
          distanceFalloff={0.06}
          rangeThreshold={0.0015}
          rangeFalloff={0.01}
          luminanceInfluence={0.7}
          color={ssaoColor}
        />
      ) : (
        <Bloom luminanceThreshold={0.9} intensity={0} />
      )}

      {/* Depth of Field — only when a POI is focused */}
      {isFull && selectedPoiDepth > 0 ? (
        <DepthOfField
          focusDistance={selectedPoiDepth}
          focalLength={0.028}
          bokehScale={3.5}
          height={720}
        />
      ) : (
        <Bloom luminanceThreshold={0.99} intensity={0} />
      )}

      {/* Vignette */}
      <Vignette
        offset={0.28}
        darkness={isNightMode ? 0.85 : 0.55}
        eskil={false}
      />
    </EffectComposer>
  );
};
