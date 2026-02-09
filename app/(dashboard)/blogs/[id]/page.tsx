"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { uploadFile } from "@/lib/upload";
import { blogService } from "@/services/blogService";
import Link from "next/link";
import { BlogFormValues } from "@/app/components/blogs/types";
import BlogDetails from "@/app/components/blogs/BlogDetails";
import BlogMedia from "@/app/components/blogs/BlogMedia";
import BlogDescription from "@/app/components/blogs/BlogDescription";

export default function BlogFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Local File State
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [lottieFile, setLottieFile] = useState<File | null>(null);

    const isNew = params.id === "new";
    const pageTitle = isNew ? "Create Blog" : "Edit Blog";
    const action = isNew ? "Create" : "Save changes";

    const methods = useForm<BlogFormValues>({
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

    const { setValue, handleSubmit } = methods;

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            blogService.getOne(params.id as string)
                .then((data) => {
                    setValue("title", data.title?.en || "");
                    setValue("title_zh", data.title?.zh || "");
                    setValue("title_animation", data.title_animation || "");
                    setValue("cover_image", data.cover_image || "");
                    setValue("slug", data.slug || "");
                    setValue("author_name", data.author || "");

                    if (data.description?.en) {
                        setValue("description", data.description.en);
                    }
                    if (data.description?.zh) {
                        setValue("description_zh", data.description.zh);
                    }
                })
                .catch((err) => {
                    console.error(err);
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

            // 2. Upload Lottie if changed
            let animationUrl = data.title_animation;
            if (lottieFile) {
                toast.info("Uploading Lottie JSON...");
                animationUrl = await uploadFile(lottieFile, "lottie");
            }

            // 3. Prepare Payload
            const payload = {
                title: {
                    en: data.title,
                    zh: data.title_zh
                },
                slug: data.slug,
                cover_image: coverImageUrl,
                title_animation: animationUrl,
                author: data.author_name,
                description: {
                    en: data.description,
                    zh: data.description_zh
                }
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

    return (
        <FormProvider {...methods}>
            <div className="space-y-4 max-w-5xl mx-auto pb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/blogs">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
                    </div>
                    <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
                        <Save className="mr-2 h-4 w-4" />
                        {action}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BlogDetails
                        loading={loading}
                        lottieFile={lottieFile}
                        setLottieFile={setLottieFile}
                    />

                    <BlogMedia
                        loading={loading}
                        setCoverImageFile={setCoverImageFile}
                    />

                    <BlogDescription
                        loading={loading}
                        name="description"
                        label="Description (English)"
                    />

                    <BlogDescription
                        loading={loading}
                        name="description_zh"
                        label="Description (Chinese)"
                    />
                </div>
            </div>
        </FormProvider>
    );
}
