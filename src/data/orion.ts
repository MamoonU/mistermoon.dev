import type { ConstellationData } from "./types";

// ─── Orion ───────────────────────────────────────────────────────────────
//
// Generated: 2026-02-17
// Source:    SIMBAD Astronomical Database (simbad.u-strasbg.fr)
//
// Star IDs:
//   a → χ2 Orionis
//   b → χ1 Orionis
//   c → ξ Orionis
//   d → ν Orionis
//   e → μ Orionis
//   f → Betelgeuse
//   g → Meissa
//   h → Bellatrix
//   i → π3 Orionis
//   j → Alnitak
//   k → Alnilam
//   l → Mintaka
//   m → Saiph
//   n → Rigel
//   o → π2 Orionis
//   p → π1 Orionis
//   q → π4 Orionis
//   r → π5 Orionis
//   s → π6 Orionis
//

const orion: ConstellationData = {
  id:          "orion",
  name:        "Orion",
  description: "The Hunter",
  hasProject:  true,

  // ── Stars ──────────────────────────────────────────────────────────────────
  // If x, y coordinates were not in config, replace x: 0, y: 0 with actual SVG coordinates
  stars: [
    { id: "a", x: 180, y: 72, label: "χ2 Orionis", size: 18 },
    { id: "b", x: 252, y: 54, label: "χ1 Orionis", size: 18 },
    { id: "c", x: 144, y: 198, label: "ξ Orionis", size: 18 },
    { id: "d", x: 171, y: 189, label: "ν Orionis", size: 18 },
    { id: "e", x: 198, y: 306, label: "μ Orionis", size: 18 },
    { id: "f", x: 252, y: 360, label: "Betelgeuse", size: 45 },
    { id: "g", x: 360, y: 306, label: "Meissa", size: 27 },
    { id: "h", x: 450, y: 378, label: "Bellatrix", size: 36 },
    { id: "i", x: 666, y: 369, label: "π3 Orionis", size: 27 },
    { id: "j", x: 324, y: 612, label: "Alnitak", size: 36 },
    { id: "k", x: 360, y: 594, label: "Alnilam", size: 36 },
    { id: "l", x: 396, y: 567, label: "Mintaka", size: 36 },
    { id: "m", x: 279, y: 756, label: "Saiph", size: 27 },
    { id: "n", x: 486, y: 729, label: "Rigel", size: 45 },
    { id: "o", x: 657, y: 315, label: "π2 Orionis", size: 18 },
    { id: "p", x: 630, y: 279, label: "π1 Orionis", size: 18 },
    { id: "q", x: 657, y: 405, label: "π4 Orionis", size: 18 },
    { id: "r", x: 648, y: 468, label: "π5 Orionis", size: 18 },
    { id: "s", x: 621, y: 486, label: "π6 Orionis", size: 18 },
  ],

  // ── Lines ──────────────────────────────────────────────────────────────────
  lines: [
    [180,  72, 144, 198], [252,  54, 171, 189], [144, 198, 171, 189],
    [144, 198, 198, 306], [171, 189, 198, 306], [198, 306, 252, 360],
    [252, 360, 360, 306], [360, 306, 450, 378], [450, 378, 666, 369],
    [252, 360, 324, 612], [324, 612, 360, 594], [360, 594, 396, 567],
    [396, 567, 450, 378],
    [324, 612, 279, 756], [279, 756, 486, 729], [486, 729, 396, 567],
    [666, 369, 657, 405], [657, 405, 648, 468], [648, 468, 621, 486],
    [666, 369, 657, 315], [657, 315, 630, 279],
  ],

  // ── Constellation view ─────────────────────────────────────────────────────
  constellationSections: [
    {
      id:          "2-orionis",
      starId:      "a",
      title:       "χ2 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "χ2 Orionis",
        designation: "Chi02 Orionis - χ02 Orionis",
        distance:    "~3683 – 5083 light-years",
        age:         "5 – 30 million years",
        class:       "Blue-white supergiant (B2Ia)",
        colour:      "Blue-white",
        temperature: "25,600 K",
      },
    },

    {
      id:          "1-orionis",
      starId:      "b",
      title:       "χ1 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "χ1 Orionis",
        designation: "Chi01 Orionis - χ01 Orionis",
        distance:    "~28 light-years",
        age:         "1 – 12 billion years",
        class:       "Yellow (Sun-like) dwarf (G0V)",
        colour:      "Yellow",
        temperature: "6,000 K",
      },
    },

    {
      id:          "orionis",
      starId:      "c",
      title:       "ξ Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "ξ Orionis",
        designation: "Xi Orionis - ξ Orionis",
        distance:    "~720 light-years",
        age:         "10 – 400 million years",
        class:       "Blue-white dwarf (B3IV)",
        colour:      "Blue-white",
        temperature: "23,300 K",
      },
    },

    {
      id:          "orionis",
      starId:      "d",
      title:       "ν Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "ν Orionis",
        distance:    "~600 light-years",
        age:         "10 – 400 million years",
        class:       "Blue-white dwarf (B3IV)",
        colour:      "Blue-white",
        temperature: "23,300 K",
      },
    },

    {
      id:          "orionis",
      starId:      "e",
      title:       "μ Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "μ Orionis",
        distance:    "~150 light-years",
        age:         "300 million – 3 billion years",
        class:       "White dwarf (A1Vm+F2V)",
        colour:      "White",
        temperature: "9,700 K",
      },
    },

    {
      id:          "betelgeuse",
      starId:      "f",
      title:       "Betelgeuse",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Betelgeuse",
        designation: "Alpha Orionis - α Orionis",
        distance:    "~442 – 570 light-years",
        age:         "8 – 30 million years",
        class:       "Red supergiant (M1-M2Ia-Iab)",
        colour:      "Deep orange-red",
        temperature: "3,600 K",
      },
    },

    {
      id:          "meissa",
      starId:      "g",
      title:       "Meissa",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Meissa",
        designation: "Lambda Orionis - λ Orionis",
        distance:    "~927 – 1348 light-years",
        age:         "5 – 30 million years",
        class:       "Blue supergiant (O8IIIf+B0.5V)",
        colour:      "Blue",
        temperature: "37,800 K",
      },
    },

    {
      id:          "bellatrix",
      starId:      "h",
      title:       "Bellatrix",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Bellatrix",
        designation: "Gamma Orionis - γ Orionis",
        distance:    "~250 light-years",
        age:         "5 – 30 million years",
        class:       "Blue-white supergiant (B2III)",
        colour:      "Blue-white",
        temperature: "25,600 K",
      },
    },

    {
      id:          "3-orionis",
      starId:      "i",
      title:       "π3 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "π3 Orionis",
        distance:    "~26 light-years",
        age:         "2 – 7 billion years",
        class:       "Yellow-white dwarf (F6V)",
        colour:      "Yellow-white",
        temperature: "6,500 K",
      },
    },

    {
      id:          "alnitak",
      starId:      "j",
      title:       "Alnitak",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Alnitak",
        designation: "Zeta Orionis - ζ Orionis",
        distance:    "~643 – 861 light-years",
        age:         "5 – 30 million years",
        class:       "Blue supergiant (O9.7Ib+B0III)",
        colour:      "Blue",
        temperature: "30,000 K",
      },
    },

    {
      id:          "alnilam",
      starId:      "k",
      title:       "Alnilam",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Alnilam",
        designation: "Epsilon Orionis - ε Orionis",
        distance:    "~1553 – 2718 light-years",
        age:         "5 – 30 million years",
        class:       "Blue-white supergiant (B0Ia)",
        colour:      "Blue-white",
        temperature: "30,000 K",
      },
    },

    {
      id:          "mintaka",
      starId:      "l",
      title:       "Mintaka",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Mintaka",
        designation: "Delta Orionis - δ Orionis",
        distance:    "~617 – 790 light-years",
        age:         "5 – 30 million years",
        class:       "Blue supergiant (O9.5IINwk)",
        colour:      "Blue",
        temperature: "30,000 K",
      },
    },

    {
      id:          "saiph",
      starId:      "m",
      title:       "Saiph",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Saiph",
        designation: "Kappa Orionis - κ Orionis",
        distance:    "~650 light-years",
        age:         "5 – 30 million years",
        class:       "Blue-white supergiant (B0.5Ia)",
        colour:      "Blue-white",
        temperature: "28,900 K",
      },
    },

    {
      id:          "rigel",
      starId:      "n",
      title:       "Rigel",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "Rigel",
        designation: "Beta Orionis - β Orionis",
        distance:    "~860 light-years",
        age:         "5 – 30 million years",
        class:       "Blue-white supergiant (B8Ia)",
        colour:      "Blue-white",
        temperature: "12,200 K",
      },
    },

    {
      id:          "2-orionis",
      starId:      "o",
      title:       "π2 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "π2 Orionis",
        distance:    "~220 light-years",
        age:         "300 million – 3 billion years",
        class:       "White dwarf (A1Vn)",
        colour:      "White",
        temperature: "9,700 K",
      },
    },

    {
      id:          "1-orionis",
      starId:      "p",
      title:       "π1 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name:        "π1 Orionis",
        distance:    "~120 light-years",
        age:         "300 million – 3 billion years",
        class:       "White dwarf (A0Va_lB)",
        colour:      "White",
        temperature: "10,000 K",
      },
    },

    {
      id:          "4-orionis",
      starId:      "q",
      title:       "π4 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name: "π4 Orionis",
      },
    },

    {
      id:          "5-orionis",
      starId:      "r",
      title:       "π5 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name: "π5 Orionis",
      },
    },

    {
      id:          "6-orionis",
      starId:      "s",
      title:       "π6 Orionis",
      description: "",   // TODO: add a brief description
      starData: {
        name: "π6 Orionis",
      },
    }
  ],

