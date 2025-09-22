import React, {useEffect, useRef} from "react";
import "./textfx.css";

export type MotionTrailProps = {
  text: string;
  play?: boolean;
  className?: string;
};

export const MotionTrail: React.FC<MotionTrailProps> = ({text, play = true, className}) => {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || !play) {
      return;
    }

    let frame = 0;
    const coreTxt = el.querySelector<HTMLElement>(".core .txt");
    const ghosts = [
      el.querySelector<HTMLElement>(".g1 .txt"),
      el.querySelector<HTMLElement>(".g2 .txt"),
      el.querySelector<HTMLElement>(".g3 .txt"),
    ];

    let raf: number;
    const loop = () => {
      frame += 0.016;
      const tx = Math.cos(frame * 1.2) * 6;
      const ty = Math.sin(frame * 0.9) * 4;
      coreTxt?.style.setProperty("transform", `translate(${tx}px, ${ty}px)`);
      ghosts.forEach((ghost, index) => {
        if (!ghost) return;
        const f = index + 1;
        ghost.style.setProperty(
          "transform",
          `translate(${tx * (f * 0.4)}px, ${ty * (f * 0.6)}px)`
        );
        ghost.style.setProperty("opacity", (0.16 * (4 - f)).toFixed(2));
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  return (
    <div
      ref={host}
      className={["demo", "lg", "fx-trail", className ?? ""].filter(Boolean).join(" ")}
      data-play={play ? "1" : undefined}
    >
      <div className="ghost g1">
        <div className="txt">{text}</div>
      </div>
      <div className="ghost g2">
        <div className="txt">{text}</div>
      </div>
      <div className="ghost g3">
        <div className="txt">{text}</div>
      </div>
      <div className="core">
        <div className="txt">{text}</div>
      </div>
    </div>
  );
};
