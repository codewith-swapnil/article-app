import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  className?: string;
}

export function ImageUpload({ onImageUploaded, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUploaded(data.url);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your featured image has been uploaded."
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-slate-300"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={uploading}
            className="absolute top-2 right-2 bg-white"
          >
            Change
          </Button>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 transition-colors"
        >
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <Upload className="h-8 w-8 text-slate-400 animate-pulse" />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-400" />
            )}
            <div className="text-sm text-slate-600">
              {uploading ? "Uploading..." : "Upload Featured Image"}
            </div>
            <div className="text-xs text-slate-500">
              PNG, JPG, GIF up to 5MB
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
