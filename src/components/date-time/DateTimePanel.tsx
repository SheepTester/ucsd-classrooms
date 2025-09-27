import { useState } from "react";
import { Day } from "../../lib/Day";
import { Time } from "../../lib/Time";
import { inPT } from "../../lib/now";
import { Calendar, ScrollMode } from "./Calendar";
import { useStableCallback } from "../../lib/useStable";

export type DateTimePanelProps = {
  date: Day;
  onDate: (date: Day) => void;
  time: Time;
  onTime: (customTime: Time) => void;
  useNow: boolean;
  onUseNow: (useNow: boolean) => void;
  visible: boolean;
  closeable: boolean;
  className: string;
  onClose: () => void;
};
export function DateTimePanel({
  date,
  onDate,
  time,
  onTime,
  useNow,
  onUseNow,
  visible,
  closeable,
  className,
  onClose,
}: DateTimePanelProps) {
  const [scrollMode, setScrollMode] = useState<ScrollMode>("init");

  const handleCalendarDate$ = useStableCallback((date: Day) => {
    onUseNow(false);
    onDate(date);
    setScrollMode("none");
  });

  return (
    <form
      className={`date-time-panel ${
        visible ? "" : "date-time-panel-hidden"
      } ${className} calendar-open`}
      onSubmit={(e) => {
        onClose();
        e.preventDefault();
      }}
    >
      <div className="date-time-flex">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={useNow}
            onChange={(e) => {
              onUseNow(e.currentTarget.checked);
              if (e.currentTarget.checked) {
                setScrollMode("date-edited");
              }
            }}
          />
          <span>
            Use current time
            {inPT() ? null : <span className="tz-note">(in San Diego)</span>}
          </span>
        </label>
        {date.id !== Day.today().id && (
          <button
            type="button"
            className="today-btn"
            onClick={() => {
              onDate(Day.today());
              setScrollMode("date-edited");
            }}
          >
            Today
          </button>
        )}
        {closeable && (
          <button className="filled-icon-btn close-date-btn">Close</button>
        )}
      </div>
      <div className="date-time-flex">
        <input
          type="date"
          name="date"
          value={date.toString()}
          onChange={(e) => {
            const date = Day.parse(e.currentTarget.value);
            if (date) {
              if (useNow) {
                onUseNow(false);
              }
              onDate(date);
              setScrollMode("date-edited");
            }
          }}
          className="date-input"
        />
        <input
          type="time"
          value={time.toString(true)}
          onChange={(e) => {
            const time = Time.parse24(e.currentTarget.value);
            if (time) {
              if (useNow) {
                onUseNow(false);
              }
              onTime(time);
            }
          }}
          className="time-input"
        />
      </div>
      <Calendar
        date={date}
        onDate$={handleCalendarDate$}
        scrollMode={scrollMode}
        freeScroll={() => setScrollMode("none")}
      />
    </form>
  );
}
