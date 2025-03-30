"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

const ImageUpload = ({ value, onChange, className = "" }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploads the image file to Cloudinary and returns the secure URL.
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }
    return data.secure_url;
  };

  const handleFileChange = async (file: File | null) => {
    if (file) {
      try {
        setIsUploading(true);
        // Upload the image to Cloudinary
        const uploadedUrl = await uploadImageToCloudinary(file);
        setPreview(uploadedUrl);
        onChange(uploadedUrl);
      } catch (error: any) {
        console.error("Upload error:", error.message);
      } finally {
        setIsUploading(false);
      }
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    await handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    await handleFileChange(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="sr-only"
        aria-label="Upload profile photo"
      />

      <div
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed 
          rounded-lg cursor-pointer transition-all duration-200 overflow-hidden
          ${isDragging ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 hover:bg-secondary"}
        `}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleButtonClick}
                  className="bg-white/90 hover:bg-white text-foreground"
                >
                  Change Photo
                </Button>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-foreground shadow-sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-16 h-16 mb-3 rounded-full bg-secondary flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-2 text-sm font-medium">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG or GIF (Max 2MB)
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleButtonClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              {isUploading && (
                <p className="mt-2 text-xs text-muted-foreground">Uploading...</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageUpload;
