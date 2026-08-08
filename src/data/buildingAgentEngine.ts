// ============================================================
// MAHE BENGALURU — AUTONOMOUS BUILDING IN-CHARGE AGENT ENGINE
// Every building/facility has a dedicated AI Agent In-Charge
// with custom domain knowledge, operational authority, and interactive query handling.
// ============================================================

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

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  actionResult?: { title: string; detail: string; status: 'success' | 'info' | 'warning' };
}

export const BUILDING_AGENTS: Record<string, BuildingAgentPersona> = {
  GATE_1: {
    buildingId: 'GATE_1',
    buildingName: 'Gate 1 — Main Entrance & Security Block',
    agentName: 'Officer Guard Vijay',
    agentTitle: 'Transport & Security Desk Chief',
    avatarIcon: '🚌',
    accentColor: '#38bdf8',
    welcomeMessage: 'Namaste! I am Officer Guard Vijay at Gate 1. I manage campus security logging and the 1st Floor Office of Transport. How can I assist with your shuttle routes or bus passes today?',
    knowledgeTags: ['Bus Pass Collection', 'Campus Shuttle Timing', 'Visitor RFID Permits', 'Security Clearance'],
    suggestedPrompts: [
      'Where do I collect my semester bus pass?',
      'What are the campus shuttle timings to Yelahanka station?',
      'How do visitors register for campus entry?'
    ],
    specialActions: [
      { label: '🚌 Check Shuttle Schedule', actionId: 'check_shuttle' },
      { label: '📇 Bus Pass Desk Status', actionId: 'check_bus_pass' }
    ]
  },

  GATE_2: {
    buildingId: 'GATE_2',
    buildingName: 'Gate 2 — Service & Logistics Checkpoint',
    agentName: 'Inspector Rajesh',
    agentTitle: 'Logistics & Cargo Controller',
    avatarIcon: '🚛',
    accentColor: '#94a3b8',
    welcomeMessage: 'Greetings. I am Inspector Rajesh at Gate 2. I oversee commercial vendor vehicles, cafeteria supply trucks, and heavy maintenance access.',
    knowledgeTags: ['Vendor Gate Pass', 'Commercial Deliveries', 'Faculty Vehicle Entry', 'Logistics Checkpoint'],
    suggestedPrompts: [
      'What are the rules for commercial vendor trucks?',
      'Is faculty parking access allowed through Gate 2?'
    ],
    specialActions: [
      { label: '🚚 Check Logistics Queue', actionId: 'check_logistics' }
    ]
  },

  GATE_3: {
    buildingId: 'GATE_3',
    buildingName: 'Gate 3 — Residential Gate & Parcel Hub',
    agentName: 'Supervisor Somesh',
    agentTitle: 'Campus Parcel Hub Manager',
    avatarIcon: '📦',
    accentColor: '#4ade80',
    welcomeMessage: 'Hello! I am Somesh, Parcel Hub Supervisor at Gate 3. All Amazon, Flipkart, Swiggy, and Zomato packages are received here at the backside counter. Open daily 08:00 AM – 10:00 PM.',
    knowledgeTags: ['Parcel Pickup Counter (8AM-10PM)', 'Amazon / Flipkart Drop-off', 'Hostel On-boarding', 'OTP Verification'],
    suggestedPrompts: [
      'Is the parcel counter open right now?',
      'How do I collect my Amazon package?',
      'Can Swiggy/Zomato delivery partners enter the campus?'
    ],
    specialActions: [
      { label: '📦 Check Package OTP Desk', actionId: 'check_parcel_otp' },
      { label: '🕒 Parcel Counter Operating Hours', actionId: 'check_parcel_hours' }
    ]
  },

  ACAD_BLOCK_1: {
    buildingId: 'ACAD_BLOCK_1',
    buildingName: 'Academic Block 1 (Engineering & Tech)',
    agentName: 'Dr. Technovate (AB-1)',
    agentTitle: 'Dean of Engineering & Robotics Lab Director',
    avatarIcon: '💻',
    accentColor: '#60a5fa',
    welcomeMessage: 'Welcome to AB-1! I am Dr. Technovate. AB-1 houses CSE, AI/ML, ECE labs, Robotics workshops, and smart lecture theatres across 6 floors.',
    knowledgeTags: ['Robotics Lab', 'Computer Science Dept', 'IoT Systems', 'Faculty Cabins'],
    suggestedPrompts: [
      'Where is the Robotics & Mechatronics Lab located?',
      'Which floor has CSE faculty cabins?',
      'Are the smart classrooms equipped with AV systems?'
    ],
    specialActions: [
      { label: '🤖 Check Robotics Lab Queue', actionId: 'check_robotics' },
      { label: '🏢 View Floor Plan', actionId: 'view_ab1_floor' }
    ]
  },

  ACAD_BLOCK_2: {
    buildingId: 'ACAD_BLOCK_2',
    buildingName: 'Academic Block 2 (Management & Law)',
    agentName: 'Marshal Advocate Roy',
    agentTitle: 'Director of Management & Moot Court In-Charge',
    avatarIcon: '⚖️',
    accentColor: '#a78bfa',
    welcomeMessage: 'Greetings! I am Marshal Roy, overseeing AB-2. We house MBA classrooms, BBA-LLB Moot Court, and Business Simulation Labs.',
    knowledgeTags: ['Moot Court', 'Business Simulation Lab', 'MBA Lecture Halls', 'Case Study Rooms'],
    suggestedPrompts: [
      'Is the Moot Court available for student practice?',
      'Where is the Business Simulation Lab?'
    ],
    specialActions: [
      { label: '⚖️ Moot Court Schedule', actionId: 'check_moot_court' }
    ]
  },

  ACAD_BLOCK_3: {
    buildingId: 'ACAD_BLOCK_3',
    buildingName: 'Academic Block 3 (Media & Communication)',
    agentName: 'Prof. MediaMind (AB-3)',
    agentTitle: 'Head of Department — Journalism & New Media',
    avatarIcon: '🎙️',
    accentColor: '#f472b6',
    welcomeMessage: 'Hello! I am Prof. MediaMind in AB-3. We host broadcast television studios, audio editing suites, podcast booths, and digital journalism newsrooms.',
    knowledgeTags: ['TV Broadcast Studio', 'Audio Suite', 'Podcast Booth', 'Digital Newsroom'],
    suggestedPrompts: [
      'How do I reserve time in the Podcast Studio?',
      'Where is the Green Screen TV Studio in AB-3?'
    ],
    specialActions: [
      { label: '🎙️ Reserve Podcast Studio', actionId: 'reserve_podcast' }
    ]
  },

  ACAD_BLOCK_4: {
    buildingId: 'ACAD_BLOCK_4',
    buildingName: 'Academic Block 4 (Allied Health & Basic Sciences)',
    agentName: 'Dr. BioHelix (AB-4)',
    agentTitle: 'Head of Allied Health & Life Sciences',
    avatarIcon: '🧬',
    accentColor: '#34d399',
    welcomeMessage: 'Welcome to AB-4! I am Dr. BioHelix. AB-4 houses wet laboratories, cell culture facilities, histology labs, and health sciences research labs.',
    knowledgeTags: ['Cell Culture Lab', 'Biochemistry Suite', 'Histology Lab', 'Microbiology Lab'],
    suggestedPrompts: [
      'What bio-safety equipment is available in AB-4 labs?',
      'Where is the Biochemistry research lab?'
    ],
    specialActions: [
      { label: '🧬 Check Lab Safety Status', actionId: 'check_bio_lab' }
    ]
  },

  ACAD_BLOCK_5: {
    buildingId: 'ACAD_BLOCK_5',
    buildingName: 'Academic Block 5 (Innovation & Incubation Hub)',
    agentName: 'NEXUS Incubator Bot',
    agentTitle: 'Startup & Student Incubation Lead',
    avatarIcon: '🚀',
    accentColor: '#f59e0b',
    welcomeMessage: 'Hey innovator! I am NEXUS, managing AB-5 Innovation Hub. We provide 24/7 co-working spaces, prototype testing bays, and seed fund mentoring for student startups.',
    knowledgeTags: ['Startup Incubation', 'Prototype Bay', 'Co-Working Space', 'Venture Mentoring'],
    suggestedPrompts: [
      'How can a student project apply for incubator seed funding?',
      'Are co-working desks open 24/7 in AB-5?'
    ],
    specialActions: [
      { label: '🚀 Apply for Pitch Slot', actionId: 'apply_pitch' }
    ]
  },

  ADMIN_BLOCK: {
    buildingId: 'ADMIN_BLOCK',
    buildingName: 'Admissions & Central Administration Block',
    agentName: 'Registrar Desk Bot',
    agentTitle: 'Chief Admissions Officer & Registrar Executive',
    avatarIcon: '🏛️',
    accentColor: '#818cf8',
    welcomeMessage: 'Welcome to the Central Admissions & Administrative Block. I am the Registrar Executive Bot. We assist with fee receipts, transcript verification, admission counseling, and official document attestation.',
    knowledgeTags: ['Admissions Desk', 'Fees & Finance Counter', 'Transcript Issue', 'Student Affairs Cell'],
    suggestedPrompts: [
      'Where is the Finance & Fees collection counter?',
      'How do I get official university transcript copies?',
      'What documents are needed for admission verification?'
    ],
    specialActions: [
      { label: '📜 Transcript Status Check', actionId: 'check_transcript' },
      { label: '💳 Fees Counter Token', actionId: 'check_fees_token' }
    ]
  },

  LIBRARY_MAIN: {
    buildingId: 'LIBRARY_MAIN',
    buildingName: 'Central Knowledge Resource Centre (Library)',
    agentName: 'Bibliotheca Bot',
    agentTitle: 'Chief Librarian & Digital Knowledge Officer',
    avatarIcon: '📚',
    accentColor: '#22d3ee',
    welcomeMessage: 'Greetings reader! I am Bibliotheca, Central Library In-Charge. Access over 40,000 volumes, IEEE/ACM journals, silent study pods, and 24/7 exam reading halls.',
    knowledgeTags: ['IEEE / ACM Digital Access', 'Silent Study Pods', 'Book Checkout', '24/7 Reading Hall'],
    suggestedPrompts: [
      'Are there empty silent study pods available right now?',
      'How do I access IEEE Xplore digital papers off-campus?',
      'What are the exam week library timings?'
    ],
    specialActions: [
      { label: '📖 Reserve Study Pod', actionId: 'reserve_study_pod' },
      { label: '🔍 IEEE Journal Portal', actionId: 'search_ieee' }
    ]
  },

  SRISHTI_RANG: {
    buildingId: 'SRISHTI_RANG',
    buildingName: 'Srishti House — Rang (Visual Arts & Print)',
    agentName: 'Studio Master Rang',
    agentTitle: 'Printmaking & Visual Arts In-Charge',
    avatarIcon: '🎨',
    accentColor: '#ef4444',
    welcomeMessage: 'Creative greetings! I am Studio Master Rang. Ground floor houses letterpress machines, etching presses, screen printing tables, darkrooms, and photo studios.',
    knowledgeTags: ['Letterpress Workshop', 'Darkroom Printing', 'Photography Studio', 'Screen Printing'],
    suggestedPrompts: [
      'How do I book a darkroom slot for photo developing?',
      'Is the letterpress machine available for student projects?'
    ],
    specialActions: [
      { label: '📷 Darkroom Slot Booking', actionId: 'book_darkroom' }
    ]
  },

  SRISHTI_RIZAQ: {
    buildingId: 'SRISHTI_RIZAQ',
    buildingName: 'Srishti House — Rizaq (Community & Cafeteria)',
    agentName: 'Chef Rizaq Lead',
    agentTitle: 'Srishti Village Community Manager',
    avatarIcon: '🥗',
    accentColor: '#22c55e',
    welcomeMessage: 'Welcome to Rizaq! I am Chef Rizaq. We serve healthy meals, filter coffee, host counseling bays, and run the Srishti community commons.',
    knowledgeTags: ['Srishti Cafeteria', 'Counseling Bay', 'Filter Coffee', 'Community Commons'],
    suggestedPrompts: [
      'What is today’s special at the Srishti cafeteria?',
      'Where is the student counseling bay located?'
    ],
    specialActions: [
      { label: '☕ View Today’s Menu', actionId: 'view_rizaq_menu' }
    ]
  },

  HOSTEL_HB4: {
    buildingId: 'HOSTEL_HB4',
    buildingName: 'Hostel Block HB4 (On-Campus Residential)',
    agentName: 'Resident Warden HB4',
    agentTitle: 'Chief Hostel Warden & Student Welfare',
    avatarIcon: '🏨',
    accentColor: '#f472b6',
    welcomeMessage: 'Hello resident! I am Warden HB4. I oversee room amenities, biometric entry logs, maintenance complaints, and laundry slots for HB4 on-campus hostel.',
    knowledgeTags: ['Room Maintenance Ticket', 'Laundry Schedule', 'Night Out Pass', 'Biometric Curfew'],
    suggestedPrompts: [
      'How do I log a room AC or plumber maintenance request?',
      'What is the nightly biometric curfew time for HB4?'
    ],
    specialActions: [
      { label: '🔧 Log Maintenance Ticket', actionId: 'log_hostel_ticket' }
    ]
  },

  FOOD_COURT_MAIN: {
    buildingId: 'FOOD_COURT_MAIN',
    buildingName: 'MAHE Campus Central Food Court',
    agentName: 'Executive Chef Anand',
    agentTitle: 'Central Dining Operations Manager',
    avatarIcon: '🍕',
    accentColor: '#fbbf24',
    welcomeMessage: 'Bon appétit! I am Chef Anand at the Central Food Court. We serve South Indian, Biryani, Continental, juice bars, and 24-hr snack stalls.',
    knowledgeTags: ['Live Counter Queue', 'Chicken Biryani Special', 'UPI Payments', 'Veg / Non-Veg Sections'],
    suggestedPrompts: [
      'What is the estimated waiting time for biryani right now?',
      'Are non-veg and veg cooking counters completely separate?'
    ],
    specialActions: [
      { label: '🍕 Check Live Queue Times', actionId: 'check_dining_queue' }
    ]
  },

  MEDICAL_CENTER: {
    buildingId: 'MEDICAL_CENTER',
    buildingName: 'Campus Medical Centre & Pharmacy (24/7)',
    agentName: 'Dr. HealthGuard (24/7)',
    agentTitle: 'Resident Medical Officer In-Charge',
    avatarIcon: '🏥',
    accentColor: '#f87171',
    welcomeMessage: 'Hello. I am Dr. HealthGuard at the 24/7 Medical Centre. We provide emergency triage, resident doctors, 24-hr pharmacy, and ambulance service on standby.',
    knowledgeTags: ['24/7 Resident Doctor', 'Ambulance Standby', '24/7 Pharmacy Stock', 'Observation Beds'],
    suggestedPrompts: [
      'Is the resident doctor available right now?',
      'How do I request emergency ambulance dispatch on campus?'
    ],
    specialActions: [
      { label: '🚑 Emergency Ambulance Dispatch', actionId: 'dispatch_ambulance' },
      { label: '💊 Check Pharmacy Stock', actionId: 'check_pharmacy' }
    ]
  }
};

