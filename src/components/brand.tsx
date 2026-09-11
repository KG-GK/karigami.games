import Image from "next/image";
import { withWaveText } from "./wave-text";
import type { BrandLayout } from "./brand-state";

export function PaperMark({ className = "" }: { className?: string }) {
  return <Image src="/assets/catlogo.svg" width={1254} height={1254} alt="" className={`paper-mark ${className}`} unoptimized />;
}

export function Brand({ layout = "horizontal" }: { layout?: BrandLayout }) {
  return withWaveText(<span className="brand-art" data-brand-layout={layout}>
    <span className="sr-only">karigami</span>
    <span key={layout} className="brand-visual" aria-hidden="true">
      <Image src="/assets/karigami-symbol.png" width={256} height={256} sizes="58px" alt="" className="paper-mark brand-symbol" />
      <span className="wordmark wordmark-kari">kari</span><span className="wordmark wordmark-gami">gami<span className="wordmark-dot">.</span></span>
    </span>
  </span>);
}
