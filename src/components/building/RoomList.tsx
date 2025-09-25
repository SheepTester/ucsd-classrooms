import { compareRoomNums } from "../../lib/compareRoomNums";
import { RoomMeeting } from "../../lib/coursesToClassrooms";
import { meetingTypes } from "../../lib/meeting-types";
import { isMeetingOngoing, useMoment } from "../../lib/moment-context";
import { Link } from "../Link";

export type RoomListProps = {
  building: string;
  rooms: Record<string, RoomMeeting[]>;
};
export function RoomList({ building, rooms }: RoomListProps) {
  const moment = useMoment();

  if (Object.keys(rooms).length === 0) {
    return (
      <div className="empty">
        <p>
          This building isn't used for any classes this week, as far as WebReg
          is concerned.
        </p>
      </div>
    );
  }

  return (
    <div className="room-list">
      <div className="rooms">
        {Object.entries(rooms)
          // Can't pre-sort the rooms object entries because JS sorts numerical
          // properties differently
          .sort(([a], [b]) => compareRoomNums(a, b))
          .map(([room, meetings]) => {
            const activeMeeting = meetings.find((meeting) =>
              isMeetingOngoing(meeting, moment, 10)
            );
            const soon =
              activeMeeting && moment.time < activeMeeting.time.start;
            return (
              <Link
                key={room}
                view={{ type: "building", building, room }}
                className={`room ${
                  activeMeeting ? (soon ? "soon" : "active") : "inactive"
                }`}
              >
                <div className="room-name">
                  {building} {room}
                </div>
                <div className="current-meeting">
                  {activeMeeting ? (
                    <>
                      {activeMeeting.course}{" "}
                      {soon ? (
                        "soon"
                      ) : (
                        <>
                          (
                          <abbr
                            title={`${
                              meetingTypes[activeMeeting.type]
                            } with up to ${activeMeeting.capacity} student${
                              activeMeeting.capacity === 1 ? "" : "s"
                            }`}
                          >
                            {activeMeeting.type}
                          </abbr>
                          )
                        </>
                      )}
                    </>
                  ) : (
                    "Not in use"
                  )}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
