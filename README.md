<div align="center">

# 🌐 MAHE Bengaluru — 3D Digital Twin

**A Next-Generation, Photorealistic, AI-Powered 3D Campus Experience**

[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Cesium](https://img.shields.io/badge/CesiumGS-3D_Tiles-0082FF.svg?style=for-the-badge&logo=cesium)](https://cesium.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)

</div>

---

## 📖 Overview

The **MAHE Bengaluru 3D Digital Twin** is a state-of-the-art interactive web application that provides a fully explorable, photorealistic 3D replica of the Manipal Academy of Higher Education (MAHE) Bengaluru 85-acre campus. 

Built natively for the browser using **React Three Fiber** and the **Open Geospatial Consortium (OGC) 3D Tiles Standard**, it blends cinematic graphics (PBR materials, HDR lighting, ACES Filmic tone mapping) with interactive AI-driven building agents, A* algorithm pathfinding, and live geospatial streaming.

---

## ✨ World-Class Features

### 🏙️ Photorealistic 3D Engine
- **Physically Based Rendering (PBR)**: Realistic concrete, steel, and glass materials with dynamic transmission and reflection mapping.
- **HDR Environment Lighting**: Cinema-grade global illumination using High Dynamic Range image sets and `ACESFilmicToneMapping`.
- **Post-Processing VFX Stack**: Real-time Screen Space Ambient Occlusion (SSAO), Bloom emissives, Depth of Field (bokeh), and Vignette framing.
- **Dynamic Weather & Time**: Day/Night/Dusk cycles with functional street lamps, moving sun angles, and an immersive Monsoon rain particle system.

### 🌐 CesiumGS OGC 3D Tiles Integration
- **Live Geospatial Streaming**: Integrated `3d-tiles-renderer` (NASA-AMMOS) to stream massive 3D photogrammetry and OSM datasets directly into the canvas.
- **Real-World Anchoring**: Accurately geolocated to `13.1169° N, 77.5901° E` (Govindapura, Yelahanka).
- **Cesium Ion Compatibility**: Fully supports `.b3dm` and `.i3dm` tile payloads using the Cesium Ion free tier for real-world terrain and building footprints.

### 🤖 AI "Building In-Charge" Agents
- Every major building (e.g., Srishti Houses, Academic Blocks, Central Library) is manned by a dedicated, lore-rich AI Agent (e.g., *Srishti Curators, Tech Deans, Logistics Chiefs*).
- Interact with agents to receive real-time campus updates, facility hours, and intelligent pathfinding assistance.

### 🗺️ Advanced Spatial Intelligence
- **A* Pathfinding Network**: Calculates the shortest walking paths between any two points on the 85-acre campus (e.g., Gate 1 to Academic Block 3).
- **Multi-Modal Navigation**: Seamlessly switch between Orbit 3D Map, Aerial View, Walking FPS (First-Person), and WebXR Virtual Reality (VR) exploration.

### 🛡️ Real-Time Gate & Logistics Hub
- A dedicated logistics command center for managing campus entry points: **Gate 1 (Main Entrance)**, **Gate 2 (Service/Construction)**, and **Gate 3 (Parcel/Deliveries)**.
- Tracks live traffic status, authorized vehicle logs, and security shifts.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Core Framework** | React 18, TypeScript, Vite |
| **3D Rendering** | Three.js, React Three Fiber (R3F), `@react-three/drei` |
| **Geospatial Engine** | `3d-tiles-renderer` (NASA AMMOS), CesiumGS 3D Tiles Specification |
| **Post-Processing** | `@react-three/postprocessing` (SSAO, Bloom, DoF, ToneMapping) |
| **Styling & UI** | TailwindCSS, Lucide React (Icons), Glassmorphism UI |
| **Algorithms** | Custom A* Search Algorithm for Graph Pathfinding |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hariprajwal/MAHE-BLR-CMAPUS-3D.git
   cd MAHE-BLR-CMAPUS-3D
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Cesium Ion access token (Free community tier token required for live 3D tiles streaming):
   ```env
   VITE_CESIUM_ION_TOKEN=your_cesium_ion_token_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Expose to the Internet (Optional):**
   To share the live server, use ngrok:
   ```bash
   ngrok http 5173
   ```

---

## 🏛️ Project Architecture

```
src/
├── components/
│   ├── 3d/                # Three.js / R3F Canvas components
│   │   ├── Campus3DScene.tsx         # Main 3D WebGL renderer
│   │   ├── Building3DModel.tsx       # PBR architectural meshes
│   │   ├── Cesium3DTilesModal.tsx    # Live OGC 3D Tiles streaming viewer
│   │   ├── PostProcessingEffects.tsx # VFX stack (SSAO, Bloom, DoF)
│   │   └── PathwayLine3D.tsx         # A* route visualization
│   ├── ai/                # AI Agent UI and Chat Drawers
│   ├── ui/                # Glassmorphic React overlays (Nav, Search, Modals)
│   ├── admin/             # Campus moderation dashboard
│   └── vr/                # WebXR support components
├── data/
│   ├── campusData.ts             # 3D spatial coordinates, metadata
│   ├── pathfindingEngine.ts      # A* Graph node definitions
│   └── buildingAgentEngine.ts    # AI character personas
├── App.tsx                # State wiring and layer composition
└── index.css              # Global styles and Tailwind directives
```

---

## 📊 Development Phases

- **Phase 1**: Core R3F Setup & Minimal Viable Campus (Extruded Blocks).
- **Phase 2**: Srishti Houses Expansion & Real-world Lat/Lng GPS anchoring.
- **Phase 3**: Gate Command Hub (Gate 1, 2, 3) & Advanced Floating UI.
- **Phase 4**: Intelligent "Building In-Charge" AI Agent System.
- **Phase 5**: 85-Acre Layout Overhaul & Architectural Mesh Refinements.
- **Phase 6**: Initial CesiumGS 3D Tiles Support.
- **Phase 7**: **The Photorealism Leap** — PBR materials, ACES Filmic HDR, SSAO Post-Processing, and Live Cesium Ion Tile Streaming.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). 
*Note: 3D Tile datasets streamed via Cesium Ion are subject to their respective terms of service and data attribution requirements.*

---

<div align="center">
  <b>Built with ❤️ for the Manipal Academy of Higher Education (MAHE) Community.</b>
</div>
