"use client";

import { useState, useRef } from "react";
import { Button } from "./Button";

interface DocumentUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
}

export function DocumentUpload({
  onUploadComplete,
  folder = "documents",
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Only images and PDFs are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File must be less than 10MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "argent-documents",
      );
      if (folder) formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setPreview(data.secure_url);
      onUploadComplete(data.secure_url);
    } catch (err) {
      setError("Failed to upload document");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <a
          href={preview}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 truncate max-w-xs"
        >
          View Document
        </a>
        <button
          type="button"
          onClick={handleRemove}
          className="text-zinc-400 hover:text-red-600 text-sm"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Document"}
      </Button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-zinc-500">Images and PDFs up to 10MB</p>
    </div>
  );
}