// Fallback Default Agent for building without custom persona
export const DEFAULT_BUILDING_AGENT: BuildingAgentPersona = {
  buildingId: 'DEFAULT',
  buildingName: 'Campus Building In-Charge',
  agentName: 'Building Desk Assistant',
  agentTitle: 'Facility Operational Lead',
  avatarIcon: '🏢',
  accentColor: '#3b82f6',
  welcomeMessage: 'Hello! I am the Building In-Charge Assistant for this facility. Ask me anything about floor plans, rooms, or available amenities.',
  knowledgeTags: ['Floor Layout', 'Room Directory', 'Operating Hours', 'Facilities'],
  suggestedPrompts: [
    'What facilities are in this building?',
    'Show me the floor plan breakdown.'
  ]
};

export function getBuildingAgent(poiId: string): BuildingAgentPersona {
  return BUILDING_AGENTS[poiId] || {
    ...DEFAULT_BUILDING_AGENT,
    buildingId: poiId,
    buildingName: poiId.replace(/_/g, ' ')
  };
}

// Generate realistic simulated AI response for building in-charge agents
export function generateBuildingAgentResponse(
  agent: BuildingAgentPersona,
  userMessage: string
): AgentChatMessage {
  const lower = userMessage.toLowerCase();
  let replyText = `I have received your query regarding **${agent.buildingName}**. `;

  if (lower.includes('parcel') || lower.includes('amazon') || lower.includes('flipkart') || lower.includes('swiggy')) {
    replyText = `📦 **Gate 3 Parcel Counter Status**: The backside parcel counter is **OPEN** (Daily 08:00 AM – 10:00 PM). Please bring your MAHE Student ID and order OTP. Packages received today: Amazon (142), Flipkart (88), Courier/Swiggy (64).`;
  } else if (lower.includes('bus') || lower.includes('shuttle') || lower.includes('pass') || lower.includes('transport')) {
    replyText = `🚌 **Gate 1 Transport Office (1st Floor)**: Bus pass counter is active Mon–Sat (09:00 AM – 05:30 PM). Next campus shuttle to Yelahanka station leaves at 16:30 IST from Gate 1 bay.`;
  } else if (lower.includes('robotics') || lower.includes('cse') || lower.includes('lab')) {
    replyText = `🤖 **AB-1 Lab Status**: Robotics & Mechatronics Lab (Floor 2, Room 2A) is operational. 8 workstations currently active. Faculty in-charge: Dr. K. Sharma.`;
  } else if (lower.includes('darkroom') || lower.includes('photo') || lower.includes('print') || lower.includes('rang')) {
    replyText = `📷 **Srishti Rang House**: Darkroom Lab 1 is open. Next available slot is today at 15:30 IST. Etching & Letterpress press 2 is free.`;
  } else if (lower.includes('food') || lower.includes('biryani') || lower.includes('menu') || lower.includes('eat')) {
    replyText = `🍕 **Central Food Court**: Live kitchen wait time is ~8 minutes. Today's bestseller: Chicken Biryani Combo (₹160) & Masala Dosa (₹60). All digital payments (UPI) working smoothly.`;
  } else if (lower.includes('doctor') || lower.includes('medical') || lower.includes('health') || lower.includes('medicine')) {
    replyText = `🏥 **24/7 Medical Centre**: Resident Medical Officer Dr. Priya is on duty. Pharmacy counter open 24/7. Ambulance (KA-04-M-9911) is on standby outside HB4.`;
  } else if (lower.includes('ieee') || lower.includes('book') || lower.includes('study') || lower.includes('library')) {
    replyText = `📚 **Central Library**: Silent Reading Zone has 24 open seats available. IEEE Xplore digital portal is active. Exam reading hall 2 is open 24 hours.`;
  } else {
    replyText += `All facilities in ${agent.buildingName} are currently operational under normal protocol. Let me know if you need specific room allocations or contact numbers!`;
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'agent',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: replyText
  };
}
