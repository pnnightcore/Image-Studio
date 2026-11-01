import React, { useRef, useState, useEffect } from "react";
import type { QuoteData, ParticleConfig } from "../lib/types";
import { QUOTE_WIDTH, QUOTE_HEIGHT } from "../lib/constants";
import { ParticleCanvas } from "./ParticleCanvas";
import { ParticleOverlayButton } from "./ParticleOverlayButton";
import { Download, Copy, Check, ExternalLink, Quote as QuoteIcon } from "lucide-react";

interface QuotePreviewProps {
  data: QuoteData;
  onGenerate: () => void;
  isGenerating: boolean;
  lastGeneratedBlob?: Blob | null;
  particleConfig?: ParticleConfig;
  onParticleConfigChange?: (config: ParticleConfig | undefined) => void;
}

export function QuotePreview({
  data,
  onGenerate,
  isGenerating,
  lastGeneratedBlob,
  particleConfig,
  onParticleConfigChange,
}: QuotePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.75);
  const [zoomMode, setZoomMode] = useState<"fit" | "50" | "75" | "100">("fit");
  const [copied, setCopied] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [previewPngUrl, setPreviewPngUrl] = useState<string | null>(null);

  useEffect(() => {
    if (lastGeneratedBlob) {
      const url = URL.createObjectURL(lastGeneratedBlob);
      setPreviewPngUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [lastGeneratedBlob]);

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      if (zoomMode === "100") {
        setScale(1);
      } else if (zoomMode === "75") {
        setScale(0.75);
      } else if (zoomMode === "50") {
        setScale(0.5);
      } else {
        const availableWidth = containerRef.current.clientWidth - 48;
        const newScale = Math.min(1, Math.max(0.35, availableWidth / QUOTE_WIDTH));
        setScale(newScale);
      }
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [zoomMode]);

  const handleCopyBlob = async () => {
    if (!lastGeneratedBlob) {
      onGenerate();
      return;
    }
    try {
      if (navigator.clipboard && "write" in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": lastGeneratedBlob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn("Failed to copy image:", err);
    }
  };

  const layout = data.layout || "split-portrait";

  return (
    <div className="flex flex-col rounded-xl border border-white/8 bg-[#0f1118] shadow-2xl overflow-hidden">
      {/* Studio Stage Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 bg-[#0a0c10]/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <h3 className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
              Quote Stage Viewport
            </h3>
          </div>
          <span className="font-mono text-[10px] text-slate-300 rounded border border-white/10 bg-white/5 px-2 py-0.5">
            {QUOTE_WIDTH} × {QUOTE_HEIGHT} PX · {layout.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Selector */}
          <div className="flex items-center rounded-md border border-white/10 bg-[#090a0f] p-0.5 text-xs text-slate-300 font-mono">
            {(["fit", "50", "75", "100"] as const).map((z) => (
              <button
                key={z}
                onClick={() => setZoomMode(z)}
                className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
                  zoomMode === z
                    ? "bg-[#1d2232] text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {z === "fit" ? "Fit" : `${z}%`}
              </button>
            ))}
          </div>

          {/* Particle System Ambience Selector */}
          {onParticleConfigChange && (
            <ParticleOverlayButton
              particleConfig={particleConfig}
              onChange={onParticleConfigChange}
            />
          )}

          {lastGeneratedBlob && (
            <button
              onClick={handleCopyBlob}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-white/10 transition tactile-press"
              title="Copy image to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-md bg-[#ff462b] px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#ea381f] disabled:opacity-40 transition-all tactile-press"
          >
            {isGenerating ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Render</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative flex min-h-[460px] flex-1 items-center justify-center overflow-auto p-6 bg-studio-stage"
      >
        <div
          className="transition-transform duration-150 ease-out origin-center shadow-2xl"
          style={{
            transform: `scale(${scale})`,
            width: `${QUOTE_WIDTH}px`,
            height: `${QUOTE_HEIGHT}px`,
          }}
        >
          <div
            className="relative select-none overflow-hidden rounded-[16px] shadow-2xl"
            style={{
              width: `${QUOTE_WIDTH}px`,
              height: `${QUOTE_HEIGHT}px`,
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
            }}
          >
            {/* Particle Ambience Overlay */}
            {particleConfig && (
              <ParticleCanvas
                config={particleConfig}
                width={QUOTE_WIDTH}
                height={QUOTE_HEIGHT}
                playing={true}
                className="z-30"
              />
            )}

            {/* 1. Layout: Split Cinema (Original) */}
            {(!data.layout || data.layout === "split-portrait") && (
              <div className="relative h-full w-full bg-black overflow-hidden">
                {/* Left side character image with gradient fade */}
                <div className="absolute top-0 left-0 h-[500px] w-[480px] overflow-hidden">
                  {!imgError && data.avatar ? (
                    <img
                      src={data.avatar}
                      alt={data.author}
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-sky-400">
                      <QuoteIcon className="h-20 w-20 opacity-30" />
                    </div>
                  )}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 80%, #000000 100%)",
                    }}
                  />
                </div>

                {/* Right side quote content */}
                <div className="relative z-10 ml-[450px] flex h-[500px] flex-col items-center justify-center px-[40px] text-center">
                  <h1 className="max-w-[460px] text-[36px] font-normal leading-[48px] text-white">
                    {data.quote || "Quote text"}
                  </h1>
                  <div className="mt-[24px] text-[24px] italic text-white font-['Space_Grotesk',sans-serif]">
                    - {data.author || "Author"}
                  </div>
                  <div className="mt-[6px] text-[17px] text-[#9ca3af] font-mono">
                    {data.handle || "@handle"}
                  </div>
                </div>

                {/* Watermark Tag Bottom Right */}
                <div className="absolute bottom-[16px] right-[24px] z-20 font-mono text-[14px] text-[#4b5563]">
                  {data.tag || "IMAGE_STUDIO"}
                </div>
              </div>
            )}

            {/* 2. Layout: Centered Editorial */}
            {data.layout === "centered-minimal" && (
              <div
                className="relative flex h-full w-full flex-col items-center justify-center px-16 py-12 text-center overflow-hidden border border-white/10"
                style={{
                  background:
                    "radial-gradient(circle at 50% 20%, #1e1b4b 0%, #090a12 60%, #030408 100%)",
                }}
              >
                {/* Background ambient quotation mark */}
                <div
                  className="pointer-events-none absolute select-none font-serif text-[200px] font-bold text-sky-500/10 leading-none"
                  style={{ top: "40px" }}
                >
                  “
                </div>

                {/* Top Avatar */}
                <div className="relative z-10 mb-5">
                  <div className="h-[96px] w-[96px] rounded-full p-[3px] bg-gradient-to-tr from-sky-500 via-indigo-400 to-rose-400 shadow-xl shadow-sky-500/20">
                    <img
                      src={data.avatar}
                      alt={data.author}
                      className="h-full w-full rounded-full object-cover bg-black"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Quote Text */}
                <div className="relative z-10 max-w-[800px] text-[32px] font-normal leading-[44px] text-white tracking-wide">
                  "{data.quote || "Quote text"}"
                </div>

                {/* Elegant separator */}
                <div className="my-5 h-[2px] w-[90px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

                {/* Author Info */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="text-[22px] font-semibold text-sky-200 font-['Space_Grotesk',sans-serif]">
                    {data.author || "Author"}
                  </div>
                  <div className="flex items-center gap-2 text-[14px] text-slate-400 font-mono">
                    <span>{data.handle || "@handle"}</span>
                    <span>·</span>
                    <span className="text-sky-300/80">{data.tag || "Editorial"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Layout: Modern Card */}
            {data.layout === "modern-card" && (
              <div
                className="relative flex h-full w-full items-center justify-center p-12 overflow-hidden"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 90%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), linear-gradient(135deg, #070913 0%, #0d1224 50%, #0a0e1c 100%)",
                }}
              >
                {/* Ambient backdrop image blurred */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  <img
                    src={data.avatar}
                    alt=""
                    className="h-full w-full object-cover blur-3xl scale-125"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Floating Frosted Card */}
                <div className="relative z-10 flex h-[380px] w-[880px] flex-col justify-between rounded-[24px] border border-white/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl">
                  {/* Card Header: Author Profile */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={data.avatar}
                        alt={data.author}
                        className="h-[58px] w-[58px] rounded-2xl object-cover border border-white/20 shadow-md"
                        crossOrigin="anonymous"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[20px] font-bold text-white font-['Space_Grotesk',sans-serif]">{data.author}</span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[11px] text-white">
                            ✓
                          </span>
                        </div>
                        <span className="text-[13px] text-sky-300 font-mono">{data.handle}</span>
                      </div>
                    </div>

                    <div className="rounded border border-sky-400/30 bg-sky-500/15 px-3 py-1 text-xs font-mono font-medium text-sky-200">
                      {data.tag || "QUOTE"}
                    </div>
                  </div>

                  {/* Card Body: Quote */}
                  <div className="my-auto px-2">
                    <p className="text-[28px] font-medium leading-[42px] text-slate-100">
                      “{data.quote || "Quote text"}”
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400 font-mono">
                    <span className="text-slate-500">Image Studio Editorial · Authenticated</span>
                    <span className="text-sky-400">{data.tag}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Layout: Neon Cyber */}
            {data.layout === "neon-cyber" && (
              <div
                className="relative flex h-full w-full flex-col justify-between p-10 overflow-hidden font-mono border-2 border-cyan-400/50"
                style={{
                  background:
                    "radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(192, 132, 252, 0.15) 0%, transparent 50%), #040711",
                  boxShadow: "inset 0 0 50px rgba(56, 189, 248, 0.15), 0 0 40px rgba(56, 189, 248, 0.25)",
                }}
              >
                {/* Tech scanlines effect */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56, 189, 248, 0.4) 2px, rgba(56, 189, 248, 0.4) 4px)",
                  }}
                />

                {/* Cyber HUD Corner Brackets */}
                <div className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

                {/* Top Status Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 pb-3 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                    <span>TERMINAL_SPEECH // STREAM_ACTIVE</span>
                  </div>
                  <span className="text-fuchsia-400 tracking-widest">{data.tag || "CYBER_ID"}</span>
                </div>

                {/* Main Middle Row */}
                <div className="relative z-10 flex items-center gap-8 py-4">
                  {/* Cyber Avatar Box */}
                  <div className="relative shrink-0">
                    <div className="h-[140px] w-[140px] rounded-xl border-2 border-cyan-400/80 p-1 shadow-lg shadow-cyan-500/30 bg-black/60">
                      <img
                        src={data.avatar}
                        alt={data.author}
                        className="h-full w-full rounded-lg object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 rounded bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-black">
                      REC
                    </div>
                  </div>

                  {/* Speech Terminal Body */}
                  <div className="flex-1 space-y-3">
                    <div className="text-xs text-cyan-400/80 tracking-wide">
                      &gt; INPUT_LOG_PROMPT:
                    </div>
                    <p
                      className="text-[28px] font-semibold leading-[40px] text-white"
                      style={{ textShadow: "0 0 15px rgba(56, 189, 248, 0.4)" }}
                    >
                      "{data.quote || "Quote text"}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-[18px] font-bold text-cyan-300">
                        // {data.author}
                      </span>
                      <span className="text-xs text-fuchsia-400">
                        {data.handle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Soundwave Telemetry */}
                <div className="relative z-10 flex items-center justify-between border-t border-cyan-500/30 pt-3 text-[11px] text-cyan-400/70">
                  <div className="flex items-center gap-1">
                    {[12, 18, 8, 22, 14, 26, 10, 16, 24, 12, 19, 9, 23, 15, 27].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-cyan-400 rounded-sm"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <span>BUFFER: 100% OK · HIGH RESOLUTION</span>
                </div>
              </div>
            )}

            {/* 5. Layout: Magazine Editorial (High-Fashion / TIME Editorial) */}
            {data.layout === "magazine-editorial" && (
              <div
                className="relative flex h-full w-full items-center justify-between p-10 overflow-hidden font-serif border-2 border-amber-300/40"
                style={{
                  background: "radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 60%), #07070a",
                }}
              >
                {/* Left Typography Column */}
                <div className="flex flex-col justify-between h-full max-w-[550px] z-10 py-2">
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[11px] font-bold tracking-[3px] text-amber-400 uppercase">
                      ISSUE // 2026 EDITORIAL
                    </span>
                    <div className="h-0.5 w-12 bg-amber-400/40" />
                  </div>

                  <div className="relative my-auto py-4">
                    <div className="text-6xl text-amber-400/30 font-serif leading-none -mb-6 select-none">“</div>
                    <p className="text-[30px] font-bold leading-[42px] text-white tracking-wide">
                      {data.quote || "Quote text"}
                    </p>
                  </div>

                  <div className="border-t border-amber-500/20 pt-4 font-sans flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-amber-300 tracking-wider uppercase font-serif">
                        {data.author}
                      </div>
                      <div className="text-xs text-slate-400">{data.tag || data.handle}</div>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                      |||| | |||||| ||||
                    </span>
                  </div>
                </div>

                {/* Right Portrait Bleed */}
                <div className="relative h-[420px] w-[350px] shrink-0 overflow-hidden rounded-2xl border border-amber-400/30 shadow-2xl">
                  <img
                    src={data.avatar}
                    alt={data.author}
                    className="h-full w-full object-cover filter contrast-110"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 font-sans text-xs font-mono text-amber-300 font-bold">
                    PORTRAIT ARCHIVE 2026
                  </div>
                </div>
              </div>
            )}

            {/* 6. Layout: Vintage Polaroid Snapshot */}
            {data.layout === "polaroid-vintage" && (
              <div
                className="relative flex h-full w-full items-center justify-between p-12 overflow-hidden border border-stone-800"
                style={{
                  background: "radial-gradient(circle at 50% 50%, #1c1917 0%, #0c0a09 100%)",
                }}
              >
                {/* Left Tilted Polaroid Photo */}
                <div className="relative shrink-0 -rotate-2 transform">
                  {/* Tape */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 h-5 w-20 bg-amber-200/40 rounded-sm rotate-1 z-20 shadow-sm" />
                  <div className="flex flex-col items-center bg-[#fafaf9] p-3.5 pb-8 rounded shadow-2xl shadow-black/80 border border-stone-300">
                    <div className="h-[240px] w-[240px] overflow-hidden bg-black rounded-sm">
                      <img
                        src={data.avatar}
                        alt={data.author}
                        className="h-full w-full object-cover sepia-[0.3]"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <span className="mt-3 text-xs font-serif font-bold text-stone-800 tracking-wider">
                      {data.author}
                    </span>
                  </div>
                </div>

                {/* Right Handwritten Quote */}
                <div className="flex flex-col justify-between h-full max-w-[500px] ml-12 py-6 font-serif">
                  <div className="flex items-center justify-between text-xs text-amber-200/60 font-mono">
                    <span>HISTORICAL ARCHIVE</span>
                    <span>1984 VINTAGE</span>
                  </div>

                  <div className="my-auto py-2">
                    <p className="text-[28px] font-medium leading-[42px] text-stone-100 italic">
                      "{data.quote || "Quote text"}"
                    </p>
                  </div>

                  <div className="border-t border-stone-800 pt-4 flex items-center justify-between font-sans">
                    <div>
                      <div className="text-base font-bold text-amber-300 font-serif">{data.author}</div>
                      <div className="text-xs text-stone-400">{data.tag || data.handle}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full border-2 border-amber-400/40 flex items-center justify-center text-[8px] font-mono text-amber-300 uppercase rotate-12">
                      SEAL
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Layout: Anime Comic Speech Balloon */}
            {data.layout === "speech-bubble" && (
              <div
                className="relative flex h-full w-full items-center justify-between p-10 overflow-hidden border-2 border-pink-400/40"
                style={{
                  background: "radial-gradient(circle at 10% 20%, rgba(244, 114, 182, 0.15) 0%, transparent 60%), #0f0714",
                }}
              >
                {/* Left Comic Speech Bubble */}
                <div className="relative flex-1 bg-white/[0.08] backdrop-blur-md rounded-3xl p-8 border-2 border-pink-400/60 mr-8 shadow-[0_0_25px_rgba(244,114,182,0.2)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full bg-pink-500/20 px-3 py-0.5 text-xs font-bold text-pink-300 border border-pink-400/40">
                      ✦ MANGA DIALOG
                    </span>
                  </div>
                  <p className="text-[28px] font-bold leading-[40px] text-white">
                    "{data.quote || "Quote text"}"
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-pink-400/20 pt-3">
                    <span className="text-lg font-bold text-pink-300 font-mono">// {data.author}</span>
                    <span className="text-xs text-slate-400">{data.tag || data.handle}</span>
                  </div>
                </div>

                {/* Right Character Cut-in */}
                <div className="relative shrink-0">
                  <div className="h-[260px] w-[260px] rounded-3xl overflow-hidden border-4 border-pink-400 shadow-[0_0_30px_rgba(244,114,182,0.4)]">
                    <img
                      src={data.avatar}
                      alt={data.author}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. Layout: Developer IDE Terminal Quote */}
            {data.layout === "code-terminal" && (
              <div
                className="relative flex h-full w-full flex-col justify-between p-8 overflow-hidden rounded-xl border-2 border-emerald-500/60 bg-[#05080c] font-mono shadow-[0_0_30px_rgba(34,197,94,0.2)]"
              >
                {/* Titlebar */}
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 text-xs text-emerald-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <span className="ml-3 font-bold">src/philosophy/{data.author.toLowerCase().replace(/\s+/g, "_")}.ts</span>
                  </div>
                  <span className="text-emerald-500/80">TypeScript 5.8 // UTF-8</span>
                </div>

                {/* Code Window with Gutter */}
                <div className="flex items-start gap-6 my-auto py-2">
                  <div className="flex flex-col text-slate-600 select-none text-right font-mono text-sm space-y-1">
                    <span>01</span>
                    <span>02</span>
                    <span>03</span>
                    <span>04</span>
                    <span>05</span>
                    <span>06</span>
                  </div>
                  <div className="space-y-1 text-sm font-mono flex-1">
                    <div className="text-slate-500">// Quotation by {data.author} ({data.tag})</div>
                    <div>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-cyan-300">quote</span>:{" "}
                      <span className="text-emerald-400">Wisdom</span> = {"{"}
                    </div>
                    <div className="pl-6 text-emerald-300">
                      <span className="text-amber-300">content</span>:{" "}
                      <span className="text-white text-lg font-bold">"{data.quote}"</span>,
                    </div>
                    <div className="pl-6 text-slate-300">
                      <span className="text-amber-300">author</span>: <span className="text-cyan-300">"{data.author}"</span>,
                    </div>
                    <div className="pl-6 text-slate-300">
                      <span className="text-amber-300">verified</span>: <span className="text-purple-400">true</span>
                    </div>
                    <div>{"};"}</div>
                  </div>
                </div>

                {/* Statusline */}
                <div className="flex items-center justify-between border-t border-emerald-500/30 pt-2.5 text-xs text-emerald-400">
                  <span>NORMAL | main | 100% PASS</span>
                  <span>{data.handle}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between border-t border-white/8 bg-[#0a0c10]/80 px-4 py-2.5 text-xs text-slate-400 font-mono">
        <span>Quote Engine: <strong className="text-white font-mono">{QUOTE_WIDTH} × {QUOTE_HEIGHT} PX</strong> · Author: <strong className="text-sky-300">{data.author}</strong></span>
        {previewPngUrl && (
          <a
            href={previewPngUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#ff462b] hover:underline"
          >
            <span>Inspect Raw PNG Buffer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
