import type { ResumeContent } from "./types";

// Stub only — Rose fills this in with the approved copy from the Jira
// tickets (MP-2..MP-10) / Notion Product Overview page ("Final copy" section).
// Keep this the single source of truth; components must import from here,
// never hardcode resume content inline in JSX (docs/architecture/rules.md).
export const resumeContent: ResumeContent = {
  // Hero (MP-3): approved copy is "Sandro Mendoza — Backend Developer ·
  // Kotlin & Spring Boot", split at the em dash into name (H1) + headline
  // (subheading) per KC's decision (screen-specs.md §3) — same approved
  // words, no new copy added.
  hero: {
    name: "Sandro Mendoza",
    headline: "Backend Developer · Kotlin & Spring Boot",
    resumeFileHref: "/resume/Sandro-Mendoza-Resume.pdf",
  },
  about: {
    body: "",
  },
  // Skills (MP-5): exact verbatim categories/items from the Product
  // Overview (design/screen-specs.md §5 "Copy (exact, verbatim)"). Order
  // matters — matches the approved copy and the Jira AC order.
  skills: [
    { category: "Backend", items: ["Kotlin", "Spring Boot", "Java", "REST APIs"] },
    {
      category: "Architecture",
      items: [
        "Hexagonal Architecture",
        "Domain-Driven Design (DDD)",
        "Clean Architecture",
      ],
    },
    { category: "Testing", items: ["JUnit5", "MockK", "Parameterized Testing"] },
    { category: "Data", items: ["MySQL", "MongoDB", "SQL"] },
    { category: "Tools", items: ["Git", "Gradle", "Apache PDFBox", "Docker"] },
  ],
  experience: [],
  projects: [],
  otherExperience: [],
  education: [],
  // Filled in now (MP-3) rather than waiting for the Contact ticket (MP-10):
  // Hero's resume-fallback message also needs this same approved address
  // (screen-specs.md §3 States), and ADR 0004 says content lives here once,
  // not duplicated/hardcoded per component.
  contact: {
    email: "sandro.p.mendoza@gmail.com",
  },
};
