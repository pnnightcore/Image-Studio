import React, { useState } from "react";
import type { ProfileData } from "../lib/types";
import { defaultProfileData } from "../lib/sample-data";
import { PROFILE_WIDTH, PROFILE_HEIGHT } from "../lib/constants";
import { Download, Code2, Sliders, AlertCircle, FileCheck, User } from "lucide-react";

interface ProfileFormProps {
  data: ProfileData;
  onChange: (newData: ProfileData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ProfileForm({
  data,
  onChange,
  onGenerate,
  isGenerating,
}: ProfileFormProps) {
  const [tab, setTab] = useState<"visual" | "json">("visual");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(data, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const syncJson = (newData: ProfileData) => {
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
      setJsonError(e.message || "Invalid JSON format");
    }
  };

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
            <Sliders className="h-3.5 w-3.5 text-rose-400" />
            <span>Visual Inspector</span>
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
            onChange(defaultProfileData);
            syncJson(defaultProfileData);
          }}
          className="rounded px-2 py-1 font-mono text-[11px] text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          Reset Default
        </button>
      </div>

      {tab === "visual" ? (
        <div className="space-y-3">
          {/* Theme Selector */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-rose-400">
                Visual Theme Style
              </label>
              <span className="font-mono text-[10px] text-slate-400 uppercase">
                {data.theme || "ruby-poly"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "ruby-poly", name: "Ruby Poly", color: "from-rose-600 to-pink-700" },
                { id: "cyber-neon", name: "Cyber Neon", color: "from-cyan-500 to-purple-600" },
                { id: "glass-minimal", name: "Glass Emerald", color: "from-emerald-500 to-teal-700" },
                { id: "gold-legend", name: "Gold Legend", color: "from-amber-500 to-yellow-600" },
                { id: "cosmic-void", name: "Cosmic Void", color: "from-purple-600 to-indigo-800" },
                { id: "frost-glacier", name: "Frost Glacier", color: "from-sky-400 to-blue-600" },
                { id: "sakura-duelist", name: "Sakura Duelist", color: "from-pink-400 to-rose-400" },
                { id: "hacker-terminal", name: "Hacker Terminal", color: "from-emerald-400 to-green-600" },
              ].map((t) => {
                const isSelected = (data.theme || "ruby-poly") === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      const next = { ...data, theme: t.id as any };
                      onChange(next);
                      syncJson(next);
                    }}
                    className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                      isSelected
                        ? "border-rose-400/80 bg-[#19161e] text-white shadow-sm"
                        : "border-white/5 bg-[#090a0f] text-slate-400 hover:border-white/15 hover:text-slate-200"
                    }`}
                  >
                    <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${t.color} mb-1.5`} />
                    <span className="text-[11px] font-semibold">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Username Handle
            </label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => {
                const next = { ...data, username: e.target.value };
                onChange(next);
                syncJson(next);
              }}
              placeholder="e.g. __ziji"
              className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-xs text-white focus:border-[#ff462b] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Honor Badge
              </label>
              <input
                type="text"
                value={data.badge || ""}
                onChange={(e) => {
                  const next = { ...data, badge: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="e.g. ★ TOP 1 GUILD"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Title / Subtitle
              </label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => {
                  const next = { ...data, title: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="e.g. Ruby Grandmaster"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Balance / Currency
              </label>
              <input
                type="text"
                value={data.balance}
                onChange={(e) => {
                  const next = { ...data, balance: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="13,080 xu"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white focus:border-[#ff462b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Rank Badge
              </label>
              <input
                type="text"
                value={data.rank}
                onChange={(e) => {
                  const next = { ...data, rank: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="#1"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 text-xs text-white focus:border-[#ff462b] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Level
              </label>
              <input
                type="number"
                value={data.level}
                onChange={(e) => {
                  const next = { ...data, level: parseInt(e.target.value) || 1 };
                  onChange(next);
                  syncJson(next);
                }}
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Current XP
              </label>
              <input
                type="number"
                value={data.currentXp}
                onChange={(e) => {
                  const next = { ...data, currentXp: parseInt(e.target.value) || 0 };
                  onChange(next);
                  syncJson(next);
                }}
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Required XP
              </label>
              <input
                type="number"
                value={data.requiredXp}
                onChange={(e) => {
                  const next = { ...data, requiredXp: parseInt(e.target.value) || 1 };
                  onChange(next);
                  syncJson(next);
                }}
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-2 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={data.avatar}
              onChange={(e) => {
                const next = { ...data, avatar: e.target.value };
                onChange(next);
                syncJson(next);
              }}
              placeholder="https://..."
              className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={12}
            className="w-full resize-y rounded-lg border border-white/10 bg-[#07080c] p-3 font-mono text-xs leading-relaxed text-rose-200 shadow-inner focus:border-[#ff462b] focus:outline-none"
          />
          {jsonError ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{jsonError}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/25 px-3 py-1.5 font-mono text-xs text-emerald-300">
              <FileCheck className="h-4 w-4 text-emerald-400" />
              <span>Valid Profile Schema</span>
            </div>
          )}
        </div>
      )}

      {/* Render Trigger */}
      <div className="pt-1 border-t border-white/8">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !!jsonError}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff462b] py-3 text-xs font-semibold text-white shadow-md shadow-[#ff462b]/20 hover:bg-[#ea381f] disabled:cursor-not-allowed disabled:opacity-40 transition-all tactile-press"
        >
          {isGenerating ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Rendering Profile PNG ({PROFILE_WIDTH} × {PROFILE_HEIGHT}px)...</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Render Profile Card ({PROFILE_WIDTH} × {PROFILE_HEIGHT}px)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
