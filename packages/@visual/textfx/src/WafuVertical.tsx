import React from "react";
import "./textfx.css";

export type WafuVerticalProps = {
  title: string;
  rubyTitle?: string;
  subtitle?: string;
  play?: boolean;
  className?: string;
};

export const WafuVertical: React.FC<WafuVerticalProps> = ({
  title,
  rubyTitle,
  subtitle,
  play = true,
  className,
}) => (
  <article
    className={["panel-wafu", "wafu", className ?? ""].filter(Boolean).join(" ")}
    data-play={play ? "1" : undefined}
  >
    <div className="paper" />
    <div className="kakejiku" />
    <div className="wafu-wrap">
      <div className="wafu-title">
        {rubyTitle ? (
          <ruby>
            {title}
            <rt>{rubyTitle}</rt>
          </ruby>
        ) : (
          title
        )}
      </div>
      {subtitle && <div className="wafu-sub">- {subtitle} -</div>}
    </div>
    <div className="ink-overlay" />
  </article>
);
