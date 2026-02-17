import type { ConstellationData } from "./types";

// ─── Corvus ──────────────────────────────────────────────────────────────
//
// Generated: 2026-02-17
// Source:    SIMBAD Astronomical Database (simbad.u-strasbg.fr)
//
// Star IDs:
//   a → Kraz
//   b → Algorab
//   c → Gienah
//   d → ε Corvi
//   e → Alchiba
//

const corvus: ConstellationData = {
  id:          "corvus",
  name:        "Corvus",
  description: "The Crow",
  hasProject:  false,

  // ── Stars ──────────────────────────────────────────────────────────────────
  // If x, y coordinates were not in config, replace x: 0, y: 0 with actual SVG coordinates
  stars: [
    { id: "a", x: 190, y: 580, label: "Kraz", size: 27 },
    { id: "b", x: 240, y: 245, label: "Algorab", size: 27 },
    { id: "c", x: 430, y: 290, label: "Gienah", size: 27 },
    { id: "d", x: 500, y: 560, label: "ε Corvi", size: 27 },
    { id: "e", x: 495, y: 680, label: "Alchiba", size: 18 },
  ],

  // ── Lines ──────────────────────────────────────────────────────────────────
  // TODO: add lines as [x1, y1, x2, y2] tuples
  lines: [
    [500, 560, 190, 580], [190, 580, 240, 245], 
    [240, 245, 430, 290], [430, 290, 500, 560], 
    [500, 560, 495, 680], 
  ],

  // ── Constellation view ─────────────────────────────────────────────────────
  constellationSections: [
    {
      id:          "kraz",
      starId:      "a",
      title:       "Kraz",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Kraz",
        designation: "Beta Corvi - β Corvi",
        distance:    "~150 light-years",
        age:         "8 – 30 million years",
        class:       "Yellow (Sun-like) supergiant (G5IIBa0.3)",
        colour:      "Yellow",
        temperature: "5,600 K",
      },
    },

    {
      id:          "algorab",
      starId:      "b",
      title:       "Algorab",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Algorab",
        designation: "Delta Corvi - δ Corvi",
        distance:    "~86 light-years",
        age:         "300 million – 3 billion years",
        class:       "White dwarf (A0IV(n)kB9)",
        colour:      "White",
        temperature: "10,000 K",
      },
    },

    {
      id:          "gienah",
      starId:      "c",
      title:       "Gienah",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Gienah",
        designation: "Gamma Corvi - γ Corvi",
        distance:    "~150 light-years",
        age:         "5 – 30 million years",
        class:       "Blue-white supergiant (B8III)",
        colour:      "Blue-white",
        temperature: "12,200 K",
      },
    },

    {
      id:          "corvi",
      starId:      "d",
      title:       "ε Corvi",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "ε Corvi",
        designation: "Epsilon Corvi - ε Corvi",
        distance:    "~310 light-years",
        age:         "8 – 30 million years",
        class:       "Orange supergiant (K2+IIIa)",
        colour:      "Deep orange",
        temperature: "4,900 K",
      },
    },

    {
      id:          "alchiba",
      starId:      "e",
      title:       "Alchiba",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Alchiba",
        designation: "Alpha Corvi - α Corvi",
        distance:    "~49 light-years",
        age:         "2 – 7 billion years",
        class:       "Yellow-white dwarf (F1V)",
        colour:      "Yellow-white",
        temperature: "7,300 K",
      },
    }
  ],

  // ── Project view ───────────────────────────────────────────────────────────
  projectSections: [],
};

export default corvus;
