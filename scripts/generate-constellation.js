#!/usr/bin/env node

/**
 * generate-constellation.js
 *
 * Queries the SIMBAD astronomical database for each star in a config file,
 * derives human-readable properties from raw spectral data, and writes a
 * fully-typed (constellation).ts file ready to drop into src/data/.
 *
 * Coordinates and lines are left as placeholders for you to fill in.
 *
 * Prerequisites: Node.js 18+ (uses native fetch)
 *
 * Usage:
 *   node scripts/generate-constellation.js <config.json>
 *
 * Example:
 *   node scripts/generate-constellation.js scripts/cassiopeia.json
 *
 * Config JSON format:
 * {
 *   "id":          "cassiopeia",
 *   "name":        "Cassiopeia",
 *   "description": "The Queen",
 *   "hasProject":  false,
 *   "stars": [
 *     { "id": "a", "label": "Schedar",  "size": 36 },
 *     { "id": "b", "label": "Caph",     "size": 27 },
 *     { "id": "c", "label": "gamma Cas","size": 27 }
 *   ]
 * }
 *
 * Star labels can be:
 *   Common names  → "Betelgeuse", "Rigel", "Schedar"
 *   Greek letters → "alpha Ori", "alf Ori", "α Orionis"
 *   HD/HR numbers → "HD 39801", "HR 2061"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Constants ────────────────────────────────────────────────────────────────

const SIMBAD_TAP = 'https://simbad.u-strasbg.fr/simbad/sim-tap/sync';
const DELAY_MS   = 600;   // polite delay between SIMBAD requests (ms)
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// ─── Greek letter tables ──────────────────────────────────────────────────────

// SIMBAD 3-letter abbreviation → Unicode Greek + spelled-out name
const GREEK = {
  alf: { sym: 'α', name: 'Alpha'   },
  bet: { sym: 'β', name: 'Beta'    },
  gam: { sym: 'γ', name: 'Gamma'   },
  del: { sym: 'δ', name: 'Delta'   },
  eps: { sym: 'ε', name: 'Epsilon' },
  zet: { sym: 'ζ', name: 'Zeta'    },
  eta: { sym: 'η', name: 'Eta'     },
  tet: { sym: 'θ', name: 'Theta'   },
  iot: { sym: 'ι', name: 'Iota'    },
  kap: { sym: 'κ', name: 'Kappa'   },
  lam: { sym: 'λ', name: 'Lambda'  },
  mu:  { sym: 'μ', name: 'Mu'      },
  nu:  { sym: 'ν', name: 'Nu'      },
  ksi: { sym: 'ξ', name: 'Xi'      },
  omi: { sym: 'ο', name: 'Omicron' },
  pi:  { sym: 'π', name: 'Pi'      },
  rho: { sym: 'ρ', name: 'Rho'     },
  sig: { sym: 'σ', name: 'Sigma'   },
  tau: { sym: 'τ', name: 'Tau'     },
  ups: { sym: 'υ', name: 'Upsilon' },
  phi: { sym: 'φ', name: 'Phi'     },
  chi: { sym: 'χ', name: 'Chi'     },
  psi: { sym: 'ψ', name: 'Psi'     },
  ome: { sym: 'ω', name: 'Omega'   },
};

// Spelled-out / Unicode → SIMBAD abbreviation (for query normalisation)
const GREEK_TO_SIMBAD = {
  'alpha': 'alf', 'β': 'bet', 'beta': 'bet', 'γ': 'gam', 'gamma': 'gam',
  'δ': 'del', 'delta': 'del', 'ε': 'eps', 'epsilon': 'eps', 'ζ': 'zet',
  'zeta': 'zet', 'η': 'eta', 'theta': 'tet', 'θ': 'tet', 'iota': 'iot',
  'ι': 'iot', 'kappa': 'kap', 'κ': 'kap', 'lambda': 'lam', 'λ': 'lam',
  'μ': 'mu', 'ν': 'nu', 'xi': 'ksi', 'ξ': 'ksi', 'omicron': 'omi',
  'ο': 'omi', 'π': 'pi', 'ρ': 'rho', 'sigma': 'sig', 'σ': 'sig',
  'τ': 'tau', 'upsilon': 'ups', 'υ': 'ups', 'phi': 'phi', 'φ': 'phi',
  'chi': 'chi', 'χ': 'chi', 'psi': 'psi', 'ψ': 'psi', 'omega': 'ome', 'ω': 'ome',
  'α': 'alf',
};

// Constellation genitive forms for Bayer designation formatting
const CON_GENITIVE = {
  and: 'Andromedae',   ant: 'Antliae',      aps: 'Apodis',       aqr: 'Aquarii',
  aql: 'Aquilae',      ara: 'Arae',         ari: 'Arietis',      aur: 'Aurigae',
  boo: 'Boötis',       cae: 'Caeli',        cam: 'Camelopardalis',cnc: 'Cancri',
  cvn: 'Canum Venaticorum', cma: 'Canis Majoris', cmi: 'Canis Minoris',
  cap: 'Capricorni',   car: 'Carinae',      cas: 'Cassiopeiae',  cen: 'Centauri',
  cep: 'Cephei',       cet: 'Ceti',         cha: 'Chamaeleontis', cir: 'Circini',
  col: 'Columbae',     com: 'Comae Berenices', cra: 'Coronae Australis',
  crb: 'Coronae Borealis', crv: 'Corvi',   crt: 'Crateris',     cru: 'Crucis',
  cyg: 'Cygni',        del: 'Delphini',     dor: 'Doradus',      dra: 'Draconis',
  equ: 'Equulei',      eri: 'Eridani',      for: 'Fornacis',     gem: 'Geminorum',
  gru: 'Gruis',        her: 'Herculis',     hor: 'Horologii',    hya: 'Hydrae',
  hyi: 'Hydri',        ind: 'Indi',         lac: 'Lacertae',     leo: 'Leonis',
  lmi: 'Leonis Minoris', lep: 'Leporis',   lib: 'Librae',       lup: 'Lupi',
  lyn: 'Lyncis',       lyr: 'Lyrae',        men: 'Mensae',       mic: 'Microscopii',
  mon: 'Monocerotis',  mus: 'Muscae',       nor: 'Normae',       oct: 'Octantis',
  oph: 'Ophiuchi',     ori: 'Orionis',      pav: 'Pavonis',      peg: 'Pegasi',
  per: 'Persei',       phe: 'Phoenicis',    pic: 'Pictoris',     psa: 'Piscis Austrini',
  psc: 'Piscium',      pup: 'Puppis',       pyx: 'Pyxidis',      ret: 'Reticuli',
  sge: 'Sagittae',     sgr: 'Sagittarii',   sco: 'Scorpii',      scl: 'Sculptoris',
  sct: 'Scuti',        ser: 'Serpentis',    sex: 'Sextantis',    tau: 'Tauri',
  tel: 'Telescopii',   tri: 'Trianguli',    tra: 'Trianguli Australis',
  tuc: 'Tucanae',      uma: 'Ursae Majoris', umi: 'Ursae Minoris',
  vel: 'Velorum',      vir: 'Virginis',     vol: 'Volantis',     vul: 'Vulpeculae',
};

// ─── Spectral type derivation tables ──────────────────────────────────────────

// Temperature range [min, max] in Kelvin by primary spectral type
const TEMP_RANGES = {
  O: [30000, 100000], B: [10000, 30000], A: [7500, 10000],
  F: [6000,  7500],   G: [5200,  6000],  K: [3700, 5200],
  M: [2400,  3700],   L: [1300,  2400],  T: [700,  1300],
  W: [25000, 210000], C: [2400,  3200],  S: [2400, 3650],
};

// Bolometric corrections for luminosity calc (mid-point per type)
const BOL_CORRECTION = {
  O: -3.2, B: -1.5, A: -0.15, F: -0.05,
  G: -0.25, K: -0.8, M: -2.5, W: -4.0,
};

// Colour description matrix [type][luminosity_category]
// lumCat: 'supergiant' | 'giant' | 'dwarf'
const COLOUR_MAP = {
  O: { supergiant: 'Blue',           giant: 'Blue',          dwarf: 'Blue'         },
  B: { supergiant: 'Blue-white',     giant: 'Blue-white',    dwarf: 'Blue-white'   },
  A: { supergiant: 'White',          giant: 'White',         dwarf: 'White'        },
  F: { supergiant: 'Yellow-white',   giant: 'Yellow-white',  dwarf: 'Yellow-white' },
  G: { supergiant: 'Yellow',         giant: 'Yellow',        dwarf: 'Yellow'       },
  K: { supergiant: 'Deep orange',    giant: 'Orange',        dwarf: 'Orange'       },
  M: { supergiant: 'Deep orange-red',giant: 'Red-orange',    dwarf: 'Red'          },
  L: { supergiant: 'Dark red',       giant: 'Dark red',      dwarf: 'Dark red'     },
  T: { supergiant: 'Brown',          giant: 'Brown',         dwarf: 'Brown'        },
  W: { supergiant: 'Blue',           giant: 'Blue',          dwarf: 'Blue'         },
  C: { supergiant: 'Deep red',       giant: 'Deep red',      dwarf: 'Deep red'     },
  S: { supergiant: 'Red',            giant: 'Red',           dwarf: 'Red'          },
};

// ─── Spectral parsing helpers ─────────────────────────────────────────────────

/**
 * Parse a SIMBAD spectral type string into its components.
 * e.g. "M1-2Ia-Iab" → { type:'M', subtype:1.5, lumClass:'Ia-Iab', lumCat:'supergiant' }
 */
