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
  // About (MP-4): exact verbatim copy from the Product Overview
  // (design/screen-specs.md §4 "Copy (exact, verbatim from Product Overview)").
  about: {
    body: "I'm a backend developer with hands-on experience building scalable systems using Kotlin, Spring Boot, and Domain-Driven Design. Before moving into software development, I spent several years in IT support, QA, and customer service — so reliability, attention to detail, and clear communication are second nature to me.",
  },
  skills: [],
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
