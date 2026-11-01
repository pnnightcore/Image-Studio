import React, { useState, useEffect, useMemo } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Plus,
  Trash2,
  Sparkles,
  Check,
  FolderHeart,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck,
  SlidersHorizontal,
  Terminal,
  Search,
} from "lucide-react";
import {
  getBuiltinPresets,
  loadUserPresets,
  saveUserPreset,
  deleteUserPreset,
  type PresetGeneratorType,
  type StoredPreset,
} from "../lib/generator-presets";

interface SidebarPresetsProps {
  generatorType: PresetGeneratorType;
  currentData: any;
  onLoadPreset: (presetData: any, presetName: string) => void;
}

export function SidebarPresets({
  generatorType,
  currentData,
  onLoadPreset,
}: SidebarPresetsProps) {
  const [activeTab, setActiveTab] = useState<"builtin" | "user">("builtin");
  const [userPresets, setUserPresets] = useState<StoredPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [presetNameInput, setPresetNameInput] = useState<string>("");
  const [presetDescInput, setPresetDescInput] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load user presets from localStorage whenever generatorType changes
  useEffect(() => {
    const list = loadUserPresets(generatorType);
    setUserPresets(list);
    setActivePresetId(null);
    setSearchQuery("");
  }, [generatorType]);

  const builtinPresets = useMemo(
    () => getBuiltinPresets(generatorType),
    [generatorType]
  );

  const filteredBuiltin = useMemo(() => {
    if (!searchQuery.trim()) return builtinPresets;
    const q = searchQuery.toLowerCase().trim();
    return builtinPresets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
    );
  }, [builtinPresets, searchQuery]);

  const filteredUser = useMemo(() => {
    if (!searchQuery.trim()) return userPresets;
    const q = searchQuery.toLowerCase().trim();
    return userPresets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
    );
  }, [userPresets, searchQuery]);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleApplyPreset = (preset: StoredPreset) => {
    setActivePresetId(preset.id);
    onLoadPreset(preset.data, preset.name);
    showFeedback(`Applied: "${preset.name}"`);
  };

  const handleCopySdkSnippet = async (preset: StoredPreset, ev: React.MouseEvent) => {
    ev.stopPropagation();
    const method = generatorType;
    const snippet = `import { ImageStudio } from "image-studio";

const studio = new ImageStudio();

const image = await studio.${method}(${JSON.stringify(preset.data, null, 2)});
await image.save("${preset.id || "preset"}.png");
`;
    await navigator.clipboard.writeText(snippet);
    showFeedback(`Copied SDK snippet for "${preset.name}"!`);
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;

    let badge = "Custom";
    if (generatorType === "song") {
      const count = currentData?.songs?.length || 0;
      badge = `${currentData?.layout || "list"} · ${count} Tracks`;
    } else if (generatorType === "leaderboard") {
      const count = currentData?.items?.length || 0;
      badge = `Top ${count} · ${currentData?.guildName || "Guild"}`;
    } else if (generatorType === "profile") {
      badge = `${currentData?.rank || "#1"} · Lv.${currentData?.level || 1}`;
    } else if (generatorType === "quote") {
      badge = currentData?.author || "Quote";
    }

    const saved = saveUserPreset(
      generatorType,
      presetNameInput.trim(),
      presetDescInput.trim() || `Saved on ${new Date().toLocaleDateString()}`,
      currentData,
      badge
    );

    setUserPresets((prev) => [saved, ...prev]);
    setActivePresetId(saved.id);
    setShowSaveModal(false);
    setPresetNameInput("");
    setPresetDescInput("");
    setActiveTab("user");
    showFeedback(`Preset saved to Local Storage`);
  };

  const handleDeleteUserPreset = (presetId: string, name: string) => {
    deleteUserPreset(generatorType, presetId);
    setUserPresets((prev) => prev.filter((p) => p.id !== presetId));
    if (activePresetId === presetId) setActivePresetId(null);
    showFeedback(`Deleted preset "${name}"`);
  };

  const domainAccent =
    generatorType === "song"
      ? "text-amber-400"
      : generatorType === "profile"
      ? "text-rose-400"
      : generatorType === "leaderboard"
      ? "text-yellow-400"
      : "text-sky-400";

  return (
    <div className="rounded-xl border border-white/8 bg-[#0f1118] p-3.5 space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#141722] border border-white/10 text-white">
            <BookmarkCheck className={`h-4 w-4 ${domainAccent}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-white tracking-wide">
                Preset Catalog
              </span>
              {feedbackMsg && (
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 border border-emerald-500/25">
                  {feedbackMsg}
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              Curated layouts & user storage
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setPresetNameInput("");
              setShowSaveModal(true);
            }}
            className="flex items-center gap-1 rounded-md border border-white/10 bg-[#161a26] px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:text-white hover:bg-[#1e2334] transition tactile-press"
            title="Save current configuration to browser storage"
          >
            <Plus className="h-3 w-3 text-[#ff462b]" />
            <span>Save Custom</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/8 bg-[#141722] text-slate-400 hover:text-white hover:bg-white/5 transition"
            title={isCollapsed ? "Expand presets" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-2.5 pt-1">
          {/* Tabs: Curated Built-in vs User Stored */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#0a0c10] border border-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab("builtin")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
                  activeTab === "builtin"
                    ? "bg-[#1d2232] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Curated ({builtinPresets.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("user")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition ${
                  activeTab === "user"
                    ? "bg-[#1d2232] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>My Presets ({userPresets.length})</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
              STORAGE: READY
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search built-in cards..."
              className="w-full rounded-lg border border-white/10 bg-[#090a0f] pl-8 pr-7 py-1 text-xs text-white placeholder-slate-500 focus:border-[#ff462b] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Preset Cards List */}
          {activeTab === "builtin" ? (
            filteredBuiltin.length === 0 ? (
              <div className="rounded-lg border border-white/5 bg-[#0a0c10]/40 p-4 text-center text-xs text-slate-400">
                No cards match &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredBuiltin.map((p) => {
                const isActive = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`group relative flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all ${
                      isActive
                        ? "border-[#ff462b]/50 bg-[#161a26] shadow-sm"
                        : "border-white/5 bg-[#0a0c10]/60 hover:border-white/15 hover:bg-[#121520]"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-white group-hover:text-slate-100 transition truncate">
                        {p.name}
                      </span>
                      {isActive ? (
                        <span className="flex items-center gap-0.5 rounded bg-emerald-500/15 px-1 py-0.5 text-[9px] font-mono font-semibold text-emerald-400 border border-emerald-500/25 shrink-0">
                          <Check className="h-2.5 w-2.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        p.badge && (
                          <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 border border-white/5 shrink-0">
                            {p.badge}
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex w-full items-center justify-between pt-1 border-t border-white/5 mt-0.5">
                      <p className="text-[10px] text-slate-400 line-clamp-1 leading-normal flex-1">
                        {p.description}
                      </p>
                      <button
                        type="button"
                        onClick={(ev) => handleCopySdkSnippet(p, ev)}
                        className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-white/5 transition shrink-0 ml-1.5"
                        title="Sao chép mã gọi SDK cho preset này"
                      >
                        <Terminal className="h-3 w-3 text-amber-400" />
                        <span>SDK</span>
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
            )
          ) : (
            <div>
              {userPresets.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 bg-[#0a0c10]/30 p-4 text-center">
                  <Bookmark className="mx-auto h-4 w-4 text-slate-500 mb-1" />
                  <p className="text-xs font-medium text-slate-300">
                    No custom presets stored yet
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Customize your canvas parameters and click &ldquo;+ Save Custom&rdquo; to store locally.
                  </p>
                </div>
              ) : filteredUser.length === 0 ? (
                <div className="rounded-lg border border-white/5 bg-[#0a0c10]/40 p-4 text-center text-xs text-slate-400">
                  No custom cards match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-0.5 custom-scrollbar">
                  {filteredUser.map((p) => {
                    const isActive = activePresetId === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`group relative flex flex-col justify-between gap-1.5 rounded-lg border p-2.5 text-left transition-all ${
                          isActive
                            ? "border-[#ff462b]/50 bg-[#161a26]"
                            : "border-white/5 bg-[#0a0c10]/60 hover:border-white/15 hover:bg-[#121520]"
                        }`}
                      >
                        <div
                          onClick={() => handleApplyPreset(p)}
                          className="cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-slate-100 transition truncate">
                              {p.name}
                            </span>
                            {isActive ? (
                              <span className="flex items-center gap-0.5 rounded bg-emerald-500/15 px-1 py-0.5 text-[9px] font-mono font-semibold text-emerald-400 border border-emerald-500/25">
                                <Check className="h-2.5 w-2.5" />
                                <span>Active</span>
                              </span>
                            ) : (
                              p.badge && (
                                <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 border border-white/5 truncate max-w-[100px]">
                                  {p.badge}
                                </span>
                              )
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {p.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => handleApplyPreset(p)}
                            className="font-mono text-[10px] font-semibold text-slate-300 hover:text-white transition"
                          >
                            Load Template →
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(ev) => handleCopySdkSnippet(p, ev)}
                              className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-white/5 transition"
                              title="Sao chép mã gọi SDK cho preset này"
                            >
                              <Terminal className="h-3 w-3 text-amber-400" />
                              <span>SDK</span>
                            </button>
                            <button
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                handleDeleteUserPreset(p.id, p.name);
                              }}
                              className="text-slate-500 hover:text-red-400 transition p-0.5 rounded"
                              title="Delete this preset from browser storage"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Save Preset Modal */}
      {showSaveModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0f1118] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141722] border border-white/10 text-white">
                  <Bookmark className="h-4 w-4 text-[#ff462b]" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-white">
                    Save Custom Preset
                  </h3>
                  <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    {generatorType.toUpperCase()} · Local Storage
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrent} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Preset Title <span className="text-[#ff462b]">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  placeholder="e.g. Neo Tokyo Billboard, Minimal Mono..."
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-[#ff462b] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Notes / Description (Optional)
                </label>
                <input
                  type="text"
                  value={presetDescInput}
                  onChange={(e) => setPresetDescInput(e.target.value)}
                  placeholder="e.g. Optimized for 1440p displays and Discord embeds"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-[#ff462b] focus:outline-none"
                />
              </div>

              <div className="rounded-lg border border-white/5 bg-[#090a0f] p-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Storage Target:</span>
                <span className="text-slate-300">Browser Local Storage</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#ff462b] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#ea381f] transition tactile-press"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Save Preset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
