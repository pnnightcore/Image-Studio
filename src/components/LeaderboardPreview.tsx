import React, { useRef, useState, useEffect } from "react";
import type { LeaderboardData, ParticleConfig } from "../lib/types";
import { LEADERBOARD_WIDTH, calculateLeaderboardHeight } from "../lib/constants";
import { ParticleCanvas } from "./ParticleCanvas";
import { ParticleOverlayButton } from "./ParticleOverlayButton";
import { Download, Copy, Check, ExternalLink, Trophy } from "lucide-react";

interface LeaderboardPreviewProps {
  data: LeaderboardData;
  onGenerate: () => void;
  isGenerating: boolean;
  lastGeneratedBlob?: Blob | null;
  particleConfig?: ParticleConfig;
  onParticleConfigChange?: (config: ParticleConfig | undefined) => void;
}

export function LeaderboardPreview({
  data,
  onGenerate,
  isGenerating,
  lastGeneratedBlob,
  particleConfig,
  onParticleConfigChange,
}: LeaderboardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.7);
  const [zoomMode, setZoomMode] = useState<"fit" | "50" | "75" | "100">("fit");
  const [copied, setCopied] = useState<boolean>(false);
  const [previewPngUrl, setPreviewPngUrl] = useState<string | null>(null);

  const items = data.items || [];
  const layout = data.layout || "podium";
  const height = calculateLeaderboardHeight(items.length, layout);

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
        const newScale = Math.min(1, Math.max(0.35, availableWidth / LEADERBOARD_WIDTH));
        setScale(newScale);
      }
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [zoomMode, items.length, layout]);

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

  const top1 = items.find((i) => i.rank === 1) || items[0];
  const top2 = items.find((i) => i.rank === 2) || items[1];
  const top3 = items.find((i) => i.rank === 3) || items[2];
  const rest = items.filter((i) => i.rank > 3);

  return (
    <div className="flex flex-col rounded-xl border border-white/8 bg-[#0f1118] shadow-2xl overflow-hidden">
      {/* Studio Stage Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 bg-[#0a0c10]/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <h3 className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
              Leaderboard Stage Viewport
            </h3>
          </div>
          <span className="font-mono text-[10px] text-slate-300 rounded border border-white/10 bg-white/5 px-2 py-0.5">
            {LEADERBOARD_WIDTH} × {height} PX
          </span>
          <span className="text-[11px] font-mono text-slate-400">({items.length} members)</span>
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
            disabled={isGenerating || items.length === 0}
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

      {/* Viewport Canvas */}
      <div
        ref={containerRef}
        className="relative flex min-h-[480px] flex-1 items-start justify-center overflow-auto p-6 bg-studio-stage"
      >
        <div
          className="transition-transform duration-150 ease-out origin-top shadow-2xl"
          style={{
            transform: `scale(${scale})`,
            width: `${LEADERBOARD_WIDTH}px`,
            height: `${height}px`,
            marginBottom: `${Math.max(20, (1 - scale) * height * -0.3)}px`,
          }}
        >
          <div
            className="relative flex flex-col items-center select-none overflow-hidden rounded-[16px] shadow-2xl p-[18px]"
            style={{
              width: `${LEADERBOARD_WIDTH}px`,
              height: `${height}px`,
              background: "#18191c",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Particle Ambience Overlay */}
            {particleConfig && (
              <ParticleCanvas
                config={particleConfig}
                width={LEADERBOARD_WIDTH}
                height={height}
                playing={true}
                className="z-30"
              />
            )}

            {/* 1. Server Header Banner */}
            <div className="mb-[16px] flex h-[76px] w-full items-center justify-between rounded-[14px] border border-white/8 bg-white/[0.04] px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-[14px] border-2 border-amber-500/40 bg-[#0c0d12]">
                  <img
                    src={data.guildIcon}
                    alt="Guild"
                    className="h-[50px] w-[50px] rounded-[12px] object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] font-bold tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                    {data.guildName || "Server Leaderboard"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Top {items.length} Members · XP Ledger
                  </span>
                </div>
              </div>

              <div className="rounded border border-amber-500/35 bg-amber-500/15 px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider text-amber-300">
                {data.season || "SEASON 1"}
              </div>
            </div>

            {/* Layout Branching: compact-list, cyber-grid, minimal-cards, or podium */}
            {layout === "compact-list" ? (
              <div className="flex w-full flex-col gap-2">
                {items.map((item) => {
                  const rankColor =
                    item.rank === 1 ? "#f59e0b" : item.rank === 2 ? "#38bdf8" : item.rank === 3 ? "#f97316" : "#64748b";
                  return (
                    <div
                      key={item.rank}
                      className="flex h-[64px] w-full items-center rounded-[12px] border border-white/6 bg-white/[0.04] px-4 transition-all hover:bg-white/[0.07]"
                    >
                      <div className="mr-3 flex w-[32px] items-center justify-center font-mono font-bold text-[14px]">
                        <span style={{ color: rankColor }}>#{item.rank}</span>
                      </div>

                      <img
                        src={item.avatar}
                        alt={item.username}
                        className="mr-3.5 h-[44px] w-[44px] rounded-full border-2 object-cover bg-black/40"
                        style={{ borderColor: rankColor }}
                        crossOrigin="anonymous"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-semibold text-white">
                          {item.username}
                        </div>
                        <div className="text-[12px] text-slate-400 font-mono">{item.handle}</div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div
                          className="rounded px-2 py-0.5 text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${rankColor}22`,
                            color: rankColor,
                            border: `1px solid ${rankColor}44`,
                          }}
                        >
                          LVL {item.level}
                        </div>
                        <div className="mt-1 font-mono text-[12px] font-semibold text-slate-300">
                          {item.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : layout === "cyber-grid" ? (
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {items.map((item) => {
                  const rankColor =
                    item.rank === 1 ? "#38bdf8" : item.rank === 2 ? "#c084fc" : item.rank === 3 ? "#f59e0b" : "#475569";
                  return (
                    <div
                      key={item.rank}
                      className="relative flex h-[82px] items-center rounded-[14px] border p-2.5 bg-black/50 transition-all overflow-hidden"
                      style={{
                        borderColor: `${rankColor}55`,
                        boxShadow: `0 0 15px ${rankColor}12`,
                      }}
                    >
                      <div className="relative mr-2.5 shrink-0">
                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="h-[48px] w-[48px] rounded-xl object-cover border-2"
                          style={{ borderColor: rankColor }}
                          crossOrigin="anonymous"
                        />
                        <span
                          className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-black shadow font-mono"
                          style={{ backgroundColor: rankColor }}
                        >
                          {item.rank}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 font-mono">
                        <div className="truncate text-[13px] font-bold text-white">
                          {item.username}
                        </div>
                        <div className="truncate text-[10px] text-slate-400">
                          {item.handle}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span className="font-bold" style={{ color: rankColor }}>
                            Lv.{item.level}
                          </span>
                          <span className="text-slate-300 text-[10px]">
                            {item.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : layout === "minimal-cards" ? (
              <div className="flex w-full flex-col gap-2">
                {items.map((item) => {
                  const rankColor =
                    item.rank === 1 ? "#f59e0b" : item.rank === 2 ? "#38bdf8" : item.rank === 3 ? "#f97316" : "#818cf8";
                  const maxXp = items[0]?.xp || 1000;
                  const xpBarPercent = Math.min(100, Math.max(5, Math.round((item.xp / maxXp) * 100)));
                  return (
                    <div
                      key={item.rank}
                      className="flex h-[72px] w-full items-center rounded-[14px] border px-4 transition-all hover:bg-white/[0.08]"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: `${rankColor}44`,
                      }}
                    >
                      <div
                        className="mr-3.5 flex h-8 w-8 shrink-0 items-center justify-center rounded text-[13px] font-mono font-bold"
                        style={{
                          backgroundColor: `${rankColor}20`,
                          border: `1px solid ${rankColor}55`,
                          color: rankColor,
                        }}
                      >
                        #{item.rank}
                      </div>

                      <img
                        src={item.avatar}
                        alt={item.username}
                        className="mr-3.5 h-[46px] w-[46px] rounded-[12px] border-2 object-cover bg-black/40 shrink-0"
                        style={{ borderColor: rankColor }}
                        crossOrigin="anonymous"
                      />

                      <div className="min-w-0 flex-1 mr-3">
                        <div className="truncate text-[15px] font-bold text-white">
                          {item.username}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{item.handle}</div>
                      </div>

                      {/* Mini XP Bar */}
                      <div className="mr-4 hidden sm:flex w-[100px] flex-col gap-1">
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${xpBarPercent}%`,
                              backgroundColor: rankColor,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div
                          className="rounded px-2 py-0.5 text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${rankColor}20`,
                            color: rankColor,
                            border: `1px solid ${rankColor}55`,
                          }}
                        >
                          LVL {item.level}
                        </div>
                        <div className="mt-1 font-mono text-[12px] font-semibold text-slate-300">
                          {item.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : layout === "versus-duel" ? (
              /* Versus Duel Rivalry Arena */
              <div className="flex w-full flex-col gap-3">
                {/* Top 2 Head-to-Head Clash Banner */}
                <div className="relative flex h-[210px] w-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-red-950/40 via-[#0e1017] to-cyan-950/40 p-4 shadow-xl">
                  {/* Top Header */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-red-400 font-bold uppercase tracking-wider">CHALLENGER (RANK #1)</span>
                    <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-amber-300 font-bold border border-amber-400/40">
                      RIVALRY CLASH
                    </span>
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">DEFENDER (RANK #2)</span>
                  </div>

                  {/* Duel Combatants */}
                  <div className="flex items-center justify-between px-2">
                    {/* Player 1 */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={top1?.avatar}
                          alt="P1"
                          className="h-[68px] w-[68px] rounded-full border-2 border-red-500 bg-black/60 object-cover shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded bg-red-600 px-1.5 py-0.2 text-[10px] font-mono font-bold text-white shadow">
                          #1
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-[14px] font-bold text-white truncate max-w-[130px]">{top1?.username || "P1"}</div>
                        <div className="text-[11px] font-mono text-red-400 font-semibold">{top1?.xp.toLocaleString()} XP</div>
                      </div>
                    </div>

                    {/* Central VS Badge */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white font-extrabold text-sm shadow-[0_0_20px_#ef4444] border-2 border-white/20">
                        VS
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase">BATTLE ARENA</span>
                    </div>

                    {/* Player 2 */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={top2?.avatar}
                          alt="P2"
                          className="h-[68px] w-[68px] rounded-full border-2 border-cyan-400 bg-black/60 object-cover shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded bg-cyan-600 px-1.5 py-0.2 text-[10px] font-mono font-bold text-white shadow">
                          #2
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-[14px] font-bold text-white truncate max-w-[130px]">{top2?.username || "P2"}</div>
                        <div className="text-[11px] font-mono text-cyan-400 font-semibold">{top2?.xp.toLocaleString()} XP</div>
                      </div>
                    </div>
                  </div>

                  {/* XP Tug-of-war meter */}
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden flex">
                      <div
                        className="h-full rounded-l-full bg-red-500 transition-all duration-300"
                        style={{
                          width: `${Math.round(((top1?.xp || 1) / ((top1?.xp || 1) + (top2?.xp || 1))) * 100)}%`,
                        }}
                      />
                      <div
                        className="h-full rounded-r-full bg-cyan-400 transition-all duration-300"
                        style={{
                          width: `${100 - Math.round(((top1?.xp || 1) / ((top1?.xp || 1) + (top2?.xp || 1))) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Remaining Competitors (Ranks 3..N) */}
                {items.slice(2).map((item) => (
                  <div
                    key={item.rank}
                    className="flex h-[64px] w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3.5 transition hover:border-amber-400/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 font-mono text-xs font-bold text-slate-400 text-center">#{item.rank}</span>
                      <img
                        src={item.avatar}
                        alt={item.username}
                        className="h-10 w-10 rounded-lg object-cover bg-black/40 border border-white/10"
                        crossOrigin="anonymous"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{item.username}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.handle}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-white/10">
                        LVL {item.level}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300 mt-1">{item.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : layout === "hall-of-fame" ? (
              /* Golden Hall of Fame Plaque */
              <div className="flex w-full flex-col gap-3">
                {/* Grand Champion Centerpiece */}
                <div className="relative flex h-[230px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-[#241a06] via-[#141006] to-[#0a0803] p-5 shadow-2xl text-center">
                  <div className="text-[10px] font-serif font-bold tracking-widest text-amber-300 uppercase mb-1">
                    ❖ GRAND SOVEREIGN OF THE REALM ❖
                  </div>
                  <div className="relative my-1">
                    <img
                      src={top1?.avatar}
                      alt="Grand Champion"
                      className="h-[84px] w-[84px] rounded-full border-[3px] border-amber-400 bg-black/60 object-cover shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl select-none">👑</div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-2.5 py-0.2 text-[10px] font-mono font-bold text-black shadow">
                      CHAMPION #1
                    </div>
                  </div>
                  <div className="text-lg font-bold text-yellow-200 mt-2">{top1?.username || "Grand Champion"}</div>
                  <div className="text-xs font-mono text-amber-400 font-semibold">{top1?.xp.toLocaleString()} CHAMPION EXP</div>
                </div>

                {/* Remaining Guild Knights */}
                {items.slice(1).map((item) => (
                  <div
                    key={item.rank}
                    className="flex h-[64px] w-full items-center justify-between rounded-xl border border-amber-500/20 bg-amber-950/20 px-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 font-serif font-bold text-amber-300 text-center">#{item.rank}</span>
                      <img
                        src={item.avatar}
                        alt={item.username}
                        className="h-10 w-10 rounded-full object-cover bg-black/40 border border-amber-400/40"
                        crossOrigin="anonymous"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{item.username}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.handle}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-200 border border-amber-400/30">
                        RANK {item.rank}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300 mt-1">{item.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : layout === "tier-division" ? (
              /* Tier Division (S/A/B Tiers) */
              <div className="flex w-full flex-col gap-2">
                {items.map((item) => {
                  const isSTier = item.rank <= 2;
                  const isATier = item.rank > 2 && item.rank <= 5;
                  const tierLabel = isSTier ? "S-TIER" : isATier ? "A-TIER" : "B-TIER";
                  const tierColor = isSTier ? "#c084fc" : isATier ? "#38bdf8" : "#10b981";

                  return (
                    <div
                      key={item.rank}
                      className="flex h-[66px] w-full items-center justify-between rounded-xl border px-4 transition hover:bg-white/[0.06]"
                      style={{
                        backgroundColor: isSTier ? "rgba(147, 51, 234, 0.12)" : isATier ? "rgba(14, 165, 233, 0.08)" : "rgba(255, 255, 255, 0.03)",
                        borderColor: `${tierColor}44`,
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className="rounded px-2 py-0.5 text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${tierColor}20`,
                            color: tierColor,
                            border: `1px solid ${tierColor}55`,
                          }}
                        >
                          {tierLabel}
                        </span>
                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="h-10 w-10 rounded-lg object-cover bg-black/40 border"
                          style={{ borderColor: tierColor }}
                          crossOrigin="anonymous"
                        />
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{item.username}</span>
                            <span className="text-[11px] font-mono text-slate-400 font-normal">#{item.rank}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.handle}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-slate-400">LVL {item.level}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: tierColor }}>
                          {item.xp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : layout === "terminal-matrix" ? (
              /* Cyber Terminal Matrix Roster */
              <div className="flex w-full flex-col overflow-hidden rounded-xl border-2 border-emerald-500/60 bg-[#05080c] p-4 font-mono shadow-[0_0_25px_rgba(34,197,94,0.15)]">
                {/* Titlebar */}
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 text-[11px] text-emerald-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>[NETRUNNER LEADERBOARD // LIVE RECON]</span>
                  </div>
                  <span className="text-emerald-500/80">TOTAL AGENTS: {items.length}</span>
                </div>

                {/* Rows */}
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.rank}
                      className="flex h-[54px] items-center justify-between rounded-lg border border-emerald-500/25 bg-black/50 px-3 hover:border-emerald-400/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-400 text-xs w-6">
                          {String(item.rank).padStart(2, "0")}
                        </span>
                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="h-8 w-8 rounded border border-emerald-500/60 object-cover"
                          crossOrigin="anonymous"
                        />
                        <span className="text-sm font-bold text-emerald-300">
                          root@{item.username}:~#
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-500/80">LVL.{item.level}</span>
                        <span className="rounded bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 font-bold text-emerald-300">
                          {item.xp.toLocaleString()} EXP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* 2. Top 3 Podium */}
                <div className="mb-[16px] flex w-full items-end justify-center gap-2">
                  {/* Rank 2 (Left) */}
                  <div className="relative flex h-[232px] flex-1 flex-col items-center justify-end">
                    <div className="flex h-[152px] w-full flex-col items-center rounded-t-[14px] border-l border-r border-t-[3px] border-[#38bdf8] border-l-sky-500/20 border-r-sky-500/20 bg-gradient-to-b from-[#242a38] to-[#171b26] pt-[34px]">
                      <div className="w-[135px] truncate text-center text-[15px] font-semibold text-white">
                        {top2?.username || "Player 2"}
                      </div>
                      <div className="mt-[2px] text-[11px] text-slate-400 font-mono">{top2?.handle || "@player2"}</div>
                      <div className="mt-[10px] rounded bg-sky-500/15 px-2 py-0.5 text-[11px] font-mono font-semibold text-[#38bdf8]">
                        LVL {top2?.level ?? 1}
                      </div>
                      <div className="mt-[4px] text-[12px] font-mono font-medium text-[#38bdf8]">{top2?.xp ?? 0} XP</div>
                    </div>

                    <div className="absolute top-[18px] flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={top2?.avatar}
                          alt="Top 2"
                          className="h-[62px] w-[62px] rounded-full border-[3px] border-[#38bdf8] bg-black/50 object-cover shadow-lg"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute -bottom-2.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[#38bdf8] font-mono text-[12px] font-bold text-black shadow">
                          2
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rank 1 (Center) */}
                  <div className="relative flex h-[265px] flex-1 flex-col items-center justify-end">
                    <div className="flex h-[180px] w-full flex-col items-center rounded-t-[14px] border-l border-r border-t-[3px] border-[#f59e0b] border-l-amber-500/20 border-r-amber-500/20 bg-gradient-to-b from-[#382b1c] to-[#1e1913] pt-[36px]">
                      <div className="w-[145px] truncate text-center text-[16px] font-bold text-white">
                        {top1?.username || "Player 1"}
                      </div>
                      <div className="mt-[2px] text-[11px] text-slate-400 font-mono">{top1?.handle || "@player1"}</div>
                      <div className="mt-[10px] rounded bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#f59e0b]">
                        LVL {top1?.level ?? 1}
                      </div>
                      <div className="mt-[4px] text-[13px] font-mono font-bold text-[#f59e0b]">{top1?.xp ?? 0} XP</div>
                    </div>

                    <div className="absolute top-[12px] flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={top1?.avatar}
                          alt="Top 1"
                          className="h-[74px] w-[74px] rounded-full border-[3px] border-[#f59e0b] bg-black/50 object-cover shadow-xl"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute -bottom-2.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[#f59e0b] font-mono text-[12px] font-bold text-black shadow">
                          1
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rank 3 (Right) */}
                  <div className="relative flex h-[216px] flex-1 flex-col items-center justify-end">
                    <div className="flex h-[138px] w-full flex-col items-center rounded-t-[14px] border-l border-r border-t-[3px] border-[#f97316] border-l-orange-500/20 border-r-orange-500/20 bg-gradient-to-b from-[#2b201d] to-[#191516] pt-[32px]">
                      <div className="w-[135px] truncate text-center text-[15px] font-semibold text-white">
                        {top3?.username || "Player 3"}
                      </div>
                      <div className="mt-[2px] text-[11px] text-slate-400 font-mono">{top3?.handle || "@player3"}</div>
                      <div className="mt-[10px] rounded bg-orange-500/15 px-2 py-0.5 text-[11px] font-mono font-semibold text-[#f97316]">
                        LVL {top3?.level ?? 1}
                      </div>
                      <div className="mt-[4px] text-[12px] font-mono font-medium text-[#f97316]">{top3?.xp ?? 0} XP</div>
                    </div>

                    <div className="absolute top-[20px] flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={top3?.avatar}
                          alt="Top 3"
                          className="h-[58px] w-[58px] rounded-full border-[3px] border-[#f97316] bg-black/50 object-cover shadow-lg"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute -bottom-2.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[#f97316] font-mono text-[12px] font-bold text-black shadow">
                          3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Tier Rows (4..N) */}
                {rest.length > 0 && (
                  <div className="flex w-full flex-col gap-2">
                    {rest.map((item) => (
                      <div
                        key={item.rank}
                        className="flex h-[60px] w-full items-center rounded-[12px] border border-white/6 bg-white/[0.04] px-4 transition-all hover:bg-white/[0.07]"
                      >
                        <div className="mr-3 flex w-[28px] items-center justify-center font-mono text-[14px] font-bold text-slate-400">
                          #{item.rank}
                        </div>

                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="mr-3 h-[40px] w-[40px] rounded-full border border-white/10 bg-black/40 object-cover"
                          crossOrigin="anonymous"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[15px] font-semibold text-white">
                            {item.username}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.handle}</div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                            LVL {item.level}
                          </div>
                          <div className="mt-1 font-mono text-[12px] font-semibold text-slate-400">
                            {item.xp.toLocaleString()} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between border-t border-white/8 bg-[#0a0c10]/80 px-4 py-2.5 text-xs text-slate-400 font-mono">
        <span>Roster: <strong className="text-white font-mono">{items.length} players</strong> · Layout: <strong className="text-yellow-300">{layout.toUpperCase()}</strong></span>
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