function parseSpectralType(spType) {
  if (!spType || spType === '~') return null;

  // Strip leading/trailing whitespace and clean special chars
  const sp = spType.trim().replace(/\.\.\./g, '');

  // Primary spectral type letter(s)
  const typeMatch = sp.match(/^([OBAFGKMLTWCSR]+)/i);
  if (!typeMatch) return null;
  const type = typeMatch[1][0].toUpperCase();

  // Numeric subtype
  const subMatch = sp.match(/[OBAFGKMLTWCSR]+(\d+(?:[.-]\d+)?)/i);
  const subRaw   = subMatch ? subMatch[1] : null;
  let subtype    = null;
  if (subRaw) {
    // Handle ranges like "1-2" → average 1.5
    const parts = subRaw.split('-');
    subtype = parts.reduce((a, b) => a + parseFloat(b), 0) / parts.length;
  }

  // Luminosity class — appears after the subtype
  const lumMatch = sp.match(/[IV]+[ab]*/);
  const lumClass = lumMatch ? lumMatch[0] : null;

  // Luminosity category
  let lumCat = 'dwarf';
  if (lumClass) {
    if (/^I[^V]|^I$|^Ia|^Ib/.test(lumClass)) lumCat = 'supergiant';
    else if (/^II/.test(lumClass))            lumCat = 'giant';
    else if (/^III/.test(lumClass))           lumCat = 'giant';
    else if (/^IV/.test(lumClass))            lumCat = 'dwarf';
  }

  return { type, subtype, lumClass, lumCat, raw: spType };
}

