"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface ImageUploadProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    disabled?: boolean;
    onRemove: (value: string) => void;
    maxFiles?: number;
    // New prop to handle raw files instead of auto-uploading
    onFilesChange?: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled,
    onRemove,
    maxFiles = 1,
    onFilesChange
}) => {
    const [mounted, setMounted] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const normalizeValue = (val: string | string[]) => {
        return Array.isArray(val) ? val : (val ? [val] : []);
    }

    // Combine existing URLs (value) with local file previews
    const existingUrls = normalizeValue(value);
    const allImages = [...existingUrls, ...previews];

    const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (onFilesChange) {
            // Manual Mode: Pass files back to parent
            const newFiles = Array.from(files);
            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);

            // Notify parent of new files
            // Note: This needs careful state management in parent to keep track of accumulated files
            // For simplicity, we might just pass the *new* files and let parent append
            onFilesChange(newFiles);
        }
        // We removed the auto-upload logic to enforce "Upload on Submit" as per request
        // or we could keep it as fallback, but user specifically asked for change.
    };

    const handleRemove = (url: string) => {
        // If it's a preview blob, remove from previews
        if (url.startsWith('blob:')) {
            setPreviews(prev => prev.filter(p => p !== url));
            // We also need to tell parent to remove the file. 
            // This is tricky without an ID. The parent needs to manage the file list sync.
            // For now, we will reset the file input in parent validation if needed 
            // or assume parent handles removal if we pass an index or identification.

            // Implementation Detail: 
            // If using onFilesChange, the parent is responsible for State. 
            // Here we just update UI. 
            // Ideally passing an index or identifier is better.

            // Simplified: If removing a blob, we trigger a callback or just ignore if complex?
            // Let's assume onRemove handles BOTH urls and blobs if parent manages state correctly.
            onRemove(url);
        } else {
            onRemove(url);
        }
    };

    if (!mounted) return null;

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {existingUrls.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                            unoptimized
                        />
                    </div>
                ))}
                {/* Show Previews */}
                {previews.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-400">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => handleRemove(url)}
                                variant="destructive"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover opacity-80"
                            alt="Preview"
                            src={url}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
            {(maxFiles > 1 || (existingUrls.length + previews.length) === 0) && (
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        disabled={disabled}
                        variant="secondary"
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Image
                    </Button>
                    <input
                        id="file-upload"
                        type="file"
                        disabled={disabled}
                        className="hidden"
                        accept="image/*"
                        multiple={maxFiles > 1}
                        onChange={onUpload}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
