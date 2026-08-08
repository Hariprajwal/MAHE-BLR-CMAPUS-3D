export interface OperatingHours {
  open: string; // e.g. "08:00"
  close: string; // e.g. "22:00"
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
  category: 'academic' | 'hostel' | 'restaurant' | 'cafe' | 'library' | 'sports' | 'facility' | 'parking' | 'entrance' | 'medical' | 'atm';
  position: [number, number, number]; // [x, y, z] in 3D world space
  size: [number, number, number]; // [width, height, depth]
  rotationY?: number;
  latitude: number;
  longitude: number;
  buildingId?: string;
  floors?: number;
  classrooms?: number;
  labs?: number;
  rating?: number;
  reviewCount?: number;
  verifiedSource: 'Official MAHE Announcement' | 'MAHE Campus Portal' | 'Verified Maps API' | 'User Submissions Queue';
  sourceUrl?: string;
  openingHours?: OperatingHours;
  status: 'active' | 'under_construction' | 'maintenance';
  description: string;
  facilities: string[];
  color: string;
  accentColor: string;
  reviews?: ReviewItem[];
  menuItems?: { name: string; price: string; isVeg: boolean; isPopular?: boolean }[];
  updatedAt: string;
}

export const MAHE_CENTER_GEO = {
  lat: 13.1167,
  lng: 77.5898,
  name: 'MAHE Bengaluru Campus, Govindapura, Yelahanka'
};

