import { BuildingDatum } from "../../lib/buildings";
import { RoomMeeting } from "../../lib/coursesToClassrooms";
import { useLast } from "../../lib/useLast";
import { AbbrevHeading } from "../AbbrevHeading";
import { BackIcon } from "../icons/BackIcon";
import { CloseIcon } from "../icons/CloseIcon";
import { Image } from "../Image";
import { Link } from "../Link";
import { RoomList } from "./RoomList";
import { RoomSchedule } from "./RoomSchedule";

type BuildingPanelContentProps = {
  building: BuildingDatum;
  room: string | null;
  rooms: Record<string, RoomMeeting[]>;
};
function BuildingPanelContent({
  building: { code, images, college, name },
  room,
  rooms,
}: BuildingPanelContentProps) {
  const lastRoom = useLast("", room);

  const imageUrl = images[0]?.url; // TODO: Compress

  return (
    <>
      <header
        className={`building-name ${
          room ? "schedule-view" : "list-view"
        } college-${college}`}
      >
        {images.length > 0 && (
          <Image
            className="building-header-image"
            src={imageUrl}
            key={imageUrl}
          />
        )}
        <Link
          view={room ? { type: "building", building: code } : null}
          className="icon-btn back"
          back={([previous]) => {
            // If the user just came from a room list then go back to it
            if (previous && previous.type === "building" && !previous.room) {
              return 0;
            } else {
              return null;
            }
          }}
        >
          <BackIcon />
        </Link>
        <AbbrevHeading
          heading="h2"
          abbrev={
            <span>
              {code} <span className="room-number">{lastRoom}</span>
            </span>
          }
        >
          {name}
        </AbbrevHeading>
        <Link
          view={{ type: "default" }}
          className="icon-btn close"
          back={([previous, before]) => {
            if (!previous) {
              return null;
            }
            // If the building panel was directly opened, go back
            if (previous.type === "default") {
              return 0;
            }
            // If the building panel was opened two pages ago, and this is a
            // room schedule,
            if (room && before && before.type === "default") {
              // Ensure that the direct previous entry was a room list
              if (previous.type === "building" && !previous.room) {
                return 1;
              }
            }
            return null;
          }}
        >
          <CloseIcon />
        </Link>
      </header>
      {room ? (
        <RoomSchedule meetings={rooms[room] ?? []} />
      ) : (
        <>
          <div className="gradient gradient-sticky gradient-top" />
          <RoomList building={code} rooms={rooms} />
          {images.length > 0 ? (
            <div className="building-images">
              {images.map((image) => {
                const imageUrl = image.url; // TODO: Compress
                return (
                  <a
                    href={image.url}
                    className="building-image-link"
                    key={imageUrl}
                    target="_blank"
                  >
                    <Image
                      className="building-image"
                      src={imageUrl}
                      loading="lazy"
                      width={image.size[0]}
                      height={image.size[1]}
                    />
                  </a>
                );
              })}
            </div>
          ) : null}
          <div className="gradient gradient-sticky gradient-bottom" />
        </>
      )}
    </>
  );
}

export type BuildingPanelProps = BuildingPanelContentProps & {
  visible: boolean;
  rightPanelOpen: boolean;
};
export function BuildingPanel({
  visible,
  rightPanelOpen,
  ...props
}: BuildingPanelProps) {
  return (
    <div
      className={`building-panel ${visible ? "" : "building-panel-invisible"} ${
        rightPanelOpen ? "right-panel-open" : ""
      }`}
    >
      <BuildingPanelContent
        // Force new elements (disable transition) when building changes
        key={props.building.code}
        // For some reason this needs to be after `key` or then Deno gets pissed
        // about `react` not existing.
        {...props}
      />
    </div>
  );
}
