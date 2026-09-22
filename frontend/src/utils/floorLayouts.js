// ── Floor Type Metadata & Architectural Room Layout Generator ─────────────

export function floorMeta(label = '', idx = 0, total = 1) {
  const l = (label || '').toLowerCase();
  if (l.includes('ground') || idx === 0)         return { icon: '◫', type: 'Ground Floor', color: '#10b981', category: 'Ground & Lobby' };
  if (l.includes('roof') || idx === total - 1)   return { icon: '▲', type: 'Rooftop',      color: '#f59e0b', category: 'Rooftop & Sky' };
  if (l.includes('park') || l.includes('car'))   return { icon: 'P', type: 'Parking',      color: '#64748b', category: 'Parking' };
  if (l.includes('mech') || l.includes('plant')) return { icon: '◈', type: 'Mechanical',   color: '#94a3b8', category: 'Mechanical & Plant' };
  if (l.includes('lobby') || l.includes('recep'))return { icon: '◫', type: 'Lobby',        color: '#06b6d4', category: 'Entrance Lobby' };
  if (l.includes('sky') || l.includes('observ')) return { icon: '▲', type: 'Sky Level',    color: '#a855f7', category: 'Sky Lounge' };
  if (l.includes('pool') || l.includes('club'))  return { icon: '◈', type: 'Amenity',      color: '#0ea5e9', category: 'Amenities & Club' };
  if (l.includes('base') || l.includes('sub') || idx < 0) return { icon: '▼', type: 'Basement', color: '#475569', category: 'Basement' };
  if (idx < total * 0.25) return { icon: '◆', type: 'Commercial', color: '#0284c7', category: 'Retail & Commercial' };
  if (idx < total * 0.55) return { icon: '■', type: 'Office',     color: '#6366f1', category: 'Commercial Office' };
  return { icon: '●', type: 'Residential', color: '#a855f7', category: 'Residential Suites' };
}

export function typeColor(type) {
  const map = {
    apt: '#a78bfa', room: '#818cf8', corridor: '#334155', core: '#64748b',
    stair: '#475569', service: '#1e293b', lobby: '#06b6d4', lounge: '#a855f7',
    exit: '#ef4444', pool: '#0ea5e9', gym: '#34d399', spa: '#f59e0b',
    parking: '#334155', ramp: '#1e293b', mech: '#94a3b8', elec: '#f59e0b',
    fire: '#ef4444', water: '#0ea5e9', control: '#38bdf8', deck: '#f59e0b',
    office: '#6366f1', meeting: '#a78bfa', dining: '#f472b6', play: '#f472b6',
    sport: '#10b981', default: '#38bdf8',
  };
  return map[type] || '#38bdf8';
}

