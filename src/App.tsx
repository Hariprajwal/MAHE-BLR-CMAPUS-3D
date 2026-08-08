import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CAMPUS_LOCATIONS, CampusPOI } from './data/campusData';
import { RouteResult } from './data/pathfindingEngine';
import { CampusChangeRequest, AuditLogEntry, INITIAL_CHANGE_REQUESTS, INITIAL_AUDIT_LOGS } from './data/campusAgentEngine';

import { Campus3DScene } from './components/3d/Campus3DScene';
import { HeaderNav } from './components/ui/HeaderNav';
import { CategoryBar } from './components/ui/CategoryBar';
import { SearchBar } from './components/ui/SearchBar';
import { LocationDetailPanel } from './components/ui/LocationDetailPanel';
import { RoutePlannerPanel } from './components/ui/RoutePlannerPanel';
import { Minimap } from './components/ui/Minimap';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { BuildingAgentDrawer } from './components/ai/BuildingAgentDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VRExplorationModal } from './components/vr/VRExplorationModal';
import { GateManagerModal } from './components/ui/GateManagerModal';
import { Cesium3DTilesModal } from './components/3d/Cesium3DTilesModal';
import { EnvironmentControlsHUD, TimeOfDay, RenderPreset } from './components/ui/EnvironmentControlsHUD';

