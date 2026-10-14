import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

// Shared Button/Primary and Button/Secondary from KC's design spec
// (design/screen-specs.md, §1 "Shared components"). Polymorphic so it covers
// every anatomy the spec calls for:
//   - `as="a"`    — real link (e.g. Hero's "Download Resume")
//   - `as="button"` (default) — real button (e.g. Contact's copy-email action)
//   - `as="span"` — presentational only, for the "View on GitHub" label
//     nested *inside* the KC Art Gallery card's single enclosing <a> (spec
//     §7 / Handoff notes: never nest a real link/button inside that card).

export type ButtonVariant = "primary" | "secondary";

interface ButtonOwnProps {
  variant: ButtonVariant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonAsAnchor = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & {
    as: "a";
  };

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    as?: "button";
  };

type ButtonAsSpan = ButtonOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof ButtonOwnProps> & {
    as: "span";
  };

export type ButtonProps = ButtonAsAnchor | ButtonAsButton | ButtonAsSpan;

const baseClasses =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-card px-6 font-semibold transition-colors motion-reduce:transition-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-accent bg-transparent text-accent hover:bg-accent-tint",
};

export function Button(props: ButtonProps) {
  const classes = [
    baseClasses,
    variantClasses[props.variant],
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (props.as === "a") {
    const { as: _as, variant: _variant, icon, className: _className, children, ...anchorProps } =
      props;
    return (
      <a className={classes} {...anchorProps}>
        {icon}
        {children}
      </a>
    );
  }

  if (props.as === "span") {
    const { as: _as, variant: _variant, icon, className: _className, children, ...spanProps } =
      props;
    return (
      <span className={classes} {...spanProps}>
        {icon}
        {children}
      </span>
    );
  }

  const {
    as: _as,
    variant: _variant,
    icon,
    className: _className,
    children,
    type = "button",
    ...buttonProps
  } = props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {icon}
      {children}
    </button>
  );
}
