import { ReactNode } from "react";

export type AbbrevHeadingProps = {
  heading: "h1" | "h2" | "h3" | "span";
  abbrev?: ReactNode;
  children?: ReactNode;
  className?: string;
};
export function AbbrevHeading({
  heading: Heading,
  abbrev,
  children,
  className = "",
}: AbbrevHeadingProps) {
  return (
    <Heading className={`abbrev-heading ${className}`}>
      <span className="abbrev">{abbrev}</span>
      <span className="colon">: </span>
      <span className="long">{children}</span>
    </Heading>
  );
}
