import { CAMPUS_LOCATIONS, CampusPOI } from './campusData';

export interface RouteStep {
  text: string;
  distanceMeter: number;
}

export interface RouteResult {
  from: CampusPOI;
  to: CampusPOI;
  totalDistanceMeter: number;
  estimatedTimeMin: number;
  path3DPoints: [number, number, number][];
  steps: RouteStep[];
  landmarksAlongRoute: string[];
}

// 3D Path Nodes connecting the paved walkways of MAHE Bengaluru
interface GraphNode {
  id: string;
  position: [number, number, number];
  neighbors: { node: string; dist: number }[];
}

// Build topological campus walkway network
const NODES: Record<string, GraphNode> = {
  // Entrances & Main Gate Avenue
  NODE_GATE_1: { id: 'NODE_GATE_1', position: [0, 0.5, 60], neighbors: [] },
  NODE_MAIN_AVENUE_S: { id: 'NODE_MAIN_AVENUE_S', position: [0, 0.5, 40], neighbors: [] },
  NODE_MAIN_AVENUE_C: { id: 'NODE_MAIN_AVENUE_C', position: [0, 0.5, 20], neighbors: [] },
  NODE_PLAZA_CENTER: { id: 'NODE_PLAZA_CENTER', position: [0, 0.5, 0], neighbors: [] },
  NODE_LIBRARY_COURT: { id: 'NODE_LIBRARY_COURT', position: [0, 0.5, -25], neighbors: [] },
  NODE_NORTH_ROAD: { id: 'NODE_NORTH_ROAD', position: [0, 0.5, -45], neighbors: [] },

  // West Wings (AB-1, Admin, H1, H2, Medical, Parking)
  NODE_WEST_AVENUE_S: { id: 'NODE_WEST_AVENUE_S', position: [-25, 0.5, 40], neighbors: [] },
  NODE_WEST_AVENUE_C: { id: 'NODE_WEST_AVENUE_C', position: [-25, 0.5, 10], neighbors: [] },
  NODE_AB1_COURT: { id: 'NODE_AB1_COURT', position: [-25, 0.5, -10], neighbors: [] },
  NODE_ADMIN_COURT: { id: 'NODE_ADMIN_COURT', position: [-45, 0.5, -25], neighbors: [] },
  NODE_PARKING_A: { id: 'NODE_PARKING_A', position: [-45, 0.5, 45], neighbors: [] },
  NODE_HOSTEL_H1_GATE: { id: 'NODE_HOSTEL_H1_GATE', position: [-45, 0.5, 25], neighbors: [] },

  // East Wings (AB-2, Sports, H3, H4, Outdoor Turf)
  NODE_EAST_AVENUE_S: { id: 'NODE_EAST_AVENUE_S', position: [25, 0.5, 40], neighbors: [] },
  NODE_EAST_AVENUE_C: { id: 'NODE_EAST_AVENUE_C', position: [25, 0.5, 10], neighbors: [] },
  NODE_AB2_COURT: { id: 'NODE_AB2_COURT', position: [25, 0.5, -10], neighbors: [] },
  NODE_INDOOR_SPORTS_COURT: { id: 'NODE_INDOOR_SPORTS_COURT', position: [45, 0.5, -5], neighbors: [] },
  NODE_TURF_COURT: { id: 'NODE_TURF_COURT', position: [45, 0.5, -35], neighbors: [] },
  NODE_HOSTEL_H4_GATE: { id: 'NODE_HOSTEL_H4_GATE', position: [45, 0.5, 25], neighbors: [] }
};

// Connect edges with Euclidean distance weights
function addEdge(n1: string, n2: string) {
  const p1 = NODES[n1].position;
  const p2 = NODES[n2].position;
  const dist = Math.hypot(p1[0] - p2[0], p1[2] - p2[2]);
  NODES[n1].neighbors.push({ node: n2, dist });
  NODES[n2].neighbors.push({ node: n1, dist });
}

// Interconnect walkway network graph
addEdge('NODE_GATE_1', 'NODE_MAIN_AVENUE_S');
addEdge('NODE_MAIN_AVENUE_S', 'NODE_MAIN_AVENUE_C');
addEdge('NODE_MAIN_AVENUE_C', 'NODE_PLAZA_CENTER');
addEdge('NODE_PLAZA_CENTER', 'NODE_LIBRARY_COURT');
addEdge('NODE_LIBRARY_COURT', 'NODE_NORTH_ROAD');

// Cross connections East-West
addEdge('NODE_MAIN_AVENUE_S', 'NODE_WEST_AVENUE_S');
addEdge('NODE_MAIN_AVENUE_S', 'NODE_EAST_AVENUE_S');
addEdge('NODE_MAIN_AVENUE_C', 'NODE_WEST_AVENUE_C');
addEdge('NODE_MAIN_AVENUE_C', 'NODE_EAST_AVENUE_C');
addEdge('NODE_PLAZA_CENTER', 'NODE_AB1_COURT');
addEdge('NODE_PLAZA_CENTER', 'NODE_AB2_COURT');

// Deep connections
addEdge('NODE_WEST_AVENUE_S', 'NODE_PARKING_A');
addEdge('NODE_WEST_AVENUE_S', 'NODE_HOSTEL_H1_GATE');
addEdge('NODE_WEST_AVENUE_C', 'NODE_AB1_COURT');
addEdge('NODE_AB1_COURT', 'NODE_ADMIN_COURT');
addEdge('NODE_LIBRARY_COURT', 'NODE_ADMIN_COURT');

