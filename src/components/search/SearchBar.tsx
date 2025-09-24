import { useEffect, useRef, useState } from "react";
import { isMeetingOngoing, useMoment } from "../../lib/moment-context";
import { Meeting, Section } from "../../lib/section-types";
import { Term } from "../../lib/TermCache";
import { ClearIcon } from "../icons/CloseIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { SearchData, SearchResults } from "./SearchResults";

export type State =
  | { type: "unloaded" }
  | { type: "loading" }
  | {
      type: "loaded";
      termId: string;
      data: Omit<SearchData, "buildings">;
      offline: Term[];
    };

export type SearchBarProps = {
  state: State;
  terms: Term[];
  termId: string;
  buildings: string[];
  showResults: boolean;
  onSearch: (showResults: boolean) => void;
  visible: boolean;
};
export function SearchBar({
  state,
  terms,
  termId,
  buildings,
  showResults,
  onSearch,
  visible,
}: SearchBarProps) {
  const moment = useMoment();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [ongoingOnly, setOngoingOnly] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const loaded = state.type === "loaded" && state.termId === termId;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      if ((e.key === "/" || e.key === "s") && e.target === document.body) {
        ref.current?.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // TODO: show loading, offline errors with retry button
  return (
    <form
      role="search"
      action="javascript:"
      onSubmit={(e) => {
        // This sucks but I'm too lazy to think of a good React way to do
        // this
        const selected = e.currentTarget
          .closest(".search-wrapper")
          ?.querySelector(".result-selected");
        if (selected instanceof HTMLElement) {
          selected.click();
        }
      }}
      className={`search-wrapper ${visible ? "" : "hide-search"} ${
        loaded && showResults && query !== "" ? "showing-results" : ""
      }`}
    >
      <label className="search-bar">
        <SearchIcon />
        <input
          type="text"
          id="search"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          aria-label="Search courses, people, and buildings."
          title="Press '/' to jump to the search box."
          placeholder="Search courses, people, buildings..."
          className="search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            setIndex(0);
            onSearch(e.currentTarget.value.length > 0);
          }}
          onKeyDown={(e) => {
            if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
              return;
            }
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              setIndex((index) =>
                index === null
                  ? e.key === "ArrowUp"
                    ? -1
                    : 0
                  : index + (e.key === "ArrowUp" ? -1 : 1)
              );
              e.preventDefault();
            }
          }}
          onFocus={(e) => {
            onSearch(e.currentTarget.value.length > 0);
          }}
          ref={ref}
        />
        {query.length > 0 && (
          <button
            className="icon-btn clear-btn"
            type="reset"
            onClick={() => {
              setQuery("");
              onSearch(false);
            }}
          >
            <ClearIcon />
          </button>
        )}
      </label>
      {loaded && showResults && (
        <SearchResults
          terms={terms}
          query={query}
          data={
            ongoingOnly
              ? {
                  courses: state.data.courses.filter((course) =>
                    course.groups.some((group) => {
                      const test = (meeting: Meeting | Section) =>
                        (meeting.type === "LE" || meeting.type === "SE") &&
                        isMeetingOngoing(meeting, moment);
                      return (
                        group.meetings.some(test) || group.sections.some(test)
                      );
                    })
                  ),
                  professors: [],
                  buildings: [],
                }
              : { ...state.data, buildings }
          }
          index={index}
          ongoingOnly={ongoingOnly}
        />
      )}
      <label
        className={`ongoing-only ${showResults ? "show-ongoing-only" : ""}`}
      >
        <input
          type="checkbox"
          checked={ongoingOnly}
          onChange={(e) => {
            setOngoingOnly(e.currentTarget.checked);
          }}
        />
        Ongoing lectures only
      </label>
    </form>
  );
}
