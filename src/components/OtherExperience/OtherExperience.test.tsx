import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { OtherExperience } from "./OtherExperience";
import { resumeContent } from "../../content/resume";

describe("OtherExperience", () => {
  it("renders an H2 'Other Experience' heading", () => {
    render(<OtherExperience />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Other Experience" }),
    ).toBeInTheDocument();
  });

  it("renders exactly 4 rows as a real <ul><li> list, in DOM order title -> company -> dates", () => {
    render(<OtherExperience />);
    const list = screen.getByRole("list");
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(4);

    rows.forEach((row, index) => {
      const entry = resumeContent.otherExperience[index];
      const text = row.textContent ?? "";
      expect(text.indexOf(entry.title)).toBeLessThan(
        text.indexOf(entry.organization),
      );
      expect(text.indexOf(entry.organization)).toBeLessThan(
        text.indexOf(entry.dateRange),
      );
    });
  });

  it("matches the exact approved copy for all 4 roles", () => {
    render(<OtherExperience />);
    const expected = [
      [
        "IT Staff / Customer Support Representative / QA & Audit",
        "DATAMODE",
        "Dec 2017–Oct 2022",
      ],
      [
        "Technical Support Representative (Chat Support)",
        "Transcom PH",
        "May–Jul 2017",
      ],
      ["Technical Support Representative", "SYKES INC.", "Jul–Dec 2016"],
      [
        "Technical Support Staff",
        "Puregold Pricelub Inc.",
        "Feb 2015–Jun 2016",
      ],
    ];
    expected.forEach(([title, organization, dateRange]) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(dateRange)).toBeInTheDocument();
      // "DATAMODE" etc. may only appear once; organization text asserted
      // via getAllByText since none repeat in this dataset.
      expect(screen.getByText(organization)).toBeInTheDocument();
    });
  });

  it("shows a divider on every row except the last", () => {
    render(<OtherExperience />);
    const rows = screen.getAllByRole("listitem");
    rows.slice(0, -1).forEach((row) => {
      expect(row).toHaveClass("border-b");
    });
    expect(rows[rows.length - 1]).not.toHaveClass("border-b");
  });
});
