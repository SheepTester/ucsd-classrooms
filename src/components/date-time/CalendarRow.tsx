import { ReactNode } from "react";
import { Day, DAY_NUMS } from "../../lib/Day";
import { getHolidays } from "../../lib/holidays";
import { Season, termCode, TermDays, termName } from "../../lib/terms";
import { AbbrevHeading } from "../AbbrevHeading";

export type CalendarRowProps = {
  children?: ReactNode;
  week?: ReactNode;
  className?: string;
};
export function CalendarRow({
  children,
  week,
  className = "",
}: CalendarRowProps) {
  return (
    <div className={`calendar-row ${className}`}>
      <div className="calendar-week-num">{week}</div>
      {children}
    </div>
  );
}

export function CalendarHeaderRow() {
  return (
    <CalendarRow className="calendar-header-row" week={<span>Wk</span>}>
      {DAY_NUMS.map((day) => (
        <div key={day} className={`calendar-item calendar-week-day`}>
          {Day.dayName(day, "short")}
        </div>
      ))}
    </CalendarRow>
  );
}

export type CalendarQuarterHeadingRowProps = {
  year: number;
  season: Season;
};
export function CalendarQuarterHeadingRow({
  year,
  season,
}: CalendarQuarterHeadingRowProps) {
  return (
    <CalendarRow className="calendar-heading-row calendar-quarter-heading-row">
      <div className="gradient gradient-bg gradient-bottom" />
      <AbbrevHeading
        heading="h2"
        abbrev={termCode(year, season)}
        className="calendar-heading calendar-quarter-heading"
      >
        {termName(year, season)}
      </AbbrevHeading>
    </CalendarRow>
  );
}

export type CalendarMonthHeadingRowProps = {
  month: number;
};
export function CalendarMonthHeadingRow({
  month,
}: CalendarMonthHeadingRowProps) {
  return (
    <CalendarRow className="calendar-heading-row calendar-month-heading-row">
      <h3 className="calendar-heading calendar-month-heading">
        {Day.monthName(month)}
      </h3>
    </CalendarRow>
  );
}

export type CalendarWeekRowProps = {
  termDays: TermDays;
  start: Day;
  end: Day;
  monday: Day;
  // As a performance optimization, `date` may be unspecified if it's not in the
  // week
  date?: Day;
  onDate: (date: Day) => void;
};
export function CalendarWeekRow({
  termDays,
  start,
  end,
  monday,
  date,
  onDate,
}: CalendarWeekRowProps) {
  const startDay = monday.add(-1);
  const endDay = monday.add(6);
  const week = Math.floor((monday.id - termDays.start.id) / 7) + 1;
  const holidays = getHolidays(Math.max(startDay.year, start.year));

  return (
    <div className="calendar-row calendar-date-row">
      <div className="calendar-week-num">
        {week === 11
          ? "FI"
          : termDays.start < endDay && startDay <= termDays.end
          ? week
          : ""}
      </div>
      {DAY_NUMS.map((i) => {
        const day = startDay.add(i);
        if (day < start || day > end) {
          return <div key={i} className="calendar-item" />;
        }
        return (
          <label
            key={i}
            className={`calendar-item calendar-day ${
              day >= termDays.finals && day <= termDays.end
                ? "calendar-finals-day"
                : ""
            } ${day.id === date?.id ? "calendar-selected" : ""} ${
              day >= termDays.start &&
              day <= termDays.end &&
              !holidays[day.id] &&
              day.day > 0 &&
              day.day < 6
                ? ""
                : "calendar-break-day"
            }`}
          >
            <input
              type="radio"
              className="visually-hidden"
              name="calendar-day"
              onKeyDown={(e) => {
                if (date && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                  // TODO: This is very finicky
                  const up = e.key === "ArrowUp";
                  onDate(date.add(up ? -7 : 7));
                  e.preventDefault();
                }
              }}
              onChange={() => onDate(day)}
              checked={day.id === date?.id}
            />
            {day.date}
          </label>
        );
      })}
    </div>
  );
}
