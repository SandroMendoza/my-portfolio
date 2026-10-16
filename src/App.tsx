import { Nav } from "./components/Nav/Nav";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Skills } from "./components/Skills/Skills";
import { Experience } from "./components/Experience/Experience";
import { Projects } from "./components/Projects/Projects";

// Sections mount here, in the agreed order, as their tickets land (MP-8
// OtherExperience .. MP-10 Contact) — see docs/architecture/rules.md.
// `pt-16` on <main> offsets Nav's fixed 64px header so content doesn't
// render underneath it.
export default function App() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        {/* OtherExperience, EducationCertifications, Contact land here via
            MP-8..MP-10. */}
      </main>
    </>
  );
}
