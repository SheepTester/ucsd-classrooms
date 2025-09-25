import { Term } from "../lib/TermCache";
import { termCode } from "../lib/terms";
import { useLast } from "../lib/useLast";

export type TermStatus = [Term, "unavailable" | "offline" | Date];

export type TermStatusProps = {
  status?: TermStatus[];
  visible: boolean;
};
export function TermStatus({
  status: currentStatus,
  visible,
}: TermStatusProps) {
  const showStatus = visible && currentStatus && currentStatus.length > 0;
  const statuses = useLast([], showStatus ? currentStatus : null);
  const omitTerm = statuses.length === 1 && statuses[0][0].quarter !== "S3";
  const credit = (
    <span>
      Made by{" "}
      <a href="https://www.instagram.com/sheeptester/" className="link">
        @sheeptester
      </a>
      .
    </span>
  );
  return (
    <div className={`term-statuses ${showStatus ? "" : "hide-status"}`}>
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
          )}{" "}
          {statuses.length === 1 ? credit : null}
        </p>
      ))}
      {statuses.length > 1 ? credit : null}
    </div>
  );
}
