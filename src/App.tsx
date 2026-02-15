import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import ProjectsIndex from "./pages/projectsindex";
import ConstellationsIndex from "./pages/constellationindex";
import ConstellationPage from "./pages/constellationpage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/projects" element={<ProjectsIndex />} />
        <Route
          path="/projects/:slug"
          element={<ConstellationPage view="project" />}
        />

        <Route path="/constellations" element={<ConstellationsIndex />} />
        <Route
          path="/constellations/:slug"
          element={<ConstellationPage view="constellation" />}
        />
      </Routes>
    </Layout>
  );
}