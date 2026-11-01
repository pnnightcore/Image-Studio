import React, { useState } from "react";
import type { SongResult } from "../lib/types";
import { ChevronUp, ChevronDown, Trash2, Edit3, Check, Disc3 } from "lucide-react";

interface SongCardProps {
  song: SongResult;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: SongResult) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SongCard({
  song,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SongCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(song.displayName);
  const [avatar, setAvatar] = useState(song.avatar);
  const [time, setTime] = useState(song.time);
  const [source, setSource] = useState(song.source);
  const [author, setAuthor] = useState(song.author || "");
  const [views, setViews] = useState(song.views || "");
  const [imgError, setImgError] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...song,
      displayName: displayName.trim() || "Untitled Song",
      avatar: avatar.trim(),
      time: time.trim() || "03:00",
      source: source.trim() || "youtube",
      author: author.trim() || undefined,
      views: views.trim() || undefined,
    });
    setIsEditing(false);
  };

  const formattedIndex = String(song.index).padStart(2, "0");

  return (
    <div className="group relative rounded-lg border border-white/8 bg-[#0a0c10]/70 p-2.5 transition-all duration-150 hover:border-white/15 hover:bg-[#121520]">
      {isEditing ? (
        <div className="space-y-3 p-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs font-semibold text-amber-400">
              TRACK [{formattedIndex}] · PARAMETERS
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded bg-[#ff462b] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#ea381f] transition tactile-press"
            >
              <Check className="h-3 w-3" />
              <span>Apply</span>
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Track Title
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2.5 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Artist / Channel
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Chillhop Music"
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2.5 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Viewcount / Metric
                </label>
                <input
                  type="text"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  placeholder="e.g. 1.2M views"
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2.5 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Duration
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="03:45"
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2.5 py-1.5 font-mono text-xs text-white focus:border-[#ff462b] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Source Platform
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="youtube"
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2.5 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Artwork URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => {
                  setAvatar(e.target.value);
                  setImgError(false);
                }}
                placeholder="https://..."
                className="mt-0.5 w-full rounded border border-white/10 bg-[#090a0f] px-2.5 py-1.5 text-xs text-white focus:border-[#ff462b] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Index indicator */}
          <div className="font-mono text-[11px] font-bold text-slate-400 w-5 text-right shrink-0">
            {formattedIndex}
          </div>

          {/* Thumbnail preview */}
          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-white/10 bg-black/60">
            {!imgError && song.avatar ? (
              <img
                src={song.avatar}
                alt={song.displayName}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                <Disc3 className="h-4 w-4" />
              </div>
            )}
            <div className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 py-0.2 font-mono text-[9px] text-white">
              {song.time}
            </div>
          </div>

          {/* Track details */}
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-semibold text-white group-hover:text-amber-200 transition-colors">
              {song.displayName}
            </h4>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="truncate text-slate-300 font-medium">{song.author || song.source}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-[10px] text-slate-400">{song.views || song.time}</span>
            </div>
          </div>

          {/* Channel Strip Actions */}
          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              title="Edit track"
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <div className="flex flex-col">
              <button
                disabled={isFirst}
                onClick={onMoveUp}
                title="Move up"
                className="rounded p-0.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                disabled={isLast}
                onClick={onMoveDown}
                title="Move down"
                className="rounded p-0.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={onDelete}
              title="Delete track"
              className="rounded p-1 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
