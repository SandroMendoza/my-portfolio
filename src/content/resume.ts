import type { ResumeContent } from "./types";

// Stub only — Rose fills this in with the approved copy from the Jira
// tickets (MP-2..MP-10) / Notion Product Overview page ("Final copy" section).
// Keep this the single source of truth; components must import from here,
// never hardcode resume content inline in JSX (docs/architecture/rules.md).
export const resumeContent: ResumeContent = {
  hero: {
    name: "",
    headline: "",
    resumeFileHref: "/resume/Sandro-Mendoza-Resume.pdf",
  },
  about: {
    body: "",
  },
  skills: [],
  experience: [],
  projects: [],
  otherExperience: [],
  education: [],
  contact: {
    email: "",
  },
};
