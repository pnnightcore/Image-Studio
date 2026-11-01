import React, { useState } from "react";
import type { LeaderboardData, LeaderboardItem } from "../lib/types";
import { defaultLeaderboardData } from "../lib/sample-data";
import { LEADERBOARD_WIDTH, calculateLeaderboardHeight } from "../lib/constants";
import { Download, Code2, Sliders, AlertCircle, FileCheck, Plus, Trash2, Trophy } from "lucide-react";

interface LeaderboardFormProps {
  data: LeaderboardData;
  onChange: (newData: LeaderboardData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function LeaderboardForm({
  data,
  onChange,
  onGenerate,
  isGenerating,
}: LeaderboardFormProps) {
  const [tab, setTab] = useState<"visual" | "json">("visual");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(data, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const syncJson = (newData: LeaderboardData) => {
    setJsonText(JSON.stringify(newData, null, 2));
    setJsonError(null);
  };

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      onChange(parsed);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || "Invalid JSON");
    }
  };

  const handleAddItem = () => {
    const nextRank = data.items.length + 1;
    const newItem: LeaderboardItem = {
      rank: nextRank,
      username: `Player ${nextRank}`,
      handle: `@player${nextRank}`,
      avatar: "https://i.ytimg.com/vi/MsHvLrs6sjk/hq720.jpg",
      level: 1,
      xp: 0,
    };
    const next = { ...data, items: [...data.items, newItem] };
    onChange(next);
    syncJson(next);
  };

  const handleUpdateItem = (index: number, updated: LeaderboardItem) => {
    const nextItems = [...data.items];
    nextItems[index] = updated;
    const next = { ...data, items: nextItems };
    onChange(next);
    syncJson(next);
  };

  const handleDeleteItem = (index: number) => {
    const nextItems = data.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, rank: i + 1 }));
    const next = { ...data, items: nextItems };
    onChange(next);
    syncJson(next);
  };

  const height = calculateLeaderboardHeight(data.items.length, data.layout);

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Mode switch */}
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab("visual")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "visual"
                ? "bg-[#1d2232] text-white border border-white/10 font-semibold"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-yellow-400" />
            <span>Roster Visual ({data.items.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("json")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "json"
                ? "bg-[#1d2232] text-white border border-white/10 font-semibold"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-slate-400" />
            <span>JSON Raw</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onChange(defaultLeaderboardData);
            syncJson(defaultLeaderboardData);
          }}
          className="rounded px-2 py-1 font-mono text-[11px] text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          Reset Sample
        </button>
      </div>

      {tab === "visual" ? (
        <div className="space-y-3.5">
          {/* Layout Selector */}
          <div>
            <label className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-yellow-400">
              Leaderboard Layout
            </label>
            <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "podium", name: "Podium Stage", desc: "Top 3 Tiered Highlight" },
                { id: "compact-list", name: "Compact Ledger", desc: "Ranked Linear Ledger" },
                { id: "cyber-grid", name: "Cyber Grid", desc: "Dual Channel Grid" },
                { id: "minimal-cards", name: "Frosted Cards", desc: "Progress Metric Cards" },
              ].map((l) => {
                const isSelected = (data.layout || "podium") === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      const next = { ...data, layout: l.id as any };
                      onChange(next);
                      syncJson(next);
                    }}
                    className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                      isSelected
                        ? "border-yellow-400/80 bg-[#1c1a14] text-white shadow-sm"
                        : "border-white/5 bg-[#090a0f] text-slate-400 hover:border-white/15 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xs font-semibold">{l.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{l.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Guild / Server
              </label>
              <input
                type="text"
                value={data.guildName || ""}
                onChange={(e) => {
                  const next = { ...data, guildName: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="e.g. Arcane Guild"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Season Tag
              </label>
              <input
                type="text"
                value={data.season || ""}
                onChange={(e) => {
                  const next = { ...data, season: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="SEASON 01"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Guild Emblem URL
              </label>
              <input
                type="url"
                value={data.guildIcon}
                onChange={(e) => {
                  const next = { ...data, guildIcon: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="https://..."
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-yellow-400">
              Player Roster
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 rounded-md border border-white/10 bg-[#161a26] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#1e2334] transition"
            >
              <Plus className="h-3.5 w-3.5 text-yellow-400" />
              <span>Add Player</span>
            </button>
          </div>

          <div className="max-h-[360px] space-y-1.5 overflow-y-auto pr-1">
            {data.items.map((item, idx) => (
              <div
                key={`${item.rank}-${idx}`}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-[#090a0f] p-2 hover:border-white/15 transition"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold text-yellow-400 bg-white/5 border border-white/10">
                  {item.rank}
                </span>

                <div className="grid flex-1 grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={item.username}
                    onChange={(e) =>
                      handleUpdateItem(idx, { ...item, username: e.target.value })
                    }
                    placeholder="Username"
                    className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs text-white focus:border-[#ff462b] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.handle}
                    onChange={(e) =>
                      handleUpdateItem(idx, { ...item, handle: e.target.value })
                    }
                    placeholder="@handle"
                    className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs text-slate-400 focus:border-[#ff462b] focus:outline-none font-mono"
                  />
                </div>

                <div className="flex w-32 items-center gap-1.5 font-mono text-xs">
                  <input
                    type="number"
                    value={item.level}
                    onChange={(e) =>
                      handleUpdateItem(idx, {
                        ...item,
                        level: parseInt(e.target.value) || 1,
                      })
                    }
                    placeholder="Lv"
                    className="w-12 rounded border border-white/10 bg-black/40 px-1.5 py-1 text-xs text-white text-center focus:border-[#ff462b] focus:outline-none"
                  />
                  <input
                    type="number"
                    value={item.xp}
                    onChange={(e) =>
                      handleUpdateItem(idx, {
                        ...item,
                        xp: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="XP"
                    className="w-16 rounded border border-white/10 bg-black/40 px-1.5 py-1 text-xs text-yellow-300 text-center focus:border-[#ff462b] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(idx)}
                  className="rounded p-1 text-slate-500 hover:text-red-400 transition"
                  title="Remove player"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-lg border border-white/10 bg-[#07080c] p-3 font-mono text-xs leading-relaxed text-yellow-200 shadow-inner focus:border-[#ff462b] focus:outline-none"
          />
          {jsonError ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{jsonError}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/25 px-3 py-1.5 font-mono text-xs text-emerald-300">
              <FileCheck className="h-4 w-4 text-emerald-400" />
              <span>Valid Leaderboard Schema</span>
            </div>
          )}
        </div>
      )}

      {/* Render Trigger */}
      <div className="pt-1 border-t border-white/8">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !!jsonError || data.items.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff462b] py-3 text-xs font-semibold text-white shadow-md shadow-[#ff462b]/20 hover:bg-[#ea381f] disabled:cursor-not-allowed disabled:opacity-40 transition-all tactile-press"
        >
          {isGenerating ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Rendering Leaderboard ({LEADERBOARD_WIDTH} × {height}px)...</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Render Leaderboard ({LEADERBOARD_WIDTH} × {height}px)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
