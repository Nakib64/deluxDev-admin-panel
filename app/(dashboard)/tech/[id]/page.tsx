"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import ImageUpload from "@/app/components/ui/image-upload";
import { techService } from "@/services/techService";
import { categoryService, Category } from "@/services/categoryService";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

interface TechFormValues {
    name: string;
    icon: string;
    category: string;
}

export default function TechFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const isNew = params.id === "new";
    const title = isNew ? "Create Tech Item" : "Edit Tech Item";
    const action = isNew ? "Create" : "Save changes";

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TechFormValues>({
        defaultValues: {
            name: "",
            icon: "",
            category: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const cats = await categoryService.getAll();
                setCategories(cats);

                if (!isNew && params.id) {
                    const data = await techService.getOne(params.id as string);
                    setValue("name", data.name);
                    setValue("icon", data.icon);
                    setValue("category", data.category);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, isNew, setValue]);

    const onSubmit = async (data: TechFormValues) => {
        try {
            setLoading(true);

            // 1. Upload icon if file selected
            let iconUrl = data.icon;
            if (iconFile) {
                toast.info("Uploading icon...");
                iconUrl = await uploadFile(iconFile, "tech");
            }

            if (!iconUrl) {
                toast.error("Please upload an icon");
                setLoading(false);
                return;
            }

            // 2. Prepare Payload
            const payload = {
                name: data.name,
                category: data.category,
                icon: iconUrl,
            };

            // 3. Submit
            if (isNew) {
                await techService.create(payload);
                toast.success("Tech item created");
            } else {
                await techService.update(params.id as string, payload);
                toast.success("Tech item updated");
            }
            router.push("/tech");
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
        <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/tech">
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
                <div className="space-y-2">
                    <label className="text-sm font-medium">Technology Name</label>
                    <Input disabled={loading} placeholder="e.g. React" {...register("name", { required: true })} />
                    {errors.name && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        {...register("category", { required: true })}
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Icon (PNG/SVG)</label>
                    <ImageUpload
                        value={watch("icon")}
                        onChange={(url) => setValue("icon", url as string)}
                        onRemove={() => {
                            setValue("icon", "");
                            setIconFile(null);
                        }}
                        onFilesChange={(files) => setIconFile(files[0])}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
}
