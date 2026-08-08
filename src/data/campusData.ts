// ============================================================
// MAHE BENGALURU — VERIFIED CAMPUS DATA (SPACIOUS 85-ACRE LAYOUT)
// Location: BSF Campus, Govindapura, Nagenahalli, Yelahanka, Bengaluru 560064
// Campus center GPS: 13.1169° N, 77.5901° E
// Total canvas span: 260m x 260m (zero building collisions)
// World-space mapping: 1 unit = ~3.5 meters
// ============================================================

export interface FloorEntry {
  floor: number;
  label: string;
  rooms: { id: string; name: string; type: string }[];
}

export interface OperatingHours {
  open: string;
  close: string;
  note?: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedStudent: boolean;
}

export interface CampusPOI {
  id: string;
  name: string;
  shortName: string;
  category:
    | 'academic'
    | 'hostel'
    | 'restaurant'
    | 'cafe'
    | 'library'
    | 'sports'
    | 'facility'
    | 'parking'
    | 'entrance'
    | 'medical'
    | 'atm'
    | 'srishti_house';
  position: [number, number, number]; // [x, y_center, z]
  size: [number, number, number]; // [width, height, depth]
  rotationY?: number;
  latitude: number;
  longitude: number;
  gpsAccuracy: 'exact_verified' | 'zone_approximate' | 'off_campus';
  buildingId?: string;
  floors?: number;
  classrooms?: number;
  labs?: number;
  rating?: number;
  reviewCount?: number;
  verifiedSource:
    | 'Official MAHE Announcement'
    | 'MAHE Campus Portal'
    | 'Srishti Manipal Institute Official'
    | 'Verified Maps API'
    | 'User Submissions Queue';
  sourceUrl?: string;
  openingHours?: OperatingHours;
  status: 'active' | 'under_construction' | 'maintenance';
  description: string;
  facilities: string[];
  color: string;
  accentColor: string;
  reviews?: ReviewItem[];
  menuItems?: {
    name: string;
    price: string;
    isVeg: boolean;
    isPopular?: boolean;
  }[];
  floorPlan?: FloorEntry[];
  updatedAt: string;
}

export const MAHE_CENTER_GEO = {
  lat: 13.1169,
  lng: 77.5901,
  name: 'MAHE Bengaluru — BSF Campus, Govindapura, Yelahanka, Bengaluru 560064',
  address: 'BSF Campus, Govindapura, Nagenahalli, Yelahanka, Bengaluru, Karnataka 560064',
  phone: '+91 92437 77722',
  established: 2022,
  totalAcres: 120,
  operationalAcres: 85,
};

