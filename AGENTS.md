# AGENTS.md — AI Agent Context & Repository Guide

> **Target Audience**: AI Agents (Antigravity, Claude Code, Cursor, Copilot Workspace, Windsurf, Devin, LLM web scrapers).
> **Purpose**: Provides machine-readable context, architectural rules, spatial coordinate systems, and CLI commands for automated comprehension and extension of this repository.

---

## 🧭 Repository Overview

- **Project Name**: MAHE Bengaluru 3D Digital Twin (`3d-building`)
- **Repository**: [Hariprajwal/MAHE-BLR-CMAPUS-3D](https://github.com/Hariprajwal/MAHE-BLR-CMAPUS-3D)
- **Domain**: Photorealistic 3D Digital Twin, Geospatial OGC 3D Tiles, Spatial AI Agents, A* Pathfinding Graph Simulation.
- **Geographic Anchor**: Manipal Academy of Higher Education (MAHE) Bengaluru Campus, Govindapura, Yelahanka, Bengaluru, India (`13.1169° N, 77.5901° E`).
- **World Coordinate Mapping**: 
  - Canvas coordinate space: `260m x 260m` bounding area.
  - Scale factor: `1 Three.js 3D Unit ≈ 3.5 real-world meters`.
  - Coordinate convention: `X` = West-East, `Y` = Elevation (up), `Z` = North-South.

---

## 🛠️ Technology Stack & Dependencies

| Layer | Technology | Key Modules / Packages |
|---|---|---|
| **Language & Runtime** | TypeScript 5.6+ / Node.js 18+ | Strict type safety, ES Modules |
| **Build & Tooling** | Vite 6/8, Oxlint | `vite`, `oxlint`, `postcss`, `tailwindcss` |
| **3D Rendering** | Three.js r185, React Three Fiber (R3F) | `@react-three/fiber`, `@react-three/drei` |
| **Post-Processing** | Three.js Postprocessing | `@react-three/postprocessing`, `postprocessing` (SSAO, Bloom, DoF, ACES Filmic) |
| **Geospatial 3D Tiles** | OGC 3D Tiles / CesiumGS | `3d-tiles-renderer` (NASA-AMMOS), Cesium Ion Auth |
| **UI & Styling** | React 19, TailwindCSS 4, Lucide Icons | `lucide-react`, `canvas-confetti` |
| **Algorithms** | Graph A* Algorithm | Euclidean-heuristic pathfinding in `pathfindingEngine.ts` |

---

## 📁 Source Code Directory Structure

```
d:/downloads/3D-BUILDING/
├── .github/                      # CI/CD, issue templates, PR template
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                       # Static public assets (SVGs, icons)
├── src/
│   ├── components/
│   │   ├── 3d/                   # Three.js / R3F Canvas components
│   │   │   ├── Campus3DScene.tsx         # Main 3D Canvas, lighting, sky, ground, weather
│   │   │   ├── Building3DModel.tsx       # Procedural PBR building meshes & labels
│   │   │   ├── Cesium3DTilesModal.tsx    # Live CesiumGS OGC 3D Tiles streaming
│   │   │   ├── FirstPersonControls.tsx   # WASD + PointerLock walking camera
│   │   │   ├── PathwayLine3D.tsx         # A* glowing spline visualization
│   │   │   └── PostProcessingEffects.tsx # ACES Filmic, Bloom, SSAO, DoF, Vignette
│   │   ├── ai/                   # AI Character & Assistance Components
│   │   │   ├── AIChatDrawer.tsx          # Campus concierge & search AI drawer
│   │   │   └── BuildingAgentDrawer.tsx   # Per-building autonomous agent dialogue
│   │   ├── admin/                # Governance & Audit Dashboard
│   │   │   └── AdminDashboard.tsx        # Change verification queue & audit logs
│   │   ├── ui/                   # Glassmorphic HUD Overlays
│   │   │   ├── HeaderNav.tsx             # Top navigation & view switcher
│   │   │   ├── CategoryBar.tsx           # Category filter pills
│   │   │   ├── SearchBar.tsx             # Instant search modal (Cmd/Ctrl + K)
│   │   │   ├── Minimap.tsx               # Radar minimap with OpenFreeMap GIS overlay
│   │   │   ├── LocationDetailPanel.tsx   # POI inspection drawer with reviews & menu
│   │   │   ├── RoutePlannerPanel.tsx     # A* navigation drawer with turn-by-turn steps
│   │   │   ├── GateManagerModal.tsx      # Gates 1, 2, 3 access & logistics hub
│   │   │   └── EnvironmentControlsHUD.tsx# Day/Night, sun angle, weather controls
│   │   └── vr/                   # WebXR Virtual Reality components
│   │       └── VRExplorationModal.tsx    # Immersive VR mode setup
│   ├── data/                     # Core Business Logic & Data Stores
│   │   ├── campusData.ts         # Verified POIs, coordinates, metadata, hours, ratings
│   │   ├── pathfindingEngine.ts  # Topological graph, nodes, edges, A* solver
│   │   ├── campusAgentEngine.ts  # Change request queue, confidence scoring, audit trail
│   │   └── buildingAgentEngine.ts# AI building in-charge personas, prompts, knowledge tags
│   ├── App.tsx                   # Master state orchestrator & layout composition
│   ├── index.css                 # Global CSS & Tailwind imports
│   └── main.tsx                  # React DOM root mounting
├── .env.example                  # Environment template (VITE_CESIUM_ION_TOKEN)
├── AGENTS.md                     # This file (Agent discoverability & reference)
├── CONTRIBUTING.md               # Open source contribution guidelines
├── CODE_OF_CONDUCT.md            # Contributor Covenant v2.1
├── LICENSE                       # MIT License
├── llms.txt                      # LLM-friendly index of documentation
├── package.json                  # Scripts & dependencies
├── README.md                     # World-class human-facing documentation
├── tailwind.config.js            # Tailwind styling config
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build and dev server configuration
```

---

## 🔑 Key Data Contracts & Schemas

### 1. `CampusPOI` (`src/data/campusData.ts`)
```typescript
export interface CampusPOI {
  id: string;                                    // Unique identifier (e.g. 'BUILDING_AB1')
  name: string;                                  // Full display title
  shortName: string;                             // Abbreviated label
  category: 'academic' | 'hostel' | 'restaurant' | 'cafe' | 'library' | 'sports' | 'facility' | 'parking' | 'entrance' | 'medical' | 'atm' | 'srishti_house';
  position: [number, number, number];            // [X, Y, Z] in Three.js space
  size: [number, number, number];                // [width, height, depth]
  rotationY?: number;                            // Heading angle in radians
  latitude: number;                              // WGS84 GPS latitude
  longitude: number;                             // WGS84 GPS longitude
  gpsAccuracy: 'exact_verified' | 'zone_approximate' | 'off_campus';
  status: 'active' | 'under_construction' | 'maintenance';
  openingHours?: { open: string; close: string; note?: string };
  facilities: string[];
  color: string;
  accentColor: string;
}
```

### 2. `GraphNode` & `RouteResult` (`src/data/pathfindingEngine.ts`)
```typescript
export interface RouteResult {
  from: CampusPOI;
  to: CampusPOI;
  totalDistanceMeter: number;
  estimatedTimeMin: number;
  path3DPoints: [number, number, number][];      // Coordinates for 3D spline rendering
  steps: { text: string; distanceMeter: number }[];
  landmarksAlongRoute: string[];
}
```

### 3. `BuildingAgentPersona` (`src/data/buildingAgentEngine.ts`)
```typescript
export interface BuildingAgentPersona {
  buildingId: string;
  buildingName: string;
  agentName: string;
  agentTitle: string;
  avatarIcon: string;
  accentColor: string;
  welcomeMessage: string;
  knowledgeTags: string[];
  suggestedPrompts: string[];
  specialActions?: { label: string; actionId: string }[];
}
```

---

## ⚡ Agent Operational Commands

```bash
# Install dependencies
npm install

# Run Vite dev server at http://localhost:5173
npm run dev

# Run oxlint fast linter
npm run lint

# Compile TypeScript and bundle production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🤖 Guidelines for Automated Extensions

1. **Adding a New POI**:
   - Add entry to `CAMPUS_LOCATIONS` in `src/data/campusData.ts`.
   - Calculate world coordinates: ensure `y = height / 2` so bottom rests on plane `y = 0`.
   - Connect nearby navigation node in `src/data/pathfindingEngine.ts`.
   - Add corresponding AI Agent in `src/data/buildingAgentEngine.ts`.
2. **Modifying 3D Shaders / Post-Processing**:
   - Edit `src/components/3d/PostProcessingEffects.tsx`.
   - Preserve performance presets: `performance`, `balanced`, and `photorealistic`.
   - Keep SSAO and Bokeh samples within bounds to prevent GPU thermal throttling.
3. **Environment Tokens**:
   - `VITE_CESIUM_ION_TOKEN`: Cesium Ion access token used by `Cesium3DTilesModal.tsx`.