// ── Project view ───────────────────────────────────────────────────────────
  projectSections: [
    {
      id:     "about",
      starId: "b",
      title:  "About",
      body: [
        "Alnitak, Alnilam, and Mintaka form the unmistakable three-star belt that has guided sailors and travellers for millennia. They sit roughly 800 to 1,300 light-years from Earth, yet appear almost identical in brightness from our vantage point.",
        "The alignment is a coincidence of perspective — in three-dimensional space the three stars are nowhere near each other. Alnilam, the middle star, is the most luminous of the trio, radiating roughly 375,000 times the energy of our Sun.",
      ],
    },
    {
      id:     "plan9",
      starId: "d",
      title:  "Plan 9",
      body: [
        "Visible to the naked eye as a fuzzy patch below the belt, M42 is a stellar nursery roughly 1,344 light-years away and over 24 light-years across. It is one of the most scrutinised objects in the night sky.",
        "Within its glowing clouds, protostars are collapsing under gravity and igniting nuclear fusion for the very first time. The Trapezium cluster at its heart provides the ultraviolet radiation that excites the surrounding hydrogen gas into a luminous pink and violet haze.",
        "Long-exposure photography reveals dramatic pillars of dust and gas sculpted by stellar winds — cold dark cocoons inside which new solar systems are assembling themselves even now.",
      ],
    },
    {
      id:     "distributed",
      starId: "c",
      title:  "Distributed Systems",
      body: [
        "Betelgeuse marks Orion's right shoulder and is one of the largest stars visible to the naked eye — a red supergiant so enormous that if placed at the centre of our Solar System, its surface would extend beyond the orbit of Jupiter.",
        "Rigel anchors the opposite corner as a blue-white supergiant shining approximately 120,000 times brighter than the Sun. The contrast between their colours — deep amber versus icy blue — is striking even without optical aids.",
        "Betelgeuse has been closely monitored for decades because it is expected to explode as a supernova within the next 100,000 years. In cosmic terms, that is imminent.",
      ],
    },
    {
      id:     "code",
      starId: "g",
      title:  "Code",
      body: [
        "The Orion myth predates the Greeks. Mesopotamian astronomers recognised the same asterism as the great hero Gilgamesh, hunter of the bull of heaven, thousands of years before Homer or Hesiod set anything to parchment.",
        "In Egyptian tradition the stars aligned with Osiris, god of the afterlife, and the three belt stars influenced the placement of the Giza pyramids — a claim that remains debated but captures the imagination regardless.",
        "Across cultures as distant as the Lakota Sioux, the Māori of New Zealand, and the ancient Chinese astronomers, this constellation consistently appears as a figure of power, hunting, or celestial navigation.",
      ],
    },
    {
      id:     "paper",
      starId: "a",
      title:  "Research Paper",
      body:   [],
      papers: [
        {
          id:          "orion-paper",
          title:       "Orion",
          description: "Click View to read the research paper inline.",
          pdfPath:     "/Orion.pdf",
        },
      ],
    },
  ],
};


export default orion;
