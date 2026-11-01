import React, { useState } from "react";
import type { CustomElement } from "../lib/types";
import {
  TEXT_SHADOW_PRESETS,
  buildTextShadowString,
  computeElementTextShadow,
  type TextShadowPreset,
} from "../lib/text-effects";
import {
  Sparkles,
  Sun,
  Moon,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Palette,
  Eye,
} from "lucide-react";

interface TextShadowControlPanelProps {
  element: CustomElement;
  onChange: (patch: Partial<CustomElement>) => void;
}

const SHADOW_COLOR_SWATCHES = [
  { name: "Black 85%", hex: "rgba(0, 0, 0, 0.85)" },
  { name: "Pure Black", hex: "#000000" },
  { name: "Dark Carbon", hex: "#0f1118" },
  { name: "Deep Navy", hex: "#030712" },
  { name: "Dark Red", hex: "#450a0a" },
  { name: "Dark Slate", hex: "rgba(30, 41, 59, 0.9)" },
];

const GLOW_COLOR_SWATCHES = [
  { name: "Vermilion", hex: "#ff462b" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Gold", hex: "#facc15" },
  { name: "Crimson", hex: "#f43f5e" },
  { name: "Cyan", hex: "#38bdf8" },
  { name: "Emerald", hex: "#34d399" },
  { name: "Lime", hex: "#c8f049" },
  { name: "Pure White", hex: "#ffffff" },
];

export function TextShadowControlPanel({ element, onChange }: TextShadowControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "shadow" | "glow" | "custom">("presets");
  const [copiedCss, setCopiedCss] = useState(false);
  const [showShadowSwatches, setShowShadowSwatches] = useState(false);
  const [showGlowSwatches, setShowGlowSwatches] = useState(false);

  // Current effective text-shadow
  const currentTextShadow = element.textShadow !== undefined && element.textShadow !== ""
    ? element.textShadow
    : (computeElementTextShadow(element) || "");

  const hasAnyEffect = Boolean(currentTextShadow && currentTextShadow !== "none");

  // Apply a quick preset
  const handleApplyPreset = (preset: TextShadowPreset) => {
    if (!preset.value) {
      onChange({
        textShadow: "",
        shadowEnabled: false,
        glowEnabled: false,
      });
      return;
    }

    if (preset.id === "soft-shadow") {
      onChange({
        textShadow: preset.value,
        shadowEnabled: true,
        shadowOffsetX: 2,
        shadowOffsetY: 3,
        shadowBlur: 6,
        shadowColor: "rgba(0, 0, 0, 0.85)",
        glowEnabled: false,
      });
    } else if (preset.id === "deep-3d-shadow") {
      onChange({
        textShadow: preset.value,
        shadowEnabled: true,
        shadowOffsetX: 3,
        shadowOffsetY: 4,
        shadowBlur: 14,
        shadowColor: "rgba(0, 0, 0, 0.95)",
        glowEnabled: false,
      });
    } else if (preset.category === "glow") {
      const glowColor =
        preset.id === "cyan-glow"
          ? "#38bdf8"
          : preset.id === "gold-glow"
          ? "#facc15"
          : preset.id === "rose-glow"
          ? "#f43f5e"
          : preset.id === "emerald-glow"
          ? "#34d399"
          : "#c084fc";

      onChange({
        textShadow: preset.value,
        glowEnabled: true,
        glowColor,
        glowBlur: 14,
        glowIntensity: preset.id === "white-neon-purple" ? "neon" : "medium",
        shadowEnabled: false,
      });
    } else if (preset.category === "combo") {
      onChange({
        textShadow: preset.value,
        shadowEnabled: true,
        shadowOffsetX: 2,
        shadowOffsetY: 3,
        shadowBlur: 6,
        shadowColor: "rgba(0, 0, 0, 0.9)",
        glowEnabled: true,
        glowColor: preset.id === "fire-combo" ? "#fb923c" : "#c084fc",
        glowBlur: 16,
        glowIntensity: "medium",
      });
    } else {
      onChange({
        textShadow: preset.value,
      });
    }
  };

  const updateShadow = (patch: Partial<CustomElement>) => {
    const shadowEnabled = patch.shadowEnabled !== undefined ? patch.shadowEnabled : (element.shadowEnabled ?? true);
    const glowEnabled = element.glowEnabled ?? false;

    const nextShadowOffsetX = patch.shadowOffsetX !== undefined ? patch.shadowOffsetX : (element.shadowOffsetX ?? 2);
    const nextShadowOffsetY = patch.shadowOffsetY !== undefined ? patch.shadowOffsetY : (element.shadowOffsetY ?? 3);
    const nextShadowBlur = patch.shadowBlur !== undefined ? patch.shadowBlur : (element.shadowBlur ?? 6);
    const nextShadowColor = patch.shadowColor !== undefined ? patch.shadowColor : (element.shadowColor || "rgba(0, 0, 0, 0.85)");

    const combinedCss = buildTextShadowString({
      shadowEnabled,
      shadowOffsetX: nextShadowOffsetX,
      shadowOffsetY: nextShadowOffsetY,
      shadowBlur: nextShadowBlur,
      shadowColor: nextShadowColor,
      glowEnabled,
      glowBlur: element.glowBlur,
      glowColor: element.glowColor,
      glowIntensity: element.glowIntensity,
    });

    onChange({
      ...patch,
      shadowEnabled,
      shadowOffsetX: nextShadowOffsetX,
      shadowOffsetY: nextShadowOffsetY,
      shadowBlur: nextShadowBlur,
      shadowColor: nextShadowColor,
      textShadow: combinedCss,
    });
  };

  const updateGlow = (patch: Partial<CustomElement>) => {
    const glowEnabled = patch.glowEnabled !== undefined ? patch.glowEnabled : (element.glowEnabled ?? true);
    const shadowEnabled = element.shadowEnabled ?? false;

    const nextGlowBlur = patch.glowBlur !== undefined ? patch.glowBlur : (element.glowBlur ?? 14);
    const nextGlowColor = patch.glowColor !== undefined ? patch.glowColor : (element.glowColor || "#ff462b");
    const nextGlowIntensity = patch.glowIntensity !== undefined ? patch.glowIntensity : (element.glowIntensity || "medium");

    const combinedCss = buildTextShadowString({
      shadowEnabled,
      shadowOffsetX: element.shadowOffsetX,
      shadowOffsetY: element.shadowOffsetY,
      shadowBlur: element.shadowBlur,
      shadowColor: element.shadowColor,
      glowEnabled,
      glowBlur: nextGlowBlur,
      glowColor: nextGlowColor,
      glowIntensity: nextGlowIntensity,
    });

    onChange({
      ...patch,
      glowEnabled,
      glowBlur: nextGlowBlur,
      glowColor: nextGlowColor,
      glowIntensity: nextGlowIntensity,
      textShadow: combinedCss,
    });
  };

  const handleCopyCss = async () => {
    if (!currentTextShadow) return;
    await navigator.clipboard.writeText(`text-shadow: ${currentTextShadow};`);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleResetEffects = () => {
    onChange({
      textShadow: "",
      shadowEnabled: false,
      glowEnabled: false,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowBlur: 6,
      shadowColor: "rgba(0, 0, 0, 0.85)",
      glowBlur: 14,
      glowColor: "#ff462b",
      glowIntensity: "medium",
    });
  };

  return (
    <div className="rounded-xl border border-white/8 bg-[#0f1118] p-3 space-y-3 font-mono">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Sparkles className="h-3.5 w-3.5 text-[#ff462b]" />
          <span>Typographic Depth & Illumination</span>
        </div>

        {hasAnyEffect && (
          <button
            type="button"
            onClick={handleResetEffects}
            className="flex items-center gap-1 text-[10px] text-red-400 hover:underline transition"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Reset FX</span>
          </button>
        )}
      </div>

      {/* Live Preview Pill */}
      <div className="rounded-lg bg-[#090a0f] border border-white/5 p-2 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Eye className="h-3 w-3 text-[#ff462b] flex-shrink-0" />
          <span className="text-[10px] uppercase text-slate-500">Preview:</span>
        </div>
        <div
          className="text-xs font-bold truncate tracking-wide px-2 py-0.5"
          style={{
            color: element.color || "#ffffff",
            textShadow: currentTextShadow || "none",
          }}
        >
          {element.content?.slice(0, 24) || "Aa Visual Depth"}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-[#090a0f] border border-white/5 text-[11px]">
        {(["presets", "shadow", "glow", "custom"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-1 rounded capitalize transition font-medium ${
              activeTab === tab
                ? "bg-[#1d2232] text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: PRESETS */}
      {activeTab === "presets" && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-0.5">
            {TEXT_SHADOW_PRESETS.map((p) => {
              const isActive =
                (!p.value && !currentTextShadow) ||
                (p.value && currentTextShadow.toLowerCase() === p.value.toLowerCase());

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`group relative flex flex-col items-start gap-1 rounded-lg border p-2 text-left transition ${
                    isActive
                      ? "border-[#ff462b]/60 bg-[#161a26] text-white shadow-sm"
                      : "border-white/5 bg-[#090a0f] hover:border-white/15"
                  }`}
                  title={p.description}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-200">
                      {p.name}
                    </span>
                    {isActive && <Check className="h-3 w-3 text-[#ff462b]" />}
                  </div>

                  <div
                    className="text-xs font-bold truncate max-w-full px-1"
                    style={{
                      color: p.textColor || "#ffffff",
                      textShadow: p.value || "none",
                    }}
                  >
                    {p.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DROP SHADOW */}
      {activeTab === "shadow" && (
        <div className="space-y-3 font-mono text-[11px]">
          <div className="flex items-center justify-between bg-[#090a0f] p-2 rounded-lg border border-white/5">
            <span className="text-slate-300 font-medium">Drop Shadow Enabled</span>
            <input
              type="checkbox"
              checked={element.shadowEnabled ?? false}
              onChange={(e) => updateShadow({ shadowEnabled: e.target.checked })}
              className="accent-[#ff462b] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Blur Radius</span>
                <span className="text-white">{element.shadowBlur ?? 6}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={element.shadowBlur ?? 6}
                onChange={(e) => updateShadow({ shadowBlur: parseInt(e.target.value, 10) })}
                className="h-1 w-full accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">Offset X</span>
                <input
                  type="number"
                  value={element.shadowOffsetX ?? 2}
                  onChange={(e) => updateShadow({ shadowOffsetX: parseInt(e.target.value, 10) || 0 })}
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <span className="text-slate-400">Offset Y</span>
                <input
                  type="number"
                  value={element.shadowOffsetY ?? 3}
                  onChange={(e) => updateShadow({ shadowOffsetY: parseInt(e.target.value, 10) || 0 })}
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GLOW */}
      {activeTab === "glow" && (
        <div className="space-y-3 font-mono text-[11px]">
          <div className="flex items-center justify-between bg-[#090a0f] p-2 rounded-lg border border-white/5">
            <span className="text-slate-300 font-medium">Luminous Glow Enabled</span>
            <input
              type="checkbox"
              checked={element.glowEnabled ?? false}
              onChange={(e) => updateGlow({ glowEnabled: e.target.checked })}
              className="accent-[#ff462b] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Glow Diffusion</span>
                <span className="text-white">{element.glowBlur ?? 14}px</span>
              </div>
              <input
                type="range"
                min={2}
                max={60}
                value={element.glowBlur ?? 14}
                onChange={(e) => updateGlow({ glowBlur: parseInt(e.target.value, 10) })}
                className="h-1 w-full accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
            </div>

            <div>
              <span className="text-slate-400 mb-1 block">Glow Palette</span>
              <div className="grid grid-cols-4 gap-1">
                {GLOW_COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => updateGlow({ glowColor: swatch.hex })}
                    className="h-6 rounded border border-white/10 text-[9px] font-bold text-black"
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RAW CSS */}
      {activeTab === "custom" && (
        <div className="space-y-2 font-mono">
          <textarea
            value={currentTextShadow}
            onChange={(e) => onChange({ textShadow: e.target.value })}
            rows={3}
            className="w-full rounded border border-white/10 bg-[#090a0f] p-2 text-xs text-amber-200"
            placeholder="e.g. 2px 2px 4px rgba(0,0,0,0.8)"
          />
          <button
            type="button"
            onClick={handleCopyCss}
            className="flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] text-slate-300 hover:text-white"
          >
            {copiedCss ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCss ? "CSS Copied" : "Copy CSS Property"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
