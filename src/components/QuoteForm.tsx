import React, { useState } from "react";
import type { QuoteData } from "../lib/types";
import { defaultQuoteData } from "../lib/sample-data";
import { QUOTE_WIDTH, QUOTE_HEIGHT } from "../lib/constants";
import { Download, Code2, Sliders, AlertCircle, FileCheck, Quote } from "lucide-react";

interface QuoteFormProps {
  data: QuoteData;
  onChange: (newData: QuoteData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function QuoteForm({
  data,
  onChange,
  onGenerate,
  isGenerating,
}: QuoteFormProps) {
  const [tab, setTab] = useState<"visual" | "json">("visual");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(data, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const syncJson = (newData: QuoteData) => {
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
            <Sliders className="h-3.5 w-3.5 text-sky-400" />
            <span>Editorial Form</span>
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
            onChange(defaultQuoteData);
            syncJson(defaultQuoteData);
          }}
          className="rounded px-2 py-1 font-mono text-[11px] text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          Reset Default
        </button>
      </div>

      {tab === "visual" ? (
        <div className="space-y-3.5">
          {/* Layout Selector without generic emojis */}
          <div>
            <label className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-sky-400">
              Editorial Typography Layout
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "split-portrait", name: "Split Cinema", desc: "Left bleed with shadow fade" },
                { id: "centered-minimal", name: "Centered Editorial", desc: "Monastic typographic symmetry" },
                { id: "modern-card", name: "Modern Studio", desc: "Layered glass frame" },
                { id: "neon-cyber", name: "Cyber Terminal", desc: "HUD telemetry quote" },
                { id: "magazine-editorial", name: "Magazine Cover", desc: "High-fashion Vogue editorial" },
                { id: "polaroid-vintage", name: "Polaroid Film", desc: "Retro snapshot with tape" },
                { id: "speech-bubble", name: "Anime Bubble", desc: "Manga dialog with action lines" },
                { id: "code-terminal", name: "IDE Terminal", desc: "Developer docstring quote" },
              ].map((l) => {
                const isSelected = (data.layout || "split-portrait") === l.id;
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
                        ? "border-sky-400/80 bg-[#141b25] text-white shadow-sm"
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

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Quotation Body Text
            </label>
            <textarea
              value={data.quote}
              onChange={(e) => {
                const next = { ...data, quote: e.target.value };
                onChange(next);
                syncJson(next);
              }}
              rows={3}
              placeholder="Enter quote message..."
              className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Author
              </label>
              <input
                type="text"
                value={data.author}
                onChange={(e) => {
                  const next = { ...data, author: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="Author Name"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Handle / Attribution
              </label>
              <input
                type="text"
                value={data.handle}
                onChange={(e) => {
                  const next = { ...data, handle: e.target.value };
                  onChange(next);
                  syncJson(next);
                }}
                placeholder="@username"
                className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Watermark / Corner Tag
            </label>
            <input
              type="text"
              value={data.tag}
              onChange={(e) => {
                const next = { ...data, tag: e.target.value };
                onChange(next);
                syncJson(next);
              }}
              placeholder="e.g. Image Studio Editorial Series"
              className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Subject Avatar URL
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
              className="mt-0.5 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3 py-1.5 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={12}
            className="w-full resize-y rounded-lg border border-white/10 bg-[#07080c] p-3 font-mono text-xs leading-relaxed text-sky-200 shadow-inner focus:border-[#ff462b] focus:outline-none"
          />
          {jsonError ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{jsonError}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/25 px-3 py-1.5 font-mono text-xs text-emerald-300">
              <FileCheck className="h-4 w-4 text-emerald-400" />
              <span>Valid Quote Schema</span>
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
              <span>Rendering Quote Card ({QUOTE_WIDTH} × {QUOTE_HEIGHT}px)...</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Render Quote Card ({QUOTE_WIDTH} × {QUOTE_HEIGHT}px)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
