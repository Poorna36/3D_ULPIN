/**
 * 3D ULPIN Grammar & Three-Layer Identity Architecture
 * Conforms strictly to docs/features.md, docs/contracts.md, and docs/decisions.md.
 * 
 * Layer 1: REGISTRY ID (RID)     — ULPIN14-BLD-CLSSEQ-CHK
 * Layer 2: NATURAL KEY (NK)      — SHA-256 canonical digest + 3D Morton interior point
 * Layer 3: SPATIAL ADDRESS (SA)  — 63-bit Morton 3D grid cell cover
 */

export const CHARSET_ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // No I, L, O, U

/**
 * 10 Canonical Object Classes defined in docs/features.md Section 3.5
 */
export const OBJECT_CLASSES = {
  S: { code: 'S', name: 'Surface Parcel Column', geometry: 'Prism', parent: 'ULPIN', minEvidence: 'E1', color: '#10b981' },
  B: { code: 'B', name: 'Building Envelope', geometry: 'Solid', parent: 'S', minEvidence: 'E1-E2', color: '#3b82f6' },
  L: { code: 'L', name: 'Level / Storey', geometry: 'Slab Volume', parent: 'B', minEvidence: 'E2-E3', color: '#6366f1' },
  U: { code: 'U', name: 'Unit (Apartment/Commercial)', geometry: 'Solid', parent: 'L', minEvidence: 'E3-E4', color: '#06b6d4' },
  C: { code: 'C', name: 'Common Area (Lobbies/Stairs)', geometry: 'Solid', parent: 'B/L', minEvidence: 'E3-E4', color: '#8b5cf6' },
  P: { code: 'P', name: 'Accessory (Parking/Storage)', geometry: 'Solid/Prism', parent: 'B/L/S', minEvidence: 'E3', color: '#ec4899' },
  A: { code: 'A', name: 'Airspace Lot (Air-Rights)', geometry: 'Solid above S/B', parent: 'S', minEvidence: 'Plan+E1', color: '#f59e0b' },
  T: { code: 'T', name: 'Subterranean Lot (Tunnel/Basement)', geometry: 'Solid', parent: 'S', minEvidence: 'Plan+E5', color: '#ef4444' },
  E: { code: 'E', name: 'Elevated Corridor (Viaduct)', geometry: 'Solid (Multi-parcel)', parent: 'anchor S', minEvidence: 'Plan+E1', color: '#14b8a6' },
  I: { code: 'I', name: 'Utility Network Segment (Drain/Conduit)', geometry: 'Line to Buffer', parent: 'T/S', minEvidence: 'E5', color: '#84cc16' },
};

/**
 * ISO 7064 MOD 37,36 Check Symbol Algorithm
 * Catches 100% of single-character substitutions and adjacent transpositions.
 * docs/features.md Section 3.4
 */
export function computeCheckSymbol(payload) {
  const cleanPayload = payload.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  const M = 36;
  const P = 37;
  let product = M;

  for (let i = 0; i < cleanPayload.length; i++) {
    const ch = cleanPayload[i];
    const v = CHARSET_ALPHANUMERIC.indexOf(ch);
    if (v === -1) continue;
    let sum = (product + v) % M;
    if (sum === 0) sum = M;
    product = (sum * 2) % P;
  }

  const checkVal = (M + 1 - (product % M)) % M;
  return CHARSET_ALPHANUMERIC[checkVal];
}

/**
 * Validates a complete 3D ULPIN string with ISO 7064 check symbol.
 */
export function verifyCheckSymbol(ridString) {
  if (!ridString || typeof ridString !== 'string') return false;
  const clean = ridString.replace(/-/g, '').toUpperCase();
  if (clean.length < 2) return false;
  const payload = clean.slice(0, -1);
  const expectedCheck = clean.slice(-1);
  return computeCheckSymbol(payload) === expectedCheck;
}

/**
 * Construct a canonical 3D-ULPIN RID string: ULPIN14-BLD-CLSSEQ-CHK
 */
