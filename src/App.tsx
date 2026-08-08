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
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VRExplorationModal } from './components/vr/VRExplorationModal';

export function App() {
  const [locations, setLocations] = useState<CampusPOI[]>(CAMPUS_LOCATIONS);
  const [selectedPoi, setSelectedPoi] = useState<CampusPOI | null>(null);
  const [highlightedPoiIds, setHighlightedPoiIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [cameraMode, setCameraMode] = useState<'orbit' | 'aerial' | 'fps' | 'vr'>('orbit');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);

  // Modals & Drawers state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVROpen, setIsVROpen] = useState(false);

  // AI Agent & Verification Queue State
  const [changeRequests, setChangeRequests] = useState<CampusChangeRequest[]>(INITIAL_CHANGE_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Open VR Modal when cameraMode changes to VR
  useEffect(() => {
    if (cameraMode === 'vr') {
      setIsVROpen(true);
    }
  }, [cameraMode]);

  // Handle POI selection
  const handleSelectPoi = (poi: CampusPOI) => {
    setSelectedPoi(poi);
  };

  // Handle POI navigation trigger
  const handleNavigateTo = (poi: CampusPOI) => {
    setIsRouteOpen(true);
  };

  // Handle Aerial View toggle
  const handleAerialView = () => {
    setCameraMode('aerial');
  };

  // Handle 3D Building Interior View
  const handleEnterInterior = (poi: CampusPOI) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert(`Entering 3D Architectural Interior View for ${poi.name}. Loading floorplan meshes...`);
  };

  // Handle approving AI change proposal
  const handleApproveChange = (change: CampusChangeRequest) => {
    setChangeRequests((prev) =>
      prev.map((c) => (c.id === change.id ? { ...c, verificationStatus: 'approved_manual' } : c))
    );

    // Apply payload updates to dataset
    if (change.targetId) {
      setLocations((prev) =>
        prev.map((loc) => (loc.id === change.targetId ? { ...loc, ...change.payload } : loc))
      );
    }

    // Add entry to audit log
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

  // Handle rejecting AI change proposal
  const handleRejectChange = (changeId: string) => {
    setChangeRequests((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, verificationStatus: 'rejected' } : c))
    );
  };

  // Handle adding new change proposal from live scan
  const handleAddChangeProposal = (newChange: CampusChangeRequest) => {
    setChangeRequests((prev) => [newChange, ...prev]);

    // If auto-verified high confidence, sync immediately
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

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none relative">
      {/* Top Glassmorphic Navigation Header */}
      <HeaderNav
        cameraMode={cameraMode}
        isNightMode={isNightMode}
        isAIOpen={isAIOpen}
        isAdminOpen={isAdminOpen}
        onSetCameraMode={(mode) => setCameraMode(mode)}
        onToggleNightMode={() => setIsNightMode(!isNightMode)}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRoutePlanner={() => setIsRouteOpen(true)}
      />

      {/* Main 3D WebGL Canvas Engine */}
      <main className="flex-1 w-full h-full relative">
        <Campus3DScene
          locations={locations}
          selectedPoi={selectedPoi}
          highlightedPoiIds={highlightedPoiIds}
          activeCategory={activeCategory}
          cameraMode={cameraMode}
          isNightMode={isNightMode}
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

      {/* Bottom Corner Radar Minimap */}
      <Minimap locations={locations} selectedPoi={selectedPoi} onSelectPoi={handleSelectPoi} />

      {/* Context Panel for Selected POI */}
      <LocationDetailPanel
        poi={selectedPoi}
        onClose={() => setSelectedPoi(null)}
        onNavigateTo={handleNavigateTo}
        onAerialView={handleAerialView}
        onEnterInterior={handleEnterInterior}
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
