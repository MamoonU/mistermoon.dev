import type { ConstellationData } from "./types";

// ─── Corvus ────────────────────────────────────────────────────────────────────
//
// Star IDs and rough correspondences:
//   a → Gienah        (190, 580)
//   b → Kraz          (240, 245)
//   c → Alchiba       (430, 290)
//   d → Minkar        (500, 560)
//   e → tail / ext    (495, 680)
//

const corvus: ConstellationData = {
  id:          "corvus",
  name:        "Corvus",
  description: "The Crow",
  hasProject:  false,

  // ── Stars ──────────────────────────────────────────────────────────────────
  stars: [
    { id: "a", x: 190, y: 580, label: "Gienah",  size: 27 },
    { id: "b", x: 240, y: 245, label: "Kraz",    size: 27 },
    { id: "c", x: 430, y: 290, label: "Alchiba", size: 27 },
    { id: "d", x: 500, y: 560, label: "Minkar",  size: 27 },
    { id: "e", x: 495, y: 680, label: "E",       size: 18 },
  ],

  // ── Lines ──────────────────────────────────────────────────────────────────
  
  lines: [
    [500, 560, 190, 580], [190, 580, 240, 245], 
    [240, 245, 430, 290], [430, 290, 500, 560], 
    [500, 560, 495, 680], 
  ],

  // ── Constellation view ─────────────────────────────────────────────────────
  constellationSections: [
    {
      id:          "gienah",
      starId:      "a",
      title:       "Gienah",
      description: "The brightest star in Corvus, marking the crow's wing.",
      starData: {
        name:        "Gienah",
        designation: "γ Corvi",
        distance:    "165 light-years",
        class:       "Blue-white giant (B8 III)",
        info:        "Gienah is the brightest star in the constellation Corvus. The name derives from the Arabic for 'wing'. It is a blue-white giant star that has exhausted the hydrogen in its core and is now fusing helium.",
      },
    },
    {
      id:          "kraz",
      starId:      "b",
      title:       "Kraz",
      description: "Also known as Beta Corvi, this giant star helps form the distinctive quadrilateral shape of the crow.",
      starData: {
        name:        "Kraz",
        designation: "β Corvi",
        distance:    "140 light-years",
        class:       "Yellow giant (G5 II)",
        info:        "Kraz is the second-brightest star in Corvus. It is a yellow giant star, similar to what our Sun will become in several billion years, but significantly more massive and luminous.",
      },
    },
  ],

  // ── Project view ───────────────────────────────────────────────────────────
  projectSections: [

  ],
};

    export default corvus;