export const CAMPUS_LOCATIONS: CampusPOI[] = [
  {
    id: 'BUILDING_AB1',
    name: 'Academic Block 1 (AB-1)',
    shortName: 'AB-1 Main Academic',
    category: 'academic',
    position: [-25, 6, -15],
    size: [24, 12, 18],
    latitude: 13.1171,
    longitude: 77.5891,
    floors: 6,
    classrooms: 48,
    labs: 14,
    rating: 4.8,
    reviewCount: 340,
    verifiedSource: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru/academics/ab1.html',
    openingHours: { open: '08:00', close: '20:00' },
    status: 'active',
    description: 'The core academic block housing Engineering, Technology, and Applied Sciences departments, high-tech smart auditoriums, and design studios.',
    facilities: ['Smart Auditoriums', 'Robotics & Mechatronics Lab', 'High-Speed WiFi', 'Wheelchair Ramps', 'Elevators', 'Faculty Offices', 'RO Water Dispensers'],
    color: '#3b82f6',
    accentColor: '#60a5fa',
    updatedAt: '2026-08-01',
    reviews: [
      { id: 'r1', userName: 'Ananya Sharma (CSE)', rating: 5, date: '2026-07-20', comment: 'World class lecture halls with air conditioning and acoustic paneling!', verifiedStudent: true },
      { id: 'r2', userName: 'Rohan Verma (ECE)', rating: 4.5, date: '2026-07-15', comment: 'Robotics lab equipment is state-of-the-art.', verifiedStudent: true }
    ]
  },
  {
    id: 'BUILDING_AB2',
    name: 'Academic Block 2 (AB-2) - AI & Data Science Wing',
    shortName: 'AB-2 AI Research',
    category: 'academic',
    position: [25, 7, -15],
    size: [22, 14, 16],
    latitude: 13.1173,
    longitude: 77.5905,
    floors: 5,
    classrooms: 36,
    labs: 12,
    rating: 4.9,
    reviewCount: 290,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '08:00', close: '21:00' },
    status: 'active',
    description: 'State-of-the-art research complex housing the School of Information Sciences, AI Innovation Hub, NVIDIA Supercomputing Lab, and VR Simulation Studio.',
    facilities: ['NVIDIA Supercomputing Cluster', 'VR Simulation Studio', 'Cybersecurity Lab', 'Student Discussion Pods', 'Cafe Express'],
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    updatedAt: '2026-08-05'
  },
  {
    id: 'LIBRARY_MAIN',
    name: 'MAHE Central Knowledge Resource Center',
    shortName: 'Central Library',
    category: 'library',
    position: [0, 5, -35],
    size: [28, 10, 20],
    latitude: 13.1180,
    longitude: 77.5898,
    floors: 3,
    rating: 4.9,
    reviewCount: 410,
    verifiedSource: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru/library.html',
    openingHours: { open: '08:00', close: '23:00' },
    status: 'active',
    description: 'A 3-story digital and physical library featuring 50,000+ print volumes, IEEE/ACM digital access, silent study pods, and 24/7 exam-period reading rooms.',
    facilities: ['Silent Reading Zones', 'IEEE & Digital Repository', 'Group Discussion Rooms', 'Kindle E-Reader Lounge', 'Printing & Scanning Station'],
    color: '#06b6d4',
    accentColor: '#22d3ee',
    updatedAt: '2026-08-02'
  },
  {
    id: 'FOOD_COURT_HUB',
    name: 'Central Campus Food Court & Dining Square',
    shortName: 'Food Court Plaza',
    category: 'restaurant',
    position: [0, 4, 10],
    size: [32, 8, 22],
    latitude: 13.1160,
    longitude: 77.5898,
    rating: 4.7,
    reviewCount: 680,
    verifiedSource: 'Verified Maps API',
    openingHours: { open: '07:00', close: '22:30' },
    status: 'active',
    description: 'Vibrant dining epicenter housing multiple gourmet food outlets, bakery, juice bars, and outdoor shaded seating.',
    facilities: ['AC Dining Hall', 'Outdoor Garden Seating', 'Digital Kiosk Ordering', 'Handwash Stations', 'PayTM/UPI Ready'],
    color: '#f59e0b',
    accentColor: '#fbbf24',
    updatedAt: '2026-08-07',
    menuItems: [
      { name: 'Paneer Butter Masala Meal', price: '₹140', isVeg: true, isPopular: true },
      { name: 'Chicken Biryani Special', price: '₹180', isVeg: false, isPopular: true },
      { name: 'Cold Coffee with Ice Cream', price: '₹75', isVeg: true, isPopular: true },
      { name: 'Woodfired Margherita Pizza', price: '₹190', isVeg: true },
      { name: 'Fresh Mango Smoothie', price: '₹60', isVeg: true }
    ],
    reviews: [
      { id: 'r3', userName: 'Kiran Nair', rating: 5, date: '2026-08-04', comment: 'Best cold coffee on campus! Great place to relax between lectures.', verifiedStudent: true }
    ]
  },
  {
    id: 'CAFE_TECH',
    name: 'The Tech Espresso Cafe & Bakery',
    shortName: 'Tech Espresso',
    category: 'cafe',
    position: [-10, 3, 15],
    size: [12, 6, 10],
    latitude: 13.1158,
    longitude: 77.5892,
    rating: 4.6,
    reviewCount: 210,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '07:30', close: '22:00' },
    status: 'active',
    description: 'Artisanal coffee house offering freshly brewed espresso, cold brews, matcha lattes, croissants, and panini sandwiches.',
    facilities: ['High-speed Charging Sockets', 'Comfortable Couches', 'Espresso Bar'],
    color: '#d97706',
    accentColor: '#f59e0b',
    updatedAt: '2026-08-06',
    menuItems: [
      { name: 'Hazelnut Cold Brew', price: '₹90', isVeg: true, isPopular: true },
      { name: 'Butter Croissant', price: '₹65', isVeg: true }
    ]
  },
  {
    id: 'HOSTEL_H1',
    name: 'Phoenix Residence Hall (Boy\'s Hostel H1)',
    shortName: 'Hostel H1 (Phoenix)',
    category: 'hostel',
    position: [-45, 8, 35],
    size: [20, 16, 16],
    latitude: 13.1150,
    longitude: 77.5878,
    floors: 8,
    rating: 4.6,
    reviewCount: 190,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '22:30' },
    status: 'active',
    description: 'Modern student residence with double and triple occupancy rooms, attached baths, high-speed LAN, solar heating, and indoor games room.',
    facilities: ['Gym Room', 'Table Tennis Room', 'Laundry Room', 'Solar Hot Water', '24/7 Biometric Guard'],
    color: '#ec4899',
    accentColor: '#f472b6',
    updatedAt: '2026-08-01'
  },
  {
    id: 'HOSTEL_H2',
    name: 'Orion Residence Hall (Boy\'s Hostel H2)',
    shortName: 'Hostel H2 (Orion)',
    category: 'hostel',
    position: [-22, 8, 40],
    size: [20, 16, 16],
    latitude: 13.1148,
    longitude: 77.5888,
    floors: 8,
    rating: 4.7,
    reviewCount: 175,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '22:30' },
    status: 'active',
    description: 'Residence block equipped with soundproof quiet study halls, courtyard lounge, and instant high-speed fiber connectivity.',
    facilities: ['Quiet Study Rooms', 'TV Lounge', 'Biometric Gate Access', 'High-Speed Fiber WiFi'],
    color: '#db2777',
    accentColor: '#f472b6',
    updatedAt: '2026-08-01'
  },
  {
    id: 'HOSTEL_H3',
    name: 'Cassiopeia Residence Hall (Girl\'s Hostel H3)',
    shortName: 'Hostel H3 (Cassiopeia)',
    category: 'hostel',
    position: [22, 8, 40],
    size: [20, 16, 16],
    latitude: 13.1148,
    longitude: 77.5910,
    floors: 8,
    rating: 4.8,
    reviewCount: 220,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '22:30' },
    status: 'active',
    description: 'Premium girl\'s hostel featuring landscaped inner gardens, 24/7 female security staff, infirmary annex, and reading rooms.',
    facilities: ['Landscaped Inner Courtyard', 'Infirmary Annex', 'Reading Room', 'Dance Studio Room'],
    color: '#e11d48',
    accentColor: '#fb7185',
    updatedAt: '2026-08-01'
  },
  {
    id: 'HOSTEL_H4',
    name: 'Andromeda Residence Hall (Girl\'s Hostel H4)',
    shortName: 'Hostel H4 (Andromeda)',
    category: 'hostel',
    position: [45, 8, 35],
    size: [20, 16, 16],
    latitude: 13.1150,
    longitude: 77.5920,
    floors: 8,
    rating: 4.7,
    reviewCount: 160,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '22:30' },
    status: 'active',
    description: 'Modern student residence with rooftop solar panels, sky garden, and multi-purpose activity hall.',
    facilities: ['Sky Garden', 'Solar Power Grid', 'Fitness Studio', 'Washing Machines'],
    color: '#f43f5e',
    accentColor: '#fda4af',
    updatedAt: '2026-08-01'
  },
  {
    id: 'SPORTS_ARENA_INDOOR',
    name: 'MAHE Indoor Sports Complex & Gym',
    shortName: 'Indoor Sports Arena',
    category: 'sports',
    position: [45, 7, -10],
    size: [26, 11, 22],
    latitude: 13.1172,
    longitude: 77.5922,
    rating: 4.9,
    reviewCount: 310,
    verifiedSource: 'MAHE Campus Portal',
    openingHours: { open: '06:00', close: '21:30' },
    status: 'active',
    description: 'Multi-story sports arena housing wooden badminton courts, synthetic basketball court, Olympic-standard fitness center, squash courts, and table tennis hall.',
    facilities: ['Wooden Badminton Courts', 'Olympic Gym', 'Squash Courts', 'Locker Rooms & Showers', 'Certified Fitness Trainers'],
    color: '#10b981',
    accentColor: '#34d399',
    updatedAt: '2026-08-03'
  },
  {
    id: 'SPORTS_OUTDOOR',
    name: 'MAHE Outdoor Athletics Complex & Football Turf',
    shortName: 'Football Turf & Athletics',
    category: 'sports',
    position: [45, 1, -45],
    size: [36, 2, 28],
    latitude: 13.1185,
    longitude: 77.5925,
    rating: 4.8,
    reviewCount: 260,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '21:00' },
    status: 'active',
    description: 'FIFA-approved artificial turf football ground, 400m synthetic running track, floodlit lawn tennis courts, and volleyball courts.',
    facilities: ['FIFA Turf Ground', 'Floodlights', 'Synthetic Running Track', 'Tennis Courts', 'Spectator Pavilion'],
    color: '#059669',
    accentColor: '#10b981',
    updatedAt: '2026-08-03'
  },
  {
    id: 'ADMIN_BLOCK',
    name: 'MAHE Administrative & Director\'s Building',
    shortName: 'Admin & Director Office',
    category: 'facility',
    position: [-45, 6, -35],
    size: [22, 10, 18],
    latitude: 13.1180,
    longitude: 77.5878,
    floors: 4,
    rating: 4.7,
    reviewCount: 140,
    verifiedSource: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru/administration.html',
    openingHours: { open: '09:00', close: '17:30' },
    status: 'active',
    description: 'Central administrative office housing Admissions, Registrar, Student Affairs, Finance & Fee Counter, and International Collaboration Office.',
    facilities: ['Admissions Counter', 'Finance & Fees Office', 'Registrar Desk', 'Conference Halls', 'Visitor Waiting Lounge'],
    color: '#6366f1',
    accentColor: '#818cf8',
    updatedAt: '2026-08-01'
  },
  {
    id: 'MEDICAL_CENTER',
    name: 'MAHE Health Clinic & Emergency Care',
    shortName: 'Campus Medical Center',
    category: 'medical',
    position: [-28, 4, 15],
    size: [14, 6, 12],
    latitude: 13.1158,
    longitude: 77.5880,
    rating: 4.9,
    reviewCount: 180,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '00:00', close: '23:59' }, // 24/7
    status: 'active',
    description: '24/7 medical station with resident medical doctors, emergency response ambulance, pharmacy, and observation beds.',
    facilities: ['24/7 Resident Doctor', 'Ambulance Standby', 'Pharmacy Counter', 'First Aid & Observation Beds'],
    color: '#ef4444',
    accentColor: '#f87171',
    updatedAt: '2026-08-01'
  },
  {
    id: 'MAIN_GATE',
    name: 'MAHE Main Campus Entrance Gate 1',
    shortName: 'Gate 1 Main Entrance',
    category: 'entrance',
    position: [0, 3, 60],
    size: [18, 6, 8],
    latitude: 13.1135,
    longitude: 77.5898,
    rating: 4.8,
    reviewCount: 95,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
    description: 'Primary architectural entryway with RFID vehicular booms, security check post, shuttle pickup zone, and visitor pass registration desk.',
    facilities: ['RFID Smart Gates', 'Visitor Pass Desk', 'Shuttle Pickup Zone', '24/7 Security Supervision'],
    color: '#64748b',
    accentColor: '#94a3b8',
    updatedAt: '2026-08-01'
  },
  {
    id: 'ATM_BANKING',
    name: 'Campus Banking & ATM Hub (ICICI & HDFC)',
    shortName: 'ATMs & Banking Hub',
    category: 'atm',
    position: [-12, 3, 2],
    size: [8, 4, 6],
    latitude: 13.1162,
    longitude: 77.5890,
    rating: 4.6,
    reviewCount: 110,
    verifiedSource: 'Verified Maps API',
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
    description: '24/7 ATM kiosk with ICICI Bank and HDFC Bank machines, cash deposit facility, and passbook printer.',
    facilities: ['24/7 Cash Deposit', 'ICICI ATM', 'HDFC ATM', 'CCTV Monitoring'],
    color: '#14b8a6',
    accentColor: '#2dd4bf',
    updatedAt: '2026-08-04'
  },
  {
    id: 'PARKING_ZONE_A',
    name: 'Central Parking Zone A & EV Charging Station',
    shortName: 'Parking Zone A (EV)',
    category: 'parking',
    position: [-45, 1, 55],
    size: [24, 1, 18],
    latitude: 13.1140,
    longitude: 77.5878,
    rating: 4.7,
    reviewCount: 85,
    verifiedSource: 'Official MAHE Announcement',
    openingHours: { open: '06:00', close: '23:00' },
    status: 'active',
    description: 'Secure visitor and student vehicle parking lot equipped with fast EV charging stations for two-wheelers and cars.',
    facilities: ['Fast EV Chargers', 'Covered Two-Wheeler Bay', 'CCTV Security', 'Solar Roof Panels'],
    color: '#475569',
    accentColor: '#64748b',
    updatedAt: '2026-08-01'
  }
];
