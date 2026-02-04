"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash, Plus, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ImageUpload from "@/app/components/ui/image-upload";
import { blogService } from "@/services/blogService";
import Link from "next/link";
import { Textarea } from "@/app/components/ui/textarea"; // Need this or separate file, I'll use standard textarea or create component


interface BlogFormValues {
    title: string;
    title_animation: string; // JSON string for edit convenience
    cover_image: string;
    description: { key: string; value: string }[];
    author_name: string;
    author_profile_image: string;
    slug: string;
}

export default function BlogFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const isNew = params.id === "new";
    const title = isNew ? "Create Blog" : "Edit Blog";
    const action = isNew ? "Create" : "Save changes";

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<BlogFormValues>({
        defaultValues: {
            title: "",
            title_animation: "{}",
            cover_image: "",
            description: [],
            author_name: "",
            author_profile_image: "",
            slug: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "description",
    });

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            blogService.getOne(params.id as string)
                .then((data) => {
                    setValue("title", data.title);
                    setValue("title_animation", JSON.stringify(data.title_animation, null, 2));
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

            let parsedAnimation = {};
            try {
                parsedAnimation = JSON.parse(data.title_animation);
            } catch (e) {
                toast.error("Invalid JSON for Title Animation");
                setLoading(false);
                return;
            }

            const descriptionMap: Record<string, string> = {};
            data.description.forEach((t) => {
                if (t.key) descriptionMap[t.key] = t.value;
            });

            const payload = {
                title: data.title,
                slug: data.slug,
                cover_image: data.cover_image,
                title_animation: parsedAnimation,
                description: descriptionMap,
                author_details: {
                    name: data.author_name,
                    profile_image: data.author_profile_image,
                }
            };

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
                        <label className="text-sm font-medium">Title</label>
                        <Input disabled={loading} placeholder="Blog Title" {...register("title", { required: true })} />
                        {errors.title && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug</label>
                        <Input disabled={loading} placeholder="blog-slug" {...register("slug", { required: true })} />
                        {errors.slug && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title Animation (Lottie JSON)</label>
                        <Textarea
                            rows={5}
                            disabled={loading}
                            placeholder="{ ... }"
                            {...register("title_animation", { required: true })}
                        />
                        {errors.title_animation && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                </div>

                <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold text-lg">Author & Media</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Image</label>
                        <ImageUpload
                            value={control._formValues.cover_image}
                            onChange={(url) => setValue("cover_image", url as string)}
                            onRemove={() => setValue("cover_image", "")}
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
                                value={control._formValues.author_profile_image}
                                onChange={(url) => setValue("author_profile_image", url as string)}
                                onRemove={() => setValue("author_profile_image", "")}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Description Map */}
                <div className="space-y-4 border p-4 rounded-md col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Description (Topics/Sections)</h3>
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
                                        placeholder="Topic/Key (e.g. en, intro)"
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

            </div>
        </div>
    );
}
