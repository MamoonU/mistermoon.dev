import type { ConstellationData } from "./types";
import orion from "./orion";
import corvus from "./corvus";

// ─── Registry ─────────────────────────────────────────────────────────────────
//
// Add every new constellation file here.  All index pages and route resolution
// pull from this single source of truth.
//
const CONSTELLATIONS: ConstellationData[] = [
  orion,
  corvus,
  // cassiopeia,
  // ursamajor,
  // ...
];

/** Look up a constellation by its id slug (e.g. "orion"). */
export function getConstellation(slug: string): ConstellationData | undefined {
  return CONSTELLATIONS.find((c) => c.id === slug);
}

/** All constellations in the registry. */
export function getAllConstellations(): ConstellationData[] {
  return CONSTELLATIONS;
}

/** Only constellations that have an associated project. */
export function getProjectConstellations(): ConstellationData[] {
  return CONSTELLATIONS.filter((c) => c.hasProject);
}

export default CONSTELLATIONS;