import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { CloseIcon, DownloadIcon, MenuIcon } from "../ui/icons";
import { resumeContent } from "../../content/resume";

// Sticky navigation header (design/screen-specs.md §2). Desktop/tablet
// (>=768px) shows the wordmark, 7 jump links, and a compact Download Resume
// button; mobile (<768px) collapses the links/button into a hamburger menu.
//
// NOTE: 768px is the spec's own explicit breakpoint for this bar (both the
// MP-2 ticket AC and screen-specs.md §2 say "Desktop/tablet (>=768px)" /
// "Mobile (<768px)"), which doesn't match MP-1's configured `md` (640px) /
// `lg` (1024px) tokens. Implemented literally via an arbitrary Tailwind
// breakpoint (`min-[768px]:`) rather than silently snapping it to `md` —
// flagging for Dragon/KC to confirm whether that's intentional.
//
// NOTE: the wordmark link and the "scrolled past Hero" shadow both target an
// element with id="top". That id doesn't exist until MP-3 (Hero) adds it to
// the Hero section's wrapper — until then both degrade gracefully (wordmark
// click is a no-op anchor, shadow never triggers).

interface NavLink {
  id: string;
  label: string; // shown in the inline desktop/tablet bar
  mobileLabel: string; // spec: keep the full label in the mobile overlay
}

const HERO_ID = "top";

const NAV_LINKS: NavLink[] = [
  { id: "about", label: "About", mobileLabel: "About" },
  { id: "skills", label: "Skills", mobileLabel: "Skills" },
  { id: "experience", label: "Experience", mobileLabel: "Experience" },
  { id: "projects", label: "Projects", mobileLabel: "Projects" },
  {
    id: "other-experience",
    label: "Other Experience",
    mobileLabel: "Other Experience",
  },
  {
    id: "education",
    label: "Education",
    mobileLabel: "Education & Certifications",
  },
  { id: "contact", label: "Contact", mobileLabel: "Contact" },
];

const RESUME_ARIA_LABEL = "Download Sandro Mendoza's resume (PDF)";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Resting shadow once the page scrolls past the Hero section (spec §2).
  useEffect(() => {
    const heroEl = document.getElementById(HERO_ID);
    if (!heroEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolledPastHero(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // Scroll-spy: mark whichever section is in view as the active nav link.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Escape closes the overlay and returns focus to the hamburger button;
  // Tab/Shift+Tab is trapped inside the overlay while it's open.
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (event.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Move focus into the overlay as soon as it opens.
  useEffect(() => {
    if (!isMenuOpen) return;
    const firstLink = overlayRef.current?.querySelector<HTMLElement>(
      "a[href]",
    );
    firstLink?.focus();
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-surface-base transition-shadow motion-reduce:transition-none ${
          isScrolledPastHero ? "shadow-resting" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-6 md:px-8 lg:px-16">
          <a
            href={`#${HERO_ID}`}
            className="flex min-h-[44px] items-center whitespace-nowrap text-body font-semibold text-text-primary hover:text-accent"
          >
            Sandro Mendoza
          </a>

          <nav aria-label="Section" className="hidden min-[768px]:block">
            {/* MP-12 fix: gap tightens (and link text drops to the smaller
                "meta" token) only below `lg`, where all 7 full labels plus
                the wordmark and button don't otherwise fit on one line
                without wrapping (confirmed at 768-830px). At `lg`+ this
                reverts to the original roomier spacing/size. */}
            <ul className="flex items-center gap-2 lg:gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={activeId === link.id ? "true" : undefined}
                    className="flex min-h-[44px] items-center whitespace-nowrap text-meta font-medium text-text-secondary hover:text-accent aria-[current=true]:text-accent aria-[current=true]:underline lg:text-meta-lg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden min-[768px]:block">
            {/* Full Button/Primary anatomy (48px min height, 24px horizontal
                padding — spec §1) is kept as-is here; "compact" only means
                hiding the label below `lg`, not shrinking the button itself. */}
            <Button
              as="a"
              variant="primary"
              href={resumeContent.hero.resumeFileHref}
              download
              icon={<DownloadIcon className="h-4 w-4" />}
              aria-label={RESUME_ARIA_LABEL}
            >
              <span className="hidden lg:inline">Download Resume</span>
            </Button>
          </div>

          <button
            ref={hamburgerRef}
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-text-primary min-[768px]:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-overlay"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          id="mobile-nav-overlay"
          ref={overlayRef}
          className="fixed inset-0 z-40 flex flex-col gap-8 overflow-y-auto bg-surface-base px-6 pb-12 pt-24 min-[768px]:hidden"
        >
          <ul className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={activeId === link.id ? "true" : undefined}
                  onClick={closeMenu}
                  className="flex min-h-[44px] items-center text-h3 font-semibold text-text-primary aria-[current=true]:text-accent"
                >
                  {link.mobileLabel}
                </a>
              </li>
            ))}
          </ul>
          <Button
            as="a"
            variant="primary"
            href={resumeContent.hero.resumeFileHref}
            download
            icon={<DownloadIcon className="h-5 w-5" />}
            onClick={closeMenu}
            aria-label={RESUME_ARIA_LABEL}
            className="mt-auto"
          >
            Download Resume
          </Button>
        </div>
      )}
    </>
  );
}
