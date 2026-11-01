import React, { useState, useCallback, useEffect } from "react";
import type {
  GeneratorType,
  SongResult,
  SongLayout,
  ProfileData,
  LeaderboardData,
  QuoteData,
  AnyGenerateRequest,
  ParticleConfig,
} from "./lib/types";
import {
  sampleSongs,
  defaultProfileData,
  defaultLeaderboardData,
  defaultQuoteData,
} from "./lib/sample-data";
import { useStats, recordGeneratedImage } from "./lib/use-stats";
import { getApiUrl } from "./lib/api-config";
import { GeneratorForm } from "./components/GeneratorForm";
import { ImagePreview } from "./components/ImagePreview";
import { ProfileForm } from "./components/ProfileForm";
import { ProfilePreview } from "./components/ProfilePreview";
import { LeaderboardForm } from "./components/LeaderboardForm";
import { LeaderboardPreview } from "./components/LeaderboardPreview";
import { QuoteForm } from "./components/QuoteForm";
import { QuotePreview } from "./components/QuotePreview";
import { AnimationTimeline } from "./components/AnimationTimeline";
import { SidebarPresets } from "./components/SidebarPresets";
import { ApiDocumentationModal } from "./components/ApiDocumentationModal";
import {
  Disc3,
  User,
  Trophy,
  Quote,
  Check,
  AlertCircle,
  X,
  Code2,
  Film,
  Sparkles,
  Command,
  ArrowUpRight,
  Layers,
  SlidersHorizontal,
} from "lucide-react";

export function getModeFromPath(pathname: string, search = ""): GeneratorType {
  const clean = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (clean === "/animation" || clean === "/animated" || clean === "/timeline") return "animated";
  if (clean === "/profile" || clean === "/rank") return "profile";
  if (clean === "/leaderboard" || clean === "/leaderboards") return "leaderboard";
  if (clean === "/quote" || clean === "/quotes") return "quote";
  if (clean === "/song" || clean === "/songs" || clean === "/custom") return "song";

  const params = new URLSearchParams(search);
  const q = params.get("mode") || params.get("studio");
  if (q === "animation" || q === "animated") return "animated";
  if (q === "profile") return "profile";
  if (q === "leaderboard") return "leaderboard";
  if (q === "quote") return "quote";
  if (q === "song") return "song";

  return "song";
}

export function getPathFromMode(mode: GeneratorType): string {
  switch (mode) {
    case "animated":
      return "/animation";
    case "profile":
      return "/profile";
    case "leaderboard":
      return "/leaderboard";
    case "quote":
      return "/quote";
    case "song":
    default:
      return "/song";
  }
}