/**
 * Estimate effective temperature in Kelvin from parsed spectral type.
 * Uses linear interpolation within type range based on subtype (0→hot, 9→cool).
 */
function spectralToTemperature(parsed) {
  if (!parsed) return null;
  const range = TEMP_RANGES[parsed.type];
  if (!range) return null;
  const [min, max] = range;

  // Default subtype 5 if unknown → mid-range
  const sub = parsed.subtype !== null ? Math.min(9, Math.max(0, parsed.subtype)) : 5;
  const frac = 1 - (sub / 9);          // 0 = coolest end, 1 = hottest end of type
  const temp = Math.round(min + (max - min) * frac);

  // Round to nearest 100 for readability
  return Math.round(temp / 100) * 100;
}

/**
 * Derive a human-readable colour from spectral data.
 */
function spectralToColour(parsed) {
  if (!parsed) return null;
  const row = COLOUR_MAP[parsed.type];
  return row ? (row[parsed.lumCat] || row.dwarf) : null;
}

/**
 * Generate the class description string, e.g. "Red supergiant (M1-2 Ia-Iab)".
 */
function spectralToClass(parsed) {
  if (!parsed) return null;
  const { type, lumClass, lumCat, raw } = parsed;

  const prefix = {
    O: 'Blue',        B: 'Blue-white',    A: 'White',
    F: 'Yellow-white',G: 'Yellow (Sun-like)', K: 'Orange',
    M: 'Red',         L: 'Dark-red',      T: 'Brown dwarf',
    W: 'Wolf-Rayet',  C: 'Carbon',        S: 'S-type',
  }[type] || type;

  const suffix = {
    supergiant: 'supergiant', giant: 'giant',
    dwarf:      type === 'W' ? '' : 'dwarf',
  }[lumCat] || '';

  const lumStr  = lumClass ? ` (${raw.replace(/\s+/g, '')})` : '';
  return suffix ? `${prefix} ${suffix}${lumStr}` : `${prefix}${lumStr}`;
}

