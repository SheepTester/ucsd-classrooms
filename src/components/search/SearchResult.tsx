import { useEffect, useRef } from "react";
import { View } from "../../lib/View";
import { Link } from "../Link";

export type SearchResultProps = {
  name?: string;
  code?: string;
  primary: "name" | "code";
  match?: {
    start: number;
    end: number;
  };
  selected: boolean;
  view: View;
};
export function SearchResult({
  name,
  code,
  primary: primaryField,
  match,
  selected,
  view,
}: SearchResultProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [selected]);

  const nameFirst = primaryField === "name";
  const primary = nameFirst ? name : code;
  const secondary = nameFirst ? code : name;

  return (
    <Link
      view={view}
      className={`result ${selected ? "result-selected" : ""}`}
      elemRef={ref}
    >
      {primary !== undefined && (
        <p
          className={`result-primary ${
            nameFirst ? "result-name" : "result-code"
          }`}
        >
          {match ? (
            <>
              {primary.slice(0, match.start)}
              <span className="result-match">
                {primary.slice(match.start, match.end)}
              </span>
              {primary.slice(match.end)}
            </>
          ) : (
            primary
          )}
        </p>
      )}
      {secondary !== undefined && (
        <p
          className={`result-secondary ${
            nameFirst ? "result-code" : "result-name"
          }`}
        >
          {secondary}
        </p>
      )}
    </Link>
  );
}
