import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Projects } from "./Projects";
import { resumeContent } from "../../content/resume";

describe("Projects", () => {
  it("renders an H2 'Projects' heading and 3 H3 project titles, KC Art Gallery first", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" }),
    ).toBeInTheDocument();
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      "KC Art Gallery",
      "Document Signing Service",
      "Legacy Data Synchronization",
    ]);
  });

  describe("KC Art Gallery card (linked)", () => {
    it("is a single enclosing link to the GitHub repo, opening in a new tab", () => {
      render(<Projects />);
      const link = screen.getByRole("link", {
        name: "KC Art Gallery — View on GitHub, opens in a new tab",
      });
      expect(link).toHaveAttribute(
        "href",
        "https://github.com/SandroMendoza/kc-art-gallery",
      );
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("has no nested link or button inside it (single enclosing <a> only)", () => {
      render(<Projects />);
      const link = screen.getByRole("link", {
        name: "KC Art Gallery — View on GitHub, opens in a new tab",
      });
      expect(within(link).queryAllByRole("link")).toHaveLength(0);
      expect(within(link).queryAllByRole("button")).toHaveLength(0);
    });

    it("renders the exact description and tech chips", () => {
      render(<Projects />);
      expect(
        screen.getByText(
          "A Next.js art gallery web app built with React, Tailwind CSS, and Prisma ORM.",
        ),
      ).toBeInTheDocument();
      ["Next.js", "React", "Tailwind CSS", "Prisma ORM"].forEach((tech) => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
    });

    it("does not render the 'no public link' caption (it has a link)", () => {
      render(<Projects />);
      const link = screen.getByRole("link", {
        name: "KC Art Gallery — View on GitHub, opens in a new tab",
      });
      expect(
        within(link).queryByText(
          "(No public link — private work project.)",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("static cards (description-only)", () => {
    it.each([
      ["Document Signing Service", "FFUF Manila"],
      ["Legacy Data Synchronization", "FFUF Manila"],
    ])("%s is plain content: no <a>, <button>, or role=button", (name) => {
      render(<Projects />);
      const heading = screen.getByRole("heading", { level: 3, name });
      const card = heading.closest("div") as HTMLElement;
      expect(within(card).queryAllByRole("link")).toHaveLength(0);
      expect(within(card).queryAllByRole("button")).toHaveLength(0);
      expect(card.tagName).toBe("DIV");
      expect(card).not.toHaveAttribute("role", "button");
    });

    it("both static cards show the exact approved copy ending in the no-public-link caption", () => {
      render(<Projects />);
      resumeContent.projects
        .filter((p) => p.link.kind === "description-only")
        .forEach((project) => {
          expect(screen.getByText(project.description)).toBeInTheDocument();
        });
      expect(
        screen.getAllByText("(No public link — private work project.)"),
      ).toHaveLength(2);
    });

    it("renders each static card's organization meta line and tech chips", () => {
      render(<Projects />);
      expect(screen.getAllByText("FFUF Manila")).toHaveLength(2);
      // Both static cards share Kotlin/Spring Boot/Hexagonal Architecture;
      // only Document Signing Service also has Apache PDFBox.
      expect(screen.getAllByText("Hexagonal Architecture")).toHaveLength(2);
      expect(screen.getByText("Apache PDFBox")).toBeInTheDocument();
    });

    it("static cards have no hover-lift / pointer-cursor classes", () => {
      render(<Projects />);
      const heading = screen.getByRole("heading", {
        level: 3,
        name: "Document Signing Service",
      });
      const card = heading.closest("div") as HTMLElement;
      expect(card).not.toHaveClass("cursor-pointer");
      expect(card.className).not.toMatch(/hover:/);
    });
  });
});
