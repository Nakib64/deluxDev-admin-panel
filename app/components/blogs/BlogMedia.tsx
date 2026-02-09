"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import ImageUpload from "@/app/components/ui/image-upload";
import { BlogFormValues } from "./types";

interface BlogMediaProps {
    loading: boolean;
    setCoverImageFile: (file: File | null) => void;
}

export default function BlogMedia({
    loading,
    setCoverImageFile
}: BlogMediaProps) {
    const { register, watch, setValue, formState: { errors } } = useFormContext<BlogFormValues>();

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-lg">Author & Media</h3>
            <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUpload
                    value={watch("cover_image")}
                    onChange={(url) => setValue("cover_image", url as string)}
                    onRemove={() => setValue("cover_image", "")}
                    onFilesChange={(files) => setCoverImageFile(files[0])}
                    disabled={loading}
                />
                {/* Add hidden input for required validation if needed, or rely on manual check in submit */}
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Author Name</label>
                <Input disabled={loading} placeholder="Name" {...register("author_name", { required: true })} />
                {errors.author_name && <span className="text-red-500 text-xs">Required</span>}
            </div>
        </div>
    );
}
