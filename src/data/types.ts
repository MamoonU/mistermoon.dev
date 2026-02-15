// ─── Core primitives ──────────────────────────────────────────────────────────

export interface Star {   //svg data
  id:     string;
  x:      number;
  y:      number;
  label:  string;  // fallback hover text when no section title is found
  size:   number;
}

// [x1, y1, x2, y2]
export type StarLine = [number, number, number, number];

// ─── Star data card (constellation view) ─────────────────────────────────────
//
// Using a flexible key-value map so each star can have its own field set.
// Values may be strings or numbers.  Common fields: name, distance, class,
// colour, temperature, info — but not enforced by the type.
//
export interface StarData {
  [field: string]: string | number;
}

// ─── Sections ─────────────────────────────────────────────────────────────────

export interface ProjectPaper {
  id:          string;
  title:       string;
  description: string;
  pdfPath:     string;
}

export interface ConstellationSection {
  id:      string;
  starId?: string;    // which star's click navigates here
  title:   string;    // displayed as section heading
  starData: StarData;
}

export interface ProjectSection {
  id:      string;
  starId?: string;
  title:   string;
  body:    string[];
  papers?: ProjectPaper[];  // if present, PaperRow components are rendered after body
}

// ─── Top-level constellation data ─────────────────────────────────────────────

export interface ConstellationData {
  id:          string;
  name:        string;
  description: string;   // one-line used on index / home pages
  hasProject:  boolean;

  stars: Star[];
  lines: StarLine[];

  // Constellation view — one section per star (or group of stars)
  constellationSections: ConstellationSection[];

  // Project view — narrative sections about the software project
  projectSections: ProjectSection[];
}












