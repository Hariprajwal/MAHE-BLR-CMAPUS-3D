import { CAMPUS_LOCATIONS, CampusPOI } from './campusData';

export interface CampusChangeRequest {
  id: string;
  changeType: 'new_building' | 'update_hours' | 'update_rating' | 'new_restaurant' | 'facility_update' | 'status_change';
  targetId?: string;
  title: string;
  description: string;
  source: 'Official MAHE Announcement' | 'MAHE Campus Portal' | 'Verified Maps API' | 'User Submissions Queue' | 'Student Forum Report';
  sourceUrl: string;
  confidenceScore: number; // 0.0 to 1.0
  verificationStatus: 'verified_auto' | 'pending_admin_review' | 'rejected' | 'approved_manual';
  detectedAt: string;
  payload: Partial<CampusPOI>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  entityName: string;
  source: string;
  performedBy: 'AI Campus Agent' | 'Campus Administrator' | 'System Sync';
  confidence?: number;
}

// Initial state for simulated live changes and audit history
export const INITIAL_CHANGE_REQUESTS: CampusChangeRequest[] = [
  {
    id: 'CR_101',
    changeType: 'update_hours',
    targetId: 'LIBRARY_MAIN',
    title: 'Central Library Extended Hours Announcement',
    description: 'MAHE Registrar circular confirms library will remain open until 24:00 (Midnight) during mid-term examination week.',
    source: 'Official MAHE Announcement',
    sourceUrl: 'https://manipal.edu/bengaluru/notices/lib-extended-hours-2026.pdf',
    confidenceScore: 0.98,
    verificationStatus: 'verified_auto',
    detectedAt: '2026-08-08 14:15',
    payload: {
      openingHours: { open: '08:00', close: '23:59' }
    }
  },
  {
    id: 'CR_102',
    changeType: 'new_restaurant',
    title: 'New "Matcha & Boba Spot" in Central Food Court',
    description: 'Student forum report suggesting new boba outlet opening next week in Bay 4 of Food Court.',
    source: 'Student Forum Report',
    sourceUrl: 'https://reddit.com/r/MAHE_Bengaluru/comments/boba_spot_opening',
    confidenceScore: 0.62,
    verificationStatus: 'pending_admin_review',
    detectedAt: '2026-08-08 16:40',
    payload: {
      name: 'Matcha & Boba Express',
      category: 'cafe',
      rating: 4.5,
      description: 'Handcrafted boba teas and matcha lattes.'
    }
  },
  {
    id: 'CR_103',
    changeType: 'facility_update',
    targetId: 'BUILDING_AB2',
    title: 'Quantum Computing & AI Lab Upgrade',
    description: 'Press release detailing installation of 10 new high-performance NVIDIA H100 workstations in AB-2.',
    source: 'MAHE Campus Portal',
    sourceUrl: 'https://manipal.edu/bengaluru/news/quantum-lab.html',
    confidenceScore: 0.94,
    verificationStatus: 'verified_auto',
    detectedAt: '2026-08-07 11:20',
    payload: {
      description: 'State-of-the-art research complex housing the School of Information Sciences, AI Innovation Hub, NVIDIA H100 Supercomputing Lab, and VR Studio.'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD_01',
    timestamp: '2026-08-08 14:15',
    action: 'Auto-Updated Operating Hours',
    entityName: 'Central Library',
    source: 'Official MAHE Announcement',
    performedBy: 'AI Campus Agent',
    confidence: 0.98
  },
  {
    id: 'AUD_02',
    timestamp: '2026-08-07 11:20',
    action: 'Auto-Updated Lab Description',
    entityName: 'Academic Block 2 (AB-2)',
    source: 'MAHE Campus Portal',
    performedBy: 'AI Campus Agent',
    confidence: 0.94
  },
  {
    id: 'AUD_03',
    timestamp: '2026-08-05 09:30',
    action: 'Verified Ratings & Review Count Sync',
    entityName: 'Central Food Court Plaza',
    source: 'Verified Maps API',
    performedBy: 'System Sync',
    confidence: 0.90
  }
];

// Helper to simulate live AI source detection
export function simulateCampusAgentScan(): CampusChangeRequest {
  const sources = [
    { name: 'Official MAHE Announcement' as const, url: 'https://manipal.edu/bengaluru/notices/campus-update.pdf', trust: 0.96 },
    { name: 'MAHE Campus Portal' as const, url: 'https://manipal.edu/bengaluru/portal/news', trust: 0.91 },
    { name: 'Verified Maps API' as const, url: 'https://maps.googleapis.com/v1/places/mahe-bengaluru', trust: 0.88 },
    { name: 'Student Forum Report' as const, url: 'https://forum.mahebengaluru.edu/t/canteen-menu', trust: 0.58 }
  ];

  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  const isHighConfidence = randomSource.trust >= 0.80;

  const eventTitles = [
    { title: 'New EV Fast Charger Installed at Parking A', type: 'facility_update' as const, target: 'PARKING_ZONE_A' },
    { title: 'Tech Espresso Extended Evening Hours', type: 'update_hours' as const, target: 'CAFE_TECH' },
    { title: 'New Badminton Court Booking Kiosk', type: 'facility_update' as const, target: 'SPORTS_ARENA_INDOOR' },
    { title: 'Smoothie Bar Pop-up near Sports Complex', type: 'new_restaurant' as const, target: undefined }
  ];

  const selectedEvent = eventTitles[Math.floor(Math.random() * eventTitles.length)];

  return {
    id: `CR_${Date.now().toString().slice(-4)}`,
    changeType: selectedEvent.type,
    targetId: selectedEvent.target,
    title: selectedEvent.title,
    description: `AI Agent detected verified change from ${randomSource.name} (${selectedEvent.title}).`,
    source: randomSource.name,
    sourceUrl: randomSource.url,
    confidenceScore: randomSource.trust,
    verificationStatus: isHighConfidence ? 'verified_auto' : 'pending_admin_review',
    detectedAt: new Date().toLocaleString(),
    payload: {
      updatedAt: new Date().toISOString().split('T')[0]
    }
  };
}
