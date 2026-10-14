import { Nav } from "./components/Nav/Nav";
import { Hero } from "./components/Hero/Hero";
import { Skills } from "./components/Skills/Skills";

// Sections mount here, in the agreed order, as their tickets land (MP-4
// About .. MP-10 Contact) — see docs/architecture/rules.md. `pt-16` on
// <main> offsets Nav's fixed 64px header so content doesn't render
// underneath it.
//
// NOTE for whoever merges this alongside MP-4 (About): this branch
// predates MP-4 merging (no Jira dependency between sibling section
// tickets, only on MP-1), so <About /> isn't composed here yet. Reordering
// to <Hero /><About /><Skills /> once MP-4 lands is a one-line fix.
export default function App() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <Skills />
        {/* About, Experience, Projects, OtherExperience,
            EducationCertifications, Contact land here via MP-4/MP-6..MP-10. */}
      </main>
    </>
  );
}
