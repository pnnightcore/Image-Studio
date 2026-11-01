import React, { useState, useMemo, useEffect } from "react";
import type { SongResult, PresetSample, SongLayout } from "../lib/types";
import { sampleSongs, presetSamples } from "../lib/sample-data";
import { calculateHeight } from "../lib/constants";
import { SongCard } from "./SongCard";
import {
  Code2,
  ListMusic,
  Plus,
  FileCheck,
  AlertCircle,
  Download,
  LayoutList,
  LayoutGrid,
  Sparkles,
  Command,
} from "lucide-react";

interface GeneratorFormProps {
  title: string;
  songs: SongResult[];
  layout?: SongLayout;
  onTitleChange: (newTitle: string) => void;
  onSongsChange: (newSongs: SongResult[]) => void;
  onLayoutChange: (layout: SongLayout) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function GeneratorForm({
  title,
  songs,
  layout = "list",
  onTitleChange,
  onSongsChange,
  onLayoutChange,
  onGenerate,
  isGenerating,
}: GeneratorFormProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [jsonText, setJsonText] = useState<string>(() =>
    JSON.stringify(songs.length > 0 ? songs : sampleSongs, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const syncJsonFromSongs = (newSongs: SongResult[]) => {
    setJsonText(JSON.stringify(newSongs, null, 2));
    setJsonError(null);
  };

  const quickTitles = [
    "Lofi & Chill Beats",
    "Study & Focus Radio",
    "Late Night Vibes",
    "Top 20 Trending Search",
  ];

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      if (!val.trim()) {
        setJsonError(null);
        onSongsChange([]);
        return;
      }
      const data = JSON.parse(val);
      if (!Array.isArray(data)) {
        setJsonError("JSON data must be an array []");
        return;
      }
      setJsonError(null);
      // Limit to max 20 tracks
      onSongsChange(data.slice(0, 20));
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON format.");
    }
  };

  const handleFormatJson = () => {
    try {
      const data = JSON.parse(jsonText);
      setJsonText(JSON.stringify(data, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError("Cannot format: " + err.message);
    }
  };

  const handleMinifyJson = () => {
    try {
      const data = JSON.parse(jsonText);
      setJsonText(JSON.stringify(data));
      setJsonError(null);
    } catch (err: any) {
      setJsonError("Cannot minify: " + err.message);
    }
  };

  const handleLoadPreset = (preset: PresetSample) => {
    onTitleChange(preset.title);
    onSongsChange(preset.songs);
    syncJsonFromSongs(preset.songs);
  };

  const handleClear = () => {
    onSongsChange([]);
    setJsonText("[]");
    setJsonError(null);
  };

  const handleAddSong = () => {
    if (songs.length >= 20) {
      alert("Maximum 20 tracks reached.");
      return;
    }
    const nextIndex = songs.length + 1;
    const newSong: SongResult = {
      index: nextIndex,
      avatar: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
      displayName: `Lofi Track #${nextIndex} - Relaxing Melodies`,
      time: "03:45",
      source: "youtube",
      author: "Chillhop Music",
      views: "1.2M views",
    };
    const updated = [...songs, newSong];
    onSongsChange(updated);
    syncJsonFromSongs(updated);
  };

  const handleUpdateSong = (idx: number, updatedSong: SongResult) => {
    const next = [...songs];
    next[idx] = updatedSong;
    onSongsChange(next);
    syncJsonFromSongs(next);
  };

  const handleDeleteSong = (idx: number) => {
    const next = songs.filter((_, i) => i !== idx).map((s, i) => ({ ...s, index: i + 1 }));
    onSongsChange(next);
    syncJsonFromSongs(next);
  };

  const handleMoveSong = (from: number, to: number) => {
    if (to < 0 || to >= songs.length) return;
    const next = [...songs];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const reindexed = next.map((s, i) => ({ ...s, index: i + 1 }));
    onSongsChange(reindexed);
    syncJsonFromSongs(reindexed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!jsonError && songs.length > 0) {
          onGenerate();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jsonError, songs.length, onGenerate]);

  const estimatedHeight = calculateHeight(songs.length, layout);

  return (
    <div className="flex flex-col gap-4">
      {/* Title Field & Header */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-amber-400">
            Card Header Title
          </label>
          <span className="font-mono text-[10px] text-slate-400">1130px Canvas Master</span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter title (e.g. Lofi & Chill Beats)"
          className="w-full rounded-lg border border-white/10 bg-[#090a0f] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 shadow-inner focus:border-[#ff462b] focus:outline-none"
        />

        {/* Quick title suggestions */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickTitles.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTitleChange(t)}
              className="rounded border border-white/5 bg-[#090a0f] px-2 py-1 font-mono text-[10px] text-slate-400 hover:border-amber-500/30 hover:text-white transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Style Selector */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-amber-400">
            Spatial Layout Mode
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {layout === "auto"
              ? songs.length <= 10
                ? "Auto: Large Cards (<=10)"
                : "Auto: Video List (>10)"
              : `Enforced: ${layout}`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {[
            {
              id: "auto",
              label: "Auto Layout",
              sub: "Smart Threshold",
              active: layout === "auto",
            },
            {
              id: "showcase",
              label: "Showcase Hero",
              sub: "Top 1 Featured",
              active: layout === "showcase",
            },
            {
              id: "compact-queue",
              label: "Single Queue",
              sub: "1-Col Spotify",
              active: layout === "compact-queue",
            },
            {
              id: "grid",
              label: "Cover Grid",
              sub: "5-Col Cards",
              active: layout === "grid",
            },
            {
              id: "list",
              label: "Dual Column",
              sub: "16:9 Thumbs",
              active: layout === "list",
            },
            {
              id: "classic",
              label: "Classic List",
              sub: "Round Badges",
              active: layout === "classic",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onLayoutChange(item.id as any)}
              className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                item.active
                  ? "border-amber-500/60 bg-[#19161a] text-white shadow-sm"
                  : "border-white/5 bg-[#090a0f] text-slate-400 hover:border-white/15 hover:text-slate-200"
              }`}
            >
              <span className={`text-xs font-semibold ${item.active ? "text-amber-300" : ""}`}>
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Counts Selector */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-amber-400">
            Track Density Samples
          </span>
          <span className="font-mono text-[10px] text-amber-400">
            {songs.length}/20 tracks active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {presetSamples.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className={`flex flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-all ${
                songs.length === p.count && title === p.title
                  ? "border-[#ff462b]/60 bg-[#161a26] text-white shadow-sm"
                  : "border-white/5 bg-[#090a0f] text-slate-400 hover:border-white/15 hover:text-slate-200"
              }`}
            >
              <span className="text-xs font-semibold">{p.count} tracks</span>
              <span className="mt-0.5 font-mono text-[9px] text-slate-400">
                ~{calculateHeight(p.count, layout)}px
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Channel Strips: Visual vs JSON */}
      <div>
        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "visual"
                  ? "bg-[#1d2232] text-white border border-white/10 font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <ListMusic className="h-3.5 w-3.5 text-amber-400" />
              <span>Track List ({songs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "json"
                  ? "bg-[#1d2232] text-white border border-white/10 font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Code2 className="h-3.5 w-3.5 text-slate-400" />
              <span>JSON Raw</span>
            </button>
          </div>

          {activeTab === "json" && (
            <div className="flex items-center gap-1 text-xs font-mono">
              <button
                type="button"
                onClick={handleFormatJson}
                className="rounded px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                Format
              </button>
              <button
                type="button"
                onClick={handleMinifyJson}
                className="rounded px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                Minify
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded px-2 py-1 text-red-400 hover:bg-red-500/20 transition"
              >
                Clear
              </button>
            </div>
          )}

          {activeTab === "visual" && (
            <button
              type="button"
              disabled={songs.length >= 20}
              onClick={handleAddSong}
              className="flex items-center gap-1 rounded-md border border-white/10 bg-[#161a26] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#1e2334] disabled:opacity-30 transition"
            >
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              <span>Add Track ({songs.length}/20)</span>
            </button>
          )}
        </div>

        {/* Tab 1: JSON Editor */}
        {activeTab === "json" ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              spellCheck={false}
              rows={15}
              placeholder="[ { index: 1, avatar: '...', displayName: '...', time: '03:45' } ]"
              className="w-full resize-y rounded-lg border border-white/10 bg-[#07080c] p-3 font-mono text-xs leading-relaxed text-amber-200 shadow-inner focus:border-[#ff462b] focus:outline-none"
            />

            {jsonError ? (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="min-w-0 flex-1">
                  <strong className="font-semibold">JSON Syntax Error: </strong>
                  <span>{jsonError}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-950/25 px-3 py-2 text-xs font-mono text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  <span>Valid JSON · {songs.length} / 20 tracks</span>
                </div>
                <span className="text-[11px] text-emerald-400/80">
                  Target: 1130 × {estimatedHeight}px
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Visual Channel Strips */
          <div className="mt-3 space-y-2">
            {songs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 p-8 text-center text-slate-500">
                <ListMusic className="mb-2 h-7 w-7 text-slate-600" />
                <p className="text-xs font-medium text-slate-400">Playlist is empty</p>
                <button
                  type="button"
                  onClick={handleAddSong}
                  className="mt-3 flex items-center gap-1 rounded-md bg-[#ff462b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#ea381f] transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Track
                </button>
              </div>
            ) : (
              <div className="max-h-[440px] space-y-1.5 overflow-y-auto pr-1">
                {songs.map((song, idx) => (
                  <SongCard
                    key={`${song.index}-${idx}`}
                    song={song}
                    isFirst={idx === 0}
                    isLast={idx === songs.length - 1}
                    onUpdate={(updated) => handleUpdateSong(idx, updated)}
                    onDelete={() => handleDeleteSong(idx)}
                    onMoveUp={() => handleMoveSong(idx, idx - 1)}
                    onMoveDown={() => handleMoveSong(idx, idx + 1)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Trigger & Shortcut info */}
      <div className="space-y-2 pt-1 border-t border-white/8">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !!jsonError || songs.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff462b] py-3 text-xs font-semibold text-white shadow-md shadow-[#ff462b]/20 hover:bg-[#ea381f] disabled:cursor-not-allowed disabled:opacity-40 transition-all tactile-press"
        >
          {isGenerating ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Rendering 1130 × {estimatedHeight}px PNG...</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Render & Download PNG (1130 × {estimatedHeight}px)</span>
            </>
          )}
        </button>

        <p className="text-center font-mono text-[10px] text-slate-400">
          QUICK TRIGGER: <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-slate-300">Ctrl + Enter</kbd>
        </p>
      </div>
    </div>
  );
}
