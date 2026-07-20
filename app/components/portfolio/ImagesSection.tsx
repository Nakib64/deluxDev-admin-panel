"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Trash, Plus } from "lucide-react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { uploadFile } from "@/lib/upload";
import { toast } from "sonner";

interface ImagesSectionProps {
    loading: boolean;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
}

interface LayoutGroup {
    layout: "full" | "grid-2" | "grid-3" | "grid-4" | "flex";
    urls: string[];
}

export const ImagesSection: React.FC<ImagesSectionProps> = ({
    loading,
    setValue,
    watch
}) => {
    const titleImage = watch("title_image");
    const groups: LayoutGroup[] = watch("images") || [];

    const [uploadingTitle, setUploadingTitle] = useState(false);
    // Track loading index for each layout group's file uploads
    const [uploadingGroupIndex, setUploadingGroupIndex] = useState<number | null>(null);

    // Handle Title Image Upload
    const handleTitleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        try {
            setUploadingTitle(true);
            toast.info("Uploading cover image...");
            const url = await uploadFile(files[0], "portfolios");
            setValue("title_image", url);
            toast.success("Cover image uploaded");
        } catch (error) {
            console.error("Cover image upload failed:", error);
            toast.error("Cover image upload failed");
        } finally {
            setUploadingTitle(false);
        }
    };

    // Add a new Layout Group row
    const addLayoutGroup = () => {
        const updated = [...groups, { layout: "full", urls: [] }];
        setValue("images", updated);
        toast.success("Added new layout group row");
    };

    // Remove an entire Layout Group row
    const removeLayoutGroup = (groupIndex: number) => {
        const updated = groups.filter((_, i) => i !== groupIndex);
        setValue("images", updated);
        toast.info("Removed layout group row");
    };

    // Update Layout for a specific group
    const updateGroupLayout = (groupIndex: number, layout: LayoutGroup["layout"]) => {
        const updated = [...groups];
        updated[groupIndex] = { ...updated[groupIndex], layout };
        setValue("images", updated);
    };

    // Handle upload files into a specific Layout Group
    const handleGroupImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>, groupIndex: number) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingGroupIndex(groupIndex);
            toast.info(`Uploading ${files.length} images to group...`);
            
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const url = await uploadFile(files[i], "portfolios");
                uploadedUrls.push(url);
            }

            const updated = [...groups];
            updated[groupIndex] = {
                ...updated[groupIndex],
                urls: [...(updated[groupIndex].urls || []), ...uploadedUrls]
            };
            
            setValue("images", updated);
            toast.success("Images uploaded to group");
        } catch (error) {
            console.error("Failed uploading images to group:", error);
            toast.error("Failed to upload group images");
        } finally {
            setUploadingGroupIndex(null);
        }
    };

    // Remove single image from a specific group
    const removeGroupImage = (groupIndex: number, imgIndex: number) => {
        const updated = [...groups];
        updated[groupIndex] = {
            ...updated[groupIndex],
            urls: updated[groupIndex].urls.filter((_, i) => i !== imgIndex)
        };
        setValue("images", updated);
    };

    return (
        <div className="space-y-6 border p-6 rounded-lg bg-white shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
            <div>
                <h3 className="font-semibold text-lg">Images & Layout Settings</h3>
                <p className="text-sm text-zinc-500">Configure cover image and build customized multi-image layouts for details gallery.</p>
            </div>

            {/* Title Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium block text-zinc-700 dark:text-zinc-300">Title Image (Cover)</label>
                
                {titleImage ? (
                    <div className="relative w-[300px] h-[200px] rounded-lg overflow-hidden border bg-zinc-50 dark:border-zinc-800 group">
                        <Image
                            fill
                            src={titleImage}
                            alt="Cover Image"
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => setValue("title_image", "")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <label className="flex flex-col items-center justify-center w-[300px] h-[200px] rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            {uploadingTitle ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                                    <span className="text-xs text-zinc-500">Uploading cover...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-zinc-400" />
                                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Click to upload cover</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={loading || uploadingTitle}
                                onChange={handleTitleImageChange}
                            />
                        </label>
                    </div>
                )}
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Layout Groups Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Details Page Image Groups</label>
                        <p className="text-xs text-zinc-400">Add rows and pick grid styles (e.g. 4 screenshots in a 4-Column box).</p>
                    </div>
                    <Button
                        type="button"
                        onClick={addLayoutGroup}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Layout Group
                    </Button>
                </div>

                {groups.length > 0 ? (
                    <div className="space-y-6">
                        {groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="border rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 dark:border-zinc-800">
                                    <div className="flex items-center gap-4 flex-1 min-w-[240px]">
                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Row #{groupIndex + 1}</span>
                                        
                                        {/* Layout selector dropdown */}
                                        <select
                                            value={group.layout || "full"}
                                            onChange={(e) => updateGroupLayout(groupIndex, e.target.value as any)}
                                            className="text-xs p-2 border rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white max-w-[200px]"
                                        >
                                            <option value="full">Full Width (1 Columns)</option>
                                            <option value="grid-2">2-Column Grid</option>
                                            <option value="grid-3">3-Column Grid</option>
                                            <option value="grid-4">4-Column Grid</option>
                                            <option value="flex">Flex Row (Auto-wrap)</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {/* Upload into group button */}
                                        <label className="cursor-pointer">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                disabled={loading || uploadingGroupIndex !== null}
                                                onClick={() => document.getElementById(`group-upload-input-${groupIndex}`)?.click()}
                                            >
                                                {uploadingGroupIndex === groupIndex ? (
                                                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                                ) : (
                                                    <Upload className="h-3 w-3 mr-2" />
                                                )}
                                                Upload Images
                                            </Button>
                                            <input
                                                id={`group-upload-input-${groupIndex}`}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                disabled={loading || uploadingGroupIndex !== null}
                                                onChange={(e) => handleGroupImagesUpload(e, groupIndex)}
                                            />
                                        </label>

                                        {/* Remove row button */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            onClick={() => removeLayoutGroup(groupIndex)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Images within the group */}
                                {group.urls && group.urls.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                        {group.urls.map((url, imgIndex) => (
                                            <div key={imgIndex} className="relative aspect-video border rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 group/img">
                                                <Image
                                                    fill
                                                    src={url}
                                                    alt={`Image ${imgIndex + 1}`}
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => removeGroupImage(groupIndex, imgIndex)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 border border-dashed rounded-lg text-xs text-zinc-400 dark:border-zinc-800">
                                        This group is empty. Click &quot;Upload Images&quot; to add photos.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-xl text-zinc-500 dark:border-zinc-800">
                        No image layout groups defined. Click &quot;Add Layout Group&quot; to build details page gallery layouts.
                    </div>
                )}
            </div>
        </div>
    );
};
