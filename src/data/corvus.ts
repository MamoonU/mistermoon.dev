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
      id:     "betelgeuse",
      starId: "a",
      title:  "Betelgeuse",
      starData: {
        name:        "Betelgeuse",
        designation: "α Orionis",
        distance:    "700 light-years",
        class:       "Red supergiant (M1–M2)",
        colour:      "Deep orange-red",
        temperature: "3,500 K",
        luminosity:  "~100,000 × Sun",
        info:        "One of the largest and most luminous stars visible to the naked eye. So enormous that if placed at the centre of our Solar System, its surface would engulf every planet out to Jupiter. It is a semi-regular variable star, pulsating in brightness on cycles of roughly 400 days. Betelgeuse is expected to end its life as a supernova within the next 100,000 years — cosmically imminent.",
      },
    },
    {
      id:     "c-rigel",
      starId: "o",
      title:  "Rigel",
      starData: {
        name:        "Rigel",
        designation: "β Orionis",
        distance:    "860 light-years",
        class:       "Blue supergiant (B8 Ia)",
        colour:      "Blue-white",
        temperature: "12,100 K",
        luminosity:  "~120,000 × Sun",
        info:        "Despite being labelled beta, Rigel is typically the brightest star in Orion. It anchors the hunter's left foot and is one of the most intrinsically luminous stars in the Milky Way. The contrast between Rigel's icy blue-white and Betelgeuse's warm amber is one of the most striking colour pairs in the winter sky, visible to the naked eye on any clear night.",
      },
    },
    {
      id:     "c-belt",
      starId: "l",
      title:  "The Belt — Mintaka, Alnilam, Alnitak",
      starData: {
        stars:     "Mintaka (δ), Alnilam (ε), Alnitak (ζ)",
        distances: "900 – 1,340 light-years",
        class:     "O- and B-type supergiants",
        alignment: "Nearly perfect 3° arc",
        info:      "Three of the most recognisable stars in the night sky, forming a near-perfect horizontal line that has oriented sailors, priests, and pyramid-builders for millennia. The alignment is a coincidence of perspective — in three-dimensional space the three stars are nowhere near each other. Alnilam, the middle star, is the most luminous of the trio, radiating roughly 375,000 times the energy of our Sun.",
      },
    },
    {
      id:     "c-nebula",
      starId: "g",
      title:  "The Great Nebula — M42",
      starData: {
        name:      "Orion Nebula",
        catalogue: "M42 / NGC 1976",
        distance:  "1,344 light-years",
        diameter:  "24 light-years",
        class:     "Diffuse emission nebula",
        info:      "Visible to the naked eye as a fuzzy patch below the belt, M42 is one of the most scrutinised objects in the sky. Within its glowing clouds, protostars are collapsing under gravity and igniting nuclear fusion for the very first time. The Trapezium cluster at its heart provides the ultraviolet radiation that excites the surrounding hydrogen into a luminous pink-violet haze. Long-exposure photography reveals dramatic pillars of dust inside which new solar systems are assembling even now.",
      },
    },],

  // ── Project view ───────────────────────────────────────────────────────────
  projectSections: [

  ],
};

    export default corvus;

