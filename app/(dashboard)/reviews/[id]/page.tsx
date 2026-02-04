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
    review: string;
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
            review: "",
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
                    setValue("review", data.review);
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

            let authorImageUrl = data.author_profile_image;
            if (authorImageFile) {
                toast.info("Uploading author image...");
                authorImageUrl = await uploadFile(authorImageFile);
            }

            const payload = {
                ...data,
                author_profile_image: authorImageUrl,
            };

            if (isNew) {
                await reviewService.create(payload);
                toast.success("Review created");
            } else {
                await reviewService.update(params.id as string, payload);
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

                <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title</label>
                    <Input disabled={loading} placeholder="Project Title" {...register("title_project", { required: true })} />
                    {errors.title_project && <span className="text-red-500 text-xs">Required</span>}
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
                    <label className="text-sm font-medium">Review</label>
                    <Textarea
                        rows={4}
                        disabled={loading}
                        placeholder="Review content..."
                        {...register("review", { required: true })}
                    />
                    {errors.review && <span className="text-red-500 text-xs">Required</span>}
                </div>

            </div>
        </div>
    );
}
