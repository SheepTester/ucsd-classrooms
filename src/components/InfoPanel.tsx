type InfoPanelProps = {
  className?: string;
};
export function InfoPanel({ className = "" }: InfoPanelProps) {
  return (
    <div className={`info-panel ${className}`}>
      <h1 className="title">UCSD Classroom Schedules</h1>
      <p className="instructions">
        Select a building to view its rooms.{" "}
        <a
          href="https://github.com/SheepTester/uxdy/tree/main/webreg-scraping/classrooms"
          className="link"
        >
          Github
        </a>
      </p>
    </div>
  );
}
