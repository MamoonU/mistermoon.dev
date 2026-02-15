import type { ConstellationData } from "./types";

// ─── Orion ────────────────────────────────────────────────────────────────────

// Star IDs and rough correspondences:
// a → 
// b →
// c → 
// d → Phi-2 Orionis (171, 189)

const orion: ConstellationData = {
  id:          "orion",
  name:        "Orion",
  description: "The Hunter",
  hasProject:  true,

  // ── Stars ──────────────────────────────────────────────────────────────────
  stars: [
    { id: "a", x: 180, y:  72, label: "χ2 Orionis", size: 18 },
    { id: "b", x: 252, y:  54, label: "χ1 Orionis", size: 18 },
    { id: "c", x: 144, y: 198, label: "ξ Orionis",  size: 18 },
    { id: "d", x: 171, y: 189, label: "ν Orionis",  size: 18 },
    { id: "e", x: 198, y: 306, label: "μ Orionis",  size: 18 },
    { id: "f", x: 252, y: 360, label: "Betelgeuse", size: 45 },
    { id: "g", x: 360, y: 306, label: "Meissa",     size: 27 },
    { id: "h", x: 450, y: 378, label: "Bellatrix",  size: 36 },
    { id: "i", x: 666, y: 369, label: "π3 Orionis", size: 27 },
    { id: "j", x: 324, y: 612, label: "Alnitak",    size: 36 },
    { id: "k", x: 360, y: 594, label: "Alnilam",    size: 36 },
    { id: "l", x: 396, y: 567, label: "Mintaka",    size: 36 },
    { id: "m", x: 279, y: 756, label: "Saiph",      size: 27 },
    { id: "n", x: 486, y: 729, label: "Rigel",      size: 45 },
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
      id:     "betelgeuse",
      starId: "f",
      title:  "Betelgeuse",
      starData: {
        name:        "Betelgeuse",
        designation: "α Orionis",
        distance:    "700 light-years",
        age:         "8 - 14 million years",
        class:       "Red supergiant (M1 - M2)",
        colour:      "Deep orange-red",
        temperature: "3,500 K",
        luminosity:  "~100,000 × Sun",
        info:        "One of the largest and most luminous stars visible to the naked eye. So enormous that if placed at the centre of our Solar System, its surface would engulf every planet out to Jupiter. It is a semi-regular variable star, pulsating in brightness on cycles of roughly 400 days. Betelgeuse is expected to end its life as a supernova within the next 100,000 years — cosmically imminent.",
      },
    },
    {
      id:     "rigel",
      starId: "n",
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
      id:     "belt",
      starId: "k",
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
      id:     "bellatrix",
      starId: "h",
      title:  "Bellatrix",
      starData: {
        name:        "Bellatrix",
        designation: "γ Orionis",
        distance:    "250 light-years",
        class:       "Blue-white giant (B2 III)",
        colour:      "Blue-white",
        temperature: "22,000 K",
        info:        "The name Bellatrix comes from the Latin for 'female warrior'. It marks Orion's right shoulder and is the third-brightest star in the constellation. Though far less massive than Betelgeuse or Rigel, its intense surface temperature gives it a distinctive electric-blue tint that complements the warmer colours elsewhere in the constellation.",
      },
    },
    {
      id:     "saiph",
      starId: "m",
      title:  "Saiph",
      starData: {
        name:        "Saiph",
        designation: "κ Orionis",
        distance:    "720 light-years",
        class:       "Blue supergiant (B0.5 Ia)",
        colour:      "Blue-white",
        temperature: "26,500 K",
        luminosity:  "~57,000 × Sun",
        info:        "Marking Orion's right knee (or foot in some traditions), Saiph appears dimmer than Rigel to the naked eye despite having a similar intrinsic luminosity — the difference is mostly dust absorption along its line of sight. In Arabic, saiph means 'sword of the giant', though the name is now officially assigned to the knee position.",
      },
    },
    {
      id:     "meissa",
      starId: "g",
      title:  "Meissa",
      starData: {
        name:        "Meissa",
        designation: "λ Orionis",
        distance:    "1,100 light-years",
        class:       "O8 III giant + companion",
        info:        "Meissa marks the head of Orion. Its name derives from the Arabic Al-Maisan, 'the shining one'. It is actually a double star — a hot O-class giant with a close spectroscopic companion — and sits at the centre of Collinder 69, a sparse open cluster of young stars that formed together from the same molecular cloud approximately 4–5 million years ago.",
      },
    },
    {
      id:     "random",
      starId: "a",
      title:  "Notable Stars",
      starData: {
        name:      "Orion Nebula",
        designation: "Messier 42 (M42)",
        distance:    "1,344 light-years",
        size:        "24 light-years across",
    }},
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