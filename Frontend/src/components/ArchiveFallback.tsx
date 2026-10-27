export default function ArchiveFallback() {
  return (
    <div className="archive-fallback" aria-hidden="true">
      <div className="fallback-orbit" />
      <div className="fallback-axis" />
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          style={{
            "--book-index": index,
            "--book-color": index % 3 === 0 ? "#f04d2f" : index % 2 ? "#a99468" : "#e8dfcb",
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
import { type CSSProperties } from "react";
