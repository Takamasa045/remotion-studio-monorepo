import React from "react";
import "./textfx.css";

export type GlareProps = {
  text: string;
  play?: boolean;
  className?: string;
};

export const Glare: React.FC<GlareProps> = ({text, play = true, className}) => (
  <div
    className={["demo", "lg", "fx-glare", className ?? ""].filter(Boolean).join(" ")}
    data-play={play ? "1" : undefined}
  >
    <div className="noisefx" />
    <div className="txt">{text}</div>
  </div>
);
