import React, { useRef, useState, useEffect } from "react";
import type { SongResult, ParticleConfig, SongLayout } from "../lib/types";
import { calculateHeight, CANVAS_WIDTH } from "../lib/constants";
import { ParticleCanvas } from "./ParticleCanvas";
import { ParticleOverlayButton } from "./ParticleOverlayButton";
import {
  Download,
  Copy,
  Check,
  Music,
  ExternalLink,
  Layers,
  ZoomIn,
  Sparkles,
} from "lucide-react";

interface ImagePreviewProps {
  title: string;
  songs: SongResult[];
  layout?: SongLayout;
  onGenerate: () => void;
  isGenerating: boolean;
  lastGeneratedBlob?: Blob | null;
  particleConfig?: ParticleConfig;
  onParticleConfigChange?: (config: ParticleConfig | undefined) => void;
}

export function ImagePreview({
  title,
  songs,
  layout = "auto",
  onGenerate,
  isGenerating,
  lastGeneratedBlob,
  particleConfig,
  onParticleConfigChange,
}: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomMode, setZoomMode] = useState<"fit" | "50" | "75" | "100">("fit");
  const [scale, setScale] = useState<number>(0.7);
  const [copied, setCopied] = useState<boolean>(false);
  const [previewPngUrl, setPreviewPngUrl] = useState<string | null>(null);

  const effectiveLayout: SongLayout =
    layout !== "auto"
      ? layout
      : songs.length <= 10
      ? "grid"
      : "list";

  const cols = songs.length <= 8 ? 4 : 5;
  const height = calculateHeight(songs.length, effectiveLayout);

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
        const newScale = Math.min(1, Math.max(0.35, availableWidth / CANVAS_WIDTH));
        setScale(newScale);
      }
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [zoomMode, songs.length, effectiveLayout]);

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
      console.warn("Failed to copy image to clipboard:", err);
    }
  };

  // Group songs based on layout
  const half = Math.ceil(songs.length / 2);
  const leftCol = songs.slice(0, half);
  const rightCol = songs.slice(half);
  const dualColRows = Array.from({ length: half }, (_, i) => [leftCol[i] || null, rightCol[i] || null]);

  const gridGroups = Array.from({ length: Math.ceil(songs.length / cols) }, (_, rIdx) =>
    Array.from({ length: cols }, (__, cIdx) => songs[rIdx * cols + cIdx] || null)
  );

  return (
    <div className="flex flex-col rounded-xl border border-white/8 bg-[#0f1118] shadow-2xl overflow-hidden">
      {/* Studio Stage Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 bg-[#0a0c10]/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <h3 className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
              Studio Stage Viewport
            </h3>
          </div>
          <span className="font-mono text-[10px] text-slate-300 rounded border border-white/10 bg-white/5 px-2 py-0.5">
            {CANVAS_WIDTH} × {height} PX
          </span>
          <span className="hidden text-[11px] font-mono text-slate-400 lg:inline">
            [{songs.length} Tracks · {effectiveLayout.toUpperCase()}]
          </span>
        </div>

        {/* Viewport Scale & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
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

          {/* Copy to clipboard */}
          {lastGeneratedBlob && (
            <button
              onClick={handleCopyBlob}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-white/10 transition tactile-press"
              title="Copy PNG buffer to system clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}

          {/* Export PNG */}
          <button
            onClick={onGenerate}
            disabled={isGenerating || songs.length === 0}
            className="flex items-center gap-1.5 rounded-md bg-[#ff462b] px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#ea381f] disabled:cursor-not-allowed disabled:opacity-40 transition-all tactile-press"
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

      {/* Canvas Stage Viewport Area with Precision Grid */}
      <div
        ref={containerRef}
        className="relative flex min-h-[460px] flex-1 items-start justify-center overflow-auto p-6 bg-studio-stage"
      >
        {songs.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <Music className="mb-3 h-10 w-10 text-slate-600" />
            <p className="font-['Space_Grotesk',sans-serif] text-sm font-semibold text-slate-400">
              Canvas is Empty
            </p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">
              Add track items or load a curated template from the left inspector.
            </p>
          </div>
        ) : (
          <div
            className="transition-transform duration-150 ease-out origin-top shadow-2xl"
            style={{
              transform: `scale(${scale})`,
              width: `${CANVAS_WIDTH}px`,
              height: `${height}px`,
              marginBottom: `${Math.max(20, (1 - scale) * height * -0.5)}px`,
            }}
          >
            <div
              className="relative select-none overflow-hidden rounded-[16px] shadow-2xl p-[14px]"
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${height}px`,
                background:
                  "radial-gradient(circle at 90% 100%, #1e1b4b 0%, transparent 60%), linear-gradient(135deg, #070913 0%, #0d1224 50%, #0a0e1c 100%)",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(91, 0, 184, 0.2)",
              }}
            >
              {/* Particle System Ambience Overlay */}
              {particleConfig && (
                <ParticleCanvas
                  config={particleConfig}
                  width={CANVAS_WIDTH}
                  height={height}
                  playing={true}
                  className="z-30"
                />
              )}

              {/* Header */}
              <div className="flex h-[65px] flex-col items-center justify-center pt-2">
                <h2
                  className="text-center font-normal tracking-wide text-white"
                  style={{
                    fontSize: "26px",
                    lineHeight: "32px",
                    fontFamily: "'Plus Jakarta Sans', Roboto, sans-serif",
                  }}
                >
                  {title || "Search Results"}
                </h2>
                <div className="mt-2 h-[2px] w-[60px] rounded-full bg-white/40" />
              </div>

              {/* Grid / List / Showcase / Queue Content */}
              {effectiveLayout === "showcase" ? (
                /* Hero Showcase layout */
                <div className="mt-[12px] flex flex-col gap-[14px]">
                  {/* Hero Item #1 */}
                  {songs[0] && (
                    <div className="relative flex h-[165px] w-full items-center justify-between overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-[#180e06] via-[#120a1c] to-[#0a0614] p-5 shadow-2xl shadow-amber-500/10">
                      <div className="flex items-center gap-6">
                        {/* Artwork with Vinyl Platter preview */}
                        <div className="relative shrink-0">
                          <div className="h-[125px] w-[125px] overflow-hidden rounded-xl border border-amber-400/40 shadow-lg">
                            <img
                              src={songs[0].avatar}
                              alt={songs[0].displayName}
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 border border-amber-400/40 uppercase">
                              ★ FEATURED MASTER #1
                            </span>
                            <span className="text-[11px] font-mono text-purple-300">
                              {songs[0].source?.toUpperCase() || "AUDIO"}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow-md line-clamp-1 max-w-[650px]">
                            {songs[0].displayName}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-300">
                            <span>{songs[0].author || "Featured Artist"}</span>
                            <span>•</span>
                            <span className="font-mono text-amber-300 font-bold">{songs[0].time}</span>
                            {songs[0].views && <span>• {songs[0].views}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Equalizer Wave Badge */}
                      <div className="flex flex-col items-end gap-2 pr-4">
                        <div className="flex items-end gap-1 h-8">
                          <div className="w-1.5 bg-amber-400 rounded-t h-4" />
                          <div className="w-1.5 bg-amber-300 rounded-t h-7" />
                          <div className="w-1.5 bg-purple-400 rounded-t h-5" />
                          <div className="w-1.5 bg-purple-300 rounded-t h-8" />
                          <div className="w-1.5 bg-amber-400 rounded-t h-3" />
                        </div>
                        <span className="text-[10px] font-mono text-amber-300/80 uppercase">MASTER HI-RES</span>
                      </div>
                    </div>
                  )}

                  {/* Sub-tracks (items 2..N) */}
                  {songs.length > 1 && (
                    <div className="flex flex-col gap-[8px]">
                      {Array.from({ length: Math.ceil((songs.length - 1) / 2) }, (_, rowIdx) => {
                        const s1 = songs[1 + rowIdx * 2];
                        const s2 = songs[2 + rowIdx * 2];
                        return (
                          <div key={rowIdx} className="flex flex-row gap-[14px]">
                            <div className="w-[543px]">
                              {s1 ? <VideoListItem song={s1} /> : <div className="h-[76px]" />}
                            </div>
                            <div className="w-[543px]">
                              {s2 ? <VideoListItem song={s2} /> : <div className="h-[76px]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : effectiveLayout === "compact-queue" ? (
                /* Compact Queue layout (Single Column Spotify style) */
                <div className="mt-[12px] flex flex-col gap-[6px]">
                  {songs.map((song, idx) => (
                    <div
                      key={song.index || idx}
                      className="flex h-[52px] w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 transition hover:border-amber-400/40 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                        <span className="w-6 shrink-0 font-mono text-xs font-bold text-amber-400 text-center">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10">
                          <img
                            src={song.avatar}
                            alt={song.displayName}
                            className="h-full w-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <span className="text-sm font-semibold text-white truncate max-w-[550px]">
                          {song.displayName}
                        </span>
                        {song.author && (
                          <span className="text-xs text-slate-400 truncate max-w-[200px]">
                            — {song.author}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {song.source && (
                          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-white/5 uppercase">
                            {song.source}
                          </span>
                        )}
                        <span className="rounded bg-black/40 px-2 py-0.5 text-xs font-mono font-bold text-amber-300 border border-white/10">
                          {song.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : effectiveLayout === "grid" ? (
                /* Large Card Grid layout (<= 10 tracks) */
                <div className="mt-[12px] flex flex-col gap-[16px]">
                  {gridGroups.map((group, rIdx) => (
                    <div key={rIdx} className="flex flex-row gap-[16px]">
                      {group.map((item, cIdx) =>
                        item ? (
                          <GridCardItem key={item.index} song={item} cols={cols} />
                        ) : (
                          <div
                            key={cIdx}
                            className={cols === 5 ? "w-[206px] h-[245px]" : "w-[261px] h-[275px]"}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              ) : effectiveLayout === "list" ? (
                /* 2-column Video List layout (> 10 tracks) */
                <div className="mt-[12px] flex flex-col gap-[8px]">
                  {dualColRows.map(([leftSong, rightSong], rowIdx) => (
                    <div key={rowIdx} className="flex flex-row gap-[14px]">
                      <div className="w-[543px]">
                        {leftSong ? <VideoListItem song={leftSong} /> : <div className="h-[76px]" />}
                      </div>
                      <div className="w-[543px]">
                        {rightSong ? <VideoListItem song={rightSong} /> : <div className="h-[76px]" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Classic 2-column Pills layout */
                <div className="mt-[12px] flex flex-col gap-[8px]">
                  {dualColRows.map(([leftSong, rightSong], rowIdx) => (
                    <div key={rowIdx} className="flex flex-row gap-[14px]">
                      <div className="w-[543px]">
                        {leftSong ? <ClassicListItem song={leftSong} /> : <div className="h-[80px]" />}
                      </div>
                      <div className="w-[543px]">
                        {rightSong ? <ClassicListItem song={rightSong} /> : <div className="h-[80px]" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stage Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-white/8 bg-[#0a0c10]/80 px-4 py-2.5 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-3 text-[11px]">
          <span>Resolution: <strong className="text-white">{CANVAS_WIDTH} × {height} px</strong></span>
          <span className="text-slate-600">|</span>
          <span>Layout: <strong className="text-amber-300">{effectiveLayout.toUpperCase()}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Tracks: <strong className="text-white">{songs.length} / 20</strong></span>
        </div>

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

/* Video List Component */
function VideoListItem({ song }: { song: SongResult }) {
  const [failed, setFailed] = useState(false);
  const subtitle = song.author
    ? `${song.author} · ${song.views || song.time}`
    : `${song.source} · ${song.views || song.time}`;

  return (
    <div className="flex h-[76px] w-[543px] items-center rounded-[12px] bg-[#121626]/75 px-[12px] transition-transform hover:brightness-110">
      <div className="mr-[8px] flex w-[24px] shrink-0 items-center justify-center text-[14px] font-semibold text-white/40">
        {song.index}
      </div>

      <div className="relative mr-[14px] h-[64px] w-[114px] shrink-0 overflow-hidden rounded-[8px] bg-black/50">
        {!failed && song.avatar ? (
          <img
            src={song.avatar}
            alt={song.displayName}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-purple-950/60 text-purple-300">
            <Music className="h-5 w-5" />
          </div>
        )}
        <div className="absolute bottom-[3px] right-[3px] rounded-[4px] bg-black/85 px-[5px] py-[1px] font-mono text-[11px] font-semibold text-white">
          {song.time || "03:00"}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="truncate text-[16px] font-medium leading-[22px] text-white">
          {song.displayName}
        </div>
        <div className="mt-[4px] truncate text-[13px] leading-[16px] text-[#818cf8]">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

/* Grid Card Component */
function GridCardItem({ song, cols = 4 }: { song: SongResult; cols?: number }) {
  const [failed, setFailed] = useState(false);
  const subtitle = song.author
    ? `by ${song.author} · ${song.views || song.time}`
    : `by ${song.source} · ${song.views || song.time}`;

  const is5Cols = cols === 5;

  return (
    <div
      className={`flex flex-col rounded-[16px] bg-[#121626]/65 p-[6px] transition-transform hover:brightness-110 ${
        is5Cols ? "w-[206px] h-[245px]" : "w-[261px] h-[275px]"
      }`}
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-[14px] bg-black/50 ${
          is5Cols ? "h-[175px]" : "h-[210px]"
        }`}
      >
        {!failed && song.avatar ? (
          <img
            src={song.avatar}
            alt={song.displayName}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-purple-950/60 text-purple-300">
            <Music className="h-8 w-8" />
          </div>
        )}
        <div
          className={`absolute top-[8px] left-[8px] flex items-center justify-center rounded-full bg-black/80 font-bold text-white shadow-md border border-white/30 font-mono ${
            is5Cols ? "h-[26px] w-[26px] text-[11px]" : "h-[30px] w-[30px] text-[13px]"
          }`}
        >
          {song.index}
        </div>
        <div
          className={`absolute bottom-[8px] right-[8px] flex items-center justify-center rounded-full bg-black/80 text-white shadow-md border border-white/30 ${
            is5Cols ? "h-[32px] w-[32px] text-[11px]" : "h-[38px] w-[38px] text-[13px]"
          }`}
        >
          ▶
        </div>
      </div>

      <div
        className={`mt-[10px] truncate font-semibold leading-[22px] text-white ${
          is5Cols ? "text-[14px]" : "text-[16px]"
        }`}
      >
        {song.displayName}
      </div>
      <div
        className={`mt-[3px] truncate leading-[16px] text-[#818cf8] ${
          is5Cols ? "text-[11px]" : "text-[13px]"
        }`}
      >
        {subtitle}
      </div>
    </div>
  );
}

/* Classic List Item Component */
function ClassicListItem({ song }: { song: SongResult }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-[80px] w-[543px] items-center rounded-[12px] bg-[#2d2c46]/80 px-[14px] transition-transform hover:brightness-105">
      <div className="mr-[14px] flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white/15 text-[18px] font-medium text-white">
        {song.index}
      </div>

      <div className="relative mr-[16px] h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full bg-purple-950/70">
        {!failed && song.avatar ? (
          <img
            src={song.avatar}
            alt={song.displayName}
            onError={() => setFailed(true)}
            className="h-[48px] w-[48px] rounded-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-purple-300">
            <Music className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="truncate text-[19px] font-normal leading-[24px] text-white">
          {song.displayName}
        </div>
        <div className="mt-[4px] text-[15px] leading-[18px] text-white/65">
          {song.time} - {song.source}
        </div>
      </div>
    </div>
  );
}
