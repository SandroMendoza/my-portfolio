import { Nav } from "./components/Nav/Nav";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";

// Sections mount here, in the agreed order, as their tickets land (MP-5
// Skills .. MP-10 Contact) — see docs/architecture/rules.md. `pt-16` on
// <main> offsets Nav's fixed 64px header so content doesn't render
// underneath it.
//
// NOTE for whoever merges this alongside MP-5 (Skills): this branch
// predates MP-5 merging (no Jira dependency between sibling section
// tickets, only on MP-1), so <Skills /> isn't composed here yet.
// Reordering to <Hero /><About /><Skills /> once MP-5 lands is a one-line
// fix.
export default function App() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <About />
        {/* Skills, Experience, Projects, OtherExperience,
            EducationCertifications, Contact land here via MP-5..MP-10. */}
      </main>
    </>
  );
}