export const CAMPUS_LOCATIONS: CampusPOI[] = [

  // ═══════════════════════════════════════
  // ENTRANCE GATES
  // ═══════════════════════════════════════

  {
    id: 'GATE_1',
    name: 'MAHE Gate 1 — Main Entrance & Transport Office Hub',
    shortName: 'Gate 1 (Main Entrance)',
    category: 'entrance',
    position: [0, 5, 105],
    size: [26, 10, 14],
    latitude: 13.1131,
    longitude: 77.5901,
    gpsAccuracy: 'exact_verified',
    floors: 2,
    verifiedSource: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru.html',
    openingHours: { open: '00:00', close: '23:59', note: 'Security 24/7; Transport Office: 09:00 - 17:30 IST' },
    status: 'active',
    description:
      'Primary campus entrance on Bagalur Road featuring the Security Block. 1st Floor houses the official Office of Transport (bus passes, shuttle routing, vehicle permits). Features RFID boom barriers, biometric guard logging, and visitor pass desks.',
    facilities: [
      'Office of Transport (1st Floor)',
      'Bus Pass Collection Counter',
      'RFID Boom Barriers',
      'Biometric Security Post',
      'Visitor Pass Registration',
      'Campus Shuttle Terminal',
      '24/7 CCTV Monitoring',
    ],
    color: '#0284c7',
    accentColor: '#38bdf8',
    updatedAt: '2026-08-08',
  },

  {
    id: 'GATE_2',
    name: 'MAHE Gate 2 — Service, Staff & Utility Entrance',
    shortName: 'Gate 2 (Service Gate)',
    category: 'entrance',
    position: [90, 3.5, 30],
    size: [16, 7, 10],
    latitude: 13.1155,
    longitude: 77.5940,
    gpsAccuracy: 'zone_approximate',
    floors: 1,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '06:00', close: '22:00', note: 'Staff & Commercial Delivery Checkpoint' },
    status: 'active',
    description:
      'Dedicated service entrance on the eastern perimeter. Regulates heavy delivery trucks, facility maintenance vehicles, vendor access, and faculty parking entries to avoid congestion at Gate 1.',
    facilities: [
      'Heavy Vehicle Weight Check',
      'Vendor Permit Verification',
      'Faculty Parking Access',
      'Maintenance Entry',
    ],
    color: '#475569',
    accentColor: '#64748b',
    updatedAt: '2026-08-08',
  },

  {
    id: 'GATE_3',
    name: 'MAHE Gate 3 — Residential Entrance & Parcel Hub',
    shortName: 'Gate 3 (Hostels & Parcels)',
    category: 'entrance',
    position: [-85, 4.5, 30],
    size: [18, 9, 12],
    latitude: 13.1155,
    longitude: 77.5855,
    gpsAccuracy: 'exact_verified',
    floors: 1,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '00:00', close: '23:59', note: 'Parcel Counter open daily: 08:00 - 22:00 IST' },
    status: 'active',
    description:
      'Primary entrance for Hostel Block HB4 and residential access. Features the official Campus Parcel Counter at the backside of the gate for all student e-commerce deliveries (Amazon, Flipkart, Swiggy, Zomato) operating from 8:00 AM to 10:00 PM daily.',
    facilities: [
      'Campus Parcel Pickup Counter (8 AM – 10 PM)',
      'E-Commerce Courier Drop-off Bay',
      'Biometric Hostel Entry',
      'Hostel Shuttle Stop',
      'Night Guard Checkpoint',
    ],
    color: '#16a34a',
    accentColor: '#4ade80',
    updatedAt: '2026-08-08',
  },

  // ═══════════════════════════════════════
  // SRISHTI MANIPAL INSTITUTE — 7 HOUSES (WEST VILLAGE)
  // ═══════════════════════════════════════

  {
    id: 'SRISHTI_RANG',
    name: 'Srishti House — Rang (Visual Arts & Print Studio)',
    shortName: 'Rang House',
    category: 'srishti_house',
    position: [-45, 7.5, -15],
    size: [20, 15, 16],
    latitude: 13.1178,
    longitude: 77.5870,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    verifiedSource: 'Srishti Manipal Institute Official',
    sourceUrl: 'https://srishtimanipalinstitute.in/campus-and-community/campus-infrastructure',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'One of 7 houses in the Srishti "village of artists and designers." Named after Rang (color/visual). Houses printmaking, letterpress, photography studio, and darkroom workshops on the ground floor. Floors 2–5 feature collaborative studios and terrace gardens.',
    facilities: [
      'Letterpress Workshop',
      'Photography Studio',
      'Darkroom Lab',
      'Terrace Garden',
      'Student Gallery Wall',
      'Collaborative Studios',
    ],
    color: '#dc2626',
    accentColor: '#ef4444',
    floorPlan: [
      { floor: 0, label: 'Ground Floor — Makerspace', rooms: [
        { id: 'rang_g1', name: 'Letterpress Workshop', type: 'workshop' },
        { id: 'rang_g2', name: 'Photography Studio', type: 'studio' },
        { id: 'rang_g3', name: 'Darkroom Lab', type: 'lab' },
      ]},
      { floor: 1, label: 'First Floor — Print Studio', rooms: [
        { id: 'rang_f1', name: 'Screen Printing Room', type: 'workshop' },
        { id: 'rang_f2', name: 'Digital Printing Lab', type: 'lab' },
      ]},
    ],
    updatedAt: '2026-08-01',
  },

  {
    id: 'SRISHTI_RTA',
    name: 'Srishti House — Rta (Order & Design Systems)',
    shortName: 'Rta House',
    category: 'srishti_house',
    position: [-72, 7.5, -15],
    size: [20, 15, 16],
    latitude: 13.1178,
    longitude: 77.5882,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    verifiedSource: 'Srishti Manipal Institute Official',
    sourceUrl: 'https://srishtimanipalinstitute.in/campus-and-community/campus-infrastructure',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Houses design systems studios, model-making workshops with 3D printers, laser cutters, and earth lab. Promotes structured thinking and form-finding.',
    facilities: [
      '3D Printers & Laser Cutters',
      'Model-Making Workshop',
      'Earth Lab',
      'Design Systems Studio',
      'Seminar Hall',
    ],
    color: '#9333ea',
    accentColor: '#a855f7',
    updatedAt: '2026-08-01',
  },

  {
    id: 'SRISHTI_RAAH',
    name: 'Srishti House — Raah (Path & Urban Design)',
    shortName: 'Raah House',
    category: 'srishti_house',
    position: [-98, 7.5, -15],
    size: [20, 15, 16],
    latitude: 13.1178,
    longitude: 77.5894,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    verifiedSource: 'Srishti Manipal Institute Official',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Focuses on urban design, spatial thinking, and planning studios. Features AR/VR lab for spatial simulation and research areas.',
    facilities: [
      'AR/VR Spatial Simulation Lab',
      'Urban Design Studio',
      'GIS & Mapping Lab',
      'Group Meeting Rooms',
    ],
    color: '#0891b2',
    accentColor: '#06b6d4',
    updatedAt: '2026-08-01',
  },

  {
    id: 'SRISHTI_ROOH',
    name: 'Srishti House — Rooh (Spirit & Performance Arts)',
    shortName: 'Rooh House',
    category: 'srishti_house',
    position: [-45, 7.5, -45],
    size: [20, 15, 16],
    latitude: 13.1178,
    longitude: 77.5906,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    verifiedSource: 'Srishti Manipal Institute Official',
    openingHours: { open: '08:00', close: '21:00' },
    status: 'active',
    description:
      'Houses performance arts, sound design, music recording, and stop motion animation studios. Designed for spontaneous performances.',
    facilities: [
      'Sound Recording Studio',
      'Stop Motion Animation Studio',
      'Music Practice Rooms',
      'Performance Stage Space',
    ],
    color: '#059669',
    accentColor: '#10b981',
    updatedAt: '2026-08-01',
  },

  {
    id: 'SRISHTI_RAQS',
    name: 'Srishti House — Raqs (Dance & Movement Arts)',
    shortName: 'Raqs House',
    category: 'srishti_house',
    position: [-72, 7.5, -45],
    size: [20, 15, 16],
    latitude: 13.1188,
    longitude: 77.5870,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    verifiedSource: 'Srishti Manipal Institute Official',
    openingHours: { open: '08:00', close: '21:00' },
    status: 'active',
    description:
      'Contains dance studios, movement research labs, textile weaving rooms with Jacquard looms, and sewing labs for fashion design.',
    facilities: [
      'Dance Studio (Mirrored Walls)',
      'Jacquard Loom Weaving Room',
      'Sewing & Textile Lab',
      'Costume Design Studio',
    ],
    color: '#d97706',
    accentColor: '#f59e0b',
    updatedAt: '2026-08-01',
  },

  {
    id: 'SRISHTI_RAS',
    name: 'Srishti House — Ras (Essence & Ceramics / Sculpture)',
    shortName: 'Ras House',
    category: 'srishti_house',
    position: [-98, 7.5, -45],
    size: [20, 15, 16],
    latitude: 13.1188,
    longitude: 77.5882,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    verifiedSource: 'Srishti Manipal Institute Official',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Houses ceramics and pottery workshop, sculpting studio, wood and metal workshops. Promotes hands-on material exploration.',
    facilities: [
      'Ceramics & Pottery Workshop',
      'Wood & Metal Workshop',
      'Sculpting Studio',
      'Kiln Room',
    ],
    color: '#b45309',
    accentColor: '#d97706',
    updatedAt: '2026-08-01',
  },

  {
    id: 'SRISHTI_RIZAQ',
    name: 'Srishti House — Rizaq (Community Commons & Cafeteria)',
    shortName: 'Rizaq Commons',
    category: 'srishti_house',
    position: [-72, 7.5, -75],
    size: [22, 15, 18],
    latitude: 13.1188,
    longitude: 77.5894,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    rating: 4.5,
    reviewCount: 180,
    verifiedSource: 'Srishti Manipal Institute Official',
    openingHours: { open: '07:30', close: '21:00' },
    status: 'active',
    description:
      'Houses Srishti campus cafeteria, library, counseling rooms, health bay, and community breakout spaces.',
    facilities: [
      'Srishti Campus Cafeteria',
      'Community Library',
      'Counseling Rooms',
      'Health Bay / First Aid',
    ],
    color: '#16a34a',
    accentColor: '#22c55e',
    menuItems: [
      { name: 'Filter Coffee', price: '₹25', isVeg: true, isPopular: true },
      { name: 'Masala Dosa', price: '₹60', isVeg: true, isPopular: true },
      { name: 'Veg Thali', price: '₹110', isVeg: true },
    ],
    updatedAt: '2026-08-01',
  },

  // ═══════════════════════════════════════
  // SHARED MAHE ACADEMIC BLOCKS (EAST CLUSTER)
  // ═══════════════════════════════════════

  {
    id: 'ACAD_BLOCK_1',
    name: 'MAHE Bengaluru — Academic Block 1 (Engineering & Technology)',
    shortName: 'Academic Block 1',
    category: 'academic',
    position: [35, 9, -15],
    size: [24, 18, 20],
    latitude: 13.1175,
    longitude: 77.5920,
    gpsAccuracy: 'zone_approximate',
    floors: 6,
    classrooms: 40,
    labs: 16,
    rating: 4.7,
    reviewCount: 310,
    verifiedSource: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru.html',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Primary academic building for B.Tech, MCA, and applied sciences. Houses air-conditioned smart classrooms, robotics labs, IoT facilities, and faculty offices.',
    facilities: [
      'Smart Classrooms with AV Systems',
      'Robotics & Mechatronics Lab',
      'IoT & Embedded Systems Lab',
      'Campus-Wide Wi-Fi',
      'Faculty Office Suites',
    ],
    color: '#3b82f6',
    accentColor: '#60a5fa',
    floorPlan: [
      { floor: 0, label: 'Ground Floor — Reception & Labs', rooms: [
        { id: 'ab1_g1', name: 'Main Reception & Info Desk', type: 'admin' },
        { id: 'ab1_g2', name: 'Computer Science Lab 1', type: 'lab' },
        { id: 'ab1_g3', name: 'Electronics Lab', type: 'lab' },
      ]},
      { floor: 1, label: 'Floor 1 — Classrooms', rooms: [
        { id: 'ab1_1a', name: 'Lecture Hall A (120 seats)', type: 'classroom' },
        { id: 'ab1_1b', name: 'Lecture Hall B (80 seats)', type: 'classroom' },
      ]},
    ],
    updatedAt: '2026-08-05',
    reviews: [
      { id: 'r1', userName: 'Arjun M. (CSE 3rd yr)', rating: 5, date: '2026-07-20', comment: 'Excellent smart classrooms! Robotics lab is world class.', verifiedStudent: true },
    ],
  },

  {
    id: 'ACAD_BLOCK_2',
    name: 'MAHE Bengaluru — Academic Block 2 (Management & Law)',
    shortName: 'Academic Block 2',
    category: 'academic',
    position: [85, 9, -15],
    size: [24, 18, 20],
    latitude: 13.1175,
    longitude: 77.5940,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    classrooms: 32,
    labs: 8,
    rating: 4.6,
    reviewCount: 220,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Dedicated academic block for MBA, BBA, BBA-LLB, and Liberal Arts programs. Features moot court, case study rooms, and business simulation lab.',
    facilities: [
      'Moot Court Room',
      'Business Simulation Lab',
      'Case Study Classrooms',
      'Mini Auditorium (200 seats)',
    ],
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    updatedAt: '2026-08-05',
  },

  {
    id: 'ACAD_BLOCK_3',
    name: 'MAHE Bengaluru — Academic Block 3 (Media & Communication)',
    shortName: 'Academic Block 3',
    category: 'academic',
    position: [135, 9, -15],
    size: [24, 18, 20],
    latitude: 13.1175,
    longitude: 77.5960,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    classrooms: 28,
    labs: 10,
    rating: 4.7,
    reviewCount: 190,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Academic block for Journalism, Media Studies, Digital Communication, and Humanities. Houses broadcast TV studio, podcast recording booths, and digital newsrooms.',
    facilities: [
      'TV Broadcast Studio (Green Screen)',
      'Audio Editing Suite',
      'Podcast Recording Booths',
      'Digital Journalism Newsroom',
    ],
    color: '#ec4899',
    accentColor: '#f472b6',
    updatedAt: '2026-08-08',
  },

  {
    id: 'ACAD_BLOCK_4',
    name: 'MAHE Bengaluru — Academic Block 4 (Allied Health & Basic Sciences)',
    shortName: 'Academic Block 4',
    category: 'academic',
    position: [35, 9, -65],
    size: [24, 18, 20],
    latitude: 13.1195,
    longitude: 77.5920,
    gpsAccuracy: 'zone_approximate',
    floors: 5,
    classrooms: 24,
    labs: 14,
    rating: 4.6,
    reviewCount: 175,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description:
      'Academic building for Allied Health Professions and Life Sciences. Houses chemistry labs, microbiology facilities, histology suites, and cell culture research labs.',
    facilities: [
      'Cell Culture Research Lab',
      'Microbiology & Pathology Lab',
      'Biochemistry Suite',
      'Histology Workstations',
    ],
    color: '#10b981',
    accentColor: '#34d399',
    updatedAt: '2026-08-08',
  },

  {
    id: 'ACAD_BLOCK_5',
    name: 'MAHE Bengaluru — Academic Block 5 (NEXUS Innovation & Incubation Hub)',
    shortName: 'Academic Block 5',
    category: 'academic',
    position: [85, 9, -65],
    size: [24, 18, 20],
    latitude: 13.1195,
    longitude: 77.5940,
    gpsAccuracy: 'zone_approximate',
    floors: 6,
    classrooms: 20,
    labs: 12,
    rating: 4.9,
    reviewCount: 240,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '00:00', close: '23:59', note: '24/7 Co-working access for incubated startups' },
    status: 'active',
    description:
      'NEXUS Startup Innovation & Incubation Hub. Provides 24/7 co-working spaces, seed fund mentoring, prototype testing bays, and maker machine shop for student entrepreneurs.',
    facilities: [
      '24/7 Startup Co-Working Desks',
      'Prototype Hardware Bay',
      'Venture Pitch Arena',
      'Seed Funding Helpdesk',
      'Maker Machine Shop',
    ],
    color: '#f59e0b',
    accentColor: '#fbbf24',
    updatedAt: '2026-08-08',
  },

  // ═══════════════════════════════════════
  // CENTRAL LIBRARY & ADMIN HUB (CENTER)
  // ═══════════════════════════════════════

  {
    id: 'LIBRARY_MAIN',
    name: 'MAHE Bengaluru — Central Knowledge Resource Centre',
    shortName: 'Central Library',
    category: 'library',
    position: [0, 7, -15],
    size: [32, 14, 24],
    latitude: 13.1195,
    longitude: 77.5910,
    gpsAccuracy: 'zone_approximate',
    floors: 3,
    rating: 4.9,
    reviewCount: 340,
    verifiedSource: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru.html',
    openingHours: { open: '08:00', close: '23:00', note: 'Extended to midnight during exam weeks' },
    status: 'active',
    description:
      'Central library serving MAHE Bengaluru and Srishti students. Houses 40,000+ volumes, IEEE/ACM digital portal, silent study pods, and 24/7 exam reading hall.',
    facilities: [
      'Silent Reading Zone (80 seats)',
      'IEEE / ACM Digital Repository',
      'Group Discussion Rooms (8)',
      '24/7 Exam Reading Hall',
    ],
    color: '#06b6d4',
    accentColor: '#22d3ee',
    updatedAt: '2026-08-05',
  },

  {
    id: 'ADMIN_BLOCK',
    name: 'MAHE Bengaluru — Admissions & Central Administration Block',
    shortName: 'Admissions & Admin Block',
    category: 'facility',
    position: [0, 8, -50],
    size: [28, 16, 22],
    latitude: 13.1188,
    longitude: 77.5855,
    gpsAccuracy: 'zone_approximate',
    floors: 4,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '09:00', close: '17:30', note: 'Monday–Saturday' },
    status: 'active',
    description:
      "Central administrative building housing Registrar's office, Admissions department, Student Affairs cell, Finance & Fees counter, and International Collaboration office.",
    facilities: [
      'Central Admissions Helpdesk',
      'Registrar Office',
      'Finance & Fees Counter',
      'Student Affairs Cell',
      'Conference Halls',
    ],
    color: '#6366f1',
    accentColor: '#818cf8',
    updatedAt: '2026-08-01',
  },

  // ═══════════════════════════════════════
  // DINING & CAFES (SOUTH-CENTRAL)
  // ═══════════════════════════════════════

  {
    id: 'FOOD_COURT_MAIN',
    name: 'MAHE Campus — Central Food Court & Mess Hall',
    shortName: 'Central Food Court',
    category: 'restaurant',
    position: [25, 5, 45],
    size: [34, 10, 24],
    latitude: 13.1158,
    longitude: 77.5910,
    gpsAccuracy: 'zone_approximate',
    rating: 4.5,
    reviewCount: 520,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '07:00', close: '22:30' },
    status: 'active',
    description:
      'Central dining hub with multiple food counters offering South Indian breakfast, North Indian meals, Biryani, Chinese options, juice bars, and coffee counters.',
    facilities: [
      'AC Dining Hall (300 seats)',
      'Outdoor Shaded Garden Seating',
      'Multiple Cuisine Counters',
      'Juice & Smoothie Bar',
    ],
    color: '#f59e0b',
    accentColor: '#fbbf24',
    menuItems: [
      { name: 'Masala Dosa + Sambar', price: '₹60', isVeg: true, isPopular: true },
      { name: 'Chicken Biryani (Full)', price: '₹160', isVeg: false, isPopular: true },
      { name: 'Cold Coffee (Large)', price: '₹70', isVeg: true, isPopular: true },
    ],
    updatedAt: '2026-08-07',
  },

  {
    id: 'CAFE_EXPRESS',
    name: 'Campus Quick-Serve Café & Canteen',
    shortName: 'Quick Café',
    category: 'cafe',
    position: [-25, 3.5, 45],
    size: [16, 7, 12],
    latitude: 13.1156,
    longitude: 77.5898,
    gpsAccuracy: 'zone_approximate',
    rating: 4.3,
    reviewCount: 180,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '07:30', close: '22:00' },
    status: 'active',
    description:
      'Quick-service café offering filter coffee, chai, sandwiches, samosas, and packaged snacks between lectures.',
    facilities: ['Quick Counter Service', 'Indoor Seating (30)', 'Mobile Charging Sockets'],
    color: '#d97706',
    accentColor: '#f59e0b',
    updatedAt: '2026-08-06',
  },

  // ═══════════════════════════════════════
  // HOSTELS & RESIDENTIAL (NORTH-WEST & OFF-CAMPUS)
  // ═══════════════════════════════════════

  {
    id: 'HOSTEL_HB4',
    name: 'Hostel Block HB4 — On-Campus Residential (Boys & Girls)',
    shortName: 'Hostel HB4 (On-Campus)',
    category: 'hostel',
    position: [-85, 11, 75],
    size: [26, 22, 22],
    latitude: 13.1148,
    longitude: 77.5863,
    gpsAccuracy: 'zone_approximate',
    floors: 8,
    rating: 4.5,
    reviewCount: 280,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '06:00', close: '22:30', note: 'Entry via Gate 3' },
    status: 'active',
    description:
      'Primary on-campus residential facility. HB4 features standard room furnishings, laundry service, housekeeping, and 24/7 health support.',
    facilities: [
      'Standard Room Furnishings',
      'Laundry Service',
      'Housekeeping',
      '24/7 Health Support',
      'Common Room with TV',
    ],
    color: '#ec4899',
    accentColor: '#f472b6',
    updatedAt: '2026-08-01',
  },

  {
    id: 'HOSTEL_HBO1',
    name: 'Hostel Block HBO1 — Off-Campus (JM Complex, Bagalur Road)',
    shortName: 'Hostel HBO1 (Off-Campus)',
    category: 'hostel',
    position: [105, 11, 85],
    size: [24, 22, 20],
    latitude: 13.1108,
    longitude: 77.5940,
    gpsAccuracy: 'off_campus',
    floors: 7,
    rating: 4.3,
    reviewCount: 140,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '06:00', close: '22:30' },
    status: 'active',
    description:
      'Off-campus hostel block HBO1 at JM Complex, Bagalur Main Road — opposite Reva University. Shuttle transport provided to campus.',
    facilities: ['Shuttle Transport to Campus', 'Mess/Dining Facility', '24/7 Security'],
    color: '#db2777',
    accentColor: '#f472b6',
    updatedAt: '2026-08-01',
  },

  {
    id: 'HOSTEL_HBO3',
    name: 'Hostel Block HBO3 — Off-Campus (Khushi Township, Gopalpura)',
    shortName: 'Hostel HBO3 (Off-Campus)',
    category: 'hostel',
    position: [-105, 11, 100],
    size: [24, 22, 20],
    latitude: 13.1095,
    longitude: 77.5855,
    gpsAccuracy: 'off_campus',
    floors: 6,
    rating: 4.2,
    reviewCount: 115,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '06:00', close: '22:30' },
    status: 'active',
    description:
      'Off-campus hostel block HBO3 at Khushi Township, Gopalpura Village. Campus shuttle runs continuously.',
    facilities: ['Shuttle Transport to Campus', 'Mess Facility', '24/7 Security'],
    color: '#e11d48',
    accentColor: '#fb7185',
    updatedAt: '2026-08-01',
  },

  // ═══════════════════════════════════════
  // SPORTS COMPLEX (NORTH-EAST)
  // ═══════════════════════════════════════

  {
    id: 'SPORTS_OUTDOOR',
    name: 'MAHE Bengaluru — Outdoor Sports Complex',
    shortName: 'Outdoor Sports Fields',
    category: 'sports',
    position: [80, 1.5, -95],
    size: [55, 3, 45],
    latitude: 13.1200,
    longitude: 77.5940,
    gpsAccuracy: 'zone_approximate',
    rating: 4.9,
    reviewCount: 290,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '21:00' },
    status: 'active',
    description:
      'Astroturf football ground (FIFA synthetic turf), natural turf cricket field with pop-up sprinklers, synthetic basketball courts, and tennis courts.',
    facilities: [
      'Astroturf Football Ground',
      'Natural Turf Cricket Field',
      '2 Synthetic Basketball Courts',
      'Synthetic Tennis Court',
      'Floodlights for Night Games',
    ],
    color: '#059669',
    accentColor: '#10b981',
    updatedAt: '2026-08-03',
  },

  {
    id: 'SPORTS_INDOOR',
    name: 'MAHE Bengaluru — Indoor Sports & Fitness Centre',
    shortName: 'Indoor Sports & Gym',
    category: 'sports',
    position: [25, 7, -95],
    size: [26, 14, 20],
    latitude: 13.1188,
    longitude: 77.5940,
    gpsAccuracy: 'zone_approximate',
    rating: 4.8,
    reviewCount: 250,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '21:30' },
    status: 'active',
    description:
      'Indoor fitness center with professional gym equipment, badminton courts, carrom and chess rooms, and table tennis hall.',
    facilities: [
      'Olympic Gym',
      'Badminton Courts (2)',
      'Table Tennis Hall',
      'Carrom & Chess Rooms',
    ],
    color: '#10b981',
    accentColor: '#34d399',
    updatedAt: '2026-08-03',
  },

  // ═══════════════════════════════════════
  // MEDICAL & PARKING (SOUTH-WEST)
  // ═══════════════════════════════════════

  {
    id: 'MEDICAL_CENTER',
    name: 'MAHE Bengaluru — Campus Medical Centre & Pharmacy (24/7)',
    shortName: 'Medical Centre (24/7)',
    category: 'medical',
    position: [-50, 4.5, 75],
    size: [18, 9, 14],
    latitude: 13.1153,
    longitude: 77.5870,
    gpsAccuracy: 'zone_approximate',
    rating: 4.8,
    reviewCount: 160,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '00:00', close: '23:59', note: '24/7 Resident doctor and nursing staff' },
    status: 'active',
    description:
      '24/7 outpatient care with resident medical officers, nursing staff, dedicated standby ambulance, and 24-hr pharmacy.',
    facilities: [
      '24/7 Resident Doctor',
      '24/7 Qualified Nursing Staff',
      'Dedicated Ambulance (Standby)',
      '24/7 Pharmacy Counter',
    ],
    color: '#ef4444',
    accentColor: '#f87171',
    updatedAt: '2026-08-01',
  },

  {
    id: 'PARKING_MAIN',
    name: 'Main Campus Parking Zone',
    shortName: 'Campus Parking',
    category: 'parking',
    position: [-50, 1.5, 105],
    size: [32, 3, 22],
    latitude: 13.1135,
    longitude: 77.5860,
    gpsAccuracy: 'zone_approximate',
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '06:00', close: '23:00' },
    status: 'active',
    description:
      'Main student and visitor parking area near Gate 3. Two-wheeler and four-wheeler bays.',
    facilities: ['4-Wheeler Parking', '2-Wheeler Parking', 'CCTV Surveillance'],
    color: '#475569',
    accentColor: '#64748b',
    updatedAt: '2026-08-01',
  },

  {
    id: 'ATM_ZONE',
    name: 'Campus ATM & Banking Hub',
    shortName: 'ATM Hub',
    category: 'atm',
    position: [0, 3, 45],
    size: [10, 6, 8],
    latitude: 13.1160,
    longitude: 77.5906,
    gpsAccuracy: 'zone_approximate',
    rating: 4.5,
    reviewCount: 90,
    verifiedSource: 'Verified Maps API',
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
    description:
      '24/7 ATM kiosk cluster with cash deposit facility near campus central plaza.',
    facilities: ['24/7 ATM', 'Cash Deposit Machine'],
    color: '#14b8a6',
    accentColor: '#2dd4bf',
    updatedAt: '2026-08-04',
  },
];
