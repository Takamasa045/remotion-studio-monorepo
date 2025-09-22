import React, {useEffect, useMemo, useState} from "react";

type HtmlPageProps = {
  src: string; // e.g. "/assets/Remotion/page_1.html"
  style?: React.CSSProperties;
  className?: string;
  // Optional: apply a gentle scale/translate for Ken Burns
  kenBurns?: {
    scale: number; // target scale, start at 1.0
    translateY: number; // px shift over time
    progress: number; // 0..1 animation progress
  };
  opacity?: number;
};

export const HtmlPage: React.FC<HtmlPageProps> = ({src, style, className, kenBurns, opacity}) => {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        // Extract <style> blocks from <head> and inline them, since scripts won't run in innerHTML
        const headStyles = Array.from(t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)).map((m) => m[1]).join("\n\n");
        // Convert <link rel="stylesheet" href="..."> to @import so CSS still loads
        const headLinks = Array.from(t.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)).map((m) => m[1]);
        const importCss = headLinks.map((u) => `@import url('${u}');`).join("\n");

        const styles = headStyles || importCss ? `<style>${importCss}\n${headStyles}</style>` : "";
        // Extract body content
        const bodyMatch = t.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const body = bodyMatch && bodyMatch[1] ? bodyMatch[1] : t;
        setHtml(styles + body);
      })
      .catch(() => {
        if (!cancelled) setHtml("<div style='padding:24px;color:#c33'>Failed to load HTML: " + src + "</div>");
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  const transform = useMemo(() => {
    if (!kenBurns) return undefined;
    const s = 1 + (kenBurns.scale - 1) * kenBurns.progress;
    const ty = kenBurns.translateY * kenBurns.progress;
    return `scale(${s}) translateY(${ty}px)`;
  }, [kenBurns]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#ffffff",
        color: "#111",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform,
          transformOrigin: "50% 50%",
          transition: "transform 0.2s linear",
        }}
        // We assume the provided HTML is trusted project asset
        dangerouslySetInnerHTML={{__html: html ?? ""}}
      />
      {!html && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 28,
            letterSpacing: 0.2,
          }}
        >
          Loading {src}...
        </div>
      )}
    </div>
  );
};
