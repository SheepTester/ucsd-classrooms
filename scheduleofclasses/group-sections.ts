/**
 * Types copied from
 * https://github.com/SheepTester/uxdy/blob/main/scheduleofclasses/group-sections.ts
 */

import { Day } from "../util/Day";
import { Time } from "../util/Time";

export type MeetingTime = {
  /**
   * Sorted array of numbers 0-6 representing days of the week. 0 is Sunday.
   */
  days: number[];
  /** In minutes since the start of the day. */
  start: Time;
  /** In minutes since the start of the day. */
  end: Time;
};
/**
 * Represents a consistent and continuous block of time. If, say, a lecture
 * normally meets at 10 am MWF but also has a Wednesday 6 pm meeting for a
 * physics quiz, the 6 pm meeting will be represented as a separate lecture
 * meeting.
 */
export type BaseMeeting = {
  /** eg LE, DI, LA, FI, MI, etc. */
  type: string;
  /** Null if TBA. */
  time: MeetingTime | null;
  /** Null if TBA. */
  location: {
    building: string;
    room: string;
  } | null;
};
export type Section = BaseMeeting & {
  kind: "section";
  /** The section code of the enrollable section, eg A01, A02. */
  code: string;
  capacity: number;
};
export type Meeting = BaseMeeting & {
  kind: "meeting";
  /**
   * The section code of the additional meeting, eg A00, A51, etc. Note that
   * there may be multiple meetings with the same code.
   */
  code: string;
};
export type Exam = BaseMeeting & {
  kind: "exam";
  /** UTC Date. */
  date: Day;
};
export type Group = {
  /**
   * The section code for the lecture/seminar "in charge" of the group, eg A00
   * or 001.
   */
  code: string;
  sectionTitle: string | null;
  /** Individual sections where students have to select one to enroll in. */
  sections: Section[];
  /** Additional meetings, such as a lecture, that all sections share. */
  meetings: Meeting[];
  /** Exams, such as finals, that meet on a specific day. */
  exams: Exam[];
  /** Empty if taught by Staff. */
  instructors: { first: string; last: string }[];
  dateRange?: { start: Day; end: Day };
  /**
   * Coscheduled groups are groups that share:
   * - the same instructors,
   * - the same non-TBA location (including RCLAS classrooms), and
   * - the same meeting times.
   * TODO
   */
  coscheduled: Group | Group[];
};
export type Course = {
  /** The subject and number, joined by a space, eg "CSE 11." */
  code: string;
  title: string;
  catalog?: string;
  groups: Group[];
};
