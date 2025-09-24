import { Course } from "../../lib/section-types";
import { Link } from "../Link";
import { MeetingCard } from "./CourseInfo";

export type Professor = {
  first: string;
  last: string;
  courses: Course[];
};

export type ProfInfoProps = {
  professor: Professor;
};
export function ProfInfo({ professor }: ProfInfoProps) {
  return (
    <div className="course-info">
      {professor.courses.flatMap((course) =>
        course.groups.map((group) => (
          <article className="group" key={`${course.code}\n${group.code}`}>
            <header className="group-info">
              <Link
                view={{ type: "course", course: course.code }}
                className="course-code"
              >
                {course.code}
              </Link>
              <div className="group-code group-code-small">{group.code}</div>
              {group.sectionTitle ? (
                <h2 className="section-title">{group.sectionTitle}</h2>
              ) : null}
            </header>
            {(group.meetings.length > 0 ? group.meetings : group.sections).map(
              (meeting, i) => (
                <MeetingCard
                  meeting={meeting}
                  code={meeting.code !== group.code ? meeting.code : null}
                  key={i}
                />
              )
            )}
          </article>
        ))
      )}
    </div>
  );
}
