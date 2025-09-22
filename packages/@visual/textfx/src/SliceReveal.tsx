import React, {useMemo} from "react";
import "./textfx.css";

export type SliceRevealProps = {
  text: string;
  play?: boolean;
  className?: string;
  slices?: number;
};

export const SliceReveal: React.FC<SliceRevealProps> = ({
  text,
  play = true,
  className,
  slices = 8,
}) => {
  const segments = useMemo(() => {
    return Array.from({length: slices}, (_, index) => {
      const start = (100 / slices) * index;
      const end = (100 / slices) * (index + 1);
      const offset = (index % 2 === 0 ? -1 : 1) * 18;
      return {
        i: index,
        y1: `${start}%`,
        y2: `${end}%`,
        offset: `${offset}px`,
      };
    });
  }, [slices]);

  return (
    <div
      className={["demo", "lg", "fx-slice", className ?? ""].filter(Boolean).join(" ")}
      data-play={play ? "1" : undefined}
    >
      <div className="layer base">
        <div className="txt">{text}</div>
      </div>
      {segments.map((segment) => (
        <div
          key={segment.i}
          className="slice"
          style={{
            "--i": segment.i,
            "--y1": segment.y1,
            "--y2": segment.y2,
            "--offset": segment.offset,
          } as React.CSSProperties}
        >
          <div className="layer">
            <div className="txt">{text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
