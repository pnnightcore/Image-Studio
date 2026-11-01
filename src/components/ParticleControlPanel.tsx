import React, { useState } from "react";
import type { ParticleConfig, ParticlePresetId, ParticleShape } from "../lib/particle-system";
import {
  PARTICLE_PRESETS,
  PARTICLE_PRESET_LIST,
  createDefaultParticleConfig,
} from "../lib/particle-system";
import {
  Sparkles,
  Sliders,
  Flame,
  Snowflake,
  Star,
  Palette,
  RotateCw,
  Wind,
  Layers,
  Check,
} from "lucide-react";

interface ParticleControlPanelProps {
  config: ParticleConfig;
  onChange: (config: ParticleConfig) => void;
  title?: string;
  onClose?: () => void;
}

const COLOR_SWATCHES = [
  "#fbbf24", // Gold
  "#f59e0b", // Amber
  "#f97316", // Orange
  "#ff462b", // Vermilion
  "#f43f5e", // Crimson
  "#ec4899", // Pink
  "#a855f7", // Violet
  "#38bdf8", // Sky Blue
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#c8f049", // Lime
  "#ffffff", // Crisp White
];

export function ParticleControlPanel({
  config,
  onChange,
  title = "Particle System",
  onClose,
}: ParticleControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "physics" | "appearance">("presets");
  const [showColorSwatches, setShowColorSwatches] = useState(false);
  const [showSecondarySwatches, setShowSecondarySwatches] = useState(false);

  const applyPreset = (presetId: ParticlePresetId) => {
    const p = PARTICLE_PRESETS[presetId];
    if (p) {
      onChange({ ...p.config });
    }
  };

  const updateField = <K extends keyof ParticleConfig>(field: K, val: ParticleConfig[K]) => {
    onChange({
      ...config,
      [field]: val,
    });
  };

  return (
    <div className="space-y-3.5 text-xs">
      {/* Tab switchers */}
      <div className="flex items-center rounded-lg bg-[#090a0f] border border-white/8 p-0.5 font-mono text-[11px]">
        {(["presets", "physics", "appearance"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-1 rounded capitalize font-medium transition ${
              activeTab === tab
                ? "bg-[#1d2232] text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: Presets */}
      {activeTab === "presets" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {PARTICLE_PRESET_LIST.map((preset) => {
              const isSelected = config.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition ${
                    isSelected
                      ? "border-amber-500/60 bg-[#19161a] text-white shadow-sm"
                      : "border-white/5 bg-[#090a0f] text-slate-300 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-['Space_Grotesk',sans-serif] font-bold text-xs">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <Check className="h-3 w-3 text-amber-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {preset.description}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                    <span
                      className="inline-block h-2 w-2 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.config.color }}
                    />
                    <span>{preset.config.count} fx</span>
                    <span>·</span>
                    <span>{preset.config.speed}px/s</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/5 bg-[#090a0f] p-2.5 font-mono text-[10px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>ACTIVE PARTICLES:</span>
              <span className="text-white font-semibold">{config.count} units</span>
            </div>
            <div className="flex justify-between">
              <span>PHYSICS SPEED:</span>
              <span className="text-white font-semibold">{config.speed} px/s</span>
            </div>
            <div className="flex justify-between">
              <span>EMISSION SPREAD:</span>
              <span className="text-white font-semibold">{config.spread}°</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Physics Controls */}
      {activeTab === "physics" && (
        <div className="space-y-3 font-mono">
          {/* Count */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Count</span>
              <span className="text-amber-300">{config.count}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={200}
                step={1}
                value={config.count}
                onChange={(e) => updateField("count", parseInt(e.target.value, 10))}
                className="h-1 flex-1 accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
              <span className="w-10 text-right text-[11px] text-slate-400">{config.count}</span>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Particle Size</span>
              <span className="text-amber-300">{config.size}px</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={2}
                max={36}
                step={1}
                value={config.size}
                onChange={(e) => updateField("size", parseInt(e.target.value, 10))}
                className="h-1 flex-1 accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
              <span className="w-10 text-right text-[11px] text-slate-400">{config.size}px</span>
            </div>
          </div>

          {/* Speed */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Velocity</span>
              <span className="text-amber-300">{config.speed}px/s</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={250}
                step={5}
                value={config.speed}
                onChange={(e) => updateField("speed", parseInt(e.target.value, 10))}
                className="h-1 flex-1 accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
              <span className="w-10 text-right text-[11px] text-slate-400">{config.speed}</span>
            </div>
          </div>

          {/* Direction */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Emission Angle</span>
              <span className="text-amber-300">{config.direction}°</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={config.direction}
                onChange={(e) => updateField("direction", parseInt(e.target.value, 10))}
                className="h-1 flex-1 accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
              <span className="w-10 text-right text-[11px] text-slate-400">{config.direction}°</span>
            </div>
          </div>

          {/* Gravity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Gravity Well</span>
              <span className="text-amber-300">{config.gravity}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={-150}
                max={150}
                step={5}
                value={config.gravity}
                onChange={(e) => updateField("gravity", parseInt(e.target.value, 10))}
                className="h-1 flex-1 accent-[#ff462b] bg-white/10 rounded cursor-pointer"
              />
              <span className="w-10 text-right text-[11px] text-slate-400">{config.gravity}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Style & Appearance */}
      {activeTab === "appearance" && (
        <div className="space-y-3 font-mono">
          {/* Primary Color Palette */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-300 font-medium">Primary Hue</span>
              <span className="text-white font-bold">{config.color}</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => updateField("color", swatch)}
                  className={`h-6 rounded border transition ${
                    config.color.toLowerCase() === swatch.toLowerCase()
                      ? "border-white scale-110 shadow-sm"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Opacity</span>
              <span className="text-amber-300">{Math.round(config.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={config.opacity}
              onChange={(e) => updateField("opacity", parseFloat(e.target.value))}
              className="h-1 w-full accent-[#ff462b] bg-white/10 rounded cursor-pointer"
            />
          </div>

          {/* Shape */}
          <div className="space-y-1">
            <span className="text-slate-300 font-medium text-[11px]">Shape Geometry</span>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {(["circle", "star", "spark", "sakura"] as ParticleShape[]).map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => updateField("shape", shape)}
                  className={`py-1 rounded border text-[11px] capitalize transition ${
                    config.shape === shape
                      ? "border-amber-400 bg-[#1d2232] text-white font-bold"
                      : "border-white/10 bg-[#090a0f] text-slate-400 hover:text-white"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
