import React from "react";
import { Card, Button, Progress } from "@nextui-org/react";
import { Image, FileText, Download, Play, X } from "lucide-react";
import { MediaContent } from "./types";

interface MediaPreviewProps {
  media: MediaContent;
  onDownload?: () => void;
  onRemove?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  onDownload,
  onRemove,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderMediaContent = () => {
    switch (media.type) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={media.url}
              alt={media.filename}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {!isUploading && (
                <Button
                  isIconOnly
                  variant="flat"
                  className="text-white bg-black/40"
                  onPress={onDownload}
                >
                  <Download size={18} />
                </Button>
              )}
            </div>
          </div>
        );

      case "video":
        return (
          <div className="relative group">
            <div className="w-full h-48 bg-black rounded-lg flex items-center justify-center">
              <Play size={40} className="text-white" />
            </div>
            {!isUploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  className="text-white bg-black/40"
                >
                  <Play size={18} />
                </Button>
                <Button
                  isIconOnly
                  variant="flat"
                  className="text-white bg-black/40"
                  onPress={onDownload}
                >
                  <Download size={18} />
                </Button>
              </div>
            )}
          </div>
        );

      case "document":
      case "audio":
        return (
          <Card className="p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{media.filename}</p>
                <p className="text-xs text-default-500">
                  {formatFileSize(media.size)}
                </p>
              </div>
              {!isUploading && (
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={onDownload}
                >
                  <Download size={18} className="text-default-500" />
                </Button>
              )}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {renderMediaContent()}
      {isUploading && (
        <>
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Progress value={uploadProgress} className="w-3/4" size="sm" />
          </div>
          {onRemove && (
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className="absolute top-2 right-2 bg-black/40 text-white"
              onPress={onRemove}
            >
              <X size={14} />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

interface MediaUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onUpload,
  accept = "image/*,video/*,.pdf,.doc,.docx",
  multiple = true,
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      await onUpload(files);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        id="media-upload"
        accept={accept}
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />
      <label
        htmlFor="media-upload"
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${
          uploading ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
      >
        {uploading ? (
          <div className="text-center space-y-2">
            <Progress value={progress} size="sm" color="primary" />
            <p className="text-sm text-default-500">Uploading... {progress}%</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Image size={24} className="text-primary" />
            </div>
            <p className="text-sm text-default-500">
              Click or drag files to upload
            </p>
          </div>
        )}
      </label>
    </div>
  );
};
