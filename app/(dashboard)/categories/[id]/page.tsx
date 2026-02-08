"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { categoryService } from "@/services/categoryService";
import Link from "next/link";

interface CategoryFormValues {
    name: string;
}

export default function CategoryFormPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isNew = params.id === "new";
    const title = isNew ? "Create Category" : "Edit Category";
    const action = isNew ? "Create" : "Save changes";

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (!isNew && params.id) {
            setLoading(true);
            categoryService.getOne(params.id as string)
                .then((data) => {
                    setValue("name", data.name);
                })
                .catch(() => {
                    toast.error("Failed to load category");
                })
                .finally(() => setLoading(false));
        }
    }, [params.id, isNew, setValue]);

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if (isNew) {
                await categoryService.create(data);
                toast.success("Category created");
            } else {
                await categoryService.update(params.id as string, data);
                toast.success("Category updated");
            }
            router.push("/categories");
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
                    <Link href="/categories">
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
                    <label className="text-sm font-medium">Category Name</label>
                    <Input disabled={loading} placeholder="e.g. Frontend" {...register("name", { required: true })} />
                    {errors.name && <span className="text-red-500 text-xs">Required</span>}
                </div>
            </div>
        </div>
    );
}
