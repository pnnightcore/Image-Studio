import React, { useState, useMemo } from "react";
import {
  Package,
  X,
  Check,
  Copy,
  Download,
  Terminal,
  FileCode,
  FolderDown,
  Layers,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import {
  type StudioPattern,
  slugifyPatternId,
  generatePatternTypeScript,
  generatePatternJson,
  generatePatternSdkUsage,
  downloadPatternFile,
  savePatternWithNativePicker,
} from "../lib/pattern-export";

interface ExportSdkPatternModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPattern: Partial<StudioPattern>;
}

export function ExportSdkPatternModal({
  isOpen,
  onClose,
  initialPattern,
}: ExportSdkPatternModalProps) {
  const [patternId, setPatternId] = useState<string>(() =>
    slugifyPatternId(initialPattern.id || initialPattern.name || "custom-banner")
  );
  const [patternName, setPatternName] = useState<string>(
    initialPattern.name || initialPattern.canvas?.title || "Custom Banner"
  );
  const [description, setDescription] = useState<string>(
    initialPattern.description || "Reusable animation pattern for Image Studio SDK"
  );
  const [format, setFormat] = useState<"ts" | "json">("ts");
  const [activeTab, setActiveTab] = useState<"code" | "usage">("code");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportResult, setExportResult] = useState<{
    success: boolean;
    savedToFile?: boolean;
    filePath?: string;
    message: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedUsage, setCopiedUsage] = useState<boolean>(false);

  const safeId = useMemo(() => slugifyPatternId(patternId), [patternId]);

  const patternData: StudioPattern = useMemo(() => {
    return {
      id: safeId,
      name: patternName.trim() || safeId,
      description: description.trim(),
      duration: initialPattern.duration || 2000,
      fps: initialPattern.fps || 15,
      format: initialPattern.format || "gif",
      canvas: initialPattern.canvas || {
        title: patternName,
        width: 930,
        height: 280,
        background: "#090614",
        elements: [],
      },
      tracks: initialPattern.tracks || [],
      defaultVariables: initialPattern.defaultVariables || {},
      category: "custom",
    };
  }, [safeId, patternName, description, initialPattern]);

  const tsCode = useMemo(
    () => generatePatternTypeScript(patternData, { importSource: "image-studio" }),
    [patternData]
  );
  const jsonCode = useMemo(() => generatePatternJson(patternData), [patternData]);
  const currentCode = format === "json" ? jsonCode : tsCode;

  const sdkUsage = useMemo(
    () => generatePatternSdkUsage(patternData),
    [patternData]
  );

  if (!isOpen) return null;

  // Native Folder / File Picker (Modern File System API in Chrome, Edge, Brave, Opera)
  const handleSaveToLocalDisk = async () => {
    setIsExporting(true);
    setExportResult(null);
    try {
      const res = await savePatternWithNativePicker(patternData, format, "image-studio");
      if (res.canceled) {
        setIsExporting(false);
        return;
      }
      setExportResult({
        success: true,
        savedToFile: true,
        message:
          res.method === "native-picker"
            ? `✅ Đã lưu trực tiếp file ${safeId}.${format} vào thư mục dự án của bạn!`
            : `✅ Đã tải file ${safeId}.${format} về máy! Hãy di chuyển file vào thư mục dự án của bạn.`,
      });
    } catch (err: any) {
      setExportResult({
        success: false,
        message: err?.message || "Không thể lưu file. Vui lòng bấm nút 'Tải file' bên cạnh.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    downloadPatternFile(patternData, format, "image-studio");
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyUsage = async () => {
    await navigator.clipboard.writeText(sdkUsage);
    setCopiedUsage(true);
    setTimeout(() => setCopiedUsage(false), 2000);
  };

  const variableKeys = Object.keys(patternData.defaultVariables || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] rounded-2xl border border-purple-500/30 bg-[#0e0a1f] p-5 shadow-2xl space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Xuất Pattern về SDK
                </h3>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-500/30 font-semibold">
                  image-studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Xuất visual pattern timeline để sử dụng với hàm <code className="text-purple-300 font-mono">studio.animatePattern(...)</code> trong dự án của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Inputs: Pattern ID & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/40 p-3.5 rounded-xl border border-white/10">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Pattern ID (slug)
            </label>
            <div className="relative">
              <input
                type="text"
                value={patternId}
                onChange={(e) => setPatternId(e.target.value)}
                placeholder="lofi-chill-banner"
                className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-mono text-purple-200 outline-none focus:border-purple-500/80 transition"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] font-mono text-slate-500">
                .{format}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Định danh file: <code className="text-slate-300">{safeId}.{format}</code>
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Tên hiển thị & Định dạng xuất
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={patternName}
                onChange={(e) => setPatternName(e.target.value)}
                placeholder="Lo-Fi Chill Banner"
                className="flex-1 rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/80 transition"
              />
              <div className="flex items-center bg-black/60 rounded-lg border border-white/10 p-0.5">
                <button
                  type="button"
                  onClick={() => setFormat("ts")}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                    format === "ts" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  .TS
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("json")}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                    format === "json" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  .JSON
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Mô tả ngắn
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Card animation with smooth glow and floating particles"
              className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-500/80 transition"
            />
          </div>

          {/* Quick Specs Badges */}
          <div className="md:col-span-2 flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-[10px]">
            <span className="flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-slate-300 border border-white/10 font-mono">
              <Layers className="h-3 w-3 text-purple-400" />
              <span>{patternData.canvas.elements?.length || 0} Layers</span>
            </span>
            <span className="flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-slate-300 border border-white/10 font-mono">
              <SlidersHorizontal className="h-3 w-3 text-amber-400" />
              <span>{patternData.tracks?.length || 0} Tracks</span>
            </span>
            <span className="flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-slate-300 border border-white/10 font-mono">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>{patternData.duration}ms @ {patternData.fps}fps</span>
            </span>
            <span className="flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-slate-300 border border-white/10 font-mono">
              📐 {patternData.canvas.width}x{patternData.canvas.height}
            </span>
            {variableKeys.length > 0 && (
              <span className="flex items-center gap-1 rounded bg-purple-500/10 px-2 py-0.5 text-purple-300 border border-purple-500/25 font-mono">
                🧩 Biến: {variableKeys.map((k) => `{${k}}`).join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Export Feedback Banner */}
        {exportResult && (
          <div
            className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs animate-in fade-in ${
              exportResult.success
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/50 border-red-500/40 text-red-200"
            }`}
          >
            {exportResult.success ? (
              <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{exportResult.message}</p>
            </div>
          </div>
        )}

        {/* Code Preview Tabs */}
        <div className="relative flex-1 flex flex-col min-h-[200px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeTab === "code"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Mã nguồn Pattern (.{format})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("usage")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeTab === "usage"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Cách gọi SDK</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {activeTab === "code" ? (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md transition"
                >
                  {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCode ? "Đã chép code!" : "Chép code"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyUsage}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md transition"
                >
                  {copiedUsage ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUsage ? "Đã chép SDK!" : "Chép SDK"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative mt-2 flex-1 overflow-auto rounded-xl border border-white/10 bg-black/60 p-3 max-h-[240px]">
            <pre className="font-mono text-xs text-purple-200 select-text leading-relaxed whitespace-pre">
              {activeTab === "code" ? currentCode : sdkUsage}
            </pre>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
              title="Tải tệp về máy tính"
            >
              <Download className="h-3.5 w-3.5 text-sky-400" />
              <span>Tải .{format}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSaveToLocalDisk}
              disabled={isExporting}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 disabled:opacity-50 transition"
              title="Mở hộp thoại trình duyệt để chọn thư mục dự án trên máy bạn và lưu file thẳng vào đó"
            >
              {isExporting ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <FolderDown className="h-3.5 w-3.5" />
              )}
              <span>Lưu thẳng vào thư mục dự án</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
