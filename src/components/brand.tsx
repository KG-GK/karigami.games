import Image from "next/image";
import { withWaveText } from "./wave-text";

export function PaperMark({ className = "" }: { className?: string }) {
  return <Image src="/assets/catlogo.svg" width={1254} height={1254} alt="" className={`paper-mark ${className}`} unoptimized />;
}

export function Brand() {
  return withWaveText(<><PaperMark className="brand-symbol" /><span className="wordmark">karigami<span className="wordmark-dot">.</span></span></>);
}