// Generates the architectural room layout for a given floor in a building
// Coordinates are in meters within a standard 38m x 26m floor plate
export function getFloorRooms(building, floor, floorIndex, totalFloors) {
  if (!building) return [];
  const n = (building.name || '').toLowerCase();
  const fi = floorIndex;
  const lbl = ((floor && floor.label) || '').toLowerCase();
  const meta = floorMeta(lbl, fi, totalFloors);

  const isResidential = (
    /lodha|palais|imperial|antilia|prestige|sobha|karle|falcon|meenakshi|sky forest|avighna|minerva|royale|one park|three sixty|tower|residences/.test(n)
    && !/tech park|it park|office|bank|headquarters|metro|station/.test(n)
  ) || meta.type === 'Residential';

  const isHotel = /ritz|marriott|hyatt|intercontinental|hilton|palace|suites|resort/.test(n) || meta.type === 'Hospitality';
  const isParking = lbl.includes('park') || lbl.includes('car') || meta.type === 'Parking';
  const isBasement = fi < 0 || lbl.includes('base') || lbl.includes('sub') || meta.type === 'Basement';
  const isMech = lbl.includes('mech') || lbl.includes('plant') || lbl.includes('utility') || meta.type === 'Mechanical';
  const isGround = fi === 0 || lbl.includes('ground') || lbl.includes('lobby') || meta.type === 'Ground Floor';
  const isRoof = fi === totalFloors - 1 || lbl.includes('roof') || lbl.includes('sky') || meta.type === 'Rooftop' || meta.type === 'Sky Level';
  const isAmenity = lbl.includes('pool') || lbl.includes('club') || lbl.includes('gym') || meta.type === 'Amenity';

  const F = (floor && floor.level_index) ?? fi;
  const aptSuffix = (s) => `${F}${s}`;

  // 1. Residential High-Rise Floor Plate
  if (isResidential && !isGround && !isRoof && !isAmenity && !isMech) {
    return [
      { x: 15, z: 10,  w: 8, d: 8,  label: 'Lift Core',           area: 64,  color: '#64748b', type: 'core'  },
      { x: 13, z: 10,  w: 2, d: 4,  label: 'Staircase A',         area: 8,   color: '#475569', type: 'stair' },
      { x: 23, z: 10,  w: 2, d: 4,  label: 'Staircase B',         area: 8,   color: '#475569', type: 'stair' },
      { x: 1,  z: 10,  w: 12, d: 2.5, label: 'Corridor (North)',  area: 30,  color: '#334155', type: 'corridor' },
      { x: 25, z: 10,  w: 12, d: 2.5, label: 'Corridor (South)', area: 30,  color: '#334155', type: 'corridor' },
      { x: 1,  z: 0.5, w: 13, d: 9,  label: `Apt ${aptSuffix('A')} — 3BHK (NE Wing)`, area: 117, color: '#a78bfa', type: 'apt' },
      { x: 16, z: 0.5, w: 10, d: 9,  label: `Apt ${aptSuffix('B')} — 2BHK (NW Wing)`, area: 90,  color: '#818cf8', type: 'apt' },
      { x: 1,  z: 13,  w: 10, d: 9,  label: `Apt ${aptSuffix('C')} — 2BHK (SE Wing)`, area: 90,  color: '#c084fc', type: 'apt' },
      { x: 14, z: 13,  w: 9,  d: 9,  label: `Apt ${aptSuffix('D')} — 1BHK (SW Wing)`, area: 81,  color: '#a855f7', type: 'apt' },
      { x: 25, z: 13,  w: 12, d: 9,  label: `Apt ${aptSuffix('E')} — 3BHK (Corner)`, area: 108, color: '#7c3aed', type: 'apt' },
      { x: 25, z: 0.5, w: 12, d: 9,  label: `Apt ${aptSuffix('F')} — Penthouse Suite`, area: 108, color: '#6366f1', type: 'apt' },
      { x: 13, z: 14.5,w: 2, d: 7.5, label: 'Service Shaft',      area: 15,  color: '#1e293b', type: 'service' },
      { x: 23, z: 14.5,w: 2, d: 7.5, label: 'Utility Room',       area: 15,  color: '#1e293b', type: 'service' },
    ];
  }

  // 2. Hotel Floor Plate
  if (isHotel && !isGround && !isRoof) {
    const rooms = [];
    rooms.push({ x: 1, z: 10, w: 36, d: 3, label: 'Main Corridor', area: 108, color: '#334155', type: 'corridor' });
    ['101','102','103','104','105'].forEach((rnum, i) => {
      rooms.push({ x: 2 + i * 7, z: 1, w: 6, d: 8, label: `Room ${F}${rnum.slice(1)}`, area: 48, color: '#a78bfa', type: 'room' });
    });
    ['106','107','108','109','110'].forEach((rnum, i) => {
      rooms.push({ x: 2 + i * 7, z: 14, w: 6, d: 8, label: `Room ${F}${rnum.slice(1)}`, area: 48, color: '#818cf8', type: 'room' });
    });
    rooms.push({ x: 33, z: 1,  w: 4, d: 8,  label: 'Housekeeping', area: 32, color: '#475569', type: 'service' });
    rooms.push({ x: 33, z: 14, w: 4, d: 8,  label: 'Linen Store',   area: 32, color: '#334155', type: 'service' });
    rooms.push({ x: 33, z: 10, w: 4, d: 3,  label: 'Lift Lobby',    area: 12, color: '#64748b', type: 'core'    });
    return rooms;
  }

  // 3. Ground / Entrance Lobby
  if (isGround) {
    return [
      { x: 1,  z: 1,  w: 22, d: 11, label: 'Grand Lobby',           area: 242, color: '#38bdf8', type: 'lobby'   },
      { x: 25, z: 1,  w: 10, d: 6,  label: 'Reception Counter',      area: 60,  color: '#06b6d4', type: 'service' },
      { x: 25, z: 8,  w: 5,  d: 4,  label: 'Security Desk',          area: 20,  color: '#64748b', type: 'service' },
      { x: 31, z: 8,  w: 4,  d: 4,  label: 'Visitor Lounge',         area: 16,  color: '#a78bfa', type: 'lounge'  },
      { x: 1,  z: 13, w: 10, d: 8,  label: 'Lift Lobby (Residential)',area: 80,  color: '#334155', type: 'core'    },
      { x: 13, z: 13, w: 8,  d: 8,  label: 'Lift Lobby (Commercial)', area: 64,  color: '#1e293b', type: 'core'    },
      { x: 23, z: 13, w: 6,  d: 4,  label: 'Fire Exit A',            area: 24,  color: '#ef4444', type: 'exit'    },
      { x: 23, z: 18, w: 6,  d: 3,  label: 'Fire Exit B',            area: 18,  color: '#ef4444', type: 'exit'    },
      { x: 30, z: 13, w: 6,  d: 4,  label: 'Concierge',              area: 24,  color: '#34d399', type: 'service' },
      { x: 30, z: 18, w: 6,  d: 3,  label: 'Parcel Room',            area: 18,  color: '#475569', type: 'service' },
      { x: 25, z: 13, w: 4,  d: 8,  label: 'Staircase A',            area: 32,  color: '#475569', type: 'stair'   },
    ];
  }

  // 4. Rooftop / Sky Deck
  if (isRoof) {
    return [
      { x: 2,  z: 1,  w: 18, d: 12, label: 'Sky Observation Deck',   area: 216, color: '#f59e0b', type: 'deck'    },
      { x: 22, z: 1,  w: 14, d: 8,  label: 'Infinity Pool',          area: 112, color: '#0ea5e9', type: 'pool'    },
      { x: 2,  z: 15, w: 10, d: 6,  label: 'Sky Bar & Lounge',        area: 60,  color: '#a855f7', type: 'lounge'  },
      { x: 14, z: 15, w: 12, d: 6,  label: 'Fine Dining Restaurant',  area: 72,  color: '#f472b6', type: 'dining'  },
      { x: 28, z: 10, w: 8,  d: 11, label: 'Mechanical Roof Plant',   area: 88,  color: '#475569', type: 'mech'    },
      { x: 22, z: 10, w: 5,  d: 4,  label: 'Lift Machine Room',       area: 20,  color: '#334155', type: 'core'    },
      { x: 2,  z: 22, w: 8,  d: 4,  label: 'Fire Refuge Area',        area: 32,  color: '#ef4444', type: 'exit'    },
      { x: 12, z: 22, w: 6,  d: 4,  label: 'Telecom Tower Access',    area: 24,  color: '#64748b', type: 'service' },
    ];
  }

  // 5. Amenity Level
  if (isAmenity) {
    return [
      { x: 1,  z: 1,  w: 16, d: 10, label: 'Swimming Pool',           area: 160, color: '#0ea5e9', type: 'pool'    },
      { x: 19, z: 1,  w: 10, d: 10, label: 'Fitness Centre',          area: 100, color: '#34d399', type: 'gym'     },
      { x: 30, z: 1,  w: 6,  d: 10, label: 'Squash Court',            area: 60,  color: '#10b981', type: 'sport'   },
      { x: 1,  z: 13, w: 8,  d: 8,  label: 'Sauna & Steam Room',      area: 64,  color: '#f59e0b', type: 'spa'     },
      { x: 11, z: 13, w: 10, d: 8,  label: 'Clubhouse Lounge',        area: 80,  color: '#a78bfa', type: 'lounge'  },
      { x: 23, z: 13, w: 8,  d: 8,  label: 'Children\'s Play Area',   area: 64,  color: '#f472b6', type: 'play'    },
      { x: 33, z: 13, w: 4,  d: 8,  label: 'Changing Rooms',          area: 32,  color: '#475569', type: 'service' },
      { x: 1,  z: 22, w: 6,  d: 4,  label: 'Pool Equipment Room',     area: 24,  color: '#334155', type: 'mech'    },
    ];
  }

  // 6. Basement / Parking
  if (isBasement || isParking) {
    const bays = [];
    const cols = ['A','B','C','D','E'];
    cols.forEach((col, ci) => {
      [1,2,3].forEach((row) => {
        bays.push({ x: 1 + ci * 7, z: 1 + (row-1) * 7, w: 5.5, d: 5.5,
          label: `Bay ${col}-${String(row).padStart(2,'0')}`, area: 30, color: '#334155', type: 'parking' });
      });
    });
    bays.push({ x: 36, z: 1,  w: 4, d: 20, label: 'Drive Ramp',       area: 80,  color: '#1e293b', type: 'ramp'    });
    bays.push({ x: 1,  z: 22, w: 35,d: 3,  label: 'Service Corridor', area: 105, color: '#475569', type: 'corridor'});
    return bays;
  }

  // 7. Mechanical Level
  if (isMech) {
    return [
      { x: 1,  z: 1,  w: 14, d: 10, label: 'HVAC Plant Room',         area: 140, color: '#94a3b8', type: 'mech'    },
      { x: 17, z: 1,  w: 10, d: 10, label: 'HV Electrical Panel',     area: 100, color: '#f59e0b', type: 'elec'    },
      { x: 29, z: 1,  w: 8,  d: 10, label: 'Transformer Room',        area: 80,  color: '#f97316', type: 'elec'    },
      { x: 1,  z: 13, w: 10, d: 8,  label: 'Generator Set A',         area: 80,  color: '#64748b', type: 'mech'    },
      { x: 13, z: 13, w: 10, d: 8,  label: 'Generator Set B',         area: 80,  color: '#475569', type: 'mech'    },
      { x: 25, z: 13, w: 8,  d: 8,  label: 'Fire Pump Room',          area: 64,  color: '#ef4444', type: 'fire'    },
      { x: 35, z: 13, w: 4,  d: 8,  label: 'Water Storage Tank',      area: 32,  color: '#0ea5e9', type: 'water'   },
      { x: 1,  z: 22, w: 8,  d: 4,  label: 'BMS Control Room',        area: 32,  color: '#38bdf8', type: 'control' },
    ];
  }

  // 8. Office / Commercial Floor Plate (Default)
  return [
    { x: 15, z: 8,  w: 8, d: 8,  label: 'Lift Core',               area: 64,  color: '#64748b', type: 'core'    },
    { x: 13, z: 8,  w: 2, d: 4,  label: 'Stairwell A',             area: 8,   color: '#475569', type: 'stair'   },
    { x: 23, z: 8,  w: 2, d: 4,  label: 'Stairwell B',             area: 8,   color: '#475569', type: 'stair'   },
    { x: 1,  z: 10, w: 12, d: 2.5, label: 'Main Corridor (East)',  area: 30,  color: '#334155', type: 'corridor' },
    { x: 25, z: 10, w: 12, d: 2.5, label: 'Main Corridor (West)', area: 30,  color: '#334155', type: 'corridor' },
    { x: 1,  z: 0.5,w: 26, d: 7,  label: 'Open Office — Zone A',   area: 182, color: '#6366f1', type: 'office'  },
    { x: 29, z: 0.5,w: 8,  d: 7,  label: 'Director\'s Suite',      area: 56,  color: '#818cf8', type: 'office'  },
    { x: 1,  z: 13, w: 8,  d: 6,  label: 'Conf Room A',            area: 48,  color: '#a78bfa', type: 'meeting' },
    { x: 11, z: 13, w: 8,  d: 6,  label: 'Conf Room B',            area: 48,  color: '#7c3aed', type: 'meeting' },
    { x: 21, z: 13, w: 6,  d: 6,  label: 'Meeting Pod C',          area: 36,  color: '#6366f1', type: 'meeting' },
    { x: 29, z: 13, w: 5,  d: 3,  label: 'Pantry',                 area: 15,  color: '#34d399', type: 'service' },
    { x: 29, z: 17, w: 5,  d: 3,  label: 'Server Room',            area: 15,  color: '#38bdf8', type: 'service' },
    { x: 1,  z: 20, w: 36, d: 3,  label: 'Open Office — Zone B',   area: 108, color: '#4f46e5', type: 'office'  },
  ];
}