/**
 * Estimate stellar age as a human-readable range.
 * Based on spectral type + luminosity class — rough but scientifically grounded.
 */
function spectralToAge(parsed) {
  if (!parsed) return null;
  const { type, lumCat } = parsed;

  if (lumCat === 'supergiant') {
    // Supergiants evolve from massive short-lived O/B progenitors
    if (['O', 'B', 'A'].includes(type)) return '5 – 30 million years';
    if (['M', 'K', 'G'].includes(type)) return '8 – 30 million years';
    return '5 – 50 million years';
  }

  if (lumCat === 'giant') {
    if (type === 'B') return '100 – 500 million years';
    if (type === 'A') return '0.3 – 3 billion years';
    if (['G', 'F'].includes(type)) return '2 – 10 billion years';
    if (['K', 'M'].includes(type)) return '1 – 12 billion years';
    return '1 – 10 billion years';
  }

  // Main sequence
  const ms = {
    O: '1 – 10 million years',
    B: '10 – 400 million years',
    A: '300 million – 3 billion years',
    F: '2 – 7 billion years',
    G: '1 – 12 billion years',
    K: '5 – 15+ billion years',
    M: '10 billion+ years',
    L: 'unknown (brown dwarf)',
    T: 'unknown (brown dwarf)',
    W: '< 5 million years',
  };
  return ms[type] || null;
}

// ─── Luminosity calculation ───────────────────────────────────────────────────

/**
 * Calculate luminosity relative to Sun from absolute magnitude + spectral type.
 * Returns a formatted string e.g. "~100,000 × Sun".
 */
function calcLuminosity(apparentMag, parallaxMas, spType) {
  if (apparentMag == null || parallaxMas == null || parallaxMas <= 0) return null;

  const distPc = 1000 / parallaxMas;
  const absMag = apparentMag - 5 * Math.log10(distPc / 10);

  const parsed = parseSpectralType(spType);
  const bc     = (parsed && BOL_CORRECTION[parsed.type]) ? BOL_CORRECTION[parsed.type] : -0.2;
  const mBol   = absMag + bc;

  const M_BOL_SUN = 4.74;
  const lum = Math.pow(10, (M_BOL_SUN - mBol) / 2.5);

  if (lum >= 100000) return `~${Math.round(lum / 10000) * 10000}× Sun`;
  if (lum >= 10000)  return `~${Math.round(lum / 1000) * 1000}× Sun`;
  if (lum >= 1000)   return `~${Math.round(lum / 100) * 100}× Sun`;
  if (lum >= 100)    return `~${Math.round(lum / 10) * 10}× Sun`;
  if (lum >= 1)      return `~${Math.round(lum)}× Sun`;
  return `~${lum.toFixed(3)}× Sun`;
}

