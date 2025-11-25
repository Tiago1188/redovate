"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImageIcon, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface HeroImageUploaderProps {
  imageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  isUploading: boolean;
  maxImages: number;
}

export function HeroImageUploader({
  imageUrl,
  onUpload,
  onRemove,
  isUploading,
  maxImages,
}: HeroImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onUpload(file);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Hero Image</Label>
        <Badge variant="secondary">
          Max images: {maxImages >= 999 ? "Unlimited" : maxImages}
        </Badge>
      </div>

      <div className="rounded-lg border border-dashed p-4 text-center">
        {imageUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto h-56 w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt="Hero preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Replace Image"}
              </Button>
              <Button type="button" variant="ghost" onClick={onRemove}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a high-quality image (PNG, JPG, WebP).
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

