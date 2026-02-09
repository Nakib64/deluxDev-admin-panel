"use client";

import { useFormContext } from "react-hook-form";
import { Upload, FileJson } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { BlogFormValues } from "./types";
import { toast } from "sonner";

interface BlogDetailsProps {
    loading: boolean;
    lottieFile: File | null;
    setLottieFile: (file: File | null) => void;
}

export default function BlogDetails({
    loading,
    lottieFile,
    setLottieFile
}: BlogDetailsProps) {
    const { register, watch, formState: { errors }, setValue } = useFormContext<BlogFormValues>();

    const handleLottieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/json") {
                toast.error("Please select a JSON file");
                return;
            }
            // Preview name or rudimentary validation
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    JSON.parse(event.target?.result as string);
                    setLottieFile(file);
                } catch (err) {
                    toast.error("Invalid JSON content");
                    setLottieFile(null);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-lg">Details</h3>
            <div className="space-y-2">
                <label className="text-sm font-medium">Title (English)</label>
                <Input disabled={loading} placeholder="Blog Title" {...register("title", { required: true })} />
                {errors.title && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Title (Chinese)</label>
                <Input disabled={loading} placeholder="博客标题" {...register("title_zh", { required: true })} />
                {errors.title_zh && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input disabled={loading} placeholder="blog-slug" {...register("slug", { required: true })} />
                {errors.slug && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Title Animation (Lottie JSON)</label>
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById("lottie-upload")?.click()}
                        disabled={loading}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {lottieFile ? "Change File" : (watch("title_animation") ? "Change Animation" : "Upload JSON")}
                    </Button>
                    <input
                        id="lottie-upload"
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={handleLottieChange}
                    />
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                        {lottieFile ? (
                            <><FileJson className="h-4 w-4" /> {lottieFile.name}</>
                        ) : watch("title_animation") ? (
                            <span className="text-green-600">Active URL: ...{watch("title_animation").slice(-20)}</span>
                        ) : "No animation selected"}
                    </span>
                </div>
            </div>
        </div>
    );
}
