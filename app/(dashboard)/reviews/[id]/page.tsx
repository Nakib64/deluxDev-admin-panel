"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ImageUpload from "@/app/components/ui/image-upload";
import { uploadFile } from "@/lib/upload";
import { reviewService } from "@/services/reviewService";
import Link from "next/link";
import { Textarea } from "@/app/components/ui/textarea";

interface ReviewFormValues {
    author_name: string;
    country: string;
    rating: number;
    title_project: string;
    title_project_zh: string;
    review: string;
    review_zh: string;
    author_profile_image: string;
}

export default function ReviewFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Local File State
    const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);

    const isNew = params.id === "new";
    const title = isNew ? "Create Review" : "Edit Review";
    const action = isNew ? "Create" : "Save changes";

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewFormValues>({
        defaultValues: {
            author_name: "",
            country: "",
            rating: 5,
            title_project: "",
            title_project_zh: "",
            review: "",
            review_zh: "",
            author_profile_image: "",
        },
    });

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            reviewService.getOne(params.id as string)
                .then((data) => {
                    setValue("author_name", data.author_name);
                    setValue("country", data.country || "");
                    setValue("rating", data.rating);
                    setValue("title_project", data.title_project);
                    setValue("title_project_zh", data.title_project_zh || "");
                    setValue("review", data.review);
                    setValue("review_zh", data.review_zh || "");
                    setValue("author_profile_image", data.author_profile_image || "");
                })
                .catch(() => {
                    toast.error("Failed to load review");
                })
                .finally(() => setLoading(false));
        }
    }, [params.id, isNew, setValue]);

    const onSubmit = async (data: ReviewFormValues) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("author_name", data.author_name);
            formData.append("country", data.country);
            formData.append("rating", data.rating.toString());
            formData.append("title_project", data.title_project);
            formData.append("title_project_zh", data.title_project_zh);
            formData.append("review", data.review);
            formData.append("review_zh", data.review_zh);

            if (authorImageFile) {
                formData.append("author_profile_image", authorImageFile);
            }

            if (isNew) {
                await reviewService.create(formData);
                toast.success("Review created");
            } else {
                await reviewService.update(params.id as string, formData);
                toast.success("Review updated");
            }
            router.push("/reviews");
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
        <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/reviews">
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

            <div className="space-y-4 border p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Author Name</label>
                        <Input disabled={loading} placeholder="Name" {...register("author_name", { required: true })} />
                        {errors.author_name && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Input disabled={loading} placeholder="Country" {...register("country")} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Author Profile Image</label>
                    <ImageUpload
                        value={watch("author_profile_image")}
                        onChange={(url) => setValue("author_profile_image", url as string)}
                        onRemove={() => setValue("author_profile_image", "")}
                        onFilesChange={(files) => setAuthorImageFile(files[0])}
                        disabled={loading}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Title (English)</label>
                        <Input disabled={loading} placeholder="Project Title" {...register("title_project", { required: true })} />
                        {errors.title_project && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Title (Chinese)</label>
                        <Input disabled={loading} placeholder="项目名称" {...register("title_project_zh", { required: true })} />
                        {errors.title_project_zh && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input
                        type="number"
                        min={1}
                        max={5}
                        disabled={loading}
                        {...register("rating", { required: true, min: 1, max: 5 })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Review (English)</label>
                    <Textarea
                        rows={4}
                        disabled={loading}
                        placeholder="Review content..."
                        {...register("review", { required: true })}
                    />
                    {errors.review && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Review (Chinese)</label>
                    <Textarea
                        rows={4}
                        disabled={loading}
                        placeholder="评价内容..."
                        {...register("review_zh", { required: true })}
                    />
                    {errors.review_zh && <span className="text-red-500 text-xs">Required</span>}
                </div>

            </div>
        </div>
    );
}
