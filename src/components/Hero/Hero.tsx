import { useState } from "react";
import { Button } from "../ui/Button";
import { ChevronDownIcon, DownloadIcon } from "../ui/icons";
import { resumeContent } from "../../content/resume";

// Hero section (design/screen-specs.md §3). Text-only (decision #1, no
// photo), visible without scrolling on desktop. This is the only H1 on the
// page, and carries id="top" — Nav's wordmark link and its "scrolled past
// Hero" shadow (MP-2) both depend on this id existing here.

const RESUME_ARIA_LABEL = "Download Sandro Mendoza's resume (PDF)";

export function Hero() {
  const [showFallback, setShowFallback] = useState(false);
  const { name, headline, resumeFileHref } = resumeContent.hero;
  const contactEmail = resumeContent.contact.email;

  // Happy path is a plain static <a href download> — it always fires
  // natively, unblocked, so the common case has zero added risk and no
  // custom loading state (spec: "no custom loading state needed since it's
  // a direct static-file link"). In parallel, a lightweight same-origin HEAD
  // check (explicitly invited by spec §3 States as one valid detection
  // mechanism) drives the fallback message if the asset is actually
  // missing, without gating or delaying the native download.
  const handleDownloadClick = () => {
    fetch(resumeFileHref, { method: "HEAD" })
      .then((response) => setShowFallback(!response.ok))
      .catch(() => setShowFallback(true));
  };

  return (
    <section
      id="top"
      className="relative flex flex-col justify-center px-6 py-16 md:min-h-[70vh] md:px-8 lg:min-h-[85vh] lg:px-16"
    >
      <div className="md:max-w-[600px] lg:max-w-[720px]">
        <h1 className="text-h1 font-bold text-text-primary lg:text-h1-lg">
          {name}
        </h1>
        <p className="mt-4 text-subhead text-text-secondary lg:text-subhead-lg">
          {headline}
        </p>

        <Button
          as="a"
          variant="primary"
          href={resumeFileHref}
          download
          icon={<DownloadIcon className="h-5 w-5" />}
          onClick={handleDownloadClick}
          aria-label={RESUME_ARIA_LABEL}
          className="mt-8 w-full md:w-auto"
        >
          Download Resume
        </Button>

        {showFallback && (
          <p
            role="alert"
            className="mt-4 max-w-md rounded-card border border-error-border bg-error-bg px-4 py-3 text-meta-lg text-error-text"
          >
            Couldn't open the resume — email{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-semibold underline hover:no-underline"
            >
              {contactEmail}
            </a>{" "}
            for a copy
          </p>
        )}
      </div>

      {/* Scroll-cue chevron: desktop only (spec §3 Desktop layout bullet).
          `animate-bounce` is a Tailwind built-in — no new keyframes added.
          prefers-reduced-motion is handled globally in global.css. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 hidden justify-center lg:flex"
      >
        <ChevronDownIcon className="h-6 w-6 animate-bounce text-text-secondary" />
      </div>
    </section>
  );
}