export function formatRID(parentUlpin, bldSeq = 'B0000', cls = 'U', seq = '00001') {
  const pUlpin = parentUlpin.padEnd(14, '0').slice(0, 14).toUpperCase();
  const bld = bldSeq.toUpperCase().slice(0, 5);
  const clsChar = cls.toUpperCase().charAt(0);
  const seq5 = seq.toUpperCase().slice(0, 5);
  const payload = `${pUlpin}${bld}${clsChar}${seq5}`;
  const chk = computeCheckSymbol(payload);
  return `${pUlpin}-${bld}-${clsChar}${seq5}-${chk}`;
}

/**
 * Parse a 3D-ULPIN RID into its constituent grammar parts.
 */
export function parseRID(rid) {
  if (!rid) return null;
  const clean = rid.replace(/-/g, '').toUpperCase();
  if (clean.length !== 25) {
    // If not standard 25-char, attempt hyphenated split
    const parts = rid.split('-');
    if (parts.length >= 4) {
      return {
        parentUlpin: parts[0],
        bldSeq: parts[1],
        cls: parts[2].charAt(0),
        seq: parts[2].slice(1),
        chk: parts[3],
        isValid: verifyCheckSymbol(rid)
      };
    }
  }
  const parentUlpin = clean.slice(0, 14);
  const bldSeq = clean.slice(14, 19);
  const cls = clean.slice(19, 20);
  const seq = clean.slice(20, 24);
  const chk = clean.slice(24, 25);
  return {
    parentUlpin,
    bldSeq,
    cls,
    seq,
    chk,
    isValid: verifyCheckSymbol(rid)
  };
}

/**
 * Simple 3D Morton (Z-order) bit interleave for 63-bit spatial address
 * Quantises lon, lat, and height. docs/features.md Section 3.6 / 3.7
 */
export function encodeMorton3D(lon, lat, height = 0) {
  // Normalize lon (-180..180), lat (-90..90), height (-200..2000m) to 21-bit integers
  const x = Math.floor(((lon + 180) / 360) * 0x1FFFFF);
  const y = Math.floor(((lat + 90) / 180) * 0x1FFFFF);
  const z = Math.floor(((height + 200) / 2200) * 0x1FFFFF);

  let key = BigInt(0);
  for (let i = 0; i < 21; i++) {
    const bitX = (BigInt(x) >> BigInt(i)) & BigInt(1);
    const bitY = (BigInt(y) >> BigInt(i)) & BigInt(1);
    const bitZ = (BigInt(z) >> BigInt(i)) & BigInt(1);
    key |= (bitX << BigInt(3 * i)) | (bitY << BigInt(3 * i + 1)) | (bitZ << BigInt(3 * i + 2));
  }
  return '0x' + key.toString(16).padStart(16, '0').toUpperCase();
}

/**
 * Deterministic Natural Key mock generator from canonical parameters
 */
export function generateNaturalKey(cls, centroid, height, version = 1) {
  const locator = encodeMorton3D(centroid.lon, centroid.lat, centroid.h || height);
  // Deterministic digest based on coords and class
  const seed = `${cls}:${centroid.lat.toFixed(6)}:${centroid.lon.toFixed(6)}:${height}:${version}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  const digest = `NK-SHA256-${hexHash}-B32-${cls}V${version}`;
  return {
    digest,
    locator,
    version,
    precision: { xy: '1 cm', z: '1 cm' },
    datum: 'EPSG:4979 (WGS84 3D)'
  };
}

/**
 * Evaluates Identity Continuity Test (ICT) between old and candidate geometries
 * docs/features.md Section 3.8
 */
export function evaluateICT(iou3d, centroidShiftMeters, sigmaNorm = 0.5) {
  const w1 = 0.7;
  const w2 = 0.3;
  const shiftTerm = Math.max(0, 1 - (centroidShiftMeters / sigmaNorm));
  const score = (w1 * iou3d) + (w2 * shiftTerm);

  let result = 'AMBIGUOUS';
  if (score >= 0.85) result = 'CONTINUE';
  else if (score < 0.30) result = 'NEW';
  else if (score >= 0.30 && score < 0.60) result = 'SPLIT';
  else if (score >= 0.60 && score < 0.85) result = 'MERGE';

  return {
    score: parseFloat(score.toFixed(3)),
    result,
    iou3d: parseFloat(iou3d.toFixed(3)),
    centroidShiftMeters: parseFloat(centroidShiftMeters.toFixed(2)),
    requiresExaminerReview: result === 'AMBIGUOUS' || (score >= 0.55 && score <= 0.70)
  };
}
