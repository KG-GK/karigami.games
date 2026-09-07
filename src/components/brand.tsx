import { withWaveText } from "./wave-text";

export function PaperMark({ className = "" }: { className?: string }) {
  return <span className={`paper-mark ${className}`} aria-hidden="true"><span /><span /><span /></span>;
}

export function Brand() {
  return withWaveText(<><PaperMark className="brand-symbol" /><span className="wordmark">karigami<span className="wordmark-dot">.</span></span></>);
}