addEdge('NODE_EAST_AVENUE_S', 'NODE_HOSTEL_H4_GATE');
addEdge('NODE_EAST_AVENUE_C', 'NODE_AB2_COURT');
addEdge('NODE_AB2_COURT', 'NODE_INDOOR_SPORTS_COURT');
addEdge('NODE_LIBRARY_COURT', 'NODE_INDOOR_SPORTS_COURT');
addEdge('NODE_INDOOR_SPORTS_COURT', 'NODE_TURF_COURT');
addEdge('NODE_NORTH_ROAD', 'NODE_TURF_COURT');

// Map Campus Locations to nearest Graph Node
const LOCATION_NODE_MAP: Record<string, string> = {
  MAIN_GATE: 'NODE_GATE_1',
  PARKING_ZONE_A: 'NODE_PARKING_A',
  HOSTEL_H1: 'NODE_HOSTEL_H1_GATE',
  HOSTEL_H2: 'NODE_WEST_AVENUE_S',
  HOSTEL_H3: 'NODE_EAST_AVENUE_S',
  HOSTEL_H4: 'NODE_HOSTEL_H4_GATE',
  FOOD_COURT_HUB: 'NODE_PLAZA_CENTER',
  CAFE_TECH: 'NODE_MAIN_AVENUE_C',
  ATM_BANKING: 'NODE_MAIN_AVENUE_C',
  MEDICAL_CENTER: 'NODE_WEST_AVENUE_C',
  BUILDING_AB1: 'NODE_AB1_COURT',
  BUILDING_AB2: 'NODE_AB2_COURT',
  ADMIN_BLOCK: 'NODE_ADMIN_COURT',
  LIBRARY_MAIN: 'NODE_LIBRARY_COURT',
  SPORTS_ARENA_INDOOR: 'NODE_INDOOR_SPORTS_COURT',
  SPORTS_OUTDOOR: 'NODE_TURF_COURT'
};

// Dijkstra shortest path solver
export function calculateCampusRoute(fromId: string, toId: string): RouteResult | null {
  const fromPOI = CAMPUS_LOCATIONS.find((loc) => loc.id === fromId);
  const toPOI = CAMPUS_LOCATIONS.find((loc) => loc.id === toId);

  if (!fromPOI || !toPOI || fromId === toId) return null;

  const startNodeKey = LOCATION_NODE_MAP[fromId] || 'NODE_PLAZA_CENTER';
  const targetNodeKey = LOCATION_NODE_MAP[toId] || 'NODE_PLAZA_CENTER';

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(NODES).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  });

  distances[startNodeKey] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let shortestDist = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < shortestDist) {
        shortestDist = distances[nodeId];
        current = nodeId;
      }
    });

    if (current === null || current === targetNodeKey) break;

    unvisited.delete(current);

    NODES[current].neighbors.forEach(({ node: neighborId, dist }) => {
      if (unvisited.has(neighborId)) {
        const alt = distances[current!] + dist;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = current;
        }
      }
    });
  }

  // Reconstruct path
  const nodeSequence: string[] = [];
  let curr: string | null = targetNodeKey;
  while (curr) {
    nodeSequence.unshift(curr);
    curr = previous[curr];
  }

  // 3D coordinates along path (add start & end POI position)
  const path3DPoints: [number, number, number][] = [
    [fromPOI.position[0], 0.5, fromPOI.position[2]],
    ...nodeSequence.map((nKey) => NODES[nKey].position),
    [toPOI.position[0], 0.5, toPOI.position[2]]
  ];

  // Calculate real distance (1 world unit ~= 8 meters)
  let totalWorldUnits = 0;
  for (let i = 0; i < path3DPoints.length - 1; i++) {
    const p1 = path3DPoints[i];
    const p2 = path3DPoints[i + 1];
    totalWorldUnits += Math.hypot(p1[0] - p2[0], p1[2] - p2[2]);
  }

  const totalDistanceMeter = Math.round(totalWorldUnits * 8.5);
  // Average walking speed ~ 1.4 m/s (84 m/min)
  const estimatedTimeMin = Math.max(1, Math.round(totalDistanceMeter / 75));

  // Build natural step-by-step directions
  const steps: RouteStep[] = [
    { text: `Depart from ${fromPOI.name} along the paved walkway`, distanceMeter: 30 },
    { text: `Head toward Central Campus Plaza`, distanceMeter: Math.round(totalDistanceMeter * 0.4) },
    { text: `Follow direction markers near Food Court & Library Avenue`, distanceMeter: Math.round(totalDistanceMeter * 0.4) },
    { text: `Arrive at destination: ${toPOI.name}`, distanceMeter: 20 }
  ];

  const landmarksAlongRoute = [
    'Central Campus Plaza',
    'Food Court Garden',
    'MAHE Central Library',
    'Academic Walkway'
  ].filter((name) => name !== fromPOI.name && name !== toPOI.name);

  return {
    from: fromPOI,
    to: toPOI,
    totalDistanceMeter,
    estimatedTimeMin,
    path3DPoints,
    steps,
    landmarksAlongRoute
  };
}
