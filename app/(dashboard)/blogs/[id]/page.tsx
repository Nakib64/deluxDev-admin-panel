"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash, Plus, Save, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ImageUpload from "@/app/components/ui/image-upload";
import { uploadFile } from "@/lib/upload";
import { blogService } from "@/services/blogService";
import Link from "next/link";
import { Textarea } from "@/app/components/ui/textarea";

interface BlogFormValues {
    title: string;
    title_zh: string;
    title_animation: string;
    cover_image: string;
    description: { key: string; value: string }[];
    description_zh: { key: string; value: string }[];
    author_name: string;
    author_profile_image: string;
    slug: string;
}

export default function BlogFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Local File State
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);

    const isNew = params.id === "new";
    const title = isNew ? "Create Blog" : "Edit Blog";
    const action = isNew ? "Create" : "Save changes";

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormValues>({
        defaultValues: {
            title: "",
            title_zh: "",
            title_animation: "",
            cover_image: "",
            description: [],
            description_zh: [],
            author_name: "",
            author_profile_image: "",
            slug: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "description",
    });

    const { fields: fieldsZh, append: appendZh, remove: removeZh } = useFieldArray({
        control,
        name: "description_zh",
    });

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            blogService.getOne(params.id as string)
                .then((data) => {
                    setValue("title", data.title);
                    setValue("title_zh", data.title_zh || "");
                    setValue("title_animation", data.title_animation ? JSON.stringify(data.title_animation, null, 2) : "");
                    setValue("cover_image", data.cover_image);
                    setValue("slug", data.slug);
                    setValue("author_name", data.author_details?.name || "");
                    setValue("author_profile_image", data.author_details?.profile_image || "");

                    if (data.description) {
                        const desc = Object.entries(data.description).map(([key, value]) => ({
                            key,
                            value: value as string,
                        }));
                        setValue("description", desc);
                    }
                    if (data.description_zh) {
                        const descZh = Object.entries(data.description_zh).map(([key, value]) => ({
                            key,
                            value: value as string,
                        }));
                        setValue("description_zh", descZh);
                    }
                })
                .catch(() => {
                    toast.error("Failed to load blog");
                })
                .finally(() => setLoading(false));
        }
    }, [params.id, isNew, setValue]);

    const onSubmit = async (data: BlogFormValues) => {
        try {
            setLoading(true);

            // 1. Upload Images
            let coverImageUrl = data.cover_image;
            if (coverImageFile) {
                toast.info("Uploading cover image...");
                coverImageUrl = await uploadFile(coverImageFile);
            }

            let authorImageUrl = data.author_profile_image;
            if (authorImageFile) {
                toast.info("Uploading author profile image...");
                authorImageUrl = await uploadFile(authorImageFile);
            }

            // 2. Prepare Description Maps
            const descriptionMap: Record<string, string> = {};
            data.description.forEach((t) => {
                if (t.key) descriptionMap[t.key] = t.value;
            });

            const descriptionZhMap: Record<string, string> = {};
            data.description_zh.forEach((t) => {
                if (t.key) descriptionZhMap[t.key] = t.value;
            });

            // 3. Prepare Payload
            const payload = {
                title: data.title,
                title_zh: data.title_zh,
                slug: data.slug,
                cover_image: coverImageUrl,
                description: descriptionMap,
                description_zh: descriptionZhMap,
                author_details: {
                    name: data.author_name,
                    profile_image: authorImageUrl,
                },
                title_animation: data.title_animation ? JSON.parse(data.title_animation) : {},
            };

            // 4. Submit
            if (isNew) {
                await blogService.create(payload);
                toast.success("Blog created");
            } else {
                await blogService.update(params.id as string, payload);
                toast.success("Blog updated");
            }
            router.push("/blogs");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isNew) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/blogs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                </div>
                <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
                    <Save className="mr-2 h-4 w-4" />
                    {action}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

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
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {watch("title_animation") && watch("title_animation") !== "{}" ? "Change JSON" : "Upload JSON"}
                            </Button>
                            <input
                                id="lottie-upload"
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const result = event.target?.result as string;
                                            try {
                                                JSON.parse(result); // Validate JSON
                                                setValue("title_animation", result);
                                                toast.success("Lottie JSON loaded");
                                            } catch (err) {
                                                toast.error("Invalid JSON file");
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                            />
                            <span className="text-sm text-muted-foreground">
                                {watch("title_animation") && watch("title_animation") !== "{}"
                                    ? "Animation data loaded"
                                    : "No animation selected"}
                            </span>
                        </div>
                        {/* Hidden Textarea for debug or form submission requirement if needed, but setValue handles it */}
                    </div>
                </div>

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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Author Name</label>
                            <Input disabled={loading} placeholder="Name" {...register("author_name", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Author Profile Image</label>
                            <ImageUpload
                                value={watch("author_profile_image")}
                                onChange={(url) => setValue("author_profile_image", url as string)}
                                onFilesChange={(files) => setAuthorImageFile(files[0])}
                                onRemove={() => setValue("author_profile_image", "")}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Description Map */}
                <div className="space-y-4 border p-4 rounded-md col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Description (English Topics/Sections)</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ key: "", value: "" })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Section
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-start">
                                <div className="w-1/4">
                                    <Input
                                        disabled={loading}
                                        placeholder="Topic/Key (e.g. intro)"
                                        {...register(`description.${index}.key` as const, { required: true })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        rows={3}
                                        disabled={loading}
                                        placeholder="Content..."
                                        {...register(`description.${index}.value` as const, { required: true })}
                                    />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 border p-4 rounded-md col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Description (Chinese Topics/Sections)</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendZh({ key: "", value: "" })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Section
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {fieldsZh.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-start">
                                <div className="w-1/4">
                                    <Input
                                        disabled={loading}
                                        placeholder="Topic/Key"
                                        {...register(`description_zh.${index}.key` as const, { required: true })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        rows={3}
                                        disabled={loading}
                                        placeholder="中文内容..."
                                        {...register(`description_zh.${index}.value` as const, { required: true })}
                                    />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeZh(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
