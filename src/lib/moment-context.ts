import { createContext, useContext } from "react";
import { Day } from "./Day";
import { Time } from "./Time";
import { getHolidays } from "./holidays";
import { now } from "./now";
import { Exam, Meeting, Section } from "./section-types";
import { CurrentTerm, getTerm, getTermDays } from "./terms";
import { ViewTerm } from "./View";

export type TermMoment = {
  date: Day;
  time: Time;
  currentTerm: CurrentTerm;
  holidays: Record<number, string>;
  isFinals: boolean;
  isHoliday: boolean;
  type: "now" | "date-time" | "term";
};

/**
 * Add extra term metadata to a plain `Moment` object so components do not have
 * to recompute them.
 */
export function fromViewTerm(viewTerm: ViewTerm): TermMoment {
  if (viewTerm !== null && "year" in viewTerm) {
    const termDays = getTermDays(viewTerm.year, viewTerm.season);
    return {
      // Needs to be a date in the real `termDays` because some parts of the app
      // call `getTerm` on the date. Needs to be a week into the term so all
      // days of the week around the date are also in the term.
      date: termDays.start.add(7),
      time: Time.from(0),
      currentTerm: {
        year: viewTerm.year,
        season: viewTerm.season,
        termDays: termDays,
        current: true,
        week: -1,
        finals: false,
      },
      holidays: {},
      isFinals: false,
      isHoliday: false,
      type: "term",
    };
  }
  const moment = viewTerm ?? now();
  const currentTerm = getTerm(moment.date);
  const holidays = getHolidays(moment.date.year);
  return {
    ...moment,
    currentTerm,
    holidays,
    // Summer sessions' finals week overlaps with classes, it seems like?
    isFinals:
      currentTerm.finals &&
      currentTerm.season !== "S1" &&
      currentTerm.season !== "S2",
    isHoliday: !!holidays[moment.date.id],
    type: viewTerm === null ? "now" : "date-time",
  };
}

export function toViewTerm(moment: TermMoment): ViewTerm {
  return moment.type === "now"
    ? null
    : moment.type === "date-time"
    ? moment
    : moment.currentTerm;
}

/**
 * @param includeBefore Minutes before the meeting to consider as part of the
 * meeting. Useful to determine if a meeting will occur soon but not right now.
 */
export function isMeetingOngoing(
  meeting:
    | Pick<Section, "kind" | "time">
    | Pick<Meeting, "kind" | "time">
    | Pick<Exam, "kind" | "time" | "date">,
  now: TermMoment,
  includeBefore = 0
): boolean {
  if (!meeting.time || now.isHoliday || now.currentTerm.week === -1) {
    return false;
  }
  if (meeting.kind === "exam") {
    // Exam
    if (+meeting.date !== +now.date) {
      return false;
    }
  } else if (now.isFinals) {
    // Omit regular meetings during finals week
    return false;
  }
  return (
    meeting.time.days.includes(now.date.day) &&
    +meeting.time.start - includeBefore <= +now.time &&
    now.time < meeting.time.end
  );
}

/**
 * Whether a meeting occurs on the given date.
 * @param date A date in the same term as `TermMoment`.
 * @param specialSummer Whether the meeting is from special summer session, in
 * which case checks for S1/S2 bounds shouldn't apply.
 */
export function doesMeetingHappen(
  meeting:
    | Pick<Section, "kind" | "time">
    | Pick<Meeting, "kind" | "time">
    | Pick<Exam, "kind" | "time" | "date">,
  now: Omit<TermMoment, "time" | "date">,
  date: Day,
  specialSummer = false
): boolean {
  if (!meeting.time) {
    return false;
  }
  if (
    now.holidays[date.id] ||
    (!specialSummer &&
      (date < now.currentTerm.termDays.start ||
        date > now.currentTerm.termDays.end))
  ) {
    return false;
  }
  if (meeting.kind === "exam") {
    // Exam
    if (+meeting.date !== +date || now.currentTerm.week === -1) {
      return false;
    }
  } else if (
    date >= now.currentTerm.termDays.finals &&
    now.currentTerm.season !== "S1" &&
    now.currentTerm.season !== "S2"
  ) {
    // Omit regular meetings during finals week during academic year
    return false;
  }
  return meeting.time.days.includes(date.day);
}

export const MomentContext = createContext<TermMoment>({
  date: Day.EPOCH,
  time: Time.from(0),
  currentTerm: {
    current: false,
    finals: false,
    season: "FA",
    termDays: { start: Day.EPOCH, finals: Day.EPOCH, end: Day.EPOCH },
    week: -1,
    year: 0,
  },
  holidays: {},
  isFinals: false,
  isHoliday: false,
  type: "term",
});

export function useMoment(): TermMoment {
  return useContext(MomentContext);
}
