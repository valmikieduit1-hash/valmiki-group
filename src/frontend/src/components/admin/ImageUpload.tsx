import { loadConfig } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { CloudUpload, Loader2, Trash2, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  // Local preview state — updated immediately after upload before parent re-renders
  const [localPreview, setLocalPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const fileInputId = `image-upload-file-${id}`;
  const urlInputId = `image-upload-url-${id}`;

  // The displayed image: local preview takes priority (freshly uploaded),
  // then fall back to the value prop (persisted URL from parent state)
  const displayUrl = localPreview || value;
  const hasImage = Boolean(displayUrl);

  const handleFile = async (file: File) => {
    setUploading(true);
    setErrorMsg("");

    // Instant local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      // loadConfig() reads platform-injected values at runtime — do NOT
      // pre-validate config fields; the platform fills them in at deploy time
      const config = await loadConfig();

      const host =
        config.backend_host && config.backend_host !== "undefined"
          ? config.backend_host
          : "https://icp-api.io";

      const storageGateway =
        config.storage_gateway_url && config.storage_gateway_url !== "undefined"
          ? config.storage_gateway_url
          : "https://blob.caffeine.ai";

      const canisterId =
        config.backend_canister_id && config.backend_canister_id !== "undefined"
          ? config.backend_canister_id
          : "";

      const projectId =
        config.project_id && config.project_id !== "undefined"
          ? config.project_id
          : "";

      const bucketName = projectId ?? "";

      const agent = HttpAgent.createSync({ host });

      const storageClient = new StorageClient(
        bucketName,
        storageGateway,
        canisterId,
        projectId,
        agent,
      );

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const { hash } = await storageClient.putFile(bytes);
      const uploadedUrl = await storageClient.getDirectURL(hash);

      URL.revokeObjectURL(objectUrl);
      setLocalPreview(uploadedUrl);
      onChange(uploadedUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[ImageUpload] error:", msg);
      setErrorMsg(`Upload failed: ${msg}`);
      URL.revokeObjectURL(objectUrl);
      setLocalPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handlePasteUrl = () => {
    if (urlInput.trim()) {
      const url = urlInput.trim();
      setLocalPreview(url);
      setErrorMsg("");
      onChange(url);
      setUrlInput("");
    }
  };

  const handleDelete = () => {
    setLocalPreview("");
    setErrorMsg("");
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={fileInputId}
          className="block text-sm font-semibold text-foreground"
        >
          {label}
        </label>
      )}

      {/* Preview */}
      {hasImage ? (
        <div className="relative min-h-[180px] w-full overflow-hidden rounded-xl border border-border shadow-sm">
          <img
            src={displayUrl}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-2 text-white">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="text-xs font-medium">Uploading…</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-6 text-center transition-colors hover:border-[#FF8A00]/50 hover:bg-muted/30"
          onClick={() => fileRef.current?.click()}
          aria-label="Click to upload an image"
        >
          {uploading ? (
            <>
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
              <p className="mt-3 text-sm font-medium text-foreground">
                Uploading…
              </p>
            </>
          ) : (
            <>
              <CloudUpload className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </>
          )}
        </button>
      )}

      {/* Inline error message */}
      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action buttons — Upload + Delete always visible */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg border border-[#FF8A00]/40 bg-[#FF8A00]/10 px-3 py-2 text-sm font-medium text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/20 disabled:opacity-50"
          data-ocid="image_upload.upload_button"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload Image"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={uploading || !hasImage}
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Delete image"
          data-ocid="image_upload.delete_button"
        >
          <Trash2 className="h-4 w-4" />
          Delete Image
        </button>
      </div>

      <input
        ref={fileRef}
        id={fileInputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {/* URL paste */}
      <div className="flex gap-2">
        <input
          id={urlInputId}
          type="url"
          placeholder="Or paste image URL…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePasteUrl()}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF8A00]/50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/20"
          data-ocid="image_upload.input"
          aria-label="Image URL"
        />
        <button
          type="button"
          onClick={handlePasteUrl}
          disabled={!urlInput.trim()}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          Use URL
        </button>
      </div>
    </div>
  );
}
