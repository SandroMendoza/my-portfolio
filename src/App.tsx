import { Nav } from "./components/Nav/Nav";

// Sections mount here, in the agreed order, as their tickets land (MP-3 Hero
// .. MP-10 Contact) — see docs/architecture/rules.md. `pt-16` on <main>
// offsets Nav's fixed 64px header so content doesn't render underneath it.
export default function App() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero, About, Skills, Experience, Projects, OtherExperience,
            EducationCertifications, Contact land here via MP-3..MP-10. */}
      </main>
    </>
  );
}
