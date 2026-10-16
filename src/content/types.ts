// Typed shapes for the portfolio's content. See
// docs/architecture/decisions/0004-content-as-typed-data-modules.md — content
// is static, typed data checked into the repo, not a CMS or database.
//
// Rose fills in the matching data in `resume.ts` from the approved copy in
// the Jira tickets / Notion Product Overview page. Keep these interfaces in
// sync with that copy; don't let components read anything not typed here.

export interface HeroContent {
  name: string;
  headline: string;
  resumeFileHref: string; // path under /resume to the static PDF asset
}

export interface AboutContent {
  body: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceEntry {
  title: string;
  organization: string;
  dateRange: string;
  highlights: string[];
}

export type ProjectLink =
  | { kind: "linked"; href: string }
  | { kind: "description-only" };

export interface ProjectEntry {
  name: string;
  // Added in MP-7: spec §7's card anatomy calls for a "Meta line ...
  // company, for the two FFUF projects only (KC Art Gallery has none)" —
  // this field wasn't in the original scaffolded shape. Optional since KC
  // Art Gallery (a personal project) genuinely has none; components render
  // the meta line only when it's present.
  organization?: string;
  description: string;
  techStack: string[];
  link: ProjectLink;
}

export interface OtherExperienceEntry {
  title: string;
  organization: string;
  dateRange: string;
}

export interface EducationEntry {
  credential: string;
  institution: string;
  dateRange: string;
}

export interface ContactContent {
  email: string;
}

export interface ResumeContent {
  hero: HeroContent;
  about: AboutContent;
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  otherExperience: OtherExperienceEntry[];
  education: EducationEntry[];
  contact: ContactContent;
}
