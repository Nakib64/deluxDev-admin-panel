"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "./button";

interface ImageUploadProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    disabled?: boolean;
    onRemove: (value: string) => void;
    maxFiles?: number; // 1 for single image, >1 for array
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled,
    onRemove,
    maxFiles = 1,
}) => {
    const [loading, setLoading] = useState(false);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file); // Assuming backend expects 'image'

        try {
            setLoading(true);
            const response = await api.post("/cloudinary", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Assuming backend returns { url: "..." } or similar
            // Adjust based on actual response structure. 
            // Common pattern: response.data.url or response.data.secure_url from Cloudinary
            // Let's assume response.data.url for now based on typical custom wrappers
            const url = response.data.url || response.data.secure_url || response.data;

            if (!url) {
                throw new Error("No URL returned from server");
            }

            if (maxFiles > 1) {
                // Append to array
                const current = Array.isArray(value) ? value : [];
                onChange([...current, url]);
            } else {
                // Single value
                onChange(url);
            }

            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Something went wrong with the upload.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to normalize value to array for display
    const images = Array.isArray(value) ? value : (value ? [value] : []);

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {images.map((url) => (
                    <div
                        key={url}
                        className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
                    >
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
                            unoptimized // If external generic link
                        />
                    </div>
                ))}
            </div>
            {(maxFiles > 1 || images.length === 0) && (
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        disabled={disabled || loading}
                        variant="secondary"
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload an Image
                    </Button>
                    <input
                        id="file-upload"
                        type="file"
                        disabled={disabled || loading}
                        className="hidden"
                        accept="image/*"
                        onChange={onUpload}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
