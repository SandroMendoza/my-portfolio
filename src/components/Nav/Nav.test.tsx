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
});
