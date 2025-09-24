import { useContext, useEffect, useRef } from "react";
import { Course } from "../../../scheduleofclasses/group-sections";
import { useMoment } from "../../moment-context";
import { OnView } from "../../View";
import { AbbrevHeading } from "../AbbrevHeading";
import { CloseIcon } from "../icons/CloseIcon";
import { navigate } from "../Link";
import { CourseInfo } from "./CourseInfo";
import { Professor, ProfInfo } from "./ProfInfo";

export type ModalView =
  | { type: "course"; course: Course }
  | { type: "professor"; professor: Professor };

export type ResultModalProps = {
  view: ModalView;
  open: boolean;
};
export function ResultModal({ view, open }: ResultModalProps) {
  const moment = useMoment();
  const onView = useContext(OnView);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close("force-closed");
    }
  }, [open]);

  return (
    <dialog
      className="modal"
      ref={ref}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close("shaded-area");
        }
      }}
      onClose={(e) => {
        if (e.currentTarget.returnValue !== "force-closed") {
          navigate(onView, {
            view: { type: "default", term: moment.isLive ? null : moment },
            back: ([previous]) => {
              if (
                previous &&
                previous.type !== "course" &&
                previous.type !== "professor"
              ) {
                return 0;
              } else {
                return null;
              }
            },
          });
        }
      }}
    >
      <form method="dialog" className="modal-body">
        <header className="modal-header">
          {view.type === "course" ? (
            <AbbrevHeading
              heading="h1"
              abbrev={view.course.code}
              className="modal-title modal-title-course-code"
            >
              {view.course.title}
            </AbbrevHeading>
          ) : (
            <h1 className="modal-title modal-title-professor">
              {view.professor.first}{" "}
              <span className="last-name">{view.professor.last}</span>
            </h1>
          )}
          <button className="close icon-btn" type="submit" value="close-btn">
            <CloseIcon />
          </button>
        </header>
        {view.type === "course" ? (
          <CourseInfo course={view.course} />
        ) : (
          <ProfInfo professor={view.professor} />
        )}
      </form>
    </dialog>
  );
}