// ─── Distance formatting ──────────────────────────────────────────────────────

/**
 * Convert parallax in milliarcseconds to a formatted light-year string.
 * Handles error bars and implausible values gracefully.
 */
function parallaxToDistance(plxMas, plxErr) {
  if (plxMas == null || plxMas <= 0) return null;

  // Ignore implausible parallaxes (negative or tiny → effectively infinite)
  if (plxMas < 0.01) return null;

  const PC_TO_LY  = 3.26156;
  const distPc    = 1000 / plxMas;
  const distLy    = distPc * PC_TO_LY;

  // Round to 2 significant figures for readability
  const rounded = parseFloat(distLy.toPrecision(2));

  if (plxErr && plxErr > 0 && (plxErr / plxMas) > 0.1) {
    // Error > 10% — give a rough range
    const dMin = (1000 / (plxMas + plxErr)) * PC_TO_LY;
    const dMax = (1000 / (plxMas - plxErr)) * PC_TO_LY;
    return `~${Math.round(dMin)} – ${Math.round(dMax)} light-years`;
  }

  return `~${rounded} light-years`;
}

// ─── Designation extraction ───────────────────────────────────────────────────

/**
 * Extract the best Bayer designation from the SIMBAD identifier list.
 * Returns something like "α Orionis" or null if not found.
 */
function extractDesignation(identifiers) {
  // SIMBAD Bayer entries look like "* alf Ori", "* chi2 Ori", "* bet CMa", etc.
  const bayerRe = /^\*\s+([a-z]+)(\d*)\s+([A-Za-z]+)$/i;

  for (const id of identifiers) {
    const m = id.trim().match(bayerRe);
    if (!m) continue;
    const abbrev = m[1].toLowerCase();
    const num    = m[2];          // e.g. "2" in chi2
    const con    = m[3].toLowerCase();

    const greek   = GREEK[abbrev];
    const genitive = CON_GENITIVE[con];

    if (greek) {
      const sym = greek.sym + (num ? num : '');
      const gen = genitive || m[3];
      return `${sym} ${gen}`;
    }
  }
  return null;
}

// ─── Label normalisation ──────────────────────────────────────────────────────

/**
 * Normalise the star label to maximise SIMBAD resolution.
 * Converts Unicode Greek → SIMBAD 3-letter abbrevs, trims, etc.
 */
