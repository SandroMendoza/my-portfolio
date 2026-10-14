import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CondensedListRow } from "./CondensedListRow";

describe("CondensedListRow", () => {
  it("renders title, subtitle and date range in DOM order regardless of visual alignment", () => {
    render(
      <ul>
        <CondensedListRow
          title="IT Staff / Customer Support Representative / QA & Audit"
          subtitle="DATAMODE"
          dateRange="Dec 2017–Oct 2022"
        />
      </ul>,
    );
    const item = screen.getByRole("listitem");
    const text = item.textContent ?? "";
    expect(
      text.indexOf("IT Staff / Customer Support Representative / QA & Audit"),
    ).toBeLessThan(text.indexOf("DATAMODE"));
    expect(text.indexOf("DATAMODE")).toBeLessThan(
      text.indexOf("Dec 2017–Oct 2022"),
    );
  });

  it("shows a divider by default and omits it when isLast is set", () => {
    const { rerender } = render(
      <ul>
        <CondensedListRow title="A" subtitle="B" dateRange="C" />
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveClass("border-b");

    rerender(
      <ul>
        <CondensedListRow title="A" subtitle="B" dateRange="C" isLast />
      </ul>,
    );
    expect(screen.getByRole("listitem")).not.toHaveClass("border-b");
  });
});