export function App() {
  const [locations, setLocations] = useState<CampusPOI[]>(CAMPUS_LOCATIONS);
  const [selectedPoi, setSelectedPoi] = useState<CampusPOI | null>(null);
  const [highlightedPoiIds, setHighlightedPoiIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [cameraMode, setCameraMode] = useState<'orbit' | 'aerial' | 'fps' | 'vr' | 'cesium'>('orbit');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  // Environment & FX Controls State
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [renderPreset, setRenderPreset] = useState<RenderPreset>('realistic');
  const [isRainActive, setIsRainActive] = useState<boolean>(false);

  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);

  // Modals & Drawers state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVROpen, setIsVROpen] = useState(false);
  const [isGateManagerOpen, setIsGateManagerOpen] = useState(false);
  const [isBuildingAgentOpen, setIsBuildingAgentOpen] = useState(false);
  const [isCesiumOpen, setIsCesiumOpen] = useState(false);

  // AI Agent & Verification Queue State
  const [changeRequests, setChangeRequests] = useState<CampusChangeRequest[]>(INITIAL_CHANGE_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const handleToggleNightMode = () => {
    const nextNight = !isNightMode;
    setIsNightMode(nextNight);
    setTimeOfDay(nextNight ? 'night' : 'day');
  };

  useEffect(() => {
    if (cameraMode === 'vr') {
      setIsVROpen(true);
    }
  }, [cameraMode]);

  const handleSelectPoi = (poi: CampusPOI) => {
    setSelectedPoi(poi);
  };

  const handleNavigateTo = (poi: CampusPOI) => {
    setIsRouteOpen(true);
  };

  const handleAerialView = () => {
    setCameraMode('aerial');
  };

  const handleEnterInterior = (poi: CampusPOI) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert(`Entering 3D Architectural Interior View for ${poi.name}. Loading floorplan meshes...`);
  };

  const handleOpenBuildingAgent = (poi: CampusPOI) => {
    setSelectedPoi(poi);
    setIsBuildingAgentOpen(true);
  };

  const handleApproveChange = (change: CampusChangeRequest) => {
    setChangeRequests((prev) =>
      prev.map((c) => (c.id === change.id ? { ...c, verificationStatus: 'approved_manual' } : c))
    );

    if (change.targetId) {
      setLocations((prev) =>
        prev.map((loc) => (loc.id === change.targetId ? { ...loc, ...change.payload } : loc))
      );
    }

    const newAudit: AuditLogEntry = {
      id: `AUD_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: `Approved: ${change.title}`,
      entityName: change.targetId || 'New POI',
      source: change.source,
      performedBy: 'Campus Administrator',
      confidence: change.confidenceScore
    };

    setAuditLogs((prev) => [newAudit, ...prev]);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const handleRejectChange = (changeId: string) => {
    setChangeRequests((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, verificationStatus: 'rejected' } : c))
    );
  };

  const handleAddChangeProposal = (newChange: CampusChangeRequest) => {
    setChangeRequests((prev) => [newChange, ...prev]);

    if (newChange.verificationStatus === 'verified_auto') {
      const newAudit: AuditLogEntry = {
        id: `AUD_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: `Auto-Synced: ${newChange.title}`,
        entityName: newChange.targetId || 'Campus POI',
        source: newChange.source,
        performedBy: 'AI Campus Agent',
        confidence: newChange.confidenceScore
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const gateLocations = locations.filter((loc) => loc.category === 'entrance');

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none relative">
      {/* Top Glassmorphic Navigation Header */}
      <HeaderNav
        cameraMode={cameraMode}
        isNightMode={isNightMode}
        isAIOpen={isAIOpen}
        isAdminOpen={isAdminOpen}
        isGateManagerOpen={isGateManagerOpen}
        isCesiumOpen={isCesiumOpen}
        onSetCameraMode={(mode) => setCameraMode(mode)}
        onToggleNightMode={handleToggleNightMode}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onToggleGateManager={() => setIsGateManagerOpen(!isGateManagerOpen)}
        onToggleCesium={() => setIsCesiumOpen(!isCesiumOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRoutePlanner={() => setIsRouteOpen(true)}
      />

      {/* Floating Environment & FX Controls HUD */}
      <EnvironmentControlsHUD
        timeOfDay={timeOfDay}
        onTimeOfDayChange={(mode) => {
          setTimeOfDay(mode);
          setIsNightMode(mode === 'night');
        }}
        sunAngle={sunAngle}
        onSunAngleChange={(angle) => setSunAngle(angle)}
        renderPreset={renderPreset}
        onRenderPresetChange={(preset) => setRenderPreset(preset)}
        isRainActive={isRainActive}
        onToggleRain={() => setIsRainActive(!isRainActive)}
      />

      {/* Main 3D WebGL Canvas Engine */}
      <main className="flex-1 w-full h-full relative">
        <Campus3DScene
          locations={locations}
          selectedPoi={selectedPoi}
          highlightedPoiIds={highlightedPoiIds}
          activeCategory={activeCategory}
          cameraMode={cameraMode === 'cesium' ? 'orbit' : cameraMode}
          isNightMode={isNightMode}
          timeOfDay={timeOfDay}
          sunAngle={sunAngle}
          renderPreset={renderPreset}
          isRainActive={isRainActive}
          routePoints={activeRoute ? activeRoute.path3DPoints : []}
          onSelectPoi={handleSelectPoi}
          onExitFPS={() => setCameraMode('orbit')}
        />
      </main>

      {/* Category Pills Bar */}
      <CategoryBar
        locations={locations}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setHighlightedPoiIds([]);
        }}
      />

      {/* Bottom Corner OpenFreeMap Radar Minimap */}
      <Minimap locations={locations} selectedPoi={selectedPoi} onSelectPoi={handleSelectPoi} />

      {/* Context Panel for Selected POI */}
      <LocationDetailPanel
        poi={selectedPoi}
        onClose={() => setSelectedPoi(null)}
        onNavigateTo={handleNavigateTo}
        onAerialView={handleAerialView}
        onEnterInterior={handleEnterInterior}
        onOpenBuildingAgent={handleOpenBuildingAgent}
      />

      {/* Building In-Charge AI Agent Drawer */}
      <BuildingAgentDrawer
        isOpen={isBuildingAgentOpen}
        poi={selectedPoi}
        onClose={() => setIsBuildingAgentOpen(false)}
      />

      {/* Cesium OGC 3D Tiles Geospatial Engine Modal */}
      <Cesium3DTilesModal
        isOpen={isCesiumOpen}
        onClose={() => setIsCesiumOpen(false)}
      />

      {/* Campus Gate Management Hub */}
      <GateManagerModal
        isOpen={isGateManagerOpen}
        gates={gateLocations}
        onClose={() => setIsGateManagerOpen(false)}
        onSelectGatePOI={(poi) => {
          setSelectedPoi(poi);
          setCameraMode('orbit');
        }}
      />

      {/* Campus Route Planner Drawer */}
      <RoutePlannerPanel
        isOpen={isRouteOpen}
        locations={locations}
        initialDestination={selectedPoi}
        onClose={() => setIsRouteOpen(false)}
        onRouteCalculated={(route) => setActiveRoute(route)}
      />

      {/* Search Modal */}
      <SearchBar
        isOpen={isSearchOpen}
        locations={locations}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={(poi) => {
          setSelectedPoi(poi);
          setCameraMode('orbit');
        }}
      />

      {/* AI Campus Assistant Drawer */}
      <AIChatDrawer
        isOpen={isAIOpen}
        locations={locations}
        onClose={() => setIsAIOpen(false)}
        onSelectLocation={(poi) => {
          setSelectedPoi(poi);
          setCameraMode('orbit');
        }}
        onFilterCategory={(cat) => setActiveCategory(cat)}
        onSetHighlightedIds={(ids) => setHighlightedPoiIds(ids)}
        onStartRoute={(fromId, toId) => {
          setIsRouteOpen(true);
        }}
      />

      {/* Admin Management Dashboard Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        locations={locations}
        changeRequests={changeRequests}
        auditLogs={auditLogs}
        onClose={() => setIsAdminOpen(false)}
        onApproveChange={handleApproveChange}
        onRejectChange={handleRejectChange}
        onAddChangeProposal={handleAddChangeProposal}
        onUpdatePOI={(updatedPoi) => {
          setLocations((prev) => prev.map((l) => (l.id === updatedPoi.id ? updatedPoi : l)));
        }}
      />

      {/* WebXR VR Modal */}
      <VRExplorationModal
        isOpen={isVROpen}
        locations={locations}
        selectedPoi={selectedPoi}
        onClose={() => {
          setIsVROpen(false);
          setCameraMode('orbit');
        }}
        onSelectPoi={handleSelectPoi}
      />
    </div>
  );
}

export default App;
