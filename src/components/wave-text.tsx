import { Children, cloneElement, isValidElement, type ReactNode } from "react";

function WaveText({ children }: { children: string }) {
  return <span className="wave-text" data-wave-text="">
    <span className="sr-only">{children}</span>
    <span aria-hidden="true">{Array.from(children).map((character, index) => /\s/.test(character) ? character : <span className="wave-glyph" key={index}>{character}</span>)}</span>
  </span>;
}

// React owns these spans throughout their lifetime; the effect never rewrites text nodes.
// Wrapping inline characters preserves natural line breaks and readable accessible text.
export function withWaveText(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string" && child.trim()) return <WaveText>{child}</WaveText>;
    if (typeof child === "number") return <WaveText>{String(child)}</WaveText>;
    if (!isValidElement<{ children?: ReactNode; className?: string }>(child) || child.type === WaveText) return child;
    if (child.props.className?.split(" ").includes("sr-only")) return child;
    if (typeof child.type === "string" && ["svg", "script", "style", "textarea", "select", "option"].includes(child.type)) return child;
    if (child.props.children === undefined) return child;
    return cloneElement(child, { children: withWaveText(child.props.children) });
  });
}
