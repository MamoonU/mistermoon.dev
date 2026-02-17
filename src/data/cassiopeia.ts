import type { ConstellationData } from "./types";

// ─── Cassiopeia ──────────────────────────────────────────────────────────
//
// Generated: 2026-02-17
// Source:    SIMBAD Astronomical Database (simbad.u-strasbg.fr)
//
// Star IDs — fill in x, y coordinates and lines below:
//   a → Schedar
//   b → Caph
//   c → Castula
//   d → Ruchbah
//   e → Segin
//   f → Achird
//   g → Fulu
//

const cassiopeia: ConstellationData = {
  id:          "cassiopeia",
  name:        "Cassiopeia",
  description: "The Queen",
  hasProject:  false,

  // ── Stars ──────────────────────────────────────────────────────────────────
  // TODO: replace x: 0, y: 0 with actual SVG coordinates
  stars: [
    { id: "a", x: 0, y: 0, label: "Schedar", size: 36 },
    { id: "b", x: 0, y: 0, label: "Caph", size: 27 },
    { id: "c", x: 0, y: 0, label: "Castula", size: 18 },
    { id: "d", x: 0, y: 0, label: "Ruchbah", size: 18 },
    { id: "e", x: 0, y: 0, label: "Segin", size: 18 },
    { id: "f", x: 0, y: 0, label: "Achird", size: 18 },
    { id: "g", x: 0, y: 0, label: "Fulu", size: 18 },
  ],

  // ── Lines ──────────────────────────────────────────────────────────────────
  // TODO: add lines as [x1, y1, x2, y2] tuples
  lines: [],

  // ── Constellation view ─────────────────────────────────────────────────────
  constellationSections: [
    {
      id:          "schedar",
      starId:      "a",
      title:       "alf Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "alf Cas",
        designation: "α Cassiopeiae",
        distance:    "~230 light-years",
        age:         "8 – 30 million years",
        class:       "Orange supergiant (K0-IIIa)",
        colour:      "Deep orange",
        temperature: "5,200 K",
      },
    },

    {
      id:          "caph",
      starId:      "b",
      title:       "bet Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "bet Cas",
        designation: "β Cassiopeiae",
        distance:    "~55 light-years",
        age:         "5 – 50 million years",
        class:       "Yellow-white supergiant (F2III)",
        colour:      "Yellow-white",
        temperature: "7,200 K",
      },
    },

    {
      id:          "castula",
      starId:      "c",
      title:       "ups02 Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "ups02 Cas",
        designation: "υ02 Cassiopeiae",
        distance:    "~200 light-years",
        age:         "8 – 30 million years",
        class:       "Yellow (Sun-like) supergiant (G8.5IIIbFe-0.5)",
        colour:      "Yellow",
        temperature: "5,200 K",
      },
    },

    {
      id:          "ruchbah",
      starId:      "d",
      title:       "del Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "del Cas",
        designation: "δ Cassiopeiae",
        distance:    "~99 light-years",
        age:         "300 million – 3 billion years",
        class:       "White dwarf (A5IV)",
        colour:      "White",
        temperature: "8,600 K",
      },
    },

    {
      id:          "segin",
      starId:      "e",
      title:       "eps Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "eps Cas",
        designation: "ε Cassiopeiae",
        distance:    "~470 light-years",
        age:         "10 – 400 million years",
        class:       "Blue-white dwarf (B3Vp_sh)",
        colour:      "Blue-white",
        temperature: "23,300 K",
      },
    },

    {
      id:          "achird",
      starId:      "f",
      title:       "eta Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "eta Cas",
        designation: "η Cassiopeiae",
        distance:    "~19 light-years",
        age:         "2 – 7 billion years",
        class:       "Yellow-white dwarf (F9V)",
        colour:      "Yellow-white",
        temperature: "6,000 K",
      },
    },

    {
      id:          "fulu",
      starId:      "g",
      title:       "zet Cas",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "zet Cas",
        designation: "ζ Cassiopeiae",
        distance:    "~490 light-years",
        age:         "10 – 400 million years",
        class:       "Blue-white dwarf (B2IV)",
        colour:      "Blue-white",
        temperature: "25,600 K",
      },
    }
  ],

  // ── Project view ───────────────────────────────────────────────────────────
  projectSections: [],
};

export default cassiopeia;
