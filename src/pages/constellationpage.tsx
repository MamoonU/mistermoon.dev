import { useRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon  from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarMap  from "../components/starmap";
import PaperRow from "../components/papers";
import StarSectionRow from "../components/starsection";
import { useScrollLinked } from "../hooks/useScrollLinked";
import { getConstellation } from "../data";
import { COLORS } from "../theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  view: "project" | "constellation";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConstellationPage({ view }: Props) {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const location  = useLocation();
  
  // State for managing which constellation sections are open
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  
  // Track which sections were opened via SVG star clicks (these can be auto-closed)
  const [svgOpenedSections, setSvgOpenedSections] = useState<Set<string>>(new Set());

  const data = getConstellation(slug ?? "");
  if (!data) {
    return (
      <Box sx={{ p: 8, color: COLORS.textMuted, fontFamily: '"Georgia", serif' }}>
        Constellation not found.
      </Box>
    );
  }

  // ── Column positions ───────────────────────────────────────────────────────
  const SVG_RIGHT = "50%";
  const SVG_LEFT  = "0%";
  const targetLeft = view === "project" ? SVG_RIGHT : SVG_LEFT;

  const state      = location.state as any ?? {};
  const cameFrom   = state.cameFrom  as "project" | "constellation" | undefined;
  const returnTo   = state.returnTo  as string | undefined; // e.g. "/constellations"

  const startLeft = cameFrom === "project"      ? SVG_RIGHT
                  : cameFrom === "constellation" ? SVG_LEFT
                  : null; // null = no transition, render at target immediately

  // ── Refs ──────────────────────────────────────────────────────────────────
  const sectionRef     = useRef<HTMLDivElement>(null);
  const svgPanelRef    = useRef<HTMLDivElement>(null);   // translateY (scroll-linked)
  const svgWrapperRef  = useRef<HTMLDivElement>(null);   // left slide (view toggle)
  const buttonPanelRef = useRef<HTMLDivElement>(null);   // buttons that scroll with SVG
  const subsectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useScrollLinked(sectionRef, svgPanelRef);
  useScrollLinked(sectionRef, buttonPanelRef); // Apply same scroll-linked transform to buttons

  // Reset SVG-opened sections tracking when view changes
  useEffect(() => {
    setSvgOpenedSections(new Set());
  }, [view]);

  // ── SVG slide animation (reflow trick, StrictMode-safe) ───────────────────
  useLayoutEffect(() => {
    const el = svgWrapperRef.current;
    if (!el || !startLeft) return;

    el.style.transition = "none";
    el.style.left       = startLeft;
    el.getBoundingClientRect();           // force reflow so browser commits start position
    el.style.transition = "left 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.left       = targetLeft;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hash navigation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!location.hash) return;
    const id    = location.hash.slice(1);
    const timer = setTimeout(() => {
      const el = subsectionRefs.current[id] ?? document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
    return () => clearTimeout(timer);
  }, [location.hash]);

  // ── Star → section mapping ────────────────────────────────────────────────
  const { sectionTitles, handleStarClick } = useMemo(() => {
    const sections = view === "project"
      ? data.projectSections
      : data.constellationSections;

    const titles: Record<string, string> = {};
    
    // Build star ID → section title mapping, supporting multiple star IDs per section
    sections.forEach((s) => {
      if (!s.starId) return;
      
      if (Array.isArray(s.starId)) {
        // Multiple star IDs
        s.starId.forEach(id => {
          titles[id] = s.title;
        });
      } else {
        // Single star ID
        titles[s.starId] = s.title;
      }
    });

    const clickHandler = (starId: string) => {
      // Find section that maps to this star
      const section = sections.find((s) => {
        if (!s.starId) return false;
        if (Array.isArray(s.starId)) {
          return s.starId.includes(starId);
        }
        return s.starId === starId;
      });
      
      if (!section) return;
      
      // For constellation view, manage smart section opening/closing
      if (view === "constellation") {
        setOpenSections(prev => {
          const newSet = new Set(prev);
          
          // Close all sections that were opened by SVG (but keep manually opened ones)
          setSvgOpenedSections(currentSvgOpened => {
            currentSvgOpened.forEach(sectionId => {
              newSet.delete(sectionId);
            });
            
            // Add the new section
            newSet.add(section.id);
            
            // Track that this section was opened by SVG
            return new Set([section.id]);
          });
          
          return newSet;
        });
        
        // Wait for collapse animation, then scroll
        setTimeout(() => {
          const element = subsectionRefs.current[section.id];
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 350); // Slightly longer than collapse animation (300ms)
      } else {
        // For project view, just scroll
        subsectionRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    return { sectionTitles: titles, handleStarClick: clickHandler };
  }, [view, data]);

  // ── Toggle navigation ──────────────────────────────────────────────────────
  //
  // If we arrived here from the /constellations index (returnTo is set), the
  // back-toggle should return there, not to /constellations/:slug.
  // The SVGs on the index page are always in the left column, so no cameFrom
  // animation state is needed when returning to the index.
  //
  const toggle = () => {
    if (view === "project") {
      if (returnTo) {
        // Came from the index — go back to it
        navigate(returnTo);
      } else {
        // Came from /constellations/:slug — animate SVG back to left
        navigate(`/constellations/${slug}`, { state: { cameFrom: "project" } });
      }
    } else {
      navigate(`/projects/${slug}`, { state: { cameFrom: "constellation" } });
    }
  };

  const isProject = view === "project";

  // Text fade-in via CSS keyframe (no React state, no timing issues)
  const textFadeSx = startLeft
    ? {
        "@keyframes cpTextFade": { from: { opacity: 0 }, to: { opacity: 1 } },
        animation: "cpTextFade 0.3s ease 0.18s both",
      }
    : {};

  // Shared inner SVG panel (receives translateY from useScrollLinked)
  const svgInnerPanel = (
    <Box
      ref={svgPanelRef}
      sx={{
        height:         { xs: "min(55vh, 90vw)", md: "calc(100vh - 100px)" },
        position:       { xs: "relative", md: "absolute" },
        top:            { xs: "auto", md: "100px" }, // Offset by AppBar height
        left:           { xs: "auto", md: 0 },
        right:          { xs: "auto", md: 0 },
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        p:              { xs: "2vw 4vw", md: "2vh 2vw" },
        willChange:     "transform",
      }}
    >
      <StarMap
        stars={data.stars}
        lines={data.lines}
        sectionTitles={sectionTitles}
        onStarClick={handleStarClick}
        view={view}
      />
    </Box>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", color: COLORS.textPrimary }}>

      {/* ── Mobile ── */}
      <Box
        id={data.id}
        sx={{ 
          display: { xs: "flex", md: "none" }, 
          flexDirection: "column",
          pt: "64px", // Add padding for AppBar
        }}
      >
        <Box
          sx={{
            position:        "sticky",
            top:             0,
            zIndex:          5,
            alignSelf:       "flex-start",
            width:           "100%",
            backgroundColor: "rgba(8,8,14,0.92)",
            borderBottom:    `1px solid ${COLORS.border}`,
          }}
        >
          {svgInnerPanel}
        </Box>
        <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 5 }, ...textFadeSx }}>
          <MobileTextContent 
          view={view} 
          data={data} 
          subsectionRefs={subsectionRefs}
          openSections={openSections}
          setOpenSections={setOpenSections}
          svgOpenedSections={svgOpenedSections}
          setSvgOpenedSections={setSvgOpenedSections}
        />
        </Box>
      </Box>

      {/* ── Desktop ── */}
      <Box
        id={`${data.id}-desktop`}
        ref={sectionRef}
        sx={{ 
          display: { xs: "none", md: "flex" }, 
          position: "relative", 
          minHeight: "100vh",
          pt: "100px", // Add padding for AppBar
        }}
      >
        {/* Left text slot — project view */}
        <Box
          sx={{
            width:   "50%",
            px:      6,
            py:      10,
            display: isProject ? "block" : "none",
            ...textFadeSx,
          }}
        >
          <DesktopProjectContent data={data} subsectionRefs={subsectionRefs} />
        </Box>

        {/* Right text slot — constellation view */}
        <Box
          sx={{
            width:      "50%",
            marginLeft: "50%",
            px:         6,
            py:         10,
            display:    isProject ? "none" : "block",
            ...textFadeSx,
          }}
        >
          <DesktopConstellationContent 
            data={data} 
            subsectionRefs={subsectionRefs}
            openSections={openSections}
            setOpenSections={setOpenSections}
            svgOpenedSections={svgOpenedSections}
            setSvgOpenedSections={setSvgOpenedSections}
          />
        </Box>

        {/* SVG wrapper — slides between left:0% and left:50% */}
        <Box
          ref={svgWrapperRef}
          sx={{
            position:   "absolute",
            top:        0,
            left:       targetLeft,   // useLayoutEffect overrides this on animated transitions
            width:      "50%",
            height:     "100%",
            zIndex:     2,
            transition: "none",       // set by useLayoutEffect when animating
          }}
        >
          {svgInnerPanel}
          
          {/* Toggle button panel - scrolls with SVG */}
          {(isProject || data.hasProject) && (
            <Box
              ref={buttonPanelRef}
              sx={{
                position:   "absolute",
                top:        0,
                left:       0,
                right:      0,
                height:     "100vh",
                pointerEvents: "none", // Allow clicks to pass through
                willChange: "transform",
              }}
            >
              <Box
                onClick={toggle}
                role="button"
                aria-label={isProject ? "View constellation" : "View project"}
                sx={{
                  position:  "absolute",
                  top:       "calc(50% + 50px)", // Center of visible viewport (accounting for 100px AppBar)
                  transform: "translateY(-50%)",
                  ...(isProject
                    ? { left: 0, borderRadius: "0 4px 4px 0", borderLeft: "none" }
                    : { right: 0, borderRadius: "4px 0 0 4px", borderRight: "none" }),
                  zIndex:          1,
                  display:         "flex",
                  flexDirection:   "column",
                  alignItems:      "center",
                  justifyContent:  "center",
                  py:              2,
                  px:              0.75,
                  gap:             1,
                  cursor:          "pointer",
                  backgroundColor: "rgba(8,8,14,0.85)",
                  border:          `1px solid ${COLORS.border}`,
                  backdropFilter:  "blur(6px)",
                  transition:      "background-color 0.2s, border-color 0.2s",
                  pointerEvents:   "auto", // Re-enable clicks on button
                  "&:hover": {
                    backgroundColor: "rgba(12,12,22,0.95)",
                    borderColor:     COLORS.borderLight,
                    "& .tgl-icon":  { color: COLORS.gold },
                    "& .tgl-label": { color: COLORS.gold },
                  },
                }}
              >
                <Typography
                  className="tgl-label"
                  sx={{
                    fontFamily:      '"Georgia", serif',
                    fontSize:        "0.62rem",
                    letterSpacing:   "0.18em",
                    textTransform:   "uppercase",
                    color:           COLORS.textMuted,
                    writingMode:     "vertical-rl",
                    textOrientation: "mixed",
                    transform:       isProject ? "rotate(180deg)" : "none",
                    transition:      "color 0.2s",
                  }}
                >
                  {isProject ? "Constellation" : "Project"}
                </Typography>
                {isProject
                  ? <ChevronLeftIcon  className="tgl-icon" sx={{ fontSize: "1rem", color: COLORS.textMuted, transition: "color 0.2s" }} />
                  : <ChevronRightIcon className="tgl-icon" sx={{ fontSize: "1rem", color: COLORS.textMuted, transition: "color 0.2s" }} />
                }
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Mobile FAB toggle ── */}
      {(isProject || data.hasProject) && (
        <IconButton
          onClick={toggle}
          aria-label={isProject ? "View constellation" : "View project"}
          sx={{
            display:         { xs: "flex", md: "none" },
            position:        "fixed",
            bottom:          20,
            right:           20,
            zIndex:          200,
            backgroundColor: "rgba(8,8,14,0.9)",
            border:          `1px solid ${COLORS.borderLight}`,
            backdropFilter:  "blur(6px)",
            color:           COLORS.textMuted,
            p:               1.5,
            "&:hover": { color: COLORS.gold, borderColor: COLORS.gold },
          }}
        >
          {isProject ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      )}
    </Box>
  );
}

// ─── Desktop helpers ──────────────────────────────────────────────────────────

interface TextProps {
  data:           NonNullable<ReturnType<typeof getConstellation>>;
  subsectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

function DesktopProjectContent({ data, subsectionRefs }: TextProps) {
  return (
    <>
      <Typography variant="h2" sx={{ mb: 1.5 }}>{data.name}</Typography>
      <Typography variant="caption" sx={{ display: "block", mb: 8 }}>
        Click a star to navigate · Scroll to explore
      </Typography>
      {data.projectSections.map((section) => (
        <Box
          key={section.id}
          id={section.id}
          ref={(el) => { subsectionRefs.current[section.id] = el as HTMLDivElement | null; }}
          sx={{ mb: 12, scrollMarginTop: "60px" }}
        >
          <Typography variant="h5" sx={{ mb: 2.5, borderBottom: `1px solid ${COLORS.border}`, pb: 1.5 }}>
            {section.title}
          </Typography>
          {section.body.map((para, i) => (
            <Typography key={i} variant="body1" sx={{ mb: 2.5 }}>{para}</Typography>
          ))}
          {section.papers?.map((paper) => (
            <PaperRow key={paper.id} paper={paper} />
          ))}
        </Box>
      ))}
    </>
  );
}

function DesktopConstellationContent({ 
  data, 
  subsectionRefs, 
  openSections, 
  setOpenSections,
  svgOpenedSections,
  setSvgOpenedSections,
}: TextProps & { 
  openSections: Set<string>; 
  setOpenSections: React.Dispatch<React.SetStateAction<Set<string>>>; 
  svgOpenedSections: Set<string>;
  setSvgOpenedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const handleToggle = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        // Closing - remove from open sections
        newSet.delete(sectionId);
        
        // Also remove from SVG-opened tracking if it's there
        setSvgOpenedSections(svgPrev => {
          const newSvgSet = new Set(svgPrev);
          newSvgSet.delete(sectionId);
          return newSvgSet;
        });
      } else {
        // Opening manually - add to open sections but NOT to SVG-opened tracking
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Typography variant="h2" sx={{ mb: 1.5 }}>{data.name}</Typography>
      <Typography variant="caption" sx={{ display: "block", mb: 8 }}>
        Click a star to explore · Scroll to discover
      </Typography>
      {data.constellationSections.map((section) => (
        <Box
          key={section.id}
          id={section.id}
          ref={(el) => { subsectionRefs.current[section.id] = el as HTMLDivElement | null; }}
          sx={{ mb: 6, scrollMarginTop: "40px" }}
        >
          <StarSectionRow
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => handleToggle(section.id)}
          />
        </Box>
      ))}
    </>
  );
}

// ─── Mobile helper ────────────────────────────────────────────────────────────

interface MobileTextProps {
  view:           "project" | "constellation";
  data:           NonNullable<ReturnType<typeof getConstellation>>;
  subsectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  openSections:   Set<string>;
  setOpenSections: React.Dispatch<React.SetStateAction<Set<string>>>;
  svgOpenedSections: Set<string>;
  setSvgOpenedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function MobileTextContent({ 
  view, 
  data, 
  subsectionRefs, 
  openSections, 
  setOpenSections,
  svgOpenedSections,
  setSvgOpenedSections,
}: MobileTextProps) {
  const isProject = view === "project";
  
  const handleToggle = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        // Closing - remove from open sections
        newSet.delete(sectionId);
        
        // Also remove from SVG-opened tracking if it's there
        setSvgOpenedSections(svgPrev => {
          const newSvgSet = new Set(svgPrev);
          newSvgSet.delete(sectionId);
          return newSvgSet;
        });
      } else {
        // Opening manually - add to open sections but NOT to SVG-opened tracking
        newSet.add(sectionId);
      }
      return newSet;
    });
  };
  
  return (
    <>
      <Typography variant="h2" sx={{ mb: 1.5, fontSize: "2rem" }}>{data.name}</Typography>
      <Typography variant="caption" sx={{ display: "block", mb: 5 }}>
        {isProject ? "Tap a star to navigate · Scroll to explore" : "Tap a star to explore · Scroll to discover"}
      </Typography>
      {isProject
        ? data.projectSections.map((section) => (
            <Box
              key={section.id}
              id={section.id}
              ref={(el) => { subsectionRefs.current[section.id] = el as HTMLDivElement | null; }}
              sx={{ mb: 8, scrollMarginTop: "48px" }}
            >
              <Typography variant="h5" sx={{ mb: 2.5, borderBottom: `1px solid ${COLORS.border}`, pb: 1.5 }}>
                {section.title}
              </Typography>
              {section.body.map((para, i) => (
                <Typography key={i} variant="body1" sx={{ mb: 2.5 }}>{para}</Typography>
              ))}
              {section.papers?.map((paper) => (
                <PaperRow key={paper.id} paper={paper} />
              ))}
            </Box>
          ))
        : data.constellationSections.map((section) => (
            <Box
              key={section.id}
              id={section.id}
              ref={(el) => { subsectionRefs.current[section.id] = el as HTMLDivElement | null; }}
              sx={{ mb: 6, scrollMarginTop: "calc(min(55vh, 90vw) + 20px)" }} // Account for sticky SVG height
            >
              <StarSectionRow
                section={section}
                isOpen={openSections.has(section.id)}
                onToggle={() => handleToggle(section.id)}
              />
            </Box>
          ))
      }
    </>
  );
}