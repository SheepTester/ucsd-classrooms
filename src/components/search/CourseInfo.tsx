import { Day } from "../../lib/Day";
import { meetingTypes } from "../../lib/meeting-types";
import { useMoment } from "../../lib/moment-context";
import { Course, Exam, Meeting, Section } from "../../lib/section-types";
import { Link } from "../Link";

const webregDays = ["Sun", "M", "Tu", "W", "Th", "F", "S", "Sun"];

type MeetingCardProps = {
  meeting: Section | Meeting | Exam;
  code?: string | null;
  totalCapacity?: number;
};
export function MeetingCard({
  meeting,
  code,
  totalCapacity,
}: MeetingCardProps) {
  const moment = useMoment();
  const physicalRoom =
    meeting.location && meeting.location.building !== "RCLAS";
  const capacity =
    meeting.kind === "section" ? meeting.capacity : totalCapacity;

  return (
    <section className="meeting-card">
      <p className="meeting-type">
        {meetingTypes[meeting.type] ?? meeting.type}
        {code && (
          <>
            <span className="colon">: </span>
            <span className="meeting-code">{code}</span>
          </>
        )}
      </p>
      {capacity !== undefined && (
        <p className="meeting-column section-capacity">
          {capacity === Infinity ? (
            "No limit"
          ) : (
            <>
              Capacity: <strong>{capacity}</strong>
            </>
          )}
        </p>
      )}
      <div className="mobile-break" />
      <p className="meeting-column meeting-date">
        {meeting.time && (
          <abbr
            title={meeting.time.days
              .map((day) => Day.dayName(day, "long"))
              .join(", ")}
          >
            {meeting.time.days.map((day) => webregDays[day]).join("")}
          </abbr>
        )}{" "}
        {meeting.kind === "exam"
          ? meeting.date.toString([], { month: "short", day: "numeric" })
          : null}{" "}
        {meeting.time && meeting.time.start.formatRange(meeting.time.end)}
        {meeting.time &&
        meeting.time.start <= moment.time &&
        moment.time < meeting.time.end &&
        (meeting.kind === "exam"
          ? +meeting.date === +moment.date
          : meeting.time.days.includes(moment.date.day)) ? (
          <span
            className="live-marker"
            title="Happening now"
            aria-label="(Happening now)"
          />
        ) : null}
      </p>
      <Link
        view={
          physicalRoom && meeting.location
            ? {
                type: "building",
                building: meeting.location.building,
                room: meeting.location.room,
              }
            : null
        }
        className={`meeting-column location ${
          physicalRoom ? "" : "location-not-room"
        }`}
      >
        {meeting.location
          ? meeting.location.building === "RCLAS"
            ? "Remote"
            : `${meeting.location.building} ${meeting.location.room}`
          : "TBA"}
      </Link>
    </section>
  );
}

export type CourseInfoProps = {
  course: Course;
};
export function CourseInfo({ course }: CourseInfoProps) {
  return (
    <div className="course-info">
      {course.groups.map((group) => {
        const totalCapacity = group.sections.reduce(
          (cum, curr) => cum + curr.capacity,
          0
        );
        return (
          <article className="group" key={group.code}>
            <header className="group-info">
              <div className="group-code">{group.code}</div>
              {group.sectionTitle ? (
                <h2 className="section-title">{group.sectionTitle}</h2>
              ) : null}
              <div className="instructors">
                {group.instructors.map(({ first, last }) => (
                  <Link
                    view={{ type: "professor", name: `${last}, ${first}` }}
                    className="instructor"
                    key={`${last}, ${first}`}
                  >
                    {first} <span className="last-name">{last}</span>
                  </Link>
                ))}
                {group.instructors.length === 0 && (
                  <span className="staff">Instructor TBA</span>
                )}
              </div>
            </header>
            {group.meetings.map((meeting, i) => (
              <MeetingCard
                meeting={meeting}
                code={meeting.code !== group.code ? meeting.code : null}
                totalCapacity={totalCapacity}
                key={i}
              />
            ))}
            {group.sections.length > 0 && group.meetings.length > 0 && (
              <hr className="additional-meetings-divider" />
            )}
            {group.sections.map((section) => (
              <MeetingCard
                meeting={section}
                code={section.code !== group.code ? section.code : null}
                key={section.code}
              />
            ))}
            {group.meetings.length > 0 && group.exams.length > 0 && (
              <hr className="additional-meetings-divider" />
            )}
            {group.exams.map((exam, i) => (
              <MeetingCard meeting={exam} key={i} />
            ))}
          </article>
        );
      })}
    </div>
  );
}
