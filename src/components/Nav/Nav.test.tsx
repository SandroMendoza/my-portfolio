import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Nav } from "./Nav";

const SHORT_LABELS = [
  "About",
  "Skills",
  "Experience",
  "Projects",
  "Other Experience",
  "Education",
  "Contact",
];

const SECTION_IDS = [
  "about",
  "skills",
  "experience",
  "projects",
  "other-experience",
  "education",
  "contact",
];

describe("Nav", () => {
  it("renders the wordmark linking to #top", () => {
    render(<Nav />);
    const wordmark = screen.getByRole("link", { name: "Sandro Mendoza" });
    expect(wordmark).toHaveAttribute("href", "#top");
  });

  it("renders a landmark nav with all 7 jump links, short labels, correct hrefs", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation", { name: "Section" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(SHORT_LABELS.length);
    links.forEach((link, index) => {
      expect(link).toHaveTextContent(SHORT_LABELS[index]);
      expect(link).toHaveAttribute("href", `#${SECTION_IDS[index]}`);
    });
  });

  it("renders a compact Download Resume button pointing at the resume PDF", () => {
    render(<Nav />);
    const resumeLinks = screen.getAllByRole("link", {
      name: "Download Sandro Mendoza's resume (PDF)",
    });
    expect(resumeLinks[0]).toHaveAttribute(
      "href",
      "/resume/Sandro-Mendoza-Resume.pdf",
    );
    expect(resumeLinks[0]).toHaveAttribute("download");
  });

  it("hamburger button starts closed and toggles the mobile overlay open", () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: "Open menu" });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-controls", "mobile-nav-overlay");

    fireEvent.click(hamburger);

    const closeButton = screen.getByRole("button", { name: "Close menu" });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    const overlay = document.getElementById("mobile-nav-overlay");
    expect(overlay).not.toBeNull();
    // Mobile overlay keeps the full label, unlike the inline bar's short one.
    expect(
      within(overlay as HTMLElement).getByText("Education & Certifications"),
    ).toBeInTheDocument();
  });

  it("Escape closes the overlay and returns focus to the hamburger button", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.getElementById("mobile-nav-overlay")).not.toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(document.getElementById("mobile-nav-overlay")).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
  });

  it("clicking an overlay link closes the menu", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const overlay = document.getElementById(
      "mobile-nav-overlay",
    ) as HTMLElement;
    fireEvent.click(within(overlay).getByText("Contact"));

    expect(document.getElementById("mobile-nav-overlay")).toBeNull();
  });

  it("hamburger button meets the 44x44px minimum tap target via utility classes", () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: "Open menu" });
    expect(hamburger).toHaveClass("min-h-[44px]");
    expect(hamburger).toHaveClass("min-w-[44px]");
  });

  // MP-12/MP-13 regression coverage. jsdom doesn't do real layout, so these
  // assert the utility classes the live-browser fix (verified with Playwright
  // at 768-1440px, see PR #8) depends on, rather than actual pixel wrapping —
  // that's Potchie's browser-based QA territory per ADR 0005.
  describe("MP-12/MP-13: no text-wrap and 44px-tall tap targets on the inline bar", () => {
    it("wordmark never wraps and meets the 44px height minimum", () => {
      render(<Nav />);
      const wordmark = screen.getByRole("link", { name: "Sandro Mendoza" });
      expect(wordmark).toHaveClass("whitespace-nowrap");
      expect(wordmark).toHaveClass("min-h-[44px]");
      expect(wordmark).toHaveClass("items-center");
    });

    it("every inline jump link never wraps and meets the 44px height minimum", () => {
      render(<Nav />);
      const nav = screen.getByRole("navigation", { name: "Section" });
      within(nav)
        .getAllByRole("link")
        .forEach((link) => {
          expect(link).toHaveClass("whitespace-nowrap");
          expect(link).toHaveClass("min-h-[44px]");
          expect(link).toHaveClass("items-center");
        });
    });

    it("the jump-link row tightens its gap below `lg`, where all 7 labels don't otherwise fit on one line", () => {
      render(<Nav />);
      const nav = screen.getByRole("navigation", { name: "Section" });
      const list = within(nav).getAllByRole("link")[0].closest("ul");
      expect(list).toHaveClass("gap-2");
      expect(list).toHaveClass("lg:gap-6");
    });

    it("the compact Download Resume button keeps Button/Primary's full spec'd anatomy (not shrunk)", () => {
      render(<Nav />);
      const resumeLinks = screen.getAllByRole("link", {
        name: "Download Sandro Mendoza's resume (PDF)",
      });
      // The inline-bar instance (first) must rely on Button's own base
      // min-h-[48px]/px-6 rather than a shrunk override — MP-12's earlier fix
      // attempt overrode these to min-h-[44px]/px-4, which both silently
      // conflicted with Button's base classes and violated the Button/Primary
      // anatomy spec'd in MP-1.
      expect(resumeLinks[0]).toHaveClass("min-h-[48px]");
      expect(resumeLinks[0]).toHaveClass("px-6");
      expect(resumeLinks[0]).not.toHaveClass("min-h-[44px]");
      expect(resumeLinks[0]).not.toHaveClass("px-4");
    });
  });
});
