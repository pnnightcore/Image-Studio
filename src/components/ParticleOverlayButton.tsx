import React, { useState } from "react";
import type { ParticleConfig, ParticlePresetId } from "../lib/particle-system";
import {
  PARTICLE_PRESETS,
  PARTICLE_PRESET_LIST,
  createDefaultParticleConfig,
} from "../lib/particle-system";
import { Sparkles, SlidersHorizontal, X, Check } from "lucide-react";
import { ParticleControlPanel } from "./ParticleControlPanel";

interface ParticleOverlayButtonProps {
  particleConfig?: ParticleConfig;
  onChange: (config: ParticleConfig | undefined) => void;
}

export function ParticleOverlayButton({
  particleConfig,
  onChange,
}: ParticleOverlayButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEnabled = !!particleConfig;

  const currentPresetName =
    particleConfig?.preset && PARTICLE_PRESETS[particleConfig.preset]
      ? `${PARTICLE_PRESETS[particleConfig.preset].name}`
      : "Custom FX";

  const handleToggle = () => {
    if (isEnabled) {
      onChange(undefined);
    } else {
      onChange(createDefaultParticleConfig("spark"));
      setIsOpen(true);
    }
  };

  return (
    <div className="relative inline-block text-xs">
      <div className="flex items-center gap-1 bg-[#090a0f] rounded-md border border-white/10 p-0.5 font-mono">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition ${
            isEnabled
              ? "bg-[#1d2232] border border-amber-500/40 text-amber-300 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
          title="Toggle interactive particle physics ambience"
        >
          <Sparkles className={`h-3 w-3 ${isEnabled ? "text-amber-400" : "text-slate-400"}`} />
          <span>{isEnabled ? currentPresetName : "Particles"}</span>
          {isEnabled && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ml-0.5" />
          )}
        </button>

        {isEnabled && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className={`p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition ${
              isOpen ? "text-white bg-white/10" : ""
            }`}
            title="Configure particle physics"
          >
            <SlidersHorizontal className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Floating Popup Panel */}
      {isOpen && isEnabled && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute right-0 top-9 z-50 w-80 sm:w-96 rounded-xl border border-white/10 bg-[#0f1118] p-4 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-['Space_Grotesk',sans-serif] font-bold text-white text-xs">
                Particle Synthesizer
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setIsOpen(false);
                }}
                className="text-red-400 hover:underline"
              >
                Disable
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <ParticleControlPanel
            config={particleConfig}
            onChange={(newConfig) => onChange(newConfig)}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
