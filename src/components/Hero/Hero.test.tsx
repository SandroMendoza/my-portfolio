import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the name as the (sole, in this subtree) H1 and the headline as a subheading", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Sandro Mendoza");
    expect(
      screen.getByText("Backend Developer · Kotlin & Spring Boot"),
    ).toBeInTheDocument();
  });

  it("renders no photo (text-only hero, decision #1)", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders a Download Resume link to the static PDF with the download attribute", () => {
    render(<Hero />);
    const link = screen.getByRole("link", {
      name: "Download Sandro Mendoza's resume (PDF)",
    });
    expect(link).toHaveAttribute("href", "/resume/Sandro-Mendoza-Resume.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("shows no fallback message by default", () => {
    render(<Hero />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the fallback hidden when the resume asset check succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true } as Response),
    );
    render(<Hero />);
    fireEvent.click(
      screen.getByRole("link", {
        name: "Download Sandro Mendoza's resume (PDF)",
      }),
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the spec'd fallback message, with a mailto link, when the asset check fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false } as Response),
    );
    render(<Hero />);
    const downloadLink = screen.getByRole("link", {
      name: "Download Sandro Mendoza's resume (PDF)",
    });
    fireEvent.click(downloadLink);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Couldn't open the resume — email sandro.p.mendoza@gmail.com for a copy",
    );
    const mailLink = screen.getByRole("link", {
      name: "sandro.p.mendoza@gmail.com",
    });
    expect(mailLink).toHaveAttribute(
      "href",
      "mailto:sandro.p.mendoza@gmail.com",
    );

    // Button stays visible and re-clickable, not disabled (spec §3 States).
    expect(downloadLink).toBeVisible();
    expect(downloadLink).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows the fallback message when the asset check throws (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<Hero />);
    fireEvent.click(
      screen.getByRole("link", {
        name: "Download Sandro Mendoza's resume (PDF)",
      }),
    );

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
