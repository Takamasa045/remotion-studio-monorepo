import React from "react";
import "./textfx.css";

export type KineticWordsProps = {
  words: string[];
  play?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export const KineticWords: React.FC<KineticWordsProps> = ({
  words,
  play = true,
  className,
  size = "md",
}) => (
  <div
    className={["demo", size, "fx-kinetic", className ?? ""].filter(Boolean).join(" ")}
    data-play={play ? "1" : undefined}
  >
    <div className="txt">
      {words.map((word, index) => (
        <span key={index} className="w">
          {word}
        </span>
      ))}
    </div>
  </div>
);
