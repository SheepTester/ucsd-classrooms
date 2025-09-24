import { useCallback } from "react";
import { Time } from "../../util/Time";
import { BuildingDatum } from "../lib/buildings";
import { RoomMeeting } from "../lib/coursesToClassrooms";
import {
  latLongToPixel,
  southwest,
  PADDING,
  northeast,
} from "../lib/locations";
import { Link } from "./Link";
import { isMeetingOngoing, useMoment } from "../moment-context";

type BuildingButtonProps = {
  building: BuildingDatum;
  rooms: RoomMeeting[][];
  selected: boolean;
  scrollTarget: { init: boolean } | null;
  visible: boolean;
};

export function BuildingButton({
  building,
  rooms,
  selected,
  scrollTarget,
  visible,
}: BuildingButtonProps) {
  const moment = useMoment();

  const college = building.college;

  const ref = useCallback(
    (button: HTMLAnchorElement | null) => {
      if (scrollTarget && button) {
        window.requestAnimationFrame(() => {
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const panelHeight = scrollTarget.init
            ? 0
            : windowHeight * (windowWidth <= 690 ? 0.7 : 0.6);
          const { left, top, width, height } = button.getBoundingClientRect();
          button.closest(".buildings")?.scrollBy({
            left: left + (-windowWidth + width) / 2,
            top: top + (-(windowHeight - panelHeight) + height) / 2,
            behavior: scrollTarget.init ? "auto" : "smooth",
          });
        });
      }
    },
    [scrollTarget]
  );

  const { x, y } = latLongToPixel(building.location);

  return (
    <Link
      view={{ type: "building", building: building.code }}
      className={`building-btn college-${college} ${
        selected ? "selected" : ""
      } ${visible ? "" : "building-btn-hidden"}`}
      style={{
        left: `${x - southwest.x + PADDING.horizontal}px`,
        top: `${y - northeast.y + PADDING.top}px`,
      }}
      elemRef={ref}
    >
      {building.code}
      <span className="room-count">
        <span className="in-use">
          {
            rooms.filter((meetings) =>
              meetings.some((meeting) => isMeetingOngoing(meeting, moment))
            ).length
          }
        </span>
        /{rooms.length}
      </span>
    </Link>
  );
}
