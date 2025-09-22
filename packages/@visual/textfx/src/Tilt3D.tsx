import React, {useCallback} from "react";
import "./textfx.css";

export type Tilt3DProps = {
  text: string;
  play?: boolean;
  className?: string;
};

export const Tilt3D: React.FC<Tilt3DProps> = ({text, play = true, className}) => {
  const handleMove = useCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / 4;
    const dy = (event.clientY - (rect.top + rect.height / 2)) / 4;
    event.currentTarget.style.setProperty("--dx", dx.toFixed(2));
    event.currentTarget.style.setProperty("--dy", dy.toFixed(2));
  }, []);

  const handleLeave = useCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    event.currentTarget.style.setProperty("--dx", "0");
    event.currentTarget.style.setProperty("--dy", "0");
  }, []);

  return (
    <div
      className={["demo", "lg", "fx-tilt", className ?? ""].filter(Boolean).join(" ")}
      data-play={play ? "1" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="txt">{text}</div>
    </div>
  );
};
