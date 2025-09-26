import { Term } from "../lib/TermCache";
import { termCode } from "../lib/terms";
import { useLast } from "../lib/useLast";

export type TermStatus = [Term, "unavailable" | "offline" | Date];

export type TermStatusProps = {
  statuses?: TermStatus[];
};
export function TermStatus({ statuses }: TermStatusProps) {
  if (!statuses || statuses.length === 0) {
    return null;
  }
  const omitTerm = statuses.length === 1 && statuses[0][0].quarter !== "S3";
  return (
    <div className="term-statuses">
      {statuses.map(([term, status]) => (
        <p
          key={termCode(term.year, term.quarter)}
          className={`term-updated ${
            status === "offline"
              ? "term-offline"
              : status === "unavailable"
              ? "term-unavailable"
              : ""
          }`}
        >
          {!omitTerm && (
            <>
              <span className="term-code">
                {termCode(term.year, term.quarter)}
              </span>
              &nbsp;
            </>
          )}
          {status instanceof Date ? (
            <>
              {omitTerm ? "Data updated " : "last updated "}
              <span className="updated-date">
                {status.toLocaleDateString()}
              </span>
              .
            </>
          ) : status === "offline" ? (
            "failed to load."
          ) : (
            "is unavailable."
          )}
        </p>
      ))}
    </div>
  );
}
