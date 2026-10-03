# Contributing to MAHE Bengaluru 3D Digital Twin

Thank you for your interest in contributing to the **MAHE Bengaluru 3D Digital Twin** project! 🎉
We welcome contributions from students, researchers, developers, 3D artists, and spatial computing enthusiasts.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Updating Campus POIs & Geospatial Data](#updating-campus-pois--geospatial-data)
  - [Adding 3D Models & Shaders](#adding-3d-models--shaders)
  - [Code Contributions (Pull Requests)](#code-contributions-pull-requests)
- [Development Setup](#development-setup)
- [Project Architecture & Conventions](#project-architecture--conventions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Questions or Need Help?](#questions-or-need-help)

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

If you find a visual bug, camera clipping issue, pathfinding error, or broken link:
1. Check the [Issue Tracker](https://github.com/Hariprajwal/MAHE-BLR-CMAPUS-3D/issues) to ensure it hasn't already been reported.
2. Open a new issue using our **Bug Report** template.
3. Include clear steps to reproduce, your browser/OS version, and a screenshot or console log if possible.

### 🌟 Suggesting Enhancements

Have ideas for new features (e.g., dynamic bus tracking, 3D interior floorplans, weather effects, new AI agent capabilities)?
1. Open a new issue using our **Feature Request** template.
2. Describe the feature, the motivation, and potential implementation approaches.

### 📍 Updating Campus POIs & Geospatial Data

Campus buildings, labs, food court menus, and operating hours change over time.
To update or add campus data:
1. Open [`src/data/campusData.ts`](src/data/campusData.ts).
2. Ensure new coordinates are scaled to our world coordinate system:
   - Campus GPS Center: `13.1169° N, 77.5901° E`
   - Scale factor: 1 canvas unit ≈ `3.5 meters`
3. Provide verified sources (e.g., official MAHE circulars, Srishti portals) in the `verifiedSource` field.
4. If adding new walkways or intersections, update the node graph in [`src/data/pathfindingEngine.ts`](src/data/pathfindingEngine.ts).

### 🎨 Adding 3D Models & Shaders

We prioritize high frame rates (60 FPS) and low GPU memory footprint:
- Optimized glTF / GLB meshes (Draco / Meshopt compression preferred).
- Keep polygon counts reasonable for mobile and integrated GPU performance.
- Use PBR materials (Roughness / Metalness workflows).

---

## 🛠️ Development Setup

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/MAHE-BLR-CMAPUS-3D.git
   cd MAHE-BLR-CMAPUS-3D
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   ```
   Add your free [Cesium Ion Token](https://ion.cesium.com/tokens) in `.env`:
   ```env
   VITE_CESIUM_ION_TOKEN=your_token_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Lint and Typecheck:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🏗️ Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature (e.g., `feat(3d): add rain particle ripples on asphalt`)
- `fix:` A bug fix (e.g., `fix(pathfinding): resolve edge cycle between Gate 2 and AB-3`)
- `docs:` Documentation changes (e.g., `docs: update setup guide in README`)
- `style:` Code style / formatting (no logic change)
- `refactor:` Code refactoring without behavior change
- `perf:` Performance optimization (e.g., `perf(renderer): reduce SSAO samples on mobile`)
- `test:` Adding or updating tests
- `chore:` Dependency updates, build configs

---

## 🚀 Submitting a Pull Request (PR)

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes and commit with meaningful commit messages.
3. Ensure the project builds cleanly:
   ```bash
   npm run lint && npm run build
   ```
4. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
5. Open a Pull Request against the `main` branch with a descriptive summary of your changes.

---

## 💬 Questions or Need Help?

Feel free to open an issue or start a GitHub Discussion. Thank you for making MAHE Bengaluru 3D an incredible digital twin! 🚀