interface ModeSpec {
  id: GeneratorType;
  title: string;
  tagline: string;
  badge: string;
  accent: string;
  accentBorder: string;
  accentBg: string;
  shortcut: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODES: ModeSpec[] = [
  {
    id: "song",
    title: "Song Search",
    tagline: "Dynamic 1130px Multi-Track Playlist Cards",
    badge: "1130 PX",
    accent: "text-amber-400",
    accentBorder: "border-amber-500/40",
    accentBg: "bg-amber-500/10",
    shortcut: "1",
    icon: Disc3,
  },
  {
    id: "profile",
    title: "Profile Card",
    tagline: "High-Resolution Player Ranks & Discord Banners",
    badge: "950 × 260",
    accent: "text-rose-400",
    accentBorder: "border-rose-500/40",
    accentBg: "bg-rose-500/10",
    shortcut: "2",
    icon: User,
  },
  {
    id: "leaderboard",
    title: "Leaderboard",
    tagline: "Competitive Tiered Guild Rankings & Podium Cards",
    badge: "540 PX",
    accent: "text-yellow-400",
    accentBorder: "border-yellow-500/40",
    accentBg: "bg-yellow-500/10",
    shortcut: "3",
    icon: Trophy,
  },
  {
    id: "quote",
    title: "Quote Card",
    tagline: "Editorial Typography & Split Cinema Quotes",
    badge: "1000 × 520",
    accent: "text-sky-400",
    accentBorder: "border-sky-500/40",
    accentBg: "bg-sky-500/10",
    shortcut: "4",
    icon: Quote,
  },
  {
    id: "animated",
    title: "Animation Studio",
    tagline: "Multi-Track Keyframe Engine & Media Synthesizer",
    badge: "60 FPS · GIF",
    accent: "text-[#ff462b]",
    accentBorder: "border-[#ff462b]/50",
    accentBg: "bg-[#ff462b]/10",
    shortcut: "5",
    icon: Film,
  },
];

export default function App() {
  const { totalCount, userCount } = useStats();

  const [activeMode, setActiveMode] = useState<GeneratorType>(() => {
    if (typeof window !== "undefined") {
      return getModeFromPath(window.location.pathname, window.location.search);
    }
    return "song";
  });

  const navigateToMode = useCallback((mode: GeneratorType, updateHistory = true) => {
    setActiveMode(mode);
    setLastBlob(null);
    if (updateHistory && typeof window !== "undefined") {
      const target = getPathFromMode(mode);
      if (window.location.pathname !== target) {
        window.history.pushState({ mode }, "", target);
      }
    }
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, mode: GeneratorType) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigateToMode(mode);
  };

  useEffect(() => {
    const onPop = () => {
      setActiveMode(getModeFromPath(window.location.pathname, window.location.search));
      setLastBlob(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Keyboard shortcut listener for modes 1-5 when not focusing in inputs
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      if (e.key === "1") navigateToMode("song");
      else if (e.key === "2") navigateToMode("profile");
      else if (e.key === "3") navigateToMode("leaderboard");
      else if (e.key === "4") navigateToMode("quote");
      else if (e.key === "5") navigateToMode("animated");
    };

    window.addEventListener("keydown", handleKeyNav);
    return () => window.removeEventListener("keydown", handleKeyNav);
  }, [navigateToMode]);

  // State for generators
  const [songTitle, setSongTitle] = useState<string>("Trending Top Hits");
  const [songs, setSongs] = useState<SongResult[]>(sampleSongs);
  const [songLayout, setSongLayout] = useState<SongLayout>("auto");

  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>(defaultLeaderboardData);
  const [quoteData, setQuoteData] = useState<QuoteData>(defaultQuoteData);

  // Particle System state for card generators
  const [songParticles, setSongParticles] = useState<ParticleConfig | undefined>(undefined);
  const [profileParticles, setProfileParticles] = useState<ParticleConfig | undefined>(undefined);
  const [leaderboardParticles, setLeaderboardParticles] = useState<ParticleConfig | undefined>(undefined);
  const [quoteParticles, setQuoteParticles] = useState<ParticleConfig | undefined>(undefined);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; time: string } | null>(null);
  const [showDocs, setShowDocs] = useState<boolean>(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setToast({ message, type, time });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const handleGenerate = useCallback(
    async () => {
      setIsGenerating(true);

      let payload: AnyGenerateRequest;
      let defaultFilename = "export.png";

      if (activeMode === "song") {
        if (songs.length === 0) {
          showToast("Please provide at least one song track", "error");
          setIsGenerating(false);
          return;
        }
        payload = {
          type: "song",
          title: songTitle,
          items: songs,
          layout: songLayout,
          particleConfig: songParticles,
        };
        defaultFilename = `${(songTitle || "song-search").replace(/[/\\?%*:|"<>]/g, "-")}.png`;
      } else if (activeMode === "profile") {
        payload = {
          type: "profile",
          data: {
            ...profileData,
            particleConfig: profileParticles,
          },
          particleConfig: profileParticles,
        };
        defaultFilename = `${profileData.username || "profile"}-rank.png`;
      } else if (activeMode === "leaderboard") {
        if (leaderboardData.items.length === 0) {
          showToast("Please provide at least one player on the leaderboard", "error");
          setIsGenerating(false);
          return;
        }
        payload = {
          type: "leaderboard",
          data: {
            ...leaderboardData,
            particleConfig: leaderboardParticles,
          },
          particleConfig: leaderboardParticles,
        };
        defaultFilename = "leaderboard.png";
      } else if (activeMode === "quote") {
        payload = {
          type: "quote",
          data: {
            ...quoteData,
            particleConfig: quoteParticles,
          },
          particleConfig: quoteParticles,
        };
        defaultFilename = `${quoteData.author || "quote"}.png`;
      } else {
        payload = {
          type: "animated",
          data: {
            title: "Animation Frame",
            format: "png",
            frameTime: 0,
          },
        };
        defaultFilename = "animation-frame.png";
      }

      try {
        const response = await fetch(getApiUrl("/api/generate"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to generate image from server");
        }

        const blob = await response.blob();
        setLastBlob(blob);

        const headerTotal = response.headers.get("X-Total-Generated");
        recordGeneratedImage(headerTotal ? parseInt(headerTotal, 10) : undefined);

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = defaultFilename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => URL.revokeObjectURL(url), 2000);

        showToast(`Render complete: ${defaultFilename}`);
      } catch (err: any) {
        console.error("Generation error:", err);
        showToast(err.message || "Failed to render PNG", "error");
      } finally {
        setIsGenerating(false);
      }
    },
    [
      activeMode,
      songTitle,
      songs,
      songLayout,
      songParticles,
      profileData,
      profileParticles,
      leaderboardData,
      leaderboardParticles,
      quoteData,
      quoteParticles,
    ]
  );

  const currentModeSpec = MODES.find((m) => m.id === activeMode) || MODES[0];

  return (
    <div className="min-h-screen bg-studio-grid text-[#eceef4] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff462b] selection:text-white">
      {/* Precision HUD Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 text-xs shadow-2xl backdrop-blur-xl transition-all duration-200 ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-[#0c1612]/95 text-emerald-200"
              : "border-red-500/30 bg-[#1a0e10]/95 text-red-200"
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-black/40 font-mono text-[10px] text-slate-400">
            {toast.time}
          </div>
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span className="font-medium tracking-tight text-white">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-2 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Studio Header Masthead */}
      <header className="sticky top-0 z-40 hairline-b bg-[#090a0f]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-14 max-w-[1720px] items-center justify-between gap-4">
          {/* Brand Mark */}
          <a
            href="/song"
            onClick={(e) => handleLinkClick(e, "song")}
            className="flex items-center gap-3 group cursor-pointer"
            title="Image Studio — Return to Home"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#141722] border border-white/10 shadow-sm group-hover:border-[#ff462b]/50 group-hover:bg-[#1a1e2b] transition-all">
              {/* Bespoke Geometric Aperture Symbol */}
              <div className="h-4 w-4 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-[2px] border border-[#ff462b] rotate-45 transition-transform group-hover:rotate-90 duration-300" />
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-['Syne',sans-serif] text-sm font-extrabold tracking-wider text-white uppercase group-hover:text-[#ff462b] transition-colors">
                Image Studio
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
                Foundry v2.4
              </span>
            </div>
          </a>

          {/* Center Atelier Channel Switcher (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-lg bg-[#0f1118] border border-white/8">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <a
                  key={mode.id}
                  href={getPathFromMode(mode.id)}
                  onClick={(e) => handleLinkClick(e, mode.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#1d2232] text-white shadow-sm border border-white/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive ? mode.accent : "text-slate-400"
                    }`}
                  />
                  <span>{mode.title}</span>
                  <span
                    className={`hidden xl:inline text-[9px] font-mono px-1 rounded ${
                      isActive
                        ? "bg-black/40 text-slate-300"
                        : "text-slate-400 opacity-60"
                    }`}
                  >
                    [{mode.shortcut}]
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Action Zone: Telemetry Counter, API Docs & Quick Export */}
          <div className="flex items-center gap-2.5">
            {/* Live Render Telemetry Counter */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-lg border border-white/8 bg-[#0f1118] px-3 py-1.5 text-xs font-mono text-slate-300"
              title={`Tổng render: ${totalCount} | Phiên này: ${userCount}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Renders</span>
              <span className="font-semibold text-emerald-400 tabular">
                {totalCount.toLocaleString()}
              </span>
            </div>

            {/* Docs Drawer Button */}
            <button
              onClick={() => setShowDocs(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-[#0f1118] px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-all tactile-press"
              title="API Reference & Integration Guide"
            >
              <Code2 className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider">
                API Docs
              </span>
            </button>

            {/* Direct Export Trigger Button */}
            {activeMode !== "animated" && (
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-lg bg-[#ff462b] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#ff462b]/20 hover:bg-[#ea381f] disabled:opacity-40 transition-all tactile-press"
              >
                {isGenerating ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span className="font-medium tracking-tight">
                  {isGenerating ? "Rendering..." : "Export PNG"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Mode Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-white/5 no-scrollbar">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <a
                key={mode.id}
                href={getPathFromMode(mode.id)}
                onClick={(e) => handleLinkClick(e, mode.id)}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#1d2232] text-white border border-white/10"
                    : "text-slate-400 hover:text-slate-200 bg-[#0f1118]/60"
                }`}
              >
                <Icon className={`h-3 w-3 ${isActive ? mode.accent : ""}`} />
                <span>{mode.title}</span>
              </a>
            );
          })}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1720px] space-y-5">
          {/* Studio Ribbon Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 hairline-b pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${currentModeSpec.accentBorder} ${currentModeSpec.accentBg}`}
              >
                <currentModeSpec.icon className={`h-4 w-4 ${currentModeSpec.accent}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Space_Grotesk',sans-serif] text-base font-bold tracking-tight text-white">
                    {currentModeSpec.title}
                  </h1>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-slate-300">
                    {currentModeSpec.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{currentModeSpec.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
                Engine: <strong className="text-slate-300 font-semibold">Satori + Sharp v2.4</strong>
              </span>
            </div>
          </div>

          {/* Mode 1-4: Workstation Grid Layout */}
          {activeMode !== "animated" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[460px_1fr] xl:grid-cols-[500px_1fr] 2xl:grid-cols-[540px_1fr]">
              {/* Left Column: Preset Rack & Control Inspector */}
              <div className="flex flex-col gap-4">
                {/* Presets Rack */}
                <SidebarPresets
                  generatorType={activeMode as "song" | "profile" | "leaderboard" | "quote"}
                  currentData={
                    activeMode === "song"
                      ? { title: songTitle, songs, layout: songLayout }
                      : activeMode === "profile"
                      ? profileData
                      : activeMode === "leaderboard"
                      ? leaderboardData
                      : quoteData
                  }
                  onLoadPreset={(presetData, presetName) => {
                    if (activeMode === "song") {
                      if (presetData.title) setSongTitle(presetData.title);
                      if (presetData.songs) setSongs(presetData.songs);
                      if (presetData.layout) setSongLayout(presetData.layout);
                    } else if (activeMode === "profile") {
                      setProfileData(presetData);
                    } else if (activeMode === "leaderboard") {
                      setLeaderboardData(presetData);
                    } else if (activeMode === "quote") {
                      setQuoteData(presetData);
                    }
                    showToast(`Loaded template: "${presetName}"`);
                  }}
                />

                {/* Form Inspector Chassis */}
                <div className="rounded-xl border border-white/8 bg-[#0f1118] p-4 sm:p-5 shadow-xl relative">
                  {activeMode === "song" && (
                    <GeneratorForm
                      title={songTitle}
                      songs={songs}
                      layout={songLayout}
                      onTitleChange={setSongTitle}
                      onSongsChange={setSongs}
                      onLayoutChange={setSongLayout}
                      onGenerate={() => handleGenerate()}
                      isGenerating={isGenerating}
                    />
                  )}

                  {activeMode === "profile" && (
                    <ProfileForm
                      data={profileData}
                      onChange={setProfileData}
                      onGenerate={() => handleGenerate()}
                      isGenerating={isGenerating}
                    />
                  )}

                  {activeMode === "leaderboard" && (
                    <LeaderboardForm
                      data={leaderboardData}
                      onChange={setLeaderboardData}
                      onGenerate={() => handleGenerate()}
                      isGenerating={isGenerating}
                    />
                  )}

                  {activeMode === "quote" && (
                    <QuoteForm
                      data={quoteData}
                      onChange={setQuoteData}
                      onGenerate={() => handleGenerate()}
                      isGenerating={isGenerating}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Stage Viewport */}
              <div className="min-w-0">
                {activeMode === "song" && (
                  <ImagePreview
                    title={songTitle}
                    songs={songs}
                    layout={songLayout}
                    onGenerate={() => handleGenerate()}
                    isGenerating={isGenerating}
                    lastGeneratedBlob={lastBlob}
                    particleConfig={songParticles}
                    onParticleConfigChange={setSongParticles}
                  />
                )}

                {activeMode === "profile" && (
                  <ProfilePreview
                    data={profileData}
                    onGenerate={() => handleGenerate()}
                    isGenerating={isGenerating}
                    lastGeneratedBlob={lastBlob}
                    particleConfig={profileParticles}
                    onParticleConfigChange={setProfileParticles}
                  />
                )}

                {activeMode === "leaderboard" && (
                  <LeaderboardPreview
                    data={leaderboardData}
                    onGenerate={() => handleGenerate()}
                    isGenerating={isGenerating}
                    lastGeneratedBlob={lastBlob}
                    particleConfig={leaderboardParticles}
                    onParticleConfigChange={setLeaderboardParticles}
                  />
                )}

                {activeMode === "quote" && (
                  <QuotePreview
                    data={quoteData}
                    onGenerate={() => handleGenerate()}
                    isGenerating={isGenerating}
                    lastGeneratedBlob={lastBlob}
                    particleConfig={quoteParticles}
                    onParticleConfigChange={setQuoteParticles}
                  />
                )}
              </div>
            </div>
          )}

          {/* Mode 5: Animation Studio */}
          {activeMode === "animated" && <AnimationTimeline />}
        </div>
      </main>

      {/* Docs / API Reference Modal */}
      <ApiDocumentationModal isOpen={showDocs} onClose={() => setShowDocs(false)} />

      {/* Architectural Studio Footer */}
      <footer className="mt-auto hairline-t bg-[#08090d] px-4 py-5 text-xs text-slate-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-['Syne',sans-serif] font-bold text-slate-300 tracking-wider">
              IMAGE STUDIO
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-[11px] text-slate-400">
              Zero-latency serverless Satori & Sharp Pipeline
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>Press 1-5 for quick navigation</span>
            <span>·</span>
            <span>Ctrl+Enter to Render</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