function normaliseLabelForSimbad(label) {
  let s = label.trim();

  // Replace common Unicode Greek + "spelled-out" → 3-letter SIMBAD abbrev
  // e.g. "α Orionis" → "alf Ori", "chi2 Ori" stays, "α2 Ori" → "alf2 Ori"
  for (const [key, abbrev] of Object.entries(GREEK_TO_SIMBAD)) {
    // Replace the greek symbol/word at start of string
    const re = new RegExp(`^${escapeRegex(key)}(\\d*)\\s*`, 'i');
    if (re.test(s)) {
      s = s.replace(re, (_, num) => `${abbrev}${num} `).trim();
      break;
    }
  }

  // Remove "Orionis" → "Ori" style (keep short form for SIMBAD)
  for (const [abbr, gen] of Object.entries(CON_GENITIVE)) {
    if (s.endsWith(gen)) {
      s = s.slice(0, -gen.length).trim() + ' ' + abbr;
      break;
    }
    // Also handle abbreviated form already present
    const short = abbr.charAt(0).toUpperCase() + abbr.slice(1);
    // e.g. "alf Ori" already fine, don't touch
  }

  return s;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── SIMBAD TAP queries ───────────────────────────────────────────────────────

/**
 * Execute an ADQL query against the SIMBAD TAP service.
 * Returns an array of row objects keyed by column name.
 */
async function simbadQuery(adql) {
  const params = new URLSearchParams({
    REQUEST: 'doQuery',
    LANG:    'ADQL',
    FORMAT:  'json',
    QUERY:   adql,
  });

  const url  = `${SIMBAD_TAP}?${params.toString()}`;
  const res  = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`SIMBAD HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  // SIMBAD TAP JSON format: { metadata: [{name, ...}], data: [[...], ...] }
  if (!json.data || !json.metadata) return [];

  const cols = json.metadata.map(m => m.name);
  return json.data.map(row =>
    Object.fromEntries(cols.map((col, i) => [col, row[i]]))
  );
}

/**
 * Fetch all available data for one star label from SIMBAD.
 * Returns a result object (partial if some data unavailable).
 */
async function fetchStarData(label) {
  const normalised = normaliseLabelForSimbad(label);
  console.log(`  Querying: "${label}" → normalised "${normalised}"`);

  // ── Step 1: Basic info + parallax ──────────────────────────────────────────
  let basicRows = [];
  try {
    basicRows = await simbadQuery(`
      SELECT TOP 1
        b.oid, b.main_id, b.sp_type,
        b.plx_value, b.plx_err
      FROM basic b
      JOIN ident i ON i.oidref = b.oid
      WHERE i.id = '${normalised.replace(/'/g, "''")}'
    `);
  } catch (e) {
    console.warn(`    ⚠ Basic query failed: ${e.message}`);
  }

  // Fallback: try the original label without normalisation
  if (!basicRows.length && normalised !== label) {
    try {
      basicRows = await simbadQuery(`
        SELECT TOP 1
          b.oid, b.main_id, b.sp_type,
          b.plx_value, b.plx_err
        FROM basic b
        JOIN ident i ON i.oidref = b.oid
        WHERE i.id = '${label.replace(/'/g, "''")}'
      `);
    } catch (e) {
      console.warn(`    ⚠ Fallback basic query failed: ${e.message}`);
    }
  }

  if (!basicRows.length) {
    console.warn(`    ✗ Not found in SIMBAD: "${label}"`);
    return null;
  }

  const basic = basicRows[0];
  const oid   = basic.oid;

  // ── Step 2: Identifiers (for Bayer designation) ────────────────────────────
  let identifiers = [];
  try {
    const identRows = await simbadQuery(`
      SELECT id FROM ident WHERE oidref = ${oid}
    `);
    identifiers = identRows.map(r => r.id).filter(Boolean);
  } catch (e) {
    console.warn(`    ⚠ Identifier query failed: ${e.message}`);
  }

  await sleep(DELAY_MS);

  // ── Step 3: V-band apparent magnitude ─────────────────────────────────────
  let vMag = null;
  try {
    const fluxRows = await simbadQuery(`
      SELECT flux, filter FROM flux
      WHERE oidref = ${oid} AND filter = 'V'
      ORDER BY bibcode DESC LIMIT 1
    `);
    if (fluxRows.length && fluxRows[0].flux != null) {
      vMag = parseFloat(fluxRows[0].flux);
    }
  } catch (e) {
    // Non-fatal
  }

  // ── Derive all properties ──────────────────────────────────────────────────
  const parsed = parseSpectralType(basic.sp_type);
  const temp   = spectralToTemperature(parsed);

  // Format temperature nicely
  let tempStr = null;
  if (temp) {
    if (temp >= 10000) tempStr = `${(temp / 1000).toFixed(0)},${String(temp % 1000).padStart(3,'0')} K`;
    else               tempStr = `${temp.toLocaleString()} K`;
    // Simpler: just show rounded value
    tempStr = `${temp.toLocaleString()} K`;
  }

  const result = {
    label,
    mainId:      basic.main_id,
    spType:      basic.sp_type && basic.sp_type !== '~' ? basic.sp_type : null,
    parallax:    basic.plx_value,
    parallaxErr: basic.plx_err,
    identifiers,
    parsed,

    // Derived fields
    designation:  extractDesignation(identifiers),
    distance:     parallaxToDistance(basic.plx_value, basic.plx_err),
    colour:       spectralToColour(parsed),
    starClass:    spectralToClass(parsed),
    temperature:  tempStr,
    age:          spectralToAge(parsed),
    luminosity:   calcLuminosity(vMag, basic.plx_value, basic.sp_type),
  };

  // Report what was found
  const found = Object.entries(result)
    .filter(([k, v]) => !['label','mainId','spType','parallax','parallaxErr','identifiers','parsed'].includes(k) && v != null)
    .map(([k]) => k);
  console.log(`    ✓ Found: ${basic.main_id} — data: ${found.join(', ') || 'spectral type only'}`);

  return result;
}

// ─── TypeScript file generator ────────────────────────────────────────────────

/**
 * Format a single ConstellationSection object for the output .ts file.
 */
function formatSection(star, simbadData) {
  const id = star.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // Use the label from config as the title and name
  const title = star.label;
  const name = star.label;

  // Build starData fields — only include fields that have values
  const fields = {};

  // Always use the config label as name
  fields.name = name;
  
  // Format designation as "Beta Corvi - β Corvi" or "Epsilon Corvi - ε Corvi"
  if (simbadData?.designation) {
    const designation = simbadData.designation;
    // Extract the Greek symbol and constellation (e.g., "α Cassiopeiae")
    const match = designation.match(/^([α-ωΑ-Ω]+\d*)\s+(.+)$/);
    if (match) {
      const symbol = match[1];
      const constellation = match[2];
      
      // Find the spelled-out Greek name
      const greekChar = symbol[0];
      const number = symbol.slice(1); // e.g., "2" from "χ2"
      
      let spelledOut = null;
      for (const [abbrev, data] of Object.entries(GREEK)) {
        if (data.sym === greekChar) {
          spelledOut = data.name + (number || '');
          break;
        }
      }
      
      if (spelledOut) {
        fields.designation = `${spelledOut} ${constellation} - ${designation}`;
      } else {
        fields.designation = designation;
      }
    } else {
      fields.designation = designation;
    }
  }
  
  if (simbadData?.distance)    fields.distance    = simbadData.distance;
  if (simbadData?.age)         fields.age         = simbadData.age;
  if (simbadData?.starClass)   fields.class       = simbadData.starClass;
  if (simbadData?.colour)      fields.colour      = simbadData.colour;
  if (simbadData?.temperature) fields.temperature = simbadData.temperature;
  if (simbadData?.luminosity)  fields.luminosity  = simbadData.luminosity;

  const hasData = Object.keys(fields).length > 0;

  // Pad keys for alignment
  const pad = hasData ? Math.max(...Object.keys(fields).map(k => k.length)) + 1 : 0;

  const starDataStr = hasData
    ? Object.entries(fields)
        .map(([k, v]) => `        ${(k + ':').padEnd(pad)} "${v}",`)
        .join('\n')
    : '        // No data found in SIMBAD — fill in manually';

  return `    {
      id:          "${id}",
      starId:      "${star.id}",
      title:       "${title}",
      description: "",   // TODO: add a brief description
      starData: {
${starDataStr}
      },
    }`;
}

/**
 * Generate the full (constellation).ts file contents.
 */
function generateTsFile(config, starResults) {
  const varName = config.id.replace(/-./g, m => m[1].toUpperCase()); // camelCase

  // Stars array — use coordinates from config if provided, otherwise placeholder
  const starsArr = config.stars
    .map(s => {
      const x = s.x !== undefined ? s.x : 0;
      const y = s.y !== undefined ? s.y : 0;
      return `    { id: "${s.id}", x: ${x}, y: ${y}, label: "${s.label}", size: ${s.size || 27} },`;
    })
    .join('\n');

  // Star ID map comment
  const idComment = config.stars
    .map(s => `//   ${s.id} → ${s.label}`)
    .join('\n');

  // Constellation sections
  const sections = config.stars.map(star => {
    const data = starResults.find(r => r?.label === star.label);
    return formatSection(star, data);
  }).join(',\n\n');

  const now = new Date().toISOString().split('T')[0];

  return `import type { ConstellationData } from "./types";

// ─── ${config.name} ${'─'.repeat(Math.max(0, 68 - config.name.length))}
//
// Generated: ${now}
// Source:    SIMBAD Astronomical Database (simbad.u-strasbg.fr)
//
// Star IDs:
${idComment}
//

const ${varName}: ConstellationData = {
  id:          "${config.id}",
  name:        "${config.name}",
  description: "${config.description || ''}",
  hasProject:  ${config.hasProject ? 'true' : 'false'},

  // ── Stars ──────────────────────────────────────────────────────────────────
  // If x, y coordinates were not in config, replace x: 0, y: 0 with actual SVG coordinates
  stars: [
${starsArr}
  ],

  // ── Lines ──────────────────────────────────────────────────────────────────
  // TODO: add lines as [x1, y1, x2, y2] tuples
  lines: [],

  // ── Constellation view ─────────────────────────────────────────────────────
  constellationSections: [
${sections}
  ],

  // ── Project view ───────────────────────────────────────────────────────────
  projectSections: [],
};

export default ${varName};
`;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/generate-constellation.js <config.json>');
    process.exit(1);
  }

  // Read + parse config
  const configPath = path.resolve(process.cwd(), arg);
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    console.error(`Failed to parse config JSON: ${e.message}`);
    process.exit(1);
  }

  if (!config.id || !config.name || !Array.isArray(config.stars) || !config.stars.length) {
    console.error('Config must have: id, name, stars[]');
    process.exit(1);
  }

  console.log(`\n🌌 Generating constellation: ${config.name}`);
  console.log(`   ${config.stars.length} stars to look up\n`);

  // Query SIMBAD for each star
  const results = [];
  for (let i = 0; i < config.stars.length; i++) {
    const star = config.stars[i];
    console.log(`[${i + 1}/${config.stars.length}] ${star.label}`);
    try {
      const data = await fetchStarData(star.label);
      results.push(data);
    } catch (e) {
      console.warn(`  ✗ Error: ${e.message}`);
      results.push(null);
    }

    if (i < config.stars.length - 1) await sleep(DELAY_MS);
  }

  // Generate TypeScript file
  const tsContent = generateTsFile(config, results);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outPath = path.join(OUTPUT_DIR, `${config.id}.ts`);
  fs.writeFileSync(outPath, tsContent, 'utf8');

  // Summary
  const found    = results.filter(Boolean).length;
  const notFound = results.length - found;

  console.log(`\n✅ Done!`);
  console.log(`   Output:    ${outPath}`);
  console.log(`   Found:     ${found}/${config.stars.length} stars in SIMBAD`);
  if (notFound) console.log(`   Not found: ${notFound} (left as empty stubs)`);
  console.log(`\n   Next steps:`);
  console.log(`   1. Open ${config.id}.ts and fill in x, y coordinates for each star`);
  console.log(`   2. Add constellation lines ([ x1, y1, x2, y2 ] tuples)`);
  console.log(`   3. Add descriptions to each constellationSection`);
  console.log(`   4. Import and register in src/data/index.ts\n`);
}

main().catch(e => {
  console.error(`\nFatal error: ${e.message}`);
  if (process.env.DEBUG) console.error(e.stack);
  process.exit(1);
});