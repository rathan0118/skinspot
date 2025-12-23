import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (imageBase64: string) => void;
  isAnalyzing: boolean;
}

export function ImageUpload({ onImageSelect, isAnalyzing }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleAnalyze = () => {
    if (preview) {
      onImageSelect(preview);
    }
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "upload-zone p-12 text-center cursor-pointer group",
            isDragOver && "drag-over"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-display font-semibold text-foreground mb-1">
                  Upload skin image
                </p>
                <p className="text-muted-foreground text-sm">
                  Drag and drop or click to browse
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <ImageIcon className="w-4 h-4" />
                <span>JPG, PNG, WEBP up to 10MB</span>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 animate-scale-in">
          <div className="relative">
            <img
              src={preview}
              alt="Uploaded skin image"
              className="w-full h-auto max-h-96 object-contain rounded-xl"
            />
            <button
              onClick={clearImage}
              disabled={isAnalyzing}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 h-12 text-base font-medium"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Analyze Skin
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={clearImage}
              disabled={isAnalyzing}
              className="h-12"
              size="lg"
            >
              Change Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
