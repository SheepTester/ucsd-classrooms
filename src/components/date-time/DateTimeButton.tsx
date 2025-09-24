import { useMoment } from "../../lib/moment-context";
import { termCode } from "../../lib/terms";

const dateFormat = new Intl.DateTimeFormat([], {
  dateStyle: "short",
  timeStyle: "short",
});

export type DateTimeButtonProps = {
  onClick: () => void;
  disabled: boolean;
};
export function DateTimeButton({ onClick, disabled }: DateTimeButtonProps) {
  const {
    date,
    time,
    currentTerm: { year, season, current, week },
  } = useMoment();
  return (
    <button className="date-time-button" onClick={onClick} disabled={disabled}>
      <div className="showing-schedule-wrapper">
        <span className="showing-schedule-text">Showing schedule for</span>
        <div className="date-time">
          {dateFormat.format(date.toLocal(time.hour, time.minute))}
        </div>
        {current && (
          <span className="quarter-week">
            {termCode(year, season)} {week < 10 ? `Week ${week}` : "Finals"}{" "}
            {date.dayName("short")}
          </span>
        )}
      </div>
      <div className="filled-icon-btn edit-icon">Edit</div>
    </button>
  );
}